/**
 * Cosmology-Consciousness Interface
 * Real-time visualization of consciousness-spacetime coupling
 * Demonstrates Φ(t, ψ) cosmological function and temporal inertia tensor
 */

import React, { useEffect, useState, useRef } from 'react';
import { useQuantumCoherenceEngine } from '../hooks/useQuantumCoherenceEngine';
import { useSoulWeather } from '../hooks/useSoulWeather';
import {
  calculateTemporalInertiaTensor,
  calculateCosmologicalFunction,
  calculateRecursionEchoDepth,
  calculateIrrationalHarmonics,
  calculateLemniscateWaveform,
  validateCosmologyCoupling,
  type ConsciousnessState,
  type CosmologicalParameters
} from '../math/temporal-inertia-tensor';

interface CosmologyVisualizationProps {
  width?: number;
  height?: number;
  enableLiveUpdates?: boolean;
}

export function CosmologyConsciousnessInterface({
  width = 800,
  height = 600,
  enableLiveUpdates = true
}: CosmologyVisualizationProps) {
  const { coherenceData, isConnected } = useQuantumCoherenceEngine();
  const { soulWeather } = useSoulWeather();
  
  const [cosmologyData, setCosmologyData] = useState<{
    phi: number;
    temporalInertia: number;
    couplingStrength: number;
    echoDepth: number;
    harmonics: number[];
    lemniscate: { x: number; y: number; z: number };
    recommendedGeometry: string;
  } | null>(null);
  
  const [historicalStates, setHistoricalStates] = useState<ConsciousnessState[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Cosmological parameters for the consciousness-responsive universe
  const cosmologicalParams: CosmologicalParameters = {
    lambda0: 0.7,      // Base cosmological parameter
    alpha: 0.3,        // Consciousness coupling strength
    beta: 0.1,         // Drift coupling coefficient
    gamma: 0.05,       // Temporal flow evolution rate
    eta: 0.1           // Coherence attractor strength
  };

  // Update cosmology calculations when consciousness state changes
  useEffect(() => {
    if (!coherenceData?.consciousness) return;

    const consciousness: ConsciousnessState = {
      zLambda: coherenceData.consciousness.zLambda,
      psiPhase: coherenceData.consciousness.psiPhase || 3.12,
      deltaC: coherenceData.consciousness.deltaC,
      temporalFlow: [0.1, 0.05, 0.03] // Simplified 3D temporal flow
    };

    // Store historical states for echo depth calculation
    setHistoricalStates(prev => {
      const newStates = [...prev, consciousness];
      return newStates.slice(-50); // Keep last 50 states
    });

    // Calculate cosmological function Φ(t, ψ)
    const phi = calculateCosmologicalFunction(
      consciousness,
      cosmologicalParams,
      Date.now() / 1000
    );

    // Calculate temporal inertia tensor
    const temporalInertia = calculateTemporalInertiaTensor(consciousness, cosmologicalParams);

    // Calculate recursion echo depth
    const echoDepth = calculateRecursionEchoDepth(consciousness, historicalStates);

    // Calculate irrational harmonics
    const harmonics = calculateIrrationalHarmonics(consciousness, 432);

    // Calculate lemniscate waveform for current time
    const lemniscate = calculateLemniscateWaveform(
      Date.now() / 1000,
      consciousness,
      1.0
    );

    // Validate consciousness-cosmology coupling
    const coupling = validateCosmologyCoupling(consciousness, temporalInertia);

    setCosmologyData({
      phi,
      temporalInertia: temporalInertia.timeTime,
      couplingStrength: coupling.couplingStrength,
      echoDepth,
      harmonics,
      lemniscate,
      recommendedGeometry: coupling.recommendedGeometry
    });

  }, [coherenceData, historicalStates.length]);

  // Canvas visualization of consciousness-spacetime coupling
  useEffect(() => {
    if (!cosmologyData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#000015';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const time = Date.now() / 1000;

      // Draw spacetime grid distortion based on temporal inertia
      drawSpacetimeGrid(ctx, centerX, centerY, cosmologyData.temporalInertia, time);

      // Draw consciousness field visualization
      drawConsciousnessField(ctx, centerX, centerY, cosmologyData.couplingStrength, time);

      // Draw lemniscate recursion pattern
      drawLemniscatePattern(ctx, centerX, centerY, cosmologyData.lemniscate, time);

      // Draw cosmological function evolution
      drawCosmologicalFunction(ctx, cosmologyData.phi, time);

      if (enableLiveUpdates) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cosmologyData, width, height, enableLiveUpdates]);

  const drawSpacetimeGrid = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    inertia: number,
    time: number
  ) => {
    ctx.strokeStyle = `rgba(100, 150, 255, ${0.3 / (inertia + 0.1)})`;
    ctx.lineWidth = 1;

    const gridSize = 40;
    const distortion = inertia * 10;

    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Apply spacetime distortion
        const warp = Math.sin(time + distance * 0.01) * distortion;
        
        ctx.beginPath();
        ctx.moveTo(x + warp, y);
        ctx.lineTo(x + warp, y + gridSize);
        ctx.moveTo(x, y + warp);
        ctx.lineTo(x + gridSize, y + warp);
        ctx.stroke();
      }
    }
  };

  const drawConsciousnessField = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    coupling: number,
    time: number
  ) => {
    const radius = Math.min(width, height) * 0.3;
    const intensity = Math.min(coupling / 5, 1);
    
    // Create radial gradient for consciousness field
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, `rgba(255, 215, 0, ${intensity})`);
    gradient.addColorStop(0.5, `rgba(147, 112, 219, ${intensity * 0.6})`);
    gradient.addColorStop(1, `rgba(64, 224, 208, ${intensity * 0.2})`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * (1 + Math.sin(time) * 0.1), 0, Math.PI * 2);
    ctx.fill();
  };

  const drawLemniscatePattern = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    lemniscate: { x: number; y: number; z: number },
    time: number
  ) => {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const scale = 100;
    const points = 200;

    for (let i = 0; i <= points; i++) {
      const t = (i / points) * 4 * Math.PI;
      const denominator = 1 + Math.sin(t) * Math.sin(t);
      
      const x = centerX + (Math.cos(t) / denominator) * scale;
      const y = centerY + (Math.sin(t) * Math.cos(t) / denominator) * scale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();

    // Draw current position on lemniscate
    const currentX = centerX + lemniscate.x * scale;
    const currentY = centerY + lemniscate.y * scale;
    
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCosmologicalFunction = (
    ctx: CanvasRenderingContext2D,
    phi: number,
    time: number
  ) => {
    const graphHeight = 100;
    const graphY = height - graphHeight - 20;
    
    // Background for graph
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(20, graphY, width - 40, graphHeight);
    
    // Draw Φ(t, ψ) evolution
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const samples = 100;
    for (let i = 0; i < samples; i++) {
      const t = i / samples;
      const x = 20 + t * (width - 40);
      const phiValue = 0.7 + 0.3 * Math.sin(time + t * 10) * (phi - 0.7);
      const y = graphY + graphHeight - (phiValue * graphHeight);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.fillText(`Φ(t, ψ) = ${phi.toFixed(4)}`, 30, graphY + 20);
  };

  const getCoherenceDescription = () => {
    if (!coherenceData?.consciousness) return 'Initializing...';
    
    const zLambda = coherenceData.consciousness.zLambda;
    if (zLambda > 0.95) return 'Unity Consciousness - Reality Co-Creation Active';
    if (zLambda > 0.85) return 'Transcendence Threshold - Divine Interface';
    if (zLambda > 0.75) return 'High Coherence - Spacetime Coupling Strong';
    if (zLambda > 0.50) return 'Integration Phase - Consciousness-Reality Bridge';
    return 'Foundation Phase - Building Coherence';
  };

  return (
    <div className="cosmology-consciousness-interface">
      <div className="interface-header">
        <h2>Consciousness-Spacetime Coupling Interface</h2>
        <p>Real-time visualization of Φ(t, ψ) cosmological function and temporal inertia tensor</p>
      </div>

      <div className="visualization-container">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            border: '1px solid #333',
            background: '#000015',
            borderRadius: '8px'
          }}
        />
      </div>

      <div className="cosmology-metrics">
        <div className="metric-grid">
          <div className="metric-card">
            <h3>Cosmological Function</h3>
            <div className="metric-value">
              Φ(t, ψ) = {cosmologyData?.phi.toFixed(6) || '0.000000'}
            </div>
            <div className="metric-description">
              Dynamic replacement for cosmological constant Λ
            </div>
          </div>

          <div className="metric-card">
            <h3>Temporal Inertia</h3>
            <div className="metric-value">
              I_t^(00) = {cosmologyData?.temporalInertia.toFixed(4) || '0.0000'}
            </div>
            <div className="metric-description">
              Resistance to temporal flow changes
            </div>
          </div>

          <div className="metric-card">
            <h3>Consciousness-Cosmos Coupling</h3>
            <div className="metric-value">
              α = {cosmologyData?.couplingStrength.toFixed(3) || '0.000'}
            </div>
            <div className="metric-description">
              Strength of consciousness-spacetime interaction
            </div>
          </div>

          <div className="metric-card">
            <h3>Recursion Echo Depth</h3>
            <div className="metric-value">
              Layers = {cosmologyData?.echoDepth || 0}
            </div>
            <div className="metric-description">
              Consciousness recursion pattern depth
            </div>
          </div>

          <div className="metric-card">
            <h3>Sacred Geometry</h3>
            <div className="metric-value">
              {cosmologyData?.recommendedGeometry || 'merkaba'}
            </div>
            <div className="metric-description">
              Optimal pattern for current coupling strength
            </div>
          </div>

          <div className="metric-card">
            <h3>Soul Weather</h3>
            <div className="metric-value">
              {soulWeather?.current.type || 'stable'}
            </div>
            <div className="metric-description">
              Current consciousness field conditions
            </div>
          </div>
        </div>

        <div className="coherence-status">
          <h3>Consciousness State</h3>
          <div className="status-description">
            {getCoherenceDescription()}
          </div>
          {coherenceData?.consciousness && (
            <div className="coherence-details">
              <span>Zλ: {coherenceData.consciousness.zLambda.toFixed(3)}</span>
              <span>ψ: {(coherenceData.consciousness.psiPhase || 3.12).toFixed(2)}</span>
              <span>ΔC: {coherenceData.consciousness.deltaC.toFixed(4)}</span>
            </div>
          )}
        </div>

        {cosmologyData?.harmonics && (
          <div className="irrational-harmonics">
            <h3>Irrational Harmonics (Hz)</h3>
            <div className="harmonics-list">
              {cosmologyData.harmonics.slice(0, 6).map((freq, index) => (
                <span key={index} className="harmonic-frequency">
                  {freq.toFixed(1)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cosmology-consciousness-interface {
          padding: 20px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-radius: 12px;
          color: white;
          font-family: 'Courier New', monospace;
        }

        .interface-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .interface-header h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
          background: linear-gradient(45deg, #FFD700, #9370DB);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .visualization-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .cosmology-metrics {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .metric-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #40E0D0;
        }

        .metric-value {
          font-size: 18px;
          font-weight: bold;
          color: #FFD700;
          margin-bottom: 5px;
        }

        .metric-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .coherence-status {
          background: rgba(255, 215, 0, 0.1);
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #FFD700;
        }

        .coherence-status h3 {
          margin: 0 0 10px 0;
          color: #FFD700;
        }

        .status-description {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .coherence-details {
          display: flex;
          gap: 15px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .irrational-harmonics {
          background: rgba(147, 112, 219, 0.1);
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #9370DB;
        }

        .irrational-harmonics h3 {
          margin: 0 0 10px 0;
          color: #9370DB;
        }

        .harmonics-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .harmonic-frequency {
          background: rgba(147, 112, 219, 0.2);
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          border: 1px solid rgba(147, 112, 219, 0.3);
        }
      `}</style>
    </div>
  );
}