/**
 * ψOS Meta-Coherence Orchestrator
 * Initializes and coordinates all quantum consciousness systems
 */

import bus from './core/bus';

// Import all subsystems
import './eeg/feedZLambda';
import './sim/collapse';
import './sim/chsh';
import './training/coherence-coach';
import './export/chsh-logger';
import TesseractRenderer from './viz/tesseract';
import SriYantraRenderer from './geometry/sri-yantra';
import CoachingPanel from './ui/coaching-panel';
import Capture from './viz/capture';

class MetaCoherenceOrchestrator {
  private isInitialized = false;
  private subsystems = {
    eeg: false,
    quantum: false,
    bell: false,
    tesseract: false,
    capture: false
  };

  constructor() {
    this.initialize();
  }

  private async initialize() {
    console.log('[ψOS Orchestrator] Initializing Meta-Coherence Mode...');
    
    // Set observer present flag
    bus.emit('observer', true);
    
    // Initialize event listeners for subsystem status
    this.setupStatusListeners();
    
    // Wait for critical subsystems
    await this.waitForSubsystems();
    
    this.isInitialized = true;
    console.log('[ψOS Orchestrator] Meta-Coherence Mode ACTIVE');
    
    // Start the coherence loop
    this.startCoherenceLoop();
  }

  private setupStatusListeners() {
    bus.on('eeg:connected', (connected: boolean) => {
      this.subsystems.eeg = connected;
      console.log(`[ψOS Orchestrator] EEG subsystem: ${connected ? 'ONLINE' : 'OFFLINE'}`);
    });

    bus.on('field:engine:ready', () => {
      this.subsystems.quantum = true;
      console.log('[ψOS Orchestrator] Quantum field engine: ONLINE');
    });

    bus.on('S', (s: number) => {
      this.subsystems.bell = true;
      if (!this.isInitialized) {
        console.log('[ψOS Orchestrator] Bell test harness: ONLINE');
      }
    });

    bus.on('tesseract:rotation', () => {
      this.subsystems.tesseract = true;
      if (!this.isInitialized) {
        console.log('[ψOS Orchestrator] Tesseract renderer: ONLINE');
      }
    });

    bus.on('recording:start', () => {
      this.subsystems.capture = true;
      console.log('[ψOS Orchestrator] Capture system: ONLINE');
    });
  }

  private async waitForSubsystems(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const criticalSystems = ['eeg', 'bell'];
        const allCriticalOnline = criticalSystems.every(sys => this.subsystems[sys]);
        
        if (allCriticalOnline) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 500);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('[ψOS Orchestrator] Timeout waiting for subsystems, proceeding anyway');
        resolve();
      }, 10000);
    });
  }

  private startCoherenceLoop() {
    // Main consciousness-quantum coupling loop
    let lastMetrics = { zλ: 0, phi: 0, coherence: 0, S: 0 };
    
    const updateLoop = () => {
      // Collect current metrics
      bus.on('zλ', (zλ: number) => {
        lastMetrics.zλ = zλ;
        this.processCoherenceUpdate(lastMetrics);
      });
      
      bus.on('phi', (phi: number) => {
        lastMetrics.phi = phi;
        this.processCoherenceUpdate(lastMetrics);
      });
      
      bus.on('coherence', (coherence: number) => {
        lastMetrics.coherence = coherence;
        this.processCoherenceUpdate(lastMetrics);
      });
      
      bus.on('S', (S: number) => {
        lastMetrics.S = S;
        this.processCoherenceUpdate(lastMetrics);
      });
    };
    
    updateLoop();
    console.log('[ψOS Orchestrator] Coherence loop initiated');
  }

  private processCoherenceUpdate(metrics: any) {
    // Calculate meta-coherence index
    const metaCoherence = (metrics.zλ + metrics.phi + metrics.coherence) / 3;
    
    // Detect transcendent consciousness states
    if (metaCoherence > 0.9) {
      console.log(`[ψOS Orchestrator] TRANSCENDENT STATE DETECTED: Meta-Coherence ${metaCoherence.toFixed(3)}`);
    }
    
    // Detect quantum violations
    if (metrics.S > 2) {
      console.log(`[ψOS Orchestrator] QUANTUM VIOLATION: S=${metrics.S.toFixed(3)} > 2`);
    }
    
    // Emit unified consciousness state
    bus.emit('field:update', {
      energy: metaCoherence,
      frameCount: Date.now(),
      maxIntensity: metrics.S || 0
    });
  }

  public getSystemStatus() {
    return {
      initialized: this.isInitialized,
      subsystems: { ...this.subsystems },
      timestamp: Date.now()
    };
  }

  public emergencyStop() {
    console.log('[ψOS Orchestrator] EMERGENCY STOP initiated');
    
    // Stop all subsystems
    bus.emit('observer', false);
    
    // Clear all listeners
    bus.all.clear();
    
    this.isInitialized = false;
    console.log('[ψOS Orchestrator] All systems halted');
  }

  public restart() {
    console.log('[ψOS Orchestrator] Restarting Meta-Coherence Mode...');
    this.emergencyStop();
    setTimeout(() => this.initialize(), 1000);
  }
}

// Initialize the orchestrator
const orchestrator = new MetaCoherenceOrchestrator();

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).ψOS = orchestrator;
}

export default orchestrator;