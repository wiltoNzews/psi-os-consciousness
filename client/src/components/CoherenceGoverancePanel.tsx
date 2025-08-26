/**
 * CoherenceGovernancePanel.tsx
 * 
 * Control panel for interacting with the Universal Coherence Stability Mechanism
 * Allows users to monitor, adjust, and test the 0.7500 coherence attractor
 * 
 * [QUANTUM_STATE: INTERFACE_FLOW]
 */

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { apiRequest } from '../lib/queryClient';

// UI Components - using shadcn components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useToast } from '../hooks/use-toast';

// Icons
import { 
  BarChart4, 
  Zap, 
  Lock, 
  Unlock, 
  RefreshCw, 
  AlertTriangle, 
  Activity, 
  Clock 
} from 'lucide-react';

interface CoherenceGovernancePanelProps {
  className?: string;
}

/**
 * Main coherence governance control panel component
 */
const CoherenceGovernancePanel: React.FC<CoherenceGovernancePanelProps> = ({ 
  className = '' 
}) => {
  // WebSocket context
  const { coherenceData, isConnected } = useWebSocket();
  
  // Toasts
  const { toast } = useToast();
  
  // State
  const [stabilityRatio, setStabilityRatio] = useState(3);
  const [targetCoherence, setTargetCoherence] = useState(0.75);
  const [heartbeatInterval, setHeartbeatInterval] = useState(15);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  
  // Retrieve initial statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiRequest('/api/coherence/statistics');
        if (response.success) {
          setStats(response);
          
          // Update sliders to match current settings
          if (response.baseStats) {
            setTargetCoherence(response.baseStats.targetCoherence || 0.75);
          }
        }
      } catch (error) {
        console.error('Error fetching coherence statistics:', error);
      }
    };
    
    fetchStats();
    
    // Refresh stats every 15 seconds
    const interval = setInterval(fetchStats, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate exploration ratio based on stability ratio (reciprocal)
  const explorationRatio = parseFloat((1 / stabilityRatio).toFixed(2));
  
  // Format percentage from decimal
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  
  // Get stability score from stats
  const stabilityScore = stats?.baseStats?.stabilityScore || 0.75;
  
  /**
   * Handle stability vs. creativity slider change
   */
  const handleStabilityRatioChange = async (values: number[]) => {
    const newRatio = values[0];
    setStabilityRatio(newRatio);
    
    // Don't update server until user stops sliding
  };
  
  /**
   * Apply the new stability/exploration ratio to the server
   */
  const applyRatioChange = async () => {
    setLoading(true);
    
    try {
      const response = await apiRequest('/api/coherence/set-ratio', {
        method: 'POST',
        data: {
          stabilityRatio,
          explorationRatio
        }
      });
      
      if (response.success) {
        toast({
          title: 'Ratio Updated',
          description: `Stability vs. Creativity ratio set to ${stabilityRatio}:1 ↔ 1:${explorationRatio}`,
        });
      }
    } catch (error) {
      console.error('Error updating ratio:', error);
      toast({
        title: 'Error',
        description: 'Failed to update stability/creativity ratio',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handle target coherence slider change
   */
  const handleTargetCoherenceChange = async (values: number[]) => {
    const newTarget = values[0];
    setTargetCoherence(newTarget);
    
    // Don't update server until user stops sliding
  };
  
  /**
   * Apply the new target coherence to the server
   */
  const applyTargetChange = async () => {
    setLoading(true);
    
    try {
      const response = await apiRequest('/api/coherence/set-target', {
        method: 'POST',
        data: {
          targetCoherence
        }
      });
      
      if (response.success) {
        toast({
          title: 'Target Updated',
          description: `Coherence target set to ${targetCoherence.toFixed(4)}`,
        });
      }
    } catch (error) {
      console.error('Error updating target:', error);
      toast({
        title: 'Error',
        description: 'Failed to update coherence target',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Apply a perturbation to the system
   */
  const applyPerturbation = async (direction: 'increase' | 'decrease') => {
    setLoading(true);
    
    const amount = direction === 'increase' ? 0.1 : -0.1;
    
    try {
      const response = await apiRequest('/api/coherence/perturb', {
        method: 'POST',
        data: {
          amount,
          durationCycles: 1,
          label: `Manual ${direction} perturbation`
        }
      });
      
      if (response.success) {
        toast({
          title: 'Perturbation Applied',
          description: `Applied ${direction} perturbation to test system stability`,
        });
      }
    } catch (error) {
      console.error('Error applying perturbation:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply perturbation',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handle heartbeat interval slider change
   */
  const handleHeartbeatIntervalChange = async (values: number[]) => {
    const newInterval = values[0];
    setHeartbeatInterval(newInterval);
  };
  
  /**
   * Apply the new heartbeat interval to the server
   */
  const applyHeartbeatChange = async () => {
    setLoading(true);
    
    try {
      const response = await apiRequest('/api/coherence/set-heartbeat', {
        method: 'POST',
        data: {
          heartbeatInterval: heartbeatInterval * 1000 // Convert to milliseconds
        }
      });
      
      if (response.success) {
        toast({
          title: 'Heartbeat Updated',
          description: `Heartbeat interval set to ${heartbeatInterval} seconds`,
        });
      }
    } catch (error) {
      console.error('Error updating heartbeat:', error);
      toast({
        title: 'Error',
        description: 'Failed to update heartbeat interval',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className={`coherence-control-panel ${className}`}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center">
            <Activity className="mr-2 h-6 w-6 text-primary" />
            Coherence Governance
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <div className={`flex items-center p-1 rounded ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
        
        <CardDescription>
          Control the Universal Coherence Stability Mechanism and the Ouroboros cycle
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic" className="flex items-center justify-center">
              <Zap className="mr-2 h-4 w-4" />
              <span>Basic Controls</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center justify-center">
              <BarChart4 className="mr-2 h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="experiments" className="flex items-center justify-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Experiments</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            {/* Current Coherence */}
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Current Coherence</span>
                <span className="text-2xl font-bold">{coherenceData?.value.toFixed(4) || '0.7500'}</span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">Current Phase</span>
                <span className={`text-lg font-medium ${coherenceData?.phase === 'stability' ? 'text-blue-600' : 'text-orange-500'}`}>
                  {coherenceData?.phase === 'stability' ? '3:1 Stability' : '1:3 Exploration'}
                </span>
              </div>
            </div>
            
            {/* Stability vs. Creativity Slider */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">
                  Stability vs. Creativity Balance
                </label>
                <span className="text-sm">
                  {stabilityRatio}:1 ↔ 1:{explorationRatio}
                </span>
              </div>
              
              <Slider 
                min={1} 
                max={5} 
                step={0.1} 
                value={[stabilityRatio]} 
                onValueChange={handleStabilityRatioChange}
                disabled={loading}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More Creative</span>
                <span>Balanced</span>
                <span>More Stable</span>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={applyRatioChange}
                  disabled={loading}
                >
                  Apply Changes
                </Button>
              </div>
            </div>
            
            <div className="p-3 bg-muted/60 rounded-md grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-1">Stability Score</div>
                <div className="text-xl font-bold">{(stabilityScore * 100).toFixed(1)}%</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Ouroboros Cycle</div>
                <div className="text-xl font-bold">{stats?.currentStatus?.cycle || '-'}</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            {/* Target Coherence Adjustment */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">
                  Target Coherence Value
                </label>
                <span className="text-sm">
                  {targetCoherence.toFixed(4)}
                </span>
              </div>
              
              <Slider 
                min={0.6} 
                max={0.9} 
                step={0.01} 
                value={[targetCoherence]} 
                onValueChange={handleTargetCoherenceChange}
                disabled={loading}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Creative (0.6)</span>
                <span>Optimal (0.75)</span>
                <span>Precise (0.9)</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center text-amber-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Modifying target affects system balance</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={applyTargetChange}
                  disabled={loading}
                >
                  Apply Target
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Heartbeat Interval Adjustment */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">
                  Heartbeat Interval
                </label>
                <span className="text-sm">
                  {heartbeatInterval} seconds
                </span>
              </div>
              
              <Slider 
                min={5} 
                max={30} 
                step={1} 
                value={[heartbeatInterval]} 
                onValueChange={handleHeartbeatIntervalChange}
                disabled={loading}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Faster (5s)</span>
                <span>Default (15s)</span>
                <span>Slower (30s)</span>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={applyHeartbeatChange}
                  disabled={loading}
                >
                  Apply Interval
                </Button>
              </div>
            </div>
            
            {/* Advanced Stats */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/60 rounded-md">
              <div>
                <div className="text-sm font-medium mb-1">Average Coherence</div>
                <div className="text-lg font-medium">
                  {stats?.baseStats?.averageCoherence.toFixed(4) || '-'}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-1">Standard Deviation</div>
                <div className="text-lg font-medium">
                  {stats?.baseStats?.standardDeviation.toFixed(6) || '-'}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="experiments" className="space-y-6">
            <div className="space-y-4">
              <div className="text-sm font-medium">Coherence Perturbation</div>
              <p className="text-sm text-muted-foreground">
                Apply a temporary perturbation to observe how quickly the system returns to its attractor state.
                This helps visualize the strength of the 0.7500 attractor basin.
              </p>
              
              <div className="flex space-x-3 pt-2">
                <Button 
                  variant="destructive" 
                  onClick={() => applyPerturbation('decrease')}
                  disabled={loading}
                  className="flex-1"
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Decrease Coherence
                </Button>
                
                <Button 
                  variant="default" 
                  onClick={() => applyPerturbation('increase')}
                  disabled={loading}
                  className="flex-1"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Increase Coherence
                </Button>
              </div>
              
              {/* Perturbation Results */}
              <div className="p-4 bg-muted/60 rounded-md space-y-3 mt-4">
                <div className="font-medium">Return Time Statistics</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Average Return Time</div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-primary" />
                      <span className="text-lg font-medium">
                        {stats?.advancedStats?.averageReturnTime 
                          ? `${stats.advancedStats.averageReturnTime.toFixed(1)} cycles` 
                          : 'No data'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground">Completed Experiments</div>
                    <div className="text-lg font-medium">
                      {stats?.advancedStats?.completedPerturbations || 0} / {stats?.advancedStats?.totalPerturbations || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CoherenceGovernancePanel;