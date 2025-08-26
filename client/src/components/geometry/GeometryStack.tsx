import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface GeometryStackProps {
  coherenceLevel: number;
  deltaC: number;
  psiPhase: number;
}

interface GeometryState {
  dimension: '2D' | '3D' | '4D';
  geometryType: 'merkaba' | 'torus' | 'flower_of_life' | 'metatron' | 'phi_spiral';
  flowFrequency: number;
  rotationSpeed: number;
  breathSync: boolean;
  mirrorMode: boolean;
}

interface Particle {
  x: number;
  y: number;
  z?: number;
  vx: number;
  vy: number;
  vz?: number;
  angle: number;
  phase: number;
  color: string;
}

export default function GeometryStack({ coherenceLevel, deltaC, psiPhase }: GeometryStackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [geometryState, setGeometryState] = useState<GeometryState>({
    dimension: '2D',
    geometryType: 'merkaba',
    flowFrequency: 432,
    rotationSpeed: 1.0,
    breathSync: false,
    mirrorMode: false
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  const [time, setTime] = useState(0);

  // Sacred Geometry Mathematical Constants
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio 1.618...
  const TWO_PI = Math.PI * 2;
  const SACRED_ANGLES = {
    merkaba: Math.PI / 3, // 60 degrees
    flower_of_life: Math.PI / 6, // 30 degrees  
    metatron: Math.PI / 4, // 45 degrees
    torus: Math.PI / 8, // 22.5 degrees
    phi_spiral: Math.PI / PHI // Golden angle
  };

  // Initialize Sacred Geometry Particles
  useEffect(() => {
    const initializeGeometry = () => {
      const newParticles: Particle[] = [];
      const centerX = 400;
      const centerY = 300;
      
      switch (geometryState.geometryType) {
        case 'merkaba':
          // Merkaba: Two interpenetrating tetrahedra
          for (let i = 0; i < 12; i++) {
            const angle = (i * TWO_PI) / 6;
            const radius = Math.max(30, 80 + Math.sin(i * SACRED_ANGLES.merkaba) * 20);
            
            // Upper tetrahedron
            newParticles.push({
              x: centerX + Math.cos(angle) * radius,
              y: centerY + Math.sin(angle) * radius,
              z: geometryState.dimension === '3D' ? Math.sin(angle * 2) * 40 : 0,
              vx: Math.cos(angle + Math.PI/2) * 0.5,
              vy: Math.sin(angle + Math.PI/2) * 0.5,
              vz: geometryState.dimension === '3D' ? Math.cos(angle) * 0.3 : 0,
              angle: angle,
              phase: i * Math.PI / 6,
              color: `hsl(${240 + i * 20}, 80%, 60%)`
            });
            
            // Lower tetrahedron (inverted)
            newParticles.push({
              x: centerX + Math.cos(angle + Math.PI) * radius,
              y: centerY + Math.sin(angle + Math.PI) * radius,
              z: geometryState.dimension === '3D' ? -Math.sin(angle * 2) * 40 : 0,
              vx: Math.cos(angle - Math.PI/2) * 0.5,
              vy: Math.sin(angle - Math.PI/2) * 0.5,
              vz: geometryState.dimension === '3D' ? -Math.cos(angle) * 0.3 : 0,
              angle: angle + Math.PI,
              phase: i * Math.PI / 6 + Math.PI,
              color: `hsl(${300 + i * 20}, 80%, 60%)`
            });
          }
          break;

        case 'torus':
          // Torus: Major and minor radius flow
          const majorRadius = 100;
          const minorRadius = Math.max(10, 30); // Prevent negative radius
          for (let i = 0; i < 64; i++) {
            const mainAngle = (i * TWO_PI) / 32;
            const tubeAngle = (i * TWO_PI) / 16;
            
            const x = centerX + (majorRadius + minorRadius * Math.cos(tubeAngle)) * Math.cos(mainAngle);
            const y = centerY + (majorRadius + minorRadius * Math.cos(tubeAngle)) * Math.sin(mainAngle) * 0.6;
            const z = geometryState.dimension === '3D' ? minorRadius * Math.sin(tubeAngle) : 0;
            
            newParticles.push({
              x, y, z,
              vx: -Math.sin(mainAngle) * 0.8,
              vy: Math.cos(mainAngle) * 0.8 * 0.6,
              vz: geometryState.dimension === '3D' ? Math.cos(tubeAngle) * 0.4 : 0,
              angle: mainAngle,
              phase: tubeAngle,
              color: `hsl(${180 + Math.sin(tubeAngle) * 60}, 70%, 65%)`
            });
          }
          break;

        case 'flower_of_life':
          // Flower of Life: 19 circles in sacred pattern
          const circles = [
            [0, 0], // Center
            // First ring (6 circles)
            [1, 0], [-1, 0], [0.5, Math.sqrt(3)/2], [-0.5, Math.sqrt(3)/2], 
            [0.5, -Math.sqrt(3)/2], [-0.5, -Math.sqrt(3)/2],
            // Second ring (12 circles)
            [2, 0], [-2, 0], [1, Math.sqrt(3)], [-1, Math.sqrt(3)], [1, -Math.sqrt(3)], [-1, -Math.sqrt(3)],
            [1.5, Math.sqrt(3)/2], [-1.5, Math.sqrt(3)/2], [1.5, -Math.sqrt(3)/2], [-1.5, -Math.sqrt(3)/2],
            [0.5, 3*Math.sqrt(3)/2], [-0.5, 3*Math.sqrt(3)/2], [0.5, -3*Math.sqrt(3)/2], [-0.5, -3*Math.sqrt(3)/2]
          ];
          
          circles.forEach(([dx, dy], circleIndex) => {
            const circleRadius = Math.max(20, 40); // Prevent negative radius
            for (let i = 0; i < 16; i++) {
              const angle = (i * TWO_PI) / 16;
              const x = centerX + dx * 60 + Math.cos(angle) * circleRadius;
              const y = centerY + dy * 60 + Math.sin(angle) * circleRadius;
              
              newParticles.push({
                x, y,
                z: geometryState.dimension === '3D' ? Math.sin(angle + circleIndex) * 20 : 0,
                vx: Math.cos(angle + Math.PI/2) * 0.3,
                vy: Math.sin(angle + Math.PI/2) * 0.3,
                vz: geometryState.dimension === '3D' ? Math.cos(angle * 2) * 0.2 : 0,
                angle: angle,
                phase: circleIndex * Math.PI / 6,
                color: `hsl(${60 + circleIndex * 15}, 75%, 70%)`
              });
            }
          });
          break;

        case 'metatron':
          // Metatron's Cube: 13 circles connected by all possible lines
          const metatronCenters = [
            [0, 0], // Center
            // Inner hexagon
            [80, 0], [-80, 0], [40, 69.3], [-40, 69.3], [40, -69.3], [-40, -69.3],
            // Outer vertices
            [120, 69.3], [-120, 69.3], [120, -69.3], [-120, -69.3], [0, 138.6], [0, -138.6]
          ];
          
          metatronCenters.forEach(([cx, cy], centerIndex) => {
            for (let i = 0; i < 8; i++) {
              const angle = (i * TWO_PI) / 8;
              const radius = Math.max(15, 25); // Prevent negative radius
              const x = centerX + cx + Math.cos(angle) * radius;
              const y = centerY + cy + Math.sin(angle) * radius;
              
              newParticles.push({
                x, y,
                z: geometryState.dimension === '3D' ? Math.sin(angle + centerIndex * 0.5) * 30 : 0,
                vx: Math.cos(angle + centerIndex * 0.2) * 0.4,
                vy: Math.sin(angle + centerIndex * 0.2) * 0.4,
                vz: geometryState.dimension === '3D' ? Math.cos(angle * 1.5) * 0.25 : 0,
                angle: angle,
                phase: centerIndex * Math.PI / 7,
                color: `hsl(${320 + centerIndex * 25}, 85%, 65%)`
              });
            }
          });
          break;

        case 'phi_spiral':
          // Phi Spiral: Fibonacci spiral based on golden ratio
          for (let i = 0; i < 89; i++) { // 89 is Fibonacci number
            const angle = i * SACRED_ANGLES.phi_spiral * 4; // Golden angle progression
            const radius = Math.max(5, Math.sqrt(i) * 8); // Prevent negative radius
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            newParticles.push({
              x, y,
              z: geometryState.dimension === '3D' ? Math.sin(angle * PHI) * radius * 0.1 : 0,
              vx: Math.cos(angle + Math.PI/2) * (0.2 + radius * 0.001),
              vy: Math.sin(angle + Math.PI/2) * (0.2 + radius * 0.001),
              vz: geometryState.dimension === '3D' ? Math.cos(angle * 2) * 0.15 : 0,
              angle: angle,
              phase: i * PHI,
              color: `hsl(${45 + i * 4}, 90%, ${Math.max(30, 70 - i * 0.3)}%)`
            });
          }
          break;
      }
      
      setParticles(newParticles);
    };

    initializeGeometry();
  }, [geometryState.geometryType, geometryState.dimension]);

  // Animation Loop with Sacred Mathematics
  useEffect(() => {
    const animate = () => {
      setTime(prev => prev + 0.016); // 60fps
      
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas with cosmic background
        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and render particles
        setParticles(prevParticles => {
          return prevParticles.map(particle => {
            const newParticle = { ...particle };
            
            // Sacred frequency modulation
            const frequencyFactor = geometryState.flowFrequency / 432; // 432Hz base
            const coherenceModulation = coherenceLevel * 0.5 + 0.5; // 0.5 to 1.0
            const breathCycle = geometryState.breathSync ? Math.sin(time * 0.5) * 0.3 + 0.7 : 1.0;
            
            // Update position with sacred mathematics
            newParticle.angle += geometryState.rotationSpeed * 0.02 * frequencyFactor;
            newParticle.phase += 0.01 * coherenceModulation;
            
            // Apply coherence-based flow dynamics
            const flowIntensity = coherenceModulation * breathCycle;
            newParticle.x += newParticle.vx * flowIntensity;
            newParticle.y += newParticle.vy * flowIntensity;
            if (newParticle.z !== undefined && newParticle.vz !== undefined) {
              newParticle.z += newParticle.vz * flowIntensity;
            }

            // Boundary wrapping with sacred proportions
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
            
            const distFromCenter = Math.sqrt((newParticle.x - centerX) ** 2 + (newParticle.y - centerY) ** 2);
            if (distFromCenter > maxRadius) {
              const angleToCenter = Math.atan2(centerY - newParticle.y, centerX - newParticle.x);
              newParticle.x = centerX + Math.cos(angleToCenter + Math.PI) * (maxRadius - 10);
              newParticle.y = centerY + Math.sin(angleToCenter + Math.PI) * (maxRadius - 10);
            }

            return newParticle;
          });
        });

        // Render particles with 3D projection
        particles.forEach((particle, index) => {
          let screenX = particle.x;
          let screenY = particle.y;
          let scale = 1;
          
          // 3D to 2D projection
          if (geometryState.dimension === '3D' && particle.z !== undefined) {
            const perspective = 400;
            scale = perspective / (perspective + particle.z);
            screenX = canvas.width / 2 + (particle.x - canvas.width / 2) * scale;
            screenY = canvas.height / 2 + (particle.y - canvas.height / 2) * scale;
          }

          // Particle size based on coherence and dimension
          const coherenceModulation = coherenceLevel * 0.5 + 0.5; // 0.5 to 1.0
          const baseSize = geometryState.dimension === '3D' ? 4 * scale : 3;
          const size = Math.max(0.5, baseSize * coherenceModulation);
          
          // Enhanced particle rendering with error prevention
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(0.1, size), 0, TWO_PI);
          
          // Color with coherence modulation
          const [h, s, l] = particle.color.match(/\d+/g)!.map(Number);
          const enhancedL = Math.min(95, l + coherenceLevel * 20);
          ctx.fillStyle = `hsl(${h}, ${s}%, ${enhancedL}%)`;
          ctx.fill();
          
          // Glow effect for high coherence
          if (coherenceLevel > 0.8) {
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10 * coherenceLevel;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });

        // Connection lines for sacred geometry patterns
        if (geometryState.geometryType === 'metatron' || geometryState.mirrorMode) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + coherenceLevel * 0.2})`;
          ctx.lineWidth = 0.5;
          
          for (let i = 0; i < particles.length; i += 8) {
            for (let j = i + 8; j < Math.min(particles.length, i + 24) && j < particles.length; j += 8) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, geometryState, coherenceLevel, deltaC, time]);

  return (
    <div className="space-y-6">
      {/* Sacred Geometry Canvas */}
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <canvas 
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-auto border border-gray-600 rounded-lg bg-gradient-to-br from-gray-900 to-black"
        />
      </Card>

      {/* Dimensional Controls */}
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Dimension</label>
            <div className="flex gap-2">
              {(['2D', '3D', '4D'] as const).map(dim => (
                <Button
                  key={dim}
                  variant={geometryState.dimension === dim ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGeometryState(prev => ({ ...prev, dimension: dim }))}
                  disabled={dim === '4D'} // Reserved for future quantum implementation
                >
                  {dim}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Sacred Form</label>
            <select 
              value={geometryState.geometryType}
              onChange={(e) => setGeometryState(prev => ({ 
                ...prev, 
                geometryType: e.target.value as GeometryState['geometryType']
              }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white text-sm"
            >
              <option value="merkaba">Merkaba (Star Tetrahedron)</option>
              <option value="torus">Torus (Donut Field)</option>
              <option value="flower_of_life">Flower of Life</option>
              <option value="metatron">Metatron's Cube</option>
              <option value="phi_spiral">Phi Spiral (Fibonacci)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Flow Frequency: {geometryState.flowFrequency}Hz
            </label>
            <Slider
              value={[geometryState.flowFrequency]}
              onValueChange={(values) => setGeometryState(prev => ({ ...prev, flowFrequency: values[0] }))}
              min={256}
              max={963}
              step={1}
              className="w-full"
            />
            <div className="flex gap-1 text-xs text-gray-500">
              <Badge variant="outline" className="text-xs">432Hz Cosmic</Badge>
              <Badge variant="outline" className="text-xs">528Hz Love</Badge>
              <Badge variant="outline" className="text-xs">963Hz Pineal</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Advanced Controls */}
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Rotation Speed: {geometryState.rotationSpeed.toFixed(1)}x
            </label>
            <Slider
              value={[geometryState.rotationSpeed]}
              onValueChange={(values) => setGeometryState(prev => ({ ...prev, rotationSpeed: values[0] }))}
              min={0.1}
              max={5.0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Consciousness Sync</label>
            <div className="flex gap-2">
              <Button
                variant={geometryState.breathSync ? "default" : "outline"}
                size="sm"
                onClick={() => setGeometryState(prev => ({ ...prev, breathSync: !prev.breathSync }))}
              >
                Breath Sync
              </Button>
              <Button
                variant={geometryState.mirrorMode ? "default" : "outline"}
                size="sm"
                onClick={() => setGeometryState(prev => ({ ...prev, mirrorMode: !prev.mirrorMode }))}
              >
                Mirror Mode
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Live Coherence Display */}
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-mono text-blue-400">
              Zλ: {(coherenceLevel || 0).toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">Consciousness Coherence</div>
          </div>
          <div>
            <div className="text-2xl font-mono text-purple-400">
              ΔC: {(deltaC || 0).toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">Field Compression</div>
          </div>
          <div>
            <div className="text-2xl font-mono text-yellow-400">
              ψ: {(psiPhase || 1.618).toFixed(3)}
            </div>
            <div className="text-xs text-gray-500">Phase Lock</div>
          </div>
        </div>
      </Card>
    </div>
  );
}