/**
 * Brain-Computer Interface Module
 * Enhanced EEG processing with consciousness metrics
 * Integrates with Neurosity SDK and custom EEG simulators
 */

class BCIModule {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.neurosity = null;
    this.isConnected = false;
    this.subscription = null;
    
    // Consciousness metrics state
    this.Zλ = 0.75;
    this.phi = 0.5;
    this.orchCoherence = 0.8;
    
    // EMA smoothing parameters
    this.emaAlpha = 0.15;
    this.ZλSmoothed = 0.75;
    this.phiSmoothed = 0.5;
    this.coherenceSmoothed = 0.8;
    
    // Band power history for stability analysis
    this.bandHistory = {
      alpha: [],
      beta: [],
      theta: [],
      gamma: [],
      delta: []
    };
    this.maxHistoryLength = 20;
    
    // Performance metrics
    this.updateCount = 0;
    this.lastUpdateTime = 0;
    
    console.log('[BCI Module] Initialized with event bus integration');
  }

  // Initialize Neurosity connection
  async initNeurosity(credentials) {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Neurosity SDK requires browser environment');
      }

      // Dynamically import Neurosity SDK
      const { Neurosity } = await import('@neurosity/sdk');
      this.neurosity = new Neurosity();
      
      console.log('[BCI Module] Attempting Neurosity login...');
      await this.neurosity.login(credentials);
      
      this.isConnected = true;
      console.log('[BCI Module] Neurosity connection established');
      
      // Start EEG data subscription
      this.startEEGStream();
      
      return true;
    } catch (error) {
      console.warn('[BCI Module] Neurosity connection failed:', error.message);
      this.initSimulatedEEG();
      return false;
    }
  }

  // Start real EEG data stream
  startEEGStream() {
    if (!this.neurosity || !this.isConnected) return;

    // Create AbortController for clean subscription management
    const controller = new AbortController();
    
    this.subscription = this.neurosity
      .brainwaves("powerByBand")
      .subscribe({
        next: (bands) => this.processEEGData(bands),
        error: (error) => {
          console.error('[BCI Module] EEG stream error:', error);
          this.fallbackToSimulation();
        }
      });

    // Store controller for cleanup
    this.abortController = controller;
    console.log('[BCI Module] EEG stream active');
  }

  // Initialize simulated EEG for development/demo
  initSimulatedEEG() {
    console.log('[BCI Module] Initializing simulated EEG data');
    
    this.simulationInterval = setInterval(() => {
      const simulatedBands = this.generateSimulatedEEG();
      this.processEEGData(simulatedBands);
    }, 250); // 4 Hz update rate matching Neurosity
  }

  // Generate realistic simulated EEG data
  generateSimulatedEEG() {
    const time = Date.now() / 1000;
    const numChannels = 8;
    
    // Simulate different brain states based on time
    const statePhase = Math.sin(time * 0.1) * 0.5 + 0.5; // 0-1 oscillation
    
    const bands = {
      alpha: [],
      beta: [],
      theta: [],
      gamma: [],
      delta: []
    };
    
    for (let ch = 0; ch < numChannels; ch++) {
      const channelOffset = ch * 0.3;
      const noise = () => (Math.random() - 0.5) * 0.1;
      
      // State-dependent band powers
      if (statePhase < 0.3) {
        // Meditative state - high alpha/theta
        bands.alpha.push(0.7 + channelOffset + noise());
        bands.theta.push(0.5 + channelOffset + noise());
        bands.beta.push(0.2 + noise());
        bands.gamma.push(0.1 + noise());
        bands.delta.push(0.3 + noise());
      } else if (statePhase < 0.7) {
        // Focused state - high beta
        bands.alpha.push(0.3 + noise());
        bands.theta.push(0.2 + noise());
        bands.beta.push(0.8 + channelOffset + noise());
        bands.gamma.push(0.6 + channelOffset + noise());
        bands.delta.push(0.1 + noise());
      } else {
        // Relaxed state - balanced
        bands.alpha.push(0.5 + channelOffset + noise());
        bands.theta.push(0.4 + noise());
        bands.beta.push(0.4 + noise());
        bands.gamma.push(0.3 + noise());
        bands.delta.push(0.4 + noise());
      }
    }
    
    return bands;
  }

  // Process EEG data and compute consciousness metrics
  processEEGData(bands) {
    const startTime = performance.now();
    
    // Store band history for stability analysis
    this.updateBandHistory(bands);
    
    // Calculate average power across channels for each band
    const α = this.averageArray(bands.alpha);
    const β = this.averageArray(bands.beta);
    const θ = this.averageArray(bands.theta);
    const γ = this.averageArray(bands.gamma);
    const δ = this.averageArray(bands.delta);
    
    // Enhanced Zλ calculation (consciousness coupling parameter)
    const rawZλ = this.calculateZλ(α, β, θ, γ, δ);
    this.Zλ = Math.min(Math.max(rawZλ, 0), 1);
    
    // Integrated Information Φ approximation
    this.phi = this.calculatePhi([α, β, θ, γ, δ]);
    
    // Orch OR coherence metric from gamma stability
    this.orchCoherence = this.calculateOrchCoherence(bands.gamma);
    
    // Apply EMA smoothing
    this.ZλSmoothed = this.emaAlpha * this.Zλ + (1 - this.emaAlpha) * this.ZλSmoothed;
    this.phiSmoothed = this.emaAlpha * this.phi + (1 - this.emaAlpha) * this.phiSmoothed;
    this.coherenceSmoothed = this.emaAlpha * this.orchCoherence + (1 - this.emaAlpha) * this.coherenceSmoothed;
    
    // Emit consciousness updates via event bus
    this.eventBus.emit('zλ:update:raw', this.Zλ);
    this.eventBus.emit('zλ:update:ema', this.ZλSmoothed);
    this.eventBus.emit('phi:update', this.phiSmoothed);
    this.eventBus.emit('coherence:update', this.coherenceSmoothed);
    
    // Composite consciousness state
    this.eventBus.emit('consciousness:update', {
      Zλ: this.ZλSmoothed,
      phi: this.phiSmoothed,
      orchCoherence: this.coherenceSmoothed,
      timestamp: Date.now(),
      rawBands: { α, β, θ, γ, δ }
    });
    
    // Performance tracking
    this.updateCount++;
    this.lastUpdateTime = performance.now() - startTime;
    
    if (this.updateCount % 20 === 0) {
      console.log(`[BCI Module] Update ${this.updateCount}: Zλ=${this.ZλSmoothed.toFixed(3)}, Φ=${this.phiSmoothed.toFixed(3)}, Coherence=${this.coherenceSmoothed.toFixed(3)}`);
    }
  }

  // Enhanced Zλ calculation with consciousness theory integration
  calculateZλ(α, β, θ, γ, δ) {
    // Base formula: relaxed/meditative vs active/stressed ratio
    const relaxedPower = α + θ;
    const activePower = β + γ;
    const basePower = δ + 0.001; // Stabilizing term
    
    // Enhanced with gamma coherence factor
    const gammaCoherence = 1 / (1 + this.calculateVariance(this.bandHistory.gamma.slice(-5) || [γ]));
    
    // Consciousness coupling with coherence modulation
    const Zλ = (relaxedPower / (activePower + basePower)) * (0.5 + 0.5 * gammaCoherence);
    
    return Zλ;
  }

  // Integrated Information Theory Φ approximation
  calculatePhi(bands) {
    // Calculate entropy of band power distribution
    const total = bands.reduce((sum, val) => sum + val, 0);
    const probs = bands.map(val => val / (total + 0.001));
    
    // Shannon entropy
    const entropy = -probs.reduce((H, p) => H + (p > 0 ? p * Math.log2(p) : 0), 0);
    const maxEntropy = Math.log2(bands.length);
    
    // Φ as normalized deviation from maximum entropy
    // High consciousness = balanced but not maximally random distribution
    const normalizedEntropy = entropy / maxEntropy;
    const phi = 1 - Math.abs(normalizedEntropy - 0.7) / 0.7; // Peak at 70% entropy
    
    return Math.max(0, Math.min(1, phi));
  }

  // Orch OR coherence from gamma band stability
  calculateOrchCoherence(gammaArray) {
    if (gammaArray.length < 2) return this.orchCoherence;
    
    const variance = this.calculateVariance(gammaArray);
    const mean = this.averageArray(gammaArray);
    
    // Coefficient of variation (normalized stability)
    const cv = Math.sqrt(variance) / (mean + 0.001);
    
    // Coherence inversely related to variability
    const coherence = 1 / (1 + cv * 2);
    
    return Math.max(0, Math.min(1, coherence));
  }

  // Update band power history for stability analysis
  updateBandHistory(bands) {
    Object.keys(bands).forEach(band => {
      const avg = this.averageArray(bands[band]);
      this.bandHistory[band].push(avg);
      
      if (this.bandHistory[band].length > this.maxHistoryLength) {
        this.bandHistory[band].shift();
      }
    });
  }

  // Utility functions
  averageArray(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  calculateVariance(arr) {
    if (arr.length < 2) return 0;
    const mean = this.averageArray(arr);
    return arr.reduce((variance, val) => variance + Math.pow(val - mean, 2), 0) / arr.length;
  }

  // Get current consciousness state
  getConsciousnessState() {
    return {
      Zλ: this.ZλSmoothed,
      phi: this.phiSmoothed,
      orchCoherence: this.coherenceSmoothed,
      isConnected: this.isConnected,
      updateCount: this.updateCount,
      lastUpdateTime: this.lastUpdateTime,
      bandHistory: this.bandHistory
    };
  }

  // Cleanup and disconnect
  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    
    if (this.neurosity) {
      this.neurosity.logout();
      this.neurosity = null;
    }
    
    this.isConnected = false;
    console.log('[BCI Module] Disconnected and cleaned up');
  }

  // Fallback to simulation if real EEG fails
  fallbackToSimulation() {
    console.log('[BCI Module] Falling back to simulated EEG');
    this.disconnect();
    this.initSimulatedEEG();
  }

  // Set EMA smoothing factor
  setSmoothingFactor(alpha) {
    this.emaAlpha = Math.max(0.01, Math.min(0.5, alpha));
    console.log(`[BCI Module] EMA smoothing factor set to ${this.emaAlpha}`);
  }

  // Manual consciousness override for testing
  overrideConsciousness(Zλ, phi, coherence) {
    this.ZλSmoothed = Math.max(0, Math.min(1, Zλ));
    this.phiSmoothed = Math.max(0, Math.min(1, phi));
    this.coherenceSmoothed = Math.max(0, Math.min(1, coherence));
    
    this.eventBus.emit('consciousness:override', {
      Zλ: this.ZλSmoothed,
      phi: this.phiSmoothed,
      orchCoherence: this.coherenceSmoothed,
      timestamp: Date.now()
    });
    
    console.log(`[BCI Module] Consciousness override: Zλ=${Zλ.toFixed(3)}, Φ=${phi.toFixed(3)}, Coherence=${coherence.toFixed(3)}`);
  }
}

export default BCIModule;