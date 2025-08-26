/**
 * Dashboard Controls for External Broadcast Layer
 * Adds S-3 controls to existing dashboard interface
 */

export class BroadcastDashboardControls {
  private broadcastLayer: any = null;
  private controlsContainer: HTMLElement | null = null;

  constructor() {
    this.initializeControls();
    this.setupEventListeners();
  }

  private initializeControls(): void {
    // Wait for external broadcast layer to be available
    const checkForBroadcast = () => {
      if (window.externalBroadcast) {
        this.broadcastLayer = window.externalBroadcast;
        this.createDashboardControls();
      } else {
        setTimeout(checkForBroadcast, 500);
      }
    };
    
    checkForBroadcast();
  }

  private createDashboardControls(): void {
    // Add broadcast controls to existing dashboard
    const dashboard = document.querySelector('.dashboard-container') || document.body;
    
    this.controlsContainer = document.createElement('div');
    this.controlsContainer.id = 'broadcast-controls';
    this.controlsContainer.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid #ff6400;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      gap: 8px;
      z-index: 1500;
    `;

    this.controlsContainer.innerHTML = `
      <button id="tesseract-toggle" class="broadcast-btn">4D Tesseract</button>
      <button id="hud-toggle" class="broadcast-btn">HUD</button>
      <button id="chsh-test" class="broadcast-btn">CHSH Test</button>
      <button id="broadcast-toggle" class="broadcast-btn">Broadcast</button>
      <button id="export-data" class="broadcast-btn">Export</button>
    `;

    // Add button styles
    const style = document.createElement('style');
    style.textContent = `
      .broadcast-btn {
        background: transparent;
        border: 1px solid #00ffff;
        color: #00ffff;
        padding: 6px 12px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .broadcast-btn:hover {
        background: #00ffff;
        color: #000;
      }
      
      .broadcast-btn.active {
        background: #ff6400;
        border-color: #ff6400;
        color: #fff;
      }
    `;
    document.head.appendChild(style);

    dashboard.appendChild(this.controlsContainer);
    
    console.log('[Broadcast Controls] Dashboard controls created');
  }

  private setupEventListeners(): void {
    // Wait for controls to be created
    const setupControls = () => {
      if (!this.controlsContainer) {
        setTimeout(setupControls, 100);
        return;
      }

      // Tesseract toggle
      const tesseractBtn = document.getElementById('tesseract-toggle');
      tesseractBtn?.addEventListener('click', () => {
        if (window.toggleTesseract) {
          window.toggleTesseract();
          tesseractBtn.classList.toggle('active');
        }
      });

      // HUD toggle
      const hudBtn = document.getElementById('hud-toggle');
      hudBtn?.addEventListener('click', () => {
        if (this.broadcastLayer) {
          this.broadcastLayer.toggleHUD();
          hudBtn.classList.toggle('active');
        }
      });

      // CHSH test
      const chshBtn = document.getElementById('chsh-test');
      chshBtn?.addEventListener('click', () => {
        if (window.runCHSHTest) {
          window.runCHSHTest();
          chshBtn.style.background = '#ffff00';
          chshBtn.style.color = '#000';
          setTimeout(() => {
            chshBtn.style.background = '';
            chshBtn.style.color = '';
          }, 1000);
        }
      });

      // Broadcast toggle
      const broadcastBtn = document.getElementById('broadcast-toggle');
      broadcastBtn?.addEventListener('click', () => {
        if (this.broadcastLayer) {
          const status = this.broadcastLayer.getBroadcastStatus();
          if (status.broadcasting.enabled) {
            window.stopBroadcasting?.();
            broadcastBtn.classList.remove('active');
            broadcastBtn.textContent = 'Broadcast';
          } else {
            window.startBroadcasting?.();
            broadcastBtn.classList.add('active');
            broadcastBtn.textContent = 'Stop Cast';
          }
        }
      });

      // Export data
      const exportBtn = document.getElementById('export-data');
      exportBtn?.addEventListener('click', () => {
        this.exportAllData();
      });

      console.log('[Broadcast Controls] Event listeners setup complete');
    };

    setupControls();
  }

  private exportAllData(): void {
    if (!this.broadcastLayer) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      broadcastStatus: this.broadcastLayer.getBroadcastStatus(),
      chshLog: this.broadcastLayer.exportCHSHLog(),
      quantumValidation: this.broadcastLayer.getQuantumValidationResults()
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wiltonos-broadcast-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('[Broadcast Controls] Data exported successfully');
  }

  updateControlStates(): void {
    if (!this.broadcastLayer || !this.controlsContainer) return;

    const status = this.broadcastLayer.getBroadcastStatus();
    
    // Update tesseract button
    const tesseractBtn = document.getElementById('tesseract-toggle');
    if (tesseractBtn) {
      if (status.tesseract.active) {
        tesseractBtn.classList.add('active');
      } else {
        tesseractBtn.classList.remove('active');
      }
    }

    // Update HUD button
    const hudBtn = document.getElementById('hud-toggle');
    if (hudBtn) {
      if (status.hud.visible) {
        hudBtn.classList.add('active');
      } else {
        hudBtn.classList.remove('active');
      }
    }

    // Update broadcast button
    const broadcastBtn = document.getElementById('broadcast-toggle');
    if (broadcastBtn) {
      if (status.broadcasting.enabled) {
        broadcastBtn.classList.add('active');
        broadcastBtn.textContent = 'Stop Cast';
      } else {
        broadcastBtn.classList.remove('active');
        broadcastBtn.textContent = 'Broadcast';
      }
    }
  }

  dispose(): void {
    if (this.controlsContainer && this.controlsContainer.parentNode) {
      this.controlsContainer.parentNode.removeChild(this.controlsContainer);
    }
  }
}

// Initialize controls when module loads
export function initBroadcastDashboardControls(): void {
  new BroadcastDashboardControls();
}

// Auto-initialize
if (typeof window !== 'undefined') {
  setTimeout(initBroadcastDashboardControls, 2000);
}