import React, { useEffect, useState } from 'react';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';

interface SuperStableFieldProps {
  domain: DomainType;
  className?: string;
}

/**
 * SuperStableField - An extremely stable visualization with no mouse interactions
 * Designed to completely eliminate any erratic animations
 */
export function SuperStableField({
  domain,
  className = ''
}: SuperStableFieldProps) {
  const domainConfig = domainConfigs[domain];
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Create a static set of nodes and connections
  const nodes = [
    { id: '1', label: 'Human Intelligence', x: 20, y: 30, type: 'human' },
    { id: '2', label: 'AI Processing', x: 80, y: 30, type: 'ai' },
    { id: '3', label: 'Data Analysis', x: 50, y: 70, type: 'data' },
    { id: '4', label: 'Neural Network', x: 20, y: 70, type: 'ai' },
    { id: '5', label: 'Pattern Recognition', x: 80, y: 70, type: 'human' },
    { id: '6', label: 'Semantic Understanding', x: 35, y: 50, type: 'human' },
    { id: '7', label: 'Computational Logic', x: 65, y: 50, type: 'ai' }
  ];
  
  const connections = [
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '1', target: '6' },
    { source: '2', target: '3' },
    { source: '2', target: '7' },
    { source: '3', target: '4' },
    { source: '3', target: '5' },
    { source: '4', target: '6' },
    { source: '5', target: '7' },
    { source: '6', target: '7' }
  ];
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'human': return '#ffffff';
      case 'ai': return domainConfig.accentColor;
      case 'data': return '#4477FF';
      default: return '#ffffff';
    }
  };
  
  // Use a very slow interval to update animation phase
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 0.01) % 1);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <svg 
        width="100%" 
        height="100%" 
        className="bg-transparent"
        style={{ filter: 'blur(0.2px)' }}
      >
        {/* Background grid */}
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path 
              d="M 10 0 L 0 0 0 10" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.05)" 
              strokeWidth="0.5"
            />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path 
              d="M 100 0 L 0 0 0 100" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.1)" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Connections */}
        {connections.map((connection, index) => {
          const source = nodes.find(node => node.id === connection.source);
          const target = nodes.find(node => node.id === connection.target);
          
          if (!source || !target) return null;
          
          // Calculate start and end position as percentages
          const x1 = `${source.x}%`;
          const y1 = `${source.y}%`;
          const x2 = `${target.x}%`;
          const y2 = `${target.y}%`;
          
          // Create a dash pattern for animation
          const dashLength = 5;
          const dashGap = 3;
          const dashArray = `${dashLength},${dashGap}`;
          const dashOffset = -animationPhase * (dashLength + dashGap) * 10;
          
          return (
            <line
              key={`conn-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset.toString()}
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map(node => {
          const nodeSize = node.type === 'data' ? 5 : 7;
          const pulseSize = nodeSize + 3;
          const pulseDelay = Number(node.id) * 0.5;
          
          // Animation values - very slow and stable
          const pulseScale = 1 + 0.2 * Math.sin((animationPhase * 2 * Math.PI) + pulseDelay);
          
          return (
            <g key={node.id} transform={`translate(${node.x}%, ${node.y}%)`}>
              {/* Pulse effect */}
              <circle
                r={pulseSize * pulseScale}
                fill="none"
                stroke={getNodeColor(node.type)}
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
              
              {/* Node circle */}
              <circle
                r={nodeSize}
                fill={getNodeColor(node.type)}
                fillOpacity="0.8"
              />
              
              {/* Node label */}
              <text
                x="0"
                y={nodeSize + 10}
                textAnchor="middle"
                fill="white"
                fontSize="10px"
                opacity="0.8"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}