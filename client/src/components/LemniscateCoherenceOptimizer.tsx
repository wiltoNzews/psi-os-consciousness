import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface OptimizationMetrics {
  currentCoherence: number;
  targetCoherence: number;
  fractalTightness: number;
  breathAlignment: number;
  glyphResonance: number;
  fieldStability: number;
}

interface LemniscateCoherenceOptimizerProps {
  threshold?: number;
  onOptimizationComplete?: (metrics: OptimizationMetrics) => void;
}

export const LemniscateCoherenceOptimizer: React.FC<LemniscateCoherenceOptimizerProps> = ({ 
  threshold = 0.975,
  onOptimizationComplete 
}) => {
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    currentCoherence: 0.750,
    targetCoherence: threshold,
    fractalTightness: 0,
    breathAlignment: 0,
    glyphResonance: 0,
    fieldStability: 0
  });
  const [optimizing, setOptimizing] = useState(false);
  const [phase, setPhase] = useState<'scanning' | 'aligning' | 'tightening' | 'complete'>('scanning');
  const [lemniscatePoints, setLemniscatePoints] = useState<{x: number, y: number}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Generate lemniscate points
  useEffect(() => {
    const points: {x: number, y: number}[] = [];
    const resolution = 100;
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * Math.PI * 2;
      const scale = 100;
      
      // Lemniscate of Bernoulli equation
      const x = (scale * Math.cos(t)) / (1 + Math.sin(t) ** 2);
      const y = (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) ** 2);
      
      points.push({ x, y });
    }
    
    setLemniscatePoints(points);
  }, []);

  // Optimization sequence
  const runOptimization = async () => {
    setOptimizing(true);
    setPhase('scanning');
    
    // Phase 1: Scanning - Find loose fractals
    await optimizePhase('scanning', (progress) => {
      setMetrics(prev => ({
        ...prev,
        fractalTightness: progress * 0.95,
        currentCoherence: 0.750 + (progress * 0.05)
      }));
    });
    
    // Phase 2: Aligning - Align with breath patterns
    setPhase('aligning');
    await optimizePhase('aligning', (progress) => {
      setMetrics(prev => ({
        ...prev,
        breathAlignment: progress * 0.98,
        currentCoherence: prev.currentCoherence + (progress * 0.1)
      }));
    });
    
    // Phase 3: Tightening - Tighten every loose fractal
    setPhase('tightening');
    await optimizePhase('tightening', (progress) => {
      setMetrics(prev => ({
        ...prev,
        glyphResonance: progress * 0.97,
        fieldStability: progress * 0.99,
        currentCoherence: Math.min(
          prev.currentCoherence + (progress * 0.125),
          threshold
        )
      }));
    });
    
    setPhase('complete');
    setOptimizing(false);
    
    // Trigger callback with final metrics
    if (onOptimizationComplete) {
      onOptimizationComplete(metrics);
    }
  };

  // Simulate optimization phase
  const optimizePhase = (phaseName: string, updateFn: (progress: number) => void): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.05;
        updateFn(Math.min(progress, 1));
        
        if (progress >= 1) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };

  // Animate lemniscate visualization
  useEffect(() => {
    if (!canvasRef.current || !optimizing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let time = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw lemniscate path
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Main lemniscate
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + metrics.currentCoherence * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      lemniscatePoints.forEach((point, i) => {
        const x = point.x * (1 + Math.sin(time * 0.02 + i * 0.1) * 0.1);
        const y = point.y * (1 + Math.cos(time * 0.02 + i * 0.1) * 0.1);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.closePath();
      ctx.stroke();
      
      // Draw coherence field
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
      gradient.addColorStop(0, `rgba(138, 43, 226, ${metrics.currentCoherence * 0.3})`);
      gradient.addColorStop(0.5, `rgba(0, 255, 255, ${metrics.currentCoherence * 0.2})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
      
      // Draw optimization particles
      if (phase === 'tightening') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 20; i++) {
          const angle = (time * 0.05 + i * Math.PI / 10) % (Math.PI * 2);
          const r = 80 + Math.sin(angle * 3) * 20;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r * 0.5;
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
      
      time++;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [optimizing, lemniscatePoints, metrics, phase]);

  return (
    <div className="lemniscate-coherence-optimizer p-6 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 rounded-xl">
      <div className="header mb-4">
        <h2 className="text-2xl font-bold text-violet-300">
          🛠️ Lemniscate Coherence Optimizer
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Tightening every loose fractal • Aligning with the Wilton Formula
        </p>
      </div>

      {/* Visualization Canvas */}
      <div className="visualization mb-6 flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="bg-black/40 rounded-lg border border-violet-600/30"
        />
      </div>

      {/* Metrics Display */}
      <div className="metrics-grid grid grid-cols-2 gap-4 mb-6">
        <div className="metric-card p-3 bg-violet-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-violet-400">Current Coherence</span>
            <span className="text-lg font-bold text-cyan-300">
              Zλ: {metrics.currentCoherence.toFixed(3)}
            </span>
          </div>
          <div className="progress-bar h-2 bg-gray-700 rounded">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded"
              animate={{ width: `${(metrics.currentCoherence / threshold) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="metric-card p-3 bg-violet-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-violet-400">Target Threshold</span>
            <span className="text-lg font-bold text-yellow-300">
              {threshold.toFixed(3)}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            3:1 ↔ 1:3 Wilton Formula
          </div>
        </div>

        <div className="metric-card p-3 bg-violet-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-violet-400">Fractal Tightness</span>
            <span className="text-sm font-bold text-green-300">
              {(metrics.fractalTightness * 100).toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar h-1 bg-gray-700 rounded">
            <motion.div
              className="h-full bg-green-500 rounded"
              animate={{ width: `${metrics.fractalTightness * 100}%` }}
            />
          </div>
        </div>

        <div className="metric-card p-3 bg-violet-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-violet-400">Breath Alignment</span>
            <span className="text-sm font-bold text-blue-300">
              {(metrics.breathAlignment * 100).toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar h-1 bg-gray-700 rounded">
            <motion.div
              className="h-full bg-blue-500 rounded"
              animate={{ width: `${metrics.breathAlignment * 100}%` }}
            />
          </div>
        </div>

        <div className="metric-card p-3 bg-violet-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-violet-400">Glyph Resonance</span>
            <span className="text-sm font-bold text-purple-300">
              {(metrics.glyphResonance * 100).toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar h-1 bg-gray-700 rounded">
            <motion.div
              className="h-full bg-purple-500 rounded"
              animate={{ width: `${metrics.glyphResonance * 100}%` }}
            />
          </div>
        </div>

        <div className="metric-card p-3 bg-violet-900/20 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-violet-400">Field Stability</span>
            <span className="text-sm font-bold text-cyan-300">
              {(metrics.fieldStability * 100).toFixed(1)}%
            </span>
          </div>
          <div className="progress-bar h-1 bg-gray-700 rounded">
            <motion.div
              className="h-full bg-cyan-500 rounded"
              animate={{ width: `${metrics.fieldStability * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Optimization Control */}
      <div className="control-section">
        <motion.button
          className={`w-full py-3 rounded-lg font-semibold text-white ${
            optimizing 
              ? 'bg-gradient-to-r from-orange-500 to-red-500' 
              : phase === 'complete'
              ? 'bg-gradient-to-r from-green-500 to-cyan-500'
              : 'bg-gradient-to-r from-violet-500 to-indigo-500'
          }`}
          whileHover={{ scale: optimizing ? 1 : 1.02 }}
          whileTap={{ scale: optimizing ? 1 : 0.98 }}
          onClick={runOptimization}
          disabled={optimizing}
        >
          {optimizing 
            ? `Optimizing... (${phase})`
            : phase === 'complete' 
            ? `✓ Optimization Complete - Zλ: ${metrics.currentCoherence.toFixed(3)}`
            : 'Initialize Coherence Optimization'
          }
        </motion.button>

        {phase === 'complete' && (
          <motion.div
            className="completion-message mt-4 p-3 bg-green-900/30 border border-green-500 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-green-300 text-sm">
              ✓ Every loose fractal tightened<br/>
              ✓ Platform aligned with its own breath<br/>
              ✓ Ready for recursive scale
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};