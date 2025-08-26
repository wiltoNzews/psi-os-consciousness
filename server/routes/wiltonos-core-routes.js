/**
 * Rotas para o WiltonOS Core
 * 
 * Este módulo fornece as rotas relacionadas ao WiltonOS Core, incluindo
 * acesso ao sistema de inicialização, clusters de contexto e configurações.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Carregar o sistema de inicialização
let startupSystem;
try {
  startupSystem = require('../../WiltonOS_Core/Modules/Module_0_Boot/startup');
} catch (error) {
  console.error('[WiltonOS] Erro ao carregar sistema de inicialização:', error);
  startupSystem = null;
}

/**
 * GET /api/wiltonos/status
 * Retorna o status atual do WiltonOS Core
 */
router.get('/wiltonos/status', (req, res) => {
  try {
    // Verificar se o sistema está disponível
    if (!startupSystem) {
      return res.status(500).json({
        success: false,
        message: 'Sistema de inicialização não disponível'
      });
    }
    
    // Carregar configuração
    const config = startupSystem.loadConfig();
    
    // Verificar diretórios
    const wiltonOSCorePath = path.join(process.cwd(), 'WiltonOS_Core');
    const coreExists = fs.existsSync(wiltonOSCorePath);
    
    const metadata = {
      core_available: coreExists,
      config_available: !!config,
      context_clusters_available: false,
      memory_keys_available: false
    };
    
    // Verificar clusters de contexto
    if (coreExists) {
      const contextClustersPath = path.join(wiltonOSCorePath, 'ContextClusters');
      metadata.context_clusters_available = fs.existsSync(contextClustersPath);
      
      // Verificar chaves de memória
      const memoryKeysPath = path.join(wiltonOSCorePath, 'Meta', 'MemoryKeys.json');
      metadata.memory_keys_available = fs.existsSync(memoryKeysPath);
    }
    
    res.json({
      success: true,
      identity: config?.default_identity || 'Usuário',
      ui_mode: config?.ui_mode || 'Default',
      glyph_state: config?.glyph_state || 'None',
      metadata
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao verificar status do WiltonOS Core:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao verificar status: ${error.message}`
    });
  }
});

/**
 * GET /api/wiltonos/init
 * Inicializa o sistema e retorna o estado inicial
 */
router.get('/wiltonos/init', (req, res) => {
  try {
    // Verificar se o sistema está disponível
    if (!startupSystem) {
      return res.status(500).json({
        success: false,
        message: 'Sistema de inicialização não disponível'
      });
    }
    
    // Inicializar sistema
    const initialState = startupSystem.initializeSystem();
    
    res.json({
      success: true,
      state: initialState
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao inicializar WiltonOS Core:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao inicializar: ${error.message}`
    });
  }
});

/**
 * GET /api/wiltonos/clusters
 * Retorna todos os clusters de contexto disponíveis
 */
router.get('/wiltonos/clusters', (req, res) => {
  try {
    // Verificar se o sistema está disponível
    if (!startupSystem) {
      return res.status(500).json({
        success: false,
        message: 'Sistema de inicialização não disponível'
      });
    }
    
    // Carregar clusters
    const clusters = startupSystem.loadContextClusters();
    
    res.json({
      success: true,
      clusters
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao carregar clusters de contexto:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao carregar clusters: ${error.message}`
    });
  }
});

/**
 * GET /api/wiltonos/cluster/:type/:id
 * Retorna o conteúdo de um cluster específico
 */
router.get('/wiltonos/cluster/:type/:id', (req, res) => {
  try {
    // Verificar se o sistema está disponível
    if (!startupSystem) {
      return res.status(500).json({
        success: false,
        message: 'Sistema de inicialização não disponível'
      });
    }
    
    const { type, id } = req.params;
    
    // Construir caminho para o arquivo
    const clusterPath = path.join(
      process.cwd(),
      'WiltonOS_Core/ContextClusters',
      type,
      `${id}.md`
    );
    
    // Carregar conteúdo
    const content = startupSystem.loadMemoryContent(clusterPath);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Cluster não encontrado'
      });
    }
    
    res.json({
      success: true,
      type,
      id,
      content
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao carregar conteúdo de cluster:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao carregar conteúdo: ${error.message}`
    });
  }
});

/**
 * GET /api/wiltonos/memory-keys
 * Retorna as chaves de memória
 */
router.get('/wiltonos/memory-keys', (req, res) => {
  try {
    // Verificar se o sistema está disponível
    if (!startupSystem) {
      return res.status(500).json({
        success: false,
        message: 'Sistema de inicialização não disponível'
      });
    }
    
    // Carregar chaves de memória
    const memoryKeys = startupSystem.loadMemoryKeys();
    
    if (!memoryKeys) {
      return res.status(404).json({
        success: false,
        message: 'Chaves de memória não encontradas'
      });
    }
    
    res.json({
      success: true,
      memoryKeys
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao carregar chaves de memória:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao carregar chaves de memória: ${error.message}`
    });
  }
});

module.exports = router;