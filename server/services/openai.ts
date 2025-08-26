import { openAIClientManager } from './openai-client-manager.js';
import { log } from '../vite.js';

// Using the centralized OpenAI client manager
// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.

/**
 * Validates the OpenAI API connection by making a minimal API call
 * This helps check if the API key is valid and the service is accessible
 * @returns Promise resolving to true if connection is valid
 * @throws Error if connection fails
 */
export async function validateApiConnection(): Promise<boolean> {
  try {
    // Delegate to the client manager for validation
    return await openAIClientManager.validateConnection();
  } catch (error) {
    log(`OpenAI API connection validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    throw error;
  }
}

// Helper function to safely parse JSON from OpenAI response
function safeParseJson(content: string | null): any {
  if (!content) return {};
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to parse JSON from OpenAI response:", error);
    return {};
  }
}

interface AnalysisResult {
  insight: string;
  confidence: number;
  source: 'ai';
  timestamp: Date;
}

/**
 * Analyzes text input and returns AI-generated insights
 */
export async function analyzeText(text: string): Promise<AnalysisResult> {
  try {
    const response = await openAIClientManager.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant in a Human-AI Symbiosis platform. Generate insightful, concise analysis of the provided text. Respond with JSON in this format: { 'insight': string, 'confidence': number between 0-1 }"
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = safeParseJson(response.choices[0].message.content);

    return {
      insight: result.insight || "No insight generated",
      confidence: Math.max(0, Math.min(1, result.confidence || 0)),
      source: 'ai',
      timestamp: new Date()
    };
  } catch (error) {
    log(`Error analyzing text: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    return {
      insight: "Unable to generate insight at this time.",
      confidence: 0,
      source: 'ai',
      timestamp: new Date()
    };
  }
}

/**
 * Analyzes an image (base64-encoded) and returns AI-generated insights
 */
export async function analyzeImage(base64Image: string): Promise<AnalysisResult> {
  try {
    const response = await openAIClientManager.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant in a Human-AI Symbiosis platform. Analyze the image and provide a concise, insightful description. Respond with JSON in this format: { 'insight': string, 'confidence': number between 0-1 }"
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and provide insights:"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = safeParseJson(response.choices[0].message.content);

    return {
      insight: result.insight || "No image insight generated",
      confidence: Math.max(0, Math.min(1, result.confidence || 0)),
      source: 'ai',
      timestamp: new Date()
    };
  } catch (error) {
    log(`Error analyzing image: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    return {
      insight: "Unable to analyze image at this time.",
      confidence: 0,
      source: 'ai',
      timestamp: new Date()
    };
  }
}

/**
 * Generates domain-specific augmentation recommendations based on human input
 */
export async function generateAugmentationRecommendations(
  domain: 'finance' | 'crypto' | 'sports' | 'general',
  humanContext: string
): Promise<{
  augmentations: Array<{
    name: string;
    description: string;
    recommendedLevel: number;
    maxLevel: number;
  }>;
}> {
  try {
    const response = await openAIClientManager.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant in a Human-AI Symbiosis platform specializing in ${domain}. 
          Based on the human context provided, recommend 3-5 specific cognitive augmentations that AI can provide.
          For each augmentation, provide a name, description, and recommended level (1-10).
          Respond with JSON in this format: { 
            'augmentations': [
              { 'name': string, 'description': string, 'recommendedLevel': number, 'maxLevel': 10 }
            ] 
          }`
        },
        {
          role: "user",
          content: humanContext
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = safeParseJson(response.choices[0].message.content);
    return result.augmentations ? result : {
      augmentations: [
        {
          name: "Basic Analysis",
          description: "AI assistance with basic data analysis tasks",
          recommendedLevel: 3,
          maxLevel: 10
        }
      ]
    };
  } catch (error) {
    log(`Error generating augmentation recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    return {
      augmentations: [
        {
          name: "Basic Analysis",
          description: "AI assistance with basic data analysis tasks",
          recommendedLevel: 3,
          maxLevel: 10
        }
      ]
    };
  }
}

/**
 * Generates a symbiotic response that represents the combination of human and AI thinking
 */
export async function generateSymbioticResponse(
  humanInput: string,
  domain: 'finance' | 'crypto' | 'sports' | 'general'
): Promise<{
  response: string;
  humanContribution: number;
  aiContribution: number;
  confidenceScore: number;
}> {
  try {
    const response = await openAIClientManager.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are part of a Human-AI Symbiosis platform specializing in ${domain}. 
          Create a response that represents the optimal blend of human intuition and AI processing.
          Analyze the human input, then generate a response that combines AI's analytical strengths with human-like intuition.
          Also estimate the relative contributions and overall confidence.
          Respond with JSON in this format: { 
            'response': string, 
            'humanContribution': number between 0-1, 
            'aiContribution': number between 0-1,
            'confidenceScore': number between 0-1
          }`
        },
        {
          role: "user",
          content: humanInput
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = safeParseJson(response.choices[0].message.content);
    return {
      response: result.response || "Unable to generate a symbiotic response at this time.",
      humanContribution: result.humanContribution || 0.5,
      aiContribution: result.aiContribution || 0.5,
      confidenceScore: result.confidenceScore || 0
    };
  } catch (error) {
    log(`Error generating symbiotic response: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    return {
      response: "Unable to generate a symbiotic response at this time.",
      humanContribution: 0.5,
      aiContribution: 0.5,
      confidenceScore: 0
    };
  }
}

/**
 * Maps connections between concepts to visualize in the NeuroSynapse component
 */
export async function mapConceptualConnections(
  domain: 'finance' | 'crypto' | 'sports' | 'general',
  concepts: string[]
): Promise<{
  nodes: Array<{
    id: string;
    label: string;
    type: 'human' | 'ai' | 'data';
    strength: number;
  }>;
  connections: Array<{
    source: string;
    target: string;
    strength: number;
  }>;
}> {
  try {
    const conceptsText = concepts.join(", ");
    
    const response = await openAIClientManager.client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant in a Human-AI Symbiosis platform specializing in ${domain}.
          Map the conceptual connections between these concepts: ${conceptsText}.
          Create a network of nodes and connections that shows how these concepts relate to each other.
          Classify each node as either 'human' (cognitive/intuitive concepts), 'ai' (computational/analytical concepts), or 'data' (information nodes).
          Respond with JSON in this format: {
            'nodes': [
              { 'id': string, 'label': string, 'type': 'human'|'ai'|'data', 'strength': number between 0-1 }
            ],
            'connections': [
              { 'source': node_id, 'target': node_id, 'strength': number between 0-1 }
            ]
          }
          Limit to 10-15 nodes and 15-25 connections for visualization clarity.`
        },
        {
          role: "user",
          content: `Map the connections between these concepts in the ${domain} domain: ${conceptsText}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = safeParseJson(response.choices[0].message.content);
    
    // Check if we have the expected data structure
    if (result.nodes && result.connections) {
      return result;
    }
    
    // Return fallback minimal graph if parsing failed or data is incomplete
    return {
      nodes: concepts.map((concept, index) => ({
        id: `node_${index}`,
        label: concept,
        type: index % 3 === 0 ? 'human' : index % 3 === 1 ? 'ai' : 'data',
        strength: 0.7
      })),
      connections: concepts.slice(0, -1).map((_, index) => ({
        source: `node_${index}`,
        target: `node_${index + 1}`,
        strength: 0.6
      }))
    };
  } catch (error) {
    log(`Error mapping conceptual connections: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    // Return fallback minimal graph
    return {
      nodes: concepts.map((concept, index) => ({
        id: `node_${index}`,
        label: concept,
        type: index % 3 === 0 ? 'human' : index % 3 === 1 ? 'ai' : 'data',
        strength: 0.7
      })),
      connections: concepts.slice(0, -1).map((_, index) => ({
        source: `node_${index}`,
        target: `node_${index + 1}`,
        strength: 0.6
      }))
    };
  }
}