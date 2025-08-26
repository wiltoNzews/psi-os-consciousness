import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';

// Obter diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Criar o app Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    version: "1.5",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    modules: {
      vaultCore: "operational",
      memoryManager: "operational",
      fileProcessor: "operational",
      bridge: "connected"
    },
    coherence: 1.0, // 100%
    quantumAwakening: "ready"
  });
});

// Redirecionar para dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard.html');
});

// Criar HTTP server
const server = createServer(app);

// Configurar WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// Mapa para armazenar conexões
const connections = new Map();

// Lidar com conexões WebSocket
wss.on('connection', (ws) => {
  const id = Date.now().toString();
  connections.set(id, ws);
  
  console.log(`Nova conexão WebSocket: ${id}`);
  
  // Enviar mensagem de boas-vindas
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Bem-vindo ao WiltonOS Dashboard',
    timestamp: Date.now()
  }));
  
  // Enviar atualizações periódicas
  const intervalId = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'status_update',
        status: 'online',
        coherence: 1.0,
        timestamp: Date.now()
      }));
    }
  }, 30000);
  
  // Lidar com desconexão
  ws.on('close', () => {
    clearInterval(intervalId);
    connections.delete(id);
    console.log(`Conexão WebSocket fechada: ${id}`);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[WiltonOS] Servidor iniciado na porta ${PORT}`);
  console.log(`[WiltonOS] Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`[WiltonOS] API: http://localhost:${PORT}/api`);
  console.log(`[WiltonOS] WebSocket: ws://localhost:${PORT}/ws`);
});