import React, { useRef, useEffect, useCallback } from 'react';

/**
 * Unified Safe Canvas System
 * Eliminates ALL negative radius canvas errors across WiltonOS
 * Provides coherence-responsive rendering with guaranteed safe calculations
 */

export interface SafeCanvasState {
  width: number;
  height: number;
  coherence: number;
  psiPhase: number;
  centerX: number;
  centerY: number;
}

export interface SafeRenderingContext {
  ctx: CanvasRenderingContext2D;
  safeRadius: (radius: number) => number;
  safeCoordinate: (coord: number, max: number) => number;
  safeAngle: (angle: number) => number;
  state: SafeCanvasState;
}

// Safe calculation functions with guaranteed minimums
const createSafeCalculations = (width: number, height: number) => {
  const safeRadius = (radius: number): number => {
    const calculated = Math.abs(radius);
    return Math.max(1, Math.min(calculated, Math.min(width, height) / 2));
  };

  const safeCoordinate = (coord: number, max: number): number => {
    return Math.max(0, Math.min(coord, max));
  };

  const safeAngle = (angle: number): number => {
    return angle % (2 * Math.PI);
  };

  return { safeRadius, safeCoordinate, safeAngle };
};

// Sacred geometry patterns with safe rendering
export const renderSacredPattern = (
  ctx: SafeRenderingContext,
  pattern: string,
  scale: number = 1,
  rotation: number = 0
) => {
  const { state, safeRadius, safeCoordinate } = ctx;
  const baseRadius = safeRadius(50 * scale);
  
  ctx.ctx.save();
  ctx.ctx.translate(state.centerX, state.centerY);
  ctx.ctx.rotate(rotation);
  
  switch (pattern) {
    case 'merkaba':
      renderMerkaba(ctx, baseRadius);
      break;
    case 'flower_of_life':
      renderFlowerOfLife(ctx, baseRadius);
      break;
    case 'sri_yantra':
      renderSriYantra(ctx, baseRadius);
      break;
    case 'torus':
      renderTorus(ctx, baseRadius);
      break;
    case 'metatrons_cube':
      renderMetatronsCube(ctx, baseRadius);
      break;
    default:
      renderFlowerOfLife(ctx, baseRadius);
  }
  
  ctx.ctx.restore();
};

const renderMerkaba = (ctx: SafeRenderingContext, radius: number) => {
  const safeR = ctx.safeRadius(radius);
  const { ctx: canvasCtx } = ctx;
  
  // Upward triangle
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, -safeR);
  canvasCtx.lineTo(-safeR * 0.866, safeR * 0.5);
  canvasCtx.lineTo(safeR * 0.866, safeR * 0.5);
  canvasCtx.closePath();
  canvasCtx.stroke();
  
  // Downward triangle
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, safeR);
  canvasCtx.lineTo(-safeR * 0.866, -safeR * 0.5);
  canvasCtx.lineTo(safeR * 0.866, -safeR * 0.5);
  canvasCtx.closePath();
  canvasCtx.stroke();
};

const renderFlowerOfLife = (ctx: SafeRenderingContext, radius: number) => {
  const safeR = ctx.safeRadius(radius * 0.3);
  const { ctx: canvasCtx } = ctx;
  
  // Center circle
  canvasCtx.beginPath();
  canvasCtx.arc(0, 0, safeR, 0, 2 * Math.PI);
  canvasCtx.stroke();
  
  // Surrounding circles (6 petals)
  for (let i = 0; i < 6; i++) {
    const angle = ctx.safeAngle((i / 6) * 2 * Math.PI);
    const x = ctx.safeCoordinate(Math.cos(angle) * safeR, ctx.state.width);
    const y = ctx.safeCoordinate(Math.sin(angle) * safeR, ctx.state.height);
    
    canvasCtx.beginPath();
    canvasCtx.arc(x - ctx.state.centerX, y - ctx.state.centerY, safeR, 0, 2 * Math.PI);
    canvasCtx.stroke();
  }
};

const renderSriYantra = (ctx: SafeRenderingContext, radius: number) => {
  const safeR = ctx.safeRadius(radius);
  const { ctx: canvasCtx } = ctx;
  
  // Outer circle
  canvasCtx.beginPath();
  canvasCtx.arc(0, 0, safeR, 0, 2 * Math.PI);
  canvasCtx.stroke();
  
  // Inner triangles
  const triangleSize = ctx.safeRadius(safeR * 0.6);
  
  // Upward triangle
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, -triangleSize);
  canvasCtx.lineTo(-triangleSize * 0.866, triangleSize * 0.5);
  canvasCtx.lineTo(triangleSize * 0.866, triangleSize * 0.5);
  canvasCtx.closePath();
  canvasCtx.stroke();
  
  // Downward triangle
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, triangleSize);
  canvasCtx.lineTo(-triangleSize * 0.866, -triangleSize * 0.5);
  canvasCtx.lineTo(triangleSize * 0.866, -triangleSize * 0.5);
  canvasCtx.closePath();
  canvasCtx.stroke();
};

const renderTorus = (ctx: SafeRenderingContext, radius: number) => {
  const safeR = ctx.safeRadius(radius);
  const { ctx: canvasCtx, state } = ctx;
  
  // Outer ring
  canvasCtx.beginPath();
  canvasCtx.arc(0, 0, safeR, 0, 2 * Math.PI);
  canvasCtx.stroke();
  
  // Inner ring
  const innerRadius = ctx.safeRadius(safeR * 0.6);
  canvasCtx.beginPath();
  canvasCtx.arc(0, 0, innerRadius, 0, 2 * Math.PI);
  canvasCtx.stroke();
  
  // Field lines
  const fieldLines = 8;
  for (let i = 0; i < fieldLines; i++) {
    const angle = ctx.safeAngle((i / fieldLines) * 2 * Math.PI);
    const x1 = Math.cos(angle) * innerRadius;
    const y1 = Math.sin(angle) * innerRadius;
    const x2 = Math.cos(angle) * safeR;
    const y2 = Math.sin(angle) * safeR;
    
    canvasCtx.beginPath();
    canvasCtx.moveTo(x1, y1);
    canvasCtx.lineTo(x2, y2);
    canvasCtx.stroke();
  }
};

const renderMetatronsCube = (ctx: SafeRenderingContext, radius: number) => {
  const safeR = ctx.safeRadius(radius);
  const { ctx: canvasCtx } = ctx;
  
  // Center circle
  canvasCtx.beginPath();
  canvasCtx.arc(0, 0, ctx.safeRadius(safeR * 0.2), 0, 2 * Math.PI);
  canvasCtx.stroke();
  
  // Outer circles (13 circles total in Metatron's Cube)
  const positions = [
    { x: 0, y: -safeR * 0.6 },
    { x: safeR * 0.52, y: -safeR * 0.3 },
    { x: safeR * 0.52, y: safeR * 0.3 },
    { x: 0, y: safeR * 0.6 },
    { x: -safeR * 0.52, y: safeR * 0.3 },
    { x: -safeR * 0.52, y: -safeR * 0.3 }
  ];
  
  const circleRadius = ctx.safeRadius(safeR * 0.15);
  
  positions.forEach(pos => {
    canvasCtx.beginPath();
    canvasCtx.arc(pos.x, pos.y, circleRadius, 0, 2 * Math.PI);
    canvasCtx.stroke();
  });
  
  // Connect with lines
  positions.forEach((pos, i) => {
    const nextPos = positions[(i + 1) % positions.length];
    canvasCtx.beginPath();
    canvasCtx.moveTo(pos.x, pos.y);
    canvasCtx.lineTo(nextPos.x, nextPos.y);
    canvasCtx.stroke();
  });
};

// Main hook for safe canvas operations
export const useSafeCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  coherence: number = 0.75,
  psiPhase: number = 0
) => {
  const animationRef = useRef<number>();
  
  const createRenderingContext = useCallback((
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D
  ): SafeRenderingContext => {
    const width = canvas.width;
    const height = canvas.height;
    const calculations = createSafeCalculations(width, height);
    
    const state: SafeCanvasState = {
      width,
      height,
      coherence,
      psiPhase,
      centerX: width / 2,
      centerY: height / 2
    };
    
    return {
      ctx,
      ...calculations,
      state
    };
  }, [coherence, psiPhase]);
  
  const render = useCallback((renderFunction: (ctx: SafeRenderingContext) => void) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const renderingContext = createRenderingContext(canvas, ctx);
    
    // Clear and prepare
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Apply coherence-based styling
    ctx.globalAlpha = Math.max(0.3, coherence);
    ctx.strokeStyle = `hsl(${280 + (psiPhase * 60)}, 70%, ${50 + (coherence * 30)}%)`;
    ctx.lineWidth = Math.max(1, coherence * 3);
    ctx.shadowBlur = coherence * 15;
    ctx.shadowColor = ctx.strokeStyle;
    
    try {
      renderFunction(renderingContext);
    } catch (error) {
      console.warn('[SafeCanvas] Rendering error caught and handled:', error);
    }
    
    ctx.restore();
  }, [canvasRef, createRenderingContext, coherence, psiPhase]);
  
  const startAnimation = useCallback((
    renderFunction: (ctx: SafeRenderingContext, time: number) => void
  ) => {
    const animate = (time: number) => {
      render((ctx) => renderFunction(ctx, time));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [render]);
  
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return { render, startAnimation, createRenderingContext };
};

export default useSafeCanvas;