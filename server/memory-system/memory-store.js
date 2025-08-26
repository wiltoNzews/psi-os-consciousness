/**
 * WiltonOS - Sistema de Memória Perpétua
 * 
 * Este módulo implementa um sistema de armazenamento e recuperação de memórias
 * inspirado no funcionamento do ChatGPT, mas adaptado para as necessidades do WiltonOS.
 */

import pkg from 'pg';
const { Client } = pkg;
import { v4 as uuidv4 } from 'uuid';
import { OpenAI } from 'openai';

// Configuração do cliente PostgreSQL usando variáveis de ambiente
const dbClient = new Client({
  connectionString: process.env.DATABASE_URL
});

// Inicialização do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Iniciar conexão com o banco de dados
async function initializeDatabase() {
  try {
    await dbClient.connect();
    console.log('Conexão com o banco de dados estabelecida.');
    
    // Criar tabela de memórias se não existir
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS memories (
        id UUID PRIMARY KEY,
        content TEXT NOT NULL,
        embedding VECTOR(1536),
        metadata JSONB DEFAULT '{}',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP WITH TIME ZONE,
        importance_score FLOAT DEFAULT 0.5,
        access_count INTEGER DEFAULT 0
      )
    `);
    
    // Criar índice para busca por similaridade
    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS memories_embedding_idx 
      ON memories 
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
    `);
    
    console.log('Sistema de memória perpétua inicializado com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    return false;
  }
}

/**
 * Gera um embedding para o texto usando o modelo
 * @param {string} text - Texto para gerar o embedding
 * @returns {Promise<number[]>} - Vetor de embedding
 */
async function generateEmbedding(text) {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
      encoding_format: "float"
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Erro ao gerar embedding:', error);
    throw error;
  }
}

/**
 * Armazena uma nova memória no banco de dados
 * @param {string} content - Conteúdo da memória
 * @param {object} metadata - Metadados associados à memória
 * @param {string[]} tags - Tags para categorizar a memória
 * @returns {Promise<object>} - Objeto representando a memória armazenada
 */
async function storeMemory(content, metadata = {}, tags = []) {
  try {
    const id = uuidv4();
    const embedding = await generateEmbedding(content);
    
    const result = await dbClient.query(
      `INSERT INTO memories(id, content, embedding, metadata, tags) 
       VALUES($1, $2, $3, $4, $5) 
       RETURNING *`,
      [id, content, embedding, JSON.stringify(metadata), tags]
    );
    
    console.log(`Nova memória armazenada com ID: ${id}`);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao armazenar memória:', error);
    throw error;
  }
}

/**
 * Recupera memórias semelhantes ao texto fornecido
 * @param {string} queryText - Texto para busca
 * @param {number} limit - Número máximo de resultados
 * @param {number} threshold - Limiar de similaridade (0.0 a 1.0)
 * @returns {Promise<Array>} - Array de memórias ordenadas por similaridade
 */
async function retrieveMemories(queryText, limit = 5, threshold = 0.7) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    
    const result = await dbClient.query(
      `SELECT id, content, metadata, tags, 
              created_at, last_accessed, importance_score, access_count,
              1 - (embedding <=> $1) AS similarity
       FROM memories
       WHERE 1 - (embedding <=> $1) > $2
       ORDER BY similarity DESC
       LIMIT $3`,
      [queryEmbedding, threshold, limit]
    );
    
    // Atualizar contadores de acesso e timestamp para as memórias recuperadas
    for (const memory of result.rows) {
      await dbClient.query(
        `UPDATE memories 
         SET access_count = access_count + 1, 
             last_accessed = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [memory.id]
      );
    }
    
    return result.rows;
  } catch (error) {
    console.error('Erro ao recuperar memórias:', error);
    throw error;
  }
}

/**
 * Recupera memórias por tags
 * @param {string[]} tags - Tags para filtrar memórias
 * @param {number} limit - Número máximo de resultados
 * @returns {Promise<Array>} - Array de memórias que contêm as tags especificadas
 */
async function retrieveMemoriesByTags(tags, limit = 10) {
  try {
    const result = await dbClient.query(
      `SELECT id, content, metadata, tags, 
              created_at, last_accessed, importance_score, access_count
       FROM memories
       WHERE tags && $1
       ORDER BY importance_score DESC, created_at DESC
       LIMIT $2`,
      [tags, limit]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Erro ao recuperar memórias por tags:', error);
    throw error;
  }
}

/**
 * Atualiza a pontuação de importância de uma memória
 * @param {string} id - ID da memória
 * @param {number} score - Nova pontuação de importância (0.0 a 1.0)
 * @returns {Promise<object>} - Memória atualizada
 */
async function updateMemoryImportance(id, score) {
  try {
    const result = await dbClient.query(
      `UPDATE memories 
       SET importance_score = $1
       WHERE id = $2
       RETURNING *`,
      [score, id]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Memória com ID ${id} não encontrada`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar importância da memória:', error);
    throw error;
  }
}

/**
 * Deleta uma memória do banco de dados
 * @param {string} id - ID da memória a ser deletada
 * @returns {Promise<boolean>} - true se a operação foi bem-sucedida
 */
async function deleteMemory(id) {
  try {
    const result = await dbClient.query(
      'DELETE FROM memories WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Erro ao deletar memória:', error);
    throw error;
  }
}

// Exportar funções do módulo
export default {
  initializeDatabase,
  storeMemory,
  retrieveMemories,
  retrieveMemoriesByTags,
  updateMemoryImportance,
  deleteMemory,
};