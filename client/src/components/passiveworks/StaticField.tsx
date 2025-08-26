import React, { useEffect, useRef, useState } from 'react';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';

interface StaticFieldProps {
  domain: DomainType;
  className?: string;
  showLabels?: boolean;
  highlightedNode?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  showNodeDetails?: boolean;
  temporalDilation?: number;
  showDataFlow?: boolean;
}

/**
 * StaticField - A super-simple error-free visualization
 * Uses SVG instead of Canvas to avoid any WebGL or Canvas gradient issues
 */
export function StaticField({
  domain,
  className = '',
  showLabels = true,
  showDataFlow = true
}: StaticFieldProps) {
  const domainColor = domainConfigs[domain].color;
  
  // Create a static set of nodes and connections
  const nodes = [
    { id: '1', label: 'Human Intelligence', x: 30, y: 30, type: 'human' },
    { id: '2', label: 'AI Processing', x: 70, y: 30, type: 'ai' },
    { id: '3', label: 'Data Analysis', x: 50, y: 70, type: 'data' },
    { id: '4', label: 'Neural Network', x: 20, y: 60, type: 'ai' },
    { id: '5', label: 'Pattern Recognition', x: 75, y: 65, type: 'human' }
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
      case 'ai': return domainColor;
      case 'data': return '#4477FF';
      default: return '#ffffff';
    }
  };
  
  // Animation ref and data flow state
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef(nodes.map(node => ({
    ...node,
    pulsePhase: Math.random() * Math.PI * 2, // Random starting phase for each node
    pulseSpeed: 0.5 + Math.random() * 0.5, // Random pulse speed
  })));
  
  // Particles for data flow animation
  const [particles, setParticles] = useState<Array<{
    connectionIndex: number;
    progress: number;
    speed: number;
  }>>([]);
  
  // Initialize data flow particles
  useEffect(() => {
    if (showDataFlow) {
      // Create initial particles (one per connection)
      const initialParticles = connections.map((conn, idx) => ({
        connectionIndex: idx,
        progress: Math.random(), // Start at random positions
        speed: 0.005 + Math.random() * 0.01, // Random speeds
      }));
      
      setParticles(initialParticles);
    } else {
      setParticles([]);
    }
  }, [showDataFlow, connections]);
  
  // Set up animation loop using requestAnimationFrame
  useEffect(() => {
    let startTime = Date.now();
    let lastParticleTime = 0;
    
    const animate = () => {
      const now = Date.now();
      const time = (now - startTime) / 1000; // time in seconds
      const deltaTime = (now - lastParticleTime) / 1000;
      
      // Get all node elements and apply pulsing effect
      nodes.forEach((node, index) => {
        const nodeEl = document.getElementById(`node-${node.id}`);
        const nodeRefData = nodesRef.current[index];
        
        if (nodeEl) {
          // Calculate pulse size (subtle scale effect)
          const pulse = 1 + Math.sin(time * nodeRefData.pulseSpeed + nodeRefData.pulsePhase) * 0.15;
          
          // Apply scale transform
          nodeEl.style.transform = `scale(${pulse})`;
          
          // Adjust opacity slightly
          nodeEl.style.opacity = (0.7 + Math.sin(time * nodeRefData.pulseSpeed + nodeRefData.pulsePhase) * 0.3).toString();
        }
      });
      
      // Apply subtle animation to connection lines
      connections.forEach((conn, index) => {
        const lineEl = document.getElementById(`conn-${index}`);
        
        if (lineEl) {
          // Subtly change opacity for the lines
          const lineOpacity = 0.15 + Math.sin(time * 0.5 + index * 0.2) * 0.1;
          lineEl.setAttribute('stroke-opacity', lineOpacity.toString());
        }
      });
      
      // Animate particles
      if (showDataFlow) {
        // Add a new particle occasionally
        if (time - lastParticleTime > 1.0) { // Add a new particle every second
          lastParticleTime = time;
          
          // Add a new particle on a random connection
          if (connections.length > 0) {
            const newParticle = {
              connectionIndex: Math.floor(Math.random() * connections.length),
              progress: 0,
              speed: 0.005 + Math.random() * 0.01,
            };
            
            setParticles(prev => [...prev, newParticle]);
          }
        }
        
        // Update existing particles
        setParticles(currentParticles => {
          return currentParticles
            // Move the particles along their connections
            .map(particle => ({
              ...particle,
              progress: particle.progress + particle.speed,
            }))
            // Remove particles that have reached the end
            .filter(particle => particle.progress < 1);
        });
        
        // Animate each particle dot
        particles.forEach((particle, idx) => {
          const particleEl = document.getElementById(`particle-${idx}`);
          if (!particleEl) return;
          
          const connection = connections[particle.connectionIndex];
          if (!connection) return;
          
          const source = nodes.find(n => n.id === connection.source);
          const target = nodes.find(n => n.id === connection.target);
          if (!source || !target) return;
          
          // Calculate the position along the connection line
          const x = source.x + (target.x - source.x) * particle.progress;
          const y = source.y + (target.y - source.y) * particle.progress;
          
          // Position the particle
          particleEl.style.left = `${x}%`;
          particleEl.style.top = `${y}%`;
        });
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Clean up animation when component unmounts
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, connections, showDataFlow, particles]);
  
  return (
    <div className={`w-full h-full relative ${className}`} style={{ background: '#111' }}>
      {/* Simple background grid */}
      <div className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} 
      />
      
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Connections with SVG lines */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
          {connections.map((conn, idx) => {
            const source = nodes.find(n => n.id === conn.source);
            const target = nodes.find(n => n.id === conn.target);
            
            if (!source || !target) return null;
            
            return (
              <line 
                key={`conn-${idx}`}
                id={`conn-${idx}`}
                x1={`${source.x}%`} 
                y1={`${source.y}%`} 
                x2={`${target.x}%`} 
                y2={`${target.y}%`} 
                stroke={`rgba(255, 255, 255, 0.2)`} 
                strokeWidth="1"
                strokeOpacity="0.2"
              />
            );
          })}
        </svg>
        
        {/* Animated nodes */}
        {nodes.map((node) => (
          <div 
            key={node.id}
            style={{
              position: 'absolute',
              top: `${node.y}%`,
              left: `${node.x}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              transition: 'all 0.3s ease'
            }}
          >
            <div 
              id={`node-${node.id}`}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: getNodeColor(node.type),
                boxShadow: `0 0 10px ${getNodeColor(node.type)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.5s ease'
              }}
            />
            
            {showLabels && (
              <div 
                style={{
                  marginTop: '8px',
                  color: 'white',
                  fontSize: '12px',
                  opacity: 0.7,
                  whiteSpace: 'nowrap',
                  textAlign: 'center'
                }}
              >
                {node.label}
              </div>
            )}
          </div>
        ))}
        
        {/* Data flow particles */}
        {showDataFlow && particles.map((particle, idx) => {
          const connection = connections[particle.connectionIndex];
          if (!connection) return null;
          
          const source = nodes.find(n => n.id === connection.source);
          const target = nodes.find(n => n.id === connection.target);
          if (!source || !target) return null;
          
          // Initial position
          const x = source.x + (target.x - source.x) * particle.progress;
          const y = source.y + (target.y - source.y) * particle.progress;
          
          // Get the color based on the source node type (the particle is traveling from source to target)
          const sourceNode = nodes.find(n => n.id === connection.source);
          const particleColor = sourceNode ? getNodeColor(sourceNode.type) : '#ffffff';
          
          return (
            <div
              key={`particle-${idx}`}
              id={`particle-${idx}`}
              style={{
                position: 'absolute',
                top: `${y}%`,
                left: `${x}%`,
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: particleColor,
                boxShadow: `0 0 5px ${particleColor}`,
                transform: 'translate(-50%, -50%)',
                opacity: 0.8,
                zIndex: 3
              }}
            />
          );
        })}
        
        {/* Domain indicator */}
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: domainColor,
            fontSize: '14px',
            opacity: 0.8
          }}
        >
          {domainConfigs[domain].name} Domain
        </div>
      </div>
      
      {/* Ambient glow effects */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          background: domainColor,
          opacity: 0.03,
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '30%',
          height: '30%',
          borderRadius: '50%',
          background: domainColor,
          opacity: 0.02,
          filter: 'blur(100px)',
          zIndex: 0
        }}
      />
    </div>
  );
}