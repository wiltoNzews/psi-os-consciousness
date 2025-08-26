/**
 * WiltonOS Server - Versão com WebSocket
 * 
 * Este é o ponto de entrada principal do servidor WiltonOS com
 * suporte completo a WebSocket para o Agent Router.
 */

// Importações principais
import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Importar roteadores
// Importar roteador ZEWS
import * as zewsModule from './routes/zews.js';
const zewsRouter = zewsModule.default || zewsModule.router;
// Importar ZEWS WebSocket
import * as zewsWsModule from './routes/zews-ws.js';
const zewsWs = zewsWsModule.default || zewsWsModule;

// Importar módulo de servidor WebSocket
import { initializeWebSocketServer } from './websocket-server.js';

// Obter diretório atual (equivalente a __dirname em CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Criar aplicação Express
const app = express();

// Configurar middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Registrar rotas
app.use('/api/zews', zewsRouter);
app.use('/api/zews-ws', zewsWs.router);

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// API Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Criar servidor HTTP
const server = http.createServer(app);

// Inicializar servidor WebSocket
const wsServer = initializeWebSocketServer(server);

// Inicializar manipuladores WebSocket específicos para ZEWS
zewsWs.initializeZewsWebSocket();

// Definir porta
const PORT = process.env.PORT || 3000;

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[WiltonOS] Servidor iniciado na porta ${PORT}`);
  console.log(`[WiltonOS] WebSocket disponível no caminho: ws://localhost:${PORT}/ws`);
});

// Exportar servidor para uso em outros módulos
export default server;