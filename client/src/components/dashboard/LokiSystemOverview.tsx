/**
 * LokiSystemOverview Component
 * 
 * This component provides a high-level overview of the Loki Variant System,
 * including overall system status, active agents, and key statistics.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Loader2, RefreshCw, AlertCircle, CheckCircle, Info, BarChart3, Activity } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error' | 'initializing';
  lastActivity: string;
  specialization: string;
  processingCount: number;
  successRate: number;
}

interface SystemStatus {
  status: 'online' | 'degraded' | 'offline' | 'initializing';
  uptime: string;
  activeAgents: number;
  totalAgents: number;
  version: string;
  lastRestart: string;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  diagnostics: {
    type: 'info' | 'warning' | 'error';
    message: string;
  }[];
}

interface SystemMetrics {
  chunksProcessed: number;
  totalOperations: number;
  avgProcessingTime: number;
  activeRequests: number;
  queuedRequests: number;
  systemLoadPercentage: number;
}

interface LokiSystemData {
  systemStatus: SystemStatus;
  agents: Agent[];
  metrics: SystemMetrics;
}

export function LokiSystemOverview() {
  const [systemData, setSystemData] = useState<LokiSystemData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/loki-system/status');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch system data: ${response.status}`);
      }
      
      const data = await response.json();
      setSystemData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching system data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Sample data if API isn't ready yet
      setSystemData({
        systemStatus: {
          status: 'online',
          uptime: '3d 7h 45m',
          activeAgents: 5,
          totalAgents: 6,
          version: '1.2.1',
          lastRestart: '2025-03-22T14:30:00Z',
          memoryUsage: {
            used: 712,
            total: 1024,
            percentage: 69.5
          },
          diagnostics: [
            { type: 'info', message: 'System operating within normal parameters' },
            { type: 'warning', message: 'Memory usage above 65%' }
          ]
        },
        agents: [
          {
            id: 'dream-state-wilton-ai',
            name: 'Dream-State Wilton AI',
            status: 'active',
            lastActivity: '2025-03-25T09:47:12Z',
            specialization: 'Alternative Approach Generation',
            processingCount: 127,
            successRate: 0.93
          },
          {
            id: 'loki-reflective-mirror-ai',
            name: 'Loki Reflective Mirror AI',
            status: 'active',
            lastActivity: '2025-03-25T09:48:05Z',
            specialization: 'Output Quality Analysis',
            processingCount: 185,
            successRate: 0.96
          },
          {
            id: 'chronos-kairos-agent',
            name: 'Chronos/Kairos Temporal Agent',
            status: 'active',
            lastActivity: '2025-03-25T09:48:30Z',
            specialization: 'Processing Scheduling',
            processingCount: 253,
            successRate: 0.97
          },
          {
            id: 'quantum-coordinator',
            name: 'Quantum Coordinator',
            status: 'active',
            lastActivity: '2025-03-25T09:48:32Z',
            specialization: 'Agent Assignment & Coordination',
            processingCount: 342,
            successRate: 0.98
          },
          {
            id: 'symbolic-interpreter',
            name: 'Symbolic Interpreter',
            status: 'active',
            lastActivity: '2025-03-25T09:47:55Z',
            specialization: 'Symbol Extraction & Interpretation',
            processingCount: 267,
            successRate: 0.95
          },
          {
            id: 'true-index-analyst',
            name: 'True-Index Analyst',
            status: 'idle',
            lastActivity: '2025-03-25T09:45:12Z',
            specialization: 'Pattern Analysis',
            processingCount: 198,
            successRate: 0.91
          }
        ],
        metrics: {
          chunksProcessed: 1258,
          totalOperations: 7842,
          avgProcessingTime: 347,
          activeRequests: 3,
          queuedRequests: 1,
          systemLoadPercentage: 38
        }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  function getStatusColor(status: 'online' | 'degraded' | 'offline' | 'initializing') {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      case 'initializing': return 'bg-blue-500';
    }
  }

  function getAgentStatusColor(status: 'active' | 'idle' | 'error' | 'initializing') {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-gray-400';
      case 'error': return 'bg-red-500';
      case 'initializing': return 'bg-blue-500';
    }
  }

  function getDiagnosticIcon(type: 'info' | 'warning' | 'error') {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  function formatPercentage(value: number) {
    return `${value.toFixed(1)}%`;
  }

  if (loading && !systemData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Loki Variant System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2">Loading system data...</span>
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
            <CardTitle>Loki Variant System</CardTitle>
            <CardDescription>
              Quantum-inspired multi-agent knowledge processing framework
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchSystemData}
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
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {systemData && (
          <>
            {/* System Status Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3">
                <div className="text-sm font-medium mb-2">System Status</div>
                <div className="flex items-center">
                  <div 
                    className={`w-3 h-3 rounded-full ${getStatusColor(systemData.systemStatus.status)} mr-2`}
                  ></div>
                  <div className="text-lg font-bold capitalize">
                    {systemData.systemStatus.status}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  v{systemData.systemStatus.version} • Uptime: {systemData.systemStatus.uptime}
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="text-sm font-medium mb-2">Active Agents</div>
                <div className="text-lg font-bold">
                  {systemData.systemStatus.activeAgents}/{systemData.systemStatus.totalAgents}
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1.5">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ 
                      width: `${(systemData.systemStatus.activeAgents / systemData.systemStatus.totalAgents) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last restart: {formatDate(systemData.systemStatus.lastRestart)}
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="text-sm font-medium mb-2">Memory Usage</div>
                <div className="text-lg font-bold">
                  {systemData.systemStatus.memoryUsage.used}MB / {systemData.systemStatus.memoryUsage.total}MB
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1.5">
                  <div 
                    className={`rounded-full h-2 ${
                      systemData.systemStatus.memoryUsage.percentage > 85 ? 'bg-red-500' : 
                      systemData.systemStatus.memoryUsage.percentage > 65 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${systemData.systemStatus.memoryUsage.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatPercentage(systemData.systemStatus.memoryUsage.percentage)} used
                </div>
              </div>
            </div>
            
            {/* System Metrics */}
            <div className="border rounded-lg p-3">
              <div className="text-sm font-medium mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                <span>System Metrics</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Chunks Processed</div>
                  <div className="text-lg font-semibold">{systemData.metrics.chunksProcessed}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Total Operations</div>
                  <div className="text-lg font-semibold">{systemData.metrics.totalOperations}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Avg. Processing Time</div>
                  <div className="text-lg font-semibold">{systemData.metrics.avgProcessingTime}ms</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Active Requests</div>
                  <div className="text-lg font-semibold">{systemData.metrics.activeRequests}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Queued Requests</div>
                  <div className="text-lg font-semibold">{systemData.metrics.queuedRequests}</div>
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">System Load</div>
                  <div className="flex items-center">
                    <div className="text-lg font-semibold mr-2">
                      {systemData.metrics.systemLoadPercentage}%
                    </div>
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        systemData.metrics.systemLoadPercentage > 80 ? 'bg-red-500' : 
                        systemData.metrics.systemLoadPercentage > 60 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* System Diagnostics */}
            {systemData.systemStatus.diagnostics.length > 0 && (
              <div className="border rounded-lg p-3">
                <div className="text-sm font-medium mb-2">Diagnostics</div>
                <div className="space-y-2">
                  {systemData.systemStatus.diagnostics.map((diagnostic, index) => (
                    <div 
                      key={index}
                      className={`flex items-start p-2 rounded-md ${
                        diagnostic.type === 'error' ? 'bg-red-50' : 
                        diagnostic.type === 'warning' ? 'bg-yellow-50' : 
                        'bg-blue-50'
                      }`}
                    >
                      <div className="mr-2 mt-0.5">
                        {getDiagnosticIcon(diagnostic.type)}
                      </div>
                      <div className="text-sm">{diagnostic.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Agent Status */}
            <div>
              <div className="text-sm font-medium mb-3">Active Agents</div>
              <div className="space-y-3">
                {systemData.agents.map(agent => (
                  <div key={agent.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{agent.name}</div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          agent.status === 'active' ? 'border-green-500 text-green-700' : 
                          agent.status === 'idle' ? 'border-gray-400 text-gray-700' : 
                          agent.status === 'error' ? 'border-red-500 text-red-700' : 
                          'border-blue-500 text-blue-700'
                        }`}
                      >
                        <div 
                          className={`w-2 h-2 rounded-full mr-1.5 ${getAgentStatusColor(agent.status)}`}
                        ></div>
                        <span className="capitalize">{agent.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="text-xs mt-1 text-muted-foreground">
                      {agent.specialization}
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Processed:</span> {agent.processingCount}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span> {formatPercentage(agent.successRate)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Activity:</span> {formatDate(agent.lastActivity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center">
          <Activity className="h-3 w-3 mr-1" />
          <span>
            Loki Variant System Dashboard — {new Date().toLocaleString()}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}