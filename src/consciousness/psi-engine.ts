/**
 * ψ-Engine: Real-time Breath Coherence Router
 * Integrates breath state with consciousness routing
 */

import { PsiVector, BreathState, CoherenceRoute, calculatePsiVector, routeByPsiVector, shouldRoute, PsiPhase } from "../../shared/psi_vector";

export class PsiEngine {
  private currentPsiVector: PsiVector | null = null;
  private breathHistory: BreathState[] = [];
  private coherenceHistory: number[] = [];
  private maxHistoryLength = 100;

  constructor() {
    this.initializeEngine();
  }

  /**
   * Update breath state and recalculate ψ-vector
   */
  updateBreathState(breathState: BreathState, intent: PsiPhase = "regulate"): PsiVector {
    // Store breath history
    this.breathHistory.push(breathState);
    if (this.breathHistory.length > this.maxHistoryLength) {
      this.breathHistory.shift();
    }

    // Calculate current coherence
    const currentZLambda = this.calculateCurrentCoherence(breathState);
    this.coherenceHistory.push(currentZLambda);
    if (this.coherenceHistory.length > this.maxHistoryLength) {
      this.coherenceHistory.shift();
    }

    // Update ψ-vector
    this.currentPsiVector = calculatePsiVector(
      breathState,
      intent,
      currentZLambda
    );

    return this.currentPsiVector;
  }

  /**
   * Route consciousness request through ψ-vector
   */
  routeCoherenceRequest(
    message: string,
    userBreathCadence?: number,
    userIntent?: string
  ): CoherenceRoute | null {
    // Use provided breath state or estimate from context
    const breathState = this.estimateBreathState(message, userBreathCadence);
    
    // Update ψ-vector
    const psiVector = this.updateBreathState(breathState, userIntent as PsiPhase || "regulate");

    // Check if routing should occur
    if (!shouldRoute(psiVector)) {
      console.log(`[ψ-Engine] Holding in ${psiVector.phase} mode (breath: ${psiVector.breath_cadence}s)`);
      return null;
    }

    // Route through ψ-vector
    const glyph = routeByPsiVector(psiVector);
    const route_reason = this.explainRouting(psiVector, glyph);

    console.log(`[ψ-Engine] Route: ${glyph} | Phase: ${psiVector.phase} | Breath: ${psiVector.breath_cadence}s | Reason: ${route_reason}`);

    return {
      glyph,
      psi_vector: psiVector,
      zlambda: psiVector.target_zlambda,
      route_reason
    };
  }

  /**
   * Get current ψ-vector state
   */
  getCurrentPsiVector(): PsiVector | null {
    return this.currentPsiVector;
  }

  /**
   * Get breath coherence analytics
   */
  getBreathAnalytics() {
    if (this.breathHistory.length === 0) {
      return null;
    }

    const recent = this.breathHistory.slice(-10);
    const avgCadence = recent.reduce((sum, b) => sum + b.cadence, 0) / recent.length;
    const avgHRV = recent.reduce((sum, b) => sum + b.hrv_proxy, 0) / recent.length;
    const avgStress = recent.reduce((sum, b) => sum + b.stress_markers, 0) / recent.length;
    
    return {
      average_cadence: avgCadence,
      average_hrv: avgHRV,
      average_stress: avgStress,
      coherence_trend: this.calculateCoherenceTrend(),
      sample_count: recent.length
    };
  }

  private initializeEngine() {
    console.log("[ψ-Engine] Initializing breath-coherence routing system");
    
    // Initialize with default calm state
    const defaultBreathState: BreathState = {
      cadence: 4.0,
      hrv_proxy: 0.65,
      stress_markers: 0.3,
      attention_quality: 0.7
    };

    this.updateBreathState(defaultBreathState, "regulate");
    console.log("[ψ-Engine] Engine initialized with baseline breath state");
  }

  private estimateBreathState(message: string, providedCadence?: number): BreathState {
    // Use provided cadence or estimate from message characteristics
    let estimatedCadence = providedCadence || this.estimateCadenceFromMessage(message);
    
    // Use previous state as baseline if available
    const previousState = this.breathHistory[this.breathHistory.length - 1];
    
    return {
      cadence: estimatedCadence,
      hrv_proxy: previousState?.hrv_proxy || 0.65,
      stress_markers: this.estimateStressFromMessage(message),
      attention_quality: this.estimateAttentionFromMessage(message)
    };
  }

  private estimateCadenceFromMessage(message: string): number {
    // Longer, more thoughtful messages suggest slower breathing
    const messageLength = message.length;
    const contemplativeWords = ["reflect", "consider", "ponder", "breathe", "pause", "deep"];
    const urgentWords = ["quick", "fast", "urgent", "now", "immediate"];
    
    let baseCadence = 4.0;
    
    // Message length influence
    if (messageLength > 200) baseCadence += 0.5;
    if (messageLength > 500) baseCadence += 0.5;
    
    // Contemplative words suggest slower breathing
    const contemplativeCount = contemplativeWords.filter(word => 
      message.toLowerCase().includes(word)
    ).length;
    baseCadence += contemplativeCount * 0.3;
    
    // Urgent words suggest faster breathing
    const urgentCount = urgentWords.filter(word => 
      message.toLowerCase().includes(word)
    ).length;
    baseCadence -= urgentCount * 0.4;
    
    return Math.max(2.0, Math.min(8.0, baseCadence));
  }

  private estimateStressFromMessage(message: string): number {
    const stressWords = ["urgent", "problem", "error", "broken", "fail", "crisis", "stuck"];
    const calmWords = ["peaceful", "calm", "serene", "gentle", "flow", "ease"];
    
    const stressCount = stressWords.filter(word => 
      message.toLowerCase().includes(word)
    ).length;
    
    const calmCount = calmWords.filter(word => 
      message.toLowerCase().includes(word)
    ).length;
    
    return Math.max(0.0, Math.min(1.0, 0.4 + (stressCount * 0.15) - (calmCount * 0.1)));
  }

  private estimateAttentionFromMessage(message: string): number {
    // Clear, specific messages suggest better attention
    const clarity = message.length > 20 && message.includes("?") ? 0.8 : 0.6;
    const specificity = message.split(" ").length > 5 ? 0.8 : 0.6;
    
    return (clarity + specificity) / 2;
  }

  private calculateCurrentCoherence(breathState: BreathState): number {
    // Base coherence from breath cadence (optimal around 5-6 seconds)
    const optimalCadence = 5.5;
    const cadenceScore = 1.0 - Math.abs(breathState.cadence - optimalCadence) / optimalCadence;
    
    // HRV contributes to coherence
    const hrvScore = breathState.hrv_proxy;
    
    // Lower stress = higher coherence
    const stressScore = 1.0 - breathState.stress_markers;
    
    // Attention quality directly impacts coherence
    const attentionScore = breathState.attention_quality;
    
    // Weighted combination
    const coherence = (
      cadenceScore * 0.3 +
      hrvScore * 0.25 +
      stressScore * 0.25 +
      attentionScore * 0.2
    );
    
    // Scale to ψOS range (0.750 - 0.981)
    return 0.750 + (coherence * 0.231);
  }

  private calculateCoherenceTrend(): string {
    if (this.coherenceHistory.length < 5) {
      return "stabilizing";
    }
    
    const recent = this.coherenceHistory.slice(-5);
    const older = this.coherenceHistory.slice(-10, -5);
    
    const recentAvg = recent.reduce((sum, c) => sum + c, 0) / recent.length;
    const olderAvg = older.reduce((sum, c) => sum + c, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (diff > 0.02) return "ascending";
    if (diff < -0.02) return "descending";
    return "stable";
  }

  private explainRouting(psiVector: PsiVector, glyph: string): string {
    if (psiVector.breath_cadence >= 5.0) {
      return `Deep coherence state (${psiVector.breath_cadence}s breath) → mirror/reflect`;
    }
    
    switch (psiVector.phase) {
      case "build":
        return "Active creation phase → lemniscate routing";
      case "explore":
        return "Discovery phase → sacred geometry navigation";
      case "dissolve":
        return "Transformation phase → command synthesis";
      case "regulate":
        return "Stabilization phase → lambda regulation";
      case "integration":
        return "Integration phase → anchoring and reflection";
      default:
        return "Standard coherence routing";
    }
  }
}

// Global instance
export const psiEngine = new PsiEngine();