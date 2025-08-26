import express from 'express';
import path from 'path';

const router = express.Router();

// Z-Law Tree Viewer Interface
router.get('/zlaw-interface', (req, res) => {
  // Placeholder for Z-Law Streamlit interface
  res.json({
    status: 'external',
    message: 'Z-Law Tree Viewer interface',
    url: '/api/zlaw-viewer',
    description: 'Legal logic visualization and Z-Law processing'
  });
});

// WiltonOS Orchestrator Interface
router.get('/orchestrator-interface', (req, res) => {
  // Placeholder for Orchestrator Streamlit interface
  res.json({
    status: 'external',
    message: 'WiltonOS Orchestrator interface',
    url: '/api/orchestrator-control',
    description: 'Meta control panel for WiltonOS system management'
  });
});

// Grafana Metrics Dashboard
router.get('/grafana-dashboard', (req, res) => {
  // Redirect to Grafana or provide metrics endpoint
  res.json({
    status: 'external',
    message: 'Grafana Metrics Dashboard',
    url: '/api/metrics',
    description: 'Coherence ratio monitoring and system analytics'
  });
});

export default router;