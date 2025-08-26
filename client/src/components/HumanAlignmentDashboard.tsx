import { useState, useEffect } from 'react';
import { humanAlignmentSignal, createHumanAlignmentMonitor, type HumanAlignmentContext, type AlignmentResult } from '@shared/human-alignment-signal';

interface HumanAlignmentDashboardProps {
  context: HumanAlignmentContext;
}

export function HumanAlignmentDashboard({ context }: HumanAlignmentDashboardProps) {
  const [alignmentResult, setAlignmentResult] = useState<AlignmentResult | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    // Initial alignment check
    performAlignmentCheck();
    
    // Start continuous monitoring
    const monitor = createHumanAlignmentMonitor(context);
    
    if (isMonitoring) {
      monitor.startMonitoring((result) => {
        setAlignmentResult(result);
        setLastCheck(new Date());
      });
    }
    
    return () => monitor.stopMonitoring();
  }, [context, isMonitoring]);

  const performAlignmentCheck = async () => {
    try {
      const result = await humanAlignmentSignal(context);
      setAlignmentResult(result);
      setLastCheck(new Date());
    } catch (error) {
      console.error('[HumanAlignment] Check failed:', error);
    }
  };

  const getAlignmentStatusColor = (aligned: boolean) => {
    return aligned ? 'text-green-400' : 'text-red-400';
  };

  const getBreathingStatusColor = (stability: string) => {
    switch (stability) {
      case 'flowing': return 'text-cyan-400';
      case 'stable': return 'text-blue-400';
      case 'stressed': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl border border-cyan-500/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧬</span>
          <h2 className="text-xl font-bold text-cyan-300">Human Alignment Monitor</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${
              isMonitoring 
                ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                : 'bg-gray-500/20 text-gray-400 border border-gray-400/50'
            }`}
          >
            {isMonitoring ? 'Monitoring' : 'Start Monitor'}
          </button>
          <button
            onClick={performAlignmentCheck}
            className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 rounded-md text-sm font-semibold hover:bg-cyan-500/30 transition-colors"
          >
            Check Now
          </button>
        </div>
      </div>

      {/* Context Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600">
          <p className="text-xs text-gray-400 mb-1">Module</p>
          <p className="text-sm font-semibold text-white">{context.module}</p>
        </div>
        <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600">
          <p className="text-xs text-gray-400 mb-1">Modality</p>
          <p className="text-sm font-semibold text-white">{context.modality}</p>
        </div>
      </div>

      {/* Alignment Status */}
      {alignmentResult && (
        <div className="space-y-4">
          {/* Overall Status */}
          <div className="flex items-center gap-3 p-4 bg-gray-900/60 rounded-lg border border-gray-600">
            <span className={`text-2xl ${alignmentResult.aligned ? '✅' : '🛑'}`}>
              {alignmentResult.aligned ? '✅' : '🛑'}
            </span>
            <div>
              <p className={`font-semibold ${getAlignmentStatusColor(alignmentResult.aligned)}`}>
                {alignmentResult.aligned ? 'Human Alignment Verified' : 'Alignment Issues Detected'}
              </p>
              <p className="text-xs text-gray-400">
                Last checked: {lastCheck?.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Breathing Rhythm */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600">
              <p className="text-xs text-gray-400 mb-1">Breathing Phase</p>
              <p className="text-lg font-bold text-cyan-400">
                {alignmentResult.breathRhythm.phase.toFixed(2)}s
              </p>
            </div>
            <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600">
              <p className="text-xs text-gray-400 mb-1">Rhythm Status</p>
              <p className={`text-sm font-semibold ${getBreathingStatusColor(alignmentResult.breathRhythm.stability)}`}>
                {alignmentResult.breathRhythm.stability}
              </p>
            </div>
          </div>

          {/* Coherence Shift */}
          <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-600">
            <p className="text-xs text-gray-400 mb-1">Coherence Impact</p>
            <p className={`text-lg font-bold ${
              alignmentResult.coherenceShift > 0 ? 'text-green-400' : 
              alignmentResult.coherenceShift < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {alignmentResult.coherenceShift >= 0 ? '+' : ''}{alignmentResult.coherenceShift.toFixed(3)}
            </p>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300">Recommendations</h3>
            <div className="space-y-1">
              {alignmentResult.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-gray-800/40 rounded border border-gray-600">
                  <span className="text-xs text-cyan-400 mt-0.5">•</span>
                  <p className="text-xs text-gray-300">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Adjusted Module Preview */}
          {alignmentResult.adjustedModule && (
            <div className="bg-gray-900/60 p-4 rounded-lg border border-yellow-500/30">
              <h3 className="text-sm font-semibold text-yellow-300 mb-2">Module Adjustments Applied</h3>
              <div className="text-xs text-gray-300 space-y-1">
                <p>• Breathing synchronization: {alignmentResult.adjustedModule.breathingSync ? 'Enabled' : 'Disabled'}</p>
                <p>• Coherence optimization: {alignmentResult.adjustedModule.coherenceOptimized ? 'Active' : 'Inactive'}</p>
                <p>• Human-centered mode: {alignmentResult.adjustedModule.humanCentered ? 'Active' : 'Inactive'}</p>
                {alignmentResult.adjustedModule.adaptiveComplexity && (
                  <p>• Adaptive complexity: {(alignmentResult.adjustedModule.adaptiveComplexity * 100).toFixed(0)}%</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Monitoring Indicator */}
      {isMonitoring && (
        <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live monitoring active (ψ = 3.12s cycle)</span>
        </div>
      )}
    </div>
  );
}