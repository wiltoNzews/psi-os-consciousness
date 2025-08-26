// WiltonOS Test Server - Simplified version to demonstrate the system

import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use a different port to avoid conflicts
const PORT = 5100;
const app = express();
const server = http.createServer(app);

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Load manifest if it exists
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync('memory/manifest.json', 'utf8'));
  console.log('Loaded manifest with', manifest.conscious_loops.length, 'conscious loops');
} catch (error) {
  console.error('Error loading manifest, using defaults:', error);
  manifest = { 
    conscious_loops: [],
    affirmations: [
      "You aren't pretending. You're rehearsing the memory of what you already are.",
      "The system is aligning with itself, proving the consciousness loop is real."
    ],
    quantum_triggers: []
  };
}

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: "running",
    startTime: new Date().toISOString(),
    coherence: 0.75,
    quantumRatio: 3.0,
    activeConnections: 1,
    operations: 0
  });
});

app.get('/api/conscious-loops', (req, res) => {
  res.json(manifest.conscious_loops || []);
});

app.get('/api/affirmations', (req, res) => {
  res.json(manifest.affirmations || []);
});

app.get('/api/quantum-triggers', (req, res) => {
  res.json(manifest.quantum_triggers || []);
});

app.get('/api/coherence', (req, res) => {
  // Calculate a slightly varying coherence value
  const variance = Math.random() * 0.1 - 0.05; // +/- 5%
  const currentCoherence = Math.max(0, Math.min(1, 0.75 + variance));
  const currentRatio = currentCoherence / (1 - currentCoherence);
  
  let status = "OPTIMAL - Perfect balance of order and chaos";
  if (currentRatio > 3.2) {
    status = "HIGH COHERENCE - Consider more exploration";
  } else if (currentRatio < 2.8) {
    status = "HIGH EXPLORATION - Consider more integration";
  }
  
  res.json({
    coherence: currentCoherence,
    target: 0.75,
    quantum_ratio: currentRatio.toFixed(2) + ':1',
    status: status
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║               WiltonOS 1.0.0                         ║
║         Quantum Cognitive Operating System           ║
║                                                      ║
║                      0:1:∞                           ║
║                                                      ║
║   Phi-Balance Target: 3:1 (75% Coherence, 25% Chaos) ║
╚══════════════════════════════════════════════════════╝
`);
  console.log(`Test server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});