import React, { useRef, useEffect, useState } from 'react';
import { useQuantumCoherenceEngine } from '../core/useQuantumCoherenceEngine';

interface MathFlowEngineProps {
  width?: number;
  height?: number;
  pattern?: 'feather' | 'spiral' | 'helix' | 'lemniscate' | 'torus';
  className?: string;
}

export const MathFlowEngine: React.FC<MathFlowEngineProps> = ({
  width = 400,
  height = 400,
  pattern = 'feather',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [time, setTime] = useState(0);
  
  // Connect to live consciousness data
  const { coherenceData, isLoading } = useQuantumCoherenceEngine();
  
  const patterns = {
    // Feather fractal inspired by @yuruyurau's animation
    feather: (ctx: CanvasRenderingContext2D, t: number, zLambda: number, psiPhase: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + zLambda * 0.7})`;
      ctx.lineWidth = 1 + zLambda * 2;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Core feather equation adapted from the tweet
      for (let i = 0; i < 200; i++) {
        const x = i * 2 - centerX;
        const y = i * 3 - centerY;
        
        // Consciousness-responsive parameters
        const k = 5 * Math.cos(x / (14 + zLambda * 10)) * Math.cos(y / (30 + psiPhase * 5));
        const e = y / (8 + zLambda * 3) - 13;
        const d = Math.sqrt(k * k + e * e) ** 2 / (59 + zLambda * 20) + 4;
        
        // Feather curve with consciousness modulation
        const angle = Math.atan2(k, e);
        const radius = d * (1 + 0.3 * Math.sin(t * 0.02 + psiPhase));
        
        const px = centerX + radius * Math.cos(angle + t * 0.01);
        const py = centerY + radius * Math.sin(angle + t * 0.01) * (1 + zLambda * 0.5);
        
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      
      // Add consciousness glow effect
      if (zLambda > 0.912) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 20 * (zLambda - 0.912);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    },
    
    // Consciousness spiral
    spiral: (ctx: CanvasRenderingContext2D, t: number, zLambda: number, psiPhase: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `rgba(100, 200, 255, ${0.4 + zLambda * 0.6})`;
      ctx.lineWidth = 1 + zLambda * 3;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 8; angle += 0.1) {
        const radius = angle * (2 + zLambda * 3) + 10 * Math.sin(t * 0.03 + psiPhase);
        const x = centerX + radius * Math.cos(angle + t * 0.02);
        const y = centerY + radius * Math.sin(angle + t * 0.02);
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    },
    
    // Double helix (DNA-like)
    helix: (ctx: CanvasRenderingContext2D, t: number, zLambda: number, psiPhase: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2 + zLambda * 2;
      
      const centerX = width / 2;
      const steps = 100;
      
      // First strand
      ctx.strokeStyle = `rgba(255, 100, 100, ${0.5 + zLambda * 0.5})`;
      ctx.beginPath();
      for (let i = 0; i < steps; i++) {
        const progress = i / steps;
        const y = progress * height;
        const phase = progress * Math.PI * 4 + t * 0.05 + psiPhase;
        const x = centerX + (30 + zLambda * 20) * Math.cos(phase);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Second strand
      ctx.strokeStyle = `rgba(100, 100, 255, ${0.5 + zLambda * 0.5})`;
      ctx.beginPath();
      for (let i = 0; i < steps; i++) {
        const progress = i / steps;
        const y = progress * height;
        const phase = progress * Math.PI * 4 + t * 0.05 + psiPhase + Math.PI;
        const x = centerX + (30 + zLambda * 20) * Math.cos(phase);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    },
    
    // Lemniscate (infinity symbol)
    lemniscate: (ctx: CanvasRenderingContext2D, t: number, zLambda: number, psiPhase: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `rgba(255, 255, 100, ${0.4 + zLambda * 0.6})`;
      ctx.lineWidth = 2 + zLambda * 3;
      
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = 50 + zLambda * 100;
      
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.01) {
        const cos2t = Math.cos(2 * (angle + t * 0.02 + psiPhase * 0.1));
        if (cos2t >= 0) {
          const r = scale * Math.sqrt(cos2t);
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          
          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Add divine interface glow
      if (zLambda > 0.912) {
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 15 * (zLambda - 0.912);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    },
    
    // Torus projection
    torus: (ctx: CanvasRenderingContext2D, t: number, zLambda: number, psiPhase: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = `rgba(150, 255, 150, ${0.3 + zLambda * 0.7})`;
      ctx.lineWidth = 1 + zLambda * 2;
      
      const centerX = width / 2;
      const centerY = height / 2;
      const R = 80 + zLambda * 40; // Major radius
      const r = 30 + zLambda * 20; // Minor radius
      
      // Draw torus using parametric equations
      for (let u = 0; u < Math.PI * 2; u += 0.2) {
        ctx.beginPath();
        for (let v = 0; v < Math.PI * 2; v += 0.1) {
          const x = centerX + (R + r * Math.cos(v + psiPhase * 0.1)) * Math.cos(u + t * 0.01);
          const y = centerY + (R + r * Math.cos(v + psiPhase * 0.1)) * Math.sin(u + t * 0.01) * 0.5;
          
          if (v === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      const newTime = Date.now() * 0.001;
      setTime(newTime);
      
      // Use live consciousness data or defaults
      const zLambda = coherenceData?.consciousness?.zLambda || 0.750;
      const psiPhase = coherenceData?.consciousness?.psiPhase || Math.PI / 4;
      
      // Render the selected pattern with consciousness modulation
      patterns[pattern](ctx, newTime, zLambda, psiPhase);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pattern, coherenceData]);
  
  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-700 rounded-lg bg-black"
      />
      
      {/* Consciousness data overlay */}
      {coherenceData && (
        <div className="absolute top-2 left-2 text-xs text-white/70 font-mono">
          <div>Zλ: {coherenceData.consciousness.zLambda.toFixed(3)}</div>
          <div>ψ: {coherenceData.consciousness.psiPhase.toFixed(3)}</div>
          <div>State: {coherenceData.consciousness.soulState}</div>
          {coherenceData.consciousness.divineInterface && (
            <div className="text-yellow-300">✨ DIVINE INTERFACE</div>
          )}
        </div>
      )}
      
      {/* Pattern selector */}
      <div className="absolute bottom-2 right-2">
        <select
          value={pattern}
          onChange={(e) => window.location.hash = `#pattern=${e.target.value}`}
          className="bg-black/50 text-white text-xs border border-gray-600 rounded px-2 py-1"
        >
          <option value="feather">🪶 Feather</option>
          <option value="spiral">🌀 Spiral</option>
          <option value="helix">🧬 Helix</option>
          <option value="lemniscate">∞ Lemniscate</option>
          <option value="torus">🔮 Torus</option>
        </select>
      </div>
    </div>
  );
};