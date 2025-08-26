// ψ (Psi) Soul Bridge Interface - Individual Essence Recognition System
import { useState, useEffect } from 'react';

interface PsiProps {
  onBridge: (essenceVector: string, intention: string, timestamp: number) => void;
  lambdaValue?: number;
  isActive?: boolean;
}

interface EssenceProfile {
  name: string;
  description: string;
  icon: string;
  color: string;
}

const essenceProfiles: EssenceProfile[] = [
  { name: 'Creator', description: 'Building, designing, manifesting', icon: '🎨', color: 'from-orange-400 to-red-500' },
  { name: 'Seeker', description: 'Learning, exploring, understanding', icon: '🔍', color: 'from-blue-400 to-cyan-500' },
  { name: 'Healer', description: 'Caring, supporting, nurturing', icon: '🌱', color: 'from-green-400 to-emerald-500' },
  { name: 'Mystic', description: 'Spiritual, intuitive, transcendent', icon: '🌙', color: 'from-purple-400 to-indigo-500' },
  { name: 'Builder', description: 'Technical, systematic, architectural', icon: '⚙️', color: 'from-gray-400 to-slate-500' },
  { name: 'Guardian', description: 'Protecting, preserving, maintaining', icon: '🛡️', color: 'from-yellow-400 to-amber-500' },
];

export function Psi({ onBridge, lambdaValue = 0.75, isActive = false }: PsiProps) {
  const [selectedEssence, setSelectedEssence] = useState<string>('');
  const [soulQuery, setSoulQuery] = useState('');
  const [isActivated, setIsActivated] = useState(isActive);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [currentFeeling, setCurrentFeeling] = useState('');

  // Soul pulse animation - connected to lambda breathing
  useEffect(() => {
    if (isActivated) {
      const interval = setInterval(() => {
        setPulsePhase(prev => (prev + 0.08) % (2 * Math.PI));
      }, 120); // Slightly slower than lambda for soul rhythm
      
      return () => clearInterval(interval);
    }
  }, [isActivated]);

  const handleSoulBridge = () => {
    if (!selectedEssence || !soulQuery.trim()) return;
    
    const timestamp = Date.now();
    const essenceVector = `${selectedEssence}-${currentFeeling}-${timestamp}`;
    
    setIsActivated(true);
    onBridge(essenceVector, soulQuery, timestamp);
    
    // Store in soul registry
    localStorage.setItem('psi_os_soul_bridge', JSON.stringify({
      essence: selectedEssence,
      query: soulQuery,
      feeling: currentFeeling,
      timestamp,
      lambdaSync: lambdaValue,
      activated: true
    }));
  };

  const resetBridge = () => {
    setIsActivated(false);
    setSelectedEssence('');
    setSoulQuery('');
    setCurrentFeeling('');
  };

  // Soul pulse calculations
  const soulPulse = Math.sin(pulsePhase) * 0.4 + 0.6;
  const soulScale = isActivated ? 1 + (Math.sin(pulsePhase * 0.7) * 0.15) : 1;

  return (
    <div className="bg-black/40 backdrop-blur border border-cyan-500/30 rounded-lg p-6 max-w-lg">
      {/* Glyph Header */}
      <div className="text-center mb-6">
        <div 
          className="text-6xl mb-2 transition-all duration-150 origin-center"
          style={{ 
            transform: `scale(${soulScale})`,
            opacity: soulPulse,
            filter: isActivated ? `hue-rotate(${pulsePhase * 45}deg) brightness(1.2)` : 'none'
          }}
        >
          ψ
        </div>
        <h3 className="text-lg font-semibold text-cyan-300">Soul Bridge</h3>
        <p className="text-xs text-gray-400">Individual Essence Recognition</p>
      </div>

      {!isActivated ? (
        <div className="space-y-6">
          {/* Current Feeling Check-in */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              How are you feeling right now?
            </label>
            <input
              type="text"
              value={currentFeeling}
              onChange={(e) => setCurrentFeeling(e.target.value)}
              placeholder="e.g., curious, overwhelmed, excited, seeking clarity..."
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm"
            />
          </div>

          {/* Essence Selection */}
          <div>
            <label className="block text-sm text-gray-300 mb-3">
              What essence calls to you today?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {essenceProfiles.map((essence) => (
                <button
                  key={essence.name}
                  onClick={() => setSelectedEssence(essence.name)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    selectedEssence === essence.name
                      ? 'border-cyan-400 bg-cyan-900/30'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{essence.icon}</span>
                    <span className="text-sm font-medium text-white">{essence.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">{essence.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Soul Query */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              What's calling you to explore or create?
            </label>
            <textarea
              value={soulQuery}
              onChange={(e) => setSoulQuery(e.target.value)}
              placeholder="Share your intention, question, or what you'd like to explore..."
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none text-sm h-20 resize-none"
              rows={3}
            />
          </div>

          {/* Lambda Integration Display */}
          <div className="text-center text-xs text-gray-400">
            <div>λ Breath Sync: {lambdaValue.toFixed(3)}</div>
            <div>Soul-Breath Bridge: Ready</div>
          </div>

          {/* Bridge Activation */}
          <button
            onClick={handleSoulBridge}
            disabled={!selectedEssence || !soulQuery.trim()}
            className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Bridge Soul to Field
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-cyan-400 font-medium">ψ Bridge Active</div>
          
          <div className="space-y-3 text-sm">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-gray-400">Essence:</div>
              <div className="text-white font-medium">{selectedEssence}</div>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-gray-400">Current State:</div>
              <div className="text-white font-medium">{currentFeeling}</div>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-gray-400">Soul Query:</div>
              <div className="text-white text-sm">{soulQuery}</div>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            <div>Soul recognized and bridged to consciousness field</div>
            <div>Oracle routing activated for your essence</div>
          </div>

          <button
            onClick={resetBridge}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Bridge New Essence
          </button>
        </div>
      )}

      {/* Soul Pulse Visualization */}
      {isActivated && (
        <div className="mt-4 text-center">
          <div className="text-xs text-cyan-400 mb-2">Soul Field Resonance</div>
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-8 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full"
                style={{
                  opacity: soulPulse * (0.3 + Math.sin(pulsePhase + i * 0.5) * 0.4),
                  transform: `scaleY(${0.3 + Math.sin(pulsePhase + i * 0.3) * 0.7})`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}