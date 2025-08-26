/**
 * Resonance Dashboard Component
 * 
 * This component provides a real-time visualization of the system coherence
 * and other key metrics to observe the 0.7500 attractor state in action.
 * 
 * [QUANTUM_STATE: VISUALIZATION_FLOW]
 */

import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chart.js/auto';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

// Props for the dashboard component
interface ResonanceDashboardProps {
  websocketUrl?: string;
}

// Main component
const ResonanceDashboard: React.FC<ResonanceDashboardProps> = ({ 
  websocketUrl = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/ws' 
}) => {
  // State for WebSocket and data
  const [connected, setConnected] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<MetricDataPoint[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<any>({
    coherence: 0.75,
    qctf: 0.75,
    variantCount: 0,
    experimentActive: false
  });
  const [experimentInfo, setExperimentInfo] = useState<{
    active: boolean;
    phase: string;
    target: number | null;
    repetition: number | null;
  }>({
    active: false,
    phase: '',
    target: null,
    repetition: null
  });
  const [startTime] = useState<number>(Date.now());
  const [meanCoherence, setMeanCoherence] = useState<number>(0.75);
  const [stdDeviation, setStdDeviation] = useState<number>(0);
  const [experimentMode, setExperimentMode] = useState<boolean>(false);
  const [experimentPlan, setExperimentPlan] = useState<any>({
    phases: []
  });
  
  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  
  // Connect to WebSocket
  useEffect(() => {
    // Create a new WebSocket connection
    wsRef.current = new WebSocket(websocketUrl);
    
    // Handle connection open
    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      
      // Send a message to identify as a dashboard client
      const message: WSMessage = {
        type: 'connected',
        payload: { client: 'resonance-dashboard' }
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
        } else if (message.type === 'experiment_info') {
          setExperimentInfo({
            active: message.payload.active || false,
            phase: message.payload.phase || '',
            target: message.payload.target || null,
            repetition: message.payload.repetition || null
          });
        } else if (message.type === 'experiment_plan') {
          setExperimentPlan(message.payload);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    // Handle connection close
    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
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
  }, [websocketUrl]);
  
  // Calculate statistics
  useEffect(() => {
    if (metrics.length > 0) {
      // Calculate mean coherence
      const coherenceValues = metrics.map(m => m.coherence);
      const mean = coherenceValues.reduce((sum, val) => sum + val, 0) / coherenceValues.length;
      setMeanCoherence(mean);
      
      // Calculate standard deviation
      const variance = coherenceValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / coherenceValues.length;
      const stdDev = Math.sqrt(variance);
      setStdDeviation(stdDev);
    }
  }, [metrics]);
  
  // Toggle experiment mode
  const toggleExperimentMode = () => {
    setExperimentMode(prev => !prev);
  };
  
  // Start experiment
  const startExperiment = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        type: 'start_experiment',
        payload: {
          name: 'CoherenceAttractorExperiment',
          timestamp: Date.now()
        }
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
  
  // Override coherence
  const overrideCoherence = (value: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        type: 'override_coherence',
        payload: {
          value,
          duration: 5000
        }
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
  
  // Clear coherence override
  const clearOverride = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        type: 'clear_override',
        payload: {}
      };
      wsRef.current.send(JSON.stringify(message));
    }
  };
  
  // Prepare chart data
  const chartData = {
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
        label: 'QCTF',
        data: metrics.map(m => ({ x: m.timestamp - startTime, y: m.qctf })),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.4,
        pointRadius: 1,
        pointHoverRadius: 3,
      },
      {
        label: 'Baseline (0.7500)',
        data: metrics.map(m => ({ x: m.timestamp - startTime, y: 0.75 })),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0)',
        borderDash: [5, 5],
        tension: 0,
        pointRadius: 0,
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
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
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'Value'
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
  
  return (
    <div className="resonance-dashboard p-4 bg-slate-50 dark:bg-slate-900 rounded-lg shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Coherence Attractor Dashboard</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">System Coherence</h3>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {currentMetrics.coherence}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Mean: {meanCoherence.toFixed(6)} | StdDev: {stdDeviation.toFixed(6)}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">QCTF Value</h3>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {currentMetrics.qctf}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Coherence Threshold Formula
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Variants</h3>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {currentMetrics.variantCount}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Active system variants
            </div>
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Coherence Over Time</h3>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Experiment Controls */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Experiment Controls</h3>
            <button
              onClick={toggleExperimentMode}
              className={`px-3 py-1 rounded-md ${experimentMode ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}
            >
              {experimentMode ? 'Normal Mode' : 'Experiment Mode'}
            </button>
          </div>
          
          {experimentMode && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Manual Perturbation</h4>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => overrideCoherence(0.65)} className="px-3 py-1 bg-blue-600 text-white rounded-md">0.6500</button>
                    <button onClick={() => overrideCoherence(0.70)} className="px-3 py-1 bg-blue-600 text-white rounded-md">0.7000</button>
                    <button onClick={() => overrideCoherence(0.80)} className="px-3 py-1 bg-blue-600 text-white rounded-md">0.8000</button>
                    <button onClick={() => overrideCoherence(0.85)} className="px-3 py-1 bg-blue-600 text-white rounded-md">0.8500</button>
                    <button onClick={clearOverride} className="px-3 py-1 bg-red-600 text-white rounded-md">Clear Override</button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Automated Experiment</h4>
                  <button onClick={startExperiment} className="px-3 py-1 bg-green-600 text-white rounded-md">
                    Run Full Experiment
                  </button>
                </div>
              </div>
              
              {experimentInfo.active && (
                <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
                  <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Active Experiment</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Phase:</span> {experimentInfo.phase}
                    </div>
                    <div>
                      <span className="font-medium">Target:</span> {experimentInfo.target !== null ? experimentInfo.target.toFixed(4) : 'None'}
                    </div>
                    <div>
                      <span className="font-medium">Repetition:</span> {experimentInfo.repetition !== null ? experimentInfo.repetition : 'N/A'}
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full ${currentMetrics.experimentActive ? 'bg-yellow-200 text-yellow-800' : 'bg-slate-200 text-slate-800'}`}>
                        {currentMetrics.experimentActive ? 'Override Active' : 'Natural Coherence'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Theoretical Context */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Theoretical Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">Quantum Coherence Threshold Formula</h4>
              <div className="flex justify-center p-2 bg-slate-50 dark:bg-slate-700 rounded-md shadow-inner">
                <BlockMath math={"\\text{QCTF} = \\text{CI} + (\\text{GEF} \\times \\text{QEAI} \\times \\cos \\theta)"} />
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                The QCTF balances coherence with entropy for optimal system performance.
                At the edge of chaos (θ = π/2), coherence contribution is maximized.
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-slate-800 dark:text-slate-200 mb-2">The 3/4 Power Law</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Across multiple domains, from biology to urban systems, the 3/4 power law (0.75 scaling) 
                emerges as an optimal balance between structure and adaptability.
              </p>
              <div className="mt-2">
                <p className="text-sm text-slate-800 dark:text-slate-200">Examples of 3/4 scaling laws:</p>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400">
                  <li>Kleiber's Law: Metabolic rate scales as mass<sup>3/4</sup></li>
                  <li>City infrastructure: Resource usage scales as population<sup>3/4</sup></li>
                  <li>Network efficiency: Optimal fractal dimension between 2D and 3D</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResonanceDashboard;