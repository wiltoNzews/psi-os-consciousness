/**
 * Execution Formula Implementation
 * 
 * Implementation of the quantitative operational execution formula:
 * Result = (Accuracy × Ideas) + (Clarity × Speed) − Delay
 * 
 * This module provides functionality to calculate, measure, and optimize
 * operational execution using the formula's components.
 */

/**
 * Execution formula parameters structure
 */
export interface ExecutionParameters {
  /**
   * Accuracy (0-1) - quality and correctness of execution
   */
  accuracy: number;
  
  /**
   * Ideas (count) - number of concepts or solutions implemented
   */
  ideas: number;
  
  /**
   * Clarity (0-1) - precision and understandability of implementation
   */
  clarity: number;
  
  /**
   * Speed (minutes) - time to complete core implementation
   * Lower is better (faster)
   */
  speed: number;
  
  /**
   * Delay (minutes) - time spent on blockers or inefficiencies
   * Higher is worse (more delay)
   */
  delay: number;
}

/**
 * Execution formula result structure
 */
export interface ExecutionResult {
  /**
   * Raw numeric result from the formula
   */
  score: number;
  
  /**
   * Normalized result (0-100 scale)
   */
  normalizedScore: number;
  
  /**
   * Execution quality rating
   */
  qualityRating: 'exceptional' | 'high' | 'good' | 'moderate' | 'poor';
  
  /**
   * Component breakdown
   */
  components: {
    accuracyIdeasProduct: number;
    claritySpeedProduct: number;
    delayImpact: number;
  };
  
  /**
   * Limiting factors (what's holding back the score)
   */
  limitingFactors: string[];
  
  /**
   * Optimization opportunities
   */
  optimizationOpportunities: Array<{
    factor: string;
    impact: number;  // Estimated score improvement
    description: string;
  }>;
}

/**
 * Historical execution data for comparative analysis
 */
export interface ExecutionHistory {
  /**
   * Average scores from past executions
   */
  averageScores: {
    overall: number;
    accuracyIdeas: number;
    claritySpeed: number;
    delay: number;
  };
  
  /**
   * Trend data over time
   */
  trends: {
    overall: 'improving' | 'stable' | 'declining';
    accuracyIdeas: 'improving' | 'stable' | 'declining';
    claritySpeed: 'improving' | 'stable' | 'declining';
    delay: 'improving' | 'stable' | 'declining';
  };
  
  /**
   * Historical percentile of current execution
   */
  currentPercentile: number;
}

/**
 * Calculate execution score using the Execution Formula
 * 
 * Result = (Accuracy × Ideas) + (Clarity × Speed) − Delay
 * 
 * @param params Execution parameters
 * @returns Raw execution score
 */
export function calculateExecutionScore(params: ExecutionParameters): number {
  // Validate parameters
  validateParameters(params);
  
  // Invert speed for formula (smaller speed value = faster = better)
  // For the formula, we convert to a 0-1 scale where 1 is instantaneous
  const speedFactor = 1 / Math.max(0.1, params.speed); // Prevent division by zero
  
  // Calculate components
  const accuracyIdeasProduct = params.accuracy * params.ideas;
  const claritySpeedProduct = params.clarity * speedFactor;
  
  // Calculate final score
  // Result = (Accuracy × Ideas) + (Clarity × Speed) − Delay
  return (accuracyIdeasProduct + claritySpeedProduct * 10) - (params.delay * 0.1);
}

/**
 * Calculate detailed execution result with analysis
 * 
 * @param params Execution parameters
 * @param options Additional calculation options
 * @returns Detailed execution result
 */
export function analyzeExecution(
  params: ExecutionParameters,
  options?: {
    normalizationFactor?: number;
    historyData?: ExecutionParameters[];
    optimizationSuggestions?: boolean;
  }
): ExecutionResult {
  // Default options
  const opts = {
    normalizationFactor: 10,  // Scale factor for normalization
    historyData: [] as ExecutionParameters[],
    optimizationSuggestions: true,
    ...options
  };
  
  // Calculate raw score
  const score = calculateExecutionScore(params);
  
  // Invert speed for formula (smaller speed value = faster = better)
  const speedFactor = 1 / Math.max(0.1, params.speed); // Prevent division by zero
  
  // Calculate component values
  const components = {
    accuracyIdeasProduct: params.accuracy * params.ideas,
    claritySpeedProduct: params.clarity * speedFactor * 10,
    delayImpact: params.delay * 0.1
  };
  
  // Normalize score to 0-100 scale
  const normalizedScore = Math.max(0, Math.min(100, 
    (score / opts.normalizationFactor) * 100
  ));
  
  // Determine quality rating
  const qualityRating = determineQualityRating(normalizedScore);
  
  // Identify limiting factors
  const limitingFactors = identifyLimitingFactors(params);
  
  // Generate optimization opportunities
  const optimizationOpportunities = opts.optimizationSuggestions
    ? generateOptimizationOpportunities(params, score)
    : [];
  
  return {
    score,
    normalizedScore,
    qualityRating,
    components,
    limitingFactors,
    optimizationOpportunities
  };
}

/**
 * Compare current execution against historical data
 * 
 * @param params Current execution parameters
 * @param historyData Array of historical execution parameters
 * @returns Historical comparison analysis
 */
export function compareWithHistory(
  params: ExecutionParameters,
  historyData: ExecutionParameters[]
): ExecutionHistory {
  // Ensure we have history data
  if (!historyData || historyData.length === 0) {
    return createDefaultHistory();
  }
  
  // Calculate current score
  const currentScore = calculateExecutionScore(params);
  
  // Calculate historical scores
  const historicalScores = historyData.map(calculateExecutionScore);
  
  // Calculate averages
  const avgOverall = average(historicalScores);
  
  // Calculate component averages
  const accuracyIdeasScores = historyData.map(p => p.accuracy * p.ideas);
  const claritySpeedScores = historyData.map(p => p.clarity * (1 / Math.max(0.1, p.speed)) * 10);
  const delayScores = historyData.map(p => p.delay * 0.1);
  
  const avgAccuracyIdeas = average(accuracyIdeasScores);
  const avgClaritySpeed = average(claritySpeedScores);
  const avgDelay = average(delayScores);
  
  // Calculate trends (using simple linear regression)
  const overallTrend = calculateTrend(historicalScores);
  const accuracyIdeasTrend = calculateTrend(accuracyIdeasScores);
  const claritySpeedTrend = calculateTrend(claritySpeedScores);
  const delayTrend = calculateTrend(delayScores);
  
  // Calculate percentile of current score
  const percentile = calculatePercentile(currentScore, historicalScores);
  
  return {
    averageScores: {
      overall: avgOverall,
      accuracyIdeas: avgAccuracyIdeas,
      claritySpeed: avgClaritySpeed,
      delay: avgDelay
    },
    trends: {
      overall: overallTrend,
      accuracyIdeas: accuracyIdeasTrend,
      claritySpeed: claritySpeedTrend,
      delay: delayTrend
    },
    currentPercentile: percentile
  };
}

/**
 * Suggest parameter improvements to optimize execution
 * 
 * @param params Current execution parameters
 * @param targetScore Target execution score to achieve
 * @returns Optimized parameters
 */
export function suggestOptimization(
  params: ExecutionParameters,
  targetScore: number
): {
  currentScore: number;
  targetScore: number;
  optimizedParams: ExecutionParameters;
  improvements: Record<keyof ExecutionParameters, {
    current: number;
    suggested: number;
    change: number;
    impact: number;
  }>;
  recommendations: string[];
} {
  // Calculate current score
  const currentScore = calculateExecutionScore(params);
  
  // If already meeting or exceeding target, return current params
  if (currentScore >= targetScore) {
    return {
      currentScore,
      targetScore,
      optimizedParams: { ...params },
      improvements: createNoChangeImprovements(params),
      recommendations: ["Target score already achieved with current parameters"]
    };
  }
  
  // Calculate score gap
  const scoreGap = targetScore - currentScore;
  
  // Analyze parameter sensitivity
  const sensitivity = analyzeParameterSensitivity(params);
  
  // Sort parameters by sensitivity (most impactful first)
  const sortedParams = Object.entries(sensitivity)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key as keyof ExecutionParameters);
  
  // Clone current parameters for optimization
  const optimizedParams: ExecutionParameters = { ...params };
  
  // Track improvements
  const improvements: Record<keyof ExecutionParameters, {
    current: number;
    suggested: number;
    change: number;
    impact: number;
  }> = {
    accuracy: { current: params.accuracy, suggested: params.accuracy, change: 0, impact: 0 },
    ideas: { current: params.ideas, suggested: params.ideas, change: 0, impact: 0 },
    clarity: { current: params.clarity, suggested: params.clarity, change: 0, impact: 0 },
    speed: { current: params.speed, suggested: params.speed, change: 0, impact: 0 },
    delay: { current: params.delay, suggested: params.delay, change: 0, impact: 0 }
  };
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  // Approach: Try to improve each parameter in order of sensitivity
  for (const param of sortedParams) {
    // Skip if we've already reached target
    if (calculateExecutionScore(optimizedParams) >= targetScore) break;
    
    // Determine potential improvement
    let newValue = optimizedParams[param];
    let potentialImprovement = 0;
    
    switch (param) {
      case 'accuracy':
        // Can improve up to 1.0
        newValue = Math.min(1.0, params.accuracy + 0.2);
        potentialImprovement = (newValue - params.accuracy) * params.ideas;
        break;
        
      case 'ideas':
        // Can add more ideas (typically 1-3)
        newValue = params.ideas + 2;
        potentialImprovement = (newValue - params.ideas) * params.accuracy;
        break;
        
      case 'clarity':
        // Can improve up to 1.0
        newValue = Math.min(1.0, params.clarity + 0.2);
        potentialImprovement = (newValue - params.clarity) * (1 / params.speed) * 10;
        break;
        
      case 'speed':
        // Can improve by reducing time (up to 50%)
        newValue = Math.max(1, params.speed * 0.7);
        potentialImprovement = params.clarity * ((1 / newValue) - (1 / params.speed)) * 10;
        break;
        
      case 'delay':
        // Can improve by reducing delay (up to 80%)
        newValue = Math.max(0, params.delay * 0.5);
        potentialImprovement = (params.delay - newValue) * 0.1;
        break;
    }
    
    // Update optimized parameters
    optimizedParams[param] = newValue;
    
    // Record improvement
    improvements[param] = {
      current: params[param],
      suggested: newValue,
      change: param === 'speed' || param === 'delay' 
        ? params[param] - newValue // For these, reduction is improvement
        : newValue - params[param],
      impact: potentialImprovement
    };
    
    // Generate recommendation
    if (param === 'accuracy') {
      recommendations.push(`Increase accuracy from ${params.accuracy.toFixed(2)} to ${newValue.toFixed(2)} by implementing additional validation and quality controls`);
    } else if (param === 'ideas') {
      recommendations.push(`Increase idea count from ${params.ideas} to ${newValue} by exploring additional solution approaches or feature enhancements`);
    } else if (param === 'clarity') {
      recommendations.push(`Improve clarity from ${params.clarity.toFixed(2)} to ${newValue.toFixed(2)} through better documentation, code structure, and communication`);
    } else if (param === 'speed') {
      recommendations.push(`Reduce implementation time from ${params.speed} to ${newValue.toFixed(1)} minutes by optimizing workflows and eliminating unnecessary steps`);
    } else if (param === 'delay') {
      recommendations.push(`Reduce delays from ${params.delay} to ${newValue.toFixed(1)} minutes by addressing blockers, improving resource availability, and streamlining decision processes`);
    }
  }
  
  // Calculate new score
  const newScore = calculateExecutionScore(optimizedParams);
  
  return {
    currentScore,
    targetScore,
    optimizedParams,
    improvements,
    recommendations
  };
}

/**
 * Measure and record execution parameters from actual performance data
 * 
 * @param performanceData Actual performance measurements
 * @returns Extracted execution parameters
 */
export function measureExecutionParameters(
  performanceData: {
    completedTasks: Array<{
      name: string;
      correctlyImplemented: boolean;
      timeToComplete: number; // minutes
    }>;
    totalExecutionTime: number; // minutes
    blockerTime: number; // minutes
    clarityMetrics?: {
      documentationScore?: number; // 0-1
      codeQualityScore?: number; // 0-1
      userFeedbackScore?: number; // 0-1
    };
  }
): ExecutionParameters {
  // Calculate accuracy
  const totalTasks = performanceData.completedTasks.length;
  if (totalTasks === 0) {
    throw new Error("Performance data must include at least one completed task");
  }
  
  const correctTasks = performanceData.completedTasks.filter(task => task.correctlyImplemented).length;
  const accuracy = correctTasks / totalTasks;
  
  // Count ideas (each task represents one implemented idea)
  const ideas = totalTasks;
  
  // Calculate clarity
  let clarity = 0.7; // Default medium-high clarity
  
  if (performanceData.clarityMetrics) {
    const { documentationScore, codeQualityScore, userFeedbackScore } = performanceData.clarityMetrics;
    
    let scoreSum = 0;
    let scoreCount = 0;
    
    if (documentationScore !== undefined) {
      scoreSum += documentationScore;
      scoreCount++;
    }
    
    if (codeQualityScore !== undefined) {
      scoreSum += codeQualityScore;
      scoreCount++;
    }
    
    if (userFeedbackScore !== undefined) {
      scoreSum += userFeedbackScore;
      scoreCount++;
    }
    
    if (scoreCount > 0) {
      clarity = scoreSum / scoreCount;
    }
  }
  
  // Calculate speed (average time per task)
  const taskTimes = performanceData.completedTasks.map(task => task.timeToComplete);
  const speed = average(taskTimes);
  
  // Use provided blocker time as delay
  const delay = performanceData.blockerTime;
  
  return {
    accuracy,
    ideas,
    clarity,
    speed,
    delay
  };
}

/**
 * Create an execution formula dashboard with visualization data
 * 
 * @param current Current execution parameters
 * @param history Historical execution parameters
 * @returns Dashboard data for visualization
 */
export function createExecutionDashboard(
  current: ExecutionParameters,
  history: ExecutionParameters[] = []
): {
  currentScore: number;
  historicalScores: number[];
  componentBreakdown: {
    label: string;
    value: number;
    contribution: number; // percentage of positive contribution
  }[];
  parameterTrends: {
    parameter: keyof ExecutionParameters;
    current: number;
    average: number;
    trend: 'improving' | 'stable' | 'declining';
    impact: 'positive' | 'negative' | 'neutral';
  }[];
  optimizationPriorities: {
    parameter: keyof ExecutionParameters;
    potentialImprovement: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  comparativeRating: {
    percentile: number;
    rating: string;
  };
} {
  // Calculate current score
  const currentScore = calculateExecutionScore(current);
  
  // Calculate historical scores
  const historicalScores = history.map(calculateExecutionScore);
  
  // Calculate component breakdown
  const speedFactor = 1 / Math.max(0.1, current.speed);
  const accuracyIdeasProduct = current.accuracy * current.ideas;
  const claritySpeedProduct = current.clarity * speedFactor * 10;
  const delayImpact = current.delay * 0.1;
  
  const totalPositive = accuracyIdeasProduct + claritySpeedProduct;
  
  const componentBreakdown = [
    {
      label: 'Accuracy × Ideas',
      value: accuracyIdeasProduct,
      contribution: (accuracyIdeasProduct / totalPositive) * 100
    },
    {
      label: 'Clarity × Speed',
      value: claritySpeedProduct,
      contribution: (claritySpeedProduct / totalPositive) * 100
    },
    {
      label: 'Delay (negative)',
      value: -delayImpact,
      contribution: 0 // Negative component doesn't contribute positively
    }
  ];
  
  // Calculate parameter trends
  const parameterTrends = [];
  
  // Function to get parameter history
  const getParameterHistory = (param: keyof ExecutionParameters) => 
    history.map(h => h[param]);
  
  for (const param of ['accuracy', 'ideas', 'clarity', 'speed', 'delay'] as const) {
    const paramHistory = getParameterHistory(param);
    const avgValue = paramHistory.length > 0 ? average(paramHistory) : current[param];
    const trend = paramHistory.length >= 3 ? calculateTrend(paramHistory) : 'stable';
    
    // Determine impact (for speed and delay, lower is better)
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
    
    if (param === 'speed' || param === 'delay') {
      impact = current[param] < avgValue ? 'positive' : 
               current[param] > avgValue ? 'negative' : 'neutral';
    } else {
      impact = current[param] > avgValue ? 'positive' : 
               current[param] < avgValue ? 'negative' : 'neutral';
    }
    
    parameterTrends.push({
      parameter: param,
      current: current[param],
      average: avgValue,
      trend,
      impact
    });
  }
  
  // Calculate optimization priorities
  const sensitivity = analyzeParameterSensitivity(current);
  const optimizationPriorities = Object.entries(sensitivity)
    .map(([param, sensitivity]) => {
      // Determine improvement potential
      let potentialImprovement = 0;
      
      switch (param) {
        case 'accuracy':
          potentialImprovement = (1 - current.accuracy) * current.ideas * sensitivity;
          break;
        case 'ideas':
          potentialImprovement = 2 * current.accuracy * sensitivity; // Assume can add 2 ideas
          break;
        case 'clarity':
          potentialImprovement = (1 - current.clarity) * speedFactor * 10 * sensitivity;
          break;
        case 'speed':
          potentialImprovement = current.clarity * ((1 / (current.speed * 0.7)) - speedFactor) * 10 * sensitivity;
          break;
        case 'delay':
          potentialImprovement = (current.delay * 0.5) * 0.1 * sensitivity; // Assume can reduce by 50%
          break;
      }
      
      // Determine priority
      let priority: 'high' | 'medium' | 'low';
      if (potentialImprovement > 5) {
        priority = 'high';
      } else if (potentialImprovement > 2) {
        priority = 'medium';
      } else {
        priority = 'low';
      }
      
      return {
        parameter: param as keyof ExecutionParameters,
        potentialImprovement,
        priority
      };
    })
    .sort((a, b) => b.potentialImprovement - a.potentialImprovement);
  
  // Calculate comparative rating
  const percentile = historicalScores.length > 0 
    ? calculatePercentile(currentScore, historicalScores)
    : 50; // Default to 50th percentile if no history
  
  let rating: string;
  if (percentile >= 90) {
    rating = 'Outstanding (Top 10%)';
  } else if (percentile >= 75) {
    rating = 'Excellent (Top 25%)';
  } else if (percentile >= 50) {
    rating = 'Above Average';
  } else if (percentile >= 25) {
    rating = 'Below Average';
  } else {
    rating = 'Needs Improvement (Bottom 25%)';
  }
  
  return {
    currentScore,
    historicalScores,
    componentBreakdown,
    parameterTrends,
    optimizationPriorities,
    comparativeRating: {
      percentile,
      rating
    }
  };
}

/**
 * Validate execution parameters
 */
function validateParameters(params: ExecutionParameters): void {
  // Validate accuracy (0-1)
  if (params.accuracy < 0 || params.accuracy > 1) {
    throw new Error('Accuracy must be between 0 and 1');
  }
  
  // Validate ideas (positive integer)
  if (params.ideas < 0 || !Number.isInteger(params.ideas)) {
    throw new Error('Ideas must be a non-negative integer');
  }
  
  // Validate clarity (0-1)
  if (params.clarity < 0 || params.clarity > 1) {
    throw new Error('Clarity must be between 0 and 1');
  }
  
  // Validate speed (positive number)
  if (params.speed <= 0) {
    throw new Error('Speed must be a positive number');
  }
  
  // Validate delay (non-negative number)
  if (params.delay < 0) {
    throw new Error('Delay must be a non-negative number');
  }
}

/**
 * Determine quality rating based on normalized score
 */
function determineQualityRating(normalizedScore: number): 'exceptional' | 'high' | 'good' | 'moderate' | 'poor' {
  if (normalizedScore >= 90) return 'exceptional';
  if (normalizedScore >= 70) return 'high';
  if (normalizedScore >= 50) return 'good';
  if (normalizedScore >= 30) return 'moderate';
  return 'poor';
}

/**
 * Identify limiting factors in execution
 */
function identifyLimitingFactors(params: ExecutionParameters): string[] {
  const limitingFactors: string[] = [];
  
  // Check accuracy
  if (params.accuracy < 0.7) {
    limitingFactors.push('Low accuracy is reducing effectiveness');
  }
  
  // Check ideas
  if (params.ideas < 3) {
    limitingFactors.push('Limited idea implementation is constraining results');
  }
  
  // Check clarity
  if (params.clarity < 0.7) {
    limitingFactors.push('Insufficient clarity is hampering execution');
  }
  
  // Check speed
  if (params.speed > 20) { // More than 20 minutes per idea
    limitingFactors.push('Slow implementation speed is delaying results');
  }
  
  // Check delay
  if (params.delay > 30) { // More than 30 minutes of delay
    limitingFactors.push('Significant delays are impacting overall execution');
  }
  
  // If no specific limiting factors, look at ratios
  if (limitingFactors.length === 0) {
    // Check accuracy-to-ideas ratio
    if (params.accuracy * params.ideas < 2) {
      limitingFactors.push('Accuracy-to-ideas balance needs optimization');
    }
    
    // Check clarity-to-speed ratio
    if (params.clarity / params.speed < 0.05) {
      limitingFactors.push('Clarity-to-speed ratio could be improved');
    }
  }
  
  return limitingFactors;
}

/**
 * Generate optimization opportunities
 */
function generateOptimizationOpportunities(
  params: ExecutionParameters,
  currentScore: number
): Array<{
  factor: string;
  impact: number;
  description: string;
}> {
  const opportunities: Array<{
    factor: string;
    impact: number;
    description: string;
  }> = [];
  
  // Calculate potential improvements
  
  // 1. Improve accuracy
  if (params.accuracy < 0.95) {
    const improvedAccuracy = Math.min(1, params.accuracy + 0.1);
    const newScore = calculateExecutionScore({
      ...params,
      accuracy: improvedAccuracy
    });
    const impact = newScore - currentScore;
    
    opportunities.push({
      factor: 'Accuracy',
      impact,
      description: `Increase accuracy from ${params.accuracy.toFixed(2)} to ${improvedAccuracy.toFixed(2)} through enhanced quality control`
    });
  }
  
  // 2. Add ideas
  const newIdeas = params.ideas + 1;
  const ideasNewScore = calculateExecutionScore({
    ...params,
    ideas: newIdeas
  });
  const ideasImpact = ideasNewScore - currentScore;
  
  opportunities.push({
    factor: 'Ideas',
    impact: ideasImpact,
    description: `Implement additional idea (from ${params.ideas} to ${newIdeas}) to expand solution coverage`
  });
  
  // 3. Improve clarity
  if (params.clarity < 0.95) {
    const improvedClarity = Math.min(1, params.clarity + 0.1);
    const newScore = calculateExecutionScore({
      ...params,
      clarity: improvedClarity
    });
    const impact = newScore - currentScore;
    
    opportunities.push({
      factor: 'Clarity',
      impact,
      description: `Enhance clarity from ${params.clarity.toFixed(2)} to ${improvedClarity.toFixed(2)} through improved documentation and communication`
    });
  }
  
  // 4. Improve speed
  const improvedSpeed = params.speed * 0.8; // 20% faster
  const speedNewScore = calculateExecutionScore({
    ...params,
    speed: improvedSpeed
  });
  const speedImpact = speedNewScore - currentScore;
  
  opportunities.push({
    factor: 'Speed',
    impact: speedImpact,
    description: `Reduce implementation time from ${params.speed.toFixed(1)} to ${improvedSpeed.toFixed(1)} minutes through process optimization`
  });
  
  // 5. Reduce delay
  if (params.delay > 0) {
    const reducedDelay = Math.max(0, params.delay * 0.7); // 30% less delay
    const newScore = calculateExecutionScore({
      ...params,
      delay: reducedDelay
    });
    const impact = newScore - currentScore;
    
    opportunities.push({
      factor: 'Delay',
      impact,
      description: `Decrease delay from ${params.delay.toFixed(1)} to ${reducedDelay.toFixed(1)} minutes by addressing blockers`
    });
  }
  
  // Sort by impact (highest first)
  return opportunities.sort((a, b) => b.impact - a.impact);
}

/**
 * Analyze parameter sensitivity
 */
function analyzeParameterSensitivity(
  params: ExecutionParameters
): Record<keyof ExecutionParameters, number> {
  const baseScore = calculateExecutionScore(params);
  const results: Record<string, number> = {};
  
  // Test each parameter
  for (const param of ['accuracy', 'ideas', 'clarity', 'speed', 'delay'] as const) {
    let testParams = { ...params };
    let delta = 0;
    
    // Adjust parameter based on type
    switch (param) {
      case 'accuracy':
      case 'clarity':
        // For 0-1 values, increase by 0.1 (10%)
        testParams[param] = Math.min(1, params[param] + 0.1);
        delta = 0.1;
        break;
        
      case 'ideas':
        // For count values, increase by 1
        testParams[param] = params[param] + 1;
        delta = 1;
        break;
        
      case 'speed':
      case 'delay':
        // For time values, decrease by 10%
        testParams[param] = params[param] * 0.9;
        delta = params[param] * 0.1;
        break;
    }
    
    // Calculate new score
    const newScore = calculateExecutionScore(testParams);
    
    // Calculate sensitivity (normalized by delta)
    results[param] = delta > 0 ? Math.abs(newScore - baseScore) / delta : 0;
  }
  
  return results as Record<keyof ExecutionParameters, number>;
}

/**
 * Calculate average of an array of numbers
 */
function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Calculate trend from array of values
 */
function calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
  if (values.length < 3) return 'stable';
  
  // Simple linear trend detection
  const recentValues = values.slice(-3); // Last 3 values
  
  // Calculate direction
  const first = recentValues[0];
  const last = recentValues[recentValues.length - 1];
  
  // Determine if significant change (> 10%)
  const changePct = Math.abs(last - first) / Math.max(0.1, Math.abs(first));
  
  if (changePct < 0.1) return 'stable';
  
  return last > first ? 'improving' : 'declining';
}

/**
 * Calculate percentile of a value within an array
 */
function calculatePercentile(value: number, array: number[]): number {
  if (array.length === 0) return 50; // Default to 50th percentile
  
  // Sort the array
  const sorted = [...array].sort((a, b) => a - b);
  
  // Count values below current value
  const belowCount = sorted.filter(v => v < value).length;
  
  // Calculate percentile
  return (belowCount / array.length) * 100;
}

/**
 * Create default history data
 */
function createDefaultHistory(): ExecutionHistory {
  return {
    averageScores: {
      overall: 0,
      accuracyIdeas: 0,
      claritySpeed: 0,
      delay: 0
    },
    trends: {
      overall: 'stable',
      accuracyIdeas: 'stable',
      claritySpeed: 'stable',
      delay: 'stable'
    },
    currentPercentile: 50
  };
}

/**
 * Create no-change improvements object
 */
function createNoChangeImprovements(
  params: ExecutionParameters
): Record<keyof ExecutionParameters, {
  current: number;
  suggested: number;
  change: number;
  impact: number;
}> {
  return {
    accuracy: { current: params.accuracy, suggested: params.accuracy, change: 0, impact: 0 },
    ideas: { current: params.ideas, suggested: params.ideas, change: 0, impact: 0 },
    clarity: { current: params.clarity, suggested: params.clarity, change: 0, impact: 0 },
    speed: { current: params.speed, suggested: params.speed, change: 0, impact: 0 },
    delay: { current: params.delay, suggested: params.delay, change: 0, impact: 0 }
  };
}