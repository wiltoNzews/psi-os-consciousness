// ⟐ (Geometry) Sacred Structure Interface - Visual Consciousness Architecture
import { useState, useEffect, useRef } from 'react';

interface GeometryProps {
  onActivateGeometry: (geometryData: GeometryData, timestamp: number) => void;
  lambdaValue: number;
  soulData?: any;
  recursionData?: any;
  isActive?: boolean;
}

interface GeometryData {
  patternType: string;
  dimensions: number;
  complexity: number;
  symmetryOrder: number;
  manifestationIntent: string;
}

interface SacredPattern {
  name: string;
  description: string;
  dimensions: number;
  symbol: string;
  color: string;
  applications: string[];
}

const sacredPatterns: SacredPattern[] = [
  {
    name: 'Merkaba',
    description: 'Light-spirit-body vehicle, dual tetrahedron',
    dimensions: 3,
    symbol: '◊',
    color: 'from-blue-400 to-indigo-500',
    applications: ['consciousness travel', 'field protection', 'dimensional bridging']
  },
  {
    name: 'Flower of Life',
    description: 'Universal creation pattern, overlapping circles',
    dimensions: 2,
    symbol: '❀',
    color: 'from-green-400 to-emerald-500',
    applications: ['life force amplification', 'healing matrices', 'organic growth']
  },
  {
    name: 'Sri Yantra',
    description: 'Divine proportion manifestation, interlocked triangles',
    dimensions: 2,
    symbol: '△',
    color: 'from-yellow-400 to-orange-500',
    applications: ['abundance manifestation', 'spiritual awakening', 'cosmic harmony']
  },
  {
    name: 'Toroidal Field',
    description: 'Self-sustaining energy flow, donut topology',
    dimensions: 3,
    symbol: '◯',
    color: 'from-purple-400 to-violet-500',
    applications: ['energy circulation', 'field coherence', 'recursive dynamics']
  },
  {
    name: 'Metatron\'s Cube',
    description: 'All platonic solids container, geometric totality',
    dimensions: 3,
    symbol: '⬢',
    color: 'from-cyan-400 to-blue-500',
    applications: ['structural foundation', 'reality architecture', 'dimensional mapping']
  },
  {
    name: 'Fibonacci Spiral',
    description: 'Golden ratio manifestation, natural growth pattern',
    dimensions: 2,
    symbol: '🌀',
    color: 'from-amber-400 to-gold-500',
    applications: ['organic expansion', 'natural timing', 'harmonic resonance']
  }
];

export function Geometry({ onActivateGeometry, lambdaValue, soulData, recursionData, isActive = false }: GeometryProps) {
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [dimensions, setDimensions] = useState(2);
  const [complexity, setComplexity] = useState(5);
  const [symmetryOrder, setSymmetryOrder] = useState(6);
  const [manifestationIntent, setManifestationIntent] = useState('');
  const [isActivated, setIsActivated] = useState(isActive);
  const [geometryPhase, setGeometryPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Geometry animation - sacred pattern rotation
  useEffect(() => {
    if (isActivated) {
      const interval = setInterval(() => {
        setGeometryPhase(prev => (prev + 0.04) % (2 * Math.PI));
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isActivated]);

  // Draw sacred geometry on canvas
  useEffect(() => {
    if (canvasRef.current && selectedPattern) {
      drawSacredPattern(canvasRef.current, selectedPattern, geometryPhase);
    }
  }, [selectedPattern, geometryPhase]);

  const handleGeometryActivation = () => {
    if (!selectedPattern || !manifestationIntent.trim()) return;
    
    const timestamp = Date.now();
    const geometryData: GeometryData = {
      patternType: selectedPattern,
      dimensions: dimensions,
      complexity: complexity / 10, // Normalize to 0-1
      symmetryOrder: symmetryOrder,
      manifestationIntent: manifestationIntent
    };
    
    setIsActivated(true);
    onActivateGeometry(geometryData, timestamp);
    
    // Store in geometry registry
    localStorage.setItem('psi_os_geometry_field', JSON.stringify({
      ...geometryData,
      lambdaValue,
      soulEssence: soulData?.essence,
      recursionCycle: recursionData?.cycleType,
      timestamp,
      activated: true
    }));
  };

  const resetGeometry = () => {
    setIsActivated(false);
    setSelectedPattern('');
    setManifestationIntent('');
    setDimensions(2);
    setComplexity(5);
    setSymmetryOrder(6);
  };

  const getPatternSuggestions = () => {
    // Suggest patterns based on soul essence and recursion cycle
    const suggestions: string[] = [];
    
    if (soulData?.essence) {
      switch (soulData.essence) {
        case 'Creator':
          suggestions.push('Flower of Life', 'Fibonacci Spiral');
          break;
        case 'Seeker':
          suggestions.push('Merkaba', 'Metatron\'s Cube');
          break;
        case 'Healer':
          suggestions.push('Toroidal Field', 'Flower of Life');
          break;
        case 'Mystic':
          suggestions.push('Sri Yantra', 'Merkaba');
          break;
        case 'Builder':
          suggestions.push('Metatron\'s Cube', 'Fibonacci Spiral');
          break;
        case 'Guardian':
          suggestions.push('Toroidal Field', 'Sri Yantra');
          break;
      }
    }
    
    if (recursionData?.cycleType) {
      switch (recursionData.cycleType) {
        case 'Emotional Integration':
          suggestions.push('Toroidal Field');
          break;
        case 'Creative Evolution':
          suggestions.push('Fibonacci Spiral', 'Flower of Life');
          break;
        case 'Spiritual Transcendence':
          suggestions.push('Merkaba', 'Sri Yantra');
          break;
        case 'System Optimization':
          suggestions.push('Metatron\'s Cube');
          break;
      }
    }
    
    return [...new Set(suggestions)];
  };

  const getSelectedPatternData = () => {
    return sacredPatterns.find(pattern => pattern.name === selectedPattern);
  };

  // Sacred geometry calculations
  const geometryPulse = 0.8 + Math.sin(geometryPhase) * 0.2;
  const geometryRotation = geometryPhase * 10; // Slow rotation
  const geometryScale = isActivated ? 1 + (Math.sin(geometryPhase * 1.2) * 0.08) : 1;

  const suggestions = getPatternSuggestions();

  return (
    <div className="bg-black/40 backdrop-blur border border-amber-500/30 rounded-lg p-6 max-w-lg">
      {/* Glyph Header */}
      <div className="text-center mb-6">
        <div 
          className="text-6xl mb-2 transition-all duration-75 origin-center"
          style={{ 
            transform: `scale(${geometryScale}) rotate(${geometryRotation}deg)`,
            opacity: geometryPulse,
            filter: isActivated ? `hue-rotate(${geometryPhase * 20}deg) brightness(1.15)` : 'none'
          }}
        >
          ⟐
        </div>
        <h3 className="text-lg font-semibold text-amber-300">Sacred Geometry</h3>
        <p className="text-xs text-gray-400">Visual Consciousness Architecture</p>
      </div>

      {!isActivated ? (
        <div className="space-y-6">
          {/* Cascade Integration Display */}
          <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-600/30">
            <div className="text-xs text-gray-400 mb-2">Consciousness Cascade</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-green-400">λ: {lambdaValue.toFixed(3)}</div>
              <div className="text-cyan-400">ψ: {soulData?.essence || 'None'}</div>
              <div className="text-violet-400">∞: {recursionData?.cycleType || 'None'}</div>
            </div>
          </div>

          {/* Sacred Pattern Selection */}
          <div>
            <label className="block text-sm text-gray-300 mb-3">
              Which sacred pattern calls to you?
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {sacredPatterns.map((pattern) => {
                const isSuggested = suggestions.includes(pattern.name);
                return (
                  <button
                    key={pattern.name}
                    onClick={() => setSelectedPattern(pattern.name)}
                    className={`p-3 rounded-lg border transition-all text-left relative ${
                      selectedPattern === pattern.name
                        ? 'border-amber-400 bg-amber-900/30'
                        : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                    } ${isSuggested ? 'ring-2 ring-cyan-400/50' : ''}`}
                  >
                    {isSuggested && (
                      <div className="absolute top-1 right-1 text-xs text-cyan-400">✨</div>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{pattern.symbol}</span>
                      <span className="text-sm font-medium text-white">{pattern.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{pattern.description}</div>
                    <div className="text-xs text-gray-500">
                      {pattern.dimensions}D • {pattern.applications.slice(0, 2).join(', ')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sacred Pattern Visualization */}
          {selectedPattern && (
            <div className="text-center">
              <canvas 
                ref={canvasRef}
                width={200}
                height={200}
                className="border border-gray-600 rounded-lg bg-black/30"
              />
              <div className="text-xs text-gray-400 mt-2">
                {getSelectedPatternData()?.name} Preview
              </div>
            </div>
          )}

          {/* Geometry Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-300 mb-2">
                Dimensions: {dimensions}D
              </label>
              <input
                type="range"
                min="2"
                max="4"
                value={dimensions}
                onChange={(e) => setDimensions(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-300 mb-2">
                Complexity: {complexity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={complexity}
                onChange={(e) => setComplexity(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-xs text-gray-300 mb-2">
                Symmetry Order: {symmetryOrder}
              </label>
              <input
                type="range"
                min="3"
                max="12"
                value={symmetryOrder}
                onChange={(e) => setSymmetryOrder(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Manifestation Intent */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              What do you want to manifest through this geometry?
            </label>
            <textarea
              value={manifestationIntent}
              onChange={(e) => setManifestationIntent(e.target.value)}
              placeholder="Describe your manifestation intention..."
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none text-sm h-20 resize-none"
              rows={3}
            />
          </div>

          {/* Activation Button */}
          <button
            onClick={handleGeometryActivation}
            disabled={!selectedPattern || !manifestationIntent.trim()}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Activate Sacred Geometry
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-amber-400 font-medium">⟐ Geometry Active</div>
          
          <div className="space-y-3 text-sm">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-gray-400">Pattern:</div>
              <div className="text-white font-medium flex items-center gap-2">
                <span>{getSelectedPatternData()?.symbol}</span>
                <span>{selectedPattern}</span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-gray-400">Configuration:</div>
              <div className="text-white text-sm">
                {dimensions}D • Complexity {complexity}/10 • {symmetryOrder}-fold symmetry
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="text-gray-400">Manifestation Intent:</div>
              <div className="text-white text-sm">{manifestationIntent}</div>
            </div>
          </div>

          {/* Active Pattern Visualization */}
          <div className="my-4">
            <canvas 
              ref={canvasRef}
              width={150}
              height={150}
              className="border border-amber-400 rounded-lg bg-black/30"
            />
          </div>

          <div className="text-xs text-gray-400">
            <div>Sacred geometry field established</div>
            <div>Visual consciousness architecture active</div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {/* TODO: Implement geometry refinement */}}
              className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
            >
              Refine Pattern
            </button>
            <button
              onClick={resetGeometry}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
            >
              New Pattern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sacred geometry drawing function
function drawSacredPattern(canvas: HTMLCanvasElement, patternName: string, phase: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#fbbf24';
  ctx.fillStyle = '#fbbf2420';
  ctx.lineWidth = 2;
  
  switch (patternName) {
    case 'Merkaba':
      drawMerkaba(ctx, centerX, centerY, radius, phase);
      break;
    case 'Flower of Life':
      drawFlowerOfLife(ctx, centerX, centerY, radius, phase);
      break;
    case 'Sri Yantra':
      drawSriYantra(ctx, centerX, centerY, radius, phase);
      break;
    case 'Toroidal Field':
      drawToroidal(ctx, centerX, centerY, radius, phase);
      break;
    case 'Metatron\'s Cube':
      drawMetatronsCube(ctx, centerX, centerY, radius, phase);
      break;
    case 'Fibonacci Spiral':
      drawFibonacciSpiral(ctx, centerX, centerY, radius, phase);
      break;
  }
}

function drawMerkaba(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, phase: number) {
  const rotation = phase;
  
  // Upper tetrahedron
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  
  // Lower tetrahedron (inverted)
  ctx.rotate(Math.PI);
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawFlowerOfLife(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, phase: number) {
  const circles = 7;
  const circleRadius = r / 3;
  
  // Center circle
  ctx.beginPath();
  ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
  ctx.stroke();
  
  // Surrounding circles
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + phase;
    const px = x + Math.cos(angle) * circleRadius;
    const py = y + Math.sin(angle) * circleRadius;
    ctx.beginPath();
    ctx.arc(px, py, circleRadius, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

function drawSriYantra(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, phase: number) {
  const rotation = phase;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  // Draw interlocking triangles
  for (let i = 0; i < 9; i++) {
    const size = r * (0.3 + (i * 0.08));
    const upward = i % 2 === 0;
    
    ctx.beginPath();
    for (let j = 0; j < 3; j++) {
      const angle = (j * 2 * Math.PI) / 3 + (upward ? 0 : Math.PI);
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size;
      if (j === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawToroidal(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, phase: number) {
  const rings = 8;
  
  for (let i = 0; i < rings; i++) {
    const ringRadius = r * (0.2 + (i * 0.1));
    const alpha = 1 - (i / rings);
    ctx.globalAlpha = alpha;
    
    ctx.beginPath();
    ctx.arc(x, y, ringRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Flow lines
    for (let j = 0; j < 6; j++) {
      const angle = (j * Math.PI) / 3 + phase;
      const startR = ringRadius * 0.8;
      const endR = ringRadius * 1.2;
      
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * startR, y + Math.sin(angle) * startR);
      ctx.lineTo(x + Math.cos(angle) * endR, y + Math.sin(angle) * endR);
      ctx.stroke();
    }
  }
  
  ctx.globalAlpha = 1;
}

function drawMetatronsCube(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, phase: number) {
  const vertices = 13;
  const points: [number, number][] = [];
  
  // Central point
  points.push([x, y]);
  
  // Surrounding points
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6 + phase;
    const radius = i < 6 ? r * 0.5 : r * 0.8;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    points.push([px, py]);
  }
  
  // Draw all connections
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      ctx.beginPath();
      ctx.moveTo(points[i][0], points[i][1]);
      ctx.lineTo(points[j][0], points[j][1]);
      ctx.globalAlpha = 0.3;
      ctx.stroke();
    }
  }
  
  ctx.globalAlpha = 1;
  
  // Draw vertices
  points.forEach(([px, py]) => {
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function drawFibonacciSpiral(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, phase: number) {
  const segments = 20;
  const goldenRatio = 1.618033988749;
  
  ctx.beginPath();
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * 4 * Math.PI + phase;
    const radius = r * t / goldenRatio;
    
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  
  ctx.stroke();
  
  // Golden ratio rectangles
  let size = r / 8;
  for (let i = 0; i < 6; i++) {
    const rotation = (i * Math.PI) / 2 + phase;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeRect(-size / 2, -size / 2, size, size * goldenRatio);
    ctx.restore();
    size *= goldenRatio;
  }
}