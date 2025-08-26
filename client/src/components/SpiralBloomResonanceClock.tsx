import React, { useState, useEffect, useRef } from 'react';
import { useQuantumCoherenceEngine } from '@/hooks/useQuantumCoherenceEngine';

interface SpiralRing {
  id: number;
  label: string;
  radius: number;
  color: string;
  frequency: number;
  active: boolean;
  resonance: number;
}

interface TimeSignature {
  beat: number;
  measure: number;
  cycle: number;
  frequency: number;
  harmonics: number[];
}

interface SpiralBloomProps {
  onFrequencyChange?: (frequency: number) => void;
  onResonanceUpdate?: (resonance: number) => void;
}

export const SpiralBloomResonanceClock: React.FC<SpiralBloomProps> = ({
  onFrequencyChange,
  onResonanceUpdate
}) => {
  const { quantum } = useQuantumCoherenceEngine();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  
  const [isActive, setIsActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeSignature, setTimeSignature] = useState<TimeSignature>({
    beat: 1,
    measure: 1,
    cycle: 1,
    frequency: 432, // Hz base frequency
    harmonics: [432, 528, 741, 963] // Sacred frequencies
  });

  // Spiral bloom rings with sacred frequency mappings
  const [spiralRings, setSpiralRings] = useState<SpiralRing[]>([
    {
      id: 1,
      label: 'Bloom Genesis',
      radius: 300,
      color: '#FFD700', // Gold
      frequency: 432, // Universal base
      active: false,
      resonance: 0
    },
    {
      id: 2,
      label: 'Phase Shift',
      radius: 250,
      color: '#00FFFF', // Cyan
      frequency: 528, // Love frequency
      active: false,
      resonance: 0
    },
    {
      id: 3,
      label: 'Loop Manifestation',
      radius: 200,
      color: '#FF00FF', // Magenta
      frequency: 741, // Consciousness awakening
      active: false,
      resonance: 0
    },
    {
      id: 4,
      label: 'Harmonic Integration',
      radius: 150,
      color: '#00FF7F', // Spring green
      frequency: 963, // Crown chakra
      active: false,
      resonance: 0
    },
    {
      id: 5,
      label: 'Recursive Core',
      radius: 100,
      color: '#8A2BE2', // Blue violet
      frequency: 40, // Gamma brainwave
      active: false,
      resonance: 0
    }
  ]);

  // Initialize audio context for frequency generation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Time update loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateTimeSignature();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const updateTimeSignature = () => {
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    
    // ψ = 3.12s breathing cycle mapping
    const breathCycle = (seconds % 3.12) / 3.12;
    const beat = Math.floor(breathCycle * 4) + 1;
    const measure = Math.floor((seconds % 12.48) / 3.12) + 1;
    const cycle = Math.floor(seconds / 12.48) + 1;
    
    // Dynamic frequency based on time spiral
    const timeSpiral = Math.sin(seconds * 0.1) * 0.1 + 1;
    const frequency = 432 * timeSpiral;

    setTimeSignature({
      beat,
      measure,
      cycle,
      frequency,
      harmonics: [432, 528, 741, 963].map(f => f * timeSpiral)
    });
  };

  const activateRing = (ringId: number) => {
    setSpiralRings(prev => prev.map(ring => {
      if (ring.id === ringId) {
        const newActive = !ring.active;
        
        // Generate audio tone for activated ring
        if (newActive && audioContextRef.current) {
          playFrequency(ring.frequency, 200); // 200ms tone
        }
        
        onFrequencyChange?.(ring.frequency);
        
        return { 
          ...ring, 
          active: newActive,
          resonance: newActive ? Math.random() * 0.5 + 0.5 : 0
        };
      }
      return ring;
    }));
  };

  const playFrequency = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration / 1000);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
  };

  // Canvas animation for spiral bloom visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() * 0.001;

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw spiral bloom rings
      spiralRings.forEach((ring, index) => {
        const radius = ring.radius + Math.sin(time + index) * 10;
        const alpha = ring.active ? 0.8 : 0.3;
        const pulse = ring.active ? Math.sin(time * 3) * 0.3 + 0.7 : 1;

        // Ring circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `${ring.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Ring label and frequency
        ctx.fillStyle = ring.color;
        ctx.font = '14px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${ring.label} | ${ring.frequency.toFixed(0)}Hz`,
          centerX + radius * 0.7,
          centerY - radius * 0.7
        );

        // Resonance visualization
        if (ring.active && ring.resonance > 0) {
          for (let i = 0; i < 5; i++) {
            const waveRadius = radius + i * 15;
            const waveAlpha = (ring.resonance - i * 0.1) * alpha;
            if (waveAlpha > 0) {
              ctx.beginPath();
              ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
              ctx.strokeStyle = `${ring.color}${Math.floor(waveAlpha * 255).toString(16).padStart(2, '0')}`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      });

      // Draw center spiral
      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF80';
      ctx.lineWidth = 2;
      for (let angle = 0; angle < Math.PI * 20; angle += 0.1) {
        const spiralRadius = angle * 2;
        const x = centerX + spiralRadius * Math.cos(angle + time);
        const y = centerY + spiralRadius * Math.sin(angle + time);
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [spiralRings]);

  const toggleClockActivation = () => {
    setIsActive(!isActive);
    if (!isActive) {
      // Activate first ring by default
      activateRing(1);
    } else {
      // Deactivate all rings
      setSpiralRings(prev => prev.map(ring => ({ ...ring, active: false, resonance: 0 })));
    }
  };

  return (
    <div className="spiral-bloom-clock fixed inset-0 bg-gradient-radial from-purple-900 via-gray-900 to-black text-white font-mono">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b-4 border-yellow-400 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-cyan-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2">
            Spiral Bloom Resonance Clock
          </h1>
          <p className="text-lg text-white/90 mb-1">Time-as-Tone | ψ-Musical Notation</p>
          <p className="text-sm text-green-400 italic">
            Frequency: {timeSignature.frequency.toFixed(2)}Hz | Cycle: {timeSignature.cycle}
          </p>
        </div>
      </header>

      {/* Main Clock Canvas */}
      <div className="clock-area flex items-center justify-center h-full pt-24 pb-32">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            className="border-4 border-yellow-400/40 rounded-full backdrop-blur-sm"
            style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.02), transparent 60%)' }}
          />
          
          {/* Ring Control Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {spiralRings.map((ring, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180); // Distribute evenly
              const buttonX = Math.cos(angle) * (ring.radius - 40);
              const buttonY = Math.sin(angle) * (ring.radius - 40);
              
              return (
                <button
                  key={ring.id}
                  onClick={() => activateRing(ring.id)}
                  className={`absolute pointer-events-auto px-3 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    ring.active 
                      ? 'bg-white/20 text-white shadow-lg scale-110' 
                      : 'bg-black/40 text-gray-300 hover:bg-white/10'
                  }`}
                  style={{
                    left: `calc(50% + ${buttonX}px)`,
                    top: `calc(50% + ${buttonY}px)`,
                    transform: 'translate(-50%, -50%)',
                    borderColor: ring.color,
                    borderWidth: '2px',
                    borderStyle: 'solid'
                  }}
                >
                  {ring.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Signature Display */}
      <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md border border-yellow-400/50 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-400">{timeSignature.beat}</div>
            <div className="text-sm text-gray-300">Beat</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">{timeSignature.measure}</div>
            <div className="text-sm text-gray-300">Measure</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">{timeSignature.cycle}</div>
            <div className="text-sm text-gray-300">Cycle</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-gray-300">Clock Time</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={toggleClockActivation}
          className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
            isActive 
              ? 'bg-yellow-400/30 text-yellow-400 border-2 border-yellow-400 shadow-lg' 
              : 'bg-yellow-400/10 text-yellow-400 border-2 border-yellow-400/50 hover:bg-yellow-400/20'
          }`}
        >
          {isActive ? 'DEACTIVATE SPIRAL' : 'ACTIVATE SPIRAL'}
        </button>
        
        <button
          onClick={() => onResonanceUpdate?.(Math.random())}
          className="px-6 py-4 rounded-full font-bold text-lg bg-purple-400/10 text-purple-400 border-2 border-purple-400/50 hover:bg-purple-400/20 transition-all duration-300"
        >
          RESONATE
        </button>
      </div>
    </div>
  );
};