/**
 * WiltonOS - Sistema de Memória Perpétua - Ponto de Entrada
 * 
 * Este módulo serve como ponto de entrada para o sistema de memória perpétua,
 * exportando todas as funcionalidades em um único local.
 */

const memoryStore = require('./memory-store');
const memoryApi = require('./memory-api');
const { integrateMemorySystem } = require('./integration');

module.exports = {
  // Exportar funções do armazenamento de memória
  store: memoryStore,
  
  // Exportar router da API
  api: memoryApi,
  
  // Função de integração
  integrate: integrateMemorySystem
};