/**
 * Servidor principal do WiltonOS
 * 
 * Este módulo implementa o servidor Express que serve a aplicação
 * WiltonOS e inicializa os handlers WebSocket para ZEWS.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { WebSocketServer } = require('ws');
const { router: zewsRouter, initializeWebSocketHandlers } = require('./routes/zews');

// Criar aplicação Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Registrar rotas ZEWS
app.use('/api/zews', zewsRouter);

// Inicializar servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[SERVER] WiltonOS rodando na porta ${PORT}`);
});

// Inicializar servidor WebSocket
const wsServer = new WebSocketServer({ server, path: '/ws' });
console.log('[SERVER] Servidor WebSocket inicializado no caminho: /ws');

// Inicializar handlers WebSocket ZEWS
initializeWebSocketHandlers(wsServer);

// Gerenciar encerramento
process.on('SIGINT', () => {
  console.log('[SERVER] Encerrando servidor...');
  server.close(() => {
    console.log('[SERVER] Servidor encerrado');
    process.exit(0);
  });
});

module.exports = server;