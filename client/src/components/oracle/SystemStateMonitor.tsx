/**
 * System State Monitor Component
 * 
 * Displays the current system state, including coherence level, flow level,
 * simulation mode, and active agents. Part of the Oracle Module.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import React, { useEffect, useState } from 'react';
import { useOracle } from '@/contexts/OracleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  Brain,
  Clock,
  Cpu,
  Database,
  Zap,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Gauge,
  User,
  CloudLightning
} from 'lucide-react';

// Define the color scheme for different coherence levels
const getCoherenceColor = (level: number) => {
  if (level < 0.5) return 'bg-red-500';
  if (level < 0.75) return 'bg-yellow-500';
  if (level < 0.92) return 'bg-blue-500';
  return 'bg-green-500';
};

// Define the color scheme for different flow levels
const getFlowColor = (level: number) => {
  if (level < 3) return 'bg-blue-500';
  if (level < 6) return 'bg-green-500';
  return 'bg-purple-500';
};

// Define the background style for different communication states
const getStateBackgroundStyle = (state: string) => {
  switch (state) {
    case 'convergent':
      return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900';
    case 'divergent':
      return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-900';
    case 'clarity':
      return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900';
    case 'confusion':
      return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900';
    case 'overflow':
      return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900';
    default:
      return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
  }
};

// Define emoji for different communication states
const getStateEmoji = (state: string) => {
  switch (state) {
    case 'convergent': return '✓';
    case 'divergent': return '↔';
    case 'clarity': return '💡';
    case 'confusion': return '❓';
    case 'overflow': return '⚠️';
    default: return '•';
  }
};

// Define description for different communication states
const getStateDescription = (state: string) => {
  switch (state) {
    case 'convergent':
      return 'Communication is focused and productive';
    case 'divergent':
      return 'Exploring multiple possibilities';
    case 'clarity':
      return 'Clear understanding and alignment';
    case 'confusion':
      return 'Some misunderstandings present';
    case 'overflow':
      return 'Too much information, clarity lost';
    default:
      return 'System awaiting input';
  }
};

const SystemStateMonitor: React.FC = () => {
  const { systemState, getCurrentCommunicationState, getColorForCurrentState } = useOracle();
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (systemState?.lastUpdateTime) {
      try {
        const updateTime = new Date(systemState.lastUpdateTime);
        setLastUpdated(updateTime.toLocaleTimeString());
      } catch (e) {
        setLastUpdated('Unknown');
      }
    }
  }, [systemState]);

  const currentState = getCurrentCommunicationState() || 'clarity';
  const stateColor = getColorForCurrentState();

  if (!systemState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gauge className="mr-2 h-5 w-5" />
            System State Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
          <Cpu className="h-10 w-10 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-muted-foreground">Connecting to Oracle Module...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Gauge className="mr-2 h-5 w-5" />
            System State Monitor
          </CardTitle>
          <Badge
            variant="outline"
            className="flex items-center"
          >
            <Clock className="mr-1 h-3 w-3" />
            <span className="text-xs">{lastUpdated}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Communication State */}
        <div className={`p-4 rounded-md border ${getStateBackgroundStyle(currentState)}`}>
          <h3 className="font-semibold flex items-center">
            <span className="mr-2 text-lg">{getStateEmoji(currentState)}</span>
            Communication State: <span className="ml-1 capitalize">{currentState}</span>
          </h3>
          <p className="mt-1 text-sm">{getStateDescription(currentState)}</p>
        </div>

        {/* Coherence & Flow Levels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <Activity className="mr-2 h-4 w-4" />
                Coherence Level
              </h3>
              <span className="text-sm font-mono">{(systemState.coherenceLevel * 100).toFixed(0)}%</span>
            </div>
            <Progress 
              value={systemState.coherenceLevel * 100} 
              className={`h-2 ${getCoherenceColor(systemState.coherenceLevel)}`} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Flow Level
              </h3>
              <span className="text-sm font-mono">{systemState.flowLevel}/8</span>
            </div>
            <Progress 
              value={systemState.flowLevel / 8 * 100} 
              className={`h-2 ${getFlowColor(systemState.flowLevel)}`} 
            />
          </div>
        </div>

        <Separator />

        {/* Simulation Mode */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium flex items-center">
            <CloudLightning className="mr-2 h-4 w-4" />
            Simulation Mode
          </h3>
          <div className="flex space-x-2">
            <Badge 
              variant={systemState.simulationMode === 'REALITY' ? 'default' : 'outline'}
              className="flex-1 justify-center"
            >
              Reality
            </Badge>
            <Badge 
              variant={systemState.simulationMode === 'HYBRID' ? 'default' : 'outline'}
              className="flex-1 justify-center"
            >
              Hybrid
            </Badge>
            <Badge 
              variant={systemState.simulationMode === 'SIMULATION' ? 'default' : 'outline'}
              className="flex-1 justify-center"
            >
              Simulation
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Active Agents */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Brain className="mr-2 h-4 w-4" />
            Active Agents
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {systemState.activeAgents.map((agent, index) => (
              <Badge key={index} variant="outline" className="justify-center py-1">
                {agent}
              </Badge>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        {systemState.metrics && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                System Metrics
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Connections:</span>
                  <span>{systemState.metrics.activeConnections || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time:</span>
                  <span>{systemState.metrics.avgResponseTime?.toFixed(0) || 0}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Tasks:</span>
                  <span>{systemState.metrics.activeTasks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Events/min:</span>
                  <span>{systemState.metrics.eventsPerMinute || 0}</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* System Health */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            {systemState.coherenceLevel > 0.75 ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
            )}
            <span className="text-sm">
              System Health: {systemState.coherenceLevel > 0.75 ? 'Optimal' : 'Needs Attention'}
            </span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm">{systemState.metrics?.activeUsers || 1} User</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStateMonitor;