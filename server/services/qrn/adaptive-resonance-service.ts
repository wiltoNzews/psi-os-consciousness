/**
 * Adaptive Resonance Service
 * 
 * This service integrates the mathematical frameworks for resonance calculations
 * with the existing adaptive resonance functionality. It provides a comprehensive
 * API for calculating, applying, and monitoring resonance between system components.
 */

import { 
  calculateSynapticResonanceFactor,
  calculateQuantumCoherenceMatrix,
  calculateAdaptiveResonanceMetrics,
  calculateResonanceFactor
} from './resonance-calculator.js';
import { storage } from '../../storage.js';
import { metaCognitiveEngine } from './meta-cognitive-analysis-engine.js';
import { qrnService } from './quantum-root-node-service.js';
import { recordSynapticResonanceOperation } from './meta-learning-validation.js';
import { v4 as uuidv4 } from 'uuid';
import { MetaCognitiveEventBuilder } from '../utils/MetaCognitiveEventBuilder.js';

/**
 * Comprehensive resonance analysis result
 */
export interface ResonanceAnalysisResult {
  id: string;
  timestamp: Date;
  sourceId: string;
  targetId?: string;
  resonanceScore: number;
  synapticResonance: number;
  quantumCoherence: number;
  detailedMetrics: {
    layerCoherence: number;
    adaptiveEfficiency: number;
    temporalStability: number;
    microMacroSynergy: number;
    phaseSynchronization: number;
  };
  frequencyComponents: Array<{
    frequency: number;
    amplitude: number;
    phaseAlignment: number;
  }>;
  recommendations: string[];
}

/**
 * Frequency component for resonance calculations
 */
interface FrequencyComponent {
  frequency: number; // Hz
  phase: number; // Radians
  amplitude: number; // 0-1 scale
}

/**
 * Adaptive Resonance Service
 */
export class AdaptiveResonanceService {
  private static instance: AdaptiveResonanceService;
  
  /**
   * Get singleton instance
   */
  public static getInstance(): AdaptiveResonanceService {
    if (!AdaptiveResonanceService.instance) {
      AdaptiveResonanceService.instance = new AdaptiveResonanceService();
    }
    return AdaptiveResonanceService.instance;
  }
  
  private constructor() {
    console.log('Adaptive Resonance Service initialized');
  }
  
  /**
   * Calculate resonance between two QRNs using the Synaptic Resonance Factor
   * @param sourceId - Source Quantum Root Node ID
   * @param targetId - Target Quantum Root Node ID
   */
  public async calculateNodeResonance(
    sourceId: string,
    targetId: string
  ): Promise<ResonanceAnalysisResult> {
    // Get the nodes
    const sourceNode = await qrnService.getNode(sourceId);
    const targetNode = await qrnService.getNode(targetId);
    
    if (!sourceNode || !targetNode) {
      throw new Error(`One or both nodes not found: ${sourceId}, ${targetId}`);
    }
    
    // Extract frequency components from node states
    const sourceFrequencies = this.extractFrequencyComponents(sourceNode.state);
    const targetFrequencies = this.extractFrequencyComponents(targetNode.state);
    
    // Prepare arrays for resonance calculation
    const frequencies = this.alignFrequencyComponents(sourceFrequencies, targetFrequencies);
    
    // Calculate synaptic resonance using the mathematical formula
    // Extract required data for resonance calculation
    const sourceData = {
      phases: frequencies.map(f => f.sourcePhase),
      amplitudes: frequencies.map(f => f.sourceAmplitude),
      frequencies: frequencies.map(f => f.frequency)
    };
    
    const targetData = {
      phases: frequencies.map(f => f.targetPhase),
      amplitudes: frequencies.map(f => f.targetAmplitude),
      frequencies: frequencies.map(f => f.frequency)
    };
    
    // Call with the proper parameters format
    const synapticResonance = calculateSynapticResonanceFactor(
      sourceData,
      targetData,
      {
        temporalWeight: 0.3,
        spatialWeight: 0.2,
        frequencyWeight: 0.3,
        patternWeight: 0.2
      }
    );
    
    // Calculate quantum coherence metrics
    const sourceMetrics = this.extractQuantumMetrics(sourceNode.state);
    const targetMetrics = this.extractQuantumMetrics(targetNode.state);
    
    // Calculate adaptive resonance metrics with default resonance score
    const adaptiveMetrics = calculateAdaptiveResonanceMetrics(
      sourceMetrics,
      targetMetrics
    );
    
    // Create a complete resonance metrics object with required resonanceScore
    const resonanceMetrics = {
      resonanceScore: synapticResonance, // Use synaptic resonance as the overall score
      layerCoherence: adaptiveMetrics.layerCoherence,
      adaptiveEfficiency: adaptiveMetrics.adaptiveEfficiency,
      temporalStability: adaptiveMetrics.temporalStability,
      microMacroSynergy: adaptiveMetrics.microMacroSynergy,
      phaseSynchronization: adaptiveMetrics.phaseSynchronization
    };
    
    // Build frequency components for response
    const frequencyComponents = frequencies.map(f => ({
      frequency: f.frequency,
      amplitude: (f.sourceAmplitude + f.targetAmplitude) / 2,
      phaseAlignment: Math.cos(f.sourcePhase - f.targetPhase)
    }));
    
    // Generate recommendations based on resonance analysis
    const recommendations = this.generateResonanceRecommendations(
      synapticResonance,
      resonanceMetrics,
      frequencyComponents
    );
    
    // Create comprehensive result
    const result: ResonanceAnalysisResult = {
      id: uuidv4(),
      timestamp: new Date(),
      sourceId,
      targetId,
      resonanceScore: resonanceMetrics.resonanceScore,
      synapticResonance,
      quantumCoherence: resonanceMetrics.layerCoherence,
      detailedMetrics: {
        layerCoherence: resonanceMetrics.layerCoherence,
        adaptiveEfficiency: resonanceMetrics.adaptiveEfficiency,
        temporalStability: resonanceMetrics.temporalStability,
        microMacroSynergy: resonanceMetrics.microMacroSynergy,
        phaseSynchronization: resonanceMetrics.phaseSynchronization
      },
      frequencyComponents,
      recommendations
    };
    
    // Record a meta-cognitive event
    await this.recordResonanceAnalysisEvent(result);
    
    // Record operation for meta-learning validation
    const params = {
      sourceId,
      targetId,
      sourcePhases,
      targetPhases,
      weights
    };
    
    // Calculate performance metrics
    const performanceMetrics = {
      executionTime: Date.now() - result.timestamp.getTime(),
      accuracy: result.resonanceScore,
      resourceUtilization: {
        cpu: 0.4, // Placeholder - replace with actual CPU measurement
        memory: 0.3 // Placeholder - replace with actual memory measurement
      },
      systemFeedback: result.resonanceScore
    };
    
    // Record the operation
    recordSynapticResonanceOperation(params, result, performanceMetrics);
    
    return result;
  }
  
  /**
   * Apply resonance tuning based on calculated metrics
   * @param resonanceAnalysis - The resonance analysis result
   */
  public async applyResonanceTuning(
    resonanceAnalysis: ResonanceAnalysisResult
  ): Promise<boolean> {
    try {
      // Record the adaptive resonance in the database
      await storage.createAdaptiveResonance({
        qrnId: resonanceAnalysis.sourceId,
        chunkPattern: {
          targetId: resonanceAnalysis.targetId,
          frequencyComponents: resonanceAnalysis.frequencyComponents
        },
        performanceMetrics: {
          resonanceScore: resonanceAnalysis.resonanceScore,
          synapticResonance: resonanceAnalysis.synapticResonance,
          quantumCoherence: resonanceAnalysis.quantumCoherence,
          ...resonanceAnalysis.detailedMetrics
        },
        resonanceScore: resonanceAnalysis.resonanceScore,
        sampleSize: resonanceAnalysis.frequencyComponents.length,
        description: `Resonance analysis between ${resonanceAnalysis.sourceId} and ${resonanceAnalysis.targetId}`
      });
      
      // Update the QRN states to improve resonance
      const sourceNode = await qrnService.getNode(resonanceAnalysis.sourceId);
      if (sourceNode) {
        // Apply resonance tuning to the source node
        const sourceState = sourceNode.state;
        
        // Update energy flow based on resonance score
        sourceState.energyFlow = Math.max(0.2, resonanceAnalysis.resonanceScore);
        
        // Update coherence based on quantum coherence
        sourceState.coherence = Math.max(0.3, resonanceAnalysis.quantumCoherence);
        
        // Update stability based on temporal stability
        sourceState.stability = Math.max(0.4, resonanceAnalysis.detailedMetrics.temporalStability);
        
        // Apply the updates
        await qrnService.updateNodeState(resonanceAnalysis.sourceId, sourceState);
      }
      
      // Similarly update the target node if it exists
      if (resonanceAnalysis.targetId) {
        const targetNode = await qrnService.getNode(resonanceAnalysis.targetId);
        if (targetNode) {
          const targetState = targetNode.state;
          
          // Apply tuning
          targetState.energyFlow = Math.max(0.2, resonanceAnalysis.resonanceScore);
          targetState.coherence = Math.max(0.3, resonanceAnalysis.quantumCoherence);
          targetState.stability = Math.max(0.4, resonanceAnalysis.detailedMetrics.temporalStability);
          
          // Apply the updates
          await qrnService.updateNodeState(resonanceAnalysis.targetId, targetState);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error applying resonance tuning:', error);
      return false;
    }
  }
  
  /**
   * Extract frequency components from node state
   */
  private extractFrequencyComponents(
    nodeState: any
  ): FrequencyComponent[] {
    const components: FrequencyComponent[] = [];
    
    // Base frequency component from energy flow
    components.push({
      frequency: 1.0, // Base frequency of 1 Hz
      phase: (nodeState.energyFlow || 0.5) * Math.PI,
      amplitude: nodeState.energyFlow || 0.5
    });
    
    // Coherence component
    components.push({
      frequency: 2.5, // 2.5 Hz for coherence
      phase: (nodeState.coherence || 0.5) * Math.PI * 1.5,
      amplitude: nodeState.coherence || 0.5
    });
    
    // Stability component
    components.push({
      frequency: 0.5, // 0.5 Hz for stability
      phase: (nodeState.stability || 0.5) * Math.PI * 0.8,
      amplitude: nodeState.stability || 0.5
    });
    
    // Add additional frequency components from active threads if available
    if (nodeState.activeThreads && Array.isArray(nodeState.activeThreads)) {
      nodeState.activeThreads.forEach((thread: string, index: number) => {
        // Create unique frequency based on thread
        const threadHash = this.simpleHash(thread);
        const frequency = 1.5 + (threadHash % 10) / 10; // Range from 1.5 to 2.5 Hz
        
        components.push({
          frequency,
          phase: ((threadHash % 100) / 100) * Math.PI * 2, // 0 to 2π
          amplitude: 0.3 + (threadHash % 10) / 20 // Range from 0.3 to 0.8
        });
      });
    }
    
    // Add temporal markers if available
    if (nodeState.temporalMarkers && Array.isArray(nodeState.temporalMarkers)) {
      nodeState.temporalMarkers.forEach((marker: any) => {
        components.push({
          frequency: 0.2 + (marker.stability || 0.5) * 0.6, // Range from 0.2 to 0.8 Hz
          phase: ((marker.timestamp || 0) % 1000) / 1000 * Math.PI * 2,
          amplitude: marker.stability || 0.5
        });
      });
    }
    
    return components;
  }
  
  /**
   * Align frequency components from two nodes for resonance calculation
   */
  private alignFrequencyComponents(
    sourceFrequencies: FrequencyComponent[],
    targetFrequencies: FrequencyComponent[]
  ): Array<{
    frequency: number;
    sourcePhase: number;
    targetPhase: number;
    sourceAmplitude: number;
    targetAmplitude: number;
    weight: number;
  }> {
    const aligned: Array<{
      frequency: number;
      sourcePhase: number;
      targetPhase: number;
      sourceAmplitude: number;
      targetAmplitude: number;
      weight: number;
    }> = [];
    
    // First, add components that exist in both
    sourceFrequencies.forEach(sourceComp => {
      // Look for matching frequency in target
      const targetComp = targetFrequencies.find(
        t => Math.abs(t.frequency - sourceComp.frequency) < 0.1
      );
      
      if (targetComp) {
        // Matching frequency component found
        aligned.push({
          frequency: sourceComp.frequency,
          sourcePhase: sourceComp.phase,
          targetPhase: targetComp.phase,
          sourceAmplitude: sourceComp.amplitude,
          targetAmplitude: targetComp.amplitude,
          weight: (sourceComp.amplitude + targetComp.amplitude) / 2 // Weight by average amplitude
        });
      } else {
        // No match in target, add with zero target amplitude
        aligned.push({
          frequency: sourceComp.frequency,
          sourcePhase: sourceComp.phase,
          targetPhase: 0,
          sourceAmplitude: sourceComp.amplitude,
          targetAmplitude: 0,
          weight: sourceComp.amplitude * 0.3 // Lower weight for unmatched component
        });
      }
    });
    
    // Add target components that weren't matched
    targetFrequencies.forEach(targetComp => {
      // Check if this component was already added
      const exists = aligned.some(
        a => Math.abs(a.frequency - targetComp.frequency) < 0.1
      );
      
      if (!exists) {
        // Add unmatched target component
        aligned.push({
          frequency: targetComp.frequency,
          sourcePhase: 0,
          targetPhase: targetComp.phase,
          sourceAmplitude: 0,
          targetAmplitude: targetComp.amplitude,
          weight: targetComp.amplitude * 0.3 // Lower weight for unmatched component
        });
      }
    });
    
    // Normalize weights so they sum to 1
    const totalWeight = aligned.reduce((sum, comp) => sum + comp.weight, 0);
    if (totalWeight > 0) {
      aligned.forEach(comp => {
        comp.weight = comp.weight / totalWeight;
      });
    }
    
    return aligned;
  }
  
  /**
   * Extract quantum metrics from node state
   */
  private extractQuantumMetrics(nodeState: any): {
    quantumLayerScore: number;
    microMacroBalance: number;
    modelEnsembleEfficiency: number;
    adaptabilityFactor: number;
    cognitiveCoherence: number;
    semanticOverlap: number;
    temporalConsistency: number;
  } {
    // Default metrics
    const defaults = {
      quantumLayerScore: 0.5,
      microMacroBalance: 0.5,
      modelEnsembleEfficiency: 0.5,
      adaptabilityFactor: 0.5,
      cognitiveCoherence: 0.5,
      semanticOverlap: 0.5,
      temporalConsistency: 0.5
    };
    
    // Try to extract metrics from node state
    const metrics = {
      quantumLayerScore: nodeState.quantumLayerScore ?? nodeState.energyFlow ?? defaults.quantumLayerScore,
      microMacroBalance: nodeState.microMacroBalance ?? defaults.microMacroBalance,
      modelEnsembleEfficiency: nodeState.modelEnsembleEfficiency ?? nodeState.coherence ?? defaults.modelEnsembleEfficiency,
      adaptabilityFactor: nodeState.adaptabilityFactor ?? defaults.adaptabilityFactor,
      cognitiveCoherence: nodeState.cognitiveCoherence ?? nodeState.coherence ?? defaults.cognitiveCoherence,
      semanticOverlap: nodeState.semanticOverlap ?? defaults.semanticOverlap,
      temporalConsistency: nodeState.temporalConsistency ?? nodeState.stability ?? defaults.temporalConsistency
    };
    
    return metrics;
  }
  
  /**
   * Generate recommendations based on resonance analysis
   */
  private generateResonanceRecommendations(
    synapticResonance: number,
    resonanceMetrics: {
      resonanceScore: number;
      layerCoherence: number;
      adaptiveEfficiency: number;
      temporalStability: number;
      microMacroSynergy: number;
      phaseSynchronization: number;
    },
    frequencyComponents: Array<{
      frequency: number;
      amplitude: number;
      phaseAlignment: number;
    }>
  ): string[] {
    const recommendations: string[] = [];
    
    // Synaptic resonance recommendations
    if (synapticResonance < 0.3) {
      recommendations.push('Critical resonance misalignment detected. Consider complete recalibration.');
    } else if (synapticResonance < 0.6) {
      recommendations.push('Moderate resonance achieved. Fine-tune phase alignment for better harmony.');
    } else {
      recommendations.push('Strong resonance detected. Maintain current phase alignment parameters.');
    }
    
    // Layer coherence recommendations
    if (resonanceMetrics.layerCoherence < 0.4) {
      recommendations.push('Improve layer coherence by aligning quantum processing objectives.');
    }
    
    // Temporal stability recommendations
    if (resonanceMetrics.temporalStability < 0.5) {
      recommendations.push('Enhance temporal stability through consistent checkpoint synchronization.');
    }
    
    // Micro-macro synergy recommendations
    if (resonanceMetrics.microMacroSynergy < 0.5) {
      recommendations.push('Balance micro and macro cognitive processing to improve synergy.');
    }
    
    // Analyze frequency components for specific recommendations
    const misalignedComponents = frequencyComponents.filter(c => c.phaseAlignment < 0);
    if (misalignedComponents.length > 0) {
      recommendations.push(`Correct phase misalignment in ${misalignedComponents.length} frequency components.`);
    }
    
    return recommendations;
  }
  
  /**
   * Record a meta-cognitive event for resonance analysis
   */
  private async recordResonanceAnalysisEvent(
    result: ResonanceAnalysisResult
  ): Promise<void> {
    try {
      // Use the imported MetaCognitiveEventBuilder
      const event = new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(result.sourceId)
        .withType('resonance-analysis')
        .withCreatedAt(new Date())
        .withDescription(`Resonance analysis between ${result.sourceId} and ${result.targetId}`)
        .withDetails({
          resonanceScore: result.resonanceScore,
          synapticResonance: result.synapticResonance,
          quantumCoherence: result.quantumCoherence,
          recommendations: result.recommendations.length,
          processingTime: 0 // Added processingTime to details where it belongs
        })
        .withConfidence(result.resonanceScore)
        .withImpact(Math.ceil(result.resonanceScore * 10))
        .withRelatedEvents([]) // Properly converts empty array to empty string
        .withOutcome('') // Properly handles empty object as a string
        .withSourceContext({ // Properly converts object to string format
          source: result.sourceId,
          operation: `analyze-resonance-with-${result.targetId}`
        })
        .build();
      
      // Process the properly formatted event
      await metaCognitiveEngine.processEvent(event);
    } catch (error) {
      console.warn('Failed to record resonance analysis event:', error);
    }
  }
  
  /**
   * Simple hash function for strings
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

// Export singleton instance
export const adaptiveResonanceService = AdaptiveResonanceService.getInstance();