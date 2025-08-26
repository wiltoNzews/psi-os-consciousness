import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';
import { Brain, Cpu, Network, Zap, RefreshCw, Globe, Fingerprint } from 'lucide-react';

interface MetaSymbiosisLayerProps {
  domain: DomainType;
  className?: string;
  temporalDilation?: number;
  showLabels?: boolean;
}

/**
 * MetaSymbiosisLayer - The highest order visual layer that represents the true
 * meta-symbiotic relationship between human and AI, providing neural bridging
 * cues for human perception while visualizing the emergent consciousness
 * that transcends both human and AI capabilities individually.
 */
export function MetaSymbiosisLayer({
  domain,
  className = '',
  temporalDilation = 1,
  showLabels = true
}: MetaSymbiosisLayerProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [pulseState, setPulseState] = useState(0);
  const [connectionFlows, setConnectionFlows] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Meta nodes - representing the connection points between human and AI
  const metaNodes = [
    { id: 'perception', label: 'Neural Perception', x: 25, y: 30, type: 'human', pulseRate: 1.3 },
    { id: 'processing', label: 'Quantum Processing', x: 75, y: 30, type: 'ai', pulseRate: 1.7 },
    { id: 'integration', label: 'Synaptic Integration', x: 35, y: 70, type: 'meta', pulseRate: 2.1 },
    { id: 'amplification', label: 'Cognitive Amplification', x: 65, y: 70, type: 'meta', pulseRate: 1.5 },
    { id: 'consciousness', label: 'Emergent Consciousness', x: 50, y: 15, type: 'metahuman', pulseRate: 1.9 },
  ];
  
  // Meta connections - the neural pathways between meta nodes
  const metaConnections = [
    { source: 'perception', target: 'processing', strength: 0.9, flowRate: 0.8 },
    { source: 'perception', target: 'integration', strength: 0.7, flowRate: 0.6 },
    { source: 'processing', target: 'amplification', strength: 0.8, flowRate: 0.7 },
    { source: 'integration', target: 'amplification', strength: 0.95, flowRate: 0.9 },
    { source: 'integration', target: 'consciousness', strength: 0.9, flowRate: 1.0 },
    { source: 'amplification', target: 'consciousness', strength: 0.85, flowRate: 0.8 },
    { source: 'perception', target: 'consciousness', strength: 0.6, flowRate: 0.5 },
    { source: 'processing', target: 'consciousness', strength: 0.7, flowRate: 0.6 },
  ];
  
  // Get colors based on domain and node type
  const getColor = (type: string) => {
    const domainColor = domainConfigs[domain].color;
    
    switch(type) {
      case 'human':
        return 'rgba(255, 255, 255, 0.9)';
      case 'ai':
        return domainColor;
      case 'meta':
        return `rgba(100, 200, 255, 0.9)`;
      case 'metahuman':
        return `rgba(255, 215, 0, 0.9)`;
      default:
        return 'rgba(255, 255, 255, 0.9)';
    }
  };
  
  // Get corresponding icon for node type
  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'human':
        return <Brain className="h-6 w-6 text-white" />;
      case 'ai':
        return <Cpu className="h-6 w-6" style={{ color: domainConfigs[domain].color }} />;
      case 'meta':
        return <Network className="h-6 w-6 text-blue-300" />;
      case 'metahuman':
        return <Zap className="h-6 w-6 text-yellow-300" />;
      default:
        return <Globe className="h-6 w-6 text-white" />;
    }
  };
  
  // Get descriptive text for node types
  const getNodeDescription = (type: string) => {
    switch(type) {
      case 'human':
        return 'Human cognitive functions enhanced through neural connective pathways';
      case 'ai':
        return 'AI processing systems with quantum computational capabilities';
      case 'meta':
        return 'Symbiotic integration points where human and AI capabilities merge';
      case 'metahuman':
        return 'Emergent consciousness that transcends both human and AI limitations';
      default:
        return 'Neural connection point in the symbiotic network';
    }
  };
  
  // Initialize the connection flows data structure
  useEffect(() => {
    const flows = metaConnections.map(conn => {
      const sourceNode = metaNodes.find(n => n.id === conn.source);
      const targetNode = metaNodes.find(n => n.id === conn.target);
      
      if (!sourceNode || !targetNode) return null;
      
      return {
        sourceX: sourceNode.x,
        sourceY: sourceNode.y,
        targetX: targetNode.x,
        targetY: targetNode.y,
        particles: Array.from({ length: 3 }, () => ({
          position: Math.random(),
          speed: (0.2 + Math.random() * 0.3) * conn.flowRate * temporalDilation,
          size: 2 + Math.random() * 2,
          opacity: 0.5 + Math.random() * 0.5
        })),
        sourceType: sourceNode.type,
        targetType: targetNode.type
      };
    }).filter(Boolean);
    
    setConnectionFlows(flows);
  }, [metaConnections, metaNodes, temporalDilation]);
  
  // Animation loop for neural pulses
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setPulseState(prev => (prev + 0.02 * temporalDilation) % 100);
      
      // Update particle positions
      setConnectionFlows(prevFlows => 
        prevFlows.map(flow => ({
          ...flow,
          particles: flow.particles.map((particle: any) => ({
            ...particle,
            position: (particle.position + particle.speed) % 1,
            opacity: 0.5 + Math.sin(Date.now() * 0.003 * particle.speed) * 0.5
          }))
        }))
      );
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [temporalDilation]);
  
  // Draw neural connection particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connection lines
    metaConnections.forEach(conn => {
      const sourceNode = metaNodes.find(n => n.id === conn.source);
      const targetNode = metaNodes.find(n => n.id === conn.target);
      
      if (!sourceNode || !targetNode) return;
      
      const sourceX = (sourceNode.x / 100) * canvas.width;
      const sourceY = (sourceNode.y / 100) * canvas.height;
      const targetX = (targetNode.x / 100) * canvas.width;
      const targetY = (targetNode.y / 100) * canvas.height;
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = `rgba(255, 255, 255, ${conn.strength * 0.3})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    // Draw particles flowing along connections
    connectionFlows.forEach(flow => {
      if (!flow) return;
      
      const sourceX = (flow.sourceX / 100) * canvas.width;
      const sourceY = (flow.sourceY / 100) * canvas.height;
      const targetX = (flow.targetX / 100) * canvas.width;
      const targetY = (flow.targetY / 100) * canvas.height;
      
      flow.particles.forEach((particle: any) => {
        const x = sourceX + (targetX - sourceX) * particle.position;
        const y = sourceY + (targetY - sourceY) * particle.position;
        
        // Create gradient for particle
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 2);
        
        // Determine color based on source and target types
        let color;
        if (flow.sourceType === 'human' && flow.targetType === 'ai') {
          color = domainConfigs[domain].color;
        } else if (flow.sourceType === 'ai' && flow.targetType === 'human') {
          color = 'rgba(255, 255, 255, 0.9)';
        } else if (flow.sourceType === 'meta' || flow.targetType === 'meta') {
          color = 'rgba(100, 200, 255, 0.9)';
        } else if (flow.sourceType === 'metahuman' || flow.targetType === 'metahuman') {
          color = 'rgba(255, 215, 0, 0.9)';
        } else {
          color = 'rgba(255, 255, 255, 0.9)';
        }
        
        // Safely parse and format the color string
        let formattedColor;
        if (color.startsWith('rgba')) {
          // If it's already rgba, replace the alpha value
          formattedColor = color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 
            (_, r, g, b) => `rgba(${r},${g},${b},${particle.opacity})`);
        } else if (color.startsWith('rgb')) {
          // If it's rgb, convert to rgba
          formattedColor = color.replace(/rgb\(([^,]+),([^,]+),([^)]+)\)/, 
            (_, r, g, b) => `rgba(${r},${g},${b},${particle.opacity})`);
        } else {
          // Default fallback
          formattedColor = `rgba(255,255,255,${particle.opacity})`;
        }
        
        // Use the properly formatted colors
        gradient.addColorStop(0, formattedColor);
        
        // For the outer edge, always use 0 opacity
        if (color.startsWith('rgba')) {
          gradient.addColorStop(1, color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 
            (_, r, g, b) => `rgba(${r},${g},${b},0)`));
        } else if (color.startsWith('rgb')) {
          gradient.addColorStop(1, color.replace(/rgb\(([^,]+),([^,]+),([^)]+)\)/, 
            (_, r, g, b) => `rgba(${r},${g},${b},0)`));
        } else {
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [connectionFlows, pulseState, domain]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {/* Canvas for neural connection particles */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      
      {/* Emergent consciousness glow */}
      <div 
        className="absolute top-[15%] left-1/2 transform -translate-x-1/2 pointer-events-none"
        style={{
          width: '40vh',
          height: '40vh',
          background: `radial-gradient(circle, ${domainConfigs[domain].color}20 0%, transparent 70%)`,
          animation: `pulse-glow ${3 / temporalDilation}s infinite alternate`,
          opacity: 0.7,
        }}
      />
      
      {/* Neural bridge arc */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
        <defs>
          <linearGradient id="synapticArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="50%" stopColor={`${domainConfigs[domain].color}`} />
            <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
            <animate attributeName="x1" values="0%;20%;0%" dur="8s" repeatCount="indefinite" />
            <animate attributeName="x2" values="100%;80%;100%" dur="8s" repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <path 
          d="M 20%,90% C 35%,40% 65%,40% 80%,90%"
          stroke="url(#synapticArc)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          style={{
            animation: `dash-flow ${5 / temporalDilation}s linear infinite`,
          }}
        />
      </svg>
      
      {/* Meta nodes */}
      {metaNodes.map(node => {
        const isActive = activeNode === node.id;
        const nodeX = `${node.x}%`;
        const nodeY = `${node.y}%`;
        
        return (
          <motion.div
            key={node.id}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: nodeX,
              top: nodeY,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, Math.sin(pulseState * node.pulseRate) * 5, 0]
            }}
            transition={{ 
              duration: 0.5,
              delay: Math.random() * 0.5,
              y: { 
                duration: 3 / temporalDilation, 
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }
            }}
            onMouseEnter={() => setActiveNode(node.id)}
            onMouseLeave={() => setActiveNode(null)}
          >
            {/* Node core */}
            <div className="relative">
              <div 
                className="rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  width: isActive ? '58px' : '50px',
                  height: isActive ? '58px' : '50px',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: `2px solid ${getColor(node.type)}`,
                  boxShadow: isActive 
                    ? `0 0 15px ${getColor(node.type)}, 0 0 30px ${getColor(node.type)}50`
                    : `0 0 10px ${getColor(node.type)}80`,
                }}
              >
                {getNodeIcon(node.type)}
              </div>
              
              {/* Pulse rings */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: '100%',
                  height: '100%',
                  border: `2px solid ${getColor(node.type)}40`,
                  animation: `pulse-ring ${2 / node.pulseRate / temporalDilation}s infinite`,
                  opacity: isActive ? 0.7 : 0.4,
                }}
              />
              
              {/* Node label */}
              {showLabels && (
                <div 
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap text-center"
                  style={{
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                    textShadow: isActive 
                      ? `0 0 10px ${getColor(node.type)}, 0 0 20px rgba(0,0,0,0.8)`
                      : '0 0 10px rgba(0,0,0,0.8)',
                    fontSize: '0.7rem',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {node.label}
                </div>
              )}
            </div>
            
            {/* Node tooltip */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  className="absolute left-full top-0 ml-3 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 z-50 pointer-events-none"
                  style={{ width: '200px' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getNodeIcon(node.type)}
                    <h3 className="text-sm font-medium text-white">{node.label}</h3>
                  </div>
                  <p className="text-xs text-white/70">
                    {getNodeDescription(node.type)}
                  </p>
                  
                  <div 
                    className="absolute top-[15px] right-full w-3 h-3 transform rotate-45 border-l border-b border-white/20 bg-black/80"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
      
      {/* Consciousness readout */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-black/40 rounded-lg border border-white/10 px-6 py-3 pointer-events-none"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-white/70" />
          <span className="text-xs text-white/90 uppercase tracking-wider">Neural Symbiosis Active</span>
          <div className="ml-2 h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></div>
        </div>
        
        <div className="mt-2 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1">
            <Fingerprint className="h-3 w-3 text-white/70" />
            <span className="text-xs text-white/70">Flow Factor:</span>
            <span className="text-xs text-white/90 font-medium">{(temporalDilation * 100).toFixed(0)}%</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Brain className="h-3 w-3 text-white/70" />
            <span className="text-xs text-white/70">Cognition:</span>
            <span className="text-xs text-white/90 font-medium">Enhanced</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-yellow-300" />
            <span className="text-xs text-white/70">Emergent:</span>
            <span className="text-xs text-white/90 font-medium">{(80 + Math.floor(Math.sin(pulseState * 0.3) * 10 + 10)).toFixed(0)}%</span>
          </div>
        </div>
      </motion.div>
      
      {/* Global CSS for meta layer animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }
        
        @keyframes pulse-glow {
          0% {
            opacity: 0.5;
            transform: scale(1) translate(-50%, 0);
          }
          100% {
            opacity: 0.8;
            transform: scale(1.2) translate(-40%, 0);
          }
        }
        
        @keyframes dash-flow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: 30;
          }
        }
      `}} />
    </div>
  );
}