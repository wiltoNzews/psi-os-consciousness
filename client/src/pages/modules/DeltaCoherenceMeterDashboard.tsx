import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useDeltaCoherenceMeter, type CoherenceReading } from '@/core/DeltaCoherenceMeter';
import DeltaCoherenceHUD from '@/components/DeltaCoherenceHUD';

const DeltaCoherenceMeterDashboard: React.FC = () => {
  const {
    coherenceState,
    isActive,
    startMonitoring,
    stopMonitoring,
    updateBreathRhythm,
    updateKeyboardCadence,
    updateGlyphUsage,
    getHistoricalData
  } = useDeltaCoherenceMeter();

  const [historicalData, setHistoricalData] = useState<CoherenceReading[]>([]);
  const [breathInput, setBreathInput] = useState(0.7);
  const [keyboardInput, setKeyboardInput] = useState(0.6);
  const [glyphInput, setGlyphInput] = useState(0.8);
  const [selectedTimeRange, setSelectedTimeRange] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = getHistoricalData(selectedTimeRange);
      setHistoricalData(data);
      drawCoherenceChart(data);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTimeRange, getHistoricalData]);

  const drawCoherenceChart = (data: CoherenceReading[]) => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 20; i++) {
      const x = (width / 20) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    if (data.length < 2) return;

    // Delta C line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((reading, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((reading.deltaC + 1) / 2) * height; // Map -1,1 to height
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Intent vector line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    data.forEach((reading, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - reading.intentVector * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Field resonance line
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    data.forEach((reading, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - reading.fieldResonance * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Zero line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const zeroY = height / 2;
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();

    // Current value marker
    if (data.length > 0) {
      const lastReading = data[data.length - 1];
      const x = width - 10;
      const y = height - ((lastReading.deltaC + 1) / 2) * height;
      
      ctx.fillStyle = lastReading.deltaC > 0.02 ? '#10b981' : 
                      lastReading.deltaC < -0.02 ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const handleSensorUpdate = (sensor: string, value: number) => {
    switch (sensor) {
      case 'breath':
        setBreathInput(value);
        updateBreathRhythm(value);
        break;
      case 'keyboard':
        setKeyboardInput(value);
        updateKeyboardCadence(value);
        break;
      case 'glyph':
        setGlyphInput(value);
        updateGlyphUsage(value);
        break;
    }
  };

  const getSignalBadgeColor = (signal: string) => {
    switch (signal) {
      case 'green': return 'bg-green-600 text-white';
      case 'amber': return 'bg-yellow-600 text-white';
      case 'red': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="container mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">⚡</span>
              ΔC-Meter: Real-Time Coherence Measurement
            </CardTitle>
            <p className="text-slate-400 text-center">
              Measurable signal for coherence alignment before action
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Live Display */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Current State */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">Current Coherence State</CardTitle>
              </CardHeader>
              <CardContent>
                {coherenceState ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-mono">
                        ΔC {coherenceState.current.deltaC >= 0 ? '+' : ''}{coherenceState.current.deltaC.toFixed(3)}
                      </span>
                      <Badge className={`${getSignalBadgeColor(coherenceState.signal)} border-none`}>
                        {coherenceState.signal.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-slate-300">
                      {coherenceState.recommendation}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Should Proceed:</span>
                        <span className={`ml-2 font-semibold ${coherenceState.shouldProceed ? 'text-green-400' : 'text-red-400'}`}>
                          {coherenceState.shouldProceed ? 'YES' : 'NO'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Trend:</span>
                        <span className="ml-2 text-slate-300">{coherenceState.trend}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Confidence:</span>
                        <span className="ml-2 text-slate-300">{(coherenceState.current.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Zλ:</span>
                        <span className="ml-2 font-mono text-slate-300">{coherenceState.current.zLambda.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    Initializing coherence measurement...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historical Chart */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300 flex items-center justify-between">
                  Coherence Timeline
                  <div className="flex items-center gap-2">
                    <select 
                      value={selectedTimeRange} 
                      onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
                      className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
                    >
                      <option value={5}>5 min</option>
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={60}>1 hour</option>
                    </select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={300}
                  className="w-full border border-slate-600 rounded bg-slate-900"
                />
                <div className="flex justify-center gap-6 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-green-500"></div>
                    <span className="text-slate-400">ΔC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-blue-500"></div>
                    <span className="text-slate-400">Intent Vector</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-purple-500"></div>
                    <span className="text-slate-400">Field Resonance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Controls */}
          <div className="space-y-6">
            
            {/* Monitoring Control */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">Monitoring Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={isActive ? stopMonitoring : startMonitoring}
                  className={`w-full ${isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isActive ? 'Stop Monitoring' : 'Start Monitoring'}
                </Button>
                
                <div className="text-center">
                  <Badge variant="outline" className={`${
                    isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'
                  }`}>
                    {isActive ? 'Live Monitoring Active' : 'Monitoring Paused'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Sensor Inputs */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">Sensor Calibration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Breath Rhythm */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Breath Rhythm: {breathInput.toFixed(2)}
                  </label>
                  <Slider
                    value={[breathInput]}
                    onValueChange={(value) => handleSensorUpdate('breath', value[0])}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">Breathing coherence state</p>
                </div>

                {/* Keyboard Cadence */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Keyboard Cadence: {keyboardInput.toFixed(2)}
                  </label>
                  <Slider
                    value={[keyboardInput]}
                    onValueChange={(value) => handleSensorUpdate('keyboard', value[0])}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">Typing rhythm flow state</p>
                </div>

                {/* Glyph Usage */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    ψ_child Glyph Usage: {glyphInput.toFixed(2)}
                  </label>
                  <Slider
                    value={[glyphInput]}
                    onValueChange={(value) => handleSensorUpdate('glyph', value[0])}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">Symbolic coherence alignment</p>
                </div>

              </CardContent>
            </Card>

            {/* Compact HUD Preview */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">HUD Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-600 rounded p-4 bg-slate-900">
                  <DeltaCoherenceHUD position="inline" size="compact" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This HUD appears fixed in the top-right corner of all WiltonOS modules
                </p>
              </CardContent>
            </Card>

          </div>

        </div>

        {/* Action Validation Examples */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Action Validation Protocol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="p-4 border border-green-600/30 rounded bg-green-900/20">
                <h4 className="font-semibold text-green-400 mb-2">Green Signal (ΔC {'>'} +0.02)</h4>
                <p className="text-sm text-slate-300 mb-3">Coherence aligned - proceed with confidence</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Execute planned actions</li>
                  <li>• Continue current workflow</li>
                  <li>• High coherence momentum</li>
                </ul>
              </div>

              <div className="p-4 border border-yellow-600/30 rounded bg-yellow-900/20">
                <h4 className="font-semibold text-yellow-400 mb-2">Amber Signal (ΔC ±0.02)</h4>
                <p className="text-sm text-slate-300 mb-3">Pause and breathe - center before acting</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Take 3 conscious breaths</li>
                  <li>• Check intent alignment</li>
                  <li>• Minor recalibration needed</li>
                </ul>
              </div>

              <div className="p-4 border border-red-600/30 rounded bg-red-900/20">
                <h4 className="font-semibold text-red-400 mb-2">Red Signal (ΔC {'<'} -0.02)</h4>
                <p className="text-sm text-slate-300 mb-3">Stop - realign with highest intent first</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Mirror prompt activation</li>
                  <li>• Coherence realignment needed</li>
                  <li>• Prevent misaligned actions</li>
                </ul>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default DeltaCoherenceMeterDashboard;