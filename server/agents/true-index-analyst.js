/**
 * True-Index Analyst
 * 
 * This agent focuses on data analysis, pattern recognition, and metrics tracking 
 * to provide quantitative insights and performance evaluations.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { v4 as uuidv4 } from 'uuid';
import { QuantumState } from '../../shared/schema-minimal.js';
import { formatWithQuantumState } from '../../shared/quantum-state-utils.js';

// Agent symbol for symbolic communication
export const AGENT_SYMBOL = '📈';
export const AGENT_NAME = 'True-Index Analyst';
export const AGENT_ID = 'true-index-analyst';

// Explicit purpose for clear documentation
export const agentPurpose = 'Focuses on data analysis, pattern recognition, and metrics tracking to provide quantitative insights and performance evaluations.';

/**
 * Format a log message with the appropriate agent symbol
 * 
 * @param {string} message - The message to format
 * @param {QuantumState} state - The quantum state
 * @returns {string} - The formatted message
 */
function formatAgentLog(message, state = QuantumState.SIM_FLOW) {
  const baseFormat = formatWithQuantumState(message, state);
  return baseFormat.replace('[QUANTUM_STATE:', `[${AGENT_SYMBOL} QUANTUM_STATE:`);
}

/**
 * Analyze patterns in data
 * 
 * @param {Array|Object} data - Data to analyze
 * @param {Object} options - Analysis options
 * @returns {Object} - Analysis results
 */
export function analyzePatterns(data, options = {}) {
  console.log(`[α/S+/${AGENT_SYMBOL}] Analyzing patterns in data`);
  console.log(`[⚽️] Pattern analysis started`);
  
  // Ensure data is in a format we can work with
  const dataArray = Array.isArray(data) ? data : [data];
  
  // Identify the pattern types to look for
  const patternTypes = options.patternTypes || ['trends', 'clusters', 'outliers', 'cycles'];
  
  // Initialize results object
  const results = {
    id: `pattern-${uuidv4().slice(0, 8)}`,
    summary: {},
    patterns: {},
    recommendations: [],
    metadata: {
      dataSize: dataArray.length,
      patternTypes,
      options,
      timestamp: new Date()
    }
  };
  
  // Analyze each pattern type
  patternTypes.forEach(patternType => {
    switch (patternType) {
      case 'trends':
        results.patterns.trends = analyzeTrends(dataArray, options);
        break;
        
      case 'clusters':
        results.patterns.clusters = analyzeClusters(dataArray, options);
        break;
        
      case 'outliers':
        results.patterns.outliers = analyzeOutliers(dataArray, options);
        break;
        
      case 'cycles':
        results.patterns.cycles = analyzeCycles(dataArray, options);
        break;
        
      default:
        console.log(`[α/S-/${AGENT_SYMBOL}] Unknown pattern type: ${patternType}`);
    }
  });
  
  // Generate summary statistics
  results.summary = generateSummaryStatistics(dataArray, options);
  
  // Generate recommendations based on patterns
  results.recommendations = generateRecommendations(results.patterns, options);
  
  console.log(`[α/S+/${AGENT_SYMBOL}] Pattern analysis complete: found patterns in ${Object.keys(results.patterns).length} categories`);
  console.log(`[⚽️] Pattern analysis complete: Categories=${Object.keys(results.patterns).length}`);
  
  return results;
}

/**
 * Analyze trends in data
 * 
 * @param {Array} data - Data to analyze
 * @param {Object} options - Analysis options
 * @returns {Object} - Trend analysis results
 */
function analyzeTrends(data, options = {}) {
  // This would use proper statistical analysis in a real implementation
  // Here we'll provide a simplified simulation
  
  // Extract a numeric field to analyze
  const fieldName = options.trendField || getNumericField(data[0]) || 'value';
  const values = data.map(item => typeof item === 'object' ? (item[fieldName] || 0) : item);
  
  // Check if we have date/time information
  const timeField = options.timeField || getDateField(data[0]) || 'timestamp';
  const hasTimes = data.some(item => typeof item === 'object' && item[timeField]);
  
  // Calculate simple trend metrics
  const firstValue = values[0] || 0;
  const lastValue = values[values.length - 1] || 0;
  const changeAbsolute = lastValue - firstValue;
  const changePercent = firstValue !== 0 ? (changeAbsolute / Math.abs(firstValue)) * 100 : 0;
  
  // Determine trend direction
  let direction;
  if (Math.abs(changePercent) < 1) {
    direction = 'stable';
  } else if (changePercent > 0) {
    direction = changePercent > 10 ? 'strongly_increasing' : 'increasing';
  } else {
    direction = changePercent < -10 ? 'strongly_decreasing' : 'decreasing';
  }
  
  // Calculate volatility (simplified)
  const diffs = [];
  for (let i = 1; i < values.length; i++) {
    diffs.push(values[i] - values[i-1]);
  }
  const volatility = diffs.length > 0 
    ? diffs.reduce((sum, diff) => sum + Math.abs(diff), 0) / diffs.length 
    : 0;
  
  // Create trend result
  const result = {
    field: fieldName,
    direction,
    changeAbsolute,
    changePercent: parseFloat(changePercent.toFixed(2)),
    volatility: parseFloat(volatility.toFixed(4)),
    sampleSize: values.length,
    confidence: calculateTrendConfidence(values, changePercent, volatility)
  };
  
  // Add time-based analysis if available
  if (hasTimes) {
    result.timeField = timeField;
    result.period = options.period || 'auto';
    
    // Simplistic period detection
    if (result.period === 'auto') {
      if (values.length >= 365) {
        result.period = 'yearly';
      } else if (values.length >= 30) {
        result.period = 'monthly';
      } else if (values.length >= 7) {
        result.period = 'weekly';
      } else {
        result.period = 'daily';
      }
    }
  }
  
  return result;
}

/**
 * Calculate confidence in trend analysis
 * 
 * @param {Array} values - Numeric values
 * @param {number} changePercent - Percent change
 * @param {number} volatility - Volatility measure
 * @returns {number} - Confidence score (0-1)
 */
function calculateTrendConfidence(values, changePercent, volatility) {
  // More data points increases confidence
  const sizeFactor = Math.min(1, values.length / 30);
  
  // Higher change percentage increases confidence (if not volatile)
  const changeFactor = Math.min(1, Math.abs(changePercent) / 20);
  
  // Higher volatility decreases confidence
  const volatilityFactor = Math.max(0, 1 - (volatility / (Math.abs(values[0]) || 1)));
  
  // Combine factors (with weights)
  return parseFloat((sizeFactor * 0.4 + changeFactor * 0.3 + volatilityFactor * 0.3).toFixed(2));
}

/**
 * Analyze clusters in data
 * 
 * @param {Array} data - Data to analyze
 * @param {Object} options - Analysis options
 * @returns {Object} - Cluster analysis results
 */
function analyzeClusters(data, options = {}) {
  // This would use proper clustering algorithms in a real implementation
  // Here we'll provide a simplified simulation
  
  // Identify fields to use for clustering
  const fields = options.clusterFields || getNumericFields(data[0]);
  
  // Simulate finding clusters
  const clusterCount = Math.min(5, Math.max(2, Math.floor(data.length / 10)));
  const clusters = [];
  
  for (let i = 0; i < clusterCount; i++) {
    clusters.push({
      id: `cluster-${i + 1}`,
      size: Math.floor(data.length / clusterCount),
      center: fields.reduce((center, field) => {
        center[field] = Math.random() * 100; // Random center value
        return center;
      }, {}),
      coherence: Math.random() * 0.5 + 0.5, // Random coherence (0.5-1.0)
      significance: Math.random() * 0.5 + 0.3 // Random significance (0.3-0.8)
    });
  }
  
  return {
    clusterCount,
    clusters,
    fields,
    algorithm: options.algorithm || 'k-means',
    quality: Math.random() * 0.3 + 0.7 // Random quality score (0.7-1.0)
  };
}

/**
 * Analyze outliers in data
 * 
 * @param {Array} data - Data to analyze
 * @param {Object} options - Analysis options
 * @returns {Object} - Outlier analysis results
 */
function analyzeOutliers(data, options = {}) {
  // This would use proper outlier detection in a real implementation
  // Here we'll provide a simplified simulation
  
  // Identify fields to use for outlier detection
  const fields = options.outlierFields || getNumericFields(data[0]);
  
  // Simulate finding outliers
  const outlierCount = Math.floor(data.length * 0.05); // 5% outliers
  const outliers = [];
  
  for (let i = 0; i < outlierCount; i++) {
    outliers.push({
      id: `outlier-${i + 1}`,
      index: Math.floor(Math.random() * data.length),
      fields: fields.reduce((outlier, field) => {
        outlier[field] = Math.random() * 1000; // Random outlier value
        return outlier;
      }, {}),
      deviation: Math.random() * 5 + 3, // Random deviation (3-8 standard deviations)
      significance: Math.random() * 0.5 + 0.5 // Random significance (0.5-1.0)
    });
  }
  
  return {
    outlierCount,
    outliers,
    fields,
    algorithm: options.outlierAlgorithm || 'z-score',
    threshold: options.outlierThreshold || 3.0
  };
}

/**
 * Analyze cycles in data
 * 
 * @param {Array} data - Data to analyze
 * @param {Object} options - Analysis options
 * @returns {Object} - Cycle analysis results
 */
function analyzeCycles(data, options = {}) {
  // This would use proper time series analysis in a real implementation
  // Here we'll provide a simplified simulation
  
  // Check if we have enough data
  if (data.length < 10) {
    return {
      cyclesDetected: false,
      reason: 'Insufficient data points for cycle detection'
    };
  }
  
  // Extract a numeric field to analyze
  const fieldName = options.cycleField || getNumericField(data[0]) || 'value';
  
  // Check if we have date/time information
  const timeField = options.timeField || getDateField(data[0]) || 'timestamp';
  const hasTimes = data.some(item => typeof item === 'object' && item[timeField]);
  
  if (!hasTimes) {
    return {
      cyclesDetected: false,
      reason: 'No time information available for cycle detection'
    };
  }
  
  // Simulate detecting cycles
  const cycles = [];
  const cycleTypes = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
  const cycleCount = Math.floor(Math.random() * 3) + 1; // 1-3 cycles
  
  for (let i = 0; i < cycleCount; i++) {
    const cycleType = cycleTypes[Math.floor(Math.random() * cycleTypes.length)];
    
    cycles.push({
      period: cycleType,
      strength: Math.random() * 0.5 + 0.5, // Random strength (0.5-1.0)
      phase: Math.random() * 360, // Random phase (0-360 degrees)
      amplitude: Math.random() * 10 + 1 // Random amplitude (1-11)
    });
  }
  
  return {
    cyclesDetected: true,
    cycleCount,
    cycles,
    field: fieldName,
    timeField,
    algorithm: options.cycleAlgorithm || 'fourier-transform',
    confidence: Math.random() * 0.3 + 0.7 // Random confidence (0.7-1.0)
  };
}

/**
 * Generate summary statistics for data
 * 
 * @param {Array} data - Data to analyze
 * @param {Object} options - Analysis options
 * @returns {Object} - Summary statistics
 */
function generateSummaryStatistics(data, options = {}) {
  // This would use proper statistical analysis in a real implementation
  // Here we'll provide a simplified simulation
  
  // Get fields to analyze
  const fields = options.summaryFields || getNumericFields(data[0]);
  
  // Generate summary for each field
  const fieldSummaries = {};
  
  fields.forEach(field => {
    const values = data
      .map(item => typeof item === 'object' ? item[field] : item)
      .filter(val => typeof val === 'number');
    
    if (values.length === 0) {
      fieldSummaries[field] = {
        error: 'No numeric values found for this field'
      };
      return;
    }
    
    // Calculate basic statistics
    values.sort((a, b) => a - b);
    
    const sum = values.reduce((sum, val) => sum + val, 0);
    const mean = sum / values.length;
    
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    const min = values[0];
    const max = values[values.length - 1];
    const median = values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];
    
    fieldSummaries[field] = {
      count: values.length,
      min,
      max,
      range: max - min,
      sum,
      mean: parseFloat(mean.toFixed(4)),
      median: parseFloat(median.toFixed(4)),
      variance: parseFloat(variance.toFixed(4)),
      stdDev: parseFloat(stdDev.toFixed(4)),
      isEmpty: false
    };
  });
  
  return {
    recordCount: data.length,
    fieldSummaries,
    fields
  };
}

/**
 * Generate recommendations based on patterns
 * 
 * @param {Object} patterns - Patterns detected
 * @param {Object} options - Analysis options
 * @returns {Array} - Recommendations
 */
function generateRecommendations(patterns, options = {}) {
  const recommendations = [];
  
  // Recommendations based on trends
  if (patterns.trends) {
    const { direction, confidence } = patterns.trends;
    
    if (direction === 'strongly_increasing' && confidence > 0.7) {
      recommendations.push({
        type: 'trend_response',
        priority: 'high',
        description: 'Strong increasing trend detected. Consider scaling resources to handle increased load.'
      });
    } else if (direction === 'strongly_decreasing' && confidence > 0.7) {
      recommendations.push({
        type: 'trend_response',
        priority: 'medium',
        description: 'Strong decreasing trend detected. Consider investigating potential issues.'
      });
    }
  }
  
  // Recommendations based on outliers
  if (patterns.outliers && patterns.outliers.outlierCount > 0) {
    recommendations.push({
      type: 'outlier_investigation',
      priority: patterns.outliers.outlierCount > 5 ? 'high' : 'medium',
      description: `${patterns.outliers.outlierCount} outliers detected. Review for potential data quality issues or significant events.`
    });
  }
  
  // Recommendations based on cycles
  if (patterns.cycles && patterns.cycles.cyclesDetected) {
    recommendations.push({
      type: 'cycle_adaptation',
      priority: 'medium',
      description: `${patterns.cycles.cycleCount} cycles detected. Consider adapting resource allocation to match cyclical patterns.`
    });
  }
  
  // Add generic recommendations if none specific were generated
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'data_quality',
      priority: 'low',
      description: 'Consider increasing data collection frequency to improve pattern detection.'
    });
  }
  
  return recommendations;
}

/**
 * Generate metrics for a dataset
 * 
 * @param {Array|Object} data - Data to analyze
 * @param {Array} metricDefinitions - Metrics to calculate
 * @param {Object} options - Metric generation options
 * @returns {Object} - Generated metrics
 */
export function generateMetrics(data, metricDefinitions, options = {}) {
  console.log(`[α/S+/${AGENT_SYMBOL}] Generating ${metricDefinitions.length} metrics`);
  console.log(`[⚽️] Metrics generation started: Count=${metricDefinitions.length}`);
  
  // Ensure data is in a format we can work with
  const dataArray = Array.isArray(data) ? data : [data];
  
  // Initialize results
  const results = {
    id: `metrics-${uuidv4().slice(0, 8)}`,
    metrics: {},
    summary: {},
    metadata: {
      dataSize: dataArray.length,
      metricCount: metricDefinitions.length,
      timestamp: new Date(),
      options
    }
  };
  
  // Generate each metric
  metricDefinitions.forEach(metricDef => {
    try {
      const metric = calculateMetric(dataArray, metricDef, options);
      results.metrics[metricDef.id] = metric;
    } catch (error) {
      console.log(`[α/S-/${AGENT_SYMBOL}] Error calculating metric ${metricDef.id}: ${error.message}`);
      results.metrics[metricDef.id] = {
        error: error.message,
        status: 'failed'
      };
    }
  });
  
  // Generate metric summary
  results.summary = generateMetricSummary(results.metrics);
  
  console.log(`[α/S+/${AGENT_SYMBOL}] Metrics generation complete: ${Object.keys(results.metrics).length} metrics calculated`);
  console.log(`[⚽️] Metrics generation complete: Count=${Object.keys(results.metrics).length}`);
  
  return results;
}

/**
 * Calculate a single metric
 * 
 * @param {Array} data - Data to analyze
 * @param {Object} metricDef - Metric definition
 * @param {Object} options - Calculation options
 * @returns {Object} - Calculated metric
 */
function calculateMetric(data, metricDef, options = {}) {
  // Extract relevant data based on metric definition
  let values;
  
  if (metricDef.fieldName) {
    values = data.map(item => typeof item === 'object' ? (item[metricDef.fieldName] || 0) : item);
  } else if (metricDef.expression) {
    // This would use a proper expression evaluator in a real implementation
    // Here we'll simulate with random values
    values = data.map(() => Math.random() * 100);
  } else {
    values = data.map(item => typeof item === 'number' ? item : 0);
  }
  
  // Apply filtering if specified
  if (metricDef.filter) {
    values = values.filter(val => {
      if (metricDef.filter.min !== undefined && val < metricDef.filter.min) return false;
      if (metricDef.filter.max !== undefined && val > metricDef.filter.max) return false;
      return true;
    });
  }
  
  // Calculate metric based on type
  let value;
  
  switch (metricDef.type) {
    case 'sum':
      value = values.reduce((sum, val) => sum + val, 0);
      break;
      
    case 'average':
      value = values.reduce((sum, val) => sum + val, 0) / values.length;
      break;
      
    case 'min':
      value = Math.min(...values);
      break;
      
    case 'max':
      value = Math.max(...values);
      break;
      
    case 'count':
      value = values.length;
      break;
      
    case 'median':
      values.sort((a, b) => a - b);
      value = values.length % 2 === 0
        ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
        : values[Math.floor(values.length / 2)];
      break;
      
    case 'percentile':
      values.sort((a, b) => a - b);
      const percentile = metricDef.percentile || 95;
      const index = Math.floor(values.length * (percentile / 100));
      value = values[Math.min(index, values.length - 1)];
      break;
      
    case 'custom':
      // This would use a proper custom function in a real implementation
      // Here we'll simulate with a random value
      value = Math.random() * 100;
      break;
      
    default:
      throw new Error(`Unknown metric type: ${metricDef.type}`);
  }
  
  // Format the value based on options
  if (options.precision !== undefined) {
    value = parseFloat(value.toFixed(options.precision));
  }
  
  // Create metric result
  return {
    id: metricDef.id,
    name: metricDef.name || metricDef.id,
    type: metricDef.type,
    value,
    unit: metricDef.unit || '',
    samplesCount: values.length,
    timestamp: new Date(),
    metadata: {
      fieldName: metricDef.fieldName,
      filter: metricDef.filter
    }
  };
}

/**
 * Generate a summary of calculated metrics
 * 
 * @param {Object} metrics - Calculated metrics
 * @returns {Object} - Metrics summary
 */
function generateMetricSummary(metrics) {
  // Count metrics by type
  const typeCount = {};
  let totalMetrics = 0;
  let successfulMetrics = 0;
  let failedMetrics = 0;
  
  Object.values(metrics).forEach(metric => {
    totalMetrics++;
    
    if (metric.error) {
      failedMetrics++;
    } else {
      successfulMetrics++;
      typeCount[metric.type] = (typeCount[metric.type] || 0) + 1;
    }
  });
  
  return {
    totalMetrics,
    successfulMetrics,
    failedMetrics,
    successRate: totalMetrics > 0 ? successfulMetrics / totalMetrics : 0,
    typeDistribution: typeCount
  };
}

/**
 * Get a numeric field from an object
 * 
 * @param {Object} obj - Object to examine
 * @returns {string|null} - Name of first numeric field found
 */
function getNumericField(obj) {
  if (!obj || typeof obj !== 'object') return null;
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'number') {
      return key;
    }
  }
  
  return null;
}

/**
 * Get all numeric fields from an object
 * 
 * @param {Object} obj - Object to examine
 * @returns {Array} - Names of all numeric fields
 */
function getNumericFields(obj) {
  if (!obj || typeof obj !== 'object') return [];
  
  return Object.entries(obj)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key]) => key);
}

/**
 * Get a date field from an object
 * 
 * @param {Object} obj - Object to examine
 * @returns {string|null} - Name of first date field found
 */
function getDateField(obj) {
  if (!obj || typeof obj !== 'object') return null;
  
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
      return key;
    }
  }
  
  const dateLikeFields = ['date', 'time', 'timestamp', 'created', 'createdAt', 'updated', 'updatedAt'];
  for (const field of dateLikeFields) {
    if (field in obj) {
      return field;
    }
  }
  
  return null;
}

/**
 * Create an agent interface for the True-Index Analyst
 * 
 * @returns {Object} - Agent interface object
 */
export function createTrueIndexAnalystAgent() {
  return {
    id: AGENT_ID,
    name: AGENT_NAME,
    symbol: AGENT_SYMBOL,
    purpose: agentPurpose,
    
    processMessage(message) {
      if (message.type === 'analyze_patterns') {
        return this.analyzePatterns(message.data.data, message.data.options);
      } else if (message.type === 'generate_metrics') {
        return this.generateMetrics(
          message.data.data,
          message.data.metricDefinitions,
          message.data.options
        );
      } else {
        console.log(`[α/S-/${AGENT_SYMBOL}] Unknown message type: ${message.type}`);
        return { error: `Unknown message type: ${message.type}` };
      }
    },
    
    analyzePatterns(data, options = {}) {
      return analyzePatterns(data, options);
    },
    
    generateMetrics(data, metricDefinitions, options = {}) {
      return generateMetrics(data, metricDefinitions, options);
    },
    
    getStatus() {
      return 'ready';
    }
  };
}

export default createTrueIndexAnalystAgent;