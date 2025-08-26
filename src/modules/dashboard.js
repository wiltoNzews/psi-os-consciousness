// Main dashboard orchestrator - Exodia-style unified engine
import { stateBus } from '@shared/state-bus.js';
import SpiralRenderer from './spiral.js';
import CaptureEngine from './capture.js';
import CoherenceEngine from './coherence.js';
import UIController from './ui.js';

export class WiltonOSDashboard {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
        this.canvas = null;
        
        // Exodia orchestration state
        this.orchestrationActive = false;
        this.moduleStates = {
            spiral: 'inactive',
            capture: 'inactive', 
            coherence: 'inactive',
            ui: 'inactive'
        };
        
        console.log('[Dashboard] Exodia-style orchestrator initialized');
    }
    
    async initialize(canvasId = 'main-canvas') {
        if (this.isInitialized) return;
        
        // Create or get main canvas
        this.canvas = document.getElementById(canvasId) || this.createMainCanvas();
        
        // Initialize state bus performance tracking
        stateBus.initializePerformanceTracking();
        
        // Initialize all core modules
        await this.initializeModules();
        
        // Setup orchestration
        this.setupOrchestration();
        
        // Start main render loop
        this.startOrchestration();
        
        this.isInitialized = true;
        console.log('[Dashboard] Unified engine fully initialized');
    }
    
    createMainCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'main-canvas';
        canvas.style.cssText = `
            border: 2px solid rgba(255, 215, 0, 0.3);
            border-radius: 12px;
            background: rgba(0, 0, 0, 0.9);
            cursor: crosshair;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
        `;
        
        // Find or create container
        let container = document.getElementById('canvas-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'canvas-container';
            container.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100vw;
                height: 100vh;
                position: relative;
            `;
            document.body.appendChild(container);
        }
        
        container.appendChild(canvas);
        this.resizeCanvas();
        
        return canvas;
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth - 120, container.clientHeight - 240);
        
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.width = size + 'px';
        this.canvas.style.height = size + 'px';
        
        // Notify modules of canvas resize
        stateBus.emit('dashboard:canvas-resized', { width: size, height: size });
    }
    
    async initializeModules() {
        try {
            // Initialize spiral renderer
            const spiralRenderer = new SpiralRenderer(this.canvas);
            this.modules.set('spiral', spiralRenderer);
            this.moduleStates.spiral = 'active';
            
            // Initialize capture engine
            const captureEngine = new CaptureEngine(this.canvas);
            this.modules.set('capture', captureEngine);
            this.moduleStates.capture = 'active';
            
            // Initialize coherence engine
            const coherenceEngine = new CoherenceEngine();
            await coherenceEngine.startCoherenceSync();
            this.modules.set('coherence', coherenceEngine);
            this.moduleStates.coherence = 'active';
            
            // Initialize UI controller
            const uiController = new UIController();
            uiController.initialize();
            this.modules.set('ui', uiController);
            this.moduleStates.ui = 'active';
            
            console.log('[Dashboard] All modules initialized successfully');
            
        } catch (error) {
            console.error('[Dashboard] Module initialization failed:', error);
            throw error;
        }
    }
    
    setupOrchestration() {
        // Listen for cross-module events
        stateBus.subscribe('ui:capture-requested', () => {
            const captureEngine = this.modules.get('capture');
            if (captureEngine) {
                captureEngine.captureScreenshot();
            }
        });
        
        stateBus.subscribe('ui:microphone-activated', (event) => {
            const { stream } = event.detail;
            // Pass audio stream to spiral for voice reactivity
            stateBus.updateAudio({ 
                isActive: true,
                stream: stream
            });
        });
        
        stateBus.subscribe('recording:started', () => {
            const captureEngine = this.modules.get('capture');
            if (captureEngine) {
                captureEngine.startRecording();
            }
        });
        
        stateBus.subscribe('recording:stopped', () => {
            const captureEngine = this.modules.get('capture');
            if (captureEngine) {
                captureEngine.stopRecording();
            }
        });
        
        stateBus.subscribe('coherence:field-collapse', (event) => {
            this.handleFieldCollapseEvent(event.detail);
        });
        
        stateBus.subscribe('dashboard:canvas-resized', () => {
            this.modules.forEach(module => {
                if (module.resize) {
                    module.resize();
                }
                if (module.updateCanvasSize) {
                    module.updateCanvasSize();
                }
            });
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Don't trigger if user is typing in an input
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (event.key.toLowerCase()) {
                case 'r':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.toggleRecording();
                    }
                    break;
                    
                case 'c':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.captureScreenshot();
                    }
                    break;
                    
                case 'v':
                    this.toggleVoiceReactive();
                    break;
                    
                case 'g':
                    this.toggleGlowEffect();
                    break;
                    
                case 'a':
                    this.toggleAutoMorph();
                    break;
                    
                case 'b':
                    this.toggleBreathingMode();
                    break;
                    
                case 'd':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        stateBus.logState();
                    }
                    break;
                    
                case 'escape':
                    this.resetAllModes();
                    break;
            }
        });
    }
    
    startOrchestration() {
        if (this.orchestrationActive) return;
        
        this.orchestrationActive = true;
        
        // Start spiral rendering
        const spiralRenderer = this.modules.get('spiral');
        if (spiralRenderer) {
            spiralRenderer.startRenderLoop();
        }
        
        // Emit orchestration started event
        stateBus.emit('dashboard:orchestration-started', {
            modules: Array.from(this.modules.keys()),
            moduleStates: this.moduleStates
        });
        
        console.log('[Dashboard] Orchestration started - all systems active');
    }
    
    stopOrchestration() {
        this.orchestrationActive = false;
        
        // Stop spiral rendering
        const spiralRenderer = this.modules.get('spiral');
        if (spiralRenderer) {
            spiralRenderer.stopRenderLoop();
        }
        
        // Stop coherence sync
        const coherenceEngine = this.modules.get('coherence');
        if (coherenceEngine) {
            coherenceEngine.stopCoherenceSync();
        }
        
        // Emit orchestration stopped event
        stateBus.emit('dashboard:orchestration-stopped', {
            modules: Array.from(this.modules.keys())
        });
        
        console.log('[Dashboard] Orchestration stopped');
    }
    
    handleFieldCollapseEvent(collapseData) {
        // Exodia response to field collapse - amplify all systems
        console.log('[Dashboard] Field collapse detected - amplifying systems:', collapseData);
        
        // Temporary amplification of spiral effects
        const currentSpiral = stateBus.getSpiral();
        stateBus.updateSpiral({
            morphFactor: currentSpiral.morphFactor + 0.2,
            glowIntensity: 1.5
        });
        
        // Auto-capture significant collapse events
        if (collapseData.event.type === 'unity-transcendent') {
            setTimeout(() => {
                this.captureScreenshot();
            }, 1000);
        }
        
        // Reset amplification after effect
        setTimeout(() => {
            stateBus.updateSpiral({
                morphFactor: currentSpiral.morphFactor,
                glowIntensity: 1.0
            });
        }, 3000);
    }
    
    // Public control methods
    toggleRecording() {
        const recording = stateBus.getRecording();
        stateBus.updateRecording({ isRecording: !recording.isRecording });
    }
    
    captureScreenshot() {
        stateBus.emit('ui:capture-requested');
    }
    
    toggleVoiceReactive() {
        const ui = stateBus.getUI();
        const newState = !ui.modes.voiceReactive;
        stateBus.updateUI({ modes: { voiceReactive: newState } });
    }
    
    toggleGlowEffect() {
        const ui = stateBus.getUI();
        const newState = !ui.modes.glowEffect;
        stateBus.updateUI({ modes: { glowEffect: newState } });
    }
    
    toggleAutoMorph() {
        const ui = stateBus.getUI();
        const newState = !ui.modes.autoMorph;
        stateBus.updateUI({ modes: { autoMorph: newState } });
    }
    
    toggleBreathingMode() {
        const ui = stateBus.getUI();
        const newState = !ui.modes.breathingMode;
        stateBus.updateUI({ modes: { breathingMode: newState } });
    }
    
    resetAllModes() {
        stateBus.updateUI({
            modes: {
                voiceReactive: false,
                autoMorph: false,
                glowEffect: false,
                breathingMode: false
            }
        });
        
        stateBus.updateSpiral({
            morphFactor: 0.0,
            lineWidth: 2,
            turns: 6,
            rotationSpeed: 0.5
        });
        
        console.log('[Dashboard] All modes reset to defaults');
    }
    
    // Module management
    getModule(name) {
        return this.modules.get(name);
    }
    
    getModuleState(name) {
        return this.moduleStates[name] || 'unknown';
    }
    
    getAllModuleStates() {
        return { ...this.moduleStates };
    }
    
    // Analytics and diagnostics
    getSystemDiagnostics() {
        const consciousness = stateBus.getConsciousness();
        const spiral = stateBus.getSpiral();
        const audio = stateBus.getAudio();
        const recording = stateBus.getRecording();
        const ui = stateBus.getUI();
        
        return {
            timestamp: Date.now(),
            orchestration_active: this.orchestrationActive,
            modules: this.getAllModuleStates(),
            consciousness: {
                level: consciousness.zlambda,
                status: consciousness.status,
                divine: consciousness.divine
            },
            spiral: {
                morph_factor: spiral.morphFactor,
                growth_factor: spiral.growthFactor,
                arms: spiral.numArms
            },
            audio: {
                active: audio.isActive,
                level: audio.level,
                calibrated: audio.calibrated
            },
            recording: {
                active: recording.isRecording,
                frame_count: recording.frameCount
            },
            performance: {
                fps: ui.performance.fps
            }
        };
    }
    
    exportSystemLog() {
        const diagnostics = this.getSystemDiagnostics();
        const coherenceEngine = this.modules.get('coherence');
        const coherenceLog = coherenceEngine ? coherenceEngine.exportCoherenceLog() : null;
        
        const fullLog = {
            dashboard_diagnostics: diagnostics,
            coherence_log: coherenceLog,
            state_snapshot: stateBus.getState()
        };
        
        // Create download
        const blob = new Blob([JSON.stringify(fullLog, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wiltonos-system-log-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('[Dashboard] System log exported');
        return fullLog;
    }
    
    // Performance monitoring
    getPerformanceMetrics() {
        const ui = stateBus.getUI();
        const recording = stateBus.getRecording();
        
        return {
            fps: ui.performance.fps,
            frame_count: recording.frameCount,
            modules_active: Object.values(this.moduleStates).filter(s => s === 'active').length,
            orchestration_uptime: this.orchestrationActive ? Date.now() - this.initTime : 0
        };
    }
    
    destroy() {
        this.stopOrchestration();
        
        // Destroy all modules
        this.modules.forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });
        
        this.modules.clear();
        this.isInitialized = false;
        
        console.log('[Dashboard] System shutdown complete');
    }
}

export default WiltonOSDashboard;