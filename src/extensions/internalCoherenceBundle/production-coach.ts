/**
 * Production Coherence Coach - Complete implementation from plan
 * Breath UI + Zλ/Φ indicators with canvas overlay
 */

import { defaultConfig, breathingPatterns, consciousnessColors } from './config';

export class CoherenceCoach {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isActive = false;
  private breathPhase = 'ready';
  private breathProgress = 0;
  private cycleStartTime = 0;
  private animationId: number | null = null;
  
  // Consciousness state
  private currentZλ = 0.75;
  private currentΦ = 0.50;
  private displayZλ = 0.75;
  private displayΦ = 0.50;
  
  // Configuration
  private breathRate = defaultConfig.breathRate;
  private alphaGoal = defaultConfig.alphaGoal;
  private showMetrics = defaultConfig.displayMetrics;
  private accessibilityMode = defaultConfig.accessibilityMode;

  constructor() {
    this.createCanvas();
    this.setupEventListeners();
    console.log('[Coherence Coach] Initialized');
  }

  private createCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'coherence-coach-overlay';
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
    
    // High-DPI setup with performance monitoring
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.scale(dpr, dpr);
    this.ctx.scale(dpr, dpr);
    
    // Add to DOM
    document.body.appendChild(this.canvas);
    
    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private setupEventListeners(): void {
    // Listen for consciousness data
    if (window.bus) {
      window.bus.on('coherenceData', (data: any) => {
        this.update(data.zLambda || data.Zλ, data.phi || data.Φ);
      });
      
      window.bus.on('coherence.metrics', (data: any) => {
        this.update(data.zLambda, data.phi);
      });
    }
  }

  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.cycleStartTime = performance.now();
    this.breathPhase = 'inhale';
    this.startAnimationLoop();
    
    console.log('[Coherence Coach] Session started');
  }

  stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    this.breathPhase = 'ready';
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.clearCanvas();
    console.log('[Coherence Coach] Session stopped');
  }

  update(zλ: number, phi: number): void {
    if (typeof zλ === 'number' && !isNaN(zλ)) {
      this.currentZλ = Math.max(0.3, Math.min(1.0, zλ));
    }
    if (typeof phi === 'number' && !isNaN(phi)) {
      this.currentΦ = Math.max(0.1, Math.min(1.0, phi));
    }
  }

  private startAnimationLoop(): void {
    const animate = () => {
      if (!this.isActive) return;
      
      // Smooth interpolation
      this.displayZλ += (this.currentZλ - this.displayZλ) * 0.08;
      this.displayΦ += (this.currentΦ - this.displayΦ) * 0.08;
      
      this.updateBreathPhase();
      this.render();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  private updateBreathPhase(): void {
    const elapsed = performance.now() - this.cycleStartTime;
    const cycleDuration = this.breathRate * 1000; // Convert to ms
    const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
    
    // Breath cycle: 40% inhale, 10% hold, 40% exhale, 10% pause
    if (cycleProgress < 0.4) {
      this.breathPhase = 'inhale';
      this.breathProgress = cycleProgress / 0.4;
    } else if (cycleProgress < 0.5) {
      this.breathPhase = 'hold';
      this.breathProgress = (cycleProgress - 0.4) / 0.1;
    } else if (cycleProgress < 0.9) {
      this.breathPhase = 'exhale';
      this.breathProgress = (cycleProgress - 0.5) / 0.4;
    } else {
      this.breathPhase = 'pause';
      this.breathProgress = (cycleProgress - 0.9) / 0.1;
    }
    
    // Smooth easing
    this.breathProgress = 0.5 - 0.5 * Math.cos(Math.PI * this.breathProgress);
    
    // Emit breath state for geometry sync
    if (window.bus) {
      window.bus.emit('coherence.breathTick', {
        phase: this.breathPhase,
        progress: this.breathProgress,
        active: this.isActive,
        cycleStart: this.cycleStartTime
      });
    }
  }

  private render(): void {
    this.clearCanvas();
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Draw breath guide
    this.drawBreathGuide(centerX, centerY);
    
    // Draw alpha goal indicator
    this.drawAlphaGoal(centerX, centerY);
    
    // Draw metrics if enabled
    if (this.showMetrics) {
      this.drawMetrics();
    }
    
    // Draw breath phase text
    this.drawPhaseText(centerX, centerY);
  }

  private drawBreathGuide(centerX: number, centerY: number): void {
    const maxRadius = 80;
    const minRadius = 20;
    
    let radius = minRadius;
    let alpha = 0.6;
    let strokeColor = consciousnessColors.medium;
    
    switch (this.breathPhase) {
      case 'inhale':
        radius = minRadius + (maxRadius - minRadius) * this.breathProgress;
        alpha = 0.4 + this.breathProgress * 0.4;
        strokeColor = consciousnessColors.high;
        break;
      case 'hold':
        radius = maxRadius;
        alpha = 0.8;
        strokeColor = consciousnessColors.transcendent;
        break;
      case 'exhale':
        radius = maxRadius - (maxRadius - minRadius) * this.breathProgress;
        alpha = 0.8 - this.breathProgress * 0.4;
        strokeColor = consciousnessColors.high;
        break;
      case 'pause':
        radius = minRadius;
        alpha = 0.4;
        strokeColor = consciousnessColors.low;
        break;
    }
    
    // Accessibility mode - gradient instead of flashing
    if (this.accessibilityMode) {
      const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(255, 100, 0, 0)');
      gradient.addColorStop(1, `rgba(255, 100, 0, ${alpha * 0.5})`);
      
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
      
      // Add glow for high consciousness
      if (this.displayZλ >= this.alphaGoal) {
        this.ctx.shadowColor = strokeColor;
        this.ctx.shadowBlur = 15;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.restore();
    }
    
    // Progress arc
    this.ctx.save();
    this.ctx.globalAlpha = 0.6;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, maxRadius + 10, -Math.PI/2, 
      -Math.PI/2 + (this.breathProgress * 2 * Math.PI));
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawAlphaGoal(centerX: number, centerY: number): void {
    const goalMet = this.displayZλ >= this.alphaGoal;
    const ringRadius = 100;
    
    this.ctx.save();
    this.ctx.strokeStyle = goalMet ? consciousnessColors.transcendent : consciousnessColors.low;
    this.ctx.lineWidth = goalMet ? 4 : 2;
    this.ctx.globalAlpha = goalMet ? 0.8 : 0.3;
    
    if (goalMet) {
      this.ctx.shadowColor = consciousnessColors.transcendent;
      this.ctx.shadowBlur = 10;
    }
    
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, ringRadius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.restore();
    
    // Goal text
    this.ctx.save();
    this.ctx.fillStyle = goalMet ? consciousnessColors.transcendent : '#ffffff';
    this.ctx.font = '14px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Alpha Goal: ${this.alphaGoal}`, centerX, centerY - ringRadius - 15);
    this.ctx.restore();
  }

  private drawMetrics(): void {
    const x = 20;
    const y = 30;
    
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px monospace';
    this.ctx.textAlign = 'left';
    
    this.ctx.fillText(`Zλ: ${this.displayZλ.toFixed(3)}`, x, y);
    this.ctx.fillText(`Φ: ${this.displayΦ.toFixed(3)}`, x, y + 25);
    
    // Coherence level
    const coherence = (this.displayZλ + this.displayΦ) / 2;
    let coherenceLabel = 'Low';
    let coherenceColor = consciousnessColors.low;
    
    if (coherence > 0.8) {
      coherenceLabel = 'Transcendent';
      coherenceColor = consciousnessColors.transcendent;
    } else if (coherence > 0.7) {
      coherenceLabel = 'High';
      coherenceColor = consciousnessColors.high;
    } else if (coherence > 0.6) {
      coherenceLabel = 'Medium';
      coherenceColor = consciousnessColors.medium;
    }
    
    this.ctx.fillStyle = coherenceColor;
    this.ctx.fillText(`State: ${coherenceLabel}`, x, y + 50);
    
    this.ctx.restore();
  }

  private drawPhaseText(centerX: number, centerY: number): void {
    if (!this.isActive) return;
    
    this.ctx.save();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '18px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.globalAlpha = 0.8;
    
    const phaseText = this.breathPhase.toUpperCase();
    this.ctx.fillText(phaseText, centerX, centerY + 150);
    
    this.ctx.restore();
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  setBreathingPattern(pattern: string): void {
    if (breathingPatterns[pattern]) {
      this.breathRate = breathingPatterns[pattern].rate;
      this.cycleStartTime = performance.now(); // Reset cycle
      console.log(`[Coherence Coach] Pattern: ${pattern} (${this.breathRate}s)`);
    }
  }

  getBreathState() {
    return {
      phase: this.breathPhase,
      progress: this.breathProgress,
      active: this.isActive,
      cycleStart: this.cycleStartTime
    };
  }

  dispose(): void {
    this.stop();
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}