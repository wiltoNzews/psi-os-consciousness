import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useConceptualConnections } from '@/hooks/use-symbiosis-api';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';

interface StableNeuralFieldProps {
  domain: DomainType;
  className?: string;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'human' | 'ai' | 'data';
}

interface Connection {
  source: string;
  target: string;
}

/**
 * StableNeuralField - A simplified, highly stable visualization component
 * that uses basic SVG elements and minimal animations for maximum compatibility
 */
export function StableNeuralField({
  domain,
  className = ''
}: StableNeuralFieldProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const conceptMutation = useConceptualConnections();
  
  // Set up dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Load data
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
          'creativity'
        ] 
      },
      {
        onSuccess: (data) => {
          // Create predetermined node positions in a circle layout
          const processedNodes = data.nodes.map((node, index) => {
            const angle = (index / data.nodes.length) * Math.PI * 2;
            const radius = Math.min(dimensions.width, dimensions.height) * 0.3;
            const centerX = dimensions.width / 2;
            const centerY = dimensions.height / 2;
            
            return {
              id: node.id,
              label: node.label,
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle),
              type: node.type
            };
          });
          
          // Process connections
          const processedConnections = data.connections.map(conn => ({
            source: conn.source,
            target: conn.target
          }));
          
          setNodes(processedNodes);
          setConnections(processedConnections);
        }
      }
    );
  }, [domain, conceptMutation, dimensions]);
  
  // Get node color based on type and domain
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'human': return '#ffffff';
      case 'ai': return domainConfigs[domain].color;
      case 'data': return '#4477FF';
      default: return '#ffffff';
    }
  };
  
  // Get connection color based on domain
  const getConnectionColor = () => {
    switch (domain) {
      case 'finance': return 'rgba(127, 231, 168, 0.3)';
      case 'crypto': return 'rgba(124, 165, 255, 0.3)';
      case 'sports': return 'rgba(255, 127, 127, 0.3)';
      default: return 'rgba(198, 127, 255, 0.3)';
    }
  };
  
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="absolute inset-0"
      >
        {/* Background grid pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path 
            d="M 40 0 L 0 0 0 40" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.05)" 
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Connections */}
        {connections.map((conn, index) => {
          const sourceNode = nodes.find(n => n.id === conn.source);
          const targetNode = nodes.find(n => n.id === conn.target);
          
          if (!sourceNode || !targetNode) return null;
          
          return (
            <motion.line
              key={`conn-${index}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={getConnectionColor()}
              strokeWidth="1"
              opacity={0.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1 }}
            />
          );
        })}
        
        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Node circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={8}
              fill={getNodeColor(node.type)}
              opacity={0.8}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Node label */}
            <motion.text
              x={node.x}
              y={node.y + 20}
              fontSize="10"
              fill="white"
              textAnchor="middle"
              opacity={0.7}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {node.label}
            </motion.text>
          </g>
        ))}
        
        {/* Domain indicator */}
        <text
          x="20"
          y="30"
          fontSize="14"
          fill={domainConfigs[domain].color}
          opacity={0.8}
        >
          {domainConfigs[domain].name} Domain
        </text>
      </svg>
    </div>
  );
}