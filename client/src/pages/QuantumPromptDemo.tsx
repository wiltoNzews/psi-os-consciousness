import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import QuantumVisualizationDashboard from '@/components/quantum/QuantumVisualizationDashboard';

const QuantumPromptDemo = () => {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [prompt, setPrompt] = useState<string>('');
  const [explorationLevel, setExplorationLevel] = useState<number>(0.2494);
  const [response, setResponse] = useState<string>('');
  const [coherenceMetrics, setCoherenceMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseHistory, setResponseHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('generate');

  // Calculate the complementary coherence level based on exploration
  const coherenceLevel = (0.7500 / explorationLevel).toFixed(4);
  
  const generateResponse = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to generate a quantum response.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/quantum-prompt/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          sessionId,
          explorationLevel,
          previousResponses: responseHistory.map(item => item.response).slice(-3)
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate quantum response');
      }
      
      setResponse(data.response);
      setCoherenceMetrics(data.coherenceMetrics);
      
      // Add to history
      setResponseHistory(prev => [...prev, {
        id: uuidv4(),
        prompt,
        response: data.response,
        coherenceMetrics: data.coherenceMetrics,
        timestamp: new Date().toISOString()
      }]);
      
      toast({
        title: "Response generated",
        description: data.loopDetected 
          ? "Loop detected and broken with higher exploration!" 
          : "Quantum response generated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate response",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetSession = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/quantum-prompt/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to reset session');
      }
      
      // Generate new session ID
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      setResponseHistory([]);
      setResponse('');
      setCoherenceMetrics(null);
      
      toast({
        title: "Session reset",
        description: `New session ID: ${newSessionId}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Quantum Prompt Generator
            <Badge className="ml-2 bg-indigo-600">Beta</Badge>
          </CardTitle>
          <CardDescription className="text-center">
            Harness the power of quantum coherence and fractal response diversification
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="generate">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your prompt here..."
                  rows={6}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="explorationLevel">
                    Exploration Level: {explorationLevel.toFixed(4)}
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    Coherence Ratio: {coherenceLevel}
                  </span>
                </div>
                
                <Slider
                  id="explorationLevel"
                  min={0.1}
                  max={0.5}
                  step={0.01}
                  value={[explorationLevel]}
                  onValueChange={(value) => setExplorationLevel(value[0])}
                  className="py-4"
                />
                
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="rounded bg-blue-100 p-2 dark:bg-blue-950">
                      <span className="font-semibold">Structure (75%)</span>
                    </div>
                  </div>
                  <div>
                    <div className="rounded bg-amber-100 p-2 dark:bg-amber-950">
                      <span className="font-semibold">Exploration (25%)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={generateResponse} 
                disabled={loading || !prompt.trim()} 
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate Quantum Response'}
              </Button>
              
              {loading && (
                <div className="space-y-2">
                  <div className="text-sm text-center">
                    Calculating quantum coherence...
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              )}
              
              {response && (
                <div className="space-y-4 rounded-md border p-4">
                  <Label>Quantum Response</Label>
                  <div className="whitespace-pre-wrap rounded-md bg-muted p-4">
                    {response}
                  </div>
                  
                  {/* New visualization dashboard */}
                  {coherenceMetrics && (
                    <div className="mt-6 space-y-4">
                      <QuantumVisualizationDashboard 
                        coherenceMetrics={coherenceMetrics}
                        loading={false}
                      />
                      
                      {/* Classic metrics display (as fallback) */}
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-950">
                          <div className="font-semibold">Coherence</div>
                          <div>{coherenceMetrics.coherenceIndex.toFixed(4)}</div>
                        </div>
                        <div className="rounded-md bg-amber-100 p-2 dark:bg-amber-950">
                          <div className="font-semibold">Exploration</div>
                          <div>{coherenceMetrics.explorationIndex.toFixed(4)}</div>
                        </div>
                        <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-950">
                          <div className="font-semibold">Balance Ratio</div>
                          <div>{coherenceMetrics.balanceRatio.toFixed(4)}</div>
                        </div>
                        {coherenceMetrics.goldenRatioDetected && (
                          <div className="col-span-3 mt-2 rounded-md bg-yellow-100 p-2 dark:bg-yellow-950">
                            <div className="font-semibold">✨ Golden Ratio Detected</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="history">
            <CardContent className="pt-6">
              {responseHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No responses generated yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {responseHistory.map((item, index) => (
                    <div key={item.id} className="rounded-md border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Response {responseHistory.length - index}</h4>
                        <div className="text-sm text-muted-foreground">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        <strong>Prompt:</strong> {item.prompt}
                      </div>
                      
                      <div className="whitespace-pre-wrap rounded-md bg-muted p-3 text-sm mb-2">
                        {item.response}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-md bg-blue-100 p-1 dark:bg-blue-950">
                          <div className="font-semibold">Coherence</div>
                          <div>{item.coherenceMetrics.coherenceIndex.toFixed(4)}</div>
                        </div>
                        <div className="rounded-md bg-amber-100 p-1 dark:bg-amber-950">
                          <div className="font-semibold">Exploration</div>
                          <div>{item.coherenceMetrics.explorationIndex.toFixed(4)}</div>
                        </div>
                        <div className="rounded-md bg-purple-100 p-1 dark:bg-purple-950">
                          <div className="font-semibold">Balance Ratio</div>
                          <div>{item.coherenceMetrics.balanceRatio.toFixed(4)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </TabsContent>
          
          <TabsContent value="settings">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="sessionId">Session ID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="sessionId"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    readOnly
                  />
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(sessionId);
                    toast({
                      title: "Copied",
                      description: "Session ID copied to clipboard",
                    });
                  }}>
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  The session ID is used to track response patterns and prevent loops.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Advanced Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Reset your quantum prompt session to clear history and start fresh.
                  </p>
                </div>
                
                <Button 
                  variant="destructive" 
                  onClick={resetSession}
                  disabled={loading}
                >
                  Reset Session
                </Button>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-between pt-0">
          <div className="text-xs text-muted-foreground">
            Powered by Quantum Coherence Framework (0.7500/0.2494)
          </div>
          <div className="text-xs text-muted-foreground">
            API: v1.0.0
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuantumPromptDemo;