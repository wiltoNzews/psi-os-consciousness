// EEG debug overlay for canvas HUD display
import { eventBus } from '../core/eventBus.js';

export class EEGOverlay {
    constructor() {
        this.overlayCanvas = null;
        this.overlayCtx = null;
        this.targetCanvas = null;
        this.isVisible = true;
        
        // HUD data
        this.hudData = {
            zλ: 0.750,
            alpha: 0.0,
            beta: 0.0,
            source: 'api',
            collapseCountdown: 0,
            lastUpdate: Date.now()
        };
        
        this.setupEventListeners();
        console.log('[EEG Overlay] Initialized');
    }
    
    setupEventListeners() {
        eventBus.on('zλ:update', ({ value, source }) => {
            this.hudData.zλ = value;
            this.hudData.source = source;
            this.hudData.lastUpdate = Date.now();
            this.updateOverlay();
        });
        
        eventBus.on('eeg:bands', ({ alpha, beta }) => {
            this.hudData.alpha = alpha;
            this.hudData.beta = beta;
            this.hudData.lastUpdate = Date.now();
            this.updateOverlay();
        });
        
        eventBus.on('zλ:collapse', ({ intensity }) => {
            this.triggerCollapseFlash(intensity);
        });
    }
    
    attachToCanvas(canvas) {
        this.targetCanvas = canvas;
        
        // Create overlay canvas
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = canvas.width;
        this.overlayCanvas.height = canvas.height;
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        
        // Position overlay on top of target canvas
        this.overlayCanvas.style.position = 'absolute';
        this.overlayCanvas.style.top = '0';
        this.overlayCanvas.style.left = '0';
        this.overlayCanvas.style.pointerEvents = 'none';
        this.overlayCanvas.style.zIndex = '10';
        
        // Insert overlay into DOM
        if (canvas.parentNode) {
            canvas.parentNode.style.position = 'relative';
            canvas.parentNode.appendChild(this.overlayCanvas);
        }
        
        // Start update loop
        this.startUpdateLoop();
        
        console.log('[EEG Overlay] Attached to canvas');
    }
    
    startUpdateLoop() {
        const updateHUD = () => {
            if (this.isVisible) {
                this.drawHUD();
            }
            requestAnimationFrame(updateHUD);
        };
        updateHUD();
    }
    
    drawHUD() {
        if (!this.overlayCtx) return;
        
        const ctx = this.overlayCtx;
        const canvas = this.overlayCanvas;
        
        // Clear overlay
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!this.isVisible) return;
        
        ctx.save();
        
        // Setup text style
        ctx.font = '14px "Courier New", monospace';
        ctx.textBaseline = 'top';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 2;
        
        // HUD background
        const hudX = 20;
        const hudY = 20;
        const hudWidth = 200;
        const hudHeight = 120;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(hudX - 10, hudY - 10, hudWidth + 20, hudHeight + 20);
        
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(hudX - 10, hudY - 10, hudWidth + 20, hudHeight + 20);
        
        // Title
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 16px "Courier New", monospace';
        ctx.fillText('ψOS • EEG Monitor', hudX, hudY);
        
        // Data display
        ctx.font = '12px "Courier New", monospace';
        let yOffset = hudY + 25;
        
        // Zλ consciousness level
        const zλColor = this.getZλColor(this.hudData.zλ);
        ctx.fillStyle = zλColor;
        ctx.fillText(`Zλ: ${this.hudData.zλ.toFixed(3)}`, hudX, yOffset);
        
        // Source indicator
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Source: ${this.hudData.source}`, hudX + 100, yOffset);
        yOffset += 18;
        
        // Alpha band
        ctx.fillStyle = '#00ff88';
        ctx.fillText(`α: ${this.hudData.alpha.toFixed(3)}`, hudX, yOffset);
        
        // Beta band
        ctx.fillStyle = '#ff6b6b';
        ctx.fillText(`β: ${this.hudData.beta.toFixed(3)}`, hudX + 100, yOffset);
        yOffset += 18;
        
        // Alpha/Beta ratio
        const ratio = this.hudData.beta > 0 ? this.hudData.alpha / this.hudData.beta : 0;
        ctx.fillStyle = '#ffaa00';
        ctx.fillText(`α/β: ${ratio.toFixed(2)}`, hudX, yOffset);
        yOffset += 18;
        
        // Collapse countdown
        if (this.hudData.zλ >= 0.9) {
            this.hudData.collapseCountdown = Math.max(0, 10 - (this.hudData.zλ - 0.9) * 100);
            
            ctx.fillStyle = this.hudData.collapseCountdown < 3 ? '#ff4757' : '#ffaa00';
            ctx.font = 'bold 12px "Courier New", monospace';
            ctx.fillText(`Collapse: ${this.hudData.collapseCountdown.toFixed(1)}s`, hudX, yOffset);
            
            // Pulsing effect for imminent collapse
            if (this.hudData.collapseCountdown < 2) {
                const pulse = 0.5 + Math.sin(Date.now() * 0.01) * 0.5;
                ctx.globalAlpha = pulse;
                ctx.fillStyle = '#ff4757';
                ctx.fillRect(hudX - 10, hudY - 10, hudWidth + 20, hudHeight + 20);
                ctx.globalAlpha = 1;
            }
        } else {
            ctx.fillStyle = '#666666';
            ctx.fillText('Collapse: Ready', hudX, yOffset);
        }
        
        // Connection status indicator
        const timeSinceUpdate = Date.now() - this.hudData.lastUpdate;
        const isConnected = timeSinceUpdate < 2000;
        
        ctx.fillStyle = isConnected ? '#00ff88' : '#ff4757';
        ctx.beginPath();
        ctx.arc(hudX + hudWidth - 10, hudY + 5, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Real-time visualizations
        this.drawBandGraphs(ctx, hudX, hudY + hudHeight + 10);
        
        ctx.restore();
    }
    
    drawBandGraphs(ctx, x, y) {
        const graphWidth = 180;
        const graphHeight = 30;
        
        ctx.save();
        
        // Alpha bar
        ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
        ctx.fillRect(x, y, graphWidth, 12);
        
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(x, y, graphWidth * this.hudData.alpha, 12);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Courier New", monospace';
        ctx.fillText('Alpha', x + graphWidth + 5, y + 9);
        
        // Beta bar
        ctx.fillStyle = 'rgba(255, 107, 107, 0.2)';
        ctx.fillRect(x, y + 18, graphWidth, 12);
        
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(x, y + 18, graphWidth * this.hudData.beta, 12);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Beta', x + graphWidth + 5, y + 27);
        
        ctx.restore();
    }
    
    getZλColor(value) {
        if (value >= 0.95) return '#ff00ff'; // Magenta for collapse
        if (value >= 0.9) return '#ff4757';   // Red for high
        if (value >= 0.8) return '#ffaa00';   // Orange for elevated
        if (value >= 0.7) return '#ffd700';   // Gold for normal
        return '#ffffff';                     // White for low
    }
    
    triggerCollapseFlash(intensity) {
        if (!this.overlayCtx) return;
        
        const ctx = this.overlayCtx;
        const canvas = this.overlayCanvas;
        
        // Full screen flash effect
        ctx.save();
        ctx.globalAlpha = Math.min(1, intensity / 10);
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        
        // Fade out over 1 second
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 1000);
        
        console.log(`[EEG Overlay] Collapse flash triggered (intensity: ${intensity})`);
    }
    
    updateOverlay() {
        // Triggers redraw on next frame
        // The drawing happens in the update loop
    }
    
    setVisibility(visible) {
        this.isVisible = visible;
        if (this.overlayCanvas) {
            this.overlayCanvas.style.display = visible ? 'block' : 'none';
        }
    }
    
    resize(width, height) {
        if (this.overlayCanvas) {
            this.overlayCanvas.width = width;
            this.overlayCanvas.height = height;
        }
    }
    
    destroy() {
        if (this.overlayCanvas && this.overlayCanvas.parentNode) {
            this.overlayCanvas.parentNode.removeChild(this.overlayCanvas);
        }
        this.overlayCanvas = null;
        this.overlayCtx = null;
    }
}

// Factory function
export function createEEGOverlay() {
    return new EEGOverlay();
}

export default EEGOverlay;