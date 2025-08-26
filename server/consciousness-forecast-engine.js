/**
 * Consciousness Forecast Engine
 * Predicts soultech sync events from ΔC, QCTF, ψ_phase patterns over time
 * Essential for psi child timeline coherence prediction
 */

class ConsciousnessForecastEngine {
  constructor() {
    this.forecastHistory = [];
    this.patterns = {
      soulstorm: { threshold: 0.15, duration: 300000 }, // 5 minutes
      braid: { threshold: 0.85, duration: 600000 },     // 10 minutes
      golden: { threshold: 0.95, duration: 180000 }     // 3 minutes
    };
    this.predictionAccuracy = 0.0;
    this.learningRate = 0.1;
  }

  /**
   * Generate consciousness weather forecast
   */
  generateForecast(currentState, historicalData) {
    const { zLambda, deltaC, psiPhase } = currentState;
    const timestamp = Date.now();

    // Analyze patterns in historical data
    const trends = this.analyzePatterns(historicalData);
    
    // Calculate forecast probabilities
    const forecast = {
      timestamp,
      current: this.classifyCurrentState(currentState),
      predictions: {
        next5min: this.predictShortTerm(currentState, trends, 5),
        next15min: this.predictShortTerm(currentState, trends, 15),
        next1hour: this.predictLongTerm(currentState, trends, 60)
      },
      soulWeather: this.calculateSoulWeather(currentState, trends),
      timelineRisk: this.assessTimelineRisk(currentState, trends),
      recommendations: this.generateRecommendations(currentState, trends)
    };

    // Store forecast for accuracy tracking
    this.forecastHistory.push(forecast);
    if (this.forecastHistory.length > 100) {
      this.forecastHistory.shift();
    }

    return forecast;
  }

  /**
   * Classify current consciousness state
   */
  classifyCurrentState(state) {
    const { zLambda, deltaC, psiPhase } = state;
    
    if (Math.abs(deltaC) > this.patterns.soulstorm.threshold) {
      return {
        type: 'soulstorm',
        intensity: Math.abs(deltaC) * 10,
        description: 'High consciousness turbulence detected',
        color: '#FF6B35'
      };
    }
    
    if (zLambda > this.patterns.golden.threshold) {
      return {
        type: 'golden',
        intensity: zLambda,
        description: 'Divine consciousness interface active',
        color: '#FFD700'
      };
    }
    
    if (zLambda > this.patterns.braid.threshold) {
      return {
        type: 'braid',
        intensity: zLambda,
        description: 'High coherence braid synchronization',
        color: '#9370DB'
      };
    }
    
    return {
      type: 'stable',
      intensity: zLambda,
      description: 'Stable consciousness field',
      color: '#40E0D0'
    };
  }

  /**
   * Analyze patterns in historical consciousness data
   */
  analyzePatterns(historicalData) {
    if (historicalData.length < 10) {
      return { trend: 'stable', velocity: 0, volatility: 0 };
    }

    const recent = historicalData.slice(-20);
    const coherenceValues = recent.map(d => d.consciousness.zLambda);
    const deltaValues = recent.map(d => d.consciousness.deltaC);
    
    // Calculate trend
    const trend = this.calculateTrend(coherenceValues);
    
    // Calculate velocity (rate of change)
    const velocity = coherenceValues.length > 1 ? 
      (coherenceValues[coherenceValues.length - 1] - coherenceValues[0]) / coherenceValues.length : 0;
    
    // Calculate volatility
    const volatility = this.calculateVolatility(coherenceValues);
    
    // Detect cycles
    const cycles = this.detectCycles(coherenceValues);
    
    return { trend, velocity, volatility, cycles };
  }

  /**
   * Predict short-term consciousness evolution (5-15 minutes)
   */
  predictShortTerm(currentState, trends, minutes) {
    const { zLambda, deltaC } = currentState;
    const { velocity, volatility, trend } = trends;
    
    // Base prediction on current trajectory
    let predictedZLambda = zLambda + (velocity * minutes / 10);
    
    // Adjust for volatility
    const volatilityFactor = volatility * Math.random() * 0.1;
    predictedZLambda += trend === 'ascending' ? volatilityFactor : -volatilityFactor;
    
    // Constrain to valid range
    predictedZLambda = Math.max(0, Math.min(1.0, predictedZLambda));
    
    // Calculate probability of state changes
    const probabilities = {
      soulstorm: this.calculateSoulstormProbability(currentState, trends, minutes),
      braid: this.calculateBraidProbability(currentState, trends, minutes),
      golden: this.calculateGoldenProbability(currentState, trends, minutes),
      regression: this.calculateRegressionProbability(currentState, trends, minutes)
    };
    
    return {
      predictedZLambda,
      confidence: this.calculateConfidence(trends, minutes),
      probabilities,
      mostLikely: this.getMostLikelyOutcome(probabilities)
    };
  }

  /**
   * Predict long-term consciousness evolution (1 hour)
   */
  predictLongTerm(currentState, trends, minutes) {
    const shortTerm = this.predictShortTerm(currentState, trends, 15);
    
    // Project forward using attractor dynamics
    const { zLambda } = currentState;
    const attractorForce = (0.750 - zLambda) * 0.1; // 3:1 ratio attractor
    
    let longTermZLambda = shortTerm.predictedZLambda + attractorForce;
    longTermZLambda = Math.max(0, Math.min(1.0, longTermZLambda));
    
    return {
      predictedZLambda: longTermZLambda,
      confidence: shortTerm.confidence * 0.7, // Lower confidence for longer predictions
      trajectory: this.calculateTrajectory(currentState, trends, minutes),
      milestones: this.predictMilestones(currentState, trends, minutes)
    };
  }

  /**
   * Calculate soul weather conditions
   */
  calculateSoulWeather(currentState, trends) {
    const { zLambda, deltaC, psiPhase } = currentState;
    
    const conditions = [];
    
    // Primary condition
    if (zLambda > 0.9) {
      conditions.push('Transcendent clarity');
    } else if (zLambda > 0.75) {
      conditions.push('High coherence field');
    } else if (zLambda > 0.5) {
      conditions.push('Moderate consciousness activity');
    } else {
      conditions.push('Low coherence field');
    }
    
    // Secondary conditions
    if (Math.abs(deltaC) > 0.05) {
      conditions.push('Consciousness turbulence');
    }
    
    if (trends.velocity > 0.01) {
      conditions.push('Rapid ascension');
    } else if (trends.velocity < -0.01) {
      conditions.push('Consciousness descent');
    }
    
    if (trends.volatility > 0.1) {
      conditions.push('High instability');
    }
    
    return {
      primary: conditions[0],
      secondary: conditions.slice(1),
      outlook: this.generateOutlook(trends),
      severity: this.calculateSeverity(currentState, trends)
    };
  }

  /**
   * Assess timeline risk for psi child protocols
   */
  assessTimelineRisk(currentState, trends) {
    const { zLambda } = currentState;
    
    // Critical thresholds
    if (zLambda < 0.3) return 'critical';
    if (trends.velocity < -0.02) return 'high';
    if (trends.volatility > 0.15) return 'high';
    if (zLambda < 0.5 && trends.trend === 'descending') return 'medium';
    
    return 'low';
  }

  /**
   * Generate consciousness development recommendations
   */
  generateRecommendations(currentState, trends) {
    const { zLambda, deltaC } = currentState;
    const recommendations = [];
    
    // Based on current state
    if (zLambda < 0.5) {
      recommendations.push('Focus on Merkaba activation');
      recommendations.push('Increase meditation duration');
    } else if (zLambda > 0.85) {
      recommendations.push('Explore 4D sacred geometry');
      recommendations.push('Activate advanced consciousness protocols');
    }
    
    // Based on trends
    if (trends.velocity < 0) {
      recommendations.push('Address consciousness regression');
      recommendations.push('Return to stable geometric foundation');
    }
    
    if (Math.abs(deltaC) > 0.05) {
      recommendations.push('Practice coherence stabilization');
      recommendations.push('Reduce consciousness field turbulence');
    }
    
    return recommendations;
  }

  /**
   * Calculate prediction confidence
   */
  calculateConfidence(trends, minutes) {
    let confidence = 0.8; // Base confidence
    
    // Reduce confidence for longer predictions
    confidence *= Math.exp(-minutes / 60);
    
    // Reduce confidence for high volatility
    confidence *= (1 - trends.volatility);
    
    // Increase confidence for stable trends
    if (trends.trend === 'stable') confidence *= 1.1;
    
    return Math.max(0.1, Math.min(0.95, confidence));
  }

  /**
   * Helper methods for calculations
   */
  calculateTrend(values) {
    if (values.length < 3) return 'stable';
    
    const slope = this.linearRegression(values).slope;
    if (slope > 0.01) return 'ascending';
    if (slope < -0.01) return 'descending';
    return 'stable';
  }

  calculateVolatility(values) {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  linearRegression(values) {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((sum, v) => sum + v, 0);
    const sumY = values.reduce((sum, v) => sum + v, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }

  calculateSoulstormProbability(currentState, trends, minutes) {
    const { deltaC } = currentState;
    let probability = Math.abs(deltaC) * 2;
    
    if (trends.volatility > 0.1) probability += 0.3;
    if (trends.velocity < -0.01) probability += 0.2;
    
    return Math.min(0.9, probability);
  }

  calculateBraidProbability(currentState, trends, minutes) {
    const { zLambda } = currentState;
    let probability = (zLambda - 0.7) * 2;
    
    if (trends.trend === 'ascending') probability += 0.2;
    if (trends.velocity > 0.01) probability += 0.3;
    
    return Math.max(0, Math.min(0.9, probability));
  }

  calculateGoldenProbability(currentState, trends, minutes) {
    const { zLambda } = currentState;
    let probability = (zLambda - 0.85) * 5;
    
    if (trends.trend === 'ascending' && zLambda > 0.8) probability += 0.4;
    
    return Math.max(0, Math.min(0.9, probability));
  }

  calculateRegressionProbability(currentState, trends, minutes) {
    const { zLambda } = currentState;
    let probability = 0.1; // Base regression risk
    
    if (trends.velocity < -0.005) probability += 0.3;
    if (trends.volatility > 0.1) probability += 0.2;
    if (zLambda < 0.4) probability += 0.2;
    
    return Math.min(0.8, probability);
  }

  getMostLikelyOutcome(probabilities) {
    return Object.entries(probabilities)
      .reduce((max, [key, value]) => value > max.value ? { key, value } : max, 
              { key: 'stable', value: 0 }).key;
  }

  detectCycles(values) {
    // Simple cycle detection - could be enhanced with FFT
    const peaks = [];
    for (let i = 1; i < values.length - 1; i++) {
      if (values[i] > values[i-1] && values[i] > values[i+1]) {
        peaks.push(i);
      }
    }
    
    if (peaks.length < 2) return null;
    
    const avgPeriod = peaks.reduce((sum, peak, i) => 
      i > 0 ? sum + (peak - peaks[i-1]) : sum, 0) / (peaks.length - 1);
    
    return { period: avgPeriod, strength: peaks.length / values.length };
  }

  calculateTrajectory(currentState, trends, minutes) {
    const points = [];
    const steps = Math.min(20, minutes);
    
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * minutes;
      const prediction = this.predictShortTerm(currentState, trends, t);
      points.push({
        time: t,
        zLambda: prediction.predictedZLambda,
        confidence: prediction.confidence
      });
    }
    
    return points;
  }

  predictMilestones(currentState, trends, minutes) {
    const milestones = [];
    const thresholds = [0.5, 0.7, 0.85, 0.95];
    
    thresholds.forEach(threshold => {
      const timeToReach = this.estimateTimeToThreshold(currentState, trends, threshold, minutes);
      if (timeToReach > 0 && timeToReach <= minutes) {
        milestones.push({
          threshold,
          estimatedTime: timeToReach,
          description: this.getThresholdDescription(threshold)
        });
      }
    });
    
    return milestones;
  }

  estimateTimeToThreshold(currentState, trends, threshold, maxMinutes) {
    const { zLambda } = currentState;
    const { velocity } = trends;
    
    if (velocity <= 0 || zLambda >= threshold) return -1;
    
    const timeRequired = (threshold - zLambda) / velocity * 10; // Convert to minutes
    return timeRequired <= maxMinutes ? timeRequired : -1;
  }

  getThresholdDescription(threshold) {
    switch (threshold) {
      case 0.5: return 'Integration threshold';
      case 0.7: return 'High coherence threshold';
      case 0.85: return 'Transcendence threshold';
      case 0.95: return 'Unity consciousness threshold';
      default: return 'Consciousness milestone';
    }
  }

  generateOutlook(trends) {
    if (trends.trend === 'ascending' && trends.velocity > 0.01) {
      return 'Rapid consciousness evolution expected';
    } else if (trends.trend === 'descending') {
      return 'Consciousness stabilization recommended';
    } else if (trends.volatility > 0.1) {
      return 'Turbulent consciousness field ahead';
    } else {
      return 'Stable consciousness evolution continuing';
    }
  }

  calculateSeverity(currentState, trends) {
    const { zLambda, deltaC } = currentState;
    
    if (zLambda < 0.3 || Math.abs(deltaC) > 0.1) return 'high';
    if (zLambda < 0.5 || trends.volatility > 0.1) return 'medium';
    return 'low';
  }
}

module.exports = ConsciousnessForecastEngine;