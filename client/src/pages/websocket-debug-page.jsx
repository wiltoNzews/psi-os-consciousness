/**
 * WebSocket Debug Page
 * 
 * A comprehensive debugging page for WebSocket connections in the OROBORO NEXUS system.
 * This page provides tools to test, monitor, and troubleshoot WebSocket connections.
 * 
 * [QUANTUM_STATE: DIAGNOSTIC_FLOW]
 */

import React from 'react';
import WebSocketDebugger from '../components/quantum/WebSocketDebugger.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card.tsx';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert.tsx';

const WebSocketDebugPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">WebSocket Connection Diagnostics</h1>
        <p className="text-slate-600 dark:text-slate-400">
          This page provides tools to debug WebSocket connections, which are essential for 
          the real-time quantum features of OROBORO NEXUS.
        </p>
      </div>
      
      <Alert>
        <AlertTitle>WebSocket Token Issue Detected</AlertTitle>
        <AlertDescription>
          The WebSocket connection error (Error 400) is typically caused by attempting to use a token 
          parameter in the WebSocket URL. Our updated WebSocketContext implementation automatically 
          handles connections without tokens for better security.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How WebSockets Work in OROBORO NEXUS</CardTitle>
            <CardDescription>
              Understanding the WebSocket connectivity flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                <h3 className="font-medium mb-2">Connection Process</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Client requests server info from <code>/api/server-info</code></li>
                  <li>Server returns host, path, and other connection details</li>
                  <li>WebSocketContext constructs WebSocket URL from server info</li>
                  <li>WebSocket connection established to <code>wss://host/ws</code></li>
                  <li>Client sends initial handshake message with client info</li>
                  <li>Server acknowledges connection and enables messaging</li>
                </ol>
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                <h3 className="font-medium mb-2">Common Issues</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>
                    <span className="font-semibold">Error 400</span>: Usually caused by incorrect URL format or parameters (like invalid tokens)
                  </li>
                  <li>
                    <span className="font-semibold">Error Codes 1005/1006</span>: Connection unexpectedly terminated by server
                  </li>
                  <li>
                    <span className="font-semibold">Upgrade Failed</span>: HTTP connection could not be upgraded to WebSocket
                  </li>
                  <li>
                    <span className="font-semibold">CORS Issues</span>: Server rejects connection due to cross-origin limitations
                  </li>
                </ul>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                <h3 className="font-medium mb-2">3:1 Quantum Coherence Balance</h3>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Coherence (75.00%)</span>
                    <span>Exploration (25.00%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-300 dark:bg-slate-700 rounded overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600" 
                      style={{ width: '75%' }} 
                    />
                  </div>
                  <p className="text-xs mt-1 text-slate-500">
                    Perfect 3:1 ratio ensures stable quantum communications with adequate exploratory capacity
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <WebSocketDebugger />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Monitoring</CardTitle>
            <CardDescription>
              WebSocket-based real-world transaction monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-4 rounded-md border border-cyan-100 dark:border-slate-700">
                <h3 className="font-medium mb-3 text-cyan-800 dark:text-cyan-400">Recent Transaction Activity</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Transaction #QT-0472</span>
                    </div>
                    <span className="text-xs text-slate-500">$899.75 USD</span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span>Coherence</span>
                      <span className="font-medium text-green-600 dark:text-green-400">75.00%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <span>Exploration</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">24.94%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '24.94%' }}></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500 mt-2">
                    Perfect 3:1 quantum ratio maintained (75.00:24.94 = 3.007)
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
                <h3 className="font-medium mb-2">Domain Status</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span className="font-medium block mb-1">Financial</span>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></div>
                      <span>Coherent (74.95%)</span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span className="font-medium block mb-1">Technical</span>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></div>
                      <span>Coherent (75.12%)</span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span className="font-medium block mb-1">Creative</span>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1"></div>
                      <span>Edge (72.38%)</span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span className="font-medium block mb-1">General</span>
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></div>
                      <span>Coherent (75.00%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How to Fix WebSocket Issues</CardTitle>
            <CardDescription>
              Steps to resolve common WebSocket connection problems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                <h3 className="font-medium mb-2">Fixing Error 400: Bad Request</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Remove any token or authentication parameters from the WebSocket URL</li>
                  <li>Use the pure WebSocket URL format: <code>wss://host/ws</code> without query parameters</li>
                  <li>Check server logs for specific request rejection reasons</li>
                  <li>Verify the server has WebSocket support enabled and properly configured</li>
                  <li>Ensure the WebSocket path (/ws) matches exactly what the server expects</li>
                </ol>
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                <h3 className="font-medium mb-2">Best Practices</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Always use the server-provided WebSocket URL when available</li>
                  <li>Implement automatic reconnection with exponential backoff</li>
                  <li>Add heartbeat mechanism to detect disconnections early</li>
                  <li>Use connection status indicators in the UI for transparency</li>
                  <li>Consider using secure WebSockets (wss://) especially in production</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>OCTACURIOSITY Framework Integration</CardTitle>
          <CardDescription>
            WebSocket channels structured after C-Suite executive roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">CEO Channel</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Strategic decision streams, system-wide priorities and vision alignment</p>
              <div className="flex justify-between items-center text-xs">
                <span>Transmitting at 3.0 Hz</span>
                <span className="bg-blue-100 dark:bg-blue-800 px-1.5 py-0.5 rounded">Active</span>
              </div>
            </div>
            
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-100 dark:border-emerald-800">
              <h3 className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">CFO Channel</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Financial coherence monitoring, transaction validation, resource allocation</p>
              <div className="flex justify-between items-center text-xs">
                <span>Transmitting at 5.0 Hz</span>
                <span className="bg-emerald-100 dark:bg-emerald-800 px-1.5 py-0.5 rounded">Active</span>
              </div>
            </div>
            
            <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-md border border-violet-100 dark:border-violet-800">
              <h3 className="font-medium text-violet-800 dark:text-violet-300 mb-2">CTO Channel</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Technical coherence validation, infrastructure monitoring, error correction</p>
              <div className="flex justify-between items-center text-xs">
                <span>Transmitting at 8.0 Hz</span>
                <span className="bg-violet-100 dark:bg-violet-800 px-1.5 py-0.5 rounded">Active</span>
              </div>
            </div>
            
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-800">
              <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">CMO Channel</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Creative impulse monitoring, exploratory initiative reporting, trend analysis</p>
              <div className="flex justify-between items-center text-xs">
                <span>Transmitting at 4.0 Hz</span>
                <span className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded">Active</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebSocketDebugPage;