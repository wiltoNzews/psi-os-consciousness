/**
 * WiltonOS - Integração do Sistema de Memória Perpétua ao Servidor Principal
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { Pool } from 'pg';
import { Client } from 'pg';
import * as memoryApi from './memory-system/memory-api.js';
import * as chatgptProcessor from './memory-system/chatgpt-processor.js';

// Configurar cliente PostgreSQL para verificar e instalar a extensão vector
async function setupVectorExtension() {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    
    // Verificar se a extensão vector já está instalada
    const checkResult = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'vector'
      );
    `);
    
    if (!checkResult.rows[0].exists) {
      // Instalar a extensão vector
      console.log('[WiltonOS] Instalando extensão vector no PostgreSQL...');
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('[WiltonOS] Extensão vector instalada com sucesso.');
    } else {
      console.log('[WiltonOS] Extensão vector já está instalada.');
    }
    
    // Criar tabela de memórias se não existir
    await client.query(`
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
      );
    `);
    
    // Criar índice para busca por similaridade se não existir
    await client.query(`
      CREATE INDEX IF NOT EXISTS memories_embedding_idx 
      ON memories 
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
    `);
    
    await client.end();
    
    console.log('[WiltonOS] Banco de dados configurado para o sistema de memória perpétua.');
    return true;
  } catch (error) {
    console.error('[WiltonOS] Erro ao configurar extensão vector:', error);
    return false;
  }
}

/**
 * Integra o sistema de memória perpétua ao aplicativo Express
 * @param app Aplicativo Express
 */
export async function integrateMemorySystem(app: express.Application) {
  try {
    console.log('[WiltonOS] Iniciando integração do sistema de memória perpétua...');
    
    // Configurar banco de dados para suportar embeddings
    await setupVectorExtension();
    
    // Configurar armazenamento de arquivos com multer
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads');
        
        // Verificar se o diretório existe, se não, criar
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = file.originalname;
        cb(null, `${timestamp}-${originalName}`);
      }
    });
    
    // Configurar middleware multer
    const upload = multer({ 
      storage,
      limits: { fileSize: 50 * 1024 * 1024 } // 50MB limite
    });
    
    // Registrar rotas da API de memória
    app.use('/api/memory', memoryApi.default);
    
    // Rota para a página de memória perpétua
    app.get('/perpetual-memory', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'public/perpetual-memory.html'));
    });
    
    console.log('[WiltonOS] Sistema de memória perpétua integrado com sucesso.');
    return true;
  } catch (error) {
    console.error('[WiltonOS] Erro ao integrar sistema de memória perpétua:', error);
    return false;
  }
}