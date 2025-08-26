/**
 * Main server routes for WiltonOS
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const ws = require('ws');
const { createServer } = require('http');

/**
 * Configure and register all routes for the WiltonOS server
 * @param {express.Express} app - Express application
 * @returns {http.Server} - The HTTP server with WebSocket support
 */
function setupServerRoutes(app) {
  // Create HTTP server
  const server = createServer(app);
  
  // Create WebSocket server
  const wss = new ws.WebSocketServer({ server, path: '/ws' });

  // WebSocket connection handling
  wss.on('connection', (ws, req) => {
    const clientId = req.headers['sec-websocket-key'] || Math.random().toString(36).substr(2, 9);
    console.log(`Nova conexão WebSocket: ${clientId}`);
    
    // Send initial status message
    ws.send(JSON.stringify({
      type: 'status_update',
      status: 'online',
      coherence: 1,
      timestamp: Date.now()
    }));
    
    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log(`Mensagem recebida: ${message}`);
        
        // Echo message back (for testing)
        ws.send(message);
        
        // Broadcast to all clients
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
        console.error(`Erro ao processar mensagem: ${error.message}`);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log(`Conexão WebSocket fechada: ${clientId}`);
    });
    
    // Send a heartbeat every 5 seconds
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

  // Static file serving - serve everything in public directory
  app.use(express.static(path.join(__dirname, '../public')));
  
  // API Route - System Status
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'online',
      version: '1.5.0',
      modules: {
        'wiltonos-core': 'active',
        'sigil-core': 'active',
        'z-geometry': 'active',
        'file-processor': 'active',
        'whatsapp-bridge': 'active'
      },
      coherence: 1.0,
      timestamp: Date.now()
    });
  });
  
  // Sacred Geometry API Endpoint
  app.post('/api/sacred-geometry/generate', (req, res) => {
    // This would typically call the actual generation function
    // For now, just return a sample response
    res.json({
      success: true,
      patternType: req.body.patternType || 'flower_of_life',
      dataUrl: 'data:image/svg+xml;base64,...', // Would be real base64 data
      timestamp: Date.now()
    });
  });
  
  // SIGIL-CORE API Endpoint
  app.post('/api/sigil-core/generate', (req, res) => {
    // This would typically call the SIGIL-CORE service
    // For now, just return a sample response
    res.json({
      success: true,
      model: req.body.model || 'dalle3',
      status: 'completed',
      resultUrl: 'https://example.com/image.png', // Would be real URL
      timestamp: Date.now()
    });
  });
  
  // Main route handler - send appropriate HTML
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/zews.html'));
  });
  
  // Catch-all route handler for all other routes
  app.get('*', (req, res) => {
    // Check if file exists
    const filePath = path.join(__dirname, '../public', req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }
    
    // If request for a specific module or API, check if it exists
    const routeParts = req.path.split('/').filter(Boolean);
    if (routeParts.length > 0) {
      const moduleOrApi = routeParts[0];
      
      // Specific module redirects
      if (moduleOrApi === 'sigil-core' || 
          moduleOrApi === 'z-geometry' || 
          moduleOrApi === 'quantum-vault' ||
          moduleOrApi === 'file-processor' ||
          moduleOrApi === 'oracle') {
        return res.sendFile(path.join(__dirname, '../public/zews.html'));
      }
      
      // API redirects
      if (moduleOrApi === 'api') {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
    }
    
    // For everything else, redirect to main ZEWS interface
    res.sendFile(path.join(__dirname, '../public/zews.html'));
  });
  
  return server;
}

module.exports = setupServerRoutes;