/**
 * Vector Alignment Module
 * 
 * This module provides functions for measuring alignment between vectors,
 * particularly for calculating coherence between agent states represented as vectors.
 * 
 * Includes various similarity measures:
 * - Cosine similarity
 * - Euclidean distance-based similarity
 * - Aggregated vector alignment for multi-agent systems
 * 
 * [QUANTUM_STATE: FOUNDATION_FLOW]
 */

/**
 * Calculate cosine similarity between two vectors
 * 
 * @param v1 First vector
 * @param v2 Second vector
 * @returns Similarity value in range [-1,1], where 1 means identical direction
 */
export function computeCosineSimilarity(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  if (v1.length === 0) return 0;
  
  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i];
  }
  
  // Calculate magnitudes
  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < v1.length; i++) {
    mag1 += v1[i] * v1[i];
    mag2 += v2[i] * v2[i];
  }
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  // Handle zero magnitude vectors
  if (mag1 === 0 || mag2 === 0) return 0;
  
  // Calculate cosine similarity
  return dotProduct / (mag1 * mag2);
}

/**
 * Convert cosine similarity [-1,1] to normalized similarity [0,1]
 * 
 * @param cosineSimilarity Cosine similarity value in range [-1,1]
 * @returns Normalized similarity in range [0,1]
 */
export function normalizeCosineSimilarity(cosineSimilarity: number): number {
  // Map from [-1,1] to [0,1]
  return (cosineSimilarity + 1) / 2;
}

/**
 * Calculate Euclidean distance-based similarity between two vectors
 * 
 * @param v1 First vector
 * @param v2 Second vector
 * @returns Similarity value in range [0,1], where 1 means identical vectors
 */
export function computeEuclideanSimilarity(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) {
    throw new Error('Vectors must have the same dimensions');
  }
  
  if (v1.length === 0) return 1; // Empty vectors are defined as identical
  
  // Calculate squared Euclidean distance
  let squaredDistance = 0;
  for (let i = 0; i < v1.length; i++) {
    const diff = v1[i] - v2[i];
    squaredDistance += diff * diff;
  }
  
  // Convert distance to similarity using exponential decay
  // This maps [0,∞) to (0,1], where distance 0 = similarity 1
  return Math.exp(-Math.sqrt(squaredDistance));
}

/**
 * Calculate mean vector from a set of vectors
 * 
 * @param vectors Array of vectors (all must have same dimension)
 * @returns Mean vector
 */
export function calculateMeanVector(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  
  const dim = vectors[0].length;
  const result = new Array(dim).fill(0);
  
  // Sum all vectors
  for (const vec of vectors) {
    if (vec.length !== dim) {
      throw new Error('All vectors must have the same dimension');
    }
    
    for (let i = 0; i < dim; i++) {
      result[i] += vec[i];
    }
  }
  
  // Divide by count to get mean
  for (let i = 0; i < dim; i++) {
    result[i] /= vectors.length;
  }
  
  return result;
}

/**
 * Calculate aggregated vector coherence for multiple agents
 * 
 * @param vectors Array of agent state vectors
 * @param targetVector Optional target/reference vector
 * @returns Object containing coherence value and additional metrics
 */
export function calculateVectorCoherence(
  vectors: number[][],
  targetVector?: number[]
): {value: number, meanSimilarity: number, pairwiseSimilarities: number[]} {
  if (vectors.length === 0) {
    return {value: 0, meanSimilarity: 0, pairwiseSimilarities: []};
  }
  
  // If only one vector, coherence is defined as 1 (perfectly aligned with itself)
  if (vectors.length === 1) {
    return {value: 1, meanSimilarity: 1, pairwiseSimilarities: [1]};
  }
  
  // Create default target vector as mean of all vectors if not provided
  const referenceVector = targetVector ?? calculateMeanVector(vectors);
  
  // Calculate similarity of each vector to the reference
  const similarities: number[] = vectors.map(vec => 
    normalizeCosineSimilarity(computeCosineSimilarity(vec, referenceVector))
  );
  
  // Calculate mean similarity
  const meanSimilarity = similarities.reduce((sum, val) => sum + val, 0) / similarities.length;
  
  // Calculate pairwise similarities between all vectors
  const pairwiseSimilarities: number[] = [];
  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      const similarity = normalizeCosineSimilarity(
        computeCosineSimilarity(vectors[i], vectors[j])
      );
      pairwiseSimilarities.push(similarity);
    }
  }
  
  // Calculate the overall coherence value
  // If the mean similarity is close to 0.7500, the coherence is high
  // Using a Gaussian-like function centered at 0.7500
  const optimalCoherence = 0.7500; // The attractor point
  const sigma = 0.15; // Width of the Gaussian
  const distance = Math.abs(meanSimilarity - optimalCoherence);
  const coherenceValue = Math.exp(-(distance * distance) / (2 * sigma * sigma));
  
  return {
    value: coherenceValue,
    meanSimilarity: meanSimilarity,
    pairwiseSimilarities: pairwiseSimilarities
  };
}

/**
 * Calculate vector coherence with weights for different agent types
 * 
 * @param agentVectors Array of agent objects with vectors and optional type/weight
 * @param targetVector Optional target vector
 * @returns Object containing coherence value and additional metrics
 */
export function calculateComplexVectorCoherence(
  agentVectors: Array<{vector: number[], weight?: number, type?: string}>,
  targetVector?: number[]
): {value: number, byType: {[key: string]: number}, meanSimilarity: number} {
  if (agentVectors.length === 0) {
    return {value: 0, byType: {}, meanSimilarity: 0};
  }
  
  // Extract vectors and weights
  const vectors = agentVectors.map(a => a.vector);
  const weights = agentVectors.map(a => a.weight ?? 1);
  
  // Create default target vector as weighted mean of all vectors if not provided
  let referenceVector = targetVector;
  if (!referenceVector) {
    // Calculate weighted mean vector
    const dim = vectors[0].length;
    referenceVector = new Array(dim).fill(0);
    let totalWeight = 0;
    
    for (let i = 0; i < vectors.length; i++) {
      const weight = weights[i];
      totalWeight += weight;
      for (let j = 0; j < dim; j++) {
        referenceVector[j] += vectors[i][j] * weight;
      }
    }
    
    for (let j = 0; j < dim; j++) {
      referenceVector[j] /= totalWeight;
    }
  }
  
  // Calculate weighted similarity of each vector to the reference
  const similarities: number[] = [];
  for (let i = 0; i < vectors.length; i++) {
    const similarity = normalizeCosineSimilarity(
      computeCosineSimilarity(vectors[i], referenceVector)
    );
    similarities.push(similarity);
  }
  
  // Calculate weighted mean similarity
  let meanSimilarity = 0;
  let totalWeight = 0;
  for (let i = 0; i < similarities.length; i++) {
    meanSimilarity += similarities[i] * weights[i];
    totalWeight += weights[i];
  }
  meanSimilarity /= totalWeight;
  
  // Calculate coherence by agent type
  const typeCoherence: {[key: string]: {sum: number, count: number}} = {};
  for (let i = 0; i < agentVectors.length; i++) {
    const type = agentVectors[i].type ?? 'default';
    if (!typeCoherence[type]) {
      typeCoherence[type] = {sum: 0, count: 0};
    }
    typeCoherence[type].sum += similarities[i];
    typeCoherence[type].count++;
  }
  
  // Convert to average by type
  const byType: {[key: string]: number} = {};
  for (const [type, data] of Object.entries(typeCoherence)) {
    byType[type] = data.sum / data.count;
  }
  
  // Calculate the overall coherence value
  // If the mean similarity is close to 0.7500, the coherence is high
  const optimalCoherence = 0.7500; // The attractor point
  const sigma = 0.15; // Width of the Gaussian
  const distance = Math.abs(meanSimilarity - optimalCoherence);
  const coherenceValue = Math.exp(-(distance * distance) / (2 * sigma * sigma));
  
  return {
    value: coherenceValue,
    byType: byType,
    meanSimilarity: meanSimilarity
  };
}