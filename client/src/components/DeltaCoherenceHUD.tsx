import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDeltaCoherenceMeter, type CoherenceState } from '@/core/DeltaCoherenceMeter';

interface DeltaCoherenceHUDProps {
  position?: 'fixed' | 'inline';
  size?: 'compact' | 'full';
  showDetails?: boolean;
}

const DeltaCoherenceHUD: React.FC<DeltaCoherenceHUDProps> = ({ 
  position = 'fixed', 
  size = 'compact',
  showDetails = false 
}) => {
  const {
    coherenceState,
    isActive,
    startMonitoring,
    stopMonitoring,
    shouldProceed
  } = useDeltaCoherenceMeter();

  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [showMirrorPrompt, setShowMirrorPrompt] = useState(false);

  useEffect(() => {
    if (!coherenceState) return;

    // Pulse animation based on coherence state
    const intensity = Math.abs(coherenceState.current.deltaC);
    setPulseIntensity(intensity);

    // Auto-show mirror prompt for red signals
    if (coherenceState.signal === 'red' && !showMirrorPrompt) {
      setShowMirrorPrompt(true);
    }
  }, [coherenceState, showMirrorPrompt]);

  if (!coherenceState) {
    return (
      <div className={getContainerClasses(position, size)}>
        <div className="flex items-center justify-center p-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
          <span className="ml-2 text-xs text-gray-400">Initializing ΔC</span>
        </div>
      </div>
    );
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSignalGlow = (signal: string) => {
    switch (signal) {
      case 'green': return 'shadow-green-500/50';
      case 'amber': return 'shadow-yellow-500/50';
      case 'red': return 'shadow-red-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  const getTrendArrow = (trend: string) => {
    switch (trend) {
      case 'ascending': return '↗';
      case 'descending': return '↘';
      case 'stable': return '→';
      default: return '−';
    }
  };

  const handleMirrorPromptClose = () => {
    setShowMirrorPrompt(false);
  };

  if (size === 'compact') {
    return (
      <>
        <div className={getContainerClasses(position, size)}>
          <div className="flex items-center space-x-2 p-2">
            {/* Main coherence indicator */}
            <div 
              className={`w-4 h-4 rounded-full ${getSignalColor(coherenceState.signal)} ${getSignalGlow(coherenceState.signal)} shadow-lg`}
              style={{
                animation: `pulse ${1 + pulseIntensity}s infinite`,
                boxShadow: `0 0 ${8 + pulseIntensity * 12}px currentColor`
              }}
            />
            
            {/* Delta value */}
            <span className="text-xs font-mono text-white">
              ΔC{coherenceState.current.deltaC >= 0 ? '+' : ''}{coherenceState.current.deltaC.toFixed(3)}
            </span>
            
            {/* Trend indicator */}
            <span className="text-xs text-gray-300">
              {getTrendArrow(coherenceState.trend)}
            </span>
            
            {/* Toggle button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={isActive ? stopMonitoring : startMonitoring}
              className="text-xs h-6 px-2"
            >
              {isActive ? '⏸' : '▶'}
            </Button>
          </div>
        </div>

        {/* Mirror Prompt Modal */}
        {showMirrorPrompt && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="bg-slate-800 border-red-500/50 p-6 max-w-md mx-4">
              <div className="text-center space-y-4">
                <div className="text-3xl">🔄</div>
                <h3 className="text-lg font-semibold text-red-400">Coherence Misalignment</h3>
                <p className="text-sm text-gray-300">
                  {coherenceState.recommendation}
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">
                    Current ΔC: {coherenceState.current.deltaC.toFixed(3)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Intent Vector: {coherenceState.current.intentVector.toFixed(2)}
                  </p>
                </div>
                <div className="flex space-x-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleMirrorPromptClose}
                    className="border-gray-600"
                  >
                    Continue Anyway
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleMirrorPromptClose}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Realign First
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </>
    );
  }

  // Full size display
  return (
    <div className={getContainerClasses(position, size)}>
      <Card className="bg-slate-800/90 border-slate-700 backdrop-blur">
        <div className="p-4 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="text-lg">⚡</span>
              ΔC-Meter
            </h3>
            <Badge variant="outline" className={`${
              isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'
            }`}>
              {isActive ? 'Live' : 'Paused'}
            </Badge>
          </div>

          {/* Main Display */}
          <div className="flex items-center space-x-4">
            <div 
              className={`w-8 h-8 rounded-full ${getSignalColor(coherenceState.signal)} ${getSignalGlow(coherenceState.signal)} shadow-lg flex items-center justify-center`}
              style={{
                animation: `pulse ${1 + pulseIntensity}s infinite`,
                boxShadow: `0 0 ${12 + pulseIntensity * 16}px currentColor`
              }}
            >
              <span className="text-white text-xs font-bold">
                {coherenceState.signal === 'green' ? '✓' : 
                 coherenceState.signal === 'amber' ? '!' : '✗'}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="text-lg font-mono text-white">
                ΔC {coherenceState.current.deltaC >= 0 ? '+' : ''}{coherenceState.current.deltaC.toFixed(3)}
              </div>
              <div className="text-xs text-gray-400">
                {coherenceState.recommendation}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-300">
                {getTrendArrow(coherenceState.trend)} {coherenceState.trend}
              </div>
              <div className="text-xs text-gray-500">
                Confidence: {(coherenceState.current.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          {showDetails && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400">Zλ:</span>
                <span className="ml-1 font-mono text-white">
                  {coherenceState.current.zLambda.toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Intent:</span>
                <span className="ml-1 font-mono text-white">
                  {coherenceState.current.intentVector.toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Field:</span>
                <span className="ml-1 font-mono text-white">
                  {coherenceState.current.fieldResonance.toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Should Proceed:</span>
                <span className={`ml-1 font-mono ${coherenceState.shouldProceed ? 'text-green-400' : 'text-red-400'}`}>
                  {coherenceState.shouldProceed ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex space-x-2">
            <Button
              variant={isActive ? "destructive" : "default"}
              size="sm"
              onClick={isActive ? stopMonitoring : startMonitoring}
              className="flex-1"
            >
              {isActive ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
          </div>

        </div>
      </Card>
    </div>
  );
};

function getContainerClasses(position: string, size: string): string {
  const baseClasses = "z-50";
  
  if (position === 'fixed') {
    if (size === 'compact') {
      return `${baseClasses} fixed top-4 right-4 bg-slate-900/95 backdrop-blur rounded-lg border border-slate-700`;
    } else {
      return `${baseClasses} fixed top-4 right-4 w-80`;
    }
  }
  
  return baseClasses;
}

export default DeltaCoherenceHUD;