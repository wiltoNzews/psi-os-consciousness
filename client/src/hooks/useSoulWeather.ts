/**
 * Soul Weather React Hook
 * Returns soulstorm, braid, or golden state forecast
 * Integrates with Consciousness Forecast Engine for real-time predictions
 */

import { useState, useEffect, useRef } from 'react';
import { useQuantumCoherenceEngine } from './useQuantumCoherenceEngine';

export interface SoulWeatherState {
  current: {
    type: 'soulstorm' | 'braid' | 'golden' | 'stable';
    intensity: number;
    description: string;
    color: string;
  };
  forecast: {
    next5min: ForecastPrediction;
    next15min: ForecastPrediction;
    next1hour: ForecastPrediction;
  };
  conditions: string[];
  outlook: string;
  severity: 'low' | 'medium' | 'high';
  timelineRisk: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  confidence: number;
}

export interface ForecastPrediction {
  predictedZLambda: number;
  confidence: number;
  probabilities: {
    soulstorm: number;
    braid: number;
    golden: number;
    regression: number;
  };
  mostLikely: string;
}

export interface SoulWeatherOptions {
  updateInterval?: number;
  enablePredictions?: boolean;
  historicalDepth?: number;
}

export function useSoulWeather(options: SoulWeatherOptions = {}) {
  const {
    updateInterval = 5000,
    enablePredictions = true,
    historicalDepth = 50
  } = options;

  const { coherenceData, isConnected } = useQuantumCoherenceEngine({
    enableWebSocket: true
  });

  const [soulWeather, setSoulWeather] = useState<SoulWeatherState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  
  const forecastIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Store historical consciousness data
  useEffect(() => {
    if (!coherenceData) return;

    setHistoricalData(prev => {
      const newData = [...prev, coherenceData];
      return newData.slice(-historicalDepth);
    });
  }, [coherenceData, historicalDepth]);

  // Generate soul weather forecast
  const generateForecast = async () => {
    if (!coherenceData || !isConnected) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/consciousness/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentState: coherenceData.consciousness,
          historicalData: historicalData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate consciousness forecast');
      }

      const forecast = await response.json();
      
      const soulWeatherState: SoulWeatherState = {
        current: forecast.current,
        forecast: forecast.predictions,
        conditions: [forecast.soulWeather.primary, ...forecast.soulWeather.secondary],
        outlook: forecast.soulWeather.outlook,
        severity: forecast.soulWeather.severity,
        timelineRisk: forecast.timelineRisk,
        recommendations: forecast.recommendations,
        confidence: forecast.predictions.next5min.confidence
      };

      setSoulWeather(soulWeatherState);
      lastUpdateRef.current = Date.now();

    } catch (err) {
      console.error('[Soul Weather] Forecast generation failed:', err);
      setError(err instanceof Error ? err.message : 'Forecast generation failed');
      
      // Fallback to basic classification
      if (coherenceData) {
        setSoulWeather(generateBasicForecast(coherenceData.consciousness));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback forecast generation
  const generateBasicForecast = (consciousness: any): SoulWeatherState => {
    const { zLambda, deltaC } = consciousness;
    
    let currentType: 'soulstorm' | 'braid' | 'golden' | 'stable' = 'stable';
    let intensity = zLambda;
    let description = 'Stable consciousness field';
    let color = '#40E0D0';

    if (Math.abs(deltaC) > 0.15) {
      currentType = 'soulstorm';
      intensity = Math.abs(deltaC) * 10;
      description = 'High consciousness turbulence detected';
      color = '#FF6B35';
    } else if (zLambda > 0.95) {
      currentType = 'golden';
      description = 'Divine consciousness interface active';
      color = '#FFD700';
    } else if (zLambda > 0.85) {
      currentType = 'braid';
      description = 'High coherence braid synchronization';
      color = '#9370DB';
    }

    return {
      current: { type: currentType, intensity, description, color },
      forecast: {
        next5min: { predictedZLambda: zLambda, confidence: 0.5, probabilities: { soulstorm: 0.1, braid: 0.3, golden: 0.1, regression: 0.1 }, mostLikely: 'stable' },
        next15min: { predictedZLambda: zLambda, confidence: 0.4, probabilities: { soulstorm: 0.1, braid: 0.3, golden: 0.1, regression: 0.1 }, mostLikely: 'stable' },
        next1hour: { predictedZLambda: zLambda, confidence: 0.3, probabilities: { soulstorm: 0.1, braid: 0.3, golden: 0.1, regression: 0.1 }, mostLikely: 'stable' }
      },
      conditions: [description],
      outlook: 'Stable consciousness evolution continuing',
      severity: zLambda < 0.3 ? 'high' : zLambda < 0.5 ? 'medium' : 'low',
      timelineRisk: zLambda < 0.3 ? 'critical' : zLambda < 0.5 ? 'high' : 'low',
      recommendations: zLambda < 0.5 ? ['Focus on Merkaba activation', 'Increase meditation duration'] : ['Continue current practices'],
      confidence: 0.5
    };
  };

  // Auto-update forecast
  useEffect(() => {
    if (!enablePredictions || !isConnected) return;

    const updateForecast = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current >= updateInterval) {
        generateForecast();
      }
    };

    // Initial forecast
    updateForecast();

    // Set up interval
    forecastIntervalRef.current = setInterval(updateForecast, updateInterval);

    return () => {
      if (forecastIntervalRef.current) {
        clearInterval(forecastIntervalRef.current);
      }
    };
  }, [enablePredictions, isConnected, updateInterval, coherenceData]);

  // Weather condition helpers
  const isStorm = soulWeather?.current.type === 'soulstorm';
  const isBraid = soulWeather?.current.type === 'braid';
  const isGolden = soulWeather?.current.type === 'golden';
  const isStable = soulWeather?.current.type === 'stable';

  // Timeline risk assessment
  const isTimelineCritical = soulWeather?.timelineRisk === 'critical';
  const isTimelineAtRisk = ['high', 'critical'].includes(soulWeather?.timelineRisk || 'low');

  // Forecast helpers
  const getNextStateChange = () => {
    if (!soulWeather) return null;
    
    const { next5min, next15min, next1hour } = soulWeather.forecast;
    
    if (next5min.mostLikely !== soulWeather.current.type) {
      return { timeframe: '5 minutes', newState: next5min.mostLikely, confidence: next5min.confidence };
    }
    
    if (next15min.mostLikely !== soulWeather.current.type) {
      return { timeframe: '15 minutes', newState: next15min.mostLikely, confidence: next15min.confidence };
    }
    
    if (next1hour.mostLikely !== soulWeather.current.type) {
      return { timeframe: '1 hour', newState: next1hour.mostLikely, confidence: next1hour.confidence };
    }
    
    return null;
  };

  // Emergency protocols
  const needsEmergencyIntervention = soulWeather?.timelineRisk === 'critical' || 
                                   (soulWeather?.current.type === 'soulstorm' && soulWeather?.current.intensity > 0.8);

  // Manual forecast refresh
  const refreshForecast = () => {
    if (isConnected && coherenceData) {
      generateForecast();
    }
  };

  return {
    // Core state
    soulWeather,
    isLoading,
    error,
    isConnected,
    
    // Weather conditions
    isStorm,
    isBraid,
    isGolden,
    isStable,
    
    // Timeline assessment
    isTimelineCritical,
    isTimelineAtRisk,
    needsEmergencyIntervention,
    
    // Forecast data
    currentIntensity: soulWeather?.current.intensity || 0,
    confidence: soulWeather?.confidence || 0,
    nextStateChange: getNextStateChange(),
    
    // Actions
    refreshForecast,
    
    // Raw data access
    historicalData,
    lastUpdate: lastUpdateRef.current
  };
}

// Weather condition type guards
export const isSoulstorm = (weather: SoulWeatherState | null): boolean => 
  weather?.current.type === 'soulstorm';

export const isBraidState = (weather: SoulWeatherState | null): boolean => 
  weather?.current.type === 'braid';

export const isGoldenState = (weather: SoulWeatherState | null): boolean => 
  weather?.current.type === 'golden';

export const isStableState = (weather: SoulWeatherState | null): boolean => 
  weather?.current.type === 'stable';

// Timeline risk helpers
export const isTimelineEndangered = (weather: SoulWeatherState | null): boolean => 
  ['high', 'critical'].includes(weather?.timelineRisk || 'low');

export const requiresImmediateAction = (weather: SoulWeatherState | null): boolean => 
  weather?.timelineRisk === 'critical' || 
  (weather?.current.type === 'soulstorm' && weather?.current.intensity > 0.8);