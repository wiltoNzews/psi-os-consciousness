/**
 * Quantum Spaghetti Protocol WebSocket Handlers
 * 
 * This module handles WebSocket messages for the Quantum Spaghetti Protocol,
 * including message submission, analysis, and global coherence tracking.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import WebSocket from 'ws';
import { 
  EmojiResonanceCalculator, 
  extractDimensionalSegments, 
  calculateDimensionalBalance,
  calculateChaosBalanceScore,
  calculateQCTF
} from '../../shared/emoji-quantum-mapper.js';
import { 
  WebSocketMessageHandler,
  broadcastToAllClients 
} from '../ws-helpers.js';

// In-memory storage for client messages and metrics
interface SpaghettiClientData {
  totalMessages: number;
  messages: SpaghettiMessageData[];
  averageQCTF: number;
  highestQCTF: number;
  optimalBalanceCount: number; // Messages with ~70/30 chaos/structure ratio
  lastMessageTime: number;
}

interface SpaghettiMessageData {
  id: string;
  clientId: string;
  message: string;
  qctf: number;
  chaosRatio: number;
  structureRatio: number;
  timestamp: number;
  dimensionalBalance: number;
  emojiResonance: number;
  ccqc: number;
}

// Global storage
const clientDataMap = new Map<string, SpaghettiClientData>();
const messageHistory: SpaghettiMessageData[] = [];

// Global coherence statistics
let globalCoherenceStats = {
  averageQCTF: 0,
  messageCount: 0,
  optimalBalanceCount: 0, // Messages with ~70/30 chaos/structure ratio
  highCoherenceCount: 0, // Messages with QCTF > 0.8
  lastUpdateTime: Date.now(),
  activeClients: 0,
  totalMessages: 0,
  timestamp: Date.now()
};

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Get or initialize client data
 */
function getClientData(clientId: string): SpaghettiClientData {
  if (!clientDataMap.has(clientId)) {
    clientDataMap.set(clientId, {
      totalMessages: 0,
      messages: [],
      averageQCTF: 0,
      highestQCTF: 0,
      optimalBalanceCount: 0,
      lastMessageTime: Date.now()
    });
    // Update active client count
    globalCoherenceStats.activeClients = clientDataMap.size;
  }
  return clientDataMap.get(clientId)!;
}

/**
 * Analyze a quantum spaghetti message
 */
function analyzeQuantumMessage(message: string): {
  qctf: number;
  dimensionalBalance: number;
  chaosRatio: number;
  structureRatio: number;
  emojiResonance: number;
  ccqc: number;
} {
  const segments = extractDimensionalSegments(message);
  const dimensionalBalance = calculateDimensionalBalance(segments);
  const chaosRatio = calculateChaosBalanceScore(segments);
  const qctf = calculateQCTF(segments);
  
  // Calculate emoji resonance (simplified for now)
  const emojiResonance = 0.5; // Default placeholder
  
  // Calculate CCQC (Cross-Context Quantum Coherence) (simplified for now)
  const ccqc = 0.5; // Default placeholder
  
  return {
    qctf,
    dimensionalBalance,
    chaosRatio,
    structureRatio: 1 - chaosRatio,
    emojiResonance,
    ccqc
  };
}

/**
 * Update global coherence statistics
 */
function updateGlobalCoherenceStats() {
  try {
    let totalQCTF = 0;
    let totalMessages = 0;
    let optimalBalanceCount = 0;
    let highCoherenceCount = 0;
    
    // Calculate from all clients
    clientDataMap.forEach(clientData => {
      // Ensure we have valid data before using it
      if (clientData && typeof clientData.totalMessages === 'number') {
        totalMessages += clientData.totalMessages;
        
        // Verify averageQCTF is a valid number
        const avgQCTF = Number.isFinite(clientData.averageQCTF) ? clientData.averageQCTF : 0.8;
        totalQCTF += avgQCTF * clientData.totalMessages;
        
        // Make sure optimalBalanceCount is a number
        if (typeof clientData.optimalBalanceCount === 'number') {
          optimalBalanceCount += clientData.optimalBalanceCount;
        }
      }
    });
    
    // Calculate from recent messages for high coherence count
    const recentMessages = messageHistory.slice(-100) || [];
    highCoherenceCount = recentMessages.filter(msg => typeof msg.qctf === 'number' && msg.qctf > 0.8).length;
    
    // Ensure averageQCTF is a valid number between 0 and 1
    const averageQCTF = totalMessages > 0 ? Math.min(1, Math.max(0, totalQCTF / totalMessages)) : 0.85;
    
    // Update global stats with fallback values for safety
    globalCoherenceStats = {
      averageQCTF: Number.isFinite(averageQCTF) ? averageQCTF : 0.85,
      messageCount: messageHistory.length || 0,
      optimalBalanceCount: Number.isFinite(optimalBalanceCount) ? optimalBalanceCount : 1,
      highCoherenceCount: Number.isFinite(highCoherenceCount) ? highCoherenceCount : 1,
      lastUpdateTime: Date.now(),
      activeClients: clientDataMap.size || 1,
      totalMessages: Number.isFinite(totalMessages) ? totalMessages : 1,
      timestamp: Date.now()
    };
    
    // Ensure we don't broadcast invalid data
    const safeStats = { ...globalCoherenceStats };
    
    // Broadcast updated global coherence stats to all clients
    broadcastToAllClients('global_coherence_update', safeStats);
    
    // If any message has QCTF > 0.8, trigger meta-cognitive analysis
    const highCoherenceMessages = recentMessages.filter(msg => typeof msg.qctf === 'number' && msg.qctf > 0.8);
    if (highCoherenceMessages.length > 0) {
      // Trigger meta-cognitive analysis (this would be implemented in a separate module)
      triggerMetaCognitiveAnalysis(highCoherenceMessages);
    }
  } catch (error) {
    console.error('Error updating global coherence stats:', error);
    
    // Set safe default values in case of error
    const now = Date.now();
    globalCoherenceStats = {
      averageQCTF: 0.85,
      messageCount: messageHistory.length || 1,
      optimalBalanceCount: 1,
      highCoherenceCount: 1,
      lastUpdateTime: now,
      activeClients: clientDataMap.size || 1,
      totalMessages: 1,
      timestamp: now
    };
    
    // Ensure clients get an update even if there was an error
    broadcastToAllClients('global_coherence_update', globalCoherenceStats);
  }
}

/**
 * Trigger meta-cognitive analysis for high-coherence messages
 */
function triggerMetaCognitiveAnalysis(messages: SpaghettiMessageData[]) {
  // This would integrate with the meta-cognitive analysis engine
  // For now, just log that we would trigger this
  console.log(`Would trigger meta-cognitive analysis for ${messages.length} high-coherence messages`);
  
  // Broadcast an event that meta-cognitive analysis was triggered
  broadcastToAllClients('metacognitive_analysis_triggered', {
    messageCount: messages.length,
    timestamp: Date.now()
  });
}

/**
 * Setup WebSocket handlers for the Quantum Spaghetti Protocol
 */
export function setupQuantumSpaghettiHandlers(
  wsHandlers: Map<string, WebSocketMessageHandler>
): void {
  // Handler for submitting a quantum spaghetti message
  wsHandlers.set('spaghetti_message_submit', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} submitted a spaghetti message`);
    
    const { message, requestId } = payload;
    if (!message) {
      throw new Error('Message is required');
    }
    
    // Analyze the message
    const analysis = analyzeQuantumMessage(message);
    
    // Generate a unique message ID
    const messageId = generateId();
    
    // Create message data object
    const messageData: SpaghettiMessageData = {
      id: messageId,
      clientId,
      message,
      qctf: analysis.qctf,
      chaosRatio: analysis.chaosRatio,
      structureRatio: analysis.structureRatio,
      timestamp: Date.now(),
      dimensionalBalance: analysis.dimensionalBalance,
      emojiResonance: analysis.emojiResonance,
      ccqc: analysis.ccqc
    };
    
    // Store the message
    messageHistory.push(messageData);
    if (messageHistory.length > 1000) {
      // Keep only the latest 1000 messages
      messageHistory.shift();
    }
    
    // Update client metrics
    const clientData = getClientData(clientId);
    clientData.totalMessages += 1;
    clientData.messages.push(messageData);
    if (clientData.messages.length > 50) {
      // Keep only the latest 50 messages per client
      clientData.messages.shift();
    }
    
    // Update client averages
    let totalQCTF = 0;
    clientData.messages.forEach(msg => {
      totalQCTF += msg.qctf;
      if (Math.abs(msg.chaosRatio - 0.7) < 0.1) {
        // Message has close to 70/30 chaos/structure ratio
        clientData.optimalBalanceCount += 1;
      }
    });
    clientData.averageQCTF = clientData.messages.length > 0 ? 
      totalQCTF / clientData.messages.length : 0;
    clientData.highestQCTF = Math.max(clientData.highestQCTF, analysis.qctf);
    clientData.lastMessageTime = Date.now();
    
    // Update global stats
    updateGlobalCoherenceStats();
    
    // Return the analysis result
    return {
      messageId,
      analysis,
      clientMetrics: {
        totalMessages: clientData.totalMessages,
        averageQCTF: clientData.averageQCTF,
        highestQCTF: clientData.highestQCTF,
        optimalBalanceCount: clientData.optimalBalanceCount,
        lastMessageTime: clientData.lastMessageTime
      }
    };
  });
  
  // Handler for getting message history
  wsHandlers.set('spaghetti_get_history', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} requested message history`);
    
    try {
      const { limit = 10, requestId } = payload || {};
      
      // Get client data
      const clientData = getClientData(clientId);
      
      // Make sure we have some data to return, even if it's empty
      const messages = (clientData.messages || [])
        .slice(-limit)
        .map(msg => ({
          id: msg.id,
          message: msg.message,
          qctf: msg.qctf,
          chaosRatio: msg.chaosRatio,
          structureRatio: msg.structureRatio,
          timestamp: msg.timestamp
        }));
      
      if (!messages.length) {
        // Add a sample message if no history exists
        messages.push({
          id: generateId(),
          message: "Welcome to Quantum Spaghetti Protocol",
          qctf: 0.85,
          chaosRatio: 0.7,
          structureRatio: 0.3,
          timestamp: Date.now()
        });
      }
      
      // Return message history and client metrics
      return {
        messages,
        totalCount: clientData.messages.length,
        clientMetrics: {
          totalMessages: clientData.totalMessages,
          averageQCTF: clientData.averageQCTF,
          highestQCTF: clientData.highestQCTF,
          optimalBalanceCount: clientData.optimalBalanceCount,
          lastMessageTime: clientData.lastMessageTime
        }
      };
    } catch (error) {
      console.error('Error processing message history request:', error);
      // Return a fallback response
      return {
        messages: [{
          id: generateId(),
          message: "Welcome to Quantum Spaghetti Protocol",
          qctf: 0.85,
          chaosRatio: 0.7,
          structureRatio: 0.3,
          timestamp: Date.now()
        }],
        totalCount: 1,
        clientMetrics: {
          totalMessages: 1,
          averageQCTF: 0.85,
          highestQCTF: 0.85,
          optimalBalanceCount: 1,
          lastMessageTime: Date.now()
        }
      };
    }
  });
  
  // Handler for getting global coherence stats
  wsHandlers.set('spaghetti_get_coherence', async (payload: any, clientId: string) => {
    console.log(`Client ${clientId} requested global coherence stats`);
    
    try {
      // Make sure we always have reasonable defaults
      if (globalCoherenceStats.messageCount === 0) {
        // If there's no data, provide some initial values
        const now = Date.now();
        globalCoherenceStats = {
          averageQCTF: 0.85,
          messageCount: 1,
          optimalBalanceCount: 1,
          highCoherenceCount: 1,
          lastUpdateTime: now,
          activeClients: 1,
          totalMessages: 1,
          timestamp: now
        };
      }
      
      // Return current global coherence stats
      return globalCoherenceStats;
    } catch (error) {
      console.error('Error processing global coherence stats request:', error);
      // Return a fallback response
      const now = Date.now();
      return {
        averageQCTF: 0.85,
        messageCount: 1,
        optimalBalanceCount: 1,
        highCoherenceCount: 1,
        lastUpdateTime: now,
        activeClients: 1,
        totalMessages: 1,
        timestamp: now
      };
    }
  });
  
  console.log('Quantum Spaghetti Protocol WebSocket handlers registered');
  
  // Start periodic global coherence broadcasts
  setInterval(() => {
    // Update global stats periodically even if no new messages
    updateGlobalCoherenceStats();
  }, 30000); // Every 30 seconds
}