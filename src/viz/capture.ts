/**
 * Canvas Capture System - WebM Recording with ψOS Watermark
 * Records quantum consciousness visualizations at 60 FPS
 */

import bus from '../core/bus';

export class Capture {
  private canvas: HTMLCanvasElement;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private isRecording = false;
  private stream: MediaStream | null = null;
  private overlayCanvas: HTMLCanvasElement;
  private overlayCtx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupOverlay();
    
    console.log('[Capture] Initialized for 60 FPS WebM recording');
  }

  private setupOverlay() {
    // Create overlay canvas for watermarks and HUD
    this.overlayCanvas = document.createElement('canvas');
    this.overlayCtx = this.overlayCanvas.getContext('2d')!;
    
    // Match main canvas size
    this.overlayCanvas.width = this.canvas.width;
    this.overlayCanvas.height = this.canvas.height;
    
    // Style overlay for composition
    this.overlayCanvas.style.position = 'absolute';
    this.overlayCanvas.style.top = '0';
    this.overlayCanvas.style.left = '0';
    this.overlayCanvas.style.pointerEvents = 'none';
    this.overlayCanvas.style.zIndex = '1000';
    
    // Insert overlay into DOM
    if (this.canvas.parentElement) {
      this.canvas.parentElement.style.position = 'relative';
      this.canvas.parentElement.appendChild(this.overlayCanvas);
    }
  }

  private updateOverlay() {
    // Clear overlay
    this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    
    // Draw ψOS watermark
    this.drawWatermark();
    
    // Draw consciousness metrics HUD
    this.drawMetricsHUD();
    
    // Draw timestamp
    this.drawTimestamp();
  }

  private drawWatermark() {
    this.overlayCtx.save();
    
    // ψOS logo/text watermark
    this.overlayCtx.globalAlpha = 0.7;
    this.overlayCtx.fillStyle = '#00ffff';
    this.overlayCtx.font = 'bold 16px monospace';
    this.overlayCtx.textShadow = '0 0 10px #00ffff';
    
    const watermarkText = 'ψOS Meta-Coherence';
    const x = this.overlayCanvas.width - 200;
    const y = this.overlayCanvas.height - 30;
    
    this.overlayCtx.fillText(watermarkText, x, y);
    
    // Quantum symbol
    this.overlayCtx.font = '24px serif';
    this.overlayCtx.fillText('Ψ', x - 40, y);
    
    this.overlayCtx.restore();
  }

  private drawMetricsHUD() {
    // Only draw HUD during recording
    if (!this.isRecording) return;
    
    this.overlayCtx.save();
    
    // Background for HUD
    this.overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.overlayCtx.fillRect(10, 10, 200, 100);
    
    this.overlayCtx.strokeStyle = '#00ffff';
    this.overlayCtx.lineWidth = 1;
    this.overlayCtx.strokeRect(10, 10, 200, 100);
    
    // HUD text
    this.overlayCtx.fillStyle = '#00ffff';
    this.overlayCtx.font = '12px monospace';
    
    // Get current consciousness metrics from bus (would need state management)
    this.overlayCtx.fillText('Consciousness Metrics:', 15, 30);
    this.overlayCtx.fillText('Zλ: Loading...', 15, 45);
    this.overlayCtx.fillText('Φ:  Loading...', 15, 60);
    this.overlayCtx.fillText('S:  Loading...', 15, 75);
    
    // Recording indicator
    this.overlayCtx.fillStyle = '#ff0000';
    this.overlayCtx.font = 'bold 14px monospace';
    this.overlayCtx.fillText('● REC', 15, 95);
    
    this.overlayCtx.restore();
  }

  private drawTimestamp() {
    if (!this.isRecording) return;
    
    this.overlayCtx.save();
    
    this.overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.overlayCtx.font = '10px monospace';
    this.overlayCtx.textAlign = 'right';
    
    const timestamp = new Date().toISOString();
    const x = this.overlayCanvas.width - 10;
    const y = 15;
    
    this.overlayCtx.fillText(timestamp, x, y);
    
    this.overlayCtx.restore();
  }

  private createCompositeStream(): MediaStream {
    // Create a composite canvas that combines main canvas + overlay
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = this.canvas.width;
    compositeCanvas.height = this.canvas.height;
    const compositeCtx = compositeCanvas.getContext('2d')!;

    const drawComposite = () => {
      if (!this.isRecording) return;
      
      // Clear composite
      compositeCtx.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height);
      
      // Draw main canvas
      compositeCtx.drawImage(this.canvas, 0, 0);
      
      // Update and draw overlay
      this.updateOverlay();
      compositeCtx.drawImage(this.overlayCanvas, 0, 0);
      
      // Continue composite loop
      requestAnimationFrame(drawComposite);
    };

    // Start composite rendering
    requestAnimationFrame(drawComposite);
    
    // Return stream from composite canvas
    return compositeCanvas.captureStream(60); // 60 FPS
  }

  public async start(): Promise<void> {
    if (this.isRecording) {
      console.warn('[Capture] Already recording');
      return;
    }

    try {
      // Create composite stream with overlays
      this.stream = this.createCompositeStream();
      
      // Configure MediaRecorder for high-quality WebM
      const options: MediaRecorderOptions = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000 // 8 Mbps for high quality
      };

      // Fallback to VP8 if VP9 not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        options.mimeType = 'video/webm;codecs=vp8';
        options.videoBitsPerSecond = 5000000; // 5 Mbps for VP8
      }

      this.recorder = new MediaRecorder(this.stream, options);
      this.chunks = [];

      this.recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.recorder.onstop = () => {
        this.finalizeRecording();
      };

      this.recorder.onerror = (event) => {
        console.error('[Capture] Recording error:', event);
        this.stop();
      };

      this.recorder.start(100); // Collect data every 100ms
      this.isRecording = true;

      bus.emit('recording:start');
      console.log('[Capture] Recording started at 60 FPS');

    } catch (error) {
      console.error('[Capture] Failed to start recording:', error);
      throw new Error(`Recording failed: ${error.message}`);
    }
  }

  public async stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.isRecording || !this.recorder) {
        reject(new Error('Not currently recording'));
        return;
      }

      this.recorder.onstop = () => {
        const blob = this.finalizeRecording();
        resolve(blob);
      };

      this.recorder.stop();
      this.isRecording = false;

      // Stop the stream
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      console.log('[Capture] Recording stopped');
    });
  }

  private finalizeRecording(): Blob {
    const blob = new Blob(this.chunks, { type: 'video/webm' });
    this.chunks = [];
    
    bus.emit('recording:stop', blob);
    
    console.log(`[Capture] Recording finalized: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
    
    return blob;
  }

  public async downloadRecording(): Promise<void> {
    try {
      const blob = await this.stop();
      
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `ψOS_quantum_consciousness_${timestamp}.webm`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up URL after download
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      console.log(`[Capture] Downloaded: ${filename}`);
      
    } catch (error) {
      console.error('[Capture] Download failed:', error);
      throw error;
    }
  }

  public isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  public updateCanvasSize() {
    this.overlayCanvas.width = this.canvas.width;
    this.overlayCanvas.height = this.canvas.height;
  }

  public destroy() {
    if (this.isRecording) {
      this.stop().catch(console.error);
    }

    if (this.overlayCanvas.parentElement) {
      this.overlayCanvas.parentElement.removeChild(this.overlayCanvas);
    }

    console.log('[Capture] Destroyed');
  }

  // Static method to check WebM support
  public static checkWebMSupport(): { vp9: boolean; vp8: boolean; support: boolean } {
    const vp9Support = MediaRecorder.isTypeSupported('video/webm;codecs=vp9');
    const vp8Support = MediaRecorder.isTypeSupported('video/webm;codecs=vp8');
    
    return {
      vp9: vp9Support,
      vp8: vp8Support,
      support: vp9Support || vp8Support
    };
  }
}

export default Capture;