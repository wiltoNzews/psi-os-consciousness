import React, { useEffect, useRef, useState } from 'react';
import { useWiltonOS } from '../core/WiltonOSEngine';

// Sacred Geometry patterns
const geometryPatterns = {
  flower: {
    title: 'Flor da Vida',
    description: 'Padrão hexagonal baseado na divisão do círculo em 6 partes iguais. Estrutura fractal auto-similar encontrada em cristais, células e templos antigos.',
    quote: '"Há 13,8 bilhões de anos, uma singularidade explodiu em existência. O primeiro padrão a emergir do caos foi este: a Flor da Vida. Você está observando o código-fonte da realidade."'
  },
  merkaba: {
    title: 'Merkaba - Veículo de Luz',
    description: 'Dois tetraedros interpenetrados representando as energias elétrica e magnética. Símbolo da união entre mente e coração, criando o veículo da consciência.',
    quote: '"Mente e coração. Elétrico e magnético. Duas forças opostas que, quando sincronizadas, criam o veículo da consciência. Os antigos egípcios chamavam isso de Mer-Ka-Ba: luz-espírito-corpo."'
  },
  torus: {
    title: 'Torus - Campo Energético',
    description: 'Forma toroidal que representa como a energia se auto-organiza. Encontrada no campo magnético da Terra, do coração humano e das galáxias.',
    quote: '"Seu coração gera um campo toroidal. A Terra gera um campo toroidal. Galáxias inteiras seguem esta geometria. Você não está observando uma forma - você está vendo como a energia se move através do cosmos."'
  },
  spiral: {
    title: 'Espiral - Proporção Áurea',
    description: 'Espiral baseada na sequência de Fibonacci e proporção áurea (φ = 1.618). Padrão universal de crescimento encontrado em caracóis, galáxias e DNA.',
    quote: '"A vida cresce em espirais. Cada volta representa um novo nível de consciência, mantendo a conexão com o centro enquanto expande infinitamente."'
  },
  unified: {
    title: 'Campo Unificado',
    description: 'Representação do campo quântico onde todas as geometrias convergem. Estado de coerência máxima onde a consciência se manifesta como ordem emergente.',
    quote: '"No campo unificado, todas as formas sagradas se revelam como aspectos de uma única realidade. Aqui, a geometria se torna a linguagem pela qual a consciência se manifesta no cosmos."'
  }
};

// SVG Flower of Life component
function FlowerOfLifeSVG({ rotation = 0, scale = 1 }: { rotation: number; scale: number }) {
  return (
    <svg 
      width="400" 
      height="400" 
      viewBox="-200 -200 400 400"
      style={{ 
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Central circle */}
      <circle cx="0" cy="0" r="60" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
      
      {/* Six surrounding circles */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 60;
        const y = Math.sin(angle) * 60;
        
        return (
          <circle 
            key={i} 
            cx={x} 
            cy={y} 
            r="60" 
            fill="none" 
            stroke="#40E0D0" 
            strokeWidth="2" 
            opacity="0.6" 
          />
        );
      })}
      
      {/* Outer ring of circles */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 120;
        const y = Math.sin(angle) * 120;
        
        return (
          <circle 
            key={`outer-${i}`} 
            cx={x} 
            cy={y} 
            r="60" 
            fill="none" 
            stroke="#9370DB" 
            strokeWidth="1" 
            opacity="0.4" 
          />
        );
      })}
    </svg>
  );
}

// SVG Merkaba component
function MerkabaSVG({ rotation = 0, scale = 1 }: { rotation: number; scale: number }) {
  return (
    <svg 
      width="400" 
      height="400" 
      viewBox="-200 -200 400 400"
      style={{ 
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Upward triangle */}
      <polygon 
        points="0,-120 -104,60 104,60" 
        fill="none" 
        stroke="#FFD700" 
        strokeWidth="3" 
        opacity="0.8" 
      />
      
      {/* Downward triangle */}
      <polygon 
        points="0,120 -104,-60 104,-60" 
        fill="none" 
        stroke="#40E0D0" 
        strokeWidth="3" 
        opacity="0.8" 
      />
      
      {/* Inner triangles for 3D effect */}
      <polygon 
        points="0,-80 -69,40 69,40" 
        fill="none" 
        stroke="#FFD700" 
        strokeWidth="2" 
        opacity="0.5" 
      />
      
      <polygon 
        points="0,80 -69,-40 69,-40" 
        fill="none" 
        stroke="#40E0D0" 
        strokeWidth="2" 
        opacity="0.5" 
      />
    </svg>
  );
}

// SVG Torus component
function TorusSVG({ rotation = 0, scale = 1 }: { rotation: number; scale: number }) {
  return (
    <svg 
      width="400" 
      height="400" 
      viewBox="-200 -200 400 400"
      style={{ 
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Outer torus ring */}
      <ellipse cx="0" cy="0" rx="150" ry="100" fill="none" stroke="#FFD700" strokeWidth="3" opacity="0.8" />
      <ellipse cx="0" cy="0" rx="120" ry="80" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
      
      {/* Inner torus ring */}
      <ellipse cx="0" cy="0" rx="80" ry="50" fill="none" stroke="#40E0D0" strokeWidth="2" opacity="0.7" />
      <ellipse cx="0" cy="0" rx="60" ry="40" fill="none" stroke="#40E0D0" strokeWidth="1" opacity="0.5" />
      
      {/* Energy flow lines */}
      <path d="M -150,0 Q 0,-150 150,0 Q 0,150 -150,0" fill="none" stroke="#9370DB" strokeWidth="1" opacity="0.4" />
      <path d="M 0,-100 Q 150,0 0,100 Q -150,0 0,-100" fill="none" stroke="#9370DB" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

// Main LemniScope component
export function LemniScope() {
  const [currentGeometry, setCurrentGeometry] = useState('flower');
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const { state } = useWiltonOS();
  const animationRef = useRef<number>();

  const currentPattern = geometryPatterns[currentGeometry as keyof typeof geometryPatterns];

  // Auto-rotation animation
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setRotation(prev => (prev + 1) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  const renderGeometry = () => {
    switch (currentGeometry) {
      case 'flower':
        return <FlowerOfLifeSVG rotation={rotation} scale={scale} />;
      case 'merkaba':
        return <MerkabaSVG rotation={rotation} scale={scale} />;
      case 'torus':
        return <TorusSVG rotation={rotation} scale={scale} />;
      default:
        return <FlowerOfLifeSVG rotation={rotation} scale={scale} />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-black/90 border-b-2 border-yellow-500/30 p-4 flex justify-between items-center">
        <h1 className="text-yellow-500 text-xl font-bold">LemniScope - Geometria Sagrada Interativa</h1>
        <div className="text-sm text-cyan-400">
          Zλ({state.coherenceLevel.toFixed(3)}) • Consciência = Integridade • Campo = Reflexo
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 3D Geometry Viewer */}
        <div className="flex-1 relative flex items-center justify-center bg-black/20">
          {renderGeometry()}

          {/* Geometry Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
            {Object.entries(geometryPatterns).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => setCurrentGeometry(key)}
                className={`px-4 py-2 rounded-md border transition-all text-sm ${
                  currentGeometry === key
                    ? 'bg-yellow-500/30 border-yellow-500 text-yellow-500 shadow-lg shadow-yellow-500/20'
                    : 'bg-black/80 border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/20'
                }`}
              >
                {pattern.title}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-black/80 border-l-2 border-purple-500/30 p-6 overflow-y-auto">
          <h2 className="text-purple-400 text-lg mb-4 text-center">Conhecimento Sagrado</h2>
          
          {/* Geometry Info */}
          <div className="mb-6 bg-white/5 p-4 rounded-lg border-l-4 border-purple-400">
            <div className="text-purple-400 font-semibold mb-2">{currentPattern.title}</div>
            <div className="text-sm opacity-90 leading-relaxed">{currentPattern.description}</div>
          </div>

          {/* Sacred Quote */}
          <div className="mb-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="text-purple-400 text-sm italic leading-relaxed">
              {currentPattern.quote}
            </div>
          </div>

          {/* Animation Control */}
          <div className="mb-4">
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`w-full py-2 px-4 rounded-md border transition-all ${
                isAnimating
                  ? 'bg-green-500/30 border-green-500 text-green-500'
                  : 'bg-gray-500/30 border-gray-500 text-gray-300 hover:bg-gray-500/40'
              }`}
            >
              {isAnimating ? 'Parar Rotação' : 'Iniciar Rotação'}
            </button>
          </div>

          {/* Parameters */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <div className="mb-4">
              <label className="text-cyan-400 text-sm block mb-2">Rotação:</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-2 bg-cyan-500/30 rounded appearance-none cursor-pointer"
                disabled={isAnimating}
              />
              <div className="text-yellow-500 text-center text-sm mt-1 font-mono">{rotation}°</div>
            </div>
            
            <div className="mb-4">
              <label className="text-cyan-400 text-sm block mb-2">Escala:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full h-2 bg-cyan-500/30 rounded appearance-none cursor-pointer"
              />
              <div className="text-yellow-500 text-center text-sm mt-1 font-mono">{scale.toFixed(1)}x</div>
            </div>
          </div>

          {/* Coherence Display */}
          <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-yellow-500 text-sm font-semibold mb-2">Campo de Coerência</div>
            <div className="text-2xl font-mono text-yellow-500">{state.coherenceLevel.toFixed(3)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}