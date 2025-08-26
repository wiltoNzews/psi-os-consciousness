import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useConceptualConnections } from '@/hooks/use-symbiosis-api';
import type { DomainType } from '@/contexts/DomainContext';

interface DataNode {
  id: string;
  x: number;
  y: number;
  type: 'human' | 'ai' | 'data';
  label: string;
  size: number;
  color: string;
  pulseFrequency?: number;
  phase?: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
  active: boolean;
  pathPoints?: { x: number, y: number }[];
}

interface NeuralFieldProps {
  domain: DomainType;
  highlightedNode?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  className?: string;
  showNodeDetails?: boolean;
  temporalDilation?: number;
}

export function FixedNeuralField({ 
  domain = 'general',
  highlightedNode = null,
  onNodeSelect,
  className = '',
  showNodeDetails = false,
  temporalDilation = 1.0
}: NeuralFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(highlightedNode);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [showDataFlow, setShowDataFlow] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Get conceptual connections from API
  const { mutate: getConnections, data: apiData } = useConceptualConnections();
  
  // Request connections from API when domain changes
  useEffect(() => {
    getConnections({ 
      domain,
      concepts: ['cognition', 'intelligence', 'data', 'knowledge', 'memory']
    });
  }, [domain, getConnections]);
  
  // Prepare nodes and connections from API data with fixed positions for consistency
  const nodes: DataNode[] = apiData?.nodes?.map((node, index) => {
    // Create deterministic positions in a circular pattern for more visual consistency
    const angle = (index / (apiData?.nodes.length || 1)) * Math.PI * 2;
    const radius = 35 + Math.sin(index * 2.5) * 15; // Vary radius a bit
    
    return {
      ...node,
      // Position nodes in a circular pattern with variation
      x: 50 + Math.cos(angle) * radius, // center x = 50%
      y: 50 + Math.sin(angle) * radius, // center y = 50%
      size: node.strength * 5 + 3, // Size based on strength
      phase: index * 0.8, // Consistent phase for animation variation
      pulseFrequency: 0.2 + (index % 5) * 0.08, // Varied pulse frequencies
      color: node.type === 'human' ? '#FFFFFF' : 
             node.type === 'ai' ? '#7B00FF' : '#4080FF'
    };
  }) || [];
  
  const connections: Connection[] = apiData?.connections?.map((conn, index) => ({
    ...conn,
    active: index % 3 === 0 // Make every third connection active for a more consistent visual pattern
  })) || [];
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      const parent = canvasRef.current?.parentElement;
      if (parent) {
        setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Update active node when highlightedNode prop changes
  useEffect(() => {
    setActiveNodeId(highlightedNode);
  }, [highlightedNode]);
  
  // Handle node click
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate positions as percentages
    const posX = (x / canvas.width) * 100;
    const posY = (y / canvas.height) * 100;
    
    // Find clicked node with some tolerance
    const tolerance = 10 * zoomLevel;
    const clickedNode = nodes.find(node => {
      const nodeX = (node.x / 100) * canvas.width;
      const nodeY = (node.y / 100) * canvas.height;
      const distance = Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2));
      return distance <= (node.size + tolerance);
    });
    
    if (clickedNode) {
      setActiveNodeId(clickedNode.id);
      onNodeSelect && onNodeSelect(clickedNode.id);
    } else {
      setActiveNodeId(null);
      onNodeSelect && onNodeSelect('');
    }
  }, [nodes, zoomLevel, onNodeSelect]);
  
  // Main rendering effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Calculate actual positions based on percentage
    const calculateActualPosition = (node: DataNode) => {
      return {
        x: (node.x / 100) * canvas.width,
        y: (node.y / 100) * canvas.height
      };
    };
    
    // Animation function
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Clear canvas with a pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get current time (affected by temporal dilation)
      const now = Date.now() / (1000 / temporalDilation);
      
      // Draw all connections first (so they appear behind nodes)
      connections.forEach(conn => {
        const sourceNode = nodes.find(n => n.id === conn.source);
        const targetNode = nodes.find(n => n.id === conn.target);
        
        if (!sourceNode || !targetNode) return;
        
        const sourcePos = calculateActualPosition(sourceNode);
        const targetPos = calculateActualPosition(targetNode);
        
        // Check if connection should be highlighted
        const isHighlighted = activeNodeId && 
          (conn.source === activeNodeId || conn.target === activeNodeId);
        
        // ALWAYS show connections but vary opacity for holographic effect
        const randomSeed = parseInt(conn.source) + parseInt(conn.target);
        const visibilityPulse = Math.sin(now * 0.001 + randomSeed) * 0.5 + 0.5;
        // Make most connections visible with varying opacity
        const shouldRender = true; // Show all connections
        
        // Create dynamic control points for curved connections
        const time = now * 0.0003;
        const driftX = Math.sin(time + randomSeed) * 10;
        const driftY = Math.cos(time * 1.3 + randomSeed) * 10;
        
        // Draw connection path
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        
        if (sourceNode.type !== targetNode.type) {
          // More dynamic curve for different node types
          const cp1x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.4 + driftX * 0.5;
          const cp1y = sourcePos.y + driftY * 0.3;
          const cp2x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.6 + driftX * 0.5;
          const cp2y = targetPos.y + driftY * 0.3;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetPos.x, targetPos.y);
        } else {
          // Simpler curve for same node types
          const midX = (sourcePos.x + targetPos.x) / 2 + driftX * 0.3;
          const midY = (sourcePos.y + targetPos.y) / 2 + driftY * 0.3;
          ctx.quadraticCurveTo(midX, midY, targetPos.x, targetPos.y);
        }
        
        // Style connections based on state and type
        if (isHighlighted) {
          // Highlighted connections: vibrant and glowing
          const gradient = ctx.createLinearGradient(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
          const pulseIntensity = 0.7 + Math.sin(now * 0.003) * 0.3;
          
          gradient.addColorStop(0, sourceNode.type === 'human' 
            ? `rgba(255, 255, 255, ${0.7 * pulseIntensity})` 
            : `rgba(143, 0, 255, ${0.8 * pulseIntensity})`);
          gradient.addColorStop(1, targetNode.type === 'human' 
            ? `rgba(255, 255, 255, ${0.7 * pulseIntensity})` 
            : `rgba(143, 0, 255, ${0.8 * pulseIntensity})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5 * conn.strength * (0.8 + Math.sin(now * 0.005) * 0.2);
          ctx.shadowColor = sourceNode.type === 'ai' 
            ? 'rgba(143, 0, 255, 0.6)' 
            : 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = 8 * pulseIntensity;
        } else if (conn.active) {
          // Active connections: moderate visibility with pulsing
          const activePulse = (0.5 + Math.sin(now * 0.002 + randomSeed) * 0.3);
          ctx.strokeStyle = sourceNode.type === 'ai'
            ? `rgba(143, 0, 255, ${0.2 * activePulse})`
            : `rgba(255, 255, 255, ${0.15 * activePulse})`;
          ctx.lineWidth = 0.8 * conn.strength * activePulse;
          ctx.shadowColor = sourceNode.type === 'ai' 
            ? 'rgba(143, 0, 255, 0.3)' 
            : 'rgba(255, 255, 255, 0.2)';
          ctx.shadowBlur = 3 * activePulse;
        } else {
          // Inactive connections: more visible holographic pulse effect
          const flickerOpacity = Math.max(0.08, Math.min(0.25, visibilityPulse * 0.25));
          
          // Use gradient for inactive connections for more visual interest
          if (sourceNode.type === 'ai' || targetNode.type === 'ai') {
            ctx.strokeStyle = `rgba(120, 80, 255, ${flickerOpacity})`;
            ctx.shadowColor = 'rgba(143, 0, 255, 0.15)';
          } else {
            ctx.strokeStyle = `rgba(255, 255, 255, ${flickerOpacity})`;
            ctx.shadowColor = 'rgba(180, 180, 255, 0.15)';
          }
          
          ctx.lineWidth = 0.5 * (0.5 + Math.sin(now * 0.001 + randomSeed) * 0.5); // Pulsing widths
          ctx.shadowBlur = 2; // Subtle glow for all connections
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow
        
        // Draw data flow particles on active connections
        if ((conn.active || isHighlighted) && showDataFlow) {
          // Apply temporal dilation to particle speed
          const temporalFactor = temporalDilation ? temporalDilation : 1;
          
          // Vary particle count based on connection strength
          const baseParticles = Math.floor(conn.strength * 5);
          const numParticles = isHighlighted ? baseParticles + 3 : baseParticles;
          
          for (let i = 0; i < numParticles; i++) {
            try {
              // Randomize particle speeds slightly
              const particleSpeed = (1000 + i * 50 + (randomSeed % 200)) / temporalFactor;
              
              // Calculate position along path
              const t = ((now / particleSpeed) % 1);
              
              // Get control points with subtle drift
              const particleTime = now * 0.0003;
              const particleDriftX = Math.sin(particleTime + randomSeed + i) * 5;
              const particleDriftY = Math.cos(particleTime * 1.3 + randomSeed + i) * 5;
              
              let particleX, particleY;
              
              if (sourceNode.type !== targetNode.type) {
                // For bezier curves
                const cp1x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.4 + particleDriftX * 0.3;
                const cp1y = sourcePos.y + particleDriftY * 0.3;
                const cp2x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.6 + particleDriftX * 0.3;
                const cp2y = targetPos.y + particleDriftY * 0.3;
                
                // Calculate point on bezier curve
                const mt = 1 - t;
                const mt2 = mt * mt;
                const mt3 = mt2 * mt;
                const t2 = t * t;
                const t3 = t2 * t;
                
                particleX = mt3 * sourcePos.x + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t3 * targetPos.x;
                particleY = mt3 * sourcePos.y + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * targetPos.y;
                
                // Add perpendicular oscillation for organic flow
                if (isFinite(particleX) && isFinite(particleY)) {
                  const tangentX = -3 * mt2 * sourcePos.x + 3 * (1 - 4*t + 3*t2) * cp1x + 3 * (2*t - 3*t2) * cp2x + 3 * t2 * targetPos.x;
                  const tangentY = -3 * mt2 * sourcePos.y + 3 * (1 - 4*t + 3*t2) * cp1y + 3 * (2*t - 3*t2) * cp2y + 3 * t2 * targetPos.y;
                  
                  if (isFinite(tangentX) && isFinite(tangentY) && (tangentX !== 0 || tangentY !== 0)) {
                    const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
                    if (tangentLength > 0) {
                      const normTangentX = tangentX / tangentLength;
                      const normTangentY = tangentY / tangentLength;
                      
                      const perpX = -normTangentY;
                      const perpY = normTangentX;
                      
                      const perpAmount = Math.sin(now * 0.005 + i * 0.5 + randomSeed) * 2;
                      particleX += perpX * perpAmount;
                      particleY += perpY * perpAmount;
                    }
                  }
                }
              } else {
                // For quadratic curves
                const midX = (sourcePos.x + targetPos.x) / 2 + particleDriftX * 0.3;
                const midY = (sourcePos.y + targetPos.y) / 2 + particleDriftY * 0.3;
                
                const mt = 1 - t;
                const mt2 = mt * mt;
                const t2 = t * t;
                
                particleX = mt2 * sourcePos.x + 2 * mt * t * midX + t2 * targetPos.x;
                particleY = mt2 * sourcePos.y + 2 * mt * t * midY + t2 * targetPos.y;
                
                // Add perpendicular oscillation
                if (isFinite(particleX) && isFinite(particleY)) {
                  const perpAmount = Math.sin(now * 0.005 + i * 0.5 + randomSeed) * 1.5;
                  const dx = targetPos.x - sourcePos.x;
                  const dy = targetPos.y - sourcePos.y;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  
                  if (len > 0) {
                    particleX += (-dy / len) * perpAmount;
                    particleY += (dx / len) * perpAmount;
                  }
                }
              }
              
              // Skip invalid positions
              if (!isFinite(particleX) || !isFinite(particleY)) {
                continue;
              }
              
              // Calculate particle size with pulse effect
              const sizePulse = 0.8 + Math.sin(now * 0.003 + i + t * Math.PI) * 0.2;
              const particleSize = (1 + conn.strength * 0.8) * sizePulse;
              const safeParticleSize = isFinite(particleSize) && particleSize > 0 ? particleSize : 1;
              
              // Add holographic glow effect
              ctx.shadowBlur = isHighlighted ? 8 : 4;
              
              // Time-based color pulsing
              let alphaPulse = 0.7;
              try {
                const sinVal = Math.sin(now * 0.004 + i + randomSeed);
                alphaPulse = isFinite(sinVal) ? 0.7 + sinVal * 0.3 : 0.7;
                alphaPulse = Math.max(0, Math.min(1, alphaPulse)); // Clamp
              } catch (e) {
                // Use default
              }
              
              // Determine particle color based on node types
              const sourceIsHuman = sourceNode.type === 'human';
              const targetIsHuman = targetNode.type === 'human';
              
              // Create gradient for particle
              let gradient;
              try {
                gradient = ctx.createRadialGradient(
                  particleX, particleY, 0,
                  particleX, particleY, Math.max(0.1, safeParticleSize * 2)
                );
              } catch (e) {
                gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1); // Fallback
              }
              
              if (sourceIsHuman && targetIsHuman) {
                // Human to human: white with slight blue
                ctx.shadowColor = `rgba(255, 255, 255, ${alphaPulse * 0.7})`;
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alphaPulse})`);
                gradient.addColorStop(0.4, `rgba(240, 240, 255, ${alphaPulse * 0.8})`);
                gradient.addColorStop(1, 'rgba(220, 220, 255, 0)');
              } else if (!sourceIsHuman && !targetIsHuman) {
                // AI to AI: ultraviolet with cosmic glow
                ctx.shadowColor = `rgba(143, 0, 255, ${alphaPulse * 0.7})`;
                gradient.addColorStop(0, `rgba(160, 80, 255, ${alphaPulse})`);
                gradient.addColorStop(0.4, `rgba(143, 0, 255, ${alphaPulse * 0.8})`);
                gradient.addColorStop(1, 'rgba(100, 0, 200, 0)');
              } else {
                // Mixed: blend with time-based color shift
                let mixColor = [140, 140, 255]; // Default
                try {
                  const sinVal = Math.sin(now * 0.002 + i);
                  if (isFinite(sinVal)) {
                    mixColor = sinVal > 0 ? [180, 120, 255] : [140, 140, 255];
                  }
                } catch (e) {
                  // Use default
                }
                
                ctx.shadowColor = `rgba(${mixColor[0]}, ${mixColor[1]}, ${mixColor[2]}, ${alphaPulse * 0.6})`;
                gradient.addColorStop(0, `rgba(${mixColor[0]}, ${mixColor[1]}, ${mixColor[2]}, ${alphaPulse})`);
                gradient.addColorStop(0.4, `rgba(${mixColor[0] * 0.8}, ${mixColor[1] * 0.8}, ${mixColor[2] * 0.8}, ${alphaPulse * 0.7})`);
                gradient.addColorStop(1, `rgba(${mixColor[0] * 0.6}, ${mixColor[1] * 0.6}, ${mixColor[2] * 0.6}, 0)`);
              }
              
              // Draw particle with holographic shimmer
              ctx.beginPath();
              ctx.fillStyle = gradient;
              
              // Occasionally use different shapes for visual interest
              if (Math.random() > 0.8 && isHighlighted) {
                // Diamond particles
                const size = Math.max(0.1, safeParticleSize * 0.8);
                ctx.moveTo(particleX, particleY - size); // Top
                ctx.lineTo(particleX + size, particleY); // Right
                ctx.lineTo(particleX, particleY + size); // Bottom
                ctx.lineTo(particleX - size, particleY); // Left
                ctx.closePath();
              } else {
                // Circular particles with slight randomness
                const finalRadius = Math.max(0.1, safeParticleSize * (0.9 + Math.random() * 0.2));
                ctx.arc(particleX, particleY, finalRadius, 0, Math.PI * 2);
              }
              
              ctx.fill();
              ctx.shadowBlur = 0; // Reset
            } catch (e) {
              // Skip this particle on error
              continue;
            }
          }
        }
      });
      
      // Draw all nodes on top of connections
      nodes.forEach(node => {
        const { x, y } = calculateActualPosition(node);
        
        // Check if node is active
        const isActive = node.id === activeNodeId;
        
        // Calculate node size with pulsing effect
        const pulseAmount = node.pulseFrequency ? Math.sin(now * node.pulseFrequency + (node.phase || 0)) * 1.5 : 0;
        const nodeSize = (node.size * zoomLevel) + (isActive ? 4 : 0) + (isActive ? 0 : pulseAmount);
        
        // Calculate time-based oscillation for visual effects
        const oscillation = Math.sin(now * 0.5 + (node.phase || 0)) * 0.5 + 0.5;
        
        // Apply glow effect based on node type
        if (node.type === 'ai') {
          // Ultraviolet glow for AI nodes
          ctx.shadowColor = `rgba(143, 0, 255, ${0.6 + oscillation * 0.4})`;
          ctx.shadowBlur = isActive ? 25 : 15;
        } else if (node.type === 'human') {
          // White glow for human nodes
          ctx.shadowColor = `rgba(255, 255, 255, ${0.3 + oscillation * 0.2})`;
          ctx.shadowBlur = isActive ? 20 : 10;
        } else {
          // Blue glow for data nodes
          ctx.shadowColor = `rgba(0, 150, 255, ${0.3 + oscillation * 0.2})`;
          ctx.shadowBlur = isActive ? 18 : 8;
        }
        
        // Vary node shape based on type
        if (node.type === 'ai' && !isActive) {
          // Diamond shape for AI nodes (when not active)
          const size = nodeSize * 0.8;
          ctx.beginPath();
          ctx.moveTo(x, y - size); // Top
          ctx.lineTo(x + size, y); // Right
          ctx.lineTo(x, y + size); // Bottom
          ctx.lineTo(x - size, y); // Left
          ctx.closePath();
        } else if (node.type === 'data' && !isActive) {
          // Hexagon shape for data nodes (when not active)
          ctx.beginPath();
          const hexSize = nodeSize * 0.75;
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = x + hexSize * Math.cos(angle);
            const hy = y + hexSize * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
        } else {
          // Circle for human nodes and all active nodes
          ctx.beginPath();
          ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        }
        
        // Create gradient for node
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize);
        
        if (isActive) {
          // More vibrant gradient for active nodes
          if (node.type === 'human') {
            // Luminous white-blue for human
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.4, 'rgba(220, 230, 255, 0.9)');
            gradient.addColorStop(0.7, 'rgba(180, 200, 255, 0.7)');
            gradient.addColorStop(1, 'rgba(150, 170, 255, 0)');
          } else if (node.type === 'ai') {
            // Deep ultraviolet for AI - #8F00FF
            gradient.addColorStop(0, 'rgba(180, 120, 255, 1)');
            gradient.addColorStop(0.3, 'rgba(143, 0, 255, 0.9)');
            gradient.addColorStop(0.7, 'rgba(100, 0, 200, 0.7)');
            gradient.addColorStop(1, 'rgba(80, 0, 170, 0)');
          } else {
            // Electric blue for data
            gradient.addColorStop(0, 'rgba(100, 200, 255, 1)');
            gradient.addColorStop(0.4, 'rgba(30, 150, 255, 0.8)');
            gradient.addColorStop(0.7, 'rgba(0, 100, 220, 0.6)');
            gradient.addColorStop(1, 'rgba(0, 70, 180, 0)');
          }
        } else {
          // Standard gradients with subtle pulsing
          if (node.type === 'human') {
            const pulseIntensity = 0.7 + (oscillation * 0.3);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${pulseIntensity})`);
            gradient.addColorStop(0.5, `rgba(220, 225, 255, ${pulseIntensity * 0.7})`);
            gradient.addColorStop(1, `rgba(200, 200, 255, ${pulseIntensity * 0.1})`);
          } else if (node.type === 'ai') {
            const pulseIntensity = 0.8 + (oscillation * 0.2);
            gradient.addColorStop(0, `rgba(143, 0, 255, ${pulseIntensity})`);
            gradient.addColorStop(0.6, `rgba(120, 0, 220, ${pulseIntensity * 0.6})`);
            gradient.addColorStop(1, `rgba(100, 0, 200, ${pulseIntensity * 0.1})`);
          } else {
            const pulseIntensity = 0.7 + (oscillation * 0.3);
            gradient.addColorStop(0, `rgba(80, 150, 255, ${pulseIntensity})`);
            gradient.addColorStop(0.6, `rgba(30, 100, 220, ${pulseIntensity * 0.7})`);
            gradient.addColorStop(1, `rgba(10, 70, 180, ${pulseIntensity * 0.3})`);
          }
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
        
        // Draw node label if enabled
        if (showLabels || isActive) {
          const fontSize = isActive ? 12 : 10;
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.7)';
          
          // Draw text with subtle glow
          ctx.shadowColor = '#000000';
          ctx.shadowBlur = 4;
          ctx.fillText(node.label, x, y + nodeSize + 12);
          ctx.shadowBlur = 0;
        }
        
        // Pulse effect ring for active nodes
        if (isActive) {
          // Draw multiple pulse rings
          for (let i = 0; i < 3; i++) {
            const pulseSize = nodeSize + 5 + i * 8 + Math.sin(now * 3 + i) * 3;
            const pulseOpacity = 0.7 - (i * 0.2) - (0.3 * Math.sin(now * 3 + i));
            
            ctx.beginPath();
            ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
            ctx.strokeStyle = node.type === 'ai' 
              ? `rgba(123, 0, 255, ${pulseOpacity})` 
              : `rgba(255, 255, 255, ${pulseOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
    };
    
    // Start animation
    animate();
    
    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [nodes, connections, dimensions, activeNodeId, 
      zoomLevel, showLabels, showDataFlow, temporalDilation]);
  
  // UI controls
  const toggleLabels = () => setShowLabels(prev => !prev);
  const toggleDataFlow = () => setShowDataFlow(prev => !prev);
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2.0));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onClick={handleCanvasClick}
      />
      
      {/* Control buttons */}
      <div className="absolute bottom-5 right-5 flex gap-2">
        <button 
          onClick={toggleLabels}
          className={`p-2 rounded-full ${showLabels ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/30 transition-colors`}
          title="Toggle Labels"
        >
          <span className="sr-only">Labels</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 20l4-16m2 16l4-16" />
          </svg>
        </button>
        
        <button 
          onClick={toggleDataFlow}
          className={`p-2 rounded-full ${showDataFlow ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/30 transition-colors`}
          title="Toggle Data Flow"
        >
          <span className="sr-only">Data Flow</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-9" />
            <path d="M18 2 22 6 18 10" />
            <path d="m9 15 3-3 3 3" />
            <path d="M13 12v6" />
          </svg>
        </button>
        
        <button 
          onClick={zoomIn}
          className="p-2 rounded-full bg-white/10 hover:bg-white/30 transition-colors"
          title="Zoom In"
        >
          <span className="sr-only">Zoom In</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
        
        <button 
          onClick={zoomOut}
          className="p-2 rounded-full bg-white/10 hover:bg-white/30 transition-colors"
          title="Zoom Out"
        >
          <span className="sr-only">Zoom Out</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>
      </div>
      
      {/* Legend */}
      {showLabels && (
        <div className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm rounded-md text-xs text-white">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>Human Intelligence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#7B00FF]" />
              <span>AI Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500/60" />
              <span>Data Exchange</span>
            </div>
          </div>
        </div>
      )}
      
      {/* PassiveWorks Logo */}
      <div className="absolute bottom-3 left-3 opacity-30 hover:opacity-80 transition-opacity">
        <div className="text-xs tracking-wider text-white/50 font-light uppercase">
          PassiveWorks
        </div>
      </div>
    </div>
  );
}