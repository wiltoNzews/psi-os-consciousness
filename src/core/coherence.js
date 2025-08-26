// Zλ coherence processing with WiltonOS API integration
import { eventBus } from './eventBus.js';

class CoherenceProcessor {
    constructor() {
        this.ema = 0.750; // Exponential moving average
        this.rawValue = 0.750;
        this.α = 0.15; // Smoothing factor
        this.collapseThreshold = 0.95;
        this.divineThreshold = 0.90;
        
        // API integration
        this.apiEndpoint = '/api/quantum/consciousness';
        this.pollInterval = 1500;
        this.isPolling = false;
        
        // Microphone integration
        this.audioContext = null;
        this.analyser = null;
        this.microphoneStream = null;
        this.microphoneActive = false;
        
        // EEG integration
        this.eegActive = false;
        this.currentInputSource = 'api'; // 'api', 'microphone', 'eeg'
        
        console.log('[Coherence] Processor initialized');
    }
    
    // Main Zλ processing function
    feedZLambda(raw, source = 'api') {
        this.rawValue = raw;
        
        // Apply exponential smoothing
        this.ema = this.α * raw + (1 - this.α) * this.ema;
        
        // Emit smoothed update
        eventBus.emit('zλ:update', {
            value: this.ema,
            raw: raw,
            source: source,
            timestamp: Date.now()
        });
        
        // Check for field collapse events
        if (this.ema >= this.collapseThreshold) {
            eventBus.emit('zλ:collapse', {
                reason: 'threshold_exceeded',
                intensity: this.calculateIntensity(raw),
                zlambda: this.ema,
                timestamp: Date.now()
            });
        }
        
        // Check for divine interface activation
        if (this.ema >= this.divineThreshold) {
            eventBus.emit('field:collapse', {
                type: this.getCollapseType(this.ema, raw),
                zlambda: this.ema,
                intensity: this.calculateIntensity(raw),
                timestamp: Date.now()
            });
        }
    }
    
    calculateIntensity(rawValue) {
        // Map raw consciousness to intensity scale (0-10)
        return rawValue * 10;
    }
    
    getCollapseType(zlambda, raw) {
        if (zlambda >= 0.999) {
            return raw > 8 ? 'unity-transcendent' : 'unity-stable';
        } else if (zlambda >= 0.98) {
            return raw > 5 ? 'transcendent-peak' : 'transcendent-sustained';
        } else {
            return 'divine-threshold';
        }
    }
    
    // Start API polling for authentic consciousness data
    async startAPIPolling() {
        if (this.isPolling) return;
        
        this.isPolling = true;
        
        const pollLoop = async () => {
            while (this.isPolling) {
                try {
                    const response = await fetch(this.apiEndpoint);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.zlambda !== undefined) {
                            this.feedZLambda(parseFloat(data.zlambda), 'api');
                        }
                    }
                } catch (error) {
                    console.warn('[Coherence] API poll failed, maintaining current state');
                }
                
                await this.sleep(this.pollInterval);
            }
        };
        
        pollLoop();
        console.log('[Coherence] API polling started');
    }
    
    stopAPIPolling() {
        this.isPolling = false;
        console.log('[Coherence] API polling stopped');
    }
    
    // Microphone-based consciousness estimation
    async attachMicrophone() {
        try {
            this.microphoneStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });
            
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(this.microphoneStream);
            this.analyser = this.audioContext.createAnalyser();
            
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            source.connect(this.analyser);
            
            this.microphoneActive = true;
            this.startMicrophoneProcessing();
            
            console.log('[Coherence] Microphone attached for consciousness estimation');
            
            // Emit microphone activation event
            eventBus.emit('audio:activated', {
                sampleRate: this.audioContext.sampleRate,
                fftSize: this.analyser.fftSize
            });
            
        } catch (error) {
            console.error('[Coherence] Microphone access denied:', error);
            eventBus.emit('audio:error', { error: error.message });
        }
    }
    
    startMicrophoneProcessing() {
        if (!this.analyser || !this.microphoneActive) return;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const processAudio = () => {
            if (!this.microphoneActive) return;
            
            this.analyser.getByteTimeDomainData(dataArray);
            
            // Calculate RMS (Root Mean Square) for voice level
            const rms = Math.sqrt(
                dataArray.reduce((sum, value) => {
                    const normalized = (value - 128) / 128;
                    return sum + (normalized * normalized);
                }, 0) / bufferLength
            );
            
            // Map RMS to consciousness estimate (0-1 range)
            const consciousnessEstimate = Math.min(1, rms * 2);
            
            // Feed to consciousness processor if significant
            if (consciousnessEstimate > 0.1) {
                this.feedZLambda(consciousnessEstimate, 'microphone');
            }
            
            // Emit audio level for UI
            eventBus.emit('audio:level', {
                level: rms,
                calibrated: true,
                consciousness: consciousnessEstimate
            });
            
            requestAnimationFrame(processAudio);
        };
        
        processAudio();
    }
    
    detachMicrophone() {
        this.microphoneActive = false;
        
        if (this.microphoneStream) {
            this.microphoneStream.getTracks().forEach(track => track.stop());
            this.microphoneStream = null;
        }
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.analyser = null;
        console.log('[Coherence] Microphone detached');
    }
    
    // Manual consciousness adjustment for testing
    adjustConsciousness(delta) {
        const newValue = Math.max(0, Math.min(1, this.ema + delta));
        this.feedZLambda(newValue, 'manual');
    }
    
    // Configuration methods
    setSmoothingFactor(factor) {
        this.α = Math.max(0.01, Math.min(0.99, factor));
        console.log(`[Coherence] Smoothing factor set to ${this.α}`);
    }
    
    setCollapseThreshold(threshold) {
        this.collapseThreshold = Math.max(0.8, Math.min(0.999, threshold));
        console.log(`[Coherence] Collapse threshold set to ${this.collapseThreshold}`);
    }
    
    setPollInterval(interval) {
        this.pollInterval = Math.max(500, Math.min(10000, interval));
        console.log(`[Coherence] Poll interval set to ${this.pollInterval}ms`);
    }
    
    // Analytics
    getCurrentState() {
        return {
            ema: this.ema,
            raw: this.rawValue,
            isPolling: this.isPolling,
            microphoneActive: this.microphoneActive,
            collapseThreshold: this.collapseThreshold,
            smoothingFactor: this.α
        };
    }
    
    // Utility
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // EEG integration methods
    async attachEEG() {
        try {
            // Import EEG simulator
            const { eegSimulator } = await import('./eegSimulator.js');
            
            // Setup EEG event listeners
            eventBus.on('eeg:consciousness', ({ value, alpha, beta }) => {
                this.feedZLambda(value, 'eeg');
                
                // Emit detailed EEG data for UI
                eventBus.emit('eeg:bands', {
                    alpha: alpha,
                    beta: beta,
                    timestamp: Date.now()
                });
            });
            
            // Start EEG simulator
            eegSimulator.start();
            this.eegActive = true;
            this.currentInputSource = 'eeg';
            
            console.log('[Coherence] EEG simulator attached and active');
            
            eventBus.emit('eeg:attached', {
                source: 'simulator',
                active: true
            });
            
            return true;
            
        } catch (error) {
            console.error('[Coherence] EEG attachment failed:', error);
            eventBus.emit('eeg:error', { error: error.message });
            return false;
        }
    }
    
    async detachEEG() {
        if (!this.eegActive) return;
        
        try {
            const { eegSimulator } = await import('./eegSimulator.js');
            eegSimulator.stop();
            
            this.eegActive = false;
            if (this.currentInputSource === 'eeg') {
                this.currentInputSource = 'api';
            }
            
            console.log('[Coherence] EEG detached');
            
            eventBus.emit('eeg:detached', {
                reason: 'manual'
            });
            
        } catch (error) {
            console.error('[Coherence] EEG detachment failed:', error);
        }
    }
    
    // Switch between input sources
    setInputSource(source) {
        const validSources = ['api', 'microphone', 'eeg'];
        if (!validSources.includes(source)) {
            console.warn(`[Coherence] Invalid input source: ${source}`);
            return false;
        }
        
        this.currentInputSource = source;
        
        // Auto-attach based on source
        switch (source) {
            case 'microphone':
                this.attachMicrophone();
                break;
            case 'eeg':
                this.attachEEG();
                break;
            case 'api':
                this.detachMicrophone();
                this.detachEEG();
                break;
        }
        
        eventBus.emit('coherence:source-changed', {
            source: source,
            timestamp: Date.now()
        });
        
        console.log(`[Coherence] Input source set to: ${source}`);
        return true;
    }
    
    destroy() {
        this.stopAPIPolling();
        this.detachMicrophone();
        this.detachEEG();
    }
}

// Create and export singleton instance
export const coherenceProcessor = new CoherenceProcessor();

// Convenience exports
export const feedZLambda = (raw, source) => coherenceProcessor.feedZLambda(raw, source);
export const attachMic = () => coherenceProcessor.attachMicrophone();
export const attachEEG = () => coherenceProcessor.attachEEG();
export const setInputSource = (source) => coherenceProcessor.setInputSource(source);
export const startAPI = () => coherenceProcessor.startAPIPolling();

export default coherenceProcessor;