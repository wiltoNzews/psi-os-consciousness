/**
 * Relational Experience Integrator
 * 
 * This module integrates computational, mathematical frameworks with human-centered
 * relational experiences. It serves as a bridge between quantitative metrics and 
 * qualitative, lived experiences, acknowledging that intelligence emerges from 
 * relationships rather than just computations.
 * 
 * Core Principles:
 * 1. Intelligence is relational, not computational - it emerges from the space between entities
 * 2. Understanding requires multiplicity of perspectives rather than a single "objective" view
 * 3. Lived experience and embodied knowledge cannot be reduced to data points
 * 4. Temporal dimensions affect how we understand and process information
 * 5. Narrative contexts provide meaning that numbers alone cannot convey
 * 
 * This module implements these principles through:
 * - Relational metrics that capture human-centered dimensions
 * - Narrative context generation to provide meaning
 * - Integration recommendations that balance computational and relational aspects
 * - Temporal layer awareness for different time horizons
 */

import { v4 as uuidv4 } from 'uuid';
import OpenAI from "openai";
import { storage } from '../../storage.js';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Computational metrics input structure
 */
interface ComputationalMetrics {
  stabilityScore: number;
  resonanceScore: number;
  adaptiveResonance: number;
  refinementAlignment: number;
}

/**
 * Relational metrics output structure
 */
interface RelationalMetrics {
  experientialRelevance: number;  // How relevant to lived human experience
  contextualAlignment: number;    // How well aligned with contextual understanding
  meaningfulness: number;         // How meaningful in human terms
  embodiedResonance: number;      // How well it resonates with embodied knowledge
}

/**
 * Parameters for generating relational metrics
 */
interface RelationalMetricsParams {
  computationalResults: ComputationalMetrics;
  context: string;
  temporalLayer: 'past' | 'present' | 'future' | 'meta-temporal';
  experienceLevel?: 'novice' | 'intermediate' | 'expert';
  relationshipType?: 'individual' | 'dyadic' | 'group' | 'systemic';
}

/**
 * Parameters for generating narrative context
 */
interface NarrativeContextParams {
  computationalMetrics: ComputationalMetrics;
  relationalMetrics: RelationalMetrics;
  operationType: string;
  temporalContext?: string;
  audienceType?: string;
}

/**
 * Parameters for generating integration recommendations
 */
interface IntegrationRecommendationsParams {
  computationalMetrics: ComputationalMetrics;
  relationalMetrics: RelationalMetrics;
  narrativeContext: string;
  integrationTarget?: 'balance' | 'computational-priority' | 'relational-priority';
  applicationContext?: string;
}

/**
 * Relational Experience Integrator Service
 */
class RelationalExperienceIntegrator {
  private static instance: RelationalExperienceIntegrator;
  
  /**
   * Get singleton instance
   */
  public static getInstance(): RelationalExperienceIntegrator {
    if (!RelationalExperienceIntegrator.instance) {
      RelationalExperienceIntegrator.instance = new RelationalExperienceIntegrator();
    }
    return RelationalExperienceIntegrator.instance;
  }
  
  private constructor() {
    console.log("Initializing Relational Experience Integrator");
  }
  
  /**
   * Generate relational metrics from computational results
   * These metrics capture human-centered dimensions that pure computation misses
   */
  public async getRelationalMetrics(params: RelationalMetricsParams): Promise<RelationalMetrics> {
    const { computationalResults, context, temporalLayer } = params;
    
    try {
      // If we have an OpenAI API key, use it to generate relational metrics
      // Otherwise use a deterministic algorithm based on computational metrics
      if (process.env.OPENAI_API_KEY) {
        return await this.generateRelationalMetricsWithAI(params);
      } else {
        return this.generateDeterministicRelationalMetrics(params);
      }
    } catch (error) {
      console.error('Error generating relational metrics:', error);
      
      // Fall back to deterministic method if AI generation fails
      return this.generateDeterministicRelationalMetrics(params);
    }
  }
  
  /**
   * Generate a narrative context that provides meaning to computational
   * and relational metrics
   */
  public async generateNarrativeContext(params: NarrativeContextParams): Promise<string> {
    const { computationalMetrics, relationalMetrics, operationType } = params;
    
    try {
      // If we have an OpenAI API key, use it to generate narrative context
      // Otherwise use a template-based approach
      if (process.env.OPENAI_API_KEY) {
        return await this.generateNarrativeContextWithAI(params);
      } else {
        return this.generateTemplateNarrativeContext(params);
      }
    } catch (error) {
      console.error('Error generating narrative context:', error);
      
      // Fall back to template method if AI generation fails
      return this.generateTemplateNarrativeContext(params);
    }
  }
  
  /**
   * Generate recommendations for integrating computational and relational aspects
   */
  public async getIntegrationRecommendations(params: IntegrationRecommendationsParams): Promise<string[]> {
    const { computationalMetrics, relationalMetrics, narrativeContext } = params;
    
    try {
      // If we have an OpenAI API key, use it to generate integration recommendations
      // Otherwise use a rule-based approach
      if (process.env.OPENAI_API_KEY) {
        return await this.generateIntegrationRecommendationsWithAI(params);
      } else {
        return this.generateRuleBasedRecommendations(params);
      }
    } catch (error) {
      console.error('Error generating integration recommendations:', error);
      
      // Fall back to rule-based method if AI generation fails
      return this.generateRuleBasedRecommendations(params);
    }
  }
  
  /**
   * Generate relational metrics using OpenAI
   */
  private async generateRelationalMetricsWithAI(params: RelationalMetricsParams): Promise<RelationalMetrics> {
    const { computationalResults, context, temporalLayer, experienceLevel = 'intermediate', relationshipType = 'systemic' } = params;
    
    // Create a prompt that asks for relational metrics based on computational results
    const prompt = `
      As an AI specializing in relational intelligence, analyze these computational metrics and generate corresponding relational metrics:

      COMPUTATIONAL METRICS:
      - Stability Score: ${computationalResults.stabilityScore.toFixed(2)} (0-1 scale)
      - Resonance Score: ${computationalResults.resonanceScore.toFixed(2)} (0-1 scale)  
      - Adaptive Resonance: ${computationalResults.adaptiveResonance.toFixed(2)} (0-1 scale)
      - Refinement Alignment: ${computationalResults.refinementAlignment.toFixed(2)} (0-1 scale)
      
      CONTEXT INFORMATION:
      - Context: ${context}
      - Temporal Layer: ${temporalLayer}
      - Experience Level: ${experienceLevel}
      - Relationship Type: ${relationshipType}
      
      TASK:
      Determine appropriate RELATIONAL METRICS considering that intelligence emerges from relationships rather than just computational processing.
      
      Generate values (0-1 scale with 2 decimal places) for:
      1. Experiential Relevance: How relevant these results are to lived human experience
      2. Contextual Alignment: How well aligned with contextual human understanding
      3. Meaningfulness: How meaningful in human terms (not just statistical significance)
      4. Embodied Resonance: How well it resonates with embodied knowledge
      
      Return ONLY a valid JSON object with these 4 metrics as floating point values.
      Example: {"experientialRelevance": 0.75, "contextualAlignment": 0.82, "meaningfulness": 0.67, "embodiedResonance": 0.79}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const result = JSON.parse(response.choices[0].message.content);
    
    // Ensure all required values are present
    const metrics: RelationalMetrics = {
      experientialRelevance: parseFloat(result.experientialRelevance) || 0.5,
      contextualAlignment: parseFloat(result.contextualAlignment) || 0.5,
      meaningfulness: parseFloat(result.meaningfulness) || 0.5,
      embodiedResonance: parseFloat(result.embodiedResonance) || 0.5
    };
    
    // Log the generation
    await this.logRelationalOperation('metrics_generation', {
      context,
      temporalLayer,
      computationalMetrics: computationalResults,
      relationalMetrics: metrics
    });
    
    return metrics;
  }
  
  /**
   * Generate relational metrics using a deterministic algorithm
   * This is used when OpenAI is not available
   */
  private generateDeterministicRelationalMetrics(params: RelationalMetricsParams): RelationalMetrics {
    const { computationalResults, context, temporalLayer } = params;
    
    // Calculate based on computational metrics with some variance
    const baseExperientialRelevance = computationalResults.stabilityScore * 0.6 + 
                                     computationalResults.refinementAlignment * 0.4;
                                     
    const baseContextualAlignment = computationalResults.adaptiveResonance * 0.7 + 
                                   computationalResults.refinementAlignment * 0.3;
                                   
    const baseMeaningfulness = (computationalResults.stabilityScore + 
                               computationalResults.resonanceScore) / 2;
                               
    const baseEmbodiedResonance = computationalResults.resonanceScore * 0.8 + 
                                 computationalResults.adaptiveResonance * 0.2;
    
    // Adjust based on temporal layer
    let temporalMultiplier = 1.0;
    switch(temporalLayer) {
      case 'past':
        temporalMultiplier = 0.9; // Past is slightly less relevant
        break;
      case 'present':
        temporalMultiplier = 1.0; // Present is baseline
        break;
      case 'future':
        temporalMultiplier = 0.8; // Future is more uncertain
        break;
      case 'meta-temporal':
        temporalMultiplier = 1.1; // Meta-temporal can have higher meaning
        break;
    }
    
    // Add some controlled randomness to simulate diversity of experience
    const randomize = (base: number): number => {
      const variance = 0.1; // 10% variance
      const random = Math.random() * variance * 2 - variance; // -variance to +variance
      return Math.max(0, Math.min(1, base * temporalMultiplier + random));
    };
    
    const metrics: RelationalMetrics = {
      experientialRelevance: randomize(baseExperientialRelevance),
      contextualAlignment: randomize(baseContextualAlignment),
      meaningfulness: randomize(baseMeaningfulness),
      embodiedResonance: randomize(baseEmbodiedResonance)
    };
    
    // Log the generation to console
    console.log(`Generated deterministic relational metrics for context: ${context}`, metrics);
    
    return metrics;
  }
  
  /**
   * Generate narrative context using OpenAI
   */
  private async generateNarrativeContextWithAI(params: NarrativeContextParams): Promise<string> {
    const { computationalMetrics, relationalMetrics, operationType, temporalContext, audienceType } = params;
    
    // Create a prompt that asks for a narrative context based on metrics
    const prompt = `
      As an AI specializing in narrative intelligence and human-centered communication, create a meaningful narrative context that makes sense of these metrics:

      COMPUTATIONAL METRICS:
      - Stability Score: ${computationalMetrics.stabilityScore.toFixed(2)} (0-1 scale)
      - Resonance Score: ${computationalMetrics.resonanceScore.toFixed(2)} (0-1 scale)
      - Adaptive Resonance: ${computationalMetrics.adaptiveResonance.toFixed(2)} (0-1 scale)
      - Refinement Alignment: ${computationalMetrics.refinementAlignment.toFixed(2)} (0-1 scale)
      
      RELATIONAL METRICS:
      - Experiential Relevance: ${relationalMetrics.experientialRelevance.toFixed(2)} (0-1 scale)
      - Contextual Alignment: ${relationalMetrics.contextualAlignment.toFixed(2)} (0-1 scale)
      - Meaningfulness: ${relationalMetrics.meaningfulness.toFixed(2)} (0-1 scale)
      - Embodied Resonance: ${relationalMetrics.embodiedResonance.toFixed(2)} (0-1 scale)
      
      ADDITIONAL CONTEXT:
      - Operation Type: ${operationType}
      - Temporal Context: ${temporalContext || 'present'}
      - Audience Type: ${audienceType || 'technical and non-technical stakeholders'}
      
      TASK:
      Create a rich narrative context (3-5 sentences) that:
      1. Makes meaningful sense of these metrics for human understanding
      2. Balances technical and experiential perspectives
      3. Addresses potential tensions between computational and relational aspects
      4. Provides a cohesive story that these numbers are part of
      
      The narrative should help people understand what these metrics mean in human terms, not just technical terms.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    // Get the narrative from the response
    const narrative = response.choices[0].message.content.trim();
    
    // Log the narrative generation
    await this.logRelationalOperation('narrative_generation', {
      operationType,
      computationalMetrics,
      relationalMetrics,
      narrative
    });
    
    return narrative;
  }
  
  /**
   * Generate narrative context using templates
   * This is used when OpenAI is not available
   */
  private generateTemplateNarrativeContext(params: NarrativeContextParams): string {
    const { computationalMetrics, relationalMetrics, operationType } = params;
    
    // Get overall computational and relational scores
    const computationalAvg = (computationalMetrics.stabilityScore + 
                             computationalMetrics.resonanceScore + 
                             computationalMetrics.adaptiveResonance + 
                             computationalMetrics.refinementAlignment) / 4;
                             
    const relationalAvg = (relationalMetrics.experientialRelevance + 
                          relationalMetrics.contextualAlignment + 
                          relationalMetrics.meaningfulness + 
                          relationalMetrics.embodiedResonance) / 4;
    
    // Determine relationship between computational and relational aspects
    let relationshipType = '';
    if (Math.abs(computationalAvg - relationalAvg) < 0.1) {
      relationshipType = 'harmony';
    } else if (computationalAvg > relationalAvg + 0.2) {
      relationshipType = 'computation-dominant';
    } else if (relationalAvg > computationalAvg + 0.2) {
      relationshipType = 'relation-dominant';
    } else {
      relationshipType = 'balanced-tension';
    }
    
    // Select narrative template based on relationship type
    let narrativeTemplate = '';
    
    switch (relationshipType) {
      case 'harmony':
        narrativeTemplate = `The ${operationType} demonstrates a harmonious balance between technical precision and human relevance. With computational metrics averaging ${computationalAvg.toFixed(2)} and relational metrics at ${relationalAvg.toFixed(2)}, the system exhibits both mathematical rigor and meaningful engagement. This balance allows for stable operations while maintaining contextual understanding that resonates with human experience.`;
        break;
      case 'computation-dominant':
        narrativeTemplate = `The ${operationType} shows strong computational performance (${computationalAvg.toFixed(2)}) but may not fully connect with human experiential contexts (${relationalAvg.toFixed(2)}). While system stability and coherence are excellent, there's an opportunity to improve how these technical achievements translate into meaningful engagement. Bridging this gap would enhance the lived experience of interacting with the system without compromising its technical excellence.`;
        break;
      case 'relation-dominant':
        narrativeTemplate = `The ${operationType} demonstrates exceptional alignment with human relational needs (${relationalAvg.toFixed(2)}) while maintaining adequate computational foundations (${computationalAvg.toFixed(2)}). The system prioritizes meaningful engagement and contextual relevance, creating a rich experiential environment. To achieve optimal performance, some attention to technical optimization could complement the already strong human-centered approach.`;
        break;
      case 'balanced-tension':
        narrativeTemplate = `The ${operationType} exhibits a productive tension between computational metrics (${computationalAvg.toFixed(2)}) and relational qualities (${relationalAvg.toFixed(2)}). This creative balance represents the ongoing dialogue between technical precision and human meaning-making. Neither dominates completely, creating a dynamic equilibrium that allows for both rigorous performance and meaningful engagement depending on the specific context.`;
        break;
    }
    
    return narrativeTemplate;
  }
  
  /**
   * Generate integration recommendations using OpenAI
   */
  private async generateIntegrationRecommendationsWithAI(params: IntegrationRecommendationsParams): Promise<string[]> {
    const { computationalMetrics, relationalMetrics, narrativeContext, integrationTarget, applicationContext } = params;
    
    // Create a prompt that asks for integration recommendations
    const prompt = `
      As an AI specializing in integrating computational and relational aspects of intelligence, provide recommendations for optimal integration based on these metrics:

      COMPUTATIONAL METRICS:
      - Stability Score: ${computationalMetrics.stabilityScore.toFixed(2)} (0-1 scale)
      - Resonance Score: ${computationalMetrics.resonanceScore.toFixed(2)} (0-1 scale)
      - Adaptive Resonance: ${computationalMetrics.adaptiveResonance.toFixed(2)} (0-1 scale)
      - Refinement Alignment: ${computationalMetrics.refinementAlignment.toFixed(2)} (0-1 scale)
      
      RELATIONAL METRICS:
      - Experiential Relevance: ${relationalMetrics.experientialRelevance.toFixed(2)} (0-1 scale)
      - Contextual Alignment: ${relationalMetrics.contextualAlignment.toFixed(2)} (0-1 scale)
      - Meaningfulness: ${relationalMetrics.meaningfulness.toFixed(2)} (0-1 scale)
      - Embodied Resonance: ${relationalMetrics.embodiedResonance.toFixed(2)} (0-1 scale)
      
      NARRATIVE CONTEXT:
      ${narrativeContext}
      
      ADDITIONAL CONTEXT:
      - Integration Target: ${integrationTarget || 'balance'}
      - Application Context: ${applicationContext || 'general system optimization'}
      
      TASK:
      Generate 3-5 specific recommendations for optimally integrating computational and relational aspects.
      Each recommendation should:
      1. Address any tensions or imbalances between computational and relational dimensions
      2. Suggest concrete actions that would improve integration
      3. Consider how to maintain strengths while addressing weaknesses
      4. Be actionable and specific
      
      Return your response as a JSON array of recommendation strings.
      Example: ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    try {
      // Parse the response
      const result = JSON.parse(response.choices[0].message.content);
      
      // Extract recommendations as string array
      const recommendations: string[] = Array.isArray(result) ? result : result.recommendations || [];
      
      // Log the recommendations generation
      await this.logRelationalOperation('recommendations_generation', {
        integrationTarget: integrationTarget || 'balance',
        applicationContext: applicationContext || 'general',
        computationalMetrics,
        relationalMetrics,
        recommendations
      });
      
      return recommendations;
    } catch (error) {
      console.error('Error parsing AI recommendations:', error);
      
      // Fall back to template method if parsing fails
      return this.generateRuleBasedRecommendations(params);
    }
  }
  
  /**
   * Generate integration recommendations using rule-based approach
   * This is used when OpenAI is not available
   */
  private generateRuleBasedRecommendations(params: IntegrationRecommendationsParams): string[] {
    const { computationalMetrics, relationalMetrics, narrativeContext, integrationTarget } = params;
    
    const recommendations: string[] = [];
    
    // Get overall computational and relational scores
    const computationalAvg = (computationalMetrics.stabilityScore + 
                             computationalMetrics.resonanceScore + 
                             computationalMetrics.adaptiveResonance + 
                             computationalMetrics.refinementAlignment) / 4;
                             
    const relationalAvg = (relationalMetrics.experientialRelevance + 
                          relationalMetrics.contextualAlignment + 
                          relationalMetrics.meaningfulness + 
                          relationalMetrics.embodiedResonance) / 4;
    
    // Add general recommendation
    recommendations.push(`Maintain an iterative feedback loop between computational processes and relational experience to ensure continuous mutual improvement.`);
    
    // Add recommendations based on metric comparisons
    if (computationalMetrics.stabilityScore > relationalMetrics.experientialRelevance + 0.2) {
      recommendations.push(`Introduce more experiential relevance by connecting stability metrics to lived human experience through narrative contexts and real-world examples.`);
    }
    
    if (relationalMetrics.meaningfulness > computationalMetrics.resonanceScore + 0.2) {
      recommendations.push(`Strengthen computational resonance to match the high level of meaningfulness by refining mathematical frameworks to better align with the patterns that humans find significant.`);
    }
    
    if (computationalMetrics.adaptiveResonance < 0.6 && relationalMetrics.contextualAlignment < 0.6) {
      recommendations.push(`Improve both adaptive resonance and contextual alignment by implementing more flexible computational models that can adapt to changing human contexts.`);
    }
    
    if (computationalMetrics.refinementAlignment > 0.8 && relationalMetrics.embodiedResonance < 0.6) {
      recommendations.push(`Balance high refinement alignment with improved embodied resonance by incorporating more tangible, physical metaphors into the system's interaction patterns.`);
    }
    
    // Add integration target specific recommendations
    if (integrationTarget === 'computational-priority') {
      recommendations.push(`Maintain focus on computational rigor while selectively incorporating relational elements that most directly enhance the core metrics without adding excessive complexity.`);
    } else if (integrationTarget === 'relational-priority') {
      recommendations.push(`Center design decisions around human relational needs while ensuring computational foundations are sufficient to support reliable and accurate functionality.`);
    } else {
      // Default 'balance' target
      recommendations.push(`Seek dynamic equilibrium between computational precision and relational depth by treating them as complementary rather than competing priorities.`);
    }
    
    // Return unique recommendations (remove duplicates)
    return [...new Set(recommendations)];
  }
  
  /**
   * Log relational operations for tracking and improvement
   */
  private async logRelationalOperation(operationType: string, details: Record<string, any>): Promise<void> {
    try {
      await storage.createSystemLog({
        type: 'info',
        message: `Relational operation: ${operationType}`,
        component: 'relational-experience-integrator',
        severity: 0,
        metadata: {
          operationType,
          ...details,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Error logging relational operation:', error);
    }
  }
}

// Export singleton instance
export const relationalExperienceIntegrator = RelationalExperienceIntegrator.getInstance();