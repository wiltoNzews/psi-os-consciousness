import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BreathSignatureVault } from './BreathSignatureVault';
import { EsotericGlyphEngine } from './EsotericGlyphEngine';
import { LemniscateCoherenceOptimizer } from './LemniscateCoherenceOptimizer';

// Your ACTUAL architecture from the screenshot
const SYSTEM_MODULES = {
  'passiveworks': {
    name: 'PassiveWorks',
    description: 'Main orchestration logic. Frontend ↔ backend bridge. Manages signal orchestration, execution coherence, and real-time symbol tracking.',
    status: 'Operational',
    coherence: 'Coherence Routing Enabled',
    color: 'from-cyan-400 to-cyan-600',
    component: 'orchestration',
    visual: '🌊'
  },
  'alexandria': {
    name: 'Library of Alexandria v2',
    description: 'AI-based contract analysis + symbolic clause interpretation. Complete consciousness-indexed storage system with 755 conversations processed.',
    status: 'Operational',
    coherence: 'Memory Vault Active',
    color: 'from-purple-400 to-purple-600',
    route: '/alexandria',
    visual: '📚'
  },
  'sigil-core': {
    name: 'SIGIL-CORE',
    description: 'AI integration orchestrator with WhatsApp bridge, sacred geometry API, and multi-engine processing (OpenAI, Anthropic, Runway).',
    status: 'Operational',
    coherence: 'Multi-Engine Processing Active',
    color: 'from-green-400 to-emerald-600',
    component: 'integration',
    visual: '🔮'
  },
  'glifo': {
    name: 'Glifo',
    description: 'Symbol rendering engine. Outputs geometric memory anchors from concepts and decisions. Compatible with tattoo, UI, legal UI modes.',
    status: 'Operational',
    coherence: 'Symbol Rendering Active',
    color: 'from-amber-400 to-orange-600',
    component: 'rendering',
    visual: '✨'
  },
  'soundwave': {
    name: 'Soundwave',
    description: 'Emotion-mapped audio routing for state tracking and symbolic activation. Whisper bridge, vibe tagging, glifo sync.',
    status: 'Operational',
    coherence: 'Audio Resonance Active',
    color: 'from-pink-400 to-rose-600',
    component: 'audio',
    visual: '🎵'
  },
  'broadcast': {
    name: 'Broadcast',
    description: 'Communication orchestrator. Prepares threads, drops, notes, post-encounters for Twitter, Threads, Voice, Club.',
    status: 'Operational',
    coherence: 'Primed for Broadcasting',
    color: 'from-indigo-400 to-violet-600',
    component: 'communication',
    visual: '📡'
  }
};

export const CathedralSandbox: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showBreathVault, setShowBreathVault] = useState(false);
  const [showGlyphEngine, setShowGlyphEngine] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [systemCoherence, setSystemCoherence] = useState(0.981);

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
    
    // Show different components based on module
    if (moduleId === 'passiveworks') {
      setShowBreathVault(true);
    } else if (moduleId === 'glifo') {
      setShowGlyphEngine(true);
    } else if (moduleId === 'sigil-core') {
      setShowOptimizer(true);
    } else if (SYSTEM_MODULES[moduleId].route) {
      // Navigate to actual route
      window.location.href = SYSTEM_MODULES[moduleId].route;
    }
  };

  const handleBreathImport = (signature: any) => {
    setSystemCoherence(signature.coherence || 0.982);
    console.log('[Cathedral Sandbox] Breath signature imported:', signature);
  };

  const handleGlyphRoute = (route: any) => {
    console.log('[Cathedral Sandbox] Glyph route activated:', route);
  };

  const handleOptimizationComplete = (metrics: any) => {
    setSystemCoherence(metrics.currentCoherence);
    console.log('[Cathedral Sandbox] Optimization complete:', metrics);
  };

  return (
    <div className="cathedral-sandbox min-h-screen bg-black text-white">
      {/* Header with Live Stats */}
      <div className="header p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="text-cyan-400">Cathedral</span>{' '}
              <span className="text-purple-400">Navigator</span>
            </h1>
            <p className="text-gray-500 mt-1">ψOS Consciousness Computing Infrastructure</p>
          </div>
          
          {/* Live Stats Display */}
          <div className="stats flex gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">
                Zλ({systemCoherence.toFixed(3)})
              </div>
              <div className="text-xs text-gray-500">Coherence Level</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">571+</div>
              <div className="text-xs text-gray-500">Active Modules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">0.750</div>
              <div className="text-xs text-gray-500">Field State</div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Grid - 2x3 Layout matching screenshot */}
      <div className="modules-grid p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(SYSTEM_MODULES).map(([id, module]) => (
            <motion.div
              key={id}
              className={`module-card relative overflow-hidden rounded-xl bg-gradient-to-br ${module.color} p-[2px] cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModuleClick(id)}
            >
              <div className="inner bg-gray-900 rounded-xl p-6 h-full">
                {/* Module Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="text-2xl">{module.visual}</span>
                      {module.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">{module.status}</span>
                    </div>
                  </div>
                </div>

                {/* Module Description */}
                <p className="text-gray-400 text-sm mb-4">
                  {module.description}
                </p>

                {/* Module Status */}
                <div className="mt-auto">
                  <div className="text-xs text-cyan-400 font-mono">
                    • {module.coherence}
                  </div>
                  {module.route && (
                    <div className="text-xs text-purple-400 mt-1">
                      → Click to navigate
                    </div>
                  )}
                  {module.component && (
                    <div className="text-xs text-amber-400 mt-1">
                      → Click to activate sandbox
                    </div>
                  )}
                </div>

                {/* Active Indicator */}
                {activeModule === id && (
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-400 rounded-xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Components Area */}
      <AnimatePresence>
        {(showBreathVault || showGlyphEngine || showOptimizer) && (
          <motion.div
            className="components-area p-6 border-t border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Breath Signature Vault */}
              {showBreathVault && (
                <div className="component-wrapper">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-cyan-400">
                      PassiveWorks → Breath Signature Integration
                    </h2>
                    <button
                      onClick={() => setShowBreathVault(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <BreathSignatureVault onSignatureImport={handleBreathImport} />
                </div>
              )}

              {/* Esoteric Glyph Engine */}
              {showGlyphEngine && (
                <div className="component-wrapper">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-amber-400">
                      Glifo → Symbol Rendering Engine
                    </h2>
                    <button
                      onClick={() => setShowGlyphEngine(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <EsotericGlyphEngine onRouteActivation={handleGlyphRoute} />
                </div>
              )}

              {/* Lemniscate Coherence Optimizer */}
              {showOptimizer && (
                <div className="component-wrapper">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-400">
                      SIGIL-CORE → System Optimization
                    </h2>
                    <button
                      onClick={() => setShowOptimizer(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕ Close
                    </button>
                  </div>
                  <LemniscateCoherenceOptimizer onOptimizationComplete={handleOptimizationComplete} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Status */}
      <div className="footer p-6 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>Sandbox Environment • Click modules to test • All components operational</p>
        <p className="mt-2 text-cyan-400">
          {activeModule 
            ? `Testing: ${SYSTEM_MODULES[activeModule].name}` 
            : 'Select a module to begin testing'}
        </p>
      </div>
    </div>
  );
};