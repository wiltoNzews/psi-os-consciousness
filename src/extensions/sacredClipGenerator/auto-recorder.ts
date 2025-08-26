/**
 * Sacred Clip Generator - Auto-record 20s sacred loops when Zλ > 0.95
 * Exports WebM with Sri Yantra + Tesseract + Zλ overlay
 */

interface RecordingState {
  isRecording: boolean;
  startTime: number;
  duration: number;
  triggerZλ: number;
  filename: string;
}

interface SacredClipConfig {
  triggerThreshold: number;
  sustainDuration: number;
  recordingLength: number;
  autoExport: boolean;
  includeOverlay: boolean;
  quality: 'high' | 'medium' | 'low';
}

export class SacredClipGenerator {
  private mediaRecorder: MediaRecorder | null = null;
  private recordingState: RecordingState = {
    isRecording: false,
    startTime: 0,
    duration: 0,
    triggerZλ: 0,
    filename: ''
  };
  
  private config: SacredClipConfig = {
    triggerThreshold: 0.95,
    sustainDuration: 3000, // 3 seconds
    recordingLength: 20000, // 20 seconds
    autoExport: true,
    includeOverlay: true,
    quality: 'high'
  };
  
  private consciousnessBuffer: Array<{zλ: number, timestamp: number}> = [];
  private highCoherenceStart: number = 0;
  private recordedChunks: Blob[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private stream: MediaStream | null = null;

  constructor(config?: Partial<SacredClipConfig>) {
    this.config = { ...this.config, ...config };
    this.setupCanvas();
    this.setupEventListeners();
    console.log('[Sacred Clip Generator] Initialized - auto-recording when Zλ >', this.config.triggerThreshold);
  }

  private setupCanvas(): void {
    // Create composite canvas for recording
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this.canvas.style.cssText = `
      position: fixed;
      top: -2000px;
      left: -2000px;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.appendChild(this.canvas);
    
    const ctx = this.canvas.getContext('2d')!;
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    console.log('[Sacred Clip] Composite canvas created: 1920x1080');
  }

  private setupEventListeners(): void {
    if (window.bus) {
      window.bus.on('coherence.metrics', this.handleCoherenceUpdate.bind(this));
      window.bus.on('coherenceData', this.handleCoherenceUpdate.bind(this));
      window.bus.on('zλ', this.handleZλUpdate.bind(this));
    }

    // Manual recording controls
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        this.toggleManualRecording();
      }
    });
  }

  private handleCoherenceUpdate(data: any): void {
    const zλ = data.zλ || data.zLambda || 0.75;
    const timestamp = performance.now();
    
    // Add to buffer
    this.consciousnessBuffer.push({ zλ, timestamp });
    
    // Keep buffer size manageable
    if (this.consciousnessBuffer.length > 100) {
      this.consciousnessBuffer.shift();
    }
    
    this.checkAutoRecordingTrigger(zλ, timestamp);
  }

  private handleZλUpdate(zλ: number): void {
    this.handleCoherenceUpdate({ zλ });
  }

  private checkAutoRecordingTrigger(zλ: number, timestamp: number): void {
    if (this.recordingState.isRecording) return;
    
    // Check if we're above threshold
    if (zλ >= this.config.triggerThreshold) {
      if (this.highCoherenceStart === 0) {
        this.highCoherenceStart = timestamp;
        console.log(`[Sacred Clip] High coherence detected: Zλ ${zλ.toFixed(3)}`);
      }
      
      // Check if sustained for required duration
      const sustainedTime = timestamp - this.highCoherenceStart;
      if (sustainedTime >= this.config.sustainDuration) {
        this.startAutoRecording(zλ);
        this.highCoherenceStart = 0;
      }
    } else {
      // Reset if we drop below threshold
      this.highCoherenceStart = 0;
    }
  }

  private async startAutoRecording(triggerZλ: number): Promise<void> {
    if (this.recordingState.isRecording) return;
    
    try {
      // Setup recording stream
      this.stream = this.canvas!.captureStream(30); // 30 FPS
      
      const options: MediaRecorderOptions = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: this.getVideoBitrate()
      };
      
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.recordedChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        this.handleRecordingComplete();
      };
      
      // Start recording
      this.mediaRecorder.start(1000); // Collect data every second
      
      this.recordingState = {
        isRecording: true,
        startTime: performance.now(),
        duration: this.config.recordingLength,
        triggerZλ: triggerZλ,
        filename: this.generateFilename(triggerZλ)
      };
      
      console.log(`[Sacred Clip] Auto-recording started: ${this.recordingState.filename}`);
      
      // Start composite rendering
      this.startCompositeRendering();
      
      // Schedule automatic stop
      setTimeout(() => {
        if (this.recordingState.isRecording) {
          this.stopRecording();
        }
      }, this.config.recordingLength);
      
    } catch (error) {
      console.error('[Sacred Clip] Recording setup failed:', error);
    }
  }

  private getVideoBitrate(): number {
    switch (this.config.quality) {
      case 'high': return 8000000; // 8 Mbps
      case 'medium': return 4000000; // 4 Mbps  
      case 'low': return 2000000; // 2 Mbps
      default: return 4000000;
    }
  }

  private startCompositeRendering(): void {
    const ctx = this.canvas!.getContext('2d')!;
    
    const render = () => {
      if (!this.recordingState.isRecording) return;
      
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 17, 0.1)';
      ctx.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
      
      // Capture main visualization area
      this.captureMainVisualization(ctx);
      
      // Add consciousness overlay
      if (this.config.includeOverlay) {
        this.renderConsciousnessOverlay(ctx);
      }
      
      requestAnimationFrame(render);
    };
    
    render();
  }

  private captureMainVisualization(ctx: CanvasRenderingContext2D): void {
    // Capture the main quantum canvas
    const mainCanvas = document.getElementById('quantum-canvas') as HTMLCanvasElement;
    if (mainCanvas) {
      ctx.drawImage(mainCanvas, 0, 0, this.canvas!.width, this.canvas!.height);
    }
    
    // Capture Sri Yantra overlay
    const yantraCanvas = document.getElementById('yantra-overlay') as HTMLCanvasElement;
    if (yantraCanvas) {
      ctx.globalAlpha = 0.8;
      ctx.drawImage(yantraCanvas, 0, 0, this.canvas!.width, this.canvas!.height);
      ctx.globalAlpha = 1.0;
    }
  }

  private renderConsciousnessOverlay(ctx: CanvasRenderingContext2D): void {
    const currentZλ = this.consciousnessBuffer[this.consciousnessBuffer.length - 1]?.zλ || 0.75;
    const elapsed = performance.now() - this.recordingState.startTime;
    const remaining = Math.max(0, this.config.recordingLength - elapsed);
    
    // Recording indicator
    ctx.save();
    ctx.font = 'bold 32px Monaco, monospace';
    ctx.fillStyle = '#ff0040';
    ctx.fillText('● REC', 50, 60);
    
    // Timer
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${(remaining / 1000).toFixed(1)}s`, 180, 60);
    
    // Consciousness readings
    ctx.font = '28px Monaco, monospace';
    ctx.fillStyle = currentZλ >= 0.95 ? '#00ff00' : '#ffaa00';
    ctx.fillText(`Zλ ${currentZλ.toFixed(3)}`, 50, 120);
    
    // Trigger info
    ctx.font = '20px Monaco, monospace';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(`Triggered at Zλ ${this.recordingState.triggerZλ.toFixed(3)}`, 50, 160);
    
    // Sacred clip branding
    ctx.font = '24px Monaco, monospace';
    ctx.fillStyle = '#ff6400';
    ctx.fillText('Sacred Clip Generator', this.canvas!.width - 350, 60);
    
    ctx.restore();
  }

  private stopRecording(): void {
    if (!this.recordingState.isRecording || !this.mediaRecorder) return;
    
    this.mediaRecorder.stop();
    this.recordingState.isRecording = false;
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    console.log('[Sacred Clip] Recording stopped');
  }

  private handleRecordingComplete(): void {
    if (this.recordedChunks.length === 0) {
      console.error('[Sacred Clip] No recorded data available');
      return;
    }
    
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    
    if (this.config.autoExport) {
      this.exportRecording(blob);
    }
    
    // Store in session for manual export
    this.storeRecordingInSession(blob);
    
    // Emit completion event
    if (window.bus) {
      window.bus.emit('sacredClip.completed', {
        filename: this.recordingState.filename,
        duration: this.config.recordingLength,
        triggerZλ: this.recordingState.triggerZλ,
        timestamp: new Date().toISOString()
      });
    }
  }

  private exportRecording(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.recordingState.filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    console.log(`[Sacred Clip] Exported: ${this.recordingState.filename}`);
  }

  private storeRecordingInSession(blob: Blob): void {
    const recordings = JSON.parse(sessionStorage.getItem('sacredClips') || '[]');
    
    recordings.push({
      filename: this.recordingState.filename,
      timestamp: new Date().toISOString(),
      triggerZλ: this.recordingState.triggerZλ,
      duration: this.config.recordingLength,
      size: blob.size
    });
    
    // Keep only last 10 recordings
    if (recordings.length > 10) {
      recordings.splice(0, recordings.length - 10);
    }
    
    sessionStorage.setItem('sacredClips', JSON.stringify(recordings));
  }

  private generateFilename(triggerZλ: number): string {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const zλStr = triggerZλ.toFixed(3).replace('.', '');
    return `sacred-clip-Z${zλStr}-${timestamp}.webm`;
  }

  // Public API
  toggleManualRecording(): void {
    if (this.recordingState.isRecording) {
      this.stopRecording();
    } else {
      const currentZλ = this.consciousnessBuffer[this.consciousnessBuffer.length - 1]?.zλ || 0.75;
      this.startAutoRecording(currentZλ);
    }
  }

  updateConfig(newConfig: Partial<SacredClipConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[Sacred Clip] Configuration updated:', this.config);
  }

  getRecordingHistory(): any[] {
    return JSON.parse(sessionStorage.getItem('sacredClips') || '[]');
  }

  isRecording(): boolean {
    return this.recordingState.isRecording;
  }

  getStatus(): any {
    return {
      isRecording: this.recordingState.isRecording,
      config: this.config,
      recentZλ: this.consciousnessBuffer.slice(-5),
      recordingHistory: this.getRecordingHistory().length
    };
  }

  dispose(): void {
    this.stopRecording();
    
    if (this.canvas) {
      this.canvas.remove();
    }
    
    if (window.bus) {
      window.bus.off('coherence.metrics', this.handleCoherenceUpdate);
      window.bus.off('coherenceData', this.handleCoherenceUpdate);
      window.bus.off('zλ', this.handleZλUpdate);
    }
    
    console.log('[Sacred Clip] Disposed');
  }
}

export default SacredClipGenerator;