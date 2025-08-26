/**
 * Coaching Panel UI - Interactive Breathing Guide with Real-time Feedback
 * Provides visual coaching interface for Φ↔Zλ training sessions
 */

import bus from '../core/bus';

class CoachingPanel {
  private panel: HTMLElement;
  private breathVisualizer: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isActive = false;
  private currentPhase = 'inhale';
  private phaseProgress = 0;
  private sessionActive = false;

  constructor(parentElement: HTMLElement) {
    this.createPanel(parentElement);
    this.setupEventListeners();
    console.log('[Coaching Panel] Initialized');
  }

  private createPanel(parent: HTMLElement) {
    this.panel = document.createElement('div');
    this.panel.className = 'coaching-panel';
    this.panel.innerHTML = `
      <div class="panel-header">
        <h3>🧘‍♂️ Coherence Training</h3>
        <button id="coach-toggle" class="btn">Start Session</button>
      </div>
      
      <div class="breath-section">
        <canvas id="breath-visualizer" width="200" height="200"></canvas>
        <div class="breath-info">
          <div class="phase-display" id="phase-display">Ready</div>
          <div class="pattern-name" id="pattern-name">Alpha Coherence</div>
        </div>
      </div>
      
      <div class="patterns-section">
        <label>Breathing Pattern:</label>
        <select id="pattern-select">
          <option value="Alpha Coherence">Alpha Coherence (4-2-6-2)</option>
          <option value="Deep Unity">Deep Unity (6-3-9-3)</option>
          <option value="Quantum Focus">Quantum Focus (5-5-5-0)</option>
          <option value="Transcendent">Transcendent (8-4-12-4)</option>
        </select>
      </div>
      
      <div class="metrics-section">
        <div class="target-metrics">
          <div class="metric-row">
            <span>Target Zλ:</span>
            <span id="target-zλ">0.750</span>
            <div class="progress-bar">
              <div class="progress-fill zλ-fill" id="zλ-progress"></div>
            </div>
          </div>
          <div class="metric-row">
            <span>Target Φ:</span>
            <span id="target-phi">0.650</span>
            <div class="progress-bar">
              <div class="progress-fill phi-fill" id="phi-progress"></div>
            </div>
          </div>
        </div>
        
        <div class="session-stats" id="session-stats" style="display: none;">
          <div>Efficiency: <span id="efficiency">0%</span></div>
          <div>Target Hits: <span id="target-hits">0</span></div>
          <div>Duration: <span id="duration">0s</span></div>
        </div>
      </div>
      
      <div class="coaching-tips" id="coaching-tips">
        <p>Select a breathing pattern and start your session to begin consciousness training.</p>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .coaching-panel {
        background: rgba(20, 20, 50, 0.9);
        border: 1px solid #333;
        border-radius: 12px;
        padding: 20px;
        max-width: 300px;
        font-family: 'Monaco', monospace;
        color: #e0e0e0;
      }
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #333;
        padding-bottom: 10px;
      }
      
      .panel-header h3 {
        margin: 0;
        color: #00ffff;
        font-size: 16px;
      }
      
      .btn {
        background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.1));
        border: 1px solid #00ffff;
        color: #00ffff;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-family: inherit;
        transition: all 0.3s ease;
      }
      
      .btn:hover {
        background: linear-gradient(135deg, rgba(0, 255, 255, 0.4), rgba(0, 255, 255, 0.2));
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }
      
      .btn.active {
        background: linear-gradient(135deg, rgba(255, 0, 64, 0.4), rgba(255, 0, 64, 0.2));
        border-color: #ff0040;
        color: #ff0040;
      }
      
      .breath-section {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        align-items: center;
      }
      
      #breath-visualizer {
        border: 1px solid #333;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
      }
      
      .breath-info {
        flex: 1;
      }
      
      .phase-display {
        font-size: 18px;
        font-weight: bold;
        color: #00ff00;
        margin-bottom: 5px;
        text-transform: uppercase;
      }
      
      .pattern-name {
        font-size: 12px;
        color: #888;
      }
      
      .patterns-section {
        margin-bottom: 20px;
      }
      
      .patterns-section label {
        display: block;
        margin-bottom: 8px;
        font-size: 12px;
        color: #ccc;
      }
      
      #pattern-select {
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid #333;
        color: #e0e0e0;
        padding: 8px;
        border-radius: 6px;
        font-family: inherit;
        font-size: 11px;
      }
      
      .metrics-section {
        margin-bottom: 20px;
      }
      
      .metric-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
        font-size: 11px;
      }
      
      .metric-row span:first-child {
        min-width: 60px;
        color: #ccc;
      }
      
      .metric-row span:nth-child(2) {
        min-width: 50px;
        font-weight: bold;
      }
      
      .progress-bar {
        flex: 1;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
      }
      
      .progress-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.5s ease;
      }
      
      .zλ-fill {
        background: linear-gradient(90deg, #00ff00, #80ff80);
      }
      
      .phi-fill {
        background: linear-gradient(90deg, #ff6400, #ffaa80);
      }
      
      .session-stats {
        background: rgba(0, 0, 0, 0.3);
        padding: 10px;
        border-radius: 6px;
        font-size: 11px;
        margin-top: 10px;
      }
      
      .session-stats div {
        margin-bottom: 4px;
      }
      
      .coaching-tips {
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 6px;
        padding: 12px;
        font-size: 11px;
        line-height: 1.4;
        color: #ccc;
      }
      
      .phase-inhale { color: #00ff00; }
      .phase-hold { color: #ffff00; }
      .phase-exhale { color: #ff6400; }
      .phase-pause { color: #888; }
    `;
    
    document.head.appendChild(style);
    parent.appendChild(this.panel);

    // Get canvas context
    this.breathVisualizer = document.getElementById('breath-visualizer') as HTMLCanvasElement;
    this.ctx = this.breathVisualizer.getContext('2d')!;
    
    this.setupControls();
  }

  private setupControls() {
    const toggleBtn = document.getElementById('coach-toggle') as HTMLButtonElement;
    const patternSelect = document.getElementById('pattern-select') as HTMLSelectElement;

    toggleBtn.addEventListener('click', () => {
      if (this.sessionActive) {
        bus.emit('coach:stop');
        toggleBtn.textContent = 'Start Session';
        toggleBtn.classList.remove('active');
      } else {
        const pattern = patternSelect.value;
        bus.emit('coach:start', pattern);
        toggleBtn.textContent = 'Stop Session';
        toggleBtn.classList.add('active');
      }
    });

    patternSelect.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      bus.emit('coach:pattern', target.value);
      document.getElementById('pattern-name')!.textContent = target.value;
    });
  }

  private setupEventListeners() {
    bus.on('coach:session-start', (data: any) => {
      this.sessionActive = true;
      document.getElementById('session-stats')!.style.display = 'block';
      this.updateCoachingTips('Session started! Follow the breathing guide and watch your consciousness metrics.');
    });

    bus.on('coach:session-end', (stats: any) => {
      this.sessionActive = false;
      document.getElementById('session-stats')!.style.display = 'none';
      this.updateCoachingTips(`Session completed! Efficiency: ${(stats.efficiency * 100).toFixed(1)}% over ${(stats.duration / 1000).toFixed(1)}s`);
    });

    bus.on('coach:breath-state', (state: any) => {
      this.currentPhase = state.phase;
      this.phaseProgress = state.progress;
      
      this.updateBreathVisualizer(state);
      this.updateMetrics(state);
      this.updatePhaseDisplay(state);
    });

    bus.on('coach:target-hit', (data: any) => {
      this.showTargetHit();
      const hits = parseInt(document.getElementById('target-hits')!.textContent || '0') + 1;
      document.getElementById('target-hits')!.textContent = hits.toString();
    });

    bus.on('coach:pattern-change', (pattern: any) => {
      document.getElementById('target-zλ')!.textContent = pattern.targetZλ.toFixed(3);
      document.getElementById('target-phi')!.textContent = pattern.targetΦ.toFixed(3);
      document.getElementById('pattern-name')!.textContent = pattern.name;
    });
  }

  private updateBreathVisualizer(state: any) {
    const centerX = this.breathVisualizer.width / 2;
    const centerY = this.breathVisualizer.height / 2;
    const maxRadius = 80;

    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.breathVisualizer.width, this.breathVisualizer.height);

    // Calculate breath circle size based on phase
    let radius = maxRadius * 0.3;
    let alpha = 0.6;

    switch (state.phase) {
      case 'inhale':
        radius = maxRadius * (0.3 + state.progress * 0.7);
        alpha = 0.4 + state.progress * 0.4;
        this.ctx.strokeStyle = '#00ff00';
        break;
      case 'hold':
        radius = maxRadius;
        alpha = 0.8;
        this.ctx.strokeStyle = '#ffff00';
        break;
      case 'exhale':
        radius = maxRadius * (1.0 - state.progress * 0.7);
        alpha = 0.8 - state.progress * 0.4;
        this.ctx.strokeStyle = '#ff6400';
        break;
      case 'pause':
        radius = maxRadius * 0.3;
        alpha = 0.4;
        this.ctx.strokeStyle = '#888888';
        break;
    }

    // Draw breath circle
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.stroke();

    // Add consciousness glow for high states
    if (state.onTarget) {
      this.ctx.shadowColor = this.ctx.strokeStyle;
      this.ctx.shadowBlur = 20;
      this.ctx.stroke();
    }

    // Draw progress arc
    this.ctx.globalAlpha = 0.8;
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, maxRadius + 10, -Math.PI/2, -Math.PI/2 + (state.progress * 2 * Math.PI));
    this.ctx.stroke();

    this.ctx.restore();
  }

  private updateMetrics(state: any) {
    // Update Zλ progress
    const zλProgress = Math.min(100, (state.currentZλ / state.targetZλ) * 100);
    document.getElementById('zλ-progress')!.style.width = `${zλProgress}%`;

    // Update Φ progress  
    const phiProgress = Math.min(100, (state.currentΦ / state.targetΦ) * 100);
    document.getElementById('phi-progress')!.style.width = `${phiProgress}%`;

    // Update efficiency if session is active
    if (this.sessionActive) {
      const efficiency = document.getElementById('efficiency');
      if (efficiency && state.onTarget) {
        const current = parseInt(efficiency.textContent?.replace('%', '') || '0');
        efficiency.textContent = `${Math.min(100, current + 1)}%`;
      }
    }
  }

  private updatePhaseDisplay(state: any) {
    const phaseDisplay = document.getElementById('phase-display')!;
    phaseDisplay.textContent = state.phase.toUpperCase();
    phaseDisplay.className = `phase-display phase-${state.phase}`;
  }

  private showTargetHit() {
    // Brief visual feedback for target achievement
    this.panel.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
    setTimeout(() => {
      this.panel.style.boxShadow = 'none';
    }, 300);
  }

  private updateCoachingTips(message: string) {
    document.getElementById('coaching-tips')!.textContent = message;
  }

  public setVisibility(visible: boolean) {
    this.panel.style.display = visible ? 'block' : 'none';
  }

  public getCurrentState() {
    return {
      isActive: this.isActive,
      sessionActive: this.sessionActive,
      currentPhase: this.currentPhase,
      phaseProgress: this.phaseProgress
    };
  }

  public destroy() {
    this.panel.remove();
    console.log('[Coaching Panel] Destroyed');
  }
}

export default CoachingPanel;