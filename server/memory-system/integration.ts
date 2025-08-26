/**
 * WiltonOS - Integração do Sistema de Memória Perpétua (TypeScript)
 * 
 * Este módulo integra o sistema de memória perpétua ao servidor principal.
 */

import express from 'express';
import path from 'path';
import memoryApiRouter from './memory-api.js';

/**
 * Integra as rotas de memória perpétua ao aplicativo Express principal
 * @param app - Aplicativo Express
 */
export function integrateMemorySystem(app: express.Application): void {
  // Registrar as rotas da API de memória
  app.use('/api/memory', memoryApiRouter);
  
  console.log('[WiltonOS] Sistema de memória perpétua integrado');
}

export default {
  integrateMemorySystem
};