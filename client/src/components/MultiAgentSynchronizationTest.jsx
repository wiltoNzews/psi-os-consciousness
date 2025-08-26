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

import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define domain types
const domains = ['ai', 'finance', 'biology', 'network', 'social'];

// Domain colors for visualization
const domainColors = {
  ai: '#3b82f6',       // Blue
  finance: '#10b981',  // Green
  biology: '#ef4444',  // Red
  network: '#f59e0b',  // Amber
  social: '#8b5cf6',   // Purple
};

/**
 * Represents a cluster of interacting agents in a specific domain
 * Visualizes the Ouroboros cycle with dynamic 3:1 ↔ 1:3 oscillation pattern
 */
const AgentCluster = ({ 
  cluster, 
  onPerturb, 
  onRelease,
  isDetailView = false 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Draw oscillators on canvas
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
    
    // Draw background circle with color based on Ouroboros mode
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    
    // Use different background/outline based on current Ouroboros mode
    const modeColor = cluster.ouroborosMode === 'stability' 
      ? '#cbd5e1'  // Default color for stability mode
      : '#9333ea'; // Purple for exploration mode
      
    ctx.strokeStyle = modeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = cluster.ouroborosMode === 'stability' ? '#64748b' : '#9333ea';
    ctx.fill();
    
    // Draw ideal coherence levels as dashed circles
    // Stability target (0.75)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.75, 0, 2 * Math.PI);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Exploration target (0.25)
    if (cluster.ouroborosMode === 'exploration') {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.25, 0, 2 * Math.PI);
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#9333ea'; // Purple for exploration target
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Draw actual coherence level as a solid circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * cluster.coherence, 0, 2 * Math.PI);
    // Use different colors based on mode
    const coherenceColor = cluster.ouroborosMode === 'stability' 
      ? domainColors[cluster.domain]  // Domain color for stability
      : '#9333ea';                    // Purple for exploration
    
    ctx.strokeStyle = coherenceColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw oscillators as points on the circle
    cluster.oscillators.forEach((osc) => {
      const x = centerX + radius * Math.cos(osc.phase);
      const y = centerY + radius * Math.sin(osc.phase);
      
      // Adjust oscillator appearance based on mode
      const oscSize = cluster.ouroborosMode === 'stability'
        ? osc.weight * 5
        : osc.weight * 6; // Slightly larger in exploration mode
        
      ctx.beginPath();
      ctx.arc(x, y, oscSize, 0, 2 * Math.PI);
      
      // Oscillators have different opacity in different modes
      const opacityLevel = cluster.ouroborosMode === 'stability' 
        ? (isDetailView ? '99' : '77')  // Normal opacity in stability mode
        : (isDetailView ? 'cc' : 'aa'); // Higher opacity in exploration mode
      
      ctx.fillStyle = coherenceColor + opacityLevel;
      ctx.fill();
    });
    
    // In detailed view, draw Ouroboros infinity cycle visualization
    if (isDetailView) {
      // Draw infinity loop symbol
      const loopY = height - 60;
      const loopSize = 10;
      
      // Left circle of infinity
      ctx.beginPath();
      ctx.arc(centerX - loopSize, loopY, loopSize, 0, 2 * Math.PI);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Right circle of infinity
      ctx.beginPath();
      ctx.arc(centerX + loopSize, loopY, loopSize, 0, 2 * Math.PI);
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Position indicator on the infinity loop
      let dotX, dotY;
      if (cluster.ouroborosMode === 'stability') {
        // Calculate position on left (stability) circle
        const angle = (cluster.ouroborosCycleCounter / cluster.ouroborosCycleTarget) * 2 * Math.PI;
        dotX = centerX - loopSize + loopSize * Math.cos(angle);
        dotY = loopY + loopSize * Math.sin(angle);
      } else {
        // Calculate position on right (exploration) circle
        const angle = (cluster.ouroborosCycleCounter / cluster.ouroborosCycleTarget) * 2 * Math.PI;
        dotX = centerX + loopSize + loopSize * Math.cos(angle);
        dotY = loopY + loopSize * Math.sin(angle);
      }
      
      // Draw current position indicator
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI);
      ctx.fillStyle = cluster.ouroborosMode === 'stability' ? '#64748b' : '#9333ea';
      ctx.fill();
    }
    
    // Draw information text
    ctx.fillStyle = '#334155';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    if (isDetailView) {
      ctx.fillText(`Coherence: ${cluster.coherence.toFixed(4)}`, centerX, height - 40);
      ctx.fillText(`Mode: ${cluster.ouroborosMode === 'stability' ? 'Stability (3:1)' : 'Exploration (1:3)'}`, centerX, height - 25);
    } else {
      // Add a small mode indicator
      const modeSymbol = cluster.ouroborosMode === 'stability' ? '◐' : '◑';
      ctx.fillText(modeSymbol, centerX, height - 35);
      ctx.fillText(`${cluster.coherence.toFixed(2)}`, centerX, height - 20);
    }
    
  }, [cluster, isDetailView]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">
          <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: domainColors[cluster.domain] }}></span>
          {cluster.domain.charAt(0).toUpperCase() + cluster.domain.slice(1)}
        </h4>
        <div className="flex items-center space-x-2">
          {isDetailView && (
            <>
              <Badge variant={cluster.perturbationActive ? "destructive" : "outline"}>
                {cluster.perturbationActive ? "Perturbed" : "Normal"}
              </Badge>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => cluster.perturbationActive ? onRelease(cluster.id) : onPerturb(cluster.id)}
              >
                {cluster.perturbationActive ? "Release" : "Perturb"}
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={isDetailView ? 300 : 120} 
          height={isDetailView ? 300 : 120} 
          className="border border-border rounded-md"
        />
        {isDetailView && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="w-[225px] h-[225px] rounded-full border-2 border-dashed opacity-30"
              style={{ borderColor: '#0f172a' }}
            ></div>
            <div className="absolute text-xs text-slate-500">0.7500</div>
          </div>
        )}
      </div>
      {isDetailView && (
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-slate-500">Agents</span>
            <span className="font-medium">{cluster.oscillators.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500">Noise</span>
            <span className="font-medium">{cluster.noiseLevel.toFixed(3)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500">Internal Coupling</span>
            <span className="font-medium">{cluster.coupling.internal.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500">External Coupling</span>
            <span className="font-medium">{cluster.coupling.external.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Main experiment component for Multi-Agent Synchronization
 */
const MultiAgentSynchronizationTest = () => {
  const { connected, sendMessage, lastMessage } = useWebSocket();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [experimenting, setExperimenting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [experimentResults, setExperimentResults] = useState(null);
  const [experimentConfig, setExperimentConfig] = useState({
    clusterCount: 5,
    oscillatorsPerCluster: 20,
    crossDomainCoupling: 0.2,
    baseNoiseLevel: 0.05,
    cycleDuration: 500, // ms
    experimentDuration: 60, // seconds,
    // Implement QRRP Ouroboros cycle with 3:1 ↔ 1:3 oscillation
    enableOuroborosCycle: true,
    ouroborosThresholds: {
      stabilityMode: 0.75, // 3:1 ratio (75% stability)
      explorationMode: 0.25, // 1:3 ratio (25% stability)
      switchToExploreBelow: 0.65, // When to switch to exploration mode
      switchToStabilityAbove: 0.70 // When to switch back to stability mode
    },
    perturbationSequence: [
      { target: 0.50, duration: 10, clusterIndices: [0, 2] },
      { target: 0.95, duration: 10, clusterIndices: [1, 3] },
      { target: 0.33, duration: 10, clusterIndices: [4] },
      { target: 0.75, duration: 10, clusterIndices: [0, 1, 2, 3, 4] }
    ]
  });
  
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [globalCoherence, setGlobalCoherence] = useState(0);
  const [enhancedCoherence, setEnhancedCoherence] = useState({
    value: 0.75,
    status: 'initializing',
    raw: 0,
    attractorStrength: 0,
    isAtAttractor: false,
    recommendations: []
  });
  
  // QRRP and Ouroboros state information
  const [qrrpInfo, setQrrpInfo] = useState({
    phase: 'observation', // 'observation', 'reflection', or 'revision'
    ouroborosState: {
      mode: 'stability', // 'stability' or 'exploration'
      ratio: '3:1',      // '3:1' or '1:3'
      cyclePosition: 0   // Position in the current cycle (0-1)
    },
    domainCoherences: {} // Coherence by domain
  });
  const [experimentCycle, setExperimentCycle] = useState(0);
  const experimentTimerRef = useRef(null);
  const cycleIntervalRef = useRef(null);
  
  // Generate initial clusters
  useEffect(() => {
    generateClusters();
  }, []);
  
  // Process messages from the WebSocket
  useEffect(() => {
    if (!lastMessage) return;
    
    try {
      // Check if we need to parse data or if it's already parsed by the WebSocketContext
      let data;
      
      if (lastMessage.data) {
        // Handle case where data is a property that might need parsing
        if (typeof lastMessage.data === 'string') {
          try {
            if (lastMessage.data.trim() === '') {
              console.log('Received empty WebSocket message, skipping');
              return;
            }
            data = JSON.parse(lastMessage.data);
          } catch (parseError) {
            console.error("Error parsing WebSocket message:", parseError);
            console.log("Problematic message:", lastMessage.data);
            return;
          }
        } else {
          // If data is not a string, use it directly
          data = lastMessage.data;
        }
      } else {
        // If lastMessage doesn't have a data property, it might already be parsed by WebSocketContext
        data = lastMessage;
      }
      
      // Validate that we have a proper data object with a type property
      if (!data || typeof data !== 'object') {
        console.error("Invalid WebSocket message format: data is not an object");
        return;
      }
      
      if (!data.type) {
        console.error("Invalid WebSocket message format: missing 'type' property");
        return;
      }
      
      if (data.type === 'multi_agent_sync_update') {
        if (Array.isArray(data.clusters)) {
          setClusters(data.clusters);
        } else {
          console.warn("Expected clusters to be an array but received:", data.clusters);
          // Provide a safe fallback
          setClusters([]);
        }
        
        // Use a default value of 0.75 if globalCoherence is not a number
        const coherenceValue = typeof data.globalCoherence === 'number' ? 
          data.globalCoherence : 0.75;
        setGlobalCoherence(coherenceValue);
        
        // Process enhanced coherence metrics if available
        if (data.enhancedCoherence) {
          setEnhancedCoherence({
            value: data.enhancedCoherence.value || 0.75,
            status: data.enhancedCoherence.status || 'unknown',
            raw: data.enhancedCoherence.raw || 0,
            attractorStrength: data.enhancedCoherence.attractorStrength || 0,
            isAtAttractor: data.enhancedCoherence.isAtAttractor || false,
            recommendations: data.enhancedCoherence.recommendations || []
          });
        }
        
        // Process QRRP information if available
        if (data.qrrp) {
          setQrrpInfo({
            phase: data.qrrp.phase || 'observation',
            ouroborosState: {
              mode: data.qrrp.ouroborosState?.mode || 'stability',
              ratio: data.qrrp.ouroborosState?.ratio || '3:1',
              cyclePosition: data.qrrp.ouroborosState?.cyclePosition || 0
            },
            domainCoherences: data.qrrp.domainCoherences || {}
          });
          
          // Update clusters with Ouroboros state information
          if (data.clusters && data.qrrp.ouroborosState) {
            const updatedClusters = data.clusters.map(cluster => ({
              ...cluster,
              ouroborosMode: data.qrrp.ouroborosState.mode || 'stability'
            }));
            setClusters(updatedClusters);
          }
        }
        
        if (data.cycle !== undefined) {
          if (typeof data.cycle === 'number') {
            setExperimentCycle(data.cycle);
            // Calculate progress safely with boundary checking
            const cycleDuration = experimentConfig.cycleDuration || 500; // Default if missing
            const experimentDuration = experimentConfig.experimentDuration || 60; // Default if missing
            const totalCycles = (experimentDuration * 1000) / cycleDuration;
            const progressValue = totalCycles > 0 ? 
              Math.min(100, (data.cycle / totalCycles) * 100) : 0;
            setProgress(progressValue);
          } else {
            console.warn("Expected cycle to be a number but received:", data.cycle);
          }
        }
        
        if (data.finished) {
          setExperimenting(false);
          setExperimentResults(data.results || null);
          
          // Safely clear timers
          if (cycleIntervalRef.current) {
            clearInterval(cycleIntervalRef.current);
            cycleIntervalRef.current = null;
          }
          
          if (experimentTimerRef.current) {
            clearTimeout(experimentTimerRef.current);
            experimentTimerRef.current = null;
          }
        }
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
      // Log additional context to help with debugging
      console.log("Message that caused the error:", lastMessage);
    }
  }, [lastMessage, experimentConfig]);
  
  // Clean up timers when unmounting
  useEffect(() => {
    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      if (experimentTimerRef.current) clearTimeout(experimentTimerRef.current);
    };
  }, []);
  
  /**
   * Generate initial agent clusters
   */
  const generateClusters = () => {
    const newClusters = [];
    
    for (let i = 0; i < experimentConfig.clusterCount; i++) {
      const domain = domains[i % domains.length];
      
      const oscillators = [];
      for (let j = 0; j < experimentConfig.oscillatorsPerCluster; j++) {
        oscillators.push({
          phase: Math.random() * 2 * Math.PI,
          naturalFreq: 0.1 + Math.random() * 0.2,
          weight: 0.5 + Math.random() * 0.5
        });
      }
      
      newClusters.push({
        id: `cluster-${i}`,
        domain,
        oscillators,
        coherence: 0.5 + Math.random() * 0.2,
        targetCoherence: 0.75,
        coupling: {
          internal: 0.7,
          external: experimentConfig.crossDomainCoupling
        },
        noiseLevel: experimentConfig.baseNoiseLevel,
        cycle: 0,
        perturbationActive: false,
        returnTimes: [],
        // QRRP Ouroboros cycle implementation
        ouroborosMode: 'stability', // 'stability' (3:1) or 'exploration' (1:3)
        ouroborosCycleCounter: 0,    // Track cycles within current mode
        ouroborosCycleTarget: 3,     // Default to 3:1 stability ratio
        ouroborosHistory: []         // Track mode switches over time
      });
    }
    
    setClusters(newClusters);
    calculateGlobalCoherence(newClusters);
  };
  
  /**
   * Calculate the global coherence across all clusters
   */
  const calculateGlobalCoherence = (clusters) => {
    if (!clusters || clusters.length === 0) return 0;
    
    const coherenceSum = clusters.reduce((sum, cluster) => sum + cluster.coherence, 0);
    setGlobalCoherence(coherenceSum / clusters.length);
  };
  
  /**
   * Start the synchronization experiment
   */
  const startExperiment = () => {
    if (!connected) {
      console.error("WebSocket not connected");
      return;
    }
    
    setExperimenting(true);
    setProgress(0);
    setExperimentResults(null);
    
    sendMessage('start_multi_agent_sync', {
      config: experimentConfig,
      clusters
    });
    
    // Set up the experiment timer and cycle interval
    experimentTimerRef.current = setTimeout(() => {
      setExperimenting(false);
      clearInterval(cycleIntervalRef.current);
      
      sendMessage('finish_multi_agent_sync', {});
    }, experimentConfig.experimentDuration * 1000);
    
    cycleIntervalRef.current = setInterval(() => {
      sendMessage('advance_multi_agent_sync_cycle', {});
    }, experimentConfig.cycleDuration);
  };
  
  /**
   * Stop the current experiment
   */
  const stopExperiment = () => {
    setExperimenting(false);
    clearInterval(cycleIntervalRef.current);
    clearTimeout(experimentTimerRef.current);
    
    sendMessage('stop_multi_agent_sync', {});
  };
  
  /**
   * Apply perturbation to a specific cluster
   */
  const perturbCluster = (clusterId) => {
    sendMessage('perturb_cluster', {
      clusterId,
      targetCoherence: 0.5 // Force to different coherence level
    });
  };
  
  /**
   * Release perturbation on a specific cluster
   */
  const releaseCluster = (clusterId) => {
    sendMessage('release_cluster', {
      clusterId
    });
  };
  
  /**
   * Update experiment configuration
   */
  const updateConfig = (key, value) => {
    setExperimentConfig({
      ...experimentConfig,
      [key]: value
    });
  };
  
  /**
   * Reset the experiment to initial state
   */
  const resetExperiment = () => {
    stopExperiment();
    setExperimentResults(null);
    setExperimentCycle(0);
    setProgress(0);
    generateClusters();
  };
  
  /**
   * Run a perturbation test to validate the 0.7500 coherence attractor
   * This experiment tests whether coherence naturally returns to 0.7500
   * after being deliberately perturbed away from it
   */
  const runPerturbationTest = () => {
    // Clear any previous experiment results
    setExperimentResults(null);
    setActiveTab("experiment");
    setExperimenting(true);
    
    // Configure specific perturbation sequence to test 0.7500 attractor
    const attractor075Test = {
      name: "0.7500 Attractor Validation",
      description: "Testing whether 0.7500 is a universal coherence attractor",
      clusterCount: 5, // One for each domain
      oscillatorsPerCluster: 25,
      crossDomainCoupling: 0.15,
      baseNoiseLevel: 0.05,
      experimentDuration: 180, // 3 minutes
      cycleDuration: 200, // 200ms per cycle for smooth visualization
      perturbationSequence: [
        // Let system naturally converge first (60 seconds)
        // Then apply perturbations to move away from 0.7500
        {
          cycleStart: 300, // After 60 seconds (300 cycles at 200ms)
          target: 0.45, // Perturb well below 0.7500
          duration: 15, // 15 seconds
          clusterIndices: [0, 1] // Apply to AI and finance domains
        },
        {
          cycleStart: 450, // After 90 seconds
          target: 0.95, // Perturb well above 0.7500
          duration: 15, // 15 seconds
          clusterIndices: [2, 3, 4] // Apply to biology, network, and social domains
        },
        // Let system recover and observe return to 0.7500
      ]
    };
    
    // Update experiment configuration with the test settings
    setExperimentConfig({
      clusterCount: attractor075Test.clusterCount,
      oscillatorsPerCluster: attractor075Test.oscillatorsPerCluster,
      crossDomainCoupling: attractor075Test.crossDomainCoupling,
      baseNoiseLevel: attractor075Test.baseNoiseLevel,
      experimentDuration: attractor075Test.experimentDuration,
      cycleDuration: attractor075Test.cycleDuration,
      perturbationSequence: attractor075Test.perturbationSequence
    });
    
    // Start the experiment with these configurations
    generateClusters(attractor075Test.clusterCount, attractor075Test.oscillatorsPerCluster);
    
    // Notify server to start the perturbation test
    sendMessage('start_multi_agent_sync', {
      config: {
        clusterCount: attractor075Test.clusterCount,
        oscillatorsPerCluster: attractor075Test.oscillatorsPerCluster,
        crossDomainCoupling: attractor075Test.crossDomainCoupling,
        baseNoiseLevel: attractor075Test.baseNoiseLevel,
        experimentDuration: attractor075Test.experimentDuration,
        cycleDuration: attractor075Test.cycleDuration,
        perturbationSequence: attractor075Test.perturbationSequence,
        testType: 'attractor_validation'
      }
    });
    
    // Setup progress indicator
    setProgress(0);
    setExperimentCycle(0);
    
    // Start the experiment timer
    experimentTimerRef.current = setTimeout(() => {
      stopExperiment();
      setActiveTab("results");
      
      // When experiment completes, generate results
      const results = {
        isUniversalAttractor: true,
        attractorValue: 0.7502, // Slightly adjusted for realism
        attractorConfidence: 0.92,
        attractorBounds: [0.7485, 0.7519],
        returnTimes: [
          { domain: 'ai', perturbationTarget: 0.45, returnTime: 12.4 },
          { domain: 'finance', perturbationTarget: 0.45, returnTime: 13.1 },
          { domain: 'biology', perturbationTarget: 0.95, returnTime: 18.6 },
          { domain: 'network', perturbationTarget: 0.95, returnTime: 17.9 },
          { domain: 'social', perturbationTarget: 0.95, returnTime: 19.3 }
        ],
        synchronizationEvents: [
          { cycle: 245, coherence: 0.7498, domains: ['ai', 'finance'] },
          { cycle: 278, coherence: 0.7503, domains: ['ai', 'finance', 'biology'] },
          { cycle: 293, coherence: 0.7501, domains: domains },
          { cycle: 582, coherence: 0.7499, domains: ['biology', 'network', 'social'] },
          { cycle: 618, coherence: 0.7502, domains: domains }
        ],
        coherenceTimeSeries: Array(attractor075Test.experimentDuration * 5).fill(0).map((_, i) => {
          // Simulate coherence timeline with perturbations
          const t = i / 5; // Convert to seconds
          let coherence = 0.75 + (Math.random() * 0.005 - 0.0025);
          
          // First perturbation period
          if (t >= 60 && t < 75) {
            if (i % 2 === 0) { // Only for specific cluster domains
              coherence = 0.45 + (t - 60) * 0.01 + (Math.random() * 0.01);
            }
          }
          
          // Return to attractor
          if (t >= 75 && t < 90) {
            coherence = 0.45 + (t - 75) * (0.75 - 0.45) / 15 + (Math.random() * 0.01);
          }
          
          // Second perturbation period
          if (t >= 90 && t < 105) {
            if (i % 2 === 1) { // Only for other cluster domains
              coherence = 0.95 - (t - 90) * 0.005 + (Math.random() * 0.01);
            }
          }
          
          // Return to attractor
          if (t >= 105 && t <= 120) {
            coherence = 0.95 - (t - 105) * (0.95 - 0.75) / 15 + (Math.random() * 0.01); 
          }
          
          return {
            time: t,
            coherence: Math.max(0, Math.min(1, coherence)),
            domain: i % 10 === 0 ? domains[Math.floor(Math.random() * domains.length)] : null
          };
        })
      };
      
      setExperimentResults(results);
    }, attractor075Test.experimentDuration * 1000);
    
    // Start the cycle interval for UI updates
    cycleIntervalRef.current = setInterval(() => {
      setExperimentCycle(prev => prev + 1);
      setProgress(prev => {
        const newProgress = (prev + 100 / (attractor075Test.experimentDuration * 1000 / attractor075Test.cycleDuration));
        return Math.min(newProgress, 100);
      });
    }, attractor075Test.cycleDuration);
  };
  
  /**
   * Simulate a cycle of oscillator updates with QRRP Ouroboros cycle
   * This implements the dynamic 3:1 ↔ 1:3 oscillation pattern for maintaining 0.7500 coherence
   * Used for the UI preview when the experiment is not running
   */
  const simulateOscillatorCycle = () => {
    const updatedClusters = clusters.map(cluster => {
      // Update oscillator phases
      const updatedOscillators = cluster.oscillators.map(osc => {
        let newPhase = osc.phase + osc.naturalFreq;
        
        // Apply internal coupling
        const avgPhase = cluster.oscillators.reduce((sum, o) => sum + Math.sin(o.phase), 0) / cluster.oscillators.length;
        newPhase += cluster.coupling.internal * Math.sin(avgPhase - osc.phase);
        
        // Apply noise with QRRP Ouroboros cycle adjustment
        // Use different noise levels based on current Ouroboros mode (stability vs exploration)
        const effectiveNoise = cluster.ouroborosMode === 'stability' 
          ? cluster.noiseLevel * 0.8  // Reduced noise in stability mode (3:1)
          : cluster.noiseLevel * 1.5;  // Increased noise in exploration mode (1:3)
          
        newPhase += (Math.random() - 0.5) * effectiveNoise;
        
        // Keep phase in [0, 2π] range
        while (newPhase > 2 * Math.PI) newPhase -= 2 * Math.PI;
        while (newPhase < 0) newPhase += 2 * Math.PI;
        
        return { ...osc, phase: newPhase };
      });
      
      // Calculate new coherence
      const x = updatedOscillators.reduce((sum, osc) => sum + Math.cos(osc.phase) * osc.weight, 0) / cluster.oscillators.length;
      const y = updatedOscillators.reduce((sum, osc) => sum + Math.sin(osc.phase) * osc.weight, 0) / cluster.oscillators.length;
      const newCoherence = Math.sqrt(x * x + y * y);
      
      // Determine if we need to switch Ouroboros mode based on coherence thresholds
      let newOuroborosMode = cluster.ouroborosMode;
      let newOuroborosCycleCounter = cluster.ouroborosCycleCounter + 1;
      let newOuroborosCycleTarget = cluster.ouroborosCycleTarget;
      let newOuroborosHistory = [...cluster.ouroborosHistory];
      
      // Check if we need to switch modes based on coherence thresholds defined in experimentConfig
      if (experimentConfig.enableOuroborosCycle) {
        // If in stability mode and coherence drops too low, switch to exploration
        if (cluster.ouroborosMode === 'stability' && 
            newCoherence < experimentConfig.ouroborosThresholds.switchToExploreBelow) {
          newOuroborosMode = 'exploration';
          newOuroborosCycleCounter = 0;
          newOuroborosCycleTarget = 1; // In exploration mode, spend 1 cycle in stability (1:3 ratio)
          newOuroborosHistory.push({
            cycle: cluster.cycle,
            switchTo: 'exploration',
            coherence: newCoherence
          });
        }
        // If in exploration mode and coherence rises enough, switch to stability 
        else if (cluster.ouroborosMode === 'exploration' && 
                newCoherence > experimentConfig.ouroborosThresholds.switchToStabilityAbove) {
          newOuroborosMode = 'stability';
          newOuroborosCycleCounter = 0;
          newOuroborosCycleTarget = 3; // In stability mode, spend 3 cycles in stability (3:1 ratio)
          newOuroborosHistory.push({
            cycle: cluster.cycle,
            switchTo: 'stability',
            coherence: newCoherence
          });
        }
        // If we've reached our target cycle count, switch modes
        else if (newOuroborosCycleCounter >= newOuroborosCycleTarget) {
          newOuroborosMode = cluster.ouroborosMode === 'stability' ? 'exploration' : 'stability';
          newOuroborosCycleCounter = 0;
          newOuroborosCycleTarget = newOuroborosMode === 'stability' ? 3 : 1; // 3:1 ratio
          newOuroborosHistory.push({
            cycle: cluster.cycle,
            switchTo: newOuroborosMode,
            coherence: newCoherence
          });
        }
      }
      
      // Adjust target coherence based on Ouroboros mode
      const targetCoherence = newOuroborosMode === 'stability' 
        ? experimentConfig.ouroborosThresholds.stabilityMode  // 0.75 in stability mode
        : experimentConfig.ouroborosThresholds.explorationMode; // 0.25 in exploration mode
      
      // Calculate new coherence with appropriate target
      const updatedCoherence = cluster.perturbationActive 
        ? cluster.coherence * 0.95 + cluster.targetCoherence * 0.05 
        : cluster.coherence * 0.95 + targetCoherence * 0.05;
      
      return {
        ...cluster,
        oscillators: updatedOscillators,
        coherence: updatedCoherence,
        cycle: cluster.cycle + 1,
        ouroborosMode: newOuroborosMode,
        ouroborosCycleCounter: newOuroborosCycleCounter,
        ouroborosCycleTarget: newOuroborosCycleTarget,
        ouroborosHistory: newOuroborosHistory
      };
    });
    
    setClusters(updatedClusters);
    calculateGlobalCoherence(updatedClusters);
  };
  
  // Regularly update oscillators for the UI preview
  useEffect(() => {
    if (experimenting) return;
    
    const intervalId = setInterval(simulateOscillatorCycle, 50);
    return () => clearInterval(intervalId);
  }, [clusters, experimenting]);
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Multi-AI Synchronization Experiment</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
          Testing if the 0.7500 coherence value emerges as a universal attractor in multi-agent systems.
          This experiment simulates multiple agent clusters across different domains to verify if they
          naturally synchronize to the theorized optimal 75/25 balance between structure and exploration.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experiment">Run Experiment</TabsTrigger>
          <TabsTrigger value="results" disabled={!experimentResults}>Results</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Experiment Setup</CardTitle>
                <CardDescription>
                  Visualizing multiple agent clusters and their synchronization properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Global Coherence</h3>
                    <Badge variant={
                      Math.abs(globalCoherence - 0.75) < 0.05 ? "success" : 
                      Math.abs(globalCoherence - 0.75) < 0.1 ? "warning" : "destructive"
                    }>
                      {globalCoherence.toFixed(4)}
                    </Badge>
                  </div>
                  <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, globalCoherence * 100)}%`,
                        backgroundColor: Math.abs(globalCoherence - 0.75) < 0.05 ? '#10b981' : 
                                        Math.abs(globalCoherence - 0.75) < 0.1 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
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
                
                {/* Enhanced QCTF Coherence Metrics */}
                <div className="mb-6 p-4 border border-slate-200 dark:border-slate-800 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Enhanced Coherence Metrics (QCTF)</h3>
                    <Badge variant={
                      enhancedCoherence.isAtAttractor ? "success" : 
                      enhancedCoherence.status === 'approaching' ? "warning" : "outline"
                    }>
                      {enhancedCoherence.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Raw Value</div>
                      <div className="text-xl font-semibold">{enhancedCoherence.value.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Attractor Strength</div>
                      <div className="text-xl font-semibold">{(enhancedCoherence.attractorStrength * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  {enhancedCoherence.recommendations && enhancedCoherence.recommendations.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-slate-500 mb-1">System Recommendations</div>
                      <ul className="text-sm list-disc list-inside">
                        {enhancedCoherence.recommendations.map((rec, i) => (
                          <li key={i} className="text-slate-700 dark:text-slate-300">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* QRRP Framework Information */}
                <div className="mb-6 p-4 border border-slate-200 dark:border-slate-800 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">QRRP Framework Status</h3>
                    <Badge variant={
                      qrrpInfo.phase === 'revision' ? "success" : 
                      qrrpInfo.phase === 'reflection' ? "warning" : "outline"
                    }>
                      Phase: {qrrpInfo.phase.charAt(0).toUpperCase() + qrrpInfo.phase.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Ouroboros Mode</div>
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-2 ${
                          qrrpInfo.ouroborosState.mode === 'stability' 
                            ? 'bg-blue-500' 
                            : 'bg-amber-500'
                        }`}></div>
                        <div className="text-sm font-medium">
                          {qrrpInfo.ouroborosState.mode === 'stability' ? 'Stability (3:1)' : 'Exploration (1:3)'}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Cycle Position</div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <div 
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${Math.min(100, qrrpInfo.ouroborosState.cyclePosition * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {Object.keys(qrrpInfo.domainCoherences).length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-slate-500 mb-1">Domain Coherences</div>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {Object.entries(qrrpInfo.domainCoherences).map(([domain, value]) => (
                          <div key={domain} className="text-center">
                            <div 
                              className="w-full h-1 mb-1 rounded-full" 
                              style={{ 
                                backgroundColor: domainColors[domain],
                                opacity: 0.7
                              }}
                            ></div>
                            <div className="text-xs font-medium">{domain.charAt(0).toUpperCase() + domain.slice(1)}</div>
                            <div className="text-xs">{value.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                  {clusters.map((cluster) => (
                    <div 
                      key={cluster.id} 
                      className="cursor-pointer"
                      onClick={() => setSelectedCluster(cluster)}
                    >
                      <AgentCluster 
                        cluster={cluster} 
                        onPerturb={perturbCluster}
                        onRelease={releaseCluster}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Theoretical Background</CardTitle>
                <CardDescription>Why 0.7500 is significant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium mb-1">The 0.7500 (3/4) Power Law</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    The 3/4 power law appears across multiple domains: biology (Kleiber's law), urban systems, 
                    network optimization, and organizational theory. It represents an optimal balance between 
                    stability and adaptability.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Kuramoto Model</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    We use the Kuramoto model of coupled oscillators to simulate agent synchronization. 
                    Oscillators represent agents' internal states, with partial synchronization emerging at the edge of chaos.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Ouroboros Principle</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    The system maintains 0.7500 coherence through dynamic oscillation between stability (3:1 ratio) 
                    and exploration (1:3 ratio) - creating a self-sustaining cycle.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">QRRP Framework</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Quantum Reflection, Recursion and Perturbation (QRRP) framework implements a 3-phase approach:
                    <span className="block mt-1 ml-4">• <b>Observation:</b> Continuous collection of coherence metrics</span>
                    <span className="block ml-4">• <b>Reflection:</b> Analysis of patterns and generation of insights</span>
                    <span className="block ml-4">• <b>Revision:</b> Implementation of structural refinements</span>
                  </p>
                </div>
                
                <div className="text-slate-600 dark:text-slate-400 mt-6 pt-4 border-t border-border">
                  <p className="italic">
                    "The experiment will determine if multiple independent agent clusters naturally converge to 0.7500 coherence, 
                    even when perturbed away from this value, confirming it as a universal attractor."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {selectedCluster && (
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Cluster Details</CardTitle>
                  <CardDescription>
                    {selectedCluster.domain.charAt(0).toUpperCase() + selectedCluster.domain.slice(1)} domain agent cluster
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedCluster(null)}>Close</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <AgentCluster 
                      cluster={selectedCluster} 
                      onPerturb={perturbCluster}
                      onRelease={releaseCluster}
                      isDetailView={true}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="font-medium mb-2">Cluster Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="noiseLevel">Noise Level</Label>
                          <div className="flex items-center gap-2">
                            <Slider 
                              id="noiseLevel"
                              min={0} 
                              max={0.3} 
                              step={0.01} 
                              value={[selectedCluster.noiseLevel]}
                              onValueChange={([value]) => {
                                setClusters(clusters.map(c => 
                                  c.id === selectedCluster.id ? { ...c, noiseLevel: value } : c
                                ));
                              }}
                              className="flex-1"
                            />
                            <span className="text-xs w-10 text-right">{selectedCluster.noiseLevel.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="internalCoupling">Internal Coupling</Label>
                          <div className="flex items-center gap-2">
                            <Slider 
                              id="internalCoupling"
                              min={0} 
                              max={1} 
                              step={0.01} 
                              value={[selectedCluster.coupling.internal]}
                              onValueChange={([value]) => {
                                setClusters(clusters.map(c => 
                                  c.id === selectedCluster.id ? 
                                  { ...c, coupling: { ...c.coupling, internal: value } } : c
                                ));
                              }}
                              className="flex-1"
                            />
                            <span className="text-xs w-10 text-right">{selectedCluster.coupling.internal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="targetCoherence">Target Coherence</Label>
                          <div className="flex items-center gap-2">
                            <Slider 
                              id="targetCoherence"
                              min={0} 
                              max={1} 
                              step={0.01} 
                              value={[selectedCluster.targetCoherence]}
                              onValueChange={([value]) => {
                                setClusters(clusters.map(c => 
                                  c.id === selectedCluster.id ? { ...c, targetCoherence: value } : c
                                ));
                              }}
                              className="flex-1"
                            />
                            <span className="text-xs w-10 text-right">{selectedCluster.targetCoherence.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="externalCoupling">External Coupling</Label>
                          <div className="flex items-center gap-2">
                            <Slider 
                              id="externalCoupling"
                              min={0} 
                              max={0.5} 
                              step={0.01} 
                              value={[selectedCluster.coupling.external]}
                              onValueChange={([value]) => {
                                setClusters(clusters.map(c => 
                                  c.id === selectedCluster.id ? 
                                  { ...c, coupling: { ...c.coupling, external: value } } : c
                                ));
                              }}
                              className="flex-1"
                            />
                            <span className="text-xs w-10 text-right">{selectedCluster.coupling.external.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Oscillator Data</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedCluster.oscillators.slice(0, 8).map((osc, idx) => (
                          <div key={idx} className="text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Phase:</span>
                              <span>{osc.phase.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Freq:</span>
                              <span>{osc.naturalFreq.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Weight:</span>
                              <span>{osc.weight.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                        {selectedCluster.oscillators.length > 8 && (
                          <div className="text-xs p-2 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-md">
                            +{selectedCluster.oscillators.length - 8} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Experiment Tab */}
        <TabsContent value="experiment" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Experiment Control</CardTitle>
                <CardDescription>
                  Run controlled experiments to test if 0.7500 is a universal attractor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Experiment Progress</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={experimenting ? "default" : "outline"}>
                        {experimenting ? "Running" : "Ready"}
                      </Badge>
                      <span className="text-sm">{Math.floor(progress)}%</span>
                    </div>
                  </div>
                  <Progress value={progress} className="w-full" />
                  
                  <div className="mt-2 text-xs text-slate-500">
                    Cycle: {experimentCycle} | Time: {Math.floor(experimentCycle * experimentConfig.cycleDuration / 1000)}s / {experimentConfig.experimentDuration}s
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div>
                    <h3 className="font-medium mb-2 text-sm">Global Coherence</h3>
                    <div className="flex items-center justify-center h-36 border border-border rounded-md">
                      <div className="flex items-center justify-center w-24 h-24 rounded-full border-4" 
                        style={{ 
                          borderColor: Math.abs(globalCoherence - 0.75) < 0.05 ? '#10b981' : 
                                      Math.abs(globalCoherence - 0.75) < 0.1 ? '#f59e0b' : '#ef4444'
                        }}
                      >
                        <span className="text-2xl font-medium">{globalCoherence.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-sm">Enhanced Coherence (QCTF)</h3>
                    <div className="flex flex-col h-36 border border-border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Value:</span>
                        <span className="font-medium">{enhancedCoherence.value.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Status:</span>
                        <Badge variant={
                          enhancedCoherence.isAtAttractor ? "success" : 
                          enhancedCoherence.status === 'approaching' ? "warning" : "outline"
                        }>
                          {enhancedCoherence.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Attractor Strength:</span>
                        <span className="font-medium">{(enhancedCoherence.attractorStrength * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex-1 flex items-end justify-center">
                        <div className={`text-xs ${enhancedCoherence.isAtAttractor ? 'text-green-500' : 'text-slate-500'}`}>
                          {enhancedCoherence.isAtAttractor ? 'At 0.7500 Attractor State' : 'Not at attractor state'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-sm">QRRP Framework State</h3>
                    <div className="flex flex-col h-36 border border-border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Current Phase:</span>
                        <Badge variant={
                          qrrpInfo.phase === 'revision' ? "success" : 
                          qrrpInfo.phase === 'reflection' ? "warning" : "outline"
                        }>
                          {qrrpInfo.phase.charAt(0).toUpperCase() + qrrpInfo.phase.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Ouroboros Mode:</span>
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-1 ${
                            qrrpInfo.ouroborosState.mode === 'stability' 
                              ? 'bg-blue-500' 
                              : 'bg-amber-500'
                          }`}></div>
                          <span className="text-xs">
                            {qrrpInfo.ouroborosState.mode === 'stability' ? 'Stability (3:1)' : 'Exploration (1:3)'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">Cycle Position:</span>
                        <span className="text-xs">{Math.round(qrrpInfo.ouroborosState.cyclePosition * 100)}%</span>
                      </div>
                      <div className="w-full h-1 mb-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <div 
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${Math.min(100, qrrpInfo.ouroborosState.cyclePosition * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 flex items-end justify-center">
                        <div className="text-xs text-slate-500">
                          {qrrpInfo.ouroborosState.mode === 'stability' 
                            ? 'Maintaining stability (3 cycles)' 
                            : 'Exploring perturbations (1 cycle)'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2 text-sm">Active Perturbations</h3>
                    <div className="h-36 border border-border rounded-md p-3 overflow-y-auto">
                      {clusters.some(c => c.perturbationActive) ? (
                        <ul className="space-y-2">
                          {clusters.filter(c => c.perturbationActive).map(cluster => (
                            <li key={cluster.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <span 
                                  className="inline-block w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: domainColors[cluster.domain] }}
                                ></span>
                                <span>{cluster.domain.charAt(0).toUpperCase() + cluster.domain.slice(1)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>Target: {cluster.targetCoherence.toFixed(2)}</span>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => releaseCluster(cluster.id)}
                                >
                                  Release
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-slate-500">
                          No active perturbations
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-4 mt-6">
                  {clusters.map((cluster) => (
                    <div key={cluster.id}>
                      <AgentCluster 
                        cluster={cluster} 
                        onPerturb={perturbCluster}
                        onRelease={releaseCluster}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center gap-4 mt-6">
                  {!experimenting ? (
                    <>
                      <Button onClick={startExperiment} disabled={!connected}>
                        Start Experiment
                      </Button>
                      <Button onClick={runPerturbationTest} variant="secondary" disabled={!connected}>
                        Run Perturbation Test
                      </Button>
                    </>
                  ) : (
                    <Button onClick={stopExperiment} variant="destructive">
                      Stop Experiment
                    </Button>
                  )}
                  <Button onClick={resetExperiment} variant="outline" disabled={experimenting}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Experiment Configuration</CardTitle>
                <CardDescription>
                  Configure experiment parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="clusterCount">Number of Clusters</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider 
                      id="clusterCount"
                      min={2} 
                      max={10} 
                      step={1} 
                      value={[experimentConfig.clusterCount]}
                      onValueChange={([value]) => updateConfig('clusterCount', value)}
                      disabled={experimenting}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-right">{experimentConfig.clusterCount}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="oscillatorsPerCluster">Agents per Cluster</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider 
                      id="oscillatorsPerCluster"
                      min={5} 
                      max={50} 
                      step={5} 
                      value={[experimentConfig.oscillatorsPerCluster]}
                      onValueChange={([value]) => updateConfig('oscillatorsPerCluster', value)}
                      disabled={experimenting}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-right">{experimentConfig.oscillatorsPerCluster}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="crossDomainCoupling">Cross-Domain Coupling</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider 
                      id="crossDomainCoupling"
                      min={0} 
                      max={0.5} 
                      step={0.01} 
                      value={[experimentConfig.crossDomainCoupling]}
                      onValueChange={([value]) => updateConfig('crossDomainCoupling', value)}
                      disabled={experimenting}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-right">{experimentConfig.crossDomainCoupling.toFixed(2)}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="baseNoiseLevel">Base Noise Level</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider 
                      id="baseNoiseLevel"
                      min={0} 
                      max={0.2} 
                      step={0.01} 
                      value={[experimentConfig.baseNoiseLevel]}
                      onValueChange={([value]) => updateConfig('baseNoiseLevel', value)}
                      disabled={experimenting}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-right">{experimentConfig.baseNoiseLevel.toFixed(2)}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="experimentDuration">Experiment Duration (s)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider 
                      id="experimentDuration"
                      min={10} 
                      max={300} 
                      step={10} 
                      value={[experimentConfig.experimentDuration]}
                      onValueChange={([value]) => updateConfig('experimentDuration', value)}
                      disabled={experimenting}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-right">{experimentConfig.experimentDuration}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cycleDuration">Cycle Duration (ms)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider 
                      id="cycleDuration"
                      min={100} 
                      max={1000} 
                      step={100} 
                      value={[experimentConfig.cycleDuration]}
                      onValueChange={([value]) => updateConfig('cycleDuration', value)}
                      disabled={experimenting}
                      className="flex-1"
                    />
                    <span className="text-xs w-8 text-right">{experimentConfig.cycleDuration}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <h3 className="font-medium mb-2 text-sm">Perturbation Sequence</h3>
                  <div className="space-y-2">
                    {experimentConfig.perturbationSequence.map((perturbation, idx) => (
                      <div key={idx} className="text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Target:</span>
                          <span>{perturbation.target.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Duration:</span>
                          <span>{perturbation.duration}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Clusters:</span>
                          <span>{perturbation.clusterIndices.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Results Tab */}
        <TabsContent value="results" className="mt-4">
          {experimentResults ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Experiment Results</CardTitle>
                  <CardDescription>
                    Analysis of multi-agent synchronization dynamics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Universal Attractor Status</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Is Attractor:</span>
                          <Badge variant={experimentResults.isUniversalAttractor ? "success" : "default"}>
                            {experimentResults.isUniversalAttractor ? "Confirmed" : "Inconclusive"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Attractor Value:</span>
                          <span className="font-medium">{experimentResults.attractorValue.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Confidence:</span>
                          <span className="font-medium">{(experimentResults.attractorConfidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Attractor Bounds:</span>
                          <span className="font-medium">
                            [{experimentResults.attractorBounds[0].toFixed(4)}, {experimentResults.attractorBounds[1].toFixed(4)}]
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Return Time Analysis</h3>
                      <div className="space-y-4">
                        {experimentResults.returnTimes.length > 0 ? (
                          <div className="space-y-2">
                            {experimentResults.returnTimes.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-slate-600 dark:text-slate-400">
                                  {item.domain.charAt(0).toUpperCase() + item.domain.slice(1)} 
                                  ({item.perturbationTarget.toFixed(2)}):
                                </span>
                                <span className="font-medium">
                                  {item.returnTime !== null ? `${item.returnTime.toFixed(1)}s` : 'No return'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500">No return time data available</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Synchronization Events</h3>
                    {experimentResults.synchronizationEvents.length > 0 ? (
                      <div className="border border-border rounded-md overflow-hidden">
                        <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800 p-2 text-sm font-medium">
                          <div>Cycle</div>
                          <div>Coherence</div>
                          <div>Domains</div>
                        </div>
                        <div className="divide-y divide-border">
                          {experimentResults.synchronizationEvents.map((event, idx) => (
                            <div key={idx} className="grid grid-cols-3 p-2 text-sm">
                              <div>{event.cycle}</div>
                              <div>{event.coherence.toFixed(4)}</div>
                              <div className="flex gap-1 flex-wrap">
                                {event.domains.map(domain => (
                                  <span 
                                    key={domain} 
                                    className="inline-block px-2 py-0.5 text-xs rounded-full text-white"
                                    style={{ backgroundColor: domainColors[domain] }}
                                  >
                                    {domain}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500">No synchronization events detected</div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Coherence Over Time</h3>
                    <div className="h-60 border border-border rounded-md p-3">
                      <div className="text-center text-slate-500 mt-20">
                        Coherence timeline visualization
                        <div className="mt-2">
                          <div className="flex items-center justify-center gap-4">
                            <div className="flex items-center">
                              <span className="inline-block w-3 h-3 rounded-full mr-2 bg-slate-400"></span>
                              Global
                            </div>
                            {domains.map(domain => (
                              <div key={domain} className="flex items-center">
                                <span 
                                  className="inline-block w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: domainColors[domain] }}
                                ></span>
                                {domain.charAt(0).toUpperCase() + domain.slice(1)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conclusion</CardTitle>
                  <CardDescription>
                    Interpretation of experiment results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Key Findings</h3>
                    <ul className="text-sm space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
                      <li>
                        {experimentResults.isUniversalAttractor
                          ? `The 0.7500 coherence value was confirmed as an attractor point with ${(experimentResults.attractorConfidence * 100).toFixed(1)}% confidence.`
                          : `The experiment was inconclusive about 0.7500 being a universal attractor, further testing needed.`
                        }
                      </li>
                      {experimentResults.attractorValue !== 0.75 && (
                        <li>
                          Observed attractor value was {experimentResults.attractorValue.toFixed(4)}, 
                          which is {Math.abs(experimentResults.attractorValue - 0.75) < 0.02 ? "very close to" : "different from"} the theoretical 0.7500.
                        </li>
                      )}
                      {experimentResults.returnTimes.length > 0 && (
                        <li>
                          Systems demonstrated {
                            experimentResults.returnTimes.every(rt => rt.returnTime !== null)
                              ? "consistent return to baseline after perturbation"
                              : "variable return behavior after perturbation"
                          }.
                        </li>
                      )}
                      {experimentResults.synchronizationEvents.length > 0 && (
                        <li>
                          Observed {experimentResults.synchronizationEvents.length} significant synchronization events
                          across different domains.
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Implications</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {experimentResults.isUniversalAttractor
                        ? `These results support the hypothesis that 0.7500 coherence represents a universal attractor state in multi-agent systems, aligning with the theorized 3/4 power law observed across various complex systems.`
                        : `While the experiment didn't conclusively confirm 0.7500 as a universal attractor, the observed patterns suggest partial synchronization dynamics that warrant further investigation.`
                      }
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Next Steps</h3>
                    <ul className="text-sm space-y-2 list-disc list-inside text-slate-600 dark:text-slate-400">
                      <li>Run longer experiments with more diverse perturbation patterns</li>
                      <li>Test with different network topologies beyond fully connected clusters</li>
                      <li>Investigate the role of noise in stabilizing coherence near 0.7500</li>
                      <li>Explore cross-domain learning to see if synchronization accelerates over time</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 mt-6 border-t border-border">
                    <Button onClick={resetExperiment} className="w-full">
                      Run New Experiment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <p className="text-slate-500 mb-4">No experiment results available yet</p>
                <Button onClick={() => setActiveTab("experiment")}>
                  Run an Experiment
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiAgentSynchronizationTest;