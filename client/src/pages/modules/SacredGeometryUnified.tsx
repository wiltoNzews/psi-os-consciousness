import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import FlowVisualizer from '@/components/FlowVisualizer';

/**
 * Sacred Geometry Unified Renderer
 * Single dynamic interface for all geometric consciousness manifestation
 * Responds to live ΔC coherence and Zλ field resonance
 */

interface GeometryProfile {
  type: 'merkaba' | 'torus' | 'flower_of_life' | 'metatron_cube' | 'phi_spiral' | 'penrose_tiling';
  mathProfile: 'fibonacci' | 'penrose' | 'einstein_cosenoid' | 'golden_ratio' | 'fractal_recursive';
  mode: 'animated' | 'static' | 'coherence_responsive';
  particleCount: number;
  resonanceFreq: number;
  coherenceLevel: number;
  flowIntensity: number;
}

interface LiveCoherenceState {
  zLambda: number;
  deltaC: number;
  psiPhase: number;
  mirrorCode: number;
  lastUpdate: number;
}

const SacredGeometryUnified: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geometryProfile, setGeometryProfile] = useState<GeometryProfile>({
    type: 'merkaba',
    mathProfile: 'golden_ratio',
    mode: 'coherence_responsive',
    particleCount: 144,
    resonanceFreq: 432,
    coherenceLevel: 0.85,
    flowIntensity: 1.2
  });

  const [liveCoherence, setLiveCoherence] = useState<LiveCoherenceState>({
    zLambda: 0.720,
    deltaC: 0.041,
    psiPhase: 1.618,
    mirrorCode: 1,
    lastUpdate: Date.now()
  });

  const [isFieldActive, setIsFieldActive] = useState(true);
  const [visualMode, setVisualMode] = useState<'flow' | 'geometric' | 'hybrid'>('hybrid');

  // Live coherence monitoring from ψ_child field
  useEffect(() => {
    const coherenceMonitor = setInterval(() => {
      // Simulate live coherence tracking (would connect to actual ψ_child metrics)
      const deltaVariation = (Math.random() - 0.5) * 0.02;
      const zVariation = (Math.random() - 0.5) * 0.04;
      
      setLiveCoherence(prev => ({
        zLambda: Math.max(0.1, Math.min(1.0, prev.zLambda + zVariation)),
        deltaC: Math.max(0.001, Math.min(0.2, prev.deltaC + deltaVariation)),
        psiPhase: 1.618 + Math.sin(Date.now() * 0.001) * 0.1,
        mirrorCode: prev.deltaC < 0.05 && prev.zLambda > 0.9 ? 2 : 1,
        lastUpdate: Date.now()
      }));

      // Auto-adjust geometry based on coherence field
      if (geometryProfile.mode === 'coherence_responsive') {
        setGeometryProfile(prev => ({
          ...prev,
          coherenceLevel: liveCoherence.zLambda,
          flowIntensity: 0.5 + liveCoherence.zLambda * 1.5,
          particleCount: Math.floor(72 + liveCoherence.zLambda * 72)
        }));
      }
    }, 500);

    return () => clearInterval(coherenceMonitor);
  }, [geometryProfile.mode, liveCoherence.zLambda]);

  // Sacred geometry mathematical generators
  const generateSacredPattern = (profile: GeometryProfile) => {
    const time = Date.now() * 0.001;
    const patterns = [];

    switch (profile.type) {
      case 'merkaba':
        // Dual tetrahedron with golden ratio proportions
        for (let i = 0; i < 8; i++) {
          const angle = (i / 4) * Math.PI;
          const tetra = i < 4 ? 1 : -1;
          const radius = 100 * profile.coherenceLevel;
          patterns.push({
            x: Math.cos(angle + time * tetra) * radius,
            y: Math.sin(angle + time * tetra) * radius * 0.866,
            z: tetra * radius * 0.5,
            energy: profile.coherenceLevel
          });
        }
        break;

      case 'torus':
        // Toroidal field with consciousness flow
        for (let i = 0; i < profile.particleCount; i++) {
          const mainAngle = (i / profile.particleCount) * Math.PI * 2;
          const tubeAngle = time * 2 + mainAngle * 3;
          const majorRadius = 120 * profile.coherenceLevel;
          const minorRadius = 30 + Math.sin(tubeAngle) * 10;
          
          patterns.push({
            x: (majorRadius + minorRadius * Math.cos(tubeAngle)) * Math.cos(mainAngle),
            y: (majorRadius + minorRadius * Math.cos(tubeAngle)) * Math.sin(mainAngle) * 0.7,
            z: minorRadius * Math.sin(tubeAngle),
            energy: 0.6 + Math.abs(Math.cos(tubeAngle)) * 0.4
          });
        }
        break;

      case 'flower_of_life':
        // Hexagonal crystalline structure
        for (let ring = 0; ring < 4; ring++) {
          const ringPoints = 6 * ring || 1;
          for (let i = 0; i < ringPoints; i++) {
            const angle = (i / ringPoints) * Math.PI * 2;
            const ringRadius = ring * 40 + 60 * profile.coherenceLevel;
            const petalFlow = Math.sin(time * 2 + angle * 6) * 8;
            
            patterns.push({
              x: Math.cos(angle) * (ringRadius + petalFlow),
              y: Math.sin(angle) * (ringRadius + petalFlow),
              z: Math.sin(time + angle) * 20,
              energy: 0.9 + Math.sin(time + angle) * 0.2
            });
          }
        }
        break;

      case 'phi_spiral':
        // Golden ratio spiral with consciousness expansion
        const phi = 1.618;
        for (let i = 0; i < profile.particleCount; i++) {
          const angle = i * 0.1 * phi;
          const radius = Math.sqrt(i) * 8 * profile.coherenceLevel;
          const height = Math.sin(angle + time) * 30;
          
          patterns.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: height,
            energy: (1 - i / profile.particleCount) * profile.coherenceLevel
          });
        }
        break;

      default:
        // Metatron's Cube default
        for (let i = 0; i < 13; i++) {
          const angle = (i / 13) * Math.PI * 2;
          const radius = 80 + Math.sin(angle * 5 + time) * 20;
          patterns.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            z: Math.cos(time + angle) * 15,
            energy: profile.coherenceLevel
          });
        }
    }

    return patterns;
  };

  // Render unified sacred geometry
  const renderUnifiedGeometry = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Consciousness field background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height));
    gradient.addColorStop(0, `rgba(20, 5, 40, ${0.95 * liveCoherence.zLambda})`);
    gradient.addColorStop(0.5, `rgba(10, 2, 25, ${0.98 * liveCoherence.zLambda})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Generate and render sacred pattern
    const patterns = generateSacredPattern(geometryProfile);
    const time = Date.now() * 0.001;

    // Color scheme based on geometry type
    const colorSchemes = {
      merkaba: [245, 158, 11], // Amber
      torus: [236, 72, 153],   // Pink
      flower_of_life: [34, 197, 94], // Green
      metatron_cube: [139, 92, 246], // Purple
      phi_spiral: [6, 182, 212], // Cyan
      penrose_tiling: [239, 68, 68] // Red
    };

    const [r, g, b] = colorSchemes[geometryProfile.type];

    patterns.forEach((point, i) => {
      const x = centerX + point.x;
      const y = centerY + point.y;
      
      // Depth-based sizing and alpha
      const depth = point.z / 100;
      const size = 3 + Math.abs(depth) * 2 + Math.sin(time * 3 + i * 0.1) * 1.5;
      const alpha = point.energy * liveCoherence.zLambda * (1 - Math.abs(depth) * 0.3);

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, alpha * 0.8)})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Sacred connections between points
      if (i % 6 === 0 && i < patterns.length - 6) {
        const next = patterns[i + 1];
        const nextX = centerX + next.x;
        const nextY = centerY + next.y;
        const distance = Math.sqrt((nextX - x) ** 2 + (nextY - y) ** 2);

        if (distance < 80) {
          const connectionAlpha = (1 - distance / 80) * alpha * 0.3;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${connectionAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
      }
    });

    // Central consciousness anchor
    const anchorPulse = Math.sin(time * 4) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 215, 0, ${liveCoherence.zLambda * anchorPulse * 0.8})`;
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 20 * liveCoherence.zLambda;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12 + anchorPulse * 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    requestAnimationFrame(renderUnifiedGeometry);
  };

  useEffect(() => {
    if (isFieldActive && visualMode !== 'flow') {
      renderUnifiedGeometry();
    }
  }, [isFieldActive, visualMode, geometryProfile, liveCoherence]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Live Coherence Panel */}
      <Card className="bg-gray-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-300 flex items-center gap-2">
            🌀 Live Consciousness Field Monitor
            <Badge variant={liveCoherence.mirrorCode === 2 ? "default" : "secondary"}>
              Mirror Code: {liveCoherence.mirrorCode}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-gray-400">Zλ(t)</div>
              <div className="text-xl font-mono text-cyan-400">
                {liveCoherence.zLambda.toFixed(3)} {liveCoherence.zLambda > 0.9 ? '↗︎' : '↘︎'}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">ΔC(t)</div>
              <div className="text-xl font-mono text-pink-400">
                {liveCoherence.deltaC.toFixed(3)} {liveCoherence.deltaC < 0.05 ? '↗︎' : '↘︎'}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">ψ_phase</div>
              <div className="text-xl font-mono text-amber-400">
                {liveCoherence.psiPhase.toFixed(3)} (stable)
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">Field Status</div>
              <div className="text-xl font-mono text-green-400">
                {liveCoherence.zLambda > 0.8 ? 'COHERENT' : 'SYNCING'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unified Geometry Controls */}
      <Card className="bg-gray-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-300">
            Sacred Geometry Unified Interface
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Geometry Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Geometry Type</label>
            <div className="flex flex-wrap gap-2">
              {(['merkaba', 'torus', 'flower_of_life', 'metatron_cube', 'phi_spiral'] as const).map(type => (
                <Button
                  key={type}
                  variant={geometryProfile.type === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGeometryProfile(prev => ({ ...prev, type }))}
                  className="capitalize"
                >
                  {type.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Visual Mode Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Visual Mode</label>
            <div className="flex gap-2">
              {(['flow', 'geometric', 'hybrid'] as const).map(mode => (
                <Button
                  key={mode}
                  variant={visualMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVisualMode(mode)}
                  className="capitalize"
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          {/* Dynamic Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">
                Resonance Frequency: {geometryProfile.resonanceFreq}Hz
              </label>
              <Slider
                value={[geometryProfile.resonanceFreq]}
                onValueChange={(values) => setGeometryProfile(prev => ({ ...prev, resonanceFreq: values[0] }))}
                min={256}
                max={528}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">
                Flow Intensity: {geometryProfile.flowIntensity.toFixed(1)}
              </label>
              <Slider
                value={[geometryProfile.flowIntensity]}
                onValueChange={(values) => setGeometryProfile(prev => ({ ...prev, flowIntensity: values[0] }))}
                min={0.1}
                max={3.0}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Consciousness Mode</label>
            <div className="flex gap-2">
              {(['animated', 'static', 'coherence_responsive'] as const).map(mode => (
                <Button
                  key={mode}
                  variant={geometryProfile.mode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGeometryProfile(prev => ({ ...prev, mode }))}
                  className="capitalize"
                >
                  {mode.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unified Visualization Canvas */}
      <Card className="bg-gray-900/50 border-purple-500/30">
        <CardContent className="p-0">
          {visualMode === 'flow' ? (
            <FlowVisualizer
              width={800}
              height={600}
              coherenceLevel={liveCoherence.zLambda}
              flowIntensity={geometryProfile.flowIntensity}
              particleCount={geometryProfile.particleCount}
              colorScheme="sacred"
              mode="toroidal"
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full bg-black rounded-lg"
              style={{ aspectRatio: '4/3' }}
            />
          )}
          <div className="p-4 text-center">
            <Button
              onClick={() => setIsFieldActive(!isFieldActive)}
              variant={isFieldActive ? "default" : "outline"}
              className="mr-4"
            >
              {isFieldActive ? 'Pause Field' : 'Activate Field'}
            </Button>
            <Badge variant="outline" className="text-xs">
              Particles: {geometryProfile.particleCount} | Coherence: {(liveCoherence.zLambda * 100).toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SacredGeometryUnified;