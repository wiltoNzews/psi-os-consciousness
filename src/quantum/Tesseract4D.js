/**
 * 4D Tesseract Renderer with Double Quaternion Rotation
 * Consciousness-modulated metric projection to 3D
 */

class Tesseract4D {
  constructor() {
    // Define 16 vertices of a hypercube centered at origin with side length 2
    this.vertices4D = [
      [-1,-1,-1,-1], [-1,-1,-1, 1], [-1,-1, 1,-1], [-1,-1, 1, 1],
      [-1, 1,-1,-1], [-1, 1,-1, 1], [-1, 1, 1,-1], [-1, 1, 1, 1],
      [ 1,-1,-1,-1], [ 1,-1,-1, 1], [ 1,-1, 1,-1], [ 1,-1, 1, 1],
      [ 1, 1,-1,-1], [ 1, 1,-1, 1], [ 1, 1, 1,-1], [ 1, 1, 1, 1]
    ];
    
    // Define edges (which vertices connect)
    this.edges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        // Two vertices are connected if they differ in exactly one coordinate
        let differences = 0;
        for (let k = 0; k < 4; k++) {
          if (this.vertices4D[i][k] !== this.vertices4D[j][k]) {
            differences++;
          }
        }
        if (differences === 1) {
          this.edges.push([i, j]);
        }
      }
    }
    
    // Double quaternion rotation state
    this.q1 = { w: 1, x: 0, y: 0, z: 0 }; // First rotation quaternion
    this.q2 = { w: 1, x: 0, y: 0, z: 0 }; // Second rotation quaternion
    
    this.rotationSpeed = 0.02;
    this.projectionDistance = 4.0;
    
    // Projected 3D vertices for rendering
    this.vertices3D = new Array(16).fill(null).map(() => [0, 0, 0]);
    
    console.log(`[Tesseract4D] Initialized with ${this.edges.length} edges`);
  }

  // Quaternion multiplication
  _quatMultiply(q1, q2) {
    return {
      w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
      x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
      y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
      z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w
    };
  }

  // Normalize quaternion
  _quatNormalize(q) {
    const norm = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
    return {
      w: q.w / norm,
      x: q.x / norm,
      y: q.y / norm,
      z: q.z / norm
    };
  }

  // Create rotation quaternion from axis and angle
  _quatFromAxisAngle(axis, angle) {
    const halfAngle = angle / 2;
    const sinHalf = Math.sin(halfAngle);
    return {
      w: Math.cos(halfAngle),
      x: axis[0] * sinHalf,
      y: axis[1] * sinHalf,
      z: axis[2] * sinHalf
    };
  }

  // Apply double quaternion rotation to 4D point
  _rotatePoint4D(point) {
    // Simplified double rotation approach
    // First rotation in XY-ZW planes
    const [x, y, z, w] = point;
    
    // Apply first quaternion to (x,y,z) subspace
    const v1 = { w: 0, x: x, y: y, z: z };
    const rotated1 = this._quatMultiply(this._quatMultiply(this.q1, v1), { w: this.q1.w, x: -this.q1.x, y: -this.q1.y, z: -this.q1.z });
    
    // Apply second quaternion to (rotated_z, w) and other components
    const v2 = { w: 0, x: rotated1.z, y: w, z: 0 };
    const rotated2 = this._quatMultiply(this._quatMultiply(this.q2, v2), { w: this.q2.w, x: -this.q2.x, y: -this.q2.y, z: -this.q2.z });
    
    return [rotated1.x, rotated1.y, rotated2.x, rotated2.y];
  }

  // Update rotation step
  rotateStep() {
    // Create incremental rotations
    const axis1 = [0, 0, 1]; // Z-axis rotation
    const axis2 = [1, 0, 0]; // X-axis rotation
    
    const dq1 = this._quatFromAxisAngle(axis1, this.rotationSpeed);
    const dq2 = this._quatFromAxisAngle(axis2, this.rotationSpeed * 0.7); // Slightly different speed
    
    // Update quaternions
    this.q1 = this._quatNormalize(this._quatMultiply(this.q1, dq1));
    this.q2 = this._quatNormalize(this._quatMultiply(this.q2, dq2));
  }

  // Project to 3D with consciousness-modulated metric
  projectTo3D(conscMetric = 0.5) {
    // Consciousness affects the w-projection factor
    const wFactor = 1 + (1 - conscMetric) * 2.0;
    
    for (let i = 0; i < 16; i++) {
      const rotated4D = this._rotatePoint4D(this.vertices4D[i]);
      const [x, y, z, w] = rotated4D;
      
      // Apply consciousness-modulated w-scaling
      const wScaled = w * wFactor;
      const denominator = this.projectionDistance - wScaled;
      
      // Perspective projection with consciousness influence
      if (Math.abs(denominator) > 0.01) {
        this.vertices3D[i] = [
          x / denominator,
          y / denominator,
          z / denominator
        ];
      } else {
        // Handle near-singularity (consciousness causes extreme distortion)
        const sign = denominator >= 0 ? 1 : -1;
        this.vertices3D[i] = [
          x * sign * 100,
          y * sign * 100,
          z * sign * 100
        ];
      }
    }
  }

  // Render tesseract to canvas context
  render(ctx, canvas, scale = 100, centerX = null, centerY = null) {
    if (!centerX) centerX = canvas.width / 2;
    if (!centerY) centerY = canvas.height / 2;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    
    // Set line style
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2 / scale;
    ctx.lineCap = 'round';
    
    // Draw edges
    ctx.beginPath();
    for (const [i, j] of this.edges) {
      const [x1, y1, z1] = this.vertices3D[i];
      const [x2, y2, z2] = this.vertices3D[j];
      
      // Simple Z-order for depth (no proper 3D rendering)
      const depth1 = z1;
      const depth2 = z2;
      const avgDepth = (depth1 + depth2) / 2;
      
      // Vary opacity based on depth
      const opacity = Math.max(0.2, 1 - Math.abs(avgDepth) * 0.3);
      ctx.globalAlpha = opacity;
      
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();
    
    // Draw vertices
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.8;
    for (let i = 0; i < 16; i++) {
      const [x, y, z] = this.vertices3D[i];
      const radius = Math.max(0.02, 0.05 - Math.abs(z) * 0.01);
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    ctx.restore();
  }

  // Get current 4D rotation state for debug/analysis
  getRotationState() {
    return {
      q1: { ...this.q1 },
      q2: { ...this.q2 },
      rotationSpeed: this.rotationSpeed
    };
  }

  // Set rotation speed (for UI control)
  setRotationSpeed(speed) {
    this.rotationSpeed = Math.max(0, Math.min(0.1, speed));
  }

  // Get bounding box of projected 3D vertices
  getBounds3D() {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    for (const [x, y, z] of this.vertices3D) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
    }
    
    return { minX, maxX, minY, maxY, minZ, maxZ };
  }

  // Update and render in one call
  updateAndRender(ctx, canvas, conscMetric, scale = 100) {
    this.rotateStep();
    this.projectTo3D(conscMetric);
    this.render(ctx, canvas, scale);
  }
}

export default Tesseract4D;