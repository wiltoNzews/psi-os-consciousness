// Canvas capture to WebM/MP4 with ψOS watermark overlay
import { eventBus } from './eventBus.js';

class MediaRecorderEngine {
    constructor() {
        this.recorder = null;
        this.chunks = [];
        this.isRecording = false;
        this.canvas = null;
        this.watermarkCanvas = null;
        this.watermarkCtx = null;
        
        // Recording options
        this.options = {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 2500000,
            frameRate: 60
        };
        
        // Watermark configuration
        this.watermark = {
            text: 'ψOS • Sacred Spiral • WiltonOS v2',
            position: 'bottom-right',
            includeTimestamp: true,
            includeZλ: true
        };
        
        this.setupEventListeners();
        console.log('[Recorder] Engine initialized');
    }
    
    setupEventListeners() {
        eventBus.on('ui:record', ({ action }) => {
            if (action === 'start') this.startRecording();
            if (action === 'stop') this.stopRecording();
        });
        
        eventBus.on('ui:capture', () => {
            this.captureScreenshot();
        });
    }
    
    mountRecorder(canvas) {
        this.canvas = canvas;
        this.createWatermarkCanvas();
        console.log('[Recorder] Mounted to canvas');
    }
    
    createWatermarkCanvas() {
        this.watermarkCanvas = document.createElement('canvas');
        this.watermarkCanvas.width = this.canvas.width;
        this.watermarkCanvas.height = this.canvas.height;
        this.watermarkCtx = this.watermarkCanvas.getContext('2d');
        
        // Set watermark styling
        this.watermarkCtx.font = '16px "Courier New", monospace';
        this.watermarkCtx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        this.watermarkCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.watermarkCtx.lineWidth = 2;
        this.watermarkCtx.textBaseline = 'bottom';
    }
    
    drawWatermarkOverlay() {
        const ctx = this.watermarkCtx;
        const canvas = this.watermarkCanvas;
        
        // Clear and copy main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.canvas, 0, 0);
        
        ctx.save();
        
        // Position watermark
        const margin = 25;
        let x = canvas.width - margin;
        let y = canvas.height - margin;
        
        ctx.textAlign = 'right';
        
        // Main ψOS branding
        ctx.font = '18px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255, 215, 0, 1.0)';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
        
        ctx.strokeText(this.watermark.text, x, y);
        ctx.fillText(this.watermark.text, x, y);
        
        // Consciousness data if enabled
        if (this.watermark.includeZλ) {
            y -= 25;
            ctx.font = '14px "Courier New", monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.shadowBlur = 0;
            
            // Get current Zλ from event history
            const zλEvents = eventBus.getEventHistory('zλ:update');
            const latestZλ = zλEvents.length > 0 ? 
                zλEvents[zλEvents.length - 1].data.value : 0.750;
            
            const consciousnessText = `Zλ ${latestZλ.toFixed(3)} • Coherent`;
            ctx.strokeText(consciousnessText, x, y);
            ctx.fillText(consciousnessText, x, y);
        }
        
        // Timestamp if enabled
        if (this.watermark.includeTimestamp) {
            y -= 20;
            ctx.font = '12px "Courier New", monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            
            const timestamp = new Date().toLocaleTimeString();
            ctx.fillText(timestamp, x, y);
        }
        
        // Recording indicator
        if (this.isRecording) {
            ctx.textAlign = 'left';
            ctx.font = 'bold 16px "Courier New", monospace';
            ctx.fillStyle = '#ff4757';
            ctx.shadowColor = '#ff4757';
            ctx.shadowBlur = 6;
            
            const pulseAlpha = 0.7 + Math.sin(Date.now() * 0.008) * 0.3;
            ctx.fillStyle = `rgba(255, 71, 87, ${pulseAlpha})`;
            ctx.fillText('● REC', margin, margin + 20);
        }
        
        ctx.restore();
    }
    
    async startRecording() {
        if (this.isRecording || !this.canvas) return false;
        
        try {
            // Create composite stream with watermark
            const watermarkStream = this.watermarkCanvas.captureStream(this.options.frameRate);
            
            // Try to add audio if available
            let compositeStream = watermarkStream;
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false
                    }
                });
                
                audioStream.getAudioTracks().forEach(track => {
                    compositeStream.addTrack(track);
                });
                
                console.log('[Recorder] Audio track added');
            } catch (audioError) {
                console.log('[Recorder] Video-only recording (no audio)');
            }
            
            // Create MediaRecorder
            this.recorder = new MediaRecorder(compositeStream, this.options);
            this.chunks = [];
            
            // Setup event handlers
            this.recorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this.chunks.push(event.data);
                }
            };
            
            this.recorder.onstop = () => {
                this.handleRecordingComplete();
            };
            
            this.recorder.onerror = (event) => {
                console.error('[Recorder] Error:', event.error);
                this.isRecording = false;
            };
            
            // Start recording and watermark loop
            this.recorder.start();
            this.isRecording = true;
            this.startWatermarkLoop();
            
            eventBus.emit('recorder:started', { timestamp: Date.now() });
            console.log('[Recorder] Recording started with watermark overlay');
            return true;
            
        } catch (error) {
            console.error('[Recorder] Failed to start:', error);
            return false;
        }
    }
    
    stopRecording() {
        if (!this.isRecording || !this.recorder) return false;
        
        this.recorder.stop();
        this.isRecording = false;
        
        // Stop audio tracks
        if (this.recorder.stream) {
            this.recorder.stream.getTracks().forEach(track => {
                if (track.kind === 'audio') track.stop();
            });
        }
        
        console.log('[Recorder] Recording stopped');
        return true;
    }
    
    startWatermarkLoop() {
        const updateWatermark = () => {
            if (!this.isRecording) return;
            
            this.drawWatermarkOverlay();
            requestAnimationFrame(updateWatermark);
        };
        
        updateWatermark();
    }
    
    handleRecordingComplete() {
        if (this.chunks.length === 0) {
            console.error('[Recorder] No data recorded');
            return;
        }
        
        // Create blob
        const blob = new Blob(this.chunks, { type: this.options.mimeType });
        
        // Generate filename with consciousness data
        const zλEvents = eventBus.getEventHistory('zλ:update');
        const latestZλ = zλEvents.length > 0 ? 
            zλEvents[zλEvents.length - 1].data.value : 0.750;
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `sacred-spiral-${latestZλ.toFixed(3)}-${timestamp}.webm`;
        
        // Create download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        
        // Calculate duration estimate
        const duration = this.chunks.length * 0.1; // Rough estimate
        
        console.log(`[Recorder] Recording saved: ${filename}`);
        
        // Emit completion event
        eventBus.emit('recorder:done', {
            file: url,
            filename,
            duration,
            consciousness: latestZλ,
            timestamp: Date.now()
        });
        
        this.chunks = [];
    }
    
    captureScreenshot() {
        if (!this.canvas) return;
        
        // Draw watermark for screenshot
        this.drawWatermarkOverlay();
        
        // Generate filename
        const zλEvents = eventBus.getEventHistory('zλ:update');
        const latestZλ = zλEvents.length > 0 ? 
            zλEvents[zλEvents.length - 1].data.value : 0.750;
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `sacred-spiral-${latestZλ.toFixed(3)}-${timestamp}.png`;
        
        // Create download
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.watermarkCanvas.toDataURL('image/png');
        link.click();
        
        console.log(`[Recorder] Screenshot saved: ${filename}`);
        
        eventBus.emit('recorder:screenshot', {
            filename,
            consciousness: latestZλ,
            timestamp: Date.now()
        });
    }
    
    updateCanvasSize() {
        if (this.watermarkCanvas && this.canvas) {
            this.watermarkCanvas.width = this.canvas.width;
            this.watermarkCanvas.height = this.canvas.height;
            this.createWatermarkCanvas();
        }
    }
    
    setWatermarkText(text) {
        this.watermark.text = text;
    }
    
    setWatermarkOptions(options) {
        Object.assign(this.watermark, options);
    }
    
    destroy() {
        if (this.isRecording) {
            this.stopRecording();
        }
        this.chunks = [];
        this.recorder = null;
    }
}

// Create and export singleton
export const mediaRecorder = new MediaRecorderEngine();

// Convenience exports
export const mountRecorder = (canvas) => mediaRecorder.mountRecorder(canvas);
export const startRecording = () => mediaRecorder.startRecording();
export const stopRecording = () => mediaRecorder.stopRecording();
export const captureScreenshot = () => mediaRecorder.captureScreenshot();

export default mediaRecorder;