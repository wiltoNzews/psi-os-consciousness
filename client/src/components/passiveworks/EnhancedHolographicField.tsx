import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ConceptNode, ConceptConnection, useConceptualConnections } from '@/hooks/use-symbiosis-api';
import { DomainType } from '@/contexts/DomainContext';

interface EnhancedHolographicFieldProps {
  domain: DomainType;
  className?: string;
  showLabels?: boolean;
  highlightedNode?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  showDataFlow?: boolean;
  temporalDilation?: number;
}

interface DataNode {
  id: string;
  x: number;
  y: number;
  z: number; // Adding z-axis for depth
  vx: number; // Velocity vectors for subtle movement
  vy: number;
  vz: number;
  type: 'human' | 'ai' | 'data';
  label: string;
  size: number;
  pulse: number; // Individual pulse rate
  phase: number; // Phase offset for animation
}

interface Connection {
  source: string;
  target: string;
  strength: number;
  pathPoints?: { x: number, y: number, z: number }[];
  particles?: { 
    x: number; 
    y: number; 
    progress: number;
    speed: number;
  }[];
}

// Colors are defined as constants to avoid any string formatting issues
const COLORS = {
  BLACK: '#000000',
  PRIMARY: '#7B00FF',
  PRIMARY_LIGHT: '#9955FF',
  PRIMARY_DARK: '#6600CC',
  HUMAN_NODE: '#FFFFFF',
  HUMAN_NODE_ACTIVE: '#FFFFFF',
  AI_NODE: '#7B00FF',
  AI_NODE_ACTIVE: '#9F71FF',
  DATA_NODE: '#4477FF',
  DATA_NODE_ACTIVE: '#55AAFF',
  GRID: '#7B00FF',
  BACKGROUND_GLOW: '#7B00FF',
  TEXT: '#FFFFFF',
  TEXT_FADED: 'rgba(255, 255, 255, 0.7)'
};

/**
 * EnhancedHolographicField - A completely rewritten component that creates
 * an immersive, futuristic holographic visualization with advanced effects
 */
export function EnhancedHolographicField({ 
  domain, 
  className = '',
  showLabels = true,
  highlightedNode = null,
  onNodeSelect = () => {},
  showDataFlow = true,
  temporalDilation = 1
}: EnhancedHolographicFieldProps) {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // State
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [scanLine, setScanLine] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Data state
  const { mutateAsync: fetchConnections, isPending } = useConceptualConnections();
  const [nodes, setNodes] = useState<DataNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  // Precomputed values
  const centerX = useMemo(() => dimensions.width / 2, [dimensions.width]);
  const centerY = useMemo(() => dimensions.height / 2, [dimensions.height]);
  const maxRadius = useMemo(
    () => Math.min(dimensions.width, dimensions.height) * 0.45,
    [dimensions.width, dimensions.height]
  );
  
  // Effect: Update activeNodeId when highlightedNode changes
  useEffect(() => {
    if (highlightedNode) {
      setActiveNodeId(highlightedNode);
    }
  }, [highlightedNode]);
  
  // Effect: Call onNodeSelect when activeNodeId changes
  useEffect(() => {
    if (activeNodeId && onNodeSelect) {
      onNodeSelect(activeNodeId);
    }
  }, [activeNodeId, onNodeSelect]);

  // Effect: Update dimensions on resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    const container = canvasRef.current?.parentElement;
    if (container) {
      resizeObserver.observe(container);
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
      });
    }

    return () => {
      if (container) resizeObserver.unobserve(container);
    };
  }, []);

  // Effect: Fetch data based on domain
  useEffect(() => {
    const loadData = async () => {
      try {
        const concepts = ['intelligence', 'cognition', 'learning', 'analysis', 'decision'];
        const data = await fetchConnections({ domain, concepts });
        
        if (data.nodes && data.connections) {
          // Convert API data to our enhanced 3D format with physics attributes
          const totalNodes = data.nodes.length;
          const mappedNodes = data.nodes.map((node: ConceptNode, index: number) => {
            // Calculate position on a 3D sphere around center
            const theta = Math.PI * 2 * (index / totalNodes);
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = maxRadius * (0.6 + Math.random() * 0.4);
            
            // Convert to Cartesian coordinates
            const x = centerX + radius * Math.cos(theta) * Math.sin(phi);
            const y = centerY + radius * Math.sin(theta) * Math.sin(phi);
            const z = 50 + radius * Math.cos(phi) * 0.3; // Flattened on z-axis
            
            return {
              id: node.id,
              x,
              y,
              z,
              vx: (Math.random() - 0.5) * 0.05,
              vy: (Math.random() - 0.5) * 0.05,
              vz: (Math.random() - 0.5) * 0.025,
              type: node.type as 'human' | 'ai' | 'data',
              label: node.label,
              size: 4 + node.strength * 3,
              pulse: 0.5 + Math.random() * 0.5, // Random pulse frequency
              phase: Math.random() * Math.PI * 2, // Random phase offset
            };
          });
          
          const mappedConnections = data.connections.map((conn: ConceptConnection) => {
            // Prepare for particle flow along connections
            const particles = showDataFlow ? Array.from({ length: 2 + Math.floor(conn.strength * 3) }, () => ({
              progress: Math.random(),
              speed: 0.001 + Math.random() * 0.002,
              x: 0,
              y: 0
            })) : [];
            
            return {
              source: conn.source,
              target: conn.target,
              strength: conn.strength,
              particles
            };
          });
          
          setNodes(mappedNodes);
          setConnections(mappedConnections);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        createFallbackData();
      }
    };
    
    loadData();
  }, [fetchConnections, domain, dimensions.width, dimensions.height, maxRadius, centerX, centerY, showDataFlow]);

  // Create fallback data if API fails
  const createFallbackData = () => {
    const totalNodes = 10;
    const fallbackNodes: DataNode[] = Array.from({ length: totalNodes }, (_, index) => {
      // Calculate position on a 3D sphere around center
      const theta = Math.PI * 2 * (index / totalNodes);
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = maxRadius * (0.6 + Math.random() * 0.4);
      
      // Convert to Cartesian coordinates
      const x = centerX + radius * Math.cos(theta) * Math.sin(phi);
      const y = centerY + radius * Math.sin(theta) * Math.sin(phi);
      const z = 50 + radius * Math.cos(phi) * 0.3; // Flattened on z-axis
      
      const nodeType = index % 3 === 0 ? 'human' : index % 3 === 1 ? 'ai' : 'data';
      const labels = ['Intelligence', 'Cognition', 'Learning', 'Analysis', 'Decision', 
                    'Perception', 'Memory', 'Reasoning', 'Prediction', 'Adaptation'];
      
      return {
        id: String(index + 1),
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        vz: (Math.random() - 0.5) * 0.025,
        type: nodeType,
        label: labels[index % labels.length],
        size: 4 + Math.random() * 4,
        pulse: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      };
    });
    
    // Create connections between nodes
    const fallbackConnections: Connection[] = [];
    for (let i = 0; i < totalNodes; i++) {
      // Each node connects to 2-3 other nodes
      const connections = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < connections; j++) {
        // Connect to a random node that isn't itself
        let target;
        do {
          target = Math.floor(Math.random() * totalNodes) + 1;
        } while (target === i + 1);
        
        const strength = 0.5 + Math.random() * 0.5;
        
        // Prepare for particle flow along connections
        const particles = showDataFlow ? Array.from({ length: 2 + Math.floor(strength * 3) }, () => ({
          progress: Math.random(),
          speed: 0.001 + Math.random() * 0.002,
          x: 0,
          y: 0
        })) : [];
        
        fallbackConnections.push({
          source: String(i + 1),
          target: String(target),
          strength,
          particles
        });
      }
    }
    
    setNodes(fallbackNodes);
    setConnections(fallbackConnections);
  };

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    let clickedNode: string | null = null;
    let minDist = Infinity;
    
    // Find the closest node to the click point
    for (const node of nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      // Use distance squared for efficiency (avoid sqrt)
      const distSquared = dx * dx + dy * dy;
      // Scale interaction area by node size
      const interactionRadius = node.size * 1.5;
      
      if (distSquared <= interactionRadius * interactionRadius && distSquared < minDist) {
        clickedNode = node.id;
        minDist = distSquared;
      }
    }
    
    setActiveNodeId(clickedNode === activeNodeId ? null : clickedNode);
  };

  // Animation
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions (with device pixel ratio for crisp rendering)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    
    // Animation settings
    const startTime = Date.now();
    let lastTime = startTime;
    let scanDirection = 1;
    
    // Animation function
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      const elapsedTime = currentTime - startTime;
      
      // Update time-based values
      // Scan line effect
      setScanLine(prev => {
        const newPos = prev + scanDirection * 0.5 * (temporalDilation || 1);
        if (newPos > dimensions.height || newPos < 0) {
          scanDirection *= -1;
          return prev + scanDirection * 0.5 * (temporalDilation || 1);
        }
        return newPos;
      });
      
      // Very slow rotation of the entire system
      setRotation(prev => (prev + 0.0001 * deltaTime) % (Math.PI * 2));
      
      // Update physics
      updateNodePositions(deltaTime);
      
      // Clear canvas with full blackout
      ctx.fillStyle = COLORS.BLACK;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw the holographic environment
      drawHolographicEnvironment(ctx, elapsedTime);
      
      // Draw content layers
      drawConnections(ctx, elapsedTime);
      drawNodes(ctx, elapsedTime);
      
      // Add scan line effect
      drawScanLine(ctx);
      
      // Add occasional glitch effects
      if (Math.random() > 0.995) {
        drawGlitchEffect(ctx);
      }
      
      lastTime = currentTime;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, nodes, connections, activeNodeId, showLabels, temporalDilation]);

  // Update node positions based on physics
  const updateNodePositions = (deltaTime: number) => {
    // Skip if temporal dilation is 0 (paused)
    if (temporalDilation === 0) return;
    
    // Scale time to control animation speed
    const timeScale = 0.01 * (temporalDilation || 1);
    
    setNodes(prevNodes => {
      return prevNodes.map(node => {
        // Apply velocity
        let x = node.x + node.vx * deltaTime * timeScale;
        let y = node.y + node.vy * deltaTime * timeScale;
        let z = node.z + node.vz * deltaTime * timeScale;
        
        // Apply subtle forces toward original position (orbital stabilization)
        const dx = (node.x - centerX);
        const dy = (node.y - centerY);
        const distSquared = dx * dx + dy * dy;
        
        // If too far from center, apply attraction force
        if (distSquared > maxRadius * maxRadius) {
          const angle = Math.atan2(dy, dx);
          const attractionForce = 0.00001 * deltaTime * timeScale;
          x -= Math.cos(angle) * attractionForce * distSquared;
          y -= Math.sin(angle) * attractionForce * distSquared;
        }
        
        // Keep z within reasonable bounds
        if (z < 10) z = 10;
        if (z > 100) z = 100;
        
        // Apply small random force for subtle movement
        const randomForce = 0.0001 * deltaTime * timeScale;
        const vx = node.vx + (Math.random() - 0.5) * randomForce;
        const vy = node.vy + (Math.random() - 0.5) * randomForce;
        const vz = node.vz + (Math.random() - 0.5) * randomForce;
        
        // Dampen velocity slightly to prevent excessive movement
        const damping = 0.99;
        
        return {
          ...node,
          x,
          y,
          z,
          vx: vx * damping,
          vy: vy * damping,
          vz: vz * damping
        };
      });
    });
    
    // Update particles on connections
    if (showDataFlow) {
      setConnections(prevConnections => {
        return prevConnections.map(conn => {
          if (!conn.particles) return conn;
          
          // Update each particle's position along the connection
          const updatedParticles = conn.particles.map(p => ({
            ...p,
            progress: (p.progress + p.speed * deltaTime * timeScale) % 1
          }));
          
          return { ...conn, particles: updatedParticles };
        });
      });
    }
  };

  // Draw the holographic environment
  const drawHolographicEnvironment = (ctx: CanvasRenderingContext2D, time: number) => {
    // Draw radial gradient for ambient glow
    const glowRadius = Math.max(dimensions.width, dimensions.height) * 0.7;
    const glow = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, glowRadius
    );
    
    // Subtle pulsing intensity
    const pulseFactor = 0.5 + Math.sin(time * 0.0005) * 0.1;
    
    glow.addColorStop(0, `rgba(123, 0, 255, ${0.04 * pulseFactor})`);
    glow.addColorStop(0.4, `rgba(80, 0, 150, ${0.02 * pulseFactor})`);
    glow.addColorStop(1, 'rgba(40, 0, 80, 0)');
    
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Draw circular grid
    drawCircularGrid(ctx, time);
    
    // Draw cartesian grid
    drawCartesianGrid(ctx);
  };
  
  // Draw circular grid
  const drawCircularGrid = (ctx: CanvasRenderingContext2D, time: number) => {
    const numCircles = 12;
    const numRadials = 36;
    
    ctx.strokeStyle = `rgba(123, 0, 255, 0.15)`;
    ctx.lineWidth = 0.3;
    
    // Draw circular grid lines
    for (let i = 1; i <= numCircles; i++) {
      const radius = (i / numCircles) * maxRadius;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw radial grid lines
    for (let i = 0; i < numRadials; i++) {
      const angle = (i / numRadials) * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle + rotation) * maxRadius,
        centerY + Math.sin(angle + rotation) * maxRadius
      );
      ctx.stroke();
    }
    
    // Draw outer boundary circle with enhanced glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(123, 0, 255, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    
    // Add pulsing effect to outer boundary
    const pulseWidth = 3 + Math.sin(time * 0.001) * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(123, 0, 255, 0.1)';
    ctx.lineWidth = pulseWidth;
    ctx.stroke();
  };
  
  // Draw cartesian grid
  const drawCartesianGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSpacing = 30;
    
    // Reduce opacity for grid lines
    ctx.strokeStyle = 'rgba(123, 0, 255, 0.05)';
    ctx.lineWidth = 0.2;
    
    // Draw horizontal grid lines
    for (let y = 0; y < dimensions.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(dimensions.width, y);
      ctx.stroke();
    }
    
    // Draw vertical grid lines
    for (let x = 0; x < dimensions.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, dimensions.height);
      ctx.stroke();
    }
  };
  
  // Draw scan line effect
  const drawScanLine = (ctx: CanvasRenderingContext2D) => {
    // Create gradient for scan line
    const scanGradient = ctx.createLinearGradient(0, scanLine - 5, 0, scanLine + 5);
    scanGradient.addColorStop(0, 'rgba(123, 0, 255, 0)');
    scanGradient.addColorStop(0.5, 'rgba(123, 0, 255, 0.15)');
    scanGradient.addColorStop(1, 'rgba(123, 0, 255, 0)');
    
    ctx.fillStyle = scanGradient;
    ctx.fillRect(0, scanLine - 5, dimensions.width, 10);
    
    // Add a bright thin line at the center of the scan line
    ctx.strokeStyle = 'rgba(160, 120, 255, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, scanLine);
    ctx.lineTo(dimensions.width, scanLine);
    ctx.stroke();
  };
  
  // Draw glitch effect
  const drawGlitchEffect = (ctx: CanvasRenderingContext2D) => {
    // Random horizontal glitch lines
    const numGlitches = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numGlitches; i++) {
      const y = Math.random() * dimensions.height;
      const width = 50 + Math.random() * 100;
      const x = Math.random() * (dimensions.width - width);
      const height = 1 + Math.random() * 2;
      
      ctx.fillStyle = `rgba(160, 120, 255, ${0.1 + Math.random() * 0.2})`;
      ctx.fillRect(x, y, width, height);
    }
    
    // Random vertical glitch lines
    const numVGlitches = 1 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < numVGlitches; i++) {
      const x = Math.random() * dimensions.width;
      const width = 1 + Math.random() * 2;
      const height = 50 + Math.random() * 100;
      const y = Math.random() * (dimensions.height - height);
      
      ctx.fillStyle = `rgba(160, 120, 255, ${0.1 + Math.random() * 0.2})`;
      ctx.fillRect(x, y, width, height);
    }
  };
  
  // Draw connections
  const drawConnections = (ctx: CanvasRenderingContext2D, time: number) => {
    // First draw non-highlighted connections
    connections.forEach(conn => {
      const sourceNode = nodes.find(n => n.id === conn.source);
      const targetNode = nodes.find(n => n.id === conn.target);
      
      if (!sourceNode || !targetNode) return;
      
      const isHighlighted = activeNodeId && 
        (conn.source === activeNodeId || conn.target === activeNodeId);
      
      // Draw non-highlighted connections first as a background layer
      if (!isHighlighted) {
        drawConnection(ctx, sourceNode, targetNode, conn, time, false);
      }
    });
    
    // Then draw highlighted connections on top
    connections.forEach(conn => {
      const sourceNode = nodes.find(n => n.id === conn.source);
      const targetNode = nodes.find(n => n.id === conn.target);
      
      if (!sourceNode || !targetNode) return;
      
      const isHighlighted = activeNodeId && 
        (conn.source === activeNodeId || conn.target === activeNodeId);
      
      // Draw highlighted connections on top
      if (isHighlighted) {
        drawConnection(ctx, sourceNode, targetNode, conn, time, true);
      }
    });
  };
  
  // Draw a single connection
  const drawConnection = (
    ctx: CanvasRenderingContext2D,
    sourceNode: DataNode,
    targetNode: DataNode,
    conn: Connection,
    time: number,
    isHighlighted: boolean
  ) => {
    // Use lighter composite operation for more holographic look
    ctx.globalCompositeOperation = 'lighter';
    
    // Calculate z-based scaling factor for depth effect
    const sourceScale = 1 - (sourceNode.z - 10) / 90;
    const targetScale = 1 - (targetNode.z - 10) / 90;
    
    // Scale coordinates for depth
    const sx = centerX + (sourceNode.x - centerX) * sourceScale;
    const sy = centerY + (sourceNode.y - centerY) * sourceScale;
    const tx = centerX + (targetNode.x - centerX) * targetScale;
    const ty = centerY + (targetNode.y - centerY) * targetScale;
    
    // Calculate pulse effect
    const pulseRate = isHighlighted ? 0.002 : 0.001;
    const pulseAmount = 0.3 + Math.sin(time * pulseRate) * 0.15;
    
    // Determine color based on node types
    const nodeType = sourceNode.type === 'ai' || targetNode.type === 'ai' ? 'ai' : 'human';
    
    // Base color
    let baseOpacity = isHighlighted ? 0.5 : 0.2;
    baseOpacity *= pulseAmount;
    
    // Draw main connection line
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    
    // Apply glow for highlighted connections
    if (isHighlighted) {
      ctx.shadowColor = nodeType === 'ai' 
        ? 'rgba(123, 0, 255, 0.5)' 
        : 'rgba(200, 220, 255, 0.5)';
      ctx.shadowBlur = 5;
    }
    
    // Set line style based on node type and highlight status
    ctx.strokeStyle = nodeType === 'ai'
      ? `rgba(123, 0, 255, ${baseOpacity + 0.1})`
      : `rgba(200, 220, 255, ${baseOpacity})`;
    
    ctx.lineWidth = isHighlighted ? 1.5 * conn.strength : 0.8 * conn.strength;
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Draw data flow particles if feature is enabled
    if (showDataFlow && conn.particles) {
      conn.particles.forEach(particle => {
        // Calculate position along the line
        const x = sx + (tx - sx) * particle.progress;
        const y = sy + (ty - sy) * particle.progress;
        
        // Fade in/out near the endpoints
        let particleOpacity = baseOpacity * 1.5;
        if (particle.progress < 0.1) {
          particleOpacity *= particle.progress / 0.1;
        } else if (particle.progress > 0.9) {
          particleOpacity *= (1 - particle.progress) / 0.1;
        }
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(x, y, isHighlighted ? 1.5 : 1, 0, Math.PI * 2);
        ctx.fillStyle = nodeType === 'ai'
          ? `rgba(150, 100, 255, ${particleOpacity + 0.1})`
          : `rgba(220, 230, 255, ${particleOpacity})`;
          
        ctx.fill();
        
        // Update particle's rendered position (for reference)
        particle.x = x;
        particle.y = y;
      });
    }
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  };
  
  // Draw nodes
  const drawNodes = (ctx: CanvasRenderingContext2D, time: number) => {
    // Sort nodes by z-value to draw back-to-front
    const sortedNodes = [...nodes].sort((a, b) => b.z - a.z);
    
    // Draw nodes
    sortedNodes.forEach(node => {
      const isActive = node.id === activeNodeId;
      
      // Calculate z-based scaling factor for depth
      const depthScale = 1 - (node.z - 10) / 90;
      
      // Scale coordinates and size based on depth
      const x = centerX + (node.x - centerX) * depthScale;
      const y = centerY + (node.y - centerY) * depthScale;
      const size = node.size * depthScale;
      
      // Calculate individual node pulse effect
      const pulseFactor = 0.7 + 0.3 * Math.sin(time * 0.001 * node.pulse + node.phase);
      const nodeSize = size * (isActive ? 1.3 : 1) * pulseFactor;
      
      // Adjust opacity based on depth
      const opacityFactor = 0.7 + 0.3 * depthScale;
      
      // Draw node glow
      ctx.globalCompositeOperation = 'lighter';
      
      // Draw outer glow
      const glowSize = nodeSize * 2.5;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
      
      // Different colors for different node types
      if (node.type === 'ai') {
        gradient.addColorStop(0, `rgba(123, 0, 255, ${0.3 * pulseFactor * opacityFactor})`);
        gradient.addColorStop(0.5, `rgba(100, 0, 200, ${0.15 * pulseFactor * opacityFactor})`);
        gradient.addColorStop(1, 'rgba(80, 0, 170, 0)');
      } else if (node.type === 'human') {
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.25 * pulseFactor * opacityFactor})`);
        gradient.addColorStop(0.5, `rgba(220, 225, 255, ${0.12 * pulseFactor * opacityFactor})`);
        gradient.addColorStop(1, 'rgba(200, 210, 255, 0)');
      } else { // data node
        gradient.addColorStop(0, `rgba(0, 150, 255, ${0.25 * pulseFactor * opacityFactor})`);
        gradient.addColorStop(0.5, `rgba(0, 100, 200, ${0.12 * pulseFactor * opacityFactor})`);
        gradient.addColorStop(1, 'rgba(0, 80, 180, 0)');
      }
      
      ctx.beginPath();
      ctx.arc(x, y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw core node
      ctx.beginPath();
      ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
      
      // Set core node color
      if (node.type === 'ai') {
        ctx.fillStyle = isActive ? COLORS.AI_NODE_ACTIVE : COLORS.AI_NODE;
      } else if (node.type === 'human') {
        ctx.fillStyle = isActive ? COLORS.HUMAN_NODE_ACTIVE : COLORS.HUMAN_NODE;
      } else { // data node
        ctx.fillStyle = isActive ? COLORS.DATA_NODE_ACTIVE : COLORS.DATA_NODE;
      }
      
      // Apply additional glow effect for active nodes
      if (isActive) {
        ctx.shadowColor = node.type === 'ai' 
          ? 'rgba(123, 0, 255, 0.8)' 
          : node.type === 'human' 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(0, 150, 255, 0.8)';
        ctx.shadowBlur = 15;
      }
      
      ctx.fill();
      
      // Reset effects
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw labels if enabled or node is active
      if ((showLabels || isActive) && depthScale > 0.7) { // Only show labels for more visible nodes
        const labelOpacity = depthScale * (isActive ? 1 : 0.7);
        const fontSize = Math.max(10, Math.min(14, isActive ? 14 : 12) * depthScale);
        
        ctx.font = `${fontSize}px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(255, 255, 255, ${labelOpacity})`;
        
        // Add glow effect to text
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 4;
        
        // Position the label slightly below the node
        ctx.fillText(node.label, x, y + nodeSize + 10);
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }
    });
  };

  return (
    <div className={`h-full w-full relative overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef}
        className="h-full w-full bg-black"
        onClick={handleCanvasClick}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}