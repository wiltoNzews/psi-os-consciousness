import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDomain } from '@/contexts/DomainContext';
import { useConceptualConnections, type ConceptNode, type ConceptConnection } from '@/hooks/use-symbiosis-api';
import { Loader2, Brain, Cpu, Database, X, Maximize2, Minimize2 } from 'lucide-react';
import { ImmersiveControls } from './ImmersiveControls';

// Data structures
interface DataNode {
  id: string;
  x: number;
  y: number;
  type: 'human' | 'ai' | 'data';
  label: string;
  size: number;
  color: string;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
  active: boolean;
}

interface NodeDetail {
  description: string;
  relatedConcepts: string[];
  importance: number; // 0-100 scale
  confidence: number; // 0-100 scale
}

interface NeuroSynapseProps {
  domain: 'finance' | 'crypto' | 'sports' | 'general';
  highlightedNode?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  className?: string;
  showNodeDetails?: boolean;
}

/**
 * NeuroSynapse - A fluid visualization environment that represents the cognitive field
 * where human consciousness and computational intelligence converge and extend each other
 */
export function NeuroSynapse({ 
  domain,
  highlightedNode = null,
  onNodeSelect,
  className,
  showNodeDetails = true
}: NeuroSynapseProps) {
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  
  // Generate node description based on node type and domain - defined at component level to be accessible everywhere
  const getNodeDescription = (node: DataNode): string => {
    const domainSpecificDescriptions = {
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
          "Identifies strategic market entry and exit points based on experience.",
          "Evaluates project team credibility and long-term viability.",
          "Recognizes cyclical patterns and market sentiment shifts."
        ],
        ai: [
          "Analyzes on-chain metrics and transaction volumes to predict price movements.",
          "Processes social media sentiment and news to gauge market direction.",
          "Identifies abnormal trading patterns that may indicate market manipulation."
        ],
        data: [
          "Tracks historical price correlations across multiple crypto assets.",
          "Monitors exchange liquidity and order book depth in real-time.",
          "Generates custom technical indicators for trading strategy development."
        ]
      },
      sports: {
        human: [
          "Evaluates player psychology and team dynamics beyond statistical measures.",
          "Recognizes situational factors that impact performance and game outcome.",
          "Applies intuitive understanding of momentum shifts and strategic adjustments."
        ],
        ai: [
          "Analyzes millions of historical game scenarios to predict play outcomes.",
          "Processes player biometric and performance data to optimize strategies.",
          "Identifies statistical arbitrage opportunities for predictive modeling."
        ],
        data: [
          "Tracks player movement and positioning data for strategic analysis.",
          "Monitors fatigue indicators and injury risk factors in real-time.",
          "Generates match-up analysis and opponent tendency reports."
        ]
      },
      general: {
        human: [
          "Applies cross-domain knowledge and metaphorical thinking to solve problems.",
          "Recognizes ethical implications and societal impact of decisions.",
          "Generates creative solutions through lateral thinking and intuition."
        ],
        ai: [
          "Processes vast information across multiple domains to identify patterns.",
          "Optimizes decision-making through multivariate analysis and prediction.",
          "Generates novel solutions through combinatorial exploration of possibilities."
        ],
        data: [
          "Creates multidimensional representations of complex systems.",
          "Enables exploration of counterfactual scenarios through simulation.",
          "Reveals hidden connections between seemingly unrelated concepts."
        ]
      }
    };
    
    // Get the appropriate descriptions for this domain and node type
    const domainDescriptions = domainSpecificDescriptions[domain as keyof typeof domainSpecificDescriptions] || 
                              domainSpecificDescriptions.general;
    const typeDescriptions = domainDescriptions[node.type as keyof typeof domainDescriptions] || 
                            domainDescriptions.data;
    
    // Return a random description from the available ones
    return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
  };
  
  // Get conceptual connections from API
  const conceptConnections = useConceptualConnections();
  
  // Fetch new connections when domain changes
  useEffect(() => {
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
          nodeColor = domainConfig.accentColor || 'rgba(139, 92, 246, 0.8)';
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
          color: nodeColor
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
  }, [conceptConnections.data, domainConfig]);
  
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
  
  // Render the neural network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate actual positions based on percentage
    const calculateActualPosition = (node: DataNode) => {
      return {
        x: (node.x / 100) * canvas.width,
        y: (node.y / 100) * canvas.height
      };
    };
    
    // Draw connections
    connections.forEach(conn => {
      const sourceNode = nodes.find(n => n.id === conn.source);
      const targetNode = nodes.find(n => n.id === conn.target);
      
      if (!sourceNode || !targetNode) return;
      
      const sourcePos = calculateActualPosition(sourceNode);
      const targetPos = calculateActualPosition(targetNode);
      
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      
      // Curved connections for more organic feel
      if (sourceNode.type !== targetNode.type) {
        const cp1x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.4;
        const cp1y = sourcePos.y;
        const cp2x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.6;
        const cp2y = targetPos.y;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetPos.x, targetPos.y);
      } else {
        ctx.lineTo(targetPos.x, targetPos.y);
      }
      
      // Connection styling based on state
      const isHighlighted = activeNodeId && 
        (conn.source === activeNodeId || conn.target === activeNodeId);
      
      if (isHighlighted) {
        ctx.strokeStyle = domainConfig.accentColor;
        ctx.lineWidth = 2 * conn.strength;
      } else if (conn.active) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + conn.strength * 0.3})`;
        ctx.lineWidth = 1 * conn.strength;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
      }
      
      ctx.stroke();
      
      // Draw data flow particles on active connections
      if (conn.active || isHighlighted) {
        const numParticles = Math.floor(conn.strength * 3);
        const now = Date.now();
        
        for (let i = 0; i < numParticles; i++) {
          // Calculate particle position along the connection line
          const t = ((now / 1000) + (i / numParticles)) % 1;
          let particleX, particleY;
          
          if (sourceNode.type !== targetNode.type) {
            // For bezier curves
            const cp1x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.4;
            const cp1y = sourcePos.y;
            const cp2x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.6;
            const cp2y = targetPos.y;
            
            // Calculate point on bezier curve
            const mt = 1 - t;
            const mt2 = mt * mt;
            const mt3 = mt2 * mt;
            const t2 = t * t;
            const t3 = t2 * t;
            
            particleX = mt3 * sourcePos.x + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t3 * targetPos.x;
            particleY = mt3 * sourcePos.y + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * targetPos.y;
          } else {
            // For straight lines
            particleX = sourcePos.x + (targetPos.x - sourcePos.x) * t;
            particleY = sourcePos.y + (targetPos.y - sourcePos.y) * t;
          }
          
          // Draw the particle
          ctx.beginPath();
          ctx.arc(particleX, particleY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = isHighlighted ? domainConfig.accentColor : 'rgba(255, 255, 255, 0.7)';
          ctx.fill();
        }
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      const { x, y } = calculateActualPosition(node);
      
      ctx.beginPath();
      ctx.arc(x, y, node.size, 0, Math.PI * 2);
      
      const isActive = node.id === activeNodeId;
      const nodeColor = isActive 
        ? domainConfig.accentColor
        : node.color;
      
      // Node glow effect
      if (isActive) {
        ctx.shadowColor = domainConfig.accentColor;
        ctx.shadowBlur = 15;
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.fillStyle = nodeColor;
      ctx.fill();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Pulse effect for highlighted node
      if (isActive) {
        ctx.beginPath();
        ctx.arc(x, y, node.size + 5 + Math.sin(Date.now() / 200) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = domainConfig.accentColor;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
    
    // Animation loop with better performance
    const animate = () => {
      // Use a less frequent animation frame for smoother performance
      const now = Date.now();
      const lastTime = animationRef.current || 0;
      
      // Limit to maximum of 30fps for smoother, less erratic animation
      if (now - lastTime < 33) {  // ~30fps
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Store current time for throttling
      animationRef.current = now;
      
      // We only need to redraw if there are active connections or a highlighted node
      if (connections.some(c => c.active) || activeNodeId) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        connections.forEach(conn => {
          const sourceNode = nodes.find(n => n.id === conn.source);
          const targetNode = nodes.find(n => n.id === conn.target);
          
          if (!sourceNode || !targetNode) return;
          
          const sourcePos = calculateActualPosition(sourceNode);
          const targetPos = calculateActualPosition(targetNode);
          
          ctx.beginPath();
          ctx.moveTo(sourcePos.x, sourcePos.y);
          
          // Curved connections for more organic feel
          if (sourceNode.type !== targetNode.type) {
            const cp1x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.4;
            const cp1y = sourcePos.y;
            const cp2x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.6;
            const cp2y = targetPos.y;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetPos.x, targetPos.y);
          } else {
            ctx.lineTo(targetPos.x, targetPos.y);
          }
          
          // Connection styling based on state
          const isHighlighted = activeNodeId && 
            (conn.source === activeNodeId || conn.target === activeNodeId);
          
          if (isHighlighted) {
            ctx.strokeStyle = domainConfig.accentColor;
            ctx.lineWidth = 2 * conn.strength;
          } else if (conn.active) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + conn.strength * 0.3})`;
            ctx.lineWidth = 1 * conn.strength;
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 0.5;
          }
          
          ctx.stroke();
          
          // Data flow particles - only on active connections
          if (showDataFlow && (conn.active || isHighlighted)) {
            // Extract data flow animation to separate function
            drawDataFlowParticles(conn, sourcePos, targetPos, sourceNode, targetNode, isHighlighted, ctx);
          }
        });
        
        // Draw nodes
        nodes.forEach(node => {
          const { x, y } = calculateActualPosition(node);
          
          ctx.beginPath();
          ctx.arc(x, y, node.size, 0, Math.PI * 2);
          
          const isActive = node.id === activeNodeId;
          const nodeColor = isActive 
            ? domainConfig.accentColor
            : node.color;
          
          // Node glow effect
          if (isActive) {
            ctx.shadowColor = domainConfig.accentColor;
            ctx.shadowBlur = 15;
          } else {
            ctx.shadowBlur = 0;
          }
          
          ctx.fillStyle = nodeColor;
          ctx.fill();
          
          // Reset shadow
          ctx.shadowBlur = 0;
          
          // Pulse effect for highlighted node - use a slower animation speed
          if (isActive) {
            ctx.beginPath();
            ctx.arc(x, y, node.size + 5 + Math.sin(now / 400) * 3, 0, Math.PI * 2);
            ctx.strokeStyle = domainConfig.accentColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }
      
      requestAnimationFrame(animate);
    };
    
    // Helper function to draw data flow particles
    const drawDataFlowParticles = (
      conn: Connection, 
      sourcePos: {x: number, y: number}, 
      targetPos: {x: number, y: number},
      sourceNode: DataNode,
      targetNode: DataNode,
      isHighlighted: boolean,
      ctx: CanvasRenderingContext2D
    ) => {
      // Calculate the number of particles based on connection strength
      // Reduce number of particles for performance
      const numParticles = Math.min(Math.floor(conn.strength * 2) + 1, 2);
      
      for (let i = 0; i < numParticles; i++) {
        // Each particle has a different phase
        const phase = ((Date.now() / 1000) + (i / numParticles)) % 1;
        
        // Calculate particle position along the path
        let particleX, particleY;
        const t = phase;
        
        if (sourceNode.type !== targetNode.type) {
          // For curved connections, use Bezier formula
          const cp1x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.4;
          const cp1y = sourcePos.y;
          const cp2x = sourcePos.x + (targetPos.x - sourcePos.x) * 0.6;
          const cp2y = targetPos.y;
          
          const mt = 1 - t;
          const mt2 = mt * mt;
          const mt3 = mt2 * mt;
          const t2 = t * t;
          const t3 = t2 * t;
          
          particleX = mt3 * sourcePos.x + 3 * mt2 * t * cp1x + 3 * mt * t2 * cp2x + t3 * targetPos.x;
          particleY = mt3 * sourcePos.y + 3 * mt2 * t * cp1y + 3 * mt * t2 * cp2y + t3 * targetPos.y;
        } else {
          // For straight lines
          particleX = sourcePos.x + (targetPos.x - sourcePos.x) * t;
          particleY = sourcePos.y + (targetPos.y - sourcePos.y) * t;
        }
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(particleX, particleY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? domainConfig.accentColor : 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      }
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [nodes, connections, activeNodeId, dimensions, domainConfig]);
  
  // Generate node details based on the active node
  useEffect(() => {
    if (!activeNodeId || !showNodeDetails) {
      setIsDetailsPanelVisible(false);
      setActiveNodeDetails(null);
      return;
    }
    
    const activeNode = nodes.find(node => node.id === activeNodeId);
    if (!activeNode) return;
    
    // Get connected nodes
    const connectedNodeIds = connections
      .filter(conn => conn.source === activeNodeId || conn.target === activeNodeId)
      .map(conn => conn.source === activeNodeId ? conn.target : conn.source);
    
    const connectedNodes = nodes.filter(node => connectedNodeIds.includes(node.id));
    
    // Generate details based on node type and domain
    const getNodeDescription = (node: DataNode) => {
      const domainSpecificDescriptions = {
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
      
      const descriptions = domainSpecificDescriptions[domain][node.type];
      const randomIndex = Math.floor(Math.random() * descriptions.length);
      return descriptions[randomIndex];
    };
    
    // Generate related concepts from connected nodes
    const relatedConcepts = connectedNodes
      .filter(node => node.label)
      .map(node => node.label);
    
    // Create node details
    const details: NodeDetail = {
      description: getNodeDescription(activeNode),
      relatedConcepts: relatedConcepts,
      importance: 60 + Math.floor(Math.random() * 40), // 60-100 range
      confidence: 70 + Math.floor(Math.random() * 30)  // 70-100 range
    };
    
    setActiveNodeDetails(details);
    setIsDetailsPanelVisible(true);
  }, [activeNodeId, nodes, connections, domain, showNodeDetails]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
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
  }, [nodes, connections, zoomLevel, onNodeSelect]);
  
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
  
  const handleReset = useCallback(() => {
    setZoomLevel(1);
    setActiveNodeId(null);
    setShowLabels(false);
    setIsDetailsPanelVisible(false);
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
        "relative w-full h-full min-h-[300px] bg-black bg-opacity-20 rounded-lg overflow-hidden backdrop-blur-sm",
        className
      )}
    >
      {conceptConnections.isPending ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-white/80">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: domainConfig.accentColor }} />
            <span className="text-sm">Generating neural connections...</span>
          </div>
        </div>
      ) : (
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
      
      {/* Node Details Panel */}
      <AnimatePresence>
        {isDetailsPanelVisible && activeNodeDetails && activeNodeId && showNodeDetails && (
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
                      ? domainConfig.accentColor 
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
                          backgroundColor: domainConfig.accentColor
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
                          backgroundColor: domainConfig.gradientFrom || domainConfig.accentColor
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

      {/* Immersive Controls */}
      <div className="absolute top-3 left-3 z-10">
        <ImmersiveControls
          onToggleFullscreen={handleToggleFullscreen}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onToggleLabels={handleToggleLabels}
          onToggleDataFlow={handleToggleDataFlow}
          onReset={handleReset}
          isFullscreen={isFullscreen}
          showLabels={showLabels}
          showDataFlow={showDataFlow}
          className={isFullscreen ? "opacity-20 hover:opacity-100 transition-opacity" : ""}
        />
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-4 text-xs text-white/70">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
          <span>Human Intelligence</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domainConfig.accentColor }} />
          <span>AI Processing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500/60" />
          <span>Data Exchange</span>
        </div>
      </div>
    </div>
  );
}