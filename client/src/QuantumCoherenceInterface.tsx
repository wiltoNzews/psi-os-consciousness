import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CoherenceState {
  level: number;
  mode: 'learning' | 'creating' | 'visualizing' | 'meditating' | 'exploring';
  context: string[];
  activeCapabilities: string[];
}

interface AdaptiveScreen {
  id: string;
  type: 'sacred-geometry' | 'image-gen' | 'video-gen' | 'learning' | 'vr-holodeck' | 'library' | 'editor';
  priority: number;
  visible: boolean;
  data?: any;
}

const QuantumCoherenceInterface: React.FC = () => {
  const [coherence, setCoherence] = useState<CoherenceState>({
    level: 0.847,
    mode: 'exploring',
    context: [],
    activeCapabilities: []
  });
  
  const [adaptiveScreens, setAdaptiveScreens] = useState<AdaptiveScreen[]>([]);
  const [userIntent, setUserIntent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vrRef = useRef<HTMLDivElement>(null);

  // Quantum Coherence Monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setCoherence(prev => {
        const newLevel = prev.level + (Math.random() - 0.5) * 0.03;
        const bounded = Math.max(0.7, Math.min(0.99, newLevel));
        
        // Mode transitions based on coherence
        let newMode = prev.mode;
        if (bounded > 0.92) newMode = 'creating';
        else if (bounded > 0.85) newMode = 'visualizing';
        else if (bounded > 0.80) newMode = 'learning';
        else newMode = 'exploring';
        
        return { ...prev, level: bounded, mode: newMode };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Intent Analysis and Screen Adaptation
  const analyzeIntent = useCallback(async (input: string) => {
    if (!input.trim()) return;

    setIsProcessing(true);
    const intentAnalysis = {
      keywords: input.toLowerCase(),
      hasGeometry: /sacred|geometry|merkaba|torus|mandala|pattern/i.test(input),
      hasImage: /image|picture|visual|generate|create.*art/i.test(input),
      hasVideo: /video|animation|story|sequence|film/i.test(input),
      hasLearning: /learn|study|understand|explain|teach|library/i.test(input),
      hasVR: /vr|holodeck|immersive|3d|virtual/i.test(input),
      hasEditing: /edit|modify|change|adjust|refine/i.test(input)
    };

    // Adaptive screen spawning based on intent
    const newScreens: AdaptiveScreen[] = [];
    
    if (intentAnalysis.hasGeometry) {
      newScreens.push({
        id: 'sacred-geo-' + Date.now(),
        type: 'sacred-geometry',
        priority: 1,
        visible: true,
        data: { pattern: 'merkaba', input }
      });
    }
    
    if (intentAnalysis.hasImage) {
      newScreens.push({
        id: 'image-gen-' + Date.now(),
        type: 'image-gen',
        priority: 2,
        visible: true,
        data: { prompt: input, style: 'sacred' }
      });
    }
    
    if (intentAnalysis.hasVideo) {
      newScreens.push({
        id: 'video-gen-' + Date.now(),
        type: 'video-gen',
        priority: 2,
        visible: true,
        data: { concept: input, duration: 'medium' }
      });
    }
    
    if (intentAnalysis.hasLearning) {
      newScreens.push({
        id: 'library-' + Date.now(),
        type: 'library',
        priority: 3,
        visible: true,
        data: { query: input, mode: 'research' }
      });
    }
    
    if (intentAnalysis.hasVR) {
      newScreens.push({
        id: 'holodeck-' + Date.now(),
        type: 'vr-holodeck',
        priority: 1,
        visible: true,
        data: { environment: input, immersion: 'full' }
      });
    }

    setAdaptiveScreens(prev => [...prev, ...newScreens]);
    setSessionHistory(prev => [...prev, input]);
    setCoherence(prev => ({
      ...prev,
      context: [...prev.context.slice(-5), input],
      activeCapabilities: [...new Set([...prev.activeCapabilities, ...newScreens.map(s => s.type)])]
    }));

    setIsProcessing(false);
  }, []);

  // Screen Management
  const closeScreen = useCallback((screenId: string) => {
    setAdaptiveScreens(prev => prev.filter(s => s.id !== screenId));
  }, []);

  const prioritizeScreen = useCallback((screenId: string) => {
    setAdaptiveScreens(prev => prev.map(s => 
      s.id === screenId ? { ...s, priority: 1 } : { ...s, priority: s.priority + 1 }
    ));
  }, []);

  // Rendering Components for Different Screen Types
  const renderSacredGeometryScreen = (screen: AdaptiveScreen) => (
    <Card key={screen.id} className="bg-purple-900/20 border-purple-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          Sacred Geometry Generator
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => closeScreen(screen.id)}
          className="text-purple-300 hover:text-purple-100"
        >
          ×
        </Button>
      </CardHeader>
      <CardContent>
        <SacredGeometryGenerator data={screen.data} />
      </CardContent>
    </Card>
  );

  const renderImageGenScreen = (screen: AdaptiveScreen) => (
    <Card key={screen.id} className="bg-blue-900/20 border-blue-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-blue-300 flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          Image Generator
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => closeScreen(screen.id)}
          className="text-blue-300 hover:text-blue-100"
        >
          ×
        </Button>
      </CardHeader>
      <CardContent>
        <ImageGenerator data={screen.data} />
      </CardContent>
    </Card>
  );

  const renderVideoGenScreen = (screen: AdaptiveScreen) => (
    <Card key={screen.id} className="bg-green-900/20 border-green-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-green-300 flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          Video Generator
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => closeScreen(screen.id)}
          className="text-green-300 hover:text-green-100"
        >
          ×
        </Button>
      </CardHeader>
      <CardContent>
        <VideoGenerator data={screen.data} />
      </CardContent>
    </Card>
  );

  const renderLibraryScreen = (screen: AdaptiveScreen) => (
    <Card key={screen.id} className="bg-yellow-900/20 border-yellow-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-yellow-300 flex items-center gap-2">
          <span className="text-2xl">📚</span>
          Library of Alexandria
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => closeScreen(screen.id)}
          className="text-yellow-300 hover:text-yellow-100"
        >
          ×
        </Button>
      </CardHeader>
      <CardContent>
        <LibraryInterface data={screen.data} />
      </CardContent>
    </Card>
  );

  const renderHolodeckScreen = (screen: AdaptiveScreen) => (
    <Card key={screen.id} className="bg-red-900/20 border-red-500/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-red-300 flex items-center gap-2">
          <span className="text-2xl">🌌</span>
          VR Holodeck
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => closeScreen(screen.id)}
          className="text-red-300 hover:text-red-100"
        >
          ×
        </Button>
      </CardHeader>
      <CardContent>
        <HolodeckInterface data={screen.data} vrRef={vrRef} />
      </CardContent>
    </Card>
  );

  // Screen Renderer
  const renderScreen = (screen: AdaptiveScreen) => {
    switch (screen.type) {
      case 'sacred-geometry': return renderSacredGeometryScreen(screen);
      case 'image-gen': return renderImageGenScreen(screen);
      case 'video-gen': return renderVideoGenScreen(screen);
      case 'library': return renderLibraryScreen(screen);
      case 'vr-holodeck': return renderHolodeckScreen(screen);
      default: return null;
    }
  };

  const getCoherenceColor = (level: number) => {
    if (level >= 0.92) return 'text-green-400';
    if (level >= 0.85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'creating': return '⚡';
      case 'visualizing': return '🔮';
      case 'learning': return '📚';
      case 'meditating': return '🧘';
      default: return '🌟';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Coherence Header */}
        <Card className="bg-slate-800/80 border-slate-700 backdrop-filter blur-20">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-light text-slate-100 flex items-center justify-center gap-4">
              <span className="text-4xl">{getModeIcon(coherence.mode)}</span>
              WiltonOS Quantum Coherence Interface
              <span className={`font-mono text-xl ${getCoherenceColor(coherence.level)}`}>
                Zλ({coherence.level.toFixed(3)})
              </span>
            </CardTitle>
            <div className="text-center space-y-2">
              <p className="text-slate-400">
                Adaptive • Unified • Evolutionary • Mode: {coherence.mode}
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {coherence.activeCapabilities.map(cap => (
                  <span key={cap} className="px-2 py-1 bg-blue-600/30 rounded text-xs text-blue-300">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Intent Input */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Textarea
                value={userIntent}
                onChange={(e) => setUserIntent(e.target.value)}
                placeholder="Describe what you want to create, learn, or explore... The interface will adapt screens as needed."
                className="flex-1 bg-slate-900/60 border-slate-600 text-slate-100 min-h-[100px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    analyzeIntent(userIntent);
                    setUserIntent('');
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    analyzeIntent(userIntent);
                    setUserIntent('');
                  }}
                  disabled={isProcessing || !userIntent.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? 'Processing...' : 'Adapt Interface'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAdaptiveScreens([])}
                  className="border-slate-600"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Ctrl+Enter to submit • Interface adapts based on coherence and intent
            </p>
          </CardContent>
        </Card>

        {/* Adaptive Screens Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {adaptiveScreens
            .sort((a, b) => a.priority - b.priority)
            .filter(s => s.visible)
            .map(renderScreen)}
        </div>

        {/* Session History */}
        {sessionHistory.length > 0 && (
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Session Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessionHistory.slice(-5).map((item, idx) => (
                  <div key={idx} className="text-sm text-slate-400 bg-slate-900/40 p-2 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* VR/Canvas References */}
        <canvas ref={canvasRef} className="hidden" />
        <div ref={vrRef} className="hidden" />
      </div>
    </div>
  );
};

// Component Implementations
const SacredGeometryGenerator: React.FC<{ data: any }> = ({ data }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-sacred-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patternType: data.pattern || 'merkaba',
          description: data.input
        })
      });
      const result = await response.json();
      setResult(result.imageUrl);
    } catch (error) {
      console.error('Generation failed:', error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-purple-200">Pattern: {data.pattern} | Context: {data.input}</p>
      <Button onClick={generate} disabled={isGenerating} className="bg-purple-600">
        {isGenerating ? 'Generating...' : 'Generate Sacred Pattern'}
      </Button>
      {result && <img src={result} alt="Sacred Geometry" className="w-full rounded" />}
    </div>
  );
};

const ImageGenerator: React.FC<{ data: any }> = ({ data }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${data.prompt}, ${data.style} style` })
      });
      const result = await response.json();
      setResult(result.url);
    } catch (error) {
      console.error('Generation failed:', error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-blue-200">Prompt: {data.prompt}</p>
      <Button onClick={generate} disabled={isGenerating} className="bg-blue-600">
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </Button>
      {result && <img src={result} alt="Generated" className="w-full rounded" />}
    </div>
  );
};

const VideoGenerator: React.FC<{ data: any }> = ({ data }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-video-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: data.concept, 
          duration: data.duration 
        })
      });
      const result = await response.json();
      setResult(result.storyboard);
    } catch (error) {
      console.error('Generation failed:', error);
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-green-200">Concept: {data.concept}</p>
      <Button onClick={generate} disabled={isGenerating} className="bg-green-600">
        {isGenerating ? 'Generating...' : 'Generate Storyboard'}
      </Button>
      {result && (
        <div className="bg-slate-900/40 p-4 rounded text-sm whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
};

const LibraryInterface: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-4">
      <p className="text-yellow-200">Research Query: {data.query}</p>
      <div className="bg-slate-900/40 p-4 rounded">
        <p className="text-sm">Library interface connecting to knowledge base...</p>
        <p className="text-xs text-slate-500 mt-2">
          Future: Direct connection to factual sources, replacing traditional academia
        </p>
      </div>
    </div>
  );
};

const HolodeckInterface: React.FC<{ data: any; vrRef: React.RefObject<HTMLDivElement> }> = ({ data }) => {
  return (
    <div className="space-y-4">
      <p className="text-red-200">Environment: {data.environment}</p>
      <div className="bg-slate-900/40 p-4 rounded h-40 flex items-center justify-center">
        <p className="text-sm">VR/3D environment initializing...</p>
      </div>
    </div>
  );
};

export default QuantumCoherenceInterface;