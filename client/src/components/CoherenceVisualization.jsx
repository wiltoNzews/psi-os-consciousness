/**
 * Coherence Visualization Component
 * 
 * This component visualizes system coherence metrics and the Ouroboros cycle.
 * It displays real-time coherence values, historical trends, and provides
 * animated visualization of the 0.7500 attractor state.
 * 
 * [QUANTUM_STATE: VISUALIZATION_FLOW]
 */

import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

/**
 * Visualizes the Ouroboros cycle with dynamic 3:1 ↔ 1:3 oscillation pattern
 */
const OuroborosVisualizer = ({ coherence, ouroborosMode, cycleCounter, cycleTarget }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Draw visualization on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw 0.7500 threshold as dashed circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.75, 0, 2 * Math.PI);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw 0.2500 threshold as dashed circle (for exploration mode)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.25, 0, 2 * Math.PI);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw current coherence level as solid circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * coherence, 0, 2 * Math.PI);
    
    // Use different colors based on mode
    const coherenceColor = ouroborosMode === 'stability' 
      ? '#3b82f6'  // Blue for stability
      : '#9333ea'; // Purple for exploration
    
    ctx.strokeStyle = coherenceColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = ouroborosMode === 'stability' ? '#64748b' : '#9333ea';
    ctx.fill();
    
    // Draw Ouroboros infinity visualization
    const loopY = height - 40;
    const loopSize = 15;
    
    // Left circle of infinity (stability - 3:1)
    ctx.beginPath();
    ctx.arc(centerX - loopSize, loopY, loopSize, 0, 2 * Math.PI);
    ctx.strokeStyle = '#3b82f6'; // Blue
    ctx.lineWidth = ouroborosMode === 'stability' ? 2 : 1;
    ctx.stroke();
    
    // Right circle of infinity (exploration - 1:3)
    ctx.beginPath();
    ctx.arc(centerX + loopSize, loopY, loopSize, 0, 2 * Math.PI);
    ctx.strokeStyle = '#9333ea'; // Purple
    ctx.lineWidth = ouroborosMode === 'exploration' ? 2 : 1;
    ctx.stroke();
    
    // Position indicator on the infinity loop
    let dotX, dotY;
    if (ouroborosMode === 'stability') {
      // Calculate position on left (stability) circle
      const angle = (cycleCounter / cycleTarget) * 2 * Math.PI;
      dotX = centerX - loopSize + loopSize * Math.cos(angle);
      dotY = loopY + loopSize * Math.sin(angle);
    } else {
      // Calculate position on right (exploration) circle
      const angle = (cycleCounter / cycleTarget) * 2 * Math.PI;
      dotX = centerX + loopSize + loopSize * Math.cos(angle);
      dotY = loopY + loopSize * Math.sin(angle);
    }
    
    // Draw current position indicator
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = ouroborosMode === 'stability' ? '#3b82f6' : '#9333ea';
    ctx.fill();
    
    // Draw information text
    ctx.fillStyle = '#334155';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Coherence: ${coherence.toFixed(4)}`, centerX, height - 60);
    
    const modeText = ouroborosMode === 'stability' 
      ? 'Stability Mode (3:1)' 
      : 'Exploration Mode (1:3)';
    
    ctx.fillText(modeText, centerX, loopY + 30);
    
    // Draw cycle progress
    ctx.fillText(`Cycle: ${cycleCounter}/${cycleTarget}`, centerX, loopY + 50);
    
  }, [coherence, ouroborosMode, cycleCounter, cycleTarget]);
  
  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        className="border border-border rounded-md"
      />
    </div>
  );
};

/**
 * Coherence history visualization component
 */
const CoherenceHistory = ({ history = [] }) => {
  const canvasRef = useRef(null);
  
  // Draw coherence history chart
  useEffect(() => {
    if (!canvasRef.current || history.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up scales
    const xScale = width / Math.min(50, history.length);
    const yScale = height * 0.8;
    const yOffset = height * 0.1;
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.moveTo(0, height - yOffset);
    ctx.lineTo(width, height - yOffset);
    
    // Y-axis
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
    
    // Draw target line (0.7500)
    ctx.beginPath();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, height - yOffset - 0.75 * yScale);
    ctx.lineTo(width, height - yOffset - 0.75 * yScale);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw exploration threshold line (0.2500)
    ctx.beginPath();
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.moveTo(0, height - yOffset - 0.25 * yScale);
    ctx.lineTo(width, height - yOffset - 0.25 * yScale);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Get the data to display (last 50 entries)
    const displayData = history.slice(-50);
    
    // Draw coherence line
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < displayData.length; i++) {
      const x = i * xScale;
      const y = height - yOffset - displayData[i].value * yScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw mode regions
    let currentMode = null;
    let modeStartX = 0;
    
    ctx.fillStyle = 'rgba(147, 51, 234, 0.1)'; // Purple for exploration
    
    for (let i = 0; i < displayData.length; i++) {
      const x = i * xScale;
      
      if (displayData[i].ouroborosMode !== currentMode) {
        if (currentMode === 'exploration') {
          // End the exploration region
          ctx.fillRect(modeStartX, 0, x - modeStartX, height);
        }
        
        currentMode = displayData[i].ouroborosMode;
        modeStartX = x;
      }
    }
    
    // Finish the last region if it's exploration
    if (currentMode === 'exploration') {
      ctx.fillRect(modeStartX, 0, width - modeStartX, height);
    }
    
    // Draw axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('1.0', 5, 10);
    ctx.fillText('0.75', 5, height - yOffset - 0.75 * yScale + 3);
    ctx.fillText('0.5', 5, height - yOffset - 0.5 * yScale + 3);
    ctx.fillText('0.25', 5, height - yOffset - 0.25 * yScale + 3);
    ctx.fillText('0.0', 5, height - yOffset + 3);
    
    // Draw legend
    ctx.fillStyle = '#334155';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Coherence History (last 50 cycles)', width - 10, 15);
    
  }, [history]);
  
  return (
    <div className="flex flex-col">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={200} 
        className="border border-border rounded-md"
      />
    </div>
  );
};

/**
 * Main coherence visualization component
 */
const CoherenceVisualization = () => {
  const { connected, sendMessage, lastMessage } = useWebSocket();
  const [activeTab, setActiveTab] = useState('visualization');
  
  // Coherence state
  const [coherence, setCoherence] = useState(0.75);
  const [targetCoherence, setTargetCoherence] = useState(0.75);
  const [coherenceHistory, setCoherenceHistory] = useState([]);
  const [perturbationActive, setPerturbationActive] = useState(false);
  
  // Ouroboros cycle state
  const [ouroborosMode, setOuroborosMode] = useState('stability');
  const [ouroborosCycleCounter, setOuroborosCycleCounter] = useState(0);
  const [ouroborosCycleTarget, setOuroborosCycleTarget] = useState(12);
  
  // Variant count
  const [variantCount, setVariantCount] = useState(3);
  
  // Cycle progress
  const [cycleNumber, setCycleNumber] = useState(0);
  
  // QCTF values
  const [qctfValue, setQctfValue] = useState(0.75);
  const [globalEntropyFactor, setGlobalEntropyFactor] = useState(0.25);
  const [qeaiValue, setQeaiValue] = useState(0.85);
  const [phaseParameter, setPhaseParameter] = useState(ouroborosMode === 'stability' ? 0 : 1);
  
  // Update state from WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;
    
    try {
      // Parse message data if needed
      let data;
      
      if (typeof lastMessage === 'string') {
        data = JSON.parse(lastMessage);
      } else if (lastMessage.data && typeof lastMessage.data === 'string') {
        data = JSON.parse(lastMessage.data);
      } else {
        data = lastMessage;
      }
      
      // Handle coherence update messages
      if (data.type === 'coherence_update') {
        const payload = data.payload;
        
        setCoherence(payload.coherence);
        setTargetCoherence(payload.target || 0.75);
        setCycleNumber(payload.cycleNumber || 0);
        setOuroborosMode(payload.ouroborosMode || 'stability');
        setOuroborosCycleCounter(payload.ouroborosCycleCounter || 0);
        setOuroborosCycleTarget(payload.ouroborosCycleTarget || 12);
        setPerturbationActive(payload.perturbationActive || false);
        setVariantCount(payload.variantCount || 3);
        
        // Update coherence history
        setCoherenceHistory(prevHistory => {
          const newEntry = {
            value: payload.coherence,
            cycleNumber: payload.cycleNumber || 0,
            ouroborosMode: payload.ouroborosMode || 'stability',
            ouroborosCycleCounter: payload.ouroborosCycleCounter || 0,
            perturbationActive: payload.perturbationActive || false,
            timestamp: payload.timestamp || Date.now()
          };
          
          const newHistory = [...prevHistory, newEntry];
          
          // Keep only the last 100 entries
          if (newHistory.length > 100) {
            return newHistory.slice(newHistory.length - 100);
          }
          
          return newHistory;
        });
        
        // Update phase parameter based on mode
        setPhaseParameter(payload.ouroborosMode === 'stability' ? 0 : 1);
        
        // Calculate QCTF
        // QCTF = CI + (GEF × QEAI × cos θ)
        const phaseAngle = (payload.ouroborosMode === 'stability' ? 0 : 1) * Math.PI;
        const qctf = payload.coherence + (globalEntropyFactor * qeaiValue * Math.cos(phaseAngle));
        setQctfValue(Math.min(1.0, Math.max(0.0, qctf)));
      }
    } catch (error) {
      console.error('Error processing message in CoherenceVisualization:', error);
    }
  }, [lastMessage]);
  
  // Simulate coherence updates when not receiving actual data
  useEffect(() => {
    if (coherenceHistory.length > 0 || !connected) return;
    
    // Set up simulation timer
    const simulationTimer = setInterval(() => {
      // Generate simulated coherence data
      setCycleNumber(prev => prev + 1);
      
      // Update Ouroboros cycle counter
      setOuroborosCycleCounter(prev => {
        const next = prev + 1;
        if (next >= ouroborosCycleTarget) {
          // Switch modes
          setOuroborosMode(prevMode => {
            const newMode = prevMode === 'stability' ? 'exploration' : 'stability';
            // Update cycle target
            setOuroborosCycleTarget(newMode === 'stability' ? 12 : 4);
            // Update phase parameter
            setPhaseParameter(newMode === 'stability' ? 0 : 1);
            return newMode;
          });
          return 0;
        }
        return next;
      });
      
      // Simulate coherence value
      setCoherence(prev => {
        // Target value depends on mode
        const target = ouroborosMode === 'stability' ? 0.75 : 0.25;
        // Add some noise
        const noise = (Math.random() - 0.5) * 0.05;
        // Move toward target
        return prev * 0.95 + (target + noise) * 0.05;
      });
      
      // Update coherence history
      setCoherenceHistory(prevHistory => {
        const newEntry = {
          value: coherence,
          cycleNumber,
          ouroborosMode,
          ouroborosCycleCounter,
          perturbationActive,
          timestamp: Date.now()
        };
        
        const newHistory = [...prevHistory, newEntry];
        
        // Keep only the last 100 entries
        if (newHistory.length > 100) {
          return newHistory.slice(newHistory.length - 100);
        }
        
        return newHistory;
      });
      
      // Calculate QCTF
      // QCTF = CI + (GEF × QEAI × cos θ)
      const phaseAngle = phaseParameter * Math.PI;
      const qctf = coherence + (globalEntropyFactor * qeaiValue * Math.cos(phaseAngle));
      setQctfValue(Math.min(1.0, Math.max(0.0, qctf)));
      
    }, 1000);
    
    return () => clearInterval(simulationTimer);
  }, [connected, coherence, ouroborosMode, ouroborosCycleCounter, ouroborosCycleTarget]);
  
  /**
   * Apply a perturbation to the system
   */
  const applyPerturbation = (targetValue) => {
    if (!connected) return;
    
    setPerturbationActive(true);
    
    sendMessage('apply_perturbation', {
      targetCoherence: targetValue
    });
  };
  
  /**
   * Release an active perturbation
   */
  const releasePerturbation = () => {
    if (!connected || !perturbationActive) return;
    
    setPerturbationActive(false);
    
    sendMessage('release_perturbation', {});
  };
  
  /**
   * Force a specific Ouroboros mode
   */
  const forceOuroborosMode = (mode) => {
    if (!connected) return;
    
    sendMessage('force_ouroboros_mode', {
      mode
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Coherence Visualization</h1>
        <p className="text-slate-600 max-w-3xl">
          Monitoring the 0.7500 coherence attractor and Ouroboros cycle
          with real-time visualization of system synchronization metrics.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualization">Coherence Visualization</TabsTrigger>
          <TabsTrigger value="history">Coherence History</TabsTrigger>
          <TabsTrigger value="controls">Controls & Analytics</TabsTrigger>
        </TabsList>
        
        {/* Visualization Tab */}
        <TabsContent value="visualization" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Ouroboros Cycle</CardTitle>
                <CardDescription>
                  Dynamic 3:1 ↔ 1:3 oscillation around 0.7500 attractor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OuroborosVisualizer 
                  coherence={coherence}
                  ouroborosMode={ouroborosMode}
                  cycleCounter={ouroborosCycleCounter}
                  cycleTarget={ouroborosCycleTarget}
                />
                <div className="mt-4 flex justify-between">
                  <Badge variant={
                    Math.abs(coherence - 0.75) < 0.05 ? "success" : 
                    Math.abs(coherence - 0.75) < 0.1 ? "warning" : "destructive"
                  }>
                    {coherence.toFixed(4)}
                  </Badge>
                  <Badge variant={ouroborosMode === 'stability' ? "default" : "secondary"}>
                    {ouroborosMode === 'stability' ? '3:1 Stability' : '1:3 Exploration'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
                <CardDescription>
                  Key coherence indicators and Ouroboros state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Coherence</h3>
                    <div className="flex items-center space-x-2">
                      <Progress value={coherence * 100} className="h-2" />
                      <span className="text-sm">{(coherence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0.0</span>
                      <span className="relative">
                        0.75
                        <span className="absolute -top-2 left-0 right-0 h-2 border-l border-slate-400"></span>
                      </span>
                      <span>1.0</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">QCTF Value</h3>
                    <div className="flex items-center space-x-2">
                      <Progress value={qctfValue * 100} className="h-2" />
                      <span className="text-sm">{(qctfValue * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0.0</span>
                      <span className="relative">
                        0.80
                        <span className="absolute -top-2 left-0 right-0 h-2 border-l border-slate-400"></span>
                      </span>
                      <span>1.0</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Variant Count</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-full h-8 bg-slate-100 dark:bg-slate-800 rounded-md flex">
                        {Array.from({ length: variantCount }).map((_, i) => (
                          <div 
                            key={i}
                            className="h-full flex-1 border-r border-slate-200 dark:border-slate-700 first:rounded-l-md last:rounded-r-md last:border-0"
                            style={{ 
                              backgroundColor: i < 3 ? '#3b82f6' : '#9333ea',
                              opacity: 0.7 + (i * 0.05)
                            }}
                          ></div>
                        ))}
                      </div>
                      <span className="text-sm">{variantCount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>3</span>
                      <span className="relative">
                        5
                        <span className="absolute -top-2 left-0 right-0 h-2 border-l border-slate-400"></span>
                      </span>
                      <span>7</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Cycle Progress</h3>
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={(ouroborosCycleCounter / ouroborosCycleTarget) * 100} 
                        className="h-2"
                      />
                      <span className="text-sm">{ouroborosCycleCounter}/{ouroborosCycleTarget}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      <span>Cycle: {cycleNumber}</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Perturbation Controls</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => applyPerturbation(0.5)}
                          disabled={perturbationActive || !connected}
                        >
                          0.5000
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => applyPerturbation(0.25)}
                          disabled={perturbationActive || !connected}
                        >
                          0.2500
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => applyPerturbation(0.95)}
                          disabled={perturbationActive || !connected}
                        >
                          0.9500
                        </Button>
                      </div>
                      <Button 
                        variant={perturbationActive ? "destructive" : "secondary"}
                        onClick={perturbationActive ? releasePerturbation : () => {}}
                        disabled={!perturbationActive || !connected}
                        className="w-full"
                      >
                        {perturbationActive ? "Release Perturbation" : "No Active Perturbation"}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Ouroboros Cycle Control</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant={ouroborosMode === 'stability' ? "default" : "outline"}
                          onClick={() => forceOuroborosMode('stability')}
                          disabled={!connected}
                          className="flex-1"
                        >
                          Stability (3:1)
                        </Button>
                        <Button 
                          size="sm" 
                          variant={ouroborosMode === 'exploration' ? "secondary" : "outline"}
                          onClick={() => forceOuroborosMode('exploration')}
                          disabled={!connected}
                          className="flex-1"
                        >
                          Exploration (1:3)
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Label className="w-40">Phase Parameter</Label>
                        <Slider 
                          value={[phaseParameter * 100]} 
                          max={100} 
                          step={1}
                          disabled={!connected}
                          onValueChange={([value]) => setPhaseParameter(value / 100)}
                          className="flex-1"
                        />
                        <span className="text-sm w-12">{phaseParameter.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Coherence History</CardTitle>
              <CardDescription>
                Historical coherence data and Ouroboros cycle transitions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CoherenceHistory history={coherenceHistory} />
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Coherence Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Current:</span>
                      <span className="text-sm font-medium">{coherence.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Average:</span>
                      <span className="text-sm font-medium">
                        {coherenceHistory.length > 0
                          ? (coherenceHistory.reduce((sum, h) => sum + h.value, 0) / coherenceHistory.length).toFixed(4)
                          : '0.0000'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Min:</span>
                      <span className="text-sm font-medium">
                        {coherenceHistory.length > 0
                          ? Math.min(...coherenceHistory.map(h => h.value)).toFixed(4)
                          : '0.0000'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Max:</span>
                      <span className="text-sm font-medium">
                        {coherenceHistory.length > 0
                          ? Math.max(...coherenceHistory.map(h => h.value)).toFixed(4)
                          : '0.0000'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Ouroboros Cycle</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Current Mode:</span>
                      <span className="text-sm font-medium">
                        {ouroborosMode === 'stability' ? 'Stability (3:1)' : 'Exploration (1:3)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Cycle Counter:</span>
                      <span className="text-sm font-medium">{ouroborosCycleCounter} / {ouroborosCycleTarget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Stability Percentage:</span>
                      <span className="text-sm font-medium">
                        {coherenceHistory.length > 0
                          ? ((coherenceHistory.filter(h => h.ouroborosMode === 'stability').length / coherenceHistory.length) * 100).toFixed(1) + '%'
                          : '0.0%'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Exploration Percentage:</span>
                      <span className="text-sm font-medium">
                        {coherenceHistory.length > 0
                          ? ((coherenceHistory.filter(h => h.ouroborosMode === 'exploration').length / coherenceHistory.length) * 100).toFixed(1) + '%'
                          : '0.0%'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Target Alignment</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Target:</span>
                      <span className="text-sm font-medium">{targetCoherence.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Deviation:</span>
                      <span className="text-sm font-medium">{Math.abs(coherence - targetCoherence).toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">In Target Range:</span>
                      <Badge variant={Math.abs(coherence - targetCoherence) <= 0.05 ? "success" : "destructive"}>
                        {Math.abs(coherence - targetCoherence) <= 0.05 ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Perturbation:</span>
                      <Badge variant={perturbationActive ? "destructive" : "outline"}>
                        {perturbationActive ? 'Active' : 'None'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Controls Tab */}
        <TabsContent value="controls" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Control Panel</CardTitle>
              <CardDescription>
                Advanced controls and system parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-4">QCTF Parameters</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Label className="w-40">Global Entropy Factor</Label>
                      <Slider 
                        value={[globalEntropyFactor * 100]} 
                        max={100} 
                        step={1}
                        disabled={!connected}
                        onValueChange={([value]) => setGlobalEntropyFactor(value / 100)}
                        className="flex-1"
                      />
                      <span className="text-sm w-12">{globalEntropyFactor.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Label className="w-40">QEAI Value</Label>
                      <Slider 
                        value={[qeaiValue * 100]} 
                        max={100} 
                        step={1}
                        disabled={!connected}
                        onValueChange={([value]) => setQeaiValue(value / 100)}
                        className="flex-1"
                      />
                      <span className="text-sm w-12">{qeaiValue.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Label className="w-40">Phase Parameter (θ)</Label>
                      <Slider 
                        value={[phaseParameter * 100]} 
                        max={100} 
                        step={1}
                        disabled={!connected}
                        onValueChange={([value]) => setPhaseParameter(value / 100)}
                        className="flex-1"
                      />
                      <span className="text-sm w-12">{phaseParameter.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Label className="w-40">Resulting QCTF</Label>
                      <Progress value={qctfValue * 100} className="flex-1 h-2" />
                      <span className="text-sm w-12">{qctfValue.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-sm font-medium mb-4">Connection Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">
                      {connected ? 'Connected to WebSocket' : 'Disconnected - Using Simulated Data'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-4">Ouroboros Cycle Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Label className="w-40">Stability Cycle Length</Label>
                      <Slider 
                        value={[ouroborosCycleTarget]} 
                        min={1}
                        max={20} 
                        step={1}
                        disabled={ouroborosMode !== 'stability' || !connected}
                        onValueChange={([value]) => setOuroborosCycleTarget(value)}
                        className="flex-1"
                      />
                      <span className="text-sm w-12">{ouroborosCycleTarget}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Label className="w-40">Exploration Cycle Length</Label>
                      <Slider 
                        value={[ouroborosMode === 'exploration' ? ouroborosCycleTarget : 4]} 
                        min={1}
                        max={10} 
                        step={1}
                        disabled={ouroborosMode !== 'exploration' || !connected}
                        onValueChange={([value]) => setOuroborosCycleTarget(value)}
                        className="flex-1"
                      />
                      <span className="text-sm w-12">{ouroborosMode === 'exploration' ? ouroborosCycleTarget : 4}</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => forceOuroborosMode('stability')}
                        disabled={!connected}
                      >
                        Force Stability Mode
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => forceOuroborosMode('exploration')}
                        disabled={!connected}
                      >
                        Force Exploration Mode
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-sm font-medium mb-4">System Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Current Cycle:</span>
                      <span className="text-sm font-medium">{cycleNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Variant Count:</span>
                      <span className="text-sm font-medium">{variantCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">History Length:</span>
                      <span className="text-sm font-medium">{coherenceHistory.length} entries</span>
                    </div>
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

export default CoherenceVisualization;