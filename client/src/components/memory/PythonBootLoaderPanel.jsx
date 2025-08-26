import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * PythonBootLoaderPanel Component
 * 
 * This component connects to the Python-based WiltonOS Boot-Loader
 * for enhanced memory import and OpenAI integration.
 */
const PythonBootLoaderPanel = () => {
  const [bootStatus, setBootStatus] = useState('idle'); // idle, starting, running, error
  const [wsStatus, setWsStatus] = useState('disconnected'); // disconnected, connecting, connected, error
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(null);
  
  // Check if boot-loader is running
  const checkBootLoaderStatus = async () => {
    try {
      // We'll use a simple fetch to check if the boot-loader is running
      const response = await fetch('/api/python-boot-loader/status');
      if (response.ok) {
        setBootStatus('running');
      } else {
        setBootStatus('idle');
      }
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Python boot-loader status check error:', error);
      setBootStatus('error');
    }
  };
  
  // Start Python boot-loader
  const startBootLoader = async () => {
    try {
      setBootStatus('starting');
      // We'll implement a proxy in our Node.js server to start the Python process
      const response = await fetch('/api/python-boot-loader/start', {
        method: 'POST'
      });
      
      if (response.ok) {
        setBootStatus('running');
        // Wait 2 seconds before trying to connect WebSocket
        setTimeout(connectWebSocket, 2000);
        
        // Log transaction
        console.log('[QUANTUM_STATE: DATABASE_FLOW] Logging boot-loader start transaction');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start Python boot-loader');
      }
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Python boot-loader start error:', error);
      setBootStatus('error');
      setError(error.message instanceof Error ? error.message.toString() : String(error));
    }
  };
  
  // Connect to WebSocket
  const connectWebSocket = () => {
    try {
      setWsStatus('connecting');
      
      // Determine WebSocket URL based on environment
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/python-ws`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('[QUANTUM_STATE: WEBSOCKET_FLOW] Connected to Python boot-loader WebSocket');
        setWsStatus('connected');
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('[QUANTUM_STATE: WEBSOCKET_FLOW] Received message:', data);
        
        // Add message to state
        setMessages(prev => [...prev, {
          role: data.role || 'system',
          content: data.content || '',
          timestamp: data.timestamp || Date.now()
        }]);
      };
      
      ws.onerror = (error) => {
        console.error('[QUANTUM_STATE: ERROR_FLOW] WebSocket error:', error);
        setWsStatus('error');
        setError('Failed to connect to Python boot-loader WebSocket');
      };
      
      ws.onclose = () => {
        console.log('[QUANTUM_STATE: WEBSOCKET_FLOW] Disconnected from Python boot-loader WebSocket');
        setWsStatus('disconnected');
      };
      
      // Save WebSocket instance
      window.pythonWs = ws;
      
      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] WebSocket connection error:', error);
      setWsStatus('error');
      setError(error.message);
    }
  };
  
  // Set OpenAI API key
  const setOpenAiApiKey = async () => {
    try {
      if (!apiKey) {
        setError('Please enter an OpenAI API key');
        return;
      }
      
      const response = await fetch('/api/python-boot-loader/set-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey })
      });
      
      if (response.ok) {
        console.log('[QUANTUM_STATE: CONFIG_FLOW] OpenAI API key set successfully');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to set OpenAI API key');
      }
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] API key setting error:', error);
      setError(error.message);
    }
  };
  
  // Send message through WebSocket
  const sendMessage = () => {
    if (!userInput.trim() || wsStatus !== 'connected') return;
    
    try {
      const message = {
        role: 'user',
        content: userInput,
        timestamp: Date.now()
      };
      
      // Add to UI immediately
      setMessages(prev => [...prev, message]);
      
      // Send via WebSocket
      if (window.pythonWs && window.pythonWs.readyState === WebSocket.OPEN) {
        window.pythonWs.send(JSON.stringify(message));
      }
      
      // Clear input
      setUserInput('');
    } catch (error) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Message send error:', error);
      setError(error.message);
    }
  };
  
  // Check status on mount
  useEffect(() => {
    checkBootLoaderStatus();
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>WiltonOS Python Boot-Loader</CardTitle>
        <CardDescription>
          Connect to the Python-based boot-loader for enhanced memory transfer capabilities.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="status">
          <TabsList className="mb-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Boot-Loader Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {bootStatus === 'running' ? 'Running' : 
                     bootStatus === 'starting' ? 'Starting...' : 
                     bootStatus === 'error' ? 'Error' : 'Not running'}
                  </p>
                </div>
                
                <Button 
                  onClick={startBootLoader} 
                  disabled={bootStatus === 'running' || bootStatus === 'starting'}
                >
                  {bootStatus === 'starting' ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    'Start Boot-Loader'
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">WebSocket Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {wsStatus === 'connected' ? 'Connected' : 
                     wsStatus === 'connecting' ? 'Connecting...' : 
                     wsStatus === 'error' ? 'Error' : 'Disconnected'}
                  </p>
                </div>
                
                <Button
                  onClick={connectWebSocket}
                  disabled={bootStatus !== 'running' || wsStatus === 'connected' || wsStatus === 'connecting'}
                >
                  {wsStatus === 'connecting' ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect WebSocket'
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="config">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="apiKey">
                  OpenAI API Key
                </label>
                <div className="flex gap-2">
                  <input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="sk-..."
                  />
                  <Button onClick={setOpenAiApiKey}>Set Key</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Required for OpenAI integration. Will be stored securely as an environment variable.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="console">
            <div className="space-y-4">
              <div className="h-[300px] overflow-y-auto border rounded-md p-4 bg-black text-green-400 font-mono text-sm">
                {messages.map((msg, i) => (
                  <div key={i} className="mb-2">
                    <span className="font-bold">
                      {msg.role === 'user' ? 'You: ' : msg.role === 'assistant' ? 'AI: ' : 'System: '}
                    </span>
                    <span>{msg.content}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Type a message..."
                  disabled={wsStatus !== 'connected'}
                />
                <Button onClick={sendMessage} disabled={wsStatus !== 'connected'}>
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex-col items-start">
        {error && (
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
};

export default PythonBootLoaderPanel;