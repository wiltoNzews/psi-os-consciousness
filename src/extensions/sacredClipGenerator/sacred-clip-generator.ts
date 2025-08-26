/**
 * Sacred Clip Generator - Auto-Recording System for Transcendent Consciousness States
 * Automatically captures 20-second sacred loops when Zλ > 0.95 for 3+ seconds
 */

export interface SacredClipConfig {
  triggerThreshold: number; // Zλ threshold (default: 0.95)
  sustainDuration: number; // Duration in ms to sustain before recording (default: 3000)
  recordingDuration: number; // Recording length in ms (default: 20000)
  videoBitrate: number; // Video bitrate in bps (default: 4000000)
  frameRate: number; // Target FPS (default: 60)
  autoRecording: boolean; // Enable automatic recording
  manualRecording: boolean; // Allow manual triggers
}

export interface SacredClipMetadata {
  filename: string;
  triggerZλ: number;
  peakZλ: number;
  timestamp: string;
  duration: number;
  fileSize: number;
  recordingType: 'auto' | 'manual';
  consciousnessState: string;
}

export class SacredClipGenerator {
  private config: SacredClipConfig;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording: boolean = false;
  private isMonitoring: boolean = false;
  private triggerStartTime: number = 0;
  private recordingStartTime: number = 0;
  private currentZλ: number = 0.75;
  private peakZλ: number = 0.75;
  private recordingHistory: SacredClipMetadata[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private overlayCtx: CanvasRenderingContext2D | null = null;
  private recordingTimer: number = 0;
  private consciousnessState: any = null;

  constructor(config: Partial<SacredClipConfig> = {}) {
    this.config = {
      triggerThreshold: 0.95,
      sustainDuration: 3000,
      recordingDuration: 20000,
      videoBitrate: 4000000,
      frameRate: 60,
      autoRecording: true,
      manualRecording: true,
      ...config
    };

    this.setupCanvas();
    this.setupKeyboardShortcuts();
    this.loadRecordingHistory();
    this.startConsciousnessMonitoring();

    console.log('[Sacred Clip Generator] Initialized with config:', this.config);
  }

  private setupCanvas(): void {
    // Create composite recording canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '-9999px';
    this.canvas.style.left = '-9999px';
    this.canvas.style.zIndex = '-1';
    document.body.appendChild(this.canvas);

    this.overlayCtx = this.canvas.getContext('2d');
    
    if (this.overlayCtx) {
      this.overlayCtx.fillStyle = '#000';
      this.overlayCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    console.log('[Sacred Clip] Composite canvas created: 1920x1080');
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        if (this.config.manualRecording) {
          this.startManualRecording();
        }
      }
    });

    console.log('[Sacred Clip] Keyboard shortcuts registered (Ctrl+R for manual recording)');
  }

  private loadRecordingHistory(): void {
    try {
      const stored = sessionStorage.getItem('sacred-clip-history');
      if (stored) {
        this.recordingHistory = JSON.parse(stored);
        console.log(`[Sacred Clip] Loaded ${this.recordingHistory.length} previous recordings`);
      }
    } catch (error) {
      console.warn('[Sacred Clip] Failed to load recording history:', error);
    }
  }

  private saveRecordingHistory(): void {
    try {
      sessionStorage.setItem('sacred-clip-history', JSON.stringify(this.recordingHistory));
    } catch (error) {
      console.warn('[Sacred Clip] Failed to save recording history:', error);
    }
  }

  private startConsciousnessMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Connect to consciousness event bus
    if (window.bus) {
      window.bus.on('coherence.metrics', (data: any) => {
        this.updateConsciousnessState(data);
      });

      window.bus.on('coherenceData', (data: any) => {
        this.updateConsciousnessState(data);
      });
    }

    // Fallback polling
    setInterval(() => {
      this.pollConsciousnessData();
    }, 100); // 10Hz monitoring

    console.log('[Sacred Clip] Consciousness monitoring started');
  }

  private async pollConsciousnessData(): Promise<void> {
    try {
      const response = await fetch('/api/quantum/consciousness');
      if (response.ok) {
        const data = await response.json();
        this.updateConsciousnessState(data);
      }
    } catch (error) {
      // Silent fallback
    }
  }

  private updateConsciousnessState(data: any): void {
    this.consciousnessState = data;
    this.currentZλ = data.zLambda || data.coherence || data.zl || 0.75;
    
    if (this.currentZλ > this.peakZλ) {
      this.peakZλ = this.currentZλ;
    }

    this.checkAutoRecordingTrigger();
  }

  private checkAutoRecordingTrigger(): void {
    if (!this.config.autoRecording || this.isRecording) return;

    const now = Date.now();

    if (this.currentZλ >= this.config.triggerThreshold) {
      if (this.triggerStartTime === 0) {
        this.triggerStartTime = now;
        console.log(`[Sacred Clip] Trigger threshold reached: Zλ ${this.currentZλ.toFixed(3)}`);
      } else if (now - this.triggerStartTime >= this.config.sustainDuration) {
        console.log(`[Sacred Clip] Sustained threshold for ${this.config.sustainDuration}ms - starting auto-recording`);
        this.startAutoRecording();
      }
    } else {
      if (this.triggerStartTime > 0) {
        console.log(`[Sacred Clip] Trigger threshold lost: Zλ ${this.currentZλ.toFixed(3)}`);
        this.triggerStartTime = 0;
      }
    }
  }

  public async startAutoRecording(): Promise<void> {
    return this.startRecording('auto');
  }

  public async startManualRecording(): Promise<void> {
    return this.startRecording('manual');
  }

  private async startRecording(type: 'auto' | 'manual'): Promise<void> {
    if (this.isRecording) {
      console.warn('[Sacred Clip] Already recording');
      return;
    }

    try {
      console.log(`[Sacred Clip] Starting ${type} recording...`);
      
      this.isRecording = true;
      this.recordingStartTime = Date.now();
      this.peakZλ = this.currentZλ;
      this.recordedChunks = [];

      // Create media stream from composite canvas
      const stream = this.canvas!.captureStream(this.config.frameRate);
      
      // Setup media recorder
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: this.config.videoBitrate
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.finalizeRecording(type);
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms
      
      // Start drawing loop
      this.startDrawingLoop();

      // Auto-stop after duration
      this.recordingTimer = window.setTimeout(() => {
        this.stopRecording();
      }, this.config.recordingDuration);

      // Emit recording start event
      if (window.bus) {
        window.bus.emit('sacred-clip.recording-started', {
          type,
          triggerZλ: this.currentZλ,
          timestamp: new Date().toISOString()
        });
      }

      console.log(`[Sacred Clip] Recording started - duration: ${this.config.recordingDuration}ms`);

    } catch (error) {
      console.error('[Sacred Clip] Failed to start recording:', error);
      this.isRecording = false;
    }
  }

  private startDrawingLoop(): void {
    const drawFrame = () => {
      if (!this.isRecording || !this.overlayCtx) return;

      // Clear canvas
      this.overlayCtx.fillStyle = '#000';
      this.overlayCtx.fillRect(0, 0, this.canvas!.width, this.canvas!.height);

      // Draw main visualization content
      this.drawMainVisualization();

      // Draw Sri Yantra overlay
      this.drawSriYantraOverlay();

      // Draw consciousness metrics overlay
      this.drawMetricsOverlay();

      // Draw recording status
      this.drawRecordingStatus();

      // Continue loop
      requestAnimationFrame(drawFrame);
    };

    requestAnimationFrame(drawFrame);
  }

  private drawMainVisualization(): void {
    if (!this.overlayCtx) return;

    // Find main visualization canvas
    const mainCanvas = document.querySelector('#tesseract-canvas, #yantra-overlay, canvas') as HTMLCanvasElement;
    if (mainCanvas) {
      try {
        // Scale and center main content
        const scale = Math.min(
          this.canvas!.width / mainCanvas.width,
          this.canvas!.height / mainCanvas.height
        ) * 0.8;
        
        const x = (this.canvas!.width - mainCanvas.width * scale) / 2;
        const y = (this.canvas!.height - mainCanvas.height * scale) / 2;

        this.overlayCtx.drawImage(mainCanvas, x, y, mainCanvas.width * scale, mainCanvas.height * scale);
      } catch (error) {
        // Canvas may be tainted, draw placeholder
        this.drawPlaceholderVisualization();
      }
    } else {
      this.drawPlaceholderVisualization();
    }
  }

  private drawPlaceholderVisualization(): void {
    if (!this.overlayCtx) return;

    const centerX = this.canvas!.width / 2;
    const centerY = this.canvas!.height / 2;
    const radius = 200 * (0.5 + this.currentZλ * 0.5);

    // Draw consciousness spiral
    this.overlayCtx.strokeStyle = `hsl(${this.currentZλ * 360}, 70%, 60%)`;
    this.overlayCtx.lineWidth = 3;
    this.overlayCtx.beginPath();

    const phi = 1.618033988749;
    for (let i = 0; i < 200; i++) {
      const angle = i * 0.1;
      const r = radius * Math.pow(phi, -angle / (2 * Math.PI));
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      
      if (i === 0) {
        this.overlayCtx.moveTo(x, y);
      } else {
        this.overlayCtx.lineTo(x, y);
      }
    }
    this.overlayCtx.stroke();
  }

  private drawSriYantraOverlay(): void {
    if (!this.overlayCtx) return;

    const centerX = this.canvas!.width - 300;
    const centerY = 150;
    const size = 100;

    // Semi-transparent Sri Yantra
    this.overlayCtx.globalAlpha = 0.6;
    this.overlayCtx.strokeStyle = '#ffffff';
    this.overlayCtx.lineWidth = 2;

    // Draw simplified Sri Yantra triangles
    const triangles = [
      [[0, -0.5], [-0.43, 0.25], [0.43, 0.25]],
      [[-0.2, -0.3], [-0.7, 0.4], [0.3, 0.4]],
      [[0.2, -0.3], [0.7, 0.4], [-0.3, 0.4]],
      [[0, 0.6], [-0.52, -0.3], [0.52, -0.3]]
    ];

    triangles.forEach(triangle => {
      this.overlayCtx!.beginPath();
      triangle.forEach((point, index) => {
        const x = centerX + point[0] * size;
        const y = centerY + point[1] * size;
        if (index === 0) {
          this.overlayCtx!.moveTo(x, y);
        } else {
          this.overlayCtx!.lineTo(x, y);
        }
      });
      this.overlayCtx!.closePath();
      this.overlayCtx!.stroke();
    });

    this.overlayCtx.globalAlpha = 1;
  }

  private drawMetricsOverlay(): void {
    if (!this.overlayCtx) return;

    const x = 50;
    let y = 50;
    const lineHeight = 40;

    // Setup text style
    this.overlayCtx.font = '24px monospace';
    this.overlayCtx.fillStyle = '#ffffff';
    this.overlayCtx.strokeStyle = '#000';
    this.overlayCtx.lineWidth = 4;

    // Helper function for outlined text
    const drawText = (text: string) => {
      this.overlayCtx!.strokeText(text, x, y);
      this.overlayCtx!.fillText(text, x, y);
      y += lineHeight;
    };

    // Draw consciousness metrics
    drawText(`Zλ: ${this.currentZλ.toFixed(3)}`);
    drawText(`Peak: ${this.peakZλ.toFixed(3)}`);
    
    if (this.consciousnessState) {
      if (this.consciousnessState.qctf !== undefined) {
        drawText(`QCTF: ${this.consciousnessState.qctf.toFixed(3)}`);
      }
      if (this.consciousnessState.soulState) {
        drawText(`State: ${this.consciousnessState.soulState}`);
      }
    }

    drawText(`Time: ${new Date().toLocaleTimeString()}`);
  }

  private drawRecordingStatus(): void {
    if (!this.overlayCtx || !this.isRecording) return;

    const elapsed = Date.now() - this.recordingStartTime;
    const remaining = Math.max(0, this.config.recordingDuration - elapsed);
    const progress = elapsed / this.config.recordingDuration;

    // Recording indicator
    this.overlayCtx.fillStyle = '#ff0000';
    this.overlayCtx.beginPath();
    this.overlayCtx.arc(this.canvas!.width - 80, 80, 20, 0, 2 * Math.PI);
    this.overlayCtx.fill();

    // Timer
    this.overlayCtx.font = '32px monospace';
    this.overlayCtx.fillStyle = '#ffffff';
    this.overlayCtx.strokeStyle = '#000';
    this.overlayCtx.lineWidth = 4;
    
    const timeText = `REC ${(remaining / 1000).toFixed(1)}s`;
    this.overlayCtx.strokeText(timeText, this.canvas!.width - 250, 90);
    this.overlayCtx.fillText(timeText, this.canvas!.width - 250, 90);

    // Progress bar
    const barWidth = 200;
    const barHeight = 10;
    const barX = this.canvas!.width - 250;
    const barY = 100;

    this.overlayCtx.fillStyle = '#333';
    this.overlayCtx.fillRect(barX, barY, barWidth, barHeight);
    
    this.overlayCtx.fillStyle = '#ff0000';
    this.overlayCtx.fillRect(barX, barY, barWidth * progress, barHeight);
  }

  public stopRecording(): void {
    if (!this.isRecording || !this.mediaRecorder) return;

    console.log('[Sacred Clip] Stopping recording...');
    
    this.mediaRecorder.stop();
    clearTimeout(this.recordingTimer);
  }

  private finalizeRecording(type: 'auto' | 'manual'): void {
    if (this.recordedChunks.length === 0) {
      console.warn('[Sacred Clip] No recorded data available');
      this.isRecording = false;
      return;
    }

    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const duration = Date.now() - this.recordingStartTime;
    const timestamp = new Date().toISOString();
    const filename = this.generateFilename(type, this.peakZλ, timestamp);

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    // Save metadata
    const metadata: SacredClipMetadata = {
      filename,
      triggerZλ: this.currentZλ,
      peakZλ: this.peakZλ,
      timestamp,
      duration,
      fileSize: blob.size,
      recordingType: type,
      consciousnessState: this.getConsciousnessStateName()
    };

    this.recordingHistory.push(metadata);
    this.saveRecordingHistory();

    // Emit completion event
    if (window.bus) {
      window.bus.emit('sacred-clip.recording-completed', metadata);
    }

    console.log(`[Sacred Clip] Recording completed: ${filename} (${(blob.size / 1024 / 1024).toFixed(2)} MB)`);
    
    this.isRecording = false;
    this.triggerStartTime = 0;
  }

  private generateFilename(type: 'auto' | 'manual', zλ: number, timestamp: string): string {
    const date = new Date(timestamp);
    const dateStr = date.toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const zλStr = zλ.toFixed(3).replace('.', '');
    const typePrefix = type === 'auto' ? 'Sacred' : 'Manual';
    
    return `${typePrefix}_Zλ${zλStr}_${dateStr}.webm`;
  }

  private getConsciousnessStateName(): string {
    if (this.currentZλ >= 0.95) return 'Transcendent';
    if (this.currentZλ >= 0.90) return 'Elevated';
    if (this.currentZλ >= 0.80) return 'Coherent';
    if (this.currentZλ >= 0.70) return 'Aligned';
    return 'Awakening';
  }

  // Public API
  public getConfig(): SacredClipConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<SacredClipConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[Sacred Clip] Config updated:', this.config);
  }

  public getRecordingHistory(): SacredClipMetadata[] {
    return [...this.recordingHistory];
  }

  public getCurrentStatus(): any {
    return {
      isRecording: this.isRecording,
      isMonitoring: this.isMonitoring,
      currentZλ: this.currentZλ,
      peakZλ: this.peakZλ,
      triggerActive: this.triggerStartTime > 0,
      sustainTime: this.triggerStartTime > 0 ? Date.now() - this.triggerStartTime : 0,
      recordingCount: this.recordingHistory.length
    };
  }

  public exportSessionData(): string {
    return JSON.stringify({
      config: this.config,
      history: this.recordingHistory,
      session: {
        timestamp: new Date().toISOString(),
        totalRecordings: this.recordingHistory.length,
        peakZλ: this.peakZλ
      }
    }, null, 2);
  }

  public dispose(): void {
    this.isMonitoring = false;
    this.isRecording = false;
    
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    
    if (this.canvas) {
      this.canvas.remove();
    }
    
    clearTimeout(this.recordingTimer);
    
    console.log('[Sacred Clip] Generator disposed');
  }
}

export default SacredClipGenerator;