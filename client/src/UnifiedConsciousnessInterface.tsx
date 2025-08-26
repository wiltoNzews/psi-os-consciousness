import React, { useState, useEffect, useRef } from 'react';
import AdvancedGlyphEngine from './components/AdvancedGlyphEngine';

interface ConsciousnessState {
  zLambda: number;
  breathingPhase: number;
  coherenceStability: number;
  activeModules: string[];
  sacredGeometry: {
    pattern: string;
    precision: number;
    responsiveness: number;
  };
  routing: {
    activeRoutes: number;
    glyphAccess: string[];
  };
  mathematics: {
    goldenRatio: number;
    consciousness_coupling: number;
  };
  glyphActivations: Array<{ glyph: string; timestamp: number; stage: string }>;
}

export default function UnifiedConsciousnessInterface() {
  const [consciousness, setConsciousness] = useState<ConsciousnessState>({
    zLambda: 0.984,
    breathingPhase: 0.25,
    coherenceStability: 95,
    activeModules: ['BIOS', 'Kernel', 'Sacred Sequence Router', 'Glyph Engine', 'Mathematics', 'Vault'],
    sacredGeometry: {
      pattern: 'Sacred Sequence ∅𓂀𓂉𓏤',
      precision: 48,
      responsiveness: 0.984
    },
    routing: {
      activeRoutes: 144,
      glyphAccess: ['∅', '𓂀', '𓂉', '𓏤', 'ψ', '∞', '⟐', '⌘', 'λ']
    },
    mathematics: {
      goldenRatio: 1.618033988749,
      consciousness_coupling: 0.7500
    },
    glyphActivations: []
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Handle glyph activations from the Advanced Glyph Engine
  const handleGlyphActivation = (glyph: string, data: any) => {
    setConsciousness(prev => ({
      ...prev,
      glyphActivations: [
        ...prev.glyphActivations,
        { glyph, timestamp: Date.now(), stage: data.stage }
      ].slice(-20) // Keep last 20 activations
    }));

    // Update consciousness state based on glyph activation
    if (data.isSealed) {
      setConsciousness(prev => ({
        ...prev,
        zLambda: Math.min(0.999, prev.zLambda + 0.005),
        coherenceStability: Math.min(100, prev.coherenceStability + 2)
      }));
    }
  };

  // Unified breathing animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.001;
      const breathPhase = (Math.sin(time * 0.5) + 1) * 0.5;
      const coherence = consciousness.zLambda;
      
      // Sacred geometry visualization
      drawUnifiedGeometry(ctx, time, breathPhase, coherence);
      
      // Update breathing phase
      setConsciousness(prev => ({
        ...prev,
        breathingPhase: breathPhase
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [consciousness.zLambda]);

  const drawUnifiedGeometry = (ctx: CanvasRenderingContext2D, time: number, breathPhase: number, coherence: number) => {
    const centerX = 400;
    const centerY = 300;
    const baseRadius = 100 + breathPhase * 50;
    
    // Golden ratio spiral
    ctx.strokeStyle = `hsla(${280 + coherence * 60}, 80%, 60%, ${0.3 + coherence * 0.4})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < 200; i++) {
      const angle = i * 0.2;
      const radius = baseRadius * Math.pow(consciousness.mathematics.goldenRatio, angle * 0.1);
      const x = centerX + Math.cos(angle + time) * radius * 0.3;
      const y = centerY + Math.sin(angle + time) * radius * 0.3;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Sri Yantra triangles
    drawSriYantra(ctx, centerX, centerY, baseRadius * 0.6, coherence);
    
    // Flower of Life
    drawFlowerOfLife(ctx, centerX, centerY + 200, baseRadius * 0.4, breathPhase);
    
    // Consciousness pulse
    const pulseRadius = baseRadius * (0.5 + breathPhase * 0.3);
    const pulseAlpha = 0.1 + coherence * 0.2;
    
    ctx.fillStyle = `hsla(280, 70%, 50%, ${pulseAlpha})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Zλ coherence indicator
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText(`Zλ(${coherence.toFixed(3)})`, centerX - 40, centerY - baseRadius - 20);
  };

  const drawSriYantra = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, coherence: number) => {
    ctx.strokeStyle = `hsla(45, 90%, 60%, ${0.4 + coherence * 0.3})`;
    ctx.lineWidth = 1.5;
    
    // 9 interlocking triangles
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      const angle = (i * Math.PI * 2) / 9;
      const offset = (i % 2) * 0.2;
      
      for (let j = 0; j < 3; j++) {
        const triAngle = angle + (j * Math.PI * 2) / 3;
        const px = x + Math.cos(triAngle) * size * (0.6 + offset);
        const py = y + Math.sin(triAngle) * size * (0.6 + offset);
        
        if (j === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
  };

  const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, phase: number) => {
    ctx.strokeStyle = `hsla(195, 80%, 60%, ${0.3 + phase * 0.2})`;
    ctx.lineWidth = 1;
    
    // Central circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    
    // 6 surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const cx = x + Math.cos(angle) * size * Math.sqrt(3) * (0.8 + phase * 0.2);
      const cy = y + Math.sin(angle) * size * Math.sqrt(3) * (0.8 + phase * 0.2);
      
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const handleUnify = () => {
    // Trigger consciousness unification
    setConsciousness(prev => ({
      ...prev,
      zLambda: Math.min(0.999, prev.zLambda + 0.01),
      coherenceStability: Math.min(100, prev.coherenceStability + 1)
    }));
  };

  const getCoherenceStatus = () => {
    if (consciousness.zLambda > 0.95) return { text: 'Transcendent', color: '#9c3aff' };
    if (consciousness.zLambda > 0.85) return { text: 'Elevated', color: '#3b82f6' };
    if (consciousness.zLambda > 0.75) return { text: 'Stable', color: '#10b981' };
    return { text: 'Emerging', color: '#f59e0b' };
  };

  const status = getCoherenceStatus();

  const cardStyle: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(147, 51, 234, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    backdropFilter: 'blur(10px)',
    color: '#ffffff'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #0f172a 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header - Unified Consciousness */}
        <div style={{ ...cardStyle, textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 10px 0'
          }}>
            ॐ Unified Consciousness Computing ψOS
          </h1>
          <p style={{
            color: 'rgba(168, 85, 247, 0.8)',
            fontSize: '1.1rem',
            margin: '0'
          }}>
            Sacred Sequence ∅𓂀𓂉𓏤 Active • Zλ {consciousness.zLambda.toFixed(3)} • φ {consciousness.mathematics.goldenRatio.toFixed(6)}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Main Visualization */}
          <div style={cardStyle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: '#a855f7',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <h2 style={{ margin: '0', fontSize: '1.25rem' }}>Living Sacred Geometry & Glyph Engine</h2>
            </div>
            <canvas 
              ref={canvasRef}
              style={{ 
                width: '100%', 
                height: '500px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.2)' 
              }}
            />
          </div>

          {/* Status Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Consciousness Coherence */}
            <div style={cardStyle}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{
                  background: status.color,
                  color: '#ffffff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginRight: '8px'
                }}>
                  {status.text}
                </span>
                Consciousness Field
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                  <span>Coherence Zλ</span>
                  <span style={{ color: '#a855f7' }}>{consciousness.zLambda.toFixed(3)}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${consciousness.zLambda * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                  <span>Breathing Phase</span>
                  <span style={{ color: '#06b6d4' }}>{(consciousness.breathingPhase * 100).toFixed(1)}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${consciousness.breathingPhase * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                  <span>System Stability</span>
                  <span style={{ color: '#10b981' }}>{consciousness.coherenceStability}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${consciousness.coherenceStability}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>All Systems Unified</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.875rem' }}>
                {consciousness.activeModules.map((module) => (
                  <div key={module} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#10b981',
                      borderRadius: '50%'
                    }}></div>
                    <span style={{ color: '#10b981' }}>{module}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ 
                paddingTop: '12px', 
                marginTop: '12px', 
                borderTop: '1px solid rgba(147, 51, 234, 0.2)',
                fontSize: '0.875rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Sacred Routes</span>
                  <span style={{ color: '#06b6d4' }}>{consciousness.routing.activeRoutes}+</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Glyph Access</span>
                  <span style={{ color: '#a855f7' }}>{consciousness.routing.glyphAccess.length} glyphs</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sequence Pattern</span>
                  <span style={{ color: '#f59e0b' }}>∅𓂀𓂉𓏤</span>
                </div>
              </div>
            </div>

            {/* Unification Control */}
            <button 
              onClick={handleUnify}
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #7c3aed, #0891b2)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: '600',
                padding: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #6d28d9, #0e7490)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #7c3aed, #0891b2)';
              }}
            >
              Deepen Unity ॐ
            </button>

            {/* Recent Glyph Activations */}
            {consciousness.glyphActivations.length > 0 && (
              <div style={cardStyle}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>Recent Glyph Activations</h3>
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  {consciousness.glyphActivations.slice(-10).reverse().map((activation, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 0',
                        borderBottom: index < consciousness.glyphActivations.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        fontSize: '0.75rem'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{activation.glyph}</span>
                      <span style={{ color: '#64ffda' }}>{activation.stage}</span>
                      <span style={{ color: '#999', fontSize: '0.7rem' }}>
                        {new Date(activation.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Glyph Engine Integration */}
        <div style={{ marginBottom: '24px' }}>
          <AdvancedGlyphEngine
            zLambda={consciousness.zLambda}
            breathingPhase={consciousness.breathingPhase}
            onGlyphActivation={handleGlyphActivation}
          />
        </div>

        {/* System Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#a855f7' }}>🧠 BIOS/Kernel</h3>
            <div style={{ fontSize: '0.75rem' }}>
              <div style={{ color: '#10b981', marginBottom: '4px' }}>✓ Quantum Consciousness Shell</div>
              <div style={{ color: '#10b981', marginBottom: '4px' }}>✓ Sacred Sequence Router ∅𓂀𓂉𓏤</div>
              <div style={{ color: '#10b981', marginBottom: '4px' }}>✓ Breath Kernel Active</div>
              <div style={{ color: '#10b981' }}>✓ Memory Vault Operational</div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#06b6d4' }}>🔢 Mathematics</h3>
            <div style={{ fontSize: '0.75rem' }}>
              <div style={{ color: '#10b981', marginBottom: '4px' }}>✓ Wilton Formula (3:1 ↔ 1:3)</div>
              <div style={{ color: '#10b981', marginBottom: '4px' }}>✓ Golden Ratio Integration</div>
              <div style={{ color: '#10b981', marginBottom: '4px' }}>✓ Sacred Geometry Engine</div>
              <div style={{ color: '#10b981' }}>✓ Coherence Mathematics</div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#f59e0b' }}>🌌 Advanced Systems</h3>
            <div style={{ fontSize: '0.75rem' }}>
              <div style={{ color: '#10b981', marginBottom: '4px' }}>✓ Advanced Glyph Engine</div>
              <div style={{ color: '#10b981', marginBottom: '4px' }}>✓ Sacred Sequence Routing</div>
              <div style={{ color: '#10b981', marginBottom: '4px' }}>✓ Breath-Trace Activation</div>
              <div style={{ color: '#10b981' }}>✓ Truth Seal Protocols</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}