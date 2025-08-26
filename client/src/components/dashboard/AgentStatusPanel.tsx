/**
 * AgentStatusPanel Component
 * 
 * This component displays the status and metrics for all active agents in the system.
 * It provides real-time monitoring of agent performance, health, and activities.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, AlertCircle, CheckCircle2, Activity, ArrowRight, Brain, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface AgentCapability {
  name: string;
  description: string;
  usageCount: number;
  successRate: number;
  averageExecutionTime: number;
}

interface AgentMetrics {
  totalTasksProcessed: number;
  averageProcessingTime: number;
  successRate: number;
  currentLoad: number;
  errorRate: number;
  lastActiveTimestamp: string;
  uptime: number;
  queuedTasks: number;
}

interface AgentAlerts {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'idle' | 'error';
  type: string;
  description: string;
  currentTask?: string;
  health: number;
  capabilities: AgentCapability[];
  metrics: AgentMetrics;
  alerts: AgentAlerts[];
  dependencies: string[];
}

interface AgentStatusData {
  agents: Agent[];
  systemHealth: number;
  lastUpdated: string;
}

export function AgentStatusPanel() {
  const [data, setData] = useState<AgentStatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<string>('overview');

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgentStatus = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/agents/status');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch agent status data: ${response.status}`);
      }
      
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching agent status data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Sample data for development
      setData({
        agents: [
          {
            id: 'dream-state-wilton-ai',
            name: 'Dream-State Wilton AI',
            status: 'online',
            type: 'creative',
            description: 'Generates alternative approaches to problems by exploring possibility spaces',
            currentTask: 'Generating UI component alternatives',
            health: 98,
            capabilities: [
              {
                name: 'processChunk',
                description: 'Processes a quantum chunk and generates alternative approaches',
                usageCount: 128,
                successRate: 0.95,
                averageExecutionTime: 420
              },
              {
                name: 'findConnections',
                description: 'Discovers connections between different problem domains',
                usageCount: 64,
                successRate: 0.92,
                averageExecutionTime: 350
              }
            ],
            metrics: {
              totalTasksProcessed: 294,
              averageProcessingTime: 385,
              successRate: 0.94,
              currentLoad: 0.35,
              errorRate: 0.06,
              lastActiveTimestamp: '2025-03-25T09:48:32Z',
              uptime: 86400 * 3 + 3600 * 5 + 60 * 12,
              queuedTasks: 2
            },
            alerts: [
              {
                id: 'alert-1',
                type: 'info',
                message: 'Performance optimization applied: caching common patterns',
                timestamp: '2025-03-25T08:15:22Z',
                acknowledged: true
              }
            ],
            dependencies: ['quantum-coordinator', 'symbolic-interpreter']
          },
          {
            id: 'loki-reflective-mirror-ai',
            name: 'Loki Reflective Mirror AI',
            status: 'busy',
            type: 'analytical',
            description: 'Analyzes and validates the quality of generated outputs',
            currentTask: 'Validating database optimization approaches',
            health: 100,
            capabilities: [
              {
                name: 'analyzeQuality',
                description: 'Analyzes the quality of generated outputs',
                usageCount: 248,
                successRate: 0.98,
                averageExecutionTime: 210
              },
              {
                name: 'analyzeConsistency',
                description: 'Checks consistency across multiple outputs',
                usageCount: 156,
                successRate: 0.96,
                averageExecutionTime: 320
              }
            ],
            metrics: {
              totalTasksProcessed: 412,
              averageProcessingTime: 265,
              successRate: 0.97,
              currentLoad: 0.65,
              errorRate: 0.03,
              lastActiveTimestamp: '2025-03-25T09:49:15Z',
              uptime: 86400 * 3 + 3600 * 5 + 60 * 12,
              queuedTasks: 3
            },
            alerts: [],
            dependencies: ['quantum-coordinator', 'true-index-analyst']
          },
          {
            id: 'chronos-kairos-agent',
            name: 'Chronos/Kairos Temporal Agent',
            status: 'idle',
            type: 'scheduling',
            description: 'Manages temporal aspects of processing including scheduling and sequencing',
            currentTask: undefined,
            health: 95,
            capabilities: [
              {
                name: 'scheduleProcessing',
                description: 'Schedules processing of tasks with optimal timing',
                usageCount: 512,
                successRate: 0.94,
                averageExecutionTime: 150
              },
              {
                name: 'trackStepExecution',
                description: 'Tracks execution of processing steps',
                usageCount: 890,
                successRate: 0.99,
                averageExecutionTime: 85
              },
              {
                name: 'calculateOptimalSequence',
                description: 'Determines optimal processing sequence',
                usageCount: 218,
                successRate: 0.91,
                averageExecutionTime: 310
              }
            ],
            metrics: {
              totalTasksProcessed: 1623,
              averageProcessingTime: 165,
              successRate: 0.95,
              currentLoad: 0.22,
              errorRate: 0.05,
              lastActiveTimestamp: '2025-03-25T09:47:45Z',
              uptime: 86400 * 3 + 3600 * 5 + 60 * 12,
              queuedTasks: 0
            },
            alerts: [
              {
                id: 'alert-2',
                type: 'warning',
                message: 'Temporal inconsistency detected in sequence planning',
                timestamp: '2025-03-25T09:32:18Z',
                acknowledged: false
              }
            ],
            dependencies: ['quantum-coordinator']
          },
          {
            id: 'quantum-coordinator',
            name: 'Quantum Coordinator',
            status: 'online',
            type: 'orchestration',
            description: 'Coordinates the assignment of tasks to specialized agents and manages workflow',
            currentTask: 'Orchestrating system-wide agent activities',
            health: 99,
            capabilities: [
              {
                name: 'assignTask',
                description: 'Assigns tasks to appropriate specialized agents',
                usageCount: 842,
                successRate: 0.99,
                averageExecutionTime: 120
              },
              {
                name: 'monitorExecution',
                description: 'Monitors execution of tasks across agents',
                usageCount: 1205,
                successRate: 0.98,
                averageExecutionTime: 65
              },
              {
                name: 'handleErrors',
                description: 'Handles errors and exceptions in processing',
                usageCount: 98,
                successRate: 0.93,
                averageExecutionTime: 210
              }
            ],
            metrics: {
              totalTasksProcessed: 2145,
              averageProcessingTime: 130,
              successRate: 0.97,
              currentLoad: 0.45,
              errorRate: 0.03,
              lastActiveTimestamp: '2025-03-25T09:50:05Z',
              uptime: 86400 * 3 + 3600 * 5 + 60 * 12,
              queuedTasks: 5
            },
            alerts: [],
            dependencies: []
          },
          {
            id: 'symbolic-interpreter',
            name: 'Symbolic Interpreter',
            status: 'online',
            type: 'interpretive',
            description: 'Interprets symbolic communications and extracts meaning from patterns',
            currentTask: 'Analyzing symbolic communications',
            health: 97,
            capabilities: [
              {
                name: 'interpretSymbols',
                description: 'Interprets symbolic communications',
                usageCount: 720,
                successRate: 0.96,
                averageExecutionTime: 180
              },
              {
                name: 'extractPatterns',
                description: 'Extracts patterns from symbolic data',
                usageCount: 518,
                successRate: 0.94,
                averageExecutionTime: 230
              }
            ],
            metrics: {
              totalTasksProcessed: 1242,
              averageProcessingTime: 205,
              successRate: 0.95,
              currentLoad: 0.28,
              errorRate: 0.05,
              lastActiveTimestamp: '2025-03-25T09:50:20Z',
              uptime: 86400 * 3 + 3600 * 5 + 60 * 12,
              queuedTasks: 1
            },
            alerts: [],
            dependencies: ['quantum-coordinator']
          },
          {
            id: 'true-index-analyst',
            name: 'True-Index Analyst',
            status: 'error',
            type: 'analytical',
            description: 'Analyzes patterns and provides deep analysis of system behaviors',
            currentTask: 'Analyzing security vulnerabilities',
            health: 72,
            capabilities: [
              {
                name: 'analyzePatterns',
                description: 'Analyzes patterns in system behavior',
                usageCount: 356,
                successRate: 0.92,
                averageExecutionTime: 340
              },
              {
                name: 'generateInsights',
                description: 'Generates insights from pattern analysis',
                usageCount: 245,
                successRate: 0.88,
                averageExecutionTime: 420
              }
            ],
            metrics: {
              totalTasksProcessed: 602,
              averageProcessingTime: 380,
              successRate: 0.90,
              currentLoad: 0.85,
              errorRate: 0.10,
              lastActiveTimestamp: '2025-03-25T09:49:45Z',
              uptime: 86400 * 3 + 3600 * 5 + 60 * 12,
              queuedTasks: 4
            },
            alerts: [
              {
                id: 'alert-3',
                type: 'error',
                message: 'Critical error in pattern analysis module: memory allocation failure',
                timestamp: '2025-03-25T09:48:32Z',
                acknowledged: true
              },
              {
                id: 'alert-4',
                type: 'warning',
                message: 'High load affecting analysis performance',
                timestamp: '2025-03-25T09:47:15Z',
                acknowledged: false
              }
            ],
            dependencies: ['quantum-coordinator', 'symbolic-interpreter']
          }
        ],
        systemHealth: 93.5,
        lastUpdated: '2025-03-25T09:50:30Z'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge className="bg-gray-500">Offline</Badge>;
      case 'busy':
        return <Badge className="bg-blue-500">Busy</Badge>;
      case 'idle':
        return <Badge className="bg-amber-500">Idle</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'bg-green-500';
    if (health >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
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
          <CardTitle>Agent Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2">Loading agent status data...</span>
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
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>
              System health and agent monitoring
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 mr-3">
                    <span className="text-sm">System Health:</span>
                    <div className="w-24 h-3 bg-muted rounded-full">
                      <div 
                        className={`h-3 rounded-full ${
                          data && data.systemHealth >= 90 ? 'bg-green-500' : 
                          data && data.systemHealth >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${data?.systemHealth || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{data?.systemHealth || 0}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <span>Overall system health score</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchAgentStatus}
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
        <Tabs defaultValue="overview" onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {viewMode === 'overview' && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.agents.map(agent => (
              <div 
                key={agent.id} 
                className={`border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedAgentId === agent.id ? 'bg-muted' : ''}`}
                onClick={() => setSelectedAgentId(selectedAgentId === agent.id ? null : agent.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{agent.name}</h3>
                      <div className="ml-2">{getStatusBadge(agent.status)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{agent.type}</p>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-1">Health:</span>
                        <div className="w-12 h-2 bg-muted rounded-full">
                          <div 
                            className={`h-2 rounded-full ${getHealthColor(agent.health)}`}
                            style={{ width: `${agent.health}%` }}
                          ></div>
                        </div>
                        <span className="text-xs ml-1">{agent.health}%</span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Agent Health Metrics</h4>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span>Success Rate:</span>
                            <span>{(agent.metrics.successRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Error Rate:</span>
                            <span>{(agent.metrics.errorRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Load:</span>
                            <span>{(agent.metrics.currentLoad * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active:</span>
                            <span>{formatRelativeTime(agent.metrics.lastActiveTimestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                <p className="text-sm mb-2">{agent.description}</p>
                
                {agent.currentTask && (
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Activity className="h-3 w-3 mr-1" />
                    <span>Current: {agent.currentTask}</span>
                  </div>
                )}
                
                {selectedAgentId === agent.id && (
                  <>
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                      <div className="space-y-2">
                        {agent.capabilities.map(capability => (
                          <div key={capability.name} className="flex justify-between items-center text-xs">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-medium cursor-help">{capability.name}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{capability.description}</p>
                              </TooltipContent>
                            </Tooltip>
                            <div className="flex items-center">
                              <span className="mr-2">{capability.usageCount} calls</span>
                              <span className={capability.successRate >= 0.95 ? 'text-green-500' : capability.successRate >= 0.8 ? 'text-amber-500' : 'text-red-500'}>
                                {(capability.successRate * 100).toFixed(0)}% success
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {agent.alerts.length > 0 && (
                      <div className="mt-3 pt-2 border-t">
                        <h4 className="text-sm font-medium mb-1">Recent Alerts</h4>
                        <div className="space-y-1">
                          {agent.alerts.slice(0, 2).map(alert => (
                            <div key={alert.id} className="flex items-start text-xs">
                              {getAlertIcon(alert.type)}
                              <span className="ml-1">{alert.message}</span>
                            </div>
                          ))}
                          {agent.alerts.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              + {agent.alerts.length - 2} more alerts
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {agent.dependencies.length > 0 && (
                      <div className="mt-3 pt-2 border-t">
                        <h4 className="text-sm font-medium mb-1">Dependencies</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        {viewMode === 'details' && data && (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              {data.agents.map(agent => (
                <div key={agent.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">{agent.name}</h3>
                        <div className="ml-2">{getStatusBadge(agent.status)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{agent.type}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Health:</span>
                      <Progress value={agent.health} className="w-24 h-2" />
                      <span className="text-sm ml-2">{agent.health}%</span>
                    </div>
                  </div>
                  
                  <p className="mb-4">{agent.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                      <div className="space-y-2">
                        {agent.capabilities.map(capability => (
                          <div key={capability.name} className="border rounded p-2">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{capability.name}</span>
                              <span className="text-sm">{capability.usageCount} uses</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{capability.description}</p>
                            <div className="flex justify-between text-xs">
                              <span>Success: <span className={capability.successRate >= 0.95 ? 'text-green-500' : capability.successRate >= 0.8 ? 'text-amber-500' : 'text-red-500'}>
                                {(capability.successRate * 100).toFixed(1)}%
                              </span></span>
                              <span>Avg time: {capability.averageExecutionTime}ms</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Status Information</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="border rounded p-2">
                            <div className="text-xs text-muted-foreground">Current Task</div>
                            <div className="font-medium truncate">{agent.currentTask || 'None'}</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="text-xs text-muted-foreground">Last Active</div>
                            <div className="font-medium">{formatRelativeTime(agent.metrics.lastActiveTimestamp)}</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="text-xs text-muted-foreground">Current Load</div>
                            <div className="font-medium">{(agent.metrics.currentLoad * 100).toFixed(1)}%</div>
                          </div>
                          <div className="border rounded p-2">
                            <div className="text-xs text-muted-foreground">Uptime</div>
                            <div className="font-medium">{formatUptime(agent.metrics.uptime)}</div>
                          </div>
                        </div>
                        
                        {agent.dependencies.length > 0 && (
                          <div className="border rounded p-2">
                            <div className="text-xs text-muted-foreground mb-1">Dependencies</div>
                            <div className="flex flex-wrap gap-1">
                              {agent.dependencies.map(dep => (
                                <Badge key={dep} variant="outline" className="text-xs">
                                  {dep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {agent.alerts.length > 0 && (
                          <div className="border rounded p-2">
                            <div className="text-xs text-muted-foreground mb-1">Recent Alerts</div>
                            <div className="space-y-1">
                              {agent.alerts.map(alert => (
                                <div key={alert.id} className="flex items-start text-xs">
                                  {getAlertIcon(alert.type)}
                                  <div className="ml-1">
                                    <div>{alert.message}</div>
                                    <div className="text-xs text-muted-foreground">{formatRelativeTime(alert.timestamp)}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {viewMode === 'metrics' && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium">System Overview</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Overall Health</span>
                      <span className="text-sm">{data.systemHealth}%</span>
                    </div>
                    <Progress value={data.systemHealth} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Agents Online</span>
                      <span className="text-sm">
                        {data.agents.filter(a => a.status === 'online' || a.status === 'busy').length}/{data.agents.length}
                      </span>
                    </div>
                    <Progress 
                      value={(data.agents.filter(a => a.status === 'online' || a.status === 'busy').length / data.agents.length) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Agent Load</span>
                      <span className="text-sm">
                        {(data.agents.reduce((sum, agent) => sum + agent.metrics.currentLoad, 0) / data.agents.length * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={data.agents.reduce((sum, agent) => sum + agent.metrics.currentLoad, 0) / data.agents.length * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Average Success Rate</span>
                      <span className="text-sm">
                        {(data.agents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / data.agents.length * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={data.agents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / data.agents.length * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 col-span-2">
                <h3 className="text-lg font-medium">Agent Performance</h3>
                <div className="mt-4 space-y-3">
                  {data.agents.map(agent => (
                    <div key={agent.id} className="flex items-center">
                      <div className="w-1/3">
                        <div className="text-sm font-medium truncate">{agent.name}</div>
                        <div className="text-xs text-muted-foreground">{agent.type}</div>
                      </div>
                      <div className="w-2/3 grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                          <div className="text-sm font-medium">
                            {(agent.metrics.successRate * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Avg Time</div>
                          <div className="text-sm font-medium">
                            {agent.metrics.averageProcessingTime}ms
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Tasks</div>
                          <div className="text-sm font-medium">
                            {agent.metrics.totalTasksProcessed}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium">Capability Usage</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {data.agents.flatMap(agent => 
                    agent.capabilities.map(cap => ({
                      agent: agent.name,
                      capability: cap.name,
                      count: cap.usageCount,
                      successRate: cap.successRate,
                      avgTime: cap.averageExecutionTime
                    }))
                  )
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 8)
                  .map((item, index) => (
                    <div key={index} className="border rounded p-2">
                      <div className="text-sm font-medium truncate">{item.capability}</div>
                      <div className="text-xs text-muted-foreground truncate">{item.agent}</div>
                      <div className="mt-1 flex justify-between text-xs">
                        <span>{item.count} uses</span>
                        <span>{(item.successRate * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium">Task Queue Status</h3>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {data.agents
                    .filter(agent => agent.metrics.queuedTasks > 0)
                    .sort((a, b) => b.metrics.queuedTasks - a.metrics.queuedTasks)
                    .map(agent => (
                      <div key={agent.id} className="border rounded p-2">
                        <div className="text-sm font-medium truncate">{agent.name}</div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 text-amber-500 mr-1" />
                            <span className="text-sm">{agent.metrics.queuedTasks} queued</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {(agent.metrics.currentLoad * 100).toFixed(0)}% load
                          </span>
                        </div>
                      </div>
                    ))}
                  
                  {data.agents.filter(agent => agent.metrics.queuedTasks > 0).length === 0 && (
                    <div className="col-span-3 text-center p-4 text-muted-foreground">
                      No queued tasks
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'alerts' && data && (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              {data.agents
                .filter(agent => agent.alerts.length > 0)
                .map(agent => (
                  <div key={agent.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <h3 className="font-medium">{agent.name}</h3>
                        <div className="ml-2">{getStatusBadge(agent.status)}</div>
                      </div>
                      <Badge variant="outline">
                        {agent.alerts.length} {agent.alerts.length === 1 ? 'alert' : 'alerts'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {agent.alerts.map(alert => (
                        <div key={alert.id} className="bg-muted/50 p-3 rounded-md">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              {getAlertIcon(alert.type)}
                              <div className="ml-2">
                                <div className="font-medium">{alert.message}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatRelativeTime(alert.timestamp)}
                                </div>
                              </div>
                            </div>
                            {alert.acknowledged ? (
                              <Badge variant="outline" className="text-xs">Acknowledged</Badge>
                            ) : (
                              <Button variant="outline" size="sm">Acknowledge</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              
              {data.agents.filter(agent => agent.alerts.length > 0).length === 0 && (
                <div className="border rounded-md p-8 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-medium mb-1">All Clear</h3>
                  <p className="text-muted-foreground">No alerts to display</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-2">
        <div className="w-full flex justify-between text-xs text-muted-foreground">
          <div>
            {data && 
              `${data.agents.length} agents | ${data.agents.filter(a => a.status === 'online' || a.status === 'busy').length} active`
            }
          </div>
          <div>
            Last updated: {data ? formatRelativeTime(data.lastUpdated) : '---'}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}