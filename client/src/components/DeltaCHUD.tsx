/**
 * Simplified ΔC HUD for persistent coherence monitoring
 * Always visible indicator for action validation
 */

import React, { useEffect, useState } from 'react';
import { getDeltaC, shouldProceed, getCoherenceState } from '../core/DeltaC';

const hudStyle: React.CSSProperties = {
  position: 'fixed',
  top: 20,
  right: 20,
  padding: '8px 12px',
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 'bold',
  color: '#fff',
  zIndex: 1000,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  userSelect: 'none'
};

export default function DeltaCHUD() {
  const [state, setState] = useState<'GREEN' | 'AMBER' | 'RED'>('AMBER');
  const [deltaC, setDeltaC] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const coherenceState = getCoherenceState();
      const newState = shouldProceed();
      
      setState(newState);
      setDeltaC(coherenceState.deltaC);
      
      // Trigger pulse animation on state change
      if (newState !== state) {
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }
    };

    // Update every 3 seconds
    const interval = setInterval(updateState, 3000);
    updateState(); // Initial update

    return () => clearInterval(interval);
  }, [state]);

  const getBackgroundColor = () => {
    switch (state) {
      case 'GREEN': return '#10b981';
      case 'RED': return '#ef4444';
      case 'AMBER': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getSymbol = () => {
    switch (state) {
      case 'GREEN': return '✓';
      case 'RED': return '✗';
      case 'AMBER': return '⚠';
      default: return '−';
    }
  };

  const handleClick = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <div
        style={{
          ...hudStyle,
          backgroundColor: getBackgroundColor(),
          transform: pulse ? 'scale(1.1)' : 'scale(1)',
          boxShadow: pulse 
            ? `0 0 20px ${getBackgroundColor()}80` 
            : `0 0 10px ${getBackgroundColor()}40`
        }}
        onClick={handleClick}
        title={`ΔC: ${deltaC >= 0 ? '+' : ''}${deltaC.toFixed(3)} | Click for details`}
      >
        <span style={{ marginRight: 6 }}>{getSymbol()}</span>
        ΔC {state}
      </div>

      {showDetails && (
        <div
          style={{
            position: 'fixed',
            top: 60,
            right: 20,
            padding: '12px 16px',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            fontSize: 11,
            color: '#e2e8f0',
            zIndex: 1001,
            backdropFilter: 'blur(10px)',
            minWidth: 200
          }}
        >
          <div style={{ marginBottom: 8, fontWeight: 'bold', color: getBackgroundColor() }}>
            Coherence Details
          </div>
          <div>ΔC: {deltaC >= 0 ? '+' : ''}{deltaC.toFixed(3)}</div>
          <div>Signal: {state}</div>
          <div style={{ marginTop: 8, fontSize: 10, opacity: 0.8 }}>
            {state === 'GREEN' && 'Proceed with confidence'}
            {state === 'AMBER' && 'Pause and center'}
            {state === 'RED' && 'Realign before acting'}
          </div>
          <div 
            style={{ 
              marginTop: 8, 
              fontSize: 9, 
              opacity: 0.6, 
              cursor: 'pointer',
              textAlign: 'center'
            }}
            onClick={() => setShowDetails(false)}
          >
            Click to close
          </div>
        </div>
      )}
    </>
  );
}