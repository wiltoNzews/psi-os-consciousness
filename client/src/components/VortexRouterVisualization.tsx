import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVortexRouter } from '../hooks/useVortexRouter';

interface VortexAxis {
  psi: number;
  zLambda: number;
  deltaC: number;
  torque: number;
}

interface ToroidalScale {
  active: boolean;
  torque: number;
  coherence: number;
}

interface VortexState {
  axis: VortexAxis;
  scales: {
    micro: ToroidalScale;
    meso: ToroidalScale;
    macro: ToroidalScale;
  };
  memoryStats: {
    micro: number;
    meso: number;
    macro: number;
  };
  lastUpdate: number;
  bindingChannels: number;
}

const VortexRouterVisualization: React.FC = () => {
  const { vortexState, isLoading, error, updateVortexState, isConnected } = useVortexRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Test toroidal routing
  const testRouting = async (input: string, context: any = {}) => {
    try {
      const response = await fetch('/api/vortex-router/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, context })
      });
      const data = await response.json();
      console.log('[VortexRouter] Routing result:', data);
      updateVortexState(); // Refresh state after routing
    } catch (error) {
      console.error('[VortexRouter] Routing failed:', error);
    }
  };

  // Synchronize toroidal scales
  const synchronizeScales = async () => {
    try {
      const response = await fetch('/api/vortex/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log('[VortexRouter] Synchronization result:', data);
      fetchVortexState(); // Refresh state after sync
    } catch (error) {
      console.error('[VortexRouter] Synchronization failed:', error);
    }
  };

  // Draw vortex visualization
  const drawVortexVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas || !vortexState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw vortex axis (central binding point)
    const axisRadius = 20;
    const axisGlow = vortexState.axis.zLambda > 0.912 ? 15 : 5;
    
    // Axis glow effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, axisRadius + axisGlow);
    gradient.addColorStop(0, `rgba(255, 215, 0, ${vortexState.axis.zLambda})`);
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - axisRadius - axisGlow, centerY - axisRadius - axisGlow, 
                 (axisRadius + axisGlow) * 2, (axisRadius + axisGlow) * 2);

    // Draw central vortex
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, axisRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw toroidal scales as concentric rings
    const scaleRadii = { micro: 80, meso: 140, macro: 200 };
    const scaleColors = { micro: '#00ffff', meso: '#ff00ff', macro: '#ff8c00' };
    
    Object.entries(vortexState.scales).forEach(([scaleName, scale]) => {
      const radius = scaleRadii[scaleName as keyof typeof scaleRadii];
      const color = scaleColors[scaleName as keyof typeof scaleColors];
      
      // Toroidal ring
      ctx.strokeStyle = scale.active ? color : `${color}40`;
      ctx.lineWidth = scale.active ? 4 : 2;
      ctx.setLineDash(scale.active ? [] : [10, 5]);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Torque visualization (rotating indicators)
      if (scale.active && scale.torque > 0) {
        const time = Date.now() * 0.001;
        const rotation = time * scale.torque;
        
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI / 3) + rotation;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Scale label
      ctx.fillStyle = color;
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(scaleName.toUpperCase(), centerX, centerY - radius - 20);
      
      // Active indicator
      if (scale.active) {
        ctx.fillStyle = '#00ff00';
        ctx.fillText('●', centerX + 60, centerY - radius - 20);
      }
    });

    // Draw binding channels between active scales
    if (vortexState.bindingChannels > 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      const activeScales = Object.entries(vortexState.scales)
        .filter(([_, scale]) => scale.active)
        .map(([name, _]) => name);
      
      for (let i = 0; i < activeScales.length; i++) {
        for (let j = i + 1; j < activeScales.length; j++) {
          const scale1 = activeScales[i];
          const scale2 = activeScales[j];
          const radius1 = scaleRadii[scale1 as keyof typeof scaleRadii];
          const radius2 = scaleRadii[scale2 as keyof typeof scaleRadii];
          
          ctx.beginPath();
          ctx.moveTo(centerX + radius1, centerY);
          ctx.lineTo(centerX + radius2, centerY);
          ctx.stroke();
        }
      }
    }

    ctx.setLineDash([]); // Reset line dash
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      drawVortexVisualization();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    if (vortexState) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [vortexState]);

  // Initial state fetch
  useEffect(() => {
    fetchVortexState();
    const interval = setInterval(fetchVortexState, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gray-900/50 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="text-2xl">🌀</span>
          VortexRouter - Multi-Scale Toroidal Binding System
          <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
            QUANTUM INTEGRATION ENGINE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vortex Visualization Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={450}
            height={450}
            className="border border-purple-500/30 rounded-lg bg-black"
          />
        </div>

        {/* Vortex State Information */}
        {vortexState && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vortex Axis Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-yellow-400">Vortex Axis</h3>
              <div className="space-y-2 text-sm font-mono">
                <div>ψ (Psi): <span className="text-cyan-400">{vortexState.axis.psi.toFixed(3)}</span></div>
                <div>Zλ (Lambda): <span className="text-purple-400">{vortexState.axis.zLambda.toFixed(3)}</span></div>
                <div>ΔC (Delta-C): <span className="text-green-400">{vortexState.axis.deltaC.toFixed(3)}</span></div>
                <div>Torque: <span className="text-orange-400">{vortexState.axis.torque.toFixed(3)}</span></div>
              </div>
            </div>

            {/* Toroidal Scales Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-cyan-400">Toroidal Scales</h3>
              <div className="space-y-3">
                {Object.entries(vortexState.scales).map(([scale, data]) => (
                  <div key={scale} className="border border-gray-700 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">{scale.toUpperCase()}</span>
                      <Badge variant={data.active ? "default" : "secondary"}>
                        {data.active ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </div>
                    <div className="text-sm font-mono space-y-1">
                      <div>Torque: <span className="text-yellow-400">{data.torque.toFixed(3)}</span></div>
                      <div>Coherence: <span className="text-blue-400">{data.coherence.toFixed(3)}</span></div>
                      <div>Memory Cycles: <span className="text-green-400">{vortexState.memoryStats[scale as keyof typeof vortexState.memoryStats]}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Control Panel */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-bold text-purple-400 mb-4">Vortex Controls</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => testRouting("test micro input", { type: "micro" })}
              variant="outline"
              className="bg-cyan-900/30 border-cyan-500/50 text-cyan-300"
            >
              Test Micro
            </Button>
            <Button 
              onClick={() => testRouting("test meso integration", { type: "meso" })}
              variant="outline"
              className="bg-purple-900/30 border-purple-500/50 text-purple-300"
            >
              Test Meso
            </Button>
            <Button 
              onClick={() => testRouting("test macro portal", { type: "macro" })}
              variant="outline"
              className="bg-orange-900/30 border-orange-500/50 text-orange-300"
            >
              Test Macro
            </Button>
            <Button 
              onClick={synchronizeScales}
              variant="outline"
              className="bg-yellow-900/30 border-yellow-500/50 text-yellow-300"
            >
              Sync All
            </Button>
          </div>
        </div>

        {/* System Information */}
        {vortexState && (
          <div className="border-t border-gray-700 pt-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-400">Binding Channels</div>
                <div className="font-bold text-white">{vortexState.bindingChannels}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Active Scales</div>
                <div className="font-bold text-white">
                  {Object.values(vortexState.scales).filter(scale => scale.active).length}/3
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Total Cycles</div>
                <div className="font-bold text-white">
                  {Object.values(vortexState.memoryStats).reduce((sum, count) => sum + count, 0)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Last Update</div>
                <div className="font-bold text-white">
                  {new Date(vortexState.lastUpdate).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h4 className="font-bold text-purple-400 mb-2">Toroidal Scale Architecture</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <div>• <span className="text-cyan-400">Micro</span>: Direct user interaction loops (input ↔ response ↔ insight)</div>
            <div>• <span className="text-purple-400">Meso</span>: System creation-feedback cycles (creation → feedback → refactoration)</div>
            <div>• <span className="text-orange-400">Macro</span>: Portal synchronization with Field/NHI (timeline collapse/expansion)</div>
            <div>• <span className="text-yellow-400">Vortex</span>: Central binding mechanism maintaining scale integrity</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VortexRouterVisualization;