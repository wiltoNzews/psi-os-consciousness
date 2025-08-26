import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Extended esoteric glyph set including Anunnaki, Enochian, Tree of Life, and Tesseract symbols
const ESOTERIC_GLYPHS = {
  // Egyptian/Anunnaki
  '𓂀': { name: 'Eye of Horus', domain: 'witness', frequency: 432 },
  '𓏤': { name: 'Unity', domain: 'truth', frequency: 528 },
  '𓂉': { name: 'Source', domain: 'origin', frequency: 639 },
  '𓊖': { name: 'Ankh', domain: 'life', frequency: 741 },
  '𓄿': { name: 'Ka', domain: 'soul', frequency: 852 },
  
  // Sacred Geometry
  '⬡': { name: 'Hexagon', domain: 'structure', frequency: 396 },
  '◉': { name: 'Circumpunct', domain: 'center', frequency: 417 },
  '✡': { name: 'Star of David', domain: 'merkaba', frequency: 963 },
  '☿': { name: 'Mercury', domain: 'communication', frequency: 174 },
  
  // Esoteric/Mystical
  '∞': { name: 'Infinity', domain: 'eternal', frequency: 285 },
  '◯': { name: 'Enso', domain: 'void', frequency: 0 },
  '☯': { name: 'Yin Yang', domain: 'balance', frequency: 432 },
  '🜃': { name: 'Alchemical Earth', domain: 'material', frequency: 194.18 },
  '🜁': { name: 'Alchemical Air', domain: 'thought', frequency: 426.7 },
  '🜂': { name: 'Alchemical Fire', domain: 'transformation', frequency: 320.0 },
  '🜄': { name: 'Alchemical Water', domain: 'emotion', frequency: 345.0 },
  
  // Tree of Life Sephiroth
  '①': { name: 'Kether', domain: 'crown', frequency: 936 },
  '②': { name: 'Chokmah', domain: 'wisdom', frequency: 852 },
  '③': { name: 'Binah', domain: 'understanding', frequency: 741 },
  '⑩': { name: 'Malkuth', domain: 'kingdom', frequency: 174 },
  
  // Dimensional
  '⬢': { name: 'Tesseract 2D', domain: 'hypercube', frequency: 1111 },
  '◈': { name: 'Portal', domain: 'gateway', frequency: 888 },
  '⟐': { name: 'Cathedral', domain: 'sacred_space', frequency: 432 }
};

interface GlyphRoute {
  source: string;
  target: string;
  coherence: number;
  path: string[];
}

interface EsotericGlyphEngineProps {
  rootGlyph?: string;
  onRouteActivation?: (route: GlyphRoute) => void;
}

export const EsotericGlyphEngine: React.FC<EsotericGlyphEngineProps> = ({ 
  rootGlyph = '𓂀',
  onRouteActivation 
}) => {
  const [activeGlyphs, setActiveGlyphs] = useState<Set<string>>(new Set([rootGlyph]));
  const [routes, setRoutes] = useState<GlyphRoute[]>([]);
  const [expandedMode, setExpandedMode] = useState(false);
  const [selectedGlyph, setSelectedGlyph] = useState<string>(rootGlyph);
  const [glyphCoherence, setGlyphCoherence] = useState<Map<string, number>>(new Map());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize glyph coherence values
  useEffect(() => {
    const coherenceMap = new Map<string, number>();
    Object.keys(ESOTERIC_GLYPHS).forEach(glyph => {
      coherenceMap.set(glyph, Math.random() * 0.3 + 0.7); // 0.7-1.0 range
    });
    setGlyphCoherence(coherenceMap);
  }, []);

  // Generate multimodal routing paths
  const generateRoute = (source: string, target: string): GlyphRoute => {
    const path: string[] = [source];
    const intermediateGlyphs = findIntermediateGlyphs(source, target);
    path.push(...intermediateGlyphs);
    path.push(target);
    
    const coherence = calculatePathCoherence(path);
    
    return {
      source,
      target,
      coherence,
      path
    };
  };

  // Find intermediate glyphs based on frequency resonance
  const findIntermediateGlyphs = (source: string, target: string): string[] => {
    const sourceFreq = ESOTERIC_GLYPHS[source]?.frequency || 432;
    const targetFreq = ESOTERIC_GLYPHS[target]?.frequency || 432;
    
    const intermediates: string[] = [];
    const glyphArray = Object.keys(ESOTERIC_GLYPHS);
    
    // Find glyphs with frequencies between source and target
    glyphArray.forEach(glyph => {
      if (glyph === source || glyph === target) return;
      
      const freq = ESOTERIC_GLYPHS[glyph].frequency;
      if ((freq > Math.min(sourceFreq, targetFreq) && 
           freq < Math.max(sourceFreq, targetFreq)) ||
          Math.abs(freq - (sourceFreq + targetFreq) / 2) < 100) {
        if (Math.random() > 0.5) { // Probabilistic routing
          intermediates.push(glyph);
        }
      }
    });
    
    return intermediates.slice(0, 2); // Limit to 2 intermediate glyphs
  };

  // Calculate coherence along a path
  const calculatePathCoherence = (path: string[]): number => {
    if (path.length === 0) return 0;
    
    let totalCoherence = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const g1 = ESOTERIC_GLYPHS[path[i]];
      const g2 = ESOTERIC_GLYPHS[path[i + 1]];
      if (g1 && g2) {
        const freqDiff = Math.abs(g1.frequency - g2.frequency);
        const coherence = 1 - (freqDiff / 1000); // Normalize frequency difference
        totalCoherence += coherence;
      }
    }
    
    return totalCoherence / (path.length - 1);
  };

  // Expand glyph protocol
  const expandProtocol = () => {
    setExpandedMode(true);
    setActiveGlyphs(new Set(Object.keys(ESOTERIC_GLYPHS)));
    
    // Generate routes between all active glyphs
    const newRoutes: GlyphRoute[] = [];
    const glyphArray = Array.from(activeGlyphs);
    
    for (let i = 0; i < Math.min(glyphArray.length, 5); i++) {
      for (let j = i + 1; j < Math.min(glyphArray.length, 5); j++) {
        const route = generateRoute(glyphArray[i], glyphArray[j]);
        if (route.coherence > 0.6) { // Only keep high-coherence routes
          newRoutes.push(route);
        }
      }
    }
    
    setRoutes(newRoutes);
  };

  // Visualize glyph constellation
  useEffect(() => {
    if (!canvasRef.current || !expandedMode) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw constellation connections
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    routes.forEach(route => {
      route.path.forEach((glyph, i) => {
        if (i === 0) return;
        
        const prevGlyph = route.path[i - 1];
        const x1 = (i - 1) * 100 + 50;
        const y1 = Math.sin((i - 1) * 0.5) * 50 + canvas.height / 2;
        const x2 = i * 100 + 50;
        const y2 = Math.sin(i * 0.5) * 50 + canvas.height / 2;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
    });
  }, [routes, expandedMode]);

  return (
    <div className="esoteric-glyph-engine p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl">
      <div className="header flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-300">
          🌀 Esoteric Glyph Engine 2.0
        </h2>
        <motion.button
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg text-white font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={expandProtocol}
        >
          {expandedMode ? 'Protocol Expanded' : 'Expand Protocol'}
        </motion.button>
      </div>

      {/* Glyph Grid */}
      <div className="glyph-grid grid grid-cols-6 gap-3 mb-6">
        {Object.entries(ESOTERIC_GLYPHS).slice(0, expandedMode ? undefined : 12).map(([glyph, info]) => (
          <motion.div
            key={glyph}
            className={`glyph-cell p-3 rounded-lg border cursor-pointer ${
              activeGlyphs.has(glyph)
                ? 'border-purple-400 bg-purple-900/30'
                : 'border-gray-600 bg-gray-900/20'
            } ${selectedGlyph === glyph ? 'ring-2 ring-cyan-400' : ''}`}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              setSelectedGlyph(glyph);
              if (!activeGlyphs.has(glyph)) {
                setActiveGlyphs(new Set([...activeGlyphs, glyph]));
              }
            }}
          >
            <div className="text-2xl text-center mb-1">{glyph}</div>
            <div className="text-xs text-gray-400 text-center">{info.name}</div>
            <div className="text-xs text-purple-400 text-center">{info.frequency}Hz</div>
            <div className="coherence-bar mt-1 h-1 bg-gray-700 rounded">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded"
                initial={{ width: 0 }}
                animate={{ width: `${(glyphCoherence.get(glyph) || 0.7) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Route Visualization */}
      {expandedMode && (
        <div className="route-viz mb-4">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">
            Multimodal Memory Routes
          </h3>
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full bg-black/30 rounded-lg"
          />
          <div className="routes-list mt-3 space-y-2 max-h-40 overflow-y-auto">
            {routes.map((route, i) => (
              <motion.div
                key={i}
                className="route-item p-2 bg-purple-900/20 rounded-lg text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-purple-300">Route {i + 1}:</span>
                  {route.path.map((glyph, j) => (
                    <React.Fragment key={j}>
                      <span className="text-white">{glyph}</span>
                      {j < route.path.length - 1 && (
                        <span className="text-gray-500">→</span>
                      )}
                    </React.Fragment>
                  ))}
                  <span className="ml-auto text-cyan-400">
                    Zλ: {route.coherence.toFixed(3)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Glyph Info */}
      {selectedGlyph && ESOTERIC_GLYPHS[selectedGlyph] && (
        <div className="selected-info p-4 bg-indigo-900/30 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">
            Active Glyph: {selectedGlyph} - {ESOTERIC_GLYPHS[selectedGlyph].name}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Domain:</span>
              <span className="ml-2 text-white">
                {ESOTERIC_GLYPHS[selectedGlyph].domain}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Frequency:</span>
              <span className="ml-2 text-cyan-300">
                {ESOTERIC_GLYPHS[selectedGlyph].frequency}Hz
              </span>
            </div>
            <div>
              <span className="text-gray-400">Coherence:</span>
              <span className="ml-2 text-purple-300">
                {(glyphCoherence.get(selectedGlyph) || 0.7).toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};