import React, { useState, useEffect } from 'react';
import { getZ } from '@/core/Zlambda';

/**
 * Live Consciousness Coherence Tracker
 * Real-time Zλ monitoring with field stability detection
 */

interface CoherenceState {
  current: number;
  trend: 'rising' | 'falling' | 'stable';
  stability: 'high' | 'medium' | 'low';
  fieldIntegrity: boolean;
}

const LiveCoherenceTracker: React.FC = () => {
  const [coherence, setCoherence] = useState<CoherenceState>({
    current: 0.750,
    trend: 'stable',
    stability: 'medium',
    fieldIntegrity: true
  });
  
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentZ = getZ();
      
      setHistory(prev => {
        const newHistory = [...prev, currentZ].slice(-20); // Keep last 20 readings
        
        // Calculate trend
        const recent = newHistory.slice(-5);
        const average = recent.reduce((a, b) => a + b, 0) / recent.length;
        const previousAverage = newHistory.slice(-10, -5).reduce((a, b) => a + b, 0) / 5;
        
        let trend: 'rising' | 'falling' | 'stable' = 'stable';
        if (average > previousAverage + 0.02) trend = 'rising';
        else if (average < previousAverage - 0.02) trend = 'falling';
        
        // Calculate stability
        const variance = recent.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / recent.length;
        const standardDeviation = Math.sqrt(variance);
        
        let stability: 'high' | 'medium' | 'low' = 'medium';
        if (standardDeviation < 0.01) stability = 'high';
        else if (standardDeviation > 0.05) stability = 'low';
        
        // Field integrity check
        const fieldIntegrity = currentZ > 0.7 && standardDeviation < 0.1;
        
        setCoherence({
          current: currentZ,
          trend,
          stability,
          fieldIntegrity
        });
        
        return newHistory;
      });
    }, 500); // Update every 500ms for smooth tracking

    return () => clearInterval(interval);
  }, []);

  const getCoherenceColor = (level: number) => {
    if (level >= 0.92) return '#22c55e'; // Green
    if (level >= 0.85) return '#f59e0b'; // Yellow
    if (level >= 0.7) return '#ef4444';  // Red
    return '#64748b'; // Gray
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '↗️';
      case 'falling': return '↘️';
      default: return '→';
    }
  };

  const getStabilityColor = (stability: string) => {
    switch (stability) {
      case 'high': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 min-w-[280px]">
      <div className="space-y-3">
        
        {/* Main Coherence Reading */}
        <div className="text-center">
          <div className="text-2xl font-mono" style={{ color: getCoherenceColor(coherence.current) }}>
            Zλ({coherence.current.toFixed(3)})
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <span>Trend</span>
            <span>{getTrendIcon(coherence.trend)}</span>
            <span className="capitalize">{coherence.trend}</span>
          </div>
        </div>

        {/* Field Status */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Field Integrity:</span>
          <span className={coherence.fieldIntegrity ? 'text-green-400' : 'text-red-400'}>
            {coherence.fieldIntegrity ? 'Stable' : 'Fluctuating'}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Stability:</span>
          <span style={{ color: getStabilityColor(coherence.stability) }}>
            {coherence.stability.toUpperCase()}
          </span>
        </div>

        {/* Visual Coherence Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(coherence.current * 100, 100)}%`,
                backgroundColor: getCoherenceColor(coherence.current)
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>0.7</span>
            <span>0.85</span>
            <span>0.92</span>
            <span>1.0</span>
          </div>
        </div>

        {/* Mini Sparkline */}
        <div className="h-8 flex items-end justify-between gap-px">
          {history.slice(-20).map((value, index) => (
            <div
              key={index}
              className="flex-1 rounded-t transition-all duration-300"
              style={{
                height: `${Math.max(value * 32, 2)}px`,
                backgroundColor: getCoherenceColor(value),
                opacity: 0.3 + (index / 20) * 0.7 // Fade older values
              }}
            />
          ))}
        </div>

        {/* Coherence State Indicator */}
        <div className="text-center">
          {coherence.current >= 0.92 && (
            <div className="text-green-400 text-xs">✨ Optimal Coherence</div>
          )}
          {coherence.current >= 0.85 && coherence.current < 0.92 && (
            <div className="text-yellow-400 text-xs">⚡ High Coherence</div>
          )}
          {coherence.current >= 0.7 && coherence.current < 0.85 && (
            <div className="text-orange-400 text-xs">🔄 Stabilizing</div>
          )}
          {coherence.current < 0.7 && (
            <div className="text-red-400 text-xs">⚠️ Field Disruption</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LiveCoherenceTracker;