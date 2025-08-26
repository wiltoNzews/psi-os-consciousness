// Canvas capture and WebM/MP4 recording with ψOS overlay
import { stateBus } from '@shared/state-bus.js';

export class CaptureEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        
        // Watermark canvas for overlay
        this.watermarkCanvas = document.createElement('canvas');
        this.watermarkCtx = this.watermarkCanvas.getContext('2d');
        
        // Recording parameters
        this.options = {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 2500000,
            frameRate: 60,
            watermarkText: 'ψOS • Sacred Spiral • WiltonOS v2',
            includeTimestamp: true
        };
        
        this.setupStateSubscriptions();
        this.initializeWatermarkCanvas();
        
        console.log('[Capture] Engine initialized with state bus integration');
    }
    
    setupStateSubscriptions() {
        // Listen for recording state changes
        stateBus.subscribe('recording:started', () => {
            this.onRecordingStarted();
        });
        
        stateBus.subscribe('recording:stopped', () => {
            this.onRecordingStopped();
        });
        
        // Listen for consciousness updates to update watermark
        stateBus.subscribe('consciousness:update', (event) => {
            const { current } = event.detail;
            this.updateWatermarkData(current);
        });
    }
    
    initializeWatermarkCanvas() {
        // Match main canvas size
        this.watermarkCanvas.width = this.canvas.width;
        this.watermarkCanvas.height = this.canvas.height;
        
        // Setup watermark styling
        this.watermarkCtx.font = '16px "Courier New", monospace';
        this.watermarkCtx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        this.watermarkCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.watermarkCtx.lineWidth = 2;
        this.watermarkCtx.textBaseline = 'bottom';
    }
    
    updateWatermarkData(consciousness) {
        // Update watermark with current consciousness data
        const timestamp = new Date().toLocaleTimeString();
        const zLambda = consciousness.zlambda.toFixed(3);
        const status = consciousness.status.toUpperCase();
        
        this.watermarkData = {
            main: this.options.watermarkText,
            consciousness: `Zλ ${zLambda} • ${status}`,
            timestamp: timestamp,
            divine: consciousness.divine
        };
    }
    
    drawWatermarkOverlay() {
        const ctx = this.watermarkCtx;
        const canvas = this.watermarkCanvas;
        
        // Clear watermark canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Copy main canvas content
        ctx.drawImage(this.canvas, 0, 0);
        
        if (!this.watermarkData) return;
        
        ctx.save();
        
        // Main watermark (bottom-right)
        ctx.textAlign = 'right';
        const margin = 25;
        let y = canvas.height - margin;
        
        // Main ψOS branding
        ctx.font = '18px "Courier New", monospace';
        ctx.fillStyle = this.watermarkData.divine ? 
            'rgba(255, 215, 0, 1.0)' : 'rgba(255, 215, 0, 0.8)';
        
        if (this.watermarkData.divine) {
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 8;
        }
        
        ctx.strokeText(this.watermarkData.main, canvas.width - margin, y);
        ctx.fillText(this.watermarkData.main, canvas.width - margin, y);
        
        // Consciousness data
        y -= 25;
        ctx.font = '14px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 0;
        
        ctx.strokeText(this.watermarkData.consciousness, canvas.width - margin, y);
        ctx.fillText(this.watermarkData.consciousness, canvas.width - margin, y);
        
        // Timestamp
        if (this.options.includeTimestamp) {
            y -= 20;
            ctx.font = '12px "Courier New", monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            
            ctx.fillText(this.watermarkData.timestamp, canvas.width - margin, y);
        }
        
        // Recording indicator (top-left when recording)
        if (this.isRecording) {
            ctx.textAlign = 'left';
            ctx.font = 'bold 16px "Courier New", monospace';
            ctx.fillStyle = '#ff4757';
            ctx.shadowColor = '#ff4757';
            ctx.shadowBlur = 6;
            
            const recordText = '● REC';
            ctx.fillText(recordText, margin, margin + 20);
            
            // Pulsing effect
            const pulseAlpha = 0.7 + Math.sin(Date.now() * 0.008) * 0.3;
            ctx.fillStyle = `rgba(255, 71, 87, ${pulseAlpha})`;
            ctx.fillText(recordText, margin, margin + 20);
        }
        
        ctx.restore();
    }
    
    async startRecording() {
        if (this.isRecording) return false;
        
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
                
                // Add audio tracks to video stream
                audioStream.getAudioTracks().forEach(track => {
                    compositeStream.addTrack(track);
                });
                
                console.log('[Capture] Audio track added to recording');
            } catch (audioError) {
                console.log('[Capture] Recording video-only (no audio available)');
            }
            
            // Create MediaRecorder
            this.mediaRecorder = new MediaRecorder(compositeStream, {
                mimeType: this.options.mimeType,
                videoBitsPerSecond: this.options.videoBitsPerSecond
            });
            
            this.recordedChunks = [];
            
            // Setup event handlers
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.handleRecordingComplete();
            };
            
            this.mediaRecorder.onerror = (event) => {
                console.error('[Capture] Recording error:', event.error);
                this.isRecording = false;
                stateBus.updateRecording({ isRecording: false });
            };
            
            // Start recording
            this.mediaRecorder.start();
            this.isRecording = true;
            
            // Start watermark update loop
            this.startWatermarkLoop();
            
            // Update state
            stateBus.updateRecording({ 
                isRecording: true, 
                duration: 0,
                startTime: Date.now()
            });
            
            console.log('[Capture] Recording started with watermark overlay');
            return true;
            
        } catch (error) {
            console.error('[Capture] Failed to start recording:', error);
            this.isRecording = false;
            return false;
        }
    }
    
    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) return false;
        
        this.mediaRecorder.stop();
        this.isRecording = false;
        
        // Stop audio tracks
        this.mediaRecorder.stream.getTracks().forEach(track => {
            if (track.kind === 'audio') {
                track.stop();
            }
        });
        
        // Update state
        stateBus.updateRecording({ isRecording: false });
        
        console.log('[Capture] Recording stopped');
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
        if (this.recordedChunks.length === 0) {
            console.error('[Capture] No data recorded');
            return;
        }
        
        // Create blob from recorded chunks
        const blob = new Blob(this.recordedChunks, { 
            type: this.options.mimeType 
        });
        
        // Generate filename with consciousness data
        const consciousness = stateBus.getConsciousness();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const zLambda = consciousness.zlambda.toFixed(3);
        const filename = `sacred-spiral-${zLambda}-${timestamp}.webm`;
        
        // Trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        // Cleanup
        URL.revokeObjectURL(url);
        
        // Calculate recording duration
        const recordingState = stateBus.getRecording();
        const duration = Date.now() - (recordingState.startTime || Date.now());
        
        console.log(`[Capture] Recording saved: ${filename} (${(duration/1000).toFixed(1)}s)`);
        
        // Emit completion event
        stateBus.emit('capture:recording-complete', {
            filename,
            duration,
            blob,
            consciousness: consciousness.zlambda,
            status: consciousness.status
        });
        
        // Update final state
        stateBus.updateRecording({ 
            duration: duration,
            lastRecording: filename
        });
    }
    
    captureScreenshot() {
        // Draw watermark overlay for screenshot
        this.drawWatermarkOverlay();
        
        // Generate filename
        const consciousness = stateBus.getConsciousness();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const zLambda = consciousness.zlambda.toFixed(3);
        const filename = `sacred-spiral-${zLambda}-${timestamp}.png`;
        
        // Create download link
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.watermarkCanvas.toDataURL('image/png');
        link.click();
        
        console.log(`[Capture] Screenshot saved: ${filename}`);
        
        // Emit screenshot event
        stateBus.emit('capture:screenshot-complete', {
            filename,
            consciousness: consciousness.zlambda,
            status: consciousness.status
        });
    }
    
    onRecordingStarted() {
        // Initialize watermark data when recording starts
        const consciousness = stateBus.getConsciousness();
        this.updateWatermarkData(consciousness);
    }
    
    onRecordingStopped() {
        // Clean up when recording stops
        this.isRecording = false;
    }
    
    updateCanvasSize() {
        // Update watermark canvas to match main canvas
        this.watermarkCanvas.width = this.canvas.width;
        this.watermarkCanvas.height = this.canvas.height;
        this.initializeWatermarkCanvas();
    }
    
    // Export format conversion (future feature)
    async convertToMP4(webmBlob) {
        // Placeholder for FFmpeg.wasm integration
        console.log('[Capture] MP4 conversion not yet implemented');
        return webmBlob;
    }
    
    // Get recording capabilities
    getCapabilities() {
        return {
            mimeTypes: [
                'video/webm;codecs=vp9',
                'video/webm;codecs=vp8',
                'video/webm'
            ].filter(type => MediaRecorder.isTypeSupported(type)),
            maxBitrate: 10000000,
            frameRates: [30, 60]
        };
    }
    
    destroy() {
        if (this.isRecording) {
            this.stopRecording();
        }
        
        this.recordedChunks = [];
        this.mediaRecorder = null;
    }
}

export default CaptureEngine;