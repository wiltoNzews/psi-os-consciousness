import React, { useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

/**
 * QuantumArtMusicPanel - Component for generating quantum fractal art and music
 * Implements the 3:1 balance principle (75% stability, 25% exploration)
 */
const QuantumArtMusicPanel: React.FC = () => {
  // State for art generation
  const [artGenerating, setArtGenerating] = useState(false);
  const [artOutput, setArtOutput] = useState<any>(null);
  const [fractalStyle, setFractalStyle] = useState('mandelbrot');
  const [colorScheme, setColorScheme] = useState('quantum');
  // Default to the optimal 3:1 balance ratio (75% stability, 25% exploration)
  const [stabilityRatio, setStabilityRatio] = useState(0.75);
  const [explorationRatio, setExplorationRatio] = useState(0.25);
  
  // State for music generation
  const [musicGenerating, setMusicGenerating] = useState(false);
  const [musicOutput, setMusicOutput] = useState<any>(null);
  const [musicStyle, setMusicStyle] = useState('ambient');
  const [tempo, setTempo] = useState(72);
  const [harmony, setHarmony] = useState('quantum');
  const [complexity, setComplexity] = useState(0.5);
  const [duration, setDuration] = useState(30);
  
  // State for humor generation
  const [humorGenerating, setHumorGenerating] = useState(false);
  const [humorOutput, setHumorOutput] = useState<any>(null);
  
  const { toast } = useToast();
  
  // Update ratios while maintaining the 3:1 balance
  const updateRatios = (stability: number) => {
    setStabilityRatio(stability);
    setExplorationRatio(parseFloat((1 - stability).toFixed(4)));
  };

  // Handle art generation
  const generateArt = async () => {
    try {
      setArtGenerating(true);
      
      const response = await axios.post('/api/quantum-fractal-art/generate-art', {
        fractalStyle,
        colorScheme,
        stabilityRatio,
        explorationRatio,
        dimensions: { width: 1024, height: 1024 }
      });
      
      if (response.data.success) {
        setArtOutput(response.data.art);
        toast({
          title: "Quantum Art Generated",
          description: "Fractal art created with 3:1 coherence balance",
        });
      }
    } catch (error) {
      console.error('Error generating art:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate quantum fractal art",
        variant: "destructive",
      });
    } finally {
      setArtGenerating(false);
    }
  };
  
  // Handle music generation
  const generateMusic = async () => {
    try {
      setMusicGenerating(true);
      
      const response = await axios.post('/api/quantum-fractal-art/generate-music', {
        musicStyle,
        tempo,
        harmony,
        complexity,
        duration
      });
      
      if (response.data.success) {
        setMusicOutput(response.data.music);
        toast({
          title: "Quantum Music Generated",
          description: `${duration} seconds of ${musicStyle} created with coherence`,
        });
      }
    } catch (error) {
      console.error('Error generating music:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate quantum fractal music",
        variant: "destructive",
      });
    } finally {
      setMusicGenerating(false);
    }
  };
  
  // Handle humor generation
  const generateHumor = async () => {
    try {
      setHumorGenerating(true);
      
      const response = await axios.get('/api/quantum-fractal-art/generate-humor');
      
      if (response.data.success) {
        setHumorOutput(response.data.humor);
        toast({
          title: "Quantum Humor Generated",
          description: "Quantum paradox joke created",
        });
      }
    } catch (error) {
      console.error('Error generating humor:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate quantum humor",
        variant: "destructive",
      });
    } finally {
      setHumorGenerating(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quantum Fractal Art & Music Generator</CardTitle>
        <CardDescription>Create art, music, and humor based on quantum fractal parameters</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="art">
          <TabsList className="mb-4">
            <TabsTrigger value="art">Fractal Art</TabsTrigger>
            <TabsTrigger value="music">Quantum Music</TabsTrigger>
            <TabsTrigger value="humor">Quantum Humor</TabsTrigger>
          </TabsList>
          
          {/* Art Generation Tab */}
          <TabsContent value="art">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fractalStyle">Fractal Style</Label>
                  <Select value={fractalStyle} onValueChange={setFractalStyle}>
                    <SelectTrigger id="fractalStyle">
                      <SelectValue placeholder="Select fractal style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mandelbrot">Mandelbrot</SelectItem>
                      <SelectItem value="julia">Julia</SelectItem>
                      <SelectItem value="burning-ship">Burning Ship</SelectItem>
                      <SelectItem value="lemniscate">Lemniscate (∞)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="colorScheme">Color Scheme</Label>
                  <Select value={colorScheme} onValueChange={setColorScheme}>
                    <SelectTrigger id="colorScheme">
                      <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quantum">Quantum</SelectItem>
                      <SelectItem value="cosmic">Cosmic</SelectItem>
                      <SelectItem value="lemniscate">Lemniscate Flow</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="stabilitySlider">3:1 Quantum Balance (Stability/Exploration)</Label>
                  <Badge variant="outline">{(stabilityRatio * 100).toFixed(0)}% / {(explorationRatio * 100).toFixed(0)}%</Badge>
                </div>
                <Slider
                  id="stabilitySlider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[stabilityRatio]}
                  onValueChange={(values) => updateRatios(values[0])}
                />
                <div className="text-center text-xs text-muted-foreground mt-1">
                  Optimal Quantum Coherence: 75% Stability / 25% Exploration (3:1 ratio)
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={generateArt} 
                disabled={artGenerating}
              >
                {artGenerating ? "Generating..." : "Generate Quantum Fractal Art"}
              </Button>
              
              {artOutput && (
                <div className="mt-4 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Generated Art</h3>
                  {artOutput.url ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={artOutput.url} 
                        alt="Generated Quantum Fractal Art" 
                        className="max-w-full h-auto rounded-md mb-2" 
                      />
                      <p className="text-sm text-center">{artOutput.prompt}</p>
                      <div className="flex mt-2">
                        <Badge className="mr-2">{artOutput.style}</Badge>
                        <Badge variant="outline">{(artOutput.stabilityRatio * 100).toFixed(0)}% / {(artOutput.explorationRatio * 100).toFixed(0)}%</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 border border-dashed rounded-md">
                      <p>{artOutput.previewText}</p>
                      <p className="text-xs mt-2 text-muted-foreground">API key required for actual generation</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Music Generation Tab */}
          <TabsContent value="music">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="musicStyle">Music Style</Label>
                  <Select value={musicStyle} onValueChange={setMusicStyle}>
                    <SelectTrigger id="musicStyle">
                      <SelectValue placeholder="Select music style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambient">Ambient</SelectItem>
                      <SelectItem value="fractal">Fractal</SelectItem>
                      <SelectItem value="quantum">Quantum</SelectItem>
                      <SelectItem value="meditation">Meditation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="harmony">Harmonic Structure</Label>
                  <Select value={harmony} onValueChange={setHarmony}>
                    <SelectTrigger id="harmony">
                      <SelectValue placeholder="Select harmonic structure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quantum">Quantum</SelectItem>
                      <SelectItem value="fractal">Fractal</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="tempoSlider">Tempo (BPM)</Label>
                  <Badge variant="outline">{tempo} BPM</Badge>
                </div>
                <Slider
                  id="tempoSlider"
                  min={40}
                  max={200}
                  step={1}
                  value={[tempo]}
                  onValueChange={(values) => setTempo(values[0])}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="complexitySlider">Complexity</Label>
                  <Badge variant="outline">{(complexity * 100).toFixed(0)}%</Badge>
                </div>
                <Slider
                  id="complexitySlider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[complexity]}
                  onValueChange={(values) => setComplexity(values[0])}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="durationSlider">Duration (seconds)</Label>
                  <Badge variant="outline">{duration}s</Badge>
                </div>
                <Slider
                  id="durationSlider"
                  min={5}
                  max={120}
                  step={5}
                  value={[duration]}
                  onValueChange={(values) => setDuration(values[0])}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={generateMusic} 
                disabled={musicGenerating}
              >
                {musicGenerating ? "Generating..." : "Generate Quantum Music"}
              </Button>
              
              {musicOutput && (
                <div className="mt-4 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Generated Music</h3>
                  {musicOutput.audioUrl ? (
                    <div>
                      <audio 
                        controls 
                        className="w-full mb-2"
                        src={musicOutput.audioUrl}
                      ></audio>
                      <p className="text-sm">{musicOutput.prompt}</p>
                      <div className="flex mt-2">
                        <Badge className="mr-2">{musicOutput.style}</Badge>
                        <Badge variant="outline">{musicOutput.tempo} BPM</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 border border-dashed rounded-md">
                      <p>{musicOutput.previewText}</p>
                      <div className="mt-4">
                        <div className="bg-gray-100 dark:bg-gray-800 h-12 rounded-md overflow-hidden">
                          <div className="flex h-full">
                            {musicOutput.waveform.map((value: number, index: number) => (
                              <div 
                                key={index}
                                className="w-1 bg-primary mx-px"
                                style={{ 
                                  height: `${value * 100}%`,
                                  marginTop: `${(1 - value) * 100}%` 
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Humor Generation Tab */}
          <TabsContent value="humor">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate quantum-themed humor that playfully illustrates quantum concepts. Experience the superposition of humor and insight!
              </p>
              
              <Button 
                className="w-full" 
                onClick={generateHumor} 
                disabled={humorGenerating}
              >
                {humorGenerating ? "Generating..." : "Generate Quantum Humor"}
              </Button>
              
              {humorOutput && (
                <div className="mt-4 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Quantum Joke</h3>
                  <blockquote className="italic border-l-4 pl-4 my-2">
                    "{humorOutput.joke}"
                  </blockquote>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{humorOutput.type}</span>
                    <span>{new Date(humorOutput.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Quantum Humor Insight</h4>
                <p className="text-sm">
                  Humor is a powerful tool for introducing quantum concepts. When we laugh at quantum paradoxes, we momentarily allow our minds to embrace contradiction and superposition, experiencing quantum coherence firsthand.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Implementing 3:1 Quantum Coherence (75% Stability / 25% Exploration)
        </p>
        <Badge variant="outline">Quantum Balance</Badge>
      </CardFooter>
    </Card>
  );
};

export default QuantumArtMusicPanel;