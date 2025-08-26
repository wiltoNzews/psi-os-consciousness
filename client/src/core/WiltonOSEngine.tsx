import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Core WiltonOS State Management
interface WiltonOSState {
  isAuthenticated: boolean;
  user: any;
  activeModule: string;
  geometryEngine: any;
  aiAgents: Record<string, any>;
  coherenceLevel: number;
  memoryField: any[];
  websocket: WebSocket | null;
  systemStatus: 'initializing' | 'ready' | 'error';
  lastUpdate: number;
}

interface WiltonOSAction {
  type: string;
  payload?: any;
}

const initialState: WiltonOSState = {
  isAuthenticated: false,
  user: null,
  activeModule: 'dashboard',
  geometryEngine: null,
  aiAgents: {},
  coherenceLevel: 0.750,
  memoryField: [],
  websocket: null,
  systemStatus: 'initializing',
  lastUpdate: Date.now()
};

function wiltonOSReducer(state: WiltonOSState, action: WiltonOSAction): WiltonOSState {
  switch (action.type) {
    case 'SET_ACTIVE_MODULE':
      return { ...state, activeModule: action.payload, lastUpdate: Date.now() };
    case 'UPDATE_COHERENCE':
      return { ...state, coherenceLevel: action.payload, lastUpdate: Date.now() };
    case 'REGISTER_AI_AGENT':
      return {
        ...state,
        aiAgents: { ...state.aiAgents, [action.payload.id]: action.payload },
        lastUpdate: Date.now()
      };
    case 'ADD_MEMORY':
      return {
        ...state,
        memoryField: [...state.memoryField, { ...action.payload, timestamp: Date.now() }],
        lastUpdate: Date.now()
      };
    case 'SET_WEBSOCKET':
      return { ...state, websocket: action.payload, lastUpdate: Date.now() };
    case 'SET_SYSTEM_STATUS':
      return { ...state, systemStatus: action.payload, lastUpdate: Date.now() };
    case 'SET_AUTH_STATE':
      return { 
        ...state, 
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        lastUpdate: Date.now()
      };
    default:
      return state;
  }
}

const WiltonOSContext = createContext<{
  state: WiltonOSState;
  dispatch: React.Dispatch<WiltonOSAction>;
} | null>(null);

export function WiltonOSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wiltonOSReducer, initialState);

  // System initialization
  useEffect(() => {
    let coherenceMonitor: NodeJS.Timeout;
    let wsConnection: WebSocket | null = null;
    
    const initializeSystem = async () => {
      try {
        // Skip WebSocket initialization for now to prevent connection errors
        // Future implementation can add proper WebSocket handling
        console.log('[WiltonOS] Initializing system in offline mode');
        dispatch({ type: 'SET_SYSTEM_STATUS', payload: 'ready' });

        // Initialize coherence monitoring
        coherenceMonitor = setInterval(() => {
          const currentCoherence = Math.min(1.0, Math.max(0.1, 
            0.750 + (Math.sin(Date.now() / 10000) * 0.2)
          ));
          dispatch({ type: 'UPDATE_COHERENCE', payload: currentCoherence });
        }, 5000);

      } catch (error) {
        console.error('[WiltonOS] System initialization error:', error);
        dispatch({ type: 'SET_SYSTEM_STATUS', payload: 'error' });
      }
    };

    initializeSystem();

    // Cleanup function
    return () => {
      if (coherenceMonitor) {
        clearInterval(coherenceMonitor);
      }
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, []);

  return (
    <WiltonOSContext.Provider value={{ state, dispatch }}>
      {children}
    </WiltonOSContext.Provider>
  );
}

export function useWiltonOS() {
  const context = useContext(WiltonOSContext);
  if (!context) {
    throw new Error('useWiltonOS must be used within a WiltonOSProvider');
  }
  return context;
}

export function useWiltonOSNavigation() {
  const { state, dispatch } = useWiltonOS();
  
  const navigateToModule = (moduleId: string) => {
    dispatch({ type: 'SET_ACTIVE_MODULE', payload: moduleId });
  };

  const goHome = () => {
    dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'dashboard' });
  };

  return {
    activeModule: state.activeModule,
    navigateToModule,
    goHome
  };
}

export function useAIAgents() {
  const { state, dispatch } = useWiltonOS();

  const registerAgent = (agent: { id: string; name: string; capabilities: string[] }) => {
    dispatch({ type: 'REGISTER_AI_AGENT', payload: agent });
  };

  const getAgent = (id: string) => {
    return state.aiAgents[id];
  };

  return {
    agents: state.aiAgents,
    registerAgent,
    getAgent
  };
}

export function useMemoryField() {
  const { state, dispatch } = useWiltonOS();

  const addMemory = (memory: { type: string; content: any; tags?: string[] }) => {
    dispatch({ type: 'ADD_MEMORY', payload: memory });
  };

  const getMemoriesByType = (type: string) => {
    return state.memoryField.filter(m => m.type === type);
  };

  const getRecentMemories = (hours = 24) => {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return state.memoryField.filter(m => m.timestamp > cutoff);
  };

  return {
    memories: state.memoryField,
    addMemory,
    getMemoriesByType,
    getRecentMemories
  };
}