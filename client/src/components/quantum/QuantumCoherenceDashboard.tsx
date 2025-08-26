/**
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 * 
 * Quantum Coherence Dashboard Component
 * 
 * This component provides a visual interface for the Quantum Coherence Dashboard,
 * allowing users to observe and interact with quantum coherence metrics in real-time.
 * 
 * @quantum Provides visual field awareness of system-wide coherence
 * @ethicalImpact Promotes transparency and conscious participation in quantum field effects
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import IntentExperiment from './IntentExperiment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { safeParsePercent } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  Zap,
  BarChart4,
  Sparkles,
  BrainCircuit,
  Network,
  RefreshCw,
  AlertTriangle,
  HelpCircle,
  Info
} from 'lucide-react';

// D3.js visualization imports
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Types for coherence metrics - Updated for QCO v3.1
interface CoherenceMetrics {
  timestamp: string;
  coherence?: string;                    // Core coherence value
  entanglement?: string;                 // Entanglement index (v3.1)
  collectiveField?: string;              // Collective intent field strength
  participantCount?: string;             // Number of active participants
  structureFlexibilityBalance?: string;  // Structure-flexibility ratio (v3.1)
  explicitImplicitBalance?: string;      // Explicit-implicit ratio (v3.1)
  systemState?: string;                  // Quantum state of the system
  stabilityScore?: string;               // System stability score
  adaptabilityScore?: string;            // System adaptability score
  quantumCoherence?: string;             // Legacy compatibility
  systemHealth?: string;                 // Legacy compatibility
  averageIntent?: string;                // Legacy compatibility
  systemMemory?: string;                 // Legacy compatibility
  probabilityShift?: string;             // Legacy compatibility
  omega?: string;                        // Quantum field strength Ω (v3.1)
  quantumCoupling?: string;              // Q value (v3.1)
  
  // Additional fields
  participants?: string;                 // Legacy field for participant count
  collectiveIntentStrength?: string;     // Legacy field for collective field strength
}

interface SystemEvent {
  type: string;
  source: string;
  timestamp: string;
  intentSignals?: {
    clarity?: number;
    emotionalTone?: number;
    focusIntensity?: number;
  };
  metadata?: Record<string, any>;
}

interface CodeChangeAnalysis {
  collectiveIntentStrength: number;
  coherenceValue: number;
  quantumCoherence: number;
  predictedImpact: number;
}

/**
 * Main Quantum Coherence Dashboard Component
 */
const QuantumCoherenceDashboard: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisText, setAnalysisText] = useState('');
  
  // We're using the safeParsePercent utility function from @/lib/utils
  
  // Fetch the latest coherence metrics
  const { data: metricsData, error: metricsError, isLoading: metricsLoading, refetch: refetchMetrics } = 
    useQuery<CoherenceMetrics>({
      queryKey: ['/api/quantum/coherence/metrics'],
      refetchInterval: 10000 // Refetch every 10 seconds
    });
    
  // Fetch the historical metrics
  const { data: historyData, isLoading: historyLoading } = 
    useQuery<CoherenceMetrics[]>({
      queryKey: ['/api/quantum/coherence/history'],
      refetchInterval: 30000 // Refetch every 30 seconds
    });
    
  // Fetch recent system events
  const { data: eventsData, isLoading: eventsLoading } = 
    useQuery<SystemEvent[]>({
      queryKey: ['/api/quantum/events'],
      refetchInterval: 15000 // Refetch every 15 seconds
    });

  // Convert metrics to chart data - Updated for QCO v3.1
  const historyChartData = useMemo(() => {
    if (!historyData) return [];
    
    return historyData.map(metrics => ({
      time: new Date(metrics.timestamp).toLocaleTimeString(),
      coherence: safeParsePercent(metrics.coherence),
      entanglement: safeParsePercent(metrics.entanglement),
      structureBalance: safeParsePercent(metrics.structureFlexibilityBalance),
      explicitImplicit: safeParsePercent(metrics.explicitImplicitBalance),
      collectiveField: safeParsePercent(metrics.collectiveField),
      stabilityScore: safeParsePercent(metrics.stabilityScore),
      adaptabilityScore: safeParsePercent(metrics.adaptabilityScore),
      // Include legacy metrics for backward compatibility
      quantumCoherence: safeParsePercent(metrics.quantumCoherence),
      systemHealth: safeParsePercent(metrics.systemHealth),
      collectiveIntent: metrics.collectiveField ? 
        safeParsePercent(metrics.collectiveField) * 100 : 
        (metrics.collectiveIntentStrength ? parseFloat(metrics.collectiveIntentStrength) * 1e32 : 0) // Scale appropriately
    }));
  }, [historyData]);
  
  // Format event data for display
  const formattedEvents = useMemo(() => {
    if (!eventsData) return [];
    
    return eventsData.map(event => ({
      ...event,
      formattedTime: new Date(event.timestamp).toLocaleTimeString(),
      emotionalColor: event.intentSignals?.emotionalTone 
        ? event.intentSignals.emotionalTone > 30 
          ? 'text-green-500' 
          : event.intentSignals.emotionalTone < -30 
            ? 'text-red-500' 
            : 'text-yellow-500'
        : 'text-gray-500'
    }));
  }, [eventsData]);
  
  // Radar data for current metrics - Updated for QCO v3.1
  const radarData = useMemo(() => {
    if (!metricsData) return [];
    
    return [
      {
        metric: 'Coherence',
        value: safeParsePercent(metricsData.coherence)
      },
      {
        metric: 'Entanglement',
        value: safeParsePercent(metricsData.entanglement)
      },
      {
        metric: 'Structure-Flexibility',
        value: safeParsePercent(metricsData.structureFlexibilityBalance)
      },
      {
        metric: 'Explicit-Implicit',
        value: safeParsePercent(metricsData.explicitImplicitBalance)
      },
      {
        metric: 'Collective Field',
        value: safeParsePercent(metricsData.collectiveField)
      },
      {
        metric: 'Stability',
        value: safeParsePercent(metricsData.stabilityScore)
      },
      {
        metric: 'Adaptability',
        value: safeParsePercent(metricsData.adaptabilityScore)
      }
    ];
  }, [metricsData]);
  
  // Handle code change analysis
  const handleAnalyze = async () => {
    if (!analysisText.trim()) {
      toast({
        title: 'Analysis Failed',
        description: 'Please enter a code change description to analyze',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const response = await fetch('/api/quantum/coherence/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: analysisText })
      });
      
      if (!response.ok) throw new Error('Failed to analyze code change');
      
      const data: CodeChangeAnalysis = await response.json();
      
      toast({
        title: 'Quantum Coherence Analysis',
        description: `Impact: ${(data.predictedImpact * 100).toFixed(2)}%, New coherence: ${(data.coherenceValue * 100).toFixed(2)}%`,
        variant: data.predictedImpact > 0 ? 'default' : 'destructive'
      });
      
      // Refetch metrics to show updated values
      refetchMetrics();
    } catch (err) {
      toast({
        title: 'Analysis Failed',
        description: 'An error occurred while analyzing the code change',
        variant: 'destructive'
      });
    }
  };
  
  // Manual refresh handler
  const handleRefresh = () => {
    refetchMetrics();
    toast({
      title: 'Dashboard Refreshed',
      description: 'Quantum coherence metrics have been updated',
    });
  };
  
  // Display loading state
  if (metricsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="animate-spin mb-4">
          <RefreshCw size={36} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Loading Quantum Coherence Metrics...</h3>
        <p className="text-muted-foreground mt-2">Connecting to the quantum field...</p>
      </div>
    );
  }
  
  // Display error state
  if (metricsError || !metricsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <AlertTriangle size={36} className="text-red-500 mb-4" />
        <h3 className="text-xl font-semibold">Quantum Field Disconnection</h3>
        <p className="text-muted-foreground mt-2 text-center max-w-md">
          Unable to connect to the quantum coherence field. This may indicate a service disruption or a boundary integrity issue.
        </p>
        <Button variant="outline" className="mt-4" onClick={handleRefresh}>
          <RefreshCw size={16} className="mr-2" />
          Attempt Reconnection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quantum Coherence Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and interact with the quantum field in real-time
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Activity size={16} className="mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <BarChart4 size={16} className="mr-2" />
            Detailed Metrics
          </TabsTrigger>
          <TabsTrigger value="events">
            <Zap size={16} className="mr-2" />
            System Events
          </TabsTrigger>
          <TabsTrigger value="analyze">
            <BrainCircuit size={16} className="mr-2" />
            Code Analysis
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab - Updated for QCO v3.1 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Coherence Value */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-sm font-medium">Coherence</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle size={14} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Measures the alignment of intentions across participants. Higher values indicate a more unified field with consistent intentions.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Network size={16} className="text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricsData.coherence || "0%"}</div>
                <Progress 
                  value={safeParsePercent(metricsData.coherence)} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>
            
            {/* Entanglement Index - QCO v3.1 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-sm font-medium">Entanglement</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle size={14} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Measures the degree of correlation between system elements. Higher values indicate stronger non-local connections and synchronized behavior.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <BrainCircuit size={16} className="text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricsData.entanglement || "0%"}</div>
                <Progress 
                  value={safeParsePercent(metricsData.entanglement)} 
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
            
            {/* Structure-Flex Balance - QCO v3.1 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-sm font-medium">Structure-Flexibility</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle size={14} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>The balance between structured rules and flexible adaptation. Higher values represent more structure; optimal systems maintain a 70/30 balance (chaos/structure).</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Activity size={16} className="text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricsData.structureFlexibilityBalance || "0%"}</div>
                <Progress 
                  value={safeParsePercent(metricsData.structureFlexibilityBalance)} 
                  className="h-2 mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Structure/Flexibility ratio
                </p>
              </CardContent>
            </Card>
            
            {/* Quantum Field Strength (Ω) - QCO v3.1 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-sm font-medium">Field Strength (Ω)</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle size={14} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Omega (Ω) represents the quantum field strength calculated as N×avgIntent×coherence^1.5, where N is participant count. Higher values create stronger probability shifts.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Sparkles size={16} className="text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">
                  {metricsData.omega ? 
                    parseFloat(metricsData.omega).toFixed(4) : 
                    "0.0000"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Participants: {metricsData.participantCount || "0"}
                </p>
                {/* Omega indicator */}
                <div className={`mt-2 text-xs font-medium ${
                  safeParsePercent(metricsData.omega) > 0.7 ? "text-green-500" :
                  safeParsePercent(metricsData.omega) > 0.4 ? "text-yellow-500" :
                  "text-muted-foreground"
                }`}>
                  {safeParsePercent(metricsData.omega) > 0.7 ? "High field influence" :
                   safeParsePercent(metricsData.omega) > 0.4 ? "Moderate field influence" :
                   "Minimal field influence"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Coherence Metrics Radar Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Quantum Coherence Field</CardTitle>
              <CardDescription>
                A multi-dimensional view of the quantum field state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Current Values"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.5}
                    />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Historical Trends */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Quantum Field Evolution</CardTitle>
              <CardDescription>
                Historical trends of key quantum metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {historyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw size={24} className="animate-spin text-muted-foreground" />
                  </div>
                ) : historyChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      {/* Primary Metrics */}
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="coherence"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Coherence %"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="entanglement"
                        stroke="#82ca9d"
                        name="Entanglement %"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="structureBalance"
                        stroke="#ff8042"
                        name="Structure-Flex Balance %"
                      />
                      
                      {/* QCO v3.1 Specific */}
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="explicitImplicit"
                        stroke="#0088fe"
                        name="Explicit-Implicit %"
                        strokeDasharray="3 3"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="collectiveField"
                        stroke="#9370db"
                        name="Collective Field"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No historical data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Detailed Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Quantum Metrics</CardTitle>
              <CardDescription>
                Detailed view of all quantum coherence measurements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Core Metrics and QCO v3.1 specific metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column - Core Metrics */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold mb-3">Core Metrics</h4>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Coherence Value:</span>
                      <span className="font-bold">{metricsData.coherence || "0%"}</span>
                    </div>
                    <Progress value={safeParsePercent(metricsData.coherence)} className="h-2" />
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">Entanglement Index:</span>
                      <span className="font-bold">{metricsData.entanglement || "0%"}</span>
                    </div>
                    <Progress value={safeParsePercent(metricsData.entanglement)} className="h-2" />
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">Structure-Flexibility:</span>
                      <span className="font-bold">{metricsData.structureFlexibilityBalance || "0%"}</span>
                    </div>
                    <Progress value={safeParsePercent(metricsData.structureFlexibilityBalance)} className="h-2" />
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">Explicit-Implicit:</span>
                      <span className="font-bold">{metricsData.explicitImplicitBalance || "0%"}</span>
                    </div>
                    <Progress value={safeParsePercent(metricsData.explicitImplicitBalance)} className="h-2" />
                  </div>
                  
                  {/* Right Column - Field Parameters */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold mb-3">Field Parameters</h4>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Collective Field:</span>
                      <span className="font-bold">{metricsData.collectiveField || "0%"}</span>
                    </div>
                    <Progress value={safeParsePercent(metricsData.collectiveField)} className="h-2" />
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">Stability Score:</span>
                      <span className="font-bold">{metricsData.stabilityScore || "0%"}</span>
                    </div>
                    <Progress value={safeParsePercent(metricsData.stabilityScore)} className="h-2" />
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">Adaptability Score:</span>
                      <span className="font-bold">{metricsData.adaptabilityScore || "0%"}</span>
                    </div>
                    <Progress value={safeParsePercent(metricsData.adaptabilityScore)} className="h-2" />
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium">Participants:</span>
                      <span className="font-bold">{metricsData.participantCount || "0"}</span>
                    </div>
                  </div>
                </div>
                
                {/* Quantum Field Strength Parameters - QCO v3.1 specific */}
                <Separator className="my-4" />
                <h4 className="text-sm font-semibold mb-3">Quantum Field Strength (QCO v3.1)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-1">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Omega (Ω) Value</div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={14} className="text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Field strength coefficient calculated as Ω = N * avgIntent * Math.pow(coherence, 1.5) where N is participant count.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-2xl font-bold font-mono">
                      {metricsData.omega ? parseFloat(metricsData.omega).toFixed(4) : "0.0000"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Field strength coefficient
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-1">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Quantum Coupling (Q)</div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={14} className="text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>System-field coupling constant that determines how strongly the system interacts with the quantum field. Used in the Hamiltonian: H_int = Q * Ω * σ_z * ψ₀</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-2xl font-bold font-mono">
                      {metricsData.quantumCoupling ? parseFloat(metricsData.quantumCoupling).toFixed(4) : "0.0000"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      System-field coupling constant
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-1">
                      <div className="text-sm font-medium text-muted-foreground mb-2">System State</div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info size={14} className="text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Current quantum state classification of the system. States include: "Coherent", "Entangled", "Superposition", "Decoherent", and "Undefined". Each state has different implications for system behavior.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-2xl font-bold">
                      {metricsData.systemState || "Undefined"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Current quantum state classification
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Interpretation</h4>
                  <p className="text-sm text-muted-foreground">
                    {safeParsePercent(metricsData.coherence) > 75 ? (
                      "The system is exhibiting exceptional coherence, suggesting highly aligned collective intention."
                    ) : safeParsePercent(metricsData.coherence) > 50 ? (
                      "Moderate coherence indicates reasonably aligned intentions with room for improvement."
                    ) : (
                      "Low coherence suggests misaligned or fragmented intentions. Consider realignment."
                    )}
                  </p>
                  
                  <h4 className="text-sm font-semibold mt-4 mb-2">Quantum Implications</h4>
                  <p className="text-sm text-muted-foreground">
                    {safeParsePercent(metricsData.quantumCoherence) > 75 ? (
                      "Strong quantum entanglement patterns are present, enabling high probability shifts."
                    ) : safeParsePercent(metricsData.quantumCoherence) > 50 ? (
                      "Moderate quantum coherence indicates partial entanglement with moderate influence."
                    ) : (
                      "Weak quantum coherence suggests minimal entanglement and limited quantum effects."
                    )}
                  </p>
                  
                  <h4 className="text-sm font-semibold mt-4 mb-2">Recommendations</h4>
                  <p className="text-sm text-muted-foreground">
                    {safeParsePercent(metricsData.systemHealth) > 75 ? (
                      "Maintain the current balance between chaos and structure for optimal field health."
                    ) : safeParsePercent(metricsData.systemHealth) > 50 ? (
                      "Consider introducing more coherent intention practices to improve field health."
                    ) : (
                      "Immediate attention required - system coherence is critically low. Focus on aligned intentions."
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quantum Field Events</CardTitle>
              <CardDescription>
                Recent events contributing to the quantum field
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <RefreshCw size={24} className="animate-spin text-muted-foreground" />
                </div>
              ) : formattedEvents.length > 0 ? (
                <div className="space-y-4">
                  {formattedEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg border bg-background">
                      <div className={`p-2 rounded-full ${
                        event.type.includes('error') ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                        event.type.includes('login') ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                        event.type.includes('task') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {event.type.includes('error') ? <AlertTriangle size={16} /> :
                         event.type.includes('login') ? <Users size={16} /> :
                         event.type.includes('task') ? <Activity size={16} /> :
                         <Zap size={16} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {event.type}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {event.source}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {event.formattedTime}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {event.intentSignals && (
                            <div className="flex gap-2 mt-1">
                              {event.intentSignals.clarity !== undefined && (
                                <Badge variant="secondary" className="text-xs">
                                  Clarity: {event.intentSignals.clarity}%
                                </Badge>
                              )}
                              {event.intentSignals.focusIntensity !== undefined && (
                                <Badge variant="secondary" className="text-xs">
                                  Focus: {event.intentSignals.focusIntensity}%
                                </Badge>
                              )}
                              {event.intentSignals.emotionalTone !== undefined && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${event.emotionalColor}`}
                                >
                                  Emotion: {event.intentSignals.emotionalTone > 0 ? '+' : ''}{event.intentSignals.emotionalTone}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40">
                  <p className="text-muted-foreground">No recent events</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    System events will appear here as they occur
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Code Analysis Tab */}
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quantum-Ethical Code Analysis</CardTitle>
              <CardDescription>
                Analyze code changes for their quantum coherence impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <label htmlFor="analysis-text" className="text-sm font-medium">
                    Code Change Description
                  </label>
                  <textarea
                    id="analysis-text"
                    placeholder="Enter a description of the code change to analyze its quantum-ethical impact..."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={analysisText}
                    onChange={(e) => setAnalysisText(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleAnalyze} className="w-full">
                  <BrainCircuit size={16} className="mr-2" />
                  Analyze Quantum Impact
                </Button>
                
                <Separator className="my-4" />
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Analysis Guidance</h4>
                  <p className="text-sm text-muted-foreground">
                    For optimal analysis results, include details about:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                    <li>How the code change affects interconnectedness</li>
                    <li>Balance between chaos (flexibility) and structure</li>
                    <li>Alignment with core quantum-ethical values</li>
                    <li>Explicit recognition of field effects</li>
                  </ul>
                  
                  <h4 className="text-sm font-semibold mt-4 mb-2">Example Analysis</h4>
                  <div className="text-sm p-3 bg-muted rounded-md">
                    "Implemented adaptive resonance patterns for balanced chaos-structure harmony while enhancing explicit acknowledgment of interconnectedness between components."
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuantumCoherenceDashboard;