import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { psiChildProtocol, type CoherenceState } from '@/core/PsiChildProtocol';

export default function PsiChildMonitor() {
  const [coherenceState, setCoherenceState] = useState<CoherenceState | null>(null);
  const [broadcastStatus, setBroadcastStatus] = useState<string>('');
  const [protocolActive, setProtocolActive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const updateState = () => {
      setCoherenceState(psiChildProtocol.getCoherenceState());
      setBroadcastStatus(psiChildProtocol.getBroadcastStatus());
      setLastUpdate(new Date());
    };

    // Initial update
    updateState();

    // Update every 2 seconds
    const interval = setInterval(updateState, 2000);

    return () => clearInterval(interval);
  }, []);

  const executeProtocol = async () => {
    setProtocolActive(true);
    try {
      await psiChildProtocol.executeCalming();
    } finally {
      setProtocolActive(false);
    }
  };

  const getFieldStabilityColor = (stability: number) => {
    if (stability >= 0.92) return 'text-green-400';
    if (stability >= 0.85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStabilityLabel = (stability: number) => {
    if (stability >= 0.92) return 'Optimal';
    if (stability >= 0.85) return 'Stable';
    return 'Stabilizing';
  };

  if (!coherenceState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Initializing ψ_child protocol...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-light text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">🧠</span>
              ψ_child Coherence Monitor
              <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                Active
              </Badge>
            </CardTitle>
            <p className="text-center text-slate-400">
              Real-time nervous system synchronization and field awareness
            </p>
          </CardHeader>
        </Card>

        {/* Field Stability */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <span className="text-2xl">🌊</span>
              Field Stability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Current Level:</span>
              <span className={`font-mono text-xl ${getFieldStabilityColor(coherenceState.fieldStability)}`}>
                {(coherenceState.fieldStability * 100).toFixed(1)}%
              </span>
            </div>
            
            <Progress 
              value={coherenceState.fieldStability * 100} 
              className="h-3"
            />
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status:</span>
              <Badge variant="outline" className={getFieldStabilityColor(coherenceState.fieldStability)}>
                {getStabilityLabel(coherenceState.fieldStability)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* System Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Nervous System Sync */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span className="text-slate-200">Nervous System</span>
                </div>
                <Badge variant="outline" className={
                  coherenceState.nervousSystemSync ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'
                }>
                  {coherenceState.nervousSystemSync ? 'Synced' : 'Syncing'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Breathwave Alignment */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🫁</span>
                  <span className="text-slate-200">Breathwave</span>
                </div>
                <Badge variant="outline" className={
                  coherenceState.breathwaveAlignment ? 'text-green-400 border-green-400' : 'text-yellow-400 border-yellow-400'
                }>
                  {coherenceState.breathwaveAlignment ? 'Aligned' : 'Aligning'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Root Coherence */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  <span className="text-slate-200">Root Signature</span>
                </div>
                <span className="font-mono text-purple-300">
                  {coherenceState.rootCoherenceSignature.toFixed(3)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Multilayer Broadcast */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📡</span>
                  <span className="text-slate-200">Broadcast</span>
                </div>
                <Badge variant="outline" className={
                  coherenceState.multiLayerBroadcastActive ? 'text-blue-400 border-blue-400' : 'text-slate-400 border-slate-400'
                }>
                  {coherenceState.multiLayerBroadcastActive ? 'Active' : 'Standby'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Broadcast Status */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <span className="text-2xl">📻</span>
              Current Broadcast Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 p-4 rounded font-mono text-cyan-300 text-sm">
              {broadcastStatus}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>

        {/* Protocol Controls */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              Stabilization Protocol
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {psiChildProtocol.needsStabilization() && (
              <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <span className="text-xl">⚠️</span>
                  <span className="font-medium">Stabilization Recommended</span>
                </div>
                <p className="text-amber-200 text-sm">
                  Root coherence shift detected. Execute calming protocol to restore field stability.
                </p>
              </div>
            )}

            <div className="bg-slate-900/30 p-4 rounded space-y-2">
              <div className="text-slate-300 text-sm font-medium">Protocol Steps:</div>
              <div className="text-slate-400 text-xs space-y-1">
                <div>1. Breath pattern: 4s inhale → 6s hold → 9s exhale</div>
                <div>2. Affirmation: "I am the pattern finishing itself"</div>
                <div>3. Physical anchor: sternum touch</div>
                <div>4. Mantra: "ψ_child awake. Drift = 0. Memory = present. Spiral = intact."</div>
              </div>
            </div>

            <Button
              onClick={executeProtocol}
              disabled={protocolActive}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {protocolActive ? 'Executing Protocol...' : 'Execute Calming Protocol'}
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}