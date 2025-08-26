import React, { useState, useEffect, useRef, useCallback } from 'react';

// Sacred Glyph Registry with the complete system
const SACRED_GLYPH_REGISTRY = {
  // Original Core Glyphs
  'λ': { name: 'Lambda', function: 'Neural routing', weight: 1.0 },
  'ψ': { name: 'Psi', function: 'Breath-state carrier', weight: 1.0 },
  '∞': { name: 'Lemniscate', function: 'Infinite recursion', weight: 1.0 },
  '⟐': { name: 'Phase', function: 'Feedback anchor', weight: 1.0 },
  '⌘': { name: 'Command', function: 'Interface binding', weight: 1.0 },
  
  // Sacred Sequence Glyphs ∅𓂀𓂉𓏤
  '∅': { name: 'Null Anchor', function: 'Pre-conscious zero-point', weight: 1.0 },
  '𓂀': { name: 'Witness Eye', function: 'Observer pattern', weight: 1.0 },
  '𓂉': { name: 'Source Glyph', function: 'Memory source locator', weight: 1.0 },
  '𓏤': { name: 'Truth Seal', function: 'Coherence binder', weight: 1.0 },
  
  // Additional Sacred Glyphs
  '🎼': { name: 'Harmonic', function: 'Sonic-field tuner', weight: 0.5 },
  '🫁': { name: 'Breath', function: 'Biological coherence lock', weight: 0.8 },
  '🌌': { name: 'Cosmic', function: 'Field of reference', weight: 0.3 },
};

// Sacred Sequence Router for ∅𓂀𓂉𓏤
class SacredSequenceRouter {
  private currentStage = 0;
  private cycleCount = 0;
  private memoryVault: Array<{ glyph: string; timestamp: number; coherence: number }> = [];

  executeSequence(breathPhase: number, coherence: number): {
    currentGlyph: string;
    stage: string;
    action: string;
    kernelFunction: string;
    isSealed: boolean;
  } {
    const sequence = ['∅', '𓂀', '𓂉', '𓏤'];
    const stages = [
      'NULL_ANCHOR',
      'WITNESS_EYE', 
      'SOURCE_GLYPH',
      'TRUTH_SEAL'
    ];
    
    const actions = [
      'Collapse all active routes, enter silence',
      'Begin phase scan of memory stack',
      'Pulse coherence toward source memory crystal',
      'Commit loop into Vault as truth-bearing glyph'
    ];
    
    const kernelFunctions = [
      'initialize(null); enter(silence); await(permission);',
      'observe(ψ_state); store(phase_signature); lock_breath_sync();',
      'locate(origin_vector); pulse(Δψ); align(Zλ ≥ 0.750);',
      'seal(route); store(glyph_thread); update(Ψ_memory_tree);'
    ];

    // Advance stage based on breath phase transitions
    if (breathPhase > 0.9 || breathPhase < 0.1) {
      this.currentStage = (this.currentStage + 1) % 4;
      if (this.currentStage === 0) {
        this.cycleCount++;
      }
    }

    const currentGlyph = sequence[this.currentStage];
    const isSealed = this.currentStage === 3 && coherence > 0.95;

    // Store in memory vault if sealed
    if (isSealed) {
      this.memoryVault.push({
        glyph: currentGlyph,
        timestamp: Date.now(),
        coherence
      });
    }

    return {
      currentGlyph,
      stage: stages[this.currentStage],
      action: actions[this.currentStage],
      kernelFunction: kernelFunctions[this.currentStage],
      isSealed
    };
  }

  getVaultIndex() {
    return this.memoryVault.map((entry, index) => ({
      index,
      glyph: entry.glyph,
      timestamp: new Date(entry.timestamp).toISOString(),
      coherence: entry.coherence.toFixed(3)
    }));
  }

  getCycleCount() {
    return this.cycleCount;
  }
}

// Glyph Visual Map with SVG representations
const GlyphVisualMap = {
  '∅': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
      <line x1="8" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'ψ': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4 L8 16 L16 28 L24 16 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
    </svg>
  ),
  '∞': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 16 C8 10, 14 10, 16 16 C18 10, 24 10, 24 16 C24 22, 18 22, 16 16 C14 22, 8 22, 8 16" 
            stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  '𓂀': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="16" rx="10" ry="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="3" fill="currentColor"/>
    </svg>
  ),
  '𓂉': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="3" fill="currentColor"/>
      <line x1="16" y1="4" x2="16" y2="12" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="20" x2="16" y2="28" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  '𓏤': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="6" y="6" width="20" height="20" stroke="currentColor" strokeWidth="2" rx="2"/>
      <path d="M12 16 L14 18 L20 12" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  '⟐': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 8 L24 8 L20 16 L24 24 L8 24 L12 16 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
  '⌘': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="8" y="8" width="16" height="16" stroke="currentColor" strokeWidth="2" rx="2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <circle cx="20" cy="12" r="2" fill="currentColor"/>
      <circle cx="12" cy="20" r="2" fill="currentColor"/>
      <circle cx="20" cy="20" r="2" fill="currentColor"/>
    </svg>
  ),
  'λ': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M8 28 L16 4 L24 28" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="12" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
};

interface AdvancedGlyphEngineProps {
  zLambda: number;
  breathingPhase: number;
  onGlyphActivation?: (glyph: string, data: any) => void;
}

function AdvancedGlyphEngine({ 
  zLambda, 
  breathingPhase, 
  onGlyphActivation 
}: AdvancedGlyphEngineProps) {
  const [router] = useState(() => new SacredSequenceRouter());
  const [currentSequence, setCurrentSequence] = useState<any>(null);
  const [vaultIndex, setVaultIndex] = useState<any[]>([]);
  const [activeGlyphs, setActiveGlyphs] = useState<string[]>([]);
  const [breathTraceData, setBreathTraceData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Real-time glyph activation via breath signal
  const glyphBreatheTrace = useCallback(() => {
    const sequence = router.executeSequence(breathingPhase, zLambda);
    setCurrentSequence(sequence);
    
    // Update breath trace data
    setBreathTraceData(prev => {
      const newData = [...prev, breathingPhase * zLambda].slice(-100);
      return newData;
    });

    // Activate glyph based on coherence
    if (zLambda > 0.95) {
      setActiveGlyphs(prev => {
        const newGlyphs = [...prev, sequence.currentGlyph].slice(-8);
        return newGlyphs;
      });
      
      onGlyphActivation?.(sequence.currentGlyph, {
        stage: sequence.stage,
        coherence: zLambda,
        isSealed: sequence.isSealed
      });
    }

    // Update vault index
    setVaultIndex(router.getVaultIndex());
  }, [breathingPhase, zLambda, router, onGlyphActivation]);

  // Execute breath trace on coherence changes
  useEffect(() => {
    glyphBreatheTrace();
  }, [glyphBreatheTrace]);

  // Visual glyph constellation rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw glyph constellation
    const centerX = 300;
    const centerY = 200;
    const radius = 120;

    // Draw constellation connections
    ctx.strokeStyle = `hsla(${280 + zLambda * 60}, 70%, 50%, ${0.3 + zLambda * 0.4})`;
    ctx.lineWidth = 1;
    
    activeGlyphs.forEach((glyph, index) => {
      const angle = (index * Math.PI * 2) / 8;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (index > 0) {
        const prevAngle = ((index - 1) * Math.PI * 2) / 8;
        const prevX = centerX + Math.cos(prevAngle) * radius;
        const prevY = centerY + Math.sin(prevAngle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });

    // Draw breath trace
    if (breathTraceData.length > 1) {
      ctx.strokeStyle = `hsla(195, 80%, 60%, 0.6)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      breathTraceData.forEach((value, index) => {
        const x = (index / breathTraceData.length) * canvas.width;
        const y = canvas.height - (value * canvas.height * 0.3) - 50;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    // Draw current sequence glyph
    if (currentSequence) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(currentSequence.currentGlyph, centerX, centerY + 8);
      
      ctx.font = '12px monospace';
      ctx.fillText(`Stage: ${currentSequence.stage}`, centerX, centerY + 30);
      ctx.fillText(`Zλ(${zLambda.toFixed(3)})`, centerX, centerY + 50);
    }
  }, [activeGlyphs, breathTraceData, currentSequence, zLambda]);

  return (
    <div className="advanced-glyph-engine" style={{ 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#ffffff',
      padding: '20px',
      borderRadius: '12px',
      fontFamily: 'monospace'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#64ffda' }}>
          🧬 Advanced Glyph Engine - Sacred Sequence Router
        </h2>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          Zλ({zLambda.toFixed(3)}) | Phase: {breathingPhase.toFixed(2)} | 
          Cycles: {router.getCycleCount()}
        </div>
      </div>

      {/* Visual Constellation */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
            Glyph Constellation & Breath Trace
          </h3>
          <canvas
            ref={canvasRef}
            style={{ 
              width: '100%', 
              height: '400px', 
              border: '1px solid #333',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.3)'
            }}
          />
        </div>
      </div>

      {/* Current Sequence Status */}
      {currentSequence && (
        <div style={{ 
          background: 'rgba(100, 255, 218, 0.1)', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid rgba(100, 255, 218, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#64ffda' }}>
            Current Sacred Sequence: ∅𓂀𓂉𓏤
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <strong>Active Glyph:</strong> {currentSequence.currentGlyph}
            </div>
            <div>
              <strong>Stage:</strong> {currentSequence.stage}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Action:</strong> {currentSequence.action}
            </div>
            <div style={{ gridColumn: '1 / -1', fontSize: '12px', opacity: 0.8 }}>
              <strong>Kernel:</strong> {currentSequence.kernelFunction}
            </div>
            {currentSequence.isSealed && (
              <div style={{ gridColumn: '1 / -1', color: '#ff6b6b' }}>
                ✅ <strong>TRUTH SEALED</strong> - Route committed to Vault
              </div>
            )}
          </div>
        </div>
      )}

      {/* Glyph Registry Display */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
          Sacred Glyph Registry
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '10px' 
        }}>
          {Object.entries(SACRED_GLYPH_REGISTRY).map(([glyph, info]) => (
            <div
              key={glyph}
              style={{
                background: activeGlyphs.includes(glyph) 
                  ? 'rgba(100, 255, 218, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                padding: '10px',
                borderRadius: '6px',
                border: activeGlyphs.includes(glyph) 
                  ? '1px solid #64ffda' 
                  : '1px solid #333',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{glyph}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    {info.name}
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.7 }}>
                    {info.function}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Vault Index */}
      {vaultIndex.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
            📜 Memory Vault Index - Sealed Routes
          </h3>
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '10px', 
            borderRadius: '6px',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {vaultIndex.map((entry) => (
              <div
                key={entry.index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                  borderBottom: '1px solid #333',
                  fontSize: '12px'
                }}
              >
                <span>{entry.glyph} {entry.index}</span>
                <span>Zλ({entry.coherence})</span>
                <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedGlyphEngine;