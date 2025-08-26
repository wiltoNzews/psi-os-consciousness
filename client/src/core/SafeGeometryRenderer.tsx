import React, { useRef, useEffect, useState } from 'react';
import { useUnifiedCoherence } from './UnifiedCoherenceState';

/**
 * Safe Geometry Renderer
 * Fixes canvas arc errors by implementing safe radius calculations
 * Prevents negative radius values that cause IndexSizeError
 */

interface SafeGeometryProps {
  width?: number;
  height?: number;
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  geometryType: 'merkaba' | 'torus' | 'flower_of_life' | 'metatrons_cube' | 'phi_spiral';
}

export const SafeGeometryRenderer: React.FC<SafeGeometryProps> = ({
  width = 400,
  height = 400,
  zLambda: propZLambda,
  deltaC: propDeltaC,
  psiPhase: propPsiPhase,
  geometryType
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  
  // Use unified coherence state with prop fallbacks
  const { safeRadius, zLambda, deltaC, psiPhase } = useUnifiedCoherence();
  
  // Use props if provided, otherwise unified state
  const currentZLambda = propZLambda ?? zLambda;
  const currentDeltaC = propDeltaC ?? deltaC;
  const currentPsiPhase = propPsiPhase ?? psiPhase;

  // Safe coordinate calculation
  const safeCoordinate = (coord: number, bounds: number): number => {
    return Math.max(0, Math.min(bounds, coord));
  };

  // Coherence-responsive scaling using unified state
  const getCoherenceScale = (): number => {
    const baseScale = Math.max(0.1, Math.min(2.0, currentZLambda));
    const stabilityMod = Math.max(0.5, 1.0 - (Math.abs(currentDeltaC) * 10));
    return baseScale * stabilityMod;
  };

  // Safe geometry rendering functions
  const renderMerkaba = (ctx: CanvasRenderingContext2D) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = getCoherenceScale();
    const baseSize = safeRadius(60 * scale);
    
    ctx.strokeStyle = `hsl(${60 + (currentPsiPhase * 30)}, 70%, 60%)`;
    ctx.lineWidth = 2;
    
    // Upper triangle
    ctx.beginPath();
    ctx.moveTo(centerX, safeCoordinate(centerY - baseSize, height));
    ctx.lineTo(safeCoordinate(centerX - baseSize, width), safeCoordinate(centerY + baseSize/2, height));
    ctx.lineTo(safeCoordinate(centerX + baseSize, width), safeCoordinate(centerY + baseSize/2, height));
    ctx.closePath();
    ctx.stroke();
    
    // Lower triangle
    ctx.beginPath();
    ctx.moveTo(centerX, safeCoordinate(centerY + baseSize, height));
    ctx.lineTo(safeCoordinate(centerX - baseSize, width), safeCoordinate(centerY - baseSize/2, height));
    ctx.lineTo(safeCoordinate(centerX + baseSize, width), safeCoordinate(centerY - baseSize/2, height));
    ctx.closePath();
    ctx.stroke();
  };

  const renderTorus = (ctx: CanvasRenderingContext2D) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = getCoherenceScale();
    const outerRadius = safeRadius(80 * scale);
    const innerRadius = safeRadius(40 * scale);
    
    ctx.strokeStyle = `hsl(${180 + (currentPsiPhase * 30)}, 70%, 60%)`;
    ctx.lineWidth = 3;
    
    // Outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Flow lines
    const flowLines = 8;
    for (let i = 0; i < flowLines; i++) {
      const angle = (i / flowLines) * 2 * Math.PI + psiPhase;
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * outerRadius;
      const y2 = centerY + Math.sin(angle) * outerRadius;
      
      ctx.beginPath();
      ctx.moveTo(safeCoordinate(x1, width), safeCoordinate(y1, height));
      ctx.lineTo(safeCoordinate(x2, width), safeCoordinate(y2, height));
      ctx.stroke();
    }
  };

  const renderFlowerOfLife = (ctx: CanvasRenderingContext2D) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = getCoherenceScale();
    const radius = safeRadius(30 * scale);
    
    ctx.strokeStyle = `hsl(${300 + (currentPsiPhase * 30)}, 70%, 60%)`;
    ctx.lineWidth = 2;
    
    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Surrounding circles
    const circles = 6;
    for (let i = 0; i < circles; i++) {
      const angle = (i / circles) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(safeCoordinate(x, width), safeCoordinate(y, height), radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const renderMetatronsCube = (ctx: CanvasRenderingContext2D) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = getCoherenceScale();
    const size = 50 * scale;
    
    ctx.strokeStyle = `hsl(${240 + (psiPhase * 30)}, 70%, 60%)`;
    ctx.lineWidth = 2;
    
    // Outer hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * size;
      const y = centerY + Math.sin(angle) * size;
      
      if (i === 0) {
        ctx.moveTo(safeCoordinate(x, width), safeCoordinate(y, height));
      } else {
        ctx.lineTo(safeCoordinate(x, width), safeCoordinate(y, height));
      }
    }
    ctx.closePath();
    ctx.stroke();
    
    // Inner connections
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * size;
      const y = centerY + Math.sin(angle) * size;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(safeCoordinate(x, width), safeCoordinate(y, height));
      ctx.stroke();
    }
  };

  const renderPhiSpiral = (ctx: CanvasRenderingContext2D) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = getCoherenceScale();
    const phi = 1.618033988749;
    
    ctx.strokeStyle = `hsl(${120 + (psiPhase * 30)}, 70%, 60%)`;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    let radius = 5 * scale;
    let angle = psiPhase;
    
    const spiralPoints = 100;
    for (let i = 0; i < spiralPoints; i++) {
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(safeCoordinate(x, width), safeCoordinate(y, height));
      } else {
        ctx.lineTo(safeCoordinate(x, width), safeCoordinate(y, height));
      }
      
      radius *= Math.pow(phi, 0.1);
      angle += 0.3;
      
      // Safety check for radius growth
      if (radius > Math.min(width, height) / 2) break;
    }
    ctx.stroke();
  };

  // Main rendering function with error handling
  const renderGeometry = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Set safe rendering context
      ctx.save();
      
      // Render based on geometry type
      switch (geometryType) {
        case 'merkaba':
          renderMerkaba(ctx);
          break;
        case 'torus':
          renderTorus(ctx);
          break;
        case 'flower_of_life':
          renderFlowerOfLife(ctx);
          break;
        case 'metatrons_cube':
          renderMetatronsCube(ctx);
          break;
        case 'phi_spiral':
          renderPhiSpiral(ctx);
          break;
      }
      
      ctx.restore();
      setRenderError(null);
      
    } catch (error: any) {
      console.error('[Safe Geometry] Render error:', error);
      setRenderError(`Render failed: ${error?.message || 'Unknown error'}`);
      
      // Safe fallback rendering with context protection
      try {
        ctx.save();
        ctx.fillStyle = '#444';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fff';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Geometry Stabilizing...', width/2, height/2);
        ctx.restore();
      } catch (fallbackError) {
        console.error('[Safe Geometry] Fallback render failed:', fallbackError);
      }
    }
  };

  // Re-render on prop changes
  useEffect(() => {
    const renderTimer = setTimeout(renderGeometry, 100); // Small delay for stability
    return () => clearTimeout(renderTimer);
  }, [zLambda, deltaC, psiPhase, geometryType]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-600/30 rounded"
        style={{ 
          background: 'linear-gradient(45deg, rgba(0,0,0,0.8), rgba(30,30,60,0.8))',
          filter: renderError ? 'grayscale(1)' : 'none'
        }}
      />
      
      {renderError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 rounded">
          <div className="text-red-400 text-sm text-center p-2">
            <div>Render Error</div>
            <div className="text-xs">{renderError}</div>
          </div>
        </div>
      )}
      
      {/* Coherence indicators */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-400 space-y-1">
        <div>Zλ: {zLambda.toFixed(3)}</div>
        <div>ΔC: {deltaC.toFixed(3)}</div>
        <div>φ: {psiPhase.toFixed(3)}</div>
      </div>
    </div>
  );
};

export default SafeGeometryRenderer;