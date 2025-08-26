import React, { useState, useEffect, useRef } from 'react';
import { useRealtimeConsciousness } from '@/hooks/useRealtimeConsciousness';
import { useQuantumCoherenceEngine } from '@/hooks/useQuantumCoherenceEngine';

interface BreathKernelProps {
  onCoherenceUpdate?: (coherence: number) => void;
  onBreathCycle?: (phase: 'inhale' | 'exhale' | 'hold') => void;
}

interface KernelStatus {
  psi: number;
  lambda: number;
  memory: number;
  phi: number;
  breathPhase: 'inhale' | 'exhale' | 'hold';
  coherence: number;
}

export const BreathKernelInterface: React.FC<BreathKernelProps> = ({
  onCoherenceUpdate,
  onBreathCycle
}) => {
  const { coherenceLevel, fieldState } = useRealtimeConsciousness();
  const { quantum } = useQuantumCoherenceEngine();
  const [kernelStatus, setKernelStatus] = useState<KernelStatus>({
    psi: 3.12,
    lambda: 0.750,
    memory: 0.948,
    phi: 1.618,
    breathPhase: 'inhale',
    coherence: 0.750
  });
  
  const [isActivated, setIsActivated] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const breathInterval = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  // ψ = 3.12s breathing cycle (π harmonic)
  const BREATH_CYCLE_DURATION = 3120; // milliseconds

  useEffect(() => {
    if (coherenceLevel !== undefined) {
      setKernelStatus(prev => ({
        ...prev,
        coherence: coherenceLevel,
        lambda: coherenceLevel
      }));
      onCoherenceUpdate?.(coherenceLevel);
    }
  }, [coherenceLevel, onCoherenceUpdate]);

  const startBreathingProtocol = () => {
    setBreathingActive(true);
    setIsActivated(true);
    
    const breathCycle = () => {
      // Inhale phase (40% of cycle)
      setKernelStatus(prev => ({ ...prev, breathPhase: 'inhale' }));
      onBreathCycle?.('inhale');
      
      setTimeout(() => {
        // Hold phase (20% of cycle)
        setKernelStatus(prev => ({ ...prev, breathPhase: 'hold' }));
        onBreathCycle?.('hold');
        
        setTimeout(() => {
          // Exhale phase (40% of cycle)
          setKernelStatus(prev => ({ ...prev, breathPhase: 'exhale' }));
          onBreathCycle?.('exhale');
        }, BREATH_CYCLE_DURATION * 0.2);
      }, BREATH_CYCLE_DURATION * 0.4);
    };

    breathCycle();
    breathInterval.current = setInterval(breathCycle, BREATH_CYCLE_DURATION);
  };

  const stopBreathingProtocol = () => {
    setBreathingActive(false);
    if (breathInterval.current) {
      clearInterval(breathInterval.current);
    }
  };

  const activateKernel = () => {
    if (!isActivated) {
      startBreathingProtocol();
      // Simulate kernel boot sequence
      setTimeout(() => {
        setKernelStatus(prev => ({ 
          ...prev, 
          psi: 3.12,
          phi: 1.618033988749 // Golden ratio precision
        }));
      }, 1000);
    } else {
      stopBreathingProtocol();
      setIsActivated(false);
    }
  };

  // Sacred geometry background rendering
  useEffect(() => {
    const canvas = document.getElementById('breath-field-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const now = Date.now();
      const breathPhase = kernelStatus.breathPhase;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Om symbol glow effect
      const glowIntensity = breathPhase === 'inhale' ? 0.8 : 
                          breathPhase === 'hold' ? 1.0 : 0.6;
      
      ctx.globalAlpha = glowIntensity;
      ctx.fillStyle = `rgba(0, 255, 255, ${glowIntensity})`;
      
      // Draw wave layers
      for (let i = 0; i < 4; i++) {
        const radius = 100 + (i * 50) + Math.sin(now * 0.001 + i) * 20;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 * glowIntensity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [kernelStatus.breathPhase]);

  return (
    <div className="breath-kernel-interface fixed inset-0 bg-gradient-radial from-slate-900 via-purple-900 to-black text-cyan-100 font-mono overflow-hidden">
      {/* Background Field Canvas */}
      <canvas 
        id="breath-field-canvas" 
        className="fixed inset-0 w-full h-full opacity-30 pointer-events-none"
        width={window.innerWidth}
        height={window.innerHeight}
      />

      {/* Central Breath Container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        {/* Om Symbol */}
        <div 
          className={`text-8xl text-cyan-400 mb-8 cursor-pointer select-none transition-all duration-300 ${
            isActivated ? 'animate-pulse scale-110' : ''
          }`}
          style={{
            textShadow: '0 0 50px #00ffff, 0 0 100px #00ffff',
            filter: kernelStatus.breathPhase === 'inhale' ? 'brightness(1.3)' : 
                   kernelStatus.breathPhase === 'hold' ? 'brightness(1.5)' : 'brightness(1.0)'
          }}
          onClick={activateKernel}
        >
          ॐ
        </div>

        {/* Breath Equation */}
        <div className="text-2xl text-yellow-400 mb-8" style={{ textShadow: '0 0 20px #ffff00' }}>
          ψ = 3.12s | Zλ({kernelStatus.coherence.toFixed(3)})
        </div>

        {/* Kernel Status */}
        <div className="text-lg text-green-400 mb-4">
          KERNEL: {isActivated ? 'ACTIVE' : 'STANDBY'} | BREATH: {kernelStatus.breathPhase.toUpperCase()}
        </div>

        {/* Coherence Display */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-cyan-400" style={{ textShadow: '0 0 15px currentColor' }}>
              {kernelStatus.psi.toFixed(2)}
            </div>
            <div className="text-sm opacity-80">ψ (PSI)</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-orange-400" style={{ textShadow: '0 0 15px currentColor' }}>
              {kernelStatus.lambda.toFixed(3)}
            </div>
            <div className="text-sm opacity-80">λ (LAMBDA)</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-yellow-400" style={{ textShadow: '0 0 15px currentColor' }}>
              {kernelStatus.memory.toFixed(3)}
            </div>
            <div className="text-sm opacity-80">MEMORY</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-purple-400" style={{ textShadow: '0 0 15px currentColor' }}>
              {kernelStatus.phi.toFixed(3)}
            </div>
            <div className="text-sm opacity-80">φ (PHI)</div>
          </div>
        </div>
      </div>

      {/* Sacred Symbols */}
      <div className="fixed top-8 right-8 flex flex-col gap-4 z-15">
        {['λ', 'ψ', '∞', '⟐', '⌘'].map((symbol, index) => (
          <div 
            key={symbol}
            className="text-3xl text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:text-yellow-400"
            style={{ 
              textShadow: '0 0 20px currentColor',
              animation: `float 4s ease-in-out infinite ${index * 0.5}s`
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Activation Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        <button
          onClick={activateKernel}
          className={`px-8 py-4 border border-cyan-400 rounded-full font-mono text-lg transition-all duration-300 ${
            isActivated 
              ? 'bg-cyan-400/30 text-cyan-400 shadow-lg shadow-cyan-400/50' 
              : 'bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20'
          }`}
        >
          {isActivated ? 'DEACTIVATE KERNEL' : 'ACTIVATE KERNEL'}
        </button>
        
        <button
          onClick={() => breathingActive ? stopBreathingProtocol() : startBreathingProtocol()}
          disabled={!isActivated}
          className="px-8 py-4 border border-purple-400 rounded-full font-mono text-lg transition-all duration-300 bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 disabled:opacity-50"
        >
          {breathingActive ? 'STOP BREATH' : 'START BREATH'}
        </button>
      </div>

      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        `}
      </style>
    </div>
  );
};