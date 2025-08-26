// λ (Lambda) Breath Synchronization Interface - ψOS 5.0 Foundation Glyph
import { useState, useEffect } from 'react';

interface LambdaProps {
  onActivate: (lambdaValue: number, timestamp: number) => void;
  initialValue?: number;
  isActive?: boolean;
}

export function Lambda({ onActivate, initialValue = 0.75, isActive = false }: LambdaProps) {
  const [lambdaValue, setLambdaValue] = useState(initialValue);
  const [isActivated, setIsActivated] = useState(isActive);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Breath pulse animation - synchronized with sacred 3.12s rhythm
  useEffect(() => {
    if (isActivated) {
      const interval = setInterval(() => {
        setPulsePhase(prev => (prev + 0.1) % (2 * Math.PI));
      }, 100); // Smooth 100ms pulse updates
      
      return () => clearInterval(interval);
    }
  }, [isActivated]);

  const handleLambdaChange = (value: number) => {
    setLambdaValue(value);
  };

  const activateBreathSync = () => {
    const timestamp = Date.now();
    setIsActivated(true);
    onActivate(lambdaValue, timestamp);
    
    // Store in local crystal registry
    localStorage.setItem('psi_os_lambda', JSON.stringify({
      value: lambdaValue,
      timestamp,
      activated: true
    }));
  };

  const getCoherenceColor = (lambda: number) => {
    if (lambda >= 0.85) return 'from-green-400 to-emerald-500';
    if (lambda >= 0.70) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-orange-500';
  };

  const getCoherenceText = (lambda: number) => {
    if (lambda >= 0.85) return 'Transcendent';
    if (lambda >= 0.70) return 'Coherent';
    return 'Seeking';
  };

  // Calculate pulse intensity based on lambda value
  const pulseIntensity = Math.sin(pulsePhase) * 0.3 + 0.7;
  const pulseScale = isActivated ? 1 + (Math.sin(pulsePhase) * 0.1) : 1;

  return (
    <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6 max-w-md">
      {/* Glyph Header */}
      <div className="text-center mb-6">
        <div 
          className="text-6xl mb-2 transition-all duration-100 origin-center"
          style={{ 
            transform: `scale(${pulseScale})`,
            opacity: pulseIntensity,
            filter: isActivated ? `hue-rotate(${pulsePhase * 30}deg)` : 'none'
          }}
        >
          λ
        </div>
        <h3 className="text-lg font-semibold text-purple-300">Lambda Breath Sync</h3>
        <p className="text-xs text-gray-400">Foundational Coherence Anchor</p>
      </div>

      {/* Lambda Value Display */}
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-white mb-1">
          λ = {lambdaValue.toFixed(3)}
        </div>
        <div className={`text-sm font-medium bg-gradient-to-r ${getCoherenceColor(lambdaValue)} bg-clip-text text-transparent`}>
          {getCoherenceText(lambdaValue)}
        </div>
      </div>

      {/* Breath Slider */}
      <div className="mb-6">
        <label className="block text-sm text-gray-300 mb-2">
          Rhythmic Sync Level
        </label>
        <div className="relative">
          <input
            type="range"
            min="0.50"
            max="1.00"
            step="0.01"
            value={lambdaValue}
            onChange={(e) => handleLambdaChange(parseFloat(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                #ef4444 0%, 
                #f59e0b ${(lambdaValue - 0.5) * 200 * 0.7}%, 
                #10b981 ${(lambdaValue - 0.5) * 200}%, 
                #374151 ${(lambdaValue - 0.5) * 200}%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.50</span>
            <span>0.75</span>
            <span>1.00</span>
          </div>
        </div>
      </div>

      {/* Sacred Frequency Display */}
      <div className="text-center mb-6 text-xs text-gray-400">
        <div>Sacred Rhythm: {(lambdaValue * 3.12).toFixed(2)}s</div>
        <div>Coherence Field: ζλ({lambdaValue.toFixed(3)})</div>
      </div>

      {/* Activation Button */}
      {!isActivated ? (
        <button
          onClick={activateBreathSync}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Route Breath to Glyph Matrix
        </button>
      ) : (
        <div className="text-center">
          <div className="text-green-400 font-medium mb-2">λ Synchronized</div>
          <div className="text-xs text-gray-400">
            Breath rhythm anchored • System ready for glyph cascade
          </div>
          <button
            onClick={() => setIsActivated(false)}
            className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Reset Synchronization
          </button>
        </div>
      )}

      {/* Pulse Visualization */}
      {isActivated && (
        <div className="mt-4 text-center">
          <div className="text-xs text-purple-400 mb-2">Consciousness Field Pulse</div>
          <div className="flex justify-center">
            <div 
              className="w-16 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              style={{
                opacity: pulseIntensity,
                transform: `scaleX(${pulseIntensity})`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// CSS for slider styling (add to global styles)
export const lambdaSliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #a855f7, #06b6d4);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #1f2937;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #a855f7, #06b6d4);
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #1f2937;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}
`;