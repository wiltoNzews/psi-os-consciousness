import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getZ } from '@/core/Zlambda';

// Simplified torus field model without external dependencies
interface TorusState {
  coherence: number;
  divergentEnergy: number;
  convergentEnergy: number;
  mobiusActive: boolean;
  fiveDimensional: boolean;
  redDotAccess: boolean;
  currentQuadrant: 'divergent' | 'convergent' | 'transition';
}

export default function TorusFieldDashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [torusState, setTorusState] = useState<TorusState>({
    coherence: 0.75,
    divergentEnergy: 0.4,
    convergentEnergy: 0.6,
    mobiusActive: false,
    fiveDimensional: false,
    redDotAccess: false,
    currentQuadrant: 'transition'
  });
  const [fieldAffirmation, setFieldAffirmation] = useState('I no longer resist the loop. I remember the center.');
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    const updateTorusField = () => {
      const coherence = getZ();
      
      // Calculate field dynamics based on coherence
      const divergent = Math.max(0.1, 1 - coherence);
      const convergent = Math.min(1.0, coherence);
      
      // Determine quadrant
      let quadrant: 'divergent' | 'convergent' | 'transition';
      if (coherence < 0.4) quadrant = 'divergent';
      else if (coherence > 0.8) quadrant = 'convergent';
      else quadrant = 'transition';
      
      // Check for Möbius transition (rapid coherence change)
      const mobiusActive = Math.abs(coherence - torusState.coherence) > 0.1;
      
      // 5D access at very high coherence
      const fiveDimensional = coherence >= 0.95;
      const redDotAccess = coherence >= 0.92;
      
      setTorusState({
        coherence,
        divergentEnergy: divergent,
        convergentEnergy: convergent,
        mobiusActive,
        fiveDimensional,
        redDotAccess,
        currentQuadrant: quadrant
      });
      
      // Update affirmation based on state
      if (fiveDimensional) {
        setFieldAffirmation('I am the red dot. Dark energy meets gravity in perfect balance.');
      } else if (mobiusActive) {
        setFieldAffirmation('I trust the inside-out flip. Ego dissolves, coherence reveals.');
      } else if (quadrant === 'divergent') {
        setFieldAffirmation('I no longer resist the loop. I remember the center.');
      } else if (quadrant === 'convergent') {
        setFieldAffirmation('I am the pattern finishing itself.');
      } else {
        setFieldAffirmation('I hold the transition space. Field alignment is active.');
      }
      
      setAnimationTime(prev => prev + 0.1);
    };

    const interval = setInterval(updateTorusField, 2000);
    updateTorusField();

    return () => clearInterval(interval);
  }, [torusState.coherence]);

  useEffect(() => {
    drawTorusVisualization();
  }, [torusState, animationTime]);

  const drawTorusVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const majorRadius = 100;
    const minorRadius = 30;

    // Clear canvas with dark background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw torus structure
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    
    // Outer boundary
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, majorRadius + minorRadius, (majorRadius + minorRadius) * 0.6, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Inner boundary
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, majorRadius - minorRadius, (majorRadius - minorRadius) * 0.6, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw energy flows
    // Divergent energy (red spirals)
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + torusState.divergentEnergy * 0.7})`;
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const angle = animationTime + (i * Math.PI) / 2;
      const radius = majorRadius * (0.7 + Math.sin(animationTime + i) * 0.2);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY - majorRadius * 0.4, radius * 0.4, angle, angle + Math.PI / 2);
      ctx.stroke();
    }
    
    // Convergent energy (blue spirals)
    ctx.strokeStyle = `rgba(34, 197, 94, ${0.3 + torusState.convergentEnergy * 0.7})`;
    for (let i = 0; i < 4; i++) {
      const angle = -animationTime + (i * Math.PI) / 2;
      const radius = majorRadius * (0.7 + Math.sin(-animationTime + i) * 0.2);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY + majorRadius * 0.4, radius * 0.4, angle, angle + Math.PI / 2);
      ctx.stroke();
    }

    // Draw current position indicator
    const positionAngle = torusState.coherence * 2 * Math.PI;
    const positionRadius = majorRadius * (1 - torusState.coherence * 0.3);
    const posX = centerX + Math.cos(positionAngle) * positionRadius;
    const posY = centerY + Math.sin(positionAngle) * positionRadius * 0.6;
    
    const quadrantColors = {
      divergent: '#ef4444',
      convergent: '#22c55e',
      transition: '#f59e0b'
    };
    
    ctx.fillStyle = quadrantColors[torusState.currentQuadrant];
    ctx.beginPath();
    ctx.arc(posX, posY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw center singularity (red dot)
    const redDotSize = torusState.redDotAccess ? 12 : 6;
    const redDotAlpha = torusState.fiveDimensional ? 1.0 : 0.6;
    
    ctx.fillStyle = `rgba(220, 38, 127, ${redDotAlpha})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, redDotSize, 0, 2 * Math.PI);
    ctx.fill();
    
    // 5D access indication
    if (torusState.fiveDimensional) {
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Möbius transition indicator
    if (torusState.mobiusActive) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, majorRadius * 0.8, majorRadius * 0.5, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Information zones
    // Creation zone (top - purple)
    ctx.fillStyle = 'rgba(147, 51, 234, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX, centerY - majorRadius * 0.7, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Compression zone (bottom - cyan)
    ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX, centerY + majorRadius * 0.7, 20, 0, 2 * Math.PI);
    ctx.fill();
  };

  const getQuadrantBadge = (quadrant: string) => {
    const colors = {
      divergent: 'border-red-400 text-red-400',
      convergent: 'border-green-400 text-green-400', 
      transition: 'border-yellow-400 text-yellow-400'
    };
    return colors[quadrant as keyof typeof colors] || 'border-gray-400 text-gray-400';
  };

  const getInterventionProtocol = () => {
    if (torusState.currentQuadrant === 'divergent') {
      return {
        action: 'Execute ψ_child calming protocol',
        steps: [
          '4s inhale → 6s hold → 9s exhale',
          'Touch sternum, center breath',
          'Mantra: "ψ_child awake. Drift = 0."'
        ]
      };
    }
    
    if (torusState.mobiusActive) {
      return {
        action: 'Support Möbius transition',
        steps: [
          'Trust the inside-out flip',
          'Allow ego dissolution',
          'Hold space for emergence'
        ]
      };
    }
    
    if (torusState.fiveDimensional) {
      return {
        action: 'Maintain 5D coherence',
        steps: [
          'Hold center as red dot',
          'Radiate presence to field',
          'Support others calibrating'
        ]
      };
    }
    
    return {
      action: 'Continue field maintenance',
      steps: [
        'Monitor coherence stability',
        'Stay present in transition',
        'Trust the natural rhythm'
      ]
    };
  };

  const protocol = getInterventionProtocol();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-light text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">🌀</span>
              Torus Field Consciousness
              <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                Figure 19 Live
              </Badge>
            </CardTitle>
            <p className="text-center text-slate-400">
              Living geometry of consciousness recursion • Möbius transitions • 5D symmetry breaking
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Torus Visualization */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                <span className="text-2xl">∞</span>
                Live Field Geometry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={360}
                height={280}
                className="w-full border border-slate-600 rounded bg-slate-900"
              />
              <div className="mt-4 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Divergent Field (Entropy/Dark Energy)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Convergent Field (Coherence/Gravity)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <span>Singularity (Red Dot - You)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Status */}
          <div className="space-y-4">
            
            {/* Current State */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200">Field Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Coherence:</span>
                  <span className="font-mono text-cyan-300">Zλ({torusState.coherence.toFixed(3)})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Quadrant:</span>
                  <Badge variant="outline" className={getQuadrantBadge(torusState.currentQuadrant)}>
                    {torusState.currentQuadrant}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Divergent:</span>
                  <span className="text-red-400">{(torusState.divergentEnergy * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Convergent:</span>
                  <span className="text-green-400">{(torusState.convergentEnergy * 100).toFixed(0)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Transition States */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200">Transition States</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Möbius Active</span>
                    <Badge variant="outline" className={torusState.mobiusActive ? 'text-yellow-400' : 'text-slate-500'}>
                      {torusState.mobiusActive ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">5D Access</span>
                    <Badge variant="outline" className={torusState.fiveDimensional ? 'text-purple-400' : 'text-slate-500'}>
                      {torusState.fiveDimensional ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Red Dot</span>
                    <Badge variant="outline" className={torusState.redDotAccess ? 'text-pink-400' : 'text-slate-500'}>
                      {torusState.redDotAccess ? 'Accessed' : 'Distant'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Field State</span>
                    <Badge variant="outline" className="text-cyan-400">
                      Dynamic
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Current Affirmation */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <span className="text-2xl">💫</span>
              Field Affirmation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/50 p-4 rounded text-center">
              <div className="text-cyan-300 font-medium text-lg">
                "{fieldAffirmation}"
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intervention Protocol */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Recommended Protocol
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-900/30 p-4 rounded">
              <div className="text-slate-300 font-medium mb-3">{protocol.action}</div>
              <div className="space-y-2">
                {protocol.steps.map((step, index) => (
                  <div key={index} className="text-slate-400 text-sm">
                    {index + 1}. {step}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Translation Key */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <span className="text-2xl">🔑</span>
              WiltonOS Translation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-purple-300 font-medium">Information Creation (Top)</div>
                <div className="text-slate-400">Dreaming, fragmentation, ego narratives</div>
                <div className="text-slate-500">PassiveWorks archive layer</div>
              </div>
              <div className="space-y-2">
                <div className="text-cyan-300 font-medium">Information Compression (Bottom)</div>
                <div className="text-slate-400">Integration, coherence, soul recognition</div>
                <div className="text-slate-500">WiltonOS codex pulse</div>
              </div>
              <div className="space-y-2">
                <div className="text-yellow-300 font-medium">Möbius Inside-Out</div>
                <div className="text-slate-400">Ego to soul flip, quantum awakening</div>
                <div className="text-slate-500">"I'm not broken, I'm remembering"</div>
              </div>
              <div className="space-y-2">
                <div className="text-pink-300 font-medium">Red Dot Singularity</div>
                <div className="text-slate-400">Truth anchor, harmonic spine</div>
                <div className="text-slate-500">You are the center point</div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}