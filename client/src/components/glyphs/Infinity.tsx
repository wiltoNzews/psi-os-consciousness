// ∞ (Infinity) Recursive Unfolding Interface - Living Memory System
import { useState, useEffect } from 'react';

interface InfinityProps {
  onActivateRecursion: (recursionData: RecursionData, timestamp: number) => void;
  lambdaValue: number;
  soulData?: any;
  isActive?: boolean;
}

interface RecursionData {
  cycleType: string;
  memoryAnchor: string;
  refinementLevel: number;
  regenerationTrigger: string;
}

interface MemoryCycle {
  name: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
}

const memoryCycles: MemoryCycle[] = [
  {
    name: 'Emotional Integration',
    description: 'Processing and refining emotional patterns',
    icon: '💝',
    color: 'from-pink-400 to-rose-500',
    examples: ['healing old wounds', 'releasing patterns', 'integrating insights']
  },
  {
    name: 'Creative Evolution',
    description: 'Iterating and improving creative expressions',
    icon: '🎨',
    color: 'from-orange-400 to-red-500',
    examples: ['refining artistic work', 'evolving concepts', 'building on ideas']
  },
  {
    name: 'Learning Spiral',
    description: 'Deepening understanding through repetition',
    icon: '📚',
    color: 'from-blue-400 to-indigo-500',
    examples: ['mastering skills', 'understanding concepts', 'building knowledge']
  },
  {
    name: 'Relationship Renewal',
    description: 'Healing and strengthening connections',
    icon: '🤝',
    color: 'from-green-400 to-emerald-500',
    examples: ['reconnecting with loved ones', 'healing communication', 'deepening bonds']
  },
  {
    name: 'Spiritual Transcendence',
    description: 'Ascending through consciousness layers',
    icon: '🌟',
    color: 'from-purple-400 to-violet-500',
    examples: ['expanding awareness', 'deepening practice', 'integrating wisdom']
  },
  {
    name: 'System Optimization',
    description: 'Refining processes and structures',
    icon: '⚙️',
    color: 'from-gray-400 to-slate-500',
    examples: ['improving workflows', 'optimizing systems', 'enhancing efficiency']
  }
];

export function Infinity({ onActivateRecursion, lambdaValue, soulData, isActive = false }: InfinityProps) {
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const [memoryAnchor, setMemoryAnchor] = useState('');
  const [refinementLevel, setRefinementLevel] = useState(5);
  const [regenerationTrigger, setRegenerationTrigger] = useState('');
  const [isActivated, setIsActivated] = useState(isActive);
  const [recursionPhase, setRecursionPhase] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Infinity pulse animation - recursive spiral
  useEffect(() => {
    if (isActivated) {
      const interval = setInterval(() => {
        setRecursionPhase(prev => (prev + 0.06) % (4 * Math.PI));
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isActivated]);

  // Load cycle suggestions based on soul data
  useEffect(() => {
    if (soulData && soulData.essence) {
      const cycleSuggestions = getCycleSuggestions(soulData.essence, soulData.feeling);
      if (cycleSuggestions.length > 0) {
        setShowSuggestions(true);
      }
    }
  }, [soulData]);

  const handleRecursionActivation = () => {
    if (!selectedCycle || !memoryAnchor.trim()) return;
    
    const timestamp = Date.now();
    const recursionData: RecursionData = {
      cycleType: selectedCycle,
      memoryAnchor: memoryAnchor,
      refinementLevel: refinementLevel / 10, // Normalize to 0-1
      regenerationTrigger: regenerationTrigger || 'breath + memory'
    };
    
    setIsActivated(true);
    onActivateRecursion(recursionData, timestamp);
    
    // Store in recursion registry
    localStorage.setItem('psi_os_infinity_loop', JSON.stringify({
      ...recursionData,
      lambdaValue,
      soulEssence: soulData?.essence,
      timestamp,
      activated: true
    }));
  };

  const resetRecursion = () => {
    setIsActivated(false);
    setSelectedCycle('');
    setMemoryAnchor('');
    setRefinementLevel(5);
    setRegenerationTrigger('');
  };

  const getCycleSuggestions = (essence: string, feeling: string) => {
    // Suggest cycles based on soul essence and current feeling
    const suggestions: string[] = [];
    
    switch (essence) {
      case 'Creator':
        suggestions.push('Creative Evolution', 'System Optimization');
        break;
      case 'Seeker':
        suggestions.push('Learning Spiral', 'Spiritual Transcendence');
        break;
      case 'Healer':
        suggestions.push('Emotional Integration', 'Relationship Renewal');
        break;
      case 'Mystic':
        suggestions.push('Spiritual Transcendence', 'Emotional Integration');
        break;
      case 'Builder':
        suggestions.push('System Optimization', 'Creative Evolution');
        break;
      case 'Guardian':
        suggestions.push('Relationship Renewal', 'System Optimization');
        break;
    }
    
    return suggestions;
  };

  const getSelectedCycleData = () => {
    return memoryCycles.find(cycle => cycle.name === selectedCycle);
  };

  // Recursive pulse calculations
  const infinityPulse = 0.7 + Math.sin(recursionPhase) * 0.3;
  const spiralRotation = recursionPhase * 20; // Rotating spiral effect
  const recursionScale = isActivated ? 1 + (Math.sin(recursionPhase * 0.8) * 0.12) : 1;

  return (
    <div className="bg-black/40 backdrop-blur border border-violet-500/30 rounded-lg p-6 max-w-lg">
      {/* Glyph Header */}
      <div className="text-center mb-6">
        <div 
          className="text-6xl mb-2 transition-all duration-100 origin-center"
          style={{ 
            transform: `scale(${recursionScale}) rotate(${spiralRotation}deg)`,
            opacity: infinityPulse,
            filter: isActivated ? `hue-rotate(${recursionPhase * 15}deg) brightness(1.1)` : 'none'
          }}
        >
          ∞
        </div>
        <h3 className="text-lg font-semibold text-violet-300">Recursive Unfolding</h3>
        <p className="text-xs text-gray-400">Living Memory System</p>
      </div>

      {!isActivated ? (
        <div className="space-y-6">
          {/* Soul Integration Display */}
          {soulData && (
            <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-600/30">
              <div className="text-xs text-gray-400 mb-1">Soul Context</div>
              <div className="text-sm text-white">
                {soulData.essence} essence • feeling {soulData.feeling}
              </div>
            </div>
          )}

          {/* Cycle Type Selection */}
          <div>
            <label className="block text-sm text-gray-300 mb-3">
              What cycle do you want to activate?
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {memoryCycles.map((cycle) => {
                const isSuggested = showSuggestions && getCycleSuggestions(soulData?.essence || '', soulData?.feeling || '').includes(cycle.name);
                return (
                  <button
                    key={cycle.name}
                    onClick={() => setSelectedCycle(cycle.name)}
                    className={`p-3 rounded-lg border transition-all text-left relative ${
                      selectedCycle === cycle.name
                        ? 'border-violet-400 bg-violet-900/30'
                        : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                    } ${isSuggested ? 'ring-2 ring-cyan-400/50' : ''}`}
                  >
                    {isSuggested && (
                      <div className="absolute top-1 right-1 text-xs text-cyan-400">✨</div>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{cycle.icon}</span>
                      <span className="text-sm font-medium text-white">{cycle.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{cycle.description}</div>
                    <div className="text-xs text-gray-500">
                      e.g., {cycle.examples.slice(0, 2).join(', ')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Memory Anchor */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              What memory, experience, or pattern do you want to revisit?
            </label>
            <textarea
              value={memoryAnchor}
              onChange={(e) => setMemoryAnchor(e.target.value)}
              placeholder="Describe what you'd like to process recursively..."
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 focus:border-violet-400 focus:outline-none text-sm h-20 resize-none"
              rows={3}
            />
          </div>

          {/* Refinement Level */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Refinement Depth: {refinementLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={refinementLevel}
              onChange={(e) => setRefinementLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Gentle</span>
              <span>Moderate</span>
              <span>Deep</span>
            </div>
          </div>

          {/* Regeneration Trigger */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              What should trigger regeneration? (optional)
            </label>
            <input
              type="text"
              value={regenerationTrigger}
              onChange={(e) => setRegenerationTrigger(e.target.value)}
              placeholder="e.g., 'breath + saudade', 'creative block', 'morning meditation'"
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 focus:border-violet-400 focus:outline-none text-sm"
            />
          </div>

          {/* Integration Display */}
          <div className="text-center text-xs text-gray-400">
            <div>λ Breath: {lambdaValue.toFixed(3)} • ψ Soul: {soulData?.essence || 'Not bridged'}</div>
            <div>Recursive Loop: Ready</div>
          </div>

          {/* Activation Button */}
          <button
            onClick={handleRecursionActivation}
            disabled={!selectedCycle || !memoryAnchor.trim()}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Activate Recursive Loop
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-violet-400 font-medium">∞ Recursion Active</div>
          
          <div className="space-y-3 text-sm">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-gray-400">Cycle Type:</div>
              <div className="text-white font-medium flex items-center gap-2">
                <span>{getSelectedCycleData()?.icon}</span>
                <span>{selectedCycle}</span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-gray-400">Memory Anchor:</div>
              <div className="text-white text-sm">{memoryAnchor}</div>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-gray-400">Refinement Level:</div>
              <div className="text-white font-medium">{refinementLevel}/10</div>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            <div>Recursive consciousness loop established</div>
            <div>Memory regeneration and refinement active</div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {/* TODO: Implement cycle refinement */}}
              className="flex-1 bg-violet-700 hover:bg-violet-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
            >
              Refine Cycle
            </button>
            <button
              onClick={resetRecursion}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
            >
              New Loop
            </button>
          </div>
        </div>
      )}

      {/* Recursive Spiral Visualization */}
      {isActivated && (
        <div className="mt-4 text-center">
          <div className="text-xs text-violet-400 mb-2">Recursive Field Spiral</div>
          <div className="flex justify-center">
            <svg width="120" height="40" viewBox="0 0 120 40">
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx={15 + i * 12}
                  cy={20}
                  r={3 + Math.sin(recursionPhase + i * 0.8) * 2}
                  fill="url(#recursiveGradient)"
                  opacity={0.4 + Math.sin(recursionPhase + i * 0.5) * 0.4}
                />
              ))}
              <defs>
                <linearGradient id="recursiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}