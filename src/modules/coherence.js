// Real-time Zλ coherence management with field collapse tracking
import { stateBus } from '@shared/state-bus.js';

export class CoherenceEngine {
    constructor() {
        this.apiEndpoint = '/api/quantum/consciousness';
        this.isRunning = false;
        this.pollInterval = 1500; // 1.5 second updates
        this.smoothingFactor = 0.85;
        
        // Coherence tracking
        this.coherenceHistory = [];
        this.maxHistoryLength = 100;
        
        // Field collapse detection
        this.fieldCollapseThreshold = 0.95;
        this.collapseEvents = [];
        this.divineInterfaceActive = false;
        
        // Smoothing state
        this.smoothedZλ = 0.750;
        this.rawZλ = 0.750;
        
        console.log('[Coherence] Engine initialized with field collapse tracking');
    }
    
    async startCoherenceSync() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        await this.syncLoop();
        
        console.log('[Coherence] Real-time synchronization started');
    }
    
    stopCoherenceSync() {
        this.isRunning = false;
        console.log('[Coherence] Synchronization stopped');
    }
    
    async syncLoop() {
        while (this.isRunning) {
            try {
                await this.fetchAndProcessCoherence();
                await this.sleep(this.pollInterval);
            } catch (error) {
                console.error('[Coherence] Sync error:', error);
                await this.sleep(this.pollInterval * 2); // Backoff on error
            }
        }
    }
    
    async fetchAndProcessCoherence() {
        try {
            const response = await fetch(this.apiEndpoint);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.zlambda !== undefined) {
                this.processCoherenceData(data);
            }
        } catch (error) {
            console.warn('[Coherence] API fetch failed, maintaining current state');
        }
    }
    
    processCoherenceData(data) {
        // Extract raw consciousness data
        this.rawZλ = parseFloat(data.zlambda);
        const intensity = parseFloat(data.intensity) || 0;
        const divine = data.divine || false;
        
        // Apply exponential smoothing
        this.smoothedZλ = this.smoothedZλ * this.smoothingFactor + 
                         this.rawZλ * (1 - this.smoothingFactor);
        
        // Update coherence history
        this.updateCoherenceHistory({
            timestamp: Date.now(),
            raw: this.rawZλ,
            smoothed: this.smoothedZλ,
            intensity,
            divine
        });
        
        // Detect field collapse events
        this.detectFieldCollapse(this.smoothedZλ, intensity, divine);
        
        // Update divine interface state
        this.updateDivineInterface(divine, this.smoothedZλ);
        
        // Update state bus with processed data
        stateBus.updateConsciousness({
            zlambda: this.smoothedZλ,
            raw_zlambda: this.rawZλ,
            intensity,
            divine,
            status: this.getCoherenceStatus(this.smoothedZλ)
        });
        
        // Emit coherence events
        this.emitCoherenceEvents();
    }
    
    updateCoherenceHistory(entry) {
        this.coherenceHistory.push(entry);
        
        // Trim history to max length
        if (this.coherenceHistory.length > this.maxHistoryLength) {
            this.coherenceHistory.shift();
        }
    }
    
    detectFieldCollapse(zlambda, intensity, divine) {
        const isCollapse = zlambda > this.fieldCollapseThreshold && divine;
        
        if (isCollapse) {
            const collapseEvent = {
                timestamp: Date.now(),
                zlambda,
                intensity,
                type: this.getCollapseType(zlambda, intensity)
            };
            
            this.collapseEvents.push(collapseEvent);
            
            // Trim collapse events (keep last 20)
            if (this.collapseEvents.length > 20) {
                this.collapseEvents.shift();
            }
            
            // Emit field collapse event
            stateBus.emit('coherence:field-collapse', {
                event: collapseEvent,
                history: this.getRecentCollapses()
            });
            
            console.log(`[Coherence] Field collapse detected: Zλ=${zlambda.toFixed(3)}, I=${intensity.toFixed(2)}`);
        }
    }
    
    getCollapseType(zlambda, intensity) {
        if (zlambda >= 0.999) {
            return intensity > 8 ? 'unity-transcendent' : 'unity-stable';
        } else if (zlambda >= 0.98) {
            return intensity > 5 ? 'transcendent-peak' : 'transcendent-sustained';
        } else {
            return 'threshold-crossing';
        }
    }
    
    updateDivineInterface(divine, zlambda) {
        const wasActive = this.divineInterfaceActive;
        this.divineInterfaceActive = divine && zlambda > 0.9;
        
        // Emit divine interface toggle events
        if (this.divineInterfaceActive && !wasActive) {
            stateBus.emit('coherence:divine-interface-activated', {
                zlambda,
                timestamp: Date.now()
            });
        } else if (!this.divineInterfaceActive && wasActive) {
            stateBus.emit('coherence:divine-interface-deactivated', {
                zlambda,
                timestamp: Date.now()
            });
        }
    }
    
    getCoherenceStatus(zlambda) {
        if (zlambda >= 0.95) return 'transcendent';
        if (zlambda >= 0.85) return 'awakened';
        if (zlambda >= 0.75) return 'ascending';
        return 'alive';
    }
    
    emitCoherenceEvents() {
        const current = this.getCurrentCoherence();
        const trend = this.getCoherenceTrend();
        const stability = this.getCoherenceStability();
        
        // Emit detailed coherence update
        stateBus.emit('coherence:detailed-update', {
            current,
            trend,
            stability,
            divine_interface: this.divineInterfaceActive,
            recent_collapses: this.getRecentCollapses()
        });
        
        // Emit trend-specific events
        if (Math.abs(trend) > 0.01) {
            stateBus.emit('coherence:trend-detected', {
                direction: trend > 0 ? 'ascending' : 'descending',
                magnitude: Math.abs(trend),
                current: current.smoothed
            });
        }
        
        // Emit stability warnings
        if (stability < 0.1) {
            stateBus.emit('coherence:instability-detected', {
                stability,
                current: current.smoothed,
                history: this.getRecentHistory(10)
            });
        }
    }
    
    getCurrentCoherence() {
        return {
            raw: this.rawZλ,
            smoothed: this.smoothedZλ,
            delta: this.rawZλ - this.smoothedZλ,
            timestamp: Date.now()
        };
    }
    
    getCoherenceTrend(samples = 10) {
        if (this.coherenceHistory.length < samples) return 0;
        
        const recent = this.coherenceHistory.slice(-samples);
        const first = recent[0].smoothed;
        const last = recent[recent.length - 1].smoothed;
        
        return (last - first) / samples;
    }
    
    getCoherenceStability(samples = 20) {
        if (this.coherenceHistory.length < samples) return 1.0;
        
        const recent = this.coherenceHistory.slice(-samples);
        const values = recent.map(entry => entry.smoothed);
        
        // Calculate standard deviation
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        // Return stability as inverse of normalized standard deviation
        return Math.max(0, 1 - (stdDev * 10));
    }
    
    getRecentHistory(count = 10) {
        return this.coherenceHistory.slice(-count);
    }
    
    getRecentCollapses(count = 5) {
        return this.collapseEvents.slice(-count);
    }
    
    // Manual coherence adjustment (for testing or calibration)
    adjustCoherence(delta) {
        this.smoothedZλ = Math.max(0, Math.min(1, this.smoothedZλ + delta));
        
        stateBus.updateConsciousness({
            zlambda: this.smoothedZλ,
            status: this.getCoherenceStatus(this.smoothedZλ)
        });
        
        stateBus.emit('coherence:manual-adjustment', {
            delta,
            new_value: this.smoothedZλ
        });
    }
    
    // Set smoothing parameters
    setSmoothingFactor(factor) {
        this.smoothingFactor = Math.max(0.1, Math.min(0.99, factor));
        console.log(`[Coherence] Smoothing factor updated: ${this.smoothingFactor}`);
    }
    
    setPollInterval(interval) {
        this.pollInterval = Math.max(500, Math.min(10000, interval));
        console.log(`[Coherence] Poll interval updated: ${this.pollInterval}ms`);
    }
    
    setFieldCollapseThreshold(threshold) {
        this.fieldCollapseThreshold = Math.max(0.8, Math.min(0.999, threshold));
        console.log(`[Coherence] Field collapse threshold updated: ${this.fieldCollapseThreshold}`);
    }
    
    // Get coherence analytics
    getAnalytics() {
        const history = this.getRecentHistory(50);
        
        if (history.length === 0) {
            return {
                average: this.smoothedZλ,
                peak: this.smoothedZλ,
                valley: this.smoothedZλ,
                trend: 0,
                stability: 1.0,
                collapse_count: 0
            };
        }
        
        const values = history.map(entry => entry.smoothed);
        
        return {
            average: values.reduce((sum, val) => sum + val, 0) / values.length,
            peak: Math.max(...values),
            valley: Math.min(...values),
            trend: this.getCoherenceTrend(20),
            stability: this.getCoherenceStability(30),
            collapse_count: this.collapseEvents.length,
            divine_interface_active: this.divineInterfaceActive,
            last_collapse: this.collapseEvents.length > 0 ? 
                this.collapseEvents[this.collapseEvents.length - 1] : null
        };
    }
    
    // Export coherence data for logging
    exportCoherenceLog() {
        return {
            timestamp: Date.now(),
            coherence_history: this.coherenceHistory,
            collapse_events: this.collapseEvents,
            current_state: this.getCurrentCoherence(),
            analytics: this.getAnalytics(),
            settings: {
                smoothing_factor: this.smoothingFactor,
                poll_interval: this.pollInterval,
                field_collapse_threshold: this.fieldCollapseThreshold
            }
        };
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    destroy() {
        this.stopCoherenceSync();
        this.coherenceHistory = [];
        this.collapseEvents = [];
    }
}

export default CoherenceEngine;