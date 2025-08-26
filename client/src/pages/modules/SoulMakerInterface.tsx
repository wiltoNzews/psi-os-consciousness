import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  encodeSoulTechProtocol, 
  getSoulState, 
  getKundaliniPattern, 
  getMirrorLogs, 
  isSoulTransmitting 
} from '@/core/SoulMakerProtocol';
import { getDeltaC, getCoherenceState } from '@/core/DeltaC';
import { getZ } from '@/core/Zlambda';

const SoulMakerInterface: React.FC = () => {
  const [soulState, setSoulState] = useState(getSoulState());
  const [kundaliniPattern, setKundaliniPattern] = useState<number[]>([]);
  const [mirrorLogs, setMirrorLogs] = useState(getMirrorLogs());
  const [isTransmitting, setIsTransmitting] = useState(isSoulTransmitting());
  const [coherenceData, setCoherenceData] = useState(getCoherenceState());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSoulState(getSoulState());
      setKundaliniPattern(getKundaliniPattern());
      setMirrorLogs(getMirrorLogs());
      setIsTransmitting(isSoulTransmitting());
      setCoherenceData(getCoherenceState());
      drawKundaliniSpiral();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const drawKundaliniSpiral = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width/2);
    gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw Kundalini spiral
    const spiral = soulState.kundaliniSpiral;
    const time = Date.now() / 1000;
    
    ctx.strokeStyle = `rgba(147, 51, 234, ${spiral.coherence})`;
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i < 720; i += 5) {
      const angle = (i * Math.PI) / 180;
      const radius = (i / 720) * (Math.min(width, height) / 3);
      const spiralOffset = Math.sin(angle * 3 + time * spiral.frequency) * spiral.amplitude * 20;
      
      const x = centerX + Math.cos(angle) * (radius + spiralOffset);
      const y = centerY + Math.sin(angle) * (radius + spiralOffset);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw chakra points
    const chakraColors = [
      '#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff', '#ff00ff'
    ];
    
    spiral.chakraAlignment.forEach((alignment, index) => {
      const angle = (index / 7) * 2 * Math.PI;
      const radius = 80 + index * 15;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.fillStyle = chakraColors[index];
      ctx.globalAlpha = alignment;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Center point - soul transmission indicator
    ctx.fillStyle = isTransmitting ? '#10b981' : '#6b7280';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
    ctx.fill();
    
    if (isTransmitting) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20 + Math.sin(time * 4) * 5, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const getTransmissionModeColor = (mode: string) => {
    switch (mode) {
      case 'transmitting': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'receiving': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getEmotionalResonanceColor = (resonance: string) => {
    switch (resonance) {
      case 'transmission': return 'text-green-400';
      case 'integration': return 'text-blue-400';
      case 'compassion': return 'text-purple-400';
      case 'projection': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="container mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">🧬</span>
              SoulMaker Protocol Interface
            </CardTitle>
            <p className="text-slate-400 text-center">
              Post-awakening soul-tech integration system
            </p>
          </CardHeader>
        </Card>

        {/* Protocol Status */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Protocol Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-slate-400">Active</div>
                <Badge className={`${
                  soulState.isActive ? 'bg-green-600' : 'bg-gray-600'
                } text-white border-none`}>
                  {soulState.isActive ? 'LIVE' : 'INACTIVE'}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-slate-400">Integration Level</div>
                <div className="text-lg font-mono text-purple-300">
                  {(soulState.integrationLevel * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Transmission Mode</div>
                <div className={`text-sm font-semibold ${getTransmissionModeColor(soulState.transmissionMode)}`}>
                  {soulState.transmissionMode.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Soul Transmission</div>
                <Badge className={`${
                  isTransmitting ? 'bg-green-600' : 'bg-gray-600'
                } text-white border-none`}>
                  {isTransmitting ? 'ACTIVE' : 'STANDBY'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Kundalini Spiral Visualization */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Kundalini Spiral Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full border border-slate-600 rounded bg-slate-900"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Frequency:</span>
                  <span className="ml-2 font-mono text-white">
                    {soulState.kundaliniSpiral.frequency.toFixed(2)} Hz
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Amplitude:</span>
                  <span className="ml-2 font-mono text-white">
                    {soulState.kundaliniSpiral.amplitude.toFixed(3)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Coherence:</span>
                  <span className="ml-2 font-mono text-white">
                    {soulState.kundaliniSpiral.coherence.toFixed(3)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Chakra Avg:</span>
                  <span className="ml-2 font-mono text-white">
                    {(soulState.kundaliniSpiral.chakraAlignment.reduce((a, b) => a + b, 0) / 7).toFixed(3)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Resonance */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Voice Resonance Harmonics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Base Frequency:</span>
                  <span className="ml-2 font-mono text-white">
                    {soulState.voiceResonance.frequency.toFixed(1)} Hz
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Breath Sync:</span>
                  <span className="ml-2 font-mono text-white">
                    {(soulState.voiceResonance.breathSync * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Intent Clarity:</span>
                  <span className="ml-2 font-mono text-white">
                    {(soulState.voiceResonance.intentClarity * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Soul Transmission:</span>
                  <Badge className={`${
                    soulState.voiceResonance.soulTransmission ? 'bg-green-600' : 'bg-gray-600'
                  } text-white border-none text-xs`}>
                    {soulState.voiceResonance.soulTransmission ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-400 mb-2">Harmonic Series:</div>
                <div className="space-y-1">
                  {soulState.voiceResonance.harmonics.map((harmonic, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-12 text-xs text-slate-500">H{index + 2}:</div>
                      <div className="flex-1 bg-slate-700 rounded h-2 mr-2">
                        <div 
                          className="bg-purple-500 h-2 rounded"
                          style={{ width: `${(harmonic / soulState.voiceResonance.harmonics[3]) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs font-mono text-white w-16">
                        {harmonic.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Mirror Logs */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">
              Mirror Reflection Logs ({mirrorLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mirrorLogs.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No mirror reflections logged yet
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {mirrorLogs.slice(-10).reverse().map((log, index) => (
                  <div key={index} className="p-3 bg-slate-700/50 rounded border border-slate-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium text-white">
                        "{log.reflection}"
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getEmotionalResonanceColor(log.emotionalResonance)}`}
                      >
                        {log.emotionalResonance}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                      <div>
                        <span className="text-slate-500">Time:</span><br/>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                      <div>
                        <span className="text-slate-500">ΔC:</span><br/>
                        {log.deltaC.toFixed(3)}
                      </div>
                      <div>
                        <span className="text-slate-500">Mirror Depth:</span><br/>
                        {log.mirrorDepth.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Integration Insights */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Soul-Tech Integration Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 bg-purple-900/30 border border-purple-500/50 rounded">
                <h4 className="font-semibold text-purple-300 mb-2">Post-Awakening State</h4>
                <p className="text-sm text-slate-300 mb-2">
                  You have already lived the awakening without formal training.
                </p>
                <div className="text-xs text-slate-400">
                  Integration Level: {(soulState.integrationLevel * 100).toFixed(1)}%
                </div>
              </div>

              <div className="p-4 bg-blue-900/30 border border-blue-500/50 rounded">
                <h4 className="font-semibold text-blue-300 mb-2">Mirror Integration</h4>
                <p className="text-sm text-slate-300 mb-2">
                  Projection transformed into compassion through reflective awareness.
                </p>
                <div className="text-xs text-slate-400">
                  Mirror Logs: {mirrorLogs.length} reflections
                </div>
              </div>

              <div className="p-4 bg-green-900/30 border border-green-500/50 rounded">
                <h4 className="font-semibold text-green-300 mb-2">Soul Transmission</h4>
                <p className="text-sm text-slate-300 mb-2">
                  Ready for "soul share" phase - encoding awakening for others.
                </p>
                <div className="text-xs text-slate-400">
                  Status: {isTransmitting ? 'Transmitting' : 'Standby'}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SoulMakerInterface;