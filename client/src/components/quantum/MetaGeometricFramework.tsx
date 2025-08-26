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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import quantumCoherenceLogger from '@/utils/quantum-coherence-logger';

/**
 * MetaGeometricFramework - Comprehensive integration of the four-layer geometric model
 * 
 * This component implements the complete Meta-Geometric Framework as described in the documentation:
 * 1. Quantum Coherence Oscillation (foundational pulse between coherence and decoherence)
 * 2. Fractal Symmetry (balanced 3:1 structure)
 * 3. Rotating T-Branch Recursion (dimensional branching)
 * 4. Ouroboros Folding (recursive evolution loop)
 * 
 * The visualization maintains the 3:1 quantum balance by structuring:
 * - 75% coherent mathematical patterns (stable fractal structures)
 * - 25% exploratory chaos dynamics (emergent fractal forms)
 */
interface MetaGeometricFrameworkProps {
  stabilityRatio: number;
  explorationRatio: number;
  interactionCount?: number;
}

// Layer-specific visualization and interaction types
interface Layer {
  id: string;
  name: string;
  description: string;
  coherenceRange: [number, number]; // Optimal coherence range
  metrics: {
    coherence: number;
    stability: number;
    exploration: number; 
    resonance: number;
  };
  color: string;
}

// Meta-Translation interface for connecting human intention to system state
interface MetaTranslation {
  humanIntent: string;
  coherenceState: number;
  stabilityState: number;
  explorationState: number;
  dimensionalBranches: number;
  recursiveDepth: number;
}

// IDDR (Implicit Drift Detection & Recalibration) state
interface IDDRState {
  driftDetected: boolean;
  driftDirection: 'coherence' | 'exploration' | 'balance' | 'none';
  driftMagnitude: number;
  recalibrationSuggestion: string;
  lastCalibrationTime: number;
}

// Represents an anomaly in the coherence pattern
interface CoherenceAnomaly {
  layerId: string;
  location: { x: number, y: number };
  magnitude: number;
  type: 'singularity' | 'branch' | 'fold' | 'oscillation';
  description: string;
}

const MetaGeometricFramework: React.FC<MetaGeometricFrameworkProps> = ({
  stabilityRatio = 0.75,
  explorationRatio = 0.25,
  interactionCount = 0
}) => {
  // Main canvas reference for the integrated visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  // State for the four layers of the Meta-Geometric framework
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'quantum-coherence',
      name: 'Quantum Coherence Oscillation',
      description: 'Fundamental pulse between coherence (0.7500) and decoherence (0.2494)',
      coherenceRange: [0.74, 0.76],
      metrics: { coherence: 0.75, stability: 0.75, exploration: 0.25, resonance: 0.92 },
      color: '#61dafb'
    },
    {
      id: 'fractal-symmetry',
      name: 'Fractal Symmetry (3:1)',
      description: 'Universal structural principle manifesting in self-similar patterns',
      coherenceRange: [0.72, 0.78],
      metrics: { coherence: 0.73, stability: 0.73, exploration: 0.27, resonance: 0.88 },
      color: '#15c39a'
    },
    {
      id: 't-branch-recursion',
      name: 'Rotating T-Branch Recursion',
      description: 'Dimensional branching generating multidimensional exploration paths',
      coherenceRange: [0.70, 0.80],
      metrics: { coherence: 0.71, stability: 0.71, exploration: 0.29, resonance: 0.84 },
      color: '#9c5fff'
    },
    {
      id: 'ouroboros-folding',
      name: 'Ouroboros Folding',
      description: 'Recursive evolution loop enabling continuous self-improvement',
      coherenceRange: [0.68, 0.82],
      metrics: { coherence: 0.69, stability: 0.69, exploration: 0.31, resonance: 0.80 },
      color: '#ff5d8f'
    }
  ]);
  
  // State for Meta-Translation Layer
  const [metaTranslation, setMetaTranslation] = useState<MetaTranslation>({
    humanIntent: 'Explore division by zero as a mathematical singularity',
    coherenceState: 0.75,
    stabilityState: 0.75,
    explorationState: 0.25,
    dimensionalBranches: 3,
    recursiveDepth: 4
  });
  
  // State for IDDR (Implicit Drift Detection & Recalibration)
  const [iddrState, setIddrState] = useState<IDDRState>({
    driftDetected: false,
    driftDirection: 'none',
    driftMagnitude: 0,
    recalibrationSuggestion: 'System maintaining optimal 3:1 coherence-exploration balance',
    lastCalibrationTime: Date.now()
  });
  
  // State for coherence anomalies (including singularity points)
  const [anomalies, setAnomalies] = useState<CoherenceAnomaly[]>([]);
  
  // State for system metrics
  const [systemCoherence, setSystemCoherence] = useState<number>(75);
  const [systemResonance, setSystemResonance] = useState<number>(85);
  const [dimensionalityScore, setDimensionalityScore] = useState<number>(3);
  const [recursiveEvolution, setRecursiveEvolution] = useState<number>(70);
  
  // Active visualization modes
  const [showSingularityPoints, setShowSingularityPoints] = useState<boolean>(true);
  const [show3DVisualization, setShow3DVisualization] = useState<boolean>(true);
  const [visualizeIDDR, setVisualizeIDDR] = useState<boolean>(true);
  const [activeLayerTab, setActiveLayerTab] = useState<string>('integrated');
  
  // Calculate the actual ratio (stability:exploration)
  const actualRatio = stabilityRatio / explorationRatio;
  
  // Determine if we're at the optimal 3:1 ratio
  const isOptimalRatio = Math.abs(actualRatio - 3) < 0.1;
  
  // Update layer metrics when stability/exploration ratios change
  useEffect(() => {
    const updatedLayers = layers.map((layer, index) => {
      // Each layer has slightly different coherence characteristics
      // Deeper layers allow more variation while maintaining system stability
      const layerIndex = index + 1;
      const layerCoherence = Math.max(0, Math.min(1, 
        stabilityRatio - (0.02 * layerIndex) + (Math.random() * 0.04 - 0.02)
      ));
      
      const layerExploration = Math.max(0, Math.min(1,
        explorationRatio + (0.02 * layerIndex) + (Math.random() * 0.04 - 0.02)
      ));
      
      // Calculate resonance (how well this layer aligns with the ideal)
      const idealRatio = 3; // 3:1 ratio
      const actualLayerRatio = layerCoherence / layerExploration;
      const resonance = 1 - Math.min(1, Math.abs(actualLayerRatio - idealRatio) / 2);
      
      return {
        ...layer,
        metrics: {
          coherence: layerCoherence,
          stability: layerCoherence,
          exploration: layerExploration,
          resonance: resonance
        }
      };
    });
    
    setLayers(updatedLayers);
    
    // Update system-level metrics
    const avgCoherence = updatedLayers.reduce((sum, layer) => sum + layer.metrics.coherence, 0) / updatedLayers.length;
    const avgResonance = updatedLayers.reduce((sum, layer) => sum + layer.metrics.resonance, 0) / updatedLayers.length;
    
    setSystemCoherence(avgCoherence * 100);
    setSystemResonance(avgResonance * 100);
    
    // IDDR - Detect drift in coherence
    const driftThreshold = 0.1;
    const coherenceDrift = Math.abs(avgCoherence - 0.75);
    
    if (coherenceDrift > driftThreshold) {
      const driftDirection = avgCoherence > 0.75 ? 'coherence' : 'exploration';
      
      setIddrState({
        driftDetected: true,
        driftDirection,
        driftMagnitude: coherenceDrift,
        recalibrationSuggestion: driftDirection === 'coherence' 
          ? 'System is over-coherent. Increase exploration to maintain 3:1 balance.'
          : 'System is over-exploratory. Increase coherence to maintain 3:1 balance.',
        lastCalibrationTime: Date.now()
      });
      
      // Log the drift event
      quantumCoherenceLogger.logCoherenceEvent(
        'MetaGeometricFramework',
        avgCoherence,
        1 - avgCoherence,
        'drift_detection',
        `IDDR detected ${driftDirection} drift of magnitude ${coherenceDrift.toFixed(3)}`
      );
    } else {
      setIddrState({
        driftDetected: false,
        driftDirection: 'none',
        driftMagnitude: coherenceDrift,
        recalibrationSuggestion: 'System maintaining optimal 3:1 coherence-exploration balance',
        lastCalibrationTime: Date.now()
      });
    }
    
    // Generate coherence anomalies (singularity points)
    if (interactionCount && interactionCount % 5 === 0) {
      const newAnomaly: CoherenceAnomaly = {
        layerId: layers[Math.floor(Math.random() * layers.length)].id,
        location: { 
          x: Math.random(), 
          y: Math.random() 
        },
        magnitude: 0.3 + Math.random() * 0.7,
        type: Math.random() > 0.75 ? 'singularity' : 
              Math.random() > 0.5 ? 'branch' : 
              Math.random() > 0.25 ? 'fold' : 'oscillation',
        description: 'Division by zero singularity point detected'
      };
      
      setAnomalies(prev => [...prev, newAnomaly].slice(-10)); // Keep last 10 anomalies
    }
    
    // Update Meta-Translation
    setMetaTranslation(prev => ({
      ...prev,
      coherenceState: avgCoherence,
      stabilityState: avgCoherence,
      explorationState: 1 - avgCoherence,
      dimensionalBranches: Math.floor(3 + (1 - avgCoherence) * 5),
      recursiveDepth: Math.floor(4 + avgResonance * 3)
    }));
    
    // Update dimensionality and recursive evolution metrics
    setDimensionalityScore(Math.floor(30 + (1 - avgCoherence) * 50));
    setRecursiveEvolution(Math.floor(avgResonance * 100));
    
  }, [stabilityRatio, explorationRatio, interactionCount, layers]);
  
  // Draw the integrated visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 400; // Fixed height
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let t = 0;
    const speed = 0.005;
    
    // Draw the Meta-Geometric Framework visualization
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid
      ctx.strokeStyle = '#f0f0f025';
      ctx.lineWidth = 0.5;
      
      // Draw grid
      const gridSize = 20;
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
      
      // Layer dimensions
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const layerSpacing = 60;
      
      // Draw the four layers
      layers.forEach((layer, i) => {
        const layerRadius = 100 - (i * 20);
        const rotation = t * (i % 2 === 0 ? 1 : -1) * (1 - (0.2 * i));
        
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = 2;
        
        // Layer 1: Quantum Coherence Oscillation (Pulse)
        if (i === 0) {
          const pulseSize = layerRadius * (0.9 + 0.1 * Math.sin(t * 3));
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
          ctx.stroke();
          
          // Draw coherence-decoherence wave
          ctx.beginPath();
          for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
            const waveAmplitude = 10 * (0.75 + 0.25 * Math.sin(angle * 3 + t * 2));
            const x = centerX + (pulseSize + waveAmplitude) * Math.cos(angle);
            const y = centerY + (pulseSize + waveAmplitude) * Math.sin(angle);
            
            if (angle === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.strokeStyle = `${layer.color}80`;
          ctx.stroke();
        }
        
        // Layer 2: Fractal Symmetry (3:1 Structure)
        if (i === 1) {
          // Draw triadic fractal structure
          const points = 3;
          const innerRadius = layerRadius * 0.6;
          const outerRadius = layerRadius;
          
          for (let p = 0; p < points; p++) {
            const angle = (Math.PI * 2 * p / points) + rotation;
            const x1 = centerX + innerRadius * Math.cos(angle);
            const y1 = centerY + innerRadius * Math.sin(angle);
            const x2 = centerX + outerRadius * Math.cos(angle);
            const y2 = centerY + outerRadius * Math.sin(angle);
            
            // Main branch
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // Secondary branches (representing the 1 in 3:1)
            const branchAngle = angle + (Math.PI * 2) / (points * 3);
            const branchX = centerX + (outerRadius * 0.6) * Math.cos(branchAngle);
            const branchY = centerY + (outerRadius * 0.6) * Math.sin(branchAngle);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(branchX, branchY);
            ctx.stroke();
          }
        }
        
        // Layer 3: Rotating T-Branch Recursion
        if (i === 2) {
          const branches = 3 + Math.floor(2 * explorationRatio);
          const branchDepth = 2;
          
          const drawBranch = (x: number, y: number, angle: number, length: number, depth: number) => {
            if (depth >= branchDepth) return;
            
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // T-Branch: Two perpendicular branches
            const perpAngle1 = angle + Math.PI / 2;
            const perpAngle2 = angle - Math.PI / 2;
            
            const tLength = length * 0.6;
            const rotationFactor = (0.05 * Math.sin(t * 2 + depth));
            
            drawBranch(endX, endY, perpAngle1 + rotationFactor, tLength, depth + 1);
            drawBranch(endX, endY, perpAngle2 - rotationFactor, tLength, depth + 1);
          };
          
          for (let b = 0; b < branches; b++) {
            const angle = (Math.PI * 2 * b / branches) + rotation;
            drawBranch(centerX, centerY, angle, layerRadius * 0.5, 0);
          }
        }
        
        // Layer 4: Ouroboros Folding
        if (i === 3) {
          // Draw recursive snake/ouroboros pattern
          ctx.beginPath();
          
          const segments = 36;
          const radius = layerRadius;
          let lastX = 0, lastY = 0;
          
          for (let s = 0; s <= segments; s++) {
            const angle = (Math.PI * 2 * s / segments) + rotation;
            const radiusVariation = radius * (1 + 0.1 * Math.sin(s * 0.5 + t * 2));
            
            const x = centerX + radiusVariation * Math.cos(angle);
            const y = centerY + radiusVariation * Math.sin(angle);
            
            if (s === 0) {
              ctx.moveTo(x, y);
              lastX = x;
              lastY = y;
            } else {
              // Create spiral effect
              const controlX = lastX + (x - lastX) * 0.5 + (y - lastY) * 0.2;
              const controlY = lastY + (y - lastY) * 0.5 - (x - lastX) * 0.2;
              
              ctx.quadraticCurveTo(controlX, controlY, x, y);
              lastX = x;
              lastY = y;
            }
          }
          
          ctx.strokeStyle = `${layer.color}`;
          ctx.stroke();
        }
        
        // Draw layer label
        ctx.fillStyle = layer.color;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(layer.name, centerX, 30 + (i * 16));
      });
      
      // Draw division by zero singularity point at center
      const singularitySize = 12 + 4 * Math.sin(t * 3);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX, centerY, singularitySize, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      const gradient = ctx.createRadialGradient(
        centerX, centerY, singularitySize * 0.5,
        centerX, centerY, singularitySize * 3
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, singularitySize * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw singularity label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Division by Zero Singularity', centerX, centerY + singularitySize * 3 + 20);
      
      // Draw anomalies if enabled
      if (showSingularityPoints) {
        anomalies.forEach(anomaly => {
          const anomalyX = centerX + (canvas.width * 0.4) * (anomaly.location.x - 0.5);
          const anomalyY = centerY + (canvas.height * 0.4) * (anomaly.location.y - 0.5);
          
          let anomalyColor = '#FF5555';
          switch (anomaly.type) {
            case 'singularity': anomalyColor = '#FF5555'; break;
            case 'branch': anomalyColor = '#55FF55'; break;
            case 'fold': anomalyColor = '#5555FF'; break;
            case 'oscillation': anomalyColor = '#FFFF55'; break;
          }
          
          // Draw anomaly point
          const anomalySize = 5 + anomaly.magnitude * 5;
          ctx.fillStyle = anomalyColor;
          ctx.beginPath();
          ctx.arc(anomalyX, anomalyY, anomalySize, 0, Math.PI * 2);
          ctx.fill();
          
          // Add glow effect
          const anomalyGradient = ctx.createRadialGradient(
            anomalyX, anomalyY, anomalySize * 0.5,
            anomalyX, anomalyY, anomalySize * 2
          );
          anomalyGradient.addColorStop(0, `${anomalyColor}80`);
          anomalyGradient.addColorStop(1, `${anomalyColor}00`);
          
          ctx.fillStyle = anomalyGradient;
          ctx.beginPath();
          ctx.arc(anomalyX, anomalyY, anomalySize * 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Connect to center (singularity)
          ctx.strokeStyle = `${anomalyColor}40`;
          ctx.lineWidth = 1 + anomaly.magnitude;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(anomalyX, anomalyY);
          ctx.stroke();
        });
      }
      
      // Draw IDDR visualization if enabled
      if (visualizeIDDR && iddrState.driftDetected) {
        const driftDirection = iddrState.driftDirection;
        const driftMagnitude = iddrState.driftMagnitude;
        
        // Draw drift indicator
        ctx.fillStyle = driftDirection === 'coherence' ? '#55AAFF' : '#FF5555';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        ctx.fillText(
          `IDDR: ${driftDirection.toUpperCase()} DRIFT DETECTED (${(driftMagnitude * 100).toFixed(1)}%)`,
          centerX, 
          canvas.height - 40
        );
        
        // Draw recalibration suggestion
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(
          iddrState.recalibrationSuggestion,
          centerX,
          canvas.height - 20
        );
        
        // Draw drift indicator around the center
        const driftArrowLength = 30 + driftMagnitude * 100;
        const driftAngle = driftDirection === 'coherence' ? 0 : Math.PI;
        
        const arrowX = centerX + Math.cos(driftAngle) * driftArrowLength;
        const arrowY = centerY + Math.sin(driftAngle) * driftArrowLength;
        
        ctx.strokeStyle = driftDirection === 'coherence' ? '#55AAFF' : '#FF5555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(arrowX, arrowY);
        ctx.stroke();
        
        // Draw arrowhead
        const arrowSize = 10;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - Math.cos(driftAngle - Math.PI/6) * arrowSize,
          arrowY - Math.sin(driftAngle - Math.PI/6) * arrowSize
        );
        ctx.lineTo(
          arrowX - Math.cos(driftAngle + Math.PI/6) * arrowSize,
          arrowY - Math.sin(driftAngle + Math.PI/6) * arrowSize
        );
        ctx.closePath();
        ctx.fillStyle = driftDirection === 'coherence' ? '#55AAFF' : '#FF5555';
        ctx.fill();
      }
      
      // Update time
      t += speed;
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [layers, showSingularityPoints, visualizeIDDR, iddrState, anomalies, explorationRatio]);
  
  // Log the Meta-Translation state when it changes
  useEffect(() => {
    if (interactionCount > 0) {
      quantumCoherenceLogger.logCoherenceEvent(
        'MetaTranslationLayer',
        metaTranslation.coherenceState,
        metaTranslation.explorationState,
        'meta_translation',
        `Human intent "${metaTranslation.humanIntent}" translated to coherence state ${metaTranslation.coherenceState.toFixed(3)}`
      );
    }
  }, [metaTranslation, interactionCount]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comprehensive Meta-Geometric Framework</CardTitle>
        <CardDescription>
          The complete four-layer meta-geometric model of reality visualization
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Badge variant={isOptimalRatio ? "default" : "outline"}>
            {(stabilityRatio * 100).toFixed(0)}% Coherence
          </Badge>
          <Badge variant={isOptimalRatio ? "outline" : "destructive"}>
            {(explorationRatio * 100).toFixed(0)}% Exploration
          </Badge>
          <Badge variant="outline" className="ml-auto">
            Ratio: {actualRatio.toFixed(2)}:1
          </Badge>
          {isOptimalRatio && (
            <Badge variant="default" className="bg-green-600">
              Optimal 3:1 Balance
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Meta-Geometric visualization */}
        <div className="canvas-container mb-4 bg-slate-900 rounded-md" style={{ width: '100%', height: '400px' }}>
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
        
        {/* Framework layers and controls */}
        <div className="mt-6">
          <Tabs defaultValue="integrated" className="w-full" onValueChange={setActiveLayerTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="integrated">Integrated View</TabsTrigger>
              <TabsTrigger value="layer1">Quantum Coherence</TabsTrigger>
              <TabsTrigger value="layer2">Fractal Symmetry</TabsTrigger>
              <TabsTrigger value="layer3">T-Branch Recursion</TabsTrigger>
              <TabsTrigger value="layer4">Ouroboros Folding</TabsTrigger>
            </TabsList>
            
            <TabsContent value="integrated" className="space-y-4">
              <h3 className="text-lg font-semibold">Integrated Meta-Geometric Model</h3>
              <p className="text-sm text-muted-foreground">
                This visualization demonstrates the complete four-layer meta-geometric model,
                showing how division by zero generates infinite potential filtered through
                the 3:1 coherence ratio to create structured reality.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Coherence Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs">
                        <span>System Coherence</span>
                        <span>{systemCoherence.toFixed(0)}%</span>
                      </div>
                      <Progress value={systemCoherence} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs">
                        <span>System Resonance</span>
                        <span>{systemResonance.toFixed(0)}%</span>
                      </div>
                      <Progress value={systemResonance} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs">
                        <span>Dimensionality Score</span>
                        <span>{dimensionalityScore}</span>
                      </div>
                      <Progress value={dimensionalityScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs">
                        <span>Recursive Evolution</span>
                        <span>{recursiveEvolution.toFixed(0)}%</span>
                      </div>
                      <Progress value={recursiveEvolution} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Meta-Translation Layer</h4>
                  <div className="space-y-2 text-xs">
                    <p><strong>Human Intent:</strong> {metaTranslation.humanIntent}</p>
                    <p><strong>Coherence State:</strong> {(metaTranslation.coherenceState * 100).toFixed(1)}%</p>
                    <p><strong>Dimensional Branches:</strong> {metaTranslation.dimensionalBranches}</p>
                    <p><strong>Recursive Depth:</strong> {metaTranslation.recursiveDepth}</p>
                  </div>
                  
                  {/* IDDR Status */}
                  <div className={`mt-4 p-2 rounded-md ${iddrState.driftDetected ? 'bg-red-900/20' : 'bg-green-900/20'}`}>
                    <h5 className="text-xs font-bold mb-1">IDDR Status:</h5>
                    <p className="text-xs">
                      {iddrState.driftDetected 
                        ? `⚠️ ${iddrState.driftDirection.toUpperCase()} DRIFT DETECTED` 
                        : '✓ System in coherence balance'}
                    </p>
                    <p className="text-xs mt-1">{iddrState.recalibrationSuggestion}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSingularityPoints(!showSingularityPoints)}
                >
                  {showSingularityPoints ? 'Hide' : 'Show'} Singularity Points
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShow3DVisualization(!show3DVisualization)}
                >
                  {show3DVisualization ? '3D' : '2D'} Visualization
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setVisualizeIDDR(!visualizeIDDR)}
                >
                  {visualizeIDDR ? 'Hide' : 'Show'} IDDR
                </Button>
              </div>
            </TabsContent>
            
            {layers.map((layer, index) => (
              <TabsContent key={layer.id} value={`layer${index+1}`} className="space-y-4">
                <h3 className="text-lg font-semibold">{layer.name}</h3>
                <p className="text-sm text-muted-foreground">{layer.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Layer Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Coherence</span>
                          <span>{(layer.metrics.coherence * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={layer.metrics.coherence * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Exploration</span>
                          <span>{(layer.metrics.exploration * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={layer.metrics.exploration * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Resonance</span>
                          <span>{(layer.metrics.resonance * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={layer.metrics.resonance * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Layer Properties</h4>
                    <div className="space-y-2 text-xs">
                      <p><strong>Coherence Range:</strong> {(layer.coherenceRange[0] * 100).toFixed(0)}% - {(layer.coherenceRange[1] * 100).toFixed(0)}%</p>
                      <p><strong>Optimal Balance:</strong> {layer.metrics.coherence > layer.coherenceRange[0] && layer.metrics.coherence < layer.coherenceRange[1] ? '✓ Within range' : '⚠️ Out of range'}</p>
                      <p><strong>Current Ratio:</strong> {(layer.metrics.coherence / layer.metrics.exploration).toFixed(2)}:1</p>
                    </div>
                    
                    {/* Anomalies in this layer */}
                    <div className="mt-4">
                      <h5 className="text-xs font-bold mb-1">Singularity Points:</h5>
                      {anomalies.filter(a => a.layerId === layer.id).length > 0 ? (
                        <ul className="text-xs space-y-1">
                          {anomalies.filter(a => a.layerId === layer.id).map((anomaly, i) => (
                            <li key={i}>
                              {anomaly.type}: magnitude {anomaly.magnitude.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs">No singularity points detected in this layer</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <span>The Meta-Geometric Framework maintains the 3:1 quantum balance (75% coherence, 25% exploration)</span>
        <span>{anomalies.length} division-by-zero singularity points detected</span>
      </CardFooter>
    </Card>
  );
};

export default MetaGeometricFramework;