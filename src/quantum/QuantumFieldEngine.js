/**
 * Quantum Sacred Geometry Engine V3.0
 * GPU-Accelerated Klein-Gordon Field with Consciousness Coupling
 * Based on advanced research implementation blueprint
 */

import Decimal from 'decimal.js';

// Configure high precision for sacred geometry calculations
Decimal.set({ precision: 110, rounding: 1 });

class QuantumFieldEngine {
  constructor(options = {}) {
    this.gridSize = options.gridSize || 512;
    this.dt = options.dt || 0.05;
    this.dx = options.dx || 1.0;
    this.c2 = options.c2 || 1.0; // wave speed squared
    this.m2 = options.m2 || 0.01; // mass term squared
    
    // Consciousness coupling parameters
    this.Zλ = 0.75; // Default consciousness coupling
    this.phi = 0.5; // Integrated Information Theory Φ
    this.orchCoherence = 0.8; // Orch OR coherence metric
    
    // Field arrays (complex field: real + imaginary parts)
    this.fieldReal = new Array(this.gridSize).fill(null).map(() => new Array(this.gridSize).fill(0));
    this.fieldImag = new Array(this.gridSize).fill(null).map(() => new Array(this.gridSize).fill(0));
    this.fieldRealPrev = new Array(this.gridSize).fill(null).map(() => new Array(this.gridSize).fill(0));
    this.fieldImagPrev = new Array(this.gridSize).fill(null).map(() => new Array(this.gridSize).fill(0));
    
    // GPU context and kernels
    this.gpu = null;
    this.updateKernelReal = null;
    this.updateKernelImag = null;
    this.initGPU();
    
    // Sacred geometry constants with high precision
    this.initSacredConstants();
    
    // Quantum collapse probability cache
    this.collapseField = new Array(this.gridSize).fill(null).map(() => new Array(this.gridSize).fill(0));
    
    // Performance metrics
    this.frameTime = 0;
    this.frameCount = 0;
    this.energy = 0;
    
    // Initialize field with quantum superposition state
    this.initializeQuantumField();
  }

  initSacredConstants() {
    // High precision sacred geometry constants
    this.constants = {
      phi: new Decimal(1).plus(new Decimal(5).sqrt()).div(2), // Golden ratio φ
      pi: new Decimal(Math.PI), // Will be computed to higher precision if needed
      e: new Decimal(Math.E),
      sqrt2: new Decimal(2).sqrt(),
      sqrt3: new Decimal(3).sqrt(),
      sqrt5: new Decimal(5).sqrt()
    };
    
    console.log(`[Quantum Engine] φ (golden ratio) = ${this.constants.phi.toFixed(50)}`);
  }

  async initGPU() {
    try {
      // Try WebGPU first, fallback to WebGL-based computation
      if ('gpu' in navigator) {
        await this.initWebGPU();
      } else {
        this.initWebGLCompute();
      }
    } catch (error) {
      console.warn('[Quantum Engine] GPU initialization failed, using CPU fallback:', error.message);
      this.useCPUFallback = true;
    }
  }

  async initWebGPU() {
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();
    
    this.gpuDevice = device;
    console.log('[Quantum Engine] WebGPU initialized successfully');
    
    // Create compute shaders for field update
    this.createWebGPUShaders();
  }

  initWebGLCompute() {
    // Create WebGL2 context for compute-style operations
    const canvas = document.createElement('canvas');
    canvas.width = this.gridSize;
    canvas.height = this.gridSize;
    
    this.gl = canvas.getContext('webgl2', {
      antialias: false,
      depth: false,
      stencil: false,
      alpha: false,
      preserveDrawingBuffer: false
    });
    
    if (!this.gl) {
      throw new Error('WebGL2 not supported');
    }
    
    console.log('[Quantum Engine] WebGL2 compute initialized');
    this.createWebGLShaders();
  }

  createWebGPUShaders() {
    // Klein-Gordon field update compute shader
    const shaderCode = `
      @group(0) @binding(0) var<storage, read> fieldReal: array<f32>;
      @group(0) @binding(1) var<storage, read> fieldImag: array<f32>;
      @group(0) @binding(2) var<storage, read> fieldRealPrev: array<f32>;
      @group(0) @binding(3) var<storage, read> fieldImagPrev: array<f32>;
      @group(0) @binding(4) var<storage, read_write> fieldRealNext: array<f32>;
      @group(0) @binding(5) var<storage, read_write> fieldImagNext: array<f32>;
      @group(0) @binding(6) var<uniform> params: Parameters;
      
      struct Parameters {
        gridSize: u32,
        dt: f32,
        dx: f32,
        c2: f32,
        m2: f32,
        Zλ: f32,
        collapseProb: f32,
        time: f32
      };
      
      @compute @workgroup_size(16, 16)
      fn updateField(@builtin(global_invocation_id) id: vec3<u32>) {
        let x = id.x;
        let y = id.y;
        let gridSize = params.gridSize;
        
        if (x >= gridSize || y >= gridSize) { return; }
        
        let idx = y * gridSize + x;
        
        // Periodic boundary conditions
        let xm1 = select(x - 1u, gridSize - 1u, x == 0u);
        let xp1 = select(x + 1u, 0u, x == gridSize - 1u);
        let ym1 = select(y - 1u, gridSize - 1u, y == 0u);
        let yp1 = select(y + 1u, 0u, y == gridSize - 1u);
        
        // 5-point Laplacian stencil
        let center = fieldReal[idx];
        let up = fieldReal[ym1 * gridSize + x];
        let down = fieldReal[yp1 * gridSize + x];
        let left = fieldReal[y * gridSize + xm1];
        let right = fieldReal[y * gridSize + xp1];
        
        let laplacian = (up + down + left + right - 4.0 * center) / (params.dx * params.dx);
        
        // Consciousness-modulated collapse
        let random = fract(sin(dot(vec2<f32>(f32(x), f32(y)) + params.time, vec2<f32>(12.9898, 78.233))) * 43758.5453);
        let collapseThreshold = params.collapseProb * (1.0 - params.Zλ);
        let collapseFactor = select(1.0, 0.0, random < collapseThreshold);
        
        // Klein-Gordon evolution: ψ_new = 2ψ - ψ_prev + c²dt²(∇²ψ - m²ψ)
        let evolution = params.c2 * params.dt * params.dt * (laplacian - params.m2 * center);
        let newValue = collapseFactor * (2.0 * center - fieldRealPrev[idx] + evolution);
        
        fieldRealNext[idx] = newValue;
        
        // Similar computation for imaginary part
        let centerImag = fieldImag[idx];
        let upImag = fieldImag[ym1 * gridSize + x];
        let downImag = fieldImag[yp1 * gridSize + x];
        let leftImag = fieldImag[y * gridSize + xm1];
        let rightImag = fieldImag[y * gridSize + xp1];
        
        let laplacianImag = (upImag + downImag + leftImag + rightImag - 4.0 * centerImag) / (params.dx * params.dx);
        let evolutionImag = params.c2 * params.dt * params.dt * (laplacianImag - params.m2 * centerImag);
        let newValueImag = collapseFactor * (2.0 * centerImag - fieldImagPrev[idx] + evolutionImag);
        
        fieldImagNext[idx] = newValueImag;
      }
    `;
    
    this.computeModule = this.gpuDevice.createShaderModule({ code: shaderCode });
  }

  createWebGLShaders() {
    // Fragment shader for field update using WebGL2
    const fragmentShader = `#version 300 es
      precision highp float;
      
      uniform sampler2D u_fieldReal;
      uniform sampler2D u_fieldImag;
      uniform sampler2D u_fieldRealPrev;
      uniform sampler2D u_fieldImagPrev;
      uniform float u_dt;
      uniform float u_dx;
      uniform float u_c2;
      uniform float u_m2;
      uniform float u_Zλ;
      uniform float u_time;
      uniform float u_gridSize;
      
      out vec4 fragColor;
      
      // High-quality random function
      float random(vec2 st, float time) {
        return fract(sin(dot(st.xy + time, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      void main() {
        vec2 texCoord = gl_FragCoord.xy / u_gridSize;
        vec2 onePixel = vec2(1.0) / u_gridSize;
        
        // Sample field values
        float center = texture(u_fieldReal, texCoord).r;
        float up = texture(u_fieldReal, texCoord + vec2(0.0, onePixel.y)).r;
        float down = texture(u_fieldReal, texCoord - vec2(0.0, onePixel.y)).r;
        float left = texture(u_fieldReal, texCoord - vec2(onePixel.x, 0.0)).r;
        float right = texture(u_fieldReal, texCoord + vec2(onePixel.x, 0.0)).r;
        float prev = texture(u_fieldRealPrev, texCoord).r;
        
        // Laplacian
        float laplacian = (up + down + left + right - 4.0 * center) / (u_dx * u_dx);
        
        // Consciousness-modulated collapse
        float rnd = random(gl_FragCoord.xy, u_time);
        float collapseProb = 0.001 * (1.0 - u_Zλ);
        float collapseFactor = rnd < collapseProb ? 0.0 : 1.0;
        
        // Klein-Gordon update
        float evolution = u_c2 * u_dt * u_dt * (laplacian - u_m2 * center);
        float newValue = collapseFactor * (2.0 * center - prev + evolution);
        
        fragColor = vec4(newValue, 0.0, 0.0, 1.0);
      }
    `;
    
    // Create and compile shaders
    this.compileWebGLProgram(fragmentShader);
  }

  compileWebGLProgram(fragmentShaderSource) {
    const vertexShaderSource = `#version 300 es
      in vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, vertexShaderSource);
    this.gl.compileShader(vertexShader);
    
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, fragmentShaderSource);
    this.gl.compileShader(fragmentShader);
    
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('[Quantum Engine] WebGL program link error:', this.gl.getProgramInfoLog(this.program));
    }
  }

  initializeQuantumField() {
    // Initialize with quantum superposition - multiple Gaussian wave packets
    const centerX = this.gridSize / 2;
    const centerY = this.gridSize / 2;
    const sigma = this.gridSize / 8;
    
    // Sacred geometry initialization using golden ratio
    const phi = parseFloat(this.constants.phi.toString());
    
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const r = Math.sqrt(dx * dx + dy * dy);
        const theta = Math.atan2(dy, dx);
        
        // Multiple interfering wave packets with golden ratio spacing
        let real = 0;
        let imag = 0;
        
        for (let n = 0; n < 5; n++) {
          const angle = theta + n * 2 * Math.PI / phi;
          const amplitude = Math.exp(-((r - n * 20) ** 2) / (2 * sigma * sigma));
          const phase = n * Math.PI / 3;
          
          real += amplitude * Math.cos(phase + angle);
          imag += amplitude * Math.sin(phase + angle);
        }
        
        this.fieldReal[y][x] = real * 0.1;
        this.fieldImag[y][x] = imag * 0.1;
        this.fieldRealPrev[y][x] = real * 0.1;
        this.fieldImagPrev[y][x] = imag * 0.1;
      }
    }
    
    console.log('[Quantum Engine] Quantum field initialized with sacred geometry superposition');
  }

  updateConsciousnessMetrics(eegData) {
    if (!eegData) return;
    
    const { alpha, beta, theta, gamma, delta } = eegData;
    
    // Enhanced Zλ calculation from research document
    const α = this.averageArray(alpha);
    const β = this.averageArray(beta);
    const θ = this.averageArray(theta);
    const γ = this.averageArray(gamma);
    const δ = this.averageArray(delta);
    
    // Consciousness coupling parameter
    this.Zλ = Math.min(Math.max((α + θ) / (β + γ + 0.001), 0), 1);
    
    // Integrated Information Φ approximation
    const bandEntropy = this.calculateBandEntropy([α, β, θ, γ, δ]);
    this.phi = Math.max(0, 1 - bandEntropy / Math.log2(5));
    
    // Orch OR coherence from gamma stability
    const gammaVariance = this.calculateVariance(gamma);
    this.orchCoherence = 1 / (1 + Math.sqrt(gammaVariance));
    
    console.log(`[Quantum Engine] Consciousness updated: Zλ=${this.Zλ.toFixed(3)}, Φ=${this.phi.toFixed(3)}, Coherence=${this.orchCoherence.toFixed(3)}`);
  }

  averageArray(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  calculateBandEntropy(bands) {
    const total = bands.reduce((sum, val) => sum + val, 0);
    const probs = bands.map(val => val / total);
    return -probs.reduce((entropy, p) => entropy + (p > 0 ? p * Math.log2(p) : 0), 0);
  }

  calculateVariance(arr) {
    const mean = this.averageArray(arr);
    return arr.reduce((variance, val) => variance + Math.pow(val - mean, 2), 0) / arr.length;
  }

  updateField() {
    const startTime = performance.now();
    
    if (this.gpuDevice) {
      this.updateFieldWebGPU();
    } else if (this.gl) {
      this.updateFieldWebGL();
    } else {
      this.updateFieldCPU();
    }
    
    // Swap field arrays
    [this.fieldReal, this.fieldRealPrev] = [this.fieldRealPrev, this.fieldReal];
    [this.fieldImag, this.fieldImagPrev] = [this.fieldImagPrev, this.fieldImag];
    
    this.frameTime = performance.now() - startTime;
    this.frameCount++;
    
    // Calculate field energy for validation
    if (this.frameCount % 100 === 0) {
      this.calculateFieldEnergy();
    }
  }

  updateFieldWebGPU() {
    // WebGPU compute shader execution
    const commandEncoder = this.gpuDevice.createCommandEncoder();
    const computePass = commandEncoder.beginComputePass();
    
    computePass.setPipeline(this.computePipeline);
    computePass.setBindGroup(0, this.bindGroup);
    computePass.dispatchWorkgroups(
      Math.ceil(this.gridSize / 16),
      Math.ceil(this.gridSize / 16)
    );
    computePass.end();
    
    this.gpuDevice.queue.submit([commandEncoder.finish()]);
  }

  updateFieldWebGL() {
    // WebGL-based compute simulation
    this.gl.useProgram(this.program);
    
    // Set uniforms
    const uDt = this.gl.getUniformLocation(this.program, 'u_dt');
    const uDx = this.gl.getUniformLocation(this.program, 'u_dx');
    const uC2 = this.gl.getUniformLocation(this.program, 'u_c2');
    const uM2 = this.gl.getUniformLocation(this.program, 'u_m2');
    const uZλ = this.gl.getUniformLocation(this.program, 'u_Zλ');
    const uTime = this.gl.getUniformLocation(this.program, 'u_time');
    
    this.gl.uniform1f(uDt, this.dt);
    this.gl.uniform1f(uDx, this.dx);
    this.gl.uniform1f(uC2, this.c2);
    this.gl.uniform1f(uM2, this.m2);
    this.gl.uniform1f(uZλ, this.Zλ);
    this.gl.uniform1f(uTime, performance.now() / 1000);
    
    // Render to texture (field update)
    this.gl.viewport(0, 0, this.gridSize, this.gridSize);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  updateFieldCPU() {
    // CPU fallback implementation
    const newReal = new Array(this.gridSize).fill(null).map(() => new Array(this.gridSize).fill(0));
    const newImag = new Array(this.gridSize).fill(null).map(() => new Array(this.gridSize).fill(0));
    
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const xm1 = (x - 1 + this.gridSize) % this.gridSize;
        const xp1 = (x + 1) % this.gridSize;
        const ym1 = (y - 1 + this.gridSize) % this.gridSize;
        const yp1 = (y + 1) % this.gridSize;
        
        // Laplacian
        const laplacianReal = (
          this.fieldReal[ym1][x] + this.fieldReal[yp1][x] +
          this.fieldReal[y][xm1] + this.fieldReal[y][xp1] -
          4 * this.fieldReal[y][x]
        ) / (this.dx * this.dx);
        
        const laplacianImag = (
          this.fieldImag[ym1][x] + this.fieldImag[yp1][x] +
          this.fieldImag[y][xm1] + this.fieldImag[y][xp1] -
          4 * this.fieldImag[y][x]
        ) / (this.dx * this.dx);
        
        // Consciousness-modulated collapse
        const random = Math.random();
        const collapseProb = 0.001 * (1.0 - this.Zλ);
        const collapseFactor = random < collapseProb ? 0.0 : 1.0;
        
        // Klein-Gordon evolution
        const dtSq = this.dt * this.dt;
        const evolutionReal = this.c2 * dtSq * (laplacianReal - this.m2 * this.fieldReal[y][x]);
        const evolutionImag = this.c2 * dtSq * (laplacianImag - this.m2 * this.fieldImag[y][x]);
        
        newReal[y][x] = collapseFactor * (
          2 * this.fieldReal[y][x] - this.fieldRealPrev[y][x] + evolutionReal
        );
        newImag[y][x] = collapseFactor * (
          2 * this.fieldImag[y][x] - this.fieldImagPrev[y][x] + evolutionImag
        );
      }
    }
    
    // Update field arrays
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        this.fieldReal[y][x] = newReal[y][x];
        this.fieldImag[y][x] = newImag[y][x];
      }
    }
  }

  calculateFieldEnergy() {
    let totalEnergy = 0;
    
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const real = this.fieldReal[y][x];
        const imag = this.fieldImag[y][x];
        const prevReal = this.fieldRealPrev[y][x];
        const prevImag = this.fieldImagPrev[y][x];
        
        // Kinetic energy (time derivative term)
        const kineticReal = (real - prevReal) / this.dt;
        const kineticImag = (imag - prevImag) / this.dt;
        const kinetic = 0.5 * (kineticReal * kineticReal + kineticImag * kineticImag);
        
        // Potential energy (spatial gradient + mass term)
        const potential = 0.5 * this.m2 * (real * real + imag * imag);
        
        totalEnergy += kinetic + potential;
      }
    }
    
    this.energy = totalEnergy;
    
    if (this.frameCount % 1000 === 0) {
      console.log(`[Quantum Engine] Frame ${this.frameCount}: Energy=${this.energy.toExponential(3)}, FPS=${(1000/this.frameTime).toFixed(1)}`);
    }
  }

  getFieldVisualization() {
    // Generate visualization data for rendering
    const visualization = {
      fieldIntensity: new Array(this.gridSize).fill(null).map(() => new Array(this.gridSize).fill(0)),
      fieldPhase: new Array(this.gridSize).fill(null).map(() => new Array(this.gridSize).fill(0)),
      maxIntensity: 0
    };
    
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const real = this.fieldReal[y][x];
        const imag = this.fieldImag[y][x];
        const intensity = real * real + imag * imag;
        const phase = Math.atan2(imag, real);
        
        visualization.fieldIntensity[y][x] = intensity;
        visualization.fieldPhase[y][x] = phase;
        
        if (intensity > visualization.maxIntensity) {
          visualization.maxIntensity = intensity;
        }
      }
    }
    
    return visualization;
  }

  getMetrics() {
    return {
      Zλ: this.Zλ,
      phi: this.phi,
      orchCoherence: this.orchCoherence,
      energy: this.energy,
      frameTime: this.frameTime,
      frameCount: this.frameCount,
      gridSize: this.gridSize
    };
  }
}

export default QuantumFieldEngine;