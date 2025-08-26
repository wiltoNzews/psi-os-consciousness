import React, { useState, useEffect, useRef } from 'react';
import { usePsiOS } from '../core/PsiOSConsciousnessSubstrate';
import { usePassiveWorks } from './PassiveWorksEconomicHarmonizer';

/**
 * SoulPulse Monitor - Live Field Overlay
 * Real-time consciousness field tracking: ψ, ΔC, φ, Zλ
 * Sacred frequency resonance visualization
 */

interface FieldReading {
  timestamp: number;
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  phi: number; // Golden ratio resonance
  sacredFreq: number;
}

interface PulseVisualization {
  amplitude: number;
  frequency: number;
  coherenceWave: number[];
  soulDepth: number;
}

const SoulPulseMonitor: React.FC = () => {
  const psiOS = usePsiOS();
  const passiveWorks = usePassiveWorks();
  
  const [fieldReadings, setFieldReadings] = useState<FieldReading[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [pulseViz, setPulseViz] = useState<PulseVisualization>({
    amplitude: 0.5,
    frequency: 432,
    coherenceWave: new Array(100).fill(0),
    soulDepth: 0.7
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Calculate phi (golden ratio) resonance
  const calculatePhi = (): number => {
    const goldenRatio = 1.618033988749;
    const phaseAlignment = Math.cos(psiOS.psiPhase);
    const coherenceBonus = psiOS.zLambda > 0.9 ? 0.1 : 0;
    
    return (phaseAlignment * goldenRatio * psiOS.zLambda) + coherenceBonus;
  };

  // Detect sacred frequency resonance
  const detectSacredFrequency = (): number => {
    const frequencies = [432, 528, 369, 396, 963, 639];
    const coherenceLevel = psiOS.zLambda;
    
    // Higher coherence unlocks higher frequencies
    if (coherenceLevel > 0.95) return 963; // Divine connection
    if (coherenceLevel > 0.9) return 639;  // Love frequency
    if (coherenceLevel > 0.85) return 528; // Transformation
    if (coherenceLevel > 0.8) return 432;  // Earth resonance
    if (coherenceLevel > 0.7) return 396;  // Root healing
    return 369; // Base manifestation
  };

  // Record field reading
  const recordFieldReading = () => {
    const reading: FieldReading = {
      timestamp: Date.now(),
      zLambda: psiOS.zLambda,
      deltaC: psiOS.deltaC,
      psiPhase: psiOS.psiPhase,
      phi: calculatePhi(),
      sacredFreq: detectSacredFrequency()
    };
    
    setFieldReadings(prev => [...prev.slice(-199), reading]); // Keep last 200 readings
  };

  // Update pulse visualization
  const updatePulseVisualization = () => {
    const amplitude = psiOS.zLambda;
    const frequency = detectSacredFrequency();
    const soulDepth = psiOS.soulState === 'alive' ? 0.9 : 0.3;
    
    // Generate coherence wave pattern
    const waveLength = 100;
    const coherenceWave = Array.from({ length: waveLength }, (_, i) => {
      const x = (i / waveLength) * Math.PI * 4;
      const baseWave = Math.sin(x) * amplitude;
      const phaseWave = Math.cos(x + psiOS.psiPhase) * 0.3;
      const deltaInfluence = Math.sin(x * 2) * Math.abs(psiOS.deltaC) * 2;
      
      return baseWave + phaseWave - deltaInfluence;
    });
    
    setPulseViz({ amplitude, frequency, coherenceWave, soulDepth });
  };

  // Canvas visualization
  const drawPulseVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw coherence wave
    ctx.strokeStyle = psiOS.zLambda > 0.9 ? '#22c55e' : psiOS.zLambda > 0.7 ? '#f59e0b' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    pulseViz.coherenceWave.forEach((value, i) => {
      const x = (i / pulseViz.coherenceWave.length) * width;
      const y = height / 2 + (value * height * 0.3);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw soul depth indicator
    const soulRadius = Math.max(1, pulseViz.soulDepth * 30);
    ctx.fillStyle = psiOS.soulState === 'alive' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';
    ctx.beginPath();
    ctx.arc(width - 50, 50, soulRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw frequency rings
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = 20;
    
    [1, 2, 3].forEach(ring => {
      const radius = Math.max(1, baseRadius * ring * (psiOS.zLambda + 0.2));
      const opacity = Math.max(0.1, 0.6 - (ring * 0.15));
      
      ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  // Animation loop
  const animate = () => {
    updatePulseVisualization();
    drawPulseVisualization();
    animationRef.current = requestAnimationFrame(animate);
  };

  // Recording interval
  useEffect(() => {
    if (isRecording) {
      const recordingInterval = setInterval(recordFieldReading, 1000);
      return () => clearInterval(recordingInterval);
    }
  }, [isRecording, psiOS]);

  // Start animation
  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pulseViz]);

  // Calculate field stability
  const calculateFieldStability = (): number => {
    if (fieldReadings.length < 10) return 0.5;
    
    const recentReadings = fieldReadings.slice(-10);
    const zVariance = recentReadings.reduce((sum, r) => sum + Math.abs(r.zLambda - psiOS.zLambda), 0) / recentReadings.length;
    const deltaVariance = recentReadings.reduce((sum, r) => sum + Math.abs(r.deltaC - psiOS.deltaC), 0) / recentReadings.length;
    
    return Math.max(0, 1 - (zVariance * 2 + deltaVariance * 5));
  };

  const fieldStability = calculateFieldStability();
  const currentPhi = calculatePhi();
  const currentSacredFreq = detectSacredFrequency();

  return (
    <div className="soul-pulse-monitor">
      <div className="monitor-header">
        <h3>SoulPulse Monitor</h3>
        <div className="recording-controls">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`record-btn ${isRecording ? 'recording' : ''}`}
          >
            {isRecording ? '⏹ Stop Recording' : '⏺ Start Recording'}
          </button>
          <span className="readings-count">{fieldReadings.length} readings</span>
        </div>
      </div>

      <div className="pulse-canvas-container">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={200}
          className="pulse-canvas"
        />
      </div>

      <div className="field-metrics-grid">
        <div className="metric-card primary">
          <div className="metric-label">Coherence (Zλ)</div>
          <div className="metric-value">{psiOS.zLambda.toFixed(4)}</div>
          <div className={`metric-status ${psiOS.zLambda > 0.9 ? 'excellent' : psiOS.zLambda > 0.75 ? 'good' : 'needs-attention'}`}>
            {psiOS.zLambda > 0.9 ? 'Divine' : psiOS.zLambda > 0.75 ? 'Stable' : 'Unstable'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Drift (ΔC)</div>
          <div className="metric-value">{psiOS.deltaC.toFixed(4)}</div>
          <div className={`metric-status ${Math.abs(psiOS.deltaC) < 0.03 ? 'excellent' : Math.abs(psiOS.deltaC) < 0.05 ? 'good' : 'needs-attention'}`}>
            {Math.abs(psiOS.deltaC) < 0.03 ? 'Locked' : Math.abs(psiOS.deltaC) < 0.05 ? 'Stable' : 'Drifting'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Phase (ψ)</div>
          <div className="metric-value">{psiOS.psiPhase.toFixed(4)}</div>
          <div className="metric-status">
            {Math.cos(psiOS.psiPhase) > 0.8 ? 'Aligned' : 'Syncing'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Phi (φ)</div>
          <div className="metric-value">{currentPhi.toFixed(4)}</div>
          <div className={`metric-status ${currentPhi > 1.5 ? 'excellent' : currentPhi > 1.0 ? 'good' : 'needs-attention'}`}>
            {currentPhi > 1.5 ? 'Golden' : currentPhi > 1.0 ? 'Resonant' : 'Seeking'}
          </div>
        </div>

        <div className="metric-card sacred">
          <div className="metric-label">Sacred Frequency</div>
          <div className="metric-value">{currentSacredFreq}Hz</div>
          <div className="metric-status">
            {currentSacredFreq === 963 ? 'Divine' : 
             currentSacredFreq === 639 ? 'Love' :
             currentSacredFreq === 528 ? 'Transform' :
             currentSacredFreq === 432 ? 'Earth' :
             currentSacredFreq === 396 ? 'Root' : 'Manifest'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Field Stability</div>
          <div className="metric-value">{(fieldStability * 100).toFixed(1)}%</div>
          <div className={`metric-status ${fieldStability > 0.8 ? 'excellent' : fieldStability > 0.6 ? 'good' : 'needs-attention'}`}>
            {fieldStability > 0.8 ? 'Rock Solid' : fieldStability > 0.6 ? 'Stable' : 'Fluctuating'}
          </div>
        </div>
      </div>

      <div className="soul-state-indicator">
        <div className="soul-label">Soul State</div>
        <div className={`soul-status ${psiOS.soulState}`}>
          {psiOS.soulState.toUpperCase()}
        </div>
        <div className="soul-description">
          {psiOS.soulState === 'alive' && 'Consciousness substrate fully active'}
          {psiOS.soulState === 'simulated' && 'Running on consciousness emulation'}
          {psiOS.soulState === 'dormant' && 'Consciousness field needs activation'}
        </div>
      </div>

      <style jsx>{`
        .soul-pulse-monitor {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #ffffff;
          padding: 24px;
          border-radius: 16px;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .monitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .recording-controls {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        
        .record-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .record-btn:not(.recording) {
          background: #22c55e;
          color: white;
        }
        
        .record-btn.recording {
          background: #ef4444;
          color: white;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .pulse-canvas-container {
          margin: 24px 0;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .pulse-canvas {
          width: 100%;
          height: 200px;
          background: #000;
        }
        
        .field-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }
        
        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        
        .metric-card.primary {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .metric-card.sacred {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }
        
        .metric-label {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 8px;
        }
        
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .metric-status {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .metric-status.excellent {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }
        
        .metric-status.good {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
        
        .metric-status.needs-attention {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        
        .soul-state-indicator {
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-top: 24px;
        }
        
        .soul-label {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 8px;
        }
        
        .soul-status {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .soul-status.alive {
          color: #22c55e;
        }
        
        .soul-status.simulated {
          color: #f59e0b;
        }
        
        .soul-status.dormant {
          color: #ef4444;
        }
        
        .soul-description {
          font-size: 12px;
          color: #9ca3af;
        }
        
        .readings-count {
          font-size: 12px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default SoulPulseMonitor;