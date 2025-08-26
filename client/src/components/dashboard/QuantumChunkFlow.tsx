/**
 * QuantumChunkFlow Component
 * 
 * This component visualizes the flow of quantum chunks through the system,
 * showing their states, transformations, and relationships.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Search, ZoomIn, ZoomOut, Download, Info, Clock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

enum ChunkState {
  SUPERPOSED = "SUPERPOSED",
  COLLAPSED = "COLLAPSED",
  ENTANGLED = "ENTANGLED",
  ROUTED = "ROUTED",
  PROCESSED = "PROCESSED",
  ERROR = "ERROR"
}

enum ChunkSignalType {
  NONE = "NONE",
  LOGIC_LOCKDOWN = "LOGIC_LOCKDOWN",
  REFRESH_SIGNAL = "REFRESH_SIGNAL"
}

interface ChildChunk {
  id: string;
  content: string;
  possibility: string;
  probability: number;
  selected: boolean;
}

interface ChunkEntanglement {
  targetChunkId: string;
  entanglementType: string;
  strength: number;
  createdAt: string;
}

interface QuantumChunk {
  id: string;
  content: string;
  state: ChunkState;
  domain: string;
  timeline: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  assignedAgent?: string;
  processingTime?: number;
  children?: ChildChunk[];
  parentId?: string;
  depth: number;
  signalType: ChunkSignalType;
  entanglements: ChunkEntanglement[];
  metadata: {
    source?: string;
    priority: number;
    taskType?: string;
    complexity?: number;
    tags?: string[];
    [key: string]: any;
  };
}

interface ChunkTransition {
  id: string;
  chunkId: string;
  fromState: ChunkState;
  toState: ChunkState;
  timestamp: string;
  agentId?: string;
  reason: string;
  duration?: number;
}

interface ChunkFlowData {
  activeChunks: QuantumChunk[];
  recentTransitions: ChunkTransition[];
  processingMetrics: {
    avgProcessingTime: number;
    throughput: number;
    backlogSize: number;
    stateDistribution: Record<ChunkState, number>;
  };
  entanglementCount: number;
}

export function QuantumChunkFlow() {
  const [data, setData] = useState<ChunkFlowData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [timeFilter, setTimeFilter] = useState<string>('1h');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<string>('flow');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    fetchChunkFlowData();
    const interval = setInterval(fetchChunkFlowData, 10000);
    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [timeFilter, domainFilter, stateFilter]);

  useEffect(() => {
    if (data && canvasRef.current && viewMode === 'flow') {
      renderChunkFlow();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, viewMode, searchTerm, zoomLevel, selectedChunkId]);

  const fetchChunkFlowData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/quantum-chunks/flow?timeRange=${timeFilter}&domain=${domainFilter}&state=${stateFilter}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quantum chunk flow data: ${response.status}`);
      }
      
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching quantum chunk flow data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Sample data for development
      setData({
        activeChunks: [
          {
            id: 'chunk-1',
            content: 'Optimize database query performance for user dashboard',
            state: ChunkState.SUPERPOSED,
            domain: 'database',
            timeline: 'α',
            createdAt: '2025-03-25T09:45:10Z',
            updatedAt: '2025-03-25T09:45:32Z',
            depth: 0,
            signalType: ChunkSignalType.NONE,
            entanglements: [
              {
                targetChunkId: 'chunk-3',
                entanglementType: 'dependency',
                strength: 0.85,
                createdAt: '2025-03-25T09:45:30Z'
              }
            ],
            children: [
              {
                id: 'chunk-1-1',
                content: 'Add index to user_activities table on timestamp column',
                possibility: 'index-optimization',
                probability: 0.45,
                selected: false
              },
              {
                id: 'chunk-1-2',
                content: 'Rewrite join query to use EXISTS instead of IN for better performance',
                possibility: 'query-rewriting',
                probability: 0.35,
                selected: false
              },
              {
                id: 'chunk-1-3',
                content: 'Implement query caching with Redis for frequently accessed dashboard data',
                possibility: 'caching-implementation',
                probability: 0.2,
                selected: false
              }
            ],
            metadata: {
              source: 'user-request',
              priority: 8,
              taskType: 'optimization',
              complexity: 7,
              tags: ['database', 'performance', 'optimization']
            }
          },
          {
            id: 'chunk-2',
            content: 'Create alternative UI designs for dashboard visualization component',
            state: ChunkState.ROUTED,
            domain: 'frontend',
            timeline: 'α',
            createdAt: '2025-03-25T09:48:15Z',
            updatedAt: '2025-03-25T09:48:22Z',
            assignedAgent: 'dream-state-wilton-ai',
            depth: 0,
            signalType: ChunkSignalType.NONE,
            entanglements: [],
            metadata: {
              source: 'product-team',
              priority: 6,
              taskType: 'design-generation',
              complexity: 5,
              tags: ['ui', 'design', 'dashboard']
            }
          },
          {
            id: 'chunk-3',
            content: 'Implement database schema changes for enhanced analytics tracking',
            state: ChunkState.ENTANGLED,
            domain: 'database',
            timeline: 'α',
            createdAt: '2025-03-25T09:46:05Z',
            updatedAt: '2025-03-25T09:46:35Z',
            depth: 0,
            signalType: ChunkSignalType.NONE,
            entanglements: [
              {
                targetChunkId: 'chunk-1',
                entanglementType: 'dependency',
                strength: 0.85,
                createdAt: '2025-03-25T09:46:35Z'
              }
            ],
            metadata: {
              source: 'analytics-team',
              priority: 7,
              taskType: 'implementation',
              complexity: 6,
              tags: ['database', 'schema', 'analytics']
            }
          },
          {
            id: 'chunk-4',
            content: 'Fix insecure token implementation in authentication flow',
            state: ChunkState.COLLAPSED,
            domain: 'security',
            timeline: 'β',
            createdAt: '2025-03-25T09:49:15Z',
            updatedAt: '2025-03-25T09:50:05Z',
            completedAt: '2025-03-25T09:50:05Z',
            processingTime: 50,
            depth: 0,
            signalType: ChunkSignalType.LOGIC_LOCKDOWN,
            entanglements: [],
            children: [
              {
                id: 'chunk-4-1',
                content: 'Replace deprecated AES-128-ECB with AES-256-GCM and proper IV management',
                possibility: 'encryption-upgrade',
                probability: 0.9,
                selected: true
              }
            ],
            metadata: {
              source: 'security-audit',
              priority: 9,
              taskType: 'security-fix',
              complexity: 8,
              tags: ['security', 'authentication', 'encryption', 'critical']
            }
          },
          {
            id: 'chunk-5',
            content: 'Optimize system resource allocation for background processing tasks',
            state: ChunkState.PROCESSED,
            domain: 'system',
            timeline: 'α',
            createdAt: '2025-03-25T09:42:30Z',
            updatedAt: '2025-03-25T09:44:45Z',
            completedAt: '2025-03-25T09:44:45Z',
            processingTime: 135,
            depth: 0,
            signalType: ChunkSignalType.NONE,
            entanglements: [],
            metadata: {
              source: 'system-monitoring',
              priority: 5,
              taskType: 'optimization',
              complexity: 6,
              tags: ['system', 'resource-management', 'background-processing'],
              selectedApproach: 'adaptive-scheduling',
              performanceImprovement: '32%'
            }
          },
          {
            id: 'chunk-6',
            content: 'Implement error handling for API rate limit exceeded scenarios',
            state: ChunkState.ERROR,
            domain: 'backend',
            timeline: 'β',
            createdAt: '2025-03-25T09:47:20Z',
            updatedAt: '2025-03-25T09:48:15Z',
            depth: 0,
            signalType: ChunkSignalType.REFRESH_SIGNAL,
            entanglements: [],
            metadata: {
              source: 'error-monitoring',
              priority: 7,
              taskType: 'error-handling',
              complexity: 5,
              tags: ['api', 'error-handling', 'resilience'],
              errorDetails: 'Invalid configuration parameter in retry logic'
            }
          }
        ],
        recentTransitions: [
          {
            id: 'transition-1',
            chunkId: 'chunk-1',
            fromState: ChunkState.ROUTED,
            toState: ChunkState.SUPERPOSED,
            timestamp: '2025-03-25T09:45:32Z',
            agentId: 'dream-state-wilton-ai',
            reason: 'Multiple approach alternatives generated',
            duration: 22
          },
          {
            id: 'transition-2',
            chunkId: 'chunk-2',
            fromState: ChunkState.PROCESSED,
            toState: ChunkState.ROUTED,
            timestamp: '2025-03-25T09:48:22Z',
            agentId: 'quantum-coordinator',
            reason: 'Assigned to agent for processing',
            duration: 7
          },
          {
            id: 'transition-3',
            chunkId: 'chunk-3',
            fromState: ChunkState.PROCESSED,
            toState: ChunkState.ENTANGLED,
            timestamp: '2025-03-25T09:46:35Z',
            reason: 'Established dependency relationship with chunk-1',
            duration: 30
          },
          {
            id: 'transition-4',
            chunkId: 'chunk-4',
            fromState: ChunkState.SUPERPOSED,
            toState: ChunkState.COLLAPSED,
            timestamp: '2025-03-25T09:50:05Z',
            agentId: 'loki-reflective-mirror-ai',
            reason: 'Selected optimal solution based on security requirements',
            duration: 50
          },
          {
            id: 'transition-5',
            chunkId: 'chunk-5',
            fromState: ChunkState.COLLAPSED,
            toState: ChunkState.PROCESSED,
            timestamp: '2025-03-25T09:44:45Z',
            agentId: 'true-index-analyst',
            reason: 'Implementation completed with optimized resource allocation',
            duration: 135
          },
          {
            id: 'transition-6',
            chunkId: 'chunk-6',
            fromState: ChunkState.ROUTED,
            toState: ChunkState.ERROR,
            timestamp: '2025-03-25T09:48:15Z',
            agentId: 'dream-state-wilton-ai',
            reason: 'Processing failed due to invalid configuration parameters',
            duration: 55
          }
        ],
        processingMetrics: {
          avgProcessingTime: 78.2,
          throughput: 15.4,
          backlogSize: 12,
          stateDistribution: {
            [ChunkState.SUPERPOSED]: 1,
            [ChunkState.COLLAPSED]: 1,
            [ChunkState.ENTANGLED]: 1,
            [ChunkState.ROUTED]: 1,
            [ChunkState.PROCESSED]: 1,
            [ChunkState.ERROR]: 1
          }
        },
        entanglementCount: 2
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStateColor = (state: ChunkState) => {
    switch (state) {
      case ChunkState.SUPERPOSED:
        return '#3b82f6'; // blue-500
      case ChunkState.COLLAPSED:
        return '#10b981'; // emerald-500
      case ChunkState.ENTANGLED:
        return '#8b5cf6'; // purple-500
      case ChunkState.ROUTED:
        return '#f59e0b'; // amber-500
      case ChunkState.PROCESSED:
        return '#6366f1'; // indigo-500
      case ChunkState.ERROR:
        return '#ef4444'; // red-500
      default:
        return '#64748b'; // slate-500
    }
  };

  const getStateBadge = (state: ChunkState) => {
    switch (state) {
      case ChunkState.SUPERPOSED:
        return <Badge className="bg-blue-500">Superposed</Badge>;
      case ChunkState.COLLAPSED:
        return <Badge className="bg-emerald-500">Collapsed</Badge>;
      case ChunkState.ENTANGLED:
        return <Badge className="bg-purple-500">Entangled</Badge>;
      case ChunkState.ROUTED:
        return <Badge className="bg-amber-500">Routed</Badge>;
      case ChunkState.PROCESSED:
        return <Badge className="bg-indigo-500">Processed</Badge>;
      case ChunkState.ERROR:
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getSignalIcon = (signalType: ChunkSignalType) => {
    switch (signalType) {
      case ChunkSignalType.LOGIC_LOCKDOWN:
        return <Badge variant="outline" className="text-blue-600 border-blue-600">🥶 Logic Lockdown</Badge>;
      case ChunkSignalType.REFRESH_SIGNAL:
        return <Badge variant="outline" className="text-green-600 border-green-600">♻️ Refresh Signal</Badge>;
      default:
        return null;
    }
  };

  const renderChunkFlow = () => {
    if (!canvasRef.current || !data) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Filter chunks based on search
    const filteredChunks = data.activeChunks.filter(chunk => {
      if (searchTerm) {
        return (
          chunk.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chunk.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chunk.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (chunk.metadata.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      return true;
    });
    
    // Set up layout parameters
    const padding = 40;
    const nodeRadius = 30 * zoomLevel;
    const horizontalSpacing = 180 * zoomLevel;
    const verticalSpacing = 120 * zoomLevel;
    
    // Group chunks by state
    const chunksByState: Record<ChunkState, QuantumChunk[]> = {
      [ChunkState.SUPERPOSED]: [],
      [ChunkState.COLLAPSED]: [],
      [ChunkState.ENTANGLED]: [],
      [ChunkState.ROUTED]: [],
      [ChunkState.PROCESSED]: [],
      [ChunkState.ERROR]: []
    };
    
    filteredChunks.forEach(chunk => {
      if (chunksByState[chunk.state]) {
        chunksByState[chunk.state].push(chunk);
      }
    });
    
    // Calculate positions
    const statePositions: Record<ChunkState, { x: number, y: number }> = {
      [ChunkState.ROUTED]: { 
        x: padding + horizontalSpacing, 
        y: canvas.height / 2 
      },
      [ChunkState.SUPERPOSED]: { 
        x: padding + horizontalSpacing * 2, 
        y: canvas.height / 3 
      },
      [ChunkState.ENTANGLED]: { 
        x: padding + horizontalSpacing * 2, 
        y: (canvas.height / 3) * 2 
      },
      [ChunkState.COLLAPSED]: { 
        x: padding + horizontalSpacing * 3, 
        y: canvas.height / 2 
      },
      [ChunkState.PROCESSED]: { 
        x: padding + horizontalSpacing * 4, 
        y: canvas.height / 2 
      },
      [ChunkState.ERROR]: { 
        x: padding + horizontalSpacing * 3, 
        y: canvas.height - padding - nodeRadius 
      }
    };
    
    // Calculate node positions
    const nodePositions: Record<string, { x: number, y: number, state: ChunkState }> = {};
    
    Object.entries(chunksByState).forEach(([stateStr, chunks]) => {
      const state = stateStr as ChunkState;
      const basePos = statePositions[state];
      
      chunks.forEach((chunk, index) => {
        let x = basePos.x;
        let y = basePos.y;
        
        // Adjust position based on index for multiple chunks in same state
        if (chunks.length > 1) {
          const offset = (index - (chunks.length - 1) / 2) * verticalSpacing;
          y += offset;
        }
        
        nodePositions[chunk.id] = { x, y, state };
      });
    });
    
    // Draw state flow arrows
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'; // slate-400 with transparency
    
    // Flow from ROUTED to SUPERPOSED or ENTANGLED
    drawArrow(ctx, 
      statePositions[ChunkState.ROUTED].x, statePositions[ChunkState.ROUTED].y,
      statePositions[ChunkState.SUPERPOSED].x, statePositions[ChunkState.SUPERPOSED].y);
    
    drawArrow(ctx, 
      statePositions[ChunkState.ROUTED].x, statePositions[ChunkState.ROUTED].y,
      statePositions[ChunkState.ENTANGLED].x, statePositions[ChunkState.ENTANGLED].y);
    
    // Flow from SUPERPOSED to COLLAPSED
    drawArrow(ctx, 
      statePositions[ChunkState.SUPERPOSED].x, statePositions[ChunkState.SUPERPOSED].y,
      statePositions[ChunkState.COLLAPSED].x, statePositions[ChunkState.COLLAPSED].y);
    
    // Flow from ENTANGLED to COLLAPSED
    drawArrow(ctx, 
      statePositions[ChunkState.ENTANGLED].x, statePositions[ChunkState.ENTANGLED].y,
      statePositions[ChunkState.COLLAPSED].x, statePositions[ChunkState.COLLAPSED].y);
    
    // Flow from COLLAPSED to PROCESSED
    drawArrow(ctx, 
      statePositions[ChunkState.COLLAPSED].x, statePositions[ChunkState.COLLAPSED].y,
      statePositions[ChunkState.PROCESSED].x, statePositions[ChunkState.PROCESSED].y);
    
    // Flow to ERROR state (from ROUTED, SUPERPOSED, ENTANGLED, COLLAPSED)
    drawArrow(ctx,
      statePositions[ChunkState.ROUTED].x, statePositions[ChunkState.ROUTED].y,
      statePositions[ChunkState.ERROR].x, statePositions[ChunkState.ERROR].y);
    
    drawArrow(ctx,
      statePositions[ChunkState.SUPERPOSED].x, statePositions[ChunkState.SUPERPOSED].y,
      statePositions[ChunkState.ERROR].x - horizontalSpacing/2, statePositions[ChunkState.ERROR].y - verticalSpacing/2);
    
    drawArrow(ctx,
      statePositions[ChunkState.ENTANGLED].x, statePositions[ChunkState.ENTANGLED].y,
      statePositions[ChunkState.ERROR].x - horizontalSpacing/2, statePositions[ChunkState.ERROR].y + verticalSpacing/2);
    
    drawArrow(ctx,
      statePositions[ChunkState.COLLAPSED].x, statePositions[ChunkState.COLLAPSED].y,
      statePositions[ChunkState.ERROR].x, statePositions[ChunkState.ERROR].y);
    
    // Draw state labels
    ctx.font = `${14 * zoomLevel}px sans-serif`;
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    Object.entries(statePositions).forEach(([stateStr, pos]) => {
      const state = stateStr as ChunkState;
      const chunkCount = chunksByState[state].length;
      
      // Draw state label
      ctx.fillText(
        `${state} (${chunkCount})`, 
        pos.x, 
        pos.y - nodeRadius - 15 * zoomLevel
      );
    });
    
    // Draw entanglement lines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)'; // purple-500 with transparency
    ctx.setLineDash([5, 3]);
    
    filteredChunks.forEach(chunk => {
      if (chunk.entanglements && chunk.entanglements.length > 0) {
        const sourcePos = nodePositions[chunk.id];
        
        chunk.entanglements.forEach(entanglement => {
          const targetPos = nodePositions[entanglement.targetChunkId];
          
          if (sourcePos && targetPos) {
            ctx.beginPath();
            ctx.moveTo(sourcePos.x, sourcePos.y);
            ctx.lineTo(targetPos.x, targetPos.y);
            ctx.stroke();
            
            // Draw entanglement type label in the middle
            const midX = (sourcePos.x + targetPos.x) / 2;
            const midY = (sourcePos.y + targetPos.y) / 2;
            
            ctx.fillStyle = 'rgba(139, 92, 246, 0.9)';
            ctx.font = `${10 * zoomLevel}px sans-serif`;
            ctx.fillText(entanglement.entanglementType, midX, midY - 10 * zoomLevel);
            
            // Draw strength as percentage
            ctx.font = `${8 * zoomLevel}px sans-serif`;
            ctx.fillText(`${Math.round(entanglement.strength * 100)}%`, midX, midY + 10 * zoomLevel);
          }
        });
      }
    });
    
    // Reset line dash
    ctx.setLineDash([]);
    
    // Draw nodes
    filteredChunks.forEach(chunk => {
      const pos = nodePositions[chunk.id];
      if (!pos) return;
      
      const color = getStateColor(chunk.state);
      const isSelected = selectedChunkId === chunk.id;
      
      // Draw node circle
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.strokeStyle = isSelected ? '#000000' : color;
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw domain indicator
      ctx.font = `${10 * zoomLevel}px sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(chunk.domain, pos.x, pos.y - 8 * zoomLevel);
      
      // Draw timeline indicator
      ctx.fillText(`TL: ${chunk.timeline}`, pos.x, pos.y + 8 * zoomLevel);
      
      // Draw chunk ID
      ctx.font = `${8 * zoomLevel}px sans-serif`;
      ctx.fillText(chunk.id, pos.x, pos.y + nodeRadius + 12 * zoomLevel);
    });
    
    // Draw selected chunk details if any
    if (selectedChunkId) {
      const selectedChunk = filteredChunks.find(c => c.id === selectedChunkId);
      if (selectedChunk && nodePositions[selectedChunkId]) {
        const pos = nodePositions[selectedChunkId];
        const detailsX = pos.x + nodeRadius + 20;
        const detailsY = pos.y - 80 * zoomLevel;
        
        // Draw details box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = getStateColor(selectedChunk.state);
        ctx.lineWidth = 2;
        
        const boxWidth = 220 * zoomLevel;
        const boxHeight = 160 * zoomLevel;
        
        // Ensure details box stays within canvas
        let adjustedX = detailsX;
        let adjustedY = detailsY;
        
        if (detailsX + boxWidth > canvas.width) {
          adjustedX = pos.x - nodeRadius - 20 - boxWidth;
        }
        
        if (detailsY + boxHeight > canvas.height) {
          adjustedY = canvas.height - boxHeight - 10;
        }
        
        if (adjustedY < 10) {
          adjustedY = 10;
        }
        
        ctx.beginPath();
        ctx.roundRect(adjustedX, adjustedY, boxWidth, boxHeight, 5);
        ctx.fill();
        ctx.stroke();
        
        // Draw content
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.font = `bold ${12 * zoomLevel}px sans-serif`;
        ctx.textAlign = 'left';
        
        const contentLines = wrapText(ctx, selectedChunk.content, boxWidth - 20 * zoomLevel);
        contentLines.forEach((line, index) => {
          ctx.fillText(line, adjustedX + 10 * zoomLevel, adjustedY + 20 * zoomLevel + index * 18 * zoomLevel);
        });
        
        // Draw metadata
        const metadataY = adjustedY + 20 * zoomLevel + contentLines.length * 18 * zoomLevel + 10 * zoomLevel;
        ctx.font = `${10 * zoomLevel}px sans-serif`;
        
        ctx.fillText(`Priority: ${selectedChunk.metadata.priority}`, adjustedX + 10 * zoomLevel, metadataY);
        
        if (selectedChunk.metadata.taskType) {
          ctx.fillText(`Type: ${selectedChunk.metadata.taskType}`, adjustedX + 10 * zoomLevel, metadataY + 16 * zoomLevel);
        }
        
        if (selectedChunk.assignedAgent) {
          ctx.fillText(`Agent: ${selectedChunk.assignedAgent}`, adjustedX + 10 * zoomLevel, metadataY + 32 * zoomLevel);
        }
        
        if (selectedChunk.processingTime) {
          ctx.fillText(`Processing: ${selectedChunk.processingTime}ms`, adjustedX + 10 * zoomLevel, metadataY + 48 * zoomLevel);
        }
        
        // Draw tags if any
        if (selectedChunk.metadata.tags && selectedChunk.metadata.tags.length > 0) {
          ctx.fillText(`Tags: ${selectedChunk.metadata.tags.join(', ')}`, adjustedX + 10 * zoomLevel, metadataY + 64 * zoomLevel);
        }
      }
    }
  };

  // Helper function to draw arrow
  const drawArrow = (
    ctx: CanvasRenderingContext2D, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number
  ) => {
    const headLength = 10 * zoomLevel;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Draw the arrow head
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  // Helper function to wrap text
  const wrapText = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    maxWidth: number
  ): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    
    lines.push(currentLine);
    return lines;
  };

  const downloadChunkFlow = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'quantum-chunk-flow.png';
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

  if (loading && !data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Quantum Chunk Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2">Loading quantum chunk flow data...</span>
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
            <CardTitle>Quantum Chunk Flow</CardTitle>
            <CardDescription>
              Visualization of quantum chunk states and transformations
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select 
              value={timeFilter}
              onValueChange={setTimeFilter}
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
            
            <Select 
              value={domainFilter}
              onValueChange={setDomainFilter}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchChunkFlowData}
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
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="flow" className="flex-1" onValueChange={setViewMode}>
            <TabsList>
              <TabsTrigger value="flow">Flow</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="transitions">Transitions</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative w-44">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chunks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {viewMode === 'flow' && (
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
                  
                  // Check if a node was clicked
                  const nodeRadius = 30 * zoomLevel;
                  let clickedChunkId: string | null = null;
                  
                  const filteredChunks = data.activeChunks.filter(chunk => {
                    if (searchTerm) {
                      return (
                        chunk.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        chunk.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        chunk.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (chunk.metadata.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                      );
                    }
                    return true;
                  });
                  
                  // Group chunks by state
                  const chunksByState: Record<ChunkState, QuantumChunk[]> = {
                    [ChunkState.SUPERPOSED]: [],
                    [ChunkState.COLLAPSED]: [],
                    [ChunkState.ENTANGLED]: [],
                    [ChunkState.ROUTED]: [],
                    [ChunkState.PROCESSED]: [],
                    [ChunkState.ERROR]: []
                  };
                  
                  filteredChunks.forEach(chunk => {
                    if (chunksByState[chunk.state]) {
                      chunksByState[chunk.state].push(chunk);
                    }
                  });
                  
                  // Calculate positions
                  const padding = 40;
                  const horizontalSpacing = 180 * zoomLevel;
                  const verticalSpacing = 120 * zoomLevel;
                  
                  const statePositions: Record<ChunkState, { x: number, y: number }> = {
                    [ChunkState.ROUTED]: { 
                      x: padding + horizontalSpacing, 
                      y: canvasRef.current.height / 2 
                    },
                    [ChunkState.SUPERPOSED]: { 
                      x: padding + horizontalSpacing * 2, 
                      y: canvasRef.current.height / 3 
                    },
                    [ChunkState.ENTANGLED]: { 
                      x: padding + horizontalSpacing * 2, 
                      y: (canvasRef.current.height / 3) * 2 
                    },
                    [ChunkState.COLLAPSED]: { 
                      x: padding + horizontalSpacing * 3, 
                      y: canvasRef.current.height / 2 
                    },
                    [ChunkState.PROCESSED]: { 
                      x: padding + horizontalSpacing * 4, 
                      y: canvasRef.current.height / 2 
                    },
                    [ChunkState.ERROR]: { 
                      x: padding + horizontalSpacing * 3, 
                      y: canvasRef.current.height - padding - nodeRadius 
                    }
                  };
                  
                  // Calculate node positions
                  const nodePositions: Record<string, { x: number, y: number }> = {};
                  
                  Object.entries(chunksByState).forEach(([stateStr, chunks]) => {
                    const state = stateStr as ChunkState;
                    const basePos = statePositions[state];
                    
                    chunks.forEach((chunk, index) => {
                      let x = basePos.x;
                      let y = basePos.y;
                      
                      // Adjust position based on index for multiple chunks in same state
                      if (chunks.length > 1) {
                        const offset = (index - (chunks.length - 1) / 2) * verticalSpacing;
                        y += offset;
                      }
                      
                      nodePositions[chunk.id] = { x, y };
                      
                      // Check if this node was clicked
                      const distance = Math.sqrt(Math.pow(x - x, 2) + Math.pow(y - y, 2));
                      if (distance <= nodeRadius) {
                        clickedChunkId = chunk.id;
                      }
                    });
                  });
                  
                  // Simple distance check for each node
                  for (const chunkId in nodePositions) {
                    const pos = nodePositions[chunkId];
                    const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                    
                    if (distance <= nodeRadius) {
                      clickedChunkId = chunkId;
                      break;
                    }
                  }
                  
                  setSelectedChunkId(clickedChunkId === selectedChunkId ? null : clickedChunkId);
                }}
              />
            </div>
            
            <div className="absolute top-3 right-3 flex space-x-2">
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
                      onClick={downloadChunkFlow}
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
            
            <div className="absolute bottom-3 left-3">
              <div className="bg-white bg-opacity-90 p-2 rounded text-xs border">
                <div className="font-medium mb-1">Quantum States:</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {Object.values(ChunkState).map(state => (
                    <div key={state} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-1" 
                        style={{ backgroundColor: getStateColor(state) }}
                      ></div>
                      <span>{state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'list' && data && (
          <ScrollArea className="border rounded-md" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
            <div className="p-2 space-y-3">
              {data.activeChunks
                .filter(chunk => {
                  if (searchTerm) {
                    return (
                      chunk.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      chunk.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      chunk.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (chunk.metadata.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                  }
                  return true;
                })
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map(chunk => (
                  <div 
                    key={chunk.id} 
                    className={`border rounded-md p-4 hover:bg-muted/50 cursor-pointer ${selectedChunkId === chunk.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedChunkId(selectedChunkId === chunk.id ? null : chunk.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: getStateColor(chunk.state) }}
                        ></div>
                        <h3 className="font-medium">{chunk.id}</h3>
                        <div className="ml-2">{getStateBadge(chunk.state)}</div>
                        {chunk.signalType !== ChunkSignalType.NONE && (
                          <div className="ml-2">{getSignalIcon(chunk.signalType)}</div>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Badge variant="outline" className="mr-2">{chunk.domain}</Badge>
                        <span>Timeline: {chunk.timeline}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-2">{chunk.content}</p>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Updated: {formatRelativeTime(chunk.updatedAt)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="mr-2">Priority: {chunk.metadata.priority}</span>
                        {chunk.metadata.tags && (
                          <span>Tags: {chunk.metadata.tags.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    
                    {selectedChunkId === chunk.id && (
                      <>
                        {chunk.children && chunk.children.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium mb-2">Possibilities:</h4>
                            <div className="space-y-2">
                              {chunk.children.map(child => (
                                <div 
                                  key={child.id} 
                                  className={`bg-muted/50 p-2 rounded-md text-sm ${child.selected ? 'border-2 border-green-500' : ''}`}
                                >
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">{child.possibility}</span>
                                    <span>{Math.round(child.probability * 100)}% probability</span>
                                  </div>
                                  <p>{child.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {chunk.entanglements && chunk.entanglements.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <h4 className="text-sm font-medium mb-2">Entanglements:</h4>
                            <div className="space-y-2">
                              {chunk.entanglements.map(entanglement => (
                                <div key={entanglement.targetChunkId} className="flex items-center justify-between">
                                  <span className="text-sm">{entanglement.entanglementType} with {entanglement.targetChunkId}</span>
                                  <Badge variant="outline">
                                    {Math.round(entanglement.strength * 100)}% strength
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-3 pt-3 border-t">
                          <h4 className="text-sm font-medium mb-2">Metadata:</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(chunk.metadata).map(([key, value]) => (
                              <div key={key} className="flex">
                                <span className="font-medium mr-1">{key}:</span>
                                <span className="text-muted-foreground">
                                  {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
        
        {viewMode === 'transitions' && data && (
          <ScrollArea className="border rounded-md" style={{ height: 'calc(100vh - 280px)', minHeight: '400px' }}>
            <div className="p-2 space-y-3">
              {data.recentTransitions
                .filter(transition => {
                  if (searchTerm) {
                    return (
                      transition.chunkId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      transition.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (transition.agentId && transition.agentId.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                  }
                  return true;
                })
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map(transition => (
                  <div 
                    key={transition.id} 
                    className="border rounded-md p-4 hover:bg-muted/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium">Chunk: {transition.chunkId}</h3>
                          {transition.agentId && (
                            <Badge variant="outline" className="ml-2">{transition.agentId}</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getStateColor(transition.fromState) }}
                          ></div>
                          <span className="mx-1 text-sm">{transition.fromState}</span>
                          <span className="mx-1">→</span>
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getStateColor(transition.toState) }}
                          ></div>
                          <span className="ml-1 text-sm">{transition.toState}</span>
                        </div>
                        
                        <p className="text-sm">{transition.reason}</p>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(transition.timestamp)}
                        </span>
                        
                        {transition.duration && (
                          <span className="text-xs mt-1">
                            Duration: {transition.duration}ms
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
        
        {viewMode === 'metrics' && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Average Processing Time</span>
                    <span className="text-sm">{data.processingMetrics.avgProcessingTime.toFixed(1)} ms</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, data.processingMetrics.avgProcessingTime / 2)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Throughput</span>
                    <span className="text-sm">{data.processingMetrics.throughput.toFixed(1)} chunks/min</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, data.processingMetrics.throughput * 5)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Backlog Size</span>
                    <span className="text-sm">{data.processingMetrics.backlogSize} chunks</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${data.processingMetrics.backlogSize > 20 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, data.processingMetrics.backlogSize * 3)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Entanglement Count</span>
                    <span className="text-sm">{data.entanglementCount}</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, data.entanglementCount * 10)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-3">State Distribution</h3>
              <div className="space-y-3">
                {Object.entries(data.processingMetrics.stateDistribution).map(([state, count]) => (
                  <div key={state}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: getStateColor(state as ChunkState) }}
                        ></div>
                        <span className="text-sm">{state}</span>
                      </div>
                      <span className="text-sm">{count}</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          backgroundColor: getStateColor(state as ChunkState),
                          width: `${Math.min(100, (count / Math.max(...Object.values(data.processingMetrics.stateDistribution))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Chunks by Timeline</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from(new Set(data.activeChunks.map(c => c.timeline))).map(timeline => {
                    const count = data.activeChunks.filter(c => c.timeline === timeline).length;
                    return (
                      <div key={timeline} className="border rounded p-2 text-center">
                        <div className="text-lg font-medium">{timeline}</div>
                        <div className="text-sm text-muted-foreground">{count} chunks</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-3">Domain Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from(new Set(data.activeChunks.map(c => c.domain))).map(domain => {
                  const chunks = data.activeChunks.filter(c => c.domain === domain);
                  const stateCount: Partial<Record<ChunkState, number>> = {};
                  
                  chunks.forEach(chunk => {
                    stateCount[chunk.state] = (stateCount[chunk.state] || 0) + 1;
                  });
                  
                  return (
                    <div key={domain} className="border rounded p-3">
                      <div className="text-sm font-medium mb-2">{domain}</div>
                      
                      <div className="h-4 w-full flex rounded-full overflow-hidden">
                        {Object.entries(stateCount).map(([state, count]) => (
                          <div 
                            key={state}
                            className="h-full"
                            style={{ 
                              backgroundColor: getStateColor(state as ChunkState),
                              width: `${(count / chunks.length) * 100}%` 
                            }}
                          ></div>
                        ))}
                      </div>
                      
                      <div className="mt-2 text-xs flex justify-between">
                        <span>{chunks.length} chunks</span>
                        <span>
                          {Object.keys(stateCount).length} states
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-2">
        <div className="w-full flex justify-between text-xs text-muted-foreground">
          <div>
            {data && 
              `${data.activeChunks.length} active chunks | ${data.entanglementCount} entanglements`
            }
          </div>
          <div className="flex items-center">
            <Info className="h-3 w-3 mr-1" />
            <span>Click on nodes in the flow view to see details</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}