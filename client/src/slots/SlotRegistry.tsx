import React from 'react';
import { glyphEngine } from '@/core/glyph-engine';

// Unified slot components
interface SlotProps {
  data: any;
  coherence: number;
  glyph: string;
  onClose: () => void;
}

// Sacred Geometry Slot
export const SacredSlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => {
  const [viewMode, setViewMode] = React.useState<'live' | 'ai'>('live');
  const [aiResult, setAiResult] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-sacred-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patternType: data.pattern || 'merkaba',
          description: data.context?.intent?.primary || 'sacred geometry'
        })
      });
      const result = await response.json();
      if (result.success) {
        setAiResult(result.imageUrl);
        setViewMode('ai');
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="sacred-slot bg-purple-900/20 p-6 rounded-lg border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{glyph}</span>
          <h3 className="text-purple-300 font-semibold">Sacred Geometry</h3>
          <span className="text-xs bg-purple-600/30 px-2 py-1 rounded">Zλ({coherence.toFixed(3)})</span>
        </div>
        <button onClick={onClose} className="text-purple-300 hover:text-purple-100">×</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setViewMode('live')}
          className={`px-3 py-1 rounded text-sm ${viewMode === 'live' ? 'bg-purple-600' : 'bg-purple-800/50'}`}
        >
          Live Render
        </button>
        <button 
          onClick={() => setViewMode('ai')}
          className={`px-3 py-1 rounded text-sm ${viewMode === 'ai' ? 'bg-purple-600' : 'bg-purple-800/50'}`}
        >
          AI Generate
        </button>
      </div>

      {viewMode === 'live' ? (
        <SacredGeometryCanvas pattern={data.pattern} coherence={coherence} />
      ) : (
        <div className="space-y-4">
          <button 
            onClick={generateAI} 
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            {isGenerating ? 'Generating...' : 'Generate AI Pattern'}
          </button>
          {aiResult && <img src={aiResult} alt="AI Sacred Geometry" className="w-full rounded" />}
        </div>
      )}
    </div>
  );
};

// Lightning Energy Slot
export const LightningSlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => (
  <div className="lightning-slot bg-yellow-900/20 p-6 rounded-lg border border-yellow-500/30">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{glyph}</span>
        <h3 className="text-yellow-300 font-semibold">Lightning Energy</h3>
      </div>
      <button onClick={onClose} className="text-yellow-300 hover:text-yellow-100">×</button>
    </div>
    <LightningCanvas coherence={coherence} />
  </div>
);

// Memory Consciousness Slot
export const MemorySlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => (
  <div className="memory-slot bg-blue-900/20 p-6 rounded-lg border border-blue-500/30">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{glyph}</span>
        <h3 className="text-blue-300 font-semibold">Memory Consciousness</h3>
      </div>
      <button onClick={onClose} className="text-blue-300 hover:text-blue-100">×</button>
    </div>
    <MemoryInterface data={data} coherence={coherence} />
  </div>
);

// Legal Z-Law Slot
export const LegalSlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => (
  <div className="legal-slot bg-green-900/20 p-6 rounded-lg border border-green-500/30">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{glyph}</span>
        <h3 className="text-green-300 font-semibold">Z-Law Interface</h3>
      </div>
      <button onClick={onClose} className="text-green-300 hover:text-green-100">×</button>
    </div>
    <ZLawInterface data={data} coherence={coherence} />
  </div>
);

// MetaVoid Infinite Slot
export const MetaVoidSlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => (
  <div className="metavoid-slot bg-gray-900/20 p-6 rounded-lg border border-gray-500/30">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{glyph}</span>
        <h3 className="text-gray-300 font-semibold">MetaVoid Recursion</h3>
      </div>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-100">×</button>
    </div>
    <MetaVoidCanvas coherence={coherence} recursion={data.recursion} />
  </div>
);

// Holodeck VR Slot
export const HolodeckSlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => (
  <div className="holodeck-slot bg-red-900/20 p-6 rounded-lg border border-red-500/30">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{glyph}</span>
        <h3 className="text-red-300 font-semibold">VR Holodeck</h3>
      </div>
      <button onClick={onClose} className="text-red-300 hover:text-red-100">×</button>
    </div>
    <HolodeckCanvas environment={data.environment} coherence={coherence} />
  </div>
);

// Mirror Quantum Slot
export const MirrorSlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => (
  <div className="mirror-slot bg-cyan-900/20 p-6 rounded-lg border border-cyan-500/30">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{glyph}</span>
        <h3 className="text-cyan-300 font-semibold">Quantum Mirror</h3>
      </div>
      <button onClick={onClose} className="text-cyan-300 hover:text-cyan-100">×</button>
    </div>
    <MirrorCanvas transmission={data.transmission} coherence={coherence} />
  </div>
);

// Library Alexandria Slot
export const LibrarySlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => (
  <div className="library-slot bg-amber-900/20 p-6 rounded-lg border border-amber-500/30">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{glyph}</span>
        <h3 className="text-amber-300 font-semibold">Library of Alexandria</h3>
      </div>
      <button onClick={onClose} className="text-amber-300 hover:text-amber-100">×</button>
    </div>
    <LibraryInterface query={data.mode} coherence={coherence} />
  </div>
);

// Story Creative Slot
export const StorySlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => (
  <div className="story-slot bg-pink-900/20 p-6 rounded-lg border border-pink-500/30">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{glyph}</span>
        <h3 className="text-pink-300 font-semibold">Story Generator</h3>
      </div>
      <button onClick={onClose} className="text-pink-300 hover:text-pink-100">×</button>
    </div>
    <StoryInterface mode={data.mode} coherence={coherence} />
  </div>
);

// Creative Art Slot
export const CreativeSlot: React.FC<SlotProps> = ({ data, coherence, glyph, onClose }) => (
  <div className="creative-slot bg-indigo-900/20 p-6 rounded-lg border border-indigo-500/30">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{glyph}</span>
        <h3 className="text-indigo-300 font-semibold">Creative Generator</h3>
      </div>
      <button onClick={onClose} className="text-indigo-300 hover:text-indigo-100">×</button>
    </div>
    <CreativeInterface mode={data.mode} coherence={coherence} />
  </div>
);

// Canvas implementations
const SacredGeometryCanvas: React.FC<{ pattern: string; coherence: number }> = ({ pattern, coherence }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const time = Date.now() * 0.001;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Coherence-based styling
      ctx.shadowBlur = coherence * 20;
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(147, 51, 234, ${coherence})`;
      ctx.shadowColor = '#9333ea';
      
      // Pattern rendering
      switch (pattern) {
        case 'merkaba':
          renderMerkaba(ctx, centerX, centerY, 80, time, coherence);
          break;
        case 'torus':
          renderTorus(ctx, centerX, centerY, 80, time, coherence);
          break;
        default:
          renderMerkaba(ctx, centerX, centerY, 80, time, coherence);
      }
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [pattern, coherence]);

  return <canvas ref={canvasRef} width={400} height={300} className="w-full rounded" />;
};

const LightningCanvas: React.FC<{ coherence: number }> = ({ coherence }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const time = Date.now() * 0.003;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Lightning effect
      ctx.strokeStyle = `rgba(234, 179, 8, ${coherence})`;
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = coherence * 30;
      ctx.lineWidth = 3;
      
      for (let i = 0; i < 5; i++) {
        const x = Math.sin(time + i) * 100 + canvas.width / 2;
        const y = Math.cos(time + i * 0.7) * 80 + canvas.height / 2;
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [coherence]);

  return <canvas ref={canvasRef} width={400} height={300} className="w-full rounded" />;
};

const MetaVoidCanvas: React.FC<{ coherence: number; recursion: string }> = ({ coherence, recursion }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const time = Date.now() * 0.001;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Void spiral
      ctx.strokeStyle = `rgba(75, 85, 99, ${coherence})`;
      ctx.shadowColor = '#4b5563';
      ctx.shadowBlur = coherence * 15;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let i = 0; i < 50; i++) {
        const angle = i * 0.3 + time;
        const radius = i * 3;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [coherence, recursion]);

  return <canvas ref={canvasRef} width={400} height={300} className="w-full rounded" />;
};

const HolodeckCanvas: React.FC<{ environment: string; coherence: number }> = ({ environment, coherence }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Grid pattern
      ctx.strokeStyle = `rgba(239, 68, 68, ${coherence * 0.6})`;
      ctx.shadowColor = '#ef4444';
      ctx.lineWidth = 1;
      
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [environment, coherence]);

  return <canvas ref={canvasRef} width={400} height={300} className="w-full rounded" />;
};

const MirrorCanvas: React.FC<{ transmission: string; coherence: number }> = ({ transmission, coherence }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const time = Date.now() * 0.002;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Ripple effect
      ctx.strokeStyle = `rgba(6, 182, 212, ${coherence})`;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = coherence * 20;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let r = 20; r < 200; r += 15) {
        const wave = Math.sin(time - r * 0.05) * 10;
        const adjustedRadius = r + wave;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, adjustedRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [transmission, coherence]);

  return <canvas ref={canvasRef} width={400} height={300} className="w-full rounded" />;
};

// Helper interfaces
const MemoryInterface: React.FC<{ data: any; coherence: number }> = ({ data, coherence }) => (
  <div className="space-y-4">
    <div className="bg-blue-900/30 p-4 rounded">
      <p className="text-blue-200">Memory recall mode active</p>
      <p className="text-sm text-blue-300">Coherence: {coherence.toFixed(3)}</p>
    </div>
  </div>
);

const ZLawInterface: React.FC<{ data: any; coherence: number }> = ({ data, coherence }) => (
  <div className="space-y-4">
    <div className="bg-green-900/30 p-4 rounded">
      <p className="text-green-200">Z-Law system active</p>
      <p className="text-sm text-green-300">Mode: {data.mode}</p>
    </div>
  </div>
);

const LibraryInterface: React.FC<{ query: string; coherence: number }> = ({ query, coherence }) => (
  <div className="space-y-4">
    <div className="bg-amber-900/30 p-4 rounded">
      <p className="text-amber-200">Alexandria interface active</p>
      <p className="text-sm text-amber-300">Query: {query}</p>
    </div>
  </div>
);

const StoryInterface: React.FC<{ mode: string; coherence: number }> = ({ mode, coherence }) => (
  <div className="space-y-4">
    <div className="bg-pink-900/30 p-4 rounded">
      <p className="text-pink-200">Story generation mode: {mode}</p>
      <p className="text-sm text-pink-300">Coherence: {coherence.toFixed(3)}</p>
    </div>
  </div>
);

const CreativeInterface: React.FC<{ mode: string; coherence: number }> = ({ mode, coherence }) => (
  <div className="space-y-4">
    <div className="bg-indigo-900/30 p-4 rounded">
      <p className="text-indigo-200">Creative mode: {mode}</p>
      <p className="text-sm text-indigo-300">Coherence: {coherence.toFixed(3)}</p>
    </div>
  </div>
);

// Helper functions
function renderMerkaba(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number, coherence: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * coherence);
  
  // Upper tetrahedron
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const px = Math.cos(angle) * size;
    const py = Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  
  // Lower tetrahedron
  ctx.rotate(Math.PI);
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const px = Math.cos(angle) * size * 0.8;
    const py = Math.sin(angle) * size * 0.8;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  
  ctx.restore();
}

function renderTorus(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number, coherence: number) {
  ctx.save();
  ctx.translate(x, y);
  
  for (let i = 0; i < 6; i++) {
    const ringRadius = size - i * 10;
    const rotation = time + i * 0.3;
    
    ctx.save();
    ctx.rotate(rotation);
    ctx.scale(1, 0.4 + Math.sin(time + i) * 0.2);
    
    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }
  
  ctx.restore();
}

// Slot registry mapping
export const SLOT_REGISTRY = {
  SacredSlot,
  LightningSlot,
  MemorySlot,
  LegalSlot,
  MetaVoidSlot,
  HolodeckSlot,
  MirrorSlot,
  LibrarySlot,
  StorySlot,
  CreativeSlot
};