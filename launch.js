/**
 * WiltonOS Launch Script
 * 
 * This script manages the startup sequence for WiltonOS, handling both:
 * 1. Starting a port redirector on port 4000 (to satisfy Replit)
 * 2. Launching the main WiltonOS server on port 3000
 * 
 * This is the primary entry point for the application. Use this instead of direct
 * server execution to handle port conflict resolution in Replit environment.
 */

import { spawn } from 'child_process';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Configure port redirector
const redirectorApp = express();
const REPLIT_PORT = 4000; // Changed from 5000 as it seems to be in use
const TARGET_PORT = 3000;

console.log('🔮 [WILTONOS] Starting WiltonOS launch sequence...');
console.log(`🔮 [WILTONOS] Initializing port redirector from ${REPLIT_PORT} → ${TARGET_PORT}`);

// Create a basic response while the server is starting
redirectorApp.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WiltonOS - Loading</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: #111;
          color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .container {
          max-width: 600px;
          padding: 2rem;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #6b73ff 0%, #a778ff 50%, #ff6b8b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .loading {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
          margin: 2rem 0;
        }
        .loading div {
          position: absolute;
          top: 33px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6b73ff 0%, #a778ff 50%, #ff6b8b 100%);
          animation-timing-function: cubic-bezier(0, 1, 1, 0);
        }
        .loading div:nth-child(1) {
          left: 8px;
          animation: loading1 0.6s infinite;
        }
        .loading div:nth-child(2) {
          left: 8px;
          animation: loading2 0.6s infinite;
        }
        .loading div:nth-child(3) {
          left: 32px;
          animation: loading2 0.6s infinite;
        }
        .loading div:nth-child(4) {
          left: 56px;
          animation: loading3 0.6s infinite;
        }
        @keyframes loading1 {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes loading3 {
          0% { transform: scale(1); }
          100% { transform: scale(0); }
        }
        @keyframes loading2 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(24px, 0); }
        }
        p {
          font-size: 1.2rem;
          line-height: 1.5;
          opacity: 0.8;
        }
        .ratio {
          margin-top: 2rem;
          font-size: 0.9rem;
          opacity: 0.6;
          font-family: monospace;
        }
      </style>
      <script>
        // Auto-refresh after 5 seconds to check if main server is ready
        setTimeout(() => {
          window.location.href = '/';
        }, 5000);
      </script>
    </head>
    <body>
      <div class="container">
        <h1>WiltonOS Quantum Core</h1>
        <div class="loading"><div></div><div></div><div></div><div></div></div>
        <p>Initializing OROBORO NEXUS components...</p>
        <p>The system is currently maintaining the perfect 3:1 quantum balance ratio while loading.</p>
        <div class="ratio">ψ = 0.7500/0.2494</div>
      </div>
    </body>
    </html>
  `);
});

// Start the main WiltonOS server
function startMainServer() {
  console.log('🔮 [WILTONOS] Launching main WiltonOS server on port 3000...');
  
  const server = spawn('tsx', ['server/index.ts'], { 
    env: { ...process.env, PORT: TARGET_PORT },
    stdio: 'inherit'
  });
  
  server.on('error', (err) => {
    console.error('❌ [WILTONOS] Failed to start main server:', err);
    process.exit(1);
  });
  
  // When the server process exits, also exit this script
  server.on('close', (code) => {
    console.log(`🔮 [WILTONOS] Main server exited with code ${code}`);
    process.exit(code);
  });
  
  return server;
}

// Start the port redirector first
const redirectorServer = redirectorApp.listen(REPLIT_PORT, '0.0.0.0', () => {
  console.log(`🔮 [WILTONOS] Port redirector running on port ${REPLIT_PORT}`);
  
  // Start the main server after redirector is ready
  const mainServer = startMainServer();
  
  // Wait a bit for the main server to start, then set up the proxy
  setTimeout(() => {
    console.log(`🔮 [WILTONOS] Setting up proxy from port ${REPLIT_PORT} to ${TARGET_PORT}...`);
    
    // Remove the loading page route
    redirectorApp._router.stack.pop();
    
    // Add the proxy middleware for all requests
    redirectorApp.use('/', createProxyMiddleware({
      target: `http://localhost:${TARGET_PORT}`,
      changeOrigin: true,
      ws: true,
      logLevel: 'silent',
      onError: (err, req, res) => {
        console.error('❌ [WILTONOS] Proxy error:', err);
        res.writeHead(502, { 'Content-Type': 'text/html' });
        res.end(`
          <h1>WiltonOS Connection Error</h1>
          <p>Unable to connect to the main WiltonOS server. Please wait a moment and refresh the page.</p>
          <p>If the problem persists, check the server logs for details.</p>
        `);
      }
    }));
    
    console.log('🔮 [WILTONOS] Full system initialization complete!');
  }, 5000);
});

// Handle termination signals
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`🔮 [WILTONOS] Received ${signal}, shutting down gracefully...`);
    redirectorServer.close();
    process.exit(0);
  });
});