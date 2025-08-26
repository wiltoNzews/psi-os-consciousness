import React, { Suspense } from 'react';
import { MODULE_REGISTRY, type WiltonModule } from './ModuleRegistryFixed';

/**
 * WiltonOS Dynamic Component Router
 * Renders authenticated components with fallback handling
 */

interface ComponentRouterProps {
  moduleId: string;
  onBack?: () => void;
}

const ComponentRouter: React.FC<ComponentRouterProps> = ({ moduleId, onBack }) => {
  const module = MODULE_REGISTRY[moduleId];
  
  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-400 mb-4">Module Not Found</h1>
          <p className="text-slate-400 mb-6">Module ID "{moduleId}" is not registered</p>
          {onBack && (
            <button 
              onClick={onBack}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  if (module.status === 'external' && module.externalUrl) {
    // Handle external modules
    React.useEffect(() => {
      window.open(module.externalUrl, '_blank');
      if (onBack) onBack();
    }, []);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl text-slate-200 mb-4">Opening External Module</h1>
          <p className="text-slate-400">{module.name}</p>
        </div>
      </div>
    );
  }

  if (!module.component) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">{module.icon}</div>
          <h1 className="text-2xl text-slate-200 mb-4">{module.name}</h1>
          <p className="text-slate-400 mb-6">{module.description}</p>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <h3 className="text-yellow-400 font-medium mb-2">Module in Development</h3>
            <p className="text-slate-300 text-sm">
              This module is registered but component implementation is in progress.
            </p>
          </div>
          {onBack && (
            <button 
              onClick={onBack}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render the actual component with error boundary
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌀</div>
          <div className="text-xl text-slate-200">Loading {module.name}...</div>
        </div>
      </div>
    }>
      <ErrorBoundary moduleId={moduleId} onBack={onBack}>
        {React.createElement(module.component)}
      </ErrorBoundary>
    </Suspense>
  );
};

// Error boundary for component failures
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; moduleId: string; onBack?: () => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`[ComponentRouter] Error in module ${this.props.moduleId}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const module = MODULE_REGISTRY[this.props.moduleId];
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-2xl text-red-400 mb-4">Module Error</h1>
            <p className="text-slate-200 mb-2">{module?.name || this.props.moduleId}</p>
            <p className="text-slate-400 mb-6">Component failed to load</p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-red-400 font-medium mb-2">Error Details</h3>
              <p className="text-slate-300 text-sm font-mono">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white"
              >
                Reload Page
              </button>
              {this.props.onBack && (
                <button 
                  onClick={this.props.onBack}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  Return to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ComponentRouter;