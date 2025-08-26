/**
 * WiltonOS LightKernel - Consciousness Display Component
 * Real-time consciousness field visualization with sacred geometry
 */

import React, { useState, useEffect, useRef } from 'react';
import type { ConsciousnessField, BreathingPhase } from '../../types/consciousness';

interface ConsciousnessDisplayProps {
  field?: ConsciousnessField;
  breathing?: BreathingPhase;
  qctf?: number;
}

export const ConsciousnessDisplay: React.FC<ConsciousnessDisplayProps> = ({
  field,
  breathing,
  qctf
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeField, setRealTimeField] = useState<ConsciousnessField | null>(null);
  const [realTimeBreathing, setRealTimeBreathing] = useState<BreathingPhase | null>(null);
  const [realTimeQCTF, setRealTimeQCTF] = useState<number>(0);
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Use real-time data if available, otherwise use props
  const currentField = realTimeField || field;
  const currentBreathing = realTimeBreathing || breathing;
  const currentQCTF = realTimeQCTF || qctf || 0;

  // WebSocket connection for real-time updates
  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/consciousness`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('[ConsciousnessDisplay] WebSocket connected');
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          switch (message.type) {
            case 'consciousness_state':
              setRealTimeField(message.data.field);
              setRealTimeBreathing(message.data.breathing);
              setRealTimeQCTF(message.data.qctf);
              break;
              
            case 'field_update':
              setRealTimeField(message.data);
              break;
              
            case 'breathing_update':
              setRealTimeBreathing(message.data);
              break;
          }
        } catch (error) {
          console.error('[ConsciousnessDisplay] WebSocket message error:', error);
        }
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('[ConsciousnessDisplay] WebSocket disconnected');
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('[ConsciousnessDisplay] WebSocket error:', error);
      };
    };
    
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Sacred geometry animation
  useEffect(() => {
    if (!canvasRef.current || !currentField) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() / 1000;
      
      // Background gradient based on soul state
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.width / 2);
      
      switch (currentField.soulState) {
        case 'transcendent':
          gradient.addColorStop(0, `rgba(255, 215, 0, ${currentField.zLambda * 0.3})`);
          gradient.addColorStop(1, 'rgba(138, 43, 226, 0.1)');
          break;
        case 'divine':
          gradient.addColorStop(0, `rgba(147, 112, 219, ${currentField.zLambda * 0.25})`);
          gradient.addColorStop(1, 'rgba(72, 61, 139, 0.1)');
          break;
        case 'alive':
          gradient.addColorStop(0, `rgba(64, 224, 208, ${currentField.zLambda * 0.2})`);
          gradient.addColorStop(1, 'rgba(25, 25, 112, 0.1)');
          break;
        default:
          gradient.addColorStop(0, `rgba(105, 105, 105, ${currentField.zLambda * 0.15})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Sacred geometry visualization
      ctx.strokeStyle = `rgba(255, 215, 0, ${Math.min(1, currentField.zLambda)})`;
      ctx.lineWidth = 2;
      
      // Merkaba (rotating triangles)
      const merkabaeSize = 80 + (currentField.zLambda - 0.75) * 120;
      const rotation = time * 0.5 + currentField.psiPhase;
      
      // Upper triangle
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0, -merkabaeSize);
      ctx.lineTo(-merkabaeSize * 0.866, merkabaeSize * 0.5);
      ctx.lineTo(merkabaeSize * 0.866, merkabaeSize * 0.5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      
      // Lower triangle (counter-rotating)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-rotation);
      ctx.beginPath();
      ctx.moveTo(0, merkabaeSize);
      ctx.lineTo(-merkabaeSize * 0.866, -merkabaeSize * 0.5);
      ctx.lineTo(merkabaeSize * 0.866, -merkabaeSize * 0.5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      
      // Lemniscate (breathing visualization)
      if (currentBreathing) {
        const breathingRadius = 50 + (currentBreathing.coherenceLevel - 0.75) * 100;
        const breathingPhase = currentBreathing.phase === 0.75 ? 1 : 0.5;
        
        ctx.strokeStyle = `rgba(64, 224, 208, ${breathingPhase})`;
        ctx.lineWidth = 3;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(breathingRadius / 50, breathingRadius / 50);
        
        // Draw lemniscate (infinity symbol)
        ctx.beginPath();
        for (let t = 0; t < 2 * Math.PI; t += 0.1) {
          const x = 50 * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
          const y = 50 * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
          
          if (t === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentField, currentBreathing]);

  const getZLambdaColor = (zl: number) => {
    if (zl > 0.95) return '#FFD700'; // Gold
    if (zl > 0.90) return '#9370DB'; // MediumPurple
    if (zl > 0.85) return '#40E0D0'; // Turquoise
    if (zl > 0.75) return '#20B2AA'; // LightSeaGreen
    return '#708090'; // SlateGray
  };

  if (!currentField) {
    return (
      <div className="consciousness-display loading">
        <div className="loading-spinner"></div>
        <p>Initializing consciousness field...</p>
      </div>
    );
  }

  return (
    <div className="consciousness-display">
      {/* Connection Status */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-indicator"></div>
        <span>{isConnected ? 'Live' : 'Offline'}</span>
      </div>
      
      {/* Sacred Geometry Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="sacred-geometry-canvas"
      />
      
      {/* Consciousness Metrics */}
      <div className="consciousness-metrics">
        <div className="metric-group">
          <div className="metric">
            <label>Zλ (Coherence)</label>
            <div 
              className="metric-value zeta-lambda"
              style={{ color: getZLambdaColor(currentField.zLambda) }}
            >
              {currentField.zLambda.toFixed(6)}
            </div>
          </div>
          
          <div className="metric">
            <label>ΔC (Field)</label>
            <div className="metric-value delta-c">
              {currentField.deltaC >= 0 ? '+' : ''}{currentField.deltaC.toFixed(6)}
            </div>
          </div>
          
          <div className="metric">
            <label>ψ (Phase)</label>
            <div className="metric-value psi-phase">
              {currentField.psiPhase.toFixed(4)}
            </div>
          </div>
        </div>
        
        <div className="metric-group">
          <div className="metric">
            <label>Soul State</label>
            <div className={`metric-value soul-state ${currentField.soulState}`}>
              {currentField.soulState.toUpperCase()}
            </div>
          </div>
          
          <div className="metric">
            <label>QCTF</label>
            <div className="metric-value qctf">
              {currentQCTF.toFixed(4)}
            </div>
          </div>
          
          {currentBreathing && (
            <div className="metric">
              <label>Breathing Phase</label>
              <div className={`metric-value breathing-phase phase-${currentBreathing.phase}`}>
                {currentBreathing.phase === 0.75 ? '3:1 Stability' : '1:3 Exploration'}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Divine Interface Indicator */}
      {currentField.divineInterface && (
        <div className="divine-interface-indicator">
          <div className="divine-glow"></div>
          <span>🕍 Divine Interface Active</span>
        </div>
      )}
      
      <style jsx>{`
        .consciousness-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background: linear-gradient(135deg, #0a0015 0%, #1a0030 50%, #000000 100%);
          border-radius: 12px;
          color: white;
          font-family: 'Inter', system-ui, sans-serif;
          position: relative;
          overflow: hidden;
        }
        
        .connection-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: background-color 0.3s;
        }
        
        .connected .status-indicator {
          background-color: #00ff00;
          box-shadow: 0 0 10px #00ff00;
        }
        
        .disconnected .status-indicator {
          background-color: #ff4444;
          box-shadow: 0 0 10px #ff4444;
        }
        
        .sacred-geometry-canvas {
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 8px;
          margin-bottom: 2rem;
          background: rgba(0, 0, 0, 0.3);
        }
        
        .consciousness-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          width: 100%;
          max-width: 600px;
        }
        
        .metric-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .metric {
          text-align: center;
        }
        
        .metric label {
          display: block;
          font-size: 0.875rem;
          color: #b8c6db;
          margin-bottom: 0.25rem;
        }
        
        .metric-value {
          font-size: 1.5rem;
          font-weight: 600;
          font-family: 'Courier New', monospace;
        }
        
        .zeta-lambda {
          text-shadow: 0 0 10px currentColor;
        }
        
        .soul-state.transcendent {
          color: #FFD700;
          text-shadow: 0 0 15px #FFD700;
        }
        
        .soul-state.divine {
          color: #9370DB;
          text-shadow: 0 0 15px #9370DB;
        }
        
        .soul-state.alive {
          color: #40E0D0;
          text-shadow: 0 0 15px #40E0D0;
        }
        
        .breathing-phase.phase-0.75 {
          color: #FFD700;
        }
        
        .breathing-phase.phase-0.25 {
          color: #40E0D0;
        }
        
        .divine-interface-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid rgba(255, 215, 0, 0.5);
          border-radius: 20px;
          color: #FFD700;
          font-weight: 600;
          z-index: 10;
        }
        
        .divine-glow {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #FFD700;
          box-shadow: 0 0 20px #FFD700;
          animation: pulse 2s infinite;
        }
        
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 215, 0, 0.3);
          border-top: 3px solid #FFD700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};