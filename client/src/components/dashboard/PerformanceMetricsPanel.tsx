/**
 * PerformanceMetricsPanel Component
 * 
 * This component displays performance metrics for the Loki Variant System,
 * including system stability, processing times, and agent effectiveness.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3, ArrowUpCircle, ArrowDownCircle, Minus, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface SystemStability {
  timestamp: string;
  value: number;
  category: 'CRITICAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'OPTIMAL';
  factors: {
    name: string;
    impact: number;
  }[];
}

interface ProcessingTime {
  agentId: string;
  agentName: string;
  averageTime: number;
  operationCount: number;
  trend: 'up' | 'down' | 'stable';
  recentTimes: {
    timestamp: string;
    duration: number;
  }[];
}

interface AgentEffectiveness {
  agentId: string;
  agentName: string;
  successRate: number;
  outputQuality: number;
  innovationScore: number;
  tasksCompleted: number;
  trend: 'up' | 'down' | 'stable';
}

interface ResourceUsage {
  timestamp: string;
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

interface PerformanceMetrics {
  systemStability: SystemStability;
  processingTimes: ProcessingTime[];
  agentEffectiveness: AgentEffectiveness[];
  resourceUsage: ResourceUsage[];
}

// Color palette for charts
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

const STABILITY_COLORS = {
  CRITICAL: '#ff4d4f',
  LOW: '#faad14',
  MEDIUM: '#1890ff',
  HIGH: '#52c41a',
  OPTIMAL: '#13c2c2'
};

export function PerformanceMetricsPanel() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  useEffect(() => {
    fetchMetrics();
  }, [selectedTimeRange]);

  const fetchMetrics = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/loki-system/metrics?timeRange=${selectedTimeRange}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }
      
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      
      // Use sample data if API isn't ready yet
      const now = new Date();
      const getTime = (minutesAgo: number) => new Date(now.getTime() - minutesAgo * 60000).toISOString();
      
      setMetrics({
        systemStability: {
          timestamp: now.toISOString(),
          value: 82,
          category: 'HIGH',
          factors: [
            { name: 'Agent Coordination', impact: 0.8 },
            { name: 'Chunk Processing', impact: 0.9 },
            { name: 'Error Handling', impact: 0.7 },
            { name: 'Resource Utilization', impact: 0.85 }
          ]
        },
        processingTimes: [
          {
            agentId: 'dream-state-wilton-ai',
            agentName: 'Dream-State Wilton AI',
            averageTime: 453,
            operationCount: 127,
            trend: 'down',
            recentTimes: [
              { timestamp: getTime(50), duration: 480 },
              { timestamp: getTime(40), duration: 470 },
              { timestamp: getTime(30), duration: 460 },
              { timestamp: getTime(20), duration: 445 },
              { timestamp: getTime(10), duration: 435 },
              { timestamp: getTime(5), duration: 430 }
            ]
          },
          {
            agentId: 'loki-reflective-mirror-ai',
            agentName: 'Loki Reflective Mirror AI',
            averageTime: 215,
            operationCount: 185,
            trend: 'stable',
            recentTimes: [
              { timestamp: getTime(50), duration: 220 },
              { timestamp: getTime(40), duration: 210 },
              { timestamp: getTime(30), duration: 215 },
              { timestamp: getTime(20), duration: 218 },
              { timestamp: getTime(10), duration: 212 },
              { timestamp: getTime(5), duration: 215 }
            ]
          },
          {
            agentId: 'quantum-coordinator',
            agentName: 'Quantum Coordinator',
            averageTime: 168,
            operationCount: 342,
            trend: 'down',
            recentTimes: [
              { timestamp: getTime(50), duration: 175 },
              { timestamp: getTime(40), duration: 172 },
              { timestamp: getTime(30), duration: 170 },
              { timestamp: getTime(20), duration: 165 },
              { timestamp: getTime(10), duration: 163 },
              { timestamp: getTime(5), duration: 160 }
            ]
          },
          {
            agentId: 'symbolic-interpreter',
            agentName: 'Symbolic Interpreter',
            averageTime: 135,
            operationCount: 267,
            trend: 'up',
            recentTimes: [
              { timestamp: getTime(50), duration: 120 },
              { timestamp: getTime(40), duration: 125 },
              { timestamp: getTime(30), duration: 130 },
              { timestamp: getTime(20), duration: 135 },
              { timestamp: getTime(10), duration: 142 },
              { timestamp: getTime(5), duration: 150 }
            ]
          },
          {
            agentId: 'true-index-analyst',
            agentName: 'True-Index Analyst',
            averageTime: 285,
            operationCount: 198,
            trend: 'down',
            recentTimes: [
              { timestamp: getTime(50), duration: 295 },
              { timestamp: getTime(40), duration: 290 },
              { timestamp: getTime(30), duration: 288 },
              { timestamp: getTime(20), duration: 285 },
              { timestamp: getTime(10), duration: 280 },
              { timestamp: getTime(5), duration: 275 }
            ]
          }
        ],
        agentEffectiveness: [
          {
            agentId: 'dream-state-wilton-ai',
            agentName: 'Dream-State Wilton AI',
            successRate: 0.93,
            outputQuality: 0.87,
            innovationScore: 0.92,
            tasksCompleted: 127,
            trend: 'up'
          },
          {
            agentId: 'loki-reflective-mirror-ai',
            agentName: 'Loki Reflective Mirror AI',
            successRate: 0.96,
            outputQuality: 0.91,
            innovationScore: 0.78,
            tasksCompleted: 185,
            trend: 'stable'
          },
          {
            agentId: 'quantum-coordinator',
            agentName: 'Quantum Coordinator',
            successRate: 0.98,
            outputQuality: 0.94,
            innovationScore: 0.81,
            tasksCompleted: 342,
            trend: 'up'
          },
          {
            agentId: 'symbolic-interpreter',
            agentName: 'Symbolic Interpreter',
            successRate: 0.95,
            outputQuality: 0.89,
            innovationScore: 0.76,
            tasksCompleted: 267,
            trend: 'stable'
          },
          {
            agentId: 'true-index-analyst',
            agentName: 'True-Index Analyst',
            successRate: 0.91,
            outputQuality: 0.88,
            innovationScore: 0.85,
            tasksCompleted: 198,
            trend: 'up'
          }
        ],
        resourceUsage: Array(24).fill(0).map((_, i) => ({
          timestamp: getTime(24 * 60 - i * 60),
          cpu: 20 + Math.random() * 30,
          memory: 35 + Math.random() * 25,
          storage: 15 + Math.random() * 10,
          network: 5 + Math.random() * 15
        }))
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  function getTrendIcon(trend: 'up' | 'down' | 'stable') {
    switch (trend) {
      case 'up':
        return <ArrowUpCircle className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownCircle className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-amber-500" />;
    }
  }

  function formatMilliseconds(ms: number) {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  }

  function formatPercentage(value: number) {
    return `${(value * 100).toFixed(1)}%`;
  }

  if (loading && !metrics) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2">Loading metrics...</span>
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
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              System performance and agent effectiveness metrics
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-md">
              <Button 
                variant={selectedTimeRange === '1h' ? 'default' : 'ghost'} 
                size="sm"
                className="h-8"
                onClick={() => setSelectedTimeRange('1h')}
              >
                1h
              </Button>
              <Button 
                variant={selectedTimeRange === '24h' ? 'default' : 'ghost'} 
                size="sm"
                className="h-8"
                onClick={() => setSelectedTimeRange('24h')}
              >
                24h
              </Button>
              <Button 
                variant={selectedTimeRange === '7d' ? 'default' : 'ghost'} 
                size="sm"
                className="h-8"
                onClick={() => setSelectedTimeRange('7d')}
              >
                7d
              </Button>
              <Button 
                variant={selectedTimeRange === '30d' ? 'default' : 'ghost'} 
                size="sm"
                className="h-8"
                onClick={() => setSelectedTimeRange('30d')}
              >
                30d
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8"
              onClick={fetchMetrics}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
            <TabsTrigger value="resources">Resource Usage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {metrics && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">System Stability</div>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold mr-2">{metrics.systemStability.value}%</div>
                      <div 
                        className="text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: STABILITY_COLORS[metrics.systemStability.category] + '33' }}
                      >
                        {metrics.systemStability.category}
                      </div>
                    </div>
                    <div className="h-24 mt-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={metrics.systemStability.factors}
                            dataKey="impact"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={40}
                            fill="#8884d8"
                            label={({ name, impact }) => `${name}: ${(impact * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {metrics.systemStability.factors.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-2">Agent Processing Times</div>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={metrics.processingTimes}
                          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                        >
                          <XAxis dataKey="agentName" tick={false} />
                          <YAxis tickFormatter={(value) => `${value}ms`} />
                          <Tooltip
                            formatter={(value: number) => [`${value}ms`, 'Processing Time']}
                            labelFormatter={(value) => String(value)}
                          />
                          <Bar dataKey="averageTime" fill="#8884d8" name="Avg. Processing Time">
                            {metrics.processingTimes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">Agent Effectiveness</div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={metrics.agentEffectiveness}
                        margin={{ top: 5, right: 30, bottom: 20, left: 20 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                        <YAxis dataKey="agentName" type="category" width={150} />
                        <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`]} />
                        <Legend />
                        <Bar dataKey="successRate" fill="#8884d8" name="Success Rate" />
                        <Bar dataKey="outputQuality" fill="#82ca9d" name="Output Quality" />
                        <Bar dataKey="innovationScore" fill="#ffc658" name="Innovation" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="agents" className="space-y-4">
            {metrics && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Agent Processing Times</div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metrics.processingTimes.flatMap(agent => 
                        agent.recentTimes.map(t => ({
                          ...t, 
                          agentName: agent.agentName,
                          agentId: agent.agentId
                        }))
                      )}
                      margin={{ top: 5, right: 30, bottom: 5, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                      />
                      <YAxis tickFormatter={(value) => `${value}ms`} />
                      <Tooltip 
                        formatter={(value: number) => [`${value}ms`, 'Duration']}
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                      />
                      <Legend />
                      {metrics.processingTimes.map((agent, index) => (
                        <Line
                          key={agent.agentId}
                          type="monotone"
                          dataKey="duration"
                          data={agent.recentTimes.map(t => ({ ...t, agentName: agent.agentName, agentId: agent.agentId }))}
                          name={agent.agentName}
                          stroke={COLORS[index % COLORS.length]}
                          activeDot={{ r: 8 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {metrics.processingTimes.map(agent => (
                    <div key={agent.agentId} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{agent.agentName}</span>
                        <div className="flex items-center">
                          {getTrendIcon(agent.trend)}
                          <span className="text-xs ml-1">
                            {agent.trend === 'down' ? 'Improving' : 
                             agent.trend === 'up' ? 'Slowing' : 'Stable'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Avg. Time:</div>
                          <div>{formatMilliseconds(agent.averageTime)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Operations:</div>
                          <div>{agent.operationCount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm font-medium mt-6">Agent Effectiveness</div>
                <div className="space-y-3">
                  {metrics.agentEffectiveness.map(agent => (
                    <div key={agent.agentId} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{agent.agentName}</span>
                        <div className="flex items-center">
                          {getTrendIcon(agent.trend)}
                          <span className="text-xs ml-1">
                            {agent.trend === 'up' ? 'Improving' : 
                             agent.trend === 'down' ? 'Declining' : 'Stable'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-sm mb-3">
                        <div>
                          <div className="text-muted-foreground">Success Rate:</div>
                          <div>{formatPercentage(agent.successRate)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Output Quality:</div>
                          <div>{formatPercentage(agent.outputQuality)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Innovation:</div>
                          <div>{formatPercentage(agent.innovationScore)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Tasks:</div>
                          <div>{agent.tasksCompleted}</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2 mb-1">
                        <div 
                          className="bg-primary rounded-full h-2" 
                          style={{ width: `${agent.successRate * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-right text-muted-foreground">
                        Overall Effectiveness
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            {metrics && (
              <>
                <div className="h-64 border rounded-lg p-4">
                  <div className="text-sm font-medium mb-2">Resource Usage Over Time</div>
                  <ResponsiveContainer width="100%" height="90%">
                    <LineChart
                      data={metrics.resourceUsage}
                      margin={{ top: 5, right: 30, bottom: 5, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                      />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Usage']}
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU" />
                      <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory" />
                      <Line type="monotone" dataKey="storage" stroke="#ffc658" name="Storage" />
                      <Line type="monotone" dataKey="network" stroke="#ff8042" name="Network" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-1">CPU Usage</div>
                    <div className="text-2xl font-bold">
                      {metrics.resourceUsage[metrics.resourceUsage.length - 1].cpu.toFixed(1)}%
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-500 rounded-full h-2" 
                        style={{ width: `${metrics.resourceUsage[metrics.resourceUsage.length - 1].cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-1">Memory Usage</div>
                    <div className="text-2xl font-bold">
                      {metrics.resourceUsage[metrics.resourceUsage.length - 1].memory.toFixed(1)}%
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 rounded-full h-2" 
                        style={{ width: `${metrics.resourceUsage[metrics.resourceUsage.length - 1].memory}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-1">Storage Usage</div>
                    <div className="text-2xl font-bold">
                      {metrics.resourceUsage[metrics.resourceUsage.length - 1].storage.toFixed(1)}%
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-yellow-500 rounded-full h-2" 
                        style={{ width: `${metrics.resourceUsage[metrics.resourceUsage.length - 1].storage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium mb-1">Network Usage</div>
                    <div className="text-2xl font-bold">
                      {metrics.resourceUsage[metrics.resourceUsage.length - 1].network.toFixed(1)}%
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-orange-500 rounded-full h-2" 
                        style={{ width: `${metrics.resourceUsage[metrics.resourceUsage.length - 1].network}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">
          {metrics && `Last updated: ${new Date().toLocaleString()}`}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchMetrics}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}