import React, { useRef, useEffect } from 'react';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';

interface UltraStableFieldProps {
  domain: DomainType;
  className?: string;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'human' | 'ai' | 'data';
  size: number;
  pulseDelay?: number; // Animation delay in seconds
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

// Node positions designed for perfect stability
const NODES: Node[] = [
  { id: 'n1', label: 'Human Intelligence', x: 250, y: 150, type: 'human', size: 32, pulseDelay: 0 },
  { id: 'n2', label: 'Cognitive Extension', x: 450, y: 150, type: 'ai', size: 32, pulseDelay: 2 },
  { id: 'n3', label: 'Data Analysis', x: 350, y: 320, type: 'data', size: 30, pulseDelay: 4 },
  { id: 'n4', label: 'Neural Network', x: 180, y: 350, type: 'ai', size: 34, pulseDelay: 6 },
  { id: 'n5', label: 'Pattern Recognition', x: 520, y: 280, type: 'human', size: 30, pulseDelay: 8 },
  { id: 'n6', label: 'Symbiotic Engine', x: 350, y: 220, type: 'ai', size: 35, pulseDelay: 10 },
  { id: 'n7', label: 'Cultural Insight', x: 600, y: 380, type: 'data', size: 30, pulseDelay: 12 },
];

// Static connections between nodes
const CONNECTIONS: Connection[] = [
  { source: 'n1', target: 'n2', strength: 0.8 },
  { source: 'n1', target: 'n6', strength: 0.9 },
  { source: 'n2', target: 'n6', strength: 0.9 },
  { source: 'n2', target: 'n5', strength: 0.7 },
  { source: 'n6', target: 'n3', strength: 0.8 },
  { source: 'n3', target: 'n4', strength: 0.6 },
  { source: 'n4', target: 'n7', strength: 0.5 },
  { source: 'n5', target: 'n7', strength: 0.7 },
  { source: 'n3', target: 'n5', strength: 0.6 },
  { source: 'n6', target: 'n4', strength: 0.7 },
  { source: 'n1', target: 'n3', strength: 0.6 },
];

export function UltraStableField({ domain, className = '' }: UltraStableFieldProps) {
  const domainColor = domainConfigs[domain].color;
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Background canvas for particles
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Create particle system
    const particleCount = 150;
    const particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      direction: number;
      alpha: number;
    }[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        color: i % 3 === 0 ? domainColor : '#ffffff',
        speed: Math.random() * 0.15 + 0.05,
        direction: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.3 + 0.05
      });
    }
    
    // Animation loop
    let animationFrame: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a dark gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width/1.5
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.9)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 0.5;
      
      const gridSize = 50;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw domain circle
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      
      // Dashed circle
      ctx.strokeStyle = domainColor;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw faint domain glow
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.8,
        centerX, centerY, radius * 1.2
      );
      
      // Using rgba for proper color transparency
      const colorBase = domainColor.startsWith('#') 
        ? domainColor.substring(1) 
        : domainColor === 'purple' ? '800080' : '000000';
        
      // Convert hex to rgb components
      const r = parseInt(colorBase.substring(0, 2), 16) || 0;
      const g = parseInt(colorBase.substring(2, 4), 16) || 0;
      const b = parseInt(colorBase.substring(4, 6), 16) || 0;
      
      glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
      glowGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.1)`);
      glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      ctx.fillStyle = glowGradient;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Update and draw particles
      particles.forEach(particle => {
        // Update position
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrame);
    };
  }, [domain, domainColor]);
  
  // Foreground canvas for holographic effects
  useEffect(() => {
    const canvas = fgCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Animation loop
    let animationFrame: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create scan line effect
      const scanLineHeight = 4;
      const scanLineSpacing = 8;
      const scanLineSpeed = 0.5;
      const scanLineOffset = (Date.now() * scanLineSpeed) % (scanLineSpacing * 2);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let y = scanLineOffset; y < canvas.height; y += scanLineSpacing) {
        ctx.fillRect(0, y, canvas.width, scanLineHeight);
      }
      
      // Draw subtle noise
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.02})`;
        ctx.fillRect(x, y, size, size);
      }
      
      // Add occasional glitch effect
      if (Math.random() < 0.02) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 100 + 50;
        const height = Math.random() * 10 + 5;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05 + 0.05})`;
        ctx.fillRect(x, y, width, height);
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'human': return 'rgb(255, 255, 255)';
      case 'ai': return domainColor;
      case 'data': return '#4477FF';
      default: return '#ffffff';
    }
  };
  
  const getConnectionOpacity = (strength: number) => {
    return 0.3 + (strength * 0.5);
  };
  
  // Create CSS for the pulsing animations
  const animationStyles = `
    @keyframes pulse {
      0% { opacity: 0.7; transform: scale(1); filter: blur(0px); }
      50% { opacity: 1; transform: scale(1.1); filter: blur(1px); }
      100% { opacity: 0.7; transform: scale(1); filter: blur(0px); }
    }
    
    @keyframes breathe {
      0% { opacity: 0.1; transform: scale(1); }
      50% { opacity: 0.25; transform: scale(1.4); }
      100% { opacity: 0.1; transform: scale(1); }
    }
    
    @keyframes shiftHue {
      0% { filter: hue-rotate(0deg); }
      50% { filter: hue-rotate(15deg); }
      100% { filter: hue-rotate(0deg); }
    }
    
    @keyframes dash {
      to {
        stroke-dashoffset: -100;
      }
    }
    
    @keyframes glow {
      0% { filter: brightness(0.7) blur(1px); }
      50% { filter: brightness(1.3) blur(3px); }
      100% { filter: brightness(0.7) blur(1px); }
    }
    
    @keyframes flow {
      0% { stroke-dashoffset: 1000; }
      100% { stroke-dashoffset: 0; }
    }
    
    @keyframes textGlow {
      0% { opacity: 0.8; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
      50% { opacity: 1; text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 15px rgba(255, 255, 255, 0.5); }
      100% { opacity: 0.8; text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
    }
    
    .node-pulse {
      transform-origin: center;
      animation: pulse 4s infinite ease-in-out, shiftHue 10s infinite ease-in-out;
    }
    
    .node-breathe {
      transform-origin: center;
      animation: breathe 8s infinite ease-in-out;
    }
    
    .connection-pulse {
      animation: glow 5s infinite ease-in-out;
      stroke-dasharray: 5, 5;
      animation: dash 30s linear infinite;
    }
    
    .connection-flow {
      stroke-dasharray: 10, 10;
      animation: flow 20s linear infinite;
    }
    
    .text-glow {
      animation: textGlow 3s infinite ease-in-out;
    }
    
    /* Custom class for holographic matte black appearance */
    .holographic-matte {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.95) 100%);
      pointer-events: none;
      z-index: 5;
      mix-blend-mode: multiply;
    }
  `;
  
  return (
    <div className={`w-full h-full relative ${className}`} style={{ backgroundColor: '#000' }}>
      {/* Add the CSS animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Background canvas layer */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Main SVG visualization layer */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10">
        <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
          {/* Define filters and gradients */}
          <defs>
            {/* Base glow filter for nodes */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Stronger glow filter for human nodes */}
            <filter id="humanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Strong domain-specific glow filter */}
            <filter id="domainGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Ultra strong glow for hover states */}
            <filter id="ultraGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Data flow gradient for connections */}
            <linearGradient id="dataFlowGradient" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="0.1" />
              <stop offset="50%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="white" stopOpacity="0.1" />
              <animate 
                attributeName="x1" 
                values="0%;100%;0%" 
                dur="10s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="x2" 
                values="100%;200%;100%" 
                dur="10s" 
                repeatCount="indefinite" 
              />
            </linearGradient>
            
            {/* Domain radial gradient */}
            <radialGradient id="domainGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
              <stop offset="0%" stopColor={domainColor} stopOpacity="0.2" />
              <stop offset="70%" stopColor={domainColor} stopOpacity="0.1" />
              <stop offset="100%" stopColor={domainColor} stopOpacity="0" />
            </radialGradient>
            
            {/* Matte gradient overlay */}
            <linearGradient id="matteOverlay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="black" stopOpacity="0.4" />
              <stop offset="50%" stopColor="black" stopOpacity="0.1" />
              <stop offset="100%" stopColor="black" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Domain circle with gradient fill */}
          <circle 
            cx="400" 
            cy="300" 
            r="250" 
            fill="url(#domainGradient)" 
            stroke={domainColor} 
            strokeWidth="1.5" 
            strokeDasharray="5,5" 
            opacity="0.7" 
          />
          
          {/* Enhanced connections with gradient and animation */}
          {CONNECTIONS.map((conn, i) => {
            const source = NODES.find(n => n.id === conn.source)!;
            const target = NODES.find(n => n.id === conn.target)!;
            return (
              <g key={`conn-${i}`}>
                {/* Connection glow layer */}
                <line 
                  x1={source.x} 
                  y1={source.y} 
                  x2={target.x} 
                  y2={target.y} 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth={3 + conn.strength * 2}
                  opacity="0.3"
                  filter="url(#glow)"
                />
                
                {/* Base connection line */}
                <line 
                  x1={source.x} 
                  y1={source.y} 
                  x2={target.x} 
                  y2={target.y} 
                  stroke="rgba(255,255,255,0.6)" 
                  strokeWidth={1 + conn.strength}
                  opacity={getConnectionOpacity(conn.strength)}
                  className="connection-pulse"
                  style={{ 
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
                
                {/* Animated data flow along connection */}
                <line 
                  x1={source.x} 
                  y1={source.y} 
                  x2={target.x} 
                  y2={target.y} 
                  stroke="url(#dataFlowGradient)" 
                  strokeWidth={2 + conn.strength * 2}
                  opacity="0.7"
                  className="connection-flow"
                  style={{ 
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              </g>
            );
          })}
          
          {/* Nodes with enhanced effects */}
          {NODES.map((node) => (
            <g key={`node-${node.id}`}>
              {/* Extra large outer glow bubble */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={node.size * 2.5} 
                fill={getNodeColor(node.type)}
                opacity="0.05"
                style={{ 
                  animation: `breathe 12s infinite ease-in-out`,
                  animationDelay: `${node.pulseDelay || 0}s`,
                }}
                className="node-breathe"
              />
              
              {/* Large outer glow bubble */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={node.size * 2} 
                fill={getNodeColor(node.type)}
                opacity="0.08"
                style={{ 
                  animation: `breathe 10s infinite ease-in-out`,
                  animationDelay: `${node.pulseDelay || 0}s`,
                }}
                className="node-breathe"
              />
              
              {/* Medium glow circle */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={node.size * 1.5} 
                fill={getNodeColor(node.type)}
                opacity="0.15"
                style={{ 
                  animation: `breathe 8s infinite ease-in-out`,
                  animationDelay: `${(node.pulseDelay || 0) + 1}s`,
                }}
                className="node-breathe"
              />
              
              {/* Core outer glow */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={node.size * 1.2} 
                fill={getNodeColor(node.type)}
                opacity="0.3"
                filter={node.type === 'ai' ? 'url(#domainGlow)' : (node.type === 'human' ? 'url(#humanGlow)' : 'url(#glow)')}
                style={{ 
                  animation: `pulse 6s infinite ease-in-out`,
                  animationDelay: `${node.pulseDelay || 0}s`,
                }}
                className="node-pulse"
              />
              
              {/* Core node with glow effect */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={node.size} 
                fill={getNodeColor(node.type)}
                opacity="0.9"
                filter={node.type === 'ai' ? 'url(#domainGlow)' : (node.type === 'human' ? 'url(#humanGlow)' : 'url(#glow)')}
                style={{ 
                  animation: `pulse 4s infinite ease-in-out`,
                  animationDelay: `${node.pulseDelay || 0}s`,
                }}
                className="node-pulse"
              />
              
              {/* Inner bright core */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={node.size * 0.7} 
                fill={node.type === 'ai' ? domainColor : (node.type === 'human' ? 'white' : '#4477FF')}
                opacity="1"
                style={{ 
                  filter: 'brightness(1.3)',
                }}
              />
              
              {/* Super bright center */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={node.size * 0.3} 
                fill="white"
                opacity="0.9"
                style={{ 
                  filter: 'brightness(1.5)',
                }}
              />
              
              {/* Node label with glow */}
              <text 
                x={node.x} 
                y={node.y + node.size + 20} 
                fill="white" 
                textAnchor="middle" 
                fontSize="14"
                opacity="0.95"
                className="text-glow"
                filter="url(#glow)"
                style={{
                  textShadow: '0 0 8px rgba(255, 255, 255, 0.7)'
                }}
              >
                {node.label}
              </text>
            </g>
          ))}
          
          {/* Domain label with strong glow */}
          <text 
            x="40" 
            y="40" 
            fill={domainColor} 
            fontSize="24" 
            fontWeight="bold"
            filter="url(#domainGlow)"
            className="text-glow"
            style={{
              textShadow: `0 0 12px ${domainColor}`
            }}
          >
            {domainConfigs[domain].name} Domain
          </text>
          
          {/* PassiveWorks label */}
          <text 
            x="40" 
            y="580" 
            fill="white" 
            fontSize="16" 
            opacity="0.8"
            filter="url(#glow)"
            className="text-glow"
          >
            PassiveWorks Neural Interface
          </text>
        </svg>
      </div>
      
      {/* Holographic overlay effects - scanlines and noise */}
      <canvas
        ref={fgCanvasRef}
        className="absolute inset-0 z-20 mix-blend-overlay opacity-50 pointer-events-none"
      />
      
      {/* Matte black overlay for that premium look */}
      <div className="holographic-matte"></div>
      
      {/* Corner ambient glow effects */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 opacity-[0.15] rounded-full z-1" 
        style={{ 
          backgroundColor: domainColor,
          filter: 'blur(120px)'
        }} 
      />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 opacity-[0.1] rounded-full z-1" 
        style={{ 
          backgroundColor: domainColor,
          filter: 'blur(150px)'
        }} 
      />
      <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 opacity-[0.08] rounded-full z-1" 
        style={{ 
          backgroundColor: 'white',
          filter: 'blur(100px)'
        }} 
      />
    </div>
  );
}