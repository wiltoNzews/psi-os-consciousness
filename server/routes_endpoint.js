/**
 * API Routes para integração com LLMs locais
 * 
 * Este módulo fornece endpoints para comunicação entre o dashboard e LLMs locais.
 */

import express from 'express';

// Criar router Express
const router = express.Router();

// Configuração dos LLMs
const llmConfig = {
  connected: false,
  ollama: {
    available: false,
    models: []
  },
  deepseek: {
    available: false,
    models: []
  },
  activeModel: null
};

// Mapear conexões de bridges
const bridgeConnections = new Map();

// Endpoint: Status dos LLMs
router.get('/api/llm/status', (req, res) => {
  res.json({
    connected: llmConfig.connected,
    ollama: llmConfig.ollama,
    deepseek: llmConfig.deepseek,
    activeModel: llmConfig.activeModel,
    bridges: Array.from(bridgeConnections.keys())
  });
});

// Handler para mensagens WebSocket
export function handleLLMMessages(data, clientId) {
  console.log(`Mensagem LLM recebida de ${clientId}: ${data.type}`);
  
  // Bridge conectado
  if (data.type === 'bridge_connect') {
    llmConfig.connected = true;
    
    // Atualizar configuração
    if (data.llmStatus) {
      llmConfig.ollama.available = data.llmStatus.ollama;
      llmConfig.deepseek.available = data.llmStatus.deepseek;
      llmConfig.activeModel = data.llmStatus.activeModel;
    }
    
    // Registrar conexão
    bridgeConnections.set(clientId, {
      systemInfo: data.systemInfo,
      connectedAt: Date.now()
    });
    
    console.log(`Bridge LLM conectado: ${clientId}`);
  }
  
  // Atualização de status
  if (data.type === 'status_update') {
    if (data.llmStatus) {
      llmConfig.connected = data.llmStatus.connected;
      llmConfig.ollama.available = data.llmStatus.ollama;
      llmConfig.deepseek.available = data.llmStatus.deepseek;
      llmConfig.activeModel = data.llmStatus.activeModel;
    }
  }
}

// Exportar configuração e router
export { llmConfig, router };