/**
 * Coherence Coach Overlay - Breath UI + Zλ/Φ indicators
 * Provides real-time biofeedback training interface
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
import { breathingPatterns, defaultConfig, consciousnessColors } from './config';

export class CoherenceCoach {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: CoherenceBundleConfig;
  
  // State
  private isActive = false;
  private cycleStartTime = 0;
  private currentZλ = 0.75;
  private currentΦ = 0.50;
  private displayZλ = 0.75;  // Smoothed display value
  private displayΦ = 0.50;   // Smoothed display value
  private breathState: BreathState = {
    phase: 'ready',
    progress: 0,
    cycleStart: 0,
    active: false,
    pattern: 'Coherent'
  };
  
  // Performance monitoring
  private perfMonitor = new PerformanceMonitor();
  private rateLimiter = new RateLimiter(20); // 20 Hz updates
  private animationId: number | null = null;
  
  // Breath pattern
  private currentPattern = breathingPatterns.Coherent;
  
  constructor(config: CoherenceBundleConfig) {
    this.config = config;
    this.createCanvas();
    this.setupEventListeners();
    
    console.log('[Coherence Coach] Initialized');
  }

  private createCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'coherence-coach-overlay';
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      opacity: ${this.config.lineOpacity};
    `;
    
    this.ctx = this.canvas.getContext('2d')!;
    document.body.appendChild(this.canvas);
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  private setupEventListeners(): void {
    // Listen for coherence data updates
    if (typeof window !== 'undefined' && (window as any).bus) {
      const bus = (window as any).bus;
      
      bus.on('coherenceData', (data: CoherenceData) => {
        this.updateCoherence(data);
      });
      
      bus.on('zλ', (value: number) => {
        this.currentZλ = value;
      });
      
      bus.on('phi', (value: number) => {
        this.currentΦ = value;
      });
    }
  }

  public start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.startTime = Date.now();
    this.phaseStartTime = this.startTime;
    this.breathState.isActive = true;
    
    this.startAnimation();
    console.log('[Coherence Coach] Training session started');
  }

  public stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    this.breathState.isActive = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.clearCanvas();
    console.log('[Coherence Coach] Training session stopped');
  }

  public updateCoherence(data: CoherenceData): void {
    this.currentZλ = data.zλ;
    this.currentΦ = data.phi;
  }

  public updateConfig(config: Partial<CoherenceBundleConfig>): void {
    this.config = { ...this.config, ...config };
    this.canvas.style.opacity = this.config.lineOpacity.toString();
  }

  private startAnimation(): void {
    const animate = (currentTime: number) => {
      if (!this.isActive) return;
      
      this.updateBreathState(currentTime);
      this.render();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  private updateBreathState(currentTime: number): void {
    if (!this.isActive) return;
    
    const elapsedInPhase = currentTime - this.phaseStartTime;
    const currentPhaseDuration = this.getCurrentPhaseDuration() * 1000; // Convert to ms
    
    this.breathState.progress = Math.min(1, elapsedInPhase / currentPhaseDuration);
    
    // Calculate overall cycle progress
    const totalElapsed = currentTime - this.startTime;
    const cycleDuration = this.config.breathRate * 1000;
    this.breathState.cycleProgress = (totalElapsed % cycleDuration) / cycleDuration;
    
    // Check if phase is complete
    if (this.breathState.progress >= 1) {
      this.advanceBreathPhase(currentTime);
    }
  }

  private getCurrentPhaseDuration(): number {
    const pattern = this.currentPattern;
    switch (this.breathState.phase) {
      case 'inhale': return pattern.inhale;
      case 'hold': return pattern.hold;
      case 'exhale': return pattern.exhale;
      case 'pause': return pattern.pause;
      default: return pattern.inhale;
    }
  }

  private advanceBreathPhase(currentTime: number): void {
    this.phaseStartTime = currentTime;
    
    switch (this.breathState.phase) {
      case 'inhale':
        this.breathState.phase = this.currentPattern.hold > 0 ? 'hold' : 'exhale';
        break;
      case 'hold':
        this.breathState.phase = 'exhale';
        break;
      case 'exhale':
        this.breathState.phase = this.currentPattern.pause > 0 ? 'pause' : 'inhale';
        break;
      case 'pause':
        this.breathState.phase = 'inhale';
        break;
    }
    
    this.breathState.progress = 0;
  }

  private render(): void {
    this.clearCanvas();
    
    if (!this.config.enabled) return;
    
    if (this.config.showBreathGuide && this.isActive) {
      this.drawBreathGuide();
    }
    
    if (this.config.showMetrics) {
      this.drawMetrics();
      this.drawAlphaGoalIndicator();
    }
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawBreathGuide(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height * 0.75; // Position in lower portion
    
    const minRadius = 30;
    const maxRadius = 80;
    
    // Calculate radius based on breath phase
    let radius = minRadius;
    let alpha = 0.6;
    let strokeColor = this.config.lineColor;
    
    if (this.breathState.isActive) {
      switch (this.breathState.phase) {
        case 'inhale':
          radius = minRadius + (maxRadius - minRadius) * this.breathState.progress;
          alpha = 0.4 + this.breathState.progress * 0.4;
          strokeColor = '#00ff00';
          break;
        case 'hold':
          radius = maxRadius;
          alpha = 0.8;
          strokeColor = '#ffff00';
          break;
        case 'exhale':
          radius = maxRadius - (maxRadius - minRadius) * this.breathState.progress;
          alpha = 0.8 - this.breathState.progress * 0.4;
          strokeColor = '#ff6400';
          break;
        case 'pause':
          radius = minRadius;
          alpha = 0.4;
          strokeColor = '#888888';
          break;
      }
    }
    
    // Draw breath circle
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([]);
    
    // Add glow effect for high coherence
    if (this.currentZλ >= this.config.alphaGoal) {
      this.ctx.shadowColor = strokeColor;
      this.ctx.shadowBlur = 20;
    }
    
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    
    // Draw progress arc
    this.ctx.globalAlpha = 0.6;
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, maxRadius + 15, -Math.PI/2, -Math.PI/2 + (this.breathState.cycleProgress * 2 * Math.PI));
    this.ctx.stroke();
    
    // Draw phase text
    this.ctx.globalAlpha = 0.8;
    this.ctx.fillStyle = strokeColor;
    this.ctx.font = 'bold 16px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.breathState.phase.toUpperCase(), centerX, centerY + 6);
    
    this.ctx.restore();
  }

  private drawMetrics(): void {
    const margin = 20;
    let x = margin;
    let y = margin + 20;
    
    // Position based on config
    switch (this.config.metricsPosition) {
      case 'top-right':
        x = this.canvas.width - 200;
        break;
      case 'bottom-left':
        y = this.canvas.height - 80;
        break;
      case 'bottom-right':
        x = this.canvas.width - 200;
        y = this.canvas.height - 80;
        break;
    }
    
    this.ctx.save();
    
    // Background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(x - 10, y - 25, 180, 70);
    
    this.ctx.strokeStyle = this.config.lineColor;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x - 10, y - 25, 180, 70);
    
    // Zλ metric
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = '14px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Zλ: ${this.currentZλ.toFixed(3)}`, x, y);
    
    // Draw Zλ bar
    const barWidth = 100;
    const barHeight = 6;
    this.ctx.strokeStyle = '#333';
    this.ctx.strokeRect(x + 60, y - 8, barWidth, barHeight);
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillRect(x + 60, y - 8, barWidth * this.currentZλ, barHeight);
    
    // Φ metric
    y += 20;
    this.ctx.fillStyle = '#ff6400';
    this.ctx.fillText(`Φ: ${this.currentΦ.toFixed(3)}`, x, y);
    
    // Draw Φ bar
    this.ctx.strokeStyle = '#333';
    this.ctx.strokeRect(x + 60, y - 8, barWidth, barHeight);
    this.ctx.fillStyle = '#ff6400';
    this.ctx.fillRect(x + 60, y - 8, barWidth * this.currentΦ, barHeight);
    
    this.ctx.restore();
  }

  private drawAlphaGoalIndicator(): void {
    const isGoalMet = this.currentZλ >= this.config.alphaGoal;
    
    // Draw goal indicator in top center
    const centerX = this.canvas.width / 2;
    const y = 40;
    
    this.ctx.save();
    
    if (isGoalMet) {
      this.ctx.fillStyle = '#00ff00';
      this.ctx.shadowColor = '#00ff00';
      this.ctx.shadowBlur = 15;
    } else {
      this.ctx.fillStyle = '#666666';
    }
    
    this.ctx.font = 'bold 16px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('ALPHA COHERENCE', centerX, y);
    
    if (isGoalMet) {
      this.ctx.fillText('✓ ACHIEVED', centerX, y + 20);
    } else {
      this.ctx.fillStyle = '#ffff00';
      this.ctx.fillText(`TARGET: ${this.config.alphaGoal.toFixed(2)}`, centerX, y + 20);
    }
    
    this.ctx.restore();
  }

  public setBreathingPattern(patternName: keyof typeof breathingPatterns): void {
    if (breathingPatterns[patternName]) {
      this.currentPattern = breathingPatterns[patternName];
      console.log(`[Coherence Coach] Pattern changed to: ${patternName}`);
    }
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getCurrentState() {
    return {
      isActive: this.isActive,
      breathState: { ...this.breathState },
      currentZλ: this.currentZλ,
      currentΦ: this.currentΦ,
      alphaGoalMet: this.currentZλ >= this.config.alphaGoal
    };
  }

  public destroy(): void {
    this.stop();
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    console.log('[Coherence Coach] Destroyed');
  }
}