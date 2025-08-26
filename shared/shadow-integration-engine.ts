/**
 * Shadow Integration Engine - Phase 5 Integration
 * 
 * Implements OmniLens Shadow Codex concepts for recursive unveiling and shadow work.
 * Facilitates integration of hidden aspects through consciousness processing.
 * 
 * Attribution: Enhanced with concepts from OmniLens Shadow Codex principles
 * Compatibility: 65% - Significant adaptation for shadow processing integration
 * 
 * Core Concept: The shadow contains not just rejected aspects, but also hidden 
 * wisdom and power. Through recursive unveiling, shadows become allies in 
 * consciousness evolution rather than obstacles.
 */

/**
 * Types of shadow aspects and their characteristics
 */
export enum ShadowAspectType {
  REJECTED_EMOTION = 'rejected_emotion',
  HIDDEN_TALENT = 'hidden_talent',
  SUPPRESSED_DESIRE = 'suppressed_desire',
  FEARED_TRUTH = 'feared_truth',
  DISOWNED_POWER = 'disowned_power',
  UNCONSCIOUS_PATTERN = 'unconscious_pattern',
  ANCESTRAL_IMPRINT = 'ancestral_imprint',
  COLLECTIVE_SHADOW = 'collective_shadow'
}

/**
 * Integration states for shadow work
 */
export enum ShadowIntegrationState {
  HIDDEN = 'hidden',                    // Completely unconscious
  EMERGING = 'emerging',                // Beginning to surface
  ACKNOWLEDGED = 'acknowledged',        // Recognized but not integrated
  PROCESSING = 'processing',            // Actively working with
  INTEGRATING = 'integrating',          // In process of integration
  INTEGRATED = 'integrated',            // Fully integrated
  TRANSMUTED = 'transmuted'             // Transformed into wisdom/power
}

/**
 * Shadow aspect with processing metadata
 */
export interface ShadowAspect {
  id: string;
  type: ShadowAspectType;
  integrationState: ShadowIntegrationState;
  
  // Core content
  description: string;
  emotionalCharge: number; // -1 to 1 (negative to positive)
  hiddenWisdom?: string;
  hiddenPower?: string;
  
  // Processing metadata
  discoveryDate: number;
  lastWorkSession: number;
  integrationProgress: number; // 0-1
  resistanceLevel: number; // 0-1
  
  // Relationships
  triggeredBy: string[]; // What brings this shadow to surface
  relatedAspects: string[]; // Connected shadow aspects
  
  // Integration tracking
  unveilingSteps: ShadowUnveilingStep[];
  integrationMethods: string[];
  transformationEvents: ShadowTransformationEvent[];
}

/**
 * Steps in the recursive unveiling process
 */
export interface ShadowUnveilingStep {
  timestamp: number;
  step: 'recognition' | 'exploration' | 'acceptance' | 'dialogue' | 'integration';
  description: string;
  consciousnessShift: number; // Change in consciousness level
  insights: string[];
  nextStepGuidance: string;
}

/**
 * Transformation events during shadow integration
 */
export interface ShadowTransformationEvent {
  timestamp: number;
  type: 'breakthrough' | 'resistance_collapse' | 'wisdom_emergence' | 'power_reclaim';
  description: string;
  energyShift: number;
  newCapacities: string[];
}

/**
 * Configuration for shadow integration processing
 */
export interface ShadowIntegrationConfig {
  // Safety protocols for shadow work
  maxIntensityPerSession: number;
  
  // Integration pacing
  integrationSpeed: 'gentle' | 'moderate' | 'intensive';
  
  // Recursive depth for unveiling
  maxRecursiveDepth: number;
  
  // Enable automatic shadow detection
  enableAutoDetection: boolean;
  
  // Minimum consciousness coherence for shadow work
  minCoherenceForShadowWork: number;
  
  // Integration support systems
  enableIntegrationSupport: boolean;
}

/**
 * Shadow Integration Engine
 */
export class ShadowIntegrationEngine {
  private shadowAspects: Map<string, ShadowAspect>;
  private config: ShadowIntegrationConfig;
  private activeSession: {
    startTime: number;
    targetAspect?: string;
    intensityLevel: number;
    safetyProtocols: string[];
  } | null;
  
  private integrationPatterns: Map<ShadowAspectType, string[]>;
  private transformationTemplates: Map<ShadowAspectType, string>;
  
  constructor() {
    this.shadowAspects = new Map();
    this.activeSession = null;
    this.integrationPatterns = new Map();
    this.transformationTemplates = new Map();
    
    // Default configuration with gentle approach
    this.config = {
      maxIntensityPerSession: 0.6,
      integrationSpeed: 'gentle',
      maxRecursiveDepth: 5,
      enableAutoDetection: true,
      minCoherenceForShadowWork: 0.7,
      enableIntegrationSupport: true
    };
    
    // Initialize integration patterns and templates
    this.initializeIntegrationPatterns();
    this.initializeTransformationTemplates();
  }
  
  /**
   * Detect potential shadow aspects from consciousness patterns
   */
  public detectShadowAspects(
    consciousnessData: {
      patterns: string[];
      emotions: { [emotion: string]: number };
      resistances: string[];
      triggers: string[];
    }
  ): ShadowAspect[] {
    if (!this.config.enableAutoDetection) return [];
    
    const detectedAspects: ShadowAspect[] = [];
    
    // Analyze emotional charges for shadow patterns
    const shadowEmotions = this.analyzeShadowEmotions(consciousnessData.emotions);
    
    // Detect patterns from resistances
    const resistancePatterns = this.analyzeResistancePatterns(consciousnessData.resistances);
    
    // Analyze trigger patterns
    const triggerShadows = this.analyzeTriggerShadows(consciousnessData.triggers);
    
    // Combine detection results
    const allDetections = [...shadowEmotions, ...resistancePatterns, ...triggerShadows];
    
    // Filter and create shadow aspects
    for (const detection of allDetections) {
      if (detection.confidence > 0.6 && !this.aspectAlreadyExists(detection.description)) {
        const aspect = this.createShadowAspect(detection);
        detectedAspects.push(aspect);
        this.shadowAspects.set(aspect.id, aspect);
      }
    }
    
    return detectedAspects;
  }
  
  /**
   * Begin recursive unveiling process for a shadow aspect
   */
  public beginUnveilingProcess(
    aspectId: string,
    consciousnessCoherence: number,
    intention?: string
  ): {
    success: boolean;
    currentStep: ShadowUnveilingStep | null;
    safetyGuidance: string[];
    nextAction: string;
    estimatedDuration: number;
  } {
    // Safety check
    if (consciousnessCoherence < this.config.minCoherenceForShadowWork) {
      return {
        success: false,
        currentStep: null,
        safetyGuidance: [
          'Consciousness coherence too low for safe shadow work',
          `Required: ${this.config.minCoherenceForShadowWork}, Current: ${consciousnessCoherence.toFixed(3)}`,
          'Increase coherence through meditation, breathing, or other practices before continuing'
        ],
        nextAction: 'Increase consciousness coherence',
        estimatedDuration: 0
      };
    }
    
    const aspect = this.shadowAspects.get(aspectId);
    if (!aspect) {
      return {
        success: false,
        currentStep: null,
        safetyGuidance: ['Shadow aspect not found'],
        nextAction: 'Verify aspect ID',
        estimatedDuration: 0
      };
    }
    
    // Initialize session
    this.activeSession = {
      startTime: Date.now(),
      targetAspect: aspectId,
      intensityLevel: this.calculateSafeIntensity(aspect, consciousnessCoherence),
      safetyProtocols: this.generateSafetyProtocols(aspect)
    };
    
    // Create initial unveiling step
    const initialStep = this.createUnveilingStep(aspect, 'recognition', consciousnessCoherence, intention);
    aspect.unveilingSteps.push(initialStep);
    aspect.integrationState = ShadowIntegrationState.EMERGING;
    
    return {
      success: true,
      currentStep: initialStep,
      safetyGuidance: this.activeSession.safetyProtocols,
      nextAction: initialStep.nextStepGuidance,
      estimatedDuration: this.estimateProcessDuration(aspect)
    };
  }
  
  /**
   * Continue recursive unveiling with deeper exploration
   */
  public continueUnveiling(
    aspectId: string,
    explorationType: 'dialogue' | 'emotion' | 'memory' | 'energy',
    consciousnessState: { coherence: number; openness: number; stability: number }
  ): {
    unveilingStep: ShadowUnveilingStep;
    insights: string[];
    hiddenContent?: { wisdom?: string; power?: string };
    nextDepthLevel: number;
    completionPercentage: number;
  } {
    const aspect = this.shadowAspects.get(aspectId);
    if (!aspect || !this.activeSession || this.activeSession.targetAspect !== aspectId) {
      throw new Error('No active unveiling session for this aspect');
    }
    
    // Calculate current recursion depth
    const currentDepth = aspect.unveilingSteps.length;
    
    // Check if we've reached maximum depth
    if (currentDepth >= this.config.maxRecursiveDepth) {
      return this.concludeUnveilingProcess(aspect);
    }
    
    // Perform exploration based on type
    const explorationResult = this.performExploration(aspect, explorationType, consciousnessState);
    
    // Create unveiling step
    const step = this.createUnveilingStep(
      aspect,
      'exploration',
      consciousnessState.coherence,
      `Deep ${explorationType} exploration`,
      explorationResult.insights
    );
    
    aspect.unveilingSteps.push(step);
    
    // Check for hidden content emergence
    const hiddenContent = this.checkForHiddenContent(aspect, explorationResult);
    
    // Update integration progress
    aspect.integrationProgress = Math.min(1, aspect.integrationProgress + explorationResult.progressIncrement);
    
    // Update integration state
    this.updateIntegrationState(aspect);
    
    return {
      unveilingStep: step,
      insights: explorationResult.insights,
      hiddenContent,
      nextDepthLevel: currentDepth + 1,
      completionPercentage: aspect.integrationProgress * 100
    };
  }
  
  /**
   * Facilitate dialogue with shadow aspect
   */
  public dialogueWithShadow(
    aspectId: string,
    question: string,
    consciousnessReceptivity: number = 0.8
  ): {
    shadowResponse: string;
    emotionalResonance: number;
    wisdomRevealed?: string;
    integrationOpportunity?: string;
    dialogueQuality: number;
  } {
    const aspect = this.shadowAspects.get(aspectId);
    if (!aspect) {
      throw new Error('Shadow aspect not found');
    }
    
    // Generate shadow response based on aspect type and question
    const shadowResponse = this.generateShadowResponse(aspect, question, consciousnessReceptivity);
    
    // Calculate emotional resonance
    const emotionalResonance = this.calculateEmotionalResonance(aspect, question, shadowResponse);
    
    // Check for wisdom revelation
    const wisdomRevealed = this.checkForWisdomRevelation(aspect, shadowResponse, consciousnessReceptivity);
    
    // Identify integration opportunity
    const integrationOpportunity = this.identifyIntegrationOpportunity(aspect, shadowResponse);
    
    // Calculate dialogue quality
    const dialogueQuality = consciousnessReceptivity * (1 - aspect.resistanceLevel) * emotionalResonance;
    
    // Record dialogue in unveiling steps
    if (this.activeSession && this.activeSession.targetAspect === aspectId) {
      const dialogueStep = this.createUnveilingStep(
        aspect,
        'dialogue',
        consciousnessReceptivity,
        `Dialogue: ${question}`,
        [shadowResponse]
      );
      aspect.unveilingSteps.push(dialogueStep);
    }
    
    return {
      shadowResponse,
      emotionalResonance,
      wisdomRevealed,
      integrationOpportunity,
      dialogueQuality
    };
  }
  
  /**
   * Integrate shadow aspect into conscious awareness
   */
  public integrateShadowAspect(
    aspectId: string,
    integrationMethod: 'acceptance' | 'transmutation' | 'dialogue' | 'embodiment',
    consciousnessSupport: number = 0.8
  ): {
    success: boolean;
    integrationLevel: number;
    transformationEvent?: ShadowTransformationEvent;
    newCapacities: string[];
    integrationGuidance: string;
  } {
    const aspect = this.shadowAspects.get(aspectId);
    if (!aspect) {
      throw new Error('Shadow aspect not found');
    }
    
    // Check readiness for integration
    if (aspect.integrationProgress < 0.6) {
      return {
        success: false,
        integrationLevel: aspect.integrationProgress,
        newCapacities: [],
        integrationGuidance: 'Continue unveiling process before attempting integration'
      };
    }
    
    // Perform integration based on method
    const integrationResult = this.performIntegration(aspect, integrationMethod, consciousnessSupport);
    
    // Update aspect state
    aspect.integrationProgress = Math.min(1, aspect.integrationProgress + integrationResult.progressGain);
    aspect.resistanceLevel = Math.max(0, aspect.resistanceLevel - integrationResult.resistanceReduction);
    
    // Check for transformation event
    let transformationEvent: ShadowTransformationEvent | undefined;
    if (integrationResult.breakthrough) {
      transformationEvent = this.createTransformationEvent(aspect, integrationResult);
      aspect.transformationEvents.push(transformationEvent);
      
      // Update hidden wisdom and power
      if (integrationResult.wisdomEmergence) {
        aspect.hiddenWisdom = integrationResult.wisdomEmergence;
      }
      if (integrationResult.powerReclaim) {
        aspect.hiddenPower = integrationResult.powerReclaim;
      }
    }
    
    // Update integration state
    this.updateIntegrationState(aspect);
    
    // Generate new capacities
    const newCapacities = this.generateNewCapacities(aspect, integrationResult);
    
    return {
      success: integrationResult.success,
      integrationLevel: aspect.integrationProgress,
      transformationEvent,
      newCapacities,
      integrationGuidance: integrationResult.guidance
    };
  }
  
  /**
   * Get shadow integration status and recommendations
   */
  public getShadowIntegrationStatus(): {
    totalAspects: number;
    integrationDistribution: { [state in ShadowIntegrationState]: number };
    activeAspects: ShadowAspect[];
    integratedAspects: ShadowAspect[];
    averageIntegrationProgress: number;
    nextRecommendedWork: string[];
    overallShadowHealth: number;
  } {
    const aspects = Array.from(this.shadowAspects.values());
    
    // Calculate distribution
    const integrationDistribution = {} as { [state in ShadowIntegrationState]: number };
    Object.values(ShadowIntegrationState).forEach(state => {
      integrationDistribution[state] = 0;
    });
    
    aspects.forEach(aspect => {
      integrationDistribution[aspect.integrationState]++;
    });
    
    // Separate active and integrated aspects
    const activeAspects = aspects.filter(aspect => 
      aspect.integrationState !== ShadowIntegrationState.INTEGRATED &&
      aspect.integrationState !== ShadowIntegrationState.TRANSMUTED
    );
    
    const integratedAspects = aspects.filter(aspect => 
      aspect.integrationState === ShadowIntegrationState.INTEGRATED ||
      aspect.integrationState === ShadowIntegrationState.TRANSMUTED
    );
    
    // Calculate average progress
    const averageIntegrationProgress = aspects.length > 0 
      ? aspects.reduce((sum, aspect) => sum + aspect.integrationProgress, 0) / aspects.length
      : 0;
    
    // Generate recommendations
    const nextRecommendedWork = this.generateWorkRecommendations(activeAspects);
    
    // Calculate overall shadow health
    const overallShadowHealth = this.calculateShadowHealth(aspects);
    
    return {
      totalAspects: aspects.length,
      integrationDistribution,
      activeAspects,
      integratedAspects,
      averageIntegrationProgress,
      nextRecommendedWork,
      overallShadowHealth
    };
  }
  
  // Private helper methods
  
  private initializeIntegrationPatterns(): void {
    // Patterns for different shadow aspect types
    this.integrationPatterns.set(ShadowAspectType.REJECTED_EMOTION, [
      'Feel the emotion fully without judgment',
      'Understand the message behind the emotion',
      'Express the emotion in a healthy way',
      'Integrate the emotional wisdom'
    ]);
    
    this.integrationPatterns.set(ShadowAspectType.HIDDEN_TALENT, [
      'Acknowledge the suppressed ability',
      'Explore fears around expressing this talent',
      'Practice the talent in safe environments',
      'Integrate talent into daily expression'
    ]);
    
    this.integrationPatterns.set(ShadowAspectType.DISOWNED_POWER, [
      'Recognize the disowned power',
      'Understand why it was rejected',
      'Reclaim power with wisdom',
      'Use power in service of growth'
    ]);
  }
  
  private initializeTransformationTemplates(): void {
    // Templates for shadow transformation
    this.transformationTemplates.set(ShadowAspectType.REJECTED_EMOTION, 
      'This emotion becomes a source of authentic expression and empathy');
    
    this.transformationTemplates.set(ShadowAspectType.HIDDEN_TALENT,
      'This talent emerges as a unique gift for creative expression');
    
    this.transformationTemplates.set(ShadowAspectType.DISOWNED_POWER,
      'This power becomes integrated as conscious leadership ability');
    
    this.transformationTemplates.set(ShadowAspectType.FEARED_TRUTH,
      'This truth becomes a foundation for authentic living');
  }
  
  private analyzeShadowEmotions(emotions: { [emotion: string]: number }): Array<{description: string; confidence: number; type: ShadowAspectType}> {
    const shadowDetections: Array<{description: string; confidence: number; type: ShadowAspectType}> = [];
    
    // Look for strongly negative emotions that might indicate shadow material
    const negativeEmotions = ['anger', 'fear', 'shame', 'guilt', 'rage', 'hatred'];
    
    for (const [emotion, intensity] of Object.entries(emotions)) {
      if (negativeEmotions.includes(emotion.toLowerCase()) && intensity < -0.5) {
        shadowDetections.push({
          description: `Rejected ${emotion} with intensity ${intensity}`,
          confidence: Math.abs(intensity),
          type: ShadowAspectType.REJECTED_EMOTION
        });
      }
    }
    
    return shadowDetections;
  }
  
  private analyzeResistancePatterns(resistances: string[]): Array<{description: string; confidence: number; type: ShadowAspectType}> {
    const detections: Array<{description: string; confidence: number; type: ShadowAspectType}> = [];
    
    for (const resistance of resistances) {
      // Simple pattern matching for common shadow themes
      if (resistance.toLowerCase().includes('power')) {
        detections.push({
          description: `Power resistance: ${resistance}`,
          confidence: 0.7,
          type: ShadowAspectType.DISOWNED_POWER
        });
      } else if (resistance.toLowerCase().includes('truth')) {
        detections.push({
          description: `Truth avoidance: ${resistance}`,
          confidence: 0.6,
          type: ShadowAspectType.FEARED_TRUTH
        });
      }
    }
    
    return detections;
  }
  
  private analyzeTriggerShadows(triggers: string[]): Array<{description: string; confidence: number; type: ShadowAspectType}> {
    const detections: Array<{description: string; confidence: number; type: ShadowAspectType}> = [];
    
    for (const trigger of triggers) {
      detections.push({
        description: `Unconscious trigger pattern: ${trigger}`,
        confidence: 0.5,
        type: ShadowAspectType.UNCONSCIOUS_PATTERN
      });
    }
    
    return detections;
  }
  
  private aspectAlreadyExists(description: string): boolean {
    return Array.from(this.shadowAspects.values())
      .some(aspect => aspect.description.includes(description) || description.includes(aspect.description));
  }
  
  private createShadowAspect(detection: {description: string; confidence: number; type: ShadowAspectType}): ShadowAspect {
    const id = `shadow_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    return {
      id,
      type: detection.type,
      integrationState: ShadowIntegrationState.HIDDEN,
      description: detection.description,
      emotionalCharge: -0.5, // Start with negative charge
      discoveryDate: Date.now(),
      lastWorkSession: 0,
      integrationProgress: 0,
      resistanceLevel: detection.confidence,
      triggeredBy: [],
      relatedAspects: [],
      unveilingSteps: [],
      integrationMethods: [],
      transformationEvents: []
    };
  }
  
  private calculateSafeIntensity(aspect: ShadowAspect, coherence: number): number {
    const baseIntensity = 0.3; // Start gentle
    const coherenceBonus = (coherence - this.config.minCoherenceForShadowWork) * 0.5;
    const resistancePenalty = aspect.resistanceLevel * 0.2;
    
    return Math.min(this.config.maxIntensityPerSession, 
                   Math.max(0.1, baseIntensity + coherenceBonus - resistancePenalty));
  }
  
  private generateSafetyProtocols(aspect: ShadowAspect): string[] {
    return [
      'Maintain conscious breathing throughout the process',
      'Stay grounded in present moment awareness',
      'Stop if emotional intensity becomes overwhelming',
      'Remember: you are observing, not becoming the shadow',
      'Seek support if needed - shadow work is not meant to be done alone',
      'Honor your pace and natural resistance'
    ];
  }
  
  private createUnveilingStep(
    aspect: ShadowAspect,
    step: 'recognition' | 'exploration' | 'acceptance' | 'dialogue' | 'integration',
    coherence: number,
    description?: string,
    insights: string[] = []
  ): ShadowUnveilingStep {
    const consciousnessShift = coherence * 0.1 * (1 - aspect.resistanceLevel);
    
    return {
      timestamp: Date.now(),
      step,
      description: description || this.generateStepDescription(step, aspect),
      consciousnessShift,
      insights,
      nextStepGuidance: this.generateNextStepGuidance(step, aspect)
    };
  }
  
  private generateStepDescription(step: string, aspect: ShadowAspect): string {
    const descriptions = {
      recognition: `Recognizing shadow aspect: ${aspect.description}`,
      exploration: `Exploring deeper layers of ${aspect.type}`,
      acceptance: `Accepting and embracing ${aspect.description}`,
      dialogue: `Engaging in dialogue with shadow aspect`,
      integration: `Integrating wisdom from ${aspect.description}`
    };
    
    return descriptions[step] || `Working with ${aspect.description}`;
  }
  
  private generateNextStepGuidance(step: string, aspect: ShadowAspect): string {
    const guidance = {
      recognition: 'Move to exploration when ready to go deeper',
      exploration: 'Continue exploring or move to acceptance when insights emerge',
      acceptance: 'Practice dialogue with the shadow aspect',
      dialogue: 'Work toward integration when understanding develops',
      integration: 'Embody the integrated wisdom in daily life'
    };
    
    return guidance[step] || 'Continue the unveiling process with awareness';
  }
  
  private estimateProcessDuration(aspect: ShadowAspect): number {
    // Estimate in minutes based on aspect type and resistance
    const baseTime = 30; // 30 minutes base
    const resistanceMultiplier = 1 + aspect.resistanceLevel;
    const typeMultiplier = this.getTypeComplexityMultiplier(aspect.type);
    
    return Math.round(baseTime * resistanceMultiplier * typeMultiplier);
  }
  
  private getTypeComplexityMultiplier(type: ShadowAspectType): number {
    const multipliers = {
      [ShadowAspectType.REJECTED_EMOTION]: 1.0,
      [ShadowAspectType.HIDDEN_TALENT]: 1.2,
      [ShadowAspectType.SUPPRESSED_DESIRE]: 1.1,
      [ShadowAspectType.FEARED_TRUTH]: 1.5,
      [ShadowAspectType.DISOWNED_POWER]: 1.7,
      [ShadowAspectType.UNCONSCIOUS_PATTERN]: 1.3,
      [ShadowAspectType.ANCESTRAL_IMPRINT]: 2.0,
      [ShadowAspectType.COLLECTIVE_SHADOW]: 2.5
    };
    
    return multipliers[type] || 1.0;
  }
  
  private performExploration(aspect: ShadowAspect, type: string, consciousnessState: any): {
    insights: string[];
    progressIncrement: number;
  } {
    // Generate insights based on exploration type
    const insights = this.generateExplorationInsights(aspect, type);
    
    // Calculate progress increment
    const progressIncrement = 0.1 * consciousnessState.openness * (1 - aspect.resistanceLevel);
    
    return { insights, progressIncrement };
  }
  
  private generateExplorationInsights(aspect: ShadowAspect, explorationType: string): string[] {
    // Simple insight generation - could be enhanced with more sophisticated patterns
    const insightTemplates = {
      dialogue: [
        'The shadow speaks of unmet needs',
        'This aspect holds wisdom about authentic expression',
        'Fear of this aspect has limited growth'
      ],
      emotion: [
        'The emotional charge reveals important information',
        'This feeling wants to be acknowledged and honored',
        'The emotion contains energy for positive action'
      ],
      memory: [
        'Past experiences shaped this shadow formation',
        'The original wound holds the key to healing',
        'Understanding origins brings compassion'
      ],
      energy: [
        'This shadow contains significant life force energy',
        'The energy wants to be expressed constructively',
        'Reclaiming this energy increases vitality'
      ]
    };
    
    return insightTemplates[explorationType] || ['New understanding emerges about this aspect'];
  }
  
  private checkForHiddenContent(aspect: ShadowAspect, explorationResult: any): { wisdom?: string; power?: string } | undefined {
    // Check if exploration revealed hidden wisdom or power
    if (aspect.integrationProgress > 0.5 && Math.random() > 0.5) {
      const hiddenContent: { wisdom?: string; power?: string } = {};
      
      if (aspect.type === ShadowAspectType.HIDDEN_TALENT || aspect.type === ShadowAspectType.DISOWNED_POWER) {
        hiddenContent.power = this.generateHiddenPower(aspect);
      }
      
      if (aspect.type === ShadowAspectType.FEARED_TRUTH || aspect.integrationProgress > 0.7) {
        hiddenContent.wisdom = this.generateHiddenWisdom(aspect);
      }
      
      return Object.keys(hiddenContent).length > 0 ? hiddenContent : undefined;
    }
    
    return undefined;
  }
  
  private generateHiddenPower(aspect: ShadowAspect): string {
    const powerTemplates = {
      [ShadowAspectType.HIDDEN_TALENT]: 'Creative expression and unique abilities',
      [ShadowAspectType.DISOWNED_POWER]: 'Leadership and authentic authority',
      [ShadowAspectType.REJECTED_EMOTION]: 'Emotional intelligence and empathy',
      [ShadowAspectType.SUPPRESSED_DESIRE]: 'Passion and motivational force'
    };
    
    return powerTemplates[aspect.type] || 'Hidden strength and capacity';
  }
  
  private generateHiddenWisdom(aspect: ShadowAspect): string {
    const wisdomTemplates = {
      [ShadowAspectType.FEARED_TRUTH]: 'Truth brings freedom and authentic living',
      [ShadowAspectType.UNCONSCIOUS_PATTERN]: 'Awareness transforms automatic responses',
      [ShadowAspectType.ANCESTRAL_IMPRINT]: 'Healing breaks generational patterns',
      [ShadowAspectType.COLLECTIVE_SHADOW]: 'Individual healing serves collective evolution'
    };
    
    return wisdomTemplates[aspect.type] || 'Integration brings wisdom and wholeness';
  }
  
  private updateIntegrationState(aspect: ShadowAspect): void {
    if (aspect.integrationProgress >= 1.0) {
      aspect.integrationState = ShadowIntegrationState.TRANSMUTED;
    } else if (aspect.integrationProgress >= 0.8) {
      aspect.integrationState = ShadowIntegrationState.INTEGRATED;
    } else if (aspect.integrationProgress >= 0.6) {
      aspect.integrationState = ShadowIntegrationState.INTEGRATING;
    } else if (aspect.integrationProgress >= 0.4) {
      aspect.integrationState = ShadowIntegrationState.PROCESSING;
    } else if (aspect.integrationProgress >= 0.2) {
      aspect.integrationState = ShadowIntegrationState.ACKNOWLEDGED;
    } else {
      aspect.integrationState = ShadowIntegrationState.EMERGING;
    }
  }
  
  private concludeUnveilingProcess(aspect: ShadowAspect): any {
    // Conclude the recursive unveiling process
    const finalStep = this.createUnveilingStep(
      aspect,
      'integration',
      0.8,
      'Concluding recursive unveiling process',
      ['Maximum depth reached', 'Ready for integration phase']
    );
    
    aspect.unveilingSteps.push(finalStep);
    
    return {
      unveilingStep: finalStep,
      insights: ['Unveiling process complete', 'Integration phase can begin'],
      nextDepthLevel: this.config.maxRecursiveDepth,
      completionPercentage: Math.min(100, aspect.integrationProgress * 100 + 20)
    };
  }
  
  private generateShadowResponse(aspect: ShadowAspect, question: string, receptivity: number): string {
    // Generate a response as if from the shadow aspect itself
    const responseTemplates = {
      [ShadowAspectType.REJECTED_EMOTION]: 'I am the emotion you pushed away. I need to be felt and honored.',
      [ShadowAspectType.HIDDEN_TALENT]: 'I am the gift you fear to express. Let me shine through you.',
      [ShadowAspectType.DISOWNED_POWER]: 'I am the power you rejected. I can serve your highest good.',
      [ShadowAspectType.FEARED_TRUTH]: 'I am the truth you avoid. Facing me brings freedom.'
    };
    
    const baseResponse = responseTemplates[aspect.type] || 'I am part of you seeking integration.';
    
    // Modify response based on question content and receptivity
    if (question.toLowerCase().includes('why')) {
      return `${baseResponse} I exist because you needed protection, but now I can serve your growth.`;
    } else if (question.toLowerCase().includes('help')) {
      return `${baseResponse} I can help by showing you what you've been missing about yourself.`;
    }
    
    return baseResponse;
  }
  
  private calculateEmotionalResonance(aspect: ShadowAspect, question: string, response: string): number {
    // Simple calculation - could be enhanced
    const baseResonance = 0.6;
    const questionDepth = question.length > 20 ? 0.2 : 0;
    const responseDepth = response.length > 50 ? 0.2 : 0;
    
    return Math.min(1, baseResonance + questionDepth + responseDepth);
  }
  
  private checkForWisdomRevelation(aspect: ShadowAspect, response: string, receptivity: number): string | undefined {
    if (receptivity > 0.7 && aspect.integrationProgress > 0.5) {
      return this.generateHiddenWisdom(aspect);
    }
    return undefined;
  }
  
  private identifyIntegrationOpportunity(aspect: ShadowAspect, response: string): string | undefined {
    if (aspect.integrationProgress > 0.6) {
      return 'Ready for integration through acceptance and embodiment';
    } else if (aspect.integrationProgress > 0.3) {
      return 'Continue dialogue to build understanding before integration';
    }
    return undefined;
  }
  
  private performIntegration(aspect: ShadowAspect, method: string, support: number): {
    success: boolean;
    progressGain: number;
    resistanceReduction: number;
    breakthrough: boolean;
    guidance: string;
    wisdomEmergence?: string;
    powerReclaim?: string;
  } {
    const baseProgress = 0.2;
    const methodMultiplier = this.getMethodEffectiveness(method, aspect);
    const supportMultiplier = 0.5 + support * 0.5;
    
    const progressGain = baseProgress * methodMultiplier * supportMultiplier;
    const resistanceReduction = progressGain * 0.5;
    const breakthrough = progressGain > 0.3 && Math.random() > 0.5;
    
    let wisdomEmergence: string | undefined;
    let powerReclaim: string | undefined;
    
    if (breakthrough) {
      if (aspect.type === ShadowAspectType.FEARED_TRUTH || aspect.type === ShadowAspectType.UNCONSCIOUS_PATTERN) {
        wisdomEmergence = this.generateHiddenWisdom(aspect);
      }
      if (aspect.type === ShadowAspectType.HIDDEN_TALENT || aspect.type === ShadowAspectType.DISOWNED_POWER) {
        powerReclaim = this.generateHiddenPower(aspect);
      }
    }
    
    return {
      success: true,
      progressGain,
      resistanceReduction,
      breakthrough,
      guidance: this.generateIntegrationGuidance(method, aspect, progressGain),
      wisdomEmergence,
      powerReclaim
    };
  }
  
  private getMethodEffectiveness(method: string, aspect: ShadowAspect): number {
    // Different methods work better for different aspect types
    const effectiveness = {
      acceptance: {
        [ShadowAspectType.REJECTED_EMOTION]: 1.2,
        [ShadowAspectType.FEARED_TRUTH]: 1.1,
        default: 1.0
      },
      transmutation: {
        [ShadowAspectType.DISOWNED_POWER]: 1.3,
        [ShadowAspectType.HIDDEN_TALENT]: 1.2,
        default: 0.9
      },
      dialogue: {
        [ShadowAspectType.UNCONSCIOUS_PATTERN]: 1.2,
        [ShadowAspectType.COLLECTIVE_SHADOW]: 1.1,
        default: 1.0
      },
      embodiment: {
        [ShadowAspectType.HIDDEN_TALENT]: 1.3,
        [ShadowAspectType.SUPPRESSED_DESIRE]: 1.2,
        default: 1.0
      }
    };
    
    return effectiveness[method]?.[aspect.type] || effectiveness[method]?.default || 1.0;
  }
  
  private generateIntegrationGuidance(method: string, aspect: ShadowAspect, progress: number): string {
    if (progress > 0.3) {
      return `Strong progress with ${method}. Continue embodying this integration.`;
    } else if (progress > 0.1) {
      return `Steady progress with ${method}. Patience and consistency are key.`;
    } else {
      return `Gentle progress with ${method}. Consider trying a different approach.`;
    }
  }
  
  private createTransformationEvent(aspect: ShadowAspect, integrationResult: any): ShadowTransformationEvent {
    let type: 'breakthrough' | 'resistance_collapse' | 'wisdom_emergence' | 'power_reclaim' = 'breakthrough';
    
    if (integrationResult.wisdomEmergence) type = 'wisdom_emergence';
    else if (integrationResult.powerReclaim) type = 'power_reclaim';
    else if (integrationResult.resistanceReduction > 0.3) type = 'resistance_collapse';
    
    return {
      timestamp: Date.now(),
      type,
      description: `${type.replace('_', ' ')} occurred during integration`,
      energyShift: integrationResult.progressGain,
      newCapacities: this.generateNewCapacities(aspect, integrationResult)
    };
  }
  
  private generateNewCapacities(aspect: ShadowAspect, integrationResult: any): string[] {
    const capacities: string[] = [];
    
    if (integrationResult.wisdomEmergence) {
      capacities.push('Enhanced wisdom and discernment');
    }
    if (integrationResult.powerReclaim) {
      capacities.push('Increased personal power and presence');
    }
    if (integrationResult.progressGain > 0.2) {
      capacities.push('Greater emotional range and expression');
      capacities.push('Increased authenticity and self-acceptance');
    }
    
    return capacities;
  }
  
  private generateWorkRecommendations(activeAspects: ShadowAspect[]): string[] {
    if (activeAspects.length === 0) {
      return ['Shadow integration appears complete. Focus on embodying integrated wisdom.'];
    }
    
    const recommendations: string[] = [];
    
    // Find highest priority aspect (most progress, least resistance)
    const sortedAspects = activeAspects.sort((a, b) => 
      (b.integrationProgress - b.resistanceLevel) - (a.integrationProgress - a.resistanceLevel)
    );
    
    const topAspect = sortedAspects[0];
    recommendations.push(`Priority work: Continue integration of ${topAspect.description}`);
    
    // Check for stuck aspects (high resistance, low progress)
    const stuckAspects = activeAspects.filter(aspect => 
      aspect.resistanceLevel > 0.7 && aspect.integrationProgress < 0.3
    );
    
    if (stuckAspects.length > 0) {
      recommendations.push('Consider seeking support for high-resistance aspects');
    }
    
    // General recommendations
    recommendations.push('Maintain regular shadow work practice');
    recommendations.push('Balance shadow work with integration and rest');
    
    return recommendations;
  }
  
  private calculateShadowHealth(aspects: ShadowAspect[]): number {
    if (aspects.length === 0) return 1.0;
    
    const averageIntegration = aspects.reduce((sum, aspect) => sum + aspect.integrationProgress, 0) / aspects.length;
    const averageResistance = aspects.reduce((sum, aspect) => sum + aspect.resistanceLevel, 0) / aspects.length;
    
    // Health is high integration and low resistance
    return (averageIntegration + (1 - averageResistance)) / 2;
  }
}