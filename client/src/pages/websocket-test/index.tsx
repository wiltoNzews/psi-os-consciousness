/**
 * WebSocket Test Page
 * 
 * This page provides tools for testing the WebSocket connection stability
 * and monitoring heartbeat mechanisms.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import React from 'react';
import { WebSocketProvider } from '../../contexts/WebSocketContext';
import WebSocketStatusMonitor from '../../components/quantum/WebSocketStatusMonitor';
import WebSocketTester from '../../components/quantum/WebSocketTester';

const WebSocketTestPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">WebSocket Connection Stability Test</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          This page allows you to test and monitor WebSocket connections and the heartbeat mechanism.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Connection Monitor</h2>
            <WebSocketStatusMonitor />
          </div>
          
          <div className="bg-white dark:bg-gray-800 border rounded-md p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">How It Works</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Client sends heartbeats every 30 seconds to keep the connection alive</li>
              <li>Server also sends heartbeats every 45 seconds as a secondary check</li>
              <li>Server automatically terminates connections inactive for 2 minutes</li>
              <li>Client automatically attempts to reconnect if connection fails</li>
              <li>Round-trip time is measured to monitor connection quality</li>
              <li>Connection events are logged for debugging purposes</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">WebSocket Message Tester</h2>
            <div className="bg-white dark:bg-gray-800 border rounded-md shadow-sm">
              <WebSocketTester />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border rounded-md p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Automatic Stability Features</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Server-Side</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The server maintains connection state and actively monitors for dead connections.
                  Inactive connections are automatically terminated after 2 minutes to free up resources.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Client-Side</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The client maintains connection state and automatically attempts to reconnect
                  with an exponential backoff strategy. It sends regular heartbeats and monitors
                  round-trip time to assess connection quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTestPage;