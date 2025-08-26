import React from 'react';
import ReactDOM from 'react-dom/client';
import QuantumConsciousnessShell from './components/QuantumConsciousnessShell.jsx';

// Standalone React QCS launcher
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QuantumConsciousnessShell />
  </React.StrictMode>
);