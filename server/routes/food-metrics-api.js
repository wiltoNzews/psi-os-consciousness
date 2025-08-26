/**
 * API de Métricas para o Sistema de Nutrição Fractal
 * 
 * Este módulo expõe endpoints para acesso às métricas do sistema de nutrição
 * e integração com Prometheus/Grafana para visualização do equilíbrio phi (3:1).
 */

import express from 'express';
import { execSync, spawn } from 'child_process';
import { prom, register } from '../metrics.js';
const router = express.Router();

// Endpoint para obter métricas atuais do sistema de alimentação
router.get('/metrics', async (req, res) => {
  try {
    // Executar Python para obter métricas atuais
    const pythonProcess = spawn('python3', [
      '-c', 
      `
import sys
import json
from wilton_core.memory.food_logging import get_food_logger_instance

async def get_metrics():
    food_logger = get_food_logger_instance()
    
    # Obter phi atual e estado de coerência
    coherence_state = await food_logger.health_connector.get_coherence_state()
    current_phi = coherence_state.get("phi", 0.5) if coherence_state else 0.5
    
    # Analisar impactos alimentares
    impact_analysis = await food_logger.analyze_food_impacts()
    
    # Obter histórico recente
    recent_history = await food_logger.get_food_history(limit=5)
    
    # Montar resposta
    metrics = {
        "current_phi": current_phi,
        "phi_deviation": current_phi - 0.75,
        "fractal_alignment": 1.0 - min(abs(current_phi - 0.75) / 0.75, 1.0),
        "quantum_state": "exploração_excessiva" if current_phi < 0.25 else 
                          "supercoerência" if current_phi > 0.85 else 
                          "sweet_spot" if abs(current_phi - 0.75) <= 0.1 else "transição",
        "impact_analysis": impact_analysis,
        "recent_history": recent_history
    }
    
    print(json.dumps(metrics))

if __name__ == "__main__":
    import asyncio
    asyncio.run(get_metrics())
      `
    ]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ error: 'Erro ao obter métricas de nutrição' });
      }
      
      try {
        const metrics = JSON.parse(output);
        res.json(metrics);
      } catch (e) {
        console.error('Error parsing Python output:', e);
        res.status(500).json({ 
          error: 'Erro ao processar métricas',
          output: output
        });
      }
    });
  } catch (error) {
    console.error('Error fetching nutrition metrics:', error);
    res.status(500).json({ error: 'Erro interno ao buscar métricas' });
  }
});

// Endpoint para acessar as métricas Prometheus
router.get('/prometheus', (req, res) => {
  res.set('Content-Type', register.contentType);
  
  // Coletar métricas recentes antes de enviar
  try {
    // Chamar Python para atualizar métricas Prometheus (não bloqueante)
    const pythonProcess = spawn('python3', [
      '-c', 
      `
import sys
import json
from wilton_core.memory.food_logging import get_food_logger_instance
from wilton_core.metrics.food_metrics import update_phi_metrics, set_food_logger_info

async def update_prometheus_metrics():
    food_logger = get_food_logger_instance()
    
    # Obter phi atual e estado de coerência
    coherence_state = await food_logger.health_connector.get_coherence_state()
    current_phi = coherence_state.get("phi", 0.5) if coherence_state else 0.5
    
    # Calcular desvio e alinhamento fractal
    deviation = current_phi - 0.75
    fractal_alignment = 1.0 - min(abs(deviation) / 0.75, 1.0)
    
    # Atualizar métricas do Prometheus
    update_phi_metrics(
        phi=current_phi,
        deviation=deviation,
        alignment=fractal_alignment
    )
    
    # Configurar informações do logger
    set_food_logger_info(
        version="1.0.0",
        qdrant_status="connected" if food_logger.qdrant_client else "disconnected",
        health_hooks_status="connected" if food_logger.health_connector else "disconnected"
    )
    
    print(json.dumps({"status": "metrics_updated", "phi": current_phi, "deviation": deviation, "alignment": fractal_alignment}))

if __name__ == "__main__":
    import asyncio
    asyncio.run(update_prometheus_metrics())
      `
    ]);
    
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Metrics update: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python metrics updater: ${data}`);
    });
    
    pythonProcess.on('error', (err) => {
      console.error('Failed to update metrics:', err);
    });
  } catch (error) {
    console.error('Error updating Prometheus metrics:', error);
  }
  
  register.metrics()
    .then(metrics => res.end(metrics))
    .catch(err => {
      console.error('Error generating metrics:', err);
      res.status(500).end();
    });
});

// Endpoint para sugestões alimentares com base no phi atual
router.get('/suggestions', async (req, res) => {
  try {
    // Executar Python para gerar sugestão de refeição
    const pythonProcess = spawn('python3', [
      '-c', 
      `
import sys
import json
from wilton_core.memory.food_logging import get_food_logger_instance

async def get_meal_suggestion():
    food_logger = get_food_logger_instance()
    
    # Gerar recomendação para o phi ideal (0.75)
    suggestion = await food_logger.generate_meal_recommendation(target_phi=0.75)
    
    print(json.dumps(suggestion))

if __name__ == "__main__":
    import asyncio
    asyncio.run(get_meal_suggestion())
      `
    ]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ error: 'Erro ao gerar sugestão de refeição' });
      }
      
      try {
        const suggestion = JSON.parse(output);
        res.json(suggestion);
      } catch (e) {
        console.error('Error parsing Python output:', e);
        res.status(500).json({ 
          error: 'Erro ao processar sugestão de refeição',
          output: output
        });
      }
    });
  } catch (error) {
    console.error('Error generating meal suggestions:', error);
    res.status(500).json({ error: 'Erro interno ao gerar sugestões' });
  }
});

// Exportar como default para compatibilidade com ESM
export default router;