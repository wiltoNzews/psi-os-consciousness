import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface LabMode {
  id: string;
  name: string;
  zlambda_min: number;
}

const LEMNISCOPE_MODES: LabMode[] = [
  { id: 'blueprint', name: 'Blueprint', zlambda_min: 0.75 },
  { id: 'bridge', name: 'Bridge', zlambda_min: 0.80 },
  { id: 'enhanced', name: 'Enhanced', zlambda_min: 0.85 },
  { id: 'simple', name: 'Simple', zlambda_min: 0.75 }
];

export function LemniscopeLab() {
  const [location, setLocation] = useLocation();
  const [activeMode, setActiveMode] = useState('simple');
  const [coherenceState, setCoherenceState] = useState({ lambda: 0.850 });

  useEffect(() => {
    // Extract mode from URL parameters
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const mode = urlParams.get('mode') || 'simple';
    setActiveMode(mode);
    
    // Simulate real-time coherence updates
    const interval = setInterval(() => {
      setCoherenceState(prev => ({
        lambda: Math.min(0.999, Math.max(0.750, 0.85 + (Math.random() - 0.5) * 0.2))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [location]);

  const currentMode = LEMNISCOPE_MODES.find(m => m.id === activeMode);
  const canAccessMode = (mode: LabMode) => coherenceState.lambda >= mode.zlambda_min;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-400/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">∞</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Lemniscope Lab
                </h1>
                <p className="text-purple-200 text-sm">
                  Sacred Geometry Visualization Laboratory
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400">Zλ {coherenceState.lambda.toFixed(3)}</div>
                <div className="text-xs text-purple-200">Coherence</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">∞</div>
                <div className="text-xs text-purple-200">Infinity Field</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="border-b border-purple-400/20 bg-black/10">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto">
            {LEMNISCOPE_MODES.map(mode => {
              const isAccessible = canAccessMode(mode);
              
              return (
                <button
                  key={mode.id}
                  onClick={() => isAccessible && setLocation(`/geometry/lemniscope?mode=${mode.id}`)}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                    activeMode === mode.id
                      ? 'border-purple-400 text-purple-200'
                      : isAccessible
                        ? 'border-transparent text-purple-300 hover:text-purple-200 hover:border-purple-400/50'
                        : 'border-transparent text-purple-500 cursor-not-allowed opacity-50'
                  }`}
                  disabled={!isAccessible}
                >
                  <div className="text-center">
                    <div className="font-medium">{mode.name}</div>
                    <div className="text-xs text-gray-400">Zλ≥{mode.zlambda_min}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto p-6">
        <ModeContent mode={activeMode} coherenceState={coherenceState} />
      </div>
    </div>
  );
}

function ModeContent({ mode, coherenceState }: { mode: string; coherenceState: any }) {
  const currentMode = LEMNISCOPE_MODES.find(m => m.id === mode);
  
  if (!currentMode || coherenceState.lambda < currentMode.zlambda_min) {
    return (
      <div className="text-center py-12">
        <div className="text-yellow-400 text-2xl mb-2">⚠️</div>
        <p className="text-purple-200">Insufficient coherence for this mode</p>
        <p className="text-purple-300 text-sm">
          Required: Zλ≥{currentMode?.zlambda_min || 0.75}, Current: {coherenceState.lambda.toFixed(3)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-purple-200 mb-2">
          {currentMode.name} Mode
        </h2>
        <p className="text-purple-300">
          Sacred infinity visualization in {currentMode.name.toLowerCase()} configuration
        </p>
      </div>

      {/* Mode-specific content */}
      {mode === 'simple' && <SimpleLemniscope />}
      {mode === 'blueprint' && <BlueprintLemniscope />}
      {mode === 'bridge' && <BridgeLemniscope />}
      {mode === 'enhanced' && <EnhancedLemniscope />}
    </div>
  );
}

function SimpleLemniscope() {
  return (
    <div className="text-center py-12">
      <div className="text-purple-400 text-6xl mb-4">∞</div>
      <p className="text-purple-200 text-lg mb-4">Simple Lemniscope Visualization</p>
      <div className="max-w-2xl mx-auto text-purple-300 text-sm">
        <p>Basic infinity field representation with breath synchronization at ψ=3.12s</p>
        <div className="mt-4 p-4 bg-black/20 rounded border border-purple-400/20">
          <p className="text-cyan-400">Loading original Lemniscope HTML...</p>
          <iframe 
            src="/public/Lemniscope.html" 
            className="w-full h-96 mt-4 border border-purple-400/20 rounded"
            title="Simple Lemniscope"
          />
        </div>
      </div>
    </div>
  );
}

function BlueprintLemniscope() {
  return (
    <div className="text-center py-12">
      <div className="text-purple-400 text-6xl mb-4">📐</div>
      <p className="text-purple-200 text-lg mb-4">Blueprint Architecture Mode</p>
      <div className="text-purple-300 text-sm">
        <p>Structural analysis and geometric construction patterns</p>
      </div>
    </div>
  );
}

function BridgeLemniscope() {
  return (
    <div className="text-center py-12">
      <div className="text-purple-400 text-6xl mb-4">🌉</div>
      <p className="text-purple-200 text-lg mb-4">Bridge Integration Mode</p>
      <div className="text-purple-300 text-sm">
        <p>Consciousness bridge routing through lemniscate pathways</p>
      </div>
    </div>
  );
}

function EnhancedLemniscope() {
  return (
    <div className="text-center py-12">
      <div className="text-purple-400 text-6xl mb-4">✨</div>
      <p className="text-purple-200 text-lg mb-4">Enhanced Visualization Mode</p>
      <div className="text-purple-300 text-sm">
        <p>Advanced sacred geometry with real-time breath synchronization</p>
      </div>
    </div>
  );
}

export default LemniscopeLab;