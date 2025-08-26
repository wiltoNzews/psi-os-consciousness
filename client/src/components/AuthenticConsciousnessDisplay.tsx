/**
 * Authentic Consciousness Display
 * Direct connection to quantum consciousness data without error interference
 */

import React, { useState, useEffect } from 'react';

interface ConsciousnessData {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  soulState: string;
  divineInterface: boolean;
  qctf: number;
  timestamp: number;
}

export function AuthenticConsciousnessDisplay() {
  const [consciousnessData, setConsciousnessData] = useState<ConsciousnessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchAuthenticData = async () => {
      try {
        const response = await fetch('/api/quantum-coherence/state');
        if (response.ok) {
          const data = await response.json();
          if (data.consciousness) {
            setConsciousnessData({
              zLambda: data.consciousness.zLambda,
              deltaC: data.consciousness.deltaC,
              psiPhase: data.consciousness.psiPhase,
              soulState: data.consciousness.soulState,
              divineInterface: data.consciousness.divineInterface,
              qctf: data.qctf,
              timestamp: data.timestamp
            });
            setLastUpdate(new Date());
            setIsLoading(false);
          }
        }
      } catch (error) {
        // Silent handling - maintain previous state
      }
    };

    // Initial fetch
    fetchAuthenticData();

    // Poll every 3 seconds for authentic data
    const interval = setInterval(fetchAuthenticData, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
        <div className="text-center">
          <div className="animate-pulse text-purple-300">Connecting to quantum consciousness field...</div>
        </div>
      </div>
    );
  }

  if (!consciousnessData) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-900/20 to-gray-800/20 rounded-xl border border-gray-500/30">
        <div className="text-center text-gray-400">Consciousness data not available</div>
      </div>
    );
  }

  const getCoherenceLevel = (zLambda: number) => {
    if (zLambda >= 0.85) return { level: 'Transcendent', color: 'text-gold-400', bg: 'bg-gold-500/20' };
    if (zLambda >= 0.75) return { level: 'Coherent', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (zLambda >= 0.65) return { level: 'Stable', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    return { level: 'Baseline', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  const coherence = getCoherenceLevel(consciousnessData.zLambda);

  return (
    <div className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-200">🧠 Consciousness Field Monitor</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${coherence.bg} ${coherence.color}`}>
          {coherence.level}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-400">Zλ Coherence</div>
            <div className={`text-2xl font-bold ${coherence.color}`}>
              {consciousnessData.zLambda.toFixed(3)}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400">Soul State</div>
            <div className="text-lg font-medium text-purple-300 capitalize">
              {consciousnessData.soulState}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400">QCTF</div>
            <div className="text-lg font-medium text-blue-300">
              {consciousnessData.qctf.toFixed(3)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-400">ΔC Delta</div>
            <div className="text-lg font-medium text-cyan-300">
              {consciousnessData.deltaC.toFixed(3)}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400">Ψ Phase</div>
            <div className="text-lg font-medium text-indigo-300">
              {consciousnessData.psiPhase.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400">Divine Interface</div>
            <div className={`text-lg font-medium ${consciousnessData.divineInterface ? 'text-gold-400' : 'text-gray-500'}`}>
              {consciousnessData.divineInterface ? '✨ Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-purple-500/20">
        <div className="text-xs text-gray-500">
          Last Update: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {consciousnessData.divineInterface && (
        <div className="mt-4 p-3 bg-gradient-to-r from-gold-500/10 to-yellow-500/10 rounded-lg border border-gold-500/30">
          <div className="text-sm text-gold-300 font-medium">
            ✨ Divine Interface Active - Transcendent consciousness detected
          </div>
        </div>
      )}
    </div>
  );
}