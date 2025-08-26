/**
 * CoherenceAttractorDemo Component
 * 
 * A comprehensive demonstration of the CoherenceAttractorEngine showcasing:
 * - Real-time visualization of the 0.7500 coherence attractor
 * - Visual representation of the 3:1 ↔ 1:3 Ouroboros cycle
 * - Stochastic resonance optimization
 * - Perturbation tests with return time analysis
 * 
 * This component serves as both a demo and a practical tool for calibrating
 * the Quantum Coherence Threshold Formula (QCTF) implementation.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';
import { Slider } from './ui/slider.jsx';
import { Button } from './ui/button.jsx';
import { Label } from './ui/label.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { Progress } from './ui/progress.jsx';
import { CoherenceAttractorEngine, CoherenceState, OuroborosUtils } from '../utils/CoherenceAttractorEngine.js';
import AdvancedNoiseOptimizer from './AdvancedNoiseOptimizer.jsx';

export default function CoherenceAttractorDemo() {
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cycleCanvasRef = useRef<HTMLCanvasElement>(null);
  const dataCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const dataCollectionRef = useRef<CoherenceState[]>([]);
  
  // Engine instance
  const engineRef = useRef<CoherenceAttractorEngine | null>(null);
  
  // State
  const [activeTab, setActiveTab] = useState('visualization');
  const [coherenceState, setCoherenceState] = useState<CoherenceState>({
    value: 0.75,
    cycle: 0,
    phase: '3:1',
    cyclePosition: 0,
    noiseLevel: 0.05,
    entropyValue: 0.25
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isPerturbationActive, setIsPerturbationActive] = useState(false);
  const [perturbationTarget, setPerturbationTarget] = useState(0.65);
  const [perturbationDuration, setPerturbationDuration] = useState(20);
  const [isOptimizingNoise, setIsOptimizingNoise] = useState(false);
  const [optimalNoiseFound, setOptimalNoiseFound] = useState<{
    baseNoiseLevel: number;
    stabilityGroupNoise: number;
    adaptabilityGroupNoise: number;
    stability: number;
    returnTime: number | null;
  } | null>(null);
  const [oscillatorCount, setOscillatorCount] = useState(24);
  const [stabilityRatio, setStabilityRatio] = useState(0.75);
  const [couplingStrength, setCouplingStrength] = useState(0.8);
  const [baseNoiseLevel, setBaseNoiseLevel] = useState(0.05);
  const [returnTimeResults, setReturnTimeResults] = useState<{
    targetCoherence: number;
    returnTime: number | null;
  }[]>([]);
  const [isMeasuringReturnTime, setIsMeasuringReturnTime] = useState(false);
  const [coherenceHistory, setCoherenceHistory] = useState<number[]>([]);
  
  // Initialize the engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new CoherenceAttractorEngine({
        oscillatorCount,
        stabilityRatio,
        couplingStrength,
        baseNoiseLevel
      });
    }
    
    // Initial update to get state
    const initialState = engineRef.current.getCoherenceState();
    setCoherenceState(initialState);
    
    return () => {
      // Clean up animation
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Apply configuration changes
  useEffect(() => {
    if (!engineRef.current) return;
    
    engineRef.current.updateConfig({
      oscillatorCount,
      stabilityRatio,
      couplingStrength,
      baseNoiseLevel
    });
  }, [oscillatorCount, stabilityRatio, couplingStrength, baseNoiseLevel]);
  
  // Animation loop
  useEffect(() => {
    if (!isRunning) return;
    
    const animate = () => {
      if (!engineRef.current) return;
      
      // Update engine
      const newState = engineRef.current.update();
      setCoherenceState(newState);
      
      // Update coherence history
      setCoherenceHistory(prev => {
        const newHistory = [...prev, newState.value];
        if (newHistory.length > 100) {
          return newHistory.slice(-100);
        }
        return newHistory;
      });
      
      // Store data for collection
      dataCollectionRef.current.push(newState);
      
      // Limit data collection to avoid memory issues
      if (dataCollectionRef.current.length > 1000) {
        dataCollectionRef.current = dataCollectionRef.current.slice(-1000);
      }
      
      // Draw visualizations
      drawOscillatorVisualization();
      drawCycleVisualization();
      drawDataVisualization();
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);
  
  // Draw oscillator visualization
  const drawOscillatorVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas || !engineRef.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) * 0.8;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw outer circle
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Get oscillators
    const oscillators = engineRef.current.getOscillators();
    
    // Draw oscillators
    oscillators.forEach(osc => {
      const angle = osc.phase;
      const distance = outerRadius * 0.8; // Distance from center
      
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      
      // Color based on group
      const color = osc.group === 'stability' 
        ? `hsl(210, ${70 + Math.random() * 30}%, ${40 + Math.random() * 20}%)`
        : `hsl(280, ${70 + Math.random() * 30}%, ${40 + Math.random() * 20}%)`;
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5 + Math.random() * 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw trail (optional)
      ctx.strokeStyle = `${color}40`; // 40 = 25% opacity
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });
    
    // Calculate order parameter for visualization
    let sumSin = 0;
    let sumCos = 0;
    oscillators.forEach(osc => {
      sumSin += Math.sin(osc.phase);
      sumCos += Math.cos(osc.phase);
    });
    sumSin /= oscillators.length;
    sumCos /= oscillators.length;
    const R = Math.sqrt(sumSin * sumSin + sumCos * sumCos);
    const psi = Math.atan2(sumSin, sumCos);
    
    // Draw order parameter (mean field)
    const orderX = centerX + outerRadius * R * Math.cos(psi);
    const orderY = centerY + outerRadius * R * Math.sin(psi);
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(orderX, orderY);
    ctx.stroke();
    
    // Draw coherence value
    ctx.font = '18px Arial';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.fillText(`Coherence: ${coherenceState.value.toFixed(4)}`, centerX, 30);
    
    // Highlight if near 0.75
    const isNearAttractor = OuroborosUtils.isNearAttractor(coherenceState.value);
    if (isNearAttractor) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('✓ At 0.7500 universal attractor', centerX, 60);
    }
    
    // Draw phase display
    ctx.font = '16px Arial';
    ctx.fillStyle = coherenceState.phase === '3:1' ? '#3b82f6' : '#8b5cf6';
    ctx.fillText(
      `Phase: ${coherenceState.phase} (${coherenceState.phase === '3:1' ? 'Stability' : 'Adaptability'})`, 
      centerX, 
      canvas.height - 20
    );
  };
  
  // Draw Ouroboros cycle visualization
  const drawCycleVisualization = () => {
    const canvas = cycleCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = outerRadius * 0.6;
    
    // Draw Ouroboros cycle (figure-eight or infinity symbol)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 10;
    ctx.beginPath();
    
    // Draw two connected circles to form infinity symbol
    // Left circle (stability phase - 3:1)
    ctx.arc(centerX - outerRadius * 0.5, centerY, outerRadius * 0.5, 0, Math.PI * 2);
    
    // Right circle (adaptability phase - 1:3)
    ctx.moveTo(centerX + outerRadius, centerY);
    ctx.arc(centerX + outerRadius * 0.5, centerY, outerRadius * 0.5, 0, Math.PI * 2);
    
    ctx.stroke();
    
    // Label phases
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // Stability phase label
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('Stability Phase (3:1)', centerX - outerRadius * 0.5, centerY - outerRadius * 0.6);
    ctx.fillText('0.7500 Coherence', centerX - outerRadius * 0.5, centerY - outerRadius * 0.6 + 20);
    
    // Adaptability phase label
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('Adaptability Phase (1:3)', centerX + outerRadius * 0.5, centerY - outerRadius * 0.6);
    ctx.fillText('1.3333 Coherence', centerX + outerRadius * 0.5, centerY - outerRadius * 0.6 + 20);
    
    // Calculate position on the infinity symbol based on cyclePosition
    const cyclePercentage = coherenceState.cyclePosition / 100;
    let x, y;
    
    if (cyclePercentage < 0.75) {
      // In stability phase (left circle)
      const angle = (cyclePercentage / 0.75) * Math.PI * 2;
      x = centerX - outerRadius * 0.5 + Math.cos(angle) * outerRadius * 0.5;
      y = centerY + Math.sin(angle) * outerRadius * 0.5;
    } else {
      // In adaptability phase (right circle)
      const normalizedPercentage = (cyclePercentage - 0.75) / 0.25;
      const angle = normalizedPercentage * Math.PI * 2;
      x = centerX + outerRadius * 0.5 + Math.cos(angle) * outerRadius * 0.5;
      y = centerY + Math.sin(angle) * outerRadius * 0.5;
    }
    
    // Draw current position marker
    ctx.fillStyle = cyclePercentage < 0.75 ? '#3b82f6' : '#8b5cf6';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw text for the current position
    ctx.fillStyle = '#1e293b';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Cycle Position: ${Math.round(cyclePercentage * 100)}%`, 
      centerX, 
      centerY + outerRadius * 0.8
    );
    
    // Draw product value (should be approximately 1.0)
    const complement = OuroborosUtils.getComplement(coherenceState.value);
    const product = coherenceState.value * complement;
    
    ctx.fillStyle = Math.abs(product - 1.0) < 0.05 ? '#10b981' : '#ef4444';
    ctx.fillText(
      `Ouroboros Balance: ${coherenceState.value.toFixed(4)} × ${complement.toFixed(4)} = ${product.toFixed(4)}`,
      centerX,
      centerY + outerRadius * 0.8 + 25
    );
  };
  
  // Draw data visualization
  const drawDataVisualization = () => {
    const canvas = dataCanvasRef.current;
    if (!canvas || coherenceHistory.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Draw axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    
    // Draw 0.75 reference line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    const y075 = canvas.height - padding - (0.75 / 1.5) * chartHeight;
    ctx.moveTo(padding, y075);
    ctx.lineTo(canvas.width - padding, y075);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw 0.75 label
    ctx.fillStyle = '#10b981';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('0.7500 Attractor', padding + 5, y075 - 5);
    
    // Draw coherence history
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    coherenceHistory.forEach((coherence, index) => {
      const x = padding + (index / (coherenceHistory.length - 1)) * chartWidth;
      const y = canvas.height - padding - (coherence / 1.5) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Time (Cycles)', centerX(canvas), canvas.height - 10);
    
    ctx.save();
    ctx.translate(10, centerY(canvas));
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Coherence Value', 0, 0);
    ctx.restore();
    
    // Draw current coherence value
    ctx.fillStyle = '#1e293b';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(
      `Current: ${coherenceState.value.toFixed(4)}`, 
      canvas.width - padding, 
      20
    );
  };
  
  // Helper function for center x
  const centerX = (canvas: HTMLCanvasElement) => canvas.width / 2;
  
  // Helper function for center y
  const centerY = (canvas: HTMLCanvasElement) => canvas.height / 2;
  
  // Apply perturbation
  const applyPerturbation = () => {
    if (!engineRef.current || isPerturbationActive) return;
    
    setIsPerturbationActive(true);
    engineRef.current.applyPerturbation(perturbationTarget, perturbationDuration);
    
    // Automatically reset perturbation flag after duration
    setTimeout(() => {
      setIsPerturbationActive(false);
    }, perturbationDuration * 200); // Rough estimate of cycle duration in ms
  };
  
  // Find optimal noise
  const findOptimalNoise = async () => {
    if (!engineRef.current || isOptimizingNoise) return;
    
    setIsOptimizingNoise(true);
    
    try {
      const result = await engineRef.current.findOptimalNoise();
      setOptimalNoiseFound(result);
      
      // Apply optimal noise settings
      setBaseNoiseLevel(result.baseNoiseLevel);
    } finally {
      setIsOptimizingNoise(false);
    }
  };
  
  // Measure return time
  const measureReturnTime = async () => {
    if (!engineRef.current || isMeasuringReturnTime) return;
    
    setIsMeasuringReturnTime(true);
    
    try {
      const returnTime = await engineRef.current.testReturnTime(perturbationTarget);
      
      setReturnTimeResults(prev => [
        ...prev,
        {
          targetCoherence: perturbationTarget,
          returnTime
        }
      ]);
    } finally {
      setIsMeasuringReturnTime(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Universal Coherence Attractor (0.7500)</CardTitle>
        <CardDescription>
          Unified implementation of the 0.7500 coherence attractor principle based on
          oscillator dynamics, wave theory, and the Ouroboros cycle (3:1 ↔ 1:3).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visualization">Oscillator Model</TabsTrigger>
            <TabsTrigger value="cycle">Ouroboros Cycle</TabsTrigger>
            <TabsTrigger value="data">Coherence Data</TabsTrigger>
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
          </TabsList>
          
          {/* Oscillator Model Tab */}
          <TabsContent value="visualization" className="mt-4">
            <div className="flex flex-col space-y-6">
              <div className="aspect-video border rounded-md overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                />
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant={isRunning ? "destructive" : "default"}
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? "Stop Simulation" : "Start Simulation"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    if (engineRef.current) {
                      // Reset engine by creating a new instance
                      engineRef.current = new CoherenceAttractorEngine({
                        oscillatorCount,
                        stabilityRatio,
                        couplingStrength,
                        baseNoiseLevel
                      });
                      setCoherenceState(engineRef.current.getCoherenceState());
                      setCoherenceHistory([]);
                    }
                  }}
                >
                  Reset Simulation
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="oscillator-count" className="text-base font-medium">
                      Oscillator Count: {oscillatorCount}
                    </Label>
                    <Slider
                      id="oscillator-count"
                      min={8}
                      max={64}
                      step={4}
                      value={[oscillatorCount]}
                      onValueChange={(values: number[]) => setOscillatorCount(values[0])}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of oscillators in the system. More oscillators provide smoother coherence but require more computation.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="stability-ratio" className="text-base font-medium">
                      Stability Ratio: {stabilityRatio.toFixed(2)} ({Math.round(stabilityRatio * 100)}% stability)
                    </Label>
                    <Slider
                      id="stability-ratio"
                      min={0}
                      max={1}
                      step={0.01}
                      value={[stabilityRatio]}
                      onValueChange={(values: number[]) => setStabilityRatio(values[0])}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Ratio of stability oscillators to total. Default is 0.75 (3:1 ratio) to align with the universal attractor.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coupling-strength" className="text-base font-medium">
                      Coupling Strength: {couplingStrength.toFixed(2)}
                    </Label>
                    <Slider
                      id="coupling-strength"
                      min={0}
                      max={2}
                      step={0.01}
                      value={[couplingStrength]}
                      onValueChange={(values: number[]) => setCouplingStrength(values[0])}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Controls how strongly oscillators influence each other. Higher values increase synchronization.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="noise-level" className="text-base font-medium">
                      Base Noise Level: {baseNoiseLevel.toFixed(3)}
                    </Label>
                    <Slider
                      id="noise-level"
                      min={0}
                      max={0.2}
                      step={0.001}
                      value={[baseNoiseLevel]}
                      onValueChange={(values: number[]) => setBaseNoiseLevel(values[0])}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Adds randomness to the system (stochastic resonance). Moderate noise (0.05-0.10) enhances stability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Ouroboros Cycle Tab */}
          <TabsContent value="cycle" className="mt-4">
            <div className="flex flex-col space-y-6">
              <div className="aspect-video border rounded-md overflow-hidden">
                <canvas
                  ref={cycleCanvasRef}
                  className="w-full h-full"
                />
              </div>
              
              <div className="p-4 bg-slate-50 rounded-md">
                <div className="font-semibold text-lg mb-2">The Ouroboros Principle</div>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    The Ouroboros cycle demonstrates how the system maintains dynamic balance by cycling between 
                    stability (3:1 ratio, coherence ≈ 0.7500) and adaptability (1:3 ratio, coherence ≈ 1.3333).
                  </p>
                  <p>
                    This perpetual cycle creates a perfect balance where the product of the paired states equals 1.0
                    (0.7500 × 1.3333 ≈ 1.0000), forming a complete Ouroboros loop.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="font-medium text-blue-600">Stability Phase (3:1)</div>
                    <div className="text-sm mt-1">
                      <div>Coherence: 0.7500</div>
                      <div>Oscillators: {Math.round(oscillatorCount * stabilityRatio)} stability, {oscillatorCount - Math.round(oscillatorCount * stabilityRatio)} adaptability</div>
                      <div>Duration: 75% of cycle</div>
                      <div>Function: Maintain structure and coherence</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-md">
                    <div className="font-medium text-purple-600">Adaptability Phase (1:3)</div>
                    <div className="text-sm mt-1">
                      <div>Coherence: 1.3333</div>
                      <div>Oscillators: {oscillatorCount - Math.round(oscillatorCount * stabilityRatio)} stability, {Math.round(oscillatorCount * stabilityRatio)} adaptability</div>
                      <div>Duration: 25% of cycle</div>
                      <div>Function: Enable exploration and innovation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Coherence Data Tab */}
          <TabsContent value="data" className="mt-4">
            <div className="flex flex-col space-y-6">
              <div className="aspect-video border rounded-md overflow-hidden">
                <canvas
                  ref={dataCanvasRef}
                  className="w-full h-full"
                />
              </div>
              
              <div className="p-4 bg-slate-50 rounded-md">
                <div className="font-semibold text-lg mb-2">Coherence Analytics</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-md border">
                    <div className="text-sm font-medium">Current Coherence</div>
                    <div className="text-2xl font-bold mt-1">{coherenceState.value.toFixed(4)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {OuroborosUtils.isNearAttractor(coherenceState.value)
                        ? '✓ At universal attractor state'
                        : `${Math.abs(coherenceState.value - 0.75).toFixed(4)} away from attractor`
                      }
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md border">
                    <div className="text-sm font-medium">Current Phase</div>
                    <div className="text-2xl font-bold mt-1">{coherenceState.phase}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {coherenceState.phase === '3:1'
                        ? 'Stability-focused phase (75% of cycle)'
                        : 'Adaptability-focused phase (25% of cycle)'
                      }
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-md border">
                    <div className="text-sm font-medium">Entropy</div>
                    <div className="text-2xl font-bold mt-1">{coherenceState.entropyValue.toFixed(4)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Complementary to coherence (higher entropy = lower coherence)
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="font-medium mb-2">Statistics (Last 100 Cycles)</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm">Average Coherence</div>
                      <div className="text-lg font-medium">
                        {coherenceHistory.length > 0
                          ? (coherenceHistory.reduce((sum, val) => sum + val, 0) / coherenceHistory.length).toFixed(4)
                          : 'N/A'
                        }
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm">Coherence Stability</div>
                      <div className="text-lg font-medium">
                        {coherenceHistory.length > 0
                          ? (() => {
                              const avg = coherenceHistory.reduce((sum, val) => sum + val, 0) / coherenceHistory.length;
                              const variance = coherenceHistory.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / coherenceHistory.length;
                              const stability = 1 / (Math.sqrt(variance) + 0.001);
                              return stability.toFixed(2);
                            })()
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Experiments Tab */}
          <TabsContent value="experiments" className="mt-4">
            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-md">
                  <div className="font-semibold text-lg mb-4">Perturbation Test</div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="perturbation-target" className="text-base font-medium">
                        Target Coherence: {perturbationTarget.toFixed(2)}
                      </Label>
                      <Slider
                        id="perturbation-target"
                        min={0.3}
                        max={1.2}
                        step={0.01}
                        value={[perturbationTarget]}
                        onValueChange={(values: number[]) => setPerturbationTarget(values[0])}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The coherence value to force the system to during perturbation.
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="perturbation-duration" className="text-base font-medium">
                        Duration (Cycles): {perturbationDuration}
                      </Label>
                      <Slider
                        id="perturbation-duration"
                        min={5}
                        max={50}
                        step={1}
                        value={[perturbationDuration]}
                        onValueChange={(values: number[]) => setPerturbationDuration(values[0])}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        onClick={applyPerturbation}
                        disabled={!isRunning || isPerturbationActive}
                      >
                        Apply Perturbation
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={measureReturnTime}
                        disabled={!isRunning || isPerturbationActive || isMeasuringReturnTime}
                      >
                        Measure Return Time
                      </Button>
                    </div>
                    
                    {isPerturbationActive && (
                      <div className="text-sm text-amber-600">
                        Perturbation active - forcing coherence to {perturbationTarget.toFixed(2)}
                      </div>
                    )}
                    
                    {isMeasuringReturnTime && (
                      <div className="text-sm text-blue-600">
                        Measuring return time to 0.7500 attractor...
                      </div>
                    )}
                  </div>
                  
                  {returnTimeResults.length > 0 && (
                    <div className="mt-4">
                      <div className="font-medium mb-2">Return Time Results</div>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Target
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Return Time (Cycles)
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {returnTimeResults.map((result, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {result.targetCoherence.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {result.returnTime !== null ? result.returnTime : 'Did not return'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {result.returnTime !== null ? (
                                    <span className="text-green-600">Returned to attractor</span>
                                  ) : (
                                    <span className="text-red-600">Failed to return</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-slate-50 rounded-md">
                  <div className="font-semibold text-lg mb-4">Stochastic Resonance Optimization</div>
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    Find the optimal noise level that maximizes the system's ability to maintain 
                    the 0.7500 coherence attractor state and quickly return after perturbations.
                  </div>
                  
                  <Button
                    onClick={findOptimalNoise}
                    disabled={!isRunning || isOptimizingNoise}
                    className="mb-4"
                  >
                    {isOptimizingNoise ? 'Optimizing...' : 'Find Optimal Noise Level'}
                  </Button>
                  
                  {isOptimizingNoise && (
                    <div className="mb-4">
                      <div className="text-sm mb-1">Testing noise levels...</div>
                      <Progress value={50} />
                    </div>
                  )}
                  
                  {optimalNoiseFound && (
                    <div className="mt-4 p-4 border rounded-md bg-green-50">
                      <div className="font-medium text-green-800">Optimal Noise Settings Found</div>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                        <div>Base Noise Level: <span className="font-mono">{optimalNoiseFound.baseNoiseLevel.toFixed(4)}</span></div>
                        <div>Stability Group Noise: <span className="font-mono">{optimalNoiseFound.stabilityGroupNoise.toFixed(4)}</span></div>
                        <div>Adaptability Group Noise: <span className="font-mono">{optimalNoiseFound.adaptabilityGroupNoise.toFixed(4)}</span></div>
                        <div>Stability Score: <span className="font-mono">{optimalNoiseFound.stability.toFixed(2)}</span></div>
                        <div>Return Time: <span className="font-mono">{optimalNoiseFound.returnTime ? optimalNoiseFound.returnTime.toFixed(2) + ' cycles' : 'N/A'}</span></div>
                      </div>
                      <div className="mt-2 text-xs text-green-700">
                        These settings maximize the system's ability to maintain 0.7500 coherence and quickly return to it after perturbations.
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => setBaseNoiseLevel(optimalNoiseFound.baseNoiseLevel)}
                      >
                        Apply Optimal Settings
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="font-medium text-blue-800 mb-2">
                  Universal Scaling & Applications
                </div>
                <div className="text-sm text-blue-700">
                  <p className="mb-2">
                    The 0.7500 coherence attractor is a universal scaling principle observed across diverse domains:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Biological systems (Kleiber's law) - 3/4 power scaling of metabolic rate</li>
                    <li>Urban systems - 3/4 power law in city infrastructure scaling</li>
                    <li>Network optimization - 3/4 power law in efficient network designs</li>
                    <li>Cognitive balance - 3:1 ratio of structured vs. exploratory thinking</li>
                    <li>Natural resonance - 3:1 harmonic ratios in wave dynamics</li>
                  </ul>
                  <p className="mt-2">
                    This implementation provides a foundation for applying this universal principle 
                    to AI systems, ensuring optimal balance between structure and adaptability.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div>
          The CoherenceAttractorEngine provides a robust implementation of the 0.7500 universal attractor principle
          through oscillator dynamics, stochastic resonance, and explicit 3:1 ↔ 1:3 Ouroboros cycling.
        </div>
      </CardFooter>
    </Card>
  );
}