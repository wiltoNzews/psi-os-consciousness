/**
 * Feature Toggle Service
 * 
 * This service enables safe experimentation with new features by providing
 * a centralized mechanism to enable/disable functionality at runtime.
 * It supports both global feature flags and context-specific toggles.
 * 
 * BOUNDARY CONSCIOUSNESS: This module explicitly manages the boundary
 * between stable and experimental features, providing clear control points
 * for system administrators and developers.
 */

// Define available features that can be toggled
export enum Feature {
  // Time/Chronos Protocol Features
  CHRONOS_HANDLER = 'chronos_handler',
  CHRONOS_STRICT_VALIDATION = 'chronos_strict_validation',
  CHRONOS_TIMEZONE_AWARENESS = 'chronos_timezone_awareness',
  CHRONOS_ADVANCED_FORMATTING = 'chronos_advanced_formatting',
  TEMPORAL_HISTORY = 'temporal_history',
  
  // Quantum Root Node Features
  QRN_ADVANCED_COHERENCE = 'qrn_advanced_coherence',
  QRN_STATE_PREDICTION = 'qrn_state_prediction',
  COHERENCE_ANALYSIS = 'coherence_analysis',
  
  // Neural Pathway Features
  NEURAL_PATHWAY_WEIGHT_ADAPTATION = 'neural_pathway_weight_adaptation',
  NEURAL_PATHWAY_DYNAMIC_ROUTING = 'neural_pathway_dynamic_routing',
  
  // Meta-Cognitive Features
  META_COGNITIVE_SELF_REFLECTION = 'meta_cognitive_self_reflection',
  META_COGNITIVE_PATTERN_RECOGNITION = 'meta_cognitive_pattern_recognition',
  
  // System Features
  ADVANCED_CACHING = 'advanced_caching',
  PERFORMANCE_METRICS = 'performance_metrics',
  
  // API Features
  REST_API_RATE_LIMITING = 'rest_api_rate_limiting',
  REST_API_VERSIONING = 'rest_api_versioning'
}

// Default feature toggle state
const DEFAULT_TOGGLES: Record<Feature, boolean> = {
  // Time/Chronos Protocol defaults
  [Feature.CHRONOS_HANDLER]: true, // Enable by default
  [Feature.CHRONOS_STRICT_VALIDATION]: false,
  [Feature.CHRONOS_TIMEZONE_AWARENESS]: false,
  [Feature.CHRONOS_ADVANCED_FORMATTING]: false,
  [Feature.TEMPORAL_HISTORY]: true, // Enable by default
  
  // QRN defaults
  [Feature.QRN_ADVANCED_COHERENCE]: false,
  [Feature.QRN_STATE_PREDICTION]: false,
  [Feature.COHERENCE_ANALYSIS]: true, // Enable by default
  
  // Neural Pathway defaults
  [Feature.NEURAL_PATHWAY_WEIGHT_ADAPTATION]: false,
  [Feature.NEURAL_PATHWAY_DYNAMIC_ROUTING]: false,
  
  // Meta-Cognitive defaults
  [Feature.META_COGNITIVE_SELF_REFLECTION]: false,
  [Feature.META_COGNITIVE_PATTERN_RECOGNITION]: false,
  
  // System defaults
  [Feature.ADVANCED_CACHING]: false,
  [Feature.PERFORMANCE_METRICS]: true, // Enable by default
  
  // API defaults
  [Feature.REST_API_RATE_LIMITING]: false,
  [Feature.REST_API_VERSIONING]: false
};

/**
 * FeatureToggleService - Manages feature toggles for the system
 */
export class FeatureToggleService {
  private static instance: FeatureToggleService;
  private toggles: Record<Feature, boolean>;
  private contextToggles: Map<string, Record<Feature, boolean>>;
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.toggles = { ...DEFAULT_TOGGLES };
    this.contextToggles = new Map();
    
    // Log initialization
    console.log('FeatureToggleService initialized with default settings');
  }
  
  /**
   * Get the singleton instance
   * 
   * @returns FeatureToggleService instance
   */
  public static getInstance(): FeatureToggleService {
    if (!FeatureToggleService.instance) {
      FeatureToggleService.instance = new FeatureToggleService();
    }
    return FeatureToggleService.instance;
  }
  
  /**
   * Check if a feature is enabled
   * 
   * @param feature Feature to check
   * @param context Optional context identifier
   * @returns True if the feature is enabled
   */
  public isEnabled(feature: Feature, context?: string): boolean {
    // If a context is provided, check context-specific toggle first
    if (context && this.contextToggles.has(context)) {
      const contextToggle = this.contextToggles.get(context);
      if (feature in contextToggle) {
        return contextToggle[feature];
      }
    }
    
    // Fall back to global toggle
    return this.toggles[feature] || false;
  }
  
  /**
   * Enable a feature
   * 
   * @param feature Feature to enable
   * @param context Optional context identifier
   */
  public enable(feature: Feature, context?: string): void {
    this.setFeatureState(feature, true, context);
    console.log(`Feature ${feature} enabled${context ? ` for context ${context}` : ''}`);
  }
  
  /**
   * Disable a feature
   * 
   * @param feature Feature to disable
   * @param context Optional context identifier
   */
  public disable(feature: Feature, context?: string): void {
    this.setFeatureState(feature, false, context);
    console.log(`Feature ${feature} disabled${context ? ` for context ${context}` : ''}`);
  }
  
  /**
   * Set the state of a feature
   * 
   * @param feature Feature to set
   * @param state Desired state (true = enabled, false = disabled)
   * @param context Optional context identifier
   */
  public setFeatureState(feature: Feature, state: boolean, context?: string): void {
    if (context) {
      // Initialize context toggles if they don't exist
      if (!this.contextToggles.has(context)) {
        this.contextToggles.set(context, { ...this.toggles });
      }
      
      // Update context-specific toggle
      const contextToggle = this.contextToggles.get(context);
      contextToggle[feature] = state;
    } else {
      // Update global toggle
      this.toggles[feature] = state;
    }
  }
  
  /**
   * Reset all toggles to default values
   * 
   * @param context Optional context identifier
   */
  public resetToDefaults(context?: string): void {
    if (context) {
      this.contextToggles.delete(context);
      console.log(`Reset toggles for context ${context} to defaults`);
    } else {
      this.toggles = { ...DEFAULT_TOGGLES };
      console.log('Reset all toggles to defaults');
    }
  }
  
  /**
   * Get the current state of all toggles
   * 
   * @param context Optional context identifier
   * @returns Current toggle state
   */
  public getToggleState(context?: string): Record<Feature, boolean> {
    if (context && this.contextToggles.has(context)) {
      return { ...this.contextToggles.get(context) };
    }
    return { ...this.toggles };
  }
  
  /**
   * Enable multiple features at once
   * 
   * @param features Features to enable
   * @param context Optional context identifier
   */
  public enableFeatures(features: Feature[], context?: string): void {
    features.forEach(feature => this.enable(feature, context));
  }
  
  /**
   * Disable multiple features at once
   * 
   * @param features Features to disable
   * @param context Optional context identifier
   */
  public disableFeatures(features: Feature[], context?: string): void {
    features.forEach(feature => this.disable(feature, context));
  }
}