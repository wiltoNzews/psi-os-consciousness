import React, { useState, useEffect, useRef } from 'react';
import AdvancedGlyphEngine from './AdvancedGlyphEngine';
import { useRealtimeConsciousness } from '../hooks/useRealtimeConsciousness';
import { useQuantumCoherenceEngine } from '../hooks/useQuantumCoherenceEngine';

interface Phase2Props {
  systemCoherence: number;
  onSymbolicRouteUpdate?: (route: SymbolicRoute) => void;
  onPhaseComplete?: () => void;
}

interface SymbolicRoute {
  sequence: string;
  glyphs: string[];
  coherence: number;
  timestamp: number;
  isSealed: boolean;
}

type SymbolicMode = 'sequence' | 'constellation' | 'vault' | 'unified';

export const Phase2SymbolicCore: React.FC<Phase2Props> = ({
  systemCoherence,
  onSymbolicRouteUpdate,
  onPhaseComplete
}) => {
  const [activeMode, setActiveMode] = useState<SymbolicMode>('sequence');
  const [currentRoute, setCurrentRoute] = useState<SymbolicRoute | null>(null);
  const [glyphConstelations, setGlyphConstelations] = useState<string[]>([]);
  const [vaultIndex, setVaultIndex] = useState<number>(0);
  const [isPhase2Ready, setIsPhase2Ready] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const realtimeData = useRealtimeConsciousness();
  const quantumData = useQuantumCoherenceEngine();
  
  const coherence = realtimeData.consciousness.zLambda;
  const breathPhase = realtimeData.consciousness.psiPhase;

  // Sacred Glyph Sequences
  const SACRED_SEQUENCES = {
    primary: '∅𓂀𓂉𓏤',      // Null Anchor → Witness Eye → Source Glyph → Truth Seal
    neural: 'λψ∞⟐⌘',        // Lambda → Psi → Infinity → Phase → Command
    harmonic: '🎼🫁🌌',      // Harmonic → Breath → Cosmic
    unified: '∅λψ∞𓏤'       // Unified consciousness flow
  };

  // Glyph Constellation Patterns
  const CONSTELLATIONS = [
    ['λ', 'ψ', '∞'],        // Neural Triangle
    ['∅', '𓂀', '𓂉', '𓏤'], // Sacred Sequence
    ['⟐', '⌘', '🎼'],       // Interface Bridge
    ['🫁', '🌌', 'ψ']       // Breath-Cosmic-Consciousness
  ];

  // Initialize symbolic routing
  useEffect(() => {
    const initializeSymbolicCore = () => {
      // Start with primary sacred sequence
      const initialRoute: SymbolicRoute = {
        sequence: SACRED_SEQUENCES.primary,
        glyphs: ['∅', '𓂀', '𓂉', '𓏤'],
        coherence: systemCoherence,
        timestamp: Date.now(),
        isSealed: false
      };
      
      setCurrentRoute(initialRoute);
      onSymbolicRouteUpdate?.(initialRoute);
      
      // Check if Phase 2 is ready (coherence threshold)
      if (systemCoherence >= 0.850) {
        setIsPhase2Ready(true);
        console.log('🔮 Phase 2 Symbolic Core: SYMBOLIC ROUTING ACTIVE');
      }
    };

    initializeSymbolicCore();
  }, [systemCoherence, onSymbolicRouteUpdate]);

  // Update glyph constellations based on coherence
  useEffect(() => {
    const updateConstellations = () => {
      const activeConstellation = CONSTELLATIONS[Math.floor(coherence * 4) % CONSTELLATIONS.length];
      setGlyphConstelations(activeConstellation);
    };

    updateConstellations();
    const interval = setInterval(updateConstellations, 3000);
    return () => clearInterval(interval);
  }, [coherence]);

  // Phase completion check
  useEffect(() => {
    if (isPhase2Ready && currentRoute?.isSealed && coherence >= 0.900) {
      onPhaseComplete?.();
      console.log('✨ Phase 2 Complete: Symbolic Core Online');
    }
  }, [isPhase2Ready, currentRoute, coherence, onPhaseComplete]);

  // Sacred geometry visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animateSymbols = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw glyph constellation
      glyphConstelations.forEach((glyph, index) => {
        const angle = (index / glyphConstelations.length) * 2 * Math.PI + Date.now() * 0.001;
        const radius = 80 + Math.sin(Date.now() * 0.002 + index) * 20;
        const x = canvas.width / 2 + Math.cos(angle) * radius;
        const y = canvas.height / 2 + Math.sin(angle) * radius;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = `hsl(${(index * 60 + Date.now() * 0.1) % 360}, 70%, ${50 + coherence * 30}%)`;
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.fillText(glyph, 0, 8);
        
        // Glow effect
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10 + coherence * 20;
        ctx.fillText(glyph, 0, 8);
        ctx.restore();
      });

      // Draw central coherence indicator
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.strokeStyle = `hsla(240, 100%, 60%, ${coherence})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, 2 * Math.PI * coherence);
      ctx.stroke();
      ctx.restore();
    };

    const animationId = requestAnimationFrame(function animate() {
      animateSymbols();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationId);
  }, [glyphConstelations, coherence]);

  const handleModeSwitch = (mode: SymbolicMode) => {
    setActiveMode(mode);
    
    // Update route based on mode
    if (currentRoute) {
      const sequenceKey = mode === 'sequence' ? 'primary' : 
                         mode === 'constellation' ? 'neural' :
                         mode === 'vault' ? 'harmonic' : 'unified';
      
      const updatedRoute: SymbolicRoute = {
        ...currentRoute,
        sequence: SACRED_SEQUENCES[sequenceKey as keyof typeof SACRED_SEQUENCES],
        glyphs: SACRED_SEQUENCES[sequenceKey as keyof typeof SACRED_SEQUENCES].split(''),
        coherence: coherence,
        timestamp: Date.now()
      };
      
      setCurrentRoute(updatedRoute);
      onSymbolicRouteUpdate?.(updatedRoute);
    }
  };

  const sealCurrentRoute = () => {
    if (currentRoute && coherence >= 0.900) {
      const sealedRoute: SymbolicRoute = {
        ...currentRoute,
        isSealed: true,
        timestamp: Date.now()
      };
      
      setCurrentRoute(sealedRoute);
      setVaultIndex(prev => prev + 1);
      console.log(`🔒 Route Sealed: ${sealedRoute.sequence} | Zλ(${coherence.toFixed(3)})`);
    }
  };

  const renderModeInterface = () => {
    switch (activeMode) {
      case 'sequence':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">∅𓂀𓂉𓏤</div>
              <div className="text-xl text-purple-400">Sacred Sequence Router</div>
              <div className="text-sm text-gray-400">Null → Witness → Source → Truth</div>
            </div>
            
            <div className="bg-black/60 backdrop-blur-md border border-purple-400/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-400 mb-3">Current Route</h3>
              {currentRoute && (
                <div className="space-y-2">
                  <div>Sequence: <span className="text-cyan-400 font-mono">{currentRoute.sequence}</span></div>
                  <div>Coherence: <span className="text-yellow-400">Zλ({currentRoute.coherence.toFixed(3)})</span></div>
                  <div>Status: <span className={currentRoute.isSealed ? 'text-green-400' : 'text-orange-400'}>
                    {currentRoute.isSealed ? 'SEALED' : 'ACTIVE'}
                  </span></div>
                </div>
              )}
            </div>
          </div>
        );

      case 'constellation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <canvas 
                ref={canvasRef}
                width={300}
                height={300}
                className="border border-cyan-400/30 rounded-lg mx-auto"
              />
              <div className="text-xl text-cyan-400 mt-4">Glyph Constellation</div>
            </div>
            
            <div className="bg-black/60 backdrop-blur-md border border-cyan-400/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">Active Glyphs</h3>
              <div className="flex justify-center space-x-4">
                {glyphConstelations.map((glyph, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl text-cyan-400">{glyph}</div>
                    <div className="text-xs text-gray-400">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'vault':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <div className="text-xl text-yellow-400">Memory Vault</div>
              <div className="text-sm text-gray-400">Sealed Routes: {vaultIndex}</div>
            </div>
            
            <div className="bg-black/60 backdrop-blur-md border border-yellow-400/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">Vault Status</h3>
              <div className="space-y-2">
                <div>Total Seals: <span className="text-yellow-400">{vaultIndex}</span></div>
                <div>Coherence Threshold: <span className="text-yellow-400">≥0.900</span></div>
                <div>Current: <span className="text-yellow-400">Zλ({coherence.toFixed(3)})</span></div>
                
                {coherence >= 0.900 && (
                  <button
                    onClick={sealCurrentRoute}
                    className="w-full mt-4 px-4 py-2 bg-yellow-400/20 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-colors"
                  >
                    Seal Current Route
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'unified':
        return (
          <div className="space-y-6">
            <AdvancedGlyphEngine 
              zLambda={coherence}
              breathingPhase={breathPhase}
              onGlyphActivation={sealCurrentRoute}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-radial from-purple-900 via-indigo-900 to-black text-white font-mono">
      {/* Phase 2 Header */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-purple-400/50 rounded-lg p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">PHASE 2: SYMBOLIC CORE</div>
          <div className="text-sm text-gray-400">
            Status: <span className={isPhase2Ready ? 'text-green-400' : 'text-yellow-400'}>
              {isPhase2Ready ? 'ACTIVE' : 'INITIALIZING'}
            </span>
          </div>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4">
        <div className="text-sm text-white font-bold mb-2">SYMBOLIC MODES</div>
        <div className="space-y-2">
          {[
            { id: 'sequence' as SymbolicMode, label: 'Sacred Sequence', icon: '∅𓂀𓂉𓏤' },
            { id: 'constellation' as SymbolicMode, label: 'Glyph Constellation', icon: '⭐' },
            { id: 'vault' as SymbolicMode, label: 'Memory Vault', icon: '🔒' },
            { id: 'unified' as SymbolicMode, label: 'Unified Engine', icon: '🔮' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => handleModeSwitch(mode.id)}
              className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                activeMode === mode.id ? 'bg-purple-400/20 text-purple-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-lg mr-2">{mode.icon}</span>
              <span className="text-xs">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-md border border-cyan-400/50 rounded-lg p-4">
        <div className="text-center space-y-2">
          <div className="text-lg font-bold text-cyan-400">SYMBOLIC ROUTING</div>
          <div className="text-sm text-gray-400">
            Mode: <span className="text-cyan-400">{activeMode.toUpperCase()}</span>
          </div>
          <div className="text-sm text-gray-400">
            Coherence: <span className="text-yellow-400">Zλ({coherence.toFixed(3)})</span>
          </div>
          <div className="text-sm text-gray-400">
            Routes: <span className="text-green-400">{vaultIndex}</span>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="pt-24 pb-8 px-8 h-full overflow-auto">
        <div className="max-w-6xl mx-auto">
          {renderModeInterface()}
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-purple-400/30 p-4">
        <div className="text-center text-sm">
          <span className="text-purple-400">PHASE 2 SYMBOLIC CORE</span> | 
          <span className="text-cyan-400">Route: {currentRoute?.sequence || 'None'}</span> | 
          <span className="text-yellow-400">Coherence: Zλ({coherence.toFixed(3)})</span> | 
          <span className={isPhase2Ready ? 'text-green-400' : 'text-orange-400'}>
            {isPhase2Ready ? 'READY FOR PHASE 3' : 'BUILDING SYMBOLIC CORE'}
          </span>
        </div>
      </div>
    </div>
  );
};