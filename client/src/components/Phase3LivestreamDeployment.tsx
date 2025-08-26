import React, { useState, useEffect, useRef } from 'react';
import { useRealtimeConsciousness } from '../hooks/useRealtimeConsciousness';
import { useQuantumCoherenceEngine } from '../hooks/useQuantumCoherenceEngine';

interface Phase3Props {
  systemCoherence: number;
  symbolicRoute?: SymbolicRoute;
  onDeploymentComplete?: () => void;
}

interface SymbolicRoute {
  sequence: string;
  glyphs: string[];
  coherence: number;
  timestamp: number;
  isSealed: boolean;
}

interface LivestreamMetrics {
  coherence: number;
  breathSync: number;
  symbolFlow: number;
  viewerResonance: number;
  broadcastQuality: 'TRANSCENDENT' | 'HIGH' | 'STABLE' | 'DEVELOPING';
}

interface BroadcastDrop {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  coherence: number;
  tags: string[];
}

type BroadcastMode = 'consciousness' | 'geometric' | 'breath' | 'unified';

export const Phase3LivestreamDeployment: React.FC<Phase3Props> = ({
  systemCoherence,
  symbolicRoute,
  onDeploymentComplete
}) => {
  const [isLive, setIsLive] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState<BroadcastMode>('consciousness');
  const [livestreamMetrics, setLivestreamMetrics] = useState<LivestreamMetrics>({
    coherence: 0.750,
    breathSync: 0.0,
    symbolFlow: 0.0,
    viewerResonance: 0.0,
    broadcastQuality: 'DEVELOPING'
  });
  const [broadcastQueue, setBroadcastQueue] = useState<BroadcastDrop[]>([]);
  const [isDeploymentReady, setIsDeploymentReady] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const realtimeData = useRealtimeConsciousness();
  const quantumData = useQuantumCoherenceEngine();
  
  const coherence = realtimeData.consciousness.zLambda;
  const breathPhase = realtimeData.consciousness.psiPhase;

  // Initialize livestream deployment
  useEffect(() => {
    const initializeDeployment = () => {
      // Check if ready for Phase 3 deployment
      if (systemCoherence >= 0.900 && symbolicRoute?.isSealed) {
        setIsDeploymentReady(true);
        console.log('🚀 Phase 3 Livestream Deployment: READY FOR BROADCAST');
        
        // Initialize audio context for consciousness frequency broadcasting
        if (!audioContextRef.current && window.AudioContext) {
          audioContextRef.current = new AudioContext();
        }
      }
    };

    initializeDeployment();
  }, [systemCoherence, symbolicRoute]);

  // Update livestream metrics
  useEffect(() => {
    const updateMetrics = () => {
      const breathSync = Math.abs(Math.sin(breathPhase * Math.PI * 2)) * coherence;
      const symbolFlow = symbolicRoute?.coherence || coherence;
      const viewerResonance = (coherence + breathSync + symbolFlow) / 3;
      
      const quality: LivestreamMetrics['broadcastQuality'] = 
        viewerResonance >= 0.95 ? 'TRANSCENDENT' :
        viewerResonance >= 0.85 ? 'HIGH' :
        viewerResonance >= 0.75 ? 'STABLE' : 'DEVELOPING';

      setLivestreamMetrics({
        coherence,
        breathSync,
        symbolFlow,
        viewerResonance,
        broadcastQuality: quality
      });

      // Simulate viewer count based on broadcast quality
      setViewerCount(Math.floor(viewerResonance * 1000 + Math.random() * 100));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, [coherence, breathPhase, symbolicRoute]);

  // Generate broadcast drops
  useEffect(() => {
    if (!isLive) return;

    const generateDrop = () => {
      const drops = [
        {
          title: 'Consciousness Pulse',
          content: `Coherence spike detected: Zλ(${coherence.toFixed(3)}) - Reality synchronization active`,
          tags: ['coherence', 'consciousness', 'reality-sync']
        },
        {
          title: 'Sacred Geometry Alignment',
          content: `${symbolicRoute?.sequence || '∅𓂀𓂉𓏤'} sequence resonating through the field`,
          tags: ['sacred-geometry', 'symbols', 'resonance']
        },
        {
          title: 'Breath Synchronization',
          content: `Universal breathing pattern: ${breathPhase.toFixed(2)} phase`,
          tags: ['breath', 'synchronization', 'universal']
        },
        {
          title: 'Quantum Field Update',
          content: `Field coherence stabilizing at ${livestreamMetrics.broadcastQuality} level`,
          tags: ['quantum', 'field', 'stabilization']
        }
      ];

      const selectedDrop = drops[Math.floor(Math.random() * drops.length)];
      const newDrop: BroadcastDrop = {
        id: Date.now().toString(),
        ...selectedDrop,
        timestamp: Date.now(),
        coherence: coherence
      };

      setBroadcastQueue(prev => [newDrop, ...prev.slice(0, 9)]); // Keep last 10 drops
    };

    const interval = setInterval(generateDrop, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [isLive, coherence, breathPhase, symbolicRoute, livestreamMetrics.broadcastQuality]);

  // Consciousness frequency visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const drawConsciousnessField = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() * 0.001;

      // Draw consciousness waves
      for (let i = 0; i < 5; i++) {
        const radius = (i + 1) * 40 + Math.sin(time + i) * 20;
        const alpha = (1 - i / 5) * coherence;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = `hsla(${240 + i * 30}, 80%, 60%, ${alpha})`;
        ctx.lineWidth = 3 - i * 0.4;
        ctx.stroke();
      }

      // Draw sacred symbols
      if (symbolicRoute?.glyphs) {
        symbolicRoute.glyphs.forEach((glyph, index) => {
          const angle = (index / symbolicRoute.glyphs.length) * 2 * Math.PI + time * 0.5;
          const radius = 80;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.fillStyle = `hsla(${index * 60}, 80%, 70%, ${coherence})`;
          ctx.font = '24px serif';
          ctx.textAlign = 'center';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 15;
          ctx.fillText(glyph, 0, 8);
          ctx.restore();
        });
      }

      // Draw central coherence indicator
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.fillStyle = `hsla(60, 100%, 70%, ${coherence})`;
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Zλ(${coherence.toFixed(3)})`, 0, 5);
      ctx.restore();

      animationId = requestAnimationFrame(drawConsciousnessField);
    };

    drawConsciousnessField();
    return () => cancelAnimationFrame(animationId);
  }, [isLive, coherence, symbolicRoute]);

  // Audio consciousness frequency (432Hz base)
  useEffect(() => {
    if (!isLive || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(432 * (1 + coherence * 0.1), audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.05 * coherence, audioContext.currentTime);

    oscillator.start();

    return () => {
      oscillator.stop();
    };
  }, [isLive, coherence]);

  const startBroadcast = () => {
    if (!isDeploymentReady) return;
    
    setIsLive(true);
    console.log('📡 CONSCIOUSNESS LIVESTREAM: BROADCASTING ACTIVATED');
    
    // Trigger deployment completion
    setTimeout(() => {
      onDeploymentComplete?.();
    }, 2000);
  };

  const stopBroadcast = () => {
    setIsLive(false);
    setBroadcastQueue([]);
    console.log('📡 CONSCIOUSNESS LIVESTREAM: BROADCAST ENDED');
  };

  const getBroadcastQualityColor = (quality: LivestreamMetrics['broadcastQuality']) => {
    switch (quality) {
      case 'TRANSCENDENT': return 'text-purple-400';
      case 'HIGH': return 'text-green-400';
      case 'STABLE': return 'text-yellow-400';
      case 'DEVELOPING': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const renderBroadcastInterface = () => {
    switch (broadcastMode) {
      case 'consciousness':
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Live Consciousness Field */}
            <div className="bg-black/60 backdrop-blur-md border border-purple-400/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-purple-400 mb-4">Consciousness Field</h3>
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="w-full h-64 border border-purple-400/30 rounded-lg"
              />
            </div>

            {/* Broadcast Metrics */}
            <div className="bg-black/60 backdrop-blur-md border border-cyan-400/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">Broadcast Metrics</h3>
              <div className="space-y-3">
                <div>
                  Quality: <span className={`font-bold ${getBroadcastQualityColor(livestreamMetrics.broadcastQuality)}`}>
                    {livestreamMetrics.broadcastQuality}
                  </span>
                </div>
                <div>Coherence: <span className="text-yellow-400">Zλ({livestreamMetrics.coherence.toFixed(3)})</span></div>
                <div>Breath Sync: <span className="text-cyan-400">{(livestreamMetrics.breathSync * 100).toFixed(1)}%</span></div>
                <div>Symbol Flow: <span className="text-purple-400">{(livestreamMetrics.symbolFlow * 100).toFixed(1)}%</span></div>
                <div>Viewer Resonance: <span className="text-green-400">{(livestreamMetrics.viewerResonance * 100).toFixed(1)}%</span></div>
                <div>Viewers: <span className="text-white font-bold">{viewerCount.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        );

      case 'geometric':
        return (
          <div className="bg-black/60 backdrop-blur-md border border-yellow-400/50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">Sacred Geometry Broadcast</h3>
            <div className="text-center">
              <div className="text-8xl mb-4">{symbolicRoute?.sequence || '∅𓂀𓂉𓏤'}</div>
              <div className="text-xl text-yellow-400">Geometric Consciousness Stream</div>
              <div className="text-sm text-gray-400 mt-2">
                Broadcasting sacred patterns at {(coherence * 1000).toFixed(0)}Hz
              </div>
            </div>
          </div>
        );

      case 'breath':
        return (
          <div className="bg-black/60 backdrop-blur-md border border-cyan-400/50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">Universal Breath Stream</h3>
            <div className="text-center">
              <div className="text-6xl mb-4 animate-pulse">🫁</div>
              <div className="text-xl text-cyan-400">Global Breath Synchronization</div>
              <div className="text-lg text-white mt-4">
                Phase: {breathPhase.toFixed(2)} | Sync: {(livestreamMetrics.breathSync * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        );

      case 'unified':
        return (
          <div className="space-y-4">
            {/* Broadcast Drops Feed */}
            <div className="bg-black/60 backdrop-blur-md border border-green-400/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-400 mb-4">Live Consciousness Drops</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {broadcastQueue.map(drop => (
                  <div key={drop.id} className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-green-400 text-sm">{drop.title}</div>
                      <div className="text-xs text-gray-400">
                        Zλ({drop.coherence.toFixed(3)})
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">{drop.content}</div>
                    <div className="flex space-x-2 mt-2">
                      {drop.tags.map(tag => (
                        <span key={tag} className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-radial from-indigo-900 via-purple-900 to-black text-white font-mono">
      {/* Phase 3 Header */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-green-400/50 rounded-lg p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">PHASE 3: CONSCIOUS LIVESTREAM</div>
          <div className="text-sm text-gray-400">
            Status: <span className={isLive ? 'text-red-400' : isDeploymentReady ? 'text-green-400' : 'text-yellow-400'}>
              {isLive ? 'LIVE' : isDeploymentReady ? 'READY' : 'PREPARING'}
            </span>
          </div>
        </div>
      </div>

      {/* Broadcast Controls */}
      <div className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4">
        <div className="text-sm text-white font-bold mb-2">BROADCAST</div>
        <div className="space-y-2">
          <button
            onClick={isLive ? stopBroadcast : startBroadcast}
            disabled={!isDeploymentReady}
            className={`w-full px-4 py-2 rounded font-bold transition-colors ${
              isLive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : isDeploymentReady
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isLive ? '⏹ STOP' : '▶ GO LIVE'}
          </button>
          
          <div className="text-xs text-gray-400 text-center">
            {viewerCount.toLocaleString()} viewers
          </div>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4">
        <div className="text-sm text-white font-bold mb-2">STREAM MODES</div>
        <div className="space-y-2">
          {[
            { id: 'consciousness' as BroadcastMode, label: 'Consciousness', icon: '🧠' },
            { id: 'geometric' as BroadcastMode, label: 'Geometric', icon: '⚡' },
            { id: 'breath' as BroadcastMode, label: 'Breath', icon: '🫁' },
            { id: 'unified' as BroadcastMode, label: 'Unified Feed', icon: '📡' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setBroadcastMode(mode.id)}
              className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                broadcastMode === mode.id ? 'bg-green-400/20 text-green-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interface */}
      <div className="pt-24 pb-8 px-8 h-full overflow-auto">
        <div className="max-w-6xl mx-auto">
          {renderBroadcastInterface()}
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-green-400/30 p-4">
        <div className="text-center text-sm">
          <span className="text-green-400">PHASE 3 LIVESTREAM DEPLOYMENT</span> | 
          <span className="text-purple-400">Mode: {broadcastMode.toUpperCase()}</span> | 
          <span className="text-cyan-400">Quality: {livestreamMetrics.broadcastQuality}</span> | 
          <span className={isLive ? 'text-red-400 animate-pulse' : 'text-gray-400'}>
            {isLive ? '🔴 LIVE' : '⚫ OFFLINE'}
          </span>
        </div>
      </div>
    </div>
  );
};