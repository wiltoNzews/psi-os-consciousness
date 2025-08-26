/**
 * QuantumSpaghettiVisualizer Component
 * 
 * This component visualizes quantum spaghetti messages based on the Quantum Spaghetti Protocol,
 * showing dimensional markers and the relationships between different dimensions.
 * 
 * [QUANTUM_STATE: VISUALIZATION_FLOW]
 */

import React, { useEffect, useRef, useState } from 'react';
import { 
  QuantumMessage, 
  analyzeQuantumMessage,
  DimensionalMarker
} from '../../../shared/emoji-quantum-mapper';

// Dimension colors
const dimensionColors = {
  [DimensionalMarker.REALITY]: '#4CAF50', // Green
  [DimensionalMarker.META]: '#2196F3',    // Blue
  [DimensionalMarker.QUANTUM]: '#9C27B0', // Purple
  [DimensionalMarker.DIAGONAL]: '#FF9800' // Orange
};

// Visualization types
type VisualizationType = 'network' | 'spaghetti' | 'portal';

interface QuantumSpaghettiVisualizerProps {
  message: QuantumMessage;
  width?: number;
  height?: number;
  visualizationType?: VisualizationType;
  showMetrics?: boolean;
}

const QuantumSpaghettiVisualizer: React.FC<QuantumSpaghettiVisualizerProps> = ({
  message,
  width = 600,
  height = 400,
  visualizationType = 'network',
  showMetrics = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analysis, setAnalysis] = useState(() => analyzeQuantumMessage(message));
  
  // Update analysis when message changes
  useEffect(() => {
    setAnalysis(analyzeQuantumMessage(message));
  }, [message]);

  // Draw visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw based on visualization type
    if (visualizationType === 'network') {
      drawNetworkVisualization(ctx, message, analysis);
    } else if (visualizationType === 'spaghetti') {
      drawSpaghettiVisualization(ctx, message, analysis);
    } else if (visualizationType === 'portal') {
      drawPortalVisualization(ctx, message, analysis);
    }
  }, [message, analysis, visualizationType, width, height]);

  /**
   * Draw network-style visualization
   */
  const drawNetworkVisualization = (
    ctx: CanvasRenderingContext2D, 
    message: QuantumMessage, 
    analysis: ReturnType<typeof analyzeQuantumMessage>
  ) => {
    // Setup
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusOuter = Math.min(width, height) * 0.4;
    const radiusInner = radiusOuter * 0.3;
    
    // Draw central core - represents the θ=0.5 singularity point
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusInner, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${analysis.qctf})`;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw QCTF text in center
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`QCTF: ${analysis.qctf.toFixed(2)}`, centerX, centerY);
    
    // Function to get coordinates on the circle
    const getCircleCoord = (angle: number, radius: number) => ({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
    
    // Draw dimension nodes
    const dimensions = [
      { key: DimensionalMarker.REALITY, segments: message.reality, angle: 0 },
      { key: DimensionalMarker.META, segments: message.meta, angle: Math.PI / 2 },
      { key: DimensionalMarker.QUANTUM, segments: message.quantum, angle: Math.PI },
      { key: DimensionalMarker.DIAGONAL, segments: message.diagonal, angle: Math.PI * 1.5 }
    ];
    
    // Draw connections between dimensions
    dimensions.forEach((dim, i) => {
      const nextDim = dimensions[(i + 1) % dimensions.length];
      const startCoord = getCircleCoord(dim.angle, radiusOuter);
      const endCoord = getCircleCoord(nextDim.angle, radiusOuter);
      
      // Draw connection line
      ctx.beginPath();
      ctx.moveTo(startCoord.x, startCoord.y);
      
      // Create a curve through the center point
      const controlPoint = getCircleCoord((dim.angle + nextDim.angle) / 2, radiusInner * 1.5);
      
      ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endCoord.x, endCoord.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    // Draw dimension nodes
    dimensions.forEach(dim => {
      const coord = getCircleCoord(dim.angle, radiusOuter);
      
      // Draw node
      ctx.beginPath();
      ctx.arc(coord.x, coord.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = `${dimensionColors[dim.key]}`;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw dimension label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dim.key, coord.x, coord.y);
      
      // Draw segment count
      ctx.font = '10px Arial';
      ctx.fillText(`(${dim.segments.length})`, coord.x, coord.y + 15);
      
      // Draw segment nodes - if there are segments
      if (dim.segments.length > 0) {
        // Calculate the angle offset to distribute segment nodes
        const angleSpread = Math.PI / 6; // 30 degrees
        const segmentAngleStep = (angleSpread * 2) / Math.max(dim.segments.length, 1);
        
        dim.segments.forEach((segment: string, j: number) => {
          // Calculate angle for this segment
          const segmentAngle = dim.angle - angleSpread + (j * segmentAngleStep);
          
          // Calculate smaller radius to place segment nodes closer to the dimension node
          const segmentRadius = radiusOuter - 40;
          const segCoord = getCircleCoord(segmentAngle, segmentRadius);
          
          // Draw segment node
          ctx.beginPath();
          ctx.arc(segCoord.x, segCoord.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = `${dimensionColors[dim.key]}80`; // with alpha
          ctx.fill();
          
          // Draw line connecting to dimension node
          ctx.beginPath();
          ctx.moveTo(coord.x, coord.y);
          ctx.lineTo(segCoord.x, segCoord.y);
          ctx.strokeStyle = `${dimensionColors[dim.key]}50`; // with alpha
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Check if segment has emoji (simplified check)
          const hasEmoji = [...segment].some(char => 
            char.codePointAt(0) && char.codePointAt(0)! > 127
          );
          
          // Indicate emoji presence with small star
          if (hasEmoji) {
            ctx.beginPath();
            const starSize = 5;
            ctx.arc(segCoord.x, segCoord.y, starSize, 0, Math.PI * 2);
            ctx.fillStyle = '#FFD700'; // Gold
            ctx.fill();
          }
        });
      }
    });
    
    // Draw chaos/structure ratio indicator
    if (showMetrics) {
      const chaosLength = width * 0.6 * analysis.chaosRatio;
      const structureLength = width * 0.6 * analysis.structureRatio;
      const barHeight = 15;
      const barY = height - 30;
      
      // Draw structure bar (blue)
      ctx.fillStyle = 'rgba(33, 150, 243, 0.8)';
      ctx.fillRect((width - chaosLength - structureLength) / 2, barY, structureLength, barHeight);
      
      // Draw chaos bar (purple)
      ctx.fillStyle = 'rgba(156, 39, 176, 0.8)';
      ctx.fillRect((width - chaosLength - structureLength) / 2 + structureLength, barY, chaosLength, barHeight);
      
      // Draw labels
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      // Structure label
      ctx.fillText(
        `Structure: ${Math.round(analysis.structureRatio * 100)}%`, 
        (width - chaosLength - structureLength) / 2 + structureLength / 2, 
        barY + barHeight + 15
      );
      
      // Chaos label
      ctx.fillText(
        `Chaos: ${Math.round(analysis.chaosRatio * 100)}%`, 
        (width - chaosLength - structureLength) / 2 + structureLength + chaosLength / 2, 
        barY + barHeight + 15
      );
    }
  };

  /**
   * Draw spaghetti-style visualization
   */
  const drawSpaghettiVisualization = (
    ctx: CanvasRenderingContext2D, 
    message: QuantumMessage, 
    analysis: ReturnType<typeof analyzeQuantumMessage>
  ) => {
    // Draw background
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw dimension nodes at four corners
    const dimensionPositions = [
      { dim: DimensionalMarker.REALITY, x: width * 0.2, y: height * 0.2 },
      { dim: DimensionalMarker.META, x: width * 0.8, y: height * 0.2 },
      { dim: DimensionalMarker.QUANTUM, x: width * 0.8, y: height * 0.8 },
      { dim: DimensionalMarker.DIAGONAL, x: width * 0.2, y: height * 0.8 }
    ];
    
    // Draw spaghetti strands between dimensions
    dimensionPositions.forEach((start, i) => {
      const end = dimensionPositions[(i + 1) % dimensionPositions.length];
      
      // Draw strand
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      
      // Create control points for the bezier curve
      const controlPoint1 = {
        x: start.x + (centerX - start.x) * 0.7 + (Math.random() - 0.5) * 50,
        y: start.y + (centerY - start.y) * 0.7 + (Math.random() - 0.5) * 50
      };
      
      const controlPoint2 = {
        x: end.x + (centerX - end.x) * 0.7 + (Math.random() - 0.5) * 50,
        y: end.y + (centerY - end.y) * 0.7 + (Math.random() - 0.5) * 50
      };
      
      // Draw bezier curve
      ctx.bezierCurveTo(
        controlPoint1.x, controlPoint1.y,
        controlPoint2.x, controlPoint2.y,
        end.x, end.y
      );
      
      // Gradient for strand
      const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      gradient.addColorStop(0, dimensionColors[start.dim]);
      gradient.addColorStop(1, dimensionColors[end.dim]);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 5;
      ctx.stroke();
      
      // Draw some sparkle effects for high coherence
      if (analysis.qctf > 0.7) {
        const numSparkles = Math.floor(analysis.qctf * 10);
        
        for (let j = 0; j < numSparkles; j++) {
          const t = Math.random();
          const sparkleX = start.x + (end.x - start.x) * t;
          const sparkleY = start.y + (end.y - start.y) * t;
          
          ctx.beginPath();
          ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }
      }
    });
    
    // Draw dimension nodes
    dimensionPositions.forEach(pos => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = dimensionColors[pos.dim];
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw dimension label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pos.dim, pos.x, pos.y);
    });
    
    // Draw center node with QCTF score
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    
    // Color based on QCTF score
    const r = Math.floor(255 * (1 - analysis.qctf));
    const g = Math.floor(255 * analysis.qctf);
    const b = Math.floor(255 * analysis.dimensionalBalance);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fill();
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw QCTF score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`QCTF: ${analysis.qctf.toFixed(2)}`, centerX, centerY);
    
    // Draw additional metrics if enabled
    if (showMetrics) {
      // Chaos/Structure ratio
      const barWidth = 150;
      const barHeight = 10;
      const barX = centerX - barWidth / 2;
      const barY = height - 40;
      
      // Background
      ctx.fillStyle = '#333333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Structure portion (30% ideally)
      const structureWidth = barWidth * analysis.structureRatio;
      ctx.fillStyle = 'rgba(33, 150, 243, 0.8)';
      ctx.fillRect(barX, barY, structureWidth, barHeight);
      
      // Chaos portion (70% ideally)
      const chaosWidth = barWidth * analysis.chaosRatio;
      ctx.fillStyle = 'rgba(156, 39, 176, 0.8)';
      ctx.fillRect(barX + structureWidth, barY, chaosWidth, barHeight);
      
      // Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Chaos/Structure: ${Math.round(analysis.chaosRatio * 100)}/${Math.round(analysis.structureRatio * 100)}`, centerX, barY + 25);
    }
  };

  /**
   * Draw portal-style visualization
   */
  const drawPortalVisualization = (
    ctx: CanvasRenderingContext2D, 
    message: QuantumMessage, 
    analysis: ReturnType<typeof analyzeQuantumMessage>
  ) => {
    // Draw background
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw portal rings - intensity based on QCTF
    const maxRings = 5;
    const ringSpacing = 20;
    
    for (let i = 0; i < maxRings; i++) {
      const radius = 40 + (i * ringSpacing);
      const opacity = analysis.qctf * (1 - i / maxRings);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    
    // Draw dimension markers at 4 points around the portal
    const dimensionAngles = [
      { dim: DimensionalMarker.REALITY, angle: 0 },
      { dim: DimensionalMarker.META, angle: Math.PI / 2 },
      { dim: DimensionalMarker.QUANTUM, angle: Math.PI },
      { dim: DimensionalMarker.DIAGONAL, angle: 3 * Math.PI / 2 }
    ];
    
    dimensionAngles.forEach(item => {
      // Calculate position
      const radius = 120;
      const x = centerX + Math.cos(item.angle) * radius;
      const y = centerY + Math.sin(item.angle) * radius;
      
      // Draw dimension node
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fillStyle = dimensionColors[item.dim];
      ctx.fill();
      
      // Calculate segment count for this dimension
      const segments = message[item.dim.toLowerCase() as keyof typeof message] as string[];
      const segmentCount = segments.length;
      
      // Draw connection to center portal (width based on segment count)
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(centerX, centerY);
      ctx.strokeStyle = `${dimensionColors[item.dim]}80`;
      ctx.lineWidth = Math.max(1, segmentCount * 2);
      ctx.stroke();
      
      // Draw dimension label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.dim, x, y);
      
      // Draw segment particles along the connection line
      if (segmentCount > 0) {
        for (let i = 0; i < segmentCount; i++) {
          const t = 0.2 + (i / segmentCount) * 0.6; // Position along line (20%-80%)
          const particleX = x + (centerX - x) * t;
          const particleY = y + (centerY - y) * t;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, 5, 0, Math.PI * 2);
          ctx.fillStyle = dimensionColors[item.dim];
          ctx.fill();
        }
      }
    });
    
    // Draw portal center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    
    // Create radial gradient for portal center
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, 40
    );
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(0.5, `rgba(156, 39, 176, ${analysis.qctf})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw QCTF score in center
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`QCTF: ${analysis.qctf.toFixed(2)}`, centerX, centerY);
    
    // Draw metrics if enabled
    if (showMetrics) {
      // Draw balance metrics at bottom
      const metrics = [
        { label: 'Dimensional Balance', value: analysis.dimensionalBalance },
        { label: 'CCQC', value: analysis.ccqc },
        { label: 'Emoji Resonance', value: analysis.emojiResonance }
      ];
      
      metrics.forEach((metric, i) => {
        const metricX = width * (0.25 + i * 0.25);
        const metricY = height - 30;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${metric.label}: ${metric.value.toFixed(2)}`, metricX, metricY);
      });
    }
  };

  return (
    <div className="quantum-spaghetti-visualizer">
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        style={{ 
          border: '1px solid #333',
          borderRadius: '8px',
          background: '#1a1a1a'
        }}
      />
      
      {showMetrics && (
        <div className="metrics" style={{ marginTop: '10px', fontSize: '14px', color: '#ccc' }}>
          <div>QCTF Score: {analysis.qctf.toFixed(2)}</div>
          <div>Chaos/Structure: {Math.round(analysis.chaosRatio * 100)}%/{Math.round(analysis.structureRatio * 100)}%</div>
          <div>Dimensional Balance: {analysis.dimensionalBalance.toFixed(2)}</div>
          <div>CCQC: {analysis.ccqc.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

export default QuantumSpaghettiVisualizer;