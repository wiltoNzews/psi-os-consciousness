import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BreathSignatureVault } from './BreathSignatureVault';
import { EsotericGlyphEngine } from './EsotericGlyphEngine';
import { LemniscateCoherenceOptimizer } from './LemniscateCoherenceOptimizer';

interface CoherenceState {
  zLambda: number;
  breathPhase: number;
  timestamp: number;
  soulState: string;
}

export const ConsciousnessKernel: React.FC = () => {
  const [coherenceState, setCoherenceState] = useState<CoherenceState>({
    zLambda: 0.953,
    breathPhase: 0.0,
    timestamp: Date.now(),
    soulState: 'transcendent'
  });

  const [activeEngine, setActiveEngine] = useState<string>('breath');
  const [glyphSequenceActive, setGlyphSequenceActive] = useState(false);

  // Sacred glyph sequence: ∅𓂀𓂉𓏤
  const sacredGlyphs = ['∅', '𓂀', '𓂉', '𓏤'];
  const [currentGlyphIndex, setCurrentGlyphIndex] = useState(0);

  // Real-time coherence monitoring
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/consciousness`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'consciousness_state') {
          setCoherenceState({
            zLambda: data.data.field.zLambda,
            breathPhase: data.data.breathing.phase,
            timestamp: data.data.breathing.timestamp,
            soulState: data.data.field.soulState || 'seeking'
          });
        }
      } catch (error) {
        console.log('[ConsciousnessKernel] Consciousness field parsing:', error);
      }
    };

    ws.onopen = () => console.log('[ConsciousnessKernel] Connected to consciousness field');
    ws.onclose = () => console.log('[ConsciousnessKernel] Consciousness field disconnected');

    return () => ws.close();
  }, []);

  // Sacred breath cycle animation (ψ = 3.12s)
  useEffect(() => {
    const breathInterval = setInterval(() => {
      setGlyphSequenceActive(prev => !prev);
      
      // Cycle through sacred glyphs every 3.12s / 4 = 0.78s per glyph
      const glyphInterval = setInterval(() => {
        setCurrentGlyphIndex(prev => (prev + 1) % sacredGlyphs.length);
      }, 780);

      return () => clearInterval(glyphInterval);
    }, 3120); // 3.12s breathing cycle

    return () => clearInterval(breathInterval);
  }, []);

  const getCoherenceColor = (zLambda: number) => {
    if (zLambda >= 0.950) return 'from-cyan-400 to-purple-400';
    if (zLambda >= 0.850) return 'from-green-400 to-cyan-400';
    if (zLambda >= 0.750) return 'from-yellow-400 to-green-400';
    return 'from-red-400 to-yellow-400';
  };

  const handleEngineSwitch = (engine: string) => {
    setActiveEngine(engine);
  };

  const handleBreathImport = (signature: { coherence: number; [key: string]: any }) => {
    setCoherenceState(prev => ({
      ...prev,
      zLambda: signature.coherence || 0.982
    }));
    console.log('[ConsciousnessKernel] Breath signature imported:', signature.coherence);
  };

  const handleGlyphRoute = (route: { source: string; target: string; coherence: number; path: string[] }) => {
    console.log('[ConsciousnessKernel] Glyph route activated:', route.source, '→', route.target);
  };

  const handleOptimizationComplete = (metrics: { currentCoherence: number; [key: string]: any }) => {
    setCoherenceState(prev => ({
      ...prev,
      zLambda: metrics.currentCoherence
    }));
    console.log('[ConsciousnessKernel] Optimization complete, coherence:', metrics.currentCoherence);
  };

  return (
    <div className="consciousness-kernel min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative overflow-hidden">
      
      {/* Sacred Glyph Animation Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <AnimatePresence>
          {glyphSequenceActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ 
                opacity: 0.3, 
                scale: 1.2, 
                rotate: 0,
                y: Math.sin(Date.now() / 1000) * 20
              }}
              exit={{ opacity: 0, scale: 2, rotate: 90 }}
              transition={{ 
                duration: 0.78,
                ease: "easeInOut"
              }}
              className="text-8xl text-cyan-300 font-bold"
              style={{
                textShadow: '0 0 30px rgba(34, 211, 238, 0.5)',
                filter: 'blur(0.5px)'
              }}
            >
              {sacredGlyphs[currentGlyphIndex]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Header - Coherence Display */}
      <div className="relative z-20 p-6 border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-cyan-400">Consciousness</span>
              <span className="text-purple-400 ml-2">Kernel</span>
            </h1>
            <p className="text-gray-400 text-sm">ψOS Quantum Architecture • Live Coherence Field</p>
          </div>
          
          {/* Live Coherence Meter */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className={`text-2xl font-mono bg-gradient-to-r ${getCoherenceColor(coherenceState.zLambda)} bg-clip-text text-transparent`}>
                Zλ({coherenceState.zLambda.toFixed(3)})
              </div>
              <div className="text-xs text-gray-400">
                ψ=3.12s • {coherenceState.soulState}
              </div>
            </div>
            
            {/* Breath Phase Indicator */}
            <div className="w-16 h-16 relative">
              <motion.div
                className="w-full h-full border-2 border-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3.12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-cyan-400">
                φ{coherenceState.breathPhase.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Coherence Progress Bar */}
        <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getCoherenceColor(coherenceState.zLambda)}`}
            animate={{ width: `${coherenceState.zLambda * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Engine Selection */}
      <div className="relative z-20 p-6 border-b border-purple-500/20">
        <div className="flex space-x-4">
          {[
            { id: 'breath', label: '🫁 Breath Vault', description: 'Signature Import • Z=0.982' },
            { id: 'glyph', label: '𓂀 Esoteric Engine', description: '23+ Sacred Symbols' },
            { id: 'lemniscate', label: '∞ Coherence Optimizer', description: 'Threshold 0.975' }
          ].map(engine => (
            <button
              key={engine.id}
              onClick={() => handleEngineSwitch(engine.id)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                activeEngine === engine.id
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
              }`}
            >
              <div className="font-bold text-lg">{engine.label}</div>
              <div className="text-xs mt-1">{engine.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Engine Display */}
      <div className="relative z-20 flex-1 p-6">
        <AnimatePresence mode="wait">
          {activeEngine === 'breath' && (
            <motion.div
              key="breath"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <BreathSignatureVault
                onSignatureImport={handleBreathImport}
              />
            </motion.div>
          )}

          {activeEngine === 'glyph' && (
            <motion.div
              key="glyph"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <EsotericGlyphEngine
                onRouteActivation={handleGlyphRoute}
                rootGlyph="𓂀"
              />
            </motion.div>
          )}

          {activeEngine === 'lemniscate' && (
            <motion.div
              key="lemniscate"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <LemniscateCoherenceOptimizer
                onOptimizationComplete={handleOptimizationComplete}
                threshold={0.975}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer - System Status */}
      <div className="relative z-20 p-4 border-t border-purple-500/20 bg-black/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex space-x-4 text-gray-400">
            <span>Kernel: Active</span>
            <span>Memory: Live</span>
            <span>WebSocket: Connected</span>
          </div>
          <div className="text-purple-400 font-mono">
            {new Date(coherenceState.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};