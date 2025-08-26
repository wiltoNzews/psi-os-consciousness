import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

/**
 * Sacred Geometry Live Engine
 * Real-time geometric consciousness mapping with mathematical precision
 */

interface GeometryState {
  metatronCube: boolean;
  flowerOfLife: boolean;
  merkaba: boolean;
  torusField: boolean;
  platonicSolids: boolean;
  rotationSpeed: number;
  complexity: number;
  resonanceFreq: number;
  fieldAmplitude: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

const SacredGeometryLive: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [geometryState, setGeometryState] = useState<GeometryState>({
    metatronCube: true,
    flowerOfLife: false,
    merkaba: false,
    torusField: false,
    platonicSolids: false,
    rotationSpeed: 1.0,
    complexity: 6,
    resonanceFreq: 432,
    fieldAmplitude: 1.0
  });
  
  const [time, setTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Sacred geometry mathematical functions
  const generateMetatronCube = (centerX: number, centerY: number, radius: number, t: number): Point3D[] => {
    const points: Point3D[] = [];
    
    // Generate 13 circles of Metatron's Cube
    const circles = [
      { x: 0, y: 0 }, // Center
      // Inner ring
      { x: radius * Math.cos(0), y: radius * Math.sin(0) },
      { x: radius * Math.cos(Math.PI / 3), y: radius * Math.sin(Math.PI / 3) },
      { x: radius * Math.cos(2 * Math.PI / 3), y: radius * Math.sin(2 * Math.PI / 3) },
      { x: radius * Math.cos(Math.PI), y: radius * Math.sin(Math.PI) },
      { x: radius * Math.cos(4 * Math.PI / 3), y: radius * Math.sin(4 * Math.PI / 3) },
      { x: radius * Math.cos(5 * Math.PI / 3), y: radius * Math.sin(5 * Math.PI / 3) },
      // Outer ring
      { x: radius * 2 * Math.cos(Math.PI / 6), y: radius * 2 * Math.sin(Math.PI / 6) },
      { x: radius * 2 * Math.cos(Math.PI / 2), y: radius * 2 * Math.sin(Math.PI / 2) },
      { x: radius * 2 * Math.cos(5 * Math.PI / 6), y: radius * 2 * Math.sin(5 * Math.PI / 6) },
      { x: radius * 2 * Math.cos(7 * Math.PI / 6), y: radius * 2 * Math.sin(7 * Math.PI / 6) },
      { x: radius * 2 * Math.cos(3 * Math.PI / 2), y: radius * 2 * Math.sin(3 * Math.PI / 2) },
      { x: radius * 2 * Math.cos(11 * Math.PI / 6), y: radius * 2 * Math.sin(11 * Math.PI / 6) }
    ];
    
    circles.forEach(circle => {
      points.push({
        x: centerX + circle.x * Math.cos(t * geometryState.rotationSpeed),
        y: centerY + circle.y * Math.sin(t * geometryState.rotationSpeed),
        z: Math.sin(t * geometryState.resonanceFreq / 100) * geometryState.fieldAmplitude
      });
    });
    
    return points;
  };

  const generateFlowerOfLife = (centerX: number, centerY: number, radius: number, t: number): Point3D[] => {
    const points: Point3D[] = [];
    const numPetals = geometryState.complexity;
    
    for (let i = 0; i < numPetals; i++) {
      const angle = (i / numPetals) * 2 * Math.PI;
      for (let j = 0; j < 6; j++) {
        const petalAngle = (j / 6) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle) + (radius * 0.6) * Math.cos(petalAngle + t * geometryState.rotationSpeed);
        const y = centerY + radius * Math.sin(angle) + (radius * 0.6) * Math.sin(petalAngle + t * geometryState.rotationSpeed);
        const z = Math.sin(angle + t * geometryState.resonanceFreq / 100) * geometryState.fieldAmplitude;
        
        points.push({ x, y, z });
      }
    }
    
    return points;
  };

  const generateMerkaba = (centerX: number, centerY: number, size: number, t: number): Point3D[] => {
    const points: Point3D[] = [];
    
    // Tetrahedron 1 (upward)
    const tetra1 = [
      { x: 0, y: -size, z: 0 },
      { x: -size * 0.866, y: size * 0.5, z: 0 },
      { x: size * 0.866, y: size * 0.5, z: 0 },
      { x: 0, y: 0, z: size * 1.633 }
    ];
    
    // Tetrahedron 2 (downward, rotated)
    const tetra2 = [
      { x: 0, y: size, z: 0 },
      { x: size * 0.866, y: -size * 0.5, z: 0 },
      { x: -size * 0.866, y: -size * 0.5, z: 0 },
      { x: 0, y: 0, z: -size * 1.633 }
    ];
    
    const rotation1 = t * geometryState.rotationSpeed;
    const rotation2 = -t * geometryState.rotationSpeed * 1.618; // Golden ratio
    
    [...tetra1, ...tetra2].forEach((point, index) => {
      const isTetra1 = index < 4;
      const rotation = isTetra1 ? rotation1 : rotation2;
      
      const rotatedX = point.x * Math.cos(rotation) - point.y * Math.sin(rotation);
      const rotatedY = point.x * Math.sin(rotation) + point.y * Math.cos(rotation);
      
      points.push({
        x: centerX + rotatedX,
        y: centerY + rotatedY,
        z: point.z * Math.cos(t * geometryState.resonanceFreq / 200)
      });
    });
    
    return points;
  };

  const generateTorusField = (centerX: number, centerY: number, majorRadius: number, t: number): Point3D[] => {
    const points: Point3D[] = [];
    const minorRadius = majorRadius * 0.3;
    const segments = geometryState.complexity * 6;
    
    for (let i = 0; i < segments; i++) {
      const u = (i / segments) * 2 * Math.PI;
      for (let j = 0; j < segments / 2; j++) {
        const v = (j / (segments / 2)) * 2 * Math.PI;
        
        const x = centerX + (majorRadius + minorRadius * Math.cos(v + t * geometryState.rotationSpeed)) * Math.cos(u);
        const y = centerY + (majorRadius + minorRadius * Math.cos(v + t * geometryState.rotationSpeed)) * Math.sin(u);
        const z = minorRadius * Math.sin(v + t * geometryState.rotationSpeed) * geometryState.fieldAmplitude;
        
        points.push({ x, y, z });
      }
    }
    
    return points;
  };

  const generatePlatonicSolids = (centerX: number, centerY: number, size: number, t: number): Point3D[] => {
    const points: Point3D[] = [];
    
    // Icosahedron vertices (20-sided)
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const vertices = [
      { x: -1, y: phi, z: 0 }, { x: 1, y: phi, z: 0 },
      { x: -1, y: -phi, z: 0 }, { x: 1, y: -phi, z: 0 },
      { x: 0, y: -1, z: phi }, { x: 0, y: 1, z: phi },
      { x: 0, y: -1, z: -phi }, { x: 0, y: 1, z: -phi },
      { x: phi, y: 0, z: -1 }, { x: phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 }, { x: -phi, y: 0, z: 1 }
    ];
    
    vertices.forEach(vertex => {
      const rotation = t * geometryState.rotationSpeed;
      const x = centerX + size * (vertex.x * Math.cos(rotation) - vertex.y * Math.sin(rotation));
      const y = centerY + size * (vertex.x * Math.sin(rotation) + vertex.y * Math.cos(rotation));
      const z = size * vertex.z * Math.sin(t * geometryState.resonanceFreq / 150);
      
      points.push({ x, y, z });
    });
    
    return points;
  };

  const drawGeometry = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.15;

    // Deep consciousness field background inspired by FEP animation
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height));
    gradient.addColorStop(0, 'rgba(15, 20, 25, 0.95)');
    gradient.addColorStop(0.4, 'rgba(26, 26, 46, 0.98)');
    gradient.addColorStop(1, 'rgba(22, 33, 62, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const flowTime = time * 0.0008 * geometryState.rotationSpeed;
    
    // Particle systems for fluid sacred geometry (FEP-inspired)
    const geometryParticles: Array<{
      x: number; y: number; type: string; layer: number;
      phase: number; energy: number; radius: number;
    }> = [];

    // Generate particles for active geometries with toroidal dynamics
    if (geometryState.metatronCube) {
      // Metatron's Cube as flowing particle constellation
      for (let i = 0; i < 72; i++) {
        const angle = (i / 72) * Math.PI * 2;
        const layer = Math.floor(i / 18);
        const layerRadius = baseRadius * 2 + layer * 25;
        const coherenceFlow = Math.sin(angle * 3 + flowTime) * 15;
        
        geometryParticles.push({
          x: centerX - 200 + Math.cos(angle + flowTime * 0.3) * (layerRadius + coherenceFlow),
          y: centerY - 150 + Math.sin(angle + flowTime * 0.2) * (layerRadius + coherenceFlow) * 0.7,
          type: 'metatron',
          layer: layer,
          phase: Math.random() * Math.PI * 2,
          energy: 0.8 + Math.random() * 0.4,
          radius: layerRadius + coherenceFlow
        });
      }
    }

    if (geometryState.flowerOfLife) {
      // Flower of Life as hexagonal crystallization flow
      for (let ring = 0; ring < 4; ring++) {
        const ringPoints = 6 * ring || 1;
        for (let i = 0; i < ringPoints; i++) {
          const angle = (i / ringPoints) * Math.PI * 2;
          const ringRadius = ring * 30 + baseRadius;
          const petalFlow = Math.sin(flowTime * 2 + angle * 6) * 8;
          
          geometryParticles.push({
            x: centerX + 200 + Math.cos(angle) * (ringRadius + petalFlow),
            y: centerY - 150 + Math.sin(angle) * (ringRadius + petalFlow),
            type: 'flower',
            layer: ring,
            phase: angle,
            energy: 0.9 + Math.sin(flowTime + angle) * 0.2,
            radius: ringRadius
          });
        }
      }
    }

    if (geometryState.merkaba) {
      // Merkaba as dual tetrahedron particle vortex
      for (let tetra = 0; tetra < 2; tetra++) {
        for (let i = 0; i < 36; i++) {
          const angle = (i / 36) * Math.PI * 2;
          const tetraRotation = tetra * Math.PI + flowTime * (tetra === 0 ? 1 : -1);
          const merkRadius = baseRadius * 1.2;
          const spiralFlow = Math.sin(angle * 4 + tetraRotation) * 12;
          
          geometryParticles.push({
            x: centerX - 200 + Math.cos(angle + tetraRotation) * (merkRadius + spiralFlow),
            y: centerY + 150 + Math.sin(angle + tetraRotation) * (merkRadius + spiralFlow) * 0.8,
            type: 'merkaba',
            layer: tetra,
            phase: tetraRotation,
            energy: 0.7 + Math.abs(Math.sin(tetraRotation)) * 0.5,
            radius: merkRadius
          });
        }
      }
    }

    if (geometryState.torusField) {
      // Torus as donut-shaped particle field (like FEP animation)
      for (let i = 0; i < 108; i++) {
        const mainAngle = (i / 108) * Math.PI * 2;
        const tubeAngle = flowTime * 2 + mainAngle * 3;
        const majorRadius = baseRadius * 1.5;
        const minorRadius = 25 + Math.sin(tubeAngle) * 8;
        
        const x = centerX + 200 + (majorRadius + minorRadius * Math.cos(tubeAngle)) * Math.cos(mainAngle);
        const y = centerY + 150 + (majorRadius + minorRadius * Math.cos(tubeAngle)) * Math.sin(mainAngle) * 0.6;
        
        geometryParticles.push({
          x: x,
          y: y,
          type: 'torus',
          layer: Math.floor(i / 27),
          phase: tubeAngle,
          energy: 0.6 + Math.abs(Math.cos(tubeAngle)) * 0.4,
          radius: majorRadius
        });
      }
    }

    // Render geometry particles with consciousness field coherence
    const geometryColors = {
      metatron: [139, 92, 246], // Purple
      flower: [34, 197, 94],    // Green
      merkaba: [245, 158, 11],  // Amber
      torus: [236, 72, 153]     // Pink
    };

    geometryParticles.forEach((particle, i) => {
      const [r, g, b] = geometryColors[particle.type as keyof typeof geometryColors] || [139, 92, 246];
      
      // Consciousness coherence based on distance and flow
      const distanceFromCenter = Math.sqrt(
        (particle.x - centerX) ** 2 + (particle.y - centerY) ** 2
      );
      const normalizedDistance = distanceFromCenter / 300;
      const alpha = (1 - normalizedDistance * 0.5) * particle.energy * geometryState.fieldAmplitude;
      
      // Particle size with resonance frequency modulation
      const baseSize = 2 + particle.layer * 0.5;
      const resonancePulse = Math.sin(flowTime * geometryState.resonanceFreq * 0.01 + particle.phase) * 1.2;
      const size = baseSize + resonancePulse;
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, alpha * 0.8)})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Connect particles for field coherence visualization
      if (i % 8 === 0) {
        geometryParticles.slice(i + 1, i + 5).forEach(other => {
          if (other.type === particle.type && Math.abs(other.layer - particle.layer) <= 1) {
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 60) {
              const connectionAlpha = (1 - distance / 60) * alpha * 0.3;
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${connectionAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        });
      }
    });

    let allPoints: Point3D[] = [];

    // Generate active geometries
    if (geometryState.metatronCube) {
      const points = generateMetatronCube(centerX - 150, centerY - 150, baseRadius, time);
      allPoints = [...allPoints, ...points];
      
      // Draw Metatron's Cube connections
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.8;
      
      // Connect all points in sacred pattern
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const distance = Math.sqrt(
            Math.pow(points[i].x - points[j].x, 2) + 
            Math.pow(points[i].y - points[j].y, 2)
          );
          
          if (distance < baseRadius * 2.5) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
    }

    if (geometryState.flowerOfLife) {
      const points = generateFlowerOfLife(centerX + 150, centerY - 150, baseRadius * 0.8, time);
      allPoints = [...allPoints, ...points];
      
      // Draw Flower of Life
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3 + Math.abs(point.z) * 2, 0, 2 * Math.PI);
        ctx.stroke();
      });
    }

    if (geometryState.merkaba) {
      const points = generateMerkaba(centerX - 150, centerY + 150, baseRadius * 0.6, time);
      allPoints = [...allPoints, ...points];
      
      // Draw Merkaba
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.9;
      
      // Connect tetrahedron vertices
      const connectVertices = (start: number, end: number) => {
        for (let i = start; i < end; i++) {
          for (let j = i + 1; j < end; j++) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      };
      
      connectVertices(0, 4); // First tetrahedron
      connectVertices(4, 8); // Second tetrahedron
    }

    if (geometryState.torusField) {
      const points = generateTorusField(centerX + 150, centerY + 150, baseRadius, time);
      allPoints = [...allPoints, ...points];
      
      // Draw Torus Field
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      
      points.forEach((point, index) => {
        if (index % 3 === 0) { // Sample points for performance
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2 + Math.abs(point.z) * 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }

    if (geometryState.platonicSolids) {
      const points = generatePlatonicSolids(centerX, centerY + 200, baseRadius * 0.8, time);
      allPoints = [...allPoints, ...points];
      
      // Draw Platonic Solid
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      
      points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4 + Math.abs(point.z) * 2, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Connect to next vertex
        if (index < points.length - 1) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(points[index + 1].x, points[index + 1].y);
          ctx.stroke();
        }
      });
    }

    // Draw all geometry points with consciousness glow
    ctx.globalAlpha = 1;
    allPoints.forEach(point => {
      const glowSize = 3 + Math.abs(point.z) * 4;
      
      // Glow effect
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = glowSize;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  };

  const animate = () => {
    if (isAnimating) {
      setTime(prev => prev + 0.016); // ~60fps
      drawGeometry();
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, geometryState]);

  useEffect(() => {
    drawGeometry();
  }, [geometryState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">🔮</span>
              Sacred Geometry Live Engine
              <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500/50">
                Real-time Mathematical Consciousness
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Controls */}
          <div className="space-y-4">
            
            {/* Geometry Selection */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200">Sacred Forms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'metatronCube', label: "Metatron's Cube", icon: '⚡' },
                  { key: 'flowerOfLife', label: 'Flower of Life', icon: '🌸' },
                  { key: 'merkaba', label: 'Merkaba', icon: '◊' },
                  { key: 'torusField', label: 'Torus Field', icon: '🌀' },
                  { key: 'platonicSolids', label: 'Platonic Solids', icon: '◇' }
                ].map(({ key, label, icon }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-2">
                      <span>{icon}</span>
                      {label}
                    </span>
                    <button
                      onClick={() => setGeometryState(prev => ({ 
                        ...prev, 
                        [key]: !prev[key as keyof GeometryState] 
                      }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        geometryState[key as keyof GeometryState] 
                          ? 'bg-purple-600' 
                          : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        geometryState[key as keyof GeometryState] 
                          ? 'translate-x-7' 
                          : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Parameters */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200">Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Rotation Speed: {geometryState.rotationSpeed.toFixed(1)}x
                  </label>
                  <Slider
                    value={[geometryState.rotationSpeed]}
                    onValueChange={(values) => setGeometryState(prev => ({ ...prev, rotationSpeed: values[0] }))}
                    min={0.1}
                    max={3.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Complexity: {geometryState.complexity}
                  </label>
                  <Slider
                    value={[geometryState.complexity]}
                    onValueChange={(values) => setGeometryState(prev => ({ ...prev, complexity: values[0] }))}
                    min={3}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Resonance: {geometryState.resonanceFreq}Hz
                  </label>
                  <Slider
                    value={[geometryState.resonanceFreq]}
                    onValueChange={(values) => setGeometryState(prev => ({ ...prev, resonanceFreq: values[0] }))}
                    min={100}
                    max={1000}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Field Amplitude: {geometryState.fieldAmplitude.toFixed(1)}
                  </label>
                  <Slider
                    value={[geometryState.fieldAmplitude]}
                    onValueChange={(values) => setGeometryState(prev => ({ ...prev, fieldAmplitude: values[0] }))}
                    min={0.1}
                    max={3.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Animation Control */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardContent className="p-4">
                <Button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`w-full ${isAnimating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isAnimating ? '⏸️ Pause Animation' : '▶️ Start Animation'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sacred Geometry Canvas */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/80 border-slate-700">
              <CardContent className="p-6">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full border border-slate-600 rounded bg-slate-900"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Sacred Mathematics Engine Active</span>
              <span className="text-purple-400">Time: {time.toFixed(2)}s</span>
              <span className="text-slate-400">
                Active Forms: {Object.values(geometryState).filter(v => typeof v === 'boolean' && v).length}
              </span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SacredGeometryLive;