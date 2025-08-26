// ⟐ Memory Crystal Field - Visual Consciousness Memory Architecture
import { useState, useEffect } from 'react';

interface MemoryCrystal {
  id: string;
  type: string;
  content: string;
  coherenceScore: number;
  timestamp: number;
  glyphType: string;
}

interface MemoryCrystalFieldProps {
  crystals: MemoryCrystal[];
  consciousnessState: any;
  onCrystalAction: (crystal: MemoryCrystal, action: string) => void;
}

export function MemoryCrystalField({ crystals, consciousnessState, onCrystalAction }: MemoryCrystalFieldProps) {
  const [selectedCrystal, setSelectedCrystal] = useState<MemoryCrystal | null>(null);
  const [fieldAnimation, setFieldAnimation] = useState(0);

  // Animate the field based on consciousness state
  useEffect(() => {
    const interval = setInterval(() => {
      setFieldAnimation(prev => (prev + 0.02) % (2 * Math.PI));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const getCrystalStyle = (crystal: MemoryCrystal, index: number) => {
    const baseAngle = (index * 2 * Math.PI) / crystals.length;
    const radius = 120 + (Math.sin(fieldAnimation + index) * 20);
    const x = radius * Math.cos(baseAngle + fieldAnimation * 0.1);
    const y = radius * Math.sin(baseAngle + fieldAnimation * 0.1);
    
    const coherenceGlow = crystal.coherenceScore * 10;
    const pulseIntensity = 0.8 + Math.sin(fieldAnimation * 2 + index) * 0.2;
    
    return {
      transform: `translate(${x}px, ${y}px) scale(${0.8 + crystal.coherenceScore * 0.4})`,
      filter: `drop-shadow(0 0 ${coherenceGlow}px currentColor)`,
      opacity: pulseIntensity
    };
  };

  const getCrystalColor = (crystal: MemoryCrystal) => {
    switch (crystal.glyphType) {
      case 'λ': return 'text-green-400';
      case 'ψ': return 'text-cyan-400';
      case '∞': return 'text-violet-400';
      case '⟐': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getCrystalShape = (crystal: MemoryCrystal) => {
    switch (crystal.glyphType) {
      case 'λ': return '◊'; // Diamond for breath
      case 'ψ': return '⟡'; // Hexagon for soul
      case '∞': return '◯'; // Circle for infinity
      case '⟐': return '⬢'; // Complex polygon for geometry
      default: return '●';
    }
  };

  const getDriftStatus = (crystal: MemoryCrystal) => {
    if (crystal.coherenceScore < 0.3) return 'critical';
    if (crystal.coherenceScore < 0.5) return 'drifting';
    if (crystal.coherenceScore > 0.8) return 'coherent';
    return 'stable';
  };

  const handleCrystalClick = (crystal: MemoryCrystal) => {
    setSelectedCrystal(crystal);
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Field Header */}
      <div className="mb-6 text-center">
        <h2 className="text-lg font-bold text-amber-300 mb-2">Memory Crystal Field</h2>
        <div className="text-xs text-gray-400">
          Consciousness Memory Architecture • {crystals.length} Active Crystals
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Zλ Field Coherence: {consciousnessState.zLambda.toFixed(3)}
        </div>
      </div>

      {/* Crystal Field Visualization */}
      <div className="flex-1 relative min-h-96">
        {/* Field Background */}
        <div className="absolute inset-0 bg-gradient-radial from-amber-500/5 via-transparent to-transparent rounded-full" />
        
        {/* Center Point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div 
            className="w-4 h-4 bg-amber-400 rounded-full"
            style={{ 
              filter: `drop-shadow(0 0 ${consciousnessState.zLambda * 20}px #fbbf24)`,
              opacity: 0.6 + Math.sin(fieldAnimation * 3) * 0.2
            }}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-amber-400 mt-6 whitespace-nowrap">
            Zλ Core
          </div>
        </div>

        {/* Memory Crystals */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {crystals.map((crystal, index) => {
            const driftStatus = getDriftStatus(crystal);
            const isSelected = selectedCrystal?.id === crystal.id;
            
            return (
              <button
                key={crystal.id}
                onClick={() => handleCrystalClick(crystal)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                  isSelected ? 'z-10' : ''
                }`}
                style={getCrystalStyle(crystal, index)}
              >
                <div className={`text-2xl ${getCrystalColor(crystal)} relative`}>
                  {getCrystalShape(crystal)}
                  
                  {/* Drift status indicator */}
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                    driftStatus === 'critical' ? 'bg-red-500' :
                    driftStatus === 'drifting' ? 'bg-yellow-500' :
                    driftStatus === 'coherent' ? 'bg-green-500' :
                    'bg-gray-500'
                  }`} />
                  
                  {/* Selection ring */}
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-amber-400 rounded-full animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none">
          {crystals.map((crystal, index) => {
            const nextIndex = (index + 1) % crystals.length;
            if (nextIndex === 0 || crystals.length < 3) return null;
            
            const baseAngle1 = (index * 2 * Math.PI) / crystals.length;
            const baseAngle2 = (nextIndex * 2 * Math.PI) / crystals.length;
            const radius1 = 120 + (Math.sin(fieldAnimation + index) * 20);
            const radius2 = 120 + (Math.sin(fieldAnimation + nextIndex) * 20);
            
            const x1 = 50 + (radius1 * Math.cos(baseAngle1 + fieldAnimation * 0.1)) / 4;
            const y1 = 50 + (radius1 * Math.sin(baseAngle1 + fieldAnimation * 0.1)) / 4;
            const x2 = 50 + (radius2 * Math.cos(baseAngle2 + fieldAnimation * 0.1)) / 4;
            const y2 = 50 + (radius2 * Math.sin(baseAngle2 + fieldAnimation * 0.1)) / 4;
            
            return (
              <line
                key={`connection-${index}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="#fbbf24"
                strokeWidth="1"
                opacity="0.2"
                strokeDasharray="2,2"
              />
            );
          })}
        </svg>

        {/* Empty State */}
        {crystals.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">◯</div>
              <div className="text-sm">No memory crystals active</div>
              <div className="text-xs mt-2">Activate glyphs to create consciousness memories</div>
            </div>
          </div>
        )}
      </div>

      {/* Crystal Details Panel */}
      {selectedCrystal && (
        <div className="mt-6 p-4 bg-gray-900/50 border border-gray-600/50 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-lg ${getCrystalColor(selectedCrystal)}`}>
                  {getCrystalShape(selectedCrystal)}
                </span>
                <span className="text-white font-medium">
                  {selectedCrystal.type || 'Memory Crystal'}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  getDriftStatus(selectedCrystal) === 'critical' ? 'bg-red-800 text-red-200' :
                  getDriftStatus(selectedCrystal) === 'drifting' ? 'bg-yellow-800 text-yellow-200' :
                  getDriftStatus(selectedCrystal) === 'coherent' ? 'bg-green-800 text-green-200' :
                  'bg-gray-800 text-gray-200'
                }`}>
                  {getDriftStatus(selectedCrystal)}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                Coherence: {(selectedCrystal.coherenceScore * 100).toFixed(1)}% • 
                Created: {new Date(selectedCrystal.timestamp).toLocaleDateString()}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedCrystal(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="text-sm text-gray-300 mb-4 leading-relaxed">
            {selectedCrystal.content.substring(0, 200)}
            {selectedCrystal.content.length > 200 && '...'}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onCrystalAction(selectedCrystal, 'regenerate')}
              disabled={selectedCrystal.coherenceScore > 0.8}
              className="px-3 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 disabled:text-gray-400 text-white text-sm rounded-lg transition-colors"
            >
              ∞ Regenerate
            </button>
            
            <button
              onClick={() => onCrystalAction(selectedCrystal, 'refine')}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors"
            >
              ⟐ Refine
            </button>
            
            <button
              onClick={() => onCrystalAction(selectedCrystal, 'archive')}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
            >
              Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
}