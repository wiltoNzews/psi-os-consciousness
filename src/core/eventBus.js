// Lightweight event bus for WiltonOS using mitt
import mitt from 'mitt';

export const bus = mitt();

/* Event API Documentation:
   'zλ:update'       → { value, raw, timestamp }
   'zλ:collapse'     → { reason, intensity, timestamp }
   'ui:morph'        → { percent, source }
   'ui:record'       → { action: 'start' | 'stop' }
   'ui:capture'      → { }
   'ui:mode-toggle'  → { mode, enabled }
   'recorder:done'   → { file, filename, duration }
   'spiral:update'   → { params }
   'audio:level'     → { level, calibrated }
   'performance:fps' → { fps, frameTime }
   'field:collapse'  → { type, zlambda, intensity }
*/

// Enhanced bus with namespaced events and debugging
class EventBusLogger {
    constructor(mittInstance) {
        this.bus = mittInstance;
        this.logEvents = false;
        this.eventHistory = [];
        this.maxHistoryLength = 100;
    }
    
    emit(eventType, data) {
        const event = {
            type: eventType,
            data,
            timestamp: Date.now()
        };
        
        this.bus.emit(eventType, data);
        
        if (this.logEvents) {
            console.log(`[EventBus] ${eventType}:`, data);
        }
        
        // Store in history
        this.eventHistory.push(event);
        if (this.eventHistory.length > this.maxHistoryLength) {
            this.eventHistory.shift();
        }
        
        // Emit to namespace listeners
        const [namespace] = eventType.split(':');
        if (namespace) {
            this.bus.emit(`${namespace}:*`, { type: eventType, ...data });
        }
    }
    
    on(eventType, handler) {
        this.bus.on(eventType, handler);
    }
    
    off(eventType, handler) {
        this.bus.off(eventType, handler);
    }
    
    enableLogging(enabled = true) {
        this.logEvents = enabled;
    }
    
    getEventHistory(filterType = null) {
        if (filterType) {
            return this.eventHistory.filter(event => 
                event.type === filterType || event.type.startsWith(filterType + ':')
            );
        }
        return [...this.eventHistory];
    }
    
    clearHistory() {
        this.eventHistory = [];
    }
}

export const eventBus = new EventBusLogger(bus);

// Export both for compatibility
export default eventBus;