import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { detectDrift, applyRecalibration, DriftType } from '@/utils/implicit-drift-detection';
import quantumCoherenceLogger, { CoherenceLogEntry } from '@/utils/quantum-coherence-logger';

/**
 * EnhancedIDDRSystem - Explicit Drift Detection & Recalibration Visualizer
 * 
 * This component provides a fine-tuned interface for the IDDR system, visualizing
 * how the system detects and corrects deviations from the optimal 3:1 coherence ratio.
 * It allows for both automatic and manual recalibration of the quantum balance.
 */

interface EnhancedIDDRProps {
  stabilityRatio?: number;
  explorationRatio?: number;
  onRatioChange?: (stability: number, exploration: number) => void;
}

interface DriftEvent {
  timestamp: number;
  type: DriftType;
  magnitude: number;
  recalibrationApplied: boolean;
  components: string[];
  description: string;
}

const EnhancedIDDRSystem: React.FC<EnhancedIDDRProps> = ({
  stabilityRatio = 0.75,
  explorationRatio = 0.25,
  onRatioChange
}) => {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [driftEvents, setDriftEvents] = useState<DriftEvent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  const [autoRecalibrate, setAutoRecalibrate] = useState<boolean>(true);
  const [coherenceLogs, setCoherenceLogs] = useState<CoherenceLogEntry[]>([]);
  const [driftWarningLevel, setDriftWarningLevel] = useState<'none' | 'low' | 'medium' | 'high'>('none');
  const [optimalRange, setOptimalRange] = useState<[number, number]>([2.9, 3.1]); // 3:1 ratio ±0.1
  const [recalibrationHistory, setRecalibrationHistory] = useState<{ timestamp: number, adjustment: number }[]>([]);
  const [simulatedLoad, setSimulatedLoad] = useState<number>(50);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Initialize with some sample drift events
  useEffect(() => {
    const ratio = stabilityRatio / explorationRatio;
    const deviation = Math.abs(ratio - 3.0);
    
    // Update warning level based on deviation from optimal 3:1 ratio
    if (deviation < 0.1) {
      setDriftWarningLevel('none');
    } else if (deviation < 0.3) {
      setDriftWarningLevel('low');
    } else if (deviation < 0.6) {
      setDriftWarningLevel('medium');
    } else {
      setDriftWarningLevel('high');
    }
    
    // Get coherence logs from logger
    setCoherenceLogs(quantumCoherenceLogger.getCoherenceLogs());
    
    // Detect drift using the IDDR system
    const drift = detectDrift();
    
    if (drift.detected) {
      // Create a new drift event
      const newEvent: DriftEvent = {
        timestamp: Date.now(),
        type: drift.type,
        magnitude: drift.magnitude,
        recalibrationApplied: autoRecalibrate,
        components: drift.affectedComponents,
        description: drift.recalibrationSuggestions.join(' ')
      };
      
      setDriftEvents(prev => [newEvent, ...prev].slice(0, 10));
      
      // Apply automatic recalibration if enabled
      if (autoRecalibrate && onRatioChange) {
        const recalibration = applyRecalibration(drift);
        
        if (recalibration.recalibrated) {
          // Calculate adjustment amount based on drift type
          let stabilityAdjustment = 0;
          
          if (drift.type === DriftType.COHERENCE) {
            // Too much coherence, reduce stability
            stabilityAdjustment = -0.02;
          } else if (drift.type === DriftType.EXPLORATION) {
            // Too much exploration, increase stability
            stabilityAdjustment = 0.02;
          }
          
          // Apply adjustment
          const newStability = Math.max(0.6, Math.min(0.85, stabilityRatio + stabilityAdjustment));
          const newExploration = 1 - newStability;
          
          onRatioChange(newStability, newExploration);
          
          // Record recalibration in history
          setRecalibrationHistory(prev => [
            { timestamp: Date.now(), adjustment: stabilityAdjustment },
            ...prev
          ].slice(0, 20));
        }
      }
    }
  }, [stabilityRatio, explorationRatio, autoRecalibrate, onRatioChange]);
  
  // Draw coherence visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    let time = 0;
    
    const animate = () => {
      time += 0.05;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid
      const gridSize = 20;
      ctx.strokeStyle = '#1e293b40';
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Center coordinates
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Draw ratio visualization
      const ratio = stabilityRatio / explorationRatio;
      const deviation = Math.abs(ratio - 3.0);
      
      // Calculate radius based on stability/exploration ratio
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.25;
      const coherenceRadius = baseRadius * (1 + stabilityRatio * 0.5);
      const explorationRadius = baseRadius * (1 + explorationRatio * 1.5);
      
      // Draw optimal 3:1 ratio circle (reference)
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#64748b50';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw current ratio visualization
      // Coherence sphere (blue)
      ctx.beginPath();
      ctx.arc(
        centerX, 
        centerY, 
        coherenceRadius + Math.sin(time) * 5,
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(time * 1.5) * 0.1})`;
      ctx.fill();
      
      // Exploration sphere (orange)
      ctx.beginPath();
      ctx.arc(
        centerX + Math.sin(time * 2) * 10, 
        centerY + Math.cos(time * 2) * 10, 
        explorationRadius + Math.sin(time * 3) * 3,
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(249, 115, 22, ${0.25 + Math.sin(time * 2) * 0.1})`;
      ctx.fill();
      
      // Draw ratio text
      ctx.font = '24px Arial';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(`${ratio.toFixed(2)}:1`, centerX, centerY);
      
      // Label the spheres
      ctx.font = '14px Arial';
      ctx.fillStyle = '#93c5fd';
      ctx.fillText('Coherence', centerX, centerY - coherenceRadius - 15);
      
      ctx.fillStyle = '#fdba74';
      ctx.fillText('Exploration', centerX, centerY + explorationRadius + 25);
      
      // Draw drift indicators if any drift detected
      if (driftWarningLevel !== 'none') {
        const warningColor = 
          driftWarningLevel === 'low' ? '#fcd34d' :
          driftWarningLevel === 'medium' ? '#fb923c' : 
          '#ef4444';
        
        // Warning indicators
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i / 8) + time * 0.5;
          const radius = baseRadius * 1.5;
          
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          
          const x2 = centerX + Math.cos(angle) * (radius + 15);
          const y2 = centerY + Math.sin(angle) * (radius + 15);
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `${warningColor}${driftWarningLevel === 'high' ? '90' : '50'}`;
          ctx.lineWidth = driftWarningLevel === 'high' ? 3 : 1;
          ctx.stroke();
        }
        
        // Pulsing warning ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `${warningColor}${Math.floor((0.5 + Math.sin(time * 3) * 0.5) * 100).toString(16)}`;
        ctx.lineWidth = driftWarningLevel === 'high' ? 3 : 1;
        ctx.stroke();
      }
      
      // Draw optimal range indicator
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#22c55e40';
      ctx.lineWidth = 12;
      ctx.stroke();
      
      // Draw recalibration history
      recalibrationHistory.slice(0, 5).forEach((record, i) => {
        const age = Date.now() - record.timestamp;
        if (age < 10000) { // Show for 10 seconds
          const alpha = 1 - age / 10000;
          const direction = record.adjustment > 0 ? 'up' : 'down';
          
          ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            `Recalibration: ${direction === 'up' ? '↑' : '↓'} ${Math.abs(record.adjustment * 100).toFixed(1)}%`, 
            centerX, 
            centerY + baseRadius * 2 + 20 + i * 20
          );
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stabilityRatio, explorationRatio, driftWarningLevel, recalibrationHistory]);
  
  // Handle manual recalibration
  const handleManualRecalibration = (direction: 'increase' | 'decrease') => {
    if (!onRatioChange) return;
    
    const adjustmentAmount = 0.02;
    let newStability: number;
    
    if (direction === 'increase') {
      // Increase coherence (decrease exploration)
      newStability = Math.min(0.85, stabilityRatio + adjustmentAmount);
    } else {
      // Decrease coherence (increase exploration)
      newStability = Math.max(0.6, stabilityRatio - adjustmentAmount);
    }
    
    const newExploration = 1 - newStability;
    
    onRatioChange(newStability, newExploration);
    
    // Record recalibration in history
    setRecalibrationHistory(prev => [
      { 
        timestamp: Date.now(), 
        adjustment: direction === 'increase' ? adjustmentAmount : -adjustmentAmount 
      },
      ...prev
    ].slice(0, 20));
    
    // Log manual recalibration
    quantumCoherenceLogger.logCoherenceEvent(
      'EnhancedIDDRSystem',
      newStability,
      newExploration,
      'manual_recalibration',
      `Manual recalibration: ${direction === 'increase' ? 'Increased' : 'Decreased'} coherence by ${adjustmentAmount * 100}%`
    );
  };
  
  // Simulate system load affecting drift
  const handleSystemLoadChange = (load: string) => {
    setSimulatedLoad(parseInt(load));
    
    // Simulate drift under heavy loads by adjusting the warning level
    if (parseInt(load) > 80) {
      setDriftWarningLevel('high');
    } else if (parseInt(load) > 60) {
      setDriftWarningLevel('medium');
    } else if (parseInt(load) > 40) {
      setDriftWarningLevel('low');
    } else {
      setDriftWarningLevel('none');
    }
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  // Get warning level color
  const getWarningColor = (level: 'none' | 'low' | 'medium' | 'high'): string => {
    switch (level) {
      case 'none': return 'bg-green-500';
      case 'low': return 'bg-yellow-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enhanced IDDR System</CardTitle>
        <CardDescription>
          Implicit Drift Detection & Recalibration with explicit 3:1 coherence monitoring
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Coherence: {(stabilityRatio * 100).toFixed(1)}%
          </Badge>
          <Badge variant="outline">
            Exploration: {(explorationRatio * 100).toFixed(1)}%
          </Badge>
          <Badge 
            variant={Math.abs(stabilityRatio / explorationRatio - 3) < 0.1 ? 'default' : 'destructive'}
            className="ml-auto"
          >
            Current Ratio: {(stabilityRatio / explorationRatio).toFixed(2)}:1
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="dashboard">IDDR Dashboard</TabsTrigger>
            <TabsTrigger value="events">Drift Events</TabsTrigger>
            <TabsTrigger value="calibration">Calibration Controls</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <div className="flex justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold">Real-time Coherence Monitor</h3>
                <p className="text-sm text-muted-foreground">
                  Visualizing current coherence-exploration ratio with drift detection
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Drift Warning:</span>
                <div className={`h-3 w-3 rounded-full ${getWarningColor(driftWarningLevel)}`}></div>
                <span className="text-sm font-medium capitalize">{driftWarningLevel}</span>
              </div>
            </div>
            
            <div className="relative bg-slate-900 rounded-md overflow-hidden" style={{ height: '300px' }}>
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Current Status</h4>
                <div className="bg-slate-800 p-3 rounded-md">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Coherence-Exploration Ratio:</span>
                    <span 
                      className={Math.abs(stabilityRatio / explorationRatio - 3) < 0.1 ? 'text-green-400' : 'text-orange-400'}
                    >
                      {(stabilityRatio / explorationRatio).toFixed(2)}:1
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Optimal Ratio:</span>
                    <span className="text-green-400">3.00:1</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Deviation:</span>
                    <span 
                      className={Math.abs(stabilityRatio / explorationRatio - 3) < 0.1 ? 'text-green-400' : 'text-orange-400'}
                    >
                      {Math.abs((stabilityRatio / explorationRatio) - 3).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Auto-Recalibration:</span>
                    <span className={autoRecalibrate ? 'text-green-400' : 'text-orange-400'}>
                      {autoRecalibrate ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Activity</h4>
                <div className="bg-slate-800 p-3 rounded-md h-[104px] overflow-y-auto">
                  {driftEvents.slice(0, 3).map((event, i) => (
                    <div key={i} className="text-xs mb-1 pb-1 border-b border-slate-700">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {event.type} Drift ({(event.magnitude * 100).toFixed(0)}%)
                        </span>
                        <span className="text-slate-400">{formatTime(event.timestamp)}</span>
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        {event.recalibrationApplied ? '✓ Auto-recalibrated' : '⚠ No recalibration'}
                      </div>
                    </div>
                  ))}
                  {driftEvents.length === 0 && (
                    <div className="text-sm text-center text-slate-400 py-2">
                      No drift events detected
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="bg-slate-800 p-3 rounded-md flex flex-col space-y-2">
                  <Button
                    variant={autoRecalibrate ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAutoRecalibrate(!autoRecalibrate)}
                  >
                    {autoRecalibrate ? 'Disable' : 'Enable'} Auto-Recalibration
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleManualRecalibration('increase')}
                    >
                      Increase Coherence
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleManualRecalibration('decrease')}
                    >
                      Increase Exploration
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Drift Event History</h3>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Filter by Component:</span>
                <Select 
                  value={selectedComponent} 
                  onValueChange={setSelectedComponent}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Components" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Components</SelectItem>
                    <SelectItem value="QuantumLemniscateVisualizer">Quantum Lemniscate</SelectItem>
                    <SelectItem value="MetaGeometricFramework">Meta-Geometric Framework</SelectItem>
                    <SelectItem value="CognitiveDomainVisualizer">Cognitive Domain</SelectItem>
                    <SelectItem value="IDDR_System">IDDR System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border border-slate-700 rounded-md overflow-hidden">
              <div className="grid grid-cols-6 gap-2 p-3 bg-slate-800 text-xs font-medium">
                <div>Time</div>
                <div>Type</div>
                <div>Magnitude</div>
                <div>Components</div>
                <div className="col-span-2">Description</div>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                {driftEvents.length > 0 ? (
                  driftEvents.map((event, i) => (
                    <div 
                      key={i} 
                      className="grid grid-cols-6 gap-2 p-3 text-xs border-t border-slate-700"
                    >
                      <div>{formatTime(event.timestamp)}</div>
                      <div>
                        <Badge 
                          variant={
                            event.type === DriftType.COHERENCE || event.type === DriftType.EXPLORATION
                              ? 'destructive'
                              : 'outline'
                          }
                          className="text-[10px] h-5"
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <div>{(event.magnitude * 100).toFixed(1)}%</div>
                      <div className="truncate">{event.components.join(', ')}</div>
                      <div className="col-span-2 text-slate-300">{event.description}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    No drift events have been detected yet
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Coherence Log Timeline</h4>
              <div className="relative h-24 bg-slate-800 rounded-md overflow-hidden">
                {coherenceLogs.slice(-40).map((log, i) => {
                  const position = i / 40;
                  const isOptimal = Math.abs(log.actualRatio - 3) < 0.1;
                  
                  return (
                    <div 
                      key={i}
                      className={`absolute top-0 bottom-0 w-2 ${isOptimal ? 'bg-green-500/60' : 'bg-orange-500/60'}`}
                      style={{
                        left: `${position * 100}%`,
                        height: `${Math.min(100, log.actualRatio * 20)}%`,
                        bottom: 0
                      }}
                      title={`${log.component}: ${log.actualRatio.toFixed(2)}:1`}
                    />
                  );
                })}
                
                {/* Optimal ratio reference line */}
                <div 
                  className="absolute left-0 right-0 border-t border-dashed border-green-500/60"
                  style={{
                    top: `${100 - (3 * 20)}%`
                  }}
                >
                  <div className="absolute right-2 top-0 transform -translate-y-full text-xs text-green-500">
                    3:1
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calibration" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recalibration Settings</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Automatic Recalibration</h4>
                      <p className="text-xs text-muted-foreground">
                        Automatically adjust coherence ratio when drift is detected
                      </p>
                    </div>
                    <div>
                      <Button
                        variant={autoRecalibrate ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAutoRecalibrate(!autoRecalibrate)}
                      >
                        {autoRecalibrate ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium">Optimal Ratio Range</h4>
                    <p className="text-xs text-muted-foreground">
                      The acceptable range around the ideal 3:1 ratio (currently {optimalRange[0]} - {optimalRange[1]})
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOptimalRange([Math.max(2.5, optimalRange[0] - 0.1), optimalRange[1]])}
                      >
                        Wider
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOptimalRange([Math.min(optimalRange[1] - 0.1, optimalRange[0] + 0.1), optimalRange[1]])}
                      >
                        Tighter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOptimalRange([2.9, 3.1])}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium">Recalibration Strength</h4>
                    <p className="text-xs text-muted-foreground">
                      The magnitude of coherence adjustment during recalibration
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm">Gentle</Button>
                      <Button variant="default" size="sm">Medium</Button>
                      <Button variant="outline" size="sm">Strong</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Simulate System Load</h4>
                  <p className="text-xs text-muted-foreground">
                    Simulate different workloads to observe coherence drift patterns
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span>Current Load</span>
                      <span>{simulatedLoad}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Button 
                        variant={simulatedLoad === 20 ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSystemLoadChange('20')}
                      >
                        Low
                      </Button>
                      <Button 
                        variant={simulatedLoad === 50 ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSystemLoadChange('50')}
                      >
                        Medium
                      </Button>
                      <Button 
                        variant={simulatedLoad === 75 ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSystemLoadChange('75')}
                      >
                        High
                      </Button>
                      <Button 
                        variant={simulatedLoad === 90 ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSystemLoadChange('90')}
                      >
                        Extreme
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Manual Calibration</h3>
                
                <div className="bg-slate-800 p-4 rounded-md space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Coherence-Exploration Ratio:</span>
                      <span 
                        className={Math.abs(stabilityRatio / explorationRatio - 3) < 0.1 ? 'text-green-400' : 'text-orange-400'}
                      >
                        {(stabilityRatio / explorationRatio).toFixed(2)}:1
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Coherence: {(stabilityRatio * 100).toFixed(1)}%</span>
                        <span>Exploration: {(explorationRatio * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600"
                          style={{ width: `${stabilityRatio * 100}%` }}
                        />
                        <div 
                          className="h-full bg-orange-500 -mt-3"
                          style={{ width: `${explorationRatio * 100}%`, marginLeft: `${stabilityRatio * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Precise Coherence Adjustments</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <span className="text-xs">Increase Coherence</span>
                        <div className="grid grid-cols-3 gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleManualRecalibration('increase')}
                          >
                            +2%
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (onRatioChange) {
                                const newStability = Math.min(0.85, stabilityRatio + 0.05);
                                onRatioChange(newStability, 1 - newStability);
                              }
                            }}
                          >
                            +5%
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (onRatioChange) {
                                const newStability = Math.min(0.85, stabilityRatio + 0.1);
                                onRatioChange(newStability, 1 - newStability);
                              }
                            }}
                          >
                            +10%
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-xs">Increase Exploration</span>
                        <div className="grid grid-cols-3 gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleManualRecalibration('decrease')}
                          >
                            +2%
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (onRatioChange) {
                                const newStability = Math.max(0.6, stabilityRatio - 0.05);
                                onRatioChange(newStability, 1 - newStability);
                              }
                            }}
                          >
                            +5%
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (onRatioChange) {
                                const newStability = Math.max(0.6, stabilityRatio - 0.1);
                                onRatioChange(newStability, 1 - newStability);
                              }
                            }}
                          >
                            +10%
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      if (onRatioChange) {
                        onRatioChange(0.75, 0.25); // Perfect 3:1 ratio
                        
                        // Log reset
                        quantumCoherenceLogger.logCoherenceEvent(
                          'EnhancedIDDRSystem',
                          0.75,
                          0.25,
                          'reset_to_optimal',
                          'Manually reset coherence ratio to optimal 3:1 (75% coherence, 25% exploration)'
                        );
                      }
                    }}
                  >
                    Reset to Optimal 3:1 Ratio
                  </Button>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Recent Recalibrations</h4>
                  <div className="bg-slate-800 p-3 rounded-md max-h-[150px] overflow-y-auto">
                    {recalibrationHistory.length > 0 ? (
                      recalibrationHistory.map((record, i) => (
                        <div key={i} className="text-xs mb-1 pb-1 border-b border-slate-700 flex justify-between">
                          <span>
                            {record.adjustment > 0 ? 'Increased' : 'Decreased'} coherence by {Math.abs(record.adjustment * 100).toFixed(1)}%
                          </span>
                          <span className="text-slate-400">{formatTime(record.timestamp)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-center text-slate-400 py-2">
                        No recalibration history
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <span>
          IDDR System maintains optimal 3:1 coherence ratio across the Meta-Geometric Framework
        </span>
        <Badge variant="outline">Wilton Universal Law</Badge>
      </CardFooter>
    </Card>
  );
};

export default EnhancedIDDRSystem;