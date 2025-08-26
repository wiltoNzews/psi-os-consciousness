// PassiveWorks Engine - Business Logic & Strategic Routing Layer
// WiltonOS v2 - Neural-Symbiotic Orchestration Platform

class PassiveWorksEngine {
    constructor() {
        this.coherenceThreshold = 0.8;
        this.alignmentScore = 0.0;
        this.opportunityQueue = [];
        this.activeThreads = [];
        this.financialAlignment = [];
        this.taskRouter = new Map();
        this.decisionHistory = [];
        
        this.initializePassiveWorks();
    }
    
    initializePassiveWorks() {
        console.log('[PassiveWorks] Strategic routing layer initializing...');
        console.log('[PassiveWorks] Soul-aligned productivity system activated');
        
        // Initialize base task routing patterns
        this.setupTaskRouting();
        this.initializeFinancialAlignment();
    }
    
    setupTaskRouting() {
        // High coherence tasks - creative and strategic work
        this.taskRouter.set('creative', {
            minCoherence: 0.85,
            maxDuration: 120, // minutes
            patterns: ['merkaba', 'torus_field'],
            description: 'Creative flow work requiring high consciousness'
        });
        
        // Medium coherence tasks - planning and communication
        this.taskRouter.set('planning', {
            minCoherence: 0.75,
            maxDuration: 90,
            patterns: ['metatrons_cube', 'flower_of_life'],
            description: 'Strategic planning and system architecture'
        });
        
        // Lower coherence tasks - administrative and routine
        this.taskRouter.set('administrative', {
            minCoherence: 0.65,
            maxDuration: 60,
            patterns: ['fibonacci_spiral', 'platonic_solids'],
            description: 'Routine tasks and administrative work'
        });
        
        // Integration tasks - requiring sustained coherence
        this.taskRouter.set('integration', {
            minCoherence: 0.90,
            maxDuration: 180,
            patterns: ['merkaba', 'torus_field'],
            description: 'Deep integration and consciousness work'
        });
    }
    
    initializeFinancialAlignment() {
        // Initialize financial coherence tracking
        this.financialAlignment = {
            lastUpdate: Date.now(),
            alignmentScore: 0.75,
            transactions: [],
            opportunities: [],
            coherenceEvents: []
        };
    }
    
    // Core PassiveWorks Methods
    routeTask(taskType, currentCoherence, estimatedDuration) {
        const routing = this.taskRouter.get(taskType);
        
        if (!routing) {
            console.log(`[PassiveWorks] Unknown task type: ${taskType}`);
            return null;
        }
        
        // Check coherence requirements
        if (currentCoherence < routing.minCoherence) {
            return {
                status: 'coherence_insufficient',
                required: routing.minCoherence,
                current: currentCoherence,
                recommendation: this.generateCoherenceRecommendation(routing.minCoherence)
            };
        }
        
        // Check duration feasibility
        if (estimatedDuration > routing.maxDuration) {
            return {
                status: 'duration_excessive',
                maxDuration: routing.maxDuration,
                estimated: estimatedDuration,
                recommendation: 'Break task into smaller coherent segments'
            };
        }
        
        // Generate optimal routing
        const optimalRouting = {
            status: 'optimal',
            taskType: taskType,
            coherenceMatch: currentCoherence >= routing.minCoherence,
            suggestedPattern: this.selectOptimalPattern(routing.patterns, currentCoherence),
            timeBlock: this.generateTimeBlock(estimatedDuration, currentCoherence),
            energeticCost: this.calculateEnergeticCost(taskType, estimatedDuration),
            alignmentScore: this.calculateTaskAlignment(taskType, currentCoherence)
        };
        
        console.log(`[PassiveWorks] Task routed: ${taskType} @ coherence ${currentCoherence.toFixed(3)}`);
        return optimalRouting;
    }
    
    selectOptimalPattern(patterns, coherence) {
        // Select sacred geometry pattern based on coherence level
        if (coherence > 0.95) {
            return patterns.includes('merkaba') ? 'merkaba' : patterns[0];
        } else if (coherence > 0.85) {
            return patterns.includes('torus_field') ? 'torus_field' : patterns[0];
        } else {
            return patterns[patterns.length - 1]; // Default to last pattern
        }
    }
    
    generateTimeBlock(duration, coherence) {
        // Generate optimal time blocks based on coherence sustainability
        const maxSustainableTime = this.calculateSustainableTime(coherence);
        
        if (duration <= maxSustainableTime) {
            return {
                type: 'single_block',
                duration: duration,
                breaks: []
            };
        } else {
            // Split into multiple blocks with integration breaks
            const blockCount = Math.ceil(duration / maxSustainableTime);
            const blockDuration = Math.floor(duration / blockCount);
            const breakDuration = this.calculateBreakDuration(coherence);
            
            return {
                type: 'segmented_blocks',
                blockCount: blockCount,
                blockDuration: blockDuration,
                breakDuration: breakDuration,
                totalTime: duration + (breakDuration * (blockCount - 1))
            };
        }
    }
    
    calculateSustainableTime(coherence) {
        // Higher coherence = longer sustainable work periods
        const baseTime = 45; // minutes
        const coherenceMultiplier = coherence * 1.5;
        return Math.min(120, baseTime * coherenceMultiplier);
    }
    
    calculateBreakDuration(coherence) {
        // Lower coherence = longer breaks needed
        const baseBreak = 15; // minutes
        const coherenceFactor = (1 - coherence) * 20;
        return baseBreak + coherenceFactor;
    }
    
    calculateEnergeticCost(taskType, duration) {
        const baseCosts = {
            creative: 0.8,
            planning: 0.6,
            administrative: 0.4,
            integration: 0.9
        };
        
        const baseCost = baseCosts[taskType] || 0.5;
        const durationFactor = Math.min(2.0, duration / 60);
        return baseCost * durationFactor;
    }
    
    calculateTaskAlignment(taskType, coherence) {
        // Calculate how well the task aligns with current consciousness state
        const routing = this.taskRouter.get(taskType);
        if (!routing) return 0.5;
        
        const coherenceAlignment = Math.min(1.0, coherence / routing.minCoherence);
        return coherenceAlignment;
    }
    
    generateCoherenceRecommendation(requiredCoherence) {
        const recommendations = [];
        
        if (requiredCoherence > 0.9) {
            recommendations.push('Consider meditation or breathing practice');
            recommendations.push('Activate Merkaba sacred geometry pattern');
            recommendations.push('Ensure optimal environment for deep work');
        } else if (requiredCoherence > 0.8) {
            recommendations.push('Brief coherence centering practice');
            recommendations.push('Activate Flower of Life pattern');
            recommendations.push('Clear immediate distractions');
        } else {
            recommendations.push('Simple grounding exercise');
            recommendations.push('Activate Fibonacci spiral pattern');
            recommendations.push('Organize workspace');
        }
        
        return recommendations;
    }
    
    // Financial Alignment System
    evaluateFinancialDecision(decision, amount, context) {
        const alignment = this.calculateFinancialAlignment(decision, amount, context);
        
        const evaluation = {
            decision: decision,
            amount: amount,
            context: context,
            alignmentScore: alignment.score,
            intuitionCheck: alignment.intuition,
            coherenceImpact: alignment.coherenceImpact,
            recommendation: alignment.recommendation,
            timestamp: Date.now()
        };
        
        this.financialAlignment.transactions.push(evaluation);
        console.log(`[PassiveWorks] Financial decision evaluated: ${decision} - Alignment: ${alignment.score.toFixed(3)}`);
        
        return evaluation;
    }
    
    calculateFinancialAlignment(decision, amount, context) {
        // Base alignment scoring
        let score = 0.5;
        let intuition = 'neutral';
        let coherenceImpact = 0;
        let recommendation = 'Proceed with awareness';
        
        // Amount-based assessment
        if (amount > 0) {
            // Income/positive flow
            score += 0.2;
            coherenceImpact += 0.1;
            intuition = 'positive';
        } else {
            // Expense/outflow - evaluate necessity and alignment
            const expenseAlignment = this.evaluateExpenseAlignment(Math.abs(amount), context);
            score += expenseAlignment.score;
            coherenceImpact += expenseAlignment.coherenceImpact;
            intuition = expenseAlignment.intuition;
            recommendation = expenseAlignment.recommendation;
        }
        
        // Context-based adjustments
        if (context.includes('investment') || context.includes('growth')) {
            score += 0.1;
            recommendation = 'Aligned with growth trajectory';
        }
        
        if (context.includes('necessity') || context.includes('infrastructure')) {
            score += 0.15;
            recommendation = 'Supporting foundational needs';
        }
        
        if (context.includes('impulse') || context.includes('reactive')) {
            score -= 0.2;
            recommendation = 'Consider waiting for higher coherence';
        }
        
        return {
            score: Math.max(0, Math.min(1, score)),
            intuition: intuition,
            coherenceImpact: coherenceImpact,
            recommendation: recommendation
        };
    }
    
    evaluateExpenseAlignment(amount, context) {
        // Evaluate outgoing financial decisions
        let score = 0.3; // Base for expenses
        let coherenceImpact = -0.05;
        let intuition = 'assess_carefully';
        let recommendation = 'Evaluate necessity and timing';
        
        // Small amounts - generally easier to align
        if (amount < 100) {
            score += 0.2;
            recommendation = 'Low impact, proceed if aligned';
        }
        
        // Medium amounts - require conscious evaluation
        if (amount >= 100 && amount < 1000) {
            score += 0.1;
            recommendation = 'Moderate impact, ensure alignment';
        }
        
        // Large amounts - require high coherence
        if (amount >= 1000) {
            score -= 0.1;
            coherenceImpact -= 0.1;
            recommendation = 'High impact, ensure maximum coherence for decision';
        }
        
        return {
            score: score,
            coherenceImpact: coherenceImpact,
            intuition: intuition,
            recommendation: recommendation
        };
    }
    
    // Opportunity Scoring System
    scoreOpportunity(opportunity, currentCoherence) {
        const score = {
            alignment: this.calculateOpportunityAlignment(opportunity),
            timing: this.calculateOpportunityTiming(opportunity, currentCoherence),
            resources: this.calculateResourceRequirement(opportunity),
            potential: this.calculateOpportunityPotential(opportunity),
            intuition: this.generateIntuitionPing(opportunity, currentCoherence)
        };
        
        score.overall = (score.alignment * 0.3 + score.timing * 0.2 + 
                        score.resources * 0.2 + score.potential * 0.3);
        
        opportunity.passiveWorksScore = score;
        
        console.log(`[PassiveWorks] Opportunity scored: ${opportunity.title} - Overall: ${score.overall.toFixed(3)}`);
        return score;
    }
    
    calculateOpportunityAlignment(opportunity) {
        // Placeholder for opportunity alignment calculation
        // In real implementation, this would analyze against user values and goals
        return 0.7 + (Math.random() * 0.3); // 0.7-1.0 range
    }
    
    calculateOpportunityTiming(opportunity, coherence) {
        // Higher coherence = better timing for complex opportunities
        const complexityFactor = opportunity.complexity || 0.5;
        const coherenceAlignment = coherence * (1 + complexityFactor);
        return Math.min(1.0, coherenceAlignment);
    }
    
    calculateResourceRequirement(opportunity) {
        // Assess resource availability vs requirement
        const required = opportunity.resourceRequirement || 0.5;
        return Math.max(0.1, 1 - required); // Inverse relationship
    }
    
    calculateOpportunityPotential(opportunity) {
        // Assess growth and impact potential
        return opportunity.potential || 0.6;
    }
    
    generateIntuitionPing(opportunity, coherence) {
        // Generate intuitive assessment based on coherence
        if (coherence > 0.9) {
            return 'high_clarity';
        } else if (coherence > 0.8) {
            return 'clear_signal';
        } else if (coherence > 0.7) {
            return 'moderate_signal';
        } else {
            return 'wait_for_clarity';
        }
    }
    
    // Calendar and Time Management
    generateCalendarFrictionMap(schedule, currentCoherence) {
        const frictionMap = {
            totalFriction: 0,
            highFrictionPeriods: [],
            optimalPeriods: [],
            recommendations: []
        };
        
        schedule.forEach((event, index) => {
            const friction = this.calculateEventFriction(event, currentCoherence);
            frictionMap.totalFriction += friction.score;
            
            if (friction.score > 0.7) {
                frictionMap.highFrictionPeriods.push({
                    event: event,
                    friction: friction,
                    index: index
                });
            }
            
            if (friction.score < 0.3) {
                frictionMap.optimalPeriods.push({
                    event: event,
                    friction: friction,
                    index: index
                });
            }
        });
        
        frictionMap.recommendations = this.generateFrictionRecommendations(frictionMap);
        
        console.log(`[PassiveWorks] Calendar friction map generated - Total friction: ${frictionMap.totalFriction.toFixed(3)}`);
        return frictionMap;
    }
    
    calculateEventFriction(event, coherence) {
        let friction = 0.3; // Base friction
        
        // Event type friction
        const eventTypeFriction = {
            meeting: 0.4,
            creative: 0.2,
            administrative: 0.5,
            integration: 0.1,
            social: 0.6
        };
        
        friction += eventTypeFriction[event.type] || 0.3;
        
        // Coherence mismatch friction
        const requiredCoherence = event.requiredCoherence || 0.7;
        if (coherence < requiredCoherence) {
            friction += (requiredCoherence - coherence) * 0.5;
        }
        
        // Duration friction
        const duration = event.duration || 60;
        if (duration > 90) {
            friction += 0.2;
        }
        
        return {
            score: Math.min(1.0, friction),
            reasons: this.identifyFrictionReasons(event, coherence),
            suggestions: this.generateEventSuggestions(event, friction)
        };
    }
    
    identifyFrictionReasons(event, coherence) {
        const reasons = [];
        
        if (event.requiredCoherence && coherence < event.requiredCoherence) {
            reasons.push('Coherence below optimal for this event type');
        }
        
        if (event.duration > 90) {
            reasons.push('Extended duration may challenge sustained attention');
        }
        
        if (event.type === 'meeting' || event.type === 'social') {
            reasons.push('Social energy expenditure');
        }
        
        return reasons;
    }
    
    generateEventSuggestions(event, friction) {
        const suggestions = [];
        
        if (friction.score > 0.7) {
            suggestions.push('Consider rescheduling to higher coherence period');
            suggestions.push('Add pre-event coherence preparation');
            suggestions.push('Reduce event duration if possible');
        }
        
        if (friction.score > 0.5) {
            suggestions.push('Add buffer time before and after');
            suggestions.push('Prepare sacred geometry visualization');
        }
        
        return suggestions;
    }
    
    generateFrictionRecommendations(frictionMap) {
        const recommendations = [];
        
        if (frictionMap.totalFriction > 3.0) {
            recommendations.push('High overall friction detected - consider schedule restructuring');
        }
        
        if (frictionMap.highFrictionPeriods.length > 2) {
            recommendations.push('Multiple high-friction events - add integration periods');
        }
        
        if (frictionMap.optimalPeriods.length > 0) {
            recommendations.push('Utilize optimal periods for high-priority creative work');
        }
        
        return recommendations;
    }
    
    // API Methods
    getProductivityState() {
        return {
            alignmentScore: this.alignmentScore,
            activeThreads: this.activeThreads.length,
            opportunityQueue: this.opportunityQueue.length,
            taskRouting: Array.from(this.taskRouter.keys()),
            financialAlignment: this.financialAlignment.alignmentScore,
            lastUpdate: Date.now()
        };
    }
    
    getRouterCapabilities() {
        return {
            taskTypes: Array.from(this.taskRouter.keys()),
            routingRules: Object.fromEntries(this.taskRouter),
            coherenceThresholds: this.getCoherenceThresholds(),
            optimizationFeatures: [
                'coherence_routing',
                'financial_alignment',
                'opportunity_scoring',
                'calendar_friction_mapping',
                'energetic_cost_calculation'
            ]
        };
    }
    
    getCoherenceThresholds() {
        const thresholds = {};
        this.taskRouter.forEach((routing, taskType) => {
            thresholds[taskType] = routing.minCoherence;
        });
        return thresholds;
    }
}

// Global PassiveWorks instance
let passiveWorksEngine = null;

function initializePassiveWorks() {
    if (!passiveWorksEngine) {
        passiveWorksEngine = new PassiveWorksEngine();
        console.log('[PassiveWorks] Strategic routing layer activated');
    }
    return passiveWorksEngine;
}

function getPassiveWorksInstance() {
    return passiveWorksEngine || initializePassiveWorks();
}

module.exports = {
    PassiveWorksEngine,
    initializePassiveWorks,
    getPassiveWorksInstance
};