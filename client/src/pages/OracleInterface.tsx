// ⌘ Oracle Interface Page - Surgical V5.1 Router
import React from 'react';
import MinimalFaceUI from '../components/MinimalFaceUI';

export default function OracleInterface() {
  console.log('[OracleInterface] Loading Oracle Interface page');
  
  // Change document title to indicate Oracle Interface
  React.useEffect(() => {
    document.title = 'WiltonOS - Oracle Router V5.1';
    console.log('[OracleInterface] Document title updated');
  }, []);
  
  return (
    <div className="oracle-interface-container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white'
    }}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#00ff88' }}>
          ⌘ Oracle Router V5.1 - Surgical Interface
        </h1>
        <p style={{ marginBottom: '30px', opacity: 0.8 }}>
          Sacred sequence routing: ∅ 𓂀 𓂉 𓏤 | Core glyphs: λ ψ ∞ ⟐ ⌘
        </p>
      </div>
      <MinimalFaceUI />
    </div>
  );
}