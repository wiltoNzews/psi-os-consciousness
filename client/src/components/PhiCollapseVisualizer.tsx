import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PhiCollapseData {
  lightIntensity: number;
  zLambda: number;
  divineInterfaceActive: boolean;
  temporalFlow: {
    temporal: number;
    spatial_x: number;
    spatial_y: number;
    spatial_z: number;
    fifth_dim: number;
  };
  collapseGeometry: {
    convergenceRate: number;
    vortexStrength: number;
    collapseType: string;
  };
}

interface VisualizationData {
  featherData: {
    intensity: number;
    phase: number;
    color: string;
    frequency: number;
  };
  vortexData: {
    convergence: number;
    strength: number;
    type: string;
    temporalFlow: any;
  };
  geometryData: {
    divineActive: boolean;
    lightBurst: boolean;
    coherenceLevel: number;
  };
}

export function PhiCollapseVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phiData, setPhiData] = useState<PhiCollapseData | null>(null);
  const [vizData, setVizData] = useState<VisualizationData | null>(null);
  const [eventHistory, setEventHistory] = useState<Array<{timestamp: number, intensity: number, zLambda: number}>>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const fetchPhiCollapseData = async () => {
      try {
        const response = await fetch('/api/phi-collapse/state');
        const data = await response.json();
        
        if (data.lightEmission?.lastEmission) {
          setPhiData(data.lightEmission.lastEmission);
          setEventHistory(data.lightEmission.emissionHistory || []);
        }
        
        if (data.visualization) {
          setVizData(data.visualization);
        }
      } catch (error) {
        console.error('Failed to fetch phi-collapse data:', error);
      }
    };

    fetchPhiCollapseData();
    const interval = setInterval(fetchPhiCollapseData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !phiData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = Date.now() * 0.001;

      // Divine interface glow
      if (phiData.divineInterfaceActive) {
        const glowRadius = 50 + Math.sin(time * 2) * 20;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
        gradient.addColorStop(0, `rgba(255, 215, 0, ${phiData.lightIntensity * 0.1})`);
        gradient.addColorStop(0.5, `rgba(255, 215, 0, ${phiData.lightIntensity * 0.05})`);
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Temporal flow visualization
      if (phiData.temporalFlow) {
        const flow = phiData.temporalFlow;
        
        // Draw temporal vectors
        ctx.strokeStyle = phiData.divineInterfaceActive ? '#FFD700' : '#4A90E2';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;

        // Temporal component - central spiral
        ctx.beginPath();
        for (let i = 0; i < 100; i++) {
          const angle = (i * 0.1) + (flow.temporal * time);
          const radius = i * 2 + Math.sin(angle * 3) * 10;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Fifth dimension coupling - outer rings
        if (Math.abs(flow.fifth_dim) > 0.1) {
          ctx.strokeStyle = '#9D4EDD';
          ctx.lineWidth = 1;
          
          for (let ring = 1; ring <= 3; ring++) {
            ctx.beginPath();
            const ringRadius = 100 + (ring * 30) + (flow.fifth_dim * 50);
            ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // Light emission burst effect
      if (phiData.lightIntensity > 0.1) {
        const burstSize = phiData.lightIntensity * 10;
        const pulsePhase = Math.sin(time * 5) * 0.5 + 0.5;
        
        ctx.globalAlpha = pulsePhase;
        ctx.strokeStyle = phiData.divineInterfaceActive ? '#FFD700' : '#FFFFFF';
        ctx.lineWidth = 3;
        
        // Radial burst lines
        for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI * 2 / 12) + (time * 0.5);
          const startRadius = 20;
          const endRadius = startRadius + burstSize;
          
          const startX = centerX + Math.cos(angle) * startRadius;
          const startY = centerY + Math.sin(angle) * startRadius;
          const endX = centerX + Math.cos(angle) * endRadius;
          const endY = centerY + Math.sin(angle) * endRadius;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }

      // Vortex convergence visualization
      if (phiData.collapseGeometry?.convergenceRate > 0.5) {
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        
        const convergence = phiData.collapseGeometry.convergenceRate;
        const spiralTightness = convergence * 5;
        
        ctx.beginPath();
        for (let i = 0; i < 200; i++) {
          const angle = i * 0.1 * spiralTightness;
          const radius = (200 - i) * convergence;
          const x = centerX + Math.cos(angle + time) * radius;
          const y = centerY + Math.sin(angle + time) * radius;
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phiData]);

  const getIntensityColor = (intensity: number) => {
    if (intensity > 7) return 'text-yellow-400';
    if (intensity > 4) return 'text-orange-400';
    if (intensity > 1) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Real-time Visualization Canvas */}
      <Card className="bg-black/90 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-300">ϕ-Collapse Light Emission</CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full h-auto border border-purple-500/20 rounded-lg"
          />
          
          {phiData && (
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Light Intensity:</span>
                <span className={getIntensityColor(phiData.lightIntensity)}>
                  {phiData.lightIntensity.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Zλ Coherence:</span>
                <span className="text-green-400">{phiData.zLambda.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>Divine Interface:</span>
                <span className={phiData.divineInterfaceActive ? 'text-yellow-400' : 'text-gray-400'}>
                  {phiData.divineInterfaceActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
              {phiData.collapseGeometry && (
                <div className="flex justify-between">
                  <span>Collapse Type:</span>
                  <span className="text-cyan-400">{phiData.collapseGeometry.collapseType}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Temporal Flow Data */}
      <Card className="bg-black/90 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-300">Temporal Flow Vectors</CardTitle>
        </CardHeader>
        <CardContent>
          {phiData?.temporalFlow && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400">Temporal Component</div>
                  <div className="text-white font-mono">
                    {phiData.temporalFlow.temporal.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Fifth Dimension</div>
                  <div className="text-purple-400 font-mono">
                    {phiData.temporalFlow.fifth_dim.toFixed(4)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-gray-400 text-xs">Spatial X</div>
                  <div className="text-cyan-300 font-mono text-xs">
                    {phiData.temporalFlow.spatial_x.toFixed(3)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Spatial Y</div>
                  <div className="text-cyan-300 font-mono text-xs">
                    {phiData.temporalFlow.spatial_y.toFixed(3)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Spatial Z</div>
                  <div className="text-cyan-300 font-mono text-xs">
                    {phiData.temporalFlow.spatial_z.toFixed(3)}
                  </div>
                </div>
              </div>

              {phiData.collapseGeometry && (
                <div className="mt-4 p-3 bg-gray-900/50 rounded">
                  <div className="text-gray-400 text-xs mb-2">Collapse Geometry</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Convergence Rate:</span>
                      <span className="text-red-400">
                        {phiData.collapseGeometry.convergenceRate.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Vortex Strength:</span>
                      <span className="text-orange-400">
                        {phiData.collapseGeometry.vortexStrength.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event History */}
      <Card className="bg-black/90 border-green-500/30 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-green-300">Recent Light Emission Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-40 overflow-y-auto text-xs font-mono">
            {eventHistory.slice(-10).reverse().map((event, index) => (
              <div key={index} className="flex justify-between items-center py-1 border-b border-gray-800">
                <span className="text-gray-400">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-cyan-400">
                  Zλ: {event.zLambda.toFixed(3)}
                </span>
                <span className={getIntensityColor(event.intensity)}>
                  Intensity: {event.intensity.toFixed(4)}
                </span>
              </div>
            ))}
            {eventHistory.length === 0 && (
              <div className="text-gray-500 text-center py-4">
                Waiting for light emission events...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}