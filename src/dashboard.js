// Exodia-style orchestrator - the unified WiltonOS engine
import { mountSpiral } from './modules/spiral.js';
import { mountRecorder } from './core/recorder.js';
import { mountUI } from './modules/ui.js';
import { startAPI, attachMic, coherenceProcessor } from './core/coherence.js';
import { eventBus } from './core/eventBus.js';

export class WiltonOSDashboard {
    constructor() {
        this.modules = {
            spiral: null,
            recorder: null,
            ui: null,
            coherence: null
        };
        
        this.isInitialized = false;
        this.canvas = null;
        
        console.log('[Dashboard] Exodia orchestrator initialized');
    }
    
    async bootDashboard() {
        if (this.isInitialized) return;
        
        try {
            // Setup render targets
            const vizContainer = document.querySelector('#viz');
            const uiContainer = document.querySelector('#ui-container');
            
            if (!vizContainer) {
                throw new Error('Visualization container #viz not found');
            }
            
            // Mount spiral renderer
            this.canvas = mountSpiral(vizContainer);
            this.modules.spiral = this.canvas;
            
            // Mount recorder with canvas
            mountRecorder(this.canvas);
            this.modules.recorder = true;
            
            // Mount UI controls
            if (uiContainer) {
                mountUI(uiContainer);
                this.modules.ui = true;
            }
            
            // Start consciousness data flow with EEG as default
            startAPI();
            
            // Auto-attach EEG by default (API fallback if EEG fails)
            try {
                const { attachEEG } = await import('./core/coherence.js');
                await attachEEG();
                console.log('[Dashboard] EEG attached as primary input source');
            } catch (error) {
                console.log('[Dashboard] EEG failed, using API fallback');
            }
            
            this.modules.coherence = true;
            
            // Setup cross-module event handling
            this.setupOrchestration();
            
            this.isInitialized = true;
            
            console.log('[Dashboard] All modules orchestrated successfully');
            
            // Emit boot complete event
            eventBus.emit('dashboard:boot-complete', {
                modules: Object.keys(this.modules),
                timestamp: Date.now()
            });
            
        } catch (error) {
            console.error('[Dashboard] Boot failed:', error);
            throw error;
        }
    }
    
    setupOrchestration() {
        // Handle completed recordings
        eventBus.on('recorder:done', ({ file, filename }) => {
            console.log(`[Dashboard] Sacred recording completed: ${filename}`);
            
            // Create download automatically
            const link = document.createElement('a');
            link.href = file;
            link.download = filename;
            link.click();
            
            // Clean up URL
            setTimeout(() => URL.revokeObjectURL(file), 5000);
        });
        
        // Handle microphone requests from UI
        eventBus.on('ui:microphone', ({ action }) => {
            if (action === 'enable') {
                attachMic();
            } else if (action === 'disable') {
                coherenceProcessor.detachMicrophone();
            }
        });
        
        // Handle input source changes from UI
        eventBus.on('ui:input-source', ({ source }) => {
            coherenceProcessor.setInputSource(source);
        });
        
        // Handle EEG state changes from UI
        eventBus.on('ui:eeg-state', async ({ state }) => {
            try {
                const { eegSimulator } = await import('./core/eegSimulator.js');
                
                switch (state) {
                    case 'meditative':
                        eegSimulator.enterMeditativeState();
                        break;
                    case 'focused':
                        eegSimulator.enterFocusedState();
                        break;
                    case 'active':
                        eegSimulator.enterActiveState();
                        break;
                    case 'baseline':
                        eegSimulator.resetToBaseline();
                        break;
                }
                
                console.log(`[Dashboard] EEG state changed to: ${state}`);
            } catch (error) {
                console.error('[Dashboard] EEG state change failed:', error);
            }
        });
        
        // Handle consciousness adjustments for testing
        eventBus.on('ui:consciousness-adjust', ({ delta }) => {
            coherenceProcessor.adjustConsciousness(delta);
        });
        
        // Handle export requests
        eventBus.on('ui:export-log', () => {
            this.exportSystemLog();
        });
        
        // Handle EEG session export
        eventBus.on('ui:export-session', async () => {
            try {
                const { exportSession } = await import('./core/coherence-log.js');
                exportSession();
                console.log('[Dashboard] EEG session exported');
            } catch (error) {
                console.error('[Dashboard] EEG session export failed:', error);
            }
        });
        
        // Setup window resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        console.log('[Dashboard] Cross-module orchestration configured');
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Don't trigger if user is typing in an input
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const key = event.key.toLowerCase();
            
            switch (key) {
                case 'r':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        eventBus.emit('ui:record', { action: 'start' });
                    }
                    break;
                    
                case 's':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        eventBus.emit('ui:capture');
                    }
                    break;
                    
                case 'm':
                    eventBus.emit('ui:microphone', { action: 'enable' });
                    break;
                    
                case 'g':
                    eventBus.emit('ui:mode-toggle', { mode: 'glow', enabled: true });
                    break;
                    
                case 'd':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        eventBus.enableLogging(true);
                        console.log('[Dashboard] Debug logging enabled');
                    }
                    break;
                    
                case 'escape':
                    this.resetAllSystems();
                    break;
                    
                case '1':
                    window.location.href = '/spiral';
                    break;
                    
                case '2':
                    window.location.href = '/dashboard';
                    break;
                    
                case '3':
                    window.location.href = '/tesseract';
                    break;
            }
        });
        
        console.log('[Dashboard] Keyboard shortcuts configured');
    }
    
    handleResize() {
        // Trigger resize events for all modules
        eventBus.emit('dashboard:resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }
    
    resetAllSystems() {
        // Reset all parameters to defaults
        eventBus.emit('ui:morph', { percent: 0.0, source: 'reset' });
        eventBus.emit('ui:mode-toggle', { mode: 'glow', enabled: false });
        eventBus.emit('ui:mode-toggle', { mode: 'autoRotate', enabled: true });
        
        console.log('[Dashboard] All systems reset to defaults');
    }
    
    exportSystemLog() {
        const logData = {
            timestamp: Date.now(),
            modules: this.modules,
            eventHistory: eventBus.getEventHistory(),
            consciousnessState: coherenceProcessor.getCurrentState(),
            performance: this.getPerformanceMetrics()
        };
        
        // Create and download log file
        const blob = new Blob([JSON.stringify(logData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wiltonos-system-log-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('[Dashboard] System log exported');
    }
    
    getPerformanceMetrics() {
        const perfEvents = eventBus.getEventHistory('performance:fps');
        const latestPerf = perfEvents.length > 0 ? perfEvents[perfEvents.length - 1] : null;
        
        return {
            fps: latestPerf ? latestPerf.data.fps : 60,
            moduleCount: Object.keys(this.modules).length,
            eventCount: eventBus.getEventHistory().length,
            uptime: this.isInitialized ? Date.now() - this.bootTime : 0
        };
    }
    
    // Public API methods
    getSystemStatus() {
        return {
            initialized: this.isInitialized,
            modules: this.modules,
            consciousness: coherenceProcessor.getCurrentState(),
            performance: this.getPerformanceMetrics()
        };
    }
    
    destroy() {
        // Clean up all modules
        if (this.modules.spiral && this.modules.spiral.destroy) {
            this.modules.spiral.destroy();
        }
        
        coherenceProcessor.destroy();
        
        // Clear event listeners
        window.removeEventListener('resize', this.handleResize);
        
        this.isInitialized = false;
        console.log('[Dashboard] System shutdown complete');
    }
}

// Create global instance
const dashboard = new WiltonOSDashboard();

// Main boot function - called by routes
export function bootDashboard() {
    dashboard.bootTime = Date.now();
    return dashboard.bootDashboard();
}

// Export dashboard instance for debugging
export { dashboard };

export default bootDashboard;