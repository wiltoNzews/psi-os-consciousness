/**
 * CognitiveAdapter - Core Processing Component
 * 
 * This component serves as the bridge between user interactions and the neural visualization.
 * It manages a web worker for heavy computational tasks and integrates with the Symbiosis Engine
 * to provide adaptation recommendations.
 * 
 * The component has responsibility for:
 * 1. Tracking user interactions
 * 2. Communicating with the neural processing worker
 * 3. Processing adaptation recommendations
 * 4. Providing clean data interfaces to visualization components
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { DomainType, useDomain } from '@/contexts/DomainContext';
import { 
  symbiosisEngine, 
  NeuralPattern, 
  NeuralMetrics, 
  SymbiosisRecommendation 
} from '@/lib/SymbiosisEngine';

// Worker communication interfaces
interface WorkerMessage {
  type: string;
  payload: any;
}

interface WorkerState {
  patterns: NeuralPattern[];
  activePatterns: string[];
  learningPhase: number;
  metrics: NeuralMetrics;
}

interface CognitiveAdapterProps {
  children: (props: {
    patterns: NeuralPattern[];
    activePatterns: string[];
    metrics: NeuralMetrics;
    learningPhase: number;
    recommendations: SymbiosisRecommendation[];
    isProcessing: boolean;
  }) => React.ReactNode;
  className?: string;
}

export function CognitiveAdapter({
  children,
  className = ''
}: CognitiveAdapterProps) {
  // Domain context
  const { activeDomain } = useDomain();
  
  // Worker reference
  const workerRef = useRef<Worker | null>(null);
  
  // State for neural processing
  const [workerState, setWorkerState] = useState<WorkerState>({
    patterns: [],
    activePatterns: [],
    learningPhase: 0.1,
    metrics: {
      emotionalContext: 'neutral',
      cognitiveLoad: 0.3,
      temporalRhythm: 1.0,
      confidenceScore: 0.5,
      alignmentScore: 0.8
    }
  });
  
  // Symbiosis engine output
  const [recommendations, setRecommendations] = useState<SymbiosisRecommendation[]>([]);
  
  // Worker status
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initialize web worker
  useEffect(() => {
    // Create worker
    const worker = new Worker(
      new URL('../../workers/neural-processing.worker.ts', import.meta.url),
      { type: 'module' }
    );
    
    // Store reference
    workerRef.current = worker;
    
    // Set up message handler
    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      const { type, payload } = e.data;
      
      switch (type) {
        case 'WORKER_READY':
          console.log('Neural processing worker initialized');
          setIsProcessing(false);
          break;
          
        case 'STATE_UPDATE':
          // Update state with worker data
          setWorkerState(payload);
          setIsProcessing(false);
          break;
      }
    };
    
    // Handle worker errors
    worker.onerror = (error) => {
      console.error('Neural processing worker error:', error);
      setIsProcessing(false);
    };
    
    // Initial state request
    worker.postMessage({ type: 'REQUEST_STATE' });
    
    // Cleanup worker on unmount
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);
  
  // Set domain in worker when it changes
  useEffect(() => {
    if (!workerRef.current) return;
    
    workerRef.current.postMessage({
      type: 'SET_DOMAIN',
      payload: activeDomain
    });
  }, [activeDomain]);
  
  // Track interactions and send to worker
  useEffect(() => {
    if (!workerRef.current) return;
    
    // Mouse move handler - significantly limit sampling rate to prevent overload and erratic movement
    let lastMoveTime = 0;
    const MOVE_THROTTLE = 150; // Increased from 50ms to 150ms
    let pendingMove: {x: number, y: number, timestamp: number} | null = null;
    let animationFrameId: number | null = null;
    
    // Use requestAnimationFrame for smoother updates
    const processPendingMove = () => {
      if (pendingMove && workerRef.current) {
        workerRef.current.postMessage({
          type: 'ADD_INTERACTION',
          payload: {
            type: 'mousemove',
            x: pendingMove.x,
            y: pendingMove.y,
            timestamp: pendingMove.timestamp
          }
        });
        
        pendingMove = null;
      }
      animationFrameId = null;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      // Skip if we're throttling and no animation frame is scheduled
      if (now - lastMoveTime < MOVE_THROTTLE) {
        // Just update the pending move, don't schedule anything new
        pendingMove = {
          x: e.clientX,
          y: e.clientY,
          timestamp: now
        };
        return;
      }
      
      lastMoveTime = now;
      
      if (!workerRef.current) return;
      
      // Store the move data for the next animation frame
      pendingMove = {
        x: e.clientX,
        y: e.clientY,
        timestamp: now
      };
      
      // Only schedule a new animation frame if one isn't already pending
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(processPendingMove);
      }
      
      // Only set processing state occasionally to avoid too many renders
      if (Math.random() < 0.2) {
        setIsProcessing(true);
      }
    };
    
    // Click handler
    const handleClick = (e: MouseEvent) => {
      if (!workerRef.current) return;
      
      setIsProcessing(true);
      
      workerRef.current.postMessage({
        type: 'ADD_INTERACTION',
        payload: {
          type: 'click',
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now()
        }
      });
    };
    
    // Keypress handler
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!workerRef.current) return;
      
      setIsProcessing(true);
      
      workerRef.current.postMessage({
        type: 'ADD_INTERACTION',
        payload: {
          type: 'keypress',
          x: 0, // Not applicable for keypress
          y: 0,
          key: e.key,
          timestamp: Date.now()
        }
      });
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('keypress', handleKeyPress);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);
  
  // Process recommendations through Symbiosis Engine
  useEffect(() => {
    // Skip processing if we don't have valid state yet
    if (workerState.patterns.length === 0) return;
    
    // Create interaction data for engine
    const interactionData = {
      type: 'combined', // Default type
      content: {
        patterns: workerState.patterns,
        activePatterns: workerState.activePatterns
      },
      timestamp: Date.now(),
      domain: activeDomain
    };
    
    // Process through engine
    const engineOutput = symbiosisEngine.processInteraction(
      interactionData,
      workerState.patterns,
      workerState.metrics
    );
    
    // Update recommendations
    setRecommendations(engineOutput.recommendations);
    
  }, [workerState, activeDomain]);

  // Reset handler - exposed for parent components
  const resetProcessing = useCallback(() => {
    if (!workerRef.current) return;
    
    workerRef.current.postMessage({ type: 'RESET' });
  }, []);
  
  // Render children with provided state
  return (
    <div className={className}>
      {children({
        patterns: workerState.patterns,
        activePatterns: workerState.activePatterns,
        metrics: workerState.metrics,
        learningPhase: workerState.learningPhase,
        recommendations,
        isProcessing
      })}
    </div>
  );
}