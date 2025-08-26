/**
 * Meta-Cognitive Engine
 * 
 * This service implements the Meta-Cognitive Engine that analyzes system patterns,
 * detects emergent behaviors, and generates Meta-Cognitive Events based on the QCTF Framework.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { QuantumGlossary } from '../qrn/quantum-glossary.js';
import { MetaCognitiveEvent, createMetaCognitiveEvent, InsertMetaCognitiveEvent } from '../../../shared/schema-minimal.js';
import { QCTFData } from '../../../shared/qctf.js';

const quantumGlossary = new QuantumGlossary();

// Define types for meta-cognitive event patterns and rules
export interface PatternRule {
  id: string;
  name: string;
  description: string;
  condition: (data: any, context: EngineContext) => boolean;
  confidence: number;
  impact: number;
  eventType: string;
  eventGenerator: (data: any, context: EngineContext) => InsertMetaCognitiveEvent;
}

export interface EngineContext {
  recentEvents: MetaCognitiveEvent[];
  qctfData: QCTFData | null;
  systemState: Record<string, any>;
  patternFrequency: Map<string, number>;
  temporalState: {
    currentCycle: number;
    lastUpdated: Date;
    historyLength: number;
  };
}

export interface StateChangeDetection {
  pattern: string;
  previousState: any;
  currentState: any;
  detectedAt: Date;
  magnitude: number;
  hasThresholdCrossing: boolean;
}

export interface EventMetadata {
  originatingPattern?: string;
  relatedPatterns?: string[];
  confidence: number;
  impact: number;
  systemCoherence?: number;
  cycleReference?: number;
}

/**
 * Meta-Cognitive Engine core class
 * Analyzes system state and generates meta-cognitive insights
 */
export class MetaCognitiveEngine {
  private patternRules: PatternRule[] = [];
  private context: EngineContext;
  private storage: any; // This would be initialized with the proper storage interface

  constructor(storage: any) {
    this.storage = storage;
    
    // Initialize context
    this.context = {
      recentEvents: [],
      qctfData: null,
      systemState: {},
      patternFrequency: new Map<string, number>(),
      temporalState: {
        currentCycle: 0,
        lastUpdated: new Date(),
        historyLength: 100 // Default history window
      }
    };
    
    // Register default pattern rules
    this.registerDefaultPatterns();
    
    // Log initialization
    quantumGlossary.tagWithContext('[META-COGNITIVE] Engine initialized with core pattern detection');
  }
  
  /**
   * Register a new pattern rule
   * 
   * @param rule - Pattern rule to register
   */
  public registerPatternRule(rule: PatternRule): void {
    const existingIndex = this.patternRules.findIndex(r => r.id === rule.id);
    if (existingIndex >= 0) {
      this.patternRules[existingIndex] = rule;
    } else {
      this.patternRules.push(rule);
    }
    
    quantumGlossary.tagWithContext(`[META-COGNITIVE] Registered pattern rule: ${rule.name}`);
  }
  
  /**
   * Update the engine with new system state
   * 
   * @param qctfData - Current QCTF data
   * @param systemState - Current system state snapshot
   * @param cycle - Current processing cycle number
   * @returns Array of newly generated events
   */
  public async update(
    qctfData: QCTFData | null, 
    systemState: Record<string, any>, 
    cycle: number
  ): Promise<MetaCognitiveEvent[]> {
    try {
      // Update context
      this.context.qctfData = qctfData;
      this.context.systemState = systemState;
      this.context.temporalState.currentCycle = cycle;
      this.context.temporalState.lastUpdated = new Date();
      
      // Evaluate all pattern rules
      const generatedEvents: MetaCognitiveEvent[] = [];
      
      for (const rule of this.patternRules) {
        try {
          // Check if rule condition is met
          if (rule.condition(systemState, this.context)) {
            // Generate event data
            const eventData = rule.eventGenerator(systemState, this.context);
            
            // Create event
            const event = createMetaCognitiveEvent({
              ...eventData,
              confidence: rule.confidence,
              impact: rule.impact
            });
            
            // Store event in database
            if (this.storage) {
              await this.storage.createMetaCognitiveEvent(eventData);
            }
            
            // Add to results
            generatedEvents.push(event);
            
            // Update pattern frequency
            this.incrementPatternFrequency(rule.id);
            
            // Log event generation
            quantumGlossary.tagWithContext(
              `[META-COGNITIVE] Generated event: ${event.type} (${event.id})`
            );
          }
        } catch (ruleError) {
          quantumGlossary.logError(`Error evaluating rule ${rule.id}: ${rule.name}`, ruleError as Error);
        }
      }
      
      // Update recent events list (maintain limited history)
      this.context.recentEvents = [
        ...generatedEvents,
        ...this.context.recentEvents
      ].slice(0, this.context.temporalState.historyLength);
      
      return generatedEvents;
    } catch (error) {
      quantumGlossary.logError('Error in meta-cognitive engine update', error as Error);
      return [];
    }
  }
  
  /**
   * Detect changes in system state based on a given threshold
   * 
   * @param previousState - Previous state for comparison
   * @param currentState - Current state to evaluate
   * @param thresholds - Thresholds for various metrics
   * @returns Array of state change detections
   */
  public detectStateChanges(
    previousState: any,
    currentState: any,
    thresholds: Record<string, number> = {}
  ): StateChangeDetection[] {
    const detections: StateChangeDetection[] = [];
    const now = new Date();
    
    // Check QCTF threshold crossing if available
    if (previousState.qctf !== undefined && currentState.qctf !== undefined) {
      const qctfThreshold = thresholds.qctf || 0.05; // Default 5% change threshold
      const qctfChange = Math.abs(currentState.qctf - previousState.qctf);
      const qctfMagnitude = qctfChange / (previousState.qctf || 0.01); // Avoid division by zero
      
      if (qctfMagnitude >= qctfThreshold) {
        detections.push({
          pattern: 'qctf_threshold_crossing',
          previousState: { qctf: previousState.qctf },
          currentState: { qctf: currentState.qctf },
          detectedAt: now,
          magnitude: qctfMagnitude,
          hasThresholdCrossing: true
        });
      }
    }
    
    // Check coherence threshold crossing if available
    if (previousState.coherence !== undefined && currentState.coherence !== undefined) {
      const coherenceThreshold = thresholds.coherence || 0.1; // Default 10% change threshold
      const coherenceChange = Math.abs(currentState.coherence - previousState.coherence);
      const coherenceMagnitude = coherenceChange / (previousState.coherence || 0.01);
      
      if (coherenceMagnitude >= coherenceThreshold) {
        detections.push({
          pattern: 'coherence_threshold_crossing',
          previousState: { coherence: previousState.coherence },
          currentState: { coherence: currentState.coherence },
          detectedAt: now,
          magnitude: coherenceMagnitude,
          hasThresholdCrossing: true
        });
      }
    }
    
    return detections;
  }
  
  /**
   * Identify potential breakthroughs in the system's cognitive state
   * 
   * @param recentEvents - Recent meta-cognitive events
   * @param windowSize - Number of events to analyze
   * @returns Potential breakthrough events
   */
  public identifyBreakthroughs(
    recentEvents: MetaCognitiveEvent[] = this.context.recentEvents,
    windowSize: number = 20
  ): MetaCognitiveEvent[] {
    // Track potential breakthroughs
    const breakthroughs: MetaCognitiveEvent[] = [];
    
    // We need at least a few events to identify patterns
    if (recentEvents.length < 5) return breakthroughs;
    
    // Limit to window size
    const events = recentEvents.slice(0, windowSize);
    
    // Get event type frequency
    const typeFrequency = new Map<string, number>();
    for (const event of events) {
      const count = typeFrequency.get(event.type) || 0;
      typeFrequency.set(event.type, count + 1);
    }
    
    // Check for novel patterns (types that have only appeared recently)
    for (const [type, count] of typeFrequency.entries()) {
      // Novel pattern: occurred very recently for the first time
      const isFirstOccurrence = count === 1 && events[0].type === type;
      
      // Breakthrough pattern: sudden increase in frequency
      const recentCount = events.slice(0, 5).filter(e => e.type === type).length;
      const olderCount = events.slice(5).filter(e => e.type === type).length;
      const isFrequencySpike = recentCount > olderCount * 2; // At least double frequency
      
      if (isFirstOccurrence || isFrequencySpike) {
        // Create breakthrough event
        const breakthrough = createMetaCognitiveEvent({
          type: 'cognitive_breakthrough',
          description: `Detected ${isFirstOccurrence ? 'novel pattern' : 'frequency spike'} in event type: ${type}`,
          details: {
            patternType: type,
            isFirstOccurrence,
            isFrequencySpike,
            recentCount,
            olderCount,
            totalHistoricalCount: count
          },
          confidence: 0.8,
          impact: 0.7,
          sourceContext: 'meta_cognitive_engine'
        });
        
        breakthroughs.push(breakthrough);
      }
    }
    
    return breakthroughs;
  }
  
  /**
   * Find correlated meta-cognitive events 
   * 
   * @param targetEvent - Event to find correlations for
   * @param depth - How many levels of correlation to compute
   * @returns Correlated events array
   */
  public findCorrelatedEvents(
    targetEvent: MetaCognitiveEvent,
    depth: number = 1
  ): MetaCognitiveEvent[] {
    const correlated: MetaCognitiveEvent[] = [];
    const processed = new Set<string>();
    
    // Skip if no events to analyze
    if (this.context.recentEvents.length === 0) return correlated;
    
    // Helper function for recursive correlation
    const findCorrelations = (event: MetaCognitiveEvent, currentDepth: number) => {
      if (currentDepth > depth || processed.has(event.id)) return;
      
      processed.add(event.id);
      
      // Find events that might be correlated (same type, close in time, etc.)
      for (const candidateEvent of this.context.recentEvents) {
        // Skip self-comparison
        if (candidateEvent.id === event.id) continue;
        
        // Skip already processed
        if (processed.has(candidateEvent.id)) continue;
        
        // Check for type correlation
        const sameType = candidateEvent.type === event.type;
        
        // Check for time proximity (events within 10 seconds)
        const timeA = new Date(event.createdAt).getTime();
        const timeB = new Date(candidateEvent.createdAt).getTime();
        const closeInTime = Math.abs(timeA - timeB) < 10000; // 10 seconds
        
        // Check for shared source context
        const sharedContext = 
          event.sourceContext && 
          candidateEvent.sourceContext && 
          event.sourceContext === candidateEvent.sourceContext;
        
        // Check for related events reference
        const isReferenced = 
          event.relatedEvents?.includes(candidateEvent.id) || 
          candidateEvent.relatedEvents?.includes(event.id);
        
        // If correlated, add to results and recurse
        if (sameType || closeInTime || sharedContext || isReferenced) {
          correlated.push(candidateEvent);
          
          // Recurse if we haven't reached max depth
          if (currentDepth < depth) {
            findCorrelations(candidateEvent, currentDepth + 1);
          }
        }
      }
    };
    
    // Start recursive search
    findCorrelations(targetEvent, 1);
    
    return correlated;
  }
  
  /**
   * Register default pattern rules for the engine
   * These rules detect common patterns and generate appropriate events
   */
  private registerDefaultPatterns(): void {
    // Coherence attractor pattern detection
    this.registerPatternRule({
      id: 'coherence_attractor_detection',
      name: 'Coherence Attractor Detection',
      description: 'Detects when system coherence returns to the 0.75 attractor state',
      confidence: 0.85,
      impact: 0.6,
      eventType: 'coherence_attractor_return',
      condition: (data: any, context: EngineContext) => {
        // Check if QCTF data is available
        if (!context.qctfData) return false;
        
        // Check for any prior QCTF history entries
        if (!context.qctfData.history || context.qctfData.history.length < 2) return false;
        
        // Get current CI value
        const currentCI = context.qctfData.ci;
        
        // Check if we're near the 0.75 attractor
        const isNearAttractor = Math.abs(currentCI - 0.75) < 0.01;
        
        // Get previous value from history
        const previousValue = context.qctfData.history[1].qctf;
        const currentValue = context.qctfData.history[0].qctf;
        
        // Check if we moved closer to 0.75 from a more distant state
        const wasFarther = Math.abs(previousValue - 0.75) > Math.abs(currentValue - 0.75);
        
        // Return true if we're returning to the attractor state
        return isNearAttractor && wasFarther;
      },
      eventGenerator: (data: any, context: EngineContext) => {
        if (!context.qctfData) {
          throw new Error('QCTF data is required for this event generation');
        }
        
        const currentCI = context.qctfData.ci;
        const distanceToAttractor = Math.abs(currentCI - 0.75);
        
        return {
          type: 'coherence_attractor_return',
          description: `System coherence returning to 0.75 attractor state (current: ${currentCI.toFixed(4)})`,
          details: {
            currentCoherence: currentCI,
            distanceToAttractor,
            attractorValue: 0.75,
            qctf: context.qctfData.history[0].qctf
          },
          sourceContext: 'meta_cognitive_engine'
        };
      }
    });
    
    // Coherence fracture pattern detection
    this.registerPatternRule({
      id: 'coherence_fracture_detection',
      name: 'Coherence Fracture Detection',
      description: 'Detects when system coherence suddenly drops, indicating a fracture',
      confidence: 0.8,
      impact: 0.75,
      eventType: 'coherence_fracture',
      condition: (data: any, context: EngineContext) => {
        // Check if QCTF data is available
        if (!context.qctfData) return false;
        
        // Check for any prior QCTF history entries
        if (!context.qctfData.history || context.qctfData.history.length < 3) return false;
        
        // Get recent coherence values
        const recentValues = context.qctfData.history.slice(0, 3).map(h => h.qctf);
        
        // Calculate deltas
        const currentDelta = recentValues[0] - recentValues[1];
        const previousDelta = recentValues[1] - recentValues[2];
        
        // Detect sudden drop in coherence (negative delta that's twice as large as previous)
        return (
          currentDelta < -0.1 && // At least 10% drop
          currentDelta < previousDelta * 2 // At least twice the rate of previous change
        );
      },
      eventGenerator: (data: any, context: EngineContext) => {
        if (!context.qctfData) {
          throw new Error('QCTF data is required for this event generation');
        }
        
        const recentValues = context.qctfData.history.slice(0, 3).map(h => h.qctf);
        const currentDelta = recentValues[0] - recentValues[1];
        const previousDelta = recentValues[1] - recentValues[2];
        
        return {
          type: 'coherence_fracture',
          description: `Detected sudden coherence drop: ${Math.abs(currentDelta).toFixed(4)} (${(currentDelta * 100).toFixed(1)}%)`,
          details: {
            currentValue: recentValues[0],
            previousValue: recentValues[1],
            deltaMagnitude: Math.abs(currentDelta),
            deltaPercentage: currentDelta / recentValues[1],
            previousDelta,
            ratioOfChange: currentDelta / previousDelta
          },
          sourceContext: 'meta_cognitive_engine'
        };
      }
    });
    
    // Golden ratio oscillation detection
    this.registerPatternRule({
      id: 'golden_ratio_oscillation',
      name: 'Golden Ratio Oscillation',
      description: 'Detects when system oscillates in a pattern approaching the golden ratio (1.618)',
      confidence: 0.7,
      impact: 0.5,
      eventType: 'golden_ratio_resonance',
      condition: (data: any, context: EngineContext) => {
        // Check if QCTF data is available
        if (!context.qctfData) return false;
        
        // Need at least 5 data points for meaningful oscillation detection
        if (!context.qctfData.history || context.qctfData.history.length < 5) return false;
        
        // Extract values for analysis
        const values = context.qctfData.history.slice(0, 5).map(h => h.qctf);
        
        // Find local maxima and minima
        const extrema = [];
        for (let i = 1; i < values.length - 1; i++) {
          if ((values[i] > values[i-1] && values[i] > values[i+1]) || 
              (values[i] < values[i-1] && values[i] < values[i+1])) {
            extrema.push(values[i]);
          }
        }
        
        // Need at least 2 extrema to calculate a ratio
        if (extrema.length < 2) return false;
        
        // Calculate ratios between consecutive extrema
        const ratios = [];
        for (let i = 0; i < extrema.length - 1; i++) {
          const ratio = Math.max(extrema[i], extrema[i+1]) / Math.min(extrema[i], extrema[i+1]);
          ratios.push(ratio);
        }
        
        // Check if any ratio is close to golden ratio (1.618)
        const GOLDEN_RATIO = 1.618;
        const isGoldenRatioDetected = ratios.some(ratio => 
          Math.abs(ratio - GOLDEN_RATIO) < 0.1
        );
        
        return isGoldenRatioDetected;
      },
      eventGenerator: (data: any, context: EngineContext) => {
        if (!context.qctfData) {
          throw new Error('QCTF data is required for this event generation');
        }
        
        // Extract values for reporting
        const values = context.qctfData.history.slice(0, 5).map(h => h.qctf);
        
        // Find local maxima and minima
        const extrema = [];
        for (let i = 1; i < values.length - 1; i++) {
          if ((values[i] > values[i-1] && values[i] > values[i+1]) || 
              (values[i] < values[i-1] && values[i] < values[i+1])) {
            extrema.push(values[i]);
          }
        }
        
        // Calculate ratios between consecutive extrema
        const ratios = [];
        for (let i = 0; i < extrema.length - 1; i++) {
          const ratio = Math.max(extrema[i], extrema[i+1]) / Math.min(extrema[i], extrema[i+1]);
          ratios.push(ratio);
        }
        
        // Find ratio closest to golden ratio
        const GOLDEN_RATIO = 1.618;
        let closestRatio = ratios[0] || 0;
        let minDifference = Math.abs(closestRatio - GOLDEN_RATIO);
        
        for (const ratio of ratios) {
          const difference = Math.abs(ratio - GOLDEN_RATIO);
          if (difference < minDifference) {
            minDifference = difference;
            closestRatio = ratio;
          }
        }
        
        return {
          type: 'golden_ratio_resonance',
          description: `Detected golden ratio oscillation pattern (ratio: ${closestRatio.toFixed(4)})`,
          details: {
            detectedRatio: closestRatio,
            proximityToGoldenRatio: minDifference,
            goldenRatio: GOLDEN_RATIO,
            extremaValues: extrema,
            recentValues: values
          },
          sourceContext: 'meta_cognitive_engine'
        };
      }
    });
    
    // 0.75/0.25 ratio detection (3:1 ratio fundamental to the framework)
    this.registerPatternRule({
      id: 'fundamental_ratio_detection',
      name: 'Fundamental Ratio Detection',
      description: 'Detects the emergence of the fundamental 3:1 ratio (0.75/0.25) in system dynamics',
      confidence: 0.9,
      impact: 0.8,
      eventType: 'fundamental_ratio_emergence',
      condition: (data: any, context: EngineContext) => {
        // Check for necessary components
        if (!context.qctfData || !context.systemState) return false;
        
        // Check if we have modules data in system state
        if (!context.systemState.modules) return false;
        
        // Get module metrics if available
        const modules = context.systemState.modules;
        const metrics: number[] = [];
        
        // Collect metrics from modules
        for (const moduleName in modules) {
          if (modules[moduleName].activity !== undefined) {
            metrics.push(modules[moduleName].activity);
          }
          if (modules[moduleName].coherence !== undefined) {
            metrics.push(modules[moduleName].coherence);
          }
        }
        
        // Need at least a few metrics for meaningful calculation
        if (metrics.length < 3) return false;
        
        // Analyze metrics for 3:1 ratio patterns
        let ratioDetected = false;
        
        // Sort metrics
        metrics.sort((a, b) => b - a);
        
        // Look for 3:1 splits in the data
        for (let i = 1; i < metrics.length; i++) {
          // Calculate ratio between sum of higher values and sum of lower values
          const higherSum = metrics.slice(0, i).reduce((sum, val) => sum + val, 0);
          const lowerSum = metrics.slice(i).reduce((sum, val) => sum + val, 0);
          
          // Skip if either sum is effectively zero
          if (higherSum < 0.01 || lowerSum < 0.01) continue;
          
          const ratio = higherSum / lowerSum;
          
          // Check if ratio is close to 3:1 (3.0 ± 0.3)
          if (Math.abs(ratio - 3.0) < 0.3) {
            ratioDetected = true;
            break;
          }
          
          // Also check for the inverse (1:3 ratio)
          if (Math.abs(ratio - 0.333) < 0.1) {
            ratioDetected = true;
            break;
          }
        }
        
        return ratioDetected;
      },
      eventGenerator: (data: any, context: EngineContext) => {
        // Get module metrics
        const modules = context.systemState.modules || {};
        const metrics: number[] = [];
        const metricSources: string[] = [];
        
        // Collect metrics and their sources
        for (const moduleName in modules) {
          if (modules[moduleName].activity !== undefined) {
            metrics.push(modules[moduleName].activity);
            metricSources.push(`${moduleName}.activity`);
          }
          if (modules[moduleName].coherence !== undefined) {
            metrics.push(modules[moduleName].coherence);
            metricSources.push(`${moduleName}.coherence`);
          }
        }
        
        // Sort metrics and keep track of sources
        const indexedMetrics = metrics.map((value, index) => ({ value, source: metricSources[index] }));
        indexedMetrics.sort((a, b) => b.value - a.value);
        
        // Find best 3:1 ratio split
        let bestRatio = 0;
        let bestSplit = 1;
        let splitDetails = {};
        
        for (let i = 1; i < indexedMetrics.length; i++) {
          const higherValues = indexedMetrics.slice(0, i).map(m => m.value);
          const lowerValues = indexedMetrics.slice(i).map(m => m.value);
          
          const higherSum = higherValues.reduce((sum, val) => sum + val, 0);
          const lowerSum = lowerValues.reduce((sum, val) => sum + val, 0);
          
          // Skip if either sum is effectively zero
          if (higherSum < 0.01 || lowerSum < 0.01) continue;
          
          const ratio = higherSum / lowerSum;
          
          // Check if ratio is closer to 3:1 than previous best
          if (Math.abs(ratio - 3.0) < Math.abs(bestRatio - 3.0)) {
            bestRatio = ratio;
            bestSplit = i;
            splitDetails = {
              higherGroup: indexedMetrics.slice(0, i).map(m => ({ value: m.value, source: m.source })),
              lowerGroup: indexedMetrics.slice(i).map(m => ({ value: m.value, source: m.source })),
              higherSum,
              lowerSum
            };
          }
          
          // Also check for the inverse (1:3 ratio)
          const inverseRatio = lowerSum / higherSum;
          if (Math.abs(inverseRatio - 3.0) < Math.abs(bestRatio - 3.0)) {
            bestRatio = inverseRatio;
            bestSplit = i;
            splitDetails = {
              higherGroup: indexedMetrics.slice(i).map(m => ({ value: m.value, source: m.source })),
              lowerGroup: indexedMetrics.slice(0, i).map(m => ({ value: m.value, source: m.source })),
              higherSum: lowerSum,
              lowerSum: higherSum
            };
          }
        }
        
        return {
          type: 'fundamental_ratio_emergence',
          description: `Detected the system's fundamental 3:1 ratio (actual: ${bestRatio.toFixed(2)}:1)`,
          details: {
            ratio: bestRatio,
            splitPoint: bestSplit,
            normalization: bestRatio / 3.0, // How close to exactly 3:1
            ...splitDetails
          },
          sourceContext: 'meta_cognitive_engine'
        };
      }
    });
  }
  
  /**
   * Increment the frequency counter for a specific pattern
   * 
   * @param patternId - ID of the pattern to increment
   */
  private incrementPatternFrequency(patternId: string): void {
    const currentCount = this.context.patternFrequency.get(patternId) || 0;
    this.context.patternFrequency.set(patternId, currentCount + 1);
  }
}

export default MetaCognitiveEngine;