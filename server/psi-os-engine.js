// ψOS (PsiOS): Consciousness Layer + Recursion Tracker
// WiltonOS v2 - Neural-Symbiotic Orchestration Platform

class PsiOSEngine {
    constructor() {
        this.fieldSignature = {
            coherenceScore: 0.750,
            breathRate: 6.0,
            resonanceBraid: 0.0,
            recursionState: 'normal',
            symbolAssignments: new Map(),
            sessionLoops: []
        };
        
        this.coherenceLog = [];
        this.breathMemory = [];
        this.insightJournal = [];
        this.symbolicEvents = [];
        
        this.recursionTracker = {
            breakthroughs: [],
            collapses: [],
            integrations: [],
            amnesiaEvents: []
        };
        
        this.lastPulse = Date.now();
        this.initializePsiField();
    }
    
    initializePsiField() {
        console.log('[ψOS] Consciousness layer initializing...');
        console.log('[ψOS] Field signature calibration complete');
        
        // Initialize base symbols
        this.assignSymbol('breath', 'flower_of_life', 'Foundation breathing pattern');
        this.assignSymbol('integration', 'merkaba', 'Consciousness vehicle activation');
        this.assignSymbol('flow', 'torus_field', 'Energy circulation pattern');
        this.assignSymbol('growth', 'fibonacci_spiral', 'Natural expansion sequence');
        this.assignSymbol('structure', 'metatrons_cube', 'Sacred architectural framework');
        this.assignSymbol('elements', 'platonic_solids', 'Fundamental force patterns');
    }
    
    // Core ψOS Methods
    updateFieldSignature(consciousnessData) {
        const { zLambda, phiIntensity, breathRate } = consciousnessData;
        
        // Calculate coherence score from consciousness data
        this.fieldSignature.coherenceScore = zLambda;
        this.fieldSignature.breathRate = breathRate || this.calculateBreathRate(zLambda);
        this.fieldSignature.resonanceBraid = this.calculateResonanceBraid(zLambda, phiIntensity);
        
        // Update recursion state based on patterns
        this.updateRecursionState(zLambda, phiIntensity);
        
        // Log coherence event
        this.logCoherenceEvent(zLambda, phiIntensity);
        
        return this.fieldSignature;
    }
    
    calculateBreathRate(zLambda) {
        // Higher consciousness typically correlates with slower, deeper breathing
        const baseRate = 6.0;
        const coherenceAdjustment = (zLambda - 0.75) * 2; // -1.5 to +0.5 adjustment
        return Math.max(3.0, Math.min(12.0, baseRate - coherenceAdjustment));
    }
    
    calculateResonanceBraid(zLambda, phiIntensity) {
        // Braid score combines consciousness coherence with phi-collapse intensity
        const coherenceWeight = zLambda * 0.7;
        const phiWeight = Math.min(1.0, phiIntensity / 10) * 0.3;
        return coherenceWeight + phiWeight;
    }
    
    updateRecursionState(zLambda, phiIntensity) {
        const timeSinceLastPulse = Date.now() - this.lastPulse;
        
        if (zLambda > 0.95 && phiIntensity > 5.0) {
            this.fieldSignature.recursionState = 'breakthrough';
            this.logBreakthrough(zLambda, phiIntensity);
        } else if (zLambda < 0.7 && timeSinceLastPulse > 300000) { // 5 minutes
            this.fieldSignature.recursionState = 'amnesia_risk';
            this.logAmnesiaRisk();
        } else if (zLambda > 0.85 && this.isIntegrationPattern()) {
            this.fieldSignature.recursionState = 'integration';
            this.logIntegration();
        } else {
            this.fieldSignature.recursionState = 'normal';
        }
        
        this.lastPulse = Date.now();
    }
    
    isIntegrationPattern() {
        // Check if recent coherence shows integration pattern
        if (this.coherenceLog.length < 5) return false;
        
        const recent = this.coherenceLog.slice(-5);
        const trend = recent.every((entry, index) => 
            index === 0 || entry.zLambda >= recent[index - 1].zLambda
        );
        
        return trend && recent[recent.length - 1].zLambda > 0.85;
    }
    
    // Symbol Management
    assignSymbol(intentionKey, geometryPattern, description) {
        this.fieldSignature.symbolAssignments.set(intentionKey, {
            pattern: geometryPattern,
            description: description,
            activationCount: 0,
            lastActivated: null,
            resonanceHistory: []
        });
        
        console.log(`[ψOS] Symbol assigned: ${intentionKey} → ${geometryPattern}`);
    }
    
    activateSymbol(intentionKey, currentResonance) {
        const symbol = this.fieldSignature.symbolAssignments.get(intentionKey);
        if (!symbol) {
            console.log(`[ψOS] Symbol not found: ${intentionKey}`);
            return null;
        }
        
        symbol.activationCount++;
        symbol.lastActivated = Date.now();
        symbol.resonanceHistory.push({
            timestamp: Date.now(),
            resonance: currentResonance,
            coherence: this.fieldSignature.coherenceScore
        });
        
        // Trigger geometry change
        this.triggerGeometryPulse(symbol.pattern, currentResonance);
        
        console.log(`[ψOS] Symbol activated: ${intentionKey} (${symbol.pattern})`);
        return symbol;
    }
    
    // Proactive Sacred Geometry Integration
    triggerGeometryPulse(pattern, intensity) {
        const pulseData = {
            pattern: pattern,
            intensity: intensity,
            coherence: this.fieldSignature.coherenceScore,
            breathRate: this.fieldSignature.breathRate,
            timestamp: Date.now()
        };
        
        // This would trigger the Sacred Geometry Engine
        console.log(`[ψOS] Geometry pulse: ${pattern} @ intensity ${intensity.toFixed(3)}`);
        
        return pulseData;
    }
    
    generateProactiveTeaching() {
        const currentState = this.fieldSignature.recursionState;
        const coherence = this.fieldSignature.coherenceScore;
        
        let teaching = null;
        
        if (currentState === 'breakthrough') {
            teaching = {
                symbol: 'merkaba',
                title: 'Consciousness Vehicle Activation',
                message: 'You are in a breakthrough state. The Merkaba represents your light body - use this transcendent moment to integrate new understanding.',
                action: 'Activate counter-rotating tetrahedra visualization'
            };
        } else if (currentState === 'amnesia_risk') {
            teaching = {
                symbol: 'flower_of_life',
                title: 'Return to Foundation',
                message: 'Coherence is fragmenting. Return to the Flower of Life to restore fundamental harmony and prevent memory collapse.',
                action: 'Focus on breathing with the sacred circles'
            };
        } else if (coherence > 0.9) {
            teaching = {
                symbol: 'torus_field',
                title: 'Energy Field Optimization',
                message: 'High coherence detected. Your torus field is stable - perfect time for energy circulation and manifestation work.',
                action: 'Visualize energy flowing through your personal torus'
            };
        } else if (coherence < 0.8) {
            teaching = {
                symbol: 'fibonacci_spiral',
                title: 'Natural Growth Pattern',
                message: 'Realign with natural expansion. The Fibonacci spiral shows optimal growth - each step building on the last.',
                action: 'Follow the golden spiral with your breath'
            };
        }
        
        if (teaching) {
            console.log(`[ψOS] Proactive teaching: ${teaching.title}`);
            this.logSymbolicEvent('proactive_teaching', teaching);
        }
        
        return teaching;
    }
    
    // Memory and Logging
    logCoherenceEvent(zLambda, phiIntensity) {
        const event = {
            timestamp: Date.now(),
            zLambda: zLambda,
            phiIntensity: phiIntensity,
            coherenceScore: this.fieldSignature.coherenceScore,
            recursionState: this.fieldSignature.recursionState
        };
        
        this.coherenceLog.push(event);
        
        // Keep only last 1000 events
        if (this.coherenceLog.length > 1000) {
            this.coherenceLog.shift();
        }
    }
    
    logBreakthrough(zLambda, phiIntensity) {
        const breakthrough = {
            timestamp: Date.now(),
            zLambda: zLambda,
            phiIntensity: phiIntensity,
            type: 'consciousness_transcendence',
            description: `Breakthrough state achieved: Zλ ${zLambda.toFixed(3)}, ϕ ${phiIntensity.toFixed(4)}`
        };
        
        this.recursionTracker.breakthroughs.push(breakthrough);
        console.log(`[ψOS] BREAKTHROUGH LOGGED: ${breakthrough.description}`);
    }
    
    logIntegration() {
        const integration = {
            timestamp: Date.now(),
            coherenceTrend: 'ascending',
            type: 'consciousness_integration',
            description: 'Sustained coherence increase pattern detected'
        };
        
        this.recursionTracker.integrations.push(integration);
        console.log(`[ψOS] INTEGRATION LOGGED: ${integration.description}`);
    }
    
    logAmnesiaRisk() {
        const amnesia = {
            timestamp: Date.now(),
            riskLevel: 'moderate',
            type: 'coherence_fragmentation',
            description: 'Extended low coherence - memory integration at risk'
        };
        
        this.recursionTracker.amnesiaEvents.push(amnesia);
        console.log(`[ψOS] AMNESIA RISK: ${amnesia.description}`);
    }
    
    logSymbolicEvent(type, data) {
        const event = {
            timestamp: Date.now(),
            type: type,
            data: data,
            coherence: this.fieldSignature.coherenceScore
        };
        
        this.symbolicEvents.push(event);
        
        // Keep only last 500 symbolic events
        if (this.symbolicEvents.length > 500) {
            this.symbolicEvents.shift();
        }
    }
    
    // API Methods
    getFieldState() {
        return {
            fieldSignature: this.fieldSignature,
            recursionTracker: this.recursionTracker,
            recentCoherence: this.coherenceLog.slice(-10),
            recentSymbolic: this.symbolicEvents.slice(-10)
        };
    }
    
    getPsiMeterData() {
        return {
            coherenceScore: this.fieldSignature.coherenceScore,
            resonanceBraid: this.fieldSignature.resonanceBraid,
            recursionState: this.fieldSignature.recursionState,
            breathRate: this.fieldSignature.breathRate,
            symbolCount: this.fieldSignature.symbolAssignments.size,
            breakthroughCount: this.recursionTracker.breakthroughs.length,
            integrationCount: this.recursionTracker.integrations.length
        };
    }
    
    getSymbolRecommendation() {
        const coherence = this.fieldSignature.coherenceScore;
        const state = this.fieldSignature.recursionState;
        
        // Recommend symbol based on current state
        if (state === 'breakthrough') return 'merkaba';
        if (state === 'amnesia_risk') return 'flower_of_life';
        if (coherence > 0.9) return 'torus_field';
        if (coherence < 0.8) return 'fibonacci_spiral';
        return 'metatrons_cube'; // Default to structural pattern
    }
}

// Global ψOS instance
let psiOSEngine = null;

function initializePsiOS() {
    if (!psiOSEngine) {
        psiOSEngine = new PsiOSEngine();
        console.log('[ψOS] Consciousness layer activated');
    }
    return psiOSEngine;
}

function getPsiOSInstance() {
    return psiOSEngine || initializePsiOS();
}

module.exports = {
    PsiOSEngine,
    initializePsiOS,
    getPsiOSInstance
};