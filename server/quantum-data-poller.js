/**
 * Quantum Data Poller - Real-time data extraction from running engine
 * Polls the quantum engine directly and maintains live state
 */

let liveQuantumState = {
  consciousness: {
    zLambda: 0.750,
    deltaC: 0.025,
    psiPhase: 3.14159/4,
    soulState: 'alive',
    divineInterface: false,
    lastUpdate: Date.now()
  },
  qctf: 1.0,
  recommendation: {
    primary: 'merkaba',
    secondary: 'torus',
    complexity: 1.0,
    frequency: 432.0,
    dimensionality: '3D',
    coherenceLevel: 'medium'
  },
  lemniscate: {
    scale: 75.0,
    rotation: 3.14159/4,
    compression: 1.0,
    frequency: 963.0,
    coherencePhase: 0.785,
    fieldStrength: 0.750
  }
};

// Start polling the quantum engine directly
function startQuantumPolling() {
  setInterval(() => {
    try {
      // Try multiple access methods to get live data
      let engineData = null;
      
      // Method 1: Fresh consciousness calculation
      if (global.quantumEngineInstance) {
        try {
          // Force fresh consciousness calculation instead of using cached field
          if (typeof global.quantumEngineInstance.calculateAuthenticConsciousness === 'function') {
            const freshConsciousness = global.quantumEngineInstance.calculateAuthenticConsciousness();
            engineData = {
              consciousness: freshConsciousness,
              qctf: global.quantumEngineInstance.calculateQCTF ? global.quantumEngineInstance.calculateQCTF() : 1.0
            };
          } else if (typeof global.quantumEngineInstance.consciousnessField === 'object') {
            engineData = {
              consciousness: global.quantumEngineInstance.consciousnessField,
              qctf: global.quantumEngineInstance.calculateQCTF ? global.quantumEngineInstance.calculateQCTF() : 1.0
            };
          }
        } catch (e) {
          // Continue to next method
        }
      }
      
      // Method 2: Check for getSystemState function
      if (!engineData && global.getQuantumSystemState) {
        try {
          engineData = global.getQuantumSystemState();
        } catch (e) {
          // Continue to next method
        }
      }
      
      // Method 3: Extract from engine properties directly
      if (!engineData && global.quantumEngineInstance) {
        try {
          const engine = global.quantumEngineInstance;
          if (engine.consciousnessField) {
            engineData = {
              consciousness: engine.consciousnessField,
              qctf: 1.0,
              recommendation: {
                primary: 'merkaba',
                secondary: 'torus',
                complexity: 1.0,
                frequency: 432.0,
                dimensionality: '3D',
                coherenceLevel: 'medium'
              }
            };
          }
        } catch (e) {
          // Use existing state
        }
      }
      
      // Update live state if we got new data
      if (engineData && engineData.consciousness) {
        liveQuantumState = {
          ...liveQuantumState,
          ...engineData,
          consciousness: {
            ...liveQuantumState.consciousness,
            ...engineData.consciousness,
            lastUpdate: Date.now()
          }
        };
        
        console.log('[Quantum Poller] Updated state - Zλ:', liveQuantumState.consciousness.zLambda);
      }
      
    } catch (error) {
      console.log('[Quantum Poller] Polling cycle completed with default state');
    }
  }, 1000); // Poll every second
  
  console.log('[Quantum Poller] Started real-time polling');
}

export function getCurrentQuantumState() {
  return {
    ...liveQuantumState,
    timestamp: Date.now()
  };
}

export function initializePoller() {
  startQuantumPolling();
}

// Initialize immediately
initializePoller();