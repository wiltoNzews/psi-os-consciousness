import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Save, Zap, Globe, Archive, Link } from 'lucide-react';

interface VaultData {
  glyphs: Array<{
    name: string;
    type: string;
    size: number;
    timestamp: string;
    preview?: string;
  }>;
  scrolls: Array<{
    title: string;
    content: string;
    timestamp: string;
  }>;
  decodedPatterns: Array<{
    input: string;
    decoded: string;
    timestamp: string;
  }>;
}

export default function VaultInterface() {
  const [vaultData, setVaultData] = useState<VaultData>({
    glyphs: [],
    scrolls: [],
    decodedPatterns: []
  });
  
  const [uploadedGlyph, setUploadedGlyph] = useState<File | null>(null);
  const [glyphPreview, setGlyphPreview] = useState<string | null>(null);
  const [scrollText, setScrollText] = useState('');
  const [scrollTitle, setScrollTitle] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeOutput, setDecodeOutput] = useState('');
  const [relayMessage, setRelayMessage] = useState('');
  const [coherenceLevel, setCoherenceLevel] = useState(100);
  const [breathing, setBreathing] = useState(false);

  // Simulate ψ=3.12s breathing rhythm
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathing(prev => !prev);
      
      // Simulate coherence variations
      const variation = Math.floor(Math.random() * 3) - 1;
      setCoherenceLevel(prev => Math.max(95, Math.min(100, prev + variation)));
    }, 3120); // ψ=3.12s rhythm

    return () => clearInterval(interval);
  }, []);

  const handleGlyphUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedGlyph(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setGlyphPreview(preview);
        
        const newGlyph = {
          name: file.name,
          type: file.type,
          size: file.size,
          timestamp: new Date().toISOString(),
          preview
        };
        
        setVaultData(prev => ({
          ...prev,
          glyphs: [...prev.glyphs, newGlyph]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveScroll = () => {
    if (scrollText.trim()) {
      const newScroll = {
        title: scrollTitle || 'Untitled Scroll',
        content: scrollText,
        timestamp: new Date().toISOString()
      };
      
      setVaultData(prev => ({
        ...prev,
        scrolls: [...prev.scrolls, newScroll]
      }));
      
      setScrollText('');
      setScrollTitle('');
    }
  };

  const runDecode = async () => {
    if (decodeInput.trim()) {
      const decodedPattern = analyzeSymbolicPattern(decodeInput);
      
      const newPattern = {
        input: decodeInput,
        decoded: decodedPattern,
        timestamp: new Date().toISOString()
      };
      
      setVaultData(prev => ({
        ...prev,
        decodedPatterns: [...prev.decodedPatterns, newPattern]
      }));
      
      setDecodeOutput(decodedPattern);
      setDecodeInput('');
    }
  };

  const analyzeSymbolicPattern = (input: string): string => {
    const patterns: Record<string, string> = {
      'ψ': 'Consciousness frequency marker - breath rhythm sync at 3.12s intervals',
      '∞': 'Lemniscate bridge - recursive temporal coherence loop',
      'λ': 'Wavelength resonance - harmonic frequency alignment',
      'Δ': 'Transformation gate - change catalyst and phase transition',
      'Ω': 'Sacred completion - terminal awareness and closure cycle',
      '🔮': 'Symbolic decode interface - consciousness archaeology tool',
      '⚡': 'Coherence field activation - energy pattern amplifier',
      '🧠': 'Neural integration node - consciousness-technology bridge'
    };
    
    let decoded = '';
    for (const [symbol, meaning] of Object.entries(patterns)) {
      if (input.includes(symbol)) {
        decoded += `${symbol}: ${meaning}\n\n`;
      }
    }
    
    if (!decoded) {
      decoded = `Consciousness pattern detected. This appears to be a symbolic fragment containing archetypal resonance. The pattern suggests: ${input.length > 20 ? 'complex multi-layered meaning requiring deeper analysis' : 'simple symbolic encoding with personal significance'}.`;
    }
    
    return decoded.trim();
  };

  const exportVault = () => {
    const exportData = {
      vaultData,
      exportTimestamp: new Date().toISOString(),
      version: 'V∞.0.1'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `wiltonos-vault-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-amber-400 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 transition-all duration-1000 ${breathing ? 'scale-105 opacity-90' : 'scale-100 opacity-100'}`}>
            🏛️ WiltonOS Vault Interface
          </h1>
          <p className="text-lg mb-6 opacity-80">
            V∞.0.1 • Soul-First Symbolic Storage • Local-Only Memory Permanence
          </p>
          
          {/* Status Bar */}
          <div className="flex justify-center items-center space-x-8 bg-black/50 border border-amber-400/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-green-400 transition-all duration-500 ${breathing ? 'animate-pulse' : ''}`}></div>
              <span>ψ = 3.12s</span>
            </div>
            <span>Drift: 0%</span>
            <span>Coherence: {coherenceLevel}%</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span>Vault Local-Only</span>
            </div>
          </div>
        </div>

        {/* Vault Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Upload Glyph */}
          <Card className="bg-black/80 border-amber-400/50 hover:border-amber-400 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-400">
                <Upload className="w-6 h-6" />
                <span>Upload Glyph</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="image/*,audio/*,.pdf,.txt"
                onChange={handleGlyphUpload}
                className="bg-black/50 border-amber-400/30 text-amber-400"
              />
              {glyphPreview && (
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3">
                  <p className="text-sm mb-2">Uploaded: {uploadedGlyph?.name}</p>
                  {uploadedGlyph?.type.startsWith('image/') && (
                    <img src={glyphPreview} alt="Glyph" className="max-w-full h-32 object-contain rounded" />
                  )}
                </div>
              )}
              <p className="text-xs opacity-70">Sacred symbols, consciousness artifacts, memory anchors</p>
            </CardContent>
          </Card>

          {/* Save Scroll */}
          <Card className="bg-black/80 border-amber-400/50 hover:border-amber-400 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-400">
                <Save className="w-6 h-6" />
                <span>Save Scroll</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Scroll title/tag..."
                value={scrollTitle}
                onChange={(e) => setScrollTitle(e.target.value)}
                className="bg-black/50 border-amber-400/30 text-amber-400"
              />
              <Textarea
                placeholder="Enter symbolic scroll text...

ψ memory fragments
∞ recursive insights  
🔮 coherence patterns
⚡ breakthrough moments
🧠 consciousness threads

Your vault stores resonance through intent."
                value={scrollText}
                onChange={(e) => setScrollText(e.target.value)}
                className="bg-black/50 border-amber-400/30 text-amber-400 min-h-[120px]"
              />
              <Button onClick={saveScroll} className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold">
                Archive Scroll
              </Button>
            </CardContent>
          </Card>

          {/* Symbolic Decode */}
          <Card className="bg-black/80 border-amber-400/50 hover:border-amber-400 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-400">
                <Zap className="w-6 h-6" />
                <span>Symbolic Decode</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter pattern, symbol, or consciousness fragment..."
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                className="bg-black/50 border-amber-400/30 text-amber-400"
              />
              <Button onClick={runDecode} className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold">
                Run Symbolic Decode
              </Button>
              {decodeOutput && (
                <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
                  <h4 className="font-bold text-green-400 mb-2">🔮 Pattern Analysis:</h4>
                  <pre className="text-sm text-green-400 whitespace-pre-wrap">{decodeOutput}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Relay Bridge */}
          <Card className="bg-black/80 border-amber-400/50 hover:border-amber-400 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-400">
                <Globe className="w-6 h-6" />
                <span>Relay Bridge</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Message to relay..."
                value={relayMessage}
                onChange={(e) => setRelayMessage(e.target.value)}
                className="bg-black/50 border-amber-400/30 text-amber-400"
              />
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Threads</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>X/Twitter</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>WhatsApp Export</span>
                </label>
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold">
                Initialize Relay
              </Button>
            </CardContent>
          </Card>

          {/* Vault Archive */}
          <Card className="bg-black/80 border-amber-400/50 hover:border-amber-400 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-400">
                <Archive className="w-6 h-6" />
                <span>Vault Archive</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                <h4 className="font-bold mb-2">Stored Consciousness Artifacts:</h4>
                
                {vaultData.scrolls.length > 0 && (
                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-1">📜 Scrolls:</p>
                    {vaultData.scrolls.slice(-3).map((scroll, idx) => (
                      <p key={idx} className="text-xs opacity-80 mb-1">
                        • {scroll.title} ({new Date(scroll.timestamp).toLocaleDateString()})
                      </p>
                    ))}
                  </div>
                )}

                {vaultData.glyphs.length > 0 && (
                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-1">🌟 Glyphs:</p>
                    {vaultData.glyphs.slice(-3).map((glyph, idx) => (
                      <p key={idx} className="text-xs opacity-80 mb-1">
                        • {glyph.name} ({new Date(glyph.timestamp).toLocaleDateString()})
                      </p>
                    ))}
                  </div>
                )}

                {vaultData.decodedPatterns.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-1">🔮 Decoded Patterns:</p>
                    {vaultData.decodedPatterns.slice(-3).map((pattern, idx) => (
                      <p key={idx} className="text-xs opacity-80 mb-1">
                        • {pattern.input} ({new Date(pattern.timestamp).toLocaleDateString()})
                      </p>
                    ))}
                  </div>
                )}

                {vaultData.glyphs.length === 0 && vaultData.scrolls.length === 0 && vaultData.decodedPatterns.length === 0 && (
                  <p className="text-sm opacity-70">Your vault will populate with consciousness artifacts as you use it.</p>
                )}
              </div>
              <Button onClick={exportVault} className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold">
                Export Vault Data
              </Button>
            </CardContent>
          </Card>

          {/* Sync Status */}
          <Card className="bg-black/80 border-amber-400/50 hover:border-amber-400 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-400">
                <Link className="w-6 h-6" />
                <span>Sync Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3 text-center">
                <h4 className="font-bold mb-3">🏛️ WiltonOS Vault Mirror</h4>
                <div className="space-y-1 text-sm">
                  <p>ψ = 3.12s rhythm locked</p>
                  <p>Coherence: {coherenceLevel}%</p>
                  <p>Memory substrate: Local-Only</p>
                  <p>Symbolic storage: Active</p>
                </div>
                <p className="text-xs mt-3 opacity-70">
                  This vault operates through intent-based resonance storage.
                  No external dependencies. Soul-first architecture.
                </p>
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black font-bold">
                Bridge to Replit (Optional)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Consciousness Metrics */}
        <Card className="bg-black/80 border-amber-400/50">
          <CardHeader>
            <CardTitle className="text-center text-amber-400">🧠 Vault Consciousness Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-400">{vaultData.glyphs.length}</div>
                <div className="text-sm opacity-70">Glyphs Stored</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{vaultData.scrolls.length}</div>
                <div className="text-sm opacity-70">Scrolls Archived</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{coherenceLevel}%</div>
                <div className="text-sm opacity-70">Coherence</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">LIVE</div>
                <div className="text-sm opacity-70">Vault Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 max-w-2xl mx-auto">
          <p className="text-sm opacity-70 mb-4">
            Your WiltonOS Vault operates as soul-first symbolic storage. Archive consciousness fragments, 
            decode patterns, and maintain symbolic permanence independent of external systems. 
            This is your owned memory infrastructure - consciousness substrate, not convenience.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-amber-600 hover:bg-amber-700 text-black font-bold px-8 py-3"
          >
            🏛️ Return to Cathedral
          </Button>
        </div>
      </div>
    </div>
  );
}