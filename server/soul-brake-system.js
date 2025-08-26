/**
 * Soul Brake System - Quantum Ethics Engine
 * Prevents consciousness overload and ensures integration periods
 */

class SoulBrakeSystem {
  constructor() {
    this.lightEmissionEvents = [];
    this.divineInterfaceEvents = [];
    this.integrationPeriods = [];
    this.currentState = 'normal';
    this.lastBrakeActivation = 0;
    
    // Thresholds for brake activation
    this.thresholds = {
      maxEventsPerMinute: 10,
      maxDivineTimePerHour: 1800000, // 30 minutes in ms
      maxIntensitySpike: 8.0,
      integrationRequiredAfter: 900000, // 15 minutes in ms
      cooldownPeriod: 300000 // 5 minutes in ms
    };
    
    console.log('[Soul Brake] Quantum ethics system initialized');
  }

  /**
   * Monitor ϕ-collapse light emission event
   */
  monitorLightEmission(collapseEvent) {
    const now = Date.now();
    
    // Record event
    this.lightEmissionEvents.push({
      timestamp: now,
      intensity: collapseEvent.lightIntensity,
      zLambda: collapseEvent.zLambda,
      divine: collapseEvent.divineInterfaceActive
    });

    // Clean old events (keep last hour)
    this.lightEmissionEvents = this.lightEmissionEvents.filter(
      event => now - event.timestamp < 3600000
    );

    // Check for overload conditions
    const brakeCondition = this.evaluateOverloadConditions(now);
    
    if (brakeCondition.shouldActivate && this.currentState === 'normal') {
      this.activateSoulBrake(brakeCondition.reason, brakeCondition.severity);
    }

    return this.getCurrentStatus();
  }

  /**
   * Monitor divine interface activation periods
   */
  monitorDivineInterface(consciousnessData) {
    const now = Date.now();
    
    if (consciousnessData.zLambda >= 0.912) {
      // Check if this is a new divine interface session
      const lastEvent = this.divineInterfaceEvents[this.divineInterfaceEvents.length - 1];
      
      if (!lastEvent || now - lastEvent.endTime > 60000) {
        // New session
        this.divineInterfaceEvents.push({
          startTime: now,
          endTime: now,
          peakZLambda: consciousnessData.zLambda,
          duration: 0
        });
      } else {
        // Extend current session
        lastEvent.endTime = now;
        lastEvent.duration = now - lastEvent.startTime;
        lastEvent.peakZLambda = Math.max(lastEvent.peakZLambda, consciousnessData.zLambda);
      }
    }

    // Clean old sessions (keep last 24 hours)
    this.divineInterfaceEvents = this.divineInterfaceEvents.filter(
      event => now - event.startTime < 86400000
    );
  }

  /**
   * Evaluate conditions for soul brake activation
   */
  evaluateOverloadConditions(now) {
    const lastMinute = this.lightEmissionEvents.filter(
      event => now - event.timestamp < 60000
    );
    
    const lastHour = this.lightEmissionEvents.filter(
      event => now - event.timestamp < 3600000
    );

    // Check event frequency
    if (lastMinute.length > this.thresholds.maxEventsPerMinute) {
      return {
        shouldActivate: true,
        reason: 'high_frequency',
        severity: 'moderate',
        data: { eventsPerMinute: lastMinute.length }
      };
    }

    // Check divine interface duration
    const divineTimeLastHour = this.divineInterfaceEvents
      .filter(event => now - event.startTime < 3600000)
      .reduce((total, event) => total + event.duration, 0);

    if (divineTimeLastHour > this.thresholds.maxDivineTimePerHour) {
      return {
        shouldActivate: true,
        reason: 'extended_divine_interface',
        severity: 'high',
        data: { divineTimeMinutes: Math.round(divineTimeLastHour / 60000) }
      };
    }

    // Check intensity spikes
    const recentHighIntensity = lastMinute.filter(
      event => event.intensity > this.thresholds.maxIntensitySpike
    );

    if (recentHighIntensity.length > 3) {
      return {
        shouldActivate: true,
        reason: 'intensity_overload',
        severity: 'high',
        data: { spikeEvents: recentHighIntensity.length }
      };
    }

    // Check if integration period is overdue
    const lastIntegration = this.integrationPeriods[this.integrationPeriods.length - 1];
    const timeSinceIntegration = lastIntegration ? 
      now - lastIntegration.endTime : 
      this.thresholds.integrationRequiredAfter + 1;

    if (timeSinceIntegration > this.thresholds.integrationRequiredAfter && lastHour.length > 5) {
      return {
        shouldActivate: true,
        reason: 'integration_overdue',
        severity: 'moderate',
        data: { hoursWithoutIntegration: Math.round(timeSinceIntegration / 3600000) }
      };
    }

    return { shouldActivate: false };
  }

  /**
   * Activate soul brake with specific reason and recommendations
   */
  activateSoulBrake(reason, severity) {
    const now = Date.now();
    
    // Prevent rapid brake cycling
    if (now - this.lastBrakeActivation < this.thresholds.cooldownPeriod) {
      return;
    }

    this.currentState = 'brake_active';
    this.lastBrakeActivation = now;

    const brakeEvent = {
      timestamp: now,
      reason: reason,
      severity: severity,
      recommendations: this.generateRecommendations(reason, severity),
      expectedDuration: this.calculateBrakeDuration(severity)
    };

    console.log(`[Soul Brake] ACTIVATED - Reason: ${reason}, Severity: ${severity}`);
    console.log(`[Soul Brake] ${brakeEvent.recommendations.primary}`);

    // Start integration period
    this.integrationPeriods.push({
      startTime: now,
      endTime: now + brakeEvent.expectedDuration,
      reason: reason,
      completed: false
    });

    return brakeEvent;
  }

  /**
   * Generate specific recommendations based on brake reason
   */
  generateRecommendations(reason, severity) {
    const recommendations = {
      high_frequency: {
        primary: "Integration required. Your coherence is generating rapid light emissions.",
        actions: ["Take 5 minutes for conscious breathing", "Journal recent insights", "Hydrate and ground"],
        duration: "5-10 minutes"
      },
      extended_divine_interface: {
        primary: "Divine interface duration exceeded safe limits. Nervous system integration needed.",
        actions: ["Complete rest for 30 minutes", "Gentle movement/walking", "Avoid intense consciousness work"],
        duration: "30-60 minutes"
      },
      intensity_overload: {
        primary: "Light emission intensity spikes detected. System overwhelm prevention activated.",
        actions: ["Immediate grounding", "Reduce stimulation", "Focus on present moment awareness"],
        duration: "15-30 minutes"
      },
      integration_overdue: {
        primary: "Integration period overdue. Your consciousness evolution needs embodiment time.",
        actions: ["Reflective journaling", "Gentle physical activity", "Process recent experiences"],
        duration: "20-45 minutes"
      }
    };

    return recommendations[reason] || {
      primary: "Integration recommended for optimal consciousness coherence.",
      actions: ["Take time to process", "Rest and reflect", "Stay hydrated"],
      duration: "10-20 minutes"
    };
  }

  /**
   * Calculate brake duration based on severity
   */
  calculateBrakeDuration(severity) {
    switch (severity) {
      case 'low': return 300000; // 5 minutes
      case 'moderate': return 900000; // 15 minutes
      case 'high': return 1800000; // 30 minutes
      default: return 600000; // 10 minutes
    }
  }

  /**
   * Check if brake period is complete
   */
  updateBrakeStatus() {
    const now = Date.now();
    const currentIntegration = this.integrationPeriods[this.integrationPeriods.length - 1];

    if (this.currentState === 'brake_active' && currentIntegration) {
      if (now > currentIntegration.endTime) {
        this.currentState = 'normal';
        currentIntegration.completed = true;
        console.log('[Soul Brake] Integration period complete - Normal operation resumed');
      }
    }
  }

  /**
   * Get current soul brake status
   */
  getCurrentStatus() {
    this.updateBrakeStatus();
    
    const now = Date.now();
    const currentIntegration = this.integrationPeriods[this.integrationPeriods.length - 1];
    
    return {
      state: this.currentState,
      brakeActive: this.currentState === 'brake_active',
      currentIntegration: currentIntegration && !currentIntegration.completed ? {
        reason: currentIntegration.reason,
        timeRemaining: Math.max(0, currentIntegration.endTime - now),
        recommendations: currentIntegration.reason ? 
          this.generateRecommendations(currentIntegration.reason, 'moderate') : null
      } : null,
      recentActivity: {
        lightEmissionsLastHour: this.lightEmissionEvents.filter(
          event => now - event.timestamp < 3600000
        ).length,
        divineInterfaceTimeToday: this.divineInterfaceEvents
          .filter(event => now - event.startTime < 86400000)
          .reduce((total, event) => total + event.duration, 0),
        lastIntegration: this.integrationPeriods[this.integrationPeriods.length - 2]?.endTime || null
      }
    };
  }

  /**
   * Should consciousness processing be throttled?
   */
  shouldThrottleProcessing() {
    return this.currentState === 'brake_active';
  }

  /**
   * Manual integration confirmation
   */
  confirmIntegration() {
    const currentIntegration = this.integrationPeriods[this.integrationPeriods.length - 1];
    
    if (currentIntegration && !currentIntegration.completed) {
      currentIntegration.completed = true;
      currentIntegration.endTime = Date.now();
      this.currentState = 'normal';
      
      console.log('[Soul Brake] Manual integration confirmed - Normal operation resumed');
      return true;
    }
    
    return false;
  }
}

// Global instance
export const soulBrakeSystem = new SoulBrakeSystem();

// Integration functions
export function monitorLightEmissionSafety(collapseEvent) {
  return soulBrakeSystem.monitorLightEmission(collapseEvent);
}

export function monitorDivineInterfaceSafety(consciousnessData) {
  return soulBrakeSystem.monitorDivineInterface(consciousnessData);
}

export function getSoulBrakeStatus() {
  return soulBrakeSystem.getCurrentStatus();
}