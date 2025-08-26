/**
 * UI Integration for Coherence Bundle
 * Adds controls to existing UI panels for seamless integration
 */

import { breathingPatterns, geometryPatterns } from './config';

export class CoherenceBundleUI {
  private tweakpane: any = null;
  private uiFolder: any = null;

  constructor() {
    this.initializeUI();
  }

  private initializeUI(): void {
    // Check if Tweakpane is available globally
    if (window.pane) {
      this.tweakpane = window.pane;
      this.addCoherenceControls();
    } else {
      // Fallback to adding controls to existing UI
      this.addFallbackControls();
    }
  }

  private addCoherenceControls(): void {
    if (!this.tweakpane) return;

    // Add Coherence Bundle folder to existing UI
    this.uiFolder = this.tweakpane.addFolder({
      title: 'Internal + Visual Coherence',
      expanded: true
    });

    // Bundle controls
    const bundleControls = {
      enabled: true,
      showBreathGuide: true,
      geometryPattern: 'SriYantra',
      morphStrength: 0.05,
      lineColor: '#ff6400',
      lineOpacity: 0.6,
      breathRate: 10,
      geometryScale: 0.85,
      alphaGoal: 0.90,
      harmonic432Hz: false
    };

    // Enable/disable bundle
    this.uiFolder.addInput(bundleControls, 'enabled').on('change', (ev: any) => {
      if (window.coherenceBundle) {
        if (ev.value) {
          window.coherenceBundle.updateSettings({ enabled: true });
        } else {
          window.stopCoherenceTraining?.();
          window.coherenceBundle.updateSettings({ enabled: false });
        }
      }
    });

    // Breathing pattern selector
    this.uiFolder.addInput(bundleControls, 'geometryPattern', {
      options: {
        'Sri Yantra': 'SriYantra',
        'Fibonacci Spiral': 'Fibonacci',
        'Flower of Life': 'FlowerOfLife'
      }
    }).on('change', (ev: any) => {
      if (window.coherenceBundle) {
        window.coherenceBundle.setGeometryPattern(ev.value);
      }
    });

    // Breathing rate control
    this.uiFolder.addInput(bundleControls, 'breathRate', {
      min: 5,
      max: 20,
      step: 0.5
    }).on('change', (ev: any) => {
      if (window.coherenceBundle) {
        window.coherenceBundle.updateSettings({ breathRate: ev.value });
      }
    });

    // Morphing strength
    this.uiFolder.addInput(bundleControls, 'morphStrength', {
      min: 0,
      max: 0.2,
      step: 0.01
    }).on('change', (ev: any) => {
      if (window.coherenceBundle) {
        window.coherenceBundle.updateSettings({ morphStrength: ev.value });
      }
    });

    // Alpha goal
    this.uiFolder.addInput(bundleControls, 'alphaGoal', {
      min: 0.5,
      max: 1.0,
      step: 0.01
    }).on('change', (ev: any) => {
      if (window.coherenceBundle) {
        window.coherenceBundle.updateSettings({ alphaGoal: ev.value });
      }
    });

    // 432Hz harmonic
    this.uiFolder.addInput(bundleControls, 'harmonic432Hz').on('change', (ev: any) => {
      if (window.coherenceBundle) {
        if (ev.value) {
          window.coherenceBundle.enableHarmonic432Hz();
        } else {
          window.coherenceBundle.disableHarmonic432Hz();
        }
      }
    });

    // Action buttons
    this.uiFolder.addButton({ title: 'Start Training' }).on('click', () => {
      window.startCoherenceTraining?.();
    });

    this.uiFolder.addButton({ title: 'Stop Training' }).on('click', () => {
      window.stopCoherenceTraining?.();
    });

    this.uiFolder.addButton({ title: 'Toggle Sri Yantra' }).on('click', () => {
      window.toggleSriYantra?.();
    });

    console.log('[Coherence UI] Tweakpane controls added');
  }

  private addFallbackControls(): void {
    // Create simple HTML controls if Tweakpane not available
    const controlPanel = document.createElement('div');
    controlPanel.id = 'coherence-controls';
    controlPanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      padding: 15px;
      border-radius: 8px;
      color: white;
      font-family: monospace;
      z-index: 2000;
      min-width: 200px;
    `;

    controlPanel.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #ff6400;">Coherence Bundle</h3>
      
      <div style="margin: 8px 0;">
        <button id="start-training" style="background: #00ff00; color: black; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px; cursor: pointer;">Start Training</button>
        <button id="stop-training" style="background: #ff6600; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px; cursor: pointer;">Stop Training</button>
      </div>
      
      <div style="margin: 8px 0;">
        <button id="toggle-yantra" style="background: #ff6400; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px; cursor: pointer;">Toggle Sri Yantra</button>
      </div>
      
      <div style="margin: 8px 0;">
        <label style="display: block; margin: 5px 0;">Pattern:</label>
        <select id="pattern-select" style="background: #333; color: white; border: 1px solid #666; padding: 3px;">
          <option value="SriYantra">Sri Yantra</option>
          <option value="Fibonacci">Fibonacci Spiral</option>
          <option value="FlowerOfLife">Flower of Life</option>
        </select>
      </div>
      
      <div style="margin: 8px 0;">
        <label style="display: block; margin: 5px 0;">Breathing Pattern:</label>
        <select id="breathing-select" style="background: #333; color: white; border: 1px solid #666; padding: 3px;">
          <option value="Alpha Coherence">Alpha Coherence</option>
          <option value="Deep Meditative">Deep Meditative</option>
          <option value="Focus Training">Focus Training</option>
          <option value="Transcendent">Transcendent</option>
        </select>
      </div>
      
      <div style="margin: 8px 0;">
        <label style="display: block; margin: 5px 0;">
          <input type="checkbox" id="harmonic-432" style="margin-right: 5px;">
          432Hz Harmonic
        </label>
      </div>
    `;

    document.body.appendChild(controlPanel);

    // Add event listeners
    document.getElementById('start-training')?.addEventListener('click', () => {
      window.startCoherenceTraining?.();
    });

    document.getElementById('stop-training')?.addEventListener('click', () => {
      window.stopCoherenceTraining?.();
    });

    document.getElementById('toggle-yantra')?.addEventListener('click', () => {
      window.toggleSriYantra?.();
    });

    document.getElementById('pattern-select')?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      if (window.coherenceBundle) {
        window.coherenceBundle.setGeometryPattern(target.value);
      }
    });

    document.getElementById('breathing-select')?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      window.switchBreathingPattern?.(target.value);
    });

    document.getElementById('harmonic-432')?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (window.coherenceBundle) {
        if (target.checked) {
          window.coherenceBundle.enableHarmonic432Hz();
        } else {
          window.coherenceBundle.disableHarmonic432Hz();
        }
      }
    });

    console.log('[Coherence UI] Fallback controls added');
  }

  // Add quick access keyboard shortcuts
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Only trigger if no input is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'c':
          if (e.ctrlKey) {
            e.preventDefault();
            window.startCoherenceTraining?.();
          }
          break;
        case 's':
          if (e.ctrlKey && e.shiftKey) {
            e.preventDefault();
            window.stopCoherenceTraining?.();
          }
          break;
        case 'y':
          if (e.ctrlKey) {
            e.preventDefault();
            window.toggleSriYantra?.();
          }
          break;
      }
    });

    console.log('[Coherence UI] Keyboard shortcuts: Ctrl+C (start), Ctrl+Shift+S (stop), Ctrl+Y (yantra)');
  }

  initialize(): void {
    this.setupKeyboardShortcuts();
    
    // Show usage instructions
    console.log(`
[Coherence Bundle] UI Integration Ready

Controls Available:
- Start/Stop Training buttons
- Sacred Geometry pattern selector  
- Breathing pattern selector
- 432Hz harmonic resonance toggle

Keyboard Shortcuts:
- Ctrl+C: Start coherence training
- Ctrl+Shift+S: Stop training  
- Ctrl+Y: Toggle Sri Yantra

Dashboard Integration:
- Coach Toggle button controls breathing session
- Sri Yantra button controls sacred geometry overlay
- Real-time consciousness data drives visual feedback
    `);
  }
}

// Initialize UI integration when module loads
export function initCoherenceUI(): void {
  const ui = new CoherenceBundleUI();
  ui.initialize();
}

// Auto-initialize if not in test environment
if (typeof window !== 'undefined' && !window.location.href.includes('test')) {
  // Delay initialization to ensure other systems are loaded
  setTimeout(initCoherenceUI, 1000);
}