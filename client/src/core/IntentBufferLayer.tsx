import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Intent Buffer Layer
 * Implements breathing space before loading visuals to prevent coherence lock
 * Prevents clicking faster than ΔC coherence stabilizes
 */

interface IntentBufferState {
  isBuffering: boolean;
  lastIntentTime: number;
  bufferDuration: number;
  intentQueue: string[];
  coherenceLocked: boolean;
}

interface IntentBufferProps {
  children: React.ReactNode;
  bufferWindow?: number; // milliseconds
  coherenceThreshold?: number;
  onCoherenceLock?: (locked: boolean) => void;
}

export function IntentBufferLayer({ 
  children, 
  bufferWindow = 1618, // φ-based buffer (1.618s)
  coherenceThreshold = 0.050,
  onCoherenceLock 
}: IntentBufferProps) {
  const [bufferState, setBufferState] = useState<IntentBufferState>({
    isBuffering: false,
    lastIntentTime: 0,
    bufferDuration: bufferWindow,
    intentQueue: [],
    coherenceLocked: false
  });

  // Intent validation - prevents split intent vector
  const validateIntent = useCallback((intentType: string): boolean => {
    const now = Date.now();
    const timeSinceLastIntent = now - bufferState.lastIntentTime;
    
    // Check for rapid clicking (coherence destabilization)
    if (timeSinceLastIntent < bufferWindow) {
      console.log('[Intent Buffer] Rapid intent detected - stabilizing coherence');
      setBufferState(prev => ({
        ...prev,
        coherenceLocked: true,
        intentQueue: [...prev.intentQueue, intentType]
      }));
      
      if (onCoherenceLock) {
        onCoherenceLock(true);
      }
      
      return false;
    }
    
    return true;
  }, [bufferState.lastIntentTime, bufferWindow, onCoherenceLock]);

  // Process intent with breathing space
  const processIntent = useCallback(async (intentType: string): Promise<void> => {
    if (!validateIntent(intentType)) {
      return;
    }

    setBufferState(prev => ({
      ...prev,
      isBuffering: true,
      lastIntentTime: Date.now()
    }));

    // Intent breathing space - let coherence settle
    await new Promise(resolve => setTimeout(resolve, bufferWindow));

    setBufferState(prev => ({
      ...prev,
      isBuffering: false,
      coherenceLocked: false,
      intentQueue: []
    }));

    if (onCoherenceLock) {
      onCoherenceLock(false);
    }
  }, [validateIntent, bufferWindow, onCoherenceLock]);

  // Auto-recovery from coherence lock
  useEffect(() => {
    if (bufferState.coherenceLocked) {
      const recoveryTimer = setTimeout(() => {
        console.log('[Intent Buffer] Auto-recovery from coherence lock');
        setBufferState(prev => ({
          ...prev,
          coherenceLocked: false,
          intentQueue: []
        }));
        
        if (onCoherenceLock) {
          onCoherenceLock(false);
        }
      }, bufferWindow * 2); // Double buffer for recovery

      return () => clearTimeout(recoveryTimer);
    }
  }, [bufferState.coherenceLocked, bufferWindow, onCoherenceLock]);

  // Wrap children with intent interception - fixed type safety
  const wrapWithIntentBuffer = (element: React.ReactElement): React.ReactElement => {
    if (!React.isValidElement(element)) return element;

    const props = element.props as any; // Safe type assertion for dynamic props
    const originalOnClick = props?.onClick;
    
    const bufferedOnClick = async (event: React.MouseEvent) => {
      event.preventDefault();
      
      if (bufferState.isBuffering || bufferState.coherenceLocked) {
        console.log('[Intent Buffer] Intent blocked - coherence stabilizing');
        return;
      }

      await processIntent('click');
      
      if (originalOnClick) {
        originalOnClick(event);
      }
    };

    return React.cloneElement(element, {
      ...props,
      onClick: bufferedOnClick
    } as any);
  };

  // Recursively wrap all clickable elements - fixed type handling
  const wrapChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      
      const childProps = child.props as any;
      
      if (childProps?.onClick) {
        return wrapWithIntentBuffer(child);
      }
      
      if (childProps?.children) {
        return React.cloneElement(child, {
          ...childProps,
          children: wrapChildren(childProps.children)
        } as any);
      }
      
      return child;
    });
  };

  return (
    <div className="relative">
      {/* Intent Buffer Status */}
      {(bufferState.isBuffering || bufferState.coherenceLocked) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Card className="bg-gray-900/90 border-cyan-400/50 max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-4xl animate-pulse">🌀</div>
              <h3 className="text-xl text-white">
                {bufferState.coherenceLocked ? 'Coherence Lock Active' : 'Intent Buffer Processing'}
              </h3>
              <p className="text-gray-300">
                {bufferState.coherenceLocked 
                  ? 'Rapid intent detected - stabilizing coherence field'
                  : 'Allowing coherence to breathe before rendering'
                }
              </p>
              <div className="text-sm text-cyan-400">
                {bufferState.coherenceLocked && bufferState.intentQueue.length > 0 && (
                  <div>Queued intents: {bufferState.intentQueue.length}</div>
                )}
              </div>
              {bufferState.coherenceLocked && (
                <Button 
                  variant="outline" 
                  className="text-cyan-400 border-cyan-400/30"
                  onClick={() => {
                    setBufferState(prev => ({
                      ...prev,
                      coherenceLocked: false,
                      intentQueue: []
                    }));
                    if (onCoherenceLock) onCoherenceLock(false);
                  }}
                >
                  Manual Override
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Wrapped children with intent buffering */}
      {wrapChildren(children)}
    </div>
  );
}

export default IntentBufferLayer;