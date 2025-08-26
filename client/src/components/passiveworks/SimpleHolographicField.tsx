import React, { useEffect, useRef, useState } from 'react';
import { ConceptNode, ConceptConnection, useConceptualConnections } from '@/hooks/use-symbiosis-api';
import { DomainType } from '@/contexts/DomainContext';

interface SimpleHolographicFieldProps {
  domain: DomainType;
  className?: string;
  showLabels?: boolean;
  highlightedNode?: string | null;
  onNodeSelect?: (nodeId: string) => void;
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

export function SimpleHolographicField({ 
  domain, 
  className = '',
  showLabels = true,
  highlightedNode = null,
  onNodeSelect = () => {}
}: SimpleHolographicFieldProps) {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // State
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });

  // Fetch data
  const { mutateAsync: fetchConnections, isPending } = useConceptualConnections();
  const [nodes, setNodes] = useState<DataNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

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
        // Use fallback data
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
    
    setActiveNodeId(clickedNode);
  };

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

  // Animation effect
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Animation settings
    let startTime = Date.now();
    
    // Animation function
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add holographic effect - GRID
      drawHolographicBackground(ctx, canvas.width, canvas.height, elapsedTime);
      
      // Draw connections
      drawConnections(ctx, elapsedTime);
      
      // Draw nodes
      drawNodes(ctx, elapsedTime);
    };
    
    // Start animation
    animate();
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, nodes, connections, activeNodeId, showLabels]);

  // Draw the holographic background grid
  const drawHolographicBackground = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    time: number
  ) => {
    // First layer - faint radial glow
    const glow = ctx.createRadialGradient(
      width/2, height/2, 0, 
      width/2, height/2, Math.max(width, height) * 0.7
    );
    glow.addColorStop(0, 'rgba(123, 0, 255, 0.03)');
    glow.addColorStop(0.5, 'rgba(80, 0, 150, 0.015)');
    glow.addColorStop(1, 'rgba(40, 0, 80, 0)');
    
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    
    // Second layer - grid lines
    const spacing = 30;
    const fadeDistance = Math.max(width, height) * 0.7;
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.lineWidth = 0.3;
    
    // Horizontal grid lines
    for (let y = 0; y < height; y += spacing) {
      const distFromCenter = Math.abs(y - centerY);
      const opacity = Math.max(0, 0.12 - (distFromCenter / fadeDistance * 0.1));
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = `rgba(123, 0, 255, ${opacity})`;
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let x = 0; x < width; x += spacing) {
      const distFromCenter = Math.abs(x - centerX);
      const opacity = Math.max(0, 0.12 - (distFromCenter / fadeDistance * 0.1));
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.strokeStyle = `rgba(123, 0, 255, ${opacity})`;
      ctx.stroke();
    }
    
    // Add some occasional glitch lines for effect
    if (Math.random() > 0.97) {
      const x = Math.random() * width;
      const w = 1 + Math.random() * 3;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.strokeStyle = 'rgba(150, 100, 255, 0.15)';
      ctx.lineWidth = w;
      ctx.stroke();
      ctx.lineWidth = 0.3; // Reset line width
    }
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
      
      const pulseRate = isHighlighted ? 0.002 : 0.001;
      const pulseAmount = 0.5 + Math.sin(time * pulseRate) * 0.5;
      
      // Draw line with enhanced effect
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      
      // Use a lighter composite operation for more holographic look
      ctx.globalCompositeOperation = 'lighter';
      
      // Determine color based on node types
      let color;
      if (sourceNode.type === 'ai' || targetNode.type === 'ai') {
        color = isHighlighted 
          ? `rgba(123, 0, 255, ${0.6 * pulseAmount})` 
          : `rgba(123, 0, 255, ${0.3 * pulseAmount})`;
      } else {
        color = isHighlighted 
          ? `rgba(200, 220, 255, ${0.6 * pulseAmount})` 
          : `rgba(200, 220, 255, ${0.3 * pulseAmount})`;
      }
      
      // Enhanced connection rendering
      if (isHighlighted) {
        // Draw glow first for highlighted connections
        ctx.shadowColor = sourceNode.type === 'ai' 
          ? 'rgba(123, 0, 255, 0.5)' 
          : 'rgba(200, 220, 255, 0.5)';
        ctx.shadowBlur = 5;
      }
      
      // Draw the connection
      ctx.strokeStyle = color;
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.stroke();
      
      // Reset
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
    });
  };
  
  // Draw nodes
  const drawNodes = (ctx: CanvasRenderingContext2D, time: number) => {
    nodes.forEach(node => {
      const isActive = node.id === activeNodeId;
      
      // Add subtle pulsing effect
      const pulseFactor = 0.5 + Math.sin(time * 0.001 + parseInt(node.id) * 0.1) * 0.5;
      const nodeSize = node.size * (isActive ? 1.3 : 1);
      
      // Draw node glow
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize * 1.5, 0, Math.PI * 2);
      
      // Different colors for different node types
      if (node.type === 'ai') {
        ctx.fillStyle = `rgba(123, 0, 255, ${0.2 * pulseFactor})`;
      } else if (node.type === 'human') {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * pulseFactor})`;
      } else { // data node
        ctx.fillStyle = `rgba(0, 150, 255, ${0.2 * pulseFactor})`;
      }
      ctx.fill();
      
      // Draw solid node
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      
      // Define safe fixed colors that won't cause rgba() parsing errors
      if (node.type === 'ai') {
        ctx.fillStyle = isActive ? '#9955FF' : '#7B00FF';
      } else if (node.type === 'human') {
        ctx.fillStyle = isActive ? '#FFFFFF' : '#DDDDFF';
      } else { // data node
        ctx.fillStyle = isActive ? '#55AAFF' : '#4477FF';
      }
      
      // Apply glow effect for active nodes
      if (isActive) {
        ctx.shadowColor = node.type === 'ai' 
          ? 'rgba(123, 0, 255, 0.8)' 
          : node.type === 'human' 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(0, 150, 255, 0.8)';
        ctx.shadowBlur = 15;
      }
      
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw labels if enabled
      if (showLabels || isActive) {
        const fontSize = isActive ? 14 : 12;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)';
        
        // Add slight glow to text
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.fillText(node.label, node.x, node.y + nodeSize + 10);
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
      />
    </div>
  );
}