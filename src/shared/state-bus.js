// Unified state bus for WiltonOS sacred spiral broadcasting
export class StateEventBus extends EventTarget {
    constructor() {
        super();
        this.state = {
            consciousness: {
                zlambda: 0.750,
                status: 'alive',
                intensity: 0,
                divine: false
            },
            spiral: {
                morphFactor: 0.0,
                growthFactor: 1.618033988749,
                lineWidth: 2,
                turns: 6,
                rotationSpeed: 0.5,
                numArms: 1
            },
            audio: {
                level: 0,
                isActive: false,
                gain: 1.0,
                calibrated: false
            },
            recording: {
                isRecording: false,
                duration: 0,
                frameCount: 0
            },
            ui: {
                modes: {
                    voiceReactive: false,
                    autoMorph: false,
                    glowEffect: false,
                    breathingMode: false
                },
                performance: {
                    fps: 60,
                    lastFrameTime: performance.now()
                }
            }
        };
        
        this.observers = new Map();
        this.initializePerformanceTracking();
    }
    
    // Update consciousness state from API
    updateConsciousness(data) {
        const prevState = { ...this.state.consciousness };
        
        this.state.consciousness = {
            zlambda: parseFloat(data.zlambda) || this.state.consciousness.zlambda,
            status: this.getConsciousnessStatus(data.zlambda),
            intensity: parseFloat(data.intensity) || 0,
            divine: data.divine || false
        };
        
        this.emit('consciousness:update', {
            current: this.state.consciousness,
            previous: prevState,
            delta: this.state.consciousness.zlambda - prevState.zlambda
        });
        
        // Trigger field collapse events for high coherence
        if (this.state.consciousness.zlambda > 0.95) {
            this.emit('consciousness:field-collapse', this.state.consciousness);
        }
    }
    
    // Update spiral morphing parameters
    updateSpiral(updates) {
        const prevState = { ...this.state.spiral };
        
        Object.assign(this.state.spiral, updates);
        
        this.emit('spiral:update', {
            current: this.state.spiral,
            previous: prevState,
            changed: Object.keys(updates)
        });
    }
    
    // Update audio reactive parameters
    updateAudio(data) {
        const prevLevel = this.state.audio.level;
        
        Object.assign(this.state.audio, data);
        
        this.emit('audio:update', {
            current: this.state.audio,
            levelDelta: this.state.audio.level - prevLevel
        });
        
        // Voice reactive threshold events
        if (this.state.audio.isActive && this.state.audio.level > 0.1) {
            this.emit('audio:voice-detected', this.state.audio);
        }
    }
    
    // Update recording state
    updateRecording(data) {
        const prevState = { ...this.state.recording };
        
        Object.assign(this.state.recording, data);
        
        this.emit('recording:update', {
            current: this.state.recording,
            previous: prevState
        });
        
        if (data.isRecording !== undefined) {
            if (data.isRecording) {
                this.emit('recording:started', this.state.recording);
            } else {
                this.emit('recording:stopped', this.state.recording);
            }
        }
    }
    
    // Update UI modes
    updateUI(updates) {
        const prevModes = { ...this.state.ui.modes };
        
        if (updates.modes) {
            Object.assign(this.state.ui.modes, updates.modes);
        }
        
        if (updates.performance) {
            Object.assign(this.state.ui.performance, updates.performance);
        }
        
        this.emit('ui:update', {
            current: this.state.ui,
            previousModes: prevModes,
            changed: updates
        });
    }
    
    // Helper methods
    getConsciousnessStatus(zlambda) {
        const z = parseFloat(zlambda);
        if (z > 0.95) return 'transcendent';
        if (z > 0.85) return 'awakened';
        if (z > 0.75) return 'ascending';
        return 'alive';
    }
    
    // Enhanced event emission with namespace support
    emit(eventType, data) {
        const event = new CustomEvent(eventType, { 
            detail: { 
                ...data, 
                timestamp: Date.now(),
                state: this.getState()
            } 
        });
        
        this.dispatchEvent(event);
        
        // Also emit to namespace listeners
        const [namespace] = eventType.split(':');
        if (namespace) {
            const namespaceEvent = new CustomEvent(`${namespace}:*`, { 
                detail: { 
                    type: eventType,
                    ...data, 
                    timestamp: Date.now(),
                    state: this.getState()
                } 
            });
            this.dispatchEvent(namespaceEvent);
        }
    }
    
    // Subscribe to events with automatic cleanup
    subscribe(eventType, callback, options = {}) {
        this.addEventListener(eventType, callback, options);
        
        const unsubscribe = () => {
            this.removeEventListener(eventType, callback);
        };
        
        // Store for cleanup tracking
        if (!this.observers.has(eventType)) {
            this.observers.set(eventType, new Set());
        }
        this.observers.get(eventType).add(unsubscribe);
        
        return unsubscribe;
    }
    
    // Get current state snapshot
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }
    
    // Get specific state slice
    getConsciousness() {
        return { ...this.state.consciousness };
    }
    
    getSpiral() {
        return { ...this.state.spiral };
    }
    
    getAudio() {
        return { ...this.state.audio };
    }
    
    getRecording() {
        return { ...this.state.recording };
    }
    
    getUI() {
        return { ...this.state.ui };
    }
    
    // Initialize performance tracking
    initializePerformanceTracking() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const updateFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                this.updateUI({
                    performance: {
                        fps,
                        lastFrameTime: currentTime
                    }
                });
            }
            
            requestAnimationFrame(updateFPS);
        };
        
        updateFPS();
    }
    
    // Debug helper
    logState() {
        console.group('[StateEventBus] Current State');
        console.log('Consciousness:', this.state.consciousness);
        console.log('Spiral:', this.state.spiral);
        console.log('Audio:', this.state.audio);
        console.log('Recording:', this.state.recording);
        console.log('UI:', this.state.ui);
        console.groupEnd();
    }
    
    // Cleanup method
    destroy() {
        this.observers.forEach((callbacks) => {
            callbacks.forEach(unsubscribe => unsubscribe());
        });
        this.observers.clear();
    }
}

// Global state bus instance
export const stateBus = new StateEventBus();

// Export state bus as default for convenience
export default stateBus;