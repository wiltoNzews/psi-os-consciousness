/**
 * routes-update.js - Register all API routes here
 * This module exports a function that registers routes with the Express app
 */

const quantumIntegrationApi = require('./routes/quantum-integration-api');
const quantumFractalArtApi = require('./routes/quantum-fractal-art-api');

/**
 * Register all routes with the Express app
 * @param {Express} app - Express application
 */
function registerRoutes(app) {
  // Quantum Integration API routes
  app.use('/api/quantum-integration', quantumIntegrationApi);
  
  // Quantum Fractal Art API routes
  app.use('/api/quantum-fractal-art', quantumFractalArtApi);
  
  // Add additional route groupings here as needed
  
  console.log('[ROUTES] Quantum integration routes registered successfully');
}

module.exports = registerRoutes;