const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

// Configuração do servidor
const app = express();
const port = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de verificação de saúde
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Criar servidor HTTP
const server = http.createServer(app);

// Configurar WebSocket
const wss = new WebSocket.Server({ 
  server,
  path: '/ws'
});

// Mapa de conexões ativas
const activeConnections = new Map();

// Conectar handler WebSocket
wss.on('connection', (ws) => {
  const id = Date.now().toString();
  activeConnections.set(id, ws);
  
  console.log(`Nova conexão WebSocket: ${id}`);
  
  // Enviar mensagem de boas-vindas
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Bem-vindo ao WiltonOS WebSocket Server',
    timestamp: Date.now()
  }));
  
  // Enviar atualizações periódicas
  const intervalId = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      // Gerar valores quânticos aleatórios para demonstração
      const coherence = parseFloat((0.5 + Math.random() * 0.5).toFixed(2));
      const chaos = parseFloat((1 - coherence).toFixed(2));
      
      ws.send(JSON.stringify({
        type: 'quantum_update',
        coherence,
        chaos,
        mode: coherence > 0.7 ? 'coerência' : 'equilíbrio',
        timestamp: Date.now()
      }));
    }
  }, 5000);
  
  // Processar mensagens recebidas
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Mensagem recebida:', data);
      
      // Processar diferentes tipos de mensagens
      switch (data.type) {
        case 'client_connect':
          console.log(`Cliente conectado: ${data.clientId} (${data.clientType})`);
          break;
          
        case 'ping':
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: Date.now()
          }));
          break;
          
        default:
          console.log(`Mensagem não processada: ${data.type}`);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  });
  
  // Lidar com fechamento de conexão
  ws.on('close', () => {
    clearInterval(intervalId);
    activeConnections.delete(id);
    console.log(`Conexão WebSocket fechada: ${id}`);
  });
  
  // Lidar com erros
  ws.on('error', (error) => {
    console.error(`Erro WebSocket em ${id}:`, error);
  });
});

// Iniciar servidor
server.listen(port, '0.0.0.0', () => {
  console.log(`[PassiveWorks.AI] Servidor rodando em http://localhost:${port}`);
  console.log(`[PassiveWorks.AI] WebSocket disponível em ws://localhost:${port}/ws`);
});