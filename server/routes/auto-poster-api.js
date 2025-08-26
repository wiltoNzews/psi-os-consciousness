/**
 * API para o Sistema AutoPoster do WiltonOS
 * 
 * Este módulo expõe endpoints para geração de sugestões de publicações
 * baseadas no equilíbrio phi (coerência/exploração) do sistema.
 */

import express from 'express';
import { execSync, spawn } from 'child_process';
import { prom, register } from '../metrics.js';
const router = express.Router();

// Endpoint para obter informações sobre o estado atual do sistema
router.get('/status', async (req, res) => {
  try {
    // Executar Python para obter o estado de coerência
    const pythonProcess = spawn('python3', [
      '-c', 
      `
import sys
import json
from wilton_core.memory.auto_poster import get_auto_poster_instance

async def get_system_status():
    # Inicializar o sistema AutoPoster
    auto_poster = get_auto_poster_instance()
    
    # Obter estado atual de coerência
    coherence_state = await auto_poster.get_coherence_state()
    
    # Obter calibração
    calibration = await auto_poster.calibrate_for_phi_balance(coherence_state.get("phi", 0.5))
    
    # Montar resposta com data correta
    from datetime import datetime
    response = {
        "coherence_state": coherence_state,
        "calibration": calibration,
        "ready": auto_poster.ready,
        "timestamp": datetime.now().isoformat()
    }
    
    print(json.dumps(response))

if __name__ == "__main__":
    import asyncio
    try:
        asyncio.run(get_system_status())
    except Exception as e:
        print(json.dumps({"error": str(e)}))
      `
    ]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python AutoPoster: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ 
          error: 'Erro ao obter status do sistema',
          details: output
        });
      }
      
      try {
        const status = JSON.parse(output);
        res.json(status);
      } catch (e) {
        console.error('Error parsing Python output:', e);
        res.status(500).json({ 
          error: 'Erro ao processar status do sistema',
          output: output
        });
      }
    });
  } catch (error) {
    console.error('Error getting system status:', error);
    res.status(500).json({ error: 'Erro interno ao obter status do sistema' });
  }
});

// Endpoint para obter sugestão de post
router.get('/suggestions', async (req, res) => {
  try {
    // Extrair parâmetros opcionais da query
    const { categories, context } = req.query;
    
    // Executar Python para obter sugestão de post
    const pythonProcess = spawn('python3', [
      '-c', 
      `
import sys
import json
from wilton_core.memory.auto_poster import get_auto_poster_instance

async def get_post_suggestion():
    # Inicializar o sistema AutoPoster
    auto_poster = get_auto_poster_instance()
    
    # Extrair parâmetros da linha de comando
    params = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    categories = params.get("categories", [])
    context = params.get("context", "")
    
    # Gerar sugestão de post
    suggestion = await auto_poster.generate_post_suggestion(
        categories=categories if categories else None,
        context=context if context else None
    )
    
    print(json.dumps(suggestion))

if __name__ == "__main__":
    import asyncio
    try:
        params = {
            "categories": ${categories ? JSON.stringify(categories.split(",")) : "[]"},
            "context": ${context ? JSON.stringify(context) : '""'}
        }
        asyncio.run(get_post_suggestion())
    except Exception as e:
        print(json.dumps({"error": str(e)}))
      `,
      JSON.stringify({
        categories: categories ? categories.split(",") : [],
        context: context || ""
      })
    ]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python AutoPoster: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ 
          error: 'Erro ao gerar sugestão de post',
          details: output
        });
      }
      
      try {
        const suggestion = JSON.parse(output);
        res.json(suggestion);
      } catch (e) {
        console.error('Error parsing Python output:', e);
        res.status(500).json({ 
          error: 'Erro ao processar sugestão de post',
          output: output
        });
      }
    });
  } catch (error) {
    console.error('Error generating post suggestions:', error);
    res.status(500).json({ error: 'Erro interno ao gerar sugestões de post' });
  }
});

// Endpoint para buscar posts similares
router.get('/similar', async (req, res) => {
  try {
    // Extrair parâmetro de consulta
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Parâmetro "query" é obrigatório' });
    }
    
    // Executar Python para buscar posts similares
    const pythonProcess = spawn('python3', [
      '-c', 
      `
import sys
import json
from wilton_core.memory.auto_poster import get_auto_poster_instance

async def find_similar_posts():
    # Inicializar o sistema AutoPoster
    auto_poster = get_auto_poster_instance()
    
    # Extrair parâmetros da linha de comando
    params = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    query = params.get("query", "")
    limit = params.get("limit", 5)
    
    # Buscar posts similares
    similar_posts = await auto_poster.find_similar_posts(
        query=query,
        limit=int(limit)
    )
    
    print(json.dumps({
        "query": query,
        "limit": limit,
        "results": similar_posts
    }))

if __name__ == "__main__":
    import asyncio
    try:
        asyncio.run(find_similar_posts())
    except Exception as e:
        print(json.dumps({"error": str(e)}))
      `,
      JSON.stringify({
        query: query,
        limit: parseInt(limit) || 5
      })
    ]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python AutoPoster: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ 
          error: 'Erro ao buscar posts similares',
          details: output
        });
      }
      
      try {
        const results = JSON.parse(output);
        res.json(results);
      } catch (e) {
        console.error('Error parsing Python output:', e);
        res.status(500).json({ 
          error: 'Erro ao processar busca de posts',
          output: output
        });
      }
    });
  } catch (error) {
    console.error('Error finding similar posts:', error);
    res.status(500).json({ error: 'Erro interno ao buscar posts similares' });
  }
});

// Endpoint para obter calibração baseada no phi atual
router.get('/calibration', async (req, res) => {
  try {
    // Executar Python para obter calibração phi
    const pythonProcess = spawn('python3', [
      '-c', 
      `
import sys
import json
from wilton_core.memory.auto_poster import get_auto_poster_instance

async def get_calibration():
    # Inicializar o sistema AutoPoster
    auto_poster = get_auto_poster_instance()
    
    # Obter estado atual de coerência
    coherence_state = await auto_poster.get_coherence_state()
    current_phi = coherence_state.get("phi", 0.5)
    
    # Gerar calibração
    calibration = await auto_poster.calibrate_for_phi_balance(current_phi)
    
    print(json.dumps(calibration))

if __name__ == "__main__":
    import asyncio
    try:
        asyncio.run(get_calibration())
    except Exception as e:
        print(json.dumps({"error": str(e)}))
      `
    ]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python AutoPoster: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ 
          error: 'Erro ao obter calibração phi',
          details: output
        });
      }
      
      try {
        const calibration = JSON.parse(output);
        res.json(calibration);
      } catch (e) {
        console.error('Error parsing Python output:', e);
        res.status(500).json({ 
          error: 'Erro ao processar calibração phi',
          output: output
        });
      }
    });
  } catch (error) {
    console.error('Error generating phi calibration:', error);
    res.status(500).json({ error: 'Erro interno ao gerar calibração phi' });
  }
});

// Exportar como default para compatibilidade com ESM
export default router;