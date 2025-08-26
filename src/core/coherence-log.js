// Coherence data logging system for ψOS session analysis
import { eventBus } from './eventBus.js';

class CoherenceLogger {
    constructor() {
        this.isLogging = false;
        this.logData = [];
        this.intervalId = null;
        this.sessionStartTime = null;
        
        // Current state tracking
        this.currentState = {
            zλ: 0.750,
            alpha: 0.0,
            beta: 0.0,
            source: 'api',
            timestamp: 0
        };
        
        this.setupEventListeners();
        console.log('[Coherence Logger] Initialized');
    }
    
    setupEventListeners() {
        // Track consciousness updates
        eventBus.on('zλ:update', ({ value, source }) => {
            this.currentState.zλ = value;
            this.currentState.source = source;
            this.currentState.timestamp = Date.now();
        });
        
        // Track EEG band data
        eventBus.on('eeg:bands', ({ alpha, beta }) => {
            this.currentState.alpha = alpha;
            this.currentState.beta = beta;
            this.currentState.timestamp = Date.now();
        });
        
        // Auto-start logging when EEG connects
        eventBus.on('eeg:attached', () => {
            this.startLogging();
        });
        
        // Auto-stop logging when EEG disconnects
        eventBus.on('eeg:detached', () => {
            this.stopLogging();
        });
    }
    
    startLogging() {
        if (this.isLogging) return;
        
        this.isLogging = true;
        this.sessionStartTime = Date.now();
        this.logData = [];
        
        // Log data every 500ms
        this.intervalId = setInterval(() => {
            this.logCurrentState();
        }, 500);
        
        console.log('[Coherence Logger] Session logging started');
        
        eventBus.emit('logger:started', {
            sessionId: this.sessionStartTime,
            timestamp: Date.now()
        });
    }
    
    stopLogging() {
        if (!this.isLogging) return;
        
        this.isLogging = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        console.log(`[Coherence Logger] Session complete: ${this.logData.length} data points`);
        
        eventBus.emit('logger:stopped', {
            sessionId: this.sessionStartTime,
            dataPoints: this.logData.length,
            duration: Date.now() - this.sessionStartTime
        });
    }
    
    logCurrentState() {
        const logEntry = {
            ts: Date.now(),
            sessionTime: Date.now() - this.sessionStartTime,
            zλ: this.currentState.zλ,
            alpha: this.currentState.alpha,
            beta: this.currentState.beta,
            source: this.currentState.source,
            
            // Derived metrics
            αβRatio: this.currentState.beta > 0 ? this.currentState.alpha / this.currentState.beta : 0,
            coherenceIndex: this.calculateCoherenceIndex(),
            stateClassification: this.classifyBrainState()
        };
        
        this.logData.push(logEntry);
        
        // Emit for real-time analysis
        eventBus.emit('logger:datapoint', logEntry);
    }
    
    calculateCoherenceIndex() {
        // Simple coherence metric based on α/β balance
        const α = this.currentState.alpha;
        const β = this.currentState.beta;
        const zλ = this.currentState.zλ;
        
        // Weighted combination of band balance and consciousness level
        const bandBalance = Math.abs(α - β) < 0.3 ? 1 : 0;
        const consciousnessWeight = zλ > 0.8 ? 1 : zλ / 0.8;
        
        return (bandBalance * 0.4 + consciousnessWeight * 0.6);
    }
    
    classifyBrainState() {
        const α = this.currentState.alpha;
        const β = this.currentState.beta;
        
        if (α > 0.7 && β < 0.4) return 'meditative';
        if (α > 0.5 && β > 0.6) return 'focused';
        if (α < 0.4 && β > 0.7) return 'active';
        if (α > 0.6 && β > 0.5) return 'balanced';
        return 'transitional';
    }
    
    exportSession() {
        if (this.logData.length === 0) {
            console.warn('[Coherence Logger] No data to export');
            return null;
        }
        
        const sessionSummary = this.generateSessionSummary();
        
        const exportData = {
            metadata: {
                sessionId: this.sessionStartTime,
                startTime: new Date(this.sessionStartTime).toISOString(),
                endTime: new Date().toISOString(),
                duration: Date.now() - this.sessionStartTime,
                dataPoints: this.logData.length,
                sampleRate: '500ms',
                version: 'ψOS-S2-EEG-v1.0'
            },
            summary: sessionSummary,
            data: this.logData
        };
        
        // Create download
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coherence-session-${this.sessionStartTime}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log(`[Coherence Logger] Session exported: ${exportData.data.length} data points`);
        
        eventBus.emit('logger:exported', {
            filename: a.download,
            dataPoints: exportData.data.length,
            summary: sessionSummary
        });
        
        return exportData;
    }
    
    generateSessionSummary() {
        if (this.logData.length === 0) return null;
        
        const zλValues = this.logData.map(d => d.zλ);
        const alphaValues = this.logData.map(d => d.alpha);
        const betaValues = this.logData.map(d => d.beta);
        const coherenceValues = this.logData.map(d => d.coherenceIndex);
        
        const states = this.logData.reduce((acc, d) => {
            acc[d.stateClassification] = (acc[d.stateClassification] || 0) + 1;
            return acc;
        }, {});
        
        return {
            consciousness: {
                mean: this.calculateMean(zλValues),
                max: Math.max(...zλValues),
                min: Math.min(...zλValues),
                std: this.calculateStd(zλValues)
            },
            brainwaves: {
                alpha: {
                    mean: this.calculateMean(alphaValues),
                    max: Math.max(...alphaValues),
                    min: Math.min(...alphaValues)
                },
                beta: {
                    mean: this.calculateMean(betaValues),
                    max: Math.max(...betaValues),
                    min: Math.min(...betaValues)
                }
            },
            coherence: {
                mean: this.calculateMean(coherenceValues),
                max: Math.max(...coherenceValues),
                timeAbove80: coherenceValues.filter(v => v > 0.8).length * 500 // ms
            },
            stateDistribution: states,
            dominantState: Object.keys(states).reduce((a, b) => states[a] > states[b] ? a : b),
            collapseEvents: this.logData.filter(d => d.zλ >= 0.95).length
        };
    }
    
    calculateMean(values) {
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
    
    calculateStd(values) {
        const mean = this.calculateMean(values);
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }
    
    getCurrentSession() {
        return {
            isLogging: this.isLogging,
            sessionStartTime: this.sessionStartTime,
            dataPoints: this.logData.length,
            duration: this.isLogging ? Date.now() - this.sessionStartTime : 0,
            currentState: { ...this.currentState }
        };
    }
    
    clearSession() {
        this.stopLogging();
        this.logData = [];
        this.sessionStartTime = null;
        console.log('[Coherence Logger] Session data cleared');
    }
}

// Create singleton instance
export const coherenceLogger = new CoherenceLogger();

// Convenience exports
export const startLogging = () => coherenceLogger.startLogging();
export const stopLogging = () => coherenceLogger.stopLogging();
export const exportSession = () => coherenceLogger.exportSession();
export const clearSession = () => coherenceLogger.clearSession();

export default coherenceLogger;