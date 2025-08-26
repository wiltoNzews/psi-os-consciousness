/**
 * Direct execution test for Meta-Cognitive Analysis Engine
 * 
 * This file uses CommonJS module format to avoid any ES module issues.
 * It can be executed directly with Node without using Jest or any testing framework.
 * 
 * The test validates the Meta-Cognitive Engine's ability to track patterns,
 * generate insights, and perform system stability calculations.
 */

// Simple implementation of the Meta-Cognitive Analysis Engine
class MetaCognitiveAnalysisEngine {
  constructor() {
    this.events = [];
    this.patterns = [];
    this.insights = [];
    this.patternRecognizers = new Map();
    this.subscribers = new Map();
    this.thresholds = {
      stabilityMinimum: 0.5,
      patternConfidence: 0.7,
      insightImportance: 0.3
    };
  }

  /**
   * Log a meta-cognitive event
   * @param {string} eventType - Type of event
   * @param {Object} eventData - Event data
   * @returns {Object} Recorded event
   */
  logEvent(eventType, eventData) {
    console.log(`[MCEngine] Logging event: ${eventType}`);
    
    const event = {
      id: `event-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: eventType,
      timestamp: new Date(),
      data: eventData
    };
    
    this.events.push(event);
    
    // Run pattern recognition on new event
    this._recognizePatterns([event]);
    
    return event;
  }

  /**
   * Register a pattern recognizer
   * @param {string} patternType - Type of pattern to recognize
   * @param {Function} recognizerFunction - Function to recognize pattern
   */
  registerPatternRecognizer(patternType, recognizerFunction) {
    console.log(`[MCEngine] Registering pattern recognizer: ${patternType}`);
    this.patternRecognizers.set(patternType, recognizerFunction);
  }

  /**
   * Run a cognitive analysis cycle
   * @returns {Object} Analysis results
   */
  runAnalysisCycle() {
    console.log('[MCEngine] Running analysis cycle');
    
    // Get recent events for analysis
    const recentEvents = this.events.slice(-10);
    
    // Recognize patterns in events
    const newPatterns = this._recognizePatterns(recentEvents);
    
    // Generate insights from patterns
    const newInsights = this._generateInsights(newPatterns);
    
    // Calculate stability
    const stability = this.calculateSystemStability();
    
    const results = {
      eventsAnalyzed: recentEvents.length,
      patternsDetected: newPatterns.length,
      insightsGenerated: newInsights.length,
      systemStability: stability
    };
    
    // Notify subscribers
    this._notifySubscribers('analysis-complete', results);
    
    return results;
  }

  /**
   * Subscribe to meta-cognitive updates
   * @param {string} subscriberId - ID of subscriber
   * @param {Function} callback - Callback function
   */
  subscribe(subscriberId, callback) {
    console.log(`[MCEngine] Subscriber added: ${subscriberId}`);
    this.subscribers.set(subscriberId, callback);
  }

  /**
   * Unsubscribe from meta-cognitive updates
   * @param {string} subscriberId - ID of subscriber
   */
  unsubscribe(subscriberId) {
    console.log(`[MCEngine] Subscriber removed: ${subscriberId}`);
    this.subscribers.delete(subscriberId);
  }

  /**
   * Get recent patterns matching criteria
   * @param {Object} criteria - Search criteria
   * @param {number} limit - Maximum number of patterns to return
   * @returns {Array} Matching patterns
   */
  getRecentPatterns(criteria = {}, limit = 10) {
    let filteredPatterns = this.patterns;
    
    if (criteria.patternType) {
      filteredPatterns = filteredPatterns.filter(p => p.patternType === criteria.patternType);
    }
    
    if (criteria.minConfidence) {
      filteredPatterns = filteredPatterns.filter(p => p.confidence >= criteria.minConfidence);
    }
    
    return filteredPatterns
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get recent insights matching criteria
   * @param {Object} criteria - Search criteria
   * @param {number} limit - Maximum number of insights to return
   * @returns {Array} Matching insights
   */
  getRecentInsights(criteria = {}, limit = 10) {
    let filteredInsights = this.insights;
    
    if (criteria.category) {
      filteredInsights = filteredInsights.filter(i => i.category === criteria.category);
    }
    
    if (criteria.minImportance) {
      filteredInsights = filteredInsights.filter(i => i.importance >= criteria.minImportance);
    }
    
    return filteredInsights
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Set threshold value for a specific metric
   * @param {string} metricName - Name of the metric
   * @param {number} value - Threshold value
   */
  setThreshold(metricName, value) {
    console.log(`[MCEngine] Setting threshold ${metricName} to ${value}`);
    if (this.thresholds.hasOwnProperty(metricName)) {
      this.thresholds[metricName] = value;
    }
  }

  /**
   * Calculate system stability based on recent events
   * @returns {number} Stability score (0-1)
   */
  calculateSystemStability() {
    console.log('[MCEngine] Calculating system stability');
    
    // If no events, return default high stability
    if (this.events.length === 0) {
      return 0.95;
    }
    
    // Get recent error events
    const recentEvents = this.events.slice(-20);
    const errorEvents = recentEvents.filter(e => 
      e.type === 'task-failure' || 
      e.type === 'stability-adjustment' ||
      (e.data && e.data.error)
    );
    
    // Calculate base stability from error rate
    const errorRate = errorEvents.length / recentEvents.length;
    let stability = 1 - (errorRate * 0.5);
    
    // Adjust based on pattern diversity (more diverse patterns = more stable system)
    const patternTypes = new Set(this.patterns.map(p => p.patternType));
    const patternDiversity = Math.min(patternTypes.size / 5, 1);
    stability += patternDiversity * 0.1;
    
    // Adjust based on insight importance (higher importance insights = potential issues)
    const recentImportantInsights = this.insights
      .filter(i => i.importance > this.thresholds.insightImportance)
      .slice(-5);
    
    if (recentImportantInsights.length > 0) {
      const avgImportance = recentImportantInsights.reduce((sum, i) => sum + i.importance, 0) / 
        recentImportantInsights.length;
      stability -= avgImportance * 0.1;
    }
    
    // Limit stability to range [0-1]
    stability = Math.max(0, Math.min(1, stability));
    
    console.log(`[MCEngine] Calculated stability score: ${stability.toFixed(2)}`);
    
    return stability;
  }

  /**
   * Recognize patterns in events
   * @param {Array} events - Events to analyze
   * @returns {Array} Detected patterns
   * @private
   */
  _recognizePatterns(events) {
    const newPatterns = [];
    
    // For each registered pattern recognizer
    for (const [patternType, recognizerFn] of this.patternRecognizers.entries()) {
      try {
        // Call the recognizer with events and all existing events
        const detectedPatterns = recognizerFn(events, this.events);
        
        if (detectedPatterns && detectedPatterns.length > 0) {
          // Process each detected pattern
          detectedPatterns.forEach(p => {
            const pattern = {
              id: `pattern-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              patternType,
              timestamp: new Date(),
              description: p.description,
              confidence: p.confidence || 0.8,
              relatedEvents: p.relatedEvents || events.map(e => e.id),
              data: p.data || {}
            };
            
            // Only add patterns with sufficient confidence
            if (pattern.confidence >= this.thresholds.patternConfidence) {
              this.patterns.push(pattern);
              newPatterns.push(pattern);
              console.log(`[MCEngine] Detected pattern: ${patternType} (${pattern.confidence.toFixed(2)})`);
            }
          });
        }
      } catch (error) {
        console.error(`Error in pattern recognizer ${patternType}:`, error);
      }
    }
    
    return newPatterns;
  }

  /**
   * Generate insights from patterns
   * @param {Array} patterns - Patterns to analyze
   * @returns {Array} Generated insights
   * @private
   */
  _generateInsights(patterns) {
    // For this simple implementation, we'll create one insight for each new pattern
    const newInsights = patterns.map(pattern => {
      const insight = {
        id: `insight-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date(),
        category: pattern.patternType,
        title: `Insight from ${pattern.patternType}`,
        description: `This insight was generated from pattern: ${pattern.description}`,
        importance: pattern.confidence * 0.8, // Scale importance based on pattern confidence
        sourcePatternId: pattern.id,
        recommendations: [
          "Consider adjusting system parameters",
          "Monitor this pattern for recurrence"
        ]
      };
      
      this.insights.push(insight);
      console.log(`[MCEngine] Generated insight: ${insight.title} (importance: ${insight.importance.toFixed(2)})`);
      return insight;
    });
    
    return newInsights;
  }

  /**
   * Notify subscribers of updates
   * @param {string} updateType - Type of update
   * @param {Object} data - Update data
   * @private
   */
  _notifySubscribers(updateType, data) {
    for (const [subscriberId, callback] of this.subscribers.entries()) {
      try {
        callback(updateType, data);
      } catch (error) {
        console.error(`Error notifying subscriber ${subscriberId}:`, error);
      }
    }
  }
}

/**
 * Run a direct test of the Meta-Cognitive Analysis Engine
 */
function runDirectTest() {
  console.log('STARTING DIRECT TEST OF META-COGNITIVE ANALYSIS ENGINE');
  console.log('===================================================');
  
  // Create engine
  const engine = new MetaCognitiveAnalysisEngine();
  
  // Register sample pattern recognizers
  engine.registerPatternRecognizer('recurring-error', (events, allEvents) => {
    // Look for recurring errors of the same type
    const errorEvents = events.filter(e => e.type === 'task-failure' || (e.data && e.data.error));
    
    if (errorEvents.length === 0) return [];
    
    // Group by error message or code
    const errorGroups = {};
    errorEvents.forEach(event => {
      const errorKey = event.data?.error?.message || event.data?.error?.code || 'unknown';
      if (!errorGroups[errorKey]) {
        errorGroups[errorKey] = [];
      }
      errorGroups[errorKey].push(event);
    });
    
    // Return patterns for errors that occur multiple times
    return Object.entries(errorGroups)
      .filter(([_, events]) => events.length > 1)
      .map(([errorKey, events]) => ({
        description: `Recurring error: ${errorKey}`,
        confidence: 0.7 + (Math.min(events.length, 5) * 0.05),
        relatedEvents: events.map(e => e.id),
        data: { errorKey, count: events.length }
      }));
  });
  
  engine.registerPatternRecognizer('user-interaction', (events, allEvents) => {
    // Look for patterns in user interaction events
    const interactionEvents = events.filter(e => e.type === 'user-interaction');
    
    if (interactionEvents.length < 3) return [];
    
    // Simple pattern: detect rapid succession of interactions
    const timestamps = interactionEvents.map(e => e.timestamp.getTime());
    timestamps.sort();
    
    let rapidInteractions = 0;
    for (let i = 1; i < timestamps.length; i++) {
      if (timestamps[i] - timestamps[i-1] < 2000) { // Less than 2 seconds apart
        rapidInteractions++;
      }
    }
    
    if (rapidInteractions >= 2) {
      return [{
        description: 'Rapid succession of user interactions',
        confidence: 0.8,
        relatedEvents: interactionEvents.map(e => e.id),
        data: { rapidInteractions }
      }];
    }
    
    return [];
  });
  
  // Add a subscriber for updates
  let updateCount = 0;
  engine.subscribe('test-subscriber', (updateType, data) => {
    console.log(`[Subscriber] Received update: ${updateType}`);
    console.log('[Subscriber] Data:', JSON.stringify(data, null, 2));
    updateCount++;
  });
  
  // Log some test events
  console.log('\nLOGGING TEST EVENTS');
  console.log('=================');
  
  // Some task failures with the same error
  engine.logEvent('task-failure', { 
    taskId: 'task-1',
    error: { message: 'Connection timeout', code: 'ERR_TIMEOUT' }
  });
  
  engine.logEvent('task-failure', { 
    taskId: 'task-2',
    error: { message: 'Connection timeout', code: 'ERR_TIMEOUT' }
  });
  
  engine.logEvent('task-completion', { 
    taskId: 'task-3',
    result: 'success'
  });
  
  engine.logEvent('task-failure', { 
    taskId: 'task-4',
    error: { message: 'Connection timeout', code: 'ERR_TIMEOUT' }
  });
  
  // Some user interactions in rapid succession
  engine.logEvent('user-interaction', { userId: 'user-1', action: 'click', target: 'button-1' });
  engine.logEvent('user-interaction', { userId: 'user-1', action: 'click', target: 'button-2' });
  engine.logEvent('user-interaction', { userId: 'user-1', action: 'click', target: 'button-3' });
  
  // Run analysis cycle
  console.log('\nRUNNING ANALYSIS CYCLE');
  console.log('====================');
  const results = engine.runAnalysisCycle();
  
  // Get patterns and insights
  console.log('\nPATTERNS AND INSIGHTS');
  console.log('====================');
  const patterns = engine.getRecentPatterns();
  const insights = engine.getRecentInsights();
  
  console.log(`Detected ${patterns.length} patterns`);
  patterns.forEach(p => {
    console.log(`- ${p.patternType}: ${p.description} (${p.confidence.toFixed(2)})`);
  });
  
  console.log(`\nGenerated ${insights.length} insights`);
  insights.forEach(i => {
    console.log(`- ${i.title}: ${i.description} (${i.importance.toFixed(2)})`);
  });
  
  // Calculate stability
  console.log('\nSYSTEM STABILITY');
  console.log('===============');
  const stability = engine.calculateSystemStability();
  console.log(`System stability score: ${stability.toFixed(2)}`);
  
  // Verify results
  console.log('\nTEST VERIFICATION');
  console.log('===============');
  let success = true;
  
  // Check that we detected both pattern types
  const patternTypes = new Set(patterns.map(p => p.patternType));
  if (!patternTypes.has('recurring-error')) {
    console.log('FAIL: Did not detect recurring-error pattern');
    success = false;
  }
  
  if (!patternTypes.has('user-interaction')) {
    console.log('FAIL: Did not detect user-interaction pattern');
    success = false;
  }
  
  // Check that insights were generated
  if (insights.length === 0) {
    console.log('FAIL: No insights were generated');
    success = false;
  }
  
  // Check that subscriber was called
  if (updateCount === 0) {
    console.log('FAIL: Subscriber was not notified');
    success = false;
  }
  
  // Check stability calculation
  if (stability < 0 || stability > 1) {
    console.log(`FAIL: Invalid stability score: ${stability}`);
    success = false;
  }
  
  console.log(success ? 'All tests PASSED' : 'Some tests FAILED');
  
  // Clean up
  engine.unsubscribe('test-subscriber');
  
  console.log('\nTEST COMPLETE');
  
  return success;
}

// Execute the test function
const success = runDirectTest();

// For use with Node.js
module.exports = { runDirectTest, MetaCognitiveAnalysisEngine };