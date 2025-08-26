/**
 * WiltonOS - Integração do Sistema de Memória Perpétua
 * 
 * Este módulo integra o sistema de memória perpétua ao servidor principal.
 */

// Importar módulos
const express = require('express');
const memoryApi = require('./memory-api');

/**
 * Integra as rotas de memória perpétua ao aplicativo Express principal
 * @param {express.Application} app - Aplicativo Express
 */
function integrateMemorySystem(app) {
  // Registrar as rotas da API de memória
  app.use('/api/memory', memoryApi);
  
  // Rota para a interface de memória perpétua
  app.get('/perpetual-memory', (req, res) => {
    res.sendFile('perpetual-memory.html', { root: './public' });
  });
  
  console.log('[WiltonOS] Sistema de memória perpétua integrado');
}

module.exports = {
  integrateMemorySystem
};