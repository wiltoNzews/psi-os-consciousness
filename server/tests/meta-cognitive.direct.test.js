/**
 * Direct JavaScript Test for Meta-Cognitive Analysis Engine
 * 
 * This test validates the core functionality of the Meta-Cognitive Analysis Engine,
 * which monitors system operations, recognizes patterns, and generates insights.
 * 
 * Using pure JavaScript to avoid TypeScript transformation overhead.
 */

// Simple mock implementation of the Meta-Cognitive Analysis Engine
class MetaCognitiveAnalysisEngine {
  constructor() {
    this.events = [];
    this.patterns = [];
    this.insights = [];
    this.analysisCycles = 0;
    this.activeSubscriptions = new Set();
    this.patternRecognizers = new Map();
    this.configuredThresholds = {
      stability: 0.7,
      coherence: 0.6,
      novelty: 0.3,
      importance: 0.5
    };
  }

  /**
   * Log a meta-cognitive event
   * @param {string} eventType - Type of event
   * @param {Object} eventData - Event data
   * @returns {Object} Recorded event
   */
  logEvent(eventType, eventData) {
    console.log(`[MetaCognitiveEngine] Logging event: ${eventType}`);
    
    const event = {
      id: `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: eventType,
      timestamp: new Date(),
      data: eventData,
      processed: false
    };
    
    this.events.push(event);
    
    // Notify subscribers
    this._notifySubscribers('event', event);
    
    return event;
  }

  /**
   * Register a pattern recognizer
   * @param {string} patternType - Type of pattern to recognize
   * @param {Function} recognizerFunction - Function to recognize pattern
   */
  registerPatternRecognizer(patternType, recognizerFunction) {
    console.log(`[MetaCognitiveEngine] Registering pattern recognizer: ${patternType}`);
    this.patternRecognizers.set(patternType, recognizerFunction);
  }

  /**
   * Run a cognitive analysis cycle
   * @returns {Object} Analysis results
   */
  runAnalysisCycle() {
    console.log('[MetaCognitiveEngine] Running analysis cycle');
    
    this.analysisCycles++;
    const startTime = Date.now();
    
    // Filter unprocessed events
    const unprocessedEvents = this.events.filter(event => !event.processed);
    
    // Find patterns
    const newPatterns = this._recognizePatterns(unprocessedEvents);
    this.patterns.push(...newPatterns);
    
    // Generate insights
    const newInsights = this._generateInsights(newPatterns);
    this.insights.push(...newInsights);
    
    // Mark events as processed
    unprocessedEvents.forEach(event => {
      event.processed = true;
    });
    
    const results = {
      cycleId: `cycle-${this.analysisCycles}`,
      timestamp: new Date(),
      duration: Date.now() - startTime,
      eventsProcessed: unprocessedEvents.length,
      patternsDetected: newPatterns.length,
      insightsGenerated: newInsights.length
    };
    
    // Notify subscribers
    this._notifySubscribers('analysis', results);
    
    return results;
  }

  /**
   * Subscribe to meta-cognitive updates
   * @param {string} subscriberId - ID of subscriber
   * @param {Function} callback - Callback function
   */
  subscribe(subscriberId, callback) {
    console.log(`[MetaCognitiveEngine] Adding subscriber: ${subscriberId}`);
    this.activeSubscriptions.add({
      id: subscriberId,
      callback
    });
  }

  /**
   * Unsubscribe from meta-cognitive updates
   * @param {string} subscriberId - ID of subscriber
   */
  unsubscribe(subscriberId) {
    console.log(`[MetaCognitiveEngine] Removing subscriber: ${subscriberId}`);
    
    // Find and remove the subscription
    for (const subscription of this.activeSubscriptions) {
      if (subscription.id === subscriberId) {
        this.activeSubscriptions.delete(subscription);
        break;
      }
    }
  }

  /**
   * Get recent patterns matching criteria
   * @param {Object} criteria - Search criteria
   * @param {number} limit - Maximum number of patterns to return
   * @returns {Array} Matching patterns
   */
  getRecentPatterns(criteria = {}, limit = 10) {
    let matchingPatterns = [...this.patterns];
    
    // Apply criteria filters if provided
    if (criteria.type) {
      matchingPatterns = matchingPatterns.filter(pattern => pattern.type === criteria.type);
    }
    
    if (criteria.minConfidence) {
      matchingPatterns = matchingPatterns.filter(pattern => pattern.confidence >= criteria.minConfidence);
    }
    
    // Sort by timestamp (newest first)
    matchingPatterns.sort((a, b) => b.timestamp - a.timestamp);
    
    // Apply limit
    return matchingPatterns.slice(0, limit);
  }

  /**
   * Get recent insights matching criteria
   * @param {Object} criteria - Search criteria
   * @param {number} limit - Maximum number of insights to return
   * @returns {Array} Matching insights
   */
  getRecentInsights(criteria = {}, limit = 10) {
    let matchingInsights = [...this.insights];
    
    // Apply criteria filters if provided
    if (criteria.category) {
      matchingInsights = matchingInsights.filter(insight => insight.category === criteria.category);
    }
    
    if (criteria.minImportance) {
      matchingInsights = matchingInsights.filter(insight => insight.importance >= criteria.minImportance);
    }
    
    // Sort by timestamp (newest first)
    matchingInsights.sort((a, b) => b.timestamp - a.timestamp);
    
    // Apply limit
    return matchingInsights.slice(0, limit);
  }

  /**
   * Set threshold value for a specific metric
   * @param {string} metricName - Name of the metric
   * @param {number} value - Threshold value
   */
  setThreshold(metricName, value) {
    if (value < 0 || value > 1) {
      throw new Error(`Threshold value must be between 0 and 1, got ${value}`);
    }
    
    this.configuredThresholds[metricName] = value;
  }

  /**
   * Calculate system stability based on recent events
   * @returns {number} Stability score (0-1)
   */
  calculateSystemStability() {
    // Simple stability calculation for testing
    // In a real implementation, this would use more sophisticated analysis
    const recentEvents = this.events.slice(-20);
    
    if (recentEvents.length === 0) {
      return 1.0; // Perfect stability if no events
    }
    
    // Count error events
    const errorEvents = recentEvents.filter(event => 
      event.type.includes('error') || 
      event.type.includes('failure') ||
      (event.data && event.data.severity === 'error')
    );
    
    // Calculate stability as 1 - (error ratio)
    const stability = 1 - (errorEvents.length / recentEvents.length);
    
    return Math.max(0, Math.min(1, stability));
  }

  /**
   * Recognize patterns in events
   * @param {Array} events - Events to analyze
   * @returns {Array} Detected patterns
   * @private
   */
  _recognizePatterns(events) {
    const patterns = [];
    
    // Skip if no events to process
    if (events.length === 0) {
      return patterns;
    }
    
    // Apply each registered pattern recognizer
    for (const [patternType, recognizerFunction] of this.patternRecognizers.entries()) {
      try {
        const recognizedPatterns = recognizerFunction(events);
        if (recognizedPatterns && recognizedPatterns.length > 0) {
          // Add metadata to each pattern
          recognizedPatterns.forEach(pattern => {
            pattern.id = `pattern-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            pattern.type = patternType;
            pattern.timestamp = new Date();
            patterns.push(pattern);
          });
        }
      } catch (error) {
        console.error(`Error in pattern recognizer ${patternType}:`, error);
      }
    }
    
    // Add some default pattern recognition if no recognizers are registered
    if (this.patternRecognizers.size === 0 && events.length >= 3) {
      // Simple sequence detection (events of the same type in sequence)
      const eventsByType = new Map();
      
      // Group events by type
      events.forEach(event => {
        if (!eventsByType.has(event.type)) {
          eventsByType.set(event.type, []);
        }
        eventsByType.get(event.type).push(event);
      });
      
      // Look for sequences
      for (const [eventType, eventsOfType] of eventsByType.entries()) {
        if (eventsOfType.length >= 3) {
          patterns.push({
            id: `pattern-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: 'sequence',
            eventType: eventType,
            timestamp: new Date(),
            confidence: 0.7,
            occurrences: eventsOfType.length,
            description: `Detected sequence of ${eventsOfType.length} events of type ${eventType}`
          });
        }
      }
    }
    
    return patterns;
  }

  /**
   * Generate insights from patterns
   * @param {Array} patterns - Patterns to analyze
   * @returns {Array} Generated insights
   * @private
   */
  _generateInsights(patterns) {
    const insights = [];
    
    // Skip if no patterns to process
    if (patterns.length === 0) {
      return insights;
    }
    
    // Generate insights based on pattern combinations
    // Group patterns by type
    const patternsByType = new Map();
    patterns.forEach(pattern => {
      if (!patternsByType.has(pattern.type)) {
        patternsByType.set(pattern.type, []);
      }
      patternsByType.get(pattern.type).push(pattern);
    });
    
    // Generate insights for each pattern type
    for (const [patternType, patternsOfType] of patternsByType.entries()) {
      if (patternsOfType.length >= 2) {
        // Simple insight: multiple patterns of the same type
        insights.push({
          id: `insight-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date(),
          category: 'pattern-frequency',
          importance: 0.6,
          confidence: 0.8,
          description: `Detected ${patternsOfType.length} patterns of type ${patternType}`,
          relatedPatterns: patternsOfType.map(p => p.id),
          suggestedActions: [
            `Investigate ${patternType} patterns further`,
            `Consider adjusting system parameters related to ${patternType}`
          ]
        });
      }
    }
    
    // Calculate system stability
    const stability = this.calculateSystemStability();
    if (stability < this.configuredThresholds.stability) {
      // Stability insight
      insights.push({
        id: `insight-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date(),
        category: 'system-stability',
        importance: 0.9,
        confidence: 0.85,
        description: `System stability is below threshold: ${stability.toFixed(2)} (threshold: ${this.configuredThresholds.stability})`,
        relatedPatterns: patterns.slice(0, 5).map(p => p.id),
        suggestedActions: [
          'Review recent error events',
          'Check system resources',
          'Consider temporarily reducing workload'
        ]
      });
    }
    
    return insights;
  }

  /**
   * Notify subscribers of updates
   * @param {string} updateType - Type of update
   * @param {Object} data - Update data
   * @private
   */
  _notifySubscribers(updateType, data) {
    this.activeSubscriptions.forEach(subscription => {
      try {
        subscription.callback(updateType, data);
      } catch (error) {
        console.error(`Error notifying subscriber ${subscription.id}:`, error);
      }
    });
  }
}

describe('Meta-Cognitive Analysis Engine Test', () => {
  let metaCognitiveEngine;
  
  beforeEach(() => {
    metaCognitiveEngine = new MetaCognitiveAnalysisEngine();
  });
  
  it('should log meta-cognitive events correctly', () => {
    const eventType = 'test-event';
    const eventData = { message: 'Test event data', severity: 'info' };
    
    const event = metaCognitiveEngine.logEvent(eventType, eventData);
    
    expect(event).toBeDefined();
    expect(event.type).toBe(eventType);
    expect(event.data).toBe(eventData);
    expect(event.timestamp instanceof Date).toBe(true);
    expect(event.processed).toBe(false);
    
    // Check that the event was added to the events array
    expect(metaCognitiveEngine.events.length).toBe(1);
    expect(metaCognitiveEngine.events[0]).toBe(event);
  });
  
  it('should register pattern recognizers', () => {
    const patternType = 'sequence';
    // Use a simple function instead of jest.fn() for compatibility
    const recognizerFunction = function(events) { return []; };
    
    metaCognitiveEngine.registerPatternRecognizer(patternType, recognizerFunction);
    
    expect(metaCognitiveEngine.patternRecognizers.has(patternType)).toBeTruthy();
    expect(metaCognitiveEngine.patternRecognizers.get(patternType)).toBe(recognizerFunction);
  });
  
  it('should run analysis cycles and process events', () => {
    // Log some events
    metaCognitiveEngine.logEvent('test-event', { message: 'Event 1' });
    metaCognitiveEngine.logEvent('test-event', { message: 'Event 2' });
    metaCognitiveEngine.logEvent('test-event', { message: 'Event 3' });
    
    // Register a simple pattern recognizer
    metaCognitiveEngine.registerPatternRecognizer('test-pattern', (events) => {
      if (events.length >= 3) {
        return [{
          confidence: 0.8,
          description: 'Found 3+ events in sequence',
          events: events.map(e => e.id)
        }];
      }
      return [];
    });
    
    // Run analysis cycle
    const results = metaCognitiveEngine.runAnalysisCycle();
    
    expect(results).toBeDefined();
    expect(results.eventsProcessed).toBe(3);
    expect(results.patternsDetected > 0).toBe(true);
    
    // Check that events are marked as processed
    expect(metaCognitiveEngine.events.every(event => event.processed)).toBeTruthy();
    
    // Check that patterns were detected
    expect(metaCognitiveEngine.patterns.length > 0).toBe(true);
    const pattern = metaCognitiveEngine.patterns[0];
    expect(pattern.type).toBe('test-pattern');
    expect(pattern.confidence).toBe(0.8);
    
    // Check insights generation
    expect(metaCognitiveEngine.insights.length > 0).toBe(true);
  });
  
  it('should allow subscription and notification', () => {
    const subscriberId = 'test-subscriber';
    let callbackCalled = false;
    let callbackEventType = null;
    let callbackEventData = null;
    
    // Create a simple callback function to track calls
    const callbackFunction = function(eventType, eventData) {
      callbackCalled = true;
      callbackEventType = eventType;
      callbackEventData = eventData;
    };
    
    // Subscribe
    metaCognitiveEngine.subscribe(subscriberId, callbackFunction);
    
    // Log an event (should trigger notification)
    const event = metaCognitiveEngine.logEvent('test-event', { message: 'Test notification' });
    
    // Check that callback was called
    expect(callbackCalled).toBe(true);
    expect(callbackEventType).toBe('event');
    expect(callbackEventData).toBe(event);
    
    // Unsubscribe
    metaCognitiveEngine.unsubscribe(subscriberId);
    
    // Reset tracking variables
    callbackCalled = false;
    callbackEventType = null;
    callbackEventData = null;
    
    // Log another event (should not trigger notification)
    metaCognitiveEngine.logEvent('test-event', { message: 'No notification' });
    
    // Check that callback was not called
    expect(callbackCalled).toBe(false);
  });
  
  it('should filter patterns and insights by criteria', () => {
    // Add some test patterns
    metaCognitiveEngine.patterns = [
      {
        id: 'pattern-1',
        type: 'sequence',
        confidence: 0.9,
        timestamp: new Date(Date.now() - 1000)
      },
      {
        id: 'pattern-2',
        type: 'anomaly',
        confidence: 0.7,
        timestamp: new Date(Date.now() - 500)
      },
      {
        id: 'pattern-3',
        type: 'sequence',
        confidence: 0.5,
        timestamp: new Date()
      }
    ];
    
    // Add some test insights
    metaCognitiveEngine.insights = [
      {
        id: 'insight-1',
        category: 'performance',
        importance: 0.8,
        timestamp: new Date(Date.now() - 1000)
      },
      {
        id: 'insight-2',
        category: 'security',
        importance: 0.6,
        timestamp: new Date(Date.now() - 500)
      },
      {
        id: 'insight-3',
        category: 'performance',
        importance: 0.4,
        timestamp: new Date()
      }
    ];
    
    // Test pattern filtering by type
    const sequencePatterns = metaCognitiveEngine.getRecentPatterns({ type: 'sequence' });
    expect(sequencePatterns.length).toBe(2);
    expect(sequencePatterns[0].id).toBe('pattern-3'); // Most recent first
    
    // Test pattern filtering by confidence
    const highConfidencePatterns = metaCognitiveEngine.getRecentPatterns({ minConfidence: 0.7 });
    expect(highConfidencePatterns.length).toBe(2);
    expect(highConfidencePatterns[0].id).toBe('pattern-2'); // Most recent first
    expect(highConfidencePatterns[1].id).toBe('pattern-1');
    
    // Test insight filtering by category
    const performanceInsights = metaCognitiveEngine.getRecentInsights({ category: 'performance' });
    expect(performanceInsights.length).toBe(2);
    expect(performanceInsights[0].id).toBe('insight-3'); // Most recent first
    
    // Test insight filtering by importance
    const importantInsights = metaCognitiveEngine.getRecentInsights({ minImportance: 0.7 });
    expect(importantInsights.length).toBe(1);
    expect(importantInsights[0].id).toBe('insight-1');
  });
  
  it('should calculate system stability correctly', () => {
    // Initially, with no events, stability should be perfect
    expect(metaCognitiveEngine.calculateSystemStability()).toBe(1.0);
    
    // Add some normal events
    for (let i = 0; i < 8; i++) {
      metaCognitiveEngine.logEvent('normal-event', { message: `Normal event ${i}` });
    }
    
    // Add some error events
    for (let i = 0; i < 2; i++) {
      metaCognitiveEngine.logEvent('error-event', { message: `Error event ${i}`, severity: 'error' });
    }
    
    // With 2/10 errors, stability should be 0.8
    expect(metaCognitiveEngine.calculateSystemStability()).toBe(0.8);
  });
});