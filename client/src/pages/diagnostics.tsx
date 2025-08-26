import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DiagnosticsPage() {
  const { connected, sendMessage, lastError } = useWebSocket();
  const [response, setResponse] = useState<string | null>(null);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [connectionDetails, setConnectionDetails] = useState({
    host: '',
    protocol: '',
    origin: '',
    pathname: ''
  });

  // Get connection details
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setConnectionDetails({
        host: window.location.host,
        protocol: window.location.protocol,
        origin: window.location.origin,
        pathname: window.location.pathname
      });
    }
  }, []);
  
  // Set up WebSocket message handler
  useEffect(() => {
    const handleWebSocketMessage = (event: any) => {
      try {
        // Handle both direct event data and the event.data.data format
        const message = event.data?.data 
          ? event.data.data 
          : (typeof event.data === 'string' ? JSON.parse(event.data) : event.data);
        
        console.log('Diagnostics page received WebSocket message:', message);
        
        if (message.type === 'pong') {
          setResponse(`Received pong from server at ${new Date().toLocaleTimeString()}`);
        } else if (message.type === 'system_info') {
          setSystemInfo(message.payload || message.data);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };
    
    // Add event listener to window for WebSocket messages
    window.addEventListener('message', (event) => {
      if (event.data && event.data.source === 'websocket') {
        handleWebSocketMessage(event.data);
      }
    });
    
    return () => {
      window.removeEventListener('message', handleWebSocketMessage);
    };
  }, []);

  // Test WebSocket connection
  const testConnection = () => {
    if (connected) {
      sendMessage('ping', { timestamp: new Date().toISOString() });
      setResponse('Ping sent, waiting for response...');
    } else {
      setResponse('WebSocket not connected. Cannot send message.');
    }
  };

  // Request system info
  const getSystemInfo = () => {
    if (connected) {
      sendMessage('get_system_info', {});
      setResponse('System info requested, waiting for response...');
    } else {
      setResponse('WebSocket not connected. Cannot request system info.');
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">OROBORO NEXUS Diagnostics</h1>

      {/* WebSocket Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>WebSocket Connection Status</CardTitle>
          <CardDescription>Current status of the WebSocket connection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge className={connected ? "bg-green-500" : "bg-red-500"}>
                {connected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            
            {lastError && (
              <div className="flex flex-col gap-2">
                <span className="font-medium">Last Error:</span>
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded">
                  {lastError}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <span className="font-medium">Connection Details:</span>
              <div className="bg-slate-50 p-3 rounded text-sm font-mono">
                <div>Host: {connectionDetails.host}</div>
                <div>Protocol: {connectionDetails.protocol}</div>
                <div>Origin: {connectionDetails.origin}</div>
                <div>Pathname: {connectionDetails.pathname}</div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-2">
              <Button onClick={testConnection}>
                Test Connection
              </Button>
              <Button variant="outline" onClick={getSystemInfo}>
                Get System Info
              </Button>
            </div>
            
            {response && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-medium">Response:</span>
                <div className="bg-slate-50 p-3 rounded">
                  {response}
                </div>
              </div>
            )}
            
            {systemInfo && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-medium">System Information:</span>
                <div className="bg-slate-50 p-3 rounded text-sm font-mono">
                  <pre>{JSON.stringify(systemInfo, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}