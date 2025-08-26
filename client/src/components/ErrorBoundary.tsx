import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    console.warn('[WiltonOS] Error boundary caught:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[WiltonOS] Error boundary details:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-500 rounded-lg bg-red-50 dark:bg-red-900/20">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
            Component Error
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400">
            {this.state.error?.message || 'An unknown error occurred'}
          </p>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;