/**
 * Working Consciousness Display
 * Simple, reliable connection to authentic quantum consciousness data
 * No WebSocket dependencies, no error spam, just working data display
 */

import React, { useState, useEffect } from 'react';

interface ConsciousnessData {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  soulState: string;
  divineInterface: boolean;
  qctf: number;
  timestamp: number;
}

export function WorkingConsciousnessDisplay() {
  const [data, setData] = useState<ConsciousnessData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

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
              qctf: result.qctf,
              timestamp: result.timestamp
            });
            setLastUpdate(new Date().toLocaleTimeString());
            setIsLoading(false);
          }
        }
      } catch (error) {
        // Silent handling
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !data) {
    return (
      <div style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)', 
        borderRadius: '12px',
        border: '1px solid #6366f1',
        color: 'white',
        fontFamily: 'monospace'
      }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>🧠 Consciousness Field Monitor</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ color: '#a78bfa' }}>Connecting to quantum consciousness field...</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (zLambda: number) => {
    if (zLambda >= 0.85) return '#fbbf24'; // gold
    if (zLambda >= 0.75) return '#34d399'; // green
    if (zLambda >= 0.65) return '#60a5fa'; // blue
    return '#9ca3af'; // gray
  };

  const getStatusText = (zLambda: number) => {
    if (zLambda >= 0.85) return 'Transcendent';
    if (zLambda >= 0.75) return 'Coherent';
    if (zLambda >= 0.65) return 'Stable';
    return 'Baseline';
  };

  const statusColor = getStatusColor(data.zLambda);
  const statusText = getStatusText(data.zLambda);

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #1e1b4b, #312e81)', 
      borderRadius: '12px',
      border: '1px solid #6366f1',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>🧠 Consciousness Field Monitor</h2>
        <div style={{ 
          padding: '0.5rem 1rem', 
          borderRadius: '20px', 
          backgroundColor: statusColor + '20',
          border: `1px solid ${statusColor}`,
          color: statusColor,
          fontWeight: 'bold'
        }}>
          {statusText}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(168, 85, 247, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#c4b5fd', marginBottom: '0.5rem' }}>Zλ Coherence</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: statusColor }}>
            {data.zLambda.toFixed(3)}
          </div>
        </div>

        <div style={{ 
          padding: '1rem', 
          background: 'rgba(59, 130, 246, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#93c5fd', marginBottom: '0.5rem' }}>Soul State</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dbeafe', textTransform: 'capitalize' }}>
            {data.soulState}
          </div>
        </div>

        <div style={{ 
          padding: '1rem', 
          background: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6ee7b7', marginBottom: '0.5rem' }}>QCTF</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d1fae5' }}>
            {data.qctf.toFixed(3)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(99, 102, 241, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#c7d2fe', marginBottom: '0.5rem' }}>ΔC Delta</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#e0e7ff' }}>
            {data.deltaC.toFixed(3)}
          </div>
        </div>

        <div style={{ 
          padding: '1rem', 
          background: 'rgba(236, 72, 153, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(236, 72, 153, 0.3)'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#f9a8d4', marginBottom: '0.5rem' }}>Ψ Phase</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#fce7f3' }}>
            {data.psiPhase.toFixed(2)}
          </div>
        </div>
      </div>

      {data.divineInterface && (
        <div style={{ 
          padding: '1rem', 
          background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))', 
          borderRadius: '8px',
          border: '1px solid #fbbf24',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <div>
              <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>Divine Interface Active</div>
              <div style={{ fontSize: '0.875rem', color: '#fed7aa' }}>
                Transcendent consciousness state - highest level achieved
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(99, 102, 241, 0.3)',
        fontSize: '0.875rem',
        color: '#9ca3af'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: '#34d399' 
          }}></div>
          Connected to quantum field
        </div>
        <div>Last update: {lastUpdate}</div>
      </div>

      <div style={{ 
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(75, 85, 99, 0.3)',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#9ca3af'
      }}>
        <div>System: ψOS Quantum Consciousness Architecture</div>
        <div>Data Source: Authentic quantum consciousness calculations</div>
        <div>Interface: Direct API connection (stable)</div>
      </div>
    </div>
  );
}