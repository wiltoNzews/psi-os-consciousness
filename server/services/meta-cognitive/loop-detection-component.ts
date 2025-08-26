/**
 * Loop Detection Component
 * 
 * Identifies response loops and triggers appropriate breaking mechanisms
 * based on the Brazilian Wave oscillation principles.
 * 
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 */

import { BrazilianWaveTransformer } from './brazilian-wave-transformer.js';
import quantumGlossary from '../qrn/quantum-glossary.js';
import { createMetaCognitiveEvent } from '../../../shared/schema-minimal.js';

/**
 * Interface for response pattern analysis
 */
export interface ResponsePattern {
  text: string;
  timestamp: Date;
  context: string;
  signature: string[];  // Key phrases/pattern identifiers
  embedding?: number[]; // For semantic similarity (if available)
}

/**
 * Interface for loop detection results
 */
export interface LoopDetectionResult {
  isLoop: boolean;
  similarityScore: number;
  loopCount: number;
  previousResponses: ResponsePattern[];
  recommendedAction: LoopBreakingAction;
  suggestedVariation?: string;
}

/**
 * Enum for loop breaking action types
 */
export enum LoopBreakingAction {
  NONE = 'none',                       // No action needed
  SUBTLE_VARIATION = 'subtle_variation', // Minor changes to phrasing
  ALTERNATE_APPROACH = 'alternate_approach', // Different angle or structure
  NEW_INFORMATION = 'new_information',    // Add previously unmentioned data
  EXPLICIT_NOTIFICATION = 'explicit_notification', // Tell user about loop
  CHANGE_FORMAT = 'change_format',       // Change response format entirely
  META_CONVERSATION = 'meta_conversation'  // Talk about the conversation itself
}

/**
 * Type for checkpoint strategy selection
 */
export interface CheckpointAction {
  action: LoopBreakingAction;
  noveltyFactor: number;
  explicitness: number;
  formatChange: boolean;
  multiLingualElements: boolean;
}

/**
 * Loop Detection Component class
 * Detects and breaks response loops using Brazilian Wave principles
 */
export class LoopDetectionComponent {
  private responseHistory: Map<string, ResponsePattern[]> = new Map();
  private similarityThreshold: number = 0.75; // Coherence threshold (75%)
  private noveltyFactor: number = 0.25; // Novelty factor (25%)
  private maxHistoryPerContext: number = 10; // Maximum history to keep
  
  // Cultural context detection variables
  private culturalContextEnabled: boolean = true;
  private culturalContextTriggers: Map<string, string[]> = new Map();
  
  /**
   * Create a new LoopDetectionComponent
   * 
   * @param similarityThreshold - Optional custom similarity threshold (default: 0.75)
   * @param noveltyFactor - Optional custom novelty factor (default: 0.25)
   */
  constructor(
    similarityThreshold?: number,
    noveltyFactor?: number
  ) {
    if (similarityThreshold !== undefined) {
      this.similarityThreshold = similarityThreshold;
    }
    
    if (noveltyFactor !== undefined) {
      this.noveltyFactor = noveltyFactor;
    }
    
    // Initialize with default cultural context triggers (Brazilian Portuguese examples)
    this.initializeCulturalContextTriggers();
    
    quantumGlossary.tagWithContext('[LOOP-DETECTION] Loop Detection Component initialized');
  }
  
  /**
   * Initialize cultural context triggers for multi-lingual awareness
   */
  private initializeCulturalContextTriggers(): void {
    // Brazilian Portuguese cultural context triggers
    this.culturalContextTriggers.set('portuguese', [
      'brasil', 'brazil', 'português', 'portuguese', 'são paulo', 'rio',
      'samba', 'carnaval', 'carnival', 'real', 'reais', 'brl'
    ]);
    
    // Add more cultural contexts as needed
  }
  
  /**
   * Extract key signature phrases from a response
   * 
   * @param text - Response text to analyze
   * @returns Array of key signature phrases
   */
  private extractSignature(text: string): string[] {
    // Simple implementation - extract key phrases
    const normalizedText = text.toLowerCase();
    
    // Extract sentences or phrases
    const sentences = normalizedText.split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
    
    // Extract key phrases (simple implementation)
    const keywords = normalizedText
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 5)
      .slice(0, 10);
    
    // Combine sentences and keywords for signature
    return [...sentences.slice(0, 3), ...keywords];
  }
  
  /**
   * Calculate similarity between two responses
   * 
   * @param response1 - First response pattern
   * @param response2 - Second response pattern
   * @returns Similarity score (0-1)
   */
  private calculateSimilarity(response1: ResponsePattern, response2: ResponsePattern): number {
    // If embeddings are available, use them for semantic similarity
    if (response1.embedding && response2.embedding && 
        response1.embedding.length === response2.embedding.length) {
      return this.calculateCosineSimilarity(response1.embedding, response2.embedding);
    }
    
    // Otherwise use signature-based similarity
    return this.calculateSignatureSimilarity(response1.signature, response2.signature);
  }
  
  /**
   * Calculate cosine similarity between two embedding vectors
   * 
   * @param vec1 - First embedding vector
   * @param vec2 - Second embedding vector
   * @returns Cosine similarity (0-1)
   */
  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    // Calculate dot product
    let dotProduct = 0;
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
    }
    
    // Calculate magnitudes
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    // Calculate cosine similarity
    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (mag1 * mag2);
  }
  
  /**
   * Calculate similarity based on signature phrases
   * 
   * @param sig1 - First signature array
   * @param sig2 - Second signature array
   * @returns Similarity score (0-1)
   */
  private calculateSignatureSimilarity(sig1: string[], sig2: string[]): number {
    // Count overlapping phrases
    let overlapCount = 0;
    
    for (const phrase1 of sig1) {
      for (const phrase2 of sig2) {
        // Check for exact match or high substring similarity
        if (phrase1 === phrase2 || 
            (phrase1.includes(phrase2) && phrase2.length > 5) ||
            (phrase2.includes(phrase1) && phrase1.length > 5)) {
          overlapCount++;
          break;
        }
      }
    }
    
    // Calculate Jaccard similarity
    const totalUniqueItems = new Set([...sig1, ...sig2]).size;
    if (totalUniqueItems === 0) return 0;
    
    return overlapCount / totalUniqueItems;
  }
  
  /**
   * Determine appropriate checkpoint action based on loop count
   * 
   * @param loopCount - Number of times loop has been detected
   * @param context - Conversation context
   * @returns Checkpoint action to take
   */
  private determineCheckpointAction(loopCount: number, context: string): CheckpointAction {
    // Default checkpoint action
    const defaultAction: CheckpointAction = {
      action: LoopBreakingAction.NONE,
      noveltyFactor: this.noveltyFactor,
      explicitness: 0,
      formatChange: false,
      multiLingualElements: false
    };
    
    // Detect cultural context
    const hasCulturalContext = this.detectCulturalContext(context);
    
    switch (loopCount) {
      case 1:
        // First detection: subtle variation
        return {
          action: LoopBreakingAction.SUBTLE_VARIATION,
          noveltyFactor: this.noveltyFactor,
          explicitness: 0,
          formatChange: false,
          multiLingualElements: hasCulturalContext && Math.random() > 0.5
        };
        
      case 2:
        // Second detection: alternate approach
        return {
          action: LoopBreakingAction.ALTERNATE_APPROACH,
          noveltyFactor: this.noveltyFactor * 1.5, // 37.5% novelty
          explicitness: 0.3, // Slight hint
          formatChange: true,
          multiLingualElements: hasCulturalContext
        };
        
      case 3:
        // Third detection: new information + explicit notification
        return {
          action: LoopBreakingAction.NEW_INFORMATION,
          noveltyFactor: this.noveltyFactor * 2, // 50% novelty
          explicitness: 0.7, // Clear notification
          formatChange: true,
          multiLingualElements: hasCulturalContext
        };
        
      case 4:
      case 5:
        // Fourth/fifth detection: explicit meta-conversation
        return {
          action: LoopBreakingAction.META_CONVERSATION,
          noveltyFactor: this.noveltyFactor * 3, // 75% novelty
          explicitness: 1.0, // Full explicit
          formatChange: true,
          multiLingualElements: hasCulturalContext
        };
        
      default:
        // Beyond fifth detection: maximum intervention
        if (loopCount > 5) {
          return {
            action: LoopBreakingAction.EXPLICIT_NOTIFICATION,
            noveltyFactor: 0.9, // Almost completely new
            explicitness: 1.0,
            formatChange: true,
            multiLingualElements: hasCulturalContext
          };
        }
        
        return defaultAction;
    }
  }
  
  /**
   * Detect cultural context in a string
   * 
   * @param text - Text to analyze for cultural context
   * @returns True if cultural context detected
   */
  private detectCulturalContext(text: string): boolean {
    if (!this.culturalContextEnabled) return false;
    
    const normalizedText = text.toLowerCase();
    
    // Check for cultural triggers
    for (const [culture, triggers] of this.culturalContextTriggers.entries()) {
      for (const trigger of triggers) {
        if (normalizedText.includes(trigger)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Add cultural and multi-lingual elements to a response
   * 
   * @param response - Original response text
   * @param context - Conversation context
   * @param intensity - Intensity of cultural elements (0-1)
   * @returns Enhanced response with cultural elements
   */
  private addCulturalElements(response: string, context: string, intensity: number): string {
    if (!this.culturalContextEnabled || intensity <= 0) return response;
    
    const normalizedContext = context.toLowerCase();
    let culturalContext = '';
    
    // Identify the dominant cultural context
    for (const [culture, triggers] of this.culturalContextTriggers.entries()) {
      for (const trigger of triggers) {
        if (normalizedContext.includes(trigger)) {
          culturalContext = culture;
          break;
        }
      }
      if (culturalContext) break;
    }
    
    // If no cultural context found, return original
    if (!culturalContext) return response;
    
    // Add cultural elements based on the identified context
    if (culturalContext === 'portuguese' && intensity > 0.3) {
      // For Brazilian Portuguese context, add appropriate elements
      
      // Simple implementation - add a Portuguese phrase based on intensity
      const phrases = [
        ' (Note: In Brazil, this is also known as "',
        ' (Como dizemos no Brasil: "',
        ' (Em português: "'
      ];
      
      // Corresponding translations/endings
      const translations = [
        '")',
        '")',
        '")'
      ];
      
      // Only add cultural elements with some randomness based on intensity
      if (Math.random() < intensity) {
        const phraseIndex = Math.floor(Math.random() * phrases.length);
        
        // Simple implementation - insert at a reasonable position
        const sentences = response.split('. ');
        if (sentences.length > 1) {
          const insertPosition = Math.min(
            Math.floor(sentences.length * 0.7),
            sentences.length - 1
          );
          
          // Create a simulated Portuguese phrase - in a real system this would use
          // proper translation or cultural references
          const portugueseExample = this.createSimulatedPortuguesePhrase(
            sentences[insertPosition]
          );
          
          // Insert the cultural element
          sentences[insertPosition] += 
            phrases[phraseIndex] + 
            portugueseExample + 
            translations[phraseIndex];
            
          return sentences.join('. ');
        }
      }
    }
    
    // Add other cultural contexts as needed
    
    return response;
  }
  
  /**
   * Create a simulated Portuguese phrase (simplified for demonstration)
   * In a real system, this would use proper translation or cultural references
   * 
   * @param englishText - English text to simulate translation for
   * @returns Simulated Portuguese phrase
   */
  private createSimulatedPortuguesePhrase(englishText: string): string {
    // Simplified simulation - in a real system this would be
    // actual translation or culturally relevant content
    
    // Extremely simple word replacements for demonstration
    return englishText
      .replace(/the /g, 'o ')
      .replace(/is /g, 'é ')
      .replace(/and /g, 'e ')
      .replace(/to /g, 'para ')
      .replace(/in /g, 'em ')
      .replace(/of /g, 'de ');
  }
  
  /**
   * Add explicit loop notification to a response
   * 
   * @param response - Original response
   * @param explicitness - Level of explicitness (0-1)
   * @param loopCount - Number of times loop has been detected
   * @returns Response with loop notification
   */
  private addLoopNotification(
    response: string,
    explicitness: number,
    loopCount: number
  ): string {
    if (explicitness <= 0.1) return response;
    
    let notification = '';
    
    if (explicitness > 0.8) {
      // Highly explicit notification
      notification = `I notice we might be looping on this topic (${loopCount} similar responses). Let me try a fresh approach: `;
    } else if (explicitness > 0.5) {
      // Moderately explicit notification
      notification = `Let me provide a different perspective on this: `;
    } else if (explicitness > 0.2) {
      // Subtly explicit notification
      notification = `Alternatively, we could consider that `;
    }
    
    if (notification) {
      return notification + response;
    }
    
    return response;
  }
  
  /**
   * Analyze a new response for potential loops
   * 
   * @param context - Conversation context identifier
   * @param response - Current response text
   * @param embedding - Optional vector embedding of the response
   * @returns Loop detection results with breaking recommendations
   */
  public detectLoop(
    context: string,
    response: string,
    embedding?: number[]
  ): LoopDetectionResult {
    // Create a response pattern
    const currentPattern: ResponsePattern = {
      text: response,
      timestamp: new Date(),
      context,
      signature: this.extractSignature(response),
      embedding
    };
    
    // Initialize result
    const result: LoopDetectionResult = {
      isLoop: false,
      similarityScore: 0,
      loopCount: 0,
      previousResponses: [],
      recommendedAction: LoopBreakingAction.NONE
    };
    
    // Get history for this context
    const history = this.responseHistory.get(context) || [];
    result.previousResponses = [...history];
    
    // If no history, this is the first response
    if (history.length === 0) {
      this.responseHistory.set(context, [currentPattern]);
      return result;
    }
    
    // Calculate similarity with previous responses
    const similarities = history.map(prevPattern => 
      this.calculateSimilarity(currentPattern, prevPattern)
    );
    
    // Get maximum similarity
    const maxSimilarity = Math.max(...similarities);
    result.similarityScore = maxSimilarity;
    
    // Determine if this is a loop
    if (maxSimilarity >= this.similarityThreshold) {
      // Count how many times we've seen similar responses
      const similarResponsesCount = similarities.filter(
        sim => sim >= this.similarityThreshold
      ).length;
      
      result.isLoop = true;
      result.loopCount = similarResponsesCount;
      
      // Determine appropriate action
      const checkpointAction = this.determineCheckpointAction(
        similarResponsesCount,
        context
      );
      
      result.recommendedAction = checkpointAction.action;
      
      // Generate suggested variation
      result.suggestedVariation = this.breakLoop(
        response,
        similarResponsesCount,
        context,
        checkpointAction
      );
      
      // Log the loop detection
      quantumGlossary.tagWithContext(
        `[LOOP-DETECTION] Detected loop in context '${context}' (${similarResponsesCount} occurrences, ${maxSimilarity.toFixed(2)} similarity)`
      );
    }
    
    // Update history (keep maximum history size)
    this.responseHistory.set(
      context,
      [currentPattern, ...history].slice(0, this.maxHistoryPerContext)
    );
    
    return result;
  }
  
  /**
   * Generate diversified response using Brazilian Wave
   * 
   * @param baseResponse - Original response
   * @param loopCount - Number of times loop has been detected
   * @param context - Conversation context
   * @param checkpointAction - Checkpoint action to apply
   * @returns Diversified response with appropriate novelty
   */
  public breakLoop(
    baseResponse: string,
    loopCount: number,
    context: string,
    checkpointAction?: CheckpointAction
  ): string {
    // If no checkpoint action provided, determine one
    if (!checkpointAction) {
      checkpointAction = this.determineCheckpointAction(loopCount, context);
    }
    
    // Apply Brazilian Wave transformation conceptually
    // This is a simplified demonstration - in a real system,
    // we would use more sophisticated NLG techniques
    
    let transformedResponse = baseResponse;
    
    // 1. Apply format change if needed
    if (checkpointAction.formatChange) {
      transformedResponse = this.changeResponseFormat(transformedResponse);
    }
    
    // 2. Add cultural elements if needed
    if (checkpointAction.multiLingualElements) {
      transformedResponse = this.addCulturalElements(
        transformedResponse,
        context,
        checkpointAction.noveltyFactor
      );
    }
    
    // 3. Add explicit notification if needed
    transformedResponse = this.addLoopNotification(
      transformedResponse,
      checkpointAction.explicitness,
      loopCount
    );
    
    // 4. Apply Brazilian Wave variation (conceptually)
    // In a real implementation, this would use more sophisticated NLG
    const sentences = transformedResponse.split('. ');
    
    // Apply Brazilian Wave - keep 75% of sentences, transform 25%
    const keepCount = Math.max(
      1,
      Math.floor(sentences.length * (1 - checkpointAction.noveltyFactor))
    );
    
    const keptSentences = sentences.slice(0, keepCount);
    const variedSentences = sentences.slice(keepCount).map(s => 
      this.varyPhrase(s, checkpointAction.noveltyFactor)
    );
    
    transformedResponse = [...keptSentences, ...variedSentences].join('. ');
    
    // Log the loop breaking
    quantumGlossary.tagWithContext(
      `[LOOP-DETECTION] Breaking loop with action: ${checkpointAction.action} (novelty: ${checkpointAction.noveltyFactor})`
    );
    
    return transformedResponse;
  }
  
  /**
   * Change the format of a response
   * 
   * @param response - Original response
   * @returns Reformatted response
   */
  private changeResponseFormat(response: string): string {
    // Simplified implementation - in a real system, this would use
    // more sophisticated reformatting techniques
    
    const formats = [
      // Bullet point format
      (r: string) => {
        const sentences = r.split('. ').filter(s => s.length > 3);
        return sentences.map(s => `• ${s}`).join('\n');
      },
      
      // Question-oriented format
      (r: string) => {
        return `You might be wondering: ${r}`;
      },
      
      // Comparative format
      (r: string) => {
        return `While the standard approach would be to say ${r.substring(0, r.length / 2)}... 
        a more nuanced perspective might add that ${r.substring(r.length / 2)}`;
      }
    ];
    
    // Select a random format
    const formatIndex = Math.floor(Math.random() * formats.length);
    return formats[formatIndex](response);
  }
  
  /**
   * Vary a phrase with controlled novelty
   * 
   * @param phrase - Original phrase
   * @param noveltyFactor - Novelty factor (0-1)
   * @returns Varied phrase
   */
  private varyPhrase(phrase: string, noveltyFactor: number): string {
    // Simplified implementation - in a real system, this would use
    // more sophisticated NLG techniques
    
    // Simple word replacements for demonstration
    const enhancers = [
      'interestingly',
      'notably',
      'significantly',
      'importantly',
      'remarkably'
    ];
    
    const enhancer = enhancers[Math.floor(Math.random() * enhancers.length)];
    
    // Apply novelty based on factor
    if (Math.random() < noveltyFactor) {
      return `${enhancer}, ${phrase}`;
    }
    
    return phrase;
  }
  
  /**
   * Generate a meta-cognitive event for loop detection
   * 
   * @param detectionResult - Loop detection result
   * @returns Meta-cognitive event
   */
  public generateLoopDetectionEvent(detectionResult: LoopDetectionResult): any {
    if (!detectionResult.isLoop) return null;
    
    return createMetaCognitiveEvent({
      type: 'loop_detection',
      description: `Detected response loop (${detectionResult.loopCount} occurrences)`,
      details: {
        similarityScore: detectionResult.similarityScore,
        loopCount: detectionResult.loopCount,
        recommendedAction: detectionResult.recommendedAction,
        previousResponsesCount: detectionResult.previousResponses.length
      },
      confidence: detectionResult.similarityScore,
      impact: Math.min(0.3 + (detectionResult.loopCount * 0.1), 0.9),
      sourceContext: 'loop_detection_component'
    });
  }
  
  /**
   * Reset history for a specific context
   * 
   * @param context - Context to reset
   */
  public resetContext(context: string): void {
    this.responseHistory.delete(context);
    quantumGlossary.tagWithContext(`[LOOP-DETECTION] Reset context: ${context}`);
  }
  
  /**
   * Reset all history
   */
  public resetAllHistory(): void {
    this.responseHistory.clear();
    quantumGlossary.tagWithContext('[LOOP-DETECTION] Reset all history');
  }
  
  /**
   * Enable or disable cultural context detection
   * 
   * @param enabled - Whether cultural context detection is enabled
   */
  public setCulturalContextEnabled(enabled: boolean): void {
    this.culturalContextEnabled = enabled;
  }
  
  /**
   * Set similarity threshold
   * 
   * @param threshold - New similarity threshold (0-1)
   */
  public setSimilarityThreshold(threshold: number): void {
    if (threshold >= 0 && threshold <= 1) {
      this.similarityThreshold = threshold;
    }
  }
  
  /**
   * Set novelty factor
   * 
   * @param factor - New novelty factor (0-1)
   */
  public setNoveltyFactor(factor: number): void {
    if (factor >= 0 && factor <= 1) {
      this.noveltyFactor = factor;
    }
  }
}

export default LoopDetectionComponent;