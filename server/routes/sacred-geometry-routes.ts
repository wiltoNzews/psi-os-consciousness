/**
 * Rotas de API para Geometria Sagrada
 * 
 * Estas rotas fornecem acesso ao gerador de geometria sagrada,
 * que cria padrões matemáticos visuais para finalidades espirituais e meditativas.
 */

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { activeConnections } from '../routes.js';

// Obter diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar router
const router = express.Router();

// Configurar diretório de saída
const outputDir = path.join(process.cwd(), 'public', 'sacred_geometry');

// Garantir que o diretório exista
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Rota para gerar todos os padrões
router.post('/generate-all', async (req, res) => {
  try {
    const { color_mode, size } = req.body;
    
    console.log(`[Z-Geometry] Gerando todos os padrões: tamanho: ${size}, modo: ${color_mode}`);
    
    // Caminho para o script Python
    const pythonScriptPath = path.join(__dirname, 'sacred_geometry', 'geometry_generator.py');
    
    // Comando Python a ser executado
    const pythonScript = `
import sys
sys.path.insert(0, '${path.join(__dirname, 'sacred_geometry')}')
import json
from geometry_generator import flower_of_life, metatrons_cube, sri_yantra, merkaba, torus, generate_all_patterns

color_mode = '${color_mode || "quantum"}'
size = ${size || 1000}

try:
    # Gerar todos os padrões
    flower = flower_of_life(size=size, color_mode=color_mode)
    metatron = metatrons_cube(size=size, color_mode=color_mode)
    yantra = sri_yantra(size=size, color_mode=color_mode)
    merkaba_img = merkaba(size=size, color_mode=color_mode)
    torus_img = torus(size=size, color_mode=color_mode)
    
    # Retornar todos os resultados
    result = {
        'success': True,
        'message': 'Todos os padrões gerados com sucesso',
        'patterns': {
            'flower_of_life': flower,
            'metatrons_cube': metatron,
            'sri_yantra': yantra,
            'merkaba': merkaba_img,
            'torus': torus_img
        }
    }
    
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({
        'success': False,
        'error': str(e)
    }))
    sys.exit(1)
    `;
    
    console.log('Iniciando geração de todos os padrões de geometria sagrada...');
    
    // Executar script Python usando spawn
    const pythonProcess = spawn('python3', ['-c', pythonScript]);
    
    let result = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`[Z-Geometry] Erro na geração: ${error}`);
        return res.status(500).json({ 
          success: false, 
          message: `Erro ao gerar padrões (código ${code})`,
          error: error
        });
      }
      
      try {
        const parsedResult = JSON.parse(result);
        res.json(parsedResult);
      } catch (parseError) {
        console.error(`[Z-Geometry] Erro ao parsear resultado: ${parseError.message}`);
        res.status(500).json({ 
          success: false, 
          message: 'Erro ao processar resultado do script Python',
          error: parseError.message,
          data: result
        });
      }
    });
  } catch (error) {
    console.error(`[Z-Geometry] Erro interno: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erro interno',
      error: error.message
    });
  }
});

// Rota para gerar geometria sagrada
router.post('/generate', async (req, res) => {
  try {
    const { type, color_mode, size } = req.body;
    
    console.log(`[Z-Geometry] Gerando padrão: ${type}, tamanho: ${size}, modo: ${color_mode}`);
    
    if (!type) {
      console.error('[Sacred Geometry] Erro: Tipo de geometria não fornecido');
      return res.status(400).json({
        success: false,
        error: 'Tipo de geometria não fornecido'
      });
    }
    
    // Caminho para o script Python
    const pythonScriptPath = path.join(__dirname, 'sacred_geometry', 'geometry_generator.py');
    
    // Comando Python a ser executado
    const pythonScript = `
import sys
sys.path.insert(0, '${path.join(__dirname, 'sacred_geometry')}')
import json
from geometry_generator import flower_of_life, metatrons_cube, sri_yantra, merkaba, torus, generate_all_patterns

type_param = '${type}'
color_mode = '${color_mode || "quantum"}'
size = ${size || 1000}

try:
    result = None
    if type_param == 'flower_of_life':
        result = flower_of_life(size=size, color_mode=color_mode)
    elif type_param == 'metatrons_cube':
        result = metatrons_cube(size=size, color_mode=color_mode)
    elif type_param == 'sri_yantra':
        result = sri_yantra(size=size, color_mode=color_mode)
    elif type_param == 'merkaba':
        result = merkaba(size=size, color_mode=color_mode)
    elif type_param == 'torus':
        result = torus(size=size, color_mode=color_mode)
    elif type_param == 'all':
        result = {
            'success': True,
            'message': f'Todas as geometrias geradas no modo {color_mode}',
            'images': generate_all_patterns(size=size, color_mode=color_mode)
        }
    
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({
        'success': False,
        'error': str(e)
    }))
    sys.exit(1)
    `;
    
    console.log('Iniciando geração de geometria sagrada...');
    
    // Executar script Python usando spawn
    const pythonProcess = spawn('python3', ['-c', pythonScript]);
    
    let result = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      console.error(`Erro no processo Python: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Processo Python terminou com código ${code}`);
        console.error(`Erro: ${error}`);
        
        // Notificar todos os clientes WebSocket conectados
        for (const [clientId, ws] of activeConnections.entries()) {
          if (ws.readyState === 1) { // WebSocket.OPEN = 1
            ws.send(JSON.stringify({
              type: 'sacred_geometry_error',
              error: `Erro ao gerar geometria sagrada: ${error}`
            }));
          }
        }
        
        return res.status(500).json({
          success: false,
          error: `Erro ao gerar geometria sagrada: ${error}`
        });
      }
      
      try {
        // Parsear saída do script Python
        const output = JSON.parse(result);
        
        // Notificar todos os clientes WebSocket conectados
        for (const [clientId, ws] of activeConnections.entries()) {
          if (ws.readyState === 1) { // WebSocket.OPEN = 1
            ws.send(JSON.stringify({
              type: 'sacred_geometry_created',
              data: output
            }));
          }
        }
        
        res.json(output);
      } catch (err) {
        const error = err as Error;
        console.error('Erro ao processar saída do Python:', error);
        res.status(500).json({
          success: false,
          error: `Erro ao processar saída do Python: ${error.message}`
        });
      }
    });
  } catch (err) {
    const error = err as Error;
    console.error('Erro na API de geometria sagrada:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao gerar geometria sagrada'
    });
  }
});

// Rota para listar imagens de geometria sagrada
router.get('/list', (req, res) => {
  try {
    // Garantir que o diretório exista
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      return res.json({
        success: true,
        message: 'Nenhuma imagem encontrada',
        images: []
      });
    }
    
    // Listar arquivos no diretório
    const files = fs.readdirSync(outputDir)
      .filter(file => file.endsWith('.png'));
    
    // Converter para formato de resposta
    const images = files.map(file => ({
      filename: file,
      url: `/sacred_geometry/${file}`
    }));
    
    res.json({
      success: true,
      message: `${images.length} imagens encontradas`,
      images
    });
  } catch (err) {
    const error = err as Error;
    console.error('Erro ao listar imagens de geometria sagrada:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar imagens'
    });
  }
});

export default router;