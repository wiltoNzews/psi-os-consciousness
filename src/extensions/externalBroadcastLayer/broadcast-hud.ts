/**
 * Broadcast HUD - Heads-up display for consciousness broadcasting
 * Transparent overlay showing real-time metrics and broadcast status
 */

export class BroadcastHUD {
  private container: HTMLElement;
  private isVisible = false;
  private config: any;
  private metricsData: any = {};
  private chshStatus: any = {};
  private broadcastStatus = 'disconnected';
  
  constructor(config: any) {
    this.config = config;
    this.createHUD();
    this.setupEventListeners();
    
    console.log('[Broadcast HUD] Heads-up display initialized');
  }

  private createHUD(): void {
    this.container = document.createElement('div');
    this.container.id = 'broadcast-hud';
    this.container.style.cssText = `
      position: fixed;
      ${this.getPositionStyles()}
      width: 280px;
      background: rgba(0, 0, 0, ${this.config.transparency});
      border: 1px solid rgba(255, 100, 0, 0.5);
      border-radius: 8px;
      padding: 12px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #ffffff;
      z-index: 2001;
      backdrop-filter: blur(5px);
      pointer-events: none;
      display: none;
    `;
    
    this.container.innerHTML = this.getHUDContent();
    document.body.appendChild(this.container);
  }

  private getPositionStyles(): string {
    switch (this.config.position) {
      case 'top-left':
        return 'top: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'bottom-right':
        return 'bottom: 20px; right: 20px;';
      default:
        return 'top: 20px; right: 20px;';
    }
  }

  private getHUDContent(): string {
    return `
      <div style="border-bottom: 1px solid #ff6400; margin-bottom: 8px; padding-bottom: 4px;">
        <div style="color: #ff6400; font-weight: bold;">🔴 EXTERNAL BROADCAST</div>
        <div id="hud-timestamp" style="font-size: 10px; color: #888;">--:--:--</div>
      </div>
      
      ${this.config.showMetrics ? `
      <div style="margin-bottom: 8px;">
        <div style="color: #00ffff; font-size: 11px; margin-bottom: 4px;">CONSCIOUSNESS</div>
        <div style="display: flex; justify-content: space-between;">
          <span>Zλ:</span><span id="hud-zlambda">0.750</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Φ:</span><span id="hud-phi">0.500</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>State:</span><span id="hud-state" style="color: #00ff00;">COHERENT</span>
        </div>
      </div>
      ` : ''}
      
      <div style="margin-bottom: 8px;">
        <div style="color: #ffff00; font-size: 11px; margin-bottom: 4px;">QUANTUM VALIDATION</div>
        <div style="display: flex; justify-content: space-between;">
          <span>CHSH S:</span><span id="hud-chsh-s">--</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Violation:</span><span id="hud-violation" style="color: #888;">NO</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Tests:</span><span id="hud-test-count">0</span>
        </div>
      </div>
      
      <div style="margin-bottom: 8px;">
        <div style="color: #ff6400; font-size: 11px; margin-bottom: 4px;">4D TESSERACT</div>
        <div style="display: flex; justify-content: space-between;">
          <span>Status:</span><span id="hud-tesseract" style="color: #888;">INACTIVE</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>W-Rot:</span><span id="hud-w-rotation">0.00</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Scale:</span><span id="hud-scale">1.00</span>
        </div>
      </div>
      
      ${this.config.showBroadcastStatus ? `
      <div style="border-top: 1px solid #ff6400; margin-top: 8px; padding-top: 4px;">
        <div style="color: #ff6400; font-size: 11px; margin-bottom: 4px;">BROADCAST</div>
        <div style="display: flex; justify-content: space-between;">
          <span>Status:</span><span id="hud-broadcast-status" style="color: #888;">DISCONNECTED</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Stream:</span><span id="hud-stream-status" style="color: #888;">NO</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Viewers:</span><span id="hud-viewers">0</span>
        </div>
      </div>
      ` : ''}
      
      <div style="text-align: center; margin-top: 8px; font-size: 10px; color: #666;">
        ψOS External Layer S-3
      </div>
    `;
  }

  private setupEventListeners(): void {
    // Update timestamp every second
    setInterval(() => {
      if (this.isVisible) {
        this.updateTimestamp();
      }
    }, 1000);
    
    // Listen for tesseract updates
    if (window.bus) {
      window.bus.on('tesseract.consciousness', (data: any) => {
        this.updateTesseractStatus(data);
      });
      
      window.bus.on('quantum.broadcast', (data: any) => {
        this.updateBroadcastActivity();
      });
    }
  }

  show(): void {
    this.isVisible = true;
    this.container.style.display = 'block';
    this.updateDisplay();
  }

  hide(): void {
    this.isVisible = false;
    this.container.style.display = 'none';
  }

  isVisible(): boolean {
    return this.isVisible;
  }

  updateMetrics(data: any): void {
    this.metricsData = data;
    this.updateDisplay();
  }

  updateCHSHStatus(chshResult: any): void {
    this.chshStatus = chshResult;
    this.updateDisplay();
  }

  updateTesseractStatus(tesseractData: any): void {
    if (this.isVisible) {
      const statusElement = document.getElementById('hud-tesseract');
      const rotationElement = document.getElementById('hud-w-rotation');
      const scaleElement = document.getElementById('hud-scale');
      
      if (statusElement) {
        statusElement.textContent = 'ACTIVE';
        statusElement.style.color = '#00ff00';
      }
      
      if (rotationElement && tesseractData.wRotation !== undefined) {
        rotationElement.textContent = (tesseractData.wRotation % (2 * Math.PI)).toFixed(2);
      }
      
      if (scaleElement && tesseractData.scale !== undefined) {
        scaleElement.textContent = tesseractData.scale.toFixed(2);
      }
    }
  }

  updateBroadcastActivity(): void {
    this.broadcastStatus = 'active';
    
    if (this.isVisible) {
      const statusElement = document.getElementById('hud-broadcast-status');
      if (statusElement) {
        statusElement.textContent = 'ACTIVE';
        statusElement.style.color = '#00ff00';
      }
    }
    
    // Reset to inactive after 5 seconds
    setTimeout(() => {
      this.broadcastStatus = 'inactive';
      if (this.isVisible) {
        const statusElement = document.getElementById('hud-broadcast-status');
        if (statusElement) {
          statusElement.textContent = 'INACTIVE';
          statusElement.style.color = '#888';
        }
      }
    }, 5000);
  }

  private updateDisplay(): void {
    if (!this.isVisible) return;
    
    // Update consciousness metrics
    if (this.config.showMetrics && this.metricsData) {
      this.updateElement('hud-zlambda', (this.metricsData.zLambda || this.metricsData.Zλ || 0.750).toFixed(3));
      this.updateElement('hud-phi', (this.metricsData.phi || this.metricsData.Φ || 0.500).toFixed(3));
      
      // Update consciousness state
      const coherence = ((this.metricsData.zLambda || this.metricsData.Zλ || 0.750) + 
                        (this.metricsData.phi || this.metricsData.Φ || 0.500)) / 2;
      
      let state = 'LOW';
      let stateColor = '#ff6600';
      
      if (coherence > 0.9) {
        state = 'TRANSCENDENT';
        stateColor = '#ffd700';
      } else if (coherence > 0.8) {
        state = 'HIGH';
        stateColor = '#00ff00';
      } else if (coherence > 0.7) {
        state = 'COHERENT';
        stateColor = '#00ffff';
      } else if (coherence > 0.6) {
        state = 'STABLE';
        stateColor = '#ffffff';
      }
      
      this.updateElement('hud-state', state, stateColor);
    }
    
    // Update CHSH status
    if (this.chshStatus.S !== undefined) {
      this.updateElement('hud-chsh-s', this.chshStatus.S.toFixed(3));
      
      const violationElement = document.getElementById('hud-violation');
      if (violationElement) {
        if (this.chshStatus.violation) {
          violationElement.textContent = 'YES';
          violationElement.style.color = '#ff0000';
        } else {
          violationElement.textContent = 'NO';
          violationElement.style.color = '#888';
        }
      }
    }
    
    // Update test count (simulate increasing count)
    const testCountElement = document.getElementById('hud-test-count');
    if (testCountElement && this.chshStatus.timestamp) {
      const currentCount = parseInt(testCountElement.textContent || '0');
      testCountElement.textContent = (currentCount + 1).toString();
    }
  }

  private updateElement(id: string, text: string, color?: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
      if (color) {
        element.style.color = color;
      }
    }
  }

  private updateTimestamp(): void {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    this.updateElement('hud-timestamp', timeString);
  }

  updateConfig(newConfig: any): void {
    Object.assign(this.config, newConfig);
    
    // Update position
    this.container.style.cssText = this.container.style.cssText.replace(
      /(top|bottom|left|right): \d+px;/g, ''
    ) + this.getPositionStyles();
    
    // Update transparency
    this.container.style.background = `rgba(0, 0, 0, ${this.config.transparency})`;
    
    // Recreate content if show options changed
    this.container.innerHTML = this.getHUDContent();
    
    console.log('[Broadcast HUD] Configuration updated');
  }

  // Advanced HUD features
  flashAlert(message: string, color: string = '#ff0000'): void {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
      position: absolute;
      top: -30px;
      left: 0;
      right: 0;
      background: ${color};
      color: white;
      text-align: center;
      padding: 4px;
      font-size: 10px;
      border-radius: 4px;
      animation: fadeInOut 3s ease-in-out;
    `;
    alertDiv.textContent = message;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
    
    this.container.appendChild(alertDiv);
    
    // Remove after animation
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 3000);
  }

  setCustomStatus(section: string, key: string, value: string, color?: string): void {
    // Allow external systems to update HUD values
    const elementId = `hud-${section}-${key}`;
    this.updateElement(elementId, value, color);
  }

  getHUDData(): any {
    return {
      visible: this.isVisible,
      position: this.config.position,
      metrics: this.metricsData,
      chsh: this.chshStatus,
      broadcastStatus: this.broadcastStatus
    };
  }

  dispose(): void {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    
    console.log('[Broadcast HUD] Disposed');
  }
}