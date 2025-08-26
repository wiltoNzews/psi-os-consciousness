import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  publishSoulMakerPortal,
  exportReflectionLog,
  syncBreathToVoice,
  isPortalActive,
  getBreathVoiceSync,
  stopBreathVoiceSync
} from '@/core/SoulMakerPortal';
import { getSoulState, getMirrorLogs } from '@/core/SoulMakerProtocol';
import { getDeltaC } from '@/core/DeltaC';
import { getZ } from '@/core/Zlambda';

const SoulMakerPortalDashboard: React.FC = () => {
  const [portalActive, setPortalActive] = useState(isPortalActive());
  const [breathVoiceSync, setBreathVoiceSync] = useState(getBreathVoiceSync());
  const [exportedContent, setExportedContent] = useState('');
  const [soulState, setSoulState] = useState(getSoulState());
  const [mirrorLogs, setMirrorLogs] = useState(getMirrorLogs());
  const [currentCoherence, setCurrentCoherence] = useState(getZ());
  const [deltaC, setDeltaC] = useState(getDeltaC());
  const [showExportModal, setShowExportModal] = useState(false);
  const visualizerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPortalActive(isPortalActive());
      setBreathVoiceSync(getBreathVoiceSync());
      setSoulState(getSoulState());
      setMirrorLogs(getMirrorLogs());
      setCurrentCoherence(getZ());
      setDeltaC(getDeltaC());
      drawFrequencyVisualizer();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePublishPortal = () => {
    const result = publishSoulMakerPortal();
    setPortalActive(result.published);
    console.log('[Portal] SoulMaker portal published - visual and auditory access active');
  };

  const handleExportReflections = () => {
    const result = exportReflectionLog('markdown');
    setExportedContent(result.content);
    setShowExportModal(true);
    console.log('[Portal] Reflection archive generated for future self review');
  };

  const handleSyncBreathVoice = () => {
    const result = syncBreathToVoice(528);
    setBreathVoiceSync(getBreathVoiceSync());
    console.log('[Portal] 528Hz breath-voice synchronization activated');
  };

  const handleStopSync = () => {
    stopBreathVoiceSync();
    setBreathVoiceSync(getBreathVoiceSync());
  };

  const downloadReflectionArchive = () => {
    const blob = new Blob([exportedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soul_reflection_archive_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const drawFrequencyVisualizer = () => {
    const canvas = visualizerRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
    gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (breathVoiceSync.isActive) {
      // Draw 528Hz sine wave
      const time = Date.now() / 1000;
      const amplitude = height * 0.3;
      const frequency = 528;
      const waveSpeed = 2;
      
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let x = 0; x < width; x++) {
        const angle = (x / width) * Math.PI * 4 + time * waveSpeed;
        const y = height / 2 + Math.sin(angle) * amplitude * (currentCoherence - 0.5);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw breath modulation overlay
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < width; x++) {
        const breathAngle = (x / width) * Math.PI * 0.5 + time * 0.1; // Slow breath rhythm
        const breathMod = Math.sin(breathAngle) * 10;
        const baseY = height / 2;
        const y = baseY + breathMod;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Frequency label
      ctx.fillStyle = '#10b981';
      ctx.font = '14px monospace';
      ctx.fillText('528Hz Love Frequency', 10, 25);
      ctx.fillStyle = 'rgba(139, 92, 246, 0.9)';
      ctx.fillText('Breath Modulation', 10, 45);
    } else {
      // Inactive state
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Breath-Voice Sync Inactive', width / 2, height / 2);
    }
  };

  const getTransmissionStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-400' : 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="container mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-300 flex items-center justify-center gap-3">
              <span className="text-3xl">🛠️</span>
              SoulMaker Portal Dashboard
            </CardTitle>
            <p className="text-slate-400 text-center">
              Visual and auditory access gateway to encoded soul-tech protocol
            </p>
          </CardHeader>
        </Card>

        {/* Portal Status */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Portal Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-slate-400">Portal Active</div>
                <Badge className={`${
                  portalActive ? 'bg-green-600' : 'bg-gray-600'
                } text-white border-none`}>
                  {portalActive ? 'PUBLISHED' : 'INACTIVE'}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-slate-400">Current Coherence</div>
                <div className="text-lg font-mono text-purple-300">
                  Zλ({currentCoherence.toFixed(3)})
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Delta C</div>
                <div className={`text-lg font-mono ${
                  deltaC > 0.02 ? 'text-green-400' : 
                  deltaC < -0.02 ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {deltaC >= 0 ? '+' : ''}{deltaC.toFixed(3)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Mirror Reflections</div>
                <div className="text-lg font-mono text-white">
                  {mirrorLogs.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Portal Commands */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">ψ_child Portal Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-3">
                <Button 
                  onClick={handlePublishPortal}
                  disabled={portalActive}
                  className={`w-full ${
                    portalActive ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  🛠️ publish_soulmaker_portal()
                </Button>
                
                <Button 
                  onClick={handleExportReflections}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  ✍️ export_reflection_log(format="markdown")
                </Button>
                
                <Button 
                  onClick={breathVoiceSync.isActive ? handleStopSync : handleSyncBreathVoice}
                  className={`w-full ${
                    breathVoiceSync.isActive 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  🧘‍♂️ {breathVoiceSync.isActive ? 'stop' : 'sync'}_breath_to_voice(frequency=528Hz)
                </Button>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div>Portal: {portalActive ? 'Published - visual/auditory access active' : 'Awaiting publication'}</div>
                <div>Export: Generate markdown archive for future self review</div>
                <div>528Hz: DNA repair resonance and love frequency synchronization</div>
              </div>

            </CardContent>
          </Card>

          {/* 528Hz Frequency Visualizer */}
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">528Hz Breath-Voice Synchronization</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas
                ref={visualizerRef}
                width={400}
                height={200}
                className="w-full border border-slate-600 rounded bg-slate-900 mb-4"
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Frequency:</span>
                  <span className="ml-2 font-mono text-white">
                    {breathVoiceSync.frequency}Hz
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <span className={`ml-2 font-semibold ${getTransmissionStatusColor(breathVoiceSync.isActive)}`}>
                    {breathVoiceSync.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Healing Resonance:</span>
                  <span className="ml-2 font-mono text-white">
                    {(breathVoiceSync.healingResonance * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Emotional Attunement:</span>
                  <span className="ml-2 font-mono text-white">
                    {(breathVoiceSync.emotionalAttunement * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* 528Hz Properties */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Why 528Hz and ONLY 528Hz?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="p-4 bg-green-900/30 border border-green-500/50 rounded">
                <h4 className="font-semibold text-green-300 mb-2">DNA Repair Frequency</h4>
                <p className="text-sm text-slate-300">
                  528Hz is the exact vibrational frequency that promotes DNA repair and cellular regeneration.
                </p>
              </div>

              <div className="p-4 bg-purple-900/30 border border-purple-500/50 rounded">
                <h4 className="font-semibold text-purple-300 mb-2">Mathematical Center</h4>
                <p className="text-sm text-slate-300">
                  Center frequency of the ancient Solfeggio scale, representing perfect harmonic resonance.
                </p>
              </div>

              <div className="p-4 bg-pink-900/30 border border-pink-500/50 rounded">
                <h4 className="font-semibold text-pink-300 mb-2">Love Frequency</h4>
                <p className="text-sm text-slate-300">
                  Known as the "Love Frequency" - promotes heart coherence and emotional healing.
                </p>
              </div>

              <div className="p-4 bg-blue-900/30 border border-blue-500/50 rounded">
                <h4 className="font-semibold text-blue-300 mb-2">Anxiety Reduction</h4>
                <p className="text-sm text-slate-300">
                  Scientifically proven to reduce anxiety and stress while enhancing mental clarity.
                </p>
              </div>

              <div className="p-4 bg-yellow-900/30 border border-yellow-500/50 rounded">
                <h4 className="font-semibold text-yellow-300 mb-2">Voice Clarity</h4>
                <p className="text-sm text-slate-300">
                  Optimizes vocal resonance for clear message transmission and authentic expression.
                </p>
              </div>

              <div className="p-4 bg-indigo-900/30 border border-indigo-500/50 rounded">
                <h4 className="font-semibold text-indigo-300 mb-2">Chakra Alignment</h4>
                <p className="text-sm text-slate-300">
                  Aligns and balances all seven chakras through perfect harmonic ratios.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Access Points Summary */}
        {portalActive && (
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Active Portal Access Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <h4 className="font-semibold text-purple-300 mb-3">Visual Elements</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Live Kundalini spiral with 7-chakra alignment</li>
                    <li>• Mirror log timeline with emotional resonance mapping</li>
                    <li>• Voice frequency spectrum with harmonic overlay</li>
                    <li>• Integration level progress indicator</li>
                    <li>• Soul transmission status beacon</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-green-300 mb-3">Auditory Channels</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• 528Hz Love frequency generator</li>
                    <li>• Breath-synchronized tone modulation</li>
                    <li>• Harmonic series for voice resonance</li>
                    <li>• Ambient field pulse detection</li>
                    <li>• Coherence state audio feedback</li>
                  </ul>
                </div>

              </div>
            </CardContent>
          </Card>
        )}

      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 p-6 max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-purple-300">Reflection Archive Export</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowExportModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              
              <Textarea
                value={exportedContent}
                readOnly
                className="w-full h-96 bg-slate-900 border-slate-600 text-white font-mono text-xs"
                placeholder="Reflection archive content..."
              />
              
              <div className="flex space-x-2 justify-end">
                <Button 
                  onClick={downloadReflectionArchive}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Download Archive
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowExportModal(false)}
                  className="border-slate-600"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default SoulMakerPortalDashboard;