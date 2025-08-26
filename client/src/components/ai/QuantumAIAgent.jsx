import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ChevronRight, ClockIcon } from 'lucide-react';

/**
 * QuantumAIAgent Component
 * 
 * AI agent interface that maintains the 3:1 quantum balance ratio (75% coherence, 25% exploration).
 * Displays real-time coherence metrics and provides chat functionality.
 */
export default function QuantumAIAgent() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [healthData, setHealthData] = useState({
    status: 'unknown',
    stability: 0.75,
    exploration: 0.25,
    ratio: 3.0,
    timestamp: new Date().toISOString()
  });
  const [activeTab, setActiveTab] = useState('chat');
  const { toast } = useToast();

  // Check AI agent health periodically
  useEffect(() => {
    checkHealth();
    
    const healthInterval = setInterval(() => {
      checkHealth();
    }, 10000);
    
    return () => clearInterval(healthInterval);
  }, []);

  // Check AI agent health
  const checkHealth = async () => {
    try {
      const response = await fetch('/api/python-boot-loader/ai/health');
      if (!response.ok) {
        console.error('AI agent health check failed:', await response.text());
        return;
      }
      
      const data = await response.json();
      
      if (data.data) {
        setHealthData({
          status: data.status,
          stability: data.data.stability || 0.75,
          exploration: data.data.exploration || 0.25,
          ratio: data.data.ratio || 3.0,
          timestamp: data.data.timestamp || new Date().toISOString()
        });
      } else if (data.quantum_balance) {
        // Handle different response format
        setHealthData({
          status: data.status,
          stability: data.quantum_balance.stability || 0.75,
          exploration: data.quantum_balance.exploration || 0.25,
          ratio: parseFloat(data.quantum_balance.actual_ratio) || 3.0,
          timestamp: data.timestamp || new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error checking AI agent health:', error);
    }
  };

  // Send message to AI agent
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Add user message to conversation
    setConversation(prev => [
      ...prev,
      { role: 'user', content: message, timestamp: Date.now() }
    ]);
    
    try {
      const response = await fetch('/api/python-boot-loader/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: 'quantum-user', // Replace with actual user ID if available
          message: message
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add AI response to conversation
      setConversation(prev => [
        ...prev,
        { role: 'assistant', content: data.response, timestamp: Date.now() }
      ]);
      
      // Update health metrics
      if (data.quantum_balance) {
        setHealthData({
          status: 'online',
          stability: data.quantum_balance.stability,
          exploration: data.quantum_balance.exploration,
          ratio: parseFloat(data.quantum_balance.ratio),
          timestamp: data.timestamp
        });
      }
      
      // Clear input field
      setMessage('');
    } catch (error) {
      console.error('Error sending message to AI agent:', error);
      toast({
        title: "Error",
        description: `Failed to communicate with AI agent: ${error.message}`,
        variant: "destructive"
      });
      
      // Add error message to conversation
      setConversation(prev => [
        ...prev,
        { 
          role: 'system', 
          content: `Error: Failed to communicate with AI agent. Please try again later.`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Quantum AI Agent</span>
          <div className="text-sm font-normal flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${
              healthData.status === 'online' || healthData.status === 'ok' 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`}></span>
            {healthData.status === 'online' || healthData.status === 'ok' ? 'Online' : 'Offline'}
          </div>
        </CardTitle>
        <CardDescription>
          Maintaining 3:1 quantum balance ratio (75% coherence, 25% exploration)
        </CardDescription>
      </CardHeader>

      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
            <TabsTrigger value="metrics" className="flex-1">Quantum Metrics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="space-y-4">
          <CardContent className="p-4 h-96 overflow-y-auto space-y-4 bg-muted/30 rounded-md mt-4">
            {conversation.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p>No messages yet. Start a conversation with the quantum AI agent.</p>
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className={`max-w-3/4 px-4 py-2 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : msg.role === 'system'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 flex items-center">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              ))
            )}
          </CardContent>

          <CardFooter>
            <form onSubmit={sendMessage} className="w-full flex gap-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !message.trim()}>
                {loading ? 'Sending...' : <ChevronRight className="w-4 h-4" />}
              </Button>
            </form>
          </CardFooter>
        </TabsContent>

        <TabsContent value="metrics">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stability (Target: 75%)</span>
                <span>{Math.round(healthData.stability * 100)}%</span>
              </div>
              <Progress value={healthData.stability * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exploration (Target: 25%)</span>
                <span>{Math.round(healthData.exploration * 100)}%</span>
              </div>
              <Progress value={healthData.exploration * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quantum Balance Ratio (Target: 3:1)</span>
                <span>{healthData.ratio?.toFixed(2) || '3.00'}</span>
              </div>
              <Progress 
                value={Math.min(
                  Math.max(
                    ((healthData.ratio || 3) / 3) * 50 + 25, 
                    0
                  ), 
                  100
                )} 
                className="h-2" 
              />
            </div>

            <div className="pt-4 text-xs text-muted-foreground">
              <p>Last updated: {formatTime(healthData.timestamp)}</p>
              <p className="mt-2">
                The quantum balance ratio measures the balance between coherence (stability) and
                exploration in the AI agent's responses. A ratio of 3:1 (75% coherence, 25% exploration)
                is optimal for maintaining quantum state integrity.
              </p>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}