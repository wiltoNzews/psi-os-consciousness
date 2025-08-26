import React, { useEffect, useRef, useState } from 'react';
import { ConceptNode, ConceptConnection, useConceptualConnections } from '@/hooks/use-symbiosis-api';
import { DomainType } from '@/contexts/DomainContext';

interface BasicNeuralFieldProps {
  domain: DomainType;
  className?: string;
  showLabels?: boolean;
  highlightedNode?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  showNodeDetails?: boolean;
  temporalDilation?: number;
  showDataFlow?: boolean;
}

interface DataNode {
  id: string;
  x: number;
  y: number;
  type: 'human' | 'ai' | 'data';
  label: string;
  size: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

// Fixed colors as hex strings to avoid any RGBA parsing issues
const COLORS = {
  BACKGROUND: '#000000',
  GRID_LINE: '#3F0082',
  GRID_LINE_BRIGHT: '#7B00FF',
  AI_NODE: '#7B00FF',
  AI_NODE_ACTIVE: '#9F71FF',
  HUMAN_NODE: '#FFFFFF',
  HUMAN_NODE_ACTIVE: '#FFFFFF',
  DATA_NODE: '#4477FF',
  DATA_NODE_ACTIVE: '#55AAFF',
  AI_CONNECTION: '#6600CC',
  AI_CONNECTION_HIGHLIGHT: '#7B00FF',
  HUMAN_CONNECTION: '#AAAAFF',
  HUMAN_CONNECTION_HIGHLIGHT: '#DDDDFF',
  TEXT: '#FFFFFF',
  GLOW: '#7B00FF',
  SCAN_LINE: '#7B00FF',
};

/**
 * BasicNeuralField - A simplified, error-free neural field visualization
 * Uses only fixed colors and avoids all complex gradient operations
 */
export function BasicNeuralField({ 
  domain,
  className = '',
  showLabels = true,
  highlightedNode = null,
  onNodeSelect = () => {},
  showNodeDetails = false,
  temporalDilation = 1,
  showDataFlow = true
}: BasicNeuralFieldProps) {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // State
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [scanLine, setScanLine] = useState(0);
  
  // Data state
  const { mutateAsync: fetchConnections } = useConceptualConnections();
  const [nodes, setNodes] = useState<DataNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

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
          // Convert API data to our format
          const mappedNodes = data.nodes.map((node: ConceptNode) => ({
            id: node.id,
            x: Math.random() * dimensions.width * 0.8 + dimensions.width * 0.1,
            y: Math.random() * dimensions.height * 0.8 + dimensions.height * 0.1,
            type: node.type as 'human' | 'ai' | 'data',
            label: node.label,
            size: 4 + node.strength * 3,
          }));
          
          const mappedConnections = data.connections.map((conn: ConceptConnection) => ({
            source: conn.source,
            target: conn.target,
            strength: conn.strength,
          }));
          
          setNodes(mappedNodes);
          setConnections(mappedConnections);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        createFallbackData();
      }
    };
    
    loadData();
  }, [fetchConnections, domain, dimensions.width, dimensions.height]);

  // Create fallback data if API fails
  const createFallbackData = () => {
    const fallbackNodes: DataNode[] = [
      { id: '1', x: dimensions.width * 0.3, y: dimensions.height * 0.3, type: 'human', label: 'Intelligence', size: 8 },
      { id: '2', x: dimensions.width * 0.7, y: dimensions.height * 0.3, type: 'ai', label: 'Learning', size: 7 },
      { id: '3', x: dimensions.width * 0.5, y: dimensions.height * 0.7, type: 'data', label: 'Analysis', size: 6 },
      { id: '4', x: dimensions.width * 0.3, y: dimensions.height * 0.7, type: 'human', label: 'Cognition', size: 7 },
      { id: '5', x: dimensions.width * 0.7, y: dimensions.height * 0.7, type: 'ai', label: 'Decision', size: 6 },
    ];
    
    const fallbackConnections: Connection[] = [
      { source: '1', target: '2', strength: 0.8 },
      { source: '1', target: '3', strength: 0.7 },
      { source: '2', target: '3', strength: 0.9 },
      { source: '3', target: '4', strength: 0.6 },
      { source: '4', target: '5', strength: 0.8 },
      { source: '5', target: '1', strength: 0.7 },
      { source: '2', target: '5', strength: 0.8 },
    ];
    
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
    
    for (const node of nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= node.size + 5) {
        clickedNode = node.id;
        break;
      }
    }
    
    setActiveNodeId(clickedNode === activeNodeId ? null : clickedNode);
  };

  // Main animation loop
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
    
    let startTime = Date.now();
    let scanDirection = 1;
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      
      // Apply temporal dilation to animation speed
      const dilatedTime = elapsedTime * (temporalDilation || 1);
      
      // Update scan line position (affected by temporal dilation)
      setScanLine(prev => {
        const newPos = prev + scanDirection * (temporalDilation || 1);
        if (newPos > dimensions.height || newPos < 0) {
          scanDirection *= -1;
          return prev + scanDirection * (temporalDilation || 1);
        }
        return newPos;
      });
      
      // Clear canvas
      ctx.fillStyle = COLORS.BACKGROUND;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw grid
      drawGrid(ctx);
      
      // Draw scan line effect
      drawScanLine(ctx, scanLine);
      
      // Draw connections
      drawConnections(ctx, dilatedTime);
      
      // Draw nodes
      drawNodes(ctx, dilatedTime);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, nodes, connections, activeNodeId, showLabels, scanLine, temporalDilation, showDataFlow]);

  // Draw grid
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSpacing = 30;
    
    // Draw horizontal grid lines
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = COLORS.GRID_LINE;
    
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
    
    // Draw circular grid lines
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.45;
    const numCircles = 6;
    
    for (let i = 1; i <= numCircles; i++) {
      const radius = (i / numCircles) * maxRadius;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = i === numCircles ? COLORS.GRID_LINE_BRIGHT : COLORS.GRID_LINE;
      ctx.lineWidth = i === numCircles ? 1 : 0.5;
      ctx.stroke();
    }
  };
  
  // Draw scan line effect
  const drawScanLine = (ctx: CanvasRenderingContext2D, y: number) => {
    ctx.strokeStyle = COLORS.SCAN_LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(dimensions.width, y);
    ctx.stroke();
  };
  
  // Draw connections between nodes
  const drawConnections = (ctx: CanvasRenderingContext2D, time: number) => {
    connections.forEach(conn => {
      const sourceNode = nodes.find(n => n.id === conn.source);
      const targetNode = nodes.find(n => n.id === conn.target);
      
      if (!sourceNode || !targetNode) return;
      
      // Check if connection involves the active node
      const isHighlighted = activeNodeId && 
        (conn.source === activeNodeId || conn.target === activeNodeId);
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      
      // Determine color based on node types
      if (sourceNode.type === 'ai' || targetNode.type === 'ai') {
        ctx.strokeStyle = isHighlighted ? COLORS.AI_CONNECTION_HIGHLIGHT : COLORS.AI_CONNECTION;
      } else {
        ctx.strokeStyle = isHighlighted ? COLORS.HUMAN_CONNECTION_HIGHLIGHT : COLORS.HUMAN_CONNECTION;
      }
      
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();
      
      // Draw data flow particles if feature is enabled
      if (showDataFlow && (isHighlighted || Math.random() > 0.7)) {
        const numParticles = 3 + Math.floor(conn.strength * 5);
        
        for (let i = 0; i < numParticles; i++) {
          // Calculate position along the path - affected by temporal dilation
          const t = ((time / (1000 / (temporalDilation || 1)) + i * 0.1) % 1);
          
          const x = sourceNode.x + (targetNode.x - sourceNode.x) * t;
          const y = sourceNode.y + (targetNode.y - sourceNode.y) * t;
          
          // Draw particles
          ctx.beginPath();
          ctx.arc(x, y, isHighlighted ? 1.5 : 1, 0, Math.PI * 2);
          
          if (sourceNode.type === 'ai' || targetNode.type === 'ai') {
            ctx.fillStyle = COLORS.AI_NODE;
          } else {
            ctx.fillStyle = COLORS.HUMAN_NODE;
          }
          
          ctx.fill();
        }
      }
    });
  };
  
  // Draw nodes
  const drawNodes = (ctx: CanvasRenderingContext2D, time: number) => {
    nodes.forEach(node => {
      const isActive = node.id === activeNodeId;
      const nodeSize = node.size * (isActive ? 1.3 : 1);
      
      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      
      // Set color based on node type
      if (node.type === 'ai') {
        ctx.fillStyle = isActive ? COLORS.AI_NODE_ACTIVE : COLORS.AI_NODE;
      } else if (node.type === 'human') {
        ctx.fillStyle = isActive ? COLORS.HUMAN_NODE_ACTIVE : COLORS.HUMAN_NODE;
      } else { // data node
        ctx.fillStyle = isActive ? COLORS.DATA_NODE_ACTIVE : COLORS.DATA_NODE;
      }
      
      ctx.fill();
      
      // Draw outer glow for active nodes
      if (isActive) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize + 5, 0, Math.PI * 2);
        
        if (node.type === 'ai') {
          ctx.strokeStyle = COLORS.AI_NODE;
        } else if (node.type === 'human') {
          ctx.strokeStyle = COLORS.HUMAN_NODE;
        } else {
          ctx.strokeStyle = COLORS.DATA_NODE;
        }
        
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw labels if enabled or node is active
      if (showLabels || isActive) {
        const fontSize = isActive ? 14 : 12;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = COLORS.TEXT;
        ctx.fillText(node.label, node.x, node.y + nodeSize + 10);
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