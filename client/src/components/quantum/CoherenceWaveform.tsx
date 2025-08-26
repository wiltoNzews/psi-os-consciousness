import React, { useEffect, useRef } from 'react';

interface CoherenceWaveformProps {
  coherenceHistory: Array<{ zLambda: number; timestamp: number }>;
  width?: number;
  height?: number;
}

export function CoherenceWaveform({ coherenceHistory, width = 400, height = 120 }: CoherenceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || coherenceHistory.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal grid
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Coherence waveform
    if (coherenceHistory.length > 1) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      coherenceHistory.forEach((point, index) => {
        const x = (index / (coherenceHistory.length - 1)) * width;
        const y = height - (point.zLambda * height);

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // High coherence markers
      ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
      coherenceHistory.forEach((point, index) => {
        if (point.zLambda > 0.9) {
          const x = (index / (coherenceHistory.length - 1)) * width;
          const y = height - (point.zLambda * height);
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Current value indicator
    if (coherenceHistory.length > 0) {
      const latest = coherenceHistory[coherenceHistory.length - 1];
      const y = height - (latest.zLambda * height);
      
      ctx.strokeStyle = 'rgba(34, 197, 94, 1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width - 20, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Value text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '12px monospace';
      ctx.fillText(latest.zLambda.toFixed(3), width - 60, y - 5);
    }

  }, [coherenceHistory, width, height]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-purple-500/30 rounded bg-slate-900"
      />
      <div className="absolute top-2 left-2 text-xs text-purple-400">
        Coherence History
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-gray-400">
        Zλ
      </div>
    </div>
  );
}