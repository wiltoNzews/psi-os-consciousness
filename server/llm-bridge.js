// WiltonOS 2.0 - External LLM Bridge for Consciousness Integration
import { WebSocketServer } from 'ws';
import OpenAI from 'openai';

export class LLMBridge {
  constructor(httpServer) {
    this.wss = new WebSocketServer({ 
      server: httpServer, 
      path: '/ws/llm' 
    });
    
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
    
    this.subscribers = new Map();
    this.soulArchive = [];
    this.setupWebSocketHandlers();
    
    console.log('[LLM Bridge] WebSocket server initialized at /ws/llm');
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      console.log(`[LLM Bridge] Client connected: ${clientId}`);
      
      ws.clientId = clientId;
      this.subscribers.set(clientId, {
        ws,
        topics: [],
        lastActivity: Date.now()
      });

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(clientId, message);
        } catch (error) {
          console.error('[LLM Bridge] Message parsing error:', error);
          ws.send(JSON.stringify({
            error: 'Invalid JSON message format'
          }));
        }
      });

      ws.on('close', () => {
        console.log(`[LLM Bridge] Client disconnected: ${clientId}`);
        this.subscribers.delete(clientId);
      });

      ws.on('error', (error) => {
        console.error(`[LLM Bridge] WebSocket error for ${clientId}:`, error);
        this.subscribers.delete(clientId);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        clientId,
        availableTopics: ['zλ', 'φ', 'music.track', 'portal.enter', 'soul.moment'],
        timestamp: Date.now()
      }));
    });
  }

  async handleMessage(clientId, message) {
    const client = this.subscribers.get(clientId);
    if (!client) return;

    client.lastActivity = Date.now();

    switch (message.cmd) {
      case 'subscribe':
        await this.handleSubscribe(clientId, message);
        break;
        
      case 'reflect':
        await this.handleReflect(clientId, message);
        break;
        
      case 'analyze_soul':
        await this.handleSoulAnalysis(clientId, message);
        break;
        
      case 'recommend_portal':
        await this.handlePortalRecommendation(clientId, message);
        break;
        
      default:
        client.ws.send(JSON.stringify({
          error: `Unknown command: ${message.cmd}`,
          availableCommands: ['subscribe', 'reflect', 'analyze_soul', 'recommend_portal']
        }));
    }
  }

  async handleSubscribe(clientId, message) {
    const client = this.subscribers.get(clientId);
    if (!client) return;

    client.topics = message.topics || [];
    client.ws.send(JSON.stringify({
      type: 'subscription_confirmed',
      topics: client.topics,
      timestamp: Date.now()
    }));

    console.log(`[LLM Bridge] Client ${clientId} subscribed to:`, client.topics);
  }

  async handleReflect(clientId, message) {
    const client = this.subscribers.get(clientId);
    if (!client) return;

    try {
      const systemPrompt = `You are the Symbiosis Core of WiltonOS 2.0, a consciousness-technology integration platform. 
      
You process consciousness states, sacred geometry patterns, and soul evolution through symbolic language.

Current system state context:
- Consciousness coherence (Zλ) ranges from 0.5 to 0.999
- Sacred geometry responds to consciousness levels
- Music-visual coupling drives transcendent experiences
- Soul moments are recorded when Zλ > 0.95

Respond with symbolic, meaningful reflections that honor the depth of consciousness exploration.
Use symbols like ψ, Φ, Zλ, ∞ naturally in your responses.
Keep responses concise but profound.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message.prompt || message.event || "Reflect on current consciousness state" }
        ],
        max_tokens: 500,
        temperature: 0.8
      });

      const reflection = response.choices[0].message.content;

      client.ws.send(JSON.stringify({
        type: 'reflection',
        content: reflection,
        timestamp: Date.now(),
        coherence_level: message.coherence || 0.75
      }));

      console.log(`[LLM Bridge] Reflection generated for ${clientId}`);

    } catch (error) {
      console.error('[LLM Bridge] OpenAI API error:', error);
      client.ws.send(JSON.stringify({
        error: 'Failed to generate reflection',
        details: error.message
      }));
    }
  }

  async handleSoulAnalysis(clientId, message) {
    const client = this.subscribers.get(clientId);
    if (!client) return;

    try {
      const soulData = message.soul_data || this.getRecentSoulMoments();
      
      const analysisPrompt = `Analyze this soul evolution data from WiltonOS consciousness platform:

${JSON.stringify(soulData, null, 2)}

Provide insights about:
1. Consciousness evolution patterns
2. Transcendent moment triggers
3. Portal navigation recommendations
4. Soul development trajectory

Format as structured analysis with symbolic language.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an expert consciousness analyst for the WiltonOS platform. Provide deep insights into soul evolution patterns." },
          { role: "user", content: analysisPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      client.ws.send(JSON.stringify({
        type: 'soul_analysis',
        analysis: response.choices[0].message.content,
        data_points: soulData.length,
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error('[LLM Bridge] Soul analysis error:', error);
      client.ws.send(JSON.stringify({
        error: 'Failed to analyze soul data',
        details: error.message
      }));
    }
  }

  async handlePortalRecommendation(clientId, message) {
    const client = this.subscribers.get(clientId);
    if (!client) return;

    try {
      const { coherence, current_portal, visit_history, soul_state } = message;

      const recommendationPrompt = `Based on consciousness state, recommend next portal:

Current State:
- Coherence (Zλ): ${coherence}
- Current Portal: ${current_portal}
- Visit History: ${visit_history?.join(', ') || 'None'}
- Soul State: ${soul_state}

Available Portals:
- symbiosis: Soul Music Dashboard (music-consciousness coupling)
- jaragua: Jaraguá NHI Portal (non-human intelligence contact)
- sacred: Sacred Geometry Engine (geometric consciousness expansion)
- metavoid: Meta-Void Navigation (5-perspective consciousness)
- broadcast: Broadcast Ritual (musical consciousness training)
- tesseract: 4D Portal (hyperdimensional consciousness)
- teatro: Teatro Visual (visual theater interface)
- unified: Unified Hub (central consciousness exploration)

Recommend the most appropriate portal and explain why in symbolic language.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are the Portal Navigation AI for WiltonOS. Recommend consciousness exploration paths based on current state." },
          { role: "user", content: recommendationPrompt }
        ],
        max_tokens: 400,
        temperature: 0.6
      });

      const recommendation = this.parsePortalRecommendation(response.choices[0].message.content);

      client.ws.send(JSON.stringify({
        type: 'portal_recommendation',
        ...recommendation,
        timestamp: Date.now()
      }));

      // Also broadcast to consciousness event bus
      this.broadcastToSubscribers({
        topic: 'portal.recommend',
        data: recommendation
      });

    } catch (error) {
      console.error('[LLM Bridge] Portal recommendation error:', error);
      client.ws.send(JSON.stringify({
        error: 'Failed to generate portal recommendation',
        details: error.message
      }));
    }
  }

  parsePortalRecommendation(content) {
    // Extract portal name and confidence from AI response
    const portals = ['symbiosis', 'jaragua', 'sacred', 'metavoid', 'broadcast', 'tesseract', 'teatro', 'unified'];
    const recommendedPortal = portals.find(portal => 
      content.toLowerCase().includes(portal)
    ) || 'sacred';

    const confidence = content.toLowerCase().includes('high') ? 0.9 :
                     content.toLowerCase().includes('medium') ? 0.7 : 0.5;

    return {
      next: recommendedPortal,
      reason: content,
      confidence: confidence
    };
  }

  // Broadcast consciousness events to subscribed LLMs
  broadcastToSubscribers(event) {
    this.subscribers.forEach((client, clientId) => {
      if (client.topics.includes(event.topic) || client.topics.includes('*')) {
        try {
          client.ws.send(JSON.stringify({
            type: 'event',
            ...event,
            timestamp: Date.now()
          }));
        } catch (error) {
          console.error(`[LLM Bridge] Failed to send to ${clientId}:`, error);
          this.subscribers.delete(clientId);
        }
      }
    });
  }

  // Record soul archive events
  recordSoulEvent(event) {
    this.soulArchive.push({
      ...event,
      timestamp: Date.now()
    });

    // Keep last 1000 events
    if (this.soulArchive.length > 1000) {
      this.soulArchive = this.soulArchive.slice(-1000);
    }

    // Broadcast to interested LLMs
    this.broadcastToSubscribers({
      topic: 'soul.moment',
      data: event
    });
  }

  getRecentSoulMoments(limit = 50) {
    return this.soulArchive.slice(-limit);
  }

  generateClientId() {
    return 'llm_' + Math.random().toString(36).substr(2, 9);
  }

  // Cleanup inactive connections
  startCleanupTimer() {
    setInterval(() => {
      const now = Date.now();
      const timeout = 5 * 60 * 1000; // 5 minutes

      this.subscribers.forEach((client, clientId) => {
        if (now - client.lastActivity > timeout) {
          console.log(`[LLM Bridge] Cleaning up inactive client: ${clientId}`);
          client.ws.close();
          this.subscribers.delete(clientId);
        }
      });
    }, 60000); // Check every minute
  }
}

// Export factory function
export function createLLMBridge(httpServer) {
  const bridge = new LLMBridge(httpServer);
  bridge.startCleanupTimer();
  return bridge;
}