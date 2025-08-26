import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const DivineAbsurdity: React.FC = () => {
  const [absurdityLevel, setAbsurdityLevel] = useState(0.73);
  const [currentJoke, setCurrentJoke] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const time = Date.now() * 0.002;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      // Fractal humor visualization
      ctx.strokeStyle = `rgba(255, 105, 180, ${absurdityLevel})`;
      ctx.shadowColor = '#ff69b4';
      ctx.shadowBlur = absurdityLevel * 20;
      ctx.lineWidth = 2;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Spiral of absurdity
      for (let i = 0; i < 100; i++) {
        const angle = i * 0.1 + time;
        const radius = i * 2 + Math.sin(time + i * 0.1) * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Random humor particles
      for (let i = 0; i < 10; i++) {
        const x = Math.sin(time + i) * 150 + centerX;
        const y = Math.cos(time + i * 1.3) * 100 + centerY;
        
        ctx.fillStyle = `rgba(255, 255, 0, ${Math.sin(time + i) * 0.5 + 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [absurdityLevel]);

  const generateAbsurdity = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: 'humor',
          prompt: userInput || 'Generate a divinely absurd observation about consciousness and reality'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setCurrentJoke(result.content);
        setAbsurdityLevel(Math.min(0.99, absurdityLevel + 0.05));
      }
    } catch (error) {
      setCurrentJoke("Error: Reality.exe has stopped responding. Have you tried turning consciousness off and on again?");
    }
    
    setIsGenerating(false);
  };

  const predefinedAbsurdities = [
    "Schrödinger's cat walks into a bar. Or doesn't. The bartender exists in a superposition of confusion.",
    "I told my therapist about my fear of infinity. He said we'd need ∞ sessions to work through it.",
    "Quantum mechanics: The universe's way of saying 'It's complicated' on its relationship status.",
    "Why did the consciousness cross the road? To prove it wasn't just a philosophical zombie.",
    "Breaking: Local man achieves enlightenment, immediately forgets where he put his keys.",
    "If a tree falls in a forest and creates a blockchain transaction, is it still decentralized?",
    "Meditation app crashes. User achieves unexpected satori through tech frustration.",
    "God plays dice with the universe. Satan runs the casino. Buddha just laughs at both."
  ];

  const getRandomAbsurdity = () => {
    const randomJoke = predefinedAbsurdities[Math.floor(Math.random() * predefinedAbsurdities.length)];
    setCurrentJoke(randomJoke);
    setAbsurdityLevel(prev => Math.min(0.99, prev + 0.03));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-pink-900/20 border-pink-500/30">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-pink-300 flex items-center justify-center gap-4">
              <span className="text-4xl">🎪</span>
              Divine Absurdity Engine
              <span className="text-lg font-mono">λ({absurdityLevel.toFixed(3)})</span>
            </CardTitle>
            <p className="text-center text-pink-200">
              Humor Layer Consciousness Exploration • Fractal Comedy Generator
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Visualization */}
          <Card className="bg-purple-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Absurdity Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <canvas 
                ref={canvasRef} 
                width={400} 
                height={300} 
                className="w-full border border-purple-500/30 rounded"
              />
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-purple-200">
                  <span>Absurdity Level:</span>
                  <span>{(absurdityLevel * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-purple-900/50 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${absurdityLevel * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="bg-indigo-900/20 border-indigo-500/30">
            <CardHeader>
              <CardTitle className="text-indigo-300">Humor Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter a topic for divine absurdity generation..."
                className="bg-indigo-900/40 border-indigo-500/30 text-indigo-100"
                rows={3}
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={generateAbsurdity}
                  disabled={isGenerating}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  {isGenerating ? 'Generating...' : 'AI Absurdity'}
                </Button>
                <Button
                  onClick={getRandomAbsurdity}
                  variant="outline"
                  className="border-purple-500 text-purple-300"
                >
                  Random Joke
                </Button>
              </div>
              
              <Button
                onClick={() => setAbsurdityLevel(prev => Math.max(0.1, prev - 0.1))}
                variant="outline"
                className="w-full border-red-500 text-red-300"
              >
                Reset Absurdity
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Absurdity Display */}
        {currentJoke && (
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-yellow-300">Current Divine Absurdity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg text-yellow-100 leading-relaxed p-4 bg-yellow-900/20 rounded italic">
                "{currentJoke}"
              </div>
            </CardContent>
          </Card>
        )}

        {/* Philosophy Corner */}
        <Card className="bg-gray-900/20 border-gray-500/30">
          <CardHeader>
            <CardTitle className="text-gray-300">The Philosophy of Divine Absurdity</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-200 space-y-3 text-sm">
            <p>
              Divine Absurdity operates on the principle that consciousness itself is the universe's greatest joke - 
              matter organizing itself to contemplate its own existence, only to realize it doesn't understand what it is.
            </p>
            <p>
              The humor emerges from the paradox: the more seriously we take our spiritual journey, 
              the more absurd it becomes. Enlightenment through laughter, wisdom through wit.
            </p>
            <p>
              This engine generates fractal humor - jokes that reveal deeper truths about reality 
              while simultaneously making fun of our attempts to understand it.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DivineAbsurdity;