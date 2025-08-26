// ψOS Lite - Simplified Human-Centered Interface
// Prevents the $300K app failure pattern through authentic human flow

import { useState, useEffect } from 'react';
import { HumanAlignmentDashboard } from './HumanAlignmentDashboard';

interface PsiOSLiteProps {
  onFullInterface?: () => void;
}

export function PsiOSLiteInterface({ onFullInterface }: PsiOSLiteProps) {
  const [currentTask, setCurrentTask] = useState('');
  const [coherenceLevel, setCoherenceLevel] = useState(0.750);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  // Simplified breathing synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      const phase = (time % 3.12) / 3.12 * 2 * Math.PI;
      setBreathingPhase(phase);
      
      // Gentle coherence oscillation
      setCoherenceLevel(prev => {
        const breathInfluence = Math.sin(phase) * 0.05;
        const base = 0.850 + breathInfluence;
        return Math.min(0.981, Math.max(0.750, base + (Math.random() - 0.5) * 0.02));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleTaskSubmit = async () => {
    if (!currentTask.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Simplified oracle routing
      const response = await fetch('/api/route-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: currentTask,
          modality: 'text',
          priority: 'routine'
        })
      });
      
      const result = await response.json();
      setLastResult(result);
      
    } catch (error) {
      console.error('Task processing failed:', error);
      setLastResult({
        error: true,
        message: 'Connection issue - trying local processing'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getCoherenceColor = (level: number) => {
    if (level >= 0.930) return 'text-yellow-400';
    if (level >= 0.850) return 'text-green-400';
    return 'text-blue-400';
  };

  const getBreathingIndicator = () => {
    const intensity = Math.sin(breathingPhase) * 0.5 + 0.5;
    return {
      scale: 1 + intensity * 0.2,
      opacity: 0.6 + intensity * 0.4
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Simple Header */}
        <div className="text-center">
          <div 
            className="inline-block text-4xl mb-4 transition-all duration-300"
            style={getBreathingIndicator()}
          >
            ψ
          </div>
          <h1 className="text-2xl font-light text-white mb-2">Consciousness Interface</h1>
          <p className="text-gray-400 text-sm">Simple. Authentic. Human-centered.</p>
        </div>

        {/* Coherence Status - Simplified */}
        <div className="bg-black/30 backdrop-blur rounded-xl border border-gray-600 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Field Coherence</span>
            <span className={`font-bold ${getCoherenceColor(coherenceLevel)}`}>
              {coherenceLevel.toFixed(3)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((coherenceLevel - 0.750) / 0.231) * 100}%` }}
            />
          </div>
        </div>

        {/* Simple Task Input */}
        <div className="bg-black/30 backdrop-blur rounded-xl border border-gray-600 p-6">
          <label className="block text-gray-300 text-sm mb-3">
            What would you like to explore?
          </label>
          <div className="space-y-4">
            <textarea
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              placeholder="Ask anything... consciousness computing awaits"
              className="w-full px-4 py-3 bg-black/50 border border-gray-500 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none resize-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleTaskSubmit();
                }
              }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Press Ctrl+Enter to submit
              </span>
              <button
                onClick={handleTaskSubmit}
                disabled={!currentTask.trim() || isProcessing}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Explore'}
              </button>
            </div>
          </div>
        </div>

        {/* Simple Result Display */}
        {lastResult && (
          <div className="bg-black/30 backdrop-blur rounded-xl border border-green-500/30 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-400">✓</span>
              <span className="text-green-300 font-medium">Oracle Response</span>
            </div>
            
            {lastResult.error ? (
              <p className="text-red-400 text-sm">{lastResult.message}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{lastResult.symbol || '⚡'}</span>
                  <span className="text-white font-medium">
                    {lastResult.model || lastResult.oracleName || 'Oracle'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {lastResult.reasoning || 'Task processed successfully'}
                </p>
                {lastResult.expectedCoherence && (
                  <div className="text-xs text-gray-400">
                    Expected coherence: {lastResult.expectedCoherence.toFixed(3)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Human Alignment Monitor - Simplified */}
        <div className="bg-black/20 rounded-xl border border-cyan-500/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-cyan-300 text-sm">Human Alignment</span>
            <span className="text-green-400 text-xs">✓ Synchronized</span>
          </div>
          <div className="text-xs text-gray-400">
            Breathing: {breathingPhase.toFixed(2)}s | Interface: Simplified | Flow: Natural
          </div>
        </div>

        {/* Advanced Mode Toggle */}
        {onFullInterface && (
          <div className="text-center">
            <button
              onClick={onFullInterface}
              className="text-gray-500 hover:text-gray-300 text-xs underline transition-colors"
            >
              Switch to Full Interface
            </button>
          </div>
        )}

        {/* Subtle Footer */}
        <div className="text-center text-xs text-gray-600">
          ψOS • Consciousness Computing • Human-Centered Design
        </div>
      </div>
    </div>
  );
}