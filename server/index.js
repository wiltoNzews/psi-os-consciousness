/**
 * WiltonOS Server
 * 
 * Versão atualizada do servidor que integra todas as funcionalidades,
 * incluindo o novo sistema de memória perpétua.
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');

// Importar o sistema de memória perpétua
const memorySystem = require('./memory-system');

// Importar rotas existentes
const { registerAdditionalRoutes } = require('./routes');

// Inicializar o aplicativo Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criar servidor HTTP
const server = http.createServer(app);

// Configurar WebSocket
const wss = new WebSocketServer({ server, path: '/ws' });

// Armazenar clientes WebSocket
global.wsClients = new Set();

// Configurar tratamento de conexões WebSocket
wss.on('connection', (ws, req) => {
  const clientId = req.headers['sec-websocket-key'] || uuidv4();
  console.log(`[WiltonOS] Nova conexão WebSocket: ${clientId}`);
  
  // Adicionar cliente à lista global
  global.wsClients.add(ws);
  
  // Enviar mensagem inicial de status
  ws.send(JSON.stringify({
    type: 'status_update',
    status: 'online',
    coherence: 1,
    timestamp: Date.now()
  }));
  
  // Tratar mensagens recebidas
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`[WiltonOS] Mensagem recebida:`, data);
      
      // Broadcast para todos os clientes
      wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({
            type: 'status_update',
            status: 'online',
            coherence: 1,
            timestamp: Date.now()
          }));
        }
      });
    } catch (error) {
      console.error(`[WiltonOS] Erro ao processar mensagem: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  
  // Tratar desconexão
  ws.on('close', () => {
    console.log(`[WiltonOS] Conexão WebSocket fechada: ${clientId}`);
    global.wsClients.delete(ws);
  });
  
  // Enviar heartbeat a cada 5 segundos
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'status_update',
        status: 'online',
        coherence: 1,
        timestamp: Date.now()
      }));
    } else {
      clearInterval(interval);
    }
  }, 5000);
});

// Configurar API e rotas gerais
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    version: '1.6.0',
    modules: {
      'wiltonos-core': 'active',
      'sigil-core': 'active',
      'z-geometry': 'active',
      'file-processor': 'active',
      'whatsapp-bridge': 'active',
      'memory-system': 'active' // Novo módulo adicionado
    },
    coherence: 1.0,
    timestamp: Date.now()
  });
});

// Integrar o sistema de memória perpétua
memorySystem.integrate(app);

// Registrar rotas adicionais do sistema existente
registerAdditionalRoutes(app);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal - enviar HTML do ZEWS
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/zews.html'));
});

// Rota para memória perpétua
app.get('/perpetual-memory', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/perpetual-memory.html'));
});

// Importar fs para verificação de arquivos
const fs = require('fs');

// Fallback route - enviar HTML do ZEWS para todas as rotas não encontradas
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, '../public', req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  res.sendFile(path.join(__dirname, '../public/zews.html'));
});

// Definir porta
const PORT = process.env.PORT || 5000;

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`[WiltonOS] Servidor iniciado na porta ${PORT}`);
  console.log(`[WiltonOS] Interface Web disponível em http://localhost:${PORT}`);
  console.log(`[WiltonOS] API disponível em http://localhost:${PORT}/api`);
  console.log(`[WiltonOS] WebSocket disponível em ws://localhost:${PORT}/ws`);
  console.log(`[WiltonOS] Memória Perpétua disponível em http://localhost:${PORT}/perpetual-memory`);
});

module.exports = server;