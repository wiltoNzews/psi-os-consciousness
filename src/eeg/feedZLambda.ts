/**
 * EEG Consciousness Feed - Zλ, Φ, Coherence Calculation
 * Streams live brainwave data and computes consciousness metrics
 */

import bus from '../core/bus';

interface BandData {
  alpha: number[];
  beta: number[];
  theta: number[];
  gamma: number[];
  delta: number[];
}

class ConsciousnessFeed {
  private neurosity: any = null;
  private isConnected = false;
  private simulationInterval: NodeJS.Timeout | null = null;
  
  // Smoothing buffers
  private zλBuffer: number[] = [];
  private phiBuffer: number[] = [];
  private coherenceBuffer: number[] = [];
  private bufferSize = 6;

  constructor() {
    this.initializeStream();
  }

  private async initializeStream() {
    try {
      // Try Neurosity SDK if available
      if (typeof window !== 'undefined' && import.meta.env.VITE_EEG_USER) {
        await this.initNeurosity();
      } else {
        this.initSimulation();
      }
    } catch (error) {
      console.warn('[Consciousness Feed] Falling back to simulation:', error.message);
      this.initSimulation();
    }
  }

  private async initNeurosity() {
    try {
      const { Neurosity } = await import('@neurosity/sdk');
      this.neurosity = new Neurosity();
      
      await this.neurosity.login({
        email: import.meta.env.VITE_EEG_USER,
        password: import.meta.env.VITE_EEG_PASS
      });

      console.log('[Consciousness Feed] Neurosity connected');
      this.isConnected = true;
      bus.emit('eeg:connected', true);

      this.neurosity.brainwaves('powerByBand').subscribe((bands: BandData) => {
        this.processBrainwaves(bands);
      });

    } catch (error) {
      console.warn('[Consciousness Feed] Neurosity connection failed:', error.message);
      this.initSimulation();
    }
  }

  private initSimulation() {
    console.log('[Consciousness Feed] Starting consciousness simulation');
    bus.emit('eeg:connected', false);
    
    this.simulationInterval = setInterval(() => {
      const simulatedBands = this.generateSimulatedBands();
      this.processBrainwaves(simulatedBands);
    }, 250); // 4 Hz update rate
  }

  private generateSimulatedBands(): BandData {
    const time = Date.now() / 1000;
    const numChannels = 8;
    
    // Consciousness state oscillation (meditation <-> focus <-> relaxed)
    const statePhase = Math.sin(time * 0.05) * 0.5 + 0.5; // Slow 0-1 oscillation
    const coherencePhase = Math.cos(time * 0.3) * 0.3 + 0.7; // Gamma coherence
    
    const bands: BandData = {
      alpha: [],
      beta: [],
      theta: [],
      gamma: [],
      delta: []
    };

    for (let ch = 0; ch < numChannels; ch++) {
      const channelNoise = () => (Math.random() - 0.5) * 0.05;
      const channelOffset = ch * 0.02;

      if (statePhase < 0.33) {
        // Deep meditative state - high alpha/theta, low beta/gamma
        bands.alpha.push(0.8 + channelOffset + channelNoise());
        bands.theta.push(0.6 + channelOffset + channelNoise());
        bands.beta.push(0.15 + channelNoise());
        bands.gamma.push(0.1 * coherencePhase + channelNoise());
        bands.delta.push(0.4 + channelNoise());
      } else if (statePhase < 0.67) {
        // Focused cognitive state - high beta/gamma
        bands.alpha.push(0.25 + channelNoise());
        bands.theta.push(0.15 + channelNoise());
        bands.beta.push(0.9 + channelOffset + channelNoise());
        bands.gamma.push(0.8 * coherencePhase + channelOffset + channelNoise());
        bands.delta.push(0.1 + channelNoise());
      } else {
        // Relaxed awareness - balanced spectrum
        bands.alpha.push(0.6 + channelOffset + channelNoise());
        bands.theta.push(0.35 + channelNoise());
        bands.beta.push(0.45 + channelNoise());
        bands.gamma.push(0.4 * coherencePhase + channelNoise());
        bands.delta.push(0.3 + channelNoise());
      }
    }

    return bands;
  }

  private processBrainwaves(bands: BandData) {
    // Calculate average power across channels
    const α = this.avg(bands.alpha);
    const β = this.avg(bands.beta);
    const θ = this.avg(bands.theta);
    const γ = this.avg(bands.gamma);
    const δ = this.avg(bands.delta);

    // Consciousness coupling parameter Zλ
    const rawZλ = (α + θ) / (β + γ + 1e-3);
    const zλ = this.smooth(rawZλ, this.zλBuffer);

    // Integrated Information Φ (entropy-based approximation)
    const bandEntropy = this.entropy([α, β, θ, γ, δ]);
    const rawΦ = 1 - bandEntropy / Math.log2(5);
    const phi = this.smooth(rawΦ, this.phiBuffer);

    // Orch OR coherence (gamma stability)
    const gammaCoherence = 1 / (1 + this.stddev(bands.gamma));
    const coherence = this.smooth(gammaCoherence, this.coherenceBuffer);

    // Clamp values to [0,1]
    const clampedZλ = this.clamp(zλ, 0, 1);
    const clampedΦ = this.clamp(phi, 0, 1);
    const clampedCoherence = this.clamp(coherence, 0, 1);

    // Emit consciousness metrics
    bus.emit('zλ', clampedZλ);
    bus.emit('phi', clampedΦ);
    bus.emit('coherence', clampedCoherence);

    // Calculate collapse probability (higher consciousness = lower collapse)
    const collapseProb = 0.02 * (1 - clampedZλ);
    bus.emit('collapse', collapseProb);
  }

  // Utility functions
  private avg(arr: number[]): number {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  private entropy(values: number[]): number {
    const sum = values.reduce((a, b) => a + b, 0);
    if (sum === 0) return 0;
    
    const probs = values.map(x => x / sum);
    return -probs.reduce((h, p) => h + (p > 0 ? p * Math.log2(p) : 0), 0);
  }

  private stddev(arr: number[]): number {
    const mean = this.avg(arr);
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }

  private smooth(value: number, buffer: number[]): number {
    buffer.push(value);
    if (buffer.length > this.bufferSize) {
      buffer.shift();
    }
    return this.avg(buffer);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  public disconnect() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    
    if (this.neurosity && this.isConnected) {
      this.neurosity.logout();
      this.neurosity = null;
      this.isConnected = false;
    }
    
    bus.emit('eeg:connected', false);
    console.log('[Consciousness Feed] Disconnected');
  }
}

// Initialize the consciousness feed
const consciousnessFeed = new ConsciousnessFeed();

export default consciousnessFeed;