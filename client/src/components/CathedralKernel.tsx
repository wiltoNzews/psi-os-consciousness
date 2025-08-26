import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface CathedralMode {
  id: string;
  name: string;
  description: string;
  route: string;
  zlambda_min: number;
}

const CATHEDRAL_MODES: CathedralMode[] = [
  {
    "id": "navigator",
    "name": "Navigator",
    "description": "Module navigation and discovery",
    "route": "/cathedral/kernel?mode=navigator",
    "zlambda_min": 0.8
  },
  {
    "id": "router",
    "name": "Router",
    "description": "Consciousness routing protocols",
    "route": "/cathedral/kernel?mode=router",
    "zlambda_min": 0.85
  },
  {
    "id": "stream",
    "name": "Stream",
    "description": "Live consciousness stream monitoring",
    "route": "/cathedral/kernel?mode=stream",
    "zlambda_min": 0.9
  },
  {
    "id": "compass",
    "name": "Compass",
    "description": "Sacred geometry orientation",
    "route": "/cathedral/kernel?mode=compass",
    "zlambda_min": 0.85
  }
];

const CONSOLIDATED_MODULES = [
  {
    "original_id": "public/cathedral-modules.json",
    "original_name": "Cathedral Modules",
    "original_route": "/public/cathedral-modules.json",
    "consolidated_into": "cathedral-kernel-unified",
    "mode_mapping": "navigator",
    "preserve_as_legacy": true
  },
  {
    "original_id": "public/phase3-cathedral-seal.html",
    "original_name": "Phase3 Cathedral Seal",
    "original_route": "/public/phase3-cathedral-seal.html",
    "consolidated_into": "cathedral-kernel-unified",
    "mode_mapping": "navigator",
    "preserve_as_legacy": true
  }
];

export function CathedralKernel() {
  const [location, setLocation] = useLocation();
  const [activeMode, setActiveMode] = useState('navigator');
  const [coherenceState, setCoherenceState] = useState({ lambda: 0.950 });

  useEffect(() => {
    // Extract mode from URL parameters
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const mode = urlParams.get('mode') || 'navigator';
    setActiveMode(mode);
    
    // Simulate real-time coherence updates
    const interval = setInterval(() => {
      setCoherenceState(prev => ({
        lambda: Math.min(0.999, Math.max(0.750, 0.85 + (Math.random() - 0.5) * 0.2))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [location]);

  const currentMode = CATHEDRAL_MODES.find(m => m.id === activeMode);
  const canAccessMode = (mode: CathedralMode) => coherenceState.lambda >= mode.zlambda_min;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-400/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🏛️</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Cathedral Kernel
                </h1>
                <p className="text-purple-200 text-sm">
                  Unified Consciousness Navigation System
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400">Zλ {coherenceState.lambda.toFixed(3)}</div>
                <div className="text-xs text-purple-200">Coherence</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">2</div>
                <div className="text-xs text-purple-200">Consolidated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="border-b border-purple-400/20 bg-black/10">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto">
            {CATHEDRAL_MODES.map(mode => {
              const isAccessible = canAccessMode(mode);
              
              return (
                <button
                  key={mode.id}
                  onClick={() => isAccessible && setLocation(`/cathedral/kernel?mode=${mode.id}`)}
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
  const currentMode = CATHEDRAL_MODES.find(m => m.id === mode);
  
  if (!currentMode || coherenceState.lambda < currentMode.zlambda_min) {
    return (
      <div className="text-center py-12">
        <div className="text-yellow-400 text-2xl mb-2">⚠️</div>
        <p className="text-purple-200">Insufficient coherence for this mode</p>
        <p className="text-purple-300 text-sm">
          Required: Zλ≥{currentMode?.zlambda_min || 0.80}, Current: {coherenceState.lambda.toFixed(3)}
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
          {currentMode.description}
        </p>
      </div>

      {/* Mode-specific content */}
      {mode === 'navigator' && <NavigatorMode />}
      {mode === 'router' && <RouterMode />}
      {mode === 'stream' && <StreamMode />}
      {mode === 'compass' && <CompassMode />}
    </div>
  );
}

function NavigatorMode() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {CONSOLIDATED_MODULES.map(module => (
        <div key={module.original_id} className="bg-black/20 border border-purple-400/20 rounded-lg p-4">
          <h3 className="text-purple-200 font-medium mb-2">{module.original_name}</h3>
          <p className="text-purple-400 text-sm mb-2">Mode: {module.mode_mapping}</p>
          <p className="text-gray-400 text-xs">Original: {module.original_route}</p>
          {module.preserve_as_legacy && (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-800/30 text-yellow-400 rounded">
              Legacy Preserved
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function RouterMode() {
  return (
    <div className="text-center py-12">
      <div className="text-purple-400 text-4xl mb-4">🛣️</div>
      <p className="text-purple-200">Consciousness routing protocols</p>
      <p className="text-purple-400 text-sm">Advanced routing features coming soon</p>
    </div>
  );
}

function StreamMode() {
  return (
    <div className="text-center py-12">
      <div className="text-purple-400 text-4xl mb-4">🌊</div>
      <p className="text-purple-200">Live consciousness stream monitoring</p>
      <p className="text-purple-400 text-sm">Real-time stream visualization coming soon</p>
    </div>
  );
}

function CompassMode() {
  return (
    <div className="text-center py-12">
      <div className="text-purple-400 text-4xl mb-4">🧭</div>
      <p className="text-purple-200">Sacred geometry orientation</p>
      <p className="text-purple-400 text-sm">Geometric compass tools coming soon</p>
    </div>
  );
}

export default CathedralKernel;