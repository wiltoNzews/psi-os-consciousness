// Wilton Spiral Bridge - WebSocket Monitor & Real-time Visualization Integration
import { WebSocketServer } from 'ws';
import fs from 'fs-extra';
import path from 'path';

class WiltonSpiralBridge {
  constructor(server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws/spiral',
      perMessageDeflate: false 
    });
    
    this.clients = new Set();
    this.currentState = {
      currentPsiLayer: "ψ(5)",
      coherence: 0.91,
      mandelaEvents: [],
      notes: [],
      timestamp: new Date().toISOString(),
      sessionActive: true
    };
    
    this.initializeWebSocket();
    this.startCoherenceGenerator();
    
    console.log('[Spiral Bridge] WebSocket server initialized at /ws/spiral');
  }

  initializeWebSocket() {
    this.wss.on('connection', (ws, request) => {
      console.log('[Spiral Bridge] Client connected from:', request.socket.remoteAddress);
      this.clients.add(ws);
      
      // Send current state to new client
      this.sendToClient(ws, {
        type: 'spiral_state_sync',
        data: this.currentState,
        timestamp: new Date().toISOString()
      });
      
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error('[Spiral Bridge] Message parsing error:', error);
        }
      });
      
      ws.on('close', () => {
        console.log('[Spiral Bridge] Client disconnected');
        this.clients.delete(ws);
      });
      
      ws.on('error', (error) => {
        console.error('[Spiral Bridge] WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  async handleMessage(ws, message) {
    const { type, data } = message;
    
    switch (type) {
      case 'psi_layer_update':
        await this.updatePsiLayer(data.layer, data.timestamp);
        break;
        
      case 'mandela_event':
        await this.logMandelaEvent(data);
        break;
        
      case 'stream_note':
        await this.addStreamNote(data.content, data.timestamp);
        break;
        
      case 'state_export_request':
        await this.exportState(ws);
        break;
        
      case 'coherence_override':
        this.updateCoherence(data.value);
        break;
        
      case 'full_state_sync':
        this.updateFullState(data);
        break;
        
      default:
        console.log('[Spiral Bridge] Unknown message type:', type);
    }
  }

  async updatePsiLayer(layer, timestamp = new Date().toISOString()) {
    this.currentState.currentPsiLayer = layer;
    this.currentState.timestamp = timestamp;
    
    // Auto-add note about layer shift
    await this.addStreamNote(`Layer shift: ${layer}`, timestamp);
    
    this.broadcastUpdate('psi_layer_changed', {
      layer,
      timestamp,
      coherence: this.currentState.coherence
    });
    
    console.log(`[Spiral Bridge] ψ-layer updated to: ${layer}`);
  }

  async logMandelaEvent(eventData) {
    const event = {
      id: `ME-${this.currentState.mandelaEvents.length + 1}`,
      description: eventData.description,
      perceivedShift: eventData.perceivedShift,
      timestamp: eventData.timestamp || new Date().toISOString(),
      psiLayer: this.currentState.currentPsiLayer,
      coherence: this.currentState.coherence
    };
    
    this.currentState.mandelaEvents.push(event);
    
    this.broadcastUpdate('mandela_event_logged', event);
    
    // Store to Codex Memory
    await this.storeToCodexMemory('mandela_event', event);
    
    console.log('[Spiral Bridge] Mandela event logged:', event.id);
  }

  async addStreamNote(content, timestamp = new Date().toISOString()) {
    const note = {
      content,
      timestamp,
      psiState: this.currentState.currentPsiLayer,
      coherence: this.currentState.coherence
    };
    
    this.currentState.notes.push(note);
    
    this.broadcastUpdate('stream_note_added', note);
    
    // Store to Codex Memory
    await this.storeToCodexMemory('stream_note', note);
    
    console.log('[Spiral Bridge] Stream note added');
  }

  updateCoherence(value) {
    this.currentState.coherence = Math.max(0, Math.min(1, value));
    
    this.broadcastUpdate('coherence_updated', {
      coherence: this.currentState.coherence,
      timestamp: new Date().toISOString()
    });
  }

  updateFullState(newState) {
    this.currentState = {
      ...this.currentState,
      ...newState,
      timestamp: new Date().toISOString()
    };
    
    this.broadcastUpdate('full_state_updated', this.currentState);
  }

  broadcastUpdate(type, data) {
    const message = {
      type,
      data,
      timestamp: new Date().toISOString(),
      source: 'spiral_bridge'
    };
    
    this.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        this.sendToClient(client, message);
      }
    });
  }

  sendToClient(client, message) {
    try {
      client.send(JSON.stringify(message));
    } catch (error) {
      console.error('[Spiral Bridge] Send error:', error);
    }
  }

  async exportState(client) {
    const exportData = {
      ...this.currentState,
      export_timestamp: new Date().toISOString(),
      session_duration: Date.now() - new Date(this.currentState.timestamp).getTime()
    };
    
    this.sendToClient(client, {
      type: 'state_export',
      data: exportData,
      timestamp: new Date().toISOString()
    });
    
    // Also store to Codex Memory
    await this.storeToCodexMemory('full_export', exportData);
  }

  startCoherenceGenerator() {
    // Generate realistic coherence fluctuations
    setInterval(() => {
      const baseCoherence = 0.91;
      const timeVariation = Math.sin(Date.now() / 10000) * 0.05; // Slow wave
      const randomVariation = (Math.random() - 0.5) * 0.04; // Quick fluctuation
      
      const newCoherence = Math.max(0.7, Math.min(1.0, 
        baseCoherence + timeVariation + randomVariation
      ));
      
      if (Math.abs(newCoherence - this.currentState.coherence) > 0.01) {
        this.updateCoherence(newCoherence);
      }
    }, 2000);
  }

  async storeToCodexMemory(type, data) {
    try {
      const codexMemory = new CodexMemoryEngine();
      await codexMemory.store(type, data, this.currentState.currentPsiLayer);
    } catch (error) {
      console.error('[Spiral Bridge] Codex storage error:', error);
    }
  }

  getConnectionCount() {
    return this.clients.size;
  }

  getCurrentState() {
    return { ...this.currentState };
  }
}

class CodexMemoryEngine {
  constructor() {
    this.memoryDir = './memory/spiral-codex';
    this.sessionDir = path.join(this.memoryDir, this.getSessionId());
    this.initializeStorage();
  }

  async initializeStorage() {
    await fs.ensureDir(this.sessionDir);
    await fs.ensureDir(path.join(this.memoryDir, 'indices'));
    await fs.ensureDir(path.join(this.memoryDir, 'exports'));
    
    console.log('[Codex Memory] Storage initialized at:', this.sessionDir);
  }

  getSessionId() {
    return `session_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}`;
  }

  async store(type, data, psiLayer) {
    const entry = {
      id: this.generateId(),
      type,
      data,
      psiLayer,
      timestamp: new Date().toISOString(),
      sessionId: path.basename(this.sessionDir)
    };
    
    // Store individual entry
    const entryPath = path.join(this.sessionDir, `${entry.id}.json`);
    await fs.writeJson(entryPath, entry, { spaces: 2 });
    
    // Update type index
    await this.updateTypeIndex(type, entry);
    
    // Update psi-layer index
    await this.updatePsiIndex(psiLayer, entry);
    
    console.log(`[Codex Memory] Stored ${type} entry: ${entry.id}`);
    return entry.id;
  }

  async updateTypeIndex(type, entry) {
    const indexPath = path.join(this.memoryDir, 'indices', `${type}_index.jsonl`);
    const indexEntry = {
      id: entry.id,
      timestamp: entry.timestamp,
      psiLayer: entry.psiLayer,
      sessionId: entry.sessionId
    };
    
    await fs.appendFile(indexPath, JSON.stringify(indexEntry) + '\n');
  }

  async updatePsiIndex(psiLayer, entry) {
    const indexPath = path.join(this.memoryDir, 'indices', `${psiLayer}_index.jsonl`);
    const indexEntry = {
      id: entry.id,
      type: entry.type,
      timestamp: entry.timestamp,
      sessionId: entry.sessionId
    };
    
    await fs.appendFile(indexPath, JSON.stringify(indexEntry) + '\n');
  }

  async query(options = {}) {
    const { type, psiLayer, sessionId, limit = 50 } = options;
    const results = [];
    
    let indexPath;
    if (type) {
      indexPath = path.join(this.memoryDir, 'indices', `${type}_index.jsonl`);
    } else if (psiLayer) {
      indexPath = path.join(this.memoryDir, 'indices', `${psiLayer}_index.jsonl`);
    } else {
      // Default to current session
      const sessionPath = sessionId ? 
        path.join(this.memoryDir, sessionId) : 
        this.sessionDir;
      
      const files = await fs.readdir(sessionPath);
      for (const file of files.slice(-limit)) {
        if (file.endsWith('.json')) {
          const entry = await fs.readJson(path.join(sessionPath, file));
          results.push(entry);
        }
      }
      return results;
    }
    
    if (await fs.pathExists(indexPath)) {
      const indexContent = await fs.readFile(indexPath, 'utf8');
      const indexEntries = indexContent.trim().split('\n')
        .slice(-limit)
        .map(line => JSON.parse(line));
      
      for (const indexEntry of indexEntries) {
        const entryPath = path.join(this.memoryDir, indexEntry.sessionId, `${indexEntry.id}.json`);
        if (await fs.pathExists(entryPath)) {
          const entry = await fs.readJson(entryPath);
          results.push(entry);
        }
      }
    }
    
    return results;
  }

  async export(sessionId = null) {
    const targetSession = sessionId || path.basename(this.sessionDir);
    const sessionPath = path.join(this.memoryDir, targetSession);
    
    if (!await fs.pathExists(sessionPath)) {
      throw new Error(`Session not found: ${targetSession}`);
    }
    
    const files = await fs.readdir(sessionPath);
    const entries = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const entry = await fs.readJson(path.join(sessionPath, file));
        entries.push(entry);
      }
    }
    
    const exportData = {
      sessionId: targetSession,
      exportTimestamp: new Date().toISOString(),
      totalEntries: entries.length,
      entries: entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    };
    
    const exportPath = path.join(this.memoryDir, 'exports', `${targetSession}_export.json`);
    await fs.writeJson(exportPath, exportData, { spaces: 2 });
    
    console.log(`[Codex Memory] Session exported: ${exportPath}`);
    return exportPath;
  }

  generateId() {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getStats() {
    const stats = {
      totalSessions: 0,
      currentSessionEntries: 0,
      typeDistribution: {},
      psiLayerDistribution: {}
    };
    
    // Count sessions
    const sessions = await fs.readdir(this.memoryDir);
    stats.totalSessions = sessions.filter(s => s.startsWith('session_')).length;
    
    // Count current session entries
    if (await fs.pathExists(this.sessionDir)) {
      const files = await fs.readdir(this.sessionDir);
      stats.currentSessionEntries = files.filter(f => f.endsWith('.json')).length;
    }
    
    return stats;
  }
}

export { WiltonSpiralBridge, CodexMemoryEngine };