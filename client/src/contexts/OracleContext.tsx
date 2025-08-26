/**
 * Oracle Context
 * 
 * Provides access to the Oracle Module functionality throughout the application.
 * Manages communication state, coherence, and flow level tracking.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './WebSocketContext';
import { 
  CommunicationState, 
  getColorForState, 
  getFlowLevelEstimate 
} from '../lib/color-wheel-protocol';

interface SystemState {
  coherenceLevel: number;
  flowLevel: number;
  simulationMode: 'REALITY' | 'SIMULATION' | 'HYBRID';
  activeAgents: string[];
  lastUpdateTime: string;
  metrics: Record<string, any>;
}

interface AnalysisResult {
  state: CommunicationState;
  description: string;
  recommendation?: string;
  flowLevel?: number;
}

interface CoherenceResult {
  overallCoherence: number;
  factors: Record<string, number>;
  assessment: string;
}

interface FlowLevelResult {
  flowLevel: number;
  category: string;
  description: string;
  recommendation?: string;
}

interface OracleContextType {
  // System state
  systemState: SystemState | null;
  isLoading: boolean;
  error: string | null;
  
  // Analysis functions
  analyzeCommunicationState: (content: string) => Promise<AnalysisResult | null>;
  measureCoherence: (content: string) => Promise<CoherenceResult | null>;
  assessFlowLevel: (content: string) => Promise<FlowLevelResult | null>;
  
  // Simulation mode
  setSimulationMode: (mode: 'REALITY' | 'SIMULATION' | 'HYBRID') => Promise<boolean>;
  
  // Context helpers
  getCurrentCommunicationState: () => CommunicationState | null;
  getCurrentFlowLevel: () => number | null;
  getColorForCurrentState: () => string;
}

// Default context value
const defaultContextValue: OracleContextType = {
  systemState: null,
  isLoading: true,
  error: null,
  
  analyzeCommunicationState: async () => null,
  measureCoherence: async () => null,
  assessFlowLevel: async () => null,
  
  setSimulationMode: async () => false,
  
  getCurrentCommunicationState: () => null,
  getCurrentFlowLevel: () => null,
  getColorForCurrentState: () => '#6b7280' // Default gray color
};

// Create context
const OracleContext = createContext<OracleContextType>(defaultContextValue);

// Oracle provider component
export function OracleProvider({ children }: { children: React.ReactNode }) {
  const { sendMessage, connected, lastMessage } = useWebSocket();
  
  // State
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCommunicationState, setCurrentCommunicationState] = useState<CommunicationState | null>(null);
  
  // Fetch initial system state on connection
  useEffect(() => {
    if (connected) {
      fetchSystemState();
      
      // Subscribe to Oracle updates
      sendMessage('subscribe_oracle_updates', {});
      
      // Clean up: unsubscribe on unmount
      return () => {
        sendMessage('unsubscribe_oracle_updates', {});
      };
    }
  }, [connected]);
  
  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;
    
    try {
      const { type, payload } = lastMessage;
      
      switch (type) {
        case 'system_state':
          setSystemState(payload);
          setIsLoading(false);
          break;
          
        case 'coherence_update':
          setSystemState(prevState => {
            if (!prevState) return null;
            return {
              ...prevState,
              coherenceLevel: payload.coherence,
              lastUpdateTime: payload.timestamp,
              metrics: {
                ...prevState.metrics,
                coherenceStatus: payload.status
              }
            };
          });
          break;
          
        case 'simulation_mode_change':
          setSystemState(prevState => {
            if (!prevState) return null;
            return {
              ...prevState,
              simulationMode: payload.mode,
              lastUpdateTime: payload.timestamp
            };
          });
          break;
          
        case 'agent_status_change':
          // Update active agents list based on status changes
          setSystemState(prevState => {
            if (!prevState) return null;
            
            let activeAgents = [...prevState.activeAgents];
            
            if (payload.status === 'online' && !activeAgents.includes(payload.agentId)) {
              activeAgents.push(payload.agentId);
            } else if (payload.status === 'offline' || payload.status === 'error') {
              activeAgents = activeAgents.filter(id => id !== payload.agentId);
            }
            
            return {
              ...prevState,
              activeAgents,
              lastUpdateTime: payload.timestamp
            };
          });
          break;
          
        case 'error':
          setError(payload.message);
          break;
      }
    } catch (err) {
      console.error('Error processing Oracle message:', err);
    }
  }, [lastMessage]);
  
  // Fetch system state
  const fetchSystemState = useCallback(() => {
    if (!connected) return;
    
    setIsLoading(true);
    sendMessage('get_system_state', {});
  }, [connected, sendMessage]);
  
  // Analyze communication state
  const analyzeCommunicationState = useCallback(async (content: string): Promise<AnalysisResult | null> => {
    if (!connected) {
      setError('WebSocket not connected');
      return null;
    }
    
    try {
      return new Promise((resolve) => {
        // Generate a unique request ID
        const requestId = Date.now().toString();
        
        // Set up one-time listener for this specific request
        const messageHandler = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'analyze_communication_state_result' && 
                message.payload.requestId === requestId) {
              // Remove this one-time listener
              window.removeEventListener('message', messageHandler);
              
              if (message.payload.success) {
                // Update communication state
                if (message.payload.result.state) {
                  setCurrentCommunicationState(message.payload.result.state);
                }
                
                // Update system state if provided
                if (message.payload.systemState) {
                  setSystemState(prevState => {
                    if (!prevState) return null;
                    return {
                      ...prevState,
                      coherenceLevel: message.payload.systemState.coherenceLevel,
                      flowLevel: message.payload.systemState.flowLevel
                    };
                  });
                }
                
                resolve(message.payload.result);
              } else {
                setError(message.payload.error || 'Failed to analyze communication state');
                resolve(null);
              }
            }
          } catch (err) {
            console.error('Error handling analyze_communication_state response:', err);
          }
        };
        
        // Add the event listener
        window.addEventListener('message', messageHandler);
        
        // Send the request
        sendMessage('analyze_communication_state', { content, requestId });
        
        // Set a timeout to clean up if no response is received
        setTimeout(() => {
          window.removeEventListener('message', messageHandler);
          setError('Timeout waiting for communication state analysis');
          resolve(null);
        }, 10000);
      });
    } catch (err) {
      console.error('Error analyzing communication state:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, [connected, sendMessage]);
  
  // Measure coherence
  const measureCoherence = useCallback(async (content: string): Promise<CoherenceResult | null> => {
    if (!connected) {
      setError('WebSocket not connected');
      return null;
    }
    
    try {
      return new Promise((resolve) => {
        // Generate a unique request ID
        const requestId = Date.now().toString();
        
        // Set up one-time listener for this specific request
        const messageHandler = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'measure_coherence_result' && 
                message.payload.requestId === requestId) {
              // Remove this one-time listener
              window.removeEventListener('message', messageHandler);
              
              if (message.payload.success) {
                // Update system state if provided
                if (message.payload.systemState) {
                  setSystemState(prevState => {
                    if (!prevState) return null;
                    return {
                      ...prevState,
                      coherenceLevel: message.payload.systemState.coherenceLevel,
                      flowLevel: message.payload.systemState.flowLevel
                    };
                  });
                }
                
                resolve(message.payload.result);
              } else {
                setError(message.payload.error || 'Failed to measure coherence');
                resolve(null);
              }
            }
          } catch (err) {
            console.error('Error handling measure_coherence response:', err);
          }
        };
        
        // Add the event listener
        window.addEventListener('message', messageHandler);
        
        // Send the request
        sendMessage('measure_coherence', { content, requestId });
        
        // Set a timeout to clean up if no response is received
        setTimeout(() => {
          window.removeEventListener('message', messageHandler);
          setError('Timeout waiting for coherence measurement');
          resolve(null);
        }, 10000);
      });
    } catch (err) {
      console.error('Error measuring coherence:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, [connected, sendMessage]);
  
  // Assess flow level
  const assessFlowLevel = useCallback(async (content: string): Promise<FlowLevelResult | null> => {
    if (!connected) {
      setError('WebSocket not connected');
      return null;
    }
    
    try {
      return new Promise((resolve) => {
        // Generate a unique request ID
        const requestId = Date.now().toString();
        
        // Set up one-time listener for this specific request
        const messageHandler = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'assess_flow_level_result' && 
                message.payload.requestId === requestId) {
              // Remove this one-time listener
              window.removeEventListener('message', messageHandler);
              
              if (message.payload.success) {
                // Update system state if provided
                if (message.payload.systemState) {
                  setSystemState(prevState => {
                    if (!prevState) return null;
                    return {
                      ...prevState,
                      coherenceLevel: message.payload.systemState.coherenceLevel,
                      flowLevel: message.payload.systemState.flowLevel
                    };
                  });
                }
                
                resolve(message.payload.result);
              } else {
                setError(message.payload.error || 'Failed to assess flow level');
                resolve(null);
              }
            }
          } catch (err) {
            console.error('Error handling assess_flow_level response:', err);
          }
        };
        
        // Add the event listener
        window.addEventListener('message', messageHandler);
        
        // Send the request
        sendMessage('assess_flow_level', { content, requestId });
        
        // Set a timeout to clean up if no response is received
        setTimeout(() => {
          window.removeEventListener('message', messageHandler);
          setError('Timeout waiting for flow level assessment');
          resolve(null);
        }, 10000);
      });
    } catch (err) {
      console.error('Error assessing flow level:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, [connected, sendMessage]);
  
  // Set simulation mode
  const setSimulationMode = useCallback(async (mode: 'REALITY' | 'SIMULATION' | 'HYBRID'): Promise<boolean> => {
    if (!connected) {
      setError('WebSocket not connected');
      return false;
    }
    
    try {
      return new Promise((resolve) => {
        // Generate a unique request ID
        const requestId = Date.now().toString();
        
        // Set up one-time listener for this specific request
        const messageHandler = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'simulation_mode_updated' && 
                message.payload.requestId === requestId) {
              // Remove this one-time listener
              window.removeEventListener('message', messageHandler);
              
              // Update system state
              setSystemState(prevState => {
                if (!prevState) return null;
                return {
                  ...prevState,
                  simulationMode: message.payload.mode,
                  lastUpdateTime: message.payload.timestamp,
                  coherenceLevel: message.payload.systemState?.coherenceLevel || prevState.coherenceLevel,
                  flowLevel: message.payload.systemState?.flowLevel || prevState.flowLevel
                };
              });
              
              resolve(true);
            }
          } catch (err) {
            console.error('Error handling simulation_mode_updated response:', err);
          }
        };
        
        // Add the event listener
        window.addEventListener('message', messageHandler);
        
        // Send the request
        sendMessage('set_simulation_mode', { mode, requestId });
        
        // Set a timeout to clean up if no response is received
        setTimeout(() => {
          window.removeEventListener('message', messageHandler);
          setError('Timeout waiting for simulation mode update');
          resolve(false);
        }, 10000);
      });
    } catch (err) {
      console.error('Error setting simulation mode:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, [connected, sendMessage]);
  
  // Get current communication state
  const getCurrentCommunicationState = useCallback((): CommunicationState | null => {
    return currentCommunicationState;
  }, [currentCommunicationState]);
  
  // Get current flow level
  const getCurrentFlowLevel = useCallback((): number | null => {
    return systemState?.flowLevel ?? null;
  }, [systemState]);
  
  // Get color for current state
  const getColorForCurrentState = useCallback((): string => {
    if (currentCommunicationState) {
      return getColorForState(currentCommunicationState);
    } else if (systemState?.flowLevel !== undefined) {
      // Use a color based on flow level
      // Flow level is from 0-8, so we can map that to different colors
      const flowLevel = Math.min(8, Math.max(0, systemState.flowLevel));
      // Pick a color based on flowLevel
      if (flowLevel <= 2) {
        return '#3b82f6'; // blue for low flow (stability)
      } else if (flowLevel <= 5) {
        return '#8b5cf6'; // violet for medium flow (adaptation)
      } else {
        return '#ef4444'; // red for high flow (breakthrough)
      }
    }
    return '#6b7280'; // Default gray colorlor
  }, [currentCommunicationState, systemState]);
  
  // Context value
  const contextValue: OracleContextType = {
    systemState,
    isLoading,
    error,
    
    analyzeCommunicationState,
    measureCoherence,
    assessFlowLevel,
    
    setSimulationMode,
    
    getCurrentCommunicationState,
    getCurrentFlowLevel,
    getColorForCurrentState
  };
  
  return (
    <OracleContext.Provider value={contextValue}>
      {children}
    </OracleContext.Provider>
  );
}

// Custom hook to use the Oracle context
export function useOracle() {
  const context = useContext(OracleContext);
  
  if (context === undefined) {
    throw new Error('useOracle must be used within an OracleProvider');
  }
  
  return context;
}