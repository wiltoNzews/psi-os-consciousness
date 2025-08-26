// Golden spiral renderer with Three.js and consciousness coupling
import { eventBus } from '../core/eventBus.js';
import * as THREE from 'three';

export class SpiralRenderer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.spiralLine = null;
        this.targetElement = null;
        
        // Spiral parameters
        this.params = {
            φ: (1 + Math.sqrt(5)) / 2, // Golden ratio
            morphPercent: 0.0,
            consciousness: 0.750,
            autoRotate: true,
            glowEnabled: false
        };
        
        // EEG overlay
        this.eegOverlay = null;
        
        this.setupEventListeners();
        console.log('[Spiral] Renderer initialized');
    }
    
    setupEventListeners() {
        eventBus.on('ui:morph', ({ percent }) => {
            this.params.morphPercent = percent;
            this.updateSpiralMorph();
        });
        
        eventBus.on('zλ:update', ({ value }) => {
            this.params.consciousness = value;
            this.updateConsciousnessResponse();
        });
        
        eventBus.on('zλ:collapse', () => {
            this.triggerCollapseEffect();
        });
        
        eventBus.on('ui:mode-toggle', ({ mode, enabled }) => {
            if (mode === 'glow') {
                this.params.glowEnabled = enabled;
                this.updateGlowEffect();
            }
        });
    }
    
    mountSpiral(targetEl) {
        this.targetElement = targetEl;
        
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            45, 
            targetEl.clientWidth / targetEl.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(targetEl.clientWidth, targetEl.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        targetEl.appendChild(this.renderer.domElement);
        
        // Create golden spiral geometry
        this.createSpiralGeometry();
        
        // Start render loop
        this.startRenderLoop();
        
        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Attach EEG overlay
        this.attachEEGOverlay();
        
        console.log('[Spiral] Mounted to DOM element');
        return this.renderer.domElement;
    }
    
    createSpiralGeometry() {
        const points = [];
        const φ = this.params.φ;
        
        // Generate Fibonacci spiral points
        for (let i = 0; i < 200; i++) {
            const t = i * 0.1;
            const r = 0.02 * Math.pow(φ, t / Math.PI);
            const θ = t;
            
            const x = r * Math.cos(θ);
            const y = r * Math.sin(θ);
            const z = 0;
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        // Create geometry from points
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Create material with consciousness-responsive color
        const material = new THREE.LineBasicMaterial({
            color: this.getConsciousnessColor(),
            linewidth: 2
        });
        
        // Create line object
        this.spiralLine = new THREE.Line(geometry, material);
        this.scene.add(this.spiralLine);
        
        // Add glow effect setup
        this.setupGlowEffect();
    }
    
    setupGlowEffect() {
        // Create glow material for bloom effect
        const glowGeometry = this.spiralLine.geometry.clone();
        const glowMaterial = new THREE.LineBasicMaterial({
            color: this.getConsciousnessColor(),
            transparent: true,
            opacity: 0.3,
            linewidth: 6
        });
        
        this.glowLine = new THREE.Line(glowGeometry, glowMaterial);
        this.glowLine.visible = this.params.glowEnabled;
        this.scene.add(this.glowLine);
    }
    
    getConsciousnessColor() {
        // Map consciousness level to HSL color
        const hue = 0.55 + (this.params.consciousness * 0.15); // Cyan to gold
        const saturation = 0.8 + (this.params.consciousness * 0.2);
        const lightness = 0.4 + (this.params.consciousness * 0.4);
        
        return new THREE.Color().setHSL(hue, saturation, lightness);
    }
    
    updateSpiralMorph() {
        if (!this.spiralLine) return;
        
        // Apply morphing transformation
        const morphScale = 1 + (this.params.morphPercent * 0.5);
        const morphRotation = this.params.morphPercent * Math.PI * 2;
        
        this.spiralLine.scale.setScalar(morphScale);
        this.spiralLine.rotation.z = morphRotation;
        
        if (this.glowLine) {
            this.glowLine.scale.setScalar(morphScale);
            this.glowLine.rotation.z = morphRotation;
        }
        
        // Emit spiral update event
        eventBus.emit('spiral:update', {
            morphPercent: this.params.morphPercent,
            scale: morphScale,
            rotation: morphRotation
        });
    }
    
    updateConsciousnessResponse() {
        if (!this.spiralLine) return;
        
        const color = this.getConsciousnessColor();
        this.spiralLine.material.color.copy(color);
        
        if (this.glowLine) {
            this.glowLine.material.color.copy(color);
        }
        
        // Scale based on consciousness level
        const consciousnessScale = 0.8 + (this.params.consciousness * 0.4);
        this.spiralLine.scale.multiplyScalar(consciousnessScale);
        
        if (this.glowLine) {
            this.glowLine.scale.multiplyScalar(consciousnessScale);
        }
    }
    
    updateGlowEffect() {
        if (this.glowLine) {
            this.glowLine.visible = this.params.glowEnabled;
        }
    }
    
    triggerCollapseEffect() {
        if (!this.spiralLine) return;
        
        // Temporary color change for collapse
        const originalColor = this.spiralLine.material.color.clone();
        this.spiralLine.material.color.setHex(0xff00ff); // Magenta flash
        
        // Restore original color after effect
        setTimeout(() => {
            if (this.spiralLine) {
                this.spiralLine.material.color.copy(originalColor);
            }
        }, 1000);
        
        console.log('[Spiral] Field collapse effect triggered');
    }
    
    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Auto-rotation
            if (this.params.autoRotate && this.spiralLine) {
                this.spiralLine.rotation.z += 0.01;
                
                if (this.glowLine) {
                    this.glowLine.rotation.z += 0.01;
                }
            }
            
            // Render scene
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
            
            // Emit performance data
            eventBus.emit('performance:fps', {
                fps: 60, // Approximate
                frameTime: Date.now()
            });
        };
        
        animate();
    }
    
    handleResize() {
        if (!this.targetElement || !this.renderer || !this.camera) return;
        
        const width = this.targetElement.clientWidth;
        const height = this.targetElement.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    // Public API methods
    setMorphPercent(percent) {
        this.params.morphPercent = Math.max(0, Math.min(1, percent));
        this.updateSpiralMorph();
    }
    
    setAutoRotate(enabled) {
        this.params.autoRotate = enabled;
    }
    
    setGlow(enabled) {
        this.params.glowEnabled = enabled;
        this.updateGlowEffect();
    }
    
    getCanvas() {
        return this.renderer ? this.renderer.domElement : null;
    }
    
    destroy() {
        if (this.renderer) {
            this.targetElement.removeChild(this.renderer.domElement);
            this.renderer.dispose();
        }
        
        if (this.spiralLine) {
            this.spiralLine.geometry.dispose();
            this.spiralLine.material.dispose();
        }
        
        if (this.glowLine) {
            this.glowLine.geometry.dispose();
            this.glowLine.material.dispose();
        }
        
        window.removeEventListener('resize', this.handleResize);
        
        if (this.eegOverlay) {
            this.eegOverlay.destroy();
        }
    }
    
    async attachEEGOverlay() {
        try {
            const { createEEGOverlay } = await import('./eegOverlay.js');
            this.eegOverlay = createEEGOverlay();
            this.eegOverlay.attachToCanvas(this.renderer.domElement);
            console.log('[Spiral] EEG overlay attached');
        } catch (error) {
            console.log('[Spiral] EEG overlay not available:', error.message);
        }
    }
}

// Factory function for mounting
export function mountSpiral(targetEl) {
    const renderer = new SpiralRenderer();
    return renderer.mountSpiral(targetEl);
}

export default SpiralRenderer;