/**
 * WiltonOS - Sistema de Memória Perpétua - Ponto de Entrada (TypeScript)
 * 
 * Este módulo serve como ponto de entrada para o sistema de memória perpétua,
 * exportando todas as funcionalidades em um único local.
 */

import memoryStore from './memory-store.js';
import memoryApiRouter from './memory-api.js';
import { integrateMemorySystem } from './integration.js';

export {
  memoryStore,
  memoryApiRouter,
  integrateMemorySystem
};