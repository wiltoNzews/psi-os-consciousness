/**
 * Agent Manager
 * 
 * Manages the lifecycle and communication for system agents
 * following Void-Centered Design principles with explicit boundary handling.
 * 
 * BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * the agent management system and individual agent implementations.
 * It provides a clear interface for agent registration and message passing.
 */
import { v4 as uuidv4 } from 'uuid';
import type { AgentDependencies } from './index';

// Explicit interfaces for agent message handling with boundary awareness
/**
 * Agent Message Interface
 * 
 * Provides a structured contract for messages passed between agents and the agent manager.
 * Following Void-Centered Design principles by explicitly typing the message structure
 * to reduce uncertainty at system boundaries.
 */
export interface AgentMessage {
  // The message type - explicitly defines the kind of message
  type: 'task' | 'status' | 'command' | 'response' | 'error' | string;
  
  // The message data - can be structured according to message type
  data: Record<string, unknown>;
  
  // Optional metadata for tracing and debugging
  metadata?: {
    timestamp?: Date;
    source?: string;
    priority?: number;
    correlationId?: string;
  };
}

/**
 * Agent Interface
 * 
 * Defines the contract that all agents must implement to interact with the agent manager.
 * This enforces a clear boundary between the manager and agents.
 */
export interface AgentInterface {
  // Unique identifier for the agent
  id: string;
  
  // Human-readable name
  name: string;
  
  // Process a message sent to this agent
  processMessage(message: AgentMessage): void;
  
  // Get the current status of the agent
  getStatus(): string;
}

/**
 * Agent Manager Class
 * 
 * Manages the lifecycle of system agents following Void-Centered Design principles
 * by explicitly handling boundaries between components and providing clear,
 * type-safe interfaces for agent interactions.
 */
export class AgentManager {
  // Registry of active agents mapped by their IDs
  private agents: Record<string, AgentInterface> = {};
  
  // Dependencies required by agents (context service, task store)
  private dependencies: AgentDependencies;
  
  // Message processing history for debugging and analysis
  private messageHistory: Array<{
    timestamp: Date;
    targetId: string;
    messageType: string;
    success: boolean;
  }> = [];
  
  /**
   * Initialize the Agent Manager with required dependencies
   * 
   * @param dependencies Service dependencies required by agents
   */
  constructor(dependencies: AgentDependencies) {
    // BOUNDARY CROSSING: Accepting external dependencies 
    this.dependencies = dependencies;
    console.log('Agent Manager initialized with explicit type boundaries');
  }
  
  /**
   * Register a new agent with the manager
   * 
   * BOUNDARY AWARENESS: Creates a new entry point for message processing
   * 
   * @param name Human-readable name for the agent
   * @param agentImpl Implementation of the agent interface
   * @returns Unique ID for the registered agent
   */
  registerAgent(name: string, agentImpl: AgentInterface): string {
    try {
      const id = uuidv4();
      this.agents[id] = agentImpl;
      console.log(`Agent registered: ${name} with ID ${id}`);
      return id;
    } catch (error) {
      // Explicit error handling for boundary operations
      console.error(`Failed to register agent '${name}':`, error);
      throw new Error(`Agent registration failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Process a message directed to a specific agent
   * 
   * BOUNDARY AWARENESS: This is a critical boundary between the manager and agents
   * where messages cross from one context to another
   * 
   * @param id Target agent ID
   * @param message Message to process
   * @throws Error if agent not found or message processing fails
   */
  processMessage(id: string, message: AgentMessage): void {
    try {
      // Record message processing attempt
      const historyEntry = {
        timestamp: new Date(),
        targetId: id,
        messageType: message.type,
        success: false
      };
      
      if (!this.agents[id]) {
        console.error(`No agent found with ID: ${id}`);
        this.messageHistory.push(historyEntry);
        throw new Error(`Agent not found: ${id}`);
      }
      
      // BOUNDARY CROSSING: Message passes from manager to agent
      this.agents[id].processMessage(message);
      
      // Record successful message processing
      historyEntry.success = true;
      this.messageHistory.push(historyEntry);
    } catch (error) {
      console.error(`Error processing message for agent ${id}:`, error);
      throw new Error(`Message processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Get the current status of an agent
   * 
   * @param id Agent ID
   * @returns Status string or null if agent not found
   */
  getAgentStatus(id: string): string | null {
    try {
      if (this.agents[id]) {
        return this.agents[id].getStatus();
      }
      return null;
    } catch (error) {
      console.error(`Error getting status for agent ${id}:`, error);
      return 'error';
    }
  }
  
  /**
   * Get information about all registered agents
   * 
   * @returns Array of agent information objects
   */
  getAllAgents(): Array<{id: string, name: string, status: string}> {
    try {
      return Object.entries(this.agents).map(([id, agent]) => ({
        id,
        name: agent.name,
        status: agent.getStatus()
      }));
    } catch (error) {
      console.error('Error retrieving agent list:', error);
      return [];
    }
  }
  
  /**
   * Get message processing history for debugging
   * 
   * @param limit Maximum number of history entries to retrieve
   * @returns Recent message processing history
   */
  getMessageHistory(limit = 50): Array<{timestamp: Date, targetId: string, messageType: string, success: boolean}> {
    return this.messageHistory.slice(-limit);
  }
  
  /**
   * Unregister an agent from the manager
   * 
   * @param id ID of the agent to unregister
   * @returns true if agent was unregistered, false if not found
   */
  unregisterAgent(id: string): boolean {
    if (this.agents[id]) {
      delete this.agents[id];
      console.log(`Agent unregistered: ${id}`);
      return true;
    }
    return false;
  }
}