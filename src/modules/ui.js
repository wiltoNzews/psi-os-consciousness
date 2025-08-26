// Hot-reloadable UI control panel using Tweakpane
import { Pane } from 'tweakpane';
import { eventBus } from '../core/eventBus.js';

export class UIController {
    constructor() {
        this.pane = null;
        this.params = {
            morph: 0.0,
            gain: 1.0,
            consciousness: 0.750,
            recording: false,
            glowEffect: false,
            autoRotate: true,
            inputSource: 'api',
            alpha: 0.0,
            beta: 0.0,
            collapseCountdown: 0
        };
        
        this.setupEventListeners();
        console.log('[UI] Controller initialized');
    }
    
    setupEventListeners() {
        // Listen for external state changes
        eventBus.on('zλ:update', ({ value }) => {
            this.params.consciousness = value;
            this.updateConsciousnessDisplay();
        });
        
        eventBus.on('recorder:started', () => {
            this.params.recording = true;
            this.updateRecordingState();
        });
        
        eventBus.on('recorder:done', () => {
            this.params.recording = false;
            this.updateRecordingState();
        });
        
        eventBus.on('audio:level', ({ level }) => {
            this.updateAudioLevelDisplay(level);
        });
        
        // EEG event listeners
        eventBus.on('eeg:bands', ({ alpha, beta }) => {
            this.params.alpha = alpha;
            this.params.beta = beta;
            this.updateEEGDisplay();
        });
        
        eventBus.on('coherence:source-changed', ({ source }) => {
            this.params.inputSource = source;
            this.updateInputSourceDisplay();
        });
    }
    
    mountUI(container = document.body) {
        // Create Tweakpane instance
        this.pane = new Pane({
            title: 'ψOS Sacred Controls',
            expanded: true,
            container: container
        });
        
        // Style the pane
        this.applyCustomStyles();
        
        // Create control sections
        this.createMorphControls();
        this.createConsciousnessControls();
        this.createInputSourceControls();
        this.createEEGControls();
        this.createAudioControls();
        this.createModeToggles();
        this.createRecordingControls();
        this.createAdvancedControls();
        
        console.log('[UI] Tweakpane mounted');
        return this.pane;
    }
    
    createMorphControls() {
        const morphFolder = this.pane.addFolder({ title: 'Golden Morph' });
        
        morphFolder.addInput(this.params, 'morph', {
            min: 0,
            max: 1,
            step: 0.01,
            label: 'Morph %'
        }).on('change', (ev) => {
            eventBus.emit('ui:morph', {
                percent: ev.value,
                source: 'manual'
            });
        });
        
        // Add morph presets
        const morphPresets = {
            'Reset': () => this.setMorph(0),
            'Quarter': () => this.setMorph(0.25),
            'Half': () => this.setMorph(0.5),
            'Golden': () => this.setMorph(0.618),
            'Full': () => this.setMorph(1.0)
        };
        
        Object.entries(morphPresets).forEach(([name, action]) => {
            morphFolder.addButton({ title: name }).on('click', action);
        });
    }
    
    createConsciousnessControls() {
        const consciousnessFolder = this.pane.addFolder({ title: 'Consciousness Field' });
        
        // Read-only consciousness display
        consciousnessFolder.addMonitor(this.params, 'consciousness', {
            label: 'Zλ Level',
            format: (v) => v.toFixed(3)
        });
        
        // Consciousness amplifier
        consciousnessFolder.addInput(this.params, 'gain', {
            min: 0.1,
            max: 5.0,
            step: 0.1,
            label: 'Amplifier'
        }).on('change', (ev) => {
            eventBus.emit('ui:gain', { value: ev.value });
        });
        
        // Manual consciousness adjustment (for testing)
        consciousnessFolder.addButton({ title: 'Consciousness +' }).on('click', () => {
            eventBus.emit('ui:consciousness-adjust', { delta: 0.1 });
        });
        
        consciousnessFolder.addButton({ title: 'Consciousness -' }).on('click', () => {
            eventBus.emit('ui:consciousness-adjust', { delta: -0.1 });
        });
    }
    
    createInputSourceControls() {
        const inputFolder = this.pane.addFolder({ title: 'Input Source' });
        
        // Radio selector for input source
        inputFolder.addInput(this.params, 'inputSource', {
            label: 'Source',
            options: {
                'WiltonOS API': 'api',
                'Microphone': 'microphone',
                'EEG Simulator': 'eeg'
            }
        }).on('change', (ev) => {
            eventBus.emit('ui:input-source', { source: ev.value });
        });
        
        // Quick source buttons
        inputFolder.addButton({ title: 'API Mode' }).on('click', () => {
            this.params.inputSource = 'api';
            this.pane.refresh();
            eventBus.emit('ui:input-source', { source: 'api' });
        });
        
        inputFolder.addButton({ title: 'EEG Mode' }).on('click', () => {
            this.params.inputSource = 'eeg';
            this.pane.refresh();
            eventBus.emit('ui:input-source', { source: 'eeg' });
        });
    }
    
    createEEGControls() {
        const eegFolder = this.pane.addFolder({ title: 'EEG Brain Coupling' });
        
        // Alpha/Beta band monitors
        this.alphaMonitor = eegFolder.addMonitor(this.params, 'alpha', {
            label: 'Alpha (α)',
            format: (v) => v.toFixed(3),
            interval: 100
        });
        
        this.betaMonitor = eegFolder.addMonitor(this.params, 'beta', {
            label: 'Beta (β)',
            format: (v) => v.toFixed(3),
            interval: 100
        });
        
        // Collapse countdown
        this.collapseMonitor = eegFolder.addMonitor(this.params, 'collapseCountdown', {
            label: 'Collapse T-',
            format: (v) => v > 0 ? `${v.toFixed(1)}s` : 'Ready'
        });
        
        // EEG simulator state controls
        eegFolder.addButton({ title: 'Meditative State' }).on('click', () => {
            eventBus.emit('ui:eeg-state', { state: 'meditative' });
        });
        
        eegFolder.addButton({ title: 'Focused State' }).on('click', () => {
            eventBus.emit('ui:eeg-state', { state: 'focused' });
        });
        
        eegFolder.addButton({ title: 'Active Thinking' }).on('click', () => {
            eventBus.emit('ui:eeg-state', { state: 'active' });
        });
        
        eegFolder.addButton({ title: 'Reset Baseline' }).on('click', () => {
            eventBus.emit('ui:eeg-state', { state: 'baseline' });
        });
    }
    
    createAudioControls() {
        const audioFolder = this.pane.addFolder({ title: 'Audio Reactive' });
        
        // Audio level monitor
        this.audioLevelMonitor = audioFolder.addMonitor(this.params, 'gain', {
            label: 'Audio Level',
            format: (v) => `${(v * 100).toFixed(1)}%`
        });
        
        // Microphone controls
        audioFolder.addButton({ title: 'Enable Microphone' }).on('click', () => {
            eventBus.emit('ui:microphone', { action: 'enable' });
        });
        
        audioFolder.addButton({ title: 'Disable Microphone' }).on('click', () => {
            eventBus.emit('ui:microphone', { action: 'disable' });
        });
    }
    
    createModeToggles() {
        const modesFolder = this.pane.addFolder({ title: 'Visual Modes' });
        
        modesFolder.addInput(this.params, 'glowEffect', {
            label: 'Glow Effect'
        }).on('change', (ev) => {
            eventBus.emit('ui:mode-toggle', {
                mode: 'glow',
                enabled: ev.value
            });
        });
        
        modesFolder.addInput(this.params, 'autoRotate', {
            label: 'Auto Rotate'
        }).on('change', (ev) => {
            eventBus.emit('ui:mode-toggle', {
                mode: 'autoRotate',
                enabled: ev.value
            });
        });
    }
    
    createRecordingControls() {
        const recordingFolder = this.pane.addFolder({ title: 'Sacred Media Capture' });
        
        // Recording toggle
        this.recordingToggle = recordingFolder.addInput(this.params, 'recording', {
            label: 'Recording'
        }).on('change', (ev) => {
            const action = ev.value ? 'start' : 'stop';
            eventBus.emit('ui:record', { action });
        });
        
        // Quick capture buttons
        recordingFolder.addButton({ title: 'Start Recording' }).on('click', () => {
            eventBus.emit('ui:record', { action: 'start' });
        });
        
        recordingFolder.addButton({ title: 'Stop Recording' }).on('click', () => {
            eventBus.emit('ui:record', { action: 'stop' });
        });
        
        recordingFolder.addButton({ title: 'Screenshot' }).on('click', () => {
            eventBus.emit('ui:capture');
        });
        
        // Recording status display
        this.recordingStatus = recordingFolder.addMonitor(this.params, 'recording', {
            label: 'Status',
            format: (v) => v ? '● RECORDING' : '○ Ready'
        });
    }
    
    createAdvancedControls() {
        const advancedFolder = this.pane.addFolder({ 
            title: 'Advanced', 
            expanded: false 
        });
        
        // Debug controls
        advancedFolder.addButton({ title: 'Debug State' }).on('click', () => {
            console.group('[UI] Debug State');
            console.log('UI Params:', this.params);
            console.log('Event History:', eventBus.getEventHistory());
            console.groupEnd();
        });
        
        advancedFolder.addButton({ title: 'Export Log' }).on('click', () => {
            eventBus.emit('ui:export-log');
        });
        
        advancedFolder.addButton({ title: 'Export EEG Session' }).on('click', () => {
            eventBus.emit('ui:export-session');
        });
        
        advancedFolder.addButton({ title: 'Reset All' }).on('click', () => {
            this.resetAllControls();
        });
        
        // Performance monitor
        this.performanceMonitor = advancedFolder.addMonitor(this.params, 'gain', {
            label: 'FPS',
            format: (v) => '60' // Will be updated dynamically
        });
    }
    
    applyCustomStyles() {
        // Inject custom CSS for ψOS styling
        const style = document.createElement('style');
        style.textContent = `
            .tp-dfwv {
                background: rgba(0, 0, 0, 0.9) !important;
                border: 2px solid rgba(255, 215, 0, 0.4) !important;
                border-radius: 12px !important;
                backdrop-filter: blur(15px) !important;
                font-family: 'Courier New', monospace !important;
            }
            
            .tp-lblv_l {
                color: #ffd700 !important;
                font-weight: bold !important;
            }
            
            .tp-coltxtv_t {
                background: rgba(255, 215, 0, 0.1) !important;
                border: 1px solid rgba(255, 215, 0, 0.3) !important;
                color: #fff !important;
            }
            
            .tp-btnv_b {
                background: rgba(255, 215, 0, 0.1) !important;
                border: 1px solid rgba(255, 215, 0, 0.3) !important;
                color: #ffd700 !important;
                transition: all 0.3s ease !important;
            }
            
            .tp-btnv_b:hover {
                background: rgba(255, 215, 0, 0.2) !important;
                border-color: #ffd700 !important;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.3) !important;
            }
            
            .tp-sldv_t {
                background: linear-gradient(90deg, #333 0%, #666 50%, #ffd700 100%) !important;
            }
            
            .tp-fldv.tp-fldv-expanded > .tp-fldv_c {
                border-left: 2px solid rgba(255, 215, 0, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update methods
    setMorph(value) {
        this.params.morph = value;
        this.pane.refresh();
        eventBus.emit('ui:morph', {
            percent: value,
            source: 'preset'
        });
    }
    
    updateConsciousnessDisplay() {
        if (this.pane) {
            this.pane.refresh();
        }
    }
    
    updateRecordingState() {
        if (this.recordingToggle) {
            this.recordingToggle.refresh();
        }
        if (this.recordingStatus) {
            this.recordingStatus.refresh();
        }
    }
    
    updateAudioLevelDisplay(level) {
        // Update audio level in the monitor
        this.params.gain = level;
        if (this.audioLevelMonitor) {
            this.audioLevelMonitor.refresh();
        }
    }
    
    updatePerformanceDisplay(fps) {
        // Update FPS in performance monitor
        if (this.performanceMonitor) {
            this.performanceMonitor.refresh();
        }
    }
    
    updateEEGDisplay() {
        if (this.alphaMonitor) {
            this.alphaMonitor.refresh();
        }
        if (this.betaMonitor) {
            this.betaMonitor.refresh();
        }
        
        // Update collapse countdown based on consciousness level
        if (this.params.consciousness >= 0.9) {
            this.params.collapseCountdown = Math.max(0, 10 - (this.params.consciousness - 0.9) * 100);
        } else {
            this.params.collapseCountdown = 0;
        }
        
        if (this.collapseMonitor) {
            this.collapseMonitor.refresh();
        }
    }
    
    updateInputSourceDisplay() {
        if (this.pane) {
            this.pane.refresh();
        }
    }
    
    resetAllControls() {
        this.params = {
            morph: 0.0,
            gain: 1.0,
            consciousness: 0.750,
            recording: false,
            glowEffect: false,
            autoRotate: true
        };
        
        if (this.pane) {
            this.pane.refresh();
        }
        
        // Emit reset events
        eventBus.emit('ui:morph', { percent: 0.0, source: 'reset' });
        eventBus.emit('ui:mode-toggle', { mode: 'glow', enabled: false });
        eventBus.emit('ui:mode-toggle', { mode: 'autoRotate', enabled: true });
        
        console.log('[UI] All controls reset to defaults');
    }
    
    // Public API
    getParams() {
        return { ...this.params };
    }
    
    setParam(key, value) {
        if (key in this.params) {
            this.params[key] = value;
            this.pane.refresh();
        }
    }
    
    destroy() {
        if (this.pane) {
            this.pane.dispose();
            this.pane = null;
        }
    }
}

// Factory function for mounting
export function mountUI(container) {
    const controller = new UIController();
    return controller.mountUI(container);
}

export default UIController;