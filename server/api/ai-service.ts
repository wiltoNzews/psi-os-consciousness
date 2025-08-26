/**
 * AI Service Router
 * 
 * This module provides direct API endpoints for AI service integration,
 * bypassing the neural orchestration layer for simplified access.
 * It connects directly to OpenAI and other AI services.
 */

import express, { Request, Response } from 'express';
import { 
  validateApiConnection,
  analyzeText,
  analyzeImage,
  generateAugmentationRecommendations,
  generateSymbioticResponse,
  mapConceptualConnections
} from '../services/openai';
import { 
  processTextAnalysisOutcome,
  processSymbioticResponseOutcome,
  TaskComplexity,
  TaskImportance
} from './ai-service-integration';

/**
 * Standardized response interface with performance metrics
 * These metrics are used for stability calculations and system monitoring
 */
export interface AIResponse<T> {
  /** The actual response data from the AI service */
  data: T;
  
  /** Performance metrics for stability calculations */
  metrics: {
    /** Time taken to process the request in milliseconds */
    responseTime: number;
    
    /** Whether the request succeeded (1) or failed (0) */
    successRate: number;
    
    /** Resource utilization estimate (0-1 scale) */
    resourceUtilization: number;
    
    /** Quality score estimate (0-1 scale) */
    qualityScore: number;
    
    /** Timestamp of when the request was processed */
    timestamp: Date;
  };
}

// Create router
export const aiServiceRouter = express.Router();

// Validate API connection
aiServiceRouter.get('/validate-connection', async (req: Request, res: Response) => {
  try {
    console.log('Validating OpenAI API connection');
    const valid = await validateApiConnection();
    console.log('OpenAI API connection validated successfully');
    return res.json({ valid, message: 'OpenAI API connection is valid' });
  } catch (error) {
    console.error('Failed to validate OpenAI API connection:', error);
    return res.status(500).json({ 
      valid: false, 
      message: 'Failed to validate OpenAI API connection',
      error: (error as Error).message
    });
  }
});

// Text analysis endpoint
aiServiceRouter.post('/analyze-text', async (req: Request, res: Response) => {
  try {
    const { text, domain, complexity, importance } = req.body;
    const startTime = Date.now();
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    console.log('Handling direct text analysis request');
    console.log(`Processing text analysis: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
    
    // Analyze text using OpenAI
    const result = await analyzeText(text);
    console.log('Analysis complete:', result);
    
    // Calculate performance metrics
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const resourceEstimate = Math.min(0.2 + (text.length / 10000), 0.9); // Estimate resource usage based on text length
    const qualityScore = result.confidence; // Use confidence from result as quality indicator
    
    // Process outcome for meta-learning and stability tracking
    await processTextAnalysisOutcome(text, result, {
      domain: domain || 'general',
      complexity: complexity ? parseFloat(complexity) : 
                  (text.length > 500 ? TaskComplexity.COMPLEX : TaskComplexity.MODERATE),
      importance: importance ? parseFloat(importance) : TaskImportance.MEDIUM
    });
    
    // Create AIResponse with metrics
    const response: AIResponse<typeof result> = {
      data: result,
      metrics: {
        responseTime,
        successRate: 1, // Success
        resourceUtilization: resourceEstimate,
        qualityScore,
        timestamp: new Date()
      }
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Failed to analyze text:', error);
    
    // Create error response with failure metrics
    const response: AIResponse<{insight: string, confidence: number, source: string, timestamp: Date}> = {
      data: {
        insight: "Error analyzing text",
        confidence: 0,
        source: 'ai',
        timestamp: new Date()
      },
      metrics: {
        responseTime: Date.now() - (req.body.startTime || Date.now()),
        successRate: 0, // Failure
        resourceUtilization: 0.1, // Minimal resource usage during error
        qualityScore: 0,
        timestamp: new Date()
      }
    };
    
    return res.status(500).json(response);
  }
});

// Image analysis endpoint
aiServiceRouter.post('/analyze-image', async (req: Request, res: Response) => {
  try {
    const { base64Image } = req.body;
    const startTime = Date.now();
    
    if (!base64Image || typeof base64Image !== 'string') {
      return res.status(400).json({ message: 'Base64 encoded image is required' });
    }
    
    // Analyze image using OpenAI
    const result = await analyzeImage(base64Image);
    
    // Process outcome for meta-learning
    // Note: We would need an image-specific processing function, similar to
    // the text analysis one, but customized for image analysis specifics
    
    // Calculate performance metrics
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const imageSize = base64Image.length * 0.75; // Rough approximation of decoded size in bytes
    const resourceEstimate = Math.min(0.3 + (imageSize / 1000000), 0.9); // Estimate resource usage based on image size
    const qualityScore = result.confidence; // Use confidence from result as quality indicator
    
    // Create AIResponse with metrics
    const response: AIResponse<typeof result> = {
      data: result,
      metrics: {
        responseTime,
        successRate: 1, // Success
        resourceUtilization: resourceEstimate,
        qualityScore,
        timestamp: new Date()
      }
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Failed to analyze image:', error);
    
    // Create error response with failure metrics
    const response: AIResponse<{insight: string, confidence: number, source: string, timestamp: Date}> = {
      data: {
        insight: "Error analyzing image",
        confidence: 0,
        source: 'ai',
        timestamp: new Date()
      },
      metrics: {
        responseTime: Date.now() - (req.body.startTime || Date.now()),
        successRate: 0, // Failure
        resourceUtilization: 0.1, // Minimal resource usage during error
        qualityScore: 0,
        timestamp: new Date()
      }
    };
    
    return res.status(500).json(response);
  }
});

// Symbiotic response endpoint (combined human + AI thinking)
aiServiceRouter.post('/symbiotic-response', async (req: Request, res: Response) => {
  try {
    const { humanInput, domain, complexity, importance } = req.body;
    const startTime = Date.now();
    
    if (!humanInput || typeof humanInput !== 'string') {
      return res.status(400).json({ message: 'Human input is required' });
    }
    
    console.log(`Processing symbiotic response for domain: ${domain || 'general'}`);
    
    // Generate symbiotic response
    const result = await generateSymbioticResponse(humanInput, domain || 'general');
    
    // Process outcome for meta-learning and stability tracking
    await processSymbioticResponseOutcome(humanInput, result, {
      domain: domain || 'general',
      complexity: complexity ? parseFloat(complexity) : undefined,
      importance: importance ? parseFloat(importance) : undefined
    });
    
    // Calculate performance metrics
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const inputComplexity = humanInput.length / 100; // Simple complexity measure based on input length
    const resourceEstimate = Math.min(0.2 + (inputComplexity * 0.05), 0.9); // Estimate resource usage based on complexity
    
    // Create AIResponse with metrics
    const response: AIResponse<typeof result> = {
      data: result,
      metrics: {
        responseTime,
        successRate: 1, // Success
        resourceUtilization: resourceEstimate,
        qualityScore: result.confidenceScore, // Use confidence from result as quality indicator
        timestamp: new Date()
      }
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Failed to generate symbiotic response:', error);
    
    // Create error response with failure metrics
    const response: AIResponse<{response: string, humanContribution: number, aiContribution: number, confidenceScore: number}> = {
      data: {
        response: "Unable to generate a symbiotic response at this time.",
        humanContribution: 0.5,
        aiContribution: 0.5,
        confidenceScore: 0
      },
      metrics: {
        responseTime: Date.now() - (req.body.startTime || Date.now()),
        successRate: 0, // Failure
        resourceUtilization: 0.1, // Minimal resource usage during error
        qualityScore: 0,
        timestamp: new Date()
      }
    };
    
    return res.status(500).json(response);
  }
});

// Augmentation recommendations endpoint
aiServiceRouter.post('/augmentation-recommendations', async (req: Request, res: Response) => {
  try {
    const { humanContext, domain } = req.body;
    const startTime = Date.now();
    
    if (!humanContext || typeof humanContext !== 'string') {
      return res.status(400).json({ message: 'Human context is required' });
    }
    
    console.log(`Processing augmentation recommendations for domain: ${domain || 'general'}`);
    
    // Generate augmentation recommendations
    const result = await generateAugmentationRecommendations(humanContext, domain || 'general');
    
    // Process outcome for meta-learning
    // Similar to other endpoints, we would implement a specific processing function
    
    // Calculate performance metrics
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const contextComplexity = humanContext.length / 100; // Simple complexity measure
    const resourceEstimate = Math.min(0.2 + (contextComplexity * 0.05), 0.9); // Estimate resource usage
    
    // Calculate quality score based on the number and quality of recommendations
    const recommendationCount = result.augmentations.length;
    const averageRecommendedLevel = result.augmentations.reduce((sum, item) => sum + item.recommendedLevel, 0) / 
                                    (recommendationCount || 1);
    const qualityScore = Math.min((recommendationCount * 0.1) + (averageRecommendedLevel / 20), 1);
    
    // Create AIResponse with metrics
    const response: AIResponse<typeof result> = {
      data: result,
      metrics: {
        responseTime,
        successRate: 1, // Success
        resourceUtilization: resourceEstimate,
        qualityScore,
        timestamp: new Date()
      }
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Failed to generate augmentation recommendations:', error);
    
    // Create error response with failure metrics
    const response: AIResponse<{augmentations: Array<{name: string, description: string, recommendedLevel: number, maxLevel: number}>}> = {
      data: {
        augmentations: [
          {
            name: "Basic Analysis",
            description: "AI assistance with basic data analysis tasks",
            recommendedLevel: 3,
            maxLevel: 10
          }
        ]
      },
      metrics: {
        responseTime: Date.now() - (req.body.startTime || Date.now()),
        successRate: 0, // Failure
        resourceUtilization: 0.1, // Minimal resource usage during error
        qualityScore: 0,
        timestamp: new Date()
      }
    };
    
    return res.status(500).json(response);
  }
});

// Concept mapping endpoint
aiServiceRouter.post('/concept-mapping', async (req: Request, res: Response) => {
  try {
    const { concepts, domain } = req.body;
    const startTime = Date.now();
    
    if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
      return res.status(400).json({ 
        message: 'At least two concepts are required for mapping' 
      });
    }
    
    // Map conceptual connections
    const result = await mapConceptualConnections(concepts, domain || 'general');
    
    // Process outcome for meta-learning
    // Similar to other endpoints, we would implement a specific processing function
    
    // Calculate performance metrics
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const conceptCount = concepts.length;
    const resourceEstimate = Math.min(0.1 * conceptCount, 0.9); // Resource usage based on number of concepts
    
    // Calculate quality score based on connections and strength
    const connectionCount = result.connections.length;
    const avgStrength = result.connections.reduce((sum, item) => sum + item.strength, 0) / 
                        (connectionCount || 1);
    const qualityScore = Math.min((connectionCount / (conceptCount * (conceptCount - 1) / 2)) * avgStrength, 1);
    
    // Create AIResponse with metrics
    const response: AIResponse<typeof result> = {
      data: result,
      metrics: {
        responseTime,
        successRate: 1, // Success
        resourceUtilization: resourceEstimate,
        qualityScore,
        timestamp: new Date()
      }
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Failed to map conceptual connections:', error);
    
    // Create error response with failure metrics
    const response: AIResponse<{connections: Array<{source: string, target: string, type: string, strength: number, description: string}>}> = {
      data: {
        connections: []
      },
      metrics: {
        responseTime: Date.now() - (req.body.startTime || Date.now()),
        successRate: 0, // Failure
        resourceUtilization: 0.1, // Minimal resource usage during error
        qualityScore: 0,
        timestamp: new Date()
      }
    };
    
    return res.status(500).json(response);
  }
});

// Endpoint to get stability metrics for the dashboard
aiServiceRouter.get('/stability-metrics', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Dynamically import to avoid circular dependencies
    const stabilityModule = await import('../services/qrn/inverse-pendulum-tracker');
    
    // Get stability history (last 20 points)
    const history = stabilityModule.getStabilityHistory(20);
    
    // Calculate trend over the last hour
    const trend = stabilityModule.analyzeStabilityTrend(3600000);
    
    // Calculate performance metrics
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const historyDataPoints = history.length;
    const resourceEstimate = Math.min(0.1 + (historyDataPoints * 0.01), 0.5); // Light operation
    
    // Calculate quality score based on data availability and trend accuracy
    const dataAvailabilityScore = Math.min(historyDataPoints / 20, 1); // Full points for having all 20 data points
    const qualityScore = trend.confidence * dataAvailabilityScore;
    
    // Create AIResponse with metrics
    const response: AIResponse<{currentData: any, history: any[], trend: any}> = {
      data: {
        currentData: history.length > 0 ? history[history.length - 1] : null,
        history,
        trend
      },
      metrics: {
        responseTime,
        successRate: 1, // Success
        resourceUtilization: resourceEstimate,
        qualityScore,
        timestamp: new Date()
      }
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Failed to get stability metrics:', error);
    
    // Create error response with failure metrics
    const response: AIResponse<{currentData: any, history: any[], trend: any}> = {
      data: {
        currentData: null,
        history: [],
        trend: {
          direction: 'unknown',
          magnitude: 0,
          confidence: 0,
          analysis: 'Unable to retrieve stability metrics'
        }
      },
      metrics: {
        responseTime: Date.now() - (req.body?.startTime || Date.now()),
        successRate: 0, // Failure
        resourceUtilization: 0.1,
        qualityScore: 0,
        timestamp: new Date()
      }
    };
    
    return res.status(500).json(response);
  }
});