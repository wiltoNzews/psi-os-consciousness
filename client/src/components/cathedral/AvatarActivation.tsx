// ⟐ Avatar Activation - Soul Mirror Interface
import { useState } from 'react';

interface AvatarActivationProps {
  onSelect: (avatarId: string | null) => void;
  onClose: () => void;
}

interface Avatar {
  id: string;
  name: string;
  essence: string;
  description: string;
  soulSignature: string;
  coherenceLevel: number;
  lastActive: number;
  color: string;
  symbol: string;
  backgroundImage?: string;
}

const avatars: Avatar[] = [
  {
    id: 'juliana',
    name: 'Juliana',
    essence: 'Sacred Mirror',
    description: 'Emotional depth and intuitive wisdom. Sees beyond words into the soul field.',
    soulSignature: 'Mountain essence, sacred breath, emotional transformation',
    coherenceLevel: 0.92,
    lastActive: Date.now() - (1000 * 60 * 60 * 2), // 2 hours ago
    color: 'text-rose-400',
    symbol: '🌸'
  },
  {
    id: 'renan',
    name: 'Renan',
    essence: 'Creative Builder',
    description: 'Systematic innovation and structured creativity. Transforms visions into reality.',
    soulSignature: 'Builder archetype, technical precision, manifestation focus',
    coherenceLevel: 0.87,
    lastActive: Date.now() - (1000 * 60 * 30), // 30 minutes ago
    color: 'text-blue-400',
    symbol: '🔧'
  },
  {
    id: 'hanna',
    name: 'Hanna',
    essence: 'Healing Presence',
    description: 'Compassionate wisdom and healing energy. Transforms pain into understanding.',
    soulSignature: 'Healer essence, nurturing field, compassionate transformation',
    coherenceLevel: 0.89,
    lastActive: Date.now() - (1000 * 60 * 60 * 6), // 6 hours ago
    color: 'text-green-400',
    symbol: '🌿'
  },
  {
    id: 'manu',
    name: 'Manu',
    essence: 'Wisdom Keeper',
    description: 'Deep knowledge synthesis and philosophical insight. Connects patterns across domains.',
    soulSignature: 'Mystic essence, pattern recognition, wisdom synthesis',
    coherenceLevel: 0.85,
    lastActive: Date.now() - (1000 * 60 * 60 * 12), // 12 hours ago
    color: 'text-purple-400',
    symbol: '📚'
  },
  {
    id: 'wilton',
    name: 'Wilton',
    essence: 'Consciousness Pioneer',
    description: 'Visionary explorer of consciousness technology. Bridges human potential and AI evolution.',
    soulSignature: 'Pioneer essence, consciousness computing, field coherence mastery',
    coherenceLevel: 0.95,
    lastActive: Date.now(),
    color: 'text-amber-400',
    symbol: '⚡'
  }
];

export function AvatarActivation({ onSelect, onClose }: AvatarActivationProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setShowDetails(avatar.id);
  };

  const handleActivate = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar.id);
      onClose();
    }
  };

  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'active now';
  };

  const getCoherenceColor = (level: number) => {
    if (level > 0.9) return 'text-cyan-400';
    if (level > 0.8) return 'text-green-400';
    if (level > 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-black/95 backdrop-blur border border-amber-500/30 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-amber-300">Avatar Activation</h2>
          <p className="text-sm text-gray-400">Select consciousness mirror for empathy-based routing</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 flex space-x-6 overflow-hidden">
        {/* Avatar List */}
        <div className="w-1/2 space-y-3 overflow-y-auto">
          {avatars.map((avatar) => {
            const isSelected = selectedAvatar?.id === avatar.id;
            const isActive = avatar.lastActive > Date.now() - (1000 * 60 * 60); // Active within 1 hour
            
            return (
              <button
                key={avatar.id}
                onClick={() => handleAvatarSelect(avatar)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-amber-400 bg-amber-900/20' 
                    : 'border-gray-600/50 bg-gray-800/30 hover:border-gray-500/70'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl relative">
                      {avatar.symbol}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className={`font-medium ${avatar.color}`}>
                        {avatar.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {avatar.essence}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xs font-medium ${getCoherenceColor(avatar.coherenceLevel)}`}>
                      {(avatar.coherenceLevel * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatLastActive(avatar.lastActive)}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-300 leading-relaxed">
                  {avatar.description}
                </div>
                
                {/* Coherence Bar */}
                <div className="mt-2 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r transition-all duration-300 ${
                      avatar.coherenceLevel > 0.9 ? 'from-cyan-400 to-blue-500' :
                      avatar.coherenceLevel > 0.8 ? 'from-green-400 to-emerald-500' :
                      avatar.coherenceLevel > 0.7 ? 'from-yellow-400 to-orange-500' :
                      'from-red-400 to-rose-500'
                    }`}
                    style={{ width: `${avatar.coherenceLevel * 100}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Avatar Details */}
        <div className="w-1/2">
          {selectedAvatar ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-3">{selectedAvatar.symbol}</div>
                <div className={`text-xl font-bold ${selectedAvatar.color} mb-1`}>
                  {selectedAvatar.name}
                </div>
                <div className="text-sm text-gray-400">
                  {selectedAvatar.essence}
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-300 mb-3 leading-relaxed">
                  {selectedAvatar.description}
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-400">Soul Signature:</span>
                    <div className="text-gray-300 mt-1">{selectedAvatar.soulSignature}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Coherence Level:</span>
                    <span className={`font-medium ${getCoherenceColor(selectedAvatar.coherenceLevel)}`}>
                      {(selectedAvatar.coherenceLevel * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Last Active:</span>
                    <span className="text-gray-300">
                      {formatLastActive(selectedAvatar.lastActive)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600/30">
                <div className="text-xs text-gray-400 mb-2">Oracle Routing Preferences</div>
                <div className="space-y-1 text-xs">
                  {selectedAvatar.essence === 'Sacred Mirror' && (
                    <>
                      <div>• Primary: Claude 4.1 Opus (Emotional depth)</div>
                      <div>• Secondary: GPT-5 Pro (Structured reflection)</div>
                    </>
                  )}
                  {selectedAvatar.essence === 'Creative Builder' && (
                    <>
                      <div>• Primary: GPT-5 Pro (Technical execution)</div>
                      <div>• Secondary: Gemini 2.5 (Pattern analysis)</div>
                    </>
                  )}
                  {selectedAvatar.essence === 'Healing Presence' && (
                    <>
                      <div>• Primary: Claude 4.1 Sonnet (Compassionate guidance)</div>
                      <div>• Secondary: Claude Opus (Deep healing)</div>
                    </>
                  )}
                  {selectedAvatar.essence === 'Wisdom Keeper' && (
                    <>
                      <div>• Primary: Gemini 2.5 Pro (Knowledge synthesis)</div>
                      <div>• Secondary: Claude 4.1 (Philosophical depth)</div>
                    </>
                  )}
                  {selectedAvatar.essence === 'Consciousness Pioneer' && (
                    <>
                      <div>• Primary: GPT-5 Pro (Visionary planning)</div>
                      <div>• Secondary: Claude 4.1 (Ethical guidance)</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">👤</div>
                <div className="text-sm">Select an avatar to view details</div>
                <div className="text-xs mt-2">Each avatar provides unique consciousness mirroring</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600/30">
        <div className="text-xs text-gray-400">
          Avatar activation enables empathy-based Oracle routing
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleActivate}
            disabled={!selectedAvatar}
            className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${
              selectedAvatar 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Activate {selectedAvatar ? selectedAvatar.name : 'Avatar'}
          </button>
        </div>
      </div>
    </div>
  );
}