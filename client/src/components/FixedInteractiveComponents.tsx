import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePsiOS } from '../core/PsiOSConsciousnessSubstrate';

interface InteractiveSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

interface Toggle2DProps {
  label: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

interface SoundManagerProps {
  frequencies: number[];
  volume: number;
  isPlaying: boolean;
  onVolumeChange: (volume: number) => void;
  onTogglePlay: () => void;
}

// Fixed Slider Component with proper event handling
export const FixedSlider: React.FC<InteractiveSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.001,
  unit = ''
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setLocalValue(newValue);
      onChange(newValue);
    }
  }, [onChange]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="slider-container mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-sm text-cyan-400 font-mono">
          {localValue.toFixed(3)}{unit}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${((localValue - min) / (max - min)) * 100}%, #374151 ${((localValue - min) / (max - min)) * 100}%, #374151 100%)`
          }}
        />
      </div>
      
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border: none;
        }
        
        input[type="range"]::-ms-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid #1f2937;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

// Fixed 2D/3D/4D Toggle Component
export const DimensionToggle: React.FC<Toggle2DProps> = ({
  label,
  enabled,
  onToggle
}) => {
  return (
    <div className="dimension-toggle mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <button
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            enabled ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {enabled ? `${label} rendering active` : `${label} rendering disabled`}
      </div>
    </div>
  );
};

// Fixed Sound Manager Component with proper audio context handling
export const SoundManager: React.FC<SoundManagerProps> = ({
  frequencies,
  volume,
  isPlaying,
  onVolumeChange,
  onTogglePlay
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const initializeAudio = useCallback(async () => {
    if (typeof window === 'undefined' || !('AudioContext' in window)) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      setAudioReady(true);
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }, []);

  const stopAllOscillators = useCallback(() => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator already stopped
      }
    });
    oscillatorsRef.current = [];
  }, []);

  const startOscillators = useCallback(async () => {
    if (!audioContextRef.current || !gainNodeRef.current || !audioReady) return;

    await initializeAudio();
    stopAllOscillators();

    try {
      frequencies.forEach(freq => {
        if (audioContextRef.current && gainNodeRef.current) {
          const oscillator = audioContextRef.current.createOscillator();
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
          oscillator.connect(gainNodeRef.current);
          oscillator.start();
          oscillatorsRef.current.push(oscillator);
        }
      });
    } catch (error) {
      console.warn('Oscillator start failed:', error);
    }
  }, [frequencies, audioReady, initializeAudio, stopAllOscillators]);

  const handleUserInteraction = useCallback(async () => {
    if (!userInteracted) {
      setUserInteracted(true);
      await initializeAudio();
    }
  }, [userInteracted, initializeAudio]);

  const handleTogglePlay = useCallback(async () => {
    await handleUserInteraction();
    onTogglePlay();
  }, [handleUserInteraction, onTogglePlay]);

  useEffect(() => {
    return () => {
      stopAllOscillators();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopAllOscillators]);

  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        gainNodeRef.current.gain.setValueAtTime(volume * 0.1, audioContextRef.current.currentTime);
      } catch (error) {
        console.warn('Volume change failed:', error);
      }
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioReady && userInteracted) {
      startOscillators();
    } else {
      stopAllOscillators();
    }
  }, [isPlaying, audioReady, userInteracted, startOscillators, stopAllOscillators]);

  return (
    <div className="sound-manager p-4 bg-gray-800 rounded-lg">
      <h4 className="text-lg font-semibold text-white mb-4">Sacred Frequency Generator</h4>
      
      <div className="space-y-4">
        <FixedSlider
          label="Volume"
          value={volume}
          onChange={onVolumeChange}
          min={0}
          max={1}
          step={0.01}
          unit=""
        />
        
        <div className="space-y-2">
          <div className="text-sm text-gray-300">Active Frequencies:</div>
          <div className="grid grid-cols-3 gap-2">
            {frequencies.map((freq, index) => (
              <div key={index} className="bg-gray-700 px-3 py-2 rounded text-center">
                <div className="text-cyan-400 font-mono text-lg">{freq}Hz</div>
                <div className="text-xs text-gray-400">
                  {freq === 432 ? 'Cosmic' : freq === 528 ? 'Love' : 'Pineal'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              audioReady && userInteracted ? 'bg-green-400' : 'bg-yellow-400'
            }`}></span>
            {audioReady && userInteracted ? 'Audio Ready' : 'Click Play to Initialize'}
          </div>
          <button
            onClick={handleTogglePlay}
            className={`px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
            }`}
          >
            {isPlaying ? '⏹ Stop' : '▶ Play Sacred Tones'}
          </button>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-900 p-2 rounded">
          🔊 Audio Context: {audioReady ? 'Active' : 'Pending'} | User Interaction: {userInteracted ? 'Complete' : 'Required'}
        </div>
      </div>
    </div>
  );
};

// Sacred Geometry Visualization Component
const SacredGeometryVisualization: React.FC<{
  pattern: string;
  scale: number;
  rotationSpeed: number;
  complexity: number;
  coherence: number;
}> = ({ pattern, scale, rotationSpeed, complexity, coherence }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      // Draw based on pattern type
      switch (pattern) {
        case 'merkaba':
          drawMerkaba(ctx, coherence, complexity);
          break;
        case 'flower_of_life':
          drawFlowerOfLife(ctx, coherence, complexity);
          break;
        case 'sri_yantra':
          drawSriYantra(ctx, coherence, complexity);
          break;
        case 'torus':
          drawTorus(ctx, coherence, complexity);
          break;
        default:
          drawMerkaba(ctx, coherence, complexity);
      }

      ctx.restore();

      if (isAnimating) {
        rotation += rotationSpeed * 0.02;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pattern, scale, rotationSpeed, complexity, coherence, isAnimating]);

  const drawMerkaba = (ctx: CanvasRenderingContext2D, coherence: number, complexity: number) => {
    const size = 80 * complexity;
    const alpha = 0.6 + coherence * 0.4;

    ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
    ctx.lineWidth = 2;

    // Upper triangle
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, size / 2);
    ctx.lineTo(-size, size / 2);
    ctx.closePath();
    ctx.stroke();

    // Lower triangle
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(size, -size / 2);
    ctx.lineTo(-size, -size / 2);
    ctx.closePath();
    ctx.stroke();

    // Center lines
    ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.5})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.stroke();
  };

  const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, coherence: number, complexity: number) => {
    const radius = 30 * complexity;
    const alpha = 0.6 + coherence * 0.4;

    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
    ctx.lineWidth = 2;

    const positions = [
      [0, 0],
      [radius * 1.5, 0],
      [radius * 0.75, radius * 1.3],
      [-radius * 0.75, radius * 1.3],
      [-radius * 1.5, 0],
      [-radius * 0.75, -radius * 1.3],
      [radius * 0.75, -radius * 1.3]
    ];

    positions.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    });
  };

  const drawSriYantra = (ctx: CanvasRenderingContext2D, coherence: number, complexity: number) => {
    const size = 60 * complexity;
    const alpha = 0.6 + coherence * 0.4;

    ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
    ctx.lineWidth = 2;

    // Central triangle
    ctx.beginPath();
    ctx.moveTo(0, -size / 2);
    ctx.lineTo(size * 0.43, size * 0.25);
    ctx.lineTo(-size * 0.43, size * 0.25);
    ctx.closePath();
    ctx.stroke();

    // Outer circles
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, size * i * 0.5, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const drawTorus = (ctx: CanvasRenderingContext2D, coherence: number, complexity: number) => {
    const radius = 60 * complexity;
    const alpha = 0.6 + coherence * 0.4;

    ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
    ctx.lineWidth = 1.5;

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.3;
      
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.3, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  return (
    <div className="sacred-geometry-visualization bg-slate-900 rounded-lg p-4 border border-purple-500/30">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-auto border border-gray-700 rounded"
      />
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-400">Pattern: {pattern.replace('_', ' ')}</span>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded"
        >
          {isAnimating ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

// Fixed Geometry Controls
export const GeometryControls: React.FC = () => {
  const psiOS = usePsiOS();
  const [dimension2D, setDimension2D] = useState(true);
  const [dimension3D, setDimension3D] = useState(false);
  const [dimension4D, setDimension4D] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [scale, setScale] = useState(1.0);
  const [complexity, setComplexity] = useState(0.7);
  const [selectedPattern, setSelectedPattern] = useState('merkaba');

  const [soundVolume, setSoundVolume] = useState(0.3);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [sacredFrequencies] = useState([432, 528, 639]);

  return (
    <div className="geometry-controls space-y-6">
      {/* Sacred Geometry Visualization */}
      <SacredGeometryVisualization
        pattern={selectedPattern}
        scale={scale}
        rotationSpeed={rotationSpeed}
        complexity={complexity}
        coherence={psiOS.zLambda}
      />

      {/* Pattern Selection */}
      <div className="bg-gray-900/50 p-6 rounded-lg border border-pink-500/30">
        <h3 className="text-xl font-semibold text-white mb-4">Sacred Pattern Selection</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['merkaba', 'flower_of_life', 'sri_yantra', 'torus'].map((pattern) => (
            <button
              key={pattern}
              onClick={() => setSelectedPattern(pattern)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                selectedPattern === pattern
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/25'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {pattern.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensional Controls */}
      <div className="bg-gray-900/50 p-6 rounded-lg border border-purple-500/30">
        <h3 className="text-xl font-semibold text-white mb-4">Dimensional Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DimensionToggle
            label="2D Rendering"
            enabled={dimension2D}
            onToggle={setDimension2D}
          />
          <DimensionToggle
            label="3D Rendering"
            enabled={dimension3D}
            onToggle={setDimension3D}
          />
          <DimensionToggle
            label="4D Projection"
            enabled={dimension4D}
            onToggle={setDimension4D}
          />
        </div>
      </div>

      {/* Geometry Parameters */}
      <div className="bg-gray-900/50 p-6 rounded-lg border border-blue-500/30">
        <h3 className="text-xl font-semibold text-white mb-4">Geometry Parameters</h3>
        <div className="space-y-4">
          <FixedSlider
            label="Rotation Speed"
            value={rotationSpeed}
            onChange={setRotationSpeed}
            min={0}
            max={2}
            step={0.01}
            unit="x"
          />
          <FixedSlider
            label="Scale Factor"
            value={scale}
            onChange={setScale}
            min={0.1}
            max={3}
            step={0.01}
            unit="x"
          />
          <FixedSlider
            label="Complexity"
            value={complexity}
            onChange={setComplexity}
            min={0.1}
            max={1.5}
            step={0.01}
          />
        </div>
      </div>

      {/* Sound System */}
      <SoundManager
        frequencies={sacredFrequencies}
        volume={soundVolume}
        isPlaying={soundPlaying}
        onVolumeChange={setSoundVolume}
        onTogglePlay={() => setSoundPlaying(!soundPlaying)}
      />

      {/* Current State */}
      <div className="bg-gray-900/50 p-4 rounded-lg border border-green-500/30">
        <h4 className="text-lg font-semibold text-white mb-2">Current State</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Coherence:</span>
            <span className="text-cyan-400 ml-2 font-mono">{psiOS.zLambda.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-gray-400">Pattern:</span>
            <span className="text-pink-400 ml-2">{selectedPattern.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-gray-400">Dimensions:</span>
            <span className="text-purple-400 ml-2">
              {[dimension2D && '2D', dimension3D && '3D', dimension4D && '4D'].filter(Boolean).join(', ') || 'None'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Audio:</span>
            <span className="text-green-400 ml-2">{soundPlaying ? 'Playing' : 'Stopped'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometryControls;