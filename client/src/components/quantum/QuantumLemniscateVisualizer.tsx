import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.jsx";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { Slider } from "../ui/slider.jsx";
import { Switch } from "../ui/switch.jsx";
import { Label } from "../ui/label.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs.jsx";
import quantumCoherenceLogger from '../../utils/quantum-coherence-logger.js';

/**
 * QuantumLemniscateVisualizer - A visualization of the quantum lemniscate model (Quantum Ouroboros)
 * 
 * This component provides an interactive visualization of how reality emerges
 * from infinite potential (division by zero) through the quantum balance filter
 * (3:1 coherence ratio). The visualization represents the "Quantum Ouroboros" concept:
 * 
 * ∞ ↔ 0 ↔ ∞
 * 
 * This demonstrates the "root fractal" - Division by Zero as the foundation of reality,
 * with an infinitely recursive nature (0 within 0 within 0). The 3:1 ratio (75% coherence,
 * 25% exploration) acts as the filtering mechanism that allows structured reality to emerge
 * from this infinite potential.
 */

interface QuantumLemniscateVisualizerProps {
  stabilityRatio?: number;
  explorationRatio?: number;
  onRatioChange?: (stability: number, exploration: number) => void;
}

const QuantumLemniscateVisualizer: React.FC<QuantumLemniscateVisualizerProps> = ({
  stabilityRatio = 0.75,
  explorationRatio = 0.25,
  onRatioChange
}) => {
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [divisionByZeroIntensity, setDivisionByZeroIntensity] = useState<number>(25);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [recursionDepth, setRecursionDepth] = useState<number>(1);
  const [particleDensity, setParticleDensity] = useState<number>(16);
  
  // New paradox visualization states
  const [paradoxStateMode, setParadoxStateMode] = useState<'recursive' | 'excursive' | 'both'>('both');
  const [smartDumbnessIntensity, setSmartDumbnessIntensity] = useState<number>(75);
  const [metaLoopClosure, setMetaLoopClosure] = useState<boolean>(true);
  
  // Quantum Architect Mode state
  const [quantumArchitectMode, setQuantumArchitectMode] = useState<boolean>(false);
  const [coherenceStabilizationStep, setCoherenceStabilizationStep] = useState<number>(0); // 0: inactive, 1-3: steps
  const [quantumRupture, setQuantumRupture] = useState<boolean>(false);
  const [realignmentActive, setRealignmentActive] = useState<boolean>(false);
  const [quantumFlipCount, setQuantumFlipCount] = useState<number>(0);
  
  // Animation effect
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setRotationAngle(prev => (prev + (animationSpeed / 500)) % 360);
    }, 50);
    
    return () => clearInterval(animationInterval);
  }, [animationSpeed]);
  
  // Log Quantum Paradox Singularity state changes
  useEffect(() => {
    quantumCoherenceLogger.logCoherenceEvent(
      'QUANTUM_PARADOX_STATE_CHANGE', 
      {
        paradoxStateMode,
        smartDumbnessIntensity,
        metaLoopClosure,
        stabilityRatio,
        explorationRatio,
        recursionDepth
      },
      'User modified quantum paradox singularity state'
    );
  }, [paradoxStateMode, smartDumbnessIntensity, metaLoopClosure, stabilityRatio, explorationRatio, recursionDepth]);
  
  // Toggle Quantum Architect Mode
  const toggleQuantumArchitectMode = () => {
    const newState = !quantumArchitectMode;
    setQuantumArchitectMode(newState);
    
    quantumCoherenceLogger.logCoherenceEvent(
      'QUANTUM_ARCHITECT_MODE_TOGGLE',
      { active: newState },
      `User ${newState ? 'activated' : 'deactivated'} Quantum Architect Mode`
    );
    
    // Reset coherence stabilization when exiting
    if (!newState) {
      setCoherenceStabilizationStep(0);
      setQuantumRupture(false);
      setRealignmentActive(false);
    }
  };
  
  // Handle quantum rupture (controlled coherence break)
  const handleQuantumRupture = () => {
    if (quantumRupture || realignmentActive) return;
    
    setQuantumRupture(true);
    console.log("[QUANTUM_STATE: RUPTURE] Initiating controlled quantum rupture...");
    
    // Log the quantum rupture event
    quantumCoherenceLogger.logCoherenceEvent(
      'QUANTUM_RUPTURE_INITIATED',
      { 
        quantumFlipCount: quantumFlipCount + 1,
        stabilityRatio,
        explorationRatio
      },
      'User initiated quantum rupture (manual quantum flip)'
    );
    
    // Log quantum coherence changes during rupture
    const logInterval = setInterval(() => {
      const randomCoherence = (Math.random() * 0.5).toFixed(2);
      console.log(`[QUANTUM_STATE: COHERENCE] Unstable coherence level: ${randomCoherence} (target: 0.75)`);
      
      // Log the explicit quantum state change
      quantumCoherenceLogger.logCoherenceEvent(
        'QUANTUM_RUPTURE_PROGRESS',
        {
          currentCoherence: parseFloat(randomCoherence),
          targetCoherence: 0.75,
          quantumFlipCount
        },
        `Quantum rupture in progress - coherence destabilizing (${randomCoherence})`
      );
    }, 1000);
    
    // Auto-resolve rupture after 5 seconds
    setTimeout(() => {
      clearInterval(logInterval);
      setQuantumRupture(false);
      setQuantumFlipCount(prev => prev + 1);
      console.log("[QUANTUM_STATE: RUPTURE] Quantum flip complete. System destabilized.");
      console.log("[QUANTUM_STATE: WARNING] Coherence realignment needed.");
      
      // Log the completion of the quantum rupture
      quantumCoherenceLogger.logCoherenceEvent(
        'QUANTUM_RUPTURE_COMPLETE',
        {
          quantumFlipCount: quantumFlipCount + 1,
          coherenceState: 'DESTABILIZED',
          needsRealignment: true
        },
        `Quantum flip #${quantumFlipCount + 1} complete. System requires coherence realignment.`
      );
      
      // If not in realignment mode, auto-trigger realignment
      if (!realignmentActive) {
        handleQuantumRealignment();
      }
    }, 5000);
  };
  
  // Handle quantum realignment (restore 3:1 coherence ratio)
  const handleQuantumRealignment = () => {
    if (realignmentActive) return;
    
    setRealignmentActive(true);
    console.log("[QUANTUM_STATE: REALIGNMENT] Initiating quantum coherence realignment...");
    
    // Log the quantum realignment event
    quantumCoherenceLogger.logCoherenceEvent(
      'QUANTUM_REALIGNMENT_INITIATED',
      { 
        quantumFlipCount,
        stabilityRatio,
        explorationRatio
      },
      'Quantum realignment protocol activated'
    );
    
    // Log stabilizing coherence during realignment
    const logInterval = setInterval(() => {
      const approachingCoherence = (0.65 + (Math.random() * 0.1)).toFixed(2);
      console.log(`[QUANTUM_STATE: COHERENCE] Stabilizing coherence level: ${approachingCoherence} (target: 0.75)`);
      
      // Log the explicit quantum state change
      quantumCoherenceLogger.logCoherenceEvent(
        'QUANTUM_REALIGNMENT_PROGRESS',
        {
          currentCoherence: parseFloat(approachingCoherence),
          targetCoherence: 0.75,
          progress: 'IN_PROGRESS'
        },
        `Quantum realignment in progress - coherence stabilizing (${approachingCoherence})`
      );
    }, 1000);
    
    // Auto-disable realignment after animation completes
    setTimeout(() => {
      clearInterval(logInterval);
      setRealignmentActive(false);
      
      // Return to optimal 3:1 ratio
      if (Math.abs(stabilityRatio - 0.75) > 0.01) {
        handleRatioChange(0.75);
      }
      
      console.log("[QUANTUM_STATE: REALIGNMENT] Coherence restored to optimal 3:1 ratio (75% coherence).");
      console.log("[QUANTUM_STATE: SUCCESS] Quantum fields stabilized.");
      
      // Log the completion of the quantum realignment
      quantumCoherenceLogger.logCoherenceEvent(
        'QUANTUM_REALIGNMENT_COMPLETE',
        {
          coherenceState: 'OPTIMAL',
          stabilityRatio: 0.75,
          explorationRatio: 0.25
        },
        'Quantum coherence successfully realigned to optimal 3:1 ratio'
      );
    }, 3000);
  };
  
  // Handler for ratio changes with validation
  const handleRatioChange = (newStabilityRatio: number) => {
    // Ensure the stability ratio is between 0.5 and 0.9
    const clampedRatio = Math.max(0.5, Math.min(0.9, newStabilityRatio));
    
    // Calculate the exploration ratio
    const newExplorationRatio = 1 - clampedRatio;
    
    // Validate the 3:1 ratio (exactly 0.75:0.25)
    const isOptimalRatio = Math.abs(clampedRatio - 0.75) < 0.001;
    
    // Log the quantum coherence state
    quantumCoherenceLogger.logCoherenceEvent(
      'QUANTUM_RATIO_CHANGE',
      {
        stabilityRatio: clampedRatio,
        explorationRatio: newExplorationRatio,
        isOptimalRatio
      },
      isOptimalRatio 
        ? 'User set optimal 3:1 quantum balance ratio (75% coherence, 25% exploration)'
        : 'User modified quantum balance ratio away from optimal 3:1'
    );
    
    // Call the parent handler if provided
    if (onRatioChange) {
      onRatioChange(clampedRatio, newExplorationRatio);
    }
  };
  
  // Handle quantum rupture (controlled coherence break)
  
  // Handle quantum realignment (restore 3:1 coherence ratio)
  
  // Generate particles for the visualization
  const generateParticles = () => {
    const particles = [];
    
    for (let i = 0; i < particleDensity; i++) {
      const angle = (i / particleDensity) * 360 + rotationAngle;
      const radius = 35 + (i % 3) * 5 * (divisionByZeroIntensity / 100);
      
      const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
      
      // Determine particle color based on position and quantum properties
      const isStability = i % 4 < 3; // 3:1 ratio representation
      
      let color;
      if (isStability) {
        color = `rgba(100, 149, 237, ${0.5 + (stabilityRatio - 0.5) * 0.8})`; // Coherence: blue tones
      } else {
        color = `rgba(255, 99, 71, ${0.5 + (explorationRatio - 0.1) * 2})`; // Exploration: red tones
      }
      
      // Add recursion level particles
      particles.push(
        <circle 
          key={`particle-${i}`} 
          cx={`${x}%`} 
          cy={`${y}%`} 
          r={isStability ? 1.5 : 1.2} 
          fill={color}
          className="transition-all duration-300 ease-in-out"
        />
      );
      
      // Add inner recursion particles based on recursion depth
      if (recursionDepth > 1 && i % 4 === 0) {
        const innerRadius = radius * 0.6;
        const innerX = 50 + innerRadius * Math.cos(((angle + 30) * Math.PI) / 180);
        const innerY = 50 + innerRadius * Math.sin(((angle + 30) * Math.PI) / 180);
        
        particles.push(
          <circle 
            key={`inner-particle-${i}`} 
            cx={`${innerX}%`} 
            cy={`${innerY}%`} 
            r={0.8} 
            fill={`rgba(180, 180, 255, ${0.6 + (stabilityRatio - 0.5) * 0.6})`}
            className="transition-all duration-300 ease-in-out"
          />
        );
      }
      
      // Add deepest recursion particles
      if (recursionDepth > 2 && i % 7 === 0) {
        const deepRadius = radius * 0.3;
        const deepX = 50 + deepRadius * Math.cos(((angle + 60) * Math.PI) / 180);
        const deepY = 50 + deepRadius * Math.sin(((angle + 60) * Math.PI) / 180);
        
        particles.push(
          <circle 
            key={`deep-particle-${i}`} 
            cx={`${deepX}%`} 
            cy={`${deepY}%`} 
            r={0.5} 
            fill={`rgba(220, 220, 255, ${0.7 + (stabilityRatio - 0.5) * 0.5})`}
            className="transition-all duration-300 ease-in-out"
          />
        );
      }
    }
    
    return particles;
  };
  
  // Generate connections between particles to form the quantum coherence network
  const generateConnections = () => {
    // This is simplified - a real implementation would create meaningful connections
    // based on quantum coherence patterns
    const connections = [];
    const nodeCounts = Math.floor(particleDensity / 4);
    
    // Create a connections grid based on the 3:1 ratio
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < nodeCounts; j++) {
        if (j % 4 < 3) { // Follow the 3:1 ratio pattern
          const x1 = 30 + (i * 20);
          const y1 = 30 + (j * 40 / nodeCounts);
          
          connections.push(
            <line 
              key={`connection-${i}-${j}`}
              x1={`${x1}%`} 
              y1={`${y1}%`} 
              x2="50%" 
              y2="50%" 
              stroke={`rgba(100, 149, 237, ${0.1 + (stabilityRatio - 0.5) * 0.2})`} 
              strokeWidth="0.5" 
              className="transition-all duration-500 ease-in-out"
            />
          );
        }
      }
    }
    
    // Add exploration connections (the 1 in the 3:1 ratio)
    for (let i = 0; i < nodeCounts / 3; i++) {
      const angle = (i / (nodeCounts / 3)) * 360 + rotationAngle;
      const radius = 35 + (i % 3) * 2;
      
      const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
      
      connections.push(
        <line 
          key={`exploration-connection-${i}`}
          x1={`${x}%`} 
          y1={`${y}%`} 
          x2="50%" 
          y2="50%" 
          stroke={`rgba(255, 99, 71, ${0.1 + (explorationRatio - 0.1) * 0.4})`} 
          strokeWidth="0.5" 
          className="transition-all duration-500 ease-in-out"
        />
      );
    }
    
    return connections;
  };
  
  return (
    <Card className="w-full max-w-4xl bg-black/30 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl leading-tight">Quantum Lemniscate Visualizer</CardTitle>
            <CardDescription>
              Visualizing the Quantum Paradox Singularity (∞/0) and 3:1 Coherence Ratio
            </CardDescription>
          </div>
          
          <Button 
            variant={quantumArchitectMode ? "default" : "outline"}
            size="sm"
            className={quantumArchitectMode 
              ? "bg-gradient-to-r from-indigo-700 to-purple-700 text-white" 
              : "border-indigo-500/30 text-indigo-400"
            }
            onClick={toggleQuantumArchitectMode}
          >
            {quantumArchitectMode ? "Architect Mode: Active" : "Enable Architect Mode"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full aspect-square relative rounded-lg overflow-hidden border border-gray-800 bg-black/50">
            <div className="w-full h-full">
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full"
                style={{ 
                  transform: `rotate(${rotationAngle}deg)`,
                  transition: 'transform 0.5s ease-out'
                }}
              >
                {/* Enhanced Division by Zero Singularity (∞/0) with Fractal Depth Indicators */}
                <g className={`transform transition-all duration-700 ${
                  paradoxStateMode === 'recursive' ? 'scale-90' : 
                  paradoxStateMode === 'excursive' ? 'scale-110' : ''
                }`}>
                  {/* Main Singularity */}
                  <circle 
                    cx="50%" 
                    cy="50%" 
                    r={1 + (divisionByZeroIntensity / 20)} 
                    fill={`rgba(255, 255, 255, ${0.7 + (divisionByZeroIntensity / 100) * 0.3})`}
                    className="animate-pulse transition-all duration-500 ease-in-out"
                  />
                  
                  {/* Fractal Depth Indicators - Recursive Inward (Infinite Coherence) */}
                  {[...Array(4)].map((_, i) => (
                    <circle 
                      key={`recursive-depth-${i}`}
                      cx="50%"
                      cy="50%"
                      r={0.8 - (i * 0.15)}
                      fill="transparent"
                      stroke={`rgba(100, 149, 237, ${0.9 - (i * 0.2)})`}
                      strokeWidth={0.05}
                      strokeDasharray={0.2}
                      className={`animate-pulse transition-all ${
                        paradoxStateMode === 'recursive' || paradoxStateMode === 'both' 
                          ? 'opacity-100' : 'opacity-20'
                      }`}
                      style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: `${1.5 + (i * 0.5)}s`
                      }}
                    />
                  ))}
                  
                  {/* Fractal Depth Indicators - Excursive Outward (Infinite Potentials) */}
                  {[...Array(4)].map((_, i) => (
                    <circle 
                      key={`excursive-depth-${i}`}
                      cx="50%"
                      cy="50%"
                      r={1.5 + (i * 0.4)}
                      fill="transparent"
                      stroke={`rgba(255, 99, 71, ${0.7 - (i * 0.15)})`}
                      strokeWidth={0.05}
                      strokeDasharray={0.3}
                      className={`transition-all ${
                        paradoxStateMode === 'excursive' || paradoxStateMode === 'both' 
                          ? 'opacity-100' : 'opacity-20'
                      }`}
                      style={{
                        animationName: 'pulse',
                        animationDuration: `${2 + (i * 0.7)}s`,
                        animationIterationCount: 'infinite',
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </g>
                
                {/* Oroboro Triad representation in the central singularity */}
                <circle cx="50%" cy="50%" r="0.6" fill="rgba(100, 149, 237, 0.9)" /> {/* Oro (Masculine) */}
                <circle cx="50.4%" cy="49.7%" r="0.4" fill="rgba(221, 160, 221, 0.9)" /> {/* Oro (Feminine) */}
                <circle cx="49.7%" cy="50.3%" r="0.3" fill="rgba(255, 99, 71, 0.9)" /> {/* Obo (Youth) */}
                
                {/* Generate quantum particle system */}
                {generateParticles()}
                
                {/* Generate quantum coherence network */}
                {generateConnections()}
                
                {/* Enhanced 3:1 Ratio Visualization with Dynamic Color Gradients */}
                <g className="transition-all duration-700">
                  {/* Stability Lines (75% - 3 parts) */}
                  <line 
                    x1="50%" 
                    y1="50%" 
                    x2="35%" 
                    y2="65%" 
                    stroke={`rgba(100, 149, 237, ${0.6 + (stabilityRatio - 0.5) * 0.8})`} 
                    strokeWidth={0.5 + (stabilityRatio - 0.5) * 0.5}
                    className="transition-all duration-300"
                  >
                    <animate 
                      attributeName="stroke-opacity" 
                      values={`${0.6 + (stabilityRatio - 0.5) * 0.8};${0.9 + (stabilityRatio - 0.5) * 0.2};${0.6 + (stabilityRatio - 0.5) * 0.8}`} 
                      dur="3s" 
                      repeatCount="indefinite"
                      calcMode="spline"
                      keyTimes="0;0.5;1"
                    />
                  </line>
                  <line 
                    x1="50%" 
                    y1="50%" 
                    x2="50%" 
                    y2="65%" 
                    stroke={`rgba(100, 149, 237, ${0.6 + (stabilityRatio - 0.5) * 0.8})`} 
                    strokeWidth={0.5 + (stabilityRatio - 0.5) * 0.5}
                    className="transition-all duration-300"
                  >
                    <animate 
                      attributeName="stroke-opacity" 
                      values={`${0.6 + (stabilityRatio - 0.5) * 0.8};${0.9 + (stabilityRatio - 0.5) * 0.2};${0.6 + (stabilityRatio - 0.5) * 0.8}`} 
                      dur="3s" 
                      repeatCount="indefinite"
                      begin="0.5s" 
                    />
                  </line>
                  <line 
                    x1="50%" 
                    y1="50%" 
                    x2="65%" 
                    y2="65%" 
                    stroke={`rgba(100, 149, 237, ${0.6 + (stabilityRatio - 0.5) * 0.8})`} 
                    strokeWidth={0.5 + (stabilityRatio - 0.5) * 0.5}
                    className="transition-all duration-300"
                  >
                    <animate 
                      attributeName="stroke-opacity" 
                      values={`${0.6 + (stabilityRatio - 0.5) * 0.8};${0.9 + (stabilityRatio - 0.5) * 0.2};${0.6 + (stabilityRatio - 0.5) * 0.8}`} 
                      dur="3s" 
                      repeatCount="indefinite"
                      begin="1s" 
                    />
                  </line>
                  
                  {/* Exploration Line (25% - 1 part) */}
                  <line 
                    x1="50%" 
                    y1="50%" 
                    x2="50%" 
                    y2="35%" 
                    stroke={`rgba(255, 99, 71, ${0.6 + (explorationRatio - 0.1) * 2})`} 
                    strokeWidth={0.5 + (explorationRatio - 0.1) * 1.5}
                    className="transition-all duration-300"
                  >
                    <animate 
                      attributeName="stroke-opacity" 
                      values={`${0.6 + (explorationRatio - 0.1) * 2};${0.9 + (explorationRatio - 0.1)};${0.6 + (explorationRatio - 0.1) * 2}`} 
                      dur="2s" 
                      repeatCount="indefinite" 
                    />
                  </line>
                  
                  {/* 3:1 Ratio Indicator */}
                  <text 
                    x="50%" 
                    y="55%" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fill="rgba(255, 255, 255, 0.7)" 
                    fontSize="1.2"
                    className={`${Math.abs(stabilityRatio - 0.75) < 0.01 ? 'opacity-100' : 'opacity-30'} transition-opacity duration-500`}
                  >
                    3:1
                  </text>
                </g>
                
                {/* Enhanced Quantum Network Nodes with Dynamic Pulses */}
                <g className="transition-all duration-500">
                  {/* Stability Nodes (75% - 3 parts) */}
                  {[
                    { cx: "35%", cy: "65%", delay: "0s" },
                    { cx: "50%", cy: "65%", delay: "0.3s" },
                    { cx: "65%", cy: "65%", delay: "0.6s" }
                  ].map((node, i) => (
                    <g key={`stability-node-${i}`}>
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r={1 + (stabilityRatio - 0.5) * 0.5} 
                        fill={`rgba(100, 149, 237, ${0.7 + (stabilityRatio - 0.5) * 0.6})`}
                        className="transition-all duration-300"
                      />
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r={1.5 + (stabilityRatio - 0.5) * 1} 
                        fill="transparent"
                        stroke={`rgba(100, 149, 237, ${0.2 + (stabilityRatio - 0.5) * 0.4})`}
                        strokeWidth="0.2"
                        className="transition-all duration-300"
                      >
                        <animate 
                          attributeName="r" 
                          values={`${1.5 + (stabilityRatio - 0.5) * 1};${2.5 + (stabilityRatio - 0.5) * 1.5};${1.5 + (stabilityRatio - 0.5) * 1}`} 
                          dur="3s" 
                          repeatCount="indefinite"
                          begin={node.delay} 
                        />
                        <animate 
                          attributeName="stroke-opacity" 
                          values="0.6;0.1;0.6" 
                          dur="3s" 
                          repeatCount="indefinite"
                          begin={node.delay} 
                        />
                      </circle>
                    </g>
                  ))}
                  
                  {/* Exploration Node (25% - 1 part) */}
                  <g>
                    <circle 
                      cx="50%" 
                      cy="35%" 
                      r={1 + (explorationRatio - 0.1) * 2} 
                      fill={`rgba(255, 99, 71, ${0.7 + (explorationRatio - 0.1) * 1.5})`}
                      className="transition-all duration-300"
                    />
                    <circle 
                      cx="50%" 
                      cy="35%" 
                      r={1.5 + (explorationRatio - 0.1) * 3} 
                      fill="transparent"
                      stroke={`rgba(255, 99, 71, ${0.2 + (explorationRatio - 0.1) * 1})`}
                      strokeWidth="0.2"
                      className="transition-all duration-300"
                    >
                      <animate 
                        attributeName="r" 
                        values={`${1.5 + (explorationRatio - 0.1) * 3};${2.5 + (explorationRatio - 0.1) * 4};${1.5 + (explorationRatio - 0.1) * 3}`} 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="stroke-opacity" 
                        values="0.6;0.1;0.6" 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                  </g>
                </g>
                
                {/* Quantum coherence field lines */}
                <line x1="15%" y1="15%" x2="50%" y2="50%" stroke="rgba(0, 255, 0, 0.2)" strokeWidth="1" />
                <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="rgba(255, 255, 0, 0.2)" strokeWidth="1" />
                <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="rgba(255, 0, 255, 0.2)" strokeWidth="1" />
                <line x1="85%" y1="85%" x2="50%" y2="50%" stroke="rgba(0, 0, 255, 0.2)" strokeWidth="1" />
              </svg>
            </div>
          </div>
          
          <div className="w-full">
            <Tabs defaultValue="singularity" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="singularity">Quantum Paradox</TabsTrigger>
                <TabsTrigger value="controls">Core Controls</TabsTrigger>
                <TabsTrigger 
                  value="architect" 
                  className={quantumArchitectMode 
                    ? "bg-gradient-to-r from-indigo-900 to-purple-900 text-indigo-200" 
                    : "opacity-50"
                  }
                  disabled={!quantumArchitectMode}
                >
                  Architect Mode
                </TabsTrigger>
              </TabsList>

              <TabsContent value="singularity" className="space-y-4 pt-3">
                {/* Paradoxical State Transitions */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Paradoxical State Transition Mode</Label>
                  </div>
                  <div className="flex flex-row space-x-2">
                    <Button 
                      variant={paradoxStateMode === 'recursive' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setParadoxStateMode('recursive')}
                      className="flex-1"
                    >
                      Recursive
                    </Button>
                    <Button 
                      variant={paradoxStateMode === 'excursive' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setParadoxStateMode('excursive')}
                      className="flex-1"
                    >
                      Excursive
                    </Button>
                    <Button 
                      variant={paradoxStateMode === 'both' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setParadoxStateMode('both')}
                      className="flex-1"
                    >
                      Both
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recursive mode focuses inward (∞→0), excursive mode focuses outward (0→∞), and both maintains paradoxical balance.
                  </p>
                </div>

                {/* Smart Dumbness Method */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Smart Dumbness Method</Label>
                    <span className="text-xs text-muted-foreground">{smartDumbnessIntensity}%</span>
                  </div>
                  <Slider 
                    value={[smartDumbnessIntensity]} 
                    min={0} 
                    max={100} 
                    step={5} 
                    onValueChange={(value) => setSmartDumbnessIntensity(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls the opacity of knowing/not-knowing boundary layer. Higher values increase meta-level awareness.
                  </p>
                </div>

                {/* Meta-level Loop Closure */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Meta-level Loop Closure</Label>
                    <Switch 
                      checked={metaLoopClosure} 
                      onCheckedChange={setMetaLoopClosure} 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enables recursive self-referential loop binding both ends of the lemniscate (∞)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="controls" className="space-y-4 pt-3">
                {/* Stability-Exploration Ratio */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Stability-Exploration Ratio</Label>
                    <span className="text-xs text-muted-foreground">{(stabilityRatio * 100).toFixed(0)}% - {(explorationRatio * 100).toFixed(0)}%</span>
                  </div>
                  <Slider 
                    value={[stabilityRatio * 100]} 
                    min={50}
                    max={90}
                    step={1}
                    onValueChange={(value) => handleRatioChange(value[0] / 100)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50:50</span>
                    <span className="font-medium text-primary">75:25 (3:1)</span>
                    <span>90:10 (9:1)</span>
                  </div>
                </div>
                
                {/* Division by Zero Intensity */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Division by Zero Intensity</Label>
                    <span className="text-xs text-muted-foreground">{divisionByZeroIntensity}%</span>
                  </div>
                  <Slider
                    value={[divisionByZeroIntensity]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setDivisionByZeroIntensity(value[0])}
                  />
                </div>
                
                {/* Animation Speed */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Animation Speed</Label>
                    <span className="text-xs text-muted-foreground">{animationSpeed}%</span>
                  </div>
                  <Slider
                    value={[animationSpeed]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setAnimationSpeed(value[0])}
                  />
                </div>
                
                {/* Particle Density */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Particle Density</Label>
                    <span className="text-xs text-muted-foreground">{particleDensity} particles</span>
                  </div>
                  <Slider
                    value={[particleDensity]}
                    min={8}
                    max={64}
                    step={4}
                    onValueChange={(value) => setParticleDensity(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minimal (8)</span>
                    <span>Standard (16)</span>
                    <span>Dense (64)</span>
                  </div>
                </div>
                
                {/* Recursion Depth */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Recursion Depth</Label>
                    <span className="text-xs text-muted-foreground">Level {recursionDepth}</span>
                  </div>
                  <Slider
                    value={[recursionDepth]}
                    min={1}
                    max={3}
                    step={1}
                    onValueChange={(value) => setRecursionDepth(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Basic (1)</span>
                    <span>Intermediate (2)</span>
                    <span>Complex (3)</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="architect" className="space-y-4 pt-3">
                <div className="p-4 bg-gradient-to-r from-indigo-950 to-purple-950 rounded-md border border-indigo-700">
                  <h3 className="font-medium text-indigo-300 mb-2">Quantum Architect Mode</h3>
                  <p className="text-xs text-indigo-300/80">
                    This advanced mode allows direct manipulation of the quantum coherence fields and meta-level structures. 
                    The architect can directly visualize and modify the coherence patterns across multiple dimensions.
                  </p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-indigo-200">Coherence Stabilization Protocol</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3].map(step => (
                          <button
                            key={step}
                            onClick={() => setCoherenceStabilizationStep(step)}
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-xs 
                              ${coherenceStabilizationStep === step 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-indigo-900/50 text-indigo-400'
                              }`}
                          >
                            {step}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-indigo-900/20 rounded border border-indigo-800/50">
                      <p className="text-xs text-indigo-200">
                        {coherenceStabilizationStep === 0 && "Activate the Coherence Stabilization Protocol to maintain the quantum balance across all dimensions."}
                        {coherenceStabilizationStep === 1 && "Step 1: Quantum field alignment initiated. Establishing meta-coherence baseline..."}
                        {coherenceStabilizationStep === 2 && "Step 2: Fractal symmetry locked. Applying 3:1 ratio at all recursive scales..."}
                        {coherenceStabilizationStep === 3 && "Step 3: Complete! Quantum coherence stabilized across all dimensions."}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={coherenceStabilizationStep === 0 ? "default" : "outline"}
                        className="flex-1 bg-gradient-to-r from-indigo-800 to-purple-800 text-indigo-200"
                        onClick={() => setCoherenceStabilizationStep(coherenceStabilizationStep === 0 ? 1 : 0)}
                      >
                        {coherenceStabilizationStep === 0 ? "Initiate Protocol" : "Reset Protocol"}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-indigo-600"
                        onClick={() => setQuantumArchitectMode(false)}
                      >
                        Exit Architect Mode
                      </Button>
                    </div>
                    
                    {/* Quantum Rupture and Realignment Section */}
                    <div className="mt-6 border-t border-indigo-800/30 pt-4">
                      <h4 className="text-sm font-medium text-indigo-300 mb-2">
                        Quantum Rupture & Realignment Controls
                      </h4>
                      <p className="text-xs text-indigo-300/80 mb-3">
                        Advanced controls for manually manipulating quantum coherence fields. 
                        The Quantum Flip initiates a controlled rupture, while Realignment restores optimal 3:1 coherence.
                      </p>
                      
                      <div className="p-3 bg-indigo-900/20 rounded border border-indigo-800/50 mb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-medium text-indigo-200">Quantum State:</span>
                            <span className="ml-2 text-xs text-indigo-300/80">
                              {quantumRupture 
                                ? "⚠️ RUPTURE IN PROGRESS" 
                                : realignmentActive 
                                  ? "🔄 REALIGNMENT ACTIVE" 
                                  : "✓ STABLE"}
                            </span>
                          </div>
                          <div className="text-xs text-indigo-300/80">
                            Flips: <span className="font-mono">{quantumFlipCount}</span>
                          </div>
                        </div>
                        
                        {(quantumRupture || realignmentActive) && (
                          <div className="mt-2 h-2 bg-indigo-900/50 rounded overflow-hidden">
                            <div 
                              className={`h-full ${
                                quantumRupture 
                                  ? "bg-red-500/70 animate-pulse" 
                                  : "bg-emerald-500/70"
                              }`}
                              style={{ 
                                width: quantumRupture ? '100%' : '75%',
                                transition: 'width 2s ease-in-out'
                              }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={quantumRupture ? "default" : "outline"}
                          className={`flex-1 ${
                            quantumRupture 
                              ? "bg-gradient-to-r from-red-900 to-orange-900 text-red-200" 
                              : "border-red-800/50 text-red-300/80"
                          }`}
                          onClick={handleQuantumRupture}
                          disabled={quantumRupture || realignmentActive}
                        >
                          Initiate Quantum Flip
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={realignmentActive ? "default" : "outline"}
                          className={`flex-1 ${
                            realignmentActive 
                              ? "bg-gradient-to-r from-emerald-900 to-cyan-900 text-emerald-200" 
                              : "border-emerald-800/50 text-emerald-300/80"
                          }`}
                          onClick={handleQuantumRealignment}
                          disabled={realignmentActive || (quantumRupture && !realignmentActive)}
                        >
                          Realign Coherence
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4 text-sm">
          <h3 className="font-semibold mb-2">Quantum Balance Explanation</h3>
          <p className="text-muted-foreground">
            The quantum lemniscate (infinity symbol) represents the continuous flow between infinite potential
            (division by zero) and structured reality. The 3:1 ratio (75% coherence, 25% exploration) is the 
            optimal balance that allows reality to emerge while maintaining adaptability.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="border border-blue-500/30 rounded p-2 bg-blue-500/10">
              <h4 className="text-blue-400 font-medium">Coherence (75%)</h4>
              <p className="text-xs text-muted-foreground">
                The structured, stable aspect that gives form and continuity to reality.
              </p>
            </div>
            <div className="border border-red-500/30 rounded p-2 bg-red-500/10">
              <h4 className="text-red-400 font-medium">Exploration (25%)</h4>
              <p className="text-xs text-muted-foreground">
                The chaotic, novel aspect that allows for growth, adaptation and evolution.
              </p>
            </div>
          </div>
          
          <h3 className="font-semibold mt-4 mb-2">Quantum Paradox Singularity</h3>
          <p className="text-muted-foreground text-xs">
            The Division by Zero Singularity (∞/0) represents the fundamental paradox at the center of reality - 
            a state that is both singular and infinite simultaneously. This paradoxical state enables the emergence 
            of structured reality through three key mechanisms:
          </p>
          
          <div className="mt-2 grid grid-cols-1 gap-2">
            <div className="border border-blue-500/30 rounded p-2 bg-blue-500/10">
              <h4 className="text-blue-400 font-medium text-xs">Paradoxical State Transitions</h4>
              <p className="text-xs text-muted-foreground">
                Reality emerges through two complementary paradoxical transitions: <span className="text-blue-300">recursive inward</span> 
                (consolidating infinite potential into structure) and <span className="text-red-300">excursive outward</span> 
                (expanding structure into infinite possibilities). These transitions maintain quantum coherence.
              </p>
            </div>
            
            <div className="border border-purple-500/30 rounded p-2 bg-purple-500/10">
              <h4 className="text-purple-400 font-medium text-xs">Smart Dumbness Method</h4>
              <p className="text-xs text-muted-foreground">
                This paradoxical mechanism enables "knowing without fully knowing" - being "Half Man, Half Quantum." 
                Higher Smart Dumbness intensity shifts toward intuitive understanding (knowing without explicit knowledge), 
                while lower intensity emphasizes explicit knowledge. The optimal balance maintains quantum coherence.
              </p>
            </div>
            
            <div className="border border-amber-500/30 rounded p-2 bg-amber-500/10">
              <h4 className="text-amber-400 font-medium text-xs">Meta-level Loop Closure</h4>
              <p className="text-xs text-muted-foreground">
                This mechanism creates a self-referential loop where the system observes and influences itself, becoming 
                "its own best friend" at a quantum level. This paradoxical self-reference creates stability within infinite 
                recursion, maintaining the 3:1 ratio across all scales.
              </p>
            </div>
          </div>
          
          <h3 className="font-semibold mt-4 mb-2">Roman Numeral Symbolism</h3>
          <p className="text-muted-foreground text-xs">
            The Roman numeral "V" (representing the number 5) symbolizes a triangular shape and the 3:1 ratio.
            In sacred geometry, it represents stability and coherence by showing a broader base (3 parts) supporting 
            a narrower top (1 part).
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            <div className="border border-yellow-500/30 rounded p-2 bg-yellow-500/10">
              <h4 className="text-yellow-400 font-medium text-xs">V (Triangle)</h4>
              <p className="text-xs text-muted-foreground">
                3:1 Ratio
              </p>
            </div>
            <div className="border border-purple-500/30 rounded p-2 bg-purple-500/10">
              <h4 className="text-purple-400 font-medium text-xs">I (Line)</h4>
              <p className="text-xs text-muted-foreground">
                Singularity
              </p>
            </div>
            <div className="border border-cyan-500/30 rounded p-2 bg-cyan-500/10">
              <h4 className="text-cyan-400 font-medium text-xs">X (Cross)</h4>
              <p className="text-xs text-muted-foreground">
                Infinite Recursion
              </p>
            </div>
            <div className="border border-green-500/30 rounded p-2 bg-green-500/10">
              <h4 className="text-green-400 font-medium text-xs">C (Arc)</h4>
              <p className="text-xs text-muted-foreground">
                Fractal Growth
              </p>
            </div>
          </div>
          
          <h3 className="font-semibold mt-4 mb-2">Quantum Coherence Network</h3>
          <p className="text-muted-foreground text-xs">
            The colored nodes represent the Quantum Coherence Network - the universal connectivity through which 
            consciousness can bridge between scales instantly. This network exists at the quantum level, allowing
            for instant communication across all scales and dimensions through quantum coherence.
          </p>
          
          <h3 className="font-semibold mt-4 mb-2">The Oroboro Triad</h3>
          <p className="text-muted-foreground text-xs">
            The central singularity contains the Oroboro triad (Oro-Oro-Obo), representing the three aspects of reality:
            <span className="text-blue-300 ml-1">Oro (Masculine)</span> - structure, discipline, and coherence (75%);
            <span className="text-purple-300 ml-1">Oro (Feminine)</span> - intuition, adaptation, and nurturing; and
            <span className="text-red-300 ml-1">Obo (Youth)</span> - curiosity, exploration, and novelty (25%).
            Together they maintain quantum balance at the root fractal level.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <div className="flex justify-between w-full">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleRatioChange(0.75)}
          >
            Reset to Optimal Ratio (3:1)
          </Button>
          <Badge variant="outline">Wilton Universal Law</Badge>
        </div>
        <div className="text-center w-full">
          <Badge variant="outline" className="bg-purple-950/30">
            <span className="font-mono">∞ ↔ 0 ↔ ∞</span>
            <span className="ml-2 text-xs">Quantum Ouroboros</span>
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuantumLemniscateVisualizer;