import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SternumKeystoneProps {
  coherenceLevel: number;
  carrierWave: 'coherent love' | 'compassion' | 'recognition';
  isSourceRecognition: boolean;
}

export function SternumKeystone({ coherenceLevel, carrierWave, isSourceRecognition }: SternumKeystoneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [ketstoneResonance, setKeystoneResonance] = useState(0);
  const [breathCycle, setBreathCycle] = useState('inhale');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background field
      ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Breath cycle detection
      const breathPhase = Math.sin(time * 0.3);
      const currentCycle = breathPhase > 0 ? 'inhale' : 'exhale';
      if (currentCycle !== breathCycle) {
        setBreathCycle(currentCycle);
      }

      // Sternum keystone - the intersection point
      const keystonePulse = Math.sin(time * 0.8) * 0.4 + 0.6;
      const sourceIntensity = isSourceRecognition ? 1.0 : 0.6;
      
      // Central keystone geometry
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw the sternum protrusion as sacred geometry
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${keystonePulse * sourceIntensity})`);
      gradient.addColorStop(0.3, `rgba(147, 51, 234, ${keystonePulse * 0.8})`);
      gradient.addColorStop(0.6, `rgba(59, 130, 246, ${keystonePulse * 0.6})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 25 + Math.sin(time * 1.2) * 8, 0, Math.PI * 2);
      ctx.fill();

      // Toroidal field intersection
      drawToroidalIntersection(ctx, time, coherenceLevel, sourceIntensity);

      // Lemniscate braiding center
      drawLemniscateBraiding(ctx, time, coherenceLevel, carrierWave === 'coherent love');

      // Carrier wave visualization
      drawCarrierWave(ctx, time, carrierWave, sourceIntensity);

      ctx.restore();

      // God-frequency latency visualization
      if (isSourceRecognition) {
        drawGodFrequencyLatency(ctx, centerX, centerY, time, coherenceLevel);
      }

      time += 0.02;
      setKetstoneResonance(keystonePulse * coherenceLevel);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [coherenceLevel, carrierWave, isSourceRecognition, breathCycle]);

  const drawToroidalIntersection = (ctx: CanvasRenderingContext2D, time: number, coherence: number, intensity: number) => {
    // Toroidal field lines emanating from sternum
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const radius = 60 + Math.sin(time + i) * 20;
      
      ctx.strokeStyle = `rgba(34, 197, 94, ${0.4 * coherence * intensity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, angle - 0.3, angle + 0.3);
      ctx.stroke();
    }
  };

  const drawLemniscateBraiding = (ctx: CanvasRenderingContext2D, time: number, coherence: number, isLove: boolean) => {
    // Braiding pattern at the keystone
    const braidColor = isLove ? 'rgba(255, 182, 193, 0.8)' : 'rgba(147, 51, 234, 0.6)';
    
    ctx.strokeStyle = braidColor;
    ctx.lineWidth = 1.5;
    
    for (let strand = 0; strand < 3; strand++) {
      ctx.beginPath();
      for (let t = 0; t <= Math.PI * 4; t += 0.1) {
        const strandOffset = (strand * Math.PI * 2) / 3;
        const radius = 15 + Math.sin(t + time + strandOffset) * 5;
        const x = radius * Math.cos(t + time);
        const y = radius * Math.sin(t + time) * 0.5;
        
        if (t === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  };

  const drawCarrierWave = (ctx: CanvasRenderingContext2D, time: number, wave: string, intensity: number) => {
    const waveColors = {
      'coherent love': 'rgba(255, 105, 180, 0.8)',
      'compassion': 'rgba(255, 215, 0, 0.8)',
      'recognition': 'rgba(138, 43, 226, 0.8)'
    };

    ctx.strokeStyle = waveColors[wave as keyof typeof waveColors];
    ctx.lineWidth = 3;
    ctx.globalAlpha = intensity;
    
    // Carrier wave emanating from center
    for (let radius = 20; radius < 100; radius += 20) {
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
        const waveOffset = Math.sin(angle * 4 + time * 2) * 5;
        const x = (radius + waveOffset) * Math.cos(angle);
        const y = (radius + waveOffset) * Math.sin(angle);
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  };

  const drawGodFrequencyLatency = (ctx: CanvasRenderingContext2D, cx: number, cy: number, time: number, coherence: number) => {
    // The butterflies and breath-ripples feeling
    const latencyPulse = Math.sin(time * 0.6) * 0.3 + 0.7;
    
    // Butterfly sensation (external receiving)
    ctx.fillStyle = `rgba(255, 215, 0, ${latencyPulse * 0.3})`;
    ctx.beginPath();
    ctx.arc(cx - 80, cy - 40, 8 + Math.sin(time * 2) * 3, 0, Math.PI * 2);
    ctx.arc(cx + 80, cy - 40, 8 + Math.sin(time * 2 + Math.PI) * 3, 0, Math.PI * 2);
    ctx.fill();

    // Breath-ripples (internal emanation)
    for (let i = 1; i <= 3; i++) {
      ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - i * 0.3) * latencyPulse * 0.4})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, i * 30 + Math.sin(time + i) * 10, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={300}
        height={250}
        className="border border-purple-500/30 rounded-lg bg-slate-900"
      />
      
      <div className="absolute top-2 left-2 space-y-1">
        <div className="text-xs text-cyan-400 font-mono">
          Sternum: {Math.round(ketstoneResonance * 100)}%
        </div>
        <div className="text-xs text-pink-400 font-mono">
          Wave: {carrierWave}
        </div>
        <div className="text-xs text-yellow-400 font-mono">
          Breath: {breathCycle}
        </div>
        {isSourceRecognition && (
          <div className="text-xs text-white font-mono animate-pulse">
            Source Recognition
          </div>
        )}
      </div>

      <div className="absolute bottom-2 left-2 text-xs text-gray-400">
        Keystone Active
      </div>
    </div>
  );
}