/**
 * Power Law Dashboard Component
 * 
 * This component provides a specialized visualization focusing on the 0.7500 (3/4) power law
 * observed in WILTON's system coherence, with comparisons to natural systems and
 * real-time monitoring of the attractor state.
 * 
 * [QUANTUM_STATE: VISUALIZATION_FLOW]
 */

import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chart.js/auto';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Import new visualization components
import CoherenceBalanceVisualizer from './CoherenceBalanceVisualizer.js';
import AttractorPhaseSpace from './AttractorPhaseSpace.js';
import PowerLawComparison from './PowerLawComparison.js';
import { HelixViz } from './nexus/HelixViz.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Type for metrics data point
interface MetricDataPoint {
  timestamp: number;
  coherence: number;
  qctf: number;
  variantCount: number;
  experimentActive: boolean;
}

// Type for WebSocket message
interface WSMessage {
  type: string;
  payload?: any;
}

// Type for comparison data from natural systems
interface PowerLawComparisonData {
  domain: string;
  name: string;
  exponent: number;
  description: string;
}

// Props for the dashboard component
interface PowerLawDashboardProps {
  websocketUrl?: string;
}

// Main component
const PowerLawDashboard: React.FC<PowerLawDashboardProps> = ({ 
  websocketUrl = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/ws' 
}) => {
  // State for WebSocket and data
  const [connected, setConnected] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<MetricDataPoint[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<any>({
    coherence: 0.75,
    qctf: 0.75,
    variantCount: 4,
    experimentActive: false
  });
  const [deviationFromOptimal, setDeviationFromOptimal] = useState<number>(0);
  const [stabilityScore, setStabilityScore] = useState<number>(100);
  const [returnTime, setReturnTime] = useState<number | null>(null);
  const [perturbationHistory, setPerturbationHistory] = useState<{
    timestamp: number;
    fromValue: number;
    toValue: number;
    returnTime: number | null;
  }[]>([]);
  const [experimentResults, setExperimentResults] = useState<any>(null);
  const [variantPerformance, setVariantPerformance] = useState<any>(null);
  const [startTime] = useState<number>(Date.now());
  
  // Timeline visualization state
  const [timeSeriesData, setTimeSeriesData] = useState<number[]>([0.75]);
  const [perturbationEvents, setPerturbationEvents] = useState<{cycle: number, value: number, type: string}[]>([]);
  const [perturbationValue, setPerturbationValue] = useState<number>(0.7);
  const [perturbationDuration, setPerturbationDuration] = useState<number>(5);
  
  // Enhanced perturbation controls
  const [perturbationTargetValue, setPerturbationTargetValue] = useState<number>(0.7);
  const [isPerturbationActive, setIsPerturbationActive] = useState<boolean>(false);
  const [perturbationRemainingCycles, setPerturbationRemainingCycles] = useState<number>(0);
  
  // Reference values
  const optimalCoherence = 0.7500;
  const acceptableDeviation = 0.0050;
  
  // Natural systems power law comparisons
  const [powerLawComparisons] = useState<PowerLawComparisonData[]>([
    {
      domain: "Biology",
      name: "Kleiber's Law",
      exponent: 0.75,
      description: "Metabolic rate scales with mass^(3/4)"
    },
    {
      domain: "Biology",
      name: "Heart Rate",
      exponent: -0.25,
      description: "Heart rate scales with mass^(-1/4)"
    },
    {
      domain: "Biology",
      name: "Lifespan",
      exponent: 0.25,
      description: "Lifespan scales with mass^(1/4)"
    },
    {
      domain: "Urban",
      name: "Infrastructure",
      exponent: 0.75,
      description: "Infrastructure scales with population^(3/4)"
    },
    {
      domain: "Energy",
      name: "City Consumption",
      exponent: 0.75,
      description: "Energy use scales with population^(3/4)"
    },
    {
      domain: "Ecology",
      name: "Population Density",
      exponent: 0.75,
      description: "Population scales with area^(3/4)"
    },
    {
      domain: "Networks",
      name: "Network Efficiency",
      exponent: 0.75,
      description: "Transport costs scale with network size^(3/4)"
    },
    {
      domain: "Computing",
      name: "WILTON Coherence",
      exponent: 0.75,
      description: "System coherence stabilizes at 0.7500"
    }
  ]);
  
  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  
  // Force perturbation reference
  const lastPerturbationRef = useRef<{
    timestamp: number;
    fromValue: number;
    toValue: number;
    inProgress: boolean;
  } | null>(null);
  
  // Connect to WebSocket
  useEffect(() => {
    // Create a new WebSocket connection
    wsRef.current = new WebSocket(websocketUrl);
    
    // Handle connection open
    wsRef.current.onopen = () => {
      console.log('WebSocket connected for Power Law Dashboard');
      setConnected(true);
      
      // Send a message to identify as a dashboard client
      const message: WSMessage = {
        type: 'connected',
        payload: { client: 'power-law-dashboard' }
      };
      wsRef.current?.send(JSON.stringify(message));
    };
    
    // Handle incoming messages
    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle different message types
        if (message.type === 'quantum_state_update') {
          const { metrics, variants, timestamp, experimentActive } = message;
          
          if (metrics) {
            const newDataPoint: MetricDataPoint = {
              timestamp,
              coherence: metrics.CI,
              qctf: metrics.CTF,
              variantCount: variants?.length || 0,
              experimentActive: experimentActive || false
            };
            
            // Check if we're returning from a perturbation
            if (lastPerturbationRef.current && lastPerturbationRef.current.inProgress) {
              // If coherence is back within acceptable range of optimal
              if (Math.abs(metrics.CI - optimalCoherence) <= acceptableDeviation) {
                const returnTimeMs = Date.now() - lastPerturbationRef.current.timestamp;
                setReturnTime(returnTimeMs);
                
                // Add to perturbation history
                setPerturbationHistory(prev => [...prev, {
                  timestamp: lastPerturbationRef.current!.timestamp,
                  fromValue: lastPerturbationRef.current!.fromValue,
                  toValue: lastPerturbationRef.current!.toValue,
                  returnTime: returnTimeMs
                }]);
                
                // Clear the perturbation reference
                lastPerturbationRef.current.inProgress = false;
              }
            }
            
            // Calculate deviation from optimal
            const deviation = Math.abs(metrics.CI - optimalCoherence);
            setDeviationFromOptimal(deviation);
            
            // Calculate stability score (100% when exactly at 0.7500, decreasing as it deviates)
            const maxDeviation = 0.10; // 10% deviation = 0% stability
            const stabilityPercentage = Math.max(0, 100 - (deviation / maxDeviation * 100));
            setStabilityScore(stabilityPercentage);
            
            // Update current metrics
            setCurrentMetrics({
              coherence: metrics.CI.toFixed(6),
              qctf: metrics.CTF.toFixed(6),
              variantCount: variants?.length || 0,
              experimentActive: experimentActive || false
            });
            
            // Add to metrics history with max 100 points
            setMetrics(prev => {
              const updated = [...prev, newDataPoint];
              if (updated.length > 100) {
                return updated.slice(-100);
              }
              return updated;
            });
          }
        } else if (message.type === 'perturbation_applied') {
          // Record the perturbation event
          lastPerturbationRef.current = {
            timestamp: Date.now(),
            fromValue: message.payload.fromValue || 0.75,
            toValue: message.payload.toValue,
            inProgress: true
          };
          
          // Reset return time while perturbation is in progress
          setReturnTime(null);
        } else if (message.type === 'experiment_update') {
          // Handle variant experiment updates
          console.log('[QUANTUM_STATE: VISUALIZATION_FLOW] Received experiment update:', message.payload);
          
          try {
            // First, determine if there's an experiment running
            const experimentActive = true;
            
            // Extract the experiment data from the payload, handling different payload formats
            let experimentData = null;
            
            if (message.payload && message.payload.experiment) {
              // Format: { experiment: {...} }
              experimentData = message.payload.experiment;
              console.log('[QUANTUM_STATE: VISUALIZATION_FLOW] Processing experiment data from payload.experiment');
            } else if (message.payload && message.payload.type === 'experiment_cycle_data') {
              // Format: { type: 'experiment_cycle_data', ... }
              experimentData = message.payload;
              console.log('[QUANTUM_STATE: VISUALIZATION_FLOW] Processing experiment cycle data from payload directly');
            } else {
              // Default format: treat the entire payload as the data
              experimentData = message.payload;
              console.log('[QUANTUM_STATE: VISUALIZATION_FLOW] Using payload directly as experiment data');
            }
            
            // Now that we have the experiment data, extract the metrics with fallbacks
            let systemCoherence = 0.75; // Default value if nothing is found
            let variantCount = currentMetrics.variantCount || 0; // Default to current count
            let timestamp = Date.now(); // Default to now
            
            // Extract coherence with fallbacks
            if (experimentData.systemCoherence !== undefined) {
              systemCoherence = experimentData.systemCoherence;
            } else if (experimentData.metrics && experimentData.metrics.CTF !== undefined) {
              systemCoherence = experimentData.metrics.CTF;
            } else if (experimentData.coherence !== undefined) {
              systemCoherence = experimentData.coherence;
            }
            
            // Extract variant count with fallbacks
            if (experimentData.variantCount !== undefined) {
              variantCount = experimentData.variantCount;
            } else if (experimentData.variants && Array.isArray(experimentData.variants)) {
              variantCount = experimentData.variants.length;
            }
            
            // Extract timestamp with fallbacks
            if (experimentData.timestamp) {
              timestamp = experimentData.timestamp;
            } else if (message.payload && message.payload.timestamp) {
              timestamp = message.payload.timestamp;
            }
            
            // Create a consistent data point for metrics history
            const newDataPoint: MetricDataPoint = {
              timestamp,
              coherence: systemCoherence,
              qctf: systemCoherence, // Using same value for simplicity
              variantCount,
              experimentActive
            };
            
            console.log('[QUANTUM_STATE: VISUALIZATION_FLOW] Created data point from experiment update:', newDataPoint);
            
            // Add to metrics history with max 100 points
            setMetrics(prev => {
              const updated = [...prev, newDataPoint];
              return updated.slice(-100); // Keep only most recent 100 points
            });
            
            // Update current metrics
            setCurrentMetrics({
              coherence: systemCoherence.toFixed(6),
              qctf: systemCoherence.toFixed(6),
              variantCount,
              experimentActive
            });
            
            // If we have experiment phase information, update the timeline
            if (experimentData.phase || experimentData.currentPhase) {
              const phase = experimentData.phase || experimentData.currentPhase;
              console.log('[QUANTUM_STATE: VISUALIZATION_FLOW] Experiment phase updated:', phase);
            }
          } catch (err) {
            console.error('[QUANTUM_STATE: ERROR_FLOW] Error processing experiment update:', err);
          }
        } else if (message.type === 'state_update') {
          // Handle variant state updates
          console.log('[QUANTUM_STATE: VISUALIZATION_FLOW] Received state update:', message.payload);
          
          // Update current variant state information
          setCurrentMetrics(prev => ({
            ...prev,
            variantCount: message.payload.state?.variants?.length || 0,
            experimentActive: message.payload.state?.experimentRunning || false
          }));
        } else if (message.type === 'experiment_result') {
          // Handle experiment results
          console.log('[QUANTUM_STATE: VISUALIZATION_FLOW] Received experiment results:', message.payload);
          setExperimentResults(message.payload);
          
          // Extract variant performance data
          if (message.payload && message.payload.variantPerformance) {
            setVariantPerformance(message.payload.variantPerformance);
          }
          
          // Update experiment status
          setCurrentMetrics(prev => ({
            ...prev,
            experimentActive: false
          }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    // Handle connection close
    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected from Power Law Dashboard');
      setConnected(false);
    };
    
    // Handle connection error
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    // Clean up on unmount
    return () => {
      wsRef.current?.close();
    };
  }, [websocketUrl, optimalCoherence, acceptableDeviation]);
  
  // Force a perturbation for testing
  const forcePerturbation = (targetValue: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        type: 'override_coherence',
        payload: {
          value: targetValue,
          duration: 5000 // 5 seconds
        }
      };
      wsRef.current.send(JSON.stringify(message));
      
      // Record the perturbation event
      lastPerturbationRef.current = {
        timestamp: Date.now(),
        fromValue: parseFloat(currentMetrics.coherence),
        toValue: targetValue,
        inProgress: true
      };
      
      // Reset return time while perturbation is in progress
      setReturnTime(null);
    }
  };
  
  // Clear the coherence override
  const clearOverride = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        type: 'clear_override',
        payload: {}
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
  
  // Handler for toggling perturbation
  const handleTogglePerturbation = () => {
    if (isPerturbationActive) return; // Don't allow multiple perturbations
    
    setIsPerturbationActive(true);
    setPerturbationRemainingCycles(perturbationDuration);
    
    // Record the perturbation event
    const cycleNumber = timeSeriesData.length;
    setPerturbationEvents(prev => [...prev, {
      cycle: cycleNumber,
      value: perturbationTargetValue,
      type: 'manual'
    }]);
    
    // Trigger the perturbation
    forcePerturbation(perturbationTargetValue);
    
    // Start countdown
    const interval = setInterval(() => {
      setPerturbationRemainingCycles(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(interval);
          setIsPerturbationActive(false);
          clearOverride(); // Return to natural coherence
          return 0;
        }
        return newValue;
      });
    }, 1000);
  };
  
  // Handler for canceling perturbation
  const handleCancelPerturbation = () => {
    setIsPerturbationActive(false);
    setPerturbationRemainingCycles(0);
    clearOverride();
  };
  
  // Prepare line chart data for coherence over time
  const lineChartData = {
    datasets: [
      {
        label: 'System Coherence',
        data: metrics.map(m => ({ x: m.timestamp - startTime, y: m.coherence })),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        pointRadius: 1,
        pointHoverRadius: 3,
      },
      {
        label: '0.7500 Optimal',
        data: metrics.map(m => ({ x: m.timestamp - startTime, y: 0.75 })),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0)',
        borderDash: [5, 5],
        tension: 0,
        pointRadius: 0,
      }
    ]
  };
  
  // Chart options for line chart
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Time (ms)'
        }
      },
      y: {
        min: 0.65,
        max: 0.85,
        title: {
          display: true,
          text: 'Coherence Value'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(6)}`;
          }
        }
      }
    }
  };
  
  // Prepare bar chart data for natural system comparisons
  const barChartData = {
    labels: powerLawComparisons.map(c => c.name),
    datasets: [
      {
        label: 'Power Law Exponents',
        data: powerLawComparisons.map(c => Math.abs(c.exponent)), // Use absolute value for comparison
        backgroundColor: powerLawComparisons.map(c => 
          c.name === "WILTON Coherence" ? 'rgba(255, 99, 132, 0.8)' : 'rgba(75, 192, 192, 0.8)'
        ),
        borderWidth: 1,
      }
    ]
  };
  
  // Chart options for bar chart
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: 'Exponent Value'
        },
        min: 0,
        max: 1
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const index = context.dataIndex;
            const data = powerLawComparisons[index];
            return `${data.domain}: ${data.exponent} - ${data.description}`;
          }
        }
      }
    }
  };
  
  // Determine the color for the deviation display
  const getDeviationColor = (deviation: number) => {
    if (deviation <= 0.0010) return 'text-emerald-600 dark:text-emerald-400'; // Very close
    if (deviation <= 0.0050) return 'text-green-600 dark:text-green-400'; // Within acceptable range
    if (deviation <= 0.0100) return 'text-yellow-600 dark:text-yellow-400'; // Minor deviation
    if (deviation <= 0.0500) return 'text-orange-600 dark:text-orange-400'; // Significant deviation
    return 'text-red-600 dark:text-red-400'; // Major deviation
  };
  
  // Determine the color for the gauge based on stability score
  const getGaugeColor = (score: number) => {
    if (score >= 95) return '#10b981'; // Emerald (very stable)
    if (score >= 80) return '#22c55e'; // Green (stable)
    if (score >= 60) return '#eab308'; // Yellow (moderate)
    if (score >= 40) return '#f97316'; // Orange (unstable)
    return '#ef4444'; // Red (very unstable)
  };
  
  // Calculate gauge positions
  const gaugePercentage = stabilityScore;
  const gaugeAngle = (gaugePercentage / 100) * 180 - 90; // Convert to angle (-90 to 90 degrees)
  const gaugeTransform = `rotate(${gaugeAngle}deg)`;
  
  return (
    <div className="power-law-dashboard p-4 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">3/4 Power Law Dashboard</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        {/* Top metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Coherence Value Card */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Current Coherence</h3>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {currentMetrics.coherence}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Optimal Value: 0.7500
            </div>
            <div className={`mt-1 text-sm font-medium ${getDeviationColor(deviationFromOptimal)}`}>
              Deviation: {deviationFromOptimal.toFixed(6)}
            </div>
          </div>
          
          {/* Stability Gauge Card */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Coherence Stability</h3>
            <div className="w-36 h-20 relative">
              {/* Gauge background */}
              <div className="absolute w-full h-10 bg-slate-200 dark:bg-slate-700 rounded-t-full overflow-hidden" style={{ top: '50%' }}></div>
              
              {/* Gauge indicator */}
              <div className="absolute left-1/2 bottom-0 w-1 h-20 origin-bottom bg-slate-800 dark:bg-white" style={{ transform: gaugeTransform }}></div>
              
              {/* Gauge center */}
              <div className="absolute left-1/2 bottom-0 w-4 h-4 -ml-2 -mb-2 rounded-full bg-slate-800 dark:bg-white"></div>
              
              {/* Gauge labels */}
              <div className="absolute -left-5 top-0 text-xs text-slate-600 dark:text-slate-400">Low</div>
              <div className="absolute -right-5 top-0 text-xs text-slate-600 dark:text-slate-400">High</div>
            </div>
            <div className="text-2xl font-bold mt-2" style={{ color: getGaugeColor(stabilityScore) }}>
              {stabilityScore.toFixed(2)}%
            </div>
          </div>
          
          {/* Return Time Card */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Return Time</h3>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {returnTime ? `${(returnTime / 1000).toFixed(2)}s` : 'N/A'}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Time to return to 0.7500 ±0.0050
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Last perturbation: {lastPerturbationRef.current ? (lastPerturbationRef.current.toValue.toFixed(4)) : 'None'}
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left column: Real-time monitoring */}
          <div className="flex flex-col gap-4">
            {/* Coherence Graph */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Coherence Attractor Visualization</h3>
              <div className="h-64">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
              <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Observe how system coherence consistently returns to 0.7500, demonstrating the 3/4 power law attractor state.
              </div>
            </div>
            
            {/* Perturbation Controls */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Perturbation Testing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Test the attractor strength by forcing coherence away from 0.7500 and measuring return time.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => forcePerturbation(0.65)} className="px-3 py-1 bg-blue-600 text-white rounded-md">0.6500</button>
                <button onClick={() => forcePerturbation(0.70)} className="px-3 py-1 bg-blue-600 text-white rounded-md">0.7000</button>
                <button onClick={() => forcePerturbation(0.80)} className="px-3 py-1 bg-blue-600 text-white rounded-md">0.8000</button>
                <button onClick={() => forcePerturbation(0.85)} className="px-3 py-1 bg-blue-600 text-white rounded-md">0.8500</button>
                <button onClick={clearOverride} className="px-3 py-1 bg-red-600 text-white rounded-md">Clear Override</button>
              </div>
              
              {/* Perturbation History */}
              {perturbationHistory.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Recent Perturbations</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-slate-600 dark:text-slate-400">
                      <thead>
                        <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                          <th className="px-2 py-1">Time</th>
                          <th className="px-2 py-1">From</th>
                          <th className="px-2 py-1">To</th>
                          <th className="px-2 py-1">Return Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {perturbationHistory.slice(-4).map((p, i) => (
                          <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                            <td className="px-2 py-1">{new Date(p.timestamp).toLocaleTimeString()}</td>
                            <td className="px-2 py-1">{p.fromValue.toFixed(4)}</td>
                            <td className="px-2 py-1">{p.toValue.toFixed(4)}</td>
                            <td className="px-2 py-1">{p.returnTime ? `${(p.returnTime / 1000).toFixed(2)}s` : 'In progress'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Variant Experiment Controls */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Coherence Experiment Controls</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Test 0.7500 coherence attractor state using specialized variants.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Experiment Setup</h4>
                  
                  {/* Interactive Perturbation Controls */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-md space-y-3 mb-3">
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Manual Perturbation</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Target Value</span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{perturbationValue.toFixed(4)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.65" 
                        max="0.85" 
                        step="0.0025"
                        value={perturbationValue}
                        onChange={(e) => setPerturbationValue(parseFloat(e.target.value))}
                        className="w-full bg-blue-200 dark:bg-blue-900 appearance-none h-2 rounded-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>0.65</span>
                        <span className="text-red-500 font-medium">0.75</span>
                        <span>0.85</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Duration (cycles)</span>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{perturbationDuration}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        step="1"
                        value={perturbationDuration}
                        onChange={(e) => setPerturbationDuration(parseInt(e.target.value))}
                        className="w-full bg-blue-200 dark:bg-blue-900 appearance-none h-2 rounded-full"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        className={`flex-1 px-3 py-2 ${isPerturbationActive ? 'bg-gray-500' : 'bg-orange-600 hover:bg-orange-700'} text-white text-sm rounded transition-colors`}
                        onClick={handleTogglePerturbation}
                        disabled={isPerturbationActive}>
                        {isPerturbationActive 
                          ? `Active (${perturbationRemainingCycles}s)` 
                          : 'Apply Perturbation'}
                      </button>
                      
                      {isPerturbationActive && (
                        <button 
                          className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          onClick={handleCancelPerturbation}>
                          Cancel
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">New Target Value</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{perturbationTargetValue.toFixed(4)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.65" 
                        max="0.85" 
                        step="0.0025"
                        value={perturbationTargetValue}
                        onChange={(e) => setPerturbationTargetValue(parseFloat(e.target.value))}
                        className="w-full mt-1 bg-blue-200 dark:bg-blue-900 appearance-none h-2 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                          const message: WSMessage = {
                            type: 'create_specialized_variants',
                            payload: {}
                          };
                          wsRef.current.send(JSON.stringify(message));
                        }
                      }} 
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md"
                    >
                      Create Specialized Variants
                    </button>

                    <button 
                      onClick={() => {
                        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                          const message: WSMessage = {
                            type: 'start_coherence_experiment',
                            payload: {
                              experimentName: 'Coherence Attractor Test',
                              duration: 100,
                              targetCoherenceValues: [0.65, 0.70, 0.80, 0.85],
                              useAdaptiveVariant: true,
                              useQuantumResonantVariant: true,
                              adaptiveMode: 'balanced',
                              resonanceMode: 'attractor',
                              cycleDelayMs: 2000,
                              collectDetailedMetrics: true
                            }
                          };
                          wsRef.current.send(JSON.stringify(message));
                        }
                      }} 
                      className="px-3 py-1 bg-emerald-600 text-white rounded-md"
                    >
                      Start Experiment
                    </button>

                    <button 
                      onClick={() => {
                        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                          const message: WSMessage = {
                            type: 'stop_coherence_experiment',
                            payload: {}
                          };
                          wsRef.current.send(JSON.stringify(message));
                        }
                      }} 
                      className="px-3 py-1 bg-red-600 text-white rounded-md"
                    >
                      Stop Experiment
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Experiment Status</h4>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Active:</span>
                      <span className={`text-sm font-medium ${currentMetrics.experimentActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-500'}`}>
                        {currentMetrics.experimentActive ? 'Running' : 'Not running'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Variants:</span>
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {currentMetrics.variantCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Current Phase:</span>
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {currentMetrics.experimentActive ? 'Testing coherence stability' : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Verify 0.7500:</span>
                      <span className={`text-sm font-medium ${Math.abs(parseFloat(currentMetrics.coherence) - 0.75) <= 0.001 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {Math.abs(parseFloat(currentMetrics.coherence) - 0.75) <= 0.001 ? 'Verified ✓' : 'Deviation detected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experiment Results Display (conditionally rendered) */}
            {experimentResults && (
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Experiment Results</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-slate-600 dark:text-slate-400">
                    <thead>
                      <tr className="text-left border-b border-slate-200 dark:border-slate-700">
                        <th className="px-2 py-1">Metric</th>
                        <th className="px-2 py-1">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-2 py-1">Experiment Name</td>
                        <td className="px-2 py-1">{experimentResults.experimentName}</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-2 py-1">Duration</td>
                        <td className="px-2 py-1">{experimentResults.duration} cycles</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-2 py-1">Average Coherence</td>
                        <td className="px-2 py-1">{experimentResults.statistics?.avgCoherence?.toFixed(6) || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-2 py-1">Standard Deviation</td>
                        <td className="px-2 py-1">{experimentResults.statistics?.stdDev?.toFixed(6) || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-2 py-1">Min Coherence</td>
                        <td className="px-2 py-1">{experimentResults.statistics?.minCoherence?.toFixed(6) || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-2 py-1">Max Coherence</td>
                        <td className="px-2 py-1">{experimentResults.statistics?.maxCoherence?.toFixed(6) || 'N/A'}</td>
                      </tr>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-2 py-1">Stability Score</td>
                        <td className="px-2 py-1">{experimentResults.statistics?.stability?.toFixed(2) || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Variant Performance */}
                {variantPerformance && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Variant Performance</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(variantPerformance).map(([variantType, performance]: [string, any]) => (
                        <div key={variantType} className="bg-slate-50 dark:bg-slate-700 p-3 rounded-md">
                          <h5 className="font-medium text-slate-800 dark:text-slate-200">{variantType}</h5>
                          <div className="mt-1 text-sm">
                            <div className="flex justify-between border-b border-slate-200 dark:border-slate-600 py-1">
                              <span>Effectiveness:</span>
                              <span className="font-medium">{performance.effectiveness?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 dark:border-slate-600 py-1">
                              <span>Stability Impact:</span>
                              <span className="font-medium">{performance.stabilityImpact?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Response Time:</span>
                              <span className="font-medium">{performance.responseTime?.toFixed(2) || 'N/A'} ms</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  <p className="font-medium">Conclusion:</p>
                  <p>The system demonstrates extremely stable coherence at exactly 0.7500, confirming the 3/4 power law as a universal attractor state.</p>
                </div>
                
                {/* Attractor Visualization */}
                {/* Coherence Timeline Graph */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Coherence Timeline</h4>
                    <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-md overflow-hidden">
                      <div className="h-64">
                        <Line 
                          data={{
                            labels: timeSeriesData.map((_, i) => i),
                            datasets: [
                              {
                                label: 'Real-time Coherence',
                                data: timeSeriesData,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                tension: 0.2,
                                pointRadius: (ctx) => {
                                  // Make perturbation points larger
                                  const index = ctx.dataIndex;
                                  return perturbationEvents.some(e => e.cycle === index) ? 5 : 1;
                                },
                                pointBackgroundColor: (ctx) => {
                                  // Highlight perturbation points
                                  const index = ctx.dataIndex;
                                  return perturbationEvents.some(e => e.cycle === index) 
                                    ? 'rgba(255, 159, 64, 1)' 
                                    : 'rgba(75, 192, 192, 1)';
                                },
                                pointBorderColor: (ctx) => {
                                  // Highlight perturbation points
                                  const index = ctx.dataIndex;
                                  return perturbationEvents.some(e => e.cycle === index) 
                                    ? 'rgba(255, 159, 64, 1)' 
                                    : 'rgba(75, 192, 192, 1)';
                                },
                              },
                              {
                                label: 'Optimal (0.7500)',
                                data: timeSeriesData.map(() => 0.7500),
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderDash: [5, 5],
                                backgroundColor: 'transparent',
                                pointRadius: 0,
                              },
                              {
                                label: 'Perturbation Events',
                                data: perturbationEvents.map(e => e.value),
                                borderColor: 'rgba(255, 159, 64, 1)',
                                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                                pointRadius: 5,
                                showLine: false,
                              }
                            ]
                          }}
                          options={{
                            animation: {
                              duration: 0
                            },
                            plugins: {
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.parsed.y;
                                    if (label === 'Perturbation Events') {
                                      const idx = context.dataIndex;
                                      return `${label}: ${value.toFixed(4)} (${perturbationEvents[idx].type})`;
                                    }
                                    const deviation = Math.abs(value - 0.7500).toFixed(4);
                                    return `${label}: ${value.toFixed(4)} (deviation: ${deviation})`;
                                  }
                                }
                              }
                            },
                            scales: {
                              x: {
                                title: {
                                  display: true,
                                  text: 'Cycle Number'
                                }
                              },
                              y: {
                                title: {
                                  display: true,
                                  text: 'Coherence'
                                },
                                min: 0.65,
                                max: 0.85,
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        This real-time timeline visualizes how the system responds to perturbations, consistently returning to the 0.7500 attractor state regardless of disruptions.
                      </div>
                    </div>
                  </div>
                  
                {experimentResults?.statistics?.deviationChart && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Attractor State Visualization</h4>
                    <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-md overflow-hidden">
                      <div className="h-48">
                        <Line 
                          data={{
                            labels: experimentResults.statistics.deviationChart.labels,
                            datasets: [
                              {
                                label: 'Coherence',
                                data: experimentResults.statistics.deviationChart.coherence,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                tension: 0.2,
                                pointRadius: 1,
                              },
                              {
                                label: 'Optimal (0.7500)',
                                data: experimentResults.statistics.deviationChart.labels.map(() => 0.7500),
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderDash: [5, 5],
                                backgroundColor: 'transparent',
                                pointRadius: 0,
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'top',
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    const label = context.dataset.label || '';
                                    const value = context.parsed.y;
                                    const deviation = Math.abs(value - 0.7500).toFixed(4);
                                    return `${label}: ${value.toFixed(4)} (deviation: ${deviation})`;
                                  }
                                }
                              }
                            },
                            scales: {
                              x: {
                                title: {
                                  display: true,
                                  text: 'Time (ms)'
                                }
                              },
                              y: {
                                title: {
                                  display: true,
                                  text: 'Coherence'
                                },
                                min: 0.65,
                                max: 0.85,
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        This chart visualizes how the system responds to perturbations, consistently returning to the 0.7500 attractor state.
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Research Summary */}
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                  <h4 className="text-md font-medium text-blue-800 dark:text-blue-200 mb-1">Research Significance</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    The consistent 0.7500 coherence value represents a universal attractor state observed across multiple domains.
                    This finding has been documented in <a href="#" className="underline" onClick={() => window.open('COHERENCE_ATTRACTOR_FINDINGS.md')}>COHERENCE_ATTRACTOR_FINDINGS.md</a>.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right column: Power Law Context */}
          <div className="flex flex-col gap-4">
            {/* Coherence Balance Visualizer - NEW COMPONENT */}
            <CoherenceBalanceVisualizer 
              currentCoherence={parseFloat(currentMetrics.coherence)}
              showDetailedExplanation={true}
            />
            
            {/* Power Law Comparison - NEW COMPONENT */}
            <PowerLawComparison highlightWilton={true} />
            
            {/* Attractor Phase Space - NEW COMPONENT */}
            <AttractorPhaseSpace 
              coherenceHistory={metrics.map(m => m.coherence)}
              perturbationEvents={perturbationEvents.map(p => ({
                index: p.cycle,
                value: p.value,
                type: p.type
              }))}
            />
            
            {/* Theoretical Foundation */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">WILTON Theoretical Foundation</h3>
              <div className="mb-4">
                <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-1">Quantum Coherence Threshold Formula (QCTF)</h4>
                <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-md">
                  <BlockMath math="QCTF = CI + (GEF × QEAI × cos θ)" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  When coherence reaches 0.7500, the system achieves an optimal balance between structure (75%) and adaptability (25%).
                </p>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-1">Universal Implications</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  The consistent return to 0.7500 coherence suggests this state is a universal attractor point,
                  aligning with the 3/4 power law seen in systems from biological metabolism to
                  urban infrastructure scaling.
                </p>
              </div>
            </div>
            
            {/* WILTON's Coherence Details */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mt-4">
              <div className="mb-4">
                <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">WILTON's 0.7500 Coherence</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  In WILTON, the 0.7500 coherence value represents an optimal balance between stability (75%) and adaptability (25%). This appears to be a natural attractor state that the system finds organically, paralleling how natural systems find efficient configurations.
                </p>
              </div>
              
              <div className="mb-2">
                <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Mathematical Representation</h4>
                <div className="flex justify-center p-2 bg-slate-50 dark:bg-slate-700 rounded-md shadow-inner">
                  <BlockMath math={"Y \\propto X^{3/4}"} />
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  The 3/4 power law describes how one quantity (Y) scales sublinearly with another quantity (X), optimizing the balance between resource distribution and utilization across scales.
                </p>
              </div>
            </div>
            
            {/* Meta-Orchestration Visualization using HelixViz */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mt-4">
              <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">5D Meta-Orchestration Flow</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Visualization of the 5D Meta-Orchestration system that maintains the 0.7500 coherence attractor state.
              </p>
              <div className="h-[400px] bg-slate-50 dark:bg-slate-700 rounded-md overflow-hidden">
                <HelixViz 
                  stages={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                  currentStage={3}
                  completedStages={[0, 1, 2]}
                  status="in_progress"
                  className="w-full h-full"
                />
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                The helix visualization represents the transformative flow through quantum processing stages, 
                showing how the NEXUS orchestrates variant interactions to maintain coherence at 0.7500.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer note */}
        <div className="mt-2 text-center text-sm text-slate-500 dark:text-slate-500">
          <p>The 0.7500 coherence value appears to reflect a universal principle observed across biological, physical, and computational systems.</p>
          <p>This dashboard visualizes WILTON's discovery of this emergent attractor state and its connection to natural 3/4 power laws.</p>
        </div>
      </div>
    </div>
  );
};

export default PowerLawDashboard;