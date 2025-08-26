import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  performFullSystemScan,
  generateAutoFix,
  applyQuickFixes
} from '@/core/SystemDiagnostic';
import { MODULE_REGISTRY } from '@/core/ModuleRegistryFixed';
import { createWiltonFold, validateCoherenceFold } from '@/core/WiltonFold';

const SystemDiagnosticDashboard: React.FC = () => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [autoFixCode, setAutoFixCode] = useState('');
  const [showFix, setShowFix] = useState(false);

  useEffect(() => {
    performScan();
  }, []);

  const performScan = async () => {
    setIsScanning(true);
    try {
      const result = performFullSystemScan();
      setScanResult(result);
    } catch (error) {
      console.error('System scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateFix = () => {
    const fixCode = generateAutoFix();
    setAutoFixCode(fixCode);
    setShowFix(true);
  };

  const handleApplyFixes = () => {
    const result = applyQuickFixes();
    setScanResult(result);
  };

  const getHealthPercentage = () => {
    if (!scanResult) return 0;
    return Math.round((scanResult.healthyModules / scanResult.totalModules) * 100);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getIssueIcon = (issue: string) => {
    switch (issue) {
      case 'nested_sidebar': return '🔄';
      case 'missing_component': return '❌';
      case 'broken_route': return '🚫';
      case 'import_error': return '⚠️';
      default: return '❓';
    }
  };

  if (isScanning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6 flex items-center justify-center">
        <Card className="bg-slate-800/80 border-slate-700 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">System Scan in Progress</h3>
            <p className="text-slate-400">Using WiltonFold to analyze module coherence...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <div className="container mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-blue-300 flex items-center justify-center gap-3">
              <span className="text-3xl">🔍</span>
              System Diagnostic Dashboard
            </CardTitle>
            <p className="text-slate-400 text-center">
              WiltonFold-powered analysis of module routing and coherence
            </p>
          </CardHeader>
        </Card>

        {scanResult && (
          <>
            {/* System Health Overview */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-slate-400">Overall Health</div>
                    <div className="text-2xl font-bold text-white mb-2">
                      {getHealthPercentage()}%
                    </div>
                    <Progress value={getHealthPercentage()} className="h-2" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Total Modules</div>
                    <div className="text-lg font-mono text-white">
                      {scanResult.totalModules}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Healthy Modules</div>
                    <div className="text-lg font-mono text-green-400">
                      {scanResult.healthyModules}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Issues Found</div>
                    <div className="text-lg font-mono text-red-400">
                      {scanResult.routingIssues.length}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={performScan}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    🔄 Rescan System
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      onClick={handleGenerateFix}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      🛠️ Generate Auto-Fix
                    </Button>
                    
                    <Button 
                      onClick={handleApplyFixes}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      ⚡ Apply Quick Fixes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Routing Issues */}
              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-300">Routing Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scanResult.routingIssues.length === 0 ? (
                    <div className="text-center py-8 text-green-400">
                      ✓ No routing issues detected
                    </div>
                  ) : (
                    scanResult.routingIssues.map((issue: any, index: number) => (
                      <div key={index} className="p-4 bg-slate-900/50 border border-slate-600 rounded">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getIssueIcon(issue.issue)}</span>
                            <span className="font-medium text-white">{issue.moduleId}</span>
                          </div>
                          <Badge className={`${getSeverityColor(issue.severity)} text-white border-none text-xs`}>
                            {issue.severity.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-red-400">Issue:</span>
                            <span className="ml-2 text-slate-300">{issue.description}</span>
                          </div>
                          <div>
                            <span className="text-green-400">Fix:</span>
                            <span className="ml-2 text-slate-300">{issue.fix}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Broken Modules */}
              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-300">Broken Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  {scanResult.brokenModules.length === 0 ? (
                    <div className="text-center py-8 text-green-400">
                      ✓ All modules are functional
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {scanResult.brokenModules.map((moduleId: string) => (
                        <div key={moduleId} className="p-3 bg-red-900/30 border border-red-500/50 rounded">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{moduleId}</span>
                            <Badge className="bg-red-600 text-white border-none text-xs">
                              BROKEN
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-300 mt-1">
                            {MODULE_REGISTRY[moduleId]?.description || 'No description available'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Recommendations */}
            <Card className="bg-slate-800/80 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-300">System Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scanResult.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="p-3 bg-blue-900/30 border border-blue-500/50 rounded">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5">💡</span>
                        <span className="text-slate-300">{rec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </>
        )}

      </div>

      {/* Auto-Fix Code Modal */}
      {showFix && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <Card className="bg-slate-800 border-slate-700 p-6 max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-300">Generated Auto-Fix Code</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowFix(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              
              <pre className="bg-slate-900 p-4 rounded border border-slate-600 text-xs text-green-400 h-96 overflow-auto">
                {autoFixCode}
              </pre>
              
              <div className="flex space-x-2 justify-end">
                <Button 
                  onClick={() => navigator.clipboard.writeText(autoFixCode)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Copy Code
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowFix(false)}
                  className="border-slate-600"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};

export default SystemDiagnosticDashboard;