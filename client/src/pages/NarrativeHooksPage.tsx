import React, { useState, useEffect } from 'react';
import { useQuery, queryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Music, FileText, RefreshCw, Play, Pause, Clock } from "lucide-react";

// Type definitions
interface Stimulus {
  id: string;
  type: string;
  title: string;
  source: string;
  tags: string[];
  weight: number;
  effect: number;
  last_played: string;
}

interface StimulusEffect {
  stimulus_id: string;
  stimulus_title: string;
  stimulus_type: string;
  loop: string;
  phi_before: number;
  phi_after: number;
  delta_phi: number;
  timestamp: number;
}

interface WeightPolicy {
  stimulus_id: string;
  weight: number;
  avg_delta_phi: number;
  last_action: string;
  sample_size: number;
}

interface CoherenceData {
  timestamp: number;
  phi: number;
  dphi_dt: number;
  target_phi: number;
}

const NarrativeHooksPage = () => {
  const [selectedLoop, setSelectedLoop] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  
  // Usar React Query para buscar dados do backend
  const { data: stimuliData, isLoading: isLoadingStimuli } = useQuery({
    queryKey: ['/api/hooks/stimuli'],
    queryFn: async () => {
      const response = await fetch('/api/hooks/stimuli');
      if (!response.ok) {
        throw new Error('Failed to fetch stimuli');
      }
      return response.json() as Promise<Stimulus[]>;
    },
    initialData: [] as Stimulus[] // Inicializar com array vazio
  });
  
  // Extrair loops disponíveis dos estímulos
  const loops = React.useMemo(() => {
    const loopSet = new Set<string>();
    stimuliData.forEach(stimulus => {
      if (stimulus.tags) {
        stimulus.tags.forEach(tag => {
          if (tag.startsWith('loop:')) {
            loopSet.add(tag.replace('loop:', ''));
          }
        });
      }
    });
    return Array.from(loopSet);
  }, [stimuliData]);
  
  // Buscar os principais estímulos calmantes
  const { data: calmingStimuli = [], isLoading: isLoadingCalming } = useQuery({
    queryKey: ['/api/hooks/stimuli/top', 'calming'],
    queryFn: async () => {
      const response = await fetch('/api/hooks/stimuli/top?type=calming&limit=5');
      if (!response.ok) {
        throw new Error('Failed to fetch calming stimuli');
      }
      return response.json() as Promise<StimulusEffect[]>;
    }
  });
  
  // Buscar os principais estímulos agitantes
  const { data: rougheningStimuli = [], isLoading: isLoadingRoughening } = useQuery({
    queryKey: ['/api/hooks/stimuli/top', 'roughening'],
    queryFn: async () => {
      const response = await fetch('/api/hooks/stimuli/top?type=roughening&limit=5');
      if (!response.ok) {
        throw new Error('Failed to fetch roughening stimuli');
      }
      return response.json() as Promise<StimulusEffect[]>;
    }
  });
  
  // Buscar políticas de peso do feedback
  const { data: weights = [], isLoading: isLoadingWeights } = useQuery({
    queryKey: ['/api/hooks/feedback/policies'],
    queryFn: async () => {
      const response = await fetch('/api/hooks/feedback/policies');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback policies');
      }
      return response.json() as Promise<WeightPolicy[]>;
    }
  });
  
  // Buscar histórico de coerência com atualização automática
  const { data: coherenceHistory = [], isLoading: isLoadingCoherence } = useQuery({
    queryKey: ['/api/hooks/coherence'],
    queryFn: async () => {
      const response = await fetch('/api/hooks/coherence?timespan=1h');
      if (!response.ok) {
        throw new Error('Failed to fetch coherence history');
      }
      return response.json() as Promise<CoherenceData[]>;
    },
    // Atualização automática baseada no estado de autoRefresh
    refetchInterval: autoRefresh ? 5000 : false
  });
  
  // Buscar estado atual do sistema (phi atual, alvo, etc.) com auto atualização
  const { data: systemState, isLoading: isLoadingState } = useQuery({
    queryKey: ['/api/hooks/state'],
    queryFn: async () => {
      const response = await fetch('/api/hooks/state');
      if (!response.ok) {
        throw new Error('Failed to fetch system state');
      }
      return response.json();
    },
    // Atualização automática baseada no estado de autoRefresh
    refetchInterval: autoRefresh ? 5000 : false
  });
  
  // Eventos recentes baseados nos estímulos
  const recentEvents = React.useMemo(() => {
    return [...calmingStimuli, ...rougheningStimuli]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [calmingStimuli, rougheningStimuli]);

  // Use system state data para phi atual e alvo
  const currentPhi = systemState?.current_phi || (coherenceHistory.length > 0 ? coherenceHistory[coherenceHistory.length - 1].phi : 0);
  const targetPhi = systemState?.target_phi || 0.75; // 3:1 ratio target
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };
  
  // Get stimulus icon
  const getStimulusIcon = (type: string) => {
    switch (type) {
      case 'youtube':
      case 'music':
        return <Music className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get effect color
  const getEffectColor = (delta: number) => {
    if (delta < -0.05) return "bg-green-100 text-green-800";
    if (delta > 0.05) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };
  
  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };
  
  // Run feedback cycle
  const runFeedbackNow = async () => {
    try {
      const response = await fetch('/api/hooks/feedback/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        console.log('Feedback cycle executed successfully:', data);
        // Refresh data after running feedback
        queryClient.invalidateQueries({ queryKey: ['/api/hooks/stimuli'] });
        queryClient.invalidateQueries({ queryKey: ['/api/hooks/stimuli/top'] });
        queryClient.invalidateQueries({ queryKey: ['/api/hooks/feedback/policies'] });
        queryClient.invalidateQueries({ queryKey: ['/api/hooks/coherence'] });
        queryClient.invalidateQueries({ queryKey: ['/api/hooks/state'] });
      } else {
        console.error('Failed to run feedback cycle:', data);
      }
    } catch (error) {
      console.error('Error running feedback cycle:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Narrative Hooks Dashboard</h1>
          <p className="text-gray-500">Monitor and manage stimuli effects on Φ (quantum coherence)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={autoRefresh ? "default" : "outline"}
            onClick={toggleAutoRefresh}
            className="flex items-center gap-2"
          >
            {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['/api/hooks/stimuli'] });
              queryClient.invalidateQueries({ queryKey: ['/api/hooks/stimuli/top'] });
              queryClient.invalidateQueries({ queryKey: ['/api/hooks/feedback/policies'] });
              queryClient.invalidateQueries({ queryKey: ['/api/hooks/coherence'] });
              queryClient.invalidateQueries({ queryKey: ['/api/hooks/state'] });
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Current Φ</CardTitle>
            <CardDescription>System quantum coherence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{currentPhi.toFixed(4)}</div>
            <div className="text-sm text-gray-500">
              Target: {targetPhi.toFixed(2)} (3:1 ratio)
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className={`text-sm ${Math.abs(currentPhi - targetPhi) < 0.05 ? "text-green-600" : "text-amber-600"}`}>
              {Math.abs(currentPhi - targetPhi) < 0.05 
                ? "On target" 
                : `${((targetPhi - currentPhi) > 0 ? "Increase" : "Decrease")} by ${Math.abs(targetPhi - currentPhi).toFixed(3)}`}
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Loops</CardTitle>
            <CardDescription>Select a loop to filter data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedLoop === 'all' ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedLoop('all')}
              >
                All Loops
              </Badge>
              {loops.map((loop: string) => (
                <Badge 
                  key={loop}
                  variant={selectedLoop === loop ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedLoop(loop)}
                >
                  {loop}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Auto-Feedback</CardTitle>
            <CardDescription>Last run and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-lg">
                Runs every 5 minutes
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={runFeedbackNow}
            >
              Run Feedback Now
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Quantum Coherence (Φ) Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={coherenceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTimestamp}
                    label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    domain={[0, 1]}
                    label={{ value: 'Φ Value', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(4)}
                    labelFormatter={(timestamp) => formatTimestamp(timestamp as number)}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="phi" 
                    name="Quantum Coherence (Φ)" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="dphi_dt" 
                    name="Φ Derivative" 
                    stroke="#82ca9d" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target_phi" 
                    name="Target (0.75)" 
                    stroke="#ff7300" 
                    strokeDasharray="5 5" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="calming">
        <TabsList className="mb-4">
          <TabsTrigger value="calming">Top Calming Stimuli</TabsTrigger>
          <TabsTrigger value="roughening">Top Roughening Stimuli</TabsTrigger>
          <TabsTrigger value="weights">Feedback Weights</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calming">
          <Card>
            <CardHeader>
              <CardTitle>Top Calming Stimuli (Negative ΔΦ)</CardTitle>
              <CardDescription>Stimuli that decrease Φ and promote coherence</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Loop</TableHead>
                    <TableHead>ΔΦ</TableHead>
                    <TableHead>Φ Before</TableHead>
                    <TableHead>Φ After</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calmingStimuli.map((effect) => (
                    <TableRow key={`${effect.stimulus_id}-${effect.timestamp}`}>
                      <TableCell>{getStimulusIcon(effect.stimulus_type)}</TableCell>
                      <TableCell className="font-medium">{effect.stimulus_title}</TableCell>
                      <TableCell>{effect.loop}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {effect.delta_phi.toFixed(4)}
                        </Badge>
                      </TableCell>
                      <TableCell>{effect.phi_before.toFixed(4)}</TableCell>
                      <TableCell>{effect.phi_after.toFixed(4)}</TableCell>
                      <TableCell>{formatTimestamp(effect.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                  {calmingStimuli.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No calming stimuli recorded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roughening">
          <Card>
            <CardHeader>
              <CardTitle>Top Roughening Stimuli (Positive ΔΦ)</CardTitle>
              <CardDescription>Stimuli that increase Φ and promote exploration</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Loop</TableHead>
                    <TableHead>ΔΦ</TableHead>
                    <TableHead>Φ Before</TableHead>
                    <TableHead>Φ After</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rougheningStimuli.map((effect) => (
                    <TableRow key={`${effect.stimulus_id}-${effect.timestamp}`}>
                      <TableCell>{getStimulusIcon(effect.stimulus_type)}</TableCell>
                      <TableCell className="font-medium">{effect.stimulus_title}</TableCell>
                      <TableCell>{effect.loop}</TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">
                          +{effect.delta_phi.toFixed(4)}
                        </Badge>
                      </TableCell>
                      <TableCell>{effect.phi_before.toFixed(4)}</TableCell>
                      <TableCell>{effect.phi_after.toFixed(4)}</TableCell>
                      <TableCell>{formatTimestamp(effect.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                  {rougheningStimuli.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No roughening stimuli recorded yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weights">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Weight Policy</CardTitle>
              <CardDescription>Automatically adjusted weights based on stimulus effects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stimulus ID</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Avg. ΔΦ</TableHead>
                    <TableHead>Last Action</TableHead>
                    <TableHead>Sample Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weights.map((policy) => (
                    <TableRow key={policy.stimulus_id}>
                      <TableCell className="font-medium">{policy.stimulus_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {policy.weight.toFixed(2)}
                          {policy.last_action === 'amplify' && <ArrowUp className="h-4 w-4 text-green-600" />}
                          {policy.last_action === 'dampen' && <ArrowDown className="h-4 w-4 text-red-600" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getEffectColor(policy.avg_delta_phi)}>
                          {policy.avg_delta_phi.toFixed(4)}
                        </Badge>
                      </TableCell>
                      <TableCell>{policy.last_action}</TableCell>
                      <TableCell>{policy.sample_size}</TableCell>
                    </TableRow>
                  ))}
                  {weights.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No feedback weights configured yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stimulus Events</CardTitle>
              <CardDescription>Latest recorded stimulus events and their effects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Loop</TableHead>
                    <TableHead>ΔΦ</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEvents.map((event) => (
                    <TableRow key={`${event.stimulus_id}-${event.timestamp}`}>
                      <TableCell>{getStimulusIcon(event.stimulus_type)}</TableCell>
                      <TableCell className="font-medium">{event.stimulus_title}</TableCell>
                      <TableCell>{event.loop}</TableCell>
                      <TableCell>
                        <Badge className={getEffectColor(event.delta_phi)}>
                          {event.delta_phi > 0 ? '+' : ''}{event.delta_phi.toFixed(4)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatTimestamp(event.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                  {recentEvents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No recent events recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NarrativeHooksPage;