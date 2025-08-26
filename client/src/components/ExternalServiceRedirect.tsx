import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ExternalServiceRedirectProps {
  moduleId: string;
  moduleName: string;
  url?: string;
  ports?: number[];
}

const ExternalServiceRedirect: React.FC<ExternalServiceRedirectProps> = ({ 
  moduleId, 
  moduleName, 
  url, 
  ports = [3000, 8080, 5001, 3001, 4000] 
}) => {
  const [availableUrl, setAvailableUrl] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkServices = async () => {
      if (url) {
        setAvailableUrl(url);
        setIsChecking(false);
        return;
      }

      // Try common service patterns
      const possibleUrls = [
        `http://localhost:3000/${moduleId}`,
        `http://localhost:8080/${moduleId}`,
        `http://localhost:5001/${moduleId}`,
        ...ports.map(port => `http://localhost:${port}/${moduleId}`),
        ...ports.map(port => `http://localhost:${port}`)
      ];

      for (const testUrl of possibleUrls) {
        try {
          const response = await fetch(testUrl, { 
            method: 'HEAD',
            mode: 'no-cors'
          });
          setAvailableUrl(testUrl);
          break;
        } catch (error) {
          // Service not available on this URL
        }
      }
      
      setIsChecking(false);
    };

    checkServices();
  }, [moduleId, url, ports]);

  const handleRedirect = () => {
    if (availableUrl) {
      window.open(availableUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6 flex items-center justify-center">
        <Card className="bg-slate-800/80 border-slate-700 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">Detecting {moduleName}</h3>
            <p className="text-slate-400">Scanning for external service...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6 flex items-center justify-center">
      <Card className="bg-slate-800/80 border-slate-700 max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-purple-300">{moduleName}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center space-y-4">
          {availableUrl ? (
            <>
              <div className="text-green-400 text-lg mb-2">✓ Service Detected</div>
              <p className="text-slate-300 mb-4">
                External service found at:<br />
                <code className="text-purple-300">{availableUrl}</code>
              </p>
              <Button 
                onClick={handleRedirect}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Open {moduleName}
              </Button>
            </>
          ) : (
            <>
              <div className="text-yellow-400 text-lg mb-2">⚠ Service Offline</div>
              <p className="text-slate-300 mb-4">
                {moduleName} external service is not currently running.
              </p>
              <div className="text-sm text-slate-400 space-y-1">
                <p>Expected locations:</p>
                <ul className="text-xs">
                  {ports.map(port => (
                    <li key={port}>• localhost:{port}/{moduleId}</li>
                  ))}
                </ul>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full border-slate-600"
              >
                Retry Detection
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalServiceRedirect;