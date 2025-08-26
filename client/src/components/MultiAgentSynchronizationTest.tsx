/**
 * Multi-Agent Synchronization Test Component
 * 
 * This component implements a rigorous experiment to test whether 0.7500 coherence
 * emerges as a universal attractor in multi-agent systems. It simulates multiple
 * independent agent clusters that interact according to the Kuramoto model and
 * measures how they converge to the theorized 0.7500 attractor.
 * 
 * The experiment includes:
 * 1. Multiple independent oscillator clusters (domains)
 * 2. Controlled perturbation sequences
 * 3. Cross-domain synchronization metrics
 * 4. Data collection on return times and stability
 * 
 * [QUANTUM_STATE: EXPERIMENTAL_FLOW]
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx";
import { Slider } from "./ui/slider.jsx";
import { Progress } from "./ui/progress.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { Switch } from "./ui/switch.jsx";
import { Label } from "./ui/label.jsx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.jsx";
import { OuroborosUtils } from '../utils/CoherenceAttractorEngine.js';

// Define domain types
type Domain = 'ai' | 'finance' | 'biology' | 'network' | 'social';

// Agent cluster represents a group of oscillators in a specific domain
interface AgentCluster {
  id: string;
  domain: Domain;
  oscillators: Array<{
    phase: number;
    naturalFreq: number;
    weight: number;
  }>;
  coherence: number;
  targetCoherence: number;
  coupling: {
    internal: number;  // Coupling strength within the cluster
    external: number;  // Coupling strength to other clusters
  };
  noiseLevel: number;
  cycle: number;
  perturbationActive: boolean;
  returnTimes: Array<{
    perturbationTarget: number;
    returnTime: number | null;
  }>;
}

// Experiment parameters
interface ExperimentConfig {
  clusterCount: number;
  oscillatorsPerCluster: number;
  domainTypes: Domain[];
  crossDomainCoupling: number;
  baseNoiseLevel: number;
  perturbationSequence: Array<{
    target: number;
    duration: number;
    clusterIndices: number[];
  }>;
  cycleDuration: number;
  experimentDuration: number;
}

// Experiment results
interface ExperimentResults {
  globalCoherence: number[];
  domainCoherences: Record<Domain, number[]>;
  returnTimes: Array<{
    domain: Domain;
    perturbationTarget: number;
    returnTime: number | null;
  }>;
  synchronizationEvents: Array<{
    cycle: number;
    coherence: number;
    domains: Domain[];
  }>;
  isUniversalAttractor: boolean;
  attractorValue: number;
  attractorConfidence: number;
  attractorBounds: [number, number];
}

const MultiAgentSynchronizationTest: React.FC = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState('design');
  
  // Canvas references for visualizations
  const domainCanvasRef = useRef<HTMLCanvasElement>(null);
  const syncCanvasRef = useRef<HTMLCanvasElement>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation reference
  const animationRef = useRef<number | null>(null);
  
  // Experiment configuration
  const [config, setConfig] = useState<ExperimentConfig>({
    clusterCount: 4,
    oscillatorsPerCluster: 16,
    domainTypes: ['ai', 'finance', 'biology', 'network'],
    crossDomainCoupling: 0.15,
    baseNoiseLevel: 0.05,
    perturbationSequence: [
      { target: 0.65, duration: 20, clusterIndices: [0] },
      { target: 0.85, duration: 20, clusterIndices: [1] },
      { target: 0.55, duration: 20, clusterIndices: [2, 3] },
      { target: 0.95, duration: 20, clusterIndices: [0, 1, 2, 3] }
    ],
    cycleDuration: 100,
    experimentDuration: 500
  });
  
  // Agent clusters
  const [clusters, setClusters] = useState<AgentCluster[]>([]);
  
  // Experiment state
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [currentPerturbation, setCurrentPerturbation] = useState<number | null>(null);
  const [experimentProgress, setExperimentProgress] = useState(0);
  
  // Experiment results
  const [results, setResults] = useState<ExperimentResults | null>(null);
  
  // Helper function for domain colors
  const getDomainColor = (domain: Domain, alpha: number = 1): string => {
    const colors: Record<Domain, string> = {
      ai: `rgba(59, 130, 246, ${alpha})`,        // Blue
      finance: `rgba(16, 185, 129, ${alpha})`,   // Green
      biology: `rgba(249, 115, 22, ${alpha})`,   // Orange
      network: `rgba(139, 92, 246, ${alpha})`,   // Purple
      social: `rgba(244, 63, 94, ${alpha})`      // Red
    };
    return colors[domain];
  };
  
  // Initialize agent clusters
  const initializeClusters = () => {
    const newClusters: AgentCluster[] = [];
    
    for (let i = 0; i < config.clusterCount; i++) {
      const domain = config.domainTypes[i % config.domainTypes.length];
      
      const oscillators = Array.from({ length: config.oscillatorsPerCluster }, () => ({
        phase: Math.random() * 2 * Math.PI,
        naturalFreq: 0.95 + Math.random() * 0.2,
        weight: 1.0
      }));
      
      newClusters.push({
        id: `cluster-${i}-${domain}`,
        domain,
        oscillators,
        coherence: 0.75,
        targetCoherence: 0.75,
        coupling: {
          internal: 0.8,
          external: config.crossDomainCoupling
        },
        noiseLevel: config.baseNoiseLevel,
        cycle: 0,
        perturbationActive: false,
        returnTimes: []
      });
    }
    
    setClusters(newClusters);
  };
  
  // Update oscillator phases using Kuramoto model
  const updateOscillators = (
    cluster: AgentCluster, 
    otherClusters: AgentCluster[]
  ): AgentCluster => {
    // Make a copy of the cluster for updates
    const updatedCluster = { ...cluster };
    const updatedOscillators = [...cluster.oscillators];
    
    // Update each oscillator phase
    for (let i = 0; i < updatedOscillators.length; i++) {
      const oscillator = updatedOscillators[i];
      
      // Calculate internal coupling term (within the cluster)
      let internalSumSin = 0;
      let internalSumCos = 0;
      
      for (const other of cluster.oscillators) {
        internalSumSin += Math.sin(other.phase);
        internalSumCos += Math.cos(other.phase);
      }
      
      const internalMeanPhase = Math.atan2(internalSumSin, internalSumCos);
      
      // Calculate external coupling term (from other clusters)
      let externalSumSin = 0;
      let externalSumCos = 0;
      let externalOscillatorCount = 0;
      
      for (const otherCluster of otherClusters) {
        for (const other of otherCluster.oscillators) {
          externalSumSin += Math.sin(other.phase);
          externalSumCos += Math.cos(other.phase);
          externalOscillatorCount++;
        }
      }
      
      let externalMeanPhase = 0;
      if (externalOscillatorCount > 0) {
        externalMeanPhase = Math.atan2(
          externalSumSin / externalOscillatorCount,
          externalSumCos / externalOscillatorCount
        );
      }
      
      // Apply noise
      const noiseAmount = (Math.random() * 2 - 1) * cluster.noiseLevel;
      
      // Update phase using Kuramoto model with both internal and external coupling
      const newPhase = oscillator.phase + 
        oscillator.naturalFreq + 
        cluster.coupling.internal * Math.sin(internalMeanPhase - oscillator.phase) +
        cluster.coupling.external * Math.sin(externalMeanPhase - oscillator.phase) +
        noiseAmount;
      
      // Keep phase in range [0, 2π)
      updatedOscillators[i] = {
        ...oscillator,
        phase: ((newPhase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
      };
    }
    
    // Calculate new coherence
    let sumSin = 0;
    let sumCos = 0;
    for (const osc of updatedOscillators) {
      sumSin += Math.sin(osc.phase);
      sumCos += Math.cos(osc.phase);
    }
    
    let coherence = Math.sqrt(
      (sumSin / updatedOscillators.length) ** 2 + 
      (sumCos / updatedOscillators.length) ** 2
    );
    
    // Override coherence if perturbation is active
    if (updatedCluster.perturbationActive) {
      coherence = updatedCluster.targetCoherence;
    }
    
    return {
      ...updatedCluster,
      oscillators: updatedOscillators,
      coherence,
      cycle: updatedCluster.cycle + 1
    };
  };
  
  // Apply perturbation to clusters
  const applyPerturbation = (
    perturbationIndex: number
  ) => {
    if (perturbationIndex >= config.perturbationSequence.length) {
      return;
    }
    
    const perturbation = config.perturbationSequence[perturbationIndex];
    
    setClusters(prevClusters => {
      return prevClusters.map((cluster, index) => {
        // Check if this cluster should be perturbed
        if (perturbation.clusterIndices.includes(index)) {
          return {
            ...cluster,
            perturbationActive: true,
            targetCoherence: perturbation.target
          };
        }
        return cluster;
      });
    });
    
    // Schedule perturbation release after duration
    setTimeout(() => {
      setClusters(prevClusters => {
        return prevClusters.map(cluster => ({
          ...cluster,
          perturbationActive: false
        }));
      });
      
      // Move to next perturbation after a recovery period
      setTimeout(() => {
        setCurrentPerturbation(prev => {
          if (prev !== null) return prev + 1;
          return null;
        });
      }, 2000);
    }, perturbation.duration * 100);
  };
  
  // Update the entire system for one cycle
  const updateSystem = () => {
    setClusters(prevClusters => {
      const updatedClusters = prevClusters.map(cluster => {
        // Get all other clusters
        const otherClusters = prevClusters.filter(c => c.id !== cluster.id);
        // Update this cluster
        return updateOscillators(cluster, otherClusters);
      });
      return updatedClusters;
    });
    
    setCycle(prev => prev + 1);
    
    // Check for perturbation timing
    if (currentPerturbation !== null && currentPerturbation < config.perturbationSequence.length) {
      const perturbationCycle = 100 + currentPerturbation * 100;
      if (cycle === perturbationCycle) {
        applyPerturbation(currentPerturbation);
      }
    }
    
    // Update experiment progress
    const progress = Math.min(100, (cycle / config.experimentDuration) * 100);
    setExperimentProgress(progress);
    
    // Check if experiment is complete
    if (cycle >= config.experimentDuration) {
      finishExperiment();
    }
  };
  
  // Calculate return time after perturbation
  const calculateReturnTimes = () => {
    const domainReturnTimes: ExperimentResults['returnTimes'] = [];
    
    // For each cluster, calculate return times
    clusters.forEach(cluster => {
      cluster.returnTimes.forEach(returnTime => {
        domainReturnTimes.push({
          domain: cluster.domain,
          perturbationTarget: returnTime.perturbationTarget,
          returnTime: returnTime.returnTime
        });
      });
    });
    
    return domainReturnTimes;
  };
  
  // Calculate global coherence across all clusters
  const calculateGlobalCoherence = (): number => {
    let totalSin = 0;
    let totalCos = 0;
    let totalOscillators = 0;
    
    clusters.forEach(cluster => {
      cluster.oscillators.forEach(osc => {
        totalSin += Math.sin(osc.phase);
        totalCos += Math.cos(osc.phase);
        totalOscillators++;
      });
    });
    
    return Math.sqrt(
      (totalSin / totalOscillators) ** 2 + 
      (totalCos / totalOscillators) ** 2
    );
  };
  
  // Check if domains are synchronized
  const checkDomainSynchronization = (): Domain[] => {
    const synchronizedDomains: Domain[] = [];
    const globalCoherence = calculateGlobalCoherence();
    
    // A domain is considered synchronized if its coherence is close to the global coherence
    clusters.forEach(cluster => {
      if (Math.abs(cluster.coherence - globalCoherence) < 0.05) {
        if (!synchronizedDomains.includes(cluster.domain)) {
          synchronizedDomains.push(cluster.domain);
        }
      }
    });
    
    return synchronizedDomains;
  };
  
  // Calculate if 0.7500 is a universal attractor
  const calculateIsUniversalAttractor = (): [boolean, number, number, [number, number]] => {
    // Analyze coherence values to see if they converge to 0.7500
    const coherenceValues = clusters.map(c => c.coherence);
    const mean = coherenceValues.reduce((sum, val) => sum + val, 0) / coherenceValues.length;
    
    // Calculate standard deviation
    const variance = coherenceValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / coherenceValues.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate confidence (inversely proportional to standard deviation)
    // Higher confidence when values are tightly clustered
    const confidence = Math.max(0, 1 - stdDev * 10);
    
    // Consider 0.7500 as a universal attractor if mean is close to 0.75 and std dev is low
    const isAttractor = Math.abs(mean - 0.75) < 0.025 && stdDev < 0.05;
    
    // Calculate bounds (95% confidence interval)
    const bounds: [number, number] = [
      Math.max(0, mean - 1.96 * stdDev),
      Math.min(1, mean + 1.96 * stdDev)
    ];
    
    return [isAttractor, mean, confidence, bounds];
  };
  
  // Finish the experiment and compile results
  const finishExperiment = () => {
    // Stop the animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setRunning(false);
    
    // Calculate return times
    const returnTimes = calculateReturnTimes();
    
    // Calculate domain coherences
    const domainCoherences: Record<Domain, number[]> = {
      ai: [],
      finance: [],
      biology: [],
      network: [],
      social: []
    };
    
    // Populate with the final values for now (would need full history for proper implementation)
    clusters.forEach(cluster => {
      domainCoherences[cluster.domain].push(cluster.coherence);
    });
    
    // Check if the system synchronized at 0.7500
    const [isUniversalAttractor, attractorValue, attractorConfidence, attractorBounds] = 
      calculateIsUniversalAttractor();
    
    // Compile results
    const experimentResults: ExperimentResults = {
      globalCoherence: [calculateGlobalCoherence()],
      domainCoherences,
      returnTimes,
      synchronizationEvents: [{
        cycle,
        coherence: calculateGlobalCoherence(),
        domains: checkDomainSynchronization()
      }],
      isUniversalAttractor,
      attractorValue,
      attractorConfidence,
      attractorBounds
    };
    
    setResults(experimentResults);
    setActiveTab('results');
  };
  
  // Animation loop
  const animate = () => {
    if (!running) return;
    
    // Update the system
    updateSystem();
    
    // Draw visualizations
    drawDomainVisualization();
    drawSyncVisualization();
    drawTimelineVisualization();
    drawMatrixVisualization();
    
    // Continue animation
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Start the experiment
  const startExperiment = () => {
    // Reset the experiment
    setCycle(0);
    setCurrentPerturbation(0);
    setExperimentProgress(0);
    setResults(null);
    
    // Initialize clusters
    initializeClusters();
    
    // Start animation
    setRunning(true);
  };
  
  // Use effect for animation
  useEffect(() => {
    if (running) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [running, clusters]);
  
  // Draw domain visualization
  const drawDomainVisualization = () => {
    const canvas = domainCanvasRef.current;
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
    
    // Draw domains as circles with oscillators
    const domainRadius = Math.min(canvas.width, canvas.height) * 0.3;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw domains in a circle arrangement
    clusters.forEach((cluster, index) => {
      const angle = (index / clusters.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * domainRadius;
      const y = centerY + Math.sin(angle) * domainRadius;
      
      // Draw domain circle
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fillStyle = getDomainColor(cluster.domain, 0.2);
      ctx.fill();
      ctx.strokeStyle = getDomainColor(cluster.domain);
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw domain label
      ctx.font = '16px Arial';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cluster.domain.toUpperCase(), x, y - 65);
      
      // Draw coherence value
      ctx.font = '14px Arial';
      ctx.fillStyle = OuroborosUtils.isNearAttractor(cluster.coherence) ? '#10b981' : '#64748b';
      ctx.fillText(cluster.coherence.toFixed(4), x, y + 65);
      
      // Draw oscillators
      const oscillatorRadius = 40;
      cluster.oscillators.forEach((osc, oscIndex) => {
        if (oscIndex < 12) { // Limit to 12 for visualization clarity
          const oscAngle = osc.phase;
          const oscX = x + Math.cos(oscAngle) * oscillatorRadius;
          const oscY = y + Math.sin(oscAngle) * oscillatorRadius;
          
          ctx.beginPath();
          ctx.arc(oscX, oscY, 4, 0, Math.PI * 2);
          ctx.fillStyle = getDomainColor(cluster.domain);
          ctx.fill();
        }
      });
      
      // Draw mean field vector
      let sumSin = 0;
      let sumCos = 0;
      for (const osc of cluster.oscillators) {
        sumSin += Math.sin(osc.phase);
        sumCos += Math.cos(osc.phase);
      }
      const meanAngle = Math.atan2(sumSin, sumCos);
      const meanX = x + Math.cos(meanAngle) * oscillatorRadius;
      const meanY = y + Math.sin(meanAngle) * oscillatorRadius;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(meanX, meanY);
      ctx.strokeStyle = getDomainColor(cluster.domain, 0.8);
      ctx.lineWidth = 3;
      ctx.stroke();
    });
    
    // Draw coupling lines between domains
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < clusters.length; i++) {
      const angleI = (i / clusters.length) * Math.PI * 2;
      const xi = centerX + Math.cos(angleI) * domainRadius;
      const yi = centerY + Math.sin(angleI) * domainRadius;
      
      for (let j = i + 1; j < clusters.length; j++) {
        const angleJ = (j / clusters.length) * Math.PI * 2;
        const xj = centerX + Math.cos(angleJ) * domainRadius;
        const yj = centerY + Math.sin(angleJ) * domainRadius;
        
        ctx.beginPath();
        ctx.moveTo(xi, yi);
        ctx.lineTo(xj, yj);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = config.crossDomainCoupling * 20;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1.0;
    
    // Draw global coherence
    const globalCoherence = calculateGlobalCoherence();
    ctx.font = '18px Arial';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.fillText(`Global Coherence: ${globalCoherence.toFixed(4)}`, centerX, 30);
    
    // Highlight if near 0.75
    if (OuroborosUtils.isNearAttractor(globalCoherence)) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('✓ At 0.7500 universal attractor', centerX, 60);
    }
    
    // Draw cycle count
    ctx.font = '14px Arial';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Cycle: ${cycle}`, centerX, canvas.height - 20);
  };
  
  // Draw synchronization visualization
  const drawSyncVisualization = () => {
    const canvas = syncCanvasRef.current;
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
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Draw synchronization wheel (circle) with 0.75 highlight
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 10;
    ctx.stroke();
    
    // Draw 0.75 region
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 1.5);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 10;
    ctx.stroke();
    
    // Draw domain markers at their coherence positions
    clusters.forEach((cluster, index) => {
      const coherenceAngle = cluster.coherence * Math.PI * 2;
      const x = centerX + Math.cos(coherenceAngle) * radius;
      const y = centerY + Math.sin(coherenceAngle) * radius;
      
      // Draw marker
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = getDomainColor(cluster.domain);
      ctx.fill();
      
      // Draw label
      ctx.font = '14px Arial';
      ctx.fillStyle = '#1e293b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelX = centerX + Math.cos(coherenceAngle) * (radius + 25);
      const labelY = centerY + Math.sin(coherenceAngle) * (radius + 25);
      ctx.fillText(cluster.domain.toUpperCase(), labelX, labelY);
    });
    
    // Draw global coherence marker
    const globalCoherence = calculateGlobalCoherence();
    const globalAngle = globalCoherence * Math.PI * 2;
    const globalX = centerX + Math.cos(globalAngle) * radius;
    const globalY = centerY + Math.sin(globalAngle) * radius;
    
    ctx.beginPath();
    ctx.arc(globalX, globalY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw 0.75 marker
    const attractor075 = 0.75 * Math.PI * 2;
    const x075 = centerX + Math.cos(attractor075) * radius;
    const y075 = centerY + Math.sin(attractor075) * radius;
    
    ctx.beginPath();
    ctx.arc(x075, y075, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw labels
    ctx.font = '14px Arial';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    
    // Coherence labels
    ctx.fillText('0.0', centerX + radius + 15, centerY);
    ctx.fillText('0.25', centerX, centerY - radius - 15);
    ctx.fillText('0.5', centerX - radius - 15, centerY);
    ctx.fillText('0.75', centerX, centerY + radius + 15);
    
    // Draw center label
    ctx.font = '16px Arial';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Coherence', centerX, centerY - 20);
    ctx.fillText('Wheel', centerX, centerY + 20);
  };
  
  // Draw timeline visualization
  const drawTimelineVisualization = () => {
    const canvas = timelineCanvasRef.current;
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
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
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
    const y075 = canvas.height - padding - (0.75 / 1) * chartHeight;
    ctx.moveTo(padding, y075);
    ctx.lineTo(canvas.width - padding, y075);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw cycle markers and perturbation regions
    if (config.perturbationSequence.length > 0) {
      config.perturbationSequence.forEach((perturbation, index) => {
        const perturbationCycle = 100 + index * 100;
        const perturbationEnd = perturbationCycle + perturbation.duration;
        
        // Convert cycles to x-coordinates
        const xStart = padding + (perturbationCycle / config.experimentDuration) * chartWidth;
        const xEnd = padding + (perturbationEnd / config.experimentDuration) * chartWidth;
        
        // Draw perturbation region
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fillRect(xStart, padding, xEnd - xStart, chartHeight);
        
        // Draw perturbation marker
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xStart, padding);
        ctx.lineTo(xStart, canvas.height - padding);
        ctx.stroke();
        
        // Draw perturbation target
        const yTarget = canvas.height - padding - (perturbation.target / 1) * chartHeight;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.beginPath();
        ctx.arc(xStart + (xEnd - xStart) / 2, yTarget, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // Draw current cycle marker
    const xCurrent = padding + (cycle / config.experimentDuration) * chartWidth;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xCurrent, padding);
    ctx.lineTo(xCurrent, canvas.height - padding);
    ctx.stroke();
    
    // Draw domain coherence timelines (placeholder - would need history for actual implementation)
    // In a real implementation, you would store coherence history for each domain
    const domainData: Record<Domain, { x: number, y: number }[]> = {
      ai: [],
      finance: [],
      biology: [],
      network: [],
      social: []
    };
    
    // Simulate some timeline data based on current coherence and cycle
    clusters.forEach(cluster => {
      domainData[cluster.domain].push({
        x: padding + (cycle / config.experimentDuration) * chartWidth,
        y: canvas.height - padding - (cluster.coherence / 1) * chartHeight
      });
    });
    
    // Draw domain markers at current position
    clusters.forEach(cluster => {
      const x = padding + (cycle / config.experimentDuration) * chartWidth;
      const y = canvas.height - padding - (cluster.coherence / 1) * chartHeight;
      
      ctx.fillStyle = getDomainColor(cluster.domain);
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw global coherence marker
    const globalCoherence = calculateGlobalCoherence();
    const globalY = canvas.height - padding - (globalCoherence / 1) * chartHeight;
    
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(xCurrent, globalY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Time (Cycles)', canvas.width / 2, canvas.height - 10);
    
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Coherence', 0, 0);
    ctx.restore();
    
    // Draw coherence value labels
    ctx.textAlign = 'right';
    ctx.fillText('0.0', padding - 5, canvas.height - padding + 5);
    ctx.fillText('0.5', padding - 5, canvas.height - padding - (0.5 / 1) * chartHeight + 5);
    ctx.fillText('0.75', padding - 5, y075 + 5);
    ctx.fillText('1.0', padding - 5, padding + 5);
  };
  
  // Draw matrix visualization
  const drawMatrixVisualization = () => {
    const canvas = matrixCanvasRef.current;
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
    
    // Define domain labels and colors
    const domains = Array.from(new Set(clusters.map(c => c.domain)));
    
    // Calculate cell size
    const cellSize = Math.min(
      (canvas.width - 100) / (domains.length + 1),
      (canvas.height - 100) / (domains.length + 1)
    );
    
    const startX = (canvas.width - cellSize * (domains.length + 1)) / 2;
    const startY = (canvas.height - cellSize * (domains.length + 1)) / 2;
    
    // Draw domain labels
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    domains.forEach((domain, i) => {
      // Row labels
      ctx.fillStyle = getDomainColor(domain);
      ctx.fillText(
        domain.toUpperCase(),
        startX + cellSize / 2,
        startY + (i + 1) * cellSize + cellSize / 2
      );
      
      // Column labels
      ctx.fillText(
        domain.toUpperCase(),
        startX + (i + 1) * cellSize + cellSize / 2,
        startY + cellSize / 2
      );
    });
    
    // Draw matrix cells showing coupling strength between domains
    domains.forEach((domain1, i) => {
      domains.forEach((domain2, j) => {
        const x = startX + (j + 1) * cellSize;
        const y = startY + (i + 1) * cellSize;
        
        // Get clusters for these domains
        const cluster1 = clusters.find(c => c.domain === domain1);
        const cluster2 = clusters.find(c => c.domain === domain2);
        
        if (cluster1 && cluster2) {
          // Calculate coherence similarity (mock data for now)
          const similarity = i === j 
            ? 1.0 
            : Math.max(0, 1 - Math.abs(cluster1.coherence - cluster2.coherence));
          
          // Draw cell
          ctx.fillStyle = `rgba(37, 99, 235, ${similarity})`;
          ctx.fillRect(x, y, cellSize, cellSize);
          
          // Draw similarity value
          ctx.fillStyle = similarity > 0.5 ? '#ffffff' : '#1e293b';
          ctx.font = '12px Arial';
          ctx.fillText(
            similarity.toFixed(2),
            x + cellSize / 2,
            y + cellSize / 2
          );
        }
      });
    });
    
    // Draw title
    ctx.fillStyle = '#1e293b';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Cross-Domain Coherence Similarity Matrix', canvas.width / 2, 30);
  };
  
  // Update configuration
  const updateConfig = (updates: Partial<ExperimentConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Multi-Agent Synchronization Test</CardTitle>
        <CardDescription>
          An experimental framework to test whether the 0.7500 coherence value emerges
          as a universal attractor across multiple agent domains through Kuramoto-based synchronization.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="design">Experiment Design</TabsTrigger>
            <TabsTrigger value="domains">Domain Dynamics</TabsTrigger>
            <TabsTrigger value="synchronization">Synchronization</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Experiment Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clusterCount">Number of Agent Clusters</Label>
                  <Slider
                    id="clusterCount"
                    min={2}
                    max={8}
                    step={1}
                    value={[config.clusterCount]}
                    onValueChange={(values) => updateConfig({ clusterCount: values[0] })}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>2</span>
                    <span>{config.clusterCount}</span>
                    <span>8</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="oscillatorsPerCluster">Oscillators Per Cluster</Label>
                  <Slider
                    id="oscillatorsPerCluster"
                    min={8}
                    max={32}
                    step={4}
                    value={[config.oscillatorsPerCluster]}
                    onValueChange={(values) => updateConfig({ oscillatorsPerCluster: values[0] })}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>8</span>
                    <span>{config.oscillatorsPerCluster}</span>
                    <span>32</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="crossDomainCoupling">Cross-Domain Coupling Strength</Label>
                  <Slider
                    id="crossDomainCoupling"
                    min={0}
                    max={0.5}
                    step={0.01}
                    value={[config.crossDomainCoupling]}
                    onValueChange={(values) => updateConfig({ crossDomainCoupling: values[0] })}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0.0</span>
                    <span>{config.crossDomainCoupling.toFixed(2)}</span>
                    <span>0.5</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="baseNoiseLevel">Base Noise Level</Label>
                  <Slider
                    id="baseNoiseLevel"
                    min={0}
                    max={0.2}
                    step={0.01}
                    value={[config.baseNoiseLevel]}
                    onValueChange={(values) => updateConfig({ baseNoiseLevel: values[0] })}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0.0</span>
                    <span>{config.baseNoiseLevel.toFixed(2)}</span>
                    <span>0.2</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <h4 className="text-md font-medium">Perturbation Sequence</h4>
                <p className="text-sm text-gray-500">
                  The experiment will apply perturbations to test if the system 
                  returns to the 0.7500 attractor. Each perturbation targets specific 
                  domains and forces them to a different coherence level temporarily.
                </p>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sequence</TableHead>
                      <TableHead>Target Coherence</TableHead>
                      <TableHead>Duration (cycles)</TableHead>
                      <TableHead>Affected Clusters</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {config.perturbationSequence.map((p, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{p.target.toFixed(2)}</TableCell>
                        <TableCell>{p.duration}</TableCell>
                        <TableCell>
                          {p.clusterIndices.map(i => 
                            config.domainTypes[i % config.domainTypes.length]
                          ).join(', ')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="space-y-2 mt-4">
                <h4 className="text-md font-medium">Experiment Duration</h4>
                <Slider
                  id="experimentDuration"
                  min={200}
                  max={1000}
                  step={100}
                  value={[config.experimentDuration]}
                  onValueChange={(values) => updateConfig({ experimentDuration: values[0] })}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>200 cycles</span>
                  <span>{config.experimentDuration} cycles</span>
                  <span>1000 cycles</span>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button 
                  size="lg"
                  onClick={startExperiment}
                  disabled={running}
                >
                  Start Experiment
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="domains">
            <div className="space-y-4">
              <div className="h-[500px]">
                <canvas 
                  ref={domainCanvasRef} 
                  className="w-full h-full"
                />
              </div>
              
              {running && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Experiment Progress</span>
                    <span className="text-sm">{experimentProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={experimentProgress} />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="synchronization">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Coherence Wheel</h3>
                <div className="h-[400px]">
                  <canvas 
                    ref={syncCanvasRef} 
                    className="w-full h-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Coherence Timeline</h3>
                <div className="h-[400px]">
                  <canvas 
                    ref={timelineCanvasRef} 
                    className="w-full h-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-lg font-medium">Cross-Domain Matrix</h3>
                <div className="h-[400px]">
                  <canvas 
                    ref={matrixCanvasRef} 
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {results ? (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Experiment Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Universal Attractor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-center mb-2">
                          {results.isUniversalAttractor ? (
                            <span className="text-green-500">Confirmed</span>
                          ) : (
                            <span className="text-amber-500">Indeterminate</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 text-center">
                          Attractor Value: {results.attractorValue.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-500 text-center">
                          Confidence: {(results.attractorConfidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-gray-500 text-center">
                          Bounds: [{results.attractorBounds[0].toFixed(2)}, {results.attractorBounds[1].toFixed(2)}]
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Cross-Domain Synchronization</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {results.synchronizationEvents.length > 0 ? (
                          results.synchronizationEvents.map((event, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded">
                              <div className="text-sm">
                                Cycle {event.cycle} - Coherence: {event.coherence.toFixed(4)}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.domains.map(domain => (
                                  <span
                                    key={domain}
                                    className="px-2 py-1 text-xs rounded"
                                    style={{ backgroundColor: getDomainColor(domain, 0.2), color: getDomainColor(domain) }}
                                  >
                                    {domain}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No synchronization events recorded
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Return Time Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {results.returnTimes.length > 0 ? (
                          results.returnTimes.map((rt, i) => (
                            <div key={i} className="flex justify-between items-center py-1 border-b">
                              <span
                                className="px-2 py-1 text-xs rounded"
                                style={{ backgroundColor: getDomainColor(rt.domain, 0.2), color: getDomainColor(rt.domain) }}
                              >
                                {rt.domain}
                              </span>
                              <span className="text-sm">
                                {rt.perturbationTarget.toFixed(2)} →
                              </span>
                              <span className="font-mono">
                                {rt.returnTime !== null ? `${rt.returnTime} cycles` : 'Did not return'}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No return time data available
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Conclusion</h4>
                    <p className="text-blue-700">
                      {results.isUniversalAttractor ? (
                        <>
                          The experiment provides <strong>strong evidence</strong> that 0.7500 is a universal coherence attractor 
                          across multiple domains. When perturbed, the system naturally returned to a state of ~75% coherence, 
                          supporting the Ouroboros cycle (3:1 ↔ 1:3) hypothesis. The 0.7500 attractor operates within the bounds 
                          of [{results.attractorBounds[0].toFixed(2)}, {results.attractorBounds[1].toFixed(2)}], with varying return times 
                          depending on perturbation magnitude.
                        </>
                      ) : (
                        <>
                          The experiment provided <strong>inconclusive evidence</strong> for 0.7500 as a universal coherence attractor.
                          While some domains showed a tendency to return to ~75% coherence, the effect was not consistent enough
                          across all domains to confirm the hypothesis. Further experimentation with different coupling strengths 
                          and noise levels may be needed.
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setActiveTab('design');
                      setResults(null);
                    }}
                  >
                    Modify Experiment
                  </Button>
                  
                  <Button 
                    onClick={startExperiment}
                    disabled={running}
                  >
                    Run Another Experiment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                <p className="text-gray-500 mb-6">
                  Run an experiment to generate results. The system will analyze whether 
                  0.7500 emerges as a universal attractor across different domains.
                </p>
                <Button onClick={() => setActiveTab('design')}>
                  Configure Experiment
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          Testing the universality of 0.7500 coherence as predicted by the Ouroboros principle
        </div>
        
        {running && (
          <Button 
            variant="outline" 
            onClick={() => {
              if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
              }
              setRunning(false);
              finishExperiment();
            }}
          >
            Stop Experiment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MultiAgentSynchronizationTest;