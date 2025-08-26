/**
 * WiltonOS - API de Memória Perpétua
 * 
 * Este módulo implementa endpoints REST para interação com o sistema de memória perpétua.
 */

import express from 'express';
import memoryStore from './memory-store.js';
import { OpenAI } from 'openai';

const router = express.Router();

// Inicialização do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware para inicializar o banco de dados
router.use(async (req, res, next) => {
  try {
    // Verificar se o banco de dados já foi inicializado
    if (!global.memorySystemInitialized) {
      global.memorySystemInitialized = await memoryStore.initializeDatabase();
    }
    next();
  } catch (error) {
    console.error('Erro ao inicializar o sistema de memória:', error);
    res.status(500).json({ error: 'Erro ao inicializar o sistema de memória' });
  }
});

/**
 * Armazena uma nova memória
 * POST /api/memory
 * Body: { content, metadata?, tags? }
 */
router.post('/', async (req, res) => {
  try {
    const { content, metadata = {}, tags = [] } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Conteúdo é obrigatório' });
    }
    
    const memory = await memoryStore.storeMemory(content, metadata, tags);
    res.status(201).json(memory);
  } catch (error) {
    console.error('Erro ao armazenar memória:', error);
    res.status(500).json({ error: 'Erro ao armazenar memória' });
  }
});

/**
 * Recupera memórias com base em consulta de texto
 * GET /api/memory/search?query=texto&limit=5&threshold=0.7
 */
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 5, threshold = 0.7 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Consulta é obrigatória' });
    }
    
    const memories = await memoryStore.retrieveMemories(
      query,
      parseInt(limit, 10),
      parseFloat(threshold)
    );
    
    res.json(memories);
  } catch (error) {
    console.error('Erro ao buscar memórias:', error);
    res.status(500).json({ error: 'Erro ao buscar memórias' });
  }
});

/**
 * Recupera memórias por tags
 * GET /api/memory/tags?tags=tag1,tag2&limit=10
 */
router.get('/tags', async (req, res) => {
  try {
    const { tags, limit = 10 } = req.query;
    
    if (!tags) {
      return res.status(400).json({ error: 'Tags são obrigatórias' });
    }
    
    const tagArray = tags.split(',').map(tag => tag.trim());
    const memories = await memoryStore.retrieveMemoriesByTags(
      tagArray,
      parseInt(limit, 10)
    );
    
    res.json(memories);
  } catch (error) {
    console.error('Erro ao buscar memórias por tags:', error);
    res.status(500).json({ error: 'Erro ao buscar memórias por tags' });
  }
});

/**
 * Atualiza a importância de uma memória
 * PATCH /api/memory/:id/importance
 * Body: { score }
 */
router.patch('/:id/importance', async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    
    if (score === undefined || score < 0 || score > 1) {
      return res.status(400).json({ 
        error: 'Pontuação de importância deve ser um número entre 0 e 1' 
      });
    }
    
    const memory = await memoryStore.updateMemoryImportance(id, score);
    res.json(memory);
  } catch (error) {
    console.error('Erro ao atualizar importância da memória:', error);
    res.status(500).json({ error: 'Erro ao atualizar importância da memória' });
  }
});

/**
 * Deleta uma memória
 * DELETE /api/memory/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await memoryStore.deleteMemory(id);
    
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Memória não encontrada' });
    }
  } catch (error) {
    console.error('Erro ao deletar memória:', error);
    res.status(500).json({ error: 'Erro ao deletar memória' });
  }
});

/**
 * Gera resposta com memória contextual
 * POST /api/memory/chat
 * Body: { message, contextSize? }
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, contextSize = 5 } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }
    
    // Recuperar memórias relevantes
    const memories = await memoryStore.retrieveMemories(
      message,
      parseInt(contextSize, 10),
      0.5
    );
    
    // Formatar contexto
    let context = "";
    if (memories.length > 0) {
      context = "Contexto de memórias anteriores:\n\n" + 
        memories.map(m => `[Memória ${m.id.slice(0, 8)}]: ${m.content}`).join('\n\n') +
        "\n\nConsidere o contexto acima para responder à seguinte pergunta:";
    }
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é o assistente do WiltonOS, um sistema integrado para Wilton. " +
                   "Responda de maneira útil, precisa e concisa baseando-se no histórico " +
                   "de memórias quando relevante."
        },
        { 
          role: "user", 
          content: context ? `${context}\n\n${message}` : message 
        }
      ],
      temperature: 0.7,
    });
    
    // Armazenar esta interação como nova memória
    await memoryStore.storeMemory(
      `Pergunta: ${message}\nResposta: ${response.choices[0].message.content}`,
      { type: 'conversation' },
      ['chat']
    );
    
    res.json({
      response: response.choices[0].message.content,
      contextMemories: memories
    });
  } catch (error) {
    console.error('Erro ao processar mensagem de chat:', error);
    res.status(500).json({ error: 'Erro ao processar mensagem de chat' });
  }
});

export default router;