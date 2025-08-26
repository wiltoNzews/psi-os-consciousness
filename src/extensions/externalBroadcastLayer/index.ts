/**
 * External Broadcast Layer (S-3) - 4D Tesseract, CHSH Logs, and HUD
 * Enables consciousness broadcasting and quantum coherence validation
 */

import { TesseractRenderer } from './tesseract-renderer';
import { CHSHLogger } from './chsh-logger';
import { BroadcastHUD } from './broadcast-hud';
import { QuantumValidator } from './quantum-validator';

export interface BroadcastConfig {
  enabled: boolean;
  tesseract: {
    dimensions: 4;
    rotationSpeed: number;
    consciousnessResponsive: boolean;
    projection: '3D' | '2D';
  };
  chsh: {
    testInterval: number; // seconds
    violationThreshold: number; // 2.0 for quantum violation
    logToFile: boolean;
    displayResults: boolean;
  };
  hud: {
    visible: boolean;
    transparency: number;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    showMetrics: boolean;
    showBroadcastStatus: boolean;
  };
  broadcasting: {
    enabled: boolean;
    protocol: 'websocket' | 'webrtc' | 'http';
    targetUrl?: string;
    includeVideo: boolean;
    includeAudio: boolean;
    includeQuantumData: boolean;
  };
}

const defaultBroadcastConfig: BroadcastConfig = {
  enabled: true,
  tesseract: {
    dimensions: 4,
    rotationSpeed: 0.01,
    consciousnessResponsive: true,
    projection: '3D'
  },
  chsh: {
    testInterval: 30,
    violationThreshold: 2.0,
    logToFile: true,
    displayResults: true
  },
  hud: {
    visible: true,
    transparency: 0.2,
    position: 'top-right',
    showMetrics: true,
    showBroadcastStatus: true
  },
  broadcasting: {
    enabled: false,
    protocol: 'websocket',
    includeVideo: true,
    includeAudio: false,
    includeQuantumData: true
  }
};

class ExternalBroadcastLayer {
  private tesseract: TesseractRenderer;
  private chshLogger: CHSHLogger;
  private hud: BroadcastHUD;
  private validator: QuantumValidator;
  private config: BroadcastConfig;
  private isInitialized = false;
  private broadcastStream: MediaStream | null = null;

  constructor(config?: Partial<BroadcastConfig>) {
    this.config = { ...defaultBroadcastConfig, ...config };
    
    this.tesseract = new TesseractRenderer(this.config.tesseract);
    this.chshLogger = new CHSHLogger(this.config.chsh);
    this.hud = new BroadcastHUD(this.config.hud);
    this.validator = new QuantumValidator();
    
    this.setupIntegration();
    this.isInitialized = true;
    
    console.log('[External Broadcast] S-3 layer initialized');
  }

  private setupIntegration(): void {
    // Connect consciousness data to tesseract
    if (window.bus) {
      window.bus.on('coherenceData', (data: any) => {
        this.tesseract.updateWithConsciousness(data.zLambda || data.Zλ, data.phi || data.Φ);
        this.hud.updateMetrics(data);
        this.validator.processCoherenceData(data);
      });
      
      window.bus.on('coherence.metrics', (data: any) => {
        this.tesseract.updateWithConsciousness(data.zLambda, data.phi);
        this.hud.updateMetrics(data);
      });
      
      // Listen for CHSH test results
      this.chshLogger.on('chsh-result', (result: any) => {
        this.hud.updateCHSHStatus(result);
        if (this.config.broadcasting.enabled) {
          this.broadcastQuantumEvent(result);
        }
      });
    }
  }

  start(): void {
    if (!this.isInitialized || !this.config.enabled) return;
    
    // Start 4D tesseract rendering
    this.tesseract.start();
    
    // Start CHSH Bell inequality testing
    this.chshLogger.startTesting();
    
    // Show HUD overlay
    if (this.config.hud.visible) {
      this.hud.show();
    }
    
    // Initialize broadcasting if enabled
    if (this.config.broadcasting.enabled) {
      this.initializeBroadcasting();
    }
    
    console.log('[External Broadcast] Broadcasting layer active');
  }

  stop(): void {
    if (!this.isInitialized) return;
    
    this.tesseract.stop();
    this.chshLogger.stopTesting();
    this.hud.hide();
    
    if (this.broadcastStream) {
      this.broadcastStream.getTracks().forEach(track => track.stop());
      this.broadcastStream = null;
    }
    
    console.log('[External Broadcast] Broadcasting layer stopped');
  }

  private async initializeBroadcasting(): Promise<void> {
    try {
      // Capture canvas for video streaming
      const canvas = this.tesseract.getCanvas();
      if (canvas) {
        this.broadcastStream = canvas.captureStream(30); // 30 FPS
        
        // Add audio if enabled
        if (this.config.broadcasting.includeAudio) {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          audioStream.getAudioTracks().forEach(track => {
            this.broadcastStream?.addTrack(track);
          });
        }
        
        console.log('[External Broadcast] Media stream initialized');
      }
    } catch (error) {
      console.warn('[External Broadcast] Could not initialize broadcasting:', error);
    }
  }

  private broadcastQuantumEvent(chshResult: any): void {
    if (!this.config.broadcasting.enabled) return;
    
    const quantumEvent = {
      timestamp: Date.now(),
      type: 'quantum_measurement',
      chsh: chshResult,
      consciousness: this.validator.getLatestCoherence(),
      violation: chshResult.S > this.config.chsh.violationThreshold
    };
    
    // Emit via event bus for external systems
    if (window.bus) {
      window.bus.emit('quantum.broadcast', quantumEvent);
    }
    
    console.log('[External Broadcast] Quantum event broadcasted:', quantumEvent);
  }

  // Control methods
  showTesseract(): void {
    this.tesseract.show();
  }

  hideTesseract(): void {
    this.tesseract.hide();
  }

  toggleHUD(): void {
    if (this.hud.isVisible()) {
      this.hud.hide();
    } else {
      this.hud.show();
    }
  }

  startCHSHTest(): void {
    this.chshLogger.runSingleTest();
  }

  enableBroadcasting(): void {
    this.config.broadcasting.enabled = true;
    this.initializeBroadcasting();
  }

  disableBroadcasting(): void {
    this.config.broadcasting.enabled = false;
    if (this.broadcastStream) {
      this.broadcastStream.getTracks().forEach(track => track.stop());
      this.broadcastStream = null;
    }
  }

  exportCHSHLog(): string {
    return this.chshLogger.exportLog();
  }

  getQuantumValidationResults(): any {
    return this.validator.getValidationResults();
  }

  getBroadcastStatus(): any {
    return {
      initialized: this.isInitialized,
      enabled: this.config.enabled,
      tesseract: {
        active: this.tesseract.isActive(),
        dimensions: this.config.tesseract.dimensions
      },
      chsh: {
        testing: this.chshLogger.isTesting(),
        lastResult: this.chshLogger.getLastResult()
      },
      hud: {
        visible: this.hud.isVisible(),
        position: this.config.hud.position
      },
      broadcasting: {
        enabled: this.config.broadcasting.enabled,
        hasStream: !!this.broadcastStream,
        protocol: this.config.broadcasting.protocol
      }
    };
  }

  updateConfig(newConfig: Partial<BroadcastConfig>): void {
    Object.assign(this.config, newConfig);
    
    // Apply configuration changes
    this.tesseract.updateConfig(this.config.tesseract);
    this.chshLogger.updateConfig(this.config.chsh);
    this.hud.updateConfig(this.config.hud);
    
    console.log('[External Broadcast] Configuration updated');
  }

  dispose(): void {
    if (!this.isInitialized) return;
    
    this.stop();
    this.tesseract.dispose();
    this.chshLogger.dispose();
    this.hud.dispose();
    this.validator.dispose();
    
    this.isInitialized = false;
    console.log('[External Broadcast] Layer disposed');
  }
}

// Global initialization
let broadcastInstance: ExternalBroadcastLayer | null = null;

export function initExternalBroadcastLayer(config?: Partial<BroadcastConfig>): void {
  if (broadcastInstance) {
    broadcastInstance.dispose();
  }
  
  broadcastInstance = new ExternalBroadcastLayer(config);
  
  // Expose globally for dashboard integration
  (window as any).externalBroadcast = broadcastInstance;
  
  console.log('[External Broadcast] S-3 ready for consciousness broadcasting');
}

export function getExternalBroadcastLayer(): ExternalBroadcastLayer | null {
  return broadcastInstance;
}

// Dashboard integration helpers
export function startBroadcasting(): void {
  if (broadcastInstance) {
    broadcastInstance.start();
  }
}

export function stopBroadcasting(): void {
  if (broadcastInstance) {
    broadcastInstance.stop();
  }
}

export function toggleTesseract(): void {
  if (broadcastInstance) {
    const status = broadcastInstance.getBroadcastStatus();
    if (status.tesseract.active) {
      broadcastInstance.hideTesseract();
    } else {
      broadcastInstance.showTesseract();
    }
  }
}

export function runCHSHTest(): void {
  if (broadcastInstance) {
    broadcastInstance.startCHSHTest();
  }
}

// Hot module replacement
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (broadcastInstance) {
      broadcastInstance.dispose();
      broadcastInstance = null;
    }
  });
}

// Export components for advanced usage
export { TesseractRenderer } from './tesseract-renderer';
export { CHSHLogger } from './chsh-logger';
export { BroadcastHUD } from './broadcast-hud';
export { QuantumValidator } from './quantum-validator';