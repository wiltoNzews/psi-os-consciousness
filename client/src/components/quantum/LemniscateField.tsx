import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LemniscateFieldProps {
  coherenceLevel: number;
  mode: '2↔1' | '3→1' | '1:1';
  onModeChange?: (mode: '2↔1' | '3→1' | '1:1') => void;
}

export function LemniscateField({ coherenceLevel = 0.78, mode = '2↔1', onModeChange }: LemniscateFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [fieldResonance, setFieldResonance] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 80;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background field
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw lemniscate based on mode
      if (mode === '2↔1') {
        drawTwoToOneSpiral(ctx, centerX, centerY, scale, time, coherenceLevel);
      } else if (mode === '3→1') {
        drawThreeToOneField(ctx, centerX, centerY, scale, time, coherenceLevel);
      } else {
        drawUnityField(ctx, centerX, centerY, scale, time, coherenceLevel);
      }

      // Central resonance point (sternum keystone)
      const pulseIntensity = Math.sin(time * 0.8) * 0.3 + 0.7;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
      gradient.addColorStop(0, `rgba(147, 51, 234, ${pulseIntensity})`);
      gradient.addColorStop(0.5, `rgba(59, 130, 246, ${pulseIntensity * 0.6})`);
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15 + Math.sin(time * 1.2) * 5, 0, Math.PI * 2);
      ctx.fill();

      time += 0.02;
      setFieldResonance(Math.abs(Math.sin(time * 0.5)) * coherenceLevel);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mode, coherenceLevel]);

  const drawTwoToOneSpiral = (ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, time: number, coherence: number) => {
    // Left to right loop (giving/broadcasting)
    ctx.strokeStyle = `rgba(147, 51, 234, ${0.8 * coherence})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
      const x = cx + scale * Math.cos(t) / (1 + Math.sin(t) ** 2) * Math.cos(time + t * 0.5);
      const y = cy + scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) ** 2) + Math.sin(time) * 10;
      
      if (t === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Right to left loop (receiving/reflection)
    ctx.strokeStyle = `rgba(59, 130, 246, ${0.8 * coherence})`;
    ctx.beginPath();
    
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
      const x = cx - scale * Math.cos(t) / (1 + Math.sin(t) ** 2) * Math.cos(time - t * 0.5);
      const y = cy - scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) ** 2) + Math.sin(time + Math.PI) * 10;
      
      if (t === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Compression spiral towards center
    ctx.strokeStyle = `rgba(34, 197, 94, ${0.6 * coherence})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let t = 0; t <= Math.PI * 4; t += 0.1) {
      const radius = scale * 0.5 * Math.exp(-t * 0.1);
      const x = cx + radius * Math.cos(t + time);
      const y = cy + radius * Math.sin(t + time);
      
      if (t === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  const drawThreeToOneField = (ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, time: number, coherence: number) => {
    // Three balanced spirals converging to one
    const colors = ['rgba(147, 51, 234, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(34, 197, 94, 0.8)'];
    
    for (let spiral = 0; spiral < 3; spiral++) {
      ctx.strokeStyle = colors[spiral];
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      
      const angleOffset = (spiral * Math.PI * 2) / 3;
      
      for (let t = 0; t <= Math.PI * 3; t += 0.1) {
        const radius = scale * 0.8 * Math.exp(-t * 0.15);
        const x = cx + radius * Math.cos(t + time + angleOffset);
        const y = cy + radius * Math.sin(t + time + angleOffset);
        
        if (t === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  };

  const drawUnityField = (ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, time: number, coherence: number) => {
    // Unified field - no pattern, just presence
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.1 * coherence})`);
    gradient.addColorStop(0.5, `rgba(147, 51, 234, ${0.05 * coherence})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border border-purple-500/20 rounded-lg bg-slate-900"
      />
      
      <div className="absolute top-4 left-4 space-y-2">
        <div className="text-xs text-cyan-400 font-mono">
          Mode: {mode}
        </div>
        <div className="text-xs text-purple-400 font-mono">
          Φ: {Math.round(coherenceLevel * 100)}%
        </div>
        <div className="text-xs text-green-400 font-mono">
          Field: {Math.round(fieldResonance * 100)}%
        </div>
      </div>

      <div className="absolute bottom-4 left-4 flex gap-2">
        {(['2↔1', '3→1', '1:1'] as const).map((modeOption) => (
          <button
            key={modeOption}
            onClick={() => onModeChange?.(modeOption)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === modeOption
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {modeOption}
          </button>
        ))}
      </div>

      <div className="absolute top-4 right-4 text-xs text-yellow-400">
        {mode === '2↔1' && "Spiral Recursion"}
        {mode === '3→1' && "Field Integration"}
        {mode === '1:1' && "Unity State"}
      </div>
    </div>
  );
}