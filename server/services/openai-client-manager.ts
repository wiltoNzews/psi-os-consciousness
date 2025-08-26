/**
 * OpenAI Client Manager
 * 
 * A centralized singleton manager for OpenAI API connections.
 * This ensures that we have only one OpenAI client instance across the application,
 * preventing multiple unnecessary connections and potential rate limit issues.
 */

import OpenAI from "openai";
import { log } from '../vite';

/**
 * Singleton OpenAI client manager
 */
class OpenAIClientManager {
  private static instance: OpenAIClientManager;
  private _client: OpenAI | null = null;
  private _isConnected: boolean = false;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): OpenAIClientManager {
    if (!OpenAIClientManager.instance) {
      OpenAIClientManager.instance = new OpenAIClientManager();
    }
    return OpenAIClientManager.instance;
  }

  /**
   * Get the OpenAI client instance, initializing it if needed
   */
  public get client(): OpenAI {
    if (!this._client) {
      this.initializeClient();
    }
    
    if (!this._client) {
      throw new Error('OpenAI client could not be initialized. Check your API key.');
    }
    
    return this._client;
  }

  /**
   * Check if the client is connected and ready
   */
  public get isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * Initialize the OpenAI client
   */
  private initializeClient(): void {
    try {
      if (!process.env.OPENAI_API_KEY) {
        log('OpenAI API key is not set in environment variables', 'error');
        this._isConnected = false;
        return;
      }

      this._client = new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY 
      });
      
      log('OpenAI client initialized', 'system');
    } catch (error) {
      this._isConnected = false;
      log(`Error initializing OpenAI client: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      console.error('OpenAI client initialization error:', error);
    }
  }

  /**
   * Validate API connection by making a minimal API call
   * @returns Promise resolving to true if connection is valid
   * @throws Error if connection fails
   */
  public async validateConnection(): Promise<boolean> {
    if (!this._client) {
      this.initializeClient();
    }

    if (!this._client) {
      throw new Error('OpenAI client could not be initialized. Check your API key.');
    }

    try {
      // Make a minimal API call to validate connection
      const response = await this._client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "System initialization test. Respond with 'connection_valid' only."
          },
          {
            role: "user",
            content: "Validate API connection"
          }
        ],
        max_tokens: 10,
        temperature: 0
      });
      
      // Verify we got a response
      if (response && response.choices && response.choices.length > 0) {
        log("OpenAI API connection validated successfully", 'system');
        this._isConnected = true;
        return true;
      } else {
        this._isConnected = false;
        throw new Error('OpenAI API returned an invalid response structure');
      }
    } catch (error) {
      this._isConnected = false;
      log(`OpenAI API connection validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      console.error("OpenAI API connection validation failed:", error);
      
      // Enhance error message with specific details based on error type
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('OpenAI API key is invalid or expired');
        } else if (error.message.includes('429')) {
          throw new Error('OpenAI API rate limit exceeded');
        } else if (error.message.includes('5')) {  // Any 5xx error
          throw new Error('OpenAI API server error - try again later');
        }
      }
      
      throw error;
    }
  }
}

// Export singleton instance
export const openAIClientManager = OpenAIClientManager.getInstance();