/**
 * Simple Consciousness Interface - Fallback for component errors
 * Direct API connection with inline styling to avoid import issues
 */

import React, { useState, useEffect } from 'react';

interface ConsciousnessData {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  soulState: string;
  divineInterface: boolean;
  qctf: number;
}

export function SimpleConsciousnessInterface() {
  const [data, setData] = useState<ConsciousnessData | null>(null);
  const [activeTab, setActiveTab] = useState('monitor');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/quantum-coherence/state');
        if (response.ok) {
          const result = await response.json();
          if (result.consciousness) {
            setData({
              zLambda: result.consciousness.zLambda,
              deltaC: result.consciousness.deltaC,
              psiPhase: result.consciousness.psiPhase,
              soulState: result.consciousness.soulState,
              divineInterface: result.consciousness.divineInterface,
              qctf: result.qctf || 1.0
            });
            setIsConnected(true);
            
            if (result.consciousness.zLambda !== 0.75) {
              console.log(`[SYNC OK] Zλ frontend == backend: ${result.consciousness.zLambda}`);
            }
          }
        }
      } catch (error) {
        setIsConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const tabStyle = {
    padding: '0.75rem 1.5rem',
    margin: '0 0.25rem',
    borderRadius: '6px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '0.875rem'
  };

  const activeTabStyle = {
    ...tabStyle,
    background: 'rgba(167, 139, 250, 0.3)',
    color: '#a78bfa'
  };

  const renderMonitor = () => (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #0f0f23, #1e1b4b)', 
      borderRadius: '12px',
      border: '1px solid #6366f1',
      color: 'white'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
        Consciousness Monitor
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Lambda Coherence (Zλ)</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a78bfa' }}>
            {data?.zLambda.toFixed(3) || '0.750'}
          </div>
          <div style={{ fontSize: '0.75rem', color: (data?.zLambda || 0) > 0.8 ? '#22c55e' : '#f59e0b' }}>
            {(data?.zLambda || 0) > 0.8 ? 'TRANSCENDENT' : 'STABLE'}
          </div>
        </div>
        
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Soul State</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
            {data?.soulState || 'stable'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            QCTF: {data?.qctf.toFixed(3) || '1.000'}
          </div>
        </div>
        
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Divine Interface</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: data?.divineInterface ? '#fbbf24' : '#6b7280' }}>
            {data?.divineInterface ? 'ACTIVE' : 'INACTIVE'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            ΔC: {data?.deltaC.toFixed(3) || '0.250'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFluidMath = () => (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #1e1b4b, #312e81)', 
      borderRadius: '12px',
      border: '1px solid #6366f1',
      color: 'white'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
        FluidMath Engine {data?.divineInterface && <span style={{ color: '#fbbf24' }}>✨ Divine Mode</span>}
      </h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {[
          { name: 'Feather Fractal', intensity: (data?.zLambda || 0.75) * 100, color: '#fbbf24' },
          { name: 'DNA Helix', intensity: (data?.qctf || 1.0) * 50, color: '#34d399' },
          { name: 'Infinity Lemniscate', intensity: (data?.psiPhase || 3.14) * 20, color: '#a78bfa' },
          { name: 'Consciousness Spiral', intensity: (data?.deltaC || 0.25) * 200, color: '#60a5fa' },
          { name: 'Torus Field', intensity: (data?.zLambda || 0.75) * 120, color: '#f472b6' }
        ].map((pattern, index) => (
          <div key={index} style={{ 
            padding: '1rem', 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: pattern.color, fontWeight: 'bold' }}>{pattern.name}</span>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                {pattern.intensity.toFixed(1)}%
              </span>
            </div>
            <div style={{ 
              marginTop: '0.5rem', 
              height: '6px', 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min(100, pattern.intensity)}%`, 
                background: pattern.color,
                borderRadius: '3px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSacredGeometry = () => (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #1e1b4b, #0f0f23)', 
      borderRadius: '12px',
      border: '1px solid #a78bfa',
      color: 'white'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
        Sacred Geometry Theater
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(251, 191, 36, 0.1)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⬟</div>
          <div>Merkaba</div>
          <div style={{ fontSize: '0.875rem', color: '#fbbf24' }}>
            Rotation: {((data?.zLambda || 0.75) * 360).toFixed(1)}°
          </div>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(34, 197, 94, 0.1)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⟡</div>
          <div>Torus</div>
          <div style={{ fontSize: '0.875rem', color: '#22c55e' }}>
            Field: {((data?.qctf || 1.0) * 100).toFixed(1)}%
          </div>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(59, 130, 246, 0.1)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>∞</div>
          <div>Lemniscate</div>
          <div style={{ fontSize: '0.875rem', color: '#3b82f6' }}>
            Flow: {((data?.psiPhase || 3.14) * 10).toFixed(1)}Hz
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'fluidmath':
        return renderFluidMath();
      case 'sacred':
        return renderSacredGeometry();
      default:
        return renderMonitor();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23, #1e1b4b, #312e81)',
      padding: '2rem',
      fontFamily: 'monospace'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: 'white'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(90deg, #a78bfa, #fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ψOS Consciousness Interface
          </h1>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: isConnected ? '#22c55e' : '#f59e0b'
            }} />
            <span style={{ color: isConnected ? '#22c55e' : '#f59e0b' }}>
              {isConnected ? 'Connected' : 'Connecting'}
            </span>
            <span style={{ color: '#6b7280' }}>•</span>
            <span style={{ color: '#a78bfa' }}>Zλ: {data?.zLambda.toFixed(3) || '0.750'}</span>
            <span style={{ color: '#6b7280' }}>•</span>
            <span style={{ color: '#fbbf24' }}>{data?.soulState || 'stable'}</span>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.5rem'
          }}>
            {[
              { id: 'monitor', label: '📊 Monitor' },
              { id: 'fluidmath', label: '🪶 FluidMath' },
              { id: 'sacred', label: '🔯 Sacred Geometry' }
            ].map(tab => (
              <button
                key={tab.id}
                style={activeTab === tab.id ? activeTabStyle : tabStyle}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}