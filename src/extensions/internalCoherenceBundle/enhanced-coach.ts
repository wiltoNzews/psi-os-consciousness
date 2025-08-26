/**
 * Enhanced Coherence Coach with Technical Refinements
 * Implements performance monitoring, smooth interpolation, and high-DPI rendering
 */

import type { CoherenceMetrics, BreathState, CoherenceBundleConfig } from './types';
import { 
  validateCoherenceMetrics, 
  RateLimiter, 
  easing, 
  PerformanceMonitor,
  calculateBreathPhase,
  setupHighDPICanvas 
} from './utils';

export class EnhancedCoherenceCoach {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: CoherenceBundleConfig;
  
  // State with smooth interpolation
  private isActive = false;
  private cycleStartTime = 0;
  private currentZλ = 0.75;
  private currentΦ = 0.50;
  private displayZλ = 0.75;  // Smoothed for rendering
  private displayΦ = 0.50;   // Smoothed for rendering
  private lastMetrics: CoherenceMetrics | null = null;
  
  // Performance monitoring
  private perfMonitor = new PerformanceMonitor();
  private rateLimiter = new RateLimiter(20); // 20 Hz updates
  private animationId: number | null = null;
  
  // Breath timing with consistent cycle
  private breathCycleDuration = 10000; // 10 seconds default
  private alphaGoal = 0.90;
  private eegLatency = 0;
  private lastEegTimestamp = 0;
  
  constructor(config: CoherenceBundleConfig) {
    this.config = config;
    this.alphaGoal = config.coach.alphaGoal;
    this.breathCycleDuration = (60 / config.coach.breathingRate) * 1000;
    
    this.createCanvas();
    this.setupEventListeners();
    
    console.log('[Enhanced Coach] Initialized with', {
      alphaGoal: this.alphaGoal,
      breathRate: config.coach.breathingRate,
      updateRate: config.performance.updateRate
    });
  }

  private createCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'enhanced-coach-overlay';
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1000;
      background: transparent;
    `;
    
    // Setup high-DPI context for crisp rendering
    this.ctx = setupHighDPICanvas(this.canvas);
    
    // Add to DOM
    const dashboard = document.querySelector('.dashboard-container') || document.body;
    dashboard.appendChild(this.canvas);
    
    // Handle resize with performance awareness
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.ctx = setupHighDPICanvas(this.canvas);
      }, 100);
    });
  }

  private setupEventListeners(): void {
    // Namespaced event listening for coherence metrics
    if (window.bus) {
      window.bus.on('coherence.metrics', (data: any) => {
        const metrics = validateCoherenceMetrics(data);
        if (metrics && this.rateLimiter.canEmit()) {
          this.updateMetrics(metrics);
        }
      });
      
      // Legacy compatibility
      window.bus.on('coherenceData', (data: any) => {
        const metrics = validateCoherenceMetrics(data);
        if (metrics) {
          this.updateMetrics(metrics);
        }
      });
    }
  }

  private updateMetrics(metrics: CoherenceMetrics): void {
    // Calculate EEG latency for diagnostics
    this.eegLatency = Date.now() - metrics.timestamp;
    this.lastEegTimestamp = metrics.timestamp;
    
    // Glitch detection for consciousness spikes
    const zλGlitch = isGlitchValue(metrics.zLambda, this.currentZλ, 0.2);
    const phiGlitch = isGlitchValue(metrics.phi, this.currentΦ, 0.2);
    
    if (!zλGlitch && !phiGlitch) {
      this.currentZλ = metrics.zLambda;
      this.currentΦ = metrics.phi;
      this.lastMetrics = metrics;
    }
  }

  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.cycleStartTime = performance.now();
    this.startAnimationLoop();
    
    // Emit breath tick events for geometry sync
    if (window.bus) {
      window.bus.emit('coherence.breathTick', this.getBreathState());
    }
    
    console.log('[Enhanced Coach] Session started');
  }

  stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.clearCanvas();
    console.log('[Enhanced Coach] Session stopped');
  }

  private startAnimationLoop(): void {
    const animate = () => {
      if (!this.isActive) return;
      
      const frameStart = this.perfMonitor.startFrame();
      
      // Update smooth display values using critically damped interpolation
      this.displayZλ = easing.criticallyDamped(this.displayZλ, this.currentZλ, 0.08);
      this.displayΦ = easing.criticallyDamped(this.displayΦ, this.currentΦ, 0.08);
      
      this.render();
      
      this.perfMonitor.endFrame(frameStart);
      
      // Performance monitoring
      if (!this.perfMonitor.isPerformanceGood(this.config.performance.maxFrameTime)) {
        console.warn('[Enhanced Coach] Performance degraded:', 
          this.perfMonitor.getAverageFrameTime().toFixed(2) + 'ms avg');
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  private render(): void {
    this.clearCanvas();
    
    const centerX = this.canvas.clientWidth / 2;
    const centerY = this.canvas.clientHeight / 2;
    
    // Get current breath state with consistent timing
    const breathState = calculateBreathPhase(this.cycleStartTime, this.breathCycleDuration);
    
    // Draw breath guide with organic easing
    this.drawBreathGuide(centerX, centerY, breathState);
    
    // Draw alpha goal indicator
    this.drawAlphaGoalIndicator(centerX, centerY);
    
    // Draw metrics display if enabled
    if (this.config.coach.displayMetrics) {
      this.drawMetricsDisplay();
    }
    
    // Draw EEG status for diagnostics
    this.drawEEGStatus();
    
    // Emit breath state for geometry synchronization
    if (window.bus) {
      window.bus.emit('coherence.breathTick', breathState);
    }
  }

  private drawBreathGuide(centerX: number, centerY: number, breathState: BreathState): void {
    const maxRadius = 80;
    const minRadius = 20;
    
    // Calculate radius with organic easing
    let radius = minRadius;
    let alpha = 0.6;
    let strokeColor = '#00ffff';
    
    switch (breathState.phase) {
      case 'inhale':
        radius = minRadius + (maxRadius - minRadius) * breathState.progress;
        alpha = 0.4 + breathState.progress * 0.4;
        strokeColor = '#00ff00';
        break;
      case 'hold':
        radius = maxRadius;
        alpha = 0.8;
        strokeColor = '#ffff00';
        break;
      case 'exhale':
        radius = maxRadius - (maxRadius - minRadius) * breathState.progress;
        alpha = 0.8 - breathState.progress * 0.4;
        strokeColor = '#ff6400';
        break;
      case 'pause':
        radius = minRadius;
        alpha = 0.4;
        strokeColor = '#888888';
        break;
    }
    
    // Accessibility mode - use gradient instead of flashing
    if (this.config.coach.accessibilityMode) {
      const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, `rgba(0, 255, 255, 0)`);
      gradient.addColorStop(1, `rgba(0, 255, 255, ${alpha * 0.5})`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.fill();
    } else {
      // Standard breathing circle
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = 3;
      
      // Add glow for high consciousness states
      if (this.displayZλ >= this.alphaGoal) {
        this.ctx.shadowColor = strokeColor;
        this.ctx.shadowBlur = 15;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.restore();
    }
    
    // Draw progress arc
    this.ctx.save();
    this.ctx.globalAlpha = 0.6;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, maxRadius + 10, -Math.PI/2, 
      -Math.PI/2 + (breathState.progress * 2 * Math.PI));
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawAlphaGoalIndicator(centerX: number, centerY: number): void {
    const goalMet = this.displayZλ >= this.alphaGoal;
    const ringRadius = 100;
    
    this.ctx.save();
    this.ctx.strokeStyle = goalMet ? '#00ff00' : '#666666';
    this.ctx.lineWidth = goalMet ? 4 : 2;
    this.ctx.globalAlpha = goalMet ? 0.8 : 0.3;
    
    if (goalMet) {
      this.ctx.shadowColor = '#00ff00';
      this.ctx.shadowBlur = 10;
    }
    
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.restore();
    
    // Goal text
    this.ctx.save();
    this.ctx.fillStyle = goalMet ? '#00ff00' : '#ffffff';
    this.ctx.font = '14px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Alpha Goal: ${this.alphaGoal}`, centerX, centerY - ringRadius - 15);
    this.ctx.restore();
  }

  private drawMetricsDisplay(): void {
    const x = 20;
    const y = 30;
    
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'left';
    
    // Current values with smooth display
    this.ctx.fillText(`Zλ: ${this.displayZλ.toFixed(3)}`, x, y);
    this.ctx.fillText(`Φ: ${this.displayΦ.toFixed(3)}`, x, y + 25);
    
    // Performance metrics
    this.ctx.font = '12px monospace';
    this.ctx.fillStyle = '#888888';
    this.ctx.fillText(`Frame: ${this.perfMonitor.getAverageFrameTime().toFixed(1)}ms`, x, y + 50);
    this.ctx.fillText(`EEG: ${this.eegLatency}ms`, x, y + 65);
    
    this.ctx.restore();
  }

  private drawEEGStatus(): void {
    const now = Date.now();
    const timeSinceLastEEG = now - this.lastEegTimestamp;
    const isConnected = timeSinceLastEEG < 5000; // 5 second timeout
    
    const x = this.canvas.clientWidth - 120;
    const y = 30;
    
    this.ctx.save();
    this.ctx.fillStyle = isConnected ? '#00ff00' : '#ff6600';
    this.ctx.font = '12px monospace';
    this.ctx.textAlign = 'left';
    
    const status = isConnected ? 'EEG ⚡ OK' : 'EEG …';
    this.ctx.fillText(status, x, y);
    
    this.ctx.restore();
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getBreathState(): BreathState {
    if (!this.isActive) {
      return {
        phase: 'ready',
        progress: 0,
        cycleStart: 0,
        active: false,
        pattern: 'Coherent'
      };
    }
    
    return calculateBreathPhase(this.cycleStartTime, this.breathCycleDuration);
  }

  dispose(): void {
    this.stop();
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}