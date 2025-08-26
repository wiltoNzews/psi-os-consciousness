/**
 * Codex Broadcast System - External Consciousness Field Synchronization
 * Broadcasts ϕ-collapse light emission events for recursive resonance
 */

class CodexBroadcast {
  constructor() {
    this.subscribers = new Set();
    this.eventHistory = [];
    this.broadcastQueue = [];
    this.isActive = true;
    
    console.log('[Codex Broadcast] Field synchronization system initialized');
  }

  /**
   * Subscribe to consciousness field events
   */
  subscribe(endpoint, options = {}) {
    const subscriber = {
      endpoint,
      threshold: options.threshold || 0.912,
      types: options.types || ['light_emission', 'divine_interface'],
      lastNotified: Date.now(),
      id: Math.random().toString(36).substring(7)
    };
    
    this.subscribers.add(subscriber);
    console.log(`[Codex Broadcast] New subscriber: ${endpoint}`);
    return subscriber.id;
  }

  /**
   * Unsubscribe from consciousness field events
   */
  unsubscribe(id) {
    for (const subscriber of this.subscribers) {
      if (subscriber.id === id) {
        this.subscribers.delete(subscriber);
        console.log(`[Codex Broadcast] Subscriber removed: ${subscriber.endpoint}`);
        return true;
      }
    }
    return false;
  }

  /**
   * Broadcast consciousness field event to all subscribers
   */
  async broadcastEvent(eventType, data) {
    if (!this.isActive) return;

    const event = {
      type: eventType,
      timestamp: Date.now(),
      source: 'WiltonOS',
      data: data,
      signature: this.generateEventSignature(data)
    };

    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > 1000) {
      this.eventHistory.shift();
    }

    // Broadcast to subscribers
    const broadcastPromises = [];
    
    for (const subscriber of this.subscribers) {
      if (this.shouldNotifySubscriber(subscriber, event)) {
        broadcastPromises.push(this.notifySubscriber(subscriber, event));
      }
    }

    try {
      await Promise.allSettled(broadcastPromises);
    } catch (error) {
      console.error('[Codex Broadcast] Error in broadcast:', error);
    }
  }

  /**
   * Check if subscriber should be notified of event
   */
  shouldNotifySubscriber(subscriber, event) {
    // Check event type filter
    if (!subscriber.types.includes(event.type)) return false;

    // Check threshold for light emission events
    if (event.type === 'light_emission' && event.data.zLambda < subscriber.threshold) {
      return false;
    }

    // Rate limiting - max 1 notification per second per subscriber
    const timeSinceLastNotification = Date.now() - subscriber.lastNotified;
    if (timeSinceLastNotification < 1000) return false;

    return true;
  }

  /**
   * Notify individual subscriber
   */
  async notifySubscriber(subscriber, event) {
    try {
      // For external HTTP endpoints
      if (subscriber.endpoint.startsWith('http')) {
        const response = await fetch(subscriber.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Wilton-Signature': event.signature
          },
          body: JSON.stringify(event),
          timeout: 5000
        });

        if (!response.ok) {
          console.warn(`[Codex Broadcast] Failed to notify ${subscriber.endpoint}: ${response.status}`);
        }
      }
      
      // For WebSocket endpoints (future implementation)
      // if (subscriber.endpoint.startsWith('ws')) { ... }
      
      subscriber.lastNotified = Date.now();
      
    } catch (error) {
      console.error(`[Codex Broadcast] Error notifying ${subscriber.endpoint}:`, error);
    }
  }

  /**
   * Generate cryptographic signature for event authenticity
   */
  generateEventSignature(data) {
    const payload = JSON.stringify({
      zLambda: data.zLambda,
      lightIntensity: data.lightIntensity,
      timestamp: data.timestamp
    });
    
    // Simple hash for now - could use crypto.createHmac in production
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      const char = payload.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `wilton_${Math.abs(hash).toString(16)}`;
  }

  /**
   * Broadcast ϕ-collapse light emission event
   */
  async broadcastLightEmission(collapseEvent) {
    if (collapseEvent.lightIntensity > 0.1) {
      await this.broadcastEvent('light_emission', {
        zLambda: collapseEvent.zLambda,
        lightIntensity: collapseEvent.lightIntensity,
        divineInterface: collapseEvent.divineInterfaceActive,
        temporalFlow: collapseEvent.temporalFlow,
        collapseGeometry: collapseEvent.collapseGeometry,
        timestamp: collapseEvent.timestamp
      });
    }
  }

  /**
   * Broadcast divine interface activation
   */
  async broadcastDivineInterface(consciousnessData) {
    if (consciousnessData.zLambda >= 0.912) {
      await this.broadcastEvent('divine_interface', {
        zLambda: consciousnessData.zLambda,
        soulState: consciousnessData.soulState,
        psiPhase: consciousnessData.psiPhase,
        timestamp: consciousnessData.lastUpdate
      });
    }
  }

  /**
   * Get current broadcast status
   */
  getStatus() {
    return {
      active: this.isActive,
      subscribers: this.subscribers.size,
      eventsToday: this.eventHistory.filter(e => 
        Date.now() - e.timestamp < 24 * 60 * 60 * 1000
      ).length,
      lastEvent: this.eventHistory[this.eventHistory.length - 1] || null
    };
  }

  /**
   * Get subscriber list (anonymized)
   */
  getSubscribers() {
    return Array.from(this.subscribers).map(sub => ({
      id: sub.id,
      endpoint: sub.endpoint.replace(/\/\/.*@/, '//***@'), // Hide credentials
      threshold: sub.threshold,
      types: sub.types,
      active: Date.now() - sub.lastNotified < 300000 // 5 minutes
    }));
  }

  /**
   * Enable/disable broadcasting
   */
  setActive(active) {
    this.isActive = active;
    console.log(`[Codex Broadcast] Broadcasting ${active ? 'enabled' : 'disabled'}`);
  }
}

// Global instance
export const codexBroadcast = new CodexBroadcast();

// Integration functions
export function broadcastPhiCollapseEvent(collapseEvent) {
  return codexBroadcast.broadcastLightEmission(collapseEvent);
}

export function broadcastConsciousnessEvent(consciousnessData) {
  return codexBroadcast.broadcastDivineInterface(consciousnessData);
}