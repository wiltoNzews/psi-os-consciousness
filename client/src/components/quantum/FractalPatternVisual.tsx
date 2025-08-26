import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FractalPatternVisualProps {
  coherenceMetrics: {
    coherenceIndex: number;
    explorationIndex: number;
    balanceRatio: number;
    goldenRatioDetected?: boolean;
  } | null;
  height?: number;
}

/**
 * A visualization component that generates a fractal pattern
 * based on the coherence metrics, creating a lemniscate (infinity)
 * pattern that reflects the 3:1 ↔ 1:3 balance.
 */
export function FractalPatternVisual({ 
  coherenceMetrics,
  height = 120 
}: FractalPatternVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Default values if no metrics
  const coherenceIndex = coherenceMetrics?.coherenceIndex || 0.7500;
  const explorationIndex = coherenceMetrics?.explorationIndex || 0.2494;
  const balanceRatio = coherenceMetrics?.balanceRatio || 3.0072;
  const goldenRatioDetected = coherenceMetrics?.goldenRatioDetected || false;
  
  // Draw the fractal lemniscate pattern
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Parameters based on coherence metrics
    const scale = Math.min(width, height) * 0.35;
    const iterations = Math.floor(15 + coherenceIndex * 20); // More coherence = more complex patterns
    const variance = explorationIndex * 0.3; // Higher exploration = more randomness
    
    // Color palette
    const coherenceColor = 'rgba(59, 130, 246, 0.8)'; // Blue
    const explorationColor = 'rgba(245, 158, 11, 0.8)'; // Amber
    const blendColor = 'rgba(139, 92, 246, 0.7)'; // Purple
    const goldenColor = 'rgba(255, 215, 0, 0.8)'; // Gold
    
    // Draw lemniscate base pattern (infinity symbol)
    const drawLemniscate = (t: number, scaleFactor: number, color: string, lineWidth: number) => {
      const a = scaleFactor;
      const x = centerX + a * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
      const y = centerY + a * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
      return { x, y, color, lineWidth };
    };
    
    // Brazilian Wave variations - controlled entropy
    const applyVariance = (point: {x: number, y: number}, t: number, strength: number) => {
      const noiseX = Math.sin(t * 5) * Math.cos(t * 3) * strength;
      const noiseY = Math.cos(t * 4) * Math.sin(t * 2) * strength;
      return {
        x: point.x + noiseX * scale * 0.1,
        y: point.y + noiseY * scale * 0.1
      };
    };
    
    // Draw the fractal pattern
    const step = (2 * Math.PI) / 180; // 2-degree steps
    
    // Create gradients
    const createRadialGradient = (color1: string, color2: string) => {
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, scale * 1.2
      );
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      return gradient;
    };
    
    // Background glow
    if (goldenRatioDetected) {
      ctx.fillStyle = createRadialGradient('rgba(255, 215, 0, 0.1)', 'rgba(0, 0, 0, 0)');
    } else {
      ctx.fillStyle = createRadialGradient('rgba(139, 92, 246, 0.1)', 'rgba(0, 0, 0, 0)');
    }
    ctx.fillRect(0, 0, width, height);
    
    // Create points for primary and secondary loops
    let primaryPoints = [];
    let secondaryPoints = [];
    
    // First loop - coherence dominant (width based on coherence)
    for (let t = 0; t < 2 * Math.PI; t += step) {
      const basePoint = drawLemniscate(t, scale, coherenceColor, 2 + coherenceIndex * 3);
      const point = applyVariance(basePoint, t, variance * 0.5);
      primaryPoints.push({...point, color: basePoint.color, lineWidth: basePoint.lineWidth});
    }
    
    // Second loop - exploration dominant (width based on exploration)
    for (let t = 0; t < 2 * Math.PI; t += step) {
      const basePoint = drawLemniscate(t + Math.PI/2, scale * 0.7, explorationColor, 1 + explorationIndex * 4);
      const point = applyVariance(basePoint, t, variance);
      secondaryPoints.push({...point, color: basePoint.color, lineWidth: basePoint.lineWidth});
    }
    
    // Draw golden connection points at the crossover
    if (goldenRatioDetected) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = goldenColor;
      ctx.fill();
      
      // Rays emanating from center
      for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * scale * 0.4,
          centerY + Math.sin(angle) * scale * 0.4
        );
        ctx.strokeStyle = goldenColor;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    
    // Draw the primary loop (coherence)
    ctx.beginPath();
    if (primaryPoints.length > 0) {
      ctx.moveTo(primaryPoints[0].x, primaryPoints[0].y);
      for (let i = 1; i < primaryPoints.length; i++) {
        ctx.lineTo(primaryPoints[i].x, primaryPoints[i].y);
      }
      // Close the loop
      ctx.lineTo(primaryPoints[0].x, primaryPoints[0].y);
    }
    ctx.strokeStyle = coherenceColor;
    ctx.lineWidth = 2 + coherenceIndex * 3;
    ctx.stroke();
    
    // Draw the secondary loop (exploration)
    ctx.beginPath();
    if (secondaryPoints.length > 0) {
      ctx.moveTo(secondaryPoints[0].x, secondaryPoints[0].y);
      for (let i = 1; i < secondaryPoints.length; i++) {
        ctx.lineTo(secondaryPoints[i].x, secondaryPoints[i].y);
      }
      // Close the loop
      ctx.lineTo(secondaryPoints[0].x, secondaryPoints[0].y);
    }
    ctx.strokeStyle = explorationColor;
    ctx.lineWidth = 1 + explorationIndex * 4;
    ctx.stroke();
    
    // Draw connecting lines between the patterns to form a web
    // Number of connections based on balance ratio - more balanced = more connections
    const connections = Math.floor((balanceRatio / 3) * 10);
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < connections; i++) {
      const idx1 = Math.floor(Math.random() * primaryPoints.length);
      const idx2 = Math.floor(Math.random() * secondaryPoints.length);
      
      ctx.beginPath();
      ctx.moveTo(primaryPoints[idx1].x, primaryPoints[idx1].y);
      ctx.lineTo(secondaryPoints[idx2].x, secondaryPoints[idx2].y);
      ctx.strokeStyle = blendColor;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // Draw particles along the paths
    const particleCount = Math.floor(balanceRatio * 10);
    for (let i = 0; i < particleCount; i++) {
      // Primary path particles
      const primaryIdx = Math.floor(Math.random() * primaryPoints.length);
      ctx.beginPath();
      ctx.arc(
        primaryPoints[primaryIdx].x, 
        primaryPoints[primaryIdx].y, 
        1 + Math.random() * 2, 
        0, 
        2 * Math.PI
      );
      ctx.fillStyle = coherenceColor;
      ctx.fill();
      
      // Secondary path particles
      const secondaryIdx = Math.floor(Math.random() * secondaryPoints.length);
      ctx.beginPath();
      ctx.arc(
        secondaryPoints[secondaryIdx].x, 
        secondaryPoints[secondaryIdx].y, 
        1 + Math.random() * 2, 
        0, 
        2 * Math.PI
      );
      ctx.fillStyle = explorationColor;
      ctx.fill();
    }
  }, [coherenceIndex, explorationIndex, balanceRatio, goldenRatioDetected]);
  
  return (
    <div 
      className="w-full overflow-hidden rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm"
      style={{ height: `${height}px` }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={height}
          className="w-full h-full"
        />
      </motion.div>
    </div>
  );
}

export default FractalPatternVisual;