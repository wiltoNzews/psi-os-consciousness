import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDomain } from '@/contexts/DomainContext';
import { useConceptualConnections, ConceptNode, ConceptConnection } from '@/hooks/use-symbiosis-api';
import { Brain, Cpu, Database, Maximize2, Minimize2, X } from 'lucide-react';
import { ImmersiveControls } from '@/components/passiveworks/ImmersiveControls';

// Define interface for node object
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

// Define interface for connection object
interface Connection {
  source: string;
  target: string;
  strength: number;
  active: boolean;
  pathPoints?: { x: number, y: number }[];
}

// Define interface for node details
interface NodeDetail {
  description: string;
  relatedConcepts: string[];
  importance: number; // 0-100 scale
  confidence: number; // 0-100 scale
}

interface NeuralFieldProps {
  domain: 'finance' | 'crypto' | 'sports' | 'general';
  highlightedNode?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  className?: string;
  showNodeDetails?: boolean;
  temporalDilation?: number;
}

/**
 * NeuralField - A fluid visualization environment that represents the cognitive field
 * where human consciousness and computational intelligence converge and extend each other
 */
export function NeuralField({ 
  domain,
  highlightedNode = null,
  onNodeSelect,
  className,
  showNodeDetails = true,
  temporalDilation = 1
}: NeuralFieldProps) {
  const { domainConfig } = useDomain();
  const [nodes, setNodes] = useState<DataNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeNodeDetails, setActiveNodeDetails] = useState<NodeDetail | null>(null);
  const [isDetailsPanelExpanded, setIsDetailsPanelExpanded] = useState(false);
  const [isDetailsPanelVisible, setIsDetailsPanelVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showDataFlow, setShowDataFlow] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  // Now using the temporalDilation from props
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [showInterface, setShowInterface] = useState(true); // Controls visibility of UI elements
  
  // Get conceptual connections from API
  const conceptConnections = useConceptualConnections();
  
  // Generate an immediate fallback visualization and then fetch data from API
  useEffect(() => {
    // Create immediate fallback visualization
    const createFallbackVisualization = () => {
      const initialNodes: DataNode[] = [];
      const initialConnections: Connection[] = [];
    
      // Concepts based on domain
      const concepts = domain === 'finance' 
        ? ['Market Analysis', 'Risk Assessment', 'Portfolio Optimization', 'Trend Prediction', 'Economic Indicators']
        : domain === 'crypto'
        ? ['Blockchain Analytics', 'Market Sentiment', 'Token Economics', 'DeFi Strategies', 'Protocol Analysis']
        : domain === 'sports'
        ? ['Player Statistics', 'Performance Analysis', 'Injury Prediction', 'Game Strategy', 'Team Dynamics']
        : ['Natural Language', 'Visual Processing', 'Decision Making', 'Pattern Recognition', 'Knowledge Mapping'];
      
      // Create human nodes (left side)
      ['Intuition', 'Experience', 'Judgment', 'Creativity', 'Ethics'].forEach((label, i) => {
        initialNodes.push({
          id: `human-${i}`,
          x: 10 + Math.random() * 10,
          y: 10 + (i * 15),
          type: 'human',
          label,
          size: 3 + Math.random() * 3,
          color: 'rgba(255, 255, 255, 0.8)',
          pulseFrequency: 0.5 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2
        });
      });
      
      // Create AI nodes (right side)
      ['Analysis', 'Computation', 'Pattern Recognition', 'Learning', 'Prediction'].forEach((label, i) => {
        initialNodes.push({
          id: `ai-${i}`,
          x: 80 - Math.random() * 10,
          y: 10 + (i * 15),
          type: 'ai',
          label,
          size: 3 + Math.random() * 3,
          color: '#7B00FF', // Deep purple for AI
          pulseFrequency: 0.5 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2
        });
      });
      
      // Create data nodes (center) using domain concepts
      concepts.forEach((label, i) => {
        initialNodes.push({
          id: `data-${i}`,
          x: 30 + Math.random() * 40,
          y: 20 + (i * 12),
          type: 'data',
          label,
          size: 3 + Math.random() * 3,
          color: 'rgba(59, 130, 246, 0.6)',
          pulseFrequency: 0.5 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2
        });
      });
      
      // Create some connections between nodes
      for (let i = 0; i < 30; i++) {
        // Select random source and target nodes
        const sourceIndex = Math.floor(Math.random() * initialNodes.length);
        let targetIndex;
        do {
          targetIndex = Math.floor(Math.random() * initialNodes.length);
        } while (targetIndex === sourceIndex);
        
        initialConnections.push({
          source: initialNodes[sourceIndex].id,
          target: initialNodes[targetIndex].id,
          strength: 0.2 + Math.random() * 0.8,
          active: Math.random() > 0.3
        });
      }
      
      return { nodes: initialNodes, connections: initialConnections };
    };
    
    // Set immediate fallback visualization
    const fallback = createFallbackVisualization();
    setNodes(fallback.nodes);
    setConnections(fallback.connections);
    
    // Then fetch from API
    const concepts = domain === 'finance' 
      ? ['Market Analysis', 'Risk Assessment', 'Portfolio Optimization', 'Trend Prediction', 'Economic Indicators']
      : domain === 'crypto'
      ? ['Blockchain Analytics', 'Market Sentiment', 'Token Economics', 'DeFi Strategies', 'Protocol Analysis']
      : domain === 'sports'
      ? ['Player Statistics', 'Performance Analysis', 'Injury Prediction', 'Game Strategy', 'Team Dynamics']
      : ['Natural Language', 'Visual Processing', 'Decision Making', 'Pattern Recognition', 'Knowledge Mapping'];
    
    conceptConnections.mutate({ domain, concepts });
  }, [domain]);
  
  // Initialize the neural network with nodes and connections from API
  useEffect(() => {
    if (!conceptConnections.data) return;
    
    const apiData = conceptConnections.data;
    const visualNodes: DataNode[] = [];
    const visualConnections: Connection[] = [];
    
    // Process API nodes and create visualization nodes with proper positioning
    if (apiData.nodes && Array.isArray(apiData.nodes)) {
      apiData.nodes.forEach((apiNode: ConceptNode) => {
        let xPosition = 0, yPosition = 0;
        
        // Calculate positions based on node type
        if (apiNode.type === 'human') {
          // Human nodes on the left
          const humanNodes = apiData.nodes.filter((n: ConceptNode) => n.type === 'human');
          const index = humanNodes.findIndex((n: ConceptNode) => n.id === apiNode.id);
          const total = humanNodes.length;
          yPosition = 10 + (80 * index / Math.max(1, total - 1));
          xPosition = 10 + Math.random() * 10; // Left side with slight randomization
        } else if (apiNode.type === 'ai') {
          // AI nodes on the right
          const aiNodes = apiData.nodes.filter((n: ConceptNode) => n.type === 'ai');
          const index = aiNodes.findIndex((n: ConceptNode) => n.id === apiNode.id);
          const total = aiNodes.length;
          yPosition = 10 + (80 * index / Math.max(1, total - 1));
          xPosition = 70 + Math.random() * 10; // Right side with slight randomization
        } else {
          // Data nodes in the middle
          xPosition = 30 + Math.random() * 40; // Middle area with randomization
          yPosition = 10 + Math.random() * 80; // Random vertical position
        }
        
        // Set node color based on type
        let nodeColor;
        if (apiNode.type === 'human') {
          nodeColor = 'rgba(255, 255, 255, 0.8)';
        } else if (apiNode.type === 'ai') {
          // Use ultraviolet spectrum for AI nodes
          nodeColor = '#7B00FF'; // Deep violet
        } else {
          nodeColor = 'rgba(59, 130, 246, 0.6)';
        }
        
        visualNodes.push({
          id: apiNode.id,
          x: xPosition,
          y: yPosition,
          type: apiNode.type,
          label: apiNode.label,
          size: 3 + (apiNode.strength || 0.5) * 7, // Scale size based on strength
          color: nodeColor,
          pulseFrequency: 0.5 + Math.random() * 2, // Random pulse frequency
          phase: Math.random() * Math.PI * 2 // Random starting phase
        });
      });
    }
    
    // Process API connections
    if (apiData.connections && Array.isArray(apiData.connections)) {
      apiData.connections.forEach((apiConn: ConceptConnection) => {
        visualConnections.push({
          source: apiConn.source,
          target: apiConn.target,
          strength: apiConn.strength || 0.5,
          active: Math.random() > 0.3 // Randomly activate some connections
        });
      });
    }
    
    setNodes(visualNodes);
    setConnections(visualConnections);
    
    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [conceptConnections.data]);
  
  // Update on highlighted node change
  useEffect(() => {
    if (highlightedNode) {
      setActiveNodeId(highlightedNode);
      
      // Highlight connections
      const updatedConnections = connections.map(conn => ({
        ...conn,
        active: conn.source === highlightedNode || conn.target === highlightedNode
      }));
      
      setConnections(updatedConnections);
    } else {
      setActiveNodeId(null);
      
      // Random activation of connections
      const randomizeActivity = () => {
        setConnections(prev => 
          prev.map(conn => ({
            ...conn,
            active: Math.random() > 0.7
          }))
        );
      };
      
      const interval = setInterval(randomizeActivity, 2000);
      return () => clearInterval(interval);
    }
  }, [highlightedNode, connections]);
  
  // Function to generate node description based on node type and domain
  const getNodeDescription = (node: DataNode): string => {
    const domainSpecificDescriptions: Record<string, Record<string, string[]>> = {
      finance: {
        human: [
          "Applies intuition and experience to recognize market patterns beyond pure data.",
          "Evaluates risk factors with emotional intelligence and adaptability.",
          "Balances quantitative analysis with qualitative judgment in uncertain conditions."
        ],
        ai: [
          "Processes vast quantities of market data to identify statistical patterns.",
          "Applies machine learning algorithms to predict market movements with high accuracy.",
          "Analyzes correlations between multiple financial indicators simultaneously."
        ],
        data: [
          "Creates real-time visualization of market trends and price movements.",
          "Identifies opportunities for portfolio optimization and risk mitigation.",
          "Enables data-driven decision making with advanced analytics."
        ]
      },
      crypto: {
        human: [
          "Evaluates project fundamentals through social and technical understanding.",
          "Interprets market sentiment and hype cycles through community engagement.",
          "Maintains perspective during market volatility through experience."
        ],
        ai: [
          "Analyzes on-chain data to identify trends and potential opportunities.",
          "Tracks wallet movements and large transactions to predict price impact.",
          "Uses natural language processing to evaluate market sentiment from social media."
        ],
        data: [
          "Aggregates real-time trading data across multiple exchanges.",
          "Maps relationships between different tokens and their price correlations.",
          "Monitors network activity and transaction volumes to gauge adoption."
        ]
      },
      sports: {
        human: [
          "Evaluates player psychology and team dynamics beyond statistics.",
          "Recognizes patterns of fatigue and momentum shifts during games.",
          "Intuitively identifies matchup advantages and strategic opportunities."
        ],
        ai: [
          "Processes millions of data points to identify performance patterns.",
          "Predicts optimal strategies based on historical matchup analysis.",
          "Calculates win probabilities with real-time adjustments during games."
        ],
        data: [
          "Tracks player positioning and movement throughout games.",
          "Analyzes performance metrics across different scenarios and conditions.",
          "Identifies statistical anomalies that indicate strategic advantages."
        ]
      },
      general: {
        human: [
          "Applies contextual understanding and creative thinking to complex problems.",
          "Brings emotional intelligence and ethical considerations to decision making.",
          "Provides intuitive judgment based on incomplete information."
        ],
        ai: [
          "Processes and analyzes large-scale data to identify patterns and insights.",
          "Performs rapid calculations and simulations to evaluate potential outcomes.",
          "Maintains consistency and objectivity across massive datasets."
        ],
        data: [
          "Facilitates information exchange between human and AI systems.",
          "Transforms raw information into structured knowledge for enhanced understanding.",
          "Enables collaborative intelligence through shared representations."
        ]
      }
    };
    
    const descriptions = domainSpecificDescriptions[domain]?.[node.type] || [];
    return descriptions[Math.floor(Math.random() * descriptions.length)] || 
           "This node represents a critical junction in the cognitive field.";
  };
  
  // Render the neural network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Clear canvas with a pure black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate actual positions based on percentage
    const calculateActualPosition = (node: DataNode) => {
      return {
        x: (node.x / 100) * canvas.width,
        y: (node.y / 100) * canvas.height
      };
    };
    
    // Draw connections - with holographic emergence effect
    connections.forEach(conn => {
      const sourceNode = nodes.find(n => n.id === conn.source);
      const targetNode = nodes.find(n => n.id === conn.target);
      
      if (!sourceNode || !targetNode) return;
      
      const sourcePos = calculateActualPosition(sourceNode);
      const targetPos = calculateActualPosition(targetNode);
      
      // Connection styling based on state
      const isHighlighted = activeNodeId && 
        (conn.source === activeNodeId || conn.target === activeNodeId);
        
      // Calculate connection visibility: holographic appearance
      // This creates a pulsing effect for inactive connections to make them less permanent
      const randomSeed = parseInt(conn.source) + parseInt(conn.target); // Deterministic randomness per connection
      const now = Date.now();
      const visibilityPulse = Math.sin(now * 0.001 + randomSeed) * 0.5 + 0.5;
      
      // Connection visibility fades in and out when not highlighted or active
      // This creates the holographic, emergent look - connections will appear and disappear subtly
      const shouldRender = isHighlighted || conn.active || (Math.random() > 0.7 && visibilityPulse > 0.7);
      
      // Skip rendering some inactive connections randomly to create more dynamic, emergent effect
      if (!shouldRender && !conn.active && !isHighlighted) {
        return;
      }
      
      // Moving control points for subtle "DVD bounce" effect - paths constantly shift
      const time = now * 0.0003;
      const driftX = Math.sin(time + randomSeed) * 10;
      const driftY = Math.cos(time * 1.3 + randomSeed) * 10;
      
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      
      // Curved connections with subtle motion
      if (sourceNode.type !== targetNode.type) {
        // More organic feel with time-based drifting control points
        const cp1x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.4 + driftX * 0.5;
        const cp1y = sourcePos.y + driftY * 0.3;
        const cp2x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.6 + driftX * 0.5;
        const cp2y = targetPos.y + driftY * 0.3;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetPos.x, targetPos.y);
      } else {
        // Slightly curved with dynamic motion for same type nodes
        const midX = (sourcePos.x + targetPos.x) / 2 + driftX * 0.3;
        const midY = (sourcePos.y + targetPos.y) / 2 + driftY * 0.3;
        ctx.quadraticCurveTo(midX, midY, targetPos.x, targetPos.y);
      }
      
      // Apply connection styling based on state
      if (isHighlighted) {
        // Create pulsing gradient for highlighted connections
        const gradient = ctx.createLinearGradient(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
        const pulseIntensity = 0.7 + Math.sin(now * 0.003) * 0.3; // Subtle pulsing
        
        gradient.addColorStop(0, sourceNode.type === 'human' 
          ? `rgba(255, 255, 255, ${0.7 * pulseIntensity})` 
          : `rgba(143, 0, 255, ${0.8 * pulseIntensity})`);
        gradient.addColorStop(1, targetNode.type === 'human' 
          ? `rgba(255, 255, 255, ${0.7 * pulseIntensity})` 
          : `rgba(143, 0, 255, ${0.8 * pulseIntensity})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5 * conn.strength * (0.8 + Math.sin(now * 0.005) * 0.2); // Pulsing width
        
        // Add glow effect
        ctx.shadowColor = sourceNode.type === 'ai' 
          ? 'rgba(143, 0, 255, 0.6)' 
          : 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 8 * pulseIntensity;
      } else if (conn.active) {
        // Active connections have time-based opacity for holographic effect
        const activePulse = (0.5 + Math.sin(now * 0.002 + randomSeed) * 0.3);
        ctx.strokeStyle = sourceNode.type === 'ai'
          ? `rgba(143, 0, 255, ${0.2 * activePulse})`
          : `rgba(255, 255, 255, ${0.15 * activePulse})`;
        ctx.lineWidth = 0.8 * conn.strength * activePulse;
        
        // Subtle glow
        ctx.shadowColor = sourceNode.type === 'ai' 
          ? 'rgba(143, 0, 255, 0.3)' 
          : 'rgba(255, 255, 255, 0.2)';
        ctx.shadowBlur = 3 * activePulse;
      } else {
        // Inactive connections are very faint and appear/disappear randomly
        // This is the key to the holographic emergence effect
        const flickerOpacity = Math.max(0.01, Math.min(0.08, visibilityPulse * 0.08));
        ctx.strokeStyle = `rgba(255, 255, 255, ${flickerOpacity})`;
        ctx.lineWidth = 0.3 * (0.5 + Math.random() * 0.5); // Varying widths
      }
      
      ctx.stroke();
      
      // Reset shadow after stroke
      ctx.shadowBlur = 0;
      
      // Draw data flow particles on active connections - with holographic emergence effect
      if ((conn.active || isHighlighted) && showDataFlow) {
        // Apply temporal dilation to particle speed
        const now = Date.now();
        const temporalFactor = temporalDilation ? temporalDilation : 1;
        
        // Vary particles based on connection strength and activity
        const baseParticles = Math.floor(conn.strength * 5);
        const numParticles = isHighlighted ? baseParticles + 3 : baseParticles;
        
        // Randomize particle distribution a bit
        const randomSeed = parseInt(conn.source) + parseInt(conn.target);
        
        for (let i = 0; i < numParticles; i++) {
          // Randomize particle speeds slightly for more organic motion
          const particleSpeed = (1000 + i * 50 + (randomSeed % 200)) / temporalFactor;
          
          // Calculate position with slight variance for more organic flow
          const baseT = ((now / particleSpeed) % 1);
          // Add small sinusoidal movement perpendicular to the path
          const t = baseT;
          
          let particleX, particleY;
          
          // Get moving control points for the DVD bounce effect on particles
          const time = now * 0.0003;
          const driftX = Math.sin(time + randomSeed + i) * 5;
          const driftY = Math.cos(time * 1.3 + randomSeed + i) * 5;
          
          if (sourceNode.type !== targetNode.type) {
            // For bezier curves with subtle drift
            const cp1x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.4 + driftX * 0.3;
            const cp1y = sourcePos.y + driftY * 0.3;
            const cp2x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.6 + driftX * 0.3;
            const cp2y = targetPos.y + driftY * 0.3;
            
            // Calculate point on bezier curve
            const mt = 1 - t;
            const mt2 = mt * mt;
            const mt3 = mt2 * mt;
            const t2 = t * t;
            const t3 = t2 * t;
            
            particleX = mt3 * sourcePos.x + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t3 * targetPos.x;
            particleY = mt3 * sourcePos.y + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * targetPos.y;
            
            // Add slight perpendicular movement for more organic flow
            // Calculate the tangent vector
            const tangentX = -3 * mt2 * sourcePos.x + 3 * (1 - 4*t + 3*t2) * cp1x + 3 * (2*t - 3*t2) * cp2x + 3 * t2 * targetPos.x;
            const tangentY = -3 * mt2 * sourcePos.y + 3 * (1 - 4*t + 3*t2) * cp1y + 3 * (2*t - 3*t2) * cp2y + 3 * t2 * targetPos.y;
            
            // Normalize tangent
            const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
            const normTangentX = tangentX / tangentLength;
            const normTangentY = tangentY / tangentLength;
            
            // Get perpendicular vector
            const perpX = -normTangentY;
            const perpY = normTangentX;
            
            // Apply small perpendicular oscillation for organic motion
            const perpAmount = Math.sin(now * 0.005 + i * 0.5 + randomSeed) * 2;
            particleX += perpX * perpAmount;
            particleY += perpY * perpAmount;
            
          } else {
            // For quadratic curves with subtle drift
            const midX = (sourcePos.x + targetPos.x) / 2 + driftX * 0.3;
            const midY = (sourcePos.y + targetPos.y) / 2 + driftY * 0.3;
            
            const mt = 1 - t;
            const mt2 = mt * mt;
            const t2 = t * t;
            
            particleX = mt2 * sourcePos.x + 2 * mt * t * midX + t2 * targetPos.x;
            particleY = mt2 * sourcePos.y + 2 * mt * t * midY + t2 * targetPos.y;
            
            // Add subtle perpendicular oscillation here too
            const perpAmount = Math.sin(now * 0.005 + i * 0.5 + randomSeed) * 1.5;
            const dx = targetPos.x - sourcePos.x;
            const dy = targetPos.y - sourcePos.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            
            if (len > 0) {
              particleX += (-dy / len) * perpAmount;
              particleY += (dx / len) * perpAmount;
            }
          }
          
          // Vary particle size based on position in path and time
          const sizePulse = 0.8 + Math.sin(now * 0.003 + i + t * Math.PI) * 0.2;
          const particleSize = (1 + conn.strength * 0.8) * sizePulse;
          
          // Create holographic glow effect with varying opacity
          ctx.shadowBlur = isHighlighted ? 8 : 4;
          
          // Time-based color pulsing for holographic effect - with safety checks
          let alphaPulse = 0.7; // Default fallback
          try {
            const sinVal = Math.sin(now * 0.004 + i + randomSeed);
            alphaPulse = isFinite(sinVal) ? 0.7 + sinVal * 0.3 : 0.7;
            // Clamp between 0 and 1 for safety
            alphaPulse = Math.max(0, Math.min(1, alphaPulse));
          } catch (e) {
            // Use default value if any calculation errors
          }
          
          // Determine particle color based on connection type with time-based variation
          const sourceIsHuman = sourceNode.type === 'human';
          const targetIsHuman = targetNode.type === 'human';
          
          // Create radial gradient for glowing particles that pulse over time
          // Much more robust checks to ensure all values are valid
          const safeParticleX = isFinite(particleX) ? particleX : 0;
          const safeParticleY = isFinite(particleY) ? particleY : 0;
          const safeParticleSize = isFinite(particleSize) && particleSize > 0 ? particleSize : 1;
          
          // Calculate pulse with fallback
          let pulseScale = 2; // Default fallback
          try {
            const sinVal = Math.sin(now * 0.002 + i);
            pulseScale = isFinite(sinVal) ? (2 + sinVal * 0.5) : 2;
          } catch (e) {
            // Use default value if any calculation errors
          }
          
          // Ensure positive, finite gradient radius
          const gradientRadius = Math.max(0.1, safeParticleSize * pulseScale);
          
          // Create gradient with sanitized values
          let gradient;
          try {
            gradient = ctx.createRadialGradient(
              safeParticleX, safeParticleY, 0,
              safeParticleX, safeParticleY, gradientRadius
            );
          } catch (e) {
            // If gradient creation fails, create a fallback with safe values
            gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
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
            // Mixed: blend with time-based color shift - with safety check
            let mixColor = [140, 140, 255]; // Default fallback
            try {
              const sinVal = Math.sin(now * 0.002 + i);
              if (isFinite(sinVal)) {
                mixColor = sinVal > 0 ? [180, 120, 255] : [140, 140, 255];
              }
            } catch (e) {
              // Use default values if any calculation errors
            }
              
            ctx.shadowColor = `rgba(${mixColor[0]}, ${mixColor[1]}, ${mixColor[2]}, ${alphaPulse * 0.6})`;
            gradient.addColorStop(0, `rgba(${mixColor[0]}, ${mixColor[1]}, ${mixColor[2]}, ${alphaPulse})`);
            gradient.addColorStop(0.4, `rgba(${mixColor[0] * 0.8}, ${mixColor[1] * 0.8}, ${mixColor[2] * 0.8}, ${alphaPulse * 0.7})`);
            gradient.addColorStop(1, `rgba(${mixColor[0] * 0.6}, ${mixColor[1] * 0.6}, ${mixColor[2] * 0.6}, 0)`);
          }
          
          // Draw with holographic shimmer
          ctx.beginPath();
          ctx.fillStyle = gradient;
          
          // Vary particle shape slightly for more interest
          if (Math.random() > 0.8 && isHighlighted) {
            // Occasional diamond particles for highlighted connections
            // Ensure valid size
            const size = isFinite(particleSize) && particleSize > 0 
              ? particleSize * 0.8 
              : 1; // Fallback to 1px if invalid
            
            // Use Math.max to ensure minimum valid size
            const safeSize = Math.max(0.1, size);
            
            ctx.moveTo(particleX, particleY - safeSize); // Top
            ctx.lineTo(particleX + safeSize, particleY); // Right
            ctx.lineTo(particleX, particleY + safeSize); // Bottom
            ctx.lineTo(particleX - safeSize, particleY); // Left
            ctx.closePath();
          } else {
            // Mostly circular particles with slight random variation in radius
            // Ensure radius is always a valid number
            const randomVariation = 0.9 + Math.random() * 0.2;
            const finalRadius = isFinite(particleSize) && particleSize > 0 
              ? particleSize * randomVariation 
              : 1; // Fallback to 1px if invalid
              
            ctx.arc(
              particleX, 
              particleY, 
              Math.max(0.1, finalRadius), // Ensure minimum valid size 
              0, 
              Math.PI * 2
            );
          }
          
          ctx.fill();
          
          // Reset shadow for next particle
          ctx.shadowBlur = 0;
        }
      }
    });
    
    // Draw nodes
    const now = Date.now() / 1000;
    nodes.forEach(node => {
      const { x, y } = calculateActualPosition(node);
      
      // Calculate pulse effect based on node's frequency and phase
      const pulseFreq = node.pulseFrequency || 1;
      const phase = node.phase || 0;
      const pulseFactor = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(now * pulseFreq + phase));
      
      const isActive = node.id === activeNodeId;
      let nodeSize = node.size;
      
      if (isActive) {
        // Larger pulse for active nodes
        nodeSize += 2 + Math.sin(now * 5) * 2;
      }
      
      // Node glow effect
      ctx.shadowColor = node.type === 'ai' ? '#7B00FF' : 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = isActive ? 15 : 5 * pulseFactor;
      
      // Draw main node circle
      ctx.beginPath();
      ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
      
      // Create radial gradient for the node
      const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, nodeSize
      );
      
      if (node.type === 'human') {
        // Human nodes: white core with subtle gradient
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.7)');
      } else if (node.type === 'ai') {
        // AI nodes: ultraviolet gradient
        gradient.addColorStop(0, '#9D38FF'); // Lighter violet at center
        gradient.addColorStop(0.7, '#7B00FF');
        gradient.addColorStop(1, '#6000CC'); // Darker at the edge
      } else {
        // Data nodes: blue gradient
        gradient.addColorStop(0, 'rgba(80, 150, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(30, 100, 220, 0.7)');
      }
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
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
    
    // Complete animation loop with temporal dilation effect
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Clear canvas and redraw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Redraw the black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get current time (affected by temporal dilation)
      const now = Date.now() / (1000 / temporalDilation);
      
      // Draw all connections first (so they appear behind nodes) - with holographic emergence effect
      connections.forEach(conn => {
        const sourceNode = nodes.find(n => n.id === conn.source);
        const targetNode = nodes.find(n => n.id === conn.target);
        
        if (!sourceNode || !targetNode) return;
        
        const sourcePos = calculateActualPosition(sourceNode);
        const targetPos = calculateActualPosition(targetNode);
        
        // Connection styling based on state
        const isHighlighted = activeNodeId && 
          (conn.source === activeNodeId || conn.target === activeNodeId);
        
        // Calculate connection visibility for holographic appearance
        const randomSeed = parseInt(conn.source) + parseInt(conn.target); // Deterministic per connection
        const visibilityPulse = Math.sin(now * 0.001 + randomSeed) * 0.5 + 0.5;
        
        // Connection visibility fades in and out when not highlighted or active - holographic emergence
        const shouldRender = isHighlighted || conn.active || (Math.random() > 0.7 && visibilityPulse > 0.7);
        
        // Skip rendering some inactive connections randomly to create more dynamic, emergent effect
        if (!shouldRender && !conn.active && !isHighlighted) {
          return;
        }
        
        // Moving control points for subtle "DVD bounce" effect - paths constantly shift
        const time = now * 0.0003;
        const driftX = Math.sin(time + randomSeed) * 10;
        const driftY = Math.cos(time * 1.3 + randomSeed) * 10;
        
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        
        // Curved connections with subtle dynamic motion
        if (sourceNode.type !== targetNode.type) {
          // More organic feel with time-based drifting control points
          const cp1x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.4 + driftX * 0.5;
          const cp1y = sourcePos.y + driftY * 0.3;
          const cp2x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.6 + driftX * 0.5;
          const cp2y = targetPos.y + driftY * 0.3;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetPos.x, targetPos.y);
        } else {
          // Slightly curved with dynamic motion for same type nodes
          const midX = (sourcePos.x + targetPos.x) / 2 + driftX * 0.3;
          const midY = (sourcePos.y + targetPos.y) / 2 + driftY * 0.3;
          ctx.quadraticCurveTo(midX, midY, targetPos.x, targetPos.y);
        }
        
        if (isHighlighted) {
          // Create pulsing gradient for highlighted connections
          const gradient = ctx.createLinearGradient(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
          const pulseIntensity = 0.7 + Math.sin(now * 0.003) * 0.3; // Subtle pulsing
          
          gradient.addColorStop(0, sourceNode.type === 'human' 
            ? `rgba(255, 255, 255, ${0.7 * pulseIntensity})` 
            : `rgba(143, 0, 255, ${0.8 * pulseIntensity})`);
          gradient.addColorStop(1, targetNode.type === 'human' 
            ? `rgba(255, 255, 255, ${0.7 * pulseIntensity})` 
            : `rgba(143, 0, 255, ${0.8 * pulseIntensity})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5 * conn.strength * (0.8 + Math.sin(now * 0.005) * 0.2); // Pulsing width
          
          // Add glow effect
          ctx.shadowColor = sourceNode.type === 'ai' 
            ? 'rgba(143, 0, 255, 0.6)' 
            : 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = 8 * pulseIntensity;
        } else if (conn.active) {
          // Active connections have time-based opacity for holographic effect
          const activePulse = (0.5 + Math.sin(now * 0.002 + randomSeed) * 0.3);
          ctx.strokeStyle = sourceNode.type === 'ai'
            ? `rgba(143, 0, 255, ${0.2 * activePulse})`
            : `rgba(255, 255, 255, ${0.15 * activePulse})`;
          ctx.lineWidth = 0.8 * conn.strength * activePulse;
          
          // Subtle glow
          ctx.shadowColor = sourceNode.type === 'ai' 
            ? 'rgba(143, 0, 255, 0.3)' 
            : 'rgba(255, 255, 255, 0.2)';
          ctx.shadowBlur = 3 * activePulse;
        } else {
          // Inactive connections are very faint and appear/disappear randomly
          // This is the key to the holographic emergence effect
          const flickerOpacity = Math.max(0.01, Math.min(0.08, visibilityPulse * 0.08));
          ctx.strokeStyle = `rgba(255, 255, 255, ${flickerOpacity})`;
          ctx.lineWidth = 0.3 * (0.5 + Math.random() * 0.5); // Varying widths
        }
        
        ctx.stroke();
        
        // Reset shadow after stroke
        ctx.shadowBlur = 0;
        
        // Draw data flow particles on active connections - with holographic emergence effect
        if ((conn.active || isHighlighted) && showDataFlow) {
          // Apply temporal dilation to particle speed
          const temporalFactor = temporalDilation ? temporalDilation : 1;
          
          // Vary particles based on connection strength and activity
          const baseParticles = Math.floor(conn.strength * 5);
          const numParticles = isHighlighted ? baseParticles + 3 : baseParticles;
          
          for (let i = 0; i < numParticles; i++) {
            try {
              // Randomize particle speeds slightly for more organic motion
              const particleSpeed = (1000 + i * 50 + (randomSeed % 200)) / temporalFactor;
              
              // Calculate position with slight variance for organic flow
              const baseT = ((now / particleSpeed) % 1);
              const t = baseT;
              
              // Get moving control points for DVD bounce effect on particles
              const particleTime = now * 0.0003;
              const particleDriftX = Math.sin(particleTime + randomSeed + i) * 5;
              const particleDriftY = Math.cos(particleTime * 1.3 + randomSeed + i) * 5;
              
              let particleX, particleY;
              
              if (sourceNode.type !== targetNode.type) {
                // For bezier curves with subtle drift
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
                
                // Add slight perpendicular movement for more organic flow
                if (isFinite(particleX) && isFinite(particleY)) {
                  // Calculate the tangent vector
                  const tangentX = -3 * mt2 * sourcePos.x + 3 * (1 - 4*t + 3*t2) * cp1x + 3 * (2*t - 3*t2) * cp2x + 3 * t2 * targetPos.x;
                  const tangentY = -3 * mt2 * sourcePos.y + 3 * (1 - 4*t + 3*t2) * cp1y + 3 * (2*t - 3*t2) * cp2y + 3 * t2 * targetPos.y;
                  
                  // Only proceed if tangent is valid
                  if (isFinite(tangentX) && isFinite(tangentY) && (tangentX !== 0 || tangentY !== 0)) {
                    // Normalize tangent
                    const tangentLength = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
                    if (tangentLength > 0) {
                      const normTangentX = tangentX / tangentLength;
                      const normTangentY = tangentY / tangentLength;
                      
                      // Get perpendicular vector
                      const perpX = -normTangentY;
                      const perpY = normTangentX;
                      
                      // Apply small perpendicular oscillation for organic motion
                      const perpAmount = Math.sin(now * 0.005 + i * 0.5 + randomSeed) * 2;
                      particleX += perpX * perpAmount;
                      particleY += perpY * perpAmount;
                    }
                  }
                }
              } else {
                // For quadratic curves with subtle drift
                const midX = (sourcePos.x + targetPos.x) / 2 + particleDriftX * 0.3;
                const midY = (sourcePos.y + targetPos.y) / 2 + particleDriftY * 0.3;
                
                const mt = 1 - t;
                const mt2 = mt * mt;
                const t2 = t * t;
                
                particleX = mt2 * sourcePos.x + 2 * mt * t * midX + t2 * targetPos.x;
                particleY = mt2 * sourcePos.y + 2 * mt * t * midY + t2 * targetPos.y;
                
                // Add subtle perpendicular oscillation for organic flow
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
              
              // Skip if particle position is invalid
              if (!isFinite(particleX) || !isFinite(particleY)) {
                continue;
              }
              
              // Vary particle size based on position and time
              const sizePulse = 0.8 + Math.sin(now * 0.003 + i + t * Math.PI) * 0.2;
              const particleSize = (1 + conn.strength * 0.8) * sizePulse;
              const safeParticleSize = isFinite(particleSize) && particleSize > 0 ? particleSize : 1;
              
              // Create holographic glow effect
              ctx.shadowBlur = isHighlighted ? 8 : 4;
              
              // Time-based color pulsing for holographic effect
              let alphaPulse = 0.7; // Default
              try {
                const sinVal = Math.sin(now * 0.004 + i + randomSeed);
                alphaPulse = isFinite(sinVal) ? 0.7 + sinVal * 0.3 : 0.7;
                alphaPulse = Math.max(0, Math.min(1, alphaPulse)); // Clamp
              } catch (e) {
                // Use default
              }
              
              // Determine color based on connection type with time-based variation
              const sourceIsHuman = sourceNode.type === 'human';
              const targetIsHuman = targetNode.type === 'human';
              
              let gradient;
              try {
                // Create gradient with safe values
                gradient = ctx.createRadialGradient(
                  particleX, particleY, 0,
                  particleX, particleY, Math.max(0.1, safeParticleSize * 2)
                );
              } catch (e) {
                // Fallback to a basic gradient if creation fails
                gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
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
              
              // Draw with holographic shimmer
              ctx.beginPath();
              ctx.fillStyle = gradient;
              
              // Vary particle shape slightly for more interest
              if (Math.random() > 0.8 && isHighlighted) {
                // Occasional diamond particles for highlighted connections
                const size = Math.max(0.1, safeParticleSize * 0.8);
                ctx.moveTo(particleX, particleY - size); // Top
                ctx.lineTo(particleX + size, particleY); // Right
                ctx.lineTo(particleX, particleY + size); // Bottom
                ctx.lineTo(particleX - size, particleY); // Left
                ctx.closePath();
              } else {
                // Mostly circular particles with slight random variation
                const finalRadius = Math.max(0.1, safeParticleSize * (0.9 + Math.random() * 0.2));
                ctx.arc(particleX, particleY, finalRadius, 0, Math.PI * 2);
              }
              
              ctx.fill();
              ctx.shadowBlur = 0; // Reset
            } catch (e) {
              // Skip this particle if any error occurs
              continue;
            }
          }
        }
      });
      
      // Then draw all nodes (so they appear on top of connections)
      nodes.forEach(node => {
        const { x, y } = calculateActualPosition(node);
        
        // Check if node is active/highlighted
        const isActive = node.id === activeNodeId;
        
        // Calculate node size (including pulsing effect)
        const pulseAmount = node.pulseFrequency ? Math.sin(now * node.pulseFrequency + (node.phase || 0)) * 1.5 : 0;
        const nodeSize = (node.size * zoomLevel) + (isActive ? 4 : 0) + (isActive ? 0 : pulseAmount);
        
        // Calculate a time-based oscillation for visual effects
        const oscillation = Math.sin(now * 0.5 + (node.phase || 0)) * 0.5 + 0.5;
        
        // Apply enhanced drop shadow for depth - more intense for AI nodes
        if (node.type === 'ai') {
          // Ultraviolet glow for AI nodes
          ctx.shadowColor = `rgba(143, 0, 255, ${0.6 + oscillation * 0.4})`;
          ctx.shadowBlur = isActive ? 25 : 15;
        } else if (node.type === 'human') {
          // Subtle white glow for human nodes
          ctx.shadowColor = `rgba(255, 255, 255, ${0.3 + oscillation * 0.2})`;
          ctx.shadowBlur = isActive ? 20 : 10;
        } else {
          // Blue glow for data nodes
          ctx.shadowColor = `rgba(0, 150, 255, ${0.3 + oscillation * 0.2})`;
          ctx.shadowBlur = isActive ? 18 : 8;
        }
        
        // Determine node shape based on type for more visual variation
        if (node.type === 'ai' && !isActive) {
          // Diamond shape for AI nodes (when not active)
          const size = nodeSize * 0.8; // Slightly smaller for diamond shape
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
        
        // Create more futuristic gradients based on node type
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize);
        
        if (isActive) {
          // More vibrant gradient for active nodes with ultraviolet accents
          if (node.type === 'human') {
            // Luminous white-blue for human intelligence
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.4, 'rgba(220, 230, 255, 0.9)');
            gradient.addColorStop(0.7, 'rgba(180, 200, 255, 0.7)');
            gradient.addColorStop(1, 'rgba(150, 170, 255, 0)');
          } else if (node.type === 'ai') {
            // Deep ultraviolet for AI - using #8F00FF (the cosmic purple mentioned in the design doc)
            gradient.addColorStop(0, 'rgba(180, 120, 255, 1)');
            gradient.addColorStop(0.3, 'rgba(143, 0, 255, 0.9)');
            gradient.addColorStop(0.7, 'rgba(100, 0, 200, 0.7)');
            gradient.addColorStop(1, 'rgba(80, 0, 170, 0)');
          } else {
            // Electric blue for data nodes
            gradient.addColorStop(0, 'rgba(100, 200, 255, 1)');
            gradient.addColorStop(0.4, 'rgba(30, 150, 255, 0.8)');
            gradient.addColorStop(0.7, 'rgba(0, 100, 220, 0.6)');
            gradient.addColorStop(1, 'rgba(0, 70, 180, 0)');
          }
        } else {
          // More subdued but still futuristic standard gradients
          if (node.type === 'human') {
            // Subtle white-blue pulse for human nodes
            const pulseIntensity = 0.7 + (oscillation * 0.3);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${pulseIntensity})`);
            gradient.addColorStop(0.5, `rgba(220, 225, 255, ${pulseIntensity * 0.7})`);
            gradient.addColorStop(1, `rgba(200, 200, 255, ${pulseIntensity * 0.1})`);
          } else if (node.type === 'ai') {
            // Purple ultraviolet gradient for AI nodes with subtle pulsing
            const pulseIntensity = 0.8 + (oscillation * 0.2);
            gradient.addColorStop(0, `rgba(143, 0, 255, ${pulseIntensity})`);
            gradient.addColorStop(0.6, `rgba(120, 0, 220, ${pulseIntensity * 0.6})`);
            gradient.addColorStop(1, `rgba(100, 0, 200, ${pulseIntensity * 0.1})`);
          } else {
            // Data nodes with electric blue gradient
            const pulseIntensity = 0.7 + (oscillation * 0.3);
            gradient.addColorStop(0, `rgba(80, 150, 255, ${pulseIntensity})`);
            gradient.addColorStop(0.6, `rgba(30, 100, 220, ${pulseIntensity * 0.7})`);
            gradient.addColorStop(1, `rgba(10, 70, 180, ${pulseIntensity * 0.3})`);
          }
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
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
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [nodes, connections, activeNodeId, dimensions, showLabels, showDataFlow, temporalDilation]);
  
  // Handle canvas click to select nodes
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Toggle interface visibility on general canvas click
    if (Math.random() > 0.8) {
      setShowInterface(!showInterface);
      return;
    }
    
    // Find if we clicked on a node
    const clickedNode = nodes.find(node => {
      const dx = (node.x - x);
      const dy = (node.y - y);
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Adjust the detection radius based on node size and zoom level
      const detectionRadius = (node.size / 3) * zoomLevel;
      return distance < detectionRadius;
    });
    
    if (clickedNode) {
      setActiveNodeId(clickedNode.id);
      
      // Generate node details
      const activeNode = nodes.find(node => node.id === clickedNode.id);
      if (activeNode) {
        // Get connected nodes
        const connectedNodeIds = connections
          .filter(conn => conn.source === clickedNode.id || conn.target === clickedNode.id)
          .map(conn => conn.source === clickedNode.id ? conn.target : conn.source);
        
        const connectedNodes = nodes.filter(node => connectedNodeIds.includes(node.id));
        
        // Set node details
        setActiveNodeDetails({
          description: getNodeDescription(activeNode),
          relatedConcepts: connectedNodes.map(node => node.label),
          importance: Math.round(activeNode.size * 10),
          confidence: Math.round((activeNode.type === 'ai' ? 85 : 70) + Math.random() * 15)
        });
        
        setIsDetailsPanelVisible(true);
      }
      
      if (onNodeSelect) {
        onNodeSelect(clickedNode.id);
      }
    } else {
      setActiveNodeId(null);
      setIsDetailsPanelVisible(false);
      if (onNodeSelect) {
        onNodeSelect('');
      }
    }
  }, [nodes, connections, zoomLevel, onNodeSelect, showInterface]);
  
  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'human':
        return <Brain className="h-4 w-4" />;
      case 'ai':
        return <Cpu className="h-4 w-4" />;
      case 'data':
        return <Database className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Immersive control handlers
  const handleToggleFullscreen = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;
    
    if (!isFullscreen) {
      // Enter fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen]);
  
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  }, []);
  
  const handleToggleLabels = useCallback(() => {
    setShowLabels(prev => !prev);
  }, []);
  
  const handleToggleDataFlow = useCallback(() => {
    setShowDataFlow(prev => !prev);
  }, []);
  
  // These functions are now handled by the parent component
  const handleIncreaseTemporal = useCallback(() => {
    // Now handled by parent
  }, []);
  
  const handleDecreaseTemporal = useCallback(() => {
    // Now handled by parent
  }, []);
  
  const handleReset = useCallback(() => {
    setZoomLevel(1);
    // Temporal dilation reset handled by parent
    setActiveNodeId(null);
    setShowLabels(false);
    setIsDetailsPanelVisible(false);
    setShowInterface(true);
    if (onNodeSelect) onNodeSelect('');
    
    // Reset connection activity to random
    setConnections(prev => 
      prev.map(conn => ({
        ...conn,
        active: Math.random() > 0.7
      }))
    );
  }, [onNodeSelect]);
  
  // Monitor actual fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[400px] bg-black rounded-lg overflow-hidden",
        className
      )}
    >
      {/* Canvas for rendering - always visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <canvas 
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-pointer"
        />
      </motion.div>

      {/* Loading overlay - only visible during initial API fetch when we have no nodes yet */}
      {conceptConnections.isPending && nodes.length === 0 && (
        <motion.div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center gap-2 text-white/80">
            <motion.div 
              className="w-20 h-20 rounded-full border-2 border-purple-600"
              animate={{
                borderColor: ['rgba(123, 0, 255, 0.2)', 'rgba(123, 0, 255, 0.8)', 'rgba(123, 0, 255, 0.2)'],
                boxShadow: [
                  '0 0 10px rgba(123, 0, 255, 0.2)', 
                  '0 0 20px rgba(123, 0, 255, 0.6)', 
                  '0 0 10px rgba(123, 0, 255, 0.2)'
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            <span className="text-sm mt-4 tracking-widest uppercase text-white/60">Generating Field</span>
          </div>
        </motion.div>
      )}
      
      {/* Loading indicator for API data fetching when we already have a fallback visualization */}
      {conceptConnections.isPending && nodes.length > 0 && (
        <motion.div 
          className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5 text-xs"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="w-3 h-3 rounded-full bg-purple-600"
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          <span className="text-white/80">Enhancing visualization</span>
        </motion.div>
      )}
      
      {/* Error message */}
      {conceptConnections.isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-black/80 border border-red-500/30 p-4 rounded-lg max-w-xs text-center">
            <p className="text-red-400 mb-2">Unable to generate neural connections</p>
            <p className="text-xs text-white/60">Please try again with a different domain</p>
          </div>
        </div>
      )}
      
      {/* Node Details Panel - Only visible when needed */}
      <AnimatePresence>
        {isDetailsPanelVisible && activeNodeDetails && activeNodeId && showNodeDetails && showInterface && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "absolute right-3 top-3 w-72 bg-black/80 backdrop-blur-lg rounded-lg border border-white/10",
              isDetailsPanelExpanded ? "max-h-[80%]" : "max-h-[350px]"
            )}
            style={{ overflow: 'hidden' }}
          >
            {/* Panel Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Node type icon */}
                <div 
                  className="p-1.5 rounded-md"
                  style={{ 
                    backgroundColor: nodes.find(n => n.id === activeNodeId)?.type === 'ai' 
                      ? 'rgba(123, 0, 255, 0.3)' 
                      : nodes.find(n => n.id === activeNodeId)?.type === 'human'
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {getNodeTypeIcon(nodes.find(n => n.id === activeNodeId)?.type || 'data')}
                </div>
                
                {/* Node label */}
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {nodes.find(n => n.id === activeNodeId)?.label || 'Node'}
                  </h3>
                  <p className="text-xs text-white/50 capitalize">
                    {nodes.find(n => n.id === activeNodeId)?.type || 'Unknown'} Node
                  </p>
                </div>
              </div>
              
              {/* Control buttons */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsDetailsPanelExpanded(!isDetailsPanelExpanded)} 
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  {isDetailsPanelExpanded ? (
                    <Minimize2 className="h-4 w-4 text-white/70" />
                  ) : (
                    <Maximize2 className="h-4 w-4 text-white/70" />
                  )}
                </button>
                <button 
                  onClick={() => {
                    setIsDetailsPanelVisible(false);
                    setActiveNodeId(null);
                    if (onNodeSelect) onNodeSelect('');
                  }} 
                  className="p-1 hover:bg-white/10 rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
              </div>
            </div>
            
            {/* Panel Content */}
            <div className={cn(
              "overflow-y-auto",
              isDetailsPanelExpanded ? "max-h-[calc(80vh-60px)]" : "max-h-[290px]"
            )}>
              <div className="p-3">
                <h4 className="text-xs uppercase text-white/60 mb-1.5">Description</h4>
                <p className="text-sm text-white/90 mb-4">
                  {activeNodeDetails.description}
                </p>
                
                {/* Importance & Confidence Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <h4 className="text-xs uppercase text-white/60 mb-1.5">Importance</h4>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${activeNodeDetails.importance}%`,
                          backgroundColor: '#7B00FF'
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-white/50">Low</span>
                      <span className="text-xs text-white/70">{activeNodeDetails.importance}%</span>
                      <span className="text-xs text-white/50">High</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs uppercase text-white/60 mb-1.5">Confidence</h4>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${activeNodeDetails.confidence}%`,
                          backgroundColor: '#9D38FF'
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-white/50">Low</span>
                      <span className="text-xs text-white/70">{activeNodeDetails.confidence}%</span>
                      <span className="text-xs text-white/50">High</span>
                    </div>
                  </div>
                </div>
                
                {/* Related Concepts */}
                {activeNodeDetails.relatedConcepts && activeNodeDetails.relatedConcepts.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase text-white/60 mb-1.5">Related Concepts</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeNodeDetails.relatedConcepts.map((concept, index) => (
                        <div 
                          key={`concept-${index}`}
                          className="bg-white/10 px-2 py-1 rounded-md text-xs text-white/80"
                        >
                          {concept}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Immersive Controls - Fade out when not in use */}
      {showInterface && (
        <motion.div 
          className="absolute top-3 left-3 z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: isFullscreen ? 0.2 : 1 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ImmersiveControls
            onToggleFullscreen={handleToggleFullscreen}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onToggleLabels={handleToggleLabels}
            onToggleDataFlow={handleToggleDataFlow}
            onIncreaseTemporal={handleIncreaseTemporal}
            onDecreaseTemporal={handleDecreaseTemporal}
            onReset={handleReset}
            isFullscreen={isFullscreen}
            showLabels={showLabels}
            showDataFlow={showDataFlow}
            temporalDilation={temporalDilation}
          />
        </motion.div>
      )}
      
      {/* Legend - Hidden by default in immersive mode */}
      {showInterface && !isFullscreen && (
        <div className="absolute bottom-3 left-3 flex items-center gap-4 text-xs text-white/70">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
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
      )}
      
      {/* PassiveWorks Logo - Minimal and barely visible */}
      <div className="absolute bottom-3 right-3 opacity-30 hover:opacity-80 transition-opacity">
        <div className="text-xs tracking-wider text-white/50 font-light uppercase">
          PassiveWorks
        </div>
      </div>
    </div>
  );
}