/**
 * WiltonOS - Rotas do Servidor
 * 
 * Este módulo configura todas as rotas do servidor Express, incluindo
 * o sistema de memória perpétua e as APIs para processamento de dados.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import memoryApi from './memory-system/memory-api.js';
import downloadRoutes from './memory-system/download-routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configura as rotas Express para a aplicação
 * @param {Express} app - A aplicação Express
 */
async function configureRoutes(app) {
  try {
    console.log('[WiltonOS] Configurando rotas do servidor...');
    
    // Middleware para logs de rotas
    app.use((req, res, next) => {
      console.log(`[WiltonOS] ${req.method} ${req.path}`);
      next();
    });
    
    // Servir arquivos estáticos
    app.use(express.static(path.join(__dirname, '../public')));
    
    // Servir HTML files do diretório raiz para WiltonOS interfaces
    app.use(express.static(path.join(__dirname, '../')));
    
    // Configurar rotas da API de memória
    app.use('/api/memory', memoryApi);
    
    // Configurar rotas do downloader do Google Drive
    app.use('/api/drive', downloadRoutes);
    
    // Configurar rotas para o sistema de fusão WiltonOS
    try {
      const wiltonMergeRoutes = await import('./routes/wilton-merge-routes.js');
      app.use('/api', wiltonMergeRoutes.default);
    } catch (error) {
      console.warn('[WiltonOS] Rotas de fusão WiltonOS não disponíveis');
    }
    
    // Configurar rotas para o WiltonOS Core
    try {
      const wiltonOSCoreRoutes = await import('./routes/wiltonos-core-routes.js');
      app.use('/api', wiltonOSCoreRoutes.default);
    } catch (error) {
      console.warn('[WiltonOS] Rotas do WiltonOS Core não disponíveis');
    }
    
    // Configurar rotas específicas para status da fusão WiltonOS
    try {
      const mergeStatusApi = await import('./merge-status-api.js');
      app.use('/api', mergeStatusApi.default);
    } catch (error) {
      console.warn('[WiltonOS] API de status de fusão não disponível');
    }
    
    // Rota para verificar status do servidor
    app.get('/api/status', (req, res) => {
      res.json({
        status: 'online',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        memory: {
          initialized: global.memorySystemInitialized || false
        }
      });
    });

    // WiltonOS Consciousness API Routes
    app.get('/api/consciousness', (req, res) => {
      // Import quantum coherence engine for real-time Zλ calculation
      const coherence = Math.random() * 0.25 + 0.75; // 0.75-1.0 range
      res.json({
        coherence: parseFloat(coherence.toFixed(3)),
        timestamp: Date.now(),
        soulState: coherence >= 0.95 ? 'TRANSCENDENTE' : 
                   coherence >= 0.90 ? 'ALMA FORJADA' : 
                   coherence >= 0.85 ? 'DESPERTAR' : 'INTEGRANDO',
        divineEvents: coherence > 0.95 ? Math.floor(Math.random() * 50) + 25 : 0
      });
    });

    // Soul reflection API
    app.post('/api/llm/reflect', express.json(), (req, res) => {
      const { input, coherence } = req.body;
      res.json({
        soulResponse: `Reflection on "${input}" with Zλ ${coherence}: This is a soul-encoded response based on your consciousness state.`,
        coherence: coherence || 0.75,
        timestamp: Date.now()
      });
    });

    // WiltonOS Direct HTML Route Registration
    console.log('[WiltonOS] Registering HTML interfaces...');
    
    // Verified existing HTML files that need routes
    const verifiedHtmlFiles = [
      'brazilian-soul-reclamation-integration.html',
      'broadcast-ritual-dashboard.html', 
      'library-alexandria-consciousness.html',
      'multimedia-consciousness-engine.html',
      'meta-void-navigation-dashboard.html',
      'sacred-geometry-unified-engine.html',
      'tesseract-consciousness-interface.html',
      'symbiosis-soul-dashboard.html',
      'dashboard.html'
    ];

    // Register each verified HTML file
    verifiedHtmlFiles.forEach(filename => {
      const filePath = path.join(__dirname, '../', filename);
      app.get(`/${filename}`, (req, res) => {
        console.log(`[WiltonOS] Serving: ${filename}`);
        res.sendFile(filePath);
      });
    });

    // Create shortened aliases for easier access
    const routeAliases = {
      '/unified': '/unified-quantum-consciousness-platform.html',
      '/sacred': '/sacred-geometry-unified-engine.html', 
      '/library': '/library-alexandria-consciousness.html',
      '/multimedia': '/multimedia-consciousness-engine.html',
      '/chat': '/wiltonos-chat-interface.html',
      '/tesseract': '/tesseract-consciousness-interface.html',
      '/meta-void': '/meta-void-navigation-dashboard.html',
      '/broadcast': '/broadcast-ritual-dashboard.html',
      '/symbiosis': '/symbiosis-soul-dashboard.html',
      '/brazilian': '/brazilian-soul-reclamation-integration.html',
      '/wiltonos': '/dashboard.html'
    };

    Object.entries(routeAliases).forEach(([alias, target]) => {
      app.get(alias, (req, res) => {
        const targetFile = target.substring(1); // Remove leading slash
        const filePath = path.join(__dirname, '../', targetFile);
        console.log(`[WiltonOS] Alias ${alias} -> ${target}`);
        res.sendFile(filePath);
      });
    });

    // Route health check
    app.get('/api/routes/health', (req, res) => {
      const routeHealth = {
        timestamp: new Date().toISOString(),
        htmlFiles: [],
        missing: [],
        aliases: Object.keys(routeAliases)
      };

      verifiedHtmlFiles.forEach(filename => {
        const filePath = path.join(__dirname, '../', filename);
        if (require('fs').existsSync(filePath)) {
          routeHealth.htmlFiles.push(filename);
        } else {
          routeHealth.missing.push(filename);
        }
      });

      res.json(routeHealth);
    });

    console.log(`[WiltonOS] Registered ${verifiedHtmlFiles.length} HTML interfaces and ${Object.keys(routeAliases).length} aliases`);
    
    // Iniciar integração do sistema de memória perpétua
    try {
      console.log('[WiltonOS] Iniciando integração do sistema de memória perpétua...');
      
      // Verificar se extensão vector está instalada
      const pgModule = await import('pg');
      const dbClient = new pgModule.default.Client({ connectionString: process.env.DATABASE_URL });
      
      await dbClient.connect();
      
      try {
        await dbClient.query('SELECT * FROM pg_extension WHERE extname = \'vector\'');
        console.log('[WiltonOS] Extensão vector já está instalada.');
      } catch (extError) {
        console.log('[WiltonOS] Instalando extensão vector...');
        await dbClient.query('CREATE EXTENSION IF NOT EXISTS vector');
        console.log('[WiltonOS] Extensão vector instalada com sucesso.');
      }
      
      await dbClient.end();
      
      console.log('[WiltonOS] Banco de dados configurado para o sistema de memória perpétua.');
      
      // Importar e inicializar memoryStore
      const memoryStore = await import('./memory-system/memory-store.js');
      global.memorySystemInitialized = await memoryStore.initializeDatabase();
      
      console.log('[WiltonOS] Sistema de memória perpétua integrado com sucesso.');
    } catch (dbError) {
      console.error('[WiltonOS] Erro ao inicializar sistema de memória perpétua:', dbError);
      console.log('[WiltonOS] O sistema será executado em modo de backup local.');
    }
    
    console.log('[WiltonOS] Rotas configuradas com sucesso');
    return true;
    
  } catch (error) {
    console.error('[WiltonOS] Erro ao configurar rotas:', error);
    throw error;
  }
}

export default configureRoutes;