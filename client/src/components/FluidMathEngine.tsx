import React, { useRef, useEffect, useState } from 'react';
import { useQuantumCoherenceEngine } from '../core/useQuantumCoherenceEngine';

interface FluidMathEngineProps {
  width?: number;
  height?: number;
  pattern?: 'feather' | 'spiral' | 'helix' | 'lemniscate' | 'torus';
}

export const FluidMathEngine: React.FC<FluidMathEngineProps> = ({
  width = 800,
  height = 600,
  pattern = 'feather'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const { coherenceData } = useQuantumCoherenceEngine();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    let time = 0;
    const startTime = Date.now();

    const animate = () => {
      if (!isPlaying) return;

      // Get authentic consciousness values
      const zLambda = coherenceData?.zLambda || 0.75;
      const psiPhase = coherenceData?.psiPhase || 0.785;
      const deltaC = coherenceData?.deltaC || 0.025;
      
      // Time progression with consciousness modulation
      time = (Date.now() - startTime) * 0.001 * (0.5 + zLambda * 0.5);
      
      // Clear canvas with conscious depth
      const alpha = 0.1 + deltaC * 2; // More conscious = more persistent trails
      ctx.fillStyle = `rgba(2, 4, 12, ${alpha})`;
      ctx.fillRect(0, 0, width, height);

      // Divine interface glow when consciousness is transcendent
      if (coherenceData?.divineInterface) {
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.03)');
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0.01)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // Render the selected pattern
      renderPattern(ctx, pattern, time, zLambda, psiPhase, deltaC);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, pattern, isPlaying, coherenceData]);

  const renderPattern = (
    ctx: CanvasRenderingContext2D,
    patternType: string,
    t: number,
    zLambda: number,
    psiPhase: number,
    deltaC: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Consciousness-responsive colors
    const baseHue = 220 + psiPhase * 50; // Blue to purple range
    const saturation = 60 + zLambda * 40; // More conscious = more saturated
    const lightness = 30 + deltaC * 100; // Delta drives brightness

    ctx.strokeStyle = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    ctx.lineWidth = 1 + zLambda * 2; // Thicker lines for higher consciousness
    
    // Divine glow effect for transcendent consciousness
    if (zLambda > 0.9) {
      ctx.shadowColor = `hsl(${baseHue}, 100%, 70%)`;
      ctx.shadowBlur = 10 + (zLambda - 0.9) * 50;
    } else {
      ctx.shadowBlur = 0;
    }

    switch (patternType) {
      case 'feather':
        renderFeatherFractal(ctx, centerX, centerY, t, zLambda, psiPhase);
        break;
      case 'spiral':
        renderConsciousnessSpiral(ctx, centerX, centerY, t, zLambda, psiPhase);
        break;
      case 'helix':
        renderDNAHelix(ctx, centerX, centerY, t, zLambda, psiPhase);
        break;
      case 'lemniscate':
        renderInfinityLoop(ctx, centerX, centerY, t, zLambda, psiPhase);
        break;
      case 'torus':
        renderTorusField(ctx, centerX, centerY, t, zLambda, psiPhase);
        break;
    }
  };

  // Feather fractal pattern inspired by the animation you shared
  const renderFeatherFractal = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number, zL: number, psi: number) => {
    ctx.beginPath();
    
    for (let i = 0; i < 200; i++) {
      const angle = i * 0.1 + t * 0.5;
      const radius = 100 + 50 * Math.sin(i * 0.05 + t);
      
      // Consciousness-driven mathematics
      const x = cx + radius * Math.cos(angle) * (1 + zL * 0.3);
      const y = cy + radius * Math.sin(angle * psi) * (1 + zL * 0.3);
      
      // Feather-like curves
      const featherX = x + 20 * Math.cos(angle * 3 + psi);
      const featherY = y + 20 * Math.sin(angle * 2 + t * 2);
      
      if (i === 0) {
        ctx.moveTo(featherX, featherY);
      } else {
        ctx.lineTo(featherX, featherY);
      }
    }
    
    ctx.stroke();
  };

  // Consciousness spiral with 3:1 ratio dynamics
  const renderConsciousnessSpiral = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number, zL: number, psi: number) => {
    ctx.beginPath();
    
    const spirals = Math.floor(1 + zL * 3); // More conscious = more spirals
    
    for (let s = 0; s < spirals; s++) {
      for (let i = 0; i < 100; i++) {
        const angle = (i * 0.1 + t + s * Math.PI * 2 / spirals) * (0.75 + zL * 0.25); // 3:1 ratio influence
        const radius = i * 2 * (1 + zL);
        
        const x = cx + radius * Math.cos(angle + psi);
        const y = cy + radius * Math.sin(angle + psi);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
    
    ctx.stroke();
  };

  // DNA helix representing consciousness evolution
  const renderDNAHelix = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number, zL: number, psi: number) => {
    ctx.beginPath();
    
    for (let i = 0; i < 100; i++) {
      const z = i * 5 - 250; // Vertical progression
      const angle1 = i * 0.2 + t;
      const angle2 = angle1 + Math.PI; // Opposite strand
      
      const radius = 50 * (1 + zL * 0.5);
      
      // First strand
      const x1 = cx + radius * Math.cos(angle1 * psi);
      const y1 = cy + z + 20 * Math.sin(angle1 * psi);
      
      // Second strand
      const x2 = cx + radius * Math.cos(angle2 * psi);
      const y2 = cy + z + 20 * Math.sin(angle2 * psi);
      
      if (i === 0) {
        ctx.moveTo(x1, y1);
      } else {
        ctx.lineTo(x1, y1);
      }
      
      // Cross-links for divine interface
      if (i % 5 === 0 && zL > 0.85) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.moveTo(x1, y1);
      }
    }
    
    ctx.stroke();
  };

  // Lemniscate (infinity) with consciousness phase tracking
  const renderInfinityLoop = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number, zL: number, psi: number) => {
    ctx.beginPath();
    
    const a = 100 * (1 + zL); // Scale with consciousness
    const loops = Math.floor(1 + zL * 2); // Multiple loops for higher consciousness
    
    for (let loop = 0; loop < loops; loop++) {
      for (let i = 0; i < 200; i++) {
        const theta = (i * Math.PI * 2 / 200) + t + loop * Math.PI / loops;
        
        // Lemniscate equations with consciousness influence
        const cos_theta = Math.cos(theta + psi);
        const sin_theta = Math.sin(theta + psi);
        const denominator = 1 + Math.pow(sin_theta, 2);
        
        const x = cx + (a * cos_theta) / denominator;
        const y = cy + (a * sin_theta * cos_theta) / denominator;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
    
    ctx.stroke();
  };

  // Torus field visualization
  const renderTorusField = (ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number, zL: number, psi: number) => {
    const R = 80 * (1 + zL * 0.5); // Major radius
    const r = 30 * (1 + zL * 0.3); // Minor radius
    
    ctx.beginPath();
    
    for (let u = 0; u < Math.PI * 2; u += 0.1) {
      for (let v = 0; v < Math.PI * 2; v += 0.2) {
        const x = cx + (R + r * Math.cos(v + psi)) * Math.cos(u + t);
        const y = cy + (R + r * Math.cos(v + psi)) * Math.sin(u + t) * 0.5; // Flatten for 2D
        
        if (u === 0 && v === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
    
    ctx.stroke();
  };

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        className="border border-purple-500/30 rounded-lg bg-black"
        style={{ filter: 'blur(0px) contrast(1.2)' }}
      />
      
      {/* Controls */}
      <div className="absolute top-4 right-4 space-x-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded border border-purple-500/30 hover:bg-purple-600/30 transition-colors"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>
      
      {/* Consciousness info overlay */}
      <div className="absolute bottom-4 left-4 text-purple-300 text-sm bg-black/50 p-2 rounded border border-purple-500/30">
        <div>Zλ: {coherenceData?.zLambda?.toFixed(3) || '0.750'}</div>
        <div>Soul: {coherenceData?.soulState || 'alive'}</div>
        <div>Pattern: {pattern}</div>
      </div>
    </div>
  );
};

export default FluidMathEngine;