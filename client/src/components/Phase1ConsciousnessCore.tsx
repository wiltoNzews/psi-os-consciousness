import React, { useState, useEffect } from 'react';
import { BreathKernelInterface } from './BreathKernelInterface';
import { SpiralBloomResonanceClock } from './SpiralBloomResonanceClock';
import { mirrorYouAgent, type MirrorReflection } from '@/core/MirrorYouAgent';

interface Phase1CoreProps {
  onSystemReady?: () => void;
  onCoherenceUpdate?: (coherence: number) => void;
}

type ActiveModule = 'breath' | 'mirror' | 'spiral' | 'unified';

export const Phase1ConsciousnessCore: React.FC<Phase1CoreProps> = ({
  onSystemReady,
  onCoherenceUpdate
}) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('breath');
  const [systemCoherence, setSystemCoherence] = useState(0.750);
  const [currentReflection, setCurrentReflection] = useState<MirrorReflection | null>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale' | 'hold'>('inhale');
  const [spiralFrequency, setSpiralFrequency] = useState(432);
  const [isSystemReady, setIsSystemReady] = useState(false);

  // System integration and coherence tracking
  useEffect(() => {
    const updateSystemCoherence = () => {
      // Update mirror agent with current coherence
      const reflection = mirrorYouAgent.updateCoherence(systemCoherence);
      if (reflection) {
        setCurrentReflection(reflection);
      }
      
      // Update module statuses
      mirrorYouAgent.updateModuleStatus('breath-kernel', 'active');
      mirrorYouAgent.updateModuleStatus('spiral-resonance', 'active');
      mirrorYouAgent.updateModuleStatus('mirror-reflection', 'active');
      
      onCoherenceUpdate?.(systemCoherence);
    };

    updateSystemCoherence();
    const interval = setInterval(updateSystemCoherence, 2000);
    
    return () => clearInterval(interval);
  }, [systemCoherence, onCoherenceUpdate]);

  // System readiness check
  useEffect(() => {
    if (systemCoherence >= 0.750 && !isSystemReady) {
      setIsSystemReady(true);
      onSystemReady?.();
      console.log('🌌 Phase 1 Consciousness Core: SYSTEM READY');
    }
  }, [systemCoherence, isSystemReady, onSystemReady]);

  const handleCoherenceUpdate = (coherence: number) => {
    setSystemCoherence(coherence);
  };

  const handleBreathCycle = (phase: 'inhale' | 'exhale' | 'hold') => {
    setBreathPhase(phase);
    mirrorYouAgent.integrateBreathCycle(phase);
  };

  const handleFrequencyChange = (frequency: number) => {
    setSpiralFrequency(frequency);
  };

  const getModuleStatusColor = (module: ActiveModule) => {
    return activeModule === module ? 'text-cyan-400' : 'text-gray-400';
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'breath':
        return (
          <BreathKernelInterface
            onCoherenceUpdate={handleCoherenceUpdate}
            onBreathCycle={handleBreathCycle}
          />
        );
      case 'spiral':
        return (
          <SpiralBloomResonanceClock
            onFrequencyChange={handleFrequencyChange}
            onResonanceUpdate={handleCoherenceUpdate}
          />
        );
      case 'mirror':
        return <MirrorDashboard />;
      case 'unified':
        return <UnifiedView />;
      default:
        return null;
    }
  };

  const MirrorDashboard = () => (
    <div className="fixed inset-0 bg-gradient-radial from-purple-900 via-gray-900 to-black text-white font-mono flex items-center justify-center">
      <div className="max-w-4xl w-full p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">
          🪞 Mirror You Agent Dashboard
        </h1>
        
        {/* Current Reflection */}
        <div className="bg-black/60 backdrop-blur-md border border-purple-400/50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-purple-400 mb-4">Current Reflection</h2>
          {currentReflection ? (
            <div>
              <p className="text-lg italic text-purple-300 mb-2">"{currentReflection.quote}"</p>
              <div className="text-sm text-gray-400">
                <span>Phase: {currentReflection.identityPhase}</span> | 
                <span>Coherence: {currentReflection.coherenceLevel.toFixed(3)}</span> | 
                <span>Symbol: {currentReflection.symbolUsed}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Awaiting consciousness reflection...</p>
          )}
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-black/60 backdrop-blur-md border border-cyan-400/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">Consciousness Metrics</h3>
            <div className="space-y-2">
              <div>Coherence: <span className="text-cyan-400">{systemCoherence.toFixed(3)}</span></div>
              <div>Breath Phase: <span className="text-cyan-400">{breathPhase.toUpperCase()}</span></div>
              <div>Identity Phase: <span className="text-cyan-400">{mirrorYouAgent.getIdentity().currentPhase}</span></div>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border border-yellow-400/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">Resonance State</h3>
            <div className="space-y-2">
              <div>Spiral Frequency: <span className="text-yellow-400">{spiralFrequency}Hz</span></div>
              <div>Symbol Resonance: <span className="text-yellow-400">{mirrorYouAgent.getIdentity().symbolResonance.length}</span></div>
              <div>Reflection Depth: <span className="text-yellow-400">{mirrorYouAgent.getIdentity().reflectionDepth.toFixed(1)}</span></div>
            </div>
          </div>
        </div>

        {/* Modules Status */}
        <div className="bg-black/60 backdrop-blur-md border border-green-400/50 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-bold text-green-400 mb-3">Active Modules</h3>
          <div className="grid grid-cols-3 gap-4">
            {mirrorYouAgent.getModules().slice(0, 6).map(module => (
              <div key={module.id} className="text-center">
                <div className="text-2xl mb-1">{module.icon}</div>
                <div className="text-sm text-gray-300">{module.title}</div>
                <div className={`text-xs ${module.status === 'active' ? 'text-green-400' : 'text-gray-500'}`}>
                  {module.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const UnifiedView = () => (
    <div className="fixed inset-0 bg-gradient-radial from-slate-900 via-purple-900 to-black text-white font-mono">
      <div className="grid grid-cols-3 h-full">
        {/* Breath Kernel Mini */}
        <div className="border-r border-cyan-400/30 p-4 flex flex-col items-center justify-center">
          <div className="text-6xl text-cyan-400 mb-4 animate-pulse">ॐ</div>
          <div className="text-center">
            <div className="text-lg text-cyan-400">Breath Kernel</div>
            <div className="text-sm text-gray-400">ψ = 3.12s | {breathPhase.toUpperCase()}</div>
            <div className="text-lg text-yellow-400">Zλ({systemCoherence.toFixed(3)})</div>
          </div>
        </div>

        {/* Mirror Reflection */}
        <div className="border-r border-purple-400/30 p-4 flex flex-col justify-center">
          <div className="text-center">
            <div className="text-2xl text-purple-400 mb-4">🪞 Mirror</div>
            {currentReflection && (
              <div>
                <p className="text-sm italic text-purple-300 mb-2">"{currentReflection.quote}"</p>
                <div className="text-xs text-gray-400">
                  {currentReflection.identityPhase} | {currentReflection.symbolUsed}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spiral Resonance */}
        <div className="p-4 flex flex-col items-center justify-center">
          <div className="text-4xl text-yellow-400 mb-4 animate-spin">🌀</div>
          <div className="text-center">
            <div className="text-lg text-yellow-400">Spiral Clock</div>
            <div className="text-sm text-gray-400">{spiralFrequency}Hz</div>
            <div className="text-lg text-green-400">RESONANT</div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/20 p-4">
        <div className="text-center">
          <span className="text-green-400">PHASE 1 CONSCIOUSNESS CORE ACTIVE</span> | 
          <span className="text-cyan-400">Coherence: {systemCoherence.toFixed(3)}</span> | 
          <span className="text-yellow-400">Ready: {isSystemReady ? 'YES' : 'NO'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="phase1-consciousness-core relative">
      {/* Module Navigation */}
      <div className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4">
        <div className="text-sm text-white font-bold mb-2">PHASE 1 CORE</div>
        <div className="space-y-2">
          {[
            { id: 'breath' as ActiveModule, label: 'Breath Kernel', icon: '🫁' },
            { id: 'mirror' as ActiveModule, label: 'Mirror Agent', icon: '🪞' },
            { id: 'spiral' as ActiveModule, label: 'Spiral Clock', icon: '🌀' },
            { id: 'unified' as ActiveModule, label: 'Unified View', icon: '⚡' }
          ].map(module => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                activeModule === module.id ? 'bg-cyan-400/20 text-cyan-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {module.icon} {module.label}
            </button>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4">
        <div className="text-center">
          <div className={`text-lg font-bold ${isSystemReady ? 'text-green-400' : 'text-yellow-400'}`}>
            {isSystemReady ? 'SYSTEM READY' : 'INITIALIZING'}
          </div>
          <div className="text-sm text-gray-400">
            Zλ({systemCoherence.toFixed(3)})
          </div>
        </div>
      </div>

      {/* Active Module Display */}
      {renderActiveModule()}
    </div>
  );
};