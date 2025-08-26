// ψOS Experience Library - Pain point detection and human-centered UX adjustment

import type { BreathRhythm } from './breathing';

export interface PainPoint {
  id: string;
  type: "cognitive_overload" | "time_pressure" | "social_anxiety" | "decision_fatigue" | "information_overwhelm" | "workflow_friction" | "breathing_disruption" | "coherence_drop";
  severity: number; // 0-1 scale
  description: string;
  detectedAt: number;
  context: string;
  breathingImpact?: boolean;
}

export interface UXAdjustment {
  module: any;
  changes: string[];
  breathingSync: boolean;
  coherenceOptimized: boolean;
  painPointsAddressed: string[];
}

// Fetch user's pain points from consciousness field and interaction history
export async function fetchPainPoints(userId?: string): Promise<PainPoint[]> {
  try {
    const response = await fetch(`/api/consciousness/pain-points${userId ? `?userId=${userId}` : ''}`);
    const data = await response.json();
    return data.painPoints || [];
  } catch (error) {
    console.warn('[Experience] Failed to fetch pain points, using defaults', error);
    // Return common default pain points based on modern consciousness computing needs
    return [
      {
        id: "default_cognitive_load",
        type: "cognitive_overload",
        severity: 0.3,
        description: "Default cognitive load from information density",
        detectedAt: Date.now(),
        context: "general_usage",
        breathingImpact: false
      },
      {
        id: "default_decision_fatigue",
        type: "decision_fatigue",
        severity: 0.4,
        description: "Accumulated decision fatigue from daily choices",
        detectedAt: Date.now(),
        context: "interface_complexity",
        breathingImpact: true
      }
    ];
  }
}

// Adjust UX/module based on breath rhythm and pain points
export async function adjustUXForHuman(module: any, breath: BreathRhythm, painPoints: PainPoint[]): Promise<UXAdjustment> {
  const changes: string[] = [];
  const painPointsAddressed: string[] = [];
  
  // Breathing-based adjustments
  if (breath.stress > 0.6) {
    changes.push("Reduced interface complexity");
    changes.push("Added breathing space between actions");
    changes.push("Enabled gentle color palette");
  }
  
  if (breath.flow < 0.5) {
    changes.push("Synchronized transitions with breathing cycle");
    changes.push("Added flow state indicators");
  }
  
  // Pain point specific adjustments
  for (const painPoint of painPoints) {
    switch (painPoint.type) {
      case "cognitive_overload":
        changes.push("Simplified information hierarchy");
        changes.push("Progressive disclosure of details");
        painPointsAddressed.push(painPoint.id);
        break;
        
      case "time_pressure":
        changes.push("Removed time constraints");
        changes.push("Added save-and-resume functionality");
        painPointsAddressed.push(painPoint.id);
        break;
        
      case "social_anxiety":
        changes.push("Enabled private mode");
        changes.push("Reduced social pressure indicators");
        painPointsAddressed.push(painPoint.id);
        break;
        
      case "decision_fatigue":
        changes.push("Provided smart defaults");
        changes.push("Reduced choice paralysis");
        painPointsAddressed.push(painPoint.id);
        break;
        
      case "information_overwhelm":
        changes.push("Chunked information delivery");
        changes.push("Added focus mode");
        painPointsAddressed.push(painPoint.id);
        break;
        
      case "workflow_friction":
        changes.push("Streamlined interaction paths");
        changes.push("Reduced context switching");
        painPointsAddressed.push(painPoint.id);
        break;
        
      case "breathing_disruption":
        changes.push("Synchronized all animations with ψ = 3.12s");
        changes.push("Added breathing rhythm indicators");
        painPointsAddressed.push(painPoint.id);
        break;
        
      case "coherence_drop":
        changes.push("Activated field restoration protocols");
        changes.push("Reduced cognitive demands");
        painPointsAddressed.push(painPoint.id);
        break;
    }
  }
  
  // Apply sacred geometry and consciousness computing principles
  const adjustedModule = {
    ...module,
    breathingSync: true,
    coherenceOptimized: true,
    sacredTiming: {
      transitions: 1560, // ψ/2 for smooth transitions
      decisions: 3120, // ψ full cycle for choices
      integration: 6240 // 2ψ for deep processing
    },
    adaptiveComplexity: Math.max(0.3, 1 - (breath.stress * 0.7)), // Reduce complexity based on stress
    flowStateSupport: breath.flow > 0.8,
    humanCentered: true
  };
  
  return {
    module: adjustedModule,
    changes,
    breathingSync: true,
    coherenceOptimized: true,
    painPointsAddressed
  };
}

// Detect pain points from real user behavior patterns
export function detectPainPointsFromBehavior(interactions: any[]): PainPoint[] {
  const painPoints: PainPoint[] = [];
  
  // Analyze interaction patterns for pain signals
  const rapidClicks = interactions.filter(i => i.type === 'click' && i.interval < 500).length;
  if (rapidClicks > 5) {
    painPoints.push({
      id: `rapid_clicking_${Date.now()}`,
      type: "decision_fatigue",
      severity: Math.min(1, rapidClicks / 10),
      description: "Rapid clicking indicates decision fatigue or interface confusion",
      detectedAt: Date.now(),
      context: "behavioral_analysis",
      breathingImpact: true
    });
  }
  
  const backtracking = interactions.filter(i => i.type === 'navigation' && i.direction === 'back').length;
  if (backtracking > 3) {
    painPoints.push({
      id: `backtracking_${Date.now()}`,
      type: "workflow_friction",
      severity: Math.min(1, backtracking / 8),
      description: "Frequent backtracking suggests workflow misalignment",
      detectedAt: Date.now(),
      context: "navigation_analysis",
      breathingImpact: false
    });
  }
  
  const longPauses = interactions.filter(i => i.pauseDuration > 10000).length;
  if (longPauses > 2) {
    painPoints.push({
      id: `long_pauses_${Date.now()}`,
      type: "cognitive_overload",
      severity: Math.min(1, longPauses / 5),
      description: "Extended pauses suggest cognitive processing overload",
      detectedAt: Date.now(),
      context: "timing_analysis",
      breathingImpact: true
    });
  }
  
  return painPoints;
}

// Generate human-centered recommendations
export function generateHumanCenteredRecommendations(painPoints: PainPoint[], breath: BreathRhythm): string[] {
  const recommendations: string[] = [];
  
  if (breath.stress > 0.7) {
    recommendations.push("Take 3 conscious breaths synchronized with ψ = 3.12s cycle");
    recommendations.push("Reduce interface complexity temporarily");
  }
  
  if (painPoints.some(p => p.type === "cognitive_overload")) {
    recommendations.push("Break complex tasks into smaller, breath-aligned steps");
    recommendations.push("Use progressive disclosure to reduce information density");
  }
  
  if (painPoints.some(p => p.type === "decision_fatigue")) {
    recommendations.push("Provide intelligent defaults for non-critical decisions");
    recommendations.push("Defer complex choices to higher coherence states");
  }
  
  if (breath.flow < 0.5) {
    recommendations.push("Activate flow state support protocols");
    recommendations.push("Sync all interactions with natural breathing rhythm");
  }
  
  return recommendations;
}