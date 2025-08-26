/**
 * Lemniscate Control Page
 * 
 * This page provides a comprehensive interface for controlling the Lemniscate Mode
 * feature, allowing users to toggle between stability and exploration states,
 * translate human goals into coherence targets, and visualize the system state.
 * 
 * [QUANTUM_STATE: UI_FLOW]
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Infinity, Timer, Goal, Scale, Settings, WaveForm, History, BarChart3, Target } from 'lucide-react';

const API_BASE = '/api/lemniscate';

interface CoherenceState {
  state: string;
  currentCoherence: number;
  targetCoherence: number;
  isTransitioning: boolean;
  activeScale: string;
  insights: number;
  variants: number;
  systemTime: number;
}

interface TranslatedGoal {
  goalType: string;
  preferredState: string;
  suggestedTimeScale: string;
  description: string;
}

interface HistoricalDataPoint {
  timestamp: number;
  coherence: number;
  state: string;
  insights: number;
  variants: number;
}

interface TemporalScaleMetrics {
  micro: { coherence: number; oscillationFrequency: number };
  meso: { coherence: number; oscillationFrequency: number };
  macro: { coherence: number; oscillationFrequency: number };
}

/**
 * Lemniscate Control Page Component
 */
const LemniscateControlPage: React.FC = () => {
  const [coherenceState, setCoherenceState] = useState<CoherenceState | null>(null);
  const [goalText, setGoalText] = useState<string>('');
  const [translatedGoal, setTranslatedGoal] = useState<TranslatedGoal | null>(null);
  const [activeScale, setActiveScale] = useState<string>('micro');
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [temporalScales, setTemporalScales] = useState<TemporalScaleMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current coherence state on load and periodically
  useEffect(() => {
    fetchCoherenceState();
    fetchHistoricalData();

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchCoherenceState();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fetch current coherence state
  const fetchCoherenceState = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/state`);
      setCoherenceState(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching coherence state:', err);
      setError('Failed to fetch coherence state');
      setLoading(false);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/historical?scale=${activeScale}&limit=100`);
      setHistoricalData(response.data.data);
      
      // Also fetch metrics to get temporal scales information
      const metricsResponse = await axios.get(`${API_BASE}/metrics`);
      setTemporalScales(metricsResponse.data.temporalScales);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to fetch historical data');
    }
  };

  // Toggle Lemniscate Mode
  const toggleLemniscateMode = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/toggle`, {
        scale: activeScale,
        targetState: coherenceState?.state === 'stability' ? 'exploration' : 'stability'
      });
      
      // Fetch updated state
      await fetchCoherenceState();
      setLoading(false);
    } catch (err) {
      console.error('Error toggling Lemniscate mode:', err);
      setError('Failed to toggle Lemniscate mode');
      setLoading(false);
    }
  };

  // Change active temporal scale
  const changeScale = async (scale: string) => {
    setActiveScale(scale);
    
    // Fetch data for the new scale
    try {
      const response = await axios.get(`${API_BASE}/historical?scale=${scale}&limit=100`);
      setHistoricalData(response.data.data);
    } catch (err) {
      console.error(`Error fetching historical data for scale ${scale}:`, err);
      setError(`Failed to fetch historical data for scale ${scale}`);
    }
  };

  // Translate human goal
  const translateGoal = async () => {
    if (!goalText.trim()) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/translate-goal`, {
        goalDescription: goalText
      });
      
      setTranslatedGoal(response.data.translation);
      setLoading(false);
    } catch (err) {
      console.error('Error translating goal:', err);
      setError('Failed to translate goal');
      setLoading(false);
    }
  };

  // Apply translated goal
  const applyGoal = async () => {
    if (!translatedGoal) return;
    
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/apply-goal`, {
        translation: translatedGoal
      });
      
      // Fetch updated state
      await fetchCoherenceState();
      setLoading(false);
      
      // Clear goal text and translation after applying
      setGoalText('');
      setTranslatedGoal(null);
    } catch (err) {
      console.error('Error applying goal:', err);
      setError('Failed to apply goal');
      setLoading(false);
    }
  };

  // Format the coherence value for display
  const formatCoherence = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return value.toFixed(4);
  };

  // Determine color based on coherence value
  const getCoherenceColor = (value: number | undefined) => {
    if (value === undefined) return '#cccccc';
    
    if (value >= 0.74 && value <= 0.76) {
      return '#4ade80'; // Green for stability range (0.75)
    } else if (value >= 0.24 && value <= 0.26) {
      return '#60a5fa'; // Blue for exploration range (0.25)
    } else {
      return '#f97316'; // Orange for transition ranges
    }
  };

  // Get a text description of the current state
  const getStateDescription = () => {
    if (!coherenceState) return 'Unknown state';
    
    if (coherenceState.isTransitioning) {
      return 'Transitioning between states';
    }
    
    const coherence = coherenceState.currentCoherence;
    
    if (coherence >= 0.74 && coherence <= 0.76) {
      return 'Stability mode (0.75) - Focusing on implementation and refinement';
    } else if (coherence >= 0.24 && coherence <= 0.26) {
      return 'Exploration mode (0.25) - Encouraging creativity and discovery';
    } else if (coherence > 0.5) {
      return 'Primarily stability-oriented with some exploration';
    } else {
      return 'Primarily exploration-oriented with some stability';
    }
  };

  // Get temporal scale description
  const getScaleDescription = (scale: string) => {
    switch (scale) {
      case 'micro':
        return 'Micro scale (seconds to minutes) - For immediate response';
      case 'meso':
        return 'Meso scale (hours to days) - For sustained work sessions';
      case 'macro':
        return 'Macro scale (weeks to months) - For long-term projects';
      default:
        return 'Unknown scale';
    }
  };

  // Render coherence value with visual indicator
  const renderCoherenceValue = (value: number | undefined, label: string) => {
    const color = getCoherenceColor(value);
    
    return (
      <div className="flex flex-col items-center mb-4">
        <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: color }}
          />
          <div className="text-xl font-bold">
            {formatCoherence(value)}
          </div>
        </div>
      </div>
    );
  };

  // Render temporal scales selector
  const renderScaleSelector = () => {
    return (
      <div className="mb-6 border rounded-lg p-4 bg-white">
        <div className="flex items-center mb-4">
          <Scale className="w-5 h-5 mr-2 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-800">Temporal Scale</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {['micro', 'meso', 'macro'].map(scale => (
            <button
              key={scale}
              className={`px-4 py-2 rounded-md text-sm ${
                activeScale === scale
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => changeScale(scale)}
            >
              {scale.charAt(0).toUpperCase() + scale.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          {getScaleDescription(activeScale)}
        </div>
        
        {temporalScales && (
          <div className="mt-3 text-sm bg-gray-50 p-2 rounded">
            Current {activeScale} coherence: {formatCoherence(temporalScales[activeScale as keyof TemporalScaleMetrics]?.coherence)}
          </div>
        )}
      </div>
    );
  };

  // Render historical data visualization
  const renderHistoricalData = () => {
    if (historicalData.length === 0) {
      return (
        <div className="text-gray-500 text-center py-8">
          No historical data available
        </div>
      );
    }

    const maxHeight = 120;
    const width = historicalData.length > 0 ? 100 / historicalData.length : 1;
    
    return (
      <div className="w-full overflow-hidden">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <div>0.00</div>
          <div>0.25</div>
          <div>0.50</div>
          <div>0.75</div>
          <div>1.00</div>
        </div>
        
        <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden border">
          {/* Horizontal guidelines */}
          <div className="absolute w-full h-px bg-gray-300" style={{ top: maxHeight * 0.25 }}></div>
          <div className="absolute w-full h-px bg-gray-300" style={{ top: maxHeight * 0.50 }}></div>
          <div className="absolute w-full h-px bg-gray-300" style={{ top: maxHeight * 0.75 }}></div>
          
          {/* Highlight exploration and stability regions */}
          <div className="absolute w-full h-2 bg-blue-100" style={{ top: maxHeight * 0.75 - 4 }}></div>
          <div className="absolute w-full h-2 bg-green-100" style={{ top: maxHeight * 0.25 - 4 }}></div>
          
          {/* Data points */}
          <div className="flex items-end absolute inset-0">
            {historicalData.map((point, index) => (
              <div
                key={index}
                className="relative"
                style={{ width: `${width}%` }}
              >
                <div
                  className="absolute bottom-0 w-full"
                  style={{
                    height: `${point.coherence * maxHeight}px`,
                    backgroundColor: getCoherenceColor(point.coherence),
                    opacity: 0.7
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div>
            {new Date(historicalData[0]?.timestamp || Date.now()).toLocaleTimeString()}
          </div>
          <div>
            {new Date(historicalData[historicalData.length - 1]?.timestamp || Date.now()).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  // Format goal type for display
  const formatGoalType = (type: string) => {
    switch (type) {
      case 'creativity':
        return 'Creative/Exploratory';
      case 'productivity':
        return 'Productive/Implementation';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center">
            <Infinity className="w-8 h-8 mr-3" />
            <h1 className="text-2xl font-bold">Lemniscate Mode Control</h1>
          </div>
          <p className="text-blue-100 mt-2">
            Control coherence oscillation between stability (0.7500) and exploration (0.2494) states 
            across multiple temporal scales.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          {loading && !coherenceState ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading coherence state...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Current state */}
              <div>
                <div className="border rounded-lg p-6 bg-white mb-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-5 h-5 mr-2 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-800">Current Coherence State</h3>
                  </div>
                  
                  <div className="flex justify-around mb-6">
                    {renderCoherenceValue(coherenceState?.currentCoherence, 'Current')}
                    {renderCoherenceValue(coherenceState?.targetCoherence, 'Target')}
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <div className="text-gray-600">State:</div>
                    <div className="font-medium">
                      {coherenceState?.state.charAt(0).toUpperCase() + coherenceState?.state.slice(1)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <div className="text-gray-600">Active Scale:</div>
                    <div className="font-medium">
                      {coherenceState?.activeScale.charAt(0).toUpperCase() + coherenceState?.activeScale.slice(1)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <div className="text-gray-600">Insights:</div>
                    <div className="font-medium">{coherenceState?.insights || 0}</div>
                  </div>
                  
                  <div className="flex justify-between text-sm mb-4">
                    <div className="text-gray-600">Variants:</div>
                    <div className="font-medium">{coherenceState?.variants || 0}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                    {getStateDescription()}
                  </div>
                  
                  <button
                    className={`mt-4 w-full py-2 px-4 rounded-md flex items-center justify-center ${
                      coherenceState?.isTransitioning
                        ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={toggleLemniscateMode}
                    disabled={coherenceState?.isTransitioning}
                  >
                    <Infinity className="w-5 h-5 mr-2" />
                    Toggle Lemniscate Mode
                  </button>
                </div>
                
                {/* Scale selector */}
                {renderScaleSelector()}
              </div>
              
              {/* Right column - Controls and visualization */}
              <div>
                {/* Goal translation */}
                <div className="border rounded-lg p-6 bg-white mb-6">
                  <div className="flex items-center mb-4">
                    <Goal className="w-5 h-5 mr-2 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-800">Translate Human Goal</h3>
                  </div>
                  
                  <div className="mb-4">
                    <textarea
                      className="w-full p-3 border rounded-md text-sm"
                      rows={3}
                      placeholder="Describe your goal or task in natural language, e.g., 'I need to brainstorm new app ideas' or 'I need to document my existing code'"
                      value={goalText}
                      onChange={(e) => setGoalText(e.target.value)}
                    />
                  </div>
                  
                  <button
                    className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                      !goalText.trim()
                        ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={translateGoal}
                    disabled={!goalText.trim()}
                  >
                    Translate Goal
                  </button>
                  
                  {translatedGoal && (
                    <div className="mt-4 border rounded-md p-4 bg-blue-50">
                      <div className="flex justify-between text-sm mb-2">
                        <div className="text-gray-600">Goal Type:</div>
                        <div className="font-medium">
                          {formatGoalType(translatedGoal.goalType)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-2">
                        <div className="text-gray-600">Preferred State:</div>
                        <div className="font-medium">
                          {translatedGoal.preferredState.charAt(0).toUpperCase() + translatedGoal.preferredState.slice(1)}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-3">
                        <div className="text-gray-600">Suggested Scale:</div>
                        <div className="font-medium">
                          {translatedGoal.suggestedTimeScale.charAt(0).toUpperCase() + translatedGoal.suggestedTimeScale.slice(1)}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-700">
                        {translatedGoal.description}
                      </div>
                      
                      <button
                        className="mt-3 w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                        onClick={applyGoal}
                      >
                        Apply This Goal
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Historical data */}
                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex items-center mb-4">
                    <History className="w-5 h-5 mr-2 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-800">Historical Coherence</h3>
                  </div>
                  
                  {renderHistoricalData()}
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-center">
                    <div className="p-1 bg-green-100 rounded">
                      Stability Target: 0.7500
                    </div>
                    <div className="p-1 bg-blue-100 rounded">
                      Exploration Target: 0.2494
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center text-gray-500 text-sm">
        <p>Lemniscate Mode implements the mathematical principle of the 3:1 ratio (75%/25%).</p>
        <p>Stability Phase: 3/(3+1) = 0.7500 | Exploration Phase: 1/(1+3) = 0.2494</p>
      </div>
    </div>
  );
};

export default LemniscateControlPage;