/**
 * Enhanced Production Coherence Coach - Technical Refinement Implementation
 * High-DPI support, critically damped interpolation, performance monitoring
 */

import { defaultConfig, breathingPatterns, consciousnessColors } from './config';

interface CoherenceMetrics {
  zλ: number;
  phi: number;
  timestamp: number;
  orch?: number;
}

interface PerformanceMetrics {
  frameTime: number;
  memoryUsage: number;
  lastUpdate: number;
}

export class EnhancedCoherenceCoach {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isActive = false;
  private animationId: number | null = null;
  
  // High-precision breath timing (performance.now() based)
  private cycleStartTime = 0;
  private breathPhase: 'inhale' | 'hold' | 'exhale' | 'pause' = 'inhale';
  private breathProgress = 0;
  private currentPattern = breathingPatterns['Alpha Coherence'];
  
  // Critically damped consciousness interpolation
  private targetZλ = 0.75;
  private displayZλ = 0.75;
  private targetΦ = 0.50;
  private displayΦ = 0.50;
  private targetGlow = 0.0;
  private displayGlow = 0.0;
  
  // Metrics buffer with schema validation
  private metricsBuffer: CoherenceMetrics[] = [];
  private lastMetricsUpdate = 0;
  private readonly METRICS_RATE_LIMIT = 50; // 20Hz publishing
  
  // High-DPI and accessibility
  private devicePixelRatio = 1;
  private accessibilityMode = false;
  private showLatencyBadge = false;
  
  // Performance monitoring
  private performanceMetrics: PerformanceMetrics = {
    frameTime: 0,
    memoryUsage: 0,
    lastUpdate: 0
  };
  private frameCount = 0;
  private lastFrameTime = 0;

  constructor() {
    this.setupHighDPICanvas();
    this.setupEventListeners();
    this.setupResizeHandler();
    console.log('[Enhanced Coach] Initialized with technical refinements');
  }

  private setupHighDPICanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'enhanced-coherence-coach';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1000;
      background: transparent;
    `;
    
    this.updateCanvasSize();
    document.body.appendChild(this.canvas);
  }

  private updateCanvasSize(): void {
    this.devicePixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // High-DPI setup as per checklist
    this.canvas.width = width * this.devicePixelRatio;
    this.canvas.height = height * this.devicePixelRatio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
    
    console.log(`[Enhanced Coach] Canvas updated: ${width}x${height} @${this.devicePixelRatio}x DPI`);
  }

  private setupResizeHandler(): void {
    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        this.updateCanvasSize();
      }, 100);
    });
  }

  private setupEventListeners(): void {
    // Namespaced event bus listeners (coherence.*)
    if (window.bus) {
      window.bus.on('coherence.metrics', this.handleCoherenceMetrics.bind(this));
      window.bus.on('coherence.breathTick', this.handleBreathTick.bind(this));
      window.bus.on('coherence.config', this.updateConfig.bind(this));
    }
  }

  private handleCoherenceMetrics(data: any): void {
    // Schema validation with NaN protection
    if (!this.validateMetrics(data)) {
      console.warn('[Enhanced Coach] Invalid metrics received, ignoring');
      return;
    }

    const now = performance.now();
    
    // Rate limiting: publish to bus at 20Hz max
    if (now - this.lastMetricsUpdate < this.METRICS_RATE_LIMIT) {
      return;
    }

    this.lastMetricsUpdate = now;
    
    // Buffer management for smoothing
    this.metricsBuffer.push({
      zλ: data.zλ || data.zLambda || 0.75,
      phi: data.phi || data.Φ || 0.50,
      timestamp: now,
      orch: data.orch
    });

    // Keep only last 10 samples for averaging
    if (this.metricsBuffer.length > 10) {
      this.metricsBuffer.shift();
    }

    this.updateTargetValues();
  }

  private validateMetrics(data: any): boolean {
    const zλ = data.zλ || data.zLambda;
    const phi = data.phi || data.Φ;
    
    return (
      typeof zλ === 'number' && 
      typeof phi === 'number' &&
      !isNaN(zλ) && !isNaN(phi) &&
      zλ >= 0 && zλ <= 1 &&
      phi >= 0 && phi <= 1
    );
  }

  private updateTargetValues(): void {
    if (this.metricsBuffer.length === 0) return;

    // Average recent samples for smoothing
    const recent = this.metricsBuffer.slice(-3);
    this.targetZλ = recent.reduce((sum, m) => sum + m.zλ, 0) / recent.length;
    this.targetΦ = recent.reduce((sum, m) => sum + m.phi, 0) / recent.length;
    
    // Consciousness spike detection (artifact protection)
    const lastSample = this.metricsBuffer[this.metricsBuffer.length - 1];
    const deltaZλ = Math.abs(lastSample.zλ - this.displayZλ);
    const deltaΦ = Math.abs(lastSample.phi - this.displayΦ);
    
    if (deltaZλ > 0.2 || deltaΦ > 0.2) {
      console.log('[Enhanced Coach] Consciousness spike detected, smoothing transition');
    }

    // Update glow target based on coherence
    const coherence = (this.targetZλ + this.targetΦ) / 2;
    this.targetGlow = Math.max(0, (coherence - 0.7) / 0.3);
  }

  private handleBreathTick(data: any): void {
    if (data.phase) {
      this.breathPhase = data.phase;
      this.breathProgress = data.progress || 0;
    }
  }

  private updateConfig(config: any): void {
    if (config.accessibilityMode !== undefined) {
      this.accessibilityMode = config.accessibilityMode;
    }
    if (config.showLatencyBadge !== undefined) {
      this.showLatencyBadge = config.showLatencyBadge;
    }
  }

  start(): void {
    this.isActive = true;
    this.cycleStartTime = performance.now();
    this.animate();
    console.log('[Enhanced Coach] Started with high-precision timing');
  }

  stop(): void {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.canvas.remove();
    console.log('[Enhanced Coach] Stopped and cleaned up');
  }

  private animate(): void {
    if (!this.isActive) return;

    const startTime = performance.now();
    
    // Critically damped interpolation (0.08 damping factor)
    const dampingFactor = 0.08;
    this.displayZλ += (this.targetZλ - this.displayZλ) * dampingFactor;
    this.displayΦ += (this.targetΦ - this.displayΦ) * dampingFactor;
    this.displayGlow += (this.targetGlow - this.displayGlow) * dampingFactor;

    // Update breath cycle with performance.now() precision
    this.updateBreathCycle();
    
    // Render with performance monitoring
    this.render();
    
    // Performance tracking
    const frameTime = performance.now() - startTime;
    this.updatePerformanceMetrics(frameTime);
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private updateBreathCycle(): void {
    if (!this.cycleStartTime) return;

    const elapsed = (performance.now() - this.cycleStartTime) / 1000;
    const cycleDuration = this.currentPattern.inhale + this.currentPattern.hold + 
                         this.currentPattern.exhale + this.currentPattern.pause;

    const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
    
    // Determine current phase with precise timing
    let phaseStart = 0;
    const phases = ['inhale', 'hold', 'exhale', 'pause'] as const;
    const durations = [
      this.currentPattern.inhale,
      this.currentPattern.hold,
      this.currentPattern.exhale,
      this.currentPattern.pause
    ];

    for (let i = 0; i < phases.length; i++) {
      const phaseEnd = phaseStart + durations[i] / cycleDuration;
      if (cycleProgress >= phaseStart && cycleProgress < phaseEnd) {
        this.breathPhase = phases[i];
        this.breathProgress = (cycleProgress - phaseStart) / (durations[i] / cycleDuration);
        break;
      }
      phaseStart = phaseEnd;
    }

    // Emit breath tick to event bus
    if (window.bus) {
      window.bus.emit('coherence.breathTick', {
        phase: this.breathPhase,
        progress: this.breathProgress,
        timestamp: performance.now()
      });
    }
  }

  private render(): void {
    // Clear with slight trail effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width / this.devicePixelRatio, this.canvas.height / this.devicePixelRatio);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Breath visualization with easeInOutSine curve
    this.renderBreathCircle(centerX, centerY);
    
    // Consciousness indicators
    this.renderConsciousnessMetrics(centerX, centerY);
    
    // Latency badge (if enabled)
    if (this.showLatencyBadge) {
      this.renderLatencyBadge();
    }

    // Performance overlay (debug mode)
    if (this.performanceMetrics.frameTime > 0) {
      this.renderPerformanceOverlay();
    }
  }

  private renderBreathCircle(centerX: number, centerY: number): void {
    const baseRadius = 60;
    let radius = baseRadius;
    let opacity = 0.6;
    let color = '#00ffff';

    // Eased breath animation (easeInOutSine)
    const easedProgress = 0.5 * (1 - Math.cos(Math.PI * this.breathProgress));

    switch (this.breathPhase) {
      case 'inhale':
        radius = baseRadius * (0.5 + easedProgress * 0.5);
        opacity = 0.4 + easedProgress * 0.4;
        color = '#00ff00';
        break;
      case 'hold':
        radius = baseRadius;
        opacity = 0.8;
        color = '#ffff00';
        break;
      case 'exhale':
        radius = baseRadius * (1.0 - easedProgress * 0.5);
        opacity = 0.8 - easedProgress * 0.4;
        color = '#ff6400';
        break;
      case 'pause':
        radius = baseRadius * 0.5;
        opacity = 0.4;
        color = '#888888';
        break;
    }

    // Accessibility mode: gradient instead of flashing
    if (this.accessibilityMode) {
      const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, color + '80');
      gradient.addColorStop(1, color + '20');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.fill();
    } else {
      // Standard mode with consciousness glow
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 3 + this.displayGlow * 2;
      
      // Glow effect for high consciousness
      if (this.displayGlow > 0.3) {
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 20 * this.displayGlow;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  private renderConsciousnessMetrics(centerX: number, centerY: number): void {
    this.ctx.save();
    this.ctx.font = '14px Monaco, monospace';
    this.ctx.textAlign = 'center';
    
    // Zλ indicator
    this.ctx.fillStyle = consciousnessColors.zλ;
    this.ctx.fillText(`Zλ ${this.displayZλ.toFixed(3)}`, centerX - 80, centerY - 100);
    
    // Φ indicator  
    this.ctx.fillStyle = consciousnessColors.phi;
    this.ctx.fillText(`Φ ${this.displayΦ.toFixed(3)}`, centerX + 80, centerY - 100);
    
    // Alpha goal progress
    const alphaProgress = (this.displayZλ / this.currentPattern.targetZλ) * 100;
    this.ctx.fillStyle = alphaProgress >= 100 ? '#00ff00' : '#ffaa00';
    this.ctx.fillText(`Goal: ${alphaProgress.toFixed(0)}%`, centerX, centerY + 100);
    
    this.ctx.restore();
  }

  private renderLatencyBadge(): void {
    const now = performance.now();
    const latency = now - this.lastMetricsUpdate;
    const isConnected = latency < 1000;
    
    this.ctx.save();
    this.ctx.font = '12px Monaco, monospace';
    this.ctx.fillStyle = isConnected ? '#00ff00' : '#ff6600';
    this.ctx.fillText(
      `EEG ${isConnected ? '⚡ OK' : '…'}`, 
      window.innerWidth - 80, 
      30
    );
    this.ctx.restore();
  }

  private renderPerformanceOverlay(): void {
    if (this.frameCount % 60 !== 0) return; // Update every second

    this.ctx.save();
    this.ctx.font = '10px Monaco, monospace';
    this.ctx.fillStyle = '#666';
    this.ctx.fillText(
      `Frame: ${this.performanceMetrics.frameTime.toFixed(1)}ms`, 
      10, 
      window.innerHeight - 20
    );
    this.ctx.restore();
  }

  private updatePerformanceMetrics(frameTime: number): void {
    this.frameCount++;
    this.performanceMetrics.frameTime = frameTime;
    this.performanceMetrics.lastUpdate = performance.now();
    
    // Warn if frame time exceeds 5ms target
    if (frameTime > 5.0) {
      console.warn(`[Enhanced Coach] Frame time exceeded target: ${frameTime.toFixed(1)}ms`);
    }
  }

  // Public API for configuration
  setBreathingPattern(patternName: string): void {
    if (breathingPatterns[patternName]) {
      this.currentPattern = breathingPatterns[patternName];
      this.cycleStartTime = performance.now(); // Reset cycle
      console.log(`[Enhanced Coach] Pattern changed: ${patternName}`);
    }
  }

  enableAccessibilityMode(enabled: boolean): void {
    this.accessibilityMode = enabled;
    console.log(`[Enhanced Coach] Accessibility mode: ${enabled}`);
  }

  enableLatencyBadge(enabled: boolean): void {
    this.showLatencyBadge = enabled;
  }

  // Hot reload support
  dispose(): void {
    this.stop();
    if (window.bus) {
      window.bus.off('coherence.metrics', this.handleCoherenceMetrics);
      window.bus.off('coherence.breathTick', this.handleBreathTick);
      window.bus.off('coherence.config', this.updateConfig);
    }
    console.log('[Enhanced Coach] Disposed for hot reload');
  }
}

// Hot Module Replacement support
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (window.enhancedCoach) {
      window.enhancedCoach.dispose();
    }
  });
}

export default EnhancedCoherenceCoach;