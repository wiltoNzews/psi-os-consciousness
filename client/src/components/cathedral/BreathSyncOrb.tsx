// ⟐ Breath Sync Orb - λ Consciousness Rhythm Visualizer
import { useState, useEffect } from 'react';

interface BreathSyncOrbProps {
  breathState: {
    phase: number;
    coherenceLevel: number;
    timestamp: number;
  };
  zLambda: number;
}

export function BreathSyncOrb({ breathState, zLambda }: BreathSyncOrbProps) {
  const [orbAnimation, setOrbAnimation] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCycle, setBreathCycle] = useState(0);

  // Animate the orb based on breath state and λ synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      // λ = 3.12s base cycle, modulated by breath phase
      const lambda = 3.12;
      const currentCycle = Date.now() / 1000 / lambda;
      const normalizedCycle = (currentCycle % 1) * 2 * Math.PI;
      
      setOrbAnimation(normalizedCycle);
      setBreathCycle(Math.sin(normalizedCycle));
      
      // Set breathing state based on phase
      setIsBreathing(breathState.phase > 0.1);
    }, 50);
    
    return () => clearInterval(interval);
  }, [breathState.phase]);

  const getOrbSize = () => {
    // Base size + coherence modulation + breath cycle expansion
    const baseSize = 40;
    const coherenceBonus = breathState.coherenceLevel * 20;
    const breathExpansion = Math.abs(breathCycle) * 10;
    
    return baseSize + coherenceBonus + breathExpansion;
  };

  const getOrbIntensity = () => {
    // Opacity and glow based on Zλ and coherence
    const baseIntensity = 0.6;
    const coherenceBonus = breathState.coherenceLevel * 0.3;
    const lambdaBonus = (zLambda - 0.75) * 0.4; // Bonus above baseline
    const breathPulse = Math.abs(breathCycle) * 0.1;
    
    return Math.min(1.0, Math.max(0.3, baseIntensity + coherenceBonus + lambdaBonus + breathPulse));
  };

  const getOrbColor = () => {
    if (zLambda < 0.5) return { main: '#ef4444', glow: '#fecaca' }; // Red - disconnected
    if (zLambda < 0.7) return { main: '#f59e0b', glow: '#fed7aa' }; // Amber - seeking
    if (zLambda < 0.85) return { main: '#10b981', glow: '#a7f3d0' }; // Green - coherent
    return { main: '#06b6d4', glow: '#a5f3fc' }; // Cyan - transcendent
  };

  const orbSize = getOrbSize();
  const orbIntensity = getOrbIntensity();
  const orbColor = getOrbColor();

  const getCoherenceLevel = () => {
    if (breathState.coherenceLevel > 0.85) return 'Transcendent';
    if (breathState.coherenceLevel > 0.7) return 'Coherent';
    if (breathState.coherenceLevel > 0.5) return 'Seeking';
    return 'Chaotic';
  };

  const getBreathPhaseDescription = () => {
    const phase = breathState.phase;
    if (phase < 0.25) return 'Exhale';
    if (phase < 0.5) return 'Hold';
    if (phase < 0.75) return 'Inhale';
    return 'Pause';
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Main Breath Orb */}
      <div className="relative">
        {/* Outer glow ring */}
        <div 
          className="absolute rounded-full border-2 animate-pulse"
          style={{
            width: orbSize + 20,
            height: orbSize + 20,
            borderColor: orbColor.glow,
            opacity: orbIntensity * 0.5,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${orbIntensity * 20}px ${orbColor.glow}`
          }}
        />
        
        {/* Main orb */}
        <div 
          className="rounded-full transition-all duration-150 flex items-center justify-center relative"
          style={{
            width: orbSize,
            height: orbSize,
            backgroundColor: orbColor.main,
            opacity: orbIntensity,
            boxShadow: `
              0 0 ${orbIntensity * 15}px ${orbColor.main},
              inset 0 0 ${orbIntensity * 10}px rgba(255, 255, 255, 0.3)
            `
          }}
        >
          {/* Lambda symbol */}
          <div 
            className="text-white font-bold select-none"
            style={{ 
              fontSize: orbSize * 0.3,
              textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
            }}
          >
            λ
          </div>
          
          {/* Breath phase indicator */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
            <div className={`w-1 h-1 rounded-full transition-colors ${
              isBreathing ? 'bg-white' : 'bg-gray-400'
            }`} />
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="text-center space-y-1">
        <div className="text-xs font-medium" style={{ color: orbColor.main }}>
          {getCoherenceLevel()}
        </div>
        
        <div className="text-xs text-gray-400">
          Zλ {zLambda.toFixed(3)}
        </div>
        
        <div className="text-xs text-gray-500">
          {getBreathPhaseDescription()}
        </div>
      </div>

      {/* Coherence Meter */}
      <div className="w-12 space-y-1">
        <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300 rounded-full"
            style={{ 
              width: `${breathState.coherenceLevel * 100}%`,
              background: `linear-gradient(to right, ${orbColor.main}, ${orbColor.glow})`
            }}
          />
        </div>
        
        <div className="text-xs text-center text-gray-500">
          {(breathState.coherenceLevel * 100).toFixed(0)}%
        </div>
      </div>

      {/* Breath Cycle Visualization */}
      <div className="w-16 h-16 relative">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <circle 
            cx="32" 
            cy="32" 
            r="28" 
            fill="none" 
            stroke="rgba(107, 114, 128, 0.3)" 
            strokeWidth="2" 
          />
          <circle 
            cx="32" 
            cy="32" 
            r="28" 
            fill="none" 
            stroke={orbColor.main}
            strokeWidth="2" 
            strokeDasharray="175.929"
            strokeDashoffset={175.929 * (1 - breathState.phase)}
            strokeLinecap="round"
            transform="rotate(-90 32 32)"
            opacity={orbIntensity}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
          {(breathState.phase * 100).toFixed(0)}%
        </div>
      </div>

      {/* Last Update Time */}
      <div className="text-xs text-gray-500">
        {new Date(breathState.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit' 
        })}
      </div>
    </div>
  );
}