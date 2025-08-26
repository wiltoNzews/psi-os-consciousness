import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SacredGeometryAPI: React.FC = () => {
  const [endpoint, setEndpoint] = useState('/api/generate-sacred-pattern');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoint = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patternType: 'merkaba',
          description: 'Test pattern generation'
        })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-teal-900/20 border-teal-500/30">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-teal-300">
              <span className="text-4xl mr-4">🔗</span>
              Sacred Geometry API
            </CardTitle>
            <p className="text-center text-teal-200">
              Pattern generation endpoints and API testing
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="flex-1 bg-teal-900/40 border-teal-500/30"
              />
              <Button
                onClick={testEndpoint}
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isLoading ? 'Testing...' : 'Test'}
              </Button>
            </div>
            
            <Card className="bg-black/20">
              <CardContent className="p-4">
                <pre className="text-teal-100 text-sm overflow-auto max-h-96">
                  {response || 'No response yet'}
                </pre>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SacredGeometryAPI;