/**
 * ZEWS WebSocket Routes
 * 
 * Implementação específica de rotas WebSocket para o ZEWS (Complexo Simbólico)
 * Este módulo gerencia a comunicação em tempo real com o Agent Router do WiltonOS.
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
// Importar logger
import logger from '../logger.js';
import { registerMessageHandler } from '../websocket-server.js';

// Estado local do ZEWS
const zewsState = {
  rituals: {},
  scenes: {},
  gestures: {},
  activeModules: {},
  quantumState: {
    coherence: 2,
    chaos: 2,
    mode: 'wilton'
  },
  lastEvents: []
};

// Carregar estado inicial
async function loadInitialState() {
  try {
    // Verificar se o arquivo existe
    try {
      await fs.access(path.join(process.cwd(), 'state/zews-state.json'));
    } catch (error) {
      // Criar diretório de estado se não existir
      try {
        await fs.mkdir(path.join(process.cwd(), 'state'), { recursive: true });
      } catch (mkdirError) {
        // Ignorar erro se diretório já existir
      }
      
      // Salvar estado inicial
      await fs.writeFile(
        path.join(process.cwd(), 'state/zews-state.json'),
        JSON.stringify(zewsState, null, 2)
      );
      
      return;
    }
    
    // Carregar estado
    const rawData = await fs.readFile(path.join(process.cwd(), 'state/zews-state.json'), 'utf8');
    const savedState = JSON.parse(rawData);
    
    // Mesclar com estado atual
    Object.assign(zewsState, savedState);
    
    logger.info('[ZEWS-WS] Estado inicial carregado com sucesso');
  } catch (error) {
    logger.error(`[ZEWS-WS] Erro ao carregar estado inicial: ${error.message}`);
  }
}

// Salvar estado do ZEWS
async function saveState() {
  try {
    await fs.writeFile(
      path.join(process.cwd(), 'state/zews-state.json'),
      JSON.stringify(zewsState, null, 2)
    );
    
    logger.debug('[ZEWS-WS] Estado do ZEWS salvo com sucesso');
  } catch (error) {
    logger.error(`[ZEWS-WS] Erro ao salvar estado do ZEWS: ${error.message}`);
  }
}

// Inicializar handlers WebSocket
function initializeZewsWebSocketHandlers() {
  logger.info('[ZEWS-WS] Registrando handlers WebSocket para ZEWS');
  
  // Handler para mensagens de identificação de agente
  registerMessageHandler('zews.identify', handleAgentIdentification);
  
  // Handler para mensagens de estado do Agent Router
  registerMessageHandler('agent.state', handleAgentState);
  
  // Handler para mensagens de execução de ritual
  registerMessageHandler('ritual.execute', handleRitualExecution);
  
  // Handler para mensagens de mudança de modo
  registerMessageHandler('mode.change', handleModeChange);
  
  // Handler para mensagens de atualização de proporção quântica
  registerMessageHandler('quantum.update', handleQuantumUpdate);
  
  // Handler para mensagens de ativação de módulo
  registerMessageHandler('module.toggle', handleModuleToggle);
  
  logger.info('[ZEWS-WS] Handlers WebSocket registrados com sucesso');
}

/**
 * Handler para identificação de agente
 */
function handleAgentIdentification(socket, data) {
  logger.info(`[ZEWS-WS] Agente identificado: ${data.agentId}`);
  
  // Armazenar informações do agente
  socket.agentId = data.agentId;
  socket.agentVersion = data.version;
  socket.agentPlatform = data.platform;
  
  // Enviar confirmação e estado atual
  socket.send(JSON.stringify({
    type: 'zews.welcome',
    message: 'Bem-vindo ao ZEWS',
    timestamp: Date.now(),
    state: {
      quantumState: zewsState.quantumState,
      activeModules: zewsState.activeModules
    }
  }));
}

/**
 * Handler para atualização do estado do agente
 */
function handleAgentState(socket, data) {
  logger.debug(`[ZEWS-WS] Recebida atualização de estado do agente: ${socket.agentId}`);
  
  // Atualizar estado local do módulo
  if (data.moduleId && data.active !== undefined) {
    zewsState.activeModules[data.moduleId] = {
      active: data.active,
      updatedAt: Date.now()
    };
    
    // Salvar estado
    saveState();
    
    // Enviar confirmação
    socket.send(JSON.stringify({
      type: 'module.state.updated',
      moduleId: data.moduleId,
      active: data.active,
      timestamp: Date.now()
    }));
  }
}

/**
 * Handler para execução de ritual
 */
function handleRitualExecution(socket, data) {
  logger.info(`[ZEWS-WS] Solicitada execução de ritual: ${data.ritualName}`);
  
  // Validar nome do ritual
  if (!data.ritualName) {
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Nome do ritual não fornecido',
      timestamp: Date.now()
    }));
    return;
  }
  
  // Registrar execução do ritual
  zewsState.lastEvents.push({
    type: 'ritual',
    name: data.ritualName,
    timestamp: Date.now(),
    params: data.params || {}
  });
  
  // Limitar tamanho da lista de eventos
  if (zewsState.lastEvents.length > 100) {
    zewsState.lastEvents = zewsState.lastEvents.slice(-100);
  }
  
  // Salvar estado
  saveState();
  
  // Simular execução do ritual (em ambiente real, isso chamaria o processador de rituais)
  setTimeout(() => {
    // Enviar resposta de execução
    socket.send(JSON.stringify({
      type: 'ritual.executed',
      ritualName: data.ritualName,
      success: true,
      timestamp: Date.now(),
      duration: Math.floor(Math.random() * 1000) + 100 // Simulação de tempo de execução
    }));
  }, 500);
}

/**
 * Handler para mudança de modo
 */
function handleModeChange(socket, data) {
  logger.info(`[ZEWS-WS] Solicitada mudança de modo para: ${data.mode}`);
  
  // Validar modo
  const validModes = ['wilton', 'zews', 'quantum'];
  if (!data.mode || !validModes.includes(data.mode)) {
    socket.send(JSON.stringify({
      type: 'error',
      message: `Modo inválido: ${data.mode}`,
      timestamp: Date.now()
    }));
    return;
  }
  
  // Atualizar estado
  zewsState.quantumState.mode = data.mode;
  
  // Registrar evento
  zewsState.lastEvents.push({
    type: 'mode',
    name: data.mode,
    timestamp: Date.now()
  });
  
  // Salvar estado
  saveState();
  
  // Enviar confirmação
  socket.send(JSON.stringify({
    type: 'mode.changed',
    mode: data.mode,
    timestamp: Date.now()
  }));
}

/**
 * Handler para atualização de proporção quântica
 */
function handleQuantumUpdate(socket, data) {
  logger.info(`[ZEWS-WS] Atualização de proporção quântica: ${data.coherence}:${data.chaos}`);
  
  // Validar proporção
  if (!data.coherence || !data.chaos) {
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Proporção quântica inválida',
      timestamp: Date.now()
    }));
    return;
  }
  
  // Atualizar estado
  zewsState.quantumState.coherence = parseInt(data.coherence);
  zewsState.quantumState.chaos = parseInt(data.chaos);
  
  // Registrar evento
  zewsState.lastEvents.push({
    type: 'quantum',
    coherence: zewsState.quantumState.coherence,
    chaos: zewsState.quantumState.chaos,
    timestamp: Date.now()
  });
  
  // Salvar estado
  saveState();
  
  // Enviar confirmação
  socket.send(JSON.stringify({
    type: 'quantum.updated',
    coherence: zewsState.quantumState.coherence,
    chaos: zewsState.quantumState.chaos,
    timestamp: Date.now()
  }));
}

/**
 * Handler para ativação/desativação de módulos
 */
function handleModuleToggle(socket, data) {
  logger.info(`[ZEWS-WS] Alteração de estado de módulo: ${data.moduleId} -> ${data.active ? 'ativado' : 'desativado'}`);
  
  // Validar dados
  if (!data.moduleId || data.active === undefined) {
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Dados de módulo inválidos',
      timestamp: Date.now()
    }));
    return;
  }
  
  // Atualizar estado
  zewsState.activeModules[data.moduleId] = {
    active: data.active,
    updatedAt: Date.now()
  };
  
  // Registrar evento
  zewsState.lastEvents.push({
    type: 'module',
    moduleId: data.moduleId,
    active: data.active,
    timestamp: Date.now()
  });
  
  // Salvar estado
  saveState();
  
  // Enviar confirmação
  socket.send(JSON.stringify({
    type: 'module.toggled',
    moduleId: data.moduleId,
    active: data.active,
    timestamp: Date.now()
  }));
}

/**
 * Inicializa o módulo ZEWS WebSocket
 */
export function initializeZewsWebSocket() {
  // Carregar estado inicial
  loadInitialState().then(() => {
    // Inicializar handlers WebSocket
    initializeZewsWebSocketHandlers();
    
    logger.info('[ZEWS-WS] Módulo WebSocket do ZEWS inicializado com sucesso');
  });
}

/**
 * Obter estado atual do ZEWS
 */
export function getZewsState() {
  return {
    quantumState: zewsState.quantumState,
    activeModules: zewsState.activeModules,
    lastEvents: zewsState.lastEvents.slice(-10)
  };
}

// Criar router para API HTTP
const router = express.Router();

/**
 * Rota para obter estado atual do sistema via HTTP
 */
router.get('/state', (req, res) => {
  try {
    res.json({
      success: true,
      state: getZewsState()
    });
  } catch (error) {
    logger.error(`[ZEWS-WS] Erro ao obter estado do sistema via HTTP: ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: `Erro ao obter estado do sistema: ${error.message}`
    });
  }
});

/**
 * Rota para obter últimos eventos
 */
router.get('/events', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    res.json({
      success: true,
      events: zewsState.lastEvents.slice(-limit)
    });
  } catch (error) {
    logger.error(`[ZEWS-WS] Erro ao obter eventos do sistema via HTTP: ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: `Erro ao obter eventos do sistema: ${error.message}`
    });
  }
});

export default {
  router,
  initializeZewsWebSocket,
  getZewsState
};