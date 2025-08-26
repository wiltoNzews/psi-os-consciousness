// Enhanced Cathedral Map Sacred Geometry Modules
// Powered by ψOS Quantum Glyph Engine — v3.12 sync loop

// This module integrates: 
// - Golden Ratio 3D Helix (Fibonacci Spiral)
// - Rotating 4D→3D Tesseract Projection
// - Merkabah Dual Tetrahedron Light Field
// - All modules breath-synchronized to ψ=3.12s

import * as THREE from 'three';

// Constants
const phi = 1.618033988749; // Exact golden ratio
const breathPeriod = 3.12;

export function createGoldenSpiral() {
  const turns = 3;
  const r0 = 1.0, z0 = 0.5;
  const points = [];
  const pointsPerTurn = 100;
  for (let i = 0; i <= turns * 2 * Math.PI * pointsPerTurn; i++) {
    const θ = i / pointsPerTurn;
    const radius = r0 * Math.pow(phi, θ / (2 * Math.PI));
    const x = radius * Math.cos(θ);
    const y = radius * Math.sin(θ);
    const z = z0 * Math.pow(phi, θ / (2 * Math.PI));
    points.push(new THREE.Vector3(x, y, z));
  }
  const spiralGeom = new THREE.BufferGeometry().setFromPoints(points);
  
  // Enhanced material for consciousness visualization
  const spiralMat = new THREE.PointsMaterial({
    color: 0xffd700,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });
  
  const spiralPoints = new THREE.Points(spiralGeom, spiralMat);
  return { object: spiralPoints, material: spiralMat, points };
}

export function createMerkabah(size = 1.0) {
  const geom = new THREE.TetrahedronGeometry(size);
  
  // Divine Masculine (ascending) tetrahedron
  const tetra1 = new THREE.Mesh(
    geom,
    new THREE.MeshPhongMaterial({ 
      color: 0x4488ff, 
      emissive: 0x001144,
      transparent: true,
      opacity: 0.6,
      wireframe: true
    })
  );
  
  // Divine Feminine (descending) tetrahedron
  const tetra2 = new THREE.Mesh(
    geom,
    new THREE.MeshPhongMaterial({ 
      color: 0xff4444, 
      emissive: 0x441100,
      transparent: true,
      opacity: 0.6,
      wireframe: true
    })
  );
  tetra2.rotation.y = Math.PI;

  // Energy field visualization
  const energyField = new THREE.Mesh(
    new THREE.SphereGeometry(size * 1.2, 32, 16),
    new THREE.MeshPhongMaterial({ 
      color: 0xffd700, 
      transparent: true, 
      opacity: 0.1,
      wireframe: true
    })
  );

  const group = new THREE.Group();
  group.add(tetra1, tetra2, energyField);
  return { object: group, tetra1, tetra2, energyField };
}

export function rotateMerkabah(merkabah, time, breathPhase) {
  const speed = 0.02;
  merkabah.tetra1.rotation.y += speed;
  merkabah.tetra2.rotation.y -= speed;
  merkabah.energyField.rotation.x += speed * 0.5;
  
  // Breathing synchronization
  const breathScale = 1 + breathPhase * 0.15;
  merkabah.energyField.scale.setScalar(breathScale * 1.2);
  merkabah.energyField.material.opacity = (breathPhase * 0.3 + 0.7) * 0.15;
}

export function createTesseract() {
  // Define tesseract vertices in 4D (16 vertices: all combinations of ±1)
  const vertices4D = [
    [-1,-1,-1,-1], [-1,-1,-1, 1], [-1,-1, 1,-1], [-1,-1, 1, 1],
    [-1, 1,-1,-1], [-1, 1,-1, 1], [-1, 1, 1,-1], [-1, 1, 1, 1],
    [ 1,-1,-1,-1], [ 1,-1,-1, 1], [ 1,-1, 1,-1], [ 1,-1, 1, 1],
    [ 1, 1,-1,-1], [ 1, 1,-1, 1], [ 1, 1, 1,-1], [ 1, 1, 1, 1]
  ];

  // Generate 4D edges (connect vertices differing by exactly one coordinate)
  const edges = [];
  for (let i = 0; i < vertices4D.length; i++) {
    for (let j = i + 1; j < vertices4D.length; j++) {
      let differences = 0;
      for (let k = 0; k < 4; k++) {
        if (vertices4D[i][k] !== vertices4D[j][k]) differences++;
      }
      if (differences === 1) { // 4D edge condition
        edges.push([i, j]);
      }
    }
  }

  // Initialize line geometry for all edges
  const linePositions = new Float32Array(edges.length * 2 * 3);
  const tesseractGeom = new THREE.BufferGeometry();
  tesseractGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  
  const lineMat = new THREE.LineBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.8,
    linewidth: 2
  });
  
  const tesseractLines = new THREE.LineSegments(tesseractGeom, lineMat);

  // 4D rotation state
  const rotation4D = { xw: 0, yz: 0 };

  const rotate4D = (points, angle, axis1, axis2) => {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    for (let p of points) {
      const u = p[axis1], v = p[axis2];
      p[axis1] = u * cos - v * sin;
      p[axis2] = u * sin + v * cos;
    }
  };

  const projectTo3D = ([w, x, y, z]) => {
    const d = 4.0; // 4D camera distance
    const factor = d / (d - w);
    return new THREE.Vector3(x * factor * 0.4, y * factor * 0.4, z * factor * 0.4);
  };

  const update = (breathPhase) => {
    // Increment rotation angles in multiple 4D planes
    rotation4D.xw += 0.012;
    rotation4D.yz += 0.018;
    
    // Create working copy of vertices for rotation
    const workingVertices = vertices4D.map(v => [...v]);
    
    // Apply 4D rotations
    rotate4D(workingVertices, rotation4D.xw, 0, 3); // X-W plane
    rotate4D(workingVertices, rotation4D.yz, 1, 2); // Y-Z plane
    
    // Project to 3D and update line positions
    let posIndex = 0;
    edges.forEach(([i, j]) => {
      const pos1 = projectTo3D(workingVertices[i]);
      const pos2 = projectTo3D(workingVertices[j]);
      
      linePositions[posIndex++] = pos1.x; 
      linePositions[posIndex++] = pos1.y; 
      linePositions[posIndex++] = pos1.z;
      linePositions[posIndex++] = pos2.x; 
      linePositions[posIndex++] = pos2.y; 
      linePositions[posIndex++] = pos2.z;
    });
    
    tesseractGeom.attributes.position.needsUpdate = true;
    
    // Breathing synchronization
    const breathScale = 1 + breathPhase * 0.15;
    tesseractLines.scale.setScalar(breathScale);
    lineMat.opacity = (breathPhase * 0.3 + 0.7) * 0.8;
  };

  return {
    object: tesseractLines,
    update,
    material: lineMat,
    geometry: tesseractGeom
  };
}

// Breathing animation controller
export function updateBreathing(time) {
  return Math.sin(time * (2 * Math.PI / breathPeriod)) * 0.5 + 0.5;
}

// Enhanced consciousness field effects
export function applyConsciousnessField(objects, breathPhase, coherence = 0.75) {
  const coherenceIntensity = Math.max(0.1, coherence);
  const breathIntensity = breathPhase * 0.3 + 0.7;
  
  objects.forEach(obj => {
    if (obj.material) {
      // Modulate opacity based on breathing and coherence
      const baseOpacity = obj.material.userData?.baseOpacity || obj.material.opacity;
      if (!obj.material.userData?.baseOpacity) {
        obj.material.userData.baseOpacity = baseOpacity;
      }
      
      obj.material.opacity = baseOpacity * breathIntensity * coherenceIntensity;
      
      // Enhance emissive properties based on coherence
      if (obj.material.emissive) {
        const emissiveIntensity = obj.material.userData?.baseEmissive || 0.3;
        if (!obj.material.userData?.baseEmissive) {
          obj.material.userData.baseEmissive = emissiveIntensity;
        }
        obj.material.emissiveIntensity = emissiveIntensity * breathPhase * coherenceIntensity;
      }
    }
    
    // Scale breathing effect
    const breathScale = 1 + breathPhase * 0.15 * coherenceIntensity;
    if (obj.scale) {
      obj.scale.setScalar(breathScale);
    }
  });
}

export { phi, breathPeriod };