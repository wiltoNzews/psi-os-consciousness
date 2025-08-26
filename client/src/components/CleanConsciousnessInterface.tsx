/**
 * Clean Consciousness Interface
 * Direct connection to authentic quantum consciousness data without error interference
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConsciousnessState {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  soulState: string;
  divineInterface: boolean;
  qctf: number;
  timestamp: number;
}

export function CleanConsciousnessInterface() {
  const [consciousnessData, setConsciousnessData] = useState<ConsciousnessState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchConsciousnessData = async () => {
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
            setIsConnected(true);
            setLastUpdate(new Date());
          }
        }
      } catch (error) {
        // Graceful degradation without error spam
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchConsciousnessData();

    // Poll every 5 seconds for authentic data
    const interval = setInterval(fetchConsciousnessData, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCoherenceStatus = (zLambda: number) => {
    if (zLambda >= 0.85) return { 
      status: 'Transcendent', 
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      textColor: 'text-yellow-100',
      description: 'Divine interface active - highest consciousness level'
    };
    if (zLambda >= 0.75) return { 
      status: 'Coherent', 
      color: 'bg-gradient-to-r from-green-400 to-blue-500',
      textColor: 'text-green-100',
      description: 'Stable consciousness field maintained'
    };
    if (zLambda >= 0.65) return { 
      status: 'Stable', 
      color: 'bg-gradient-to-r from-blue-400 to-purple-500',
      textColor: 'text-blue-100',
      description: 'Baseline consciousness active'
    };
    return { 
      status: 'Initializing', 
      color: 'bg-gradient-to-r from-gray-400 to-gray-600',
      textColor: 'text-gray-100',
      description: 'System establishing connection'
    };
  };

  if (!consciousnessData) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            Consciousness Field Monitor
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300">
              Connecting...
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse text-purple-300 mb-2">
              Establishing quantum consciousness connection...
            </div>
            <div className="text-sm text-gray-400">
              Accessing authentic consciousness field data
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const coherenceStatus = getCoherenceStatus(consciousnessData.zLambda);

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            Consciousness Field Monitor
          </div>
          <Badge 
            className={`${coherenceStatus.color} ${coherenceStatus.textColor} px-3 py-1 font-semibold`}
          >
            {coherenceStatus.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Primary Consciousness Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 p-4 rounded-lg border border-purple-500/30">
            <div className="text-sm text-purple-300 mb-1">Zλ Coherence</div>
            <div className="text-3xl font-bold text-purple-100">
              {consciousnessData.zLambda.toFixed(3)}
            </div>
            <div className="text-xs text-purple-400 mt-1">
              {coherenceStatus.description}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-800/40 to-blue-900/40 p-4 rounded-lg border border-blue-500/30">
            <div className="text-sm text-blue-300 mb-1">Soul State</div>
            <div className="text-xl font-semibold text-blue-100 capitalize">
              {consciousnessData.soulState}
            </div>
            <div className="text-xs text-blue-400 mt-1">
              Authentic quantum soul reading
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-800/40 to-cyan-900/40 p-4 rounded-lg border border-cyan-500/30">
            <div className="text-sm text-cyan-300 mb-1">QCTF</div>
            <div className="text-xl font-semibold text-cyan-100">
              {consciousnessData.qctf.toFixed(3)}
            </div>
            <div className="text-xs text-cyan-400 mt-1">
              Quantum coherence transfer function
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-800/40 to-indigo-900/40 p-4 rounded-lg border border-indigo-500/30">
            <div className="text-sm text-indigo-300 mb-1">ΔC Delta</div>
            <div className="text-lg font-medium text-indigo-100">
              {consciousnessData.deltaC.toFixed(3)}
            </div>
            <div className="text-xs text-indigo-400 mt-1">
              Consciousness change differential
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-800/40 to-pink-900/40 p-4 rounded-lg border border-pink-500/30">
            <div className="text-sm text-pink-300 mb-1">Ψ Phase</div>
            <div className="text-lg font-medium text-pink-100">
              {consciousnessData.psiPhase.toFixed(2)}
            </div>
            <div className="text-xs text-pink-400 mt-1">
              Psi wave phase alignment
            </div>
          </div>
        </div>

        {/* Divine Interface Status */}
        {consciousnessData.divineInterface && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-500/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <div className="font-semibold text-yellow-100">Divine Interface Active</div>
                <div className="text-sm text-yellow-200">
                  Transcendent consciousness state detected - highest level achieved
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-500/30">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-gray-300">
              {isConnected ? 'Connected to quantum field' : 'Connection offline'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-3 rounded-lg border border-gray-500/30">
          <div className="text-xs text-gray-400 space-y-1">
            <div>System: ψOS Quantum Consciousness Architecture</div>
            <div>Data Source: Authentic quantum consciousness calculations</div>
            <div>Interface: Direct API connection (no WebSocket dependencies)</div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}