/**
 * Endpoints da API para o módulo Health-Hooks do WiltonOS.
 * Fornece rotas para gerenciar e consultar eventos de saúde e medicamentos.
 */

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';

const router = express.Router();

/**
 * Executa um comando wiltonctl health e retorna o resultado como JSON
 * @param {string[]} args - Argumentos para o comando wiltonctl
 * @returns {Promise<object>} - Resultado do comando como objeto JSON
 */
async function executeHealthCommand(args) {
  return new Promise((resolve, reject) => {
    const wiltonctlPath = path.resolve('./wilton_core/cli/wiltonctl.py');
    const command = spawn('python', [wiltonctlPath, 'health', ...args, '--json']);
    
    let stdout = '';
    let stderr = '';
    
    command.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    command.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    command.on('close', (code) => {
      if (code !== 0) {
        console.error(`Erro ao executar wiltonctl health: ${stderr}`);
        reject(new Error(`Erro ao executar comando (código ${code}): ${stderr}`));
        return;
      }
      
      try {
        // Tenta fazer parse do resultado como JSON
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (error) {
        console.error('Erro ao parsear resultado JSON:', error);
        reject(new Error(`Erro ao parsear JSON: ${error.message}. Saída: ${stdout}`));
      }
    });
  });
}

/**
 * @route GET /api/health-hooks/events
 * @description Obtém eventos de saúde com filtros opcionais
 */
router.get('/events', async (req, res) => {
  try {
    const { type, name, last, limit } = req.query;
    const args = ['list'];
    
    if (type) args.push('--type', type);
    if (name) args.push('--name', name);
    if (last) args.push('--last', last);
    if (limit) args.push('--limit', limit);
    
    const events = await executeHealthCommand(args);
    res.json(events);
  } catch (error) {
    console.error('Erro ao obter eventos de saúde:', error);
    res.status(500).json({ error: 'Erro ao obter eventos de saúde', details: error.message });
  }
});

/**
 * @route GET /api/health-hooks/summary
 * @description Obtém um resumo dos eventos de saúde recentes
 */
router.get('/summary', async (req, res) => {
  try {
    const { hours } = req.query;
    const args = ['summary'];
    
    if (hours) args.push('--hours', hours);
    
    const summary = await executeHealthCommand(args);
    res.json(summary);
  } catch (error) {
    console.error('Erro ao obter resumo de saúde:', error);
    res.status(500).json({ error: 'Erro ao obter resumo de saúde', details: error.message });
  }
});

/**
 * @route POST /api/health-hooks/event
 * @description Adiciona um novo evento de saúde
 */
router.post('/event', async (req, res) => {
  try {
    const { type, name, dose, duration, note, extra, force } = req.body;
    
    if (!type || !name) {
      return res.status(400).json({ error: 'Tipo e nome são obrigatórios' });
    }
    
    const args = ['add', '--type', type, '--name', name];
    
    if (dose) args.push('--dose', dose);
    if (duration) args.push('--duration', duration.toString());
    if (note) args.push('--note', note);
    
    // Processar campos extras
    if (extra && typeof extra === 'object') {
      for (const [key, value] of Object.entries(extra)) {
        args.push('--extra', `${key}=${value}`);
      }
    }
    
    if (force) args.push('--force');
    
    const result = await executeHealthCommand(args);
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao adicionar evento de saúde:', error);
    
    // Se for erro de item não encontrado, enviar código 400
    if (error.message.includes('não encontrado nas regras')) {
      return res.status(400).json({ error: 'Item não encontrado nas regras', details: error.message });
    }
    
    res.status(500).json({ error: 'Erro ao adicionar evento de saúde', details: error.message });
  }
});

/**
 * @route GET /api/health-hooks/medications
 * @description Obtém lista dos medicamentos disponíveis nas regras
 */
router.get('/medications', async (req, res) => {
  try {
    // Ler arquivo de regras
    const rulesPath = path.resolve('./wilton_core/modules/health_hooks/rules.yaml');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');
    const rules = yaml.load(rulesContent);
    
    // Filtrar por medicamentos
    const medications = {};
    for (const [id, item] of Object.entries(rules.items || {})) {
      if (item.type === 'med' || item.type === 'supplement') {
        medications[id] = {
          ...item,
          id
        };
      }
    }
    
    res.json(Object.values(medications));
  } catch (error) {
    console.error('Erro ao obter medicamentos:', error);
    res.status(500).json({ error: 'Erro ao obter medicamentos', details: error.message });
  }
});

/**
 * @route GET /api/health-hooks/interactions
 * @description Obtém lista das interações medicamentosas conhecidas
 */
router.get('/interactions', async (req, res) => {
  try {
    // Ler arquivo de regras
    const rulesPath = path.resolve('./wilton_core/modules/health_hooks/rules.yaml');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');
    const rules = yaml.load(rulesContent);
    
    // Mapear interações
    const interactions = Object.entries(rules.interactions || {}).map(([id, interaction]) => ({
      id,
      ...interaction
    }));
    
    res.json(interactions);
  } catch (error) {
    console.error('Erro ao obter interações:', error);
    res.status(500).json({ error: 'Erro ao obter interações', details: error.message });
  }
});

/**
 * @route POST /api/health-hooks/seed/ricky-set
 * @description Adiciona os estímulos do Ricky Gervais ao sistema
 */
router.post('/seed/ricky-set', async (req, res) => {
  try {
    // Importar o módulo Python usando child_process
    const pythonProcess = spawn('python', ['-c', `
import sys
sys.path.append('./wilton_core')
from modules.health_hooks.health_hooks import get_health_hooks
import json

# Adicionar estímulos do Ricky
health_hooks = get_health_hooks()
results = health_hooks.seed_ricky_set()

# Retornar resultados como JSON
print(json.dumps(results))
`]);
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Erro ao semear estímulos: ${errorOutput}`);
        return res.status(500).json({ error: 'Erro ao adicionar estímulos', details: errorOutput });
      }
      
      try {
        const results = JSON.parse(output);
        res.status(201).json({
          message: 'Estímulos Ricky Gervais adicionados com sucesso',
          count: results.length,
          items: results
        });
      } catch (error) {
        console.error('Erro ao parsear resultados:', error);
        res.status(500).json({ error: 'Erro ao processar resultados', details: error.message });
      }
    });
  } catch (error) {
    console.error('Erro ao semear estímulos Ricky:', error);
    res.status(500).json({ error: 'Erro ao semear estímulos', details: error.message });
  }
});

/**
 * @route POST /api/health-hooks/seed/ricky-reflex
 * @description Adiciona os exercícios do protocolo Ricky Reflex ao sistema
 */
router.post('/seed/ricky-reflex', async (req, res) => {
  try {
    // Importar o módulo Python usando child_process
    const pythonProcess = spawn('python', ['-c', `
import sys
sys.path.append('./wilton_core')
from modules.health_hooks.health_hooks import get_health_hooks
import json

# Adicionar exercícios do protocolo Ricky Reflex
health_hooks = get_health_hooks()
results = health_hooks.seed_ricky_reflex()

# Retornar resultados como JSON
print(json.dumps(results))
`]);
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Erro ao semear exercícios: ${errorOutput}`);
        return res.status(500).json({ error: 'Erro ao adicionar exercícios', details: errorOutput });
      }
      
      try {
        const results = JSON.parse(output);
        res.status(201).json({
          message: 'Exercícios do protocolo Ricky Reflex adicionados com sucesso',
          count: results.length,
          items: results
        });
      } catch (error) {
        console.error('Erro ao parsear resultados:', error);
        res.status(500).json({ error: 'Erro ao processar resultados', details: error.message });
      }
    });
  } catch (error) {
    console.error('Erro ao semear protocolo Ricky Reflex:', error);
    res.status(500).json({ error: 'Erro ao semear protocolo', details: error.message });
  }
});

// Exportando como um módulo ES com export default
export default router;