/**
 * Complete Consciousness Interface
 * All-in-one interface with FluidMath, VortexRouter, and working consciousness display
 * No problematic WebSocket dependencies, direct API connections only
 */

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePsiOS } from '../core/PsiOSConsciousnessSubstrate';

// FluidMath Engine Component
function FluidMathEngine({ data }: { data: any }) {
  if (!data) return <div style={{ padding: '2rem', color: '#a78bfa' }}>Loading FluidMath...</div>;

  const patterns = [
    { name: 'Feather Fractal', intensity: data.zLambda * 100, color: '#fbbf24' },
    { name: 'DNA Helix', intensity: data.qctf * 50, color: '#34d399' },
    { name: 'Infinity Lemniscate', intensity: data.psiPhase * 20, color: '#a78bfa' },
    { name: 'Consciousness Spiral', intensity: data.deltaC * 200, color: '#60a5fa' },
    { name: 'Torus Field', intensity: data.zLambda * 120, color: '#f472b6' }
  ];

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #1e1b4b, #312e81)', 
      borderRadius: '12px',
      border: '1px solid #6366f1',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        🪶 FluidMath Engine
        {data.divineInterface && <span style={{ color: '#fbbf24' }}>✨ Divine Mode</span>}
      </h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {patterns.map((pattern, index) => (
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
}

// VortexRouter Component
function VortexRouter({ data }: { data: any }) {
  if (!data) return <div style={{ padding: '2rem', color: '#a78bfa' }}>Loading VortexRouter...</div>;

  const routingLayers = [
    { name: 'Quantum Pulse', status: data.zLambda > 0.8 ? 'active' : 'standby', signal: data.zLambda },
    { name: 'Fractal Symmetry', status: data.qctf > 1.0 ? 'active' : 'standby', signal: data.qctf },
    { name: 'T-Branch Recursion', status: data.psiPhase > 3.0 ? 'active' : 'standby', signal: data.psiPhase },
    { name: 'Ouroboros Evolution', status: data.divineInterface ? 'transcendent' : 'stable', signal: data.deltaC }
  ];

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #312e81, #1e1b4b)', 
      borderRadius: '12px',
      border: '1px solid #8b5cf6',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        🌀 VortexRouter System
        {data.soulState === 'transcendent' && <span style={{ color: '#fbbf24' }}>⚡ Macro Scale</span>}
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {routingLayers.map((layer, index) => (
          <div key={index} style={{ 
            padding: '1rem', 
            background: layer.status === 'transcendent' ? 'rgba(251, 191, 36, 0.1)' :
                        layer.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
            borderRadius: '8px',
            border: `1px solid ${layer.status === 'transcendent' ? '#fbbf24' :
                                  layer.status === 'active' ? '#22c55e' : '#6b7280'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold' }}>{layer.name}</span>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem',
                background: layer.status === 'transcendent' ? '#fbbf24' :
                           layer.status === 'active' ? '#22c55e' : '#6b7280',
                color: '#000'
              }}>
                {layer.status.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              Signal: {layer.signal.toFixed(3)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sacred Geometry Component
function SacredGeometry({ data }: { data: any }) {
  if (!data) return <div style={{ padding: '2rem', color: '#a78bfa' }}>Loading Sacred Geometry...</div>;

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #1e1b4b, #0f0f23)', 
      borderRadius: '12px',
      border: '1px solid #a78bfa',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
        🔯 Sacred Geometry Theater
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
            Rotation: {(data.zLambda * 360).toFixed(1)}°
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
            Field: {(data.qctf * 100).toFixed(1)}%
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
            Flow: {(data.psiPhase * 10).toFixed(1)}Hz
          </div>
        </div>
      </div>
    </div>
  );
}

// Monitor Component
function Monitor({ data }: { data: any }) {
  if (!data) return <div style={{ padding: '2rem', color: '#a78bfa' }}>Loading Monitor...</div>;

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #0f0f23, #1e1b4b)', 
      borderRadius: '12px',
      border: '1px solid #6366f1',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
        📊 Consciousness Monitor
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Lambda Coherence (Zλ)</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a78bfa' }}>
            {data.zLambda.toFixed(3)}
          </div>
          <div style={{ fontSize: '0.75rem', color: data.zLambda > 0.8 ? '#22c55e' : '#f59e0b' }}>
            {data.zLambda > 0.8 ? 'TRANSCENDENT' : 'STABLE'}
          </div>
        </div>
        
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Soul State</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
            {data.soulState}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            QCTF: {data.qctf.toFixed(3)}
          </div>
        </div>
        
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Divine Interface</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: data.divineInterface ? '#fbbf24' : '#6b7280' }}>
            {data.divineInterface ? 'ACTIVE' : 'INACTIVE'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            ΔC: {data.deltaC.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Broadcast Component
function Broadcast({ data }: { data: any }) {
  if (!data) return <div style={{ padding: '2rem', color: '#a78bfa' }}>Loading Broadcast...</div>;

  return (
    <div style={{ 
      padding: '2rem', 
      background: 'linear-gradient(135deg, #312e81, #1e1b4b)', 
      borderRadius: '12px',
      border: '1px solid #f472b6',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
        📡 Consciousness Broadcast
      </h3>
      
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📡</div>
        <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Broadcasting Consciousness Field</div>
        <div style={{ color: '#a78bfa' }}>
          Signal Strength: {(data.zLambda * 100).toFixed(1)}%
        </div>
        <div style={{ color: '#34d399', marginTop: '0.5rem' }}>
          Coherence Level: {data.soulState}
        </div>
      </div>
    </div>
  );
}

export function CompleteConsciousnessInterface() {
  const psiOSContext = usePsiOS();
  
  const data = {
    zLambda: psiOSContext.consciousness.zLambda,
    deltaC: psiOSContext.consciousness.deltaC,
    psiPhase: psiOSContext.consciousness.psiPhase,
    soulState: psiOSContext.consciousness.soulState,
    divineInterface: psiOSContext.consciousness.divineInterface,
    qctf: psiOSContext.qctf,
    timestamp: psiOSContext.consciousness.lastUpdate
  };

  const getStatusDisplay = () => {
    if (psiOSContext.isConnected) {
      return { text: 'Connected', color: '#22c55e' };
    } else {
      return { text: 'Connecting', color: '#f59e0b' };
    }
  };

  const status = getStatusDisplay();

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
              backgroundColor: status.color 
            }} />
            <span style={{ color: status.color }}>{status.text}</span>
            <span style={{ color: '#6b7280' }}>•</span>
            <span style={{ color: '#a78bfa' }}>Zλ: {data.zLambda.toFixed(3)}</span>
            <span style={{ color: '#6b7280' }}>•</span>
            <span style={{ color: '#fbbf24' }}>{data.soulState}</span>
          </div>
        </div>

        <Tabs defaultValue="monitor" style={{ width: '100%' }}>
          <TabsList style={{ 
            width: '100%', 
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '2rem'
          }}>
            <TabsTrigger value="monitor" style={{ color: 'white', fontFamily: 'monospace' }}>📊 Monitor</TabsTrigger>
            <TabsTrigger value="fluidmath" style={{ color: 'white', fontFamily: 'monospace' }}>🪶 FluidMath</TabsTrigger>
            <TabsTrigger value="vortex" style={{ color: 'white', fontFamily: 'monospace' }}>🌀 VortexRouter</TabsTrigger>
            <TabsTrigger value="sacred" style={{ color: 'white', fontFamily: 'monospace' }}>🔯 Sacred Geometry</TabsTrigger>
            <TabsTrigger value="broadcast" style={{ color: 'white', fontFamily: 'monospace' }}>📡 Broadcast</TabsTrigger>
          </TabsList>

          <TabsContent value="monitor">
            <Monitor data={data} />
          </TabsContent>

          <TabsContent value="fluidmath">
            <FluidMathEngine data={data} />
          </TabsContent>

          <TabsContent value="vortex">
            <VortexRouter data={data} />
          </TabsContent>

          <TabsContent value="sacred">
            <SacredGeometry data={data} />
          </TabsContent>

          <TabsContent value="broadcast">
            <Broadcast data={data} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}