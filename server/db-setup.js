/**
 * WiltonOS - Configuração do Banco de Dados
 * 
 * Este script inicializa o banco de dados com as tabelas necessárias para
 * o sistema de memória perpétua.
 */

const { Client } = require('pg');

// Conectar ao banco de dados
async function setupDatabase() {
  try {
    console.log('[WiltonOS] Configurando banco de dados...');
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    
    // Criar extensão vector se não existir
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('[WiltonOS] Extensão vector configurada com sucesso.');
    
    // Criar tabela de memórias se não existir
    await client.query(`
      DROP TABLE IF EXISTS memories;
      
      CREATE TABLE memories (
        id UUID PRIMARY KEY,
        content TEXT NOT NULL,
        embedding vector(1536),
        metadata JSONB DEFAULT '{}',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP WITH TIME ZONE,
        importance_score FLOAT DEFAULT 0.5,
        access_count INTEGER DEFAULT 0
      );
    `);
    console.log('[WiltonOS] Tabela memories criada com sucesso.');
    
    // Criar índices
    await client.query(`
      CREATE INDEX IF NOT EXISTS memories_tags_idx ON memories USING GIN(tags);
      CREATE INDEX IF NOT EXISTS memories_embedding_idx ON memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
    `);
    console.log('[WiltonOS] Índices criados com sucesso.');
    
    // Criar tabela de conversas ChatGPT
    await client.query(`
      CREATE TABLE IF NOT EXISTS chatgpt_conversations (
        id TEXT PRIMARY KEY,
        title TEXT,
        content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        processed BOOLEAN DEFAULT FALSE,
        processing_stats JSONB DEFAULT '{}'
      );
    `);
    console.log('[WiltonOS] Tabela chatgpt_conversations criada com sucesso.');
    
    await client.end();
    console.log('[WiltonOS] Configuração do banco de dados concluída com sucesso.');
    
    return true;
  } catch (error) {
    console.error('[WiltonOS] Erro ao configurar banco de dados:', error);
    return false;
  }
}

// Executar script
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  module.exports = { setupDatabase };
}