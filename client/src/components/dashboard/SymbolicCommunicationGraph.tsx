/**
 * SymbolicCommunicationGraph Component
 * 
 * This component visualizes the flow and patterns of symbolic communications
 * throughout the system, highlighting communication channels between agents.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, ZoomIn, ZoomOut, Download, Info, Filter, ArrowUpDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface Symbol {
  id: string;
  type: string;
  value: string;
  description: string;
  usageCount: number;
  contextTags: string[];
}

interface SymbolicMessage {
  id: string;
  timestamp: string;
  sourceAgent: string;
  targetAgent: string;
  content: string;
  symbols: string[];
  domain: string;
  timeline: string;
  priority: number;
  status: 'sent' | 'received' | 'processed' | 'error';
}

interface AgentCommunicationStats {
  agentId: string;
  agentName: string;
  messagesSent: number;
  messagesReceived: number;
  symbolsUsed: number;
  domains: {
    [key: string]: number;
  };
  mostUsedSymbols: {
    symbolId: string;
    count: number;
  }[];
}

interface SymbolicCommunicationData {
  symbols: Symbol[];
  recentMessages: SymbolicMessage[];
  agentStats: AgentCommunicationStats[];
  globalStats: {
    totalMessages: number;
    uniqueSymbols: number;
    topSymbols: {
      symbolId: string;
      count: number;
    }[];
    domainDistribution: {
      domain: string;
      count: number;
    }[];
    timelineDistribution: {
      timeline: string;
      count: number;
    }[];
  };
}

export function SymbolicCommunicationGraph() {
  const [data, setData] = useState<SymbolicCommunicationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<string>('graph');
  const [timeRange, setTimeRange] = useState<string>('1h');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [edgeThreshold, setEdgeThreshold] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    fetchSymbolicCommunicationData();
    const interval = setInterval(fetchSymbolicCommunicationData, 10000);
    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [timeRange, domainFilter, timelineFilter]);

  useEffect(() => {
    if (data && canvasRef.current && viewMode === 'graph') {
      renderCommunicationGraph();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, viewMode, zoomLevel, selectedAgentId, selectedSymbolId, showLabels, edgeThreshold]);

  const fetchSymbolicCommunicationData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/symbolic-communication?timeRange=${timeRange}&domain=${domainFilter}&timeline=${timelineFilter}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch symbolic communication data: ${response.status}`);
      }
      
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching symbolic communication data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Sample data for development
      setData({
        symbols: [
          {
            id: 'symbol-1',
            type: 'context',
            value: '[QUANTUM_STATE: SIM_FLOW]',
            description: 'Indicates the system is operating in simulation context with full alignment',
            usageCount: 248,
            contextTags: ['simulation', 'flow', 'alignment']
          },
          {
            id: 'symbol-2',
            type: 'signal',
            value: '🥶',
            description: 'Logic Lockdown - Stop and reflect signal',
            usageCount: 32,
            contextTags: ['error-prevention', 'critical-decision']
          },
          {
            id: 'symbol-3',
            type: 'signal',
            value: '♻️',
            description: 'Refresh Signal - Try a better approach signal',
            usageCount: 47,
            contextTags: ['optimization', 'alternative-approach']
          },
          {
            id: 'symbol-4',
            type: 'log',
            value: '⚽️',
            description: 'Symbolic logging marker for quantum chunks',
            usageCount: 187,
            contextTags: ['logging', 'tracing', 'debugging']
          },
          {
            id: 'symbol-5',
            type: 'timeline',
            value: 'α',
            description: 'Primary timeline indicator',
            usageCount: 201,
            contextTags: ['timeline', 'primary']
          },
          {
            id: 'symbol-6',
            type: 'timeline',
            value: 'β',
            description: 'Secondary alternative timeline indicator',
            usageCount: 58,
            contextTags: ['timeline', 'alternative']
          }
        ],
        recentMessages: [
          {
            id: 'msg-1',
            timestamp: '2025-03-25T09:49:15Z',
            sourceAgent: 'dream-state-wilton-ai',
            targetAgent: 'loki-reflective-mirror-ai',
            content: '[QUANTUM_STATE: SIM_FLOW] Generated alternative approaches (3) for database optimization',
            symbols: ['symbol-1', 'symbol-5'],
            domain: 'database',
            timeline: 'α',
            priority: 7,
            status: 'received'
          },
          {
            id: 'msg-2',
            timestamp: '2025-03-25T09:49:45Z',
            sourceAgent: 'loki-reflective-mirror-ai',
            targetAgent: 'quantum-coordinator',
            content: '[QUANTUM_STATE: SIM_FLOW] ⚽️ Validated quality of generated alternatives with 92% confidence',
            symbols: ['symbol-1', 'symbol-4', 'symbol-5'],
            domain: 'database',
            timeline: 'α',
            priority: 7,
            status: 'processed'
          },
          {
            id: 'msg-3',
            timestamp: '2025-03-25T09:48:05Z',
            sourceAgent: 'chronos-kairos-agent',
            targetAgent: 'dream-state-wilton-ai',
            content: '[QUANTUM_STATE: SIM_FLOW] Scheduled processing for UI component alternatives',
            symbols: ['symbol-1', 'symbol-5'],
            domain: 'frontend',
            timeline: 'α',
            priority: 5,
            status: 'processed'
          },
          {
            id: 'msg-4',
            timestamp: '2025-03-25T09:50:10Z',
            sourceAgent: 'true-index-analyst',
            targetAgent: 'quantum-coordinator',
            content: '[QUANTUM_STATE: SIM_FLOW] 🥶 Security vulnerability detected in authentication implementation',
            symbols: ['symbol-1', 'symbol-2', 'symbol-6'],
            domain: 'security',
            timeline: 'β',
            priority: 9,
            status: 'processed'
          },
          {
            id: 'msg-5',
            timestamp: '2025-03-25T09:47:30Z',
            sourceAgent: 'symbolic-interpreter',
            targetAgent: 'quantum-coordinator',
            content: '[QUANTUM_STATE: SIM_FLOW] ⚽️ Extracted patterns from recent symbolic communications',
            symbols: ['symbol-1', 'symbol-4', 'symbol-5'],
            domain: 'system',
            timeline: 'α',
            priority: 4,
            status: 'processed'
          },
          {
            id: 'msg-6',
            timestamp: '2025-03-25T09:48:35Z',
            sourceAgent: 'quantum-coordinator',
            targetAgent: 'dream-state-wilton-ai',
            content: '[QUANTUM_STATE: SIM_FLOW] ♻️ Error in API implementation, requesting alternative approach',
            symbols: ['symbol-1', 'symbol-3', 'symbol-6'],
            domain: 'backend',
            timeline: 'β',
            priority: 6,
            status: 'sent'
          },
          {
            id: 'msg-7',
            timestamp: '2025-03-25T09:49:25Z',
            sourceAgent: 'dream-state-wilton-ai',
            targetAgent: 'quantum-coordinator',
            content: '[QUANTUM_STATE: SIM_FLOW] ⚽️ Generated alternative API implementation with error handling',
            symbols: ['symbol-1', 'symbol-4', 'symbol-6'],
            domain: 'backend',
            timeline: 'β',
            priority: 6,
            status: 'received'
          },
          {
            id: 'msg-8',
            timestamp: '2025-03-25T09:49:55Z',
            sourceAgent: 'symbolic-interpreter',
            targetAgent: 'true-index-analyst',
            content: '[QUANTUM_STATE: SIM_FLOW] Symbolic pattern identified: increasing signal frequency in security domain',
            symbols: ['symbol-1', 'symbol-6'],
            domain: 'security',
            timeline: 'β',
            priority: 8,
            status: 'sent'
          }
        ],
        agentStats: [
          {
            agentId: 'dream-state-wilton-ai',
            agentName: 'Dream-State Wilton AI',
            messagesSent: 15,
            messagesReceived: 8,
            symbolsUsed: 42,
            domains: {
              'database': 6,
              'frontend': 4,
              'backend': 5
            },
            mostUsedSymbols: [
              { symbolId: 'symbol-1', count: 15 },
              { symbolId: 'symbol-4', count: 9 },
              { symbolId: 'symbol-5', count: 10 }
            ]
          },
          {
            agentId: 'loki-reflective-mirror-ai',
            agentName: 'Loki Reflective Mirror AI',
            messagesSent: 12,
            messagesReceived: 16,
            symbolsUsed: 35,
            domains: {
              'database': 8,
              'security': 4
            },
            mostUsedSymbols: [
              { symbolId: 'symbol-1', count: 12 },
              { symbolId: 'symbol-4', count: 7 },
              { symbolId: 'symbol-5', count: 8 }
            ]
          },
          {
            agentId: 'chronos-kairos-agent',
            agentName: 'Chronos/Kairos Temporal Agent',
            messagesSent: 20,
            messagesReceived: 5,
            symbolsUsed: 48,
            domains: {
              'database': 4,
              'frontend': 6,
              'backend': 5,
              'system': 5
            },
            mostUsedSymbols: [
              { symbolId: 'symbol-1', count: 20 },
              { symbolId: 'symbol-5', count: 14 },
              { symbolId: 'symbol-6', count: 6 }
            ]
          },
          {
            agentId: 'quantum-coordinator',
            agentName: 'Quantum Coordinator',
            messagesSent: 28,
            messagesReceived: 32,
            symbolsUsed: 85,
            domains: {
              'database': 10,
              'frontend': 8,
              'backend': 12,
              'security': 6,
              'system': 10
            },
            mostUsedSymbols: [
              { symbolId: 'symbol-1', count: 28 },
              { symbolId: 'symbol-4', count: 15 },
              { symbolId: 'symbol-3', count: 8 }
            ]
          },
          {
            agentId: 'symbolic-interpreter',
            agentName: 'Symbolic Interpreter',
            messagesSent: 18,
            messagesReceived: 12,
            symbolsUsed: 54,
            domains: {
              'system': 14,
              'security': 4
            },
            mostUsedSymbols: [
              { symbolId: 'symbol-1', count: 18 },
              { symbolId: 'symbol-4', count: 12 },
              { symbolId: 'symbol-5', count: 10 }
            ]
          },
          {
            agentId: 'true-index-analyst',
            agentName: 'True-Index Analyst',
            messagesSent: 10,
            messagesReceived: 15,
            symbolsUsed: 36,
            domains: {
              'security': 8,
              'system': 6,
              'database': 4
            },
            mostUsedSymbols: [
              { symbolId: 'symbol-1', count: 10 },
              { symbolId: 'symbol-2', count: 7 },
              { symbolId: 'symbol-6', count: 6 }
            ]
          }
        ],
        globalStats: {
          totalMessages: 103,
          uniqueSymbols: 6,
          topSymbols: [
            { symbolId: 'symbol-1', count: 103 },
            { symbolId: 'symbol-5', count: 70 },
            { symbolId: 'symbol-4', count: 54 },
            { symbolId: 'symbol-6', count: 30 },
            { symbolId: 'symbol-3', count: 24 },
            { symbolId: 'symbol-2', count: 15 }
          ],
          domainDistribution: [
            { domain: 'database', count: 32 },
            { domain: 'system', count: 25 },
            { domain: 'backend', count: 18 },
            { domain: 'frontend', count: 16 },
            { domain: 'security', count: 12 }
          ],
          timelineDistribution: [
            { timeline: 'α', count: 73 },
            { timeline: 'β', count: 30 }
          ]
        }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getAgentColor = (agentId: string) => {
    const colorMap: Record<string, string> = {
      'dream-state-wilton-ai': '#3b82f6', // blue-500
      'loki-reflective-mirror-ai': '#a855f7', // purple-500
      'chronos-kairos-agent': '#f59e0b', // amber-500
      'quantum-coordinator': '#0ea5e9', // sky-500
      'symbolic-interpreter': '#10b981', // emerald-500
      'true-index-analyst': '#64748b', // slate-500
    };
    
    return colorMap[agentId] || '#6b7280'; // gray-500 as default
  };

  const getSymbolColor = (symbolId: string) => {
    if (!data) return '#6b7280';
    
    const symbol = data.symbols.find(s => s.id === symbolId);
    if (!symbol) return '#6b7280';
    
    const typeColorMap: Record<string, string> = {
      'context': '#3b82f6', // blue-500
      'signal': '#f59e0b', // amber-500
      'log': '#10b981', // emerald-500
      'timeline': '#a855f7', // purple-500
    };
    
    return typeColorMap[symbol.type] || '#6b7280';
  };

  const getDomainColor = (domain: string) => {
    const colorMap: Record<string, string> = {
      'database': '#3b82f6', // blue-500
      'frontend': '#ec4899', // pink-500
      'backend': '#a855f7', // purple-500
      'security': '#ef4444', // red-500
      'system': '#10b981', // emerald-500
    };
    
    return colorMap[domain] || '#6b7280'; // gray-500 as default
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'sent': '#f59e0b', // amber-500
      'received': '#3b82f6', // blue-500
      'processed': '#10b981', // emerald-500
      'error': '#ef4444', // red-500
    };
    
    return colorMap[status] || '#6b7280'; // gray-500 as default
  };

  const renderCommunicationGraph = () => {
    if (!canvasRef.current || !data) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up graph parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7 * zoomLevel;
    
    // Get unique agent IDs
    const agents = data.agentStats;
    
    // Position agents in a circle
    const agentPositions: Record<string, { x: number, y: number }> = {};
    
    agents.forEach((agent, index) => {
      const angle = (2 * Math.PI * index) / agents.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      agentPositions[agent.agentId] = { x, y };
    });
    
    // Calculate message counts between agents for edge thickness
    const messageCounts: Record<string, number> = {};
    
    data.recentMessages.forEach(message => {
      const edgeKey = `${message.sourceAgent}-${message.targetAgent}`;
      messageCounts[edgeKey] = (messageCounts[edgeKey] || 0) + 1;
    });
    
    // Draw edges (connections between agents)
    Object.entries(messageCounts).forEach(([edge, count]) => {
      if (count < edgeThreshold) return;
      
      const [sourceId, targetId] = edge.split('-');
      const sourcePos = agentPositions[sourceId];
      const targetPos = agentPositions[targetId];
      
      if (!sourcePos || !targetPos) return;
      
      // Skip if either agent is not selected (when there's a selection)
      if (selectedAgentId && sourceId !== selectedAgentId && targetId !== selectedAgentId) {
        return;
      }
      
      // Calculate edge thickness based on message count
      const maxCount = Math.max(...Object.values(messageCounts));
      const minThickness = 1;
      const maxThickness = 8;
      const thickness = minThickness + ((count / maxCount) * (maxThickness - minThickness));
      
      // Draw the edge
      const isSelectedEdge = selectedAgentId && (sourceId === selectedAgentId || targetId === selectedAgentId);
      
      ctx.beginPath();
      ctx.strokeStyle = isSelectedEdge ? '#000000' : '#d1d5db'; // gray-300
      ctx.lineWidth = thickness;
      
      // Calculate control point for the curve
      const midX = (sourcePos.x + targetPos.x) / 2;
      const midY = (sourcePos.y + targetPos.y) / 2;
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const normalX = -dy * 0.2;
      const normalY = dx * 0.2;
      
      // Draw curved path
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.quadraticCurveTo(midX + normalX, midY + normalY, targetPos.x, targetPos.y);
      ctx.stroke();
      
      // Draw arrow
      const arrowSize = 5 + thickness / 2;
      const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x);
      
      ctx.beginPath();
      ctx.fillStyle = isSelectedEdge ? '#000000' : '#d1d5db';
      
      // Get the end point along the curve
      const t = 0.9; // Position along the curve (0-1)
      const arrowX = (1 - t) * (1 - t) * sourcePos.x + 2 * (1 - t) * t * (midX + normalX) + t * t * targetPos.x;
      const arrowY = (1 - t) * (1 - t) * sourcePos.y + 2 * (1 - t) * t * (midY + normalY) + t * t * targetPos.y;
      
      // Calculate the tangent at that point
      const tangentX = 2 * (1 - t) * (midX + normalX - sourcePos.x) + 2 * t * (targetPos.x - (midX + normalX));
      const tangentY = 2 * (1 - t) * (midY + normalY - sourcePos.y) + 2 * t * (targetPos.y - (midY + normalY));
      const arrowAngle = Math.atan2(tangentY, tangentX);
      
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
        arrowY - arrowSize * Math.sin(arrowAngle - Math.PI / 6)
      );
      ctx.lineTo(
        arrowX - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
        arrowY - arrowSize * Math.sin(arrowAngle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      
      // Add the message count label if showLabels is true
      if (showLabels && count >= edgeThreshold) {
        const labelX = midX + normalX;
        const labelY = midY + normalY;
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(labelX, labelY, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(count.toString(), labelX, labelY);
      }
    });
    
    // Draw agent nodes
    Object.entries(agentPositions).forEach(([agentId, position]) => {
      const agent = data!.agentStats.find(a => a.agentId === agentId);
      if (!agent) return;
      
      // Skip if not the selected agent (when there's a selection)
      if (selectedAgentId && agentId !== selectedAgentId) {
        ctx.globalAlpha = 0.3;
      } else {
        ctx.globalAlpha = 1.0;
      }
      
      const nodeRadius = 30 * zoomLevel;
      
      // Draw circular node
      ctx.beginPath();
      ctx.fillStyle = getAgentColor(agentId);
      ctx.strokeStyle = selectedAgentId === agentId ? '#000000' : '#ffffff';
      ctx.lineWidth = selectedAgentId === agentId ? 3 : 1;
      ctx.arc(position.x, position.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Add activity indicators
      const messagesTotal = agent.messagesSent + agent.messagesReceived;
      
      // Draw activity indicator (outer ring)
      if (messagesTotal > 0) {
        const maxMessages = Math.max(...data!.agentStats.map(a => a.messagesSent + a.messagesReceived));
        const minSize = 2;
        const maxSize = 6;
        const ringSize = minSize + ((messagesTotal / maxMessages) * (maxSize - minSize));
        
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = ringSize;
        ctx.arc(position.x, position.y, nodeRadius + ringSize / 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw agent label if showLabels is true
      if (showLabels) {
        const labelText = agent.agentName.split('/')[0]; // Simplify name if needed
        
        ctx.font = `${12 * zoomLevel}px sans-serif`;
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText(labelText, position.x, position.y);
        
        // Add stats below
        ctx.font = `${9 * zoomLevel}px sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${agent.messagesSent}↑ ${agent.messagesReceived}↓`, position.x, position.y + nodeRadius + 15);
      }
      
      ctx.globalAlpha = 1.0;
    });
    
    // Draw symbol nodes if a specific symbol is selected
    if (selectedSymbolId) {
      const symbol = data.symbols.find(s => s.id === selectedSymbolId);
      if (symbol) {
        const symbolNodeRadius = 15 * zoomLevel;
        
        // For each agent, draw symbols they use
        data.agentStats.forEach(agent => {
          const position = agentPositions[agent.agentId];
          if (!position) return;
          
          // Check if this agent uses the selected symbol
          const symbolUsage = agent.mostUsedSymbols.find(s => s.symbolId === selectedSymbolId);
          if (!symbolUsage) return;
          
          // Position symbol nodes around agent nodes
          agent.mostUsedSymbols.forEach((symbolStat, index) => {
            if (symbolStat.symbolId !== selectedSymbolId) return;
            
            const symbolAngle = (2 * Math.PI * index) / agent.mostUsedSymbols.length;
            const distance = 40 * zoomLevel;
            const symbolX = position.x + distance * Math.cos(symbolAngle);
            const symbolY = position.y + distance * Math.sin(symbolAngle);
            
            // Draw symbol node
            ctx.beginPath();
            ctx.fillStyle = getSymbolColor(symbolStat.symbolId);
            ctx.arc(symbolX, symbolY, symbolNodeRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw connection line
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(209, 213, 219, 0.6)'; // gray-300 with transparency
            ctx.lineWidth = 1;
            ctx.moveTo(position.x, position.y);
            ctx.lineTo(symbolX, symbolY);
            ctx.stroke();
            
            // Draw usage count
            if (showLabels) {
              ctx.font = 'bold 10px sans-serif';
              ctx.fillStyle = '#ffffff';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(symbolStat.count.toString(), symbolX, symbolY);
            }
          });
        });
        
        // Draw selected symbol info at the top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(centerX - 150, 10, 300, 60);
        ctx.strokeStyle = getSymbolColor(selectedSymbolId);
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 150, 10, 300, 60);
        
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Symbol: ${symbol.value}`, centerX, 30);
        
        ctx.font = '12px sans-serif';
        ctx.fillText(`${symbol.description} (${symbol.usageCount} uses)`, centerX, 50);
      }
    }
  };

  const downloadGraphImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'symbolic-communication-graph.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) {
      return `${diffSec}s ago`;
    } else if (diffSec < 3600) {
      return `${Math.floor(diffSec / 60)}m ago`;
    } else if (diffSec < 86400) {
      return `${Math.floor(diffSec / 3600)}h ago`;
    } else {
      return `${Math.floor(diffSec / 86400)}d ago`;
    }
  };

  const getSymbolDisplayFromId = (symbolId: string) => {
    if (!data) return symbolId;
    const symbol = data.symbols.find(s => s.id === symbolId);
    return symbol ? symbol.value : symbolId;
  };

  const getSymbolTooltip = (symbolId: string) => {
    if (!data) return "";
    const symbol = data.symbols.find(s => s.id === symbolId);
    return symbol ? symbol.description : "";
  };

  const sortMessages = (messages: SymbolicMessage[]) => {
    return [...messages].sort((a, b) => {
      // Primary sort by the chosen field
      let comparison: number;
      
      switch (sortBy) {
        case 'timestamp':
          comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          break;
        case 'sourceAgent':
          comparison = a.sourceAgent.localeCompare(b.sourceAgent);
          break;
        case 'targetAgent':
          comparison = a.targetAgent.localeCompare(b.targetAgent);
          break;
        case 'domain':
          comparison = a.domain.localeCompare(b.domain);
          break;
        case 'priority':
          comparison = b.priority - a.priority;
          break;
        default:
          comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      
      // Apply sort order
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  };

  if (loading && !data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Symbolic Communication Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2">Loading symbolic communication data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Symbolic Communication Graph</CardTitle>
            <CardDescription>
              Visualization of agent communications and symbolic patterns
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select 
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">15m</SelectItem>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="6h">6h</SelectItem>
                <SelectItem value="24h">24h</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchSymbolicCommunicationData}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <div className="px-6 pt-0 pb-2">
        <Tabs defaultValue="graph" onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="graph">Graph</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="symbols">Symbols</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {viewMode === 'graph' && (
          <div className="relative">
            <div className="border rounded-md overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
              <canvas 
                ref={canvasRef} 
                className="w-full h-full"
                onClick={(e) => {
                  if (!canvasRef.current || !data) return;
                  
                  const rect = canvasRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  const centerX = canvasRef.current.width / 2;
                  const centerY = canvasRef.current.height / 2;
                  const radius = Math.min(centerX, centerY) * 0.7 * zoomLevel;
                  
                  // Check if we clicked on an agent node
                  let clickedAgentId: string | null = null;
                  const agents = data.agentStats;
                  const nodeRadius = 30 * zoomLevel;
                  
                  // Position agents in a circle
                  agents.forEach((agent, index) => {
                    const angle = (2 * Math.PI * index) / agents.length;
                    const agentX = centerX + radius * Math.cos(angle);
                    const agentY = centerY + radius * Math.sin(angle);
                    
                    const distance = Math.sqrt(Math.pow(x - agentX, 2) + Math.pow(y - agentY, 2));
                    if (distance <= nodeRadius) {
                      clickedAgentId = agent.agentId;
                    }
                  });
                  
                  // Toggle selection if the same agent, otherwise select new agent
                  if (clickedAgentId === selectedAgentId) {
                    setSelectedAgentId(null);
                  } else if (clickedAgentId) {
                    setSelectedAgentId(clickedAgentId);
                    setSelectedSymbolId(null);
                  }
                }}
              />
            </div>
            
            <div className="absolute top-3 right-3 flex flex-col space-y-2">
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background"
                        onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Zoom Out</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background"
                        onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Zoom In</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background"
                        onClick={downloadGraphImage}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Download</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="bg-white bg-opacity-90 p-3 rounded-md border space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-labels" className="text-xs">Show Labels</Label>
                  <Switch 
                    id="show-labels" 
                    checked={showLabels} 
                    onCheckedChange={setShowLabels}
                  />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edge-threshold" className="text-xs">Edge Threshold: {edgeThreshold}</Label>
                  </div>
                  <Slider 
                    id="edge-threshold"
                    min={1}
                    max={10}
                    step={1}
                    value={[edgeThreshold]}
                    onValueChange={(values) => setEdgeThreshold(values[0])}
                  />
                </div>
                
                {selectedAgentId && (
                  <div className="pt-1 border-t">
                    <div className="text-xs font-medium">Selected Agent:</div>
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: getAgentColor(selectedAgentId) }}
                      ></div>
                      <span className="text-xs">{data?.agentStats.find(a => a.agentId === selectedAgentId)?.agentName}</span>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs mt-1 p-0"
                      onClick={() => setSelectedAgentId(null)}
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
                
                {selectedSymbolId && (
                  <div className="pt-1 border-t">
                    <div className="text-xs font-medium">Selected Symbol:</div>
                    <div className="flex items-center mt-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: getSymbolColor(selectedSymbolId) }}
                      ></div>
                      <span className="text-xs">{data?.symbols.find(s => s.id === selectedSymbolId)?.value}</span>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs mt-1 p-0"
                      onClick={() => setSelectedSymbolId(null)}
                    >
                      Clear Selection
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute bottom-3 left-3">
              <div className="bg-white bg-opacity-90 p-2 rounded text-xs border max-w-xs">
                <div className="font-medium mb-1">Agent Legend:</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {data?.agentStats.map(agent => (
                    <div 
                      key={agent.agentId} 
                      className="flex items-center cursor-pointer"
                      onClick={() => setSelectedAgentId(agent.agentId === selectedAgentId ? null : agent.agentId)}
                    >
                      <div 
                        className={`w-3 h-3 rounded-full mr-1 ${selectedAgentId === agent.agentId ? 'ring-2 ring-black' : ''}`}
                        style={{ backgroundColor: getAgentColor(agent.agentId) }}
                      ></div>
                      <span className={`truncate ${selectedAgentId === agent.agentId ? 'font-medium' : ''}`}>
                        {agent.agentName.length > 15 ? `${agent.agentName.substring(0, 15)}...` : agent.agentName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'messages' && data && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="domain-filter" className="text-sm">Domain:</Label>
                <Select 
                  id="domain-filter"
                  value={domainFilter}
                  onValueChange={setDomainFilter}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {data.globalStats.domainDistribution.map(domain => (
                      <SelectItem key={domain.domain} value={domain.domain}>{domain.domain}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Label htmlFor="timeline-filter" className="text-sm">Timeline:</Label>
                <Select 
                  id="timeline-filter"
                  value={timelineFilter}
                  onValueChange={setTimelineFilter}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {data.globalStats.timelineDistribution.map(timeline => (
                      <SelectItem key={timeline.timeline} value={timeline.timeline}>{timeline.timeline}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select 
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timestamp">Time</SelectItem>
                    <SelectItem value="sourceAgent">Source</SelectItem>
                    <SelectItem value="targetAgent">Target</SelectItem>
                    <SelectItem value="domain">Domain</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="border rounded-md" style={{ height: 'calc(100vh - 330px)', minHeight: '400px' }}>
              <div className="p-2 space-y-3">
                {sortMessages(data.recentMessages)
                  .filter(message => {
                    // Apply domain filter
                    if (domainFilter !== 'all' && message.domain !== domainFilter) {
                      return false;
                    }
                    
                    // Apply timeline filter
                    if (timelineFilter !== 'all' && message.timeline !== timelineFilter) {
                      return false;
                    }
                    
                    // Apply agent filter if any
                    if (selectedAgentId && message.sourceAgent !== selectedAgentId && message.targetAgent !== selectedAgentId) {
                      return false;
                    }
                    
                    // Apply symbol filter if any
                    if (selectedSymbolId && !message.symbols.includes(selectedSymbolId)) {
                      return false;
                    }
                    
                    return true;
                  })
                  .map(message => (
                    <div 
                      key={message.id} 
                      className="border rounded-md p-4 hover:bg-muted/50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getAgentColor(message.sourceAgent) }}
                            ></div>
                            <span className="font-medium">
                              {data.agentStats.find(a => a.agentId === message.sourceAgent)?.agentName || message.sourceAgent}
                            </span>
                            <span className="mx-2 text-muted-foreground">→</span>
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getAgentColor(message.targetAgent) }}
                            ></div>
                            <span>
                              {data.agentStats.find(a => a.agentId === message.targetAgent)?.agentName || message.targetAgent}
                            </span>
                          </div>
                          
                          <div className="flex mt-1 space-x-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: getDomainColor(message.domain), color: getDomainColor(message.domain) }}
                            >
                              {message.domain}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: message.timeline === 'α' ? '#8b5cf6' : '#06b6d4', color: message.timeline === 'α' ? '#8b5cf6' : '#06b6d4' }}
                            >
                              Timeline: {message.timeline}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: getStatusColor(message.status), color: getStatusColor(message.status) }}
                            >
                              {message.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(message.timestamp)}
                          </span>
                          <Badge className="mt-1">Priority: {message.priority}</Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-2 bg-muted/30 p-2 rounded">{message.content}</p>
                      
                      {message.symbols.length > 0 && (
                        <div className="flex flex-wrap mt-2 gap-1">
                          <span className="text-xs text-muted-foreground mr-1">Symbols:</span>
                          {message.symbols.map(symbolId => (
                            <TooltipProvider key={symbolId}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs cursor-pointer"
                                    style={{ 
                                      borderColor: getSymbolColor(symbolId), 
                                      color: getSymbolColor(symbolId),
                                      backgroundColor: selectedSymbolId === symbolId ? `${getSymbolColor(symbolId)}20` : undefined 
                                    }}
                                    onClick={() => setSelectedSymbolId(selectedSymbolId === symbolId ? null : symbolId)}
                                  >
                                    {getSymbolDisplayFromId(symbolId)}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{getSymbolTooltip(symbolId)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                
                {sortMessages(data.recentMessages)
                  .filter(message => {
                    if (domainFilter !== 'all' && message.domain !== domainFilter) {
                      return false;
                    }
                    if (timelineFilter !== 'all' && message.timeline !== timelineFilter) {
                      return false;
                    }
                    if (selectedAgentId && message.sourceAgent !== selectedAgentId && message.targetAgent !== selectedAgentId) {
                      return false;
                    }
                    if (selectedSymbolId && !message.symbols.includes(selectedSymbolId)) {
                      return false;
                    }
                    return true;
                  }).length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    No messages match the current filters
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
        
        {viewMode === 'symbols' && data && (
          <div className="space-y-4">
            <ScrollArea className="border rounded-md" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.symbols.map(symbol => (
                  <div 
                    key={symbol.id} 
                    className={`border rounded-md p-4 hover:bg-muted/50 cursor-pointer ${selectedSymbolId === symbol.id ? 'bg-muted border-primary' : ''}`}
                    onClick={() => setSelectedSymbolId(selectedSymbolId === symbol.id ? null : symbol.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: getSymbolColor(symbol.id) }}
                        >
                          <span className="text-white font-bold">{symbol.type.charAt(0).toUpperCase()}</span>
                        </div>
                        
                        <div>
                          <div className="font-medium flex items-center">
                            <span className="text-lg">{symbol.value}</span>
                            <Badge className="ml-2">{symbol.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{symbol.description}</p>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className="whitespace-nowrap">
                        {symbol.usageCount} uses
                      </Badge>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex flex-wrap gap-1">
                        {symbol.contextTags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {selectedSymbolId === symbol.id && (
                      <div className="mt-3 pt-3 border-t">
                        <h4 className="text-sm font-medium mb-2">Top Users:</h4>
                        <div className="space-y-2">
                          {data.agentStats
                            .filter(agent => agent.mostUsedSymbols.some(s => s.symbolId === symbol.id))
                            .sort((a, b) => {
                              const aCount = a.mostUsedSymbols.find(s => s.symbolId === symbol.id)?.count || 0;
                              const bCount = b.mostUsedSymbols.find(s => s.symbolId === symbol.id)?.count || 0;
                              return bCount - aCount;
                            })
                            .slice(0, 3)
                            .map(agent => {
                              const symbolUsage = agent.mostUsedSymbols.find(s => s.symbolId === symbol.id);
                              return (
                                <div key={agent.agentId} className="flex justify-between">
                                  <div className="flex items-center">
                                    <div 
                                      className="w-3 h-3 rounded-full mr-2"
                                      style={{ backgroundColor: getAgentColor(agent.agentId) }}
                                    ></div>
                                    <span className="text-sm">{agent.agentName}</span>
                                  </div>
                                  <span className="text-sm">{symbolUsage?.count || 0} uses</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        {viewMode === 'stats' && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Global Statistics</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-md p-3 text-center">
                    <div className="text-sm text-muted-foreground">Total Messages</div>
                    <div className="text-2xl font-bold">{data.globalStats.totalMessages}</div>
                  </div>
                  <div className="bg-muted/30 rounded-md p-3 text-center">
                    <div className="text-sm text-muted-foreground">Unique Symbols</div>
                    <div className="text-2xl font-bold">{data.globalStats.uniqueSymbols}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Symbols</h4>
                  <div className="space-y-2">
                    {data.globalStats.topSymbols.map(symbol => {
                      const symbolData = data.symbols.find(s => s.id === symbol.symbolId);
                      if (!symbolData) return null;
                      
                      const maxCount = data.globalStats.topSymbols[0]?.count || 0;
                      const percentage = (symbol.count / maxCount) * 100;
                      
                      return (
                        <div key={symbol.symbolId} className="flex items-center">
                          <div className="w-24 truncate font-mono text-xs">{symbolData.value}</div>
                          <div className="w-full ml-2">
                            <div className="w-full bg-muted h-2 rounded-full">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  backgroundColor: getSymbolColor(symbol.symbolId),
                                  width: `${percentage}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="ml-2 text-sm">{symbol.count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Domain Distribution</h4>
                    <div className="space-y-2">
                      {data.globalStats.domainDistribution.map(domain => (
                        <div key={domain.domain} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: getDomainColor(domain.domain) }}
                          ></div>
                          <div className="text-sm">{domain.domain}</div>
                          <div className="ml-auto text-sm">{domain.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Timeline Distribution</h4>
                    <div className="space-y-2">
                      {data.globalStats.timelineDistribution.map(timeline => (
                        <div key={timeline.timeline} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: timeline.timeline === 'α' ? '#8b5cf6' : '#06b6d4' }}
                          ></div>
                          <div className="text-sm">Timeline {timeline.timeline}</div>
                          <div className="ml-auto text-sm">{timeline.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Agent Statistics</h3>
              <ScrollArea className="h-[calc(100vh-360px)]">
                <div className="space-y-4">
                  {data.agentStats.map(agent => (
                    <div 
                      key={agent.agentId} 
                      className={`border rounded-md p-3 ${selectedAgentId === agent.agentId ? 'bg-muted/30 border-primary' : ''}`}
                      onClick={() => setSelectedAgentId(selectedAgentId === agent.agentId ? null : agent.agentId)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: getAgentColor(agent.agentId) }}
                          ></div>
                          <h4 className="font-medium">{agent.agentName}</h4>
                        </div>
                        <Badge variant="outline">{agent.messagesSent + agent.messagesReceived} messages</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-muted/20 rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">Sent</div>
                          <div className="text-lg font-medium">{agent.messagesSent}</div>
                        </div>
                        <div className="bg-muted/20 rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">Received</div>
                          <div className="text-lg font-medium">{agent.messagesReceived}</div>
                        </div>
                      </div>
                      
                      {(selectedAgentId === agent.agentId || !selectedAgentId) && (
                        <>
                          <div className="mb-3">
                            <div className="text-xs text-muted-foreground mb-1">Domain Activity:</div>
                            <div className="flex h-3 rounded-full overflow-hidden">
                              {Object.entries(agent.domains).map(([domain, count], index) => {
                                const totalMessages = Object.values(agent.domains).reduce((sum, c) => sum + c, 0);
                                const percentage = (count / totalMessages) * 100;
                                return (
                                  <div 
                                    key={domain}
                                    className="h-full first:rounded-l-full last:rounded-r-full"
                                    style={{ 
                                      backgroundColor: getDomainColor(domain),
                                      width: `${percentage}%` 
                                    }}
                                    title={`${domain}: ${count} messages (${percentage.toFixed(1)}%)`}
                                  ></div>
                                );
                              })}
                            </div>
                            <div className="flex text-xs mt-1 justify-between">
                              {Object.entries(agent.domains)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 2)
                                .map(([domain, count]) => (
                                  <span key={domain}>{domain}: {count}</span>
                                ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Most Used Symbols:</div>
                            <div className="flex flex-wrap gap-1">
                              {agent.mostUsedSymbols.map(symbol => {
                                const symbolData = data.symbols.find(s => s.id === symbol.symbolId);
                                if (!symbolData) return null;
                                
                                return (
                                  <TooltipProvider key={symbol.symbolId}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge 
                                          variant="outline" 
                                          className="text-xs"
                                          style={{ 
                                            borderColor: getSymbolColor(symbol.symbolId), 
                                            color: getSymbolColor(symbol.symbolId) 
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSymbolId(selectedSymbolId === symbol.symbolId ? null : symbol.symbolId);
                                          }}
                                        >
                                          {symbolData.value} ({symbol.count})
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{symbolData.description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-2">
        <div className="w-full flex justify-between text-xs text-muted-foreground">
          <div>
            {data && 
              `${data.recentMessages.length} recent messages | ${data.symbols.length} symbols`
            }
          </div>
          <div className="flex items-center">
            <Info className="h-3 w-3 mr-1" />
            <span>Click on agents or symbols to filter the visualization</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}