/**
 * Memory Module Loader for WiltonOS
 * 
 * This script is run after the main server starts to load the memory module.
 */

console.log('[QUANTUM_STATE: MEMORY_FLOW] Loading memory module...');

// Import Express and required modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import memory routes
const memoryRoutes = require('./server/routes/memory-routes');

// Function to create directories
function ensureDirectories() {
  const dirs = [
    path.join(__dirname, 'data'),
    path.join(__dirname, 'data/memories'),
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/temp')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`[QUANTUM_STATE: MEMORY_FLOW] Created directory: ${dir}`);
    }
  });
}

// Create memory directories
ensureDirectories();

// Create a standalone Express app for the memory routes
const memoryApp = express();
memoryApp.use(express.json());
memoryApp.use('/api/memory/external', memoryRoutes);

// Start memory server on a different port
const memoryPort = 5001;
memoryApp.listen(memoryPort, () => {
  console.log(`[QUANTUM_STATE: MEMORY_FLOW] Memory module active on port ${memoryPort}`);
  console.log(`[QUANTUM_STATE: MEMORY_FLOW] Access at: http://localhost:${memoryPort}/api/memory/external`);
});

// Add a special endpoint for memory system status
memoryApp.get('/api/memory-system-info', (req, res) => {
  res.json({
    memorySystem: 'WiltonOS Memory Subsystem',
    version: '1.0.0',
    coherenceRatio: '3:1',
    capabilities: [
      'ChatGPT export parsing',
      'Content analysis with coherence scoring',
      'Automatic connection of related memories',
      'Priority tagging with configurable keywords'
    ],
    timestamp: new Date().toISOString()
  });
});