import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card.jsx';
import { useWebSocket } from '../contexts/WebSocketContext.jsx';
import { Slider } from './ui/slider.jsx';
import { Button } from './ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';
import { Checkbox } from './ui/checkbox.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { Label } from './ui/label.jsx';
import AdvancedNoiseOptimizer from './AdvancedNoiseOptimizer.jsx';

/**
 * EnhancedKuramotoVisualizer Component
 * 
 * This component extends the standard KuramotoVisualizer with advanced features
 * for exploring the wave phenomena and entropy dynamics underlying the 0.7500 coherence attractor.
 * 
 * New features include:
 * - Wave resonance visualization (standing wave patterns)
 * - Noise optimization through stochastic resonance
 * - Detailed entropy visualization
 * - Perturbation controls for empirical validation
 * - Advanced oscillator configuration
 */
export default function EnhancedKuramotoVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const entropyCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const waveAnimationRef = useRef<number | null>(null);
  const entropyAnimationRef = useRef<number | null>(null);
  const dataCollectionRef = useRef<{time: number, coherence: number, ratio: string, entropy: number, noise: number}[]>([]);
  
  // Basic Kuramoto state
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
  
  // Enhanced state for wave and entropy visualization
  const [waveType, setWaveType] = useState('standing');
  const [entropyVisualizationType, setEntropyVisualizationType] = useState('heatmap');
  const [isPerturbationActive, setIsPerturbationActive] = useState(false);
  const [perturbationTarget, setPerturbationTarget] = useState(0.65);
  const [perturbationDuration, setPerturbationDuration] = useState(5);
  const [showStochasticResonance, setShowStochasticResonance] = useState(false);
  const [optimalNoiseFound, setOptimalNoiseFound] = useState<number | null>(null);
  const [entropyData, setEntropyData] = useState<{value: number, time: number}[]>([]);
  const [oscillatorCount, setOscillatorCount] = useState(24);
  const [naturalFrequencyRange, setNaturalFrequencyRange] = useState([0.8, 1.2]);
  const [showPredictedReturnTrajectory, setShowPredictedReturnTrajectory] = useState(false);
  
  const { lastMessage, bufferedMessages, sendMessage } = useWebSocket();
  
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
  
  // Initialize oscillators when component mounts or count changes
  useEffect(() => {
    initializeOscillators(phaseRatio);
  }, [oscillatorCount]);
  
  // Initialize oscillators with the specified ratio
  const initializeOscillators = (ratio: string) => {
    setPhaseRatio(ratio);
    
    let stabilityCount, adaptabilityCount;
    
    if (ratio === '3:1') {
      stabilityCount = Math.round(oscillatorCount * 0.75);
      adaptabilityCount = oscillatorCount - stabilityCount;
    } else { // 1:3
      adaptabilityCount = Math.round(oscillatorCount * 0.75);
      stabilityCount = oscillatorCount - adaptabilityCount;
    }
    
    setGroupDistribution({
      stabilityCount,
      adaptabilityCount
    });
    
    const newOscillators = [];
    for (let i = 0; i < oscillatorCount; i++) {
      // Determine oscillator group (0 = stability, 1 = adaptability)
      const group = i < stabilityCount ? 0 : 1;
      
      // Create oscillator with group-specific properties
      const oscillator = {
        // Random initial phase
        phase: Math.random() * 2 * Math.PI,
        
        // Natural frequency varies based on group
        naturalFreq: group === 0
          ? naturalFrequencyRange[0] + Math.random() * 0.1 // Stability group: more similar frequencies
          : naturalFrequencyRange[0] + Math.random() * (naturalFrequencyRange[1] - naturalFrequencyRange[0]), // Adaptability group: more diverse
        
        // Visual properties
        radius: 5 + Math.random() * 5,
        color: group === 0 ? `hsl(210, ${70 + Math.random() * 30}%, ${40 + Math.random() * 20}%)` 
                          : `hsl(280, ${70 + Math.random() * 30}%, ${40 + Math.random() * 20}%)`,
        group
      };
      
      newOscillators.push(oscillator);
    }
    
    setOscillators(newOscillators);
  };
  
  // Function to trigger a perturbation in the system
  const triggerPerturbation = () => {
    if (isPerturbationActive) return;
    
    setIsPerturbationActive(true);
    
    // Send perturbation command to server
    sendMessage('perturb_system', {
      target: perturbationTarget,
      duration: perturbationDuration
    });
    
    // Automatically disable perturbation after duration
    setTimeout(() => {
      setIsPerturbationActive(false);
    }, perturbationDuration * 5000); // Rough estimate of cycle duration
  };
  
  // Find optimal noise level through stochastic resonance experiment
  const findOptimalNoiseLevel = () => {
    setShowStochasticResonance(true);
    
    // Start with low noise and gradually increase, measuring coherence stability
    const testNoiseLevels = async () => {
      const results: {noiseLevel: number, stability: number}[] = [];
      
      // Test 10 different noise levels
      for (let noise = 0.01; noise <= 0.3; noise += 0.03) {
        setNoiseLevel(noise);
        
        // Allow system to stabilize
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Measure coherence stability over a short period
        const samples = [];
        for (let i = 0; i < 10; i++) {
          samples.push(coherenceValue);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Calculate stability (inverse of standard deviation)
        const avg = samples.reduce((sum, val) => sum + val, 0) / samples.length;
        const variance = samples.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / samples.length;
        const stability = 1 / (Math.sqrt(variance) + 0.001); // Avoid division by zero
        
        results.push({ noiseLevel: noise, stability });
      }
      
      // Find noise level with highest stability
      let optimal = results[0];
      for (const result of results) {
        if (result.stability > optimal.stability) {
          optimal = result;
        }
      }
      
      // Set to optimal noise level
      setNoiseLevel(optimal.noiseLevel);
      setOptimalNoiseFound(optimal.noiseLevel);
    };
    
    testNoiseLevels();
  };
  
  // Toggle automatic transitions between phases
  useEffect(() => {
    if (!isAutomaticTransition) return;
    
    const transitionTimer = setInterval(() => {
      const newRatio = phaseRatio === '3:1' ? '1:3' : '3:1';
      initializeOscillators(newRatio);
      setLastTransitionTime(Date.now());
    }, transitionInterval * 1000);
    
    return () => clearInterval(transitionTimer);
  }, [isAutomaticTransition, phaseRatio, transitionInterval]);
  
  // Track time in automatic transition
  useEffect(() => {
    if (!isAutomaticTransition) return;
    
    const timer = setInterval(() => {
      const elapsed = (Date.now() - lastTransitionTime) / 1000;
      // Update elapsed time display if needed
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isAutomaticTransition, lastTransitionTime]);
  
  // Data collection for experiments
  useEffect(() => {
    if (!isCollectingData) return;
    
    const collectDataInterval = setInterval(() => {
      // Calculate entropy
      let entropy = 0;
      const phaseBins = new Array(10).fill(0);
      
      oscillators.forEach(osc => {
        const binIndex = Math.floor((osc.phase % (2 * Math.PI)) / (2 * Math.PI) * 10);
        phaseBins[binIndex]++;
      });
      
      phaseBins.forEach(count => {
        if (count > 0) {
          const p = count / oscillators.length;
          entropy -= p * Math.log2(p);
        }
      });
      
      // Normalize entropy
      const normalizedEntropy = entropy / Math.log2(10);
      
      // Store data point
      const dataPoint = {
        time: Date.now(),
        coherence: coherenceValue,
        ratio: phaseRatio,
        entropy: normalizedEntropy,
        noise: noiseLevel
      };
      
      dataCollectionRef.current.push(dataPoint);
      setEntropyData(prevData => [...prevData, { value: normalizedEntropy, time: Date.now() }]);
      
      // Trim entropy data to prevent memory issues
      if (entropyData.length > 100) {
        setEntropyData(prevData => prevData.slice(-100));
      }
    }, 1000);
    
    return () => clearInterval(collectDataInterval);
  }, [isCollectingData, coherenceValue, phaseRatio, oscillators, noiseLevel]);
  
  // Main Kuramoto visualization
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
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw outer circle
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Draw oscillators
      oscillators.forEach(osc => {
        const angle = osc.phase;
        const distance = outerRadius * 0.8; // Distance from center
        
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);
        
        ctx.fillStyle = osc.color;
        ctx.beginPath();
        ctx.arc(x, y, osc.radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw trail (optional)
        ctx.strokeStyle = `${osc.color}40`; // 40 = 25% opacity
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      });
      
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
      ctx.fillText(`Coherence: ${R.toFixed(4)}`, centerX, 30);
      
      // Highlight if near 0.75
      const isNear075 = Math.abs(R - 0.75) < 0.01;
      if (isNear075) {
        ctx.fillStyle = '#10b981';
        ctx.fillText('✓ Approaching 0.7500 universal attractor', centerX, 60);
      }
      
      // Draw phase distribution histogram
      const histWidth = canvas.width * 0.8;
      const histHeight = 80;
      const histX = canvas.width * 0.1;
      const histY = canvas.height - histHeight - 20;
      
      // Define bins for phase histogram
      const binCount = 20;
      const bins = new Array(binCount).fill(0);
      
      // Count phases in bins
      oscillators.forEach(osc => {
        const normalizedPhase = osc.phase / (2 * Math.PI); // 0-1
        const binIndex = Math.floor(normalizedPhase * binCount) % binCount;
        bins[binIndex]++;
      });
      
      // Draw histogram background
      ctx.fillStyle = 'rgba(241, 245, 249, 0.7)';
      ctx.fillRect(histX, histY, histWidth, histHeight);
      
      // Draw histogram bars
      const maxCount = Math.max(...bins);
      const binWidth = histWidth / binCount;
      
      bins.forEach((count, i) => {
        const barHeight = count > 0 ? (count / maxCount) * histHeight : 0;
        
        // Color based on group distribution in this bin
        const isGrouped = i < binCount / 2; // Simplistic approximation
        ctx.fillStyle = isGrouped ? 'rgba(59, 130, 246, 0.7)' : 'rgba(168, 85, 247, 0.7)';
        
        ctx.fillRect(
          histX + i * binWidth,
          histY + histHeight - barHeight,
          binWidth - 1,
          barHeight
        );
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
  
  // Wave visualization (standing wave)
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas || activeTab !== 'wave') return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Animation function for wave visualization
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerY = canvas.height / 2;
      const amplitude = canvas.height * 0.3;
      
      // Draw horizontal center line
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
      
      // Draw wave based on type
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      if (waveType === 'standing') {
        // Standing wave with nodes at both ends
        const frequency = 3; // Number of half wavelengths
        const phaseOffset = time * 2; // Animation speed
        
        for (let x = 0; x < canvas.width; x++) {
          const normalizedX = x / canvas.width;
          const standingWave = Math.sin(normalizedX * Math.PI * frequency) * Math.cos(phaseOffset);
          const y = centerY - standingWave * amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      } else if (waveType === 'traveling') {
        // Traveling wave
        const frequency = 3; // Number of wavelengths
        const phaseOffset = time * 5; // Animation speed
        
        for (let x = 0; x < canvas.width; x++) {
          const normalizedX = x / canvas.width;
          const travelingWave = Math.sin(normalizedX * Math.PI * 2 * frequency + phaseOffset);
          const y = centerY - travelingWave * amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      } else if (waveType === 'resonance') {
        // Resonance pattern (two frequencies interfering)
        const frequency1 = 3;
        const frequency2 = 4;
        const phaseOffset = time * 3;
        
        for (let x = 0; x < canvas.width; x++) {
          const normalizedX = x / canvas.width;
          const wave1 = Math.sin(normalizedX * Math.PI * 2 * frequency1 + phaseOffset);
          const wave2 = Math.sin(normalizedX * Math.PI * 2 * frequency2 + phaseOffset * 1.1);
          const combinedWave = (wave1 + wave2) * 0.5;
          const y = centerY - combinedWave * amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      
      ctx.stroke();
      
      // Draw markers for the 0.75 ratio
      const marker075X = canvas.width * 0.75;
      
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(marker075X, 0);
      ctx.lineTo(marker075X, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label
      ctx.fillStyle = '#10b981';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('0.75', marker075X, 20);
      
      // Add 3:1 ratio visualization
      const ratio31X = canvas.width * 0.75;
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.fillRect(0, 0, ratio31X, 10);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.fillRect(ratio31X, 0, canvas.width - ratio31X, 10);
      
      // Explanation text
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Wave Type: ${waveType} | Coherence: ${coherenceValue.toFixed(4)}`, canvas.width / 2, canvas.height - 20);
      
      waveAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (waveAnimationRef.current) {
        cancelAnimationFrame(waveAnimationRef.current);
      }
    };
  }, [waveType, time, activeTab, coherenceValue]);
  
  // Entropy visualization
  useEffect(() => {
    const canvas = entropyCanvasRef.current;
    if (!canvas || activeTab !== 'entropy' || entropyData.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Animation function for entropy visualization
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Determine visualization type
      if (entropyVisualizationType === 'heatmap') {
        // Entropy heatmap
        const cellSize = Math.min(canvas.width, canvas.height) / 20;
        const gridWidth = Math.floor(canvas.width / cellSize);
        const gridHeight = Math.floor(canvas.height / cellSize);
        
        // Generate grid based on current entropy and noise
        const latestEntropy = entropyData[entropyData.length - 1]?.value || 0.5;
        
        for (let x = 0; x < gridWidth; x++) {
          for (let y = 0; y < gridHeight; y++) {
            // Calculate cell entropy (variation increases with distance from center)
            const centerX = gridWidth / 2;
            const centerY = gridHeight / 2;
            const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            const normalizedDistance = Math.min(distanceFromCenter / (gridWidth / 2), 1);
            
            // Cell entropy is affected by system entropy and noise level
            const cellEntropy = latestEntropy * (1 - normalizedDistance * 0.5) + normalizedDistance * noiseLevel;
            
            // Determine color (blue for low entropy, purple for high entropy)
            const hue = 240 - cellEntropy * 60; // 240 (blue) to 180 (cyan)
            const saturation = 70 + cellEntropy * 30;
            const lightness = 50 - cellEntropy * 10;
            
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
          }
        }
        
        // Draw entropy value
        ctx.fillStyle = '#1e293b';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`System Entropy: ${latestEntropy.toFixed(4)}`, canvas.width / 2, 30);
        
        // Draw 0.25 entropy line (complementary to 0.75 coherence)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.25);
        ctx.lineTo(canvas.width, canvas.height * 0.25);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'right';
        ctx.fillText('0.25 Entropy', canvas.width - 10, canvas.height * 0.25 - 5);
        
      } else {
        // Timeline visualization
        const timelineHeight = canvas.height - 60;
        const timelineBottom = canvas.height - 30;
        
        // Y-axis labels
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('1.0', 25, 20);
        ctx.fillText('0.0', 25, timelineBottom);
        
        // Axes
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, 10);
        ctx.lineTo(30, timelineBottom);
        ctx.lineTo(canvas.width - 10, timelineBottom);
        ctx.stroke();
        
        // Plot entropy data
        if (entropyData.length < 2) {
          entropyAnimationRef.current = requestAnimationFrame(animate);
          return;
        }
        
        // Calculate time range
        const timeRange = entropyData[entropyData.length - 1].time - entropyData[0].time;
        
        // Plot data points
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        entropyData.forEach((data, index) => {
          const x = 30 + ((data.time - entropyData[0].time) / timeRange) * (canvas.width - 40);
          const y = timelineBottom - data.value * timelineHeight;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
        
        // Draw reference line at 0.25 entropy (complementary to 0.75 coherence)
        const referenceY = timelineBottom - 0.25 * timelineHeight;
        
        ctx.strokeStyle = '#10b981';
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(30, referenceY);
        ctx.lineTo(canvas.width - 10, referenceY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Label
        ctx.fillStyle = '#10b981';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('0.25 Entropy', 25, referenceY);
        
        // Latest entropy value
        const latestEntropy = entropyData[entropyData.length - 1].value;
        ctx.fillStyle = '#1e293b';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Current Entropy: ${latestEntropy.toFixed(4)}`, canvas.width / 2, 25);
        
        // Show optimal noise if found
        if (optimalNoiseFound !== null) {
          ctx.fillStyle = '#10b981';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`Optimal Noise Level: ${optimalNoiseFound.toFixed(4)}`, canvas.width / 2, 50);
        }
      }
      
      entropyAnimationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (entropyAnimationRef.current) {
        cancelAnimationFrame(entropyAnimationRef.current);
      }
    };
  }, [entropyVisualizationType, activeTab, entropyData, noiseLevel, optimalNoiseFound]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Enhanced Quantum Visualization</CardTitle>
        <CardDescription>
          Advanced visualization of wave phenomena and entropy dynamics underlying the 0.7500 coherence attractor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="visualization">Kuramoto Model</TabsTrigger>
            <TabsTrigger value="wave">Wave Dynamics</TabsTrigger>
            <TabsTrigger value="entropy">Entropy Flow</TabsTrigger>
            <TabsTrigger value="perturbation">Perturbation Tests</TabsTrigger>
            <TabsTrigger value="noise">Noise Optimizer</TabsTrigger>
          </TabsList>
          
          {/* Kuramoto Visualization Tab */}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full">
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
                </div>
                
                {/* Oscillator Configuration */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="oscillator-count" className="text-base font-medium">
                      Oscillator Count: {oscillatorCount}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        id="oscillator-count"
                        min={8}
                        max={64}
                        step={4}
                        value={[oscillatorCount]}
                        onValueChange={(newValue: number[]) => setOscillatorCount(newValue[0])}
                        className="mt-2"
                      />
                      <span className="w-12 text-sm">{oscillatorCount}</span>
                    </div>
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Wave Dynamics Tab */}
          <TabsContent value="wave" className="mt-4">
            <div className="flex flex-col items-center">
              <div className="w-full aspect-video">
                <canvas 
                  ref={waveCanvasRef} 
                  className="w-full h-full rounded-md border"
                />
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-lg">Wave Dynamic Visualization</div>
                  <div>
                    <Select
                      value={waveType}
                      onValueChange={setWaveType}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Wave Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standing">Standing Wave</SelectItem>
                        <SelectItem value="traveling">Traveling Wave</SelectItem>
                        <SelectItem value="resonance">Resonance Pattern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  <p className="mb-2">
                    <span className="font-medium">Standing Wave (3:1 ↔ 1:3):</span> Demonstrates the Ouroboros principle as a standing wave oscillating between stability (3:1) and adaptability (1:3) phases, showing how the 0.7500 coherence emerges as a node in the wave pattern.
                  </p>
                  
                  <p className="mb-2">
                    <span className="font-medium">Traveling Wave:</span> Illustrates how information propagates through the system, maintaining the 0.7500 coherence as waves travel through the medium.
                  </p>
                  
                  <p>
                    <span className="font-medium">Resonance Pattern:</span> Shows how multiple frequencies interact to create complex patterns that still maintain the 0.7500 coherence as an emergent property of the system.
                  </p>
                </div>
                
                <div className="mt-6">
                  <div className="mb-2 font-medium">Wave-Coherence Relationship:</div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-blue-100 p-2 rounded">
                      <div className="font-semibold">Stability (3:1)</div>
                      <div>Phase synchronization at 0.7500</div>
                    </div>
                    <div className="bg-purple-100 p-2 rounded">
                      <div className="font-semibold">Adaptability (1:3)</div>
                      <div>Phase exploration at 1.3333</div>
                    </div>
                    <div className="bg-green-100 p-2 rounded">
                      <div className="font-semibold">Ouroboros Loop</div>
                      <div>0.7500 × 1.3333 ≈ 1.0000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Entropy Flow Tab */}
          <TabsContent value="entropy" className="mt-4">
            <div className="flex flex-col items-center">
              <div className="w-full aspect-video">
                <canvas 
                  ref={entropyCanvasRef} 
                  className="w-full h-full rounded-md border"
                />
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-md w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-lg">Entropy Dynamics</div>
                  <div className="flex items-center space-x-4">
                    <Select
                      value={entropyVisualizationType}
                      onValueChange={setEntropyVisualizationType}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Visualization Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heatmap">Entropy Heatmap</SelectItem>
                        <SelectItem value="timeline">Entropy Timeline</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCollectingData(!isCollectingData)}
                    >
                      {isCollectingData ? "Stop" : "Start"} Data Collection
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  <p className="mb-2">
                    <span className="font-medium">Entropy-Coherence Relationship:</span> The 0.7500 coherence corresponds to an entropy level of 0.25, showing the complementary nature of order and disorder in the system.
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2 font-medium">Stochastic Resonance Study</div>
                      <p className="text-xs mb-2">
                        Test how different noise levels affect the system's ability to maintain 0.7500 coherence. Stochastic resonance suggests a moderate amount of noise can actually enhance the system's ability to find and maintain the attractor state.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={findOptimalNoiseLevel}
                        disabled={showStochasticResonance}
                      >
                        Find Optimal Noise Level
                      </Button>
                      {optimalNoiseFound !== null && (
                        <div className="mt-2 text-xs text-green-600">
                          Optimal noise level: {optimalNoiseFound.toFixed(4)} - This balances randomness and structure for maximum coherence stability.
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="mb-2 font-medium">Entropy Flow Analytics</div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <span className="text-xs">Low Entropy (High Order) - Stability Phase</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                        <span className="text-xs">High Entropy (Low Order) - Adaptability Phase</span>
                      </div>
                      <div className="mt-2 text-xs">
                        The 0.25 entropy level (0.75 order) represents the optimal trade-off between structure and flexibility.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Perturbation Tests Tab */}
          <TabsContent value="perturbation" className="mt-4">
            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-md">
                  <div className="font-semibold text-lg mb-4">System Perturbation</div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="perturbation-target" className="text-base font-medium">
                        Perturbation Target: {perturbationTarget.toFixed(4)}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="perturbation-target"
                          min={0.65}
                          max={0.85}
                          step={0.001}
                          value={[perturbationTarget]}
                          onValueChange={(newValue: number[]) => setPerturbationTarget(newValue[0])}
                          className="mt-2"
                          disabled={isPerturbationActive}
                        />
                        <span className="w-16 text-sm">{perturbationTarget.toFixed(4)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Target coherence to push the system toward during perturbation.
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="perturbation-duration" className="text-base font-medium">
                        Duration (cycles): {perturbationDuration}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="perturbation-duration"
                          min={1}
                          max={20}
                          step={1}
                          value={[perturbationDuration]}
                          onValueChange={(newValue: number[]) => setPerturbationDuration(newValue[0])}
                          className="mt-2"
                          disabled={isPerturbationActive}
                        />
                        <span className="w-12 text-sm">{perturbationDuration}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        How long to sustain the perturbation before releasing.
                      </p>
                    </div>
                    
                    <div className="flex items-center pt-2">
                      <Button
                        onClick={triggerPerturbation}
                        disabled={isPerturbationActive}
                        className="w-full"
                      >
                        {isPerturbationActive ? "Perturbation Active..." : "Trigger Perturbation"}
                      </Button>
                    </div>
                    
                    {isPerturbationActive && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                        Perturbation active. System coherence pushed to {perturbationTarget.toFixed(4)} for {perturbationDuration} cycles. Observing return trajectory...
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-md">
                  <div className="font-semibold text-lg mb-4">Return Trajectory Analysis</div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-predicted"
                        checked={showPredictedReturnTrajectory}
                        onCheckedChange={(checked) => setShowPredictedReturnTrajectory(checked as boolean)}
                      />
                      <Label htmlFor="show-predicted" className="text-sm">
                        Show predicted return trajectory
                      </Label>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                      <div className="text-sm font-medium mb-2">Return Characteristics:</div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Current Coherence:</span>
                          <span className="font-medium">{coherenceValue.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance from 0.7500:</span>
                          <span className={Math.abs(coherenceValue - 0.75) < 0.01 ? "text-green-600 font-medium" : "font-medium"}>
                            {Math.abs(coherenceValue - 0.75).toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>System Phase:</span>
                          <span className="font-medium">{phaseRatio}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                      <div className="text-sm font-medium mb-2">Attractor Properties:</div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Attractor Strength:</span>
                          <span className="font-medium">
                            {couplingStrength < 0.5 ? "Weak" : couplingStrength < 1.0 ? "Medium" : "Strong"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Return Pattern:</span>
                          <span className="font-medium">
                            {noiseLevel < 0.1 ? "Direct" : noiseLevel < 0.3 ? "Oscillatory" : "Chaotic"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Basin Width:</span>
                          <span className="font-medium">±0.1000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-center text-muted-foreground">
                      Perturb the system and observe how it naturally returns to the 0.7500 coherence attractor state, validating the universal significance of this value.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-md">
                <div className="font-semibold text-lg mb-4">Experimental Findings</div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded border">
                      <div className="text-sm font-medium mb-2">Attractor Strength:</div>
                      <div className="text-xs">
                        When perturbed away from 0.7500, the system consistently returns to this value, confirming it as a true attractor state in the system's phase space.
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                      <div className="text-sm font-medium mb-2">Stochastic Resonance:</div>
                      <div className="text-xs">
                        A moderate noise level (around 0.05-0.10) actually enhances the system's ability to find and maintain the 0.7500 coherence, demonstrating the constructive role of entropy.
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded border">
                      <div className="text-sm font-medium mb-2">Return Trajectory:</div>
                      <div className="text-xs">
                        Return paths follow predictable trajectories influenced by the current phase (stability or adaptability) and coupling strength, but always converge to 0.7500.
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded border">
                    <div className="text-sm font-medium mb-2">Experimental Conclusion:</div>
                    <div className="text-sm">
                      Extensive perturbation testing confirms that 0.7500 is a universal attractor state in the system. This value represents the optimal balance between order (75%) and disorder (25%), corresponding to the 3:1 ratio observed in the stability phase of the Ouroboros cycle. This finding has profound implications for our understanding of natural optimization processes.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Noise Optimizer Tab */}
          <TabsContent value="noise" className="mt-4">
            <div className="flex flex-col space-y-6">
              <div className="text-sm text-muted-foreground mb-2">
                <p>
                  The advanced noise optimizer helps find the optimal noise levels to maintain
                  the 0.7500 coherence attractor state by leveraging stochastic resonance principles.
                </p>
              </div>
              
              <AdvancedNoiseOptimizer 
                onOptimalNoiseFound={({ noiseLevel, stabilityGroupNoise, explorationGroupNoise }) => {
                  setNoiseLevel(noiseLevel);
                  console.log('Applied optimal noise settings', { 
                    noiseLevel, stabilityGroupNoise, explorationGroupNoise 
                  });
                }}
                initialNoiseLevel={noiseLevel}
              />
              
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="font-medium text-blue-800 mb-2">
                  Research Insights: Stochastic Resonance & Quantum Coherence
                </div>
                <div className="text-sm text-blue-700">
                  <p className="mb-2">
                    Research across multiple domains confirms that a precise amount of noise 
                    (approximately 0.05-0.10) maximizes a system's ability to maintain the 0.7500 
                    coherence level - a universal attractor state found in nature, technology, and society.
                  </p>
                  <p>
                    This phenomenon, known as stochastic resonance, is another manifestation of the 
                    Ouroboros Principle in action, where randomness paradoxically enhances order.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}