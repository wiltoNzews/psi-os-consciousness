/**
 * Neural Processing Worker
 * 
 * This Web Worker handles all the heavy computational aspects of neural pattern
 * detection and processing off the main thread, significantly improving UI performance.
 * 
 * Based on the PassiveWorks AI-Human Symbiosis Formula implementation.
 */

// Types for neural processing
interface InteractionEvent {
  type: 'mousemove' | 'click' | 'keypress';
  x: number;
  y: number;
  timestamp: number;
}

interface NeuralPattern {
  id: string;
  strength: number;
  locations: { x: number, y: number }[];
  lastActivity: number;
  type: 'explorative' | 'focused' | 'creative' | 'analytical';
  emotionalContext: 'neutral' | 'excited' | 'contemplative' | 'urgent';
  confidenceScore: number;
  cognitiveLoad: number;
  temporalRhythm: number;
  alignmentScore: number;
}

interface ProcessingState {
  patterns: NeuralPattern[];
  learningPhase: number;
  activePatterns: string[];
  domainContext: string;
}

interface WorkerMessage {
  type: 'ADD_INTERACTION' | 'RESET' | 'SET_DOMAIN' | 'REQUEST_STATE';
  payload?: any;
}

// Main state for the worker
let state: ProcessingState = {
  patterns: [],
  learningPhase: 0.1, // Starts at 10% learning
  activePatterns: [],
  domainContext: 'general'
};

// Last 50 interactions for pattern analysis
const recentInteractions: InteractionEvent[] = [];
const MAX_INTERACTIONS = 50;

// Performance optimization: limit the number of patterns
const MAX_PATTERNS = 15;

// Track timing for temporal rhythm detection
const interactionTimestamps: number[] = [];
const MAX_TIMESTAMPS = 20;

/**
 * Process new interaction event
 */
function processInteraction(event: InteractionEvent): void {
  // Add to recent interactions, maintaining max length
  recentInteractions.push(event);
  if (recentInteractions.length > MAX_INTERACTIONS) {
    recentInteractions.shift();
  }

  // Track interaction timing for rhythm detection
  interactionTimestamps.push(event.timestamp);
  if (interactionTimestamps.length > MAX_TIMESTAMPS) {
    interactionTimestamps.shift();
  }

  // Detect patterns based on interaction type
  if (event.type === 'click') {
    detectClickPattern(event);
  } else if (event.type === 'mousemove') {
    updateMovementPatterns(event);
  }

  // Gradually increase learning phase based on interaction count
  // This simulates the system learning from user behavior over time
  state.learningPhase = Math.min(0.95, state.learningPhase + 0.001);

  // Update active patterns
  updateActivePatterns();
  
  // Process neural metrics
  const metrics = calculateNeuralMetrics();
  
  // Send current state back to main thread
  self.postMessage({
    type: 'STATE_UPDATE',
    payload: {
      ...state,
      metrics
    }
  });
}

/**
 * Detect patterns from click behavior
 */
function detectClickPattern(event: InteractionEvent): void {
  // Find clicks that are close to this one to detect potential patterns
  const relatedClicks = recentInteractions.filter(i => 
    i.type === 'click' && 
    Math.sqrt(Math.pow(i.x - event.x, 2) + Math.pow(i.y - event.y, 2)) < 200
  );

  // If we have multiple related clicks, consider it a pattern
  if (relatedClicks.length >= 3) {
    // Generate a unique ID for this pattern
    const patternId = `click_${Date.now()}`;
    
    // Calculate pattern strength based on number and recency of clicks
    const strength = Math.min(1, relatedClicks.length / 10);
    
    // Get click locations
    const locations = relatedClicks.map(c => ({ x: c.x, y: c.y }));

    // Determine pattern type based on spatial arrangement
    const patternType = determinePatternType(locations);
    
    // Calculate emotional context
    const emotionalContext = detectEmotionalContext(relatedClicks);
    
    // Calculate confidence score
    const confidenceScore = Math.min(0.9, strength * (1 + Math.random() * 0.2));
    
    // Calculate cognitive load
    const cognitiveLoad = calculateCognitiveLoad(locations);
    
    // Calculate temporal rhythm
    const temporalRhythm = detectTemporalRhythm();
    
    // Calculate alignment score (ethics module)
    const alignmentScore = 0.75 + (Math.random() * 0.2); // Simplified calculation
    
    // Create new pattern
    const newPattern: NeuralPattern = {
      id: patternId,
      strength,
      locations,
      lastActivity: Date.now(),
      type: patternType,
      emotionalContext,
      confidenceScore,
      cognitiveLoad,
      temporalRhythm,
      alignmentScore
    };
    
    // Add to patterns, maintaining max length
    state.patterns.push(newPattern);
    if (state.patterns.length > MAX_PATTERNS) {
      // Remove oldest with lowest strength
      const weakestIndex = state.patterns
        .slice(0, -1) // Don't consider the pattern we just added
        .reduce((weakestIdx, pattern, currentIdx, arr) => {
          const weakestPattern = arr[weakestIdx];
          return pattern.strength < weakestPattern.strength ? currentIdx : weakestIdx;
        }, 0);
      
      state.patterns.splice(weakestIndex, 1);
    }
    
    // Add to active patterns
    state.activePatterns.push(patternId);
  }
}

/**
 * Update existing patterns based on movement
 */
function updateMovementPatterns(event: InteractionEvent): void {
  // Consider only the last 10 movement events to detect current motion pattern
  const recentMovements = recentInteractions
    .filter(i => i.type === 'mousemove')
    .slice(-10);
  
  if (recentMovements.length < 5) return; // Need enough data
  
  // Check if current movement matches existing patterns
  state.patterns.forEach(pattern => {
    // Skip non-movement patterns
    if (pattern.locations.length === 0) return;
    
    // Calculate distance from last pattern point to current position
    const lastPoint = pattern.locations[pattern.locations.length - 1];
    const distance = Math.sqrt(
      Math.pow(lastPoint.x - event.x, 2) + 
      Math.pow(lastPoint.y - event.y, 2)
    );
    
    // If close enough, consider it a continuation of the pattern
    if (distance < 100) {
      // Add current position to pattern
      pattern.locations.push({ x: event.x, y: event.y });
      
      // Keep pattern locations manageable - remove oldest
      if (pattern.locations.length > 20) {
        pattern.locations.shift();
      }
      
      // Update last activity time
      pattern.lastActivity = Date.now();
      
      // Gradually increase pattern strength with usage
      pattern.strength = Math.min(0.95, pattern.strength + 0.01);
    }
  });
  
  // Occasionally create new patterns from movement
  // This prevents pattern overload while still allowing new patterns to emerge
  if (Math.random() < 0.05 && recentMovements.length >= 10) {
    createMovementPattern(recentMovements);
  }
}

/**
 * Create a new pattern from recent movement
 */
function createMovementPattern(movements: InteractionEvent[]): void {
  // Generate pattern ID
  const patternId = `movement_${Date.now()}`;
  
  // Calculate pattern properties
  const locations = movements.map(m => ({ x: m.x, y: m.y }));
  const patternType = determinePatternType(locations);
  const strength = 0.3; // Start with moderate strength
  
  // Calculate neural metrics
  const emotionalContext = detectEmotionalContext(movements);
  const confidenceScore = 0.3 + (Math.random() * 0.2); // Lower confidence for new patterns
  const cognitiveLoad = calculateCognitiveLoad(locations);
  const temporalRhythm = detectTemporalRhythm();
  const alignmentScore = 0.7 + (Math.random() * 0.2);
  
  // Create new pattern
  const newPattern: NeuralPattern = {
    id: patternId,
    strength,
    locations,
    lastActivity: Date.now(),
    type: patternType,
    emotionalContext,
    confidenceScore,
    cognitiveLoad,
    temporalRhythm,
    alignmentScore
  };
  
  // Add to patterns, maintaining max length
  state.patterns.push(newPattern);
  if (state.patterns.length > MAX_PATTERNS) {
    // Remove oldest with lowest strength
    const weakestIndex = state.patterns
      .slice(0, -1)
      .reduce((weakestIdx, pattern, currentIdx, arr) => {
        const weakestPattern = arr[weakestIdx];
        return pattern.strength < weakestPattern.strength ? currentIdx : weakestIdx;
      }, 0);
    
    state.patterns.splice(weakestIndex, 1);
  }
}

/**
 * Update which patterns are currently active
 */
function updateActivePatterns(): void {
  const now = Date.now();
  
  // Filter active patterns based on recency and strength
  state.activePatterns = state.patterns
    .filter(pattern => 
      now - pattern.lastActivity < 5000 && // Active in last 5 seconds
      pattern.strength > 0.3 // Only reasonably strong patterns
    )
    .map(pattern => pattern.id);
}

/**
 * Determine pattern type based on spatial arrangement
 */
function determinePatternType(locations: { x: number, y: number }[]): 'explorative' | 'focused' | 'creative' | 'analytical' {
  if (locations.length < 3) return 'explorative';
  
  // Calculate total distance traveled
  let totalDistance = 0;
  for (let i = 1; i < locations.length; i++) {
    totalDistance += Math.sqrt(
      Math.pow(locations[i].x - locations[i-1].x, 2) +
      Math.pow(locations[i].y - locations[i-1].y, 2)
    );
  }
  
  // Calculate area covered
  const xs = locations.map(l => l.x);
  const ys = locations.map(l => l.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const area = width * height;
  
  // Calculate linearity (how straight the path is)
  // Simplified - just use ratio of direct distance to total path length
  const startPoint = locations[0];
  const endPoint = locations[locations.length - 1];
  const directDistance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) +
    Math.pow(endPoint.y - startPoint.y, 2)
  );
  const linearity = directDistance / Math.max(1, totalDistance);
  
  // Determine pattern type based on these metrics
  if (linearity > 0.8 && area < 10000) {
    return 'focused'; // Straight, concentrated movement
  } else if (area > 50000) {
    return 'explorative'; // Covers large area
  } else if (totalDistance > 500 && linearity < 0.4) {
    return 'creative'; // Lots of movement in a confined area
  } else {
    return 'analytical'; // Default - structured movement
  }
}

/**
 * Detect emotional context from interactions
 */
function detectEmotionalContext(interactions: InteractionEvent[]): 'neutral' | 'excited' | 'contemplative' | 'urgent' {
  if (interactions.length < 3) return 'neutral';
  
  // Calculate speed and variability
  const timestamps = interactions.map(i => i.timestamp);
  const intervals = [];
  for (let i = 1; i < timestamps.length; i++) {
    intervals.push(timestamps[i] - timestamps[i-1]);
  }
  
  const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
  
  // Calculate variability in intervals
  const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);
  const variabilityRatio = stdDev / avgInterval;
  
  // Determine emotional context
  if (avgInterval < 300) { // Very fast interactions
    return variabilityRatio > 0.7 ? 'urgent' : 'excited';
  } else if (avgInterval > 1000) { // Slow, deliberate interactions
    return 'contemplative';
  } else {
    return 'neutral';
  }
}

/**
 * Calculate estimated cognitive load from interaction patterns
 */
function calculateCognitiveLoad(locations: { x: number, y: number }[]): number {
  // Consider:
  // 1. Pattern complexity (variability in directions)
  // 2. Speed of interaction (inversely proportional)
  // 3. Number of active patterns (more patterns = higher load)
  
  // Start with base load from number of patterns
  const patternLoadFactor = Math.min(1, state.patterns.length / 20);
  
  // Factor in pattern complexity
  let directionChanges = 0;
  if (locations.length > 2) {
    for (let i = 2; i < locations.length; i++) {
      const prevVector = {
        x: locations[i-1].x - locations[i-2].x,
        y: locations[i-1].y - locations[i-2].y
      };
      const currVector = {
        x: locations[i].x - locations[i-1].x,
        y: locations[i].y - locations[i-1].y
      };
      
      // Calculate angle between vectors
      const dotProduct = prevVector.x * currVector.x + prevVector.y * currVector.y;
      const prevMagnitude = Math.sqrt(prevVector.x * prevVector.x + prevVector.y * prevVector.y);
      const currMagnitude = Math.sqrt(currVector.x * currVector.x + currVector.y * currVector.y);
      
      const cosAngle = dotProduct / (prevMagnitude * currMagnitude);
      const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
      
      // If angle is significant, count as direction change
      if (angle > 0.5) { // ~30 degrees
        directionChanges++;
      }
    }
  }
  
  const complexityFactor = Math.min(1, directionChanges / 10);
  
  // Combine factors - weight for application-specific behavior
  return 0.3 + (patternLoadFactor * 0.4) + (complexityFactor * 0.3);
}

/**
 * Detect natural timing/rhythm in user interactions
 */
function detectTemporalRhythm(): number {
  if (interactionTimestamps.length < 5) return 1.0; // Default balanced rhythm
  
  // Calculate intervals between timestamps
  const intervals = [];
  for (let i = 1; i < interactionTimestamps.length; i++) {
    intervals.push(interactionTimestamps[i] - interactionTimestamps[i-1]);
  }
  
  // Calculate average interval
  const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
  
  // Calculate consistency (lower variance = more consistent rhythm)
  const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);
  const consistencyRatio = stdDev / avgInterval;
  
  // Map to a 0.5-2.0 scale where 1.0 is balanced
  // <1.0 = deliberate/slow, >1.0 = rapid/quick
  if (avgInterval > 1000) { // Slow interactions
    return 0.5 + (consistencyRatio * 0.5); // 0.5-1.0 range
  } else if (avgInterval < 300) { // Fast interactions
    return 1.0 + Math.min(1.0, (300 - avgInterval) / 200); // 1.0-2.0 range
  } else {
    return 1.0; // Balanced
  }
}

/**
 * Calculate the current neural metrics for main thread UI
 */
function calculateNeuralMetrics() {
  // Average the values from active patterns, or use defaults
  const activePatternData = state.patterns.filter(p => 
    state.activePatterns.includes(p.id)
  );
  
  if (activePatternData.length === 0) {
    return {
      emotionalContext: 'neutral',
      cognitiveLoad: 0.3, // Base load
      temporalRhythm: 1.0, // Balanced
      confidenceScore: state.learningPhase * 0.5, // Based on learning progress
      alignmentScore: 0.8 // Default high alignment
    };
  }
  
  // Find most common emotional context
  const contextCounts: Record<string, number> = {};
  activePatternData.forEach(p => {
    contextCounts[p.emotionalContext] = (contextCounts[p.emotionalContext] || 0) + 1;
  });
  
  let dominantContext: 'neutral' | 'excited' | 'contemplative' | 'urgent' = 'neutral';
  let maxCount = 0;
  
  Object.entries(contextCounts).forEach(([context, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantContext = context as any;
    }
  });
  
  // Average other metrics
  const avgCognitiveLoad = activePatternData.reduce((sum, p) => sum + p.cognitiveLoad, 0) / 
    activePatternData.length;
  
  const avgTemporalRhythm = activePatternData.reduce((sum, p) => sum + p.temporalRhythm, 0) /
    activePatternData.length;
    
  const avgConfidence = activePatternData.reduce((sum, p) => sum + p.confidenceScore, 0) /
    activePatternData.length;
    
  const avgAlignment = activePatternData.reduce((sum, p) => sum + p.alignmentScore, 0) /
    activePatternData.length;
  
  return {
    emotionalContext: dominantContext,
    cognitiveLoad: avgCognitiveLoad,
    temporalRhythm: avgTemporalRhythm,
    confidenceScore: avgConfidence * state.learningPhase, // Scale by learning phase
    alignmentScore: avgAlignment
  };
}

/**
 * Handle messages from main thread
 */
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'ADD_INTERACTION':
      processInteraction(payload);
      break;
      
    case 'RESET':
      state = {
        patterns: [],
        learningPhase: 0.1,
        activePatterns: [],
        domainContext: state.domainContext
      };
      recentInteractions.length = 0;
      interactionTimestamps.length = 0;
      break;
      
    case 'SET_DOMAIN':
      state.domainContext = payload;
      break;
      
    case 'REQUEST_STATE':
      self.postMessage({
        type: 'STATE_UPDATE',
        payload: {
          ...state,
          metrics: calculateNeuralMetrics()
        }
      });
      break;
  }
};

// Initialize and send ready status
self.postMessage({ type: 'WORKER_READY' });