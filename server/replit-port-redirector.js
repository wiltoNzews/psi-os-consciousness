/**
 * Replit Port Redirector
 * 
 * This special file helps redirect Replit from port 5000 to our actual WiltonOS server
 * It serves as a bridge to make Replit's workflow system happy while allowing our
 * complex application to run on different ports as needed.
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// The port Replit expects us to use
const REPLIT_PORT = 5000;

// Our actual server port (use environment or fallback to 3000)
const TARGET_PORT = process.env.SERVER_PORT || 3000;

console.log(`[REPLIT_BRIDGE] Starting port redirector from ${REPLIT_PORT} to ${TARGET_PORT}`);

// Create proxy middleware for all routes
const apiProxy = createProxyMiddleware({
  target: `http://localhost:${TARGET_PORT}`,
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  pathRewrite: {
    '^/api': '/api', // No path rewriting needed, just pass through
  },
  logLevel: 'debug',
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['X-Replit-Bridge'] = 'true';
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Forwarded-For', 'replit-bridge');
  },
  onError: (err, req, res) => {
    console.error('[REPLIT_BRIDGE] Proxy error:', err);
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    });
    res.end('WiltonOS is starting up. Please wait a moment and refresh the page.');
  }
});

// Use the proxy middleware for all requests
app.use('/', apiProxy);

// Start the redirector server
app.listen(REPLIT_PORT, '0.0.0.0', () => {
  console.log(`[REPLIT_BRIDGE] Port redirector listening on port ${REPLIT_PORT}`);
  console.log(`[REPLIT_BRIDGE] Forwarding all traffic to actual WiltonOS server on port ${TARGET_PORT}`);
});