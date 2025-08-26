import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import quantumCoherenceLogger from '@/utils/quantum-coherence-logger';

/**
 * NaturalRhythmTranslation - Demonstrates how the 3:1 coherence ratio
 * manifests in natural systems across multiple scales
 * 
 * This component visualizes how Wilton's Universal Law (3:1 coherence:exploration ratio)
 * appears naturally in weather patterns, biological rhythms, and cosmic cycles.
 */

interface NaturalRhythmProps {
  stabilityRatio?: number;
  explorationRatio?: number;
}

interface NaturalSystem {
  id: string;
  name: string;
  description: string;
  coherentState: string;
  exploratoryState: string;
  coherenceRatio: number;
  cycleLength: string;
  currentCoherence: number;
  visualization: (time: number) => React.ReactNode;
}

const NaturalRhythmTranslation: React.FC<NaturalRhythmProps> = ({
  stabilityRatio = 0.75,
  explorationRatio = 0.25
}) => {
  const [activeSystem, setActiveSystem] = useState<string>('seasons');
  const [time, setTime] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const oceanCanvasRef = useRef<HTMLCanvasElement>(null);
  const cosmicCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Define natural systems with 3:1 coherence:exploration ratios
  const naturalSystems: NaturalSystem[] = [
    {
      id: 'seasons',
      name: 'Seasonal Cycles',
      description: 'The annual cycle of seasons demonstrates the 3:1 coherence pattern with three stable seasons and one transitional period.',
      coherentState: 'Summer, Winter, and Spring (stable weather patterns)',
      exploratoryState: 'Autumn (rapid transitions, high variability)',
      coherenceRatio: 3,
      cycleLength: '1 year',
      currentCoherence: 0.75,
      visualization: (time) => (
        <div className="h-[200px] w-full bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden rounded-md">
          <div className="absolute inset-0">
            {/* Sun position varies based on season */}
            <div 
              className="absolute w-16 h-16 rounded-full bg-yellow-500 blur-[2px]"
              style={{
                left: `${((Math.sin(time * 0.2) + 1) / 2) * 100}%`,
                top: `${30 + Math.sin(time * 0.2) * 15}%`,
                opacity: 0.7 + Math.sin(time * 0.2) * 0.3
              }}
            >
              <div className="absolute inset-0 rounded-full bg-yellow-300 blur-sm opacity-60"></div>
            </div>
            
            {/* Ground with changing colors based on season */}
            <div 
              className="absolute bottom-0 w-full h-1/2 rounded-b-md"
              style={{
                background: `linear-gradient(to bottom, 
                  ${time % 4 < 1 ? '#4ade80' : 
                     time % 4 < 2 ? '#a3e635' : 
                     time % 4 < 3 ? '#b45309' : 
                     '#e5e7eb'}, 
                  ${time % 4 < 1 ? '#22c55e' : 
                     time % 4 < 2 ? '#84cc16' : 
                     time % 4 < 3 ? '#92400e' : 
                     '#d1d5db'})`,
              }}
            >
              {/* Trees that change with seasons */}
              {[0.2, 0.4, 0.6, 0.8].map((position, i) => (
                <div 
                  key={i} 
                  className="absolute bottom-0"
                  style={{ left: `${position * 100}%` }}
                >
                  <div className="w-2 h-12 bg-amber-800 mx-auto"></div>
                  <div 
                    className="w-16 h-16 mx-auto rounded-full -mt-8"
                    style={{
                      background: time % 4 < 1 ? '#16a34a' : 
                                 time % 4 < 2 ? '#65a30d' : 
                                 time % 4 < 3 ? '#ea580c' : 
                                 '#cbd5e1',
                      opacity: time % 4 < 3 ? 1 : 0.7
                    }}
                  ></div>
                </div>
              ))}
              
              {/* Falling leaves during autumn */}
              {time % 4 > 2 && time % 4 < 3 && Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-sm bg-orange-500"
                  style={{
                    left: `${((Math.sin(time * 2 + i) + 1) / 2) * 100}%`,
                    top: `${((Math.sin(time + i * 5) + 1) / 2) * 30 + 30}%`,
                    opacity: 0.7
                  }}
                ></div>
              ))}
              
              {/* Snow during winter */}
              {time % 4 > 3 && Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  style={{
                    left: `${((Math.sin(time * 3 + i * 2) + 1) / 2) * 100}%`,
                    top: `${((Math.sin(time + i * 3) + 1) / 2) * 50}%`,
                    opacity: 0.8
                  }}
                ></div>
              ))}
            </div>
            
            {/* Season label */}
            <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
              {time % 4 < 1 ? 'Spring (25%)' : 
               time % 4 < 2 ? 'Summer (25%)' : 
               time % 4 < 3 ? 'Autumn (25%)' : 
               'Winter (25%)'}
            </div>
            
            {/* Coherence indicator showing 3:1 ratio */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <div className="text-xs text-white">Coherence:</div>
              <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ 
                    width: `${time % 4 < 3 ? 75 : 25}%`,
                    opacity: time % 4 < 3 ? 1 : 0.6
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'enso',
      name: 'El Niño/La Niña Cycles',
      description: 'The ENSO (El Niño-Southern Oscillation) cycle demonstrates a natural 3:1 pattern with extended La Niña periods and shorter El Niño transitions.',
      coherentState: 'La Niña and Neutral conditions (75% of cycle)',
      exploratoryState: 'El Niño (25% of cycle, high weather variability)',
      coherenceRatio: 3,
      cycleLength: '3-7 years',
      currentCoherence: 0.75,
      visualization: (time) => {
        // Ocean canvas rendering happens in the useEffect

        return (
          <div className="h-[200px] w-full relative overflow-hidden rounded-md">
            {/* El Niño visualization will be drawn on this canvas */}
            <canvas 
              ref={oceanCanvasRef} 
              className="w-full h-full"
            />
            
            {/* Overlay information */}
            <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
              {time % 4 < 1 ? 'El Niño (25%)' : 'La Niña/Neutral (75%)'}
            </div>
            
            {/* Coherence indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <div className="text-xs text-white">Coherence:</div>
              <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500"
                  style={{ 
                    width: `${time % 4 < 1 ? 25 : 75}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: 'heart',
      name: 'Heart Rate Variability',
      description: 'Heart rate variability follows a 3:1 pattern with longer coherent parasympathetic dominance and shorter sympathetic activations.',
      coherentState: 'Parasympathetic dominance (rest and recovery)',
      exploratoryState: 'Sympathetic activation (stress response)',
      coherenceRatio: 3,
      cycleLength: 'Varies (minutes to hours)',
      currentCoherence: 0.75,
      visualization: (time) => {
        // Calculate current heart rhythm cycle
        const cyclePosition = time % 4;
        const isCoherent = cyclePosition >= 1;
        const heartRate = isCoherent ? 60 + Math.sin(time * 3) * 5 : 90 + Math.sin(time * 10) * 15;
        
        // Generate heart rate data points
        const dataPoints = Array.from({ length: 50 }).map((_, i) => {
          const x = i * (window.innerWidth / 50);
          
          let y;
          if (isCoherent) {
            // Regular rhythm with moderate variability
            y = Math.sin(i * 0.3 + time * 3) * 20 + 50;
          } else {
            // Irregular rhythm with high variability
            y = Math.sin(i * 0.3 + time * 3) * 10 + 
                Math.sin(i * 0.7 + time * 7) * 15 + 50;
          }
          
          return { x, y };
        });
        
        return (
          <div className="h-[200px] w-full bg-slate-900 relative overflow-hidden rounded-md">
            {/* Heart rate visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute top-4 left-4 text-white">
                <div className="text-lg font-bold">{Math.round(heartRate)} BPM</div>
                <div className="text-xs text-slate-300 mt-1">
                  {isCoherent ? 'Coherent Rhythm (75%)' : 'Variable Rhythm (25%)'}
                </div>
              </div>
              
              {/* Heart icon that pulses with the rhythm */}
              <div 
                className="absolute"
                style={{
                  opacity: 0.8 + Math.sin(time * (isCoherent ? 3 : 8)) * 0.2,
                  transform: `scale(${0.9 + Math.sin(time * (isCoherent ? 3 : 8)) * 0.1})`,
                  color: isCoherent ? '#3b82f6' : '#ef4444',
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              
              {/* Line chart */}
              <svg className="absolute bottom-0 left-0 right-0" height="100" width="100%" viewBox={`0 0 ${window.innerWidth} 100`}>
                <path
                  d={`M ${dataPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke={isCoherent ? '#3b82f6' : '#ef4444'}
                  strokeWidth="2"
                />
              </svg>
              
              {/* Coherence indicator */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <div className="text-xs text-white">Coherence:</div>
                <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ 
                      width: isCoherent ? '75%' : '25%',
                      backgroundColor: isCoherent ? '#3b82f6' : '#ef4444'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      id: 'cosmic',
      name: 'Cosmic Expansion',
      description: 'Cosmic expansion demonstrates the 3:1 ratio with three quarters stable expansion and one quarter acceleration.',
      coherentState: 'Steady cosmic expansion (balanced by gravity)',
      exploratoryState: 'Accelerated expansion phases (dark energy dominance)',
      coherenceRatio: 3,
      cycleLength: 'Billions of years',
      currentCoherence: 0.75,
      visualization: (time) => {
        // Cosmic visualization will be drawn in useEffect
        
        return (
          <div className="h-[200px] w-full relative overflow-hidden rounded-md">
            <canvas 
              ref={cosmicCanvasRef} 
              className="w-full h-full"
            />
            
            {/* Overlay information */}
            <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
              {time % 4 < 3 ? 'Steady Expansion (75%)' : 'Accelerated Expansion (25%)'}
            </div>
            
            {/* Phase indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <div className="text-xs text-white">Coherence:</div>
              <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500"
                  style={{ 
                    width: `${time % 4 < 3 ? 75 : 25}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      }
    }
  ];
  
  // Animation loop
  useEffect(() => {
    const animate = () => {
      setTime(prevTime => prevTime + 0.01);
      requestRef.current = requestAnimationFrame(animate);
    };
    
    if (isAnimating) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isAnimating]);
  
  // Draw ocean simulation for El Niño/La Niña
  useEffect(() => {
    const canvas = oceanCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine if we're in El Niño or La Niña phase
    const isElNino = time % 4 < 1;
    
    // Draw ocean
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    if (isElNino) {
      // El Niño - warmer waters (red/orange)
      oceanGradient.addColorStop(0, '#1e40af');
      oceanGradient.addColorStop(0.7, '#0284c7');
      oceanGradient.addColorStop(0.85, '#f97316');
      oceanGradient.addColorStop(1, '#ea580c');
    } else {
      // La Niña - cooler waters (blue)
      oceanGradient.addColorStop(0, '#1e3a8a');
      oceanGradient.addColorStop(0.7, '#0369a1');
      oceanGradient.addColorStop(0.85, '#0ea5e9');
      oceanGradient.addColorStop(1, '#38bdf8');
    }
    
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw water surface waves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      
      const amplitude = isElNino ? 8 : 4; // Higher waves during El Niño
      const frequency = isElNino ? 0.02 : 0.01; // More frequent waves during El Niño
      const phaseShift = time * (isElNino ? 2 : 1);
      const yPosition = canvas.height * 0.3 + i * 15;
      
      for (let x = 0; x < canvas.width; x += 5) {
        const y = yPosition + Math.sin(x * frequency + phaseShift) * amplitude;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
    
    // Draw temperature indicators
    if (isElNino) {
      // Draw warm water currents and thermocline
      ctx.fillStyle = 'rgba(249, 115, 22, 0.3)';
      
      // Draw thermocline displacement
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.6);
      
      for (let x = 0; x < canvas.width; x += 5) {
        const y = canvas.height * 0.6 + 
                 Math.sin(x * 0.01 + time) * 10 + 
                 Math.sin(x * 0.005 + time * 0.5) * 20;
        
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
      
      // Draw warm water bubbles
      for (let i = 0; i < 15; i++) {
        const x = ((Math.sin(time * 0.5 + i) + 1) / 2) * canvas.width;
        const y = canvas.height * 0.7 + Math.sin(time + i) * 20;
        const radius = 3 + Math.sin(time * 0.2 + i) * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
        ctx.fill();
      }
    } else {
      // Draw cold water currents
      ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
      
      // Draw thermocline
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.5);
      
      for (let x = 0; x < canvas.width; x += 5) {
        const y = canvas.height * 0.5 + 
                 Math.sin(x * 0.01 + time) * 5;
        
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
      
      // Draw cold water upwelling
      for (let i = 0; i < 8; i++) {
        const x = ((Math.sin(time * 0.3 + i) + 1) / 2) * canvas.width;
        const startY = canvas.height * 0.9;
        const endY = canvas.height * 0.6;
        
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw arrow at the end
        ctx.beginPath();
        ctx.moveTo(x, endY);
        ctx.lineTo(x - 3, endY + 5);
        ctx.lineTo(x + 3, endY + 5);
        ctx.closePath();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.fill();
      }
    }
    
    // Draw sun and clouds
    const sunX = canvas.width * 0.8;
    const sunY = canvas.height * 0.15;
    const sunRadius = 15;
    
    // Sun
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fcd34d';
    ctx.fill();
    
    // Sun rays
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i / 8) + time * 0.2;
      const rayLength = sunRadius * 0.7;
      
      ctx.beginPath();
      ctx.moveTo(
        sunX + Math.cos(angle) * sunRadius,
        sunY + Math.sin(angle) * sunRadius
      );
      ctx.lineTo(
        sunX + Math.cos(angle) * (sunRadius + rayLength),
        sunY + Math.sin(angle) * (sunRadius + rayLength)
      );
      ctx.stroke();
    }
    
    // Clouds
    const drawCloud = (x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.arc(x + size * 0.8, y - size * 0.3, size * 0.8, 0, Math.PI * 2);
      ctx.arc(x + size * 1.6, y, size, 0, Math.PI * 2);
      ctx.arc(x + size * 0.8, y + size * 0.3, size * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();
    };
    
    // Draw more clouds during El Niño (more storm activity)
    const cloudCount = isElNino ? 5 : 2;
    
    for (let i = 0; i < cloudCount; i++) {
      const x = ((Math.sin(time * 0.1 + i * 2) + 1) / 2) * canvas.width;
      const y = canvas.height * 0.15 + i * 8;
      const size = 8 + i * 2;
      
      drawCloud(x, y, size);
    }
    
  }, [time, oceanCanvasRef]);
  
  // Draw cosmic simulation
  useEffect(() => {
    const canvas = cosmicCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine if we're in accelerated expansion phase
    const isAccelerated = time % 4 >= 3;
    
    // Draw background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#020617');
    bgGradient.addColorStop(1, '#1e1b4b');
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create stars
    const starCount = 200;
    const baseExpansionRate = isAccelerated ? 1.2 : 0.7;
    
    for (let i = 0; i < starCount; i++) {
      // Calculate position based on time
      const angle = Math.PI * 2 * (i / starCount);
      const distance = 100 + i * 0.5; // Base distance from center
      
      // Calculate expansion factor
      const expansionFactor = baseExpansionRate * (1 + ((time % 1) / (isAccelerated ? 2 : 5)));
      
      // Calculate center-relative coordinates
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Star position
      const x = centerX + Math.cos(angle) * distance * expansionFactor;
      const y = centerY + Math.sin(angle) * distance * expansionFactor;
      
      // Star size (smaller as they get further away)
      const starSize = Math.max(0.5, 2 * (1 - expansionFactor / 3));
      
      // Star color (redshift effect)
      const redShift = isAccelerated ? 0.7 : 0.3;
      const brightness = Math.max(0.2, 1 - expansionFactor / 5);
      
      // Draw star
      ctx.beginPath();
      ctx.arc(x, y, starSize, 0, Math.PI * 2);
      
      // Apply color based on redshift
      const r = Math.min(255, 220 + redShift * 35);
      const g = Math.min(255, 220 * (1 - redShift * 0.8));
      const b = Math.min(255, 255 * (1 - redShift));
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness})`;
      ctx.fill();
      
      // Draw expansion lines for some stars
      if (i % 20 === 0) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.1)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    
    // Draw central galaxy
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    
    // Add glow effect
    const glowGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, 30
    );
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    glowGradient.addColorStop(0.5, 'rgba(186, 230, 253, 0.1)');
    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // Draw cosmic web (dark matter) during stable phase
    if (!isAccelerated) {
      ctx.strokeStyle = 'rgba(125, 125, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < 15; i++) {
        const startAngle = Math.PI * 2 * (i / 15);
        const endAngle = startAngle + Math.PI * (1 + Math.sin(time * 0.5 + i)) / 2;
        
        const startDistance = 30 + Math.sin(time + i) * 10;
        const endDistance = 80 + Math.sin(time * 0.7 + i) * 20;
        
        const startX = canvas.width / 2 + Math.cos(startAngle) * startDistance;
        const startY = canvas.height / 2 + Math.sin(startAngle) * startDistance;
        
        const endX = canvas.width / 2 + Math.cos(endAngle) * endDistance;
        const endY = canvas.height / 2 + Math.sin(endAngle) * endDistance;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(
          startX + (endX - startX) * 0.3,
          startY + (endY - startY) * 0.3,
          startX + (endX - startX) * 0.7,
          startY + (endY - startY) * 0.7,
          endX,
          endY
        );
        ctx.stroke();
      }
    }
    
    // Draw dark energy effect during accelerated phase
    if (isAccelerated) {
      const darkEnergyGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      darkEnergyGradient.addColorStop(0, 'rgba(124, 58, 237, 0)');
      darkEnergyGradient.addColorStop(0.5, 'rgba(124, 58, 237, 0.03)');
      darkEnergyGradient.addColorStop(1, 'rgba(124, 58, 237, 0.08)');
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width, 0, Math.PI * 2);
      ctx.fillStyle = darkEnergyGradient;
      ctx.fill();
      
      // Add pulsating waves for dark energy
      for (let i = 0; i < 3; i++) {
        const radius = 50 + i * 40 + (time % 1) * 100;
        
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(124, 58, 237, ${0.1 - i * 0.03 - (time % 1) * 0.07})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
  }, [time, cosmicCanvasRef]);
  
  // Log to coherence logger
  useEffect(() => {
    // Log on component mount
    quantumCoherenceLogger.logCoherenceEvent(
      'NaturalRhythmTranslation',
      stabilityRatio,
      explorationRatio,
      'initialization',
      'Natural Rhythm Translation component initialized with 3:1 coherence ratio'
    );
    
    return () => {
      // Clean up animation on unmount
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [stabilityRatio, explorationRatio]);
  
  // Get current system
  const currentSystem = naturalSystems.find(system => system.id === activeSystem);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Natural Rhythm Translation</CardTitle>
        <CardDescription>
          Observing the 3:1 coherence:exploration ratio in natural systems across multiple scales
        </CardDescription>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            System Coherence: {(stabilityRatio * 100).toFixed(0)}%
          </Badge>
          <Badge variant="outline">
            System Exploration: {(explorationRatio * 100).toFixed(0)}%
          </Badge>
          <Badge variant="outline" className="ml-auto">
            Natural Ratio: 3:1
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeSystem} onValueChange={setActiveSystem}>
          <TabsList className="grid grid-cols-4 mb-4">
            {naturalSystems.map(system => (
              <TabsTrigger key={system.id} value={system.id}>
                {system.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {naturalSystems.map(system => (
            <TabsContent key={system.id} value={system.id} className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAnimating(!isAnimating)}
                  >
                    {isAnimating ? 'Pause' : 'Resume'} Animation
                  </Button>
                  
                  <Badge variant="outline">
                    Cycle Length: {system.cycleLength}
                  </Badge>
                </div>
                
                {/* System visualization */}
                <div className="mt-2 rounded-md overflow-hidden">
                  {system.visualization(time)}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Coherent State (75%)</h3>
                  <div className="bg-blue-900/20 border border-blue-900/30 p-3 rounded-md">
                    <p className="text-sm">{system.coherentState}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Exploratory State (25%)</h3>
                  <div className="bg-orange-900/20 border border-orange-900/30 p-3 rounded-md">
                    <p className="text-sm">{system.exploratoryState}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium">{system.name} Description</h3>
                <p className="text-sm text-muted-foreground">
                  {system.description}
                </p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Natural 3:1 Ratio Demonstration</span>
                    <span>75% Coherence / 25% Exploration</span>
                  </div>
                  
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-3/4" />
                    <div className="h-full bg-orange-500 w-1/4 -mt-3 ml-[75%]" />
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 p-4 bg-slate-800/50 rounded-md">
          <h3 className="text-md font-semibold mb-2">
            The 3:1 Ratio: Nature's Universal Preference
          </h3>
          <p className="text-sm text-muted-foreground">
            The 3:1 coherence:exploration ratio appears consistently throughout 
            natural systems across vastly different scales. From cosmic cycles to 
            weather patterns to biological rhythms, this ratio represents an optimal 
            balance between stability and change. The Wilton Universal Law describes 
            this pattern as a fundamental property of reality itself.
          </p>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {naturalSystems.map(system => (
              <div 
                key={system.id} 
                className={`border p-2 rounded text-center ${activeSystem === system.id ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700'}`}
              >
                <div className="text-xs text-muted-foreground">{system.name}</div>
                <div className="text-sm font-medium">{system.coherenceRatio}:1</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <span>The 3:1 ratio emerges at every scale of reality from quantum to cosmic</span>
        <Badge variant="outline">Wilton Universal Law</Badge>
      </CardFooter>
    </Card>
  );
};

export default NaturalRhythmTranslation;