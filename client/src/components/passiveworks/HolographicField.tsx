import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';

interface HolographicFieldProps {
  domain: DomainType;
  className?: string;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  type: 'human' | 'ai' | 'data';
  size: number;
  pulseFrequency?: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

// Node positions in 3D space
const NODES: Node[] = [
  { id: 'n1', label: 'Human Intelligence', x: -120, y: 80, z: -50, type: 'human', size: 20, pulseFrequency: 0.7 },
  { id: 'n2', label: 'Cognitive Extension', x: 120, y: 80, z: 30, type: 'ai', size: 20, pulseFrequency: 1.2 },
  { id: 'n3', label: 'Data Analysis', x: 0, y: -80, z: 80, type: 'data', size: 18, pulseFrequency: 0.9 },
  { id: 'n4', label: 'Neural Network', x: -150, y: -40, z: 0, type: 'ai', size: 19, pulseFrequency: 1.1 },
  { id: 'n5', label: 'Pattern Recognition', x: 150, y: -10, z: -60, type: 'human', size: 18, pulseFrequency: 0.8 },
  { id: 'n6', label: 'Symbiotic Engine', x: 0, y: 30, z: 0, type: 'ai', size: 22, pulseFrequency: 1.0 },
  { id: 'n7', label: 'Cultural Insight', x: 120, y: -90, z: 30, type: 'data', size: 17, pulseFrequency: 0.9 },
];

const CONNECTIONS: Connection[] = [
  { source: 'n1', target: 'n2', strength: 0.8 },
  { source: 'n1', target: 'n6', strength: 0.9 },
  { source: 'n2', target: 'n6', strength: 0.9 },
  { source: 'n2', target: 'n5', strength: 0.7 },
  { source: 'n6', target: 'n3', strength: 0.8 },
  { source: 'n3', target: 'n4', strength: 0.6 },
  { source: 'n4', target: 'n7', strength: 0.5 },
  { source: 'n5', target: 'n7', strength: 0.7 },
  { source: 'n3', target: 'n5', strength: 0.6 },
  { source: 'n6', target: 'n4', strength: 0.7 },
  { source: 'n1', target: 'n3', strength: 0.6 },
];

export function HolographicField({ domain, className = '' }: HolographicFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [cameraRef, setCameraRef] = useState<THREE.PerspectiveCamera | null>(null);
  const [rendererRef, setRendererRef] = useState<THREE.WebGLRenderer | null>(null);
  const domainColor = domainConfigs[domain].color;
  
  // Convert domain color to THREE.Color
  const getDomainThreeColor = () => {
    // Handle different color formats
    if (domainColor.startsWith('#')) {
      return new THREE.Color(domainColor);
    } else if (domainColor === 'purple') {
      return new THREE.Color('#800080');
    } else {
      return new THREE.Color('#ff00ff'); // Default fallback
    }
  };
  
  // Convert node type to color
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'human': return new THREE.Color(0xffffff); // White
      case 'ai': return getDomainThreeColor();
      case 'data': return new THREE.Color(0x4477ff); // Blue
      default: return new THREE.Color(0xffffff);
    }
  };
  
  // Initial setup - create scene, camera, renderer
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      60, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      2000 // Far clipping plane
    );
    camera.position.z = 300;
    
    // Create renderer with transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Clear existing content and append renderer
    if (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
    
    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Store references
    setScene(scene);
    setCameraRef(camera);
    setRendererRef(renderer);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // Dispose scene materials and geometries
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, []);
  
  // Effect for domain color changes
  useEffect(() => {
    if (!scene) return;
    
    // Update domain-specific elements
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.userData.type === 'ai') {
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => {
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhongMaterial) {
              mat.color = getDomainThreeColor();
              mat.emissive = getDomainThreeColor();
              mat.emissiveIntensity = 0.5;
              mat.needsUpdate = true;
            }
          });
        } else if (object.material instanceof THREE.MeshStandardMaterial || 
                   object.material instanceof THREE.MeshPhongMaterial) {
          object.material.color = getDomainThreeColor();
          object.material.emissive = getDomainThreeColor();
          object.material.emissiveIntensity = 0.5;
          object.material.needsUpdate = true;
        }
      }
    });
    
  }, [domain, scene]);
  
  // Create 3D visualization
  useEffect(() => {
    if (!scene || !cameraRef || !rendererRef) return;
    
    // Create domain sphere
    const domainGeometry = new THREE.SphereGeometry(240, 32, 32);
    const domainMaterial = new THREE.MeshBasicMaterial({
      color: getDomainThreeColor(),
      transparent: true,
      opacity: 0.05,
      wireframe: true,
    });
    const domainSphere = new THREE.Mesh(domainGeometry, domainMaterial);
    scene.add(domainSphere);
    
    // Create grid
    const gridHelper = new THREE.GridHelper(500, 50, 0x222222, 0x111111);
    gridHelper.position.y = -150;
    scene.add(gridHelper);
    
    // Create nodes
    const nodeObjects: { [key: string]: THREE.Group } = {};
    const nodeLabels: { [key: string]: THREE.Sprite } = {};
    
    NODES.forEach(node => {
      // Create node group
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(node.x, node.y, node.z);
      nodeGroup.userData = { id: node.id, type: node.type, pulseFrequency: node.pulseFrequency };
      
      // Core sphere
      const sphereGeometry = new THREE.SphereGeometry(node.size, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: getNodeColor(node.type),
        emissive: getNodeColor(node.type),
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.8,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.userData = { type: node.type };
      nodeGroup.add(sphere);
      
      // Outer glow
      const glowGeometry = new THREE.SphereGeometry(node.size * 1.3, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: getNodeColor(node.type),
        transparent: true,
        opacity: 0.2,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      nodeGroup.add(glow);
      
      // Larger outer glow
      const largeGlowGeometry = new THREE.SphereGeometry(node.size * 2, 32, 32);
      const largeGlowMaterial = new THREE.MeshBasicMaterial({
        color: getNodeColor(node.type),
        transparent: true,
        opacity: 0.1,
      });
      const largeGlow = new THREE.Mesh(largeGlowGeometry, largeGlowMaterial);
      nodeGroup.add(largeGlow);
      
      // Create label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 128;
      
      if (context) {
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(node.label, canvas.width/2, canvas.height/2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true,
          depthTest: false
        });
        
        const labelSprite = new THREE.Sprite(labelMaterial);
        labelSprite.scale.set(80, 40, 1);
        labelSprite.position.set(0, -node.size - 25, 0);
        nodeGroup.add(labelSprite);
        
        nodeLabels[node.id] = labelSprite;
      }
      
      scene.add(nodeGroup);
      nodeObjects[node.id] = nodeGroup;
    });
    
    // Create connections
    const connections: THREE.Line[] = [];
    
    CONNECTIONS.forEach(conn => {
      const sourceNode = nodeObjects[conn.source];
      const targetNode = nodeObjects[conn.target];
      
      if (sourceNode && targetNode) {
        // Create curve between nodes
        const curve = new THREE.QuadraticBezierCurve3(
          sourceNode.position,
          new THREE.Vector3(
            (sourceNode.position.x + targetNode.position.x) / 2,
            (sourceNode.position.y + targetNode.position.y) / 2,
            (sourceNode.position.z + targetNode.position.z) / 2 + 20 + Math.random() * 20
          ),
          targetNode.position
        );
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Connection line
        const connectionMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.3 + conn.strength * 0.6,
          linewidth: 1,
        });
        
        const line = new THREE.Line(geometry, connectionMaterial);
        scene.add(line);
        connections.push(line);
        
        // Add data flow particles along connection
        const flowGeometry = new THREE.SphereGeometry(1.5, 8, 8);
        const flowMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8,
        });
        
        for (let i = 0; i < 3; i++) {
          const particle = new THREE.Mesh(flowGeometry, flowMaterial);
          particle.userData = {
            curve,
            progress: Math.random(),
            speed: 0.001 + Math.random() * 0.002,
          };
          scene.add(particle);
        }
      }
    });
    
    // Create stars in background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Distribute stars in a sphere around the scene
      const radius = 700 + Math.random() * 1000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
      
      starSizes[i] = Math.random() * 2 + 0.5;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Animation loop
    let time = 0;
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      
      // Update time
      time += 0.01;
      
      // Subtle rotation of the whole scene for ambient movement
      scene.rotation.y = Math.sin(time * 0.1) * 0.05;
      scene.rotation.x = Math.sin(time * 0.15) * 0.03;
      
      // Pulse nodes
      Object.values(nodeObjects).forEach(nodeGroup => {
        const pulseFrequency = nodeGroup.userData.pulseFrequency || 1;
        const pulseFactor = Math.sin(time * pulseFrequency) * 0.1 + 1;
        
        // Apply pulse to all node elements
        nodeGroup.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            // Different pulse for different parts
            if (index === 0) { // Core sphere
              child.scale.set(pulseFactor * 0.95, pulseFactor * 0.95, pulseFactor * 0.95);
            } else if (index === 1) { // Inner glow
              child.scale.set(pulseFactor * 1.05, pulseFactor * 1.05, pulseFactor * 1.05);
            } else if (index === 2) { // Outer glow
              // More dramatic scaling for outer glow
              const outerPulseFactor = Math.sin(time * pulseFrequency * 0.7) * 0.2 + 1;
              child.scale.set(outerPulseFactor, outerPulseFactor, outerPulseFactor);
            }
          }
        });
      });
      
      // Animate data flow particles along connections
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.userData.curve) {
          // Update particle position along curve
          child.userData.progress += child.userData.speed;
          if (child.userData.progress > 1) {
            child.userData.progress = 0;
          }
          
          // Get position on curve
          const point = child.userData.curve.getPointAt(child.userData.progress);
          child.position.copy(point);
          
          // Pulse opacity for shimmering effect
          const material = child.material as THREE.MeshBasicMaterial;
          material.opacity = 0.4 + Math.sin(time * 5 + child.userData.progress * 10) * 0.3;
        }
      });
      
      // Domain sphere subtle animation
      if (domainSphere) {
        domainSphere.rotation.y += 0.001;
        domainSphere.rotation.x += 0.0005;
        domainSphere.material.opacity = 0.03 + Math.sin(time * 0.5) * 0.01;
      }
      
      // Render scene
      rendererRef.render(scene, cameraRef);
      
      // Slowly rotate camera to create floating effect
      cameraRef.position.x = Math.sin(time * 0.1) * 30;
      cameraRef.position.y = Math.sin(time * 0.15) * 20;
      cameraRef.lookAt(0, 0, 0);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      
      // Remove all scene children
      while (scene.children.length > 0) {
        const child = scene.children[0];
        scene.remove(child);
        
        // Dispose geometries and materials
        if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      }
    };
  }, [scene, cameraRef, rendererRef, domain]);
  
  // Custom styles for holographic effect
  const overlayStyles = `
    .scan-line {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.1);
      opacity: 0.7;
      animation: scanline 6s linear infinite;
      pointer-events: none;
      z-index: 10;
    }
    
    @keyframes scanline {
      0% {
        transform: translateY(-100vh);
      }
      100% {
        transform: translateY(100vh);
      }
    }
    
    .hologram-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%);
      pointer-events: none;
      z-index: 2;
      mix-blend-mode: multiply;
    }
    
    .noise {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.05;
      pointer-events: none;
      z-index: 3;
      mix-blend-mode: overlay;
    }
    
    .vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 90%, rgba(0,0,0,0.95) 100%);
      pointer-events: none;
      z-index: 4;
    }
  `;
  
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {/* Add the CSS animation styles */}
      <style dangerouslySetInnerHTML={{ __html: overlayStyles }} />
      
      {/* THREE.js mount point */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0"
        style={{ backgroundColor: 'black' }}
      />
      
      {/* Holographic overlay effects */}
      <div className="hologram-overlay" />
      <div className="noise" />
      <div className="vignette" />
      
      {/* Scanning line effect */}
      <div className="scan-line" />
    </div>
  );
}