import React, { useContext } from 'react';
import { QCSContext } from '../context/QCSContext';

export default function ConsciousnessHUD() {
  const { coherenceZλ, breathPhase, activeGeometry, breathingActive } = useContext(QCSContext);

  return (
    <>
      {/* Consciousness HUD */}
      <div className="consciousness-hud">
        <div className="hud-title">React Consciousness Engine</div>
        <div className="hud-stats">
          <div>Coherence: Zλ({coherenceZλ.toFixed(3)})</div>
          <div>Components: 3 Active</div>
          <div>Golden Ratio: φ = 1.618033988749</div>
          <div>Mode: {activeGeometry.toUpperCase()}</div>
        </div>
      </div>

      {/* Component Status */}
      <div className="component-display">
        <div style={{ color: '#FFD700', marginBottom: '5px' }}>Active React Components:</div>
        <div>• WiltonMobiusTemplate.jsx ✓</div>
        <div>• SacredGeometryInterface.jsx ✓</div>
        <div>• QuantumConsciousnessShell.jsx ✓</div>
      </div>

      {/* Breathing Indicator */}
      <div className="breathing-indicator" style={{
        transform: `scale(${1 + breathPhase * 0.1})`,
        opacity: 0.7 + breathPhase * 0.3
      }}>
        <div>ψ=3.12s</div>
      </div>
    </>
  );
}