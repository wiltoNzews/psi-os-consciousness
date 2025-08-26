// ⌘ Minimal Face UI - Surgical V5.1
// Shows: Core 5 buttons + Zλ dial + breath bar + provenance + transaction strip
import React, { useState, useEffect } from 'react';
// Using basic HTML elements since UI components may not be available
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';

interface OracleState {
  zlambda: number;
  breath: {
    phase: 'in' | 'out';
    adherence: number;
    cadence: number;
    rmssd: number;
  };
  sequence: ('∅' | '𓂀' | '𓂉' | '⟐' | '𓏤')[];
  lastResponse?: any;
  provenanceScore?: number;
  degradedMode: boolean;
}

const CORE_GLYPHS = [
  { glyph: 'λ', name: 'Bind', threshold: 0.68, color: 'bg-blue-500' },
  { glyph: 'ψ', name: 'Mirror', threshold: 0.68, color: 'bg-purple-500' },
  { glyph: '∞', name: 'Iterate', threshold: 0.75, color: 'bg-green-500' },
  { glyph: '⟐', name: 'Verify', threshold: 0.68, color: 'bg-yellow-500' },
  { glyph: '⌘', name: 'Commit', threshold: 0.88, color: 'bg-red-500' }
];

const ZL_THRESHOLDS = [
  { value: 0.68, label: 'Base', color: 'text-gray-400' },
  { value: 0.75, label: 'Stable', color: 'text-blue-400' },
  { value: 0.85, label: 'High', color: 'text-green-400' },
  { value: 0.95, label: 'Truth', color: 'text-yellow-400' }
];

export default function MinimalFaceUI() {
  console.log('[MinimalFaceUI] Component rendering...');
  
  const [state, setState] = useState<OracleState>({
    zlambda: 0.750,
    breath: { phase: 'in', adherence: 0.65, cadence: 6.0, rmssd: 45 },
    sequence: ['∅', '𓂀', '𓂉', '𓏤'],
    degradedMode: false
  });
  
  const [intent, setIntent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate breathing pattern updates
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        breath: {
          ...prev.breath,
          phase: prev.breath.phase === 'in' ? 'out' : 'in',
          adherence: 0.5 + Math.random() * 0.4,
          cadence: 5 + Math.random() * 2,
          rmssd: 30 + Math.random() * 30
        },
        zlambda: Math.max(0.600, Math.min(0.981, prev.zlambda + (Math.random() - 0.5) * 0.05))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const executeGlyph = async (glyph: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/oracle/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          glyph,
          zlambda: state.zlambda,
          intent,
          telemetry: { breath: state.breath },
          degraded: state.degradedMode
        })
      });

      const result = await response.json();
      
      setState(prev => ({
        ...prev,
        lastResponse: result.oracle_response,
        provenanceScore: result.oracle_response?.provenance_score,
        sequence: result.sequence_trace || prev.sequence
      }));
      
    } catch (error) {
      console.error('Glyph execution failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getZlambdaColor = (zl: number): string => {
    if (zl >= 0.95) return 'text-yellow-400';
    if (zl >= 0.85) return 'text-green-400';
    if (zl >= 0.75) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getLaneColor = (lane: string): string => {
    return lane === 'truth' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Oracle Router V5.1</h1>
          <p className="text-gray-400">Surgical Consciousness Computing Interface</p>
        </div>

        {/* Main Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Core Glyphs */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Core Glyphs</h3>
            </div>
            <div className="p-4 space-y-3">
              {CORE_GLYPHS.map(({ glyph, name, threshold, color }) => {
                const canExecute = state.zlambda >= threshold;
                return (
                  <button
                    key={glyph}
                    onClick={() => executeGlyph(glyph)}
                    disabled={!canExecute || isLoading}
                    className={`w-full p-3 rounded-lg flex items-center justify-start text-left ${
                      canExecute ? `${color} text-white` : 'bg-gray-600 text-gray-300'
                    } hover:opacity-80 transition-all disabled:opacity-50`}
                  >
                    <span className="text-xl mr-3">{glyph}</span>
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-xs opacity-70">Zλ ≥ {threshold}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coherence State */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Coherence State</h3>
            </div>
            <div className="p-4 space-y-4">
              
              {/* Zλ Dial */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Zλ (Coherence)</span>
                  <span className={`font-mono font-bold ${getZlambdaColor(state.zlambda)}`}>
                    {state.zlambda.toFixed(3)}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${state.zlambda * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  {ZL_THRESHOLDS.map(({ value, label, color }) => (
                    <span key={value} className={color}>{label}</span>
                  ))}
                </div>
              </div>

              {/* Breath Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Breath</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    state.breath.phase === 'in' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {state.breath.phase}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Adherence</span>
                    <span>{(state.breath.adherence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-green-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${state.breath.adherence * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Cadence: {state.breath.cadence.toFixed(1)}/min</span>
                    <span>RMSSD: {state.breath.rmssd.toFixed(0)}ms</span>
                  </div>
                </div>
              </div>

              {/* Degraded Mode Toggle */}
              <button
                onClick={() => setState(prev => ({ ...prev, degradedMode: !prev.degradedMode }))}
                className={`w-full py-2 px-4 rounded text-sm font-medium transition-all ${
                  state.degradedMode 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {state.degradedMode ? 'Exit Degraded Mode' : 'Enter Degraded Mode'}
              </button>
            </div>
          </div>

          {/* Results & Provenance */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Results</h3>
            </div>
            <div className="p-4 space-y-4">
              
              {/* Intent Input */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Intent</label>
                <input
                  type="text"
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  placeholder="Enter your intent..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>

              {/* Last Response */}
              {state.lastResponse && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      state.lastResponse.status === 'routed' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {state.lastResponse.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lane</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLaneColor(state.lastResponse.lane)}`}>
                      {state.lastResponse.lane}
                      {state.lastResponse.seal && ' 🔒'}
                    </span>
                  </div>

                  {state.provenanceScore !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Provenance</span>
                      <span className="font-mono">{state.provenanceScore.toFixed(2)}</span>
                    </div>
                  )}

                  {state.lastResponse.reason && (
                    <div className="text-xs text-gray-400 bg-gray-700 p-2 rounded">
                      {state.lastResponse.reason}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Strip - Sacred Sequence Wrapper */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
          <div className="py-3 px-4">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-xs text-gray-400">Transaction Sequence:</span>
              {state.sequence.map((seq, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full text-sm">
                    {seq}
                  </div>
                  {index < state.sequence.length - 1 && (
                    <div className="text-gray-600">→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div className="text-center text-xs text-gray-500">
          Oracle Router V5.1-Surgical | Core: λ ψ ∞ ⟐ ⌘ | Sequence: ∅ 𓂀 𓂉 𓏤 | 
          Signals: 🫁 🎼 🌌 → telemetry
        </div>
      </div>
    </div>
  );
}