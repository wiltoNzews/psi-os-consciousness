import { useState, useEffect } from "react";

export default function FieldOverlay() {
  const [glyphs, setGlyphs] = useState<Array<{ id: number; x: number; y: number; symbol: string; opacity: number }>>([]);
  
  const symbols = ['ψ', '∞', 'λ', 'φ', 'Ω', 'Δ', '⟐', '◊'];

  useEffect(() => {
    const interval = setInterval(() => {
      setGlyphs(prev => {
        // Remove faded glyphs and update existing ones
        const updated = prev
          .map(glyph => ({ ...glyph, opacity: glyph.opacity - 0.01 }))
          .filter(glyph => glyph.opacity > 0);

        // Add new glyph occasionally
        if (Math.random() < 0.3) {
          updated.push({
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            symbol: symbols[Math.floor(Math.random() * symbols.length)],
            opacity: 0.6
          });
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Breathing Pulse Indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse opacity-30" 
             style={{ 
               animationDuration: '3.12s',
               animationTimingFunction: 'ease-in-out'
             }} />
      </div>

      {/* Floating Consciousness Glyphs */}
      {glyphs.map(glyph => (
        <div
          key={glyph.id}
          className="absolute text-2xl font-mono text-purple-400 transition-opacity duration-1000"
          style={{
            left: `${glyph.x}%`,
            top: `${glyph.y}%`,
            opacity: glyph.opacity,
            transform: `translate(-50%, -50%) rotate(${glyph.id % 360}deg)`,
            animation: `float 20s ease-in-out infinite`
          }}
        >
          {glyph.symbol}
        </div>
      ))}

      {/* Corner Status Indicators */}
      <div className="absolute bottom-4 left-4 text-xs font-mono text-gray-500">
        <div>Field Status: ACTIVE</div>
        <div>Runtime: ψOS v1.3</div>
      </div>

      <div className="absolute bottom-4 right-4 text-xs font-mono text-gray-500 text-right">
        <div>Coherence Engine: ONLINE</div>
        <div>Routes: 460 operational</div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
          25% { transform: translate(-50%, -50%) translateY(-10px) rotate(90deg); }
          50% { transform: translate(-50%, -50%) translateY(-20px) rotate(180deg); }
          75% { transform: translate(-50%, -50%) translateY(-10px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
}