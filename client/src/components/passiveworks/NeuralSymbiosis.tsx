import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useConceptualConnections } from '@/hooks/use-symbiosis-api';
import { DomainType } from '@/contexts/DomainContext';

interface NeuralSymbiosisProps {
  domain: DomainType;
  className?: string;
  highlightedNode?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  showNodeDetails?: boolean;
  temporalDilation?: number;
  showLabels?: boolean;
  showDataFlow?: boolean;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'human' | 'ai' | 'data';
  size: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

/**
 * NeuralSymbiosis - A simplified, stable visualization that represents the living 
 * symbiotic relationship between human intelligence and AI processing.
 * Uses SVG for structure and limited Canvas for background effects.
 */
export function NeuralSymbiosis({
  domain,
  className = '',
  highlightedNode = null,
  onNodeSelect,
  showNodeDetails = false,
  temporalDilation = 1,
  showLabels = true,
  showDataFlow = true
}: NeuralSymbiosisProps) {
  // Base container refs
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State for dimensions and nodes
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // Query for conceptual connections
  const conceptMutation = useConceptualConnections();
  
  // Colors based on node type
  const getNodeColor = (type: string, isHighlighted: boolean) => {
    if (isHighlighted) return '#ffffff';
    
    switch (type) {
      case 'human': return '#ffffff';
      case 'ai': 
        switch (domain) {
          case 'finance': return '#7FE7A8';
          case 'crypto': return '#7CA5FF';
          case 'sports': return '#FF7F7F';
          default: return '#C67FFF';
        }
      case 'data': return '#4477FF';
      default: return '#ffffff';
    }
  };
  
  // Get connection color based on domain
  const getConnectionColor = (domain: DomainType, alpha: number = 0.5) => {
    switch (domain) {
      case 'finance': return `rgba(127, 231, 168, ${alpha})`;
      case 'crypto': return `rgba(124, 165, 255, ${alpha})`;
      case 'sports': return `rgba(255, 127, 127, ${alpha})`;
      default: return `rgba(198, 127, 255, ${alpha})`;
    }
  };
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Query for data
  useEffect(() => {
    conceptMutation.mutate(
      { 
        domain, 
        concepts: [
          'human intelligence',
          'artificial intelligence',
          'neural network',
          'cognition',
          'learning',
          'creativity',
          'analysis',
          'intuition',
          'pattern recognition',
          'abstract thinking',
          'problem solving',
          'decision making'
        ] 
      },
      {
        onSuccess: (data) => {
          // Process nodes
          const processedNodes = data.nodes.map(node => ({
            id: node.id,
            label: node.label,
            x: Math.random() * 0.8 + 0.1, // Position between 10-90% of container
            y: Math.random() * 0.8 + 0.1,
            type: node.type,
            size: 6 + node.strength * 6, // Size based on strength
          }));
          
          // Process connections
          const processedConnections = data.connections.map(conn => ({
            source: conn.source,
            target: conn.target,
            strength: conn.strength,
          }));
          
          setNodes(processedNodes);
          setConnections(processedConnections);
        }
      }
    );
  }, [domain, conceptMutation]);
  
  // Draw background canvas effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid
    const gridSize = 50;
    const gridColor = 'rgba(255, 255, 255, 0.05)';
    
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw subtle glow spots
    const numGlows = 5;
    for (let i = 0; i < numGlows; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 150 + 50;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255, 255, 255, 0.03)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
  }, [dimensions]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
    >
      {/* Background layer */}
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ opacity: 0.8, filter: 'blur(2px)' }}
      />
      
      {/* Neural network visualization layer */}
      <svg
        ref={svgRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* Connections */}
        <g className="connections">
          {connections.map((conn) => {
            const sourceNode = nodes.find(n => n.id === conn.source);
            const targetNode = nodes.find(n => n.id === conn.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const sourceX = sourceNode.x * dimensions.width;
            const sourceY = sourceNode.y * dimensions.height;
            const targetX = targetNode.x * dimensions.width;
            const targetY = targetNode.y * dimensions.height;
            
            // Determine if connection involves the highlighted node
            const isHighlighted = highlightedNode && 
              (conn.source === highlightedNode || conn.target === highlightedNode);
            
            return (
              <motion.line
                key={`${conn.source}-${conn.target}`}
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke={getConnectionColor(domain, isHighlighted ? 0.8 : 0.3)}
                strokeWidth={isHighlighted ? 1.5 : 0.8}
                strokeOpacity={showDataFlow ? (conn.strength * 0.8 + 0.2) : 0.2}
                animate={{ 
                  strokeOpacity: showDataFlow 
                    ? [
                        isHighlighted ? 0.9 : (conn.strength * 0.7 + 0.2),
                        isHighlighted ? 0.6 : (conn.strength * 0.5 + 0.1),
                        isHighlighted ? 0.9 : (conn.strength * 0.7 + 0.2),
                      ]
                    : 0.2 
                }}
                transition={{ 
                  duration: 3 / (temporalDilation || 1), 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            );
          })}
        </g>
        
        {/* Nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            const nodeX = node.x * dimensions.width;
            const nodeY = node.y * dimensions.height;
            const isHighlighted = node.id === highlightedNode;
            
            return (
              <g 
                key={node.id}
                onClick={() => onNodeSelect?.(node.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node circle */}
                <motion.circle
                  cx={nodeX}
                  cy={nodeY}
                  r={node.size}
                  fill={getNodeColor(node.type, isHighlighted)}
                  opacity={isHighlighted ? 0.9 : 0.6}
                  animate={{ 
                    opacity: isHighlighted 
                      ? [0.9, 0.7, 0.9] 
                      : [0.6, 0.4, 0.6],
                    r: isHighlighted 
                      ? [node.size, node.size * 1.1, node.size] 
                      : node.size
                  }}
                  transition={{ 
                    duration: 3 / (temporalDilation || 1), 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
                
                {/* Glow effect for highlighted node */}
                {isHighlighted && (
                  <motion.circle
                    cx={nodeX}
                    cy={nodeY}
                    r={node.size * 2}
                    fill="none"
                    stroke={getNodeColor(node.type, true)}
                    strokeWidth={0.5}
                    opacity={0}
                    animate={{ 
                      opacity: [0, 0.3, 0],
                      r: [node.size * 1.5, node.size * 3, node.size * 1.5]
                    }}
                    transition={{ 
                      duration: 2 / (temporalDilation || 1),
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                )}
                
                {/* Node label */}
                {showLabels && (
                  <text
                    x={nodeX}
                    y={nodeY + node.size + 12}
                    fontSize={10}
                    fill="white"
                    opacity={isHighlighted ? 0.9 : 0.6}
                    textAnchor="middle"
                    style={{ 
                      filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.8))',
                      pointerEvents: 'none'
                    }}
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}