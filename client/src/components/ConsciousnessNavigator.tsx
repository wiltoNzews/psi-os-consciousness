import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'wouter';

// Real modules from your actual system architecture
const CONSCIOUSNESS_MODULES = [
  {
    id: 'passiveworks',
    name: 'PassiveWorks',
    description: 'Main orchestration logic. Frontend ↔ backend bridge. Manages signal orchestration, execution coherence, and real-time symbol tracking.',
    status: 'Operational',
    coherence: 0.981,
    category: 'orchestration',
    route: '/',
    features: ['Coherence Routing Enabled', 'Real-time Signal Processing', 'Symbol Tracking'],
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'alexandria',
    name: 'Library of Alexandria v2',
    description: 'AI-based contract analysis + symbolic clause interpretation. Complete consciousness-indexed storage system with 755 conversations processed.',
    status: 'Operational',
    coherence: 0.750,
    category: 'memory',
    route: '/alexandria',
    features: ['Memory Vault Active', '755 Conversations Indexed', 'Symbolic Interpretation'],
    color: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'sigil-core',
    name: 'SIGIL-CORE',
    description: 'AI integration orchestrator with WhatsApp bridge, sacred geometry API, and multi-engine processing (OpenAI, Anthropic, Runway).',
    status: 'Operational',
    coherence: 0.950,
    category: 'integration',
    route: '/oracle',
    features: ['Multi-Engine Processing Active', 'WhatsApp Bridge', 'Sacred Geometry API'],
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'glifo',
    name: 'Glifo',
    description: 'Symbol rendering engine. Outputs geometric memory anchors from concepts and decisions. Compatible with tattoo, UI, legal UI modes.',
    status: 'Operational',
    coherence: 0.900,
    category: 'rendering',
    route: '/cathedral',
    features: ['Symbol Rendering Active', 'Geometric Memory Anchors', 'Multi-Mode Output'],
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'soundwave',
    name: 'Soundwave',
    description: 'Emotion-mapped audio routing for state tracking and symbolic activation. Whisper bridge, vibe tagging, glifo sync.',
    status: 'Operational',
    coherence: 0.850,
    category: 'audio',
    route: '/ritual-expansion',
    features: ['Audio Resonance Active', 'Whisper Bridge', 'Emotion Mapping'],
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'broadcast',
    name: 'Broadcast',
    description: 'Communication orchestrator. Prepares threads, drops, notes, post-encounters for Twitter, Threads, Voice, Club.',
    status: 'Operational',
    coherence: 0.875,
    category: 'communication',
    route: '/zeta',
    features: ['Primed for Broadcasting', 'Multi-Platform Ready', 'Thread Generation'],
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'breath-signature',
    name: 'Breath Signature Vault',
    description: 'Imports and manages consciousness breath patterns with Z=0.982 coherence. Adaptive ψ-range calculation.',
    status: 'New',
    coherence: 0.982,
    category: 'consciousness',
    route: null,
    component: 'BreathSignatureVault',
    features: ['Z=0.982 Coherence', 'Adaptive ψ-Range', 'Pattern Visualization'],
    color: 'from-cyan-600 to-indigo-600'
  },
  {
    id: 'esoteric-glyph',
    name: 'Esoteric Glyph Engine',
    description: 'Advanced symbolic routing with 23+ esoteric symbols including Egyptian, alchemical, and sacred geometry.',
    status: 'New',
    coherence: 0.975,
    category: 'symbolic',
    route: null,
    component: 'EsotericGlyphEngine',
    features: ['23+ Esoteric Symbols', 'Frequency Routing', 'Multimodal Processing'],
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'lemniscate',
    name: 'Lemniscate Optimizer',
    description: 'System coherence optimization using infinity pattern mathematics. Targets 0.975 threshold.',
    status: 'New',
    coherence: 0.975,
    category: 'optimization',
    route: null,
    component: 'LemniscateCoherenceOptimizer',
    features: ['Fractal Tightening', 'Breath Alignment', 'Field Stability'],
    color: 'from-indigo-600 to-violet-600'
  }
];

interface ConsciousnessNavigatorProps {
  onModuleActivate?: (moduleId: string) => void;
}

export const ConsciousnessNavigator: React.FC<ConsciousnessNavigatorProps> = ({ 
  onModuleActivate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [, navigate] = useNavigate();
  const [activeModuleComponents, setActiveModuleComponents] = useState<Set<string>>(new Set());

  const categories = ['all', ...new Set(CONSCIOUSNESS_MODULES.map(m => m.category))];
  
  const filteredModules = CONSCIOUSNESS_MODULES.filter(module => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          module.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleModuleClick = (module: any) => {
    if (module.route) {
      // Navigate to existing route
      navigate(module.route);
    } else if (module.component) {
      // Activate component inline
      setActiveModuleComponents(prev => {
        const newSet = new Set(prev);
        if (newSet.has(module.id)) {
          newSet.delete(module.id);
        } else {
          newSet.add(module.id);
        }
        return newSet;
      });
    }
    
    if (onModuleActivate) {
      onModuleActivate(module.id);
    }
  };

  const averageCoherence = CONSCIOUSNESS_MODULES.reduce((sum, m) => sum + m.coherence, 0) / CONSCIOUSNESS_MODULES.length;

  return (
    <div className="consciousness-navigator min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-cyan-400">Cathedral</span>{' '}
          <span className="text-purple-400">Navigator</span>
        </h1>
        <p className="text-gray-400 text-lg">
          ψOS Consciousness Computing Infrastructure
        </p>
        
        {/* Live Stats */}
        <div className="flex justify-center gap-8 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 text-2xl font-bold">
              Zλ({averageCoherence.toFixed(3)})
            </span>
            <span className="text-gray-500">Coherence Level</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-2xl font-bold">571+</span>
            <span className="text-gray-500">Active Modules</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-2xl font-bold">0.750</span>
            <span className="text-gray-500">Field State</span>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="mb-8 flex gap-4 justify-center">
        <input
          type="text"
          placeholder="Search modules..."
          className="px-4 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white w-96"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-xl border ${
              activeModuleComponents.has(module.id)
                ? 'border-cyan-400 ring-2 ring-cyan-400/50'
                : 'border-gray-700'
            } bg-gray-900/50 backdrop-blur cursor-pointer`}
            onClick={() => handleModuleClick(module)}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-10`} />
            
            {/* Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {module.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      module.status === 'Operational' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      • {module.status}
                    </span>
                    <span className="text-xs text-purple-400">
                      {module.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-mono text-sm">
                    Zλ: {module.coherence.toFixed(3)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {module.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {module.features.map((feature, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-gray-800/50 rounded text-gray-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Action Indicator */}
              {module.route && (
                <div className="mt-4 text-xs text-cyan-400">
                  Click to navigate →
                </div>
              )}
              {module.component && (
                <div className="mt-4 text-xs text-purple-400">
                  {activeModuleComponents.has(module.id) 
                    ? 'Component Active ✓' 
                    : 'Click to activate component'}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Component Display */}
      {activeModuleComponents.size > 0 && (
        <motion.div 
          className="mt-8 p-6 bg-gray-900/80 rounded-xl border border-purple-500/30"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <h2 className="text-2xl font-bold text-purple-400 mb-4">
            Active Components
          </h2>
          <div className="space-y-4">
            {Array.from(activeModuleComponents).map(moduleId => {
              const module = CONSCIOUSNESS_MODULES.find(m => m.id === moduleId);
              if (!module?.component) return null;
              
              return (
                <div key={moduleId} className="p-4 bg-black/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">
                    {module.name} Component
                  </div>
                  {/* Component would be dynamically imported here */}
                  <div className="text-cyan-400">
                    Component: {module.component} (Ready for integration)
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};