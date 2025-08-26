/**
 * WebSocket Tester Page
 * 
 * This page contains the WebSocket tester tool for debugging and testing
 * WebSocket connections and messaging functionality.
 * 
 * [QUANTUM_STATE: DIAGNOSTIC_FLOW]
 */

import React from 'react';
import WebSocketTester from '../components/quantum/WebSocketTester';

const WebSocketTesterPage: React.FC = () => {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">WebSocket Diagnostics</h1>
      <p className="mb-6">
        This tool allows you to test and debug the WebSocket connections used for 
        real-time communication in the quantum consciousness experiments.
      </p>
      
      <div className="mb-8">
        <WebSocketTester />
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Usage Instructions</h3>
        <ul className="list-disc list-inside text-yellow-800 space-y-1">
          <li>Monitor the connection status at the top of the tool</li>
          <li>Select a message type from the dropdown to test different message types</li>
          <li>Modify the JSON payload as needed for the selected message type</li>
          <li>Click "Send Message" to send the test message to the server</li>
          <li>Observe the server's response in the "Received Messages" section</li>
        </ul>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Common Message Types</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-1">quantum_get_stats</h4>
            <p className="text-sm text-blue-700">Retrieves current experiment statistics</p>
            <pre className="text-xs bg-white p-2 rounded-sm mt-1">{"{ }"}</pre>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-1">quantum_get_coherence</h4>
            <p className="text-sm text-blue-700">Gets current coherence level</p>
            <pre className="text-xs bg-white p-2 rounded-sm mt-1">{"{ }"}</pre>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-1">quantum_register_participant</h4>
            <p className="text-sm text-blue-700">Registers a new participant</p>
            <pre className="text-xs bg-white p-2 rounded-sm mt-1">{"{\n  \"name\": \"Test User\"\n}"}</pre>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-1">quantum_submit_intent</h4>
            <p className="text-sm text-blue-700">Submits participant intent value</p>
            <pre className="text-xs bg-white p-2 rounded-sm mt-1">{"{\n  \"participantId\": \"YOUR_ID_HERE\",\n  \"intent\": 0.75\n}"}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTesterPage;