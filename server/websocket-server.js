/**
 * WiltonOS WebSocket Server
 * 
 * Sistema central de comunicação WebSocket para o WiltonOS.
 * Gerencia conexões em tempo real entre cliente-servidor e
 * coordena o estado quântico do sistema.
 */

import WebSocket from 'ws';
import { logger } from './logger.js';

// WebSocketServer é uma classe em ws
const WebSocketServer = WebSocket.Server;

// Estado global do sistema WebSocket
const wsState = {
  connections: new Set(),
  quantumRatio: { coherence: 2, chaos: 2 },
  activeMode: 'wilton',
  activeModules: {},
  lastSyncTimestamp: null
};

// Mapear conexões por tipo
const connectionsByType = {
  agent: new Set(),
  client: new Set(),
  bridge: new Set(),
  admin: new Set()
};

// Manipuladores de mensagens por tipo
const messageHandlers = {};

// Opções de debug
const DEBUG_MODE = process.env.DEBUG_WS === 'true';

/**
 * Inicializa o servidor WebSocket e registra no servidor HTTP
 * @param {object} httpServer - Servidor HTTP para ancorar o WebSocket
 * @returns {WebSocketServer} - Instância do servidor WebSocket
 */
export function initializeWebSocketServer(httpServer) {
  logger.info('[WS] Inicializando servidor WebSocket do WiltonOS');
  
  // Criar servidor WebSocket
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });
  
  logger.info('[WS] Servidor WebSocket configurado na rota /ws');
  
  // Registrar manipuladores de eventos
  wss.on('connection', handleConnection);
  
  // Iniciar verificação de conexões
  setInterval(checkConnections, 30000);
  
  // Retornar servidor para uso externo
  return wss;
}

/**
 * Manipula novas conexões WebSocket
 * @param {WebSocket} socket - Conexão WebSocket
 */
function handleConnection(socket, request) {
  logger.info('[WS] Nova conexão WebSocket estabelecida');
  
  // Adicionar à lista global de conexões
  wsState.connections.add(socket);
  
  // Definir tipo de cliente padrão
  socket.clientType = 'client';
  socket.clientId = `client-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Adicionar à lista específica
  connectionsByType.client.add(socket);
  
  // Armazenar timestamp de conexão
  socket.connectedAt = Date.now();
  
  // Enviar estado atual do sistema
  sendSystemState(socket);
  
  // Registrar manipuladores de eventos
  socket.on('message', (message) => handleMessage(socket, message));
  socket.on('close', () => handleDisconnection(socket));
  socket.on('error', (error) => handleSocketError(socket, error));
  
  // Depuração
  if (DEBUG_MODE) {
    logger.debug(`[WS] Conexão estabelecida: ${socket.clientType}:${socket.clientId}`);
    logger.debug(`[WS] Total de conexões: ${wsState.connections.size}`);
  }
}

/**
 * Manipula mensagens recebidas dos clientes
 * @param {WebSocket} socket - Conexão WebSocket
 * @param {string} message - Mensagem recebida
 */
function handleMessage(socket, message) {
  try {
    // Parsear mensagem
    const data = JSON.parse(message);
    
    if (DEBUG_MODE) {
      logger.debug(`[WS] Mensagem recebida de ${socket.clientType}:${socket.clientId}: ${data.type}`);
    }
    
    // Verificar tipo de mensagem
    if (!data.type) {
      sendErrorToClient(socket, 'Mensagem sem tipo definido');
      return;
    }
    
    // Processar mensagem de autenticação/identificação
    if (data.type === 'identify') {
      handleIdentification(socket, data);
      return;
    }
    
    // Processar mensagem de ping
    if (data.type === 'ping') {
      socket.send(JSON.stringify({
        type: 'pong',
        timestamp: Date.now(),
        serverTime: new Date().toISOString()
      }));
      return;
    }
    
    // Processar solicitação de estado do sistema
    if (data.type === 'get_state') {
      sendSystemState(socket);
      return;
    }
    
    // Processar atualização de estado quântico
    if (data.type === 'update_quantum_ratio') {
      updateQuantumRatio(data, socket);
      return;
    }
    
    // Processar atualização de modo ativo
    if (data.type === 'update_active_mode') {
      updateActiveMode(data, socket);
      return;
    }
    
    // Processar atualização de módulos ativos
    if (data.type === 'update_module_state') {
      updateModuleState(data, socket);
      return;
    }
    
    // Verificar se existe manipulador específico para o tipo
    if (messageHandlers[data.type]) {
      messageHandlers[data.type](socket, data);
      return;
    }
    
    // Se chegou aqui, é um tipo desconhecido
    logger.warn(`[WS] Tipo de mensagem desconhecido: ${data.type}`);
    sendErrorToClient(socket, `Tipo de mensagem desconhecido: ${data.type}`);
    
  } catch (error) {
    logger.error(`[WS] Erro ao processar mensagem: ${error.message}`);
    sendErrorToClient(socket, `Erro ao processar mensagem: ${error.message}`);
  }
}

/**
 * Processa mensagem de identificação do cliente
 * @param {WebSocket} socket - Conexão WebSocket
 * @param {object} data - Dados da mensagem
 */
function handleIdentification(socket, data) {
  // Remover da categoria atual
  if (socket.clientType && connectionsByType[socket.clientType]) {
    connectionsByType[socket.clientType].delete(socket);
  }
  
  // Atualizar tipo de cliente
  const clientType = data.clientType || 'client';
  socket.clientType = clientType;
  
  // Validar tipo de cliente
  if (!connectionsByType[clientType]) {
    connectionsByType[clientType] = new Set();
  }
  
  // Adicionar à nova categoria
  connectionsByType[clientType].add(socket);
  
  // Atualizar ID do cliente
  if (data.clientId) {
    socket.clientId = data.clientId;
  }
  
  // Registrar metadados adicionais
  if (data.metadata) {
    socket.metadata = data.metadata;
  }
  
  logger.info(`[WS] Cliente identificado como ${clientType}:${socket.clientId}`);
  
  // Confirmar identificação
  socket.send(JSON.stringify({
    type: 'identification_confirmed',
    clientType,
    clientId: socket.clientId,
    timestamp: Date.now()
  }));
}

/**
 * Manipula desconexão de clientes
 * @param {WebSocket} socket - Conexão WebSocket
 */
function handleDisconnection(socket) {
  logger.info(`[WS] Cliente desconectado: ${socket.clientType}:${socket.clientId}`);
  
  // Remover das listas
  wsState.connections.delete(socket);
  
  if (socket.clientType && connectionsByType[socket.clientType]) {
    connectionsByType[socket.clientType].delete(socket);
  }
  
  if (DEBUG_MODE) {
    logger.debug(`[WS] Total de conexões após desconexão: ${wsState.connections.size}`);
  }
}

/**
 * Manipula erros de socket
 * @param {WebSocket} socket - Conexão WebSocket
 * @param {Error} error - Erro ocorrido
 */
function handleSocketError(socket, error) {
  logger.error(`[WS] Erro em conexão WebSocket ${socket.clientType}:${socket.clientId}: ${error.message}`);
  
  // Tentar enviar mensagem de erro para o cliente
  try {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Erro interno no servidor',
        timestamp: Date.now()
      }));
    }
  } catch (sendError) {
    logger.error(`[WS] Erro ao enviar mensagem de erro: ${sendError.message}`);
  }
  
  // Fechar conexão em caso de erro grave
  try {
    socket.terminate();
  } catch (closeError) {
    logger.error(`[WS] Erro ao terminar conexão: ${closeError.message}`);
  }
  
  // Remover das listas
  wsState.connections.delete(socket);
  
  if (socket.clientType && connectionsByType[socket.clientType]) {
    connectionsByType[socket.clientType].delete(socket);
  }
}

/**
 * Envia estado do sistema para o cliente
 * @param {WebSocket} socket - Conexão WebSocket
 */
function sendSystemState(socket) {
  try {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }
    
    socket.send(JSON.stringify({
      type: 'system_state',
      quantumRatio: wsState.quantumRatio,
      activeMode: wsState.activeMode,
      activeModules: wsState.activeModules,
      serverTime: new Date().toISOString(),
      timestamp: Date.now()
    }));
  } catch (error) {
    logger.error(`[WS] Erro ao enviar estado do sistema: ${error.message}`);
  }
}

/**
 * Atualiza a proporção quântica do sistema
 * @param {object} data - Dados da mensagem
 * @param {WebSocket} sender - Socket que enviou a mensagem
 */
function updateQuantumRatio(data, sender) {
  // Validar dados
  if (!data.coherence || !data.chaos) {
    sendErrorToClient(sender, 'Proporção quântica inválida');
    return;
  }
  
  // Atualizar estado
  wsState.quantumRatio = {
    coherence: parseInt(data.coherence),
    chaos: parseInt(data.chaos)
  };
  
  wsState.lastSyncTimestamp = Date.now();
  
  logger.info(`[WS] Proporção quântica atualizada: ${wsState.quantumRatio.coherence}:${wsState.quantumRatio.chaos}`);
  
  // Broadcast para todos os clientes
  broadcastSystemState();
}

/**
 * Atualiza o modo ativo do sistema
 * @param {object} data - Dados da mensagem
 * @param {WebSocket} sender - Socket que enviou a mensagem
 */
function updateActiveMode(data, sender) {
  // Validar dados
  if (!data.mode) {
    sendErrorToClient(sender, 'Modo ativo inválido');
    return;
  }
  
  // Validar modo
  const validModes = ['wilton', 'zews', 'quantum'];
  if (!validModes.includes(data.mode)) {
    sendErrorToClient(sender, `Modo inválido: ${data.mode}`);
    return;
  }
  
  // Atualizar estado
  wsState.activeMode = data.mode;
  wsState.lastSyncTimestamp = Date.now();
  
  logger.info(`[WS] Modo ativo atualizado: ${wsState.activeMode}`);
  
  // Broadcast para todos os clientes
  broadcastSystemState();
}

/**
 * Atualiza o estado de um módulo
 * @param {object} data - Dados da mensagem
 * @param {WebSocket} sender - Socket que enviou a mensagem
 */
function updateModuleState(data, sender) {
  // Validar dados
  if (!data.moduleId || data.active === undefined) {
    sendErrorToClient(sender, 'Dados de módulo inválidos');
    return;
  }
  
  // Atualizar estado
  wsState.activeModules[data.moduleId] = {
    active: data.active,
    updatedAt: Date.now(),
    updatedBy: sender.clientId
  };
  
  wsState.lastSyncTimestamp = Date.now();
  
  logger.info(`[WS] Módulo ${data.moduleId} ${data.active ? 'ativado' : 'desativado'}`);
  
  // Broadcast para todos os clientes
  broadcastSystemState();
  
  // Confirmar atualização
  sender.send(JSON.stringify({
    type: 'module_state_updated',
    moduleId: data.moduleId,
    active: data.active,
    timestamp: Date.now()
  }));
}

/**
 * Envia erro para o cliente
 * @param {WebSocket} socket - Conexão WebSocket
 * @param {string} message - Mensagem de erro
 */
function sendErrorToClient(socket, message) {
  try {
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }
    
    socket.send(JSON.stringify({
      type: 'error',
      message,
      timestamp: Date.now()
    }));
  } catch (error) {
    logger.error(`[WS] Erro ao enviar mensagem de erro: ${error.message}`);
  }
}

/**
 * Envia o estado atual do sistema para todos os clientes
 */
function broadcastSystemState() {
  const message = JSON.stringify({
    type: 'system_state',
    quantumRatio: wsState.quantumRatio,
    activeMode: wsState.activeMode,
    activeModules: wsState.activeModules,
    serverTime: new Date().toISOString(),
    timestamp: Date.now()
  });
  
  broadcast(message);
}

/**
 * Envia uma mensagem para todos os clientes conectados
 * @param {string} message - Mensagem a ser enviada
 */
function broadcast(message) {
  wsState.connections.forEach(socket => {
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    } catch (error) {
      logger.error(`[WS] Erro ao enviar broadcast: ${error.message}`);
    }
  });
}

/**
 * Envia uma mensagem para um tipo específico de cliente
 * @param {string} clientType - Tipo de cliente
 * @param {object} data - Mensagem a ser enviada
 */
function broadcastToType(clientType, data) {
  const message = JSON.stringify(data);
  
  if (!connectionsByType[clientType]) {
    logger.warn(`[WS] Tipo de cliente inválido para broadcast: ${clientType}`);
    return;
  }
  
  connectionsByType[clientType].forEach(socket => {
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    } catch (error) {
      logger.error(`[WS] Erro ao enviar broadcast para ${clientType}: ${error.message}`);
    }
  });
}

/**
 * Verifica conexões regularmente e remove conexões inativas
 */
function checkConnections() {
  const now = Date.now();
  const inactiveThreshold = 5 * 60 * 1000; // 5 minutos
  
  wsState.connections.forEach(socket => {
    // Verificar se conexão está ativa
    if (now - socket.connectedAt > inactiveThreshold && !socket.lastActivity) {
      logger.warn(`[WS] Conexão inativa detectada: ${socket.clientType}:${socket.clientId}`);
      
      try {
        // Enviar aviso
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'warning',
            message: 'Conexão inativa. Envie ping para manter ativa.',
            timestamp: now
          }));
        }
      } catch (error) {
        logger.error(`[WS] Erro ao enviar aviso de inatividade: ${error.message}`);
      }
    }
  });
}

/**
 * Registra um manipulador de mensagens personalizado
 * @param {string} messageType - Tipo de mensagem
 * @param {Function} handler - Função manipuladora
 */
export function registerMessageHandler(messageType, handler) {
  if (typeof handler !== 'function') {
    throw new Error('O manipulador deve ser uma função');
  }
  
  messageHandlers[messageType] = handler;
  logger.info(`[WS] Registrado manipulador para mensagem: ${messageType}`);
}

/**
 * Obtém estatísticas das conexões WebSocket
 * @returns {object} Estatísticas de conexões
 */
export function getWebSocketStats() {
  return {
    totalConnections: wsState.connections.size,
    byType: {
      client: connectionsByType.client.size,
      agent: connectionsByType.agent.size,
      bridge: connectionsByType.bridge.size,
      admin: connectionsByType.admin.size
    },
    quantumRatio: wsState.quantumRatio,
    activeMode: wsState.activeMode,
    lastSyncTimestamp: wsState.lastSyncTimestamp
  };
}

/**
 * Envia uma mensagem para um cliente específico
 * @param {string} clientId - ID do cliente
 * @param {object} data - Dados da mensagem
 * @returns {boolean} Sucesso do envio
 */
export function sendToClient(clientId, data) {
  let sent = false;
  
  wsState.connections.forEach(socket => {
    if (socket.clientId === clientId && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify(data));
        sent = true;
      } catch (error) {
        logger.error(`[WS] Erro ao enviar mensagem para cliente ${clientId}: ${error.message}`);
      }
    }
  });
  
  return sent;
}

/**
 * API externa para broadcast
 * @param {object} data - Dados a serem enviados
 */
export function broadcastMessage(data) {
  broadcast(JSON.stringify(data));
}

/**
 * API externa para broadcast por tipo
 * @param {string} clientType - Tipo de cliente
 * @param {object} data - Dados a serem enviados
 */
export function broadcastMessageToType(clientType, data) {
  broadcastToType(clientType, data);
}

/**
 * Atualiza o estado quântico do sistema externamente
 * @param {object} newRatio - Nova proporção quântica
 */
export function setQuantumRatio(newRatio) {
  if (!newRatio || !newRatio.coherence || !newRatio.chaos) {
    throw new Error('Proporção quântica inválida');
  }
  
  wsState.quantumRatio = {
    coherence: parseInt(newRatio.coherence),
    chaos: parseInt(newRatio.chaos)
  };
  
  wsState.lastSyncTimestamp = Date.now();
  broadcastSystemState();
  
  return wsState.quantumRatio;
}

/**
 * Atualiza o modo ativo do sistema externamente
 * @param {string} mode - Novo modo ativo
 */
export function setActiveMode(mode) {
  const validModes = ['wilton', 'zews', 'quantum'];
  if (!validModes.includes(mode)) {
    throw new Error(`Modo inválido: ${mode}`);
  }
  
  wsState.activeMode = mode;
  wsState.lastSyncTimestamp = Date.now();
  broadcastSystemState();
  
  return wsState.activeMode;
}

export default {
  initializeWebSocketServer,
  registerMessageHandler,
  getWebSocketStats,
  broadcastMessage,
  broadcastMessageToType,
  sendToClient,
  setQuantumRatio,
  setActiveMode
};