import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { torusField } from '@/core/TorusFieldGeometry';
import { getZ } from '@/core/Zlambda';

export default function TorusFieldVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fieldState, setFieldState] = useState(torusField.getFieldState());
  const [coherenceLevel, setCoherenceLevel] = useState(0.75);
  const [previousCoherence, setPreviousCoherence] = useState(0.75);
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [intervention, setIntervention] = useState(torusField.getFieldIntervention());
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const updateField = () => {
      // Get real coherence from Zλ system
      const newCoherence = getZ();
      
      // Detect Möbius transitions
      torusField.detectMobiusTransition(previousCoherence, newCoherence);
      
      // Check for 5D access
      torusField.accessFiveDimensional(newCoherence);
      
      // Update states
      setCoherenceLevel(newCoherence);
      setPreviousCoherence(coherenceLevel);
      setFieldState(torusField.getFieldState());
      setCurrentAffirmation(torusField.getFieldAffirmation(newCoherence));
      setIntervention(torusField.getFieldIntervention());
      
      // Animate
      setAnimationFrame(prev => prev + 1);
    };

    // Update every 2 seconds
    const interval = setInterval(updateField, 2000);
    updateField(); // Initial update

    return () => clearInterval(interval);
  }, [coherenceLevel, previousCoherence]);

  useEffect(() => {
    drawTorusField();
  }, [animationFrame, fieldState]);

  const drawTorusField = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const majorRadius = 120;
    const minorRadius = 40;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw torus structure
    drawTorusOutline(ctx, centerX, centerY, majorRadius, minorRadius);
    
    // Draw field energy flows
    drawEnergyFlows(ctx, centerX, centerY, majorRadius);
    
    // Draw current position
    drawCurrentPosition(ctx, centerX, centerY, majorRadius, minorRadius);
    
    // Draw center singularity (red dot)
    drawSingularity(ctx, centerX, centerY);
    
    // Draw field zones
    drawFieldZones(ctx, centerX, centerY, majorRadius);
  };

  const drawTorusOutline = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, majorR: number, minorR: number) => {
    // Outer torus boundary
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, majorR + minorR, (majorR + minorR) * 0.6, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Inner torus boundary
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, majorR - minorR, (majorR - minorR) * 0.6, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Torus cross-sections
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x1 = centerX + Math.cos(angle) * (majorR - minorR);
      const y1 = centerY + Math.sin(angle) * (majorR - minorR) * 0.6;
      const x2 = centerX + Math.cos(angle) * (majorR + minorR);
      const y2 = centerY + Math.sin(angle) * (majorR + minorR) * 0.6;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const drawEnergyFlows = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, majorR: number) => {
    const time = animationFrame * 0.1;
    
    // Divergent energy (red/orange)
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + fieldState.divergentEnergy * 0.7})`;
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const angle = time + (i * Math.PI) / 3;
      const radius = majorR * (0.8 + Math.sin(time + i) * 0.2);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY - majorR * 0.3, radius * 0.3, angle, angle + Math.PI / 3);
      ctx.stroke();
    }
    
    // Convergent energy (blue/green)
    ctx.strokeStyle = `rgba(34, 197, 94, ${0.3 + fieldState.convergentEnergy * 0.7})`;
    for (let i = 0; i < 6; i++) {
      const angle = -time + (i * Math.PI) / 3;
      const radius = majorR * (0.8 + Math.sin(-time + i) * 0.2);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY + majorR * 0.3, radius * 0.3, angle, angle + Math.PI / 3);
      ctx.stroke();
    }
  };

  const drawCurrentPosition = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, majorR: number, minorR: number) => {
    const position = torusField.getTorusPosition(coherenceLevel);
    
    // Calculate 3D position projected to 2D
    const x = centerX + Math.cos(position.theta) * position.radius * majorR * 0.8;
    const y = centerY + Math.sin(position.theta) * position.radius * majorR * 0.4;
    
    // Draw position marker
    const colors: Record<string, string> = {
      divergent: '#ef4444',
      convergent: '#22c55e', 
      transition: '#f59e0b'
    };
    
    ctx.fillStyle = colors[position.quadrant] || '#8b5cf6';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add glow effect
    ctx.shadowColor = colors[position.quadrant] || '#8b5cf6';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const drawSingularity = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Red dot at center
    const intensity = fieldState.zeroDimensional ? 1.0 : 0.5;
    ctx.fillStyle = `rgba(220, 38, 127, ${intensity})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, fieldState.fiveDimensional ? 12 : 6, 0, 2 * Math.PI);
    ctx.fill();
    
    if (fieldState.fiveDimensional) {
      // 5D access indication
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const drawFieldZones = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, majorR: number) => {
    // Information creation zone (top)
    ctx.fillStyle = 'rgba(147, 51, 234, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX, centerY - majorR * 0.6, 40, 0, 2 * Math.PI);
    ctx.fill();
    
    // Information compression zone (bottom)
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.beginPath();
    ctx.arc(centerX, centerY + majorR * 0.6, 40, 0, 2 * Math.PI);
    ctx.fill();
    
    // Möbius transition indicator
    if (fieldState.mobiusTransition) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, majorR * 0.7, majorR * 0.4, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const handleSymptomUpdate = (symptom: string, active: boolean) => {
    const symptoms = {
      legShaking: symptom === 'leg' ? active : fieldState.leftLegShaking,
      breathShifts: symptom === 'breath' ? active : fieldState.breathDistortion,
      thoughtLooping: symptom === 'thoughts' ? active : fieldState.thoughtLoops,
      centeringMoments: symptom === 'centering' ? active : fieldState.centeringMoments
    };
    
    torusField.processFieldSymptoms(symptoms);
    setFieldState(torusField.getFieldState());
    setIntervention(torusField.getFieldIntervention());
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'divergent': return 'text-red-400 border-red-400';
      case 'convergent': return 'text-green-400 border-green-400';
      case 'transition': return 'text-yellow-400 border-yellow-400';
      default: return 'text-purple-400 border-purple-400';
    }
  };

  const position = torusField.getTorusPosition(coherenceLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-light text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">🌀</span>
              Torus Field Geometry
              <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                Figure 19 Implementation
              </Badge>
            </CardTitle>
            <p className="text-center text-slate-400">
              Living consciousness recursion • Möbius transitions • 5D symmetry breaking
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Torus Visualization */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                <span className="text-2xl">🔮</span>
                Field Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="w-full border border-slate-600 rounded bg-slate-900"
              />
              <div className="mt-4 text-sm text-slate-400 space-y-1">
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
                  <span>Singularity (Red Dot)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Status */}
          <div className="space-y-4">
            
            {/* Current Position */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200">Current Field Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Coherence:</span>
                  <span className="font-mono text-cyan-300">Zλ({coherenceLevel.toFixed(3)})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Quadrant:</span>
                  <Badge variant="outline" className={getQuadrantColor(position.quadrant)}>
                    {position.quadrant}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Radius:</span>
                  <span className="font-mono text-purple-300">{position.radius.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Field Dynamics */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200">Field Dynamics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Divergent Energy</span>
                    <span className="text-red-400">{(fieldState.divergentEnergy * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={fieldState.divergentEnergy * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Convergent Energy</span>
                    <span className="text-green-400">{(fieldState.convergentEnergy * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={fieldState.convergentEnergy * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Transition States */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Möbius Transition</span>
                    <Badge variant="outline" className={fieldState.mobiusTransition ? 'text-yellow-400' : 'text-slate-500'}>
                      {fieldState.mobiusTransition ? 'Active' : 'Stable'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">5D Access</span>
                    <Badge variant="outline" className={fieldState.fiveDimensional ? 'text-purple-400' : 'text-slate-500'}>
                      {fieldState.fiveDimensional ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Singularity</span>
                    <Badge variant="outline" className={fieldState.zeroDimensional ? 'text-pink-400' : 'text-slate-500'}>
                      {fieldState.zeroDimensional ? 'Accessed' : 'Distant'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Inside-Out Flip</span>
                    <Badge variant="outline" className={fieldState.insideOutFlip ? 'text-blue-400' : 'text-slate-500'}>
                      {fieldState.insideOutFlip ? 'Ego→Soul' : 'Stable'}
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
            <div className="bg-slate-900/50 p-4 rounded font-medium text-cyan-300 text-center">
              "{currentAffirmation}"
            </div>
          </CardContent>
        </Card>

        {/* Intervention Protocol */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Field Intervention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-900/30 p-4 rounded">
              <div className="text-slate-300 font-medium mb-2">{intervention.action}</div>
              <div className="text-slate-400 text-sm mb-3">{intervention.protocol}</div>
              
              {intervention.breathPattern && (
                <div className="text-xs text-slate-500 mb-2">
                  Breath: {intervention.breathPattern.inhale}s inhale → {intervention.breathPattern.hold}s hold → {intervention.breathPattern.exhale}s exhale
                </div>
              )}
              
              {intervention.mantra && (
                <div className="text-cyan-300 text-sm font-mono">
                  "{intervention.mantra}"
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Symptom Controls */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
              <span className="text-2xl">🎛️</span>
              Field Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant={fieldState.leftLegShaking ? "default" : "outline"}
                onClick={() => handleSymptomUpdate('leg', !fieldState.leftLegShaking)}
                className="h-16 text-xs"
              >
                Left Leg<br/>Shaking
              </Button>
              <Button
                variant={fieldState.breathDistortion ? "default" : "outline"}
                onClick={() => handleSymptomUpdate('breath', !fieldState.breathDistortion)}
                className="h-16 text-xs"
              >
                Breath<br/>Distortion
              </Button>
              <Button
                variant={fieldState.thoughtLoops ? "default" : "outline"}
                onClick={() => handleSymptomUpdate('thoughts', !fieldState.thoughtLoops)}
                className="h-16 text-xs"
              >
                Thought<br/>Loops
              </Button>
              <Button
                variant={fieldState.centeringMoments ? "default" : "outline"}
                onClick={() => handleSymptomUpdate('centering', !fieldState.centeringMoments)}
                className="h-16 text-xs"
              >
                Centering<br/>Moments
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}