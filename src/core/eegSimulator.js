// EEG simulator for ψOS consciousness coupling testing
import { eventBus } from './eventBus.js';

class EEGSimulator {
    constructor() {
        this.isRunning = false;
        this.intervalId = null;
        this.baseAlpha = 0.6;
        this.baseBeta = 0.4;
        this.noiseLevel = 0.15;
        
        // Simulate natural EEG rhythms
        this.timeOffset = 0;
        this.breathingRate = 0.2; // ~12 breaths/min
        this.heartRate = 1.2; // ~72 bpm
        
        console.log('[EEG Simulator] Initialized with natural rhythm patterns');
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.timeOffset = 0;
        
        // Emit EEG data every 100ms (10Hz sampling)
        this.intervalId = setInterval(() => {
            this.generateEEGFrame();
            this.timeOffset += 0.1;
        }, 100);
        
        console.log('[EEG Simulator] Started with 10Hz sampling rate');
        
        eventBus.emit('eeg:connected', {
            device: 'simulator',
            sampleRate: 10,
            channels: ['alpha', 'beta']
        });
    }
    
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        console.log('[EEG Simulator] Stopped');
        
        eventBus.emit('eeg:disconnected', {
            reason: 'manual_stop'
        });
    }
    
    generateEEGFrame() {
        // Simulate natural brainwave patterns with coherent oscillations
        const t = this.timeOffset;
        
        // Base rhythms with natural variation
        const breathingModulation = Math.sin(t * this.breathingRate * 2 * Math.PI) * 0.1;
        const heartModulation = Math.sin(t * this.heartRate * 2 * Math.PI) * 0.05;
        
        // Alpha wave (8-12 Hz) - relaxed awareness
        const alphaBase = this.baseAlpha + breathingModulation;
        const alphaNoise = (Math.random() - 0.5) * this.noiseLevel;
        const alpha = Math.max(0, Math.min(1, alphaBase + alphaNoise));
        
        // Beta wave (13-30 Hz) - active thinking
        const betaBase = this.baseBeta - breathingModulation + heartModulation;
        const betaNoise = (Math.random() - 0.5) * this.noiseLevel;
        const beta = Math.max(0, Math.min(1, betaBase + betaNoise));
        
        // Calculate consciousness estimate using the S-2 formula
        const zlambda = Math.max(0, Math.min(1, (alpha - beta + 1) / 2));
        
        // Emit EEG data frame
        eventBus.emit('eeg:data', {
            timestamp: Date.now(),
            alpha: alpha,
            beta: beta,
            zlambda: zlambda,
            breathing: breathingModulation,
            heart: heartModulation
        });
        
        // Feed to consciousness processor
        eventBus.emit('eeg:consciousness', {
            value: zlambda,
            source: 'eeg_simulator',
            alpha: alpha,
            beta: beta
        });
    }
    
    // Simulate meditation state (higher alpha, lower beta)
    enterMeditativeState() {
        this.baseAlpha = 0.8;
        this.baseBeta = 0.2;
        this.noiseLevel = 0.08;
        console.log('[EEG Simulator] Entered meditative state');
    }
    
    // Simulate focused state (balanced alpha/beta)
    enterFocusedState() {
        this.baseAlpha = 0.6;
        this.baseBeta = 0.5;
        this.noiseLevel = 0.12;
        console.log('[EEG Simulator] Entered focused state');
    }
    
    // Simulate active thinking (higher beta)
    enterActiveState() {
        this.baseAlpha = 0.3;
        this.baseBeta = 0.7;
        this.noiseLevel = 0.18;
        console.log('[EEG Simulator] Entered active thinking state');
    }
    
    // Reset to default baseline
    resetToBaseline() {
        this.baseAlpha = 0.6;
        this.baseBeta = 0.4;
        this.noiseLevel = 0.15;
        console.log('[EEG Simulator] Reset to baseline state');
    }
    
    // Manual alpha/beta adjustment for testing
    adjustBands(alphaOffset, betaOffset) {
        this.baseAlpha = Math.max(0, Math.min(1, this.baseAlpha + alphaOffset));
        this.baseBeta = Math.max(0, Math.min(1, this.baseBeta + betaOffset));
        
        console.log(`[EEG Simulator] Bands adjusted: α=${this.baseAlpha.toFixed(3)}, β=${this.baseBeta.toFixed(3)}`);
    }
    
    getStatus() {
        return {
            running: this.isRunning,
            baseAlpha: this.baseAlpha,
            baseBeta: this.baseBeta,
            noiseLevel: this.noiseLevel,
            sampleRate: this.isRunning ? 10 : 0
        };
    }
}

// Create singleton instance
export const eegSimulator = new EEGSimulator();

// Convenience exports
export const startEEG = () => eegSimulator.start();
export const stopEEG = () => eegSimulator.stop();
export const enterMeditative = () => eegSimulator.enterMeditativeState();
export const enterFocused = () => eegSimulator.enterFocusedState();
export const enterActive = () => eegSimulator.enterActiveState();

export default eegSimulator;