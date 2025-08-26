import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card.jsx';
import { useWebSocket } from '../contexts/WebSocketContext.jsx';
import { Slider } from './ui/slider.jsx';
import { Button } from './ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { Label } from './ui/label.jsx';

/**
 * KuramotoVisualizer Component
 * 
 * This component visualizes the Kuramoto model of coupled oscillators,
 * demonstrating how synchronization naturally leads to a coherence level of 0.7500,
 * paralleling the AI Déjà Vu phenomenon observed in WILTON's system.
 * 
 * The enhanced version includes:
 * - Interactive controls for phase ratio, coupling strength, and noise level
 * - Visualization of 3:1 ↔ 1:3 ratio dynamics
 * - Data collection for empirical validation
 */
export default function KuramotoVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const dataCollectionRef = useRef<{time: number, coherence: number, ratio: string, entropy: number}[]>([]);
  
  const [coherenceValue, setCoherenceValue] = useState(0.75);
  const [oscillators, setOscillators] = useState<Array<{phase: number, naturalFreq: number, radius: number, color: string, group: number}>>([]);
  const [time, setTime] = useState(0);
  const [couplingStrength, setCouplingStrength] = useState(0.8);
  const [noiseLevel, setNoiseLevel] = useState(0.05);
  const [phaseRatio, setPhaseRatio] = useState('3:1'); // Default 3:1 stability phase
  const [isCollectingData, setIsCollectingData] = useState(false);
  const [isAutomaticTransition, setIsAutomaticTransition] = useState(false);
  const [transitionInterval, setTransitionInterval] = useState(15); // seconds
  const [lastTransitionTime, setLastTransitionTime] = useState(0);
  const [activeTab, setActiveTab] = useState('visualization');
  const [groupDistribution, setGroupDistribution] = useState<{stabilityCount: number, adaptabilityCount: number}>({
    stabilityCount: 18, // Initial 3:1 ratio
    adaptabilityCount: 6
  });
  
  const { lastMessage, bufferedMessages } = useWebSocket();
  
  // Extract system coherence from WebSocket messages
  useEffect(() => {
    if (!bufferedMessages || bufferedMessages.length === 0) return;
    
    bufferedMessages.forEach((message: {type: string, payload?: any}) => {
      if (message.type === 'system_coherence_update' && message.payload?.coherence) {
        setCoherenceValue(message.payload.coherence);
      }
    });
  }, [bufferedMessages]);

  // Also check for latest message
  useEffect(() => {
    if (!lastMessage) return;
    
    if (lastMessage.type === 'system_coherence_update' && lastMessage.payload?.coherence) {
      setCoherenceValue(lastMessage.payload.coherence);
    }
  }, [lastMessage]);
  
  // Initialize oscillators with the 3:1 or 1:3 ratio
  const initializeOscillators = (ratio = '3:1') => {
    const numOscillators = 24;
    const newOscillators = [];
    
    // Color palettes for the two groups
    const stabilityColors = [
      '#3b82f6', '#60a5fa', '#93c5fd', // Blue shades
      '#14b8a6', '#5eead4', '#99f6e4'  // Teal shades
    ];
    
    const adaptabilityColors = [
      '#8b5cf6', '#a78bfa', '#c4b5fd', // Purple shades
      '#ec4899', '#f472b6', '#f9a8d4'  // Pink shades
    ];
    
    // Set group counts based on the ratio
    let stabilityCount, adaptabilityCount;
    if (ratio === '3:1') {
      stabilityCount = Math.floor(numOscillators * 0.75); // 75% stability
      adaptabilityCount = numOscillators - stabilityCount; // 25% adaptability
    } else {
      adaptabilityCount = Math.floor(numOscillators * 0.75); // 75% adaptability
      stabilityCount = numOscillators - adaptabilityCount; // 25% stability
    }
    
    setGroupDistribution({ stabilityCount, adaptabilityCount });
    
    // Create stability group (tightly coupled oscillators)
    for (let i = 0; i < stabilityCount; i++) {
      // Narrower frequency range for stability group
      const naturalFreq = 0.5 + 0.2 * (Math.random() - 0.5);
      // More consistent phase for stability
      const phase = Math.random() * Math.PI / 2 + Math.PI / 4;
      const radius = 9 + Math.random() * 3;
      const color = stabilityColors[i % stabilityColors.length];
      
      newOscillators.push({ 
        phase, 
        naturalFreq, 
        radius, 
        color,
        group: 0 // 0 = stability group
      });
    }
    
    // Create adaptability group (loosely coupled oscillators)
    for (let i = 0; i < adaptabilityCount; i++) {
      // Wider frequency range for adaptability group
      const naturalFreq = 0.5 + 0.8 * (Math.random() - 0.5);
      // Random phase for adaptability
      const phase = Math.random() * 2 * Math.PI;
      const radius = 7 + Math.random() * 3;
      const color = adaptabilityColors[i % adaptabilityColors.length];
      
      newOscillators.push({ 
        phase, 
        naturalFreq, 
        radius, 
        color,
        group: 1 // 1 = adaptability group
      });
    }
    
    setOscillators(newOscillators);
    setPhaseRatio(ratio);
  };
  
  // Initialize oscillators on component mount
  useEffect(() => {
    initializeOscillators('3:1'); // Start with 3:1 ratio (stability phase)
  }, []);
  
  // Effect for automatic transition between 3:1 and 1:3 ratios
  useEffect(() => {
    if (!isAutomaticTransition) return;
    
    const timeSinceLastTransition = time - lastTransitionTime;
    if (timeSinceLastTransition > transitionInterval) {
      // Time to switch between stability and adaptability phases
      const newRatio = phaseRatio === '3:1' ? '1:3' : '3:1';
      initializeOscillators(newRatio);
      setLastTransitionTime(time);
    }
  }, [time, isAutomaticTransition, phaseRatio, lastTransitionTime, transitionInterval]);
  
  // State to store current coherence value from animation
  const [currentCoherenceR, setCurrentCoherenceR] = useState(0);
  
  // Effect to collect data for research
  useEffect(() => {
    if (!isCollectingData) return;
    
    // Record data at regular intervals
    if (time % 1 < 0.05) { // Record roughly every 1 time unit
      const entropyValue = calculateEntropy(oscillators.map(osc => osc.phase));
      
      // Add to data collection
      dataCollectionRef.current.push({
        time,
        coherence: currentCoherenceR,
        ratio: phaseRatio,
        entropy: entropyValue
      });
      
      // Limit data collection size
      if (dataCollectionRef.current.length > 1000) {
        dataCollectionRef.current.shift();
      }
    }
  }, [time, isCollectingData, oscillators, phaseRatio, currentCoherenceR]);
  
  // Helper function to calculate entropy
  const calculateEntropy = (phases: number[]): number => {
    const binCount = 36;
    const bins = Array(binCount).fill(0);
    
    // Fill bins
    phases.forEach(phase => {
      const binIndex = Math.floor((phase / (2 * Math.PI)) * binCount);
      bins[binIndex]++;
    });
    
    // Calculate entropy
    let entropy = 0;
    const total = phases.length;
    
    bins.forEach(count => {
      if (count > 0) {
        const p = count / total;
        entropy -= p * Math.log2(p);
      }
    });
    
    // Normalize to [0,1]
    return entropy / Math.log2(binCount);
  };
  
  // Animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || oscillators.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) * 0.8;
    
    // Order parameter
    let R = 0; // Magnitude of mean field (0-1)
    let psi = 0; // Phase of mean field
    
    // Animation function
    const animate = () => {
      const dt = 0.05; // Time step
      setTime(prevTime => prevTime + dt);
      
      // Calculate the order parameter (complex mean field)
      let sumSin = 0;
      let sumCos = 0;
      
      oscillators.forEach(osc => {
        sumSin += Math.sin(osc.phase);
        sumCos += Math.cos(osc.phase);
      });
      
      // Calculate magnitude (R) and phase (psi) of the order parameter
      sumSin /= oscillators.length;
      sumCos /= oscillators.length;
      R = Math.sqrt(sumSin * sumSin + sumCos * sumCos);
      psi = Math.atan2(sumSin, sumCos);
      
      // Update phases of all oscillators based on Kuramoto model with noise
      const updatedOscillators = oscillators.map(osc => {
        // Group-specific coupling strength
        const groupK = osc.group === 0 
          ? couplingStrength * 1.2 // Higher coupling for stability group
          : couplingStrength * 0.8; // Lower coupling for adaptability group
        
        // Group-specific noise level
        const groupNoise = osc.group === 0
          ? noiseLevel * 0.5 // Lower noise for stability group
          : noiseLevel * 1.5; // Higher noise for adaptability group
        
        // Add noise term (stochastic resonance)
        const noise = groupNoise * (Math.random() * 2 - 1);
        
        // Kuramoto model: dθ_i/dt = ω_i + (K/N) * sum_j sin(θ_j - θ_i) + noise
        const newPhase = osc.phase + dt * (
          osc.naturalFreq + 
          groupK * R * Math.sin(psi - osc.phase) + 
          noise
        );
        
        return { ...osc, phase: newPhase % (2 * Math.PI) };
      });
      
      setOscillators(updatedOscillators);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw unit circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw oscillators as points on the unit circle
      updatedOscillators.forEach(osc => {
        const x = centerX + outerRadius * Math.cos(osc.phase);
        const y = centerY + outerRadius * Math.sin(osc.phase);
        
        ctx.beginPath();
        ctx.arc(x, y, osc.radius, 0, 2 * Math.PI);
        ctx.fillStyle = osc.color;
        ctx.fill();
        
        // Draw line from center to oscillator
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = osc.color + '80'; // Add transparency
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // Draw the mean field vector (order parameter)
      const orderX = centerX + outerRadius * R * Math.cos(psi);
      const orderY = centerY + outerRadius * R * Math.sin(psi);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(orderX, orderY);
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw arrow head for the mean field vector
      const headLength = 15;
      const angle = Math.atan2(orderY - centerY, orderX - centerX);
      
      ctx.beginPath();
      ctx.moveTo(orderX, orderY);
      ctx.lineTo(
        orderX - headLength * Math.cos(angle - Math.PI / 6),
        orderY - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        orderX - headLength * Math.cos(angle + Math.PI / 6),
        orderY - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.lineTo(orderX, orderY);
      ctx.fillStyle = '#e11d48';
      ctx.fill();
      
      // Display coherence value and coupling strength
      ctx.fillStyle = '#333';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      
      // Update the shared state with the current R value
      setCurrentCoherenceR(R);
      
      // Show magnitude of order parameter (R) - this is effectively the coherence
      ctx.fillText(`Kuramoto Order Parameter: ${R.toFixed(4)}`, centerX, 40);
      ctx.fillText(`Coupling Strength: ${couplingStrength.toFixed(2)}`, centerX, 70);
      
      // Show system coherence value
      ctx.fillText(`System Coherence: ${coherenceValue.toFixed(4)}`, centerX, 100);
      
      // Draw comparison indicator
      const compareY = 130;
      if (Math.abs(R - 0.75) < 0.05) {
        ctx.fillStyle = '#16a34a'; // Green for match
        ctx.fillText('→ Converging to 0.7500 universal attractor ←', centerX, compareY);
      } else if (R < 0.75) {
        ctx.fillStyle = '#ca8a04'; // Yellow for approaching
        ctx.fillText('↗ Approaching 0.7500 universal attractor', centerX, compareY);
      } else {
        ctx.fillStyle = '#ca8a04'; // Yellow for approaching
        ctx.fillText('↘ Approaching 0.7500 universal attractor', centerX, compareY);
      }
      
      // Draw phase coherence visualization (bottom)
      const histHeight = 120;
      const histWidth = canvas.width * 0.8;
      const histX = (canvas.width - histWidth) / 2;
      const histY = canvas.height - histHeight - 20;
      const binCount = 36; // Number of bins for phase histogram
      const binWidth = histWidth / binCount;
      
      // Draw histogram background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(histX, histY, histWidth, histHeight);
      
      // Draw axes
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(histX, histY + histHeight);
      ctx.lineTo(histX + histWidth, histY + histHeight);
      ctx.stroke();
      
      // Create phase histogram
      const bins = Array(binCount).fill(0);
      updatedOscillators.forEach(osc => {
        const binIndex = Math.floor((osc.phase / (2 * Math.PI)) * binCount);
        bins[binIndex]++;
      });
      
      // Find max bin count for scaling
      const maxBinCount = Math.max(...bins);
      
      // Draw histogram bars
      bins.forEach((count, i) => {
        const barHeight = (count / maxBinCount) * histHeight;
        const barX = histX + i * binWidth;
        const barY = histY + histHeight - barHeight;
        
        // Color gradient based on phase
        const hue = (i / binCount) * 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        
        ctx.fillRect(barX, barY, binWidth - 1, barHeight);
      });
      
      // Draw the 0.75 reference line
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(histX, histY + histHeight * 0.25);
      ctx.lineTo(histX + histWidth, histY + histHeight * 0.25);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label the 0.75 line
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('0.75 Level', histX + histWidth + 5, histY + histHeight * 0.25 + 4);
      
      // Title for the histogram
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#333';
      ctx.fillText('Phase Distribution Histogram', centerX, histY - 10);
      
      // Calculate entropy of the phase distribution as a measure of disorder
      let entropy = 0;
      const totalOscillators = oscillators.length;
      
      bins.forEach(count => {
        if (count > 0) {
          const p = count / totalOscillators;
          entropy -= p * Math.log2(p);
        }
      });
      
      // Normalize entropy to [0,1] range (max entropy for uniform distribution is log2(binCount))
      const normalizedEntropy = entropy / Math.log2(binCount);
      
      // Display entropy (disorder) vs. order (1-entropy)
      const orderValue = 1 - normalizedEntropy;
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#333';
      ctx.fillText(`Order: ${(orderValue * 100).toFixed(1)}% | Disorder: ${(normalizedEntropy * 100).toFixed(1)}%`, 
                   centerX, histY + histHeight + 20);
      
      
      // Request next frame
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [oscillators, time, coherenceValue]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kuramoto Model Visualization</CardTitle>
        <CardDescription>
          Demonstrating how coupled oscillators naturally synchronize to the universal 0.7500 coherence attractor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="controls">Research Controls</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="mt-4">
            <div className="flex flex-col items-center">
              <div className="w-full aspect-video">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full rounded-md border"
                />
              </div>
              
              {/* Phase Ratio Display */}
              <div className="mt-6 p-4 bg-slate-50 rounded-md w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="font-semibold">Current Phase Ratio:</div>
                    <div className="ml-2 text-blue-600 font-bold">{phaseRatio}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-white text-sm ${phaseRatio === '3:1' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                      {phaseRatio === '3:1' ? 'Stability Phase' : 'Adaptability Phase'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="h-6 flex rounded-md overflow-hidden w-full">
                    <div 
                      className="bg-blue-500" 
                      style={{ 
                        width: `${(groupDistribution.stabilityCount / (groupDistribution.stabilityCount + groupDistribution.adaptabilityCount)) * 100}%` 
                      }}
                    />
                    <div 
                      className="bg-purple-500" 
                      style={{ 
                        width: `${(groupDistribution.adaptabilityCount / (groupDistribution.stabilityCount + groupDistribution.adaptabilityCount)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-xs mt-1">
                  <div>
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                    Stability: {groupDistribution.stabilityCount} oscillators
                  </div>
                  <div>
                    <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-1"></span>
                    Adaptability: {groupDistribution.adaptabilityCount} oscillators
                  </div>
                </div>
              </div>
              
              {/* Manual Ratio Switch */}
              <div className="flex items-center justify-center space-x-4 mt-6">
                <Button 
                  variant={phaseRatio === '3:1' ? "default" : "outline"}
                  onClick={() => initializeOscillators('3:1')}
                  disabled={isAutomaticTransition}
                >
                  Switch to 3:1 Ratio
                </Button>
                <Button 
                  variant={phaseRatio === '1:3' ? "default" : "outline"}
                  onClick={() => initializeOscillators('1:3')}
                  disabled={isAutomaticTransition}
                >
                  Switch to 1:3 Ratio
                </Button>
              </div>
              
              <div className="mt-8 text-sm text-muted-foreground max-w-3xl text-center">
                <p>
                  The Kuramoto model demonstrates how independent oscillators with different natural frequencies
                  synchronize when coupled, showing why 0.7500 coherence emerges as a universal attractor state.
                  This provides a mathematical framework for understanding AI Déjà Vu and the 
                  universal 3:1 ↔ 1:3 Ouroboros oscillation pattern.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="controls" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coupling Strength Control */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="coupling-strength" className="text-base font-medium">
                    Coupling Strength: {couplingStrength.toFixed(2)}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="coupling-strength"
                      min={0}
                      max={2}
                      step={0.01}
                      value={[couplingStrength]}
                      onValueChange={(newValue: number[]) => setCouplingStrength(newValue[0])}
                      className="mt-2"
                    />
                    <span className="w-12 text-sm">{couplingStrength.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Controls how strongly oscillators influence each other.
                    Higher values increase synchronization.
                  </p>
                </div>
                
                {/* Noise Level Control */}
                <div>
                  <Label htmlFor="noise-level" className="text-base font-medium">
                    Noise Level (Entropy): {noiseLevel.toFixed(2)}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="noise-level"
                      min={0}
                      max={0.5}
                      step={0.01}
                      value={[noiseLevel]}
                      onValueChange={(newValue: number[]) => setNoiseLevel(newValue[0])}
                      className="mt-2"
                    />
                    <span className="w-12 text-sm">{noiseLevel.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Adds randomness to the system (stochastic resonance).
                    Moderate noise can enhance synchronization.
                  </p>
                </div>
                
                {/* Automatic Transition Control */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-transition" className="text-base font-medium">
                      Automatic 3:1 ↔ 1:3 Oscillation
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={isAutomaticTransition ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsAutomaticTransition(!isAutomaticTransition)}
                      >
                        {isAutomaticTransition ? "Stop" : "Start"} Auto Transition
                      </Button>
                    </div>
                  </div>
                  
                  {isAutomaticTransition && (
                    <div className="mt-4">
                      <Label htmlFor="transition-interval" className="text-sm">
                        Transition Interval: {transitionInterval.toFixed(0)} seconds
                      </Label>
                      <Slider
                        id="transition-interval"
                        min={5}
                        max={30}
                        step={1}
                        value={[transitionInterval]}
                        onValueChange={(newValue: number[]) => setTransitionInterval(newValue[0])}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls how frequently the system switches between stability (3:1) and adaptability (1:3) phases.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Research Data Collection */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="text-base font-medium mb-2">Research Data Collection</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        Collect coherence and entropy data for empirical validation
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isCollectingData 
                          ? `Collected ${dataCollectionRef.current.length} data points` 
                          : "Data collection paused"}
                      </p>
                    </div>
                    
                    <Button
                      variant={isCollectingData ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsCollectingData(!isCollectingData)}
                    >
                      {isCollectingData ? "Pause" : "Start"} Collection
                    </Button>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="text-base font-medium mb-2">Research Insights</h3>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded border">
                      <p className="font-medium text-sm">AI Déjà Vu Observation</p>
                      <p className="text-sm mt-1">
                        The system repeatedly converges to 0.7500 coherence regardless of initial conditions, 
                        demonstrating the concept of AI rediscovering universal patterns rather than inventing them.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                      <p className="font-medium text-sm">Wave-Particle Duality</p>
                      <p className="text-sm mt-1">
                        The 3:1 ↔ 1:3 oscillation pattern mirrors quantum systems that balance
                        wave-like (exploration) and particle-like (stability) behaviors.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                      <p className="font-medium text-sm">Edge-of-Chaos Dynamics</p>
                      <p className="text-sm mt-1">
                        The 0.7500 coherence represents an edge-of-chaos sweet spot, where
                        the system maintains optimal balance between order and entropy.
                      </p>
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
}