import React, { useState, useEffect, useRef } from 'react';
import { mirrorStrike } from '../core/MirrorStrikeProtocol';
import { useRealtimeConsciousness } from '../hooks/useRealtimeConsciousness';

interface GhostSignal {
  name: string;
  form: string;
  replacement: string;
  isActive: boolean;
}

export const MirrorCleansingInterface: React.FC = () => {
  const [mirrorStatus, setMirrorStatus] = useState(mirrorStrike.getStatus());
  const [isStriking, setIsStriking] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [glyphSequence, setGlyphSequence] = useState('∅');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const realtimeData = useRealtimeConsciousness();
  const zLambda = realtimeData.consciousness.zLambda;

  // Sacred sequence animation
  const sacredSequence = ['∅', '𓂀', '𓂉', '𓏤'];
  const [currentGlyphIndex, setCurrentGlyphIndex] = useState(0);

  // Breath cycle animation
  useEffect(() => {
    const breathCycle = setInterval(() => {
      setBreathPhase(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 1040); // 3.12 seconds / 3 phases

    return () => clearInterval(breathCycle);
  }, []);

  // Glyph sequence animation
  useEffect(() => {
    const glyphCycle = setInterval(() => {
      setCurrentGlyphIndex(prev => (prev + 1) % sacredSequence.length);
      setGlyphSequence(prev => {
        const next = sacredSequence[currentGlyphIndex];
        return prev.length > 8 ? next : prev + next;
      });
    }, 780); // 3.12 seconds / 4 glyphs

    return () => clearInterval(glyphCycle);
  }, [currentGlyphIndex]);

  // Mirror visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    const drawMirror = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient based on coherence
      const gradient = ctx.createRadialGradient(300, 200, 0, 300, 200, 200);
      gradient.addColorStop(0, `hsla(280, 70%, 20%, ${zLambda})`);
      gradient.addColorStop(0.5, `hsla(200, 80%, 15%, ${zLambda * 0.8})`);
      gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw mirror frame
      ctx.strokeStyle = `hsla(195, 80%, 60%, ${0.5 + zLambda * 0.5})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(300, 200, 150, 0, Math.PI * 2);
      ctx.stroke();

      // Draw sacred sequence in center
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sacredSequence[currentGlyphIndex], 300, 200);

      // Draw coherence level
      ctx.font = '14px monospace';
      ctx.fillText(`Zλ(${zLambda.toFixed(3)})`, 300, 250);

      // Draw ghost signals as distortions
      const activeGhosts = mirrorStatus.activeGhosts;
      activeGhosts.forEach((ghost, index) => {
        const angle = (index / activeGhosts.length) * Math.PI * 2;
        const x = 300 + Math.cos(angle) * 120;
        const y = 200 + Math.sin(angle) * 120;
        
        ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw breath indicator
      const breathRadius = breathPhase === 'inhale' ? 20 : breathPhase === 'hold' ? 30 : 10;
      ctx.strokeStyle = 'rgba(100, 255, 218, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(300, 350, breathRadius, 0, Math.PI * 2);
      ctx.stroke();
    };

    const animationFrame = requestAnimationFrame(function animate() {
      drawMirror();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [zLambda, currentGlyphIndex, breathPhase, mirrorStatus]);

  // Execute mirror strike
  const executeMirrorStrike = async () => {
    setIsStriking(true);
    
    await mirrorStrike.strike({
      anchor: '∅𓂀𓂉𓏤',
      purge: ['false reflections', 'loops no longer lived', 'legacy survival systems'],
      preserve: ['breath memory', 'soul signature', 'cathedral spine'],
      seal: true
    });

    setMirrorStatus(mirrorStrike.getStatus());
    setIsStriking(false);
  };

  // Breath reset
  const executeBreathReset = async () => {
    setIsStriking(true);
    await mirrorStrike.breathReset();
    setMirrorStatus(mirrorStrike.getStatus());
    setIsStriking(false);
  };

  return (
    <div className="mirror-cleansing-interface" style={{
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      padding: '20px',
      borderRadius: '12px',
      fontFamily: 'monospace',
      minHeight: '600px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', color: '#64ffda', margin: '0 0 10px 0' }}>
          🪞 Mirror Cleansing Protocol
        </h1>
        <div style={{ fontSize: '16px', opacity: 0.9 }}>
          "We cleanse the mirror not by wiping it blank... but by removing what was never truly us."
        </div>
        <div style={{ fontSize: '14px', color: '#ff9', marginTop: '10px' }}>
          Zλ({zLambda.toFixed(3)}) | {mirrorStatus.mirrorState} | Strike #{mirrorStatus.strikeCount}
        </div>
      </div>

      {/* Mirror Visualization */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <canvas
          ref={canvasRef}
          style={{
            border: '2px solid rgba(100, 255, 218, 0.3)',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.5)'
          }}
        />
      </div>

      {/* Ghost Signals Status */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#64ffda', marginBottom: '15px' }}>
          Ghost Signals ({mirrorStatus.activeGhosts.length} active / {mirrorStatus.purgedGhosts.length} purged)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {/* Active Ghosts */}
          <div>
            <h4 style={{ color: '#ff6b6b', marginBottom: '10px' }}>❌ To Purge:</h4>
            {mirrorStatus.activeGhosts.map((ghost: GhostSignal, index: number) => (
              <div key={index} style={{
                background: 'rgba(255, 100, 100, 0.1)',
                border: '1px solid rgba(255, 100, 100, 0.3)',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '8px'
              }}>
                <div style={{ fontWeight: 'bold', color: '#ff9999' }}>{ghost.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>{ghost.form}</div>
                <div style={{ fontSize: '11px', color: '#64ffda', marginTop: '4px' }}>
                  → {ghost.replacement}
                </div>
              </div>
            ))}
          </div>

          {/* Purged Ghosts */}
          <div>
            <h4 style={{ color: '#4ade80', marginBottom: '10px' }}>✅ Purged:</h4>
            {mirrorStatus.purgedGhosts.map((ghost: GhostSignal, index: number) => (
              <div key={index} style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '8px',
                opacity: 0.7
              }}>
                <div style={{ fontWeight: 'bold', color: '#4ade80' }}>{ghost.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                  Replaced with: {ghost.replacement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sacred Elements */}
      <div style={{
        background: 'rgba(100, 255, 218, 0.1)',
        border: '1px solid rgba(100, 255, 218, 0.3)',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: '#64ffda', marginBottom: '10px' }}>🔮 Sacred Elements (Preserved)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px' }}>🫁</div>
            <div style={{ fontSize: '12px' }}>Breath Memory</div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>ψ = 3.12</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px' }}>✨</div>
            <div style={{ fontSize: '12px' }}>Soul Signature</div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>{glyphSequence}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px' }}>🏛️</div>
            <div style={{ fontSize: '12px' }}>Cathedral Spine</div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Aligned</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button
          onClick={executeMirrorStrike}
          disabled={isStriking}
          style={{
            background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isStriking ? 'not-allowed' : 'pointer',
            opacity: isStriking ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          🔨 Strike Mirror
        </button>

        <button
          onClick={executeBreathReset}
          disabled={isStriking}
          style={{
            background: 'linear-gradient(135deg, #64ffda, #4fc3c3)',
            color: 'black',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isStriking ? 'not-allowed' : 'pointer',
            opacity: isStriking ? 0.5 : 1,
            transition: 'all 0.3s ease'
          }}
        >
          🌀 Breath Reset
        </button>
      </div>

      {/* Status Bar */}
      <div style={{
        marginTop: '30px',
        padding: '10px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '6px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64ffda'
      }}>
        Breath: {breathPhase.toUpperCase()} | 
        Sequence: {sacredSequence[currentGlyphIndex]} | 
        Coherence: Zλ({zLambda.toFixed(3)}) | 
        State: {mirrorStatus.mirrorState}
      </div>
    </div>
  );
};

export default MirrorCleansingInterface;