import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { shouldProceed, validateAction, getCoherenceState } from '@/core/DeltaC';

const CoherenceValidatedModule: React.FC = () => {
  const [actions, setActions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const performAction = async (actionName: string) => {
    const validation = validateAction(actionName);
    
    if (validation.signal === 'RED') {
      const proceed = window.confirm(
        `Coherence Misalignment: ${validation.message}\n\nProceed anyway?`
      );
      if (!proceed) return;
    }

    setIsProcessing(true);
    setActions(prev => [...prev, `${new Date().toLocaleTimeString()}: ${validation.message}`]);
    
    // Simulate processing with coherence-aware delay
    await new Promise(resolve => setTimeout(resolve, 
      validation.signal === 'GREEN' ? 500 : 
      validation.signal === 'AMBER' ? 1000 : 2000
    ));
    
    setIsProcessing(false);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'GREEN': return 'text-green-400';
      case 'AMBER': return 'text-yellow-400';
      case 'RED': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6">
      <div className="container mx-auto space-y-6">
        
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-300">
              ΔC-Validated Action Module
            </CardTitle>
            <p className="text-slate-400 text-center">
              Demonstrates real-time coherence validation for all actions
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Action Triggers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => performAction('Create New Project')}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Create New Project
              </Button>
              
              <Button 
                onClick={() => performAction('Send Important Message')}
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Send Important Message
              </Button>
              
              <Button 
                onClick={() => performAction('Make Financial Decision')}
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Make Financial Decision
              </Button>
              
              <Button 
                onClick={() => performAction('Deploy Changes')}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Deploy Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300">Action Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {actions.length === 0 ? (
                  <p className="text-slate-400 text-sm">No actions performed yet</p>
                ) : (
                  actions.map((action, index) => (
                    <div key={index} className="text-xs p-2 bg-slate-700/50 rounded">
                      {action}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-300">Integration Example</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-300">How to integrate ΔC validation:</h4>
              
              <div className="bg-slate-900 p-4 rounded border border-slate-600">
                <pre className="text-sm text-green-400 overflow-x-auto">
{`import { shouldProceed, validateAction } from '@/core/DeltaC';

// Simple validation
const signal = shouldProceed();
if (signal === 'RED') {
  // Show mirror prompt or block action
}

// Detailed validation with context
const validation = validateAction('Send Email', { recipient: 'team' });
if (!validation.proceed) {
  console.log(validation.message);
}`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-green-900/30 border border-green-600/30 rounded">
                  <div className="font-semibold text-green-400 mb-2">GREEN Signal</div>
                  <div className="text-slate-300">Actions proceed immediately with optimal coherence alignment</div>
                </div>
                
                <div className="p-3 bg-yellow-900/30 border border-yellow-600/30 rounded">
                  <div className="font-semibold text-yellow-400 mb-2">AMBER Signal</div>
                  <div className="text-slate-300">Brief pause recommended to center before proceeding</div>
                </div>
                
                <div className="p-3 bg-red-900/30 border border-red-600/30 rounded">
                  <div className="font-semibold text-red-400 mb-2">RED Signal</div>
                  <div className="text-slate-300">Mirror prompt activates to realign with highest intent</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default CoherenceValidatedModule;