import React, { Component, ReactNode, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  moduleId?: string;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

class ModuleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ModuleErrorBoundary] Module failed to load:', error);
    console.error('[ModuleErrorBoundary] Error info:', errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800 text-white p-6 flex items-center justify-center">
          <Card className="bg-slate-800/80 border-red-700 max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-300 flex items-center justify-center gap-2">
                ⚠️ Module Load Error
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {this.props.moduleName || this.props.moduleId || 'Unknown Module'}
                </h3>
                <p className="text-slate-300 text-sm">
                  Failed to load module component
                </p>
              </div>

              <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded">
                <div className="font-mono">
                  {this.state.error?.message || 'Module loading timeout'}
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined });
                    window.location.reload();
                  }}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Reload Module
                </Button>
                
                <Button 
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="w-full border-slate-600"
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6 flex items-center justify-center">
          <Card className="bg-slate-800/80 border-slate-700 max-w-md">
            <CardContent className="p-6 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Loading {this.props.moduleName || 'Module'}
              </h3>
              <p className="text-slate-400">Initializing interface...</p>
            </CardContent>
          </Card>
        </div>
      }>
        {this.props.children}
      </Suspense>
    );
  }
}

export default ModuleErrorBoundary;