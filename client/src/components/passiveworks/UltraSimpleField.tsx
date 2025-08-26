import React from 'react';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';

interface UltraSimpleFieldProps {
  domain: DomainType;
  className?: string;
}

/**
 * UltraSimpleField - A completely static visualization with no animations or API calls
 * This is the most stable possible version that won't cause any performance issues
 */
export function UltraSimpleField({
  domain,
  className = ''
}: UltraSimpleFieldProps) {
  const domainConfig = domainConfigs[domain];
  
  // Fixed, static nodes and connections - no animations or movement at all
  // We don't even use React state here to ensure maximum stability
  const nodes = [
    { id: '1', label: 'Human Intelligence', x: 20, y: 30, type: 'human' },
    { id: '2', label: 'AI Processing', x: 80, y: 30, type: 'ai' },
    { id: '3', label: 'Data Analysis', x: 50, y: 70, type: 'data' },
    { id: '4', label: 'Neural Network', x: 20, y: 70, type: 'ai' },
    { id: '5', label: 'Pattern Recognition', x: 80, y: 70, type: 'human' }
  ];
  
  const connections = [
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '3' },
    { source: '2', target: '5' },
    { source: '3', target: '4' },
    { source: '4', target: '5' }
  ];
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'human': return '#ffffff';
      case 'ai': return domainConfig.accentColor;
      case 'data': return '#4477FF';
      default: return '#ffffff';
    }
  };
  
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {/* Use a light grid background - no complex patterns */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Connections */}
        {connections.map((connection, index) => {
          const source = nodes.find(node => node.id === connection.source);
          const target = nodes.find(node => node.id === connection.target);
          
          if (!source || !target) return null;
          
          // Use simple percentage positioning
          const x1 = `${source.x}%`;
          const y1 = `${source.y}%`;
          const x2 = `${target.x}%`;
          const y2 = `${target.y}%`;
          
          return (
            <line
              key={`conn-${index}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map(node => {
          const nodeSize = node.type === 'data' ? 5 : 7;
          
          return (
            <g key={node.id} transform={`translate(${node.x}%, ${node.y}%)`}>
              {/* Simple node circle - no effects or animations */}
              <circle
                r={nodeSize}
                fill={getNodeColor(node.type)}
                fillOpacity="0.8"
              />
              
              {/* Simple node label */}
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