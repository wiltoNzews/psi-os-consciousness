/**
 * NeuralField - Core Visualization Component
 * 
 * A high-performance WebGL-based visualization component that renders
 * the neural field using three.js for hardware acceleration.
 * 
 * This component handles only the visual representation, while the computational
 * aspects are managed by a Web Worker to maintain UI responsiveness.
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { DomainType, useDomain } from '@/contexts/DomainContext';
import * as THREE from 'three';

// Worker and types
import { NeuralPattern, NeuralMetrics } from '@/lib/SymbiosisEngine';

interface NeuralFieldProps {
  patterns?: NeuralPattern[];
  activePatterns?: string[];
  metrics?: NeuralMetrics;
  showLabels?: boolean;
  showNodeDetails?: boolean;
  className?: string;
  onNodeSelect?: (nodeId: string) => void;
}

export function NeuralField({
  patterns = [],
  activePatterns = [],
  metrics,
  showLabels = false,
  showNodeDetails = false,
  className = '',
  onNodeSelect
}: NeuralFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { domainConfig } = useDomain();
  
  // WebGL renderer setup
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  
  // Animation
  const animationFrameRef = useRef<number>(0);
  
  // Mouse interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Colors from domain
  const domainColor = useMemo(() => {
    const color = new THREE.Color(domainConfig.color);
    return color;
  }, [domainConfig.color]);
  
  const accentColor = useMemo(() => {
    const color = new THREE.Color(domainConfig.accentColor);
    return color;
  }, [domainConfig.accentColor]);
  
  // Initialize Three.js setup
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      50, 
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    
    // Store references
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    
    // Initial resize
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    
    // Add renderer to DOM
    containerRef.current.appendChild(renderer.domElement);
    
    // Set up ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Create subtle point light
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);
    
    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Normalize coordinates to [-1, 1]
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition({ x: normalizedX, y: normalizedY });
    };
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    
    // Initial animation
    const animate = () => {
      if (!renderer || !scene || !camera) return;
      
      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Rotate scene slightly for ambient movement
      scene.rotation.y += 0.001;
      scene.rotation.x += 0.0005;
      
      // Render
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      
      cancelAnimationFrame(animationFrameRef.current);
      
      // Dispose resources
      renderer.dispose();
    };
  }, []);
  
  // Update visualization based on patterns
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    
    // Clear previous nodes and connections
    scene.children = scene.children.filter(child => 
      child.type === 'AmbientLight' || child.type === 'PointLight'
    );
    
    // Create nodes and connections
    patterns.forEach(pattern => {
      if (pattern.locations.length === 0) return;
      
      // Get last location as node position
      const lastLoc = pattern.locations[pattern.locations.length - 1];
      
      // Map coordinates to 3D space
      // Assuming screen coordinates are already normalized to [-1, 1]
      const x = lastLoc.x / (window.innerWidth / 2) * 30;
      const y = -lastLoc.y / (window.innerHeight / 2) * 20;
      const z = Math.random() * 10 - 5; // Random depth
      
      // Create node
      const isActive = activePatterns.includes(pattern.id);
      
      // Node size based on strength and activity
      const nodeSize = isActive ? 
        0.8 + pattern.strength * 0.8 : 
        0.3 + pattern.strength * 0.5;
      
      // Create geometry and material
      const geometry = new THREE.SphereGeometry(nodeSize, 16, 16);
      
      // Choose color based on pattern type
      let nodeColor: THREE.Color;
      switch (pattern.type) {
        case 'explorative':
          nodeColor = new THREE.Color(domainConfig.color);
          break;
        case 'focused':
          nodeColor = new THREE.Color(domainConfig.accentColor);
          break;
        case 'creative':
          nodeColor = new THREE.Color('#f59e0b'); // Amber
          break;
        case 'analytical':
          nodeColor = new THREE.Color('#60a5fa'); // Blue
          break;
        default:
          nodeColor = new THREE.Color(domainConfig.color);
      }
      
      // Node opacity based on activity
      const opacity = isActive ? 0.8 : 0.4;
      
      const material = new THREE.MeshPhongMaterial({ 
        color: nodeColor,
        transparent: true,
        opacity,
        shininess: 50
      });
      
      const nodeMesh = new THREE.Mesh(geometry, material);
      nodeMesh.position.set(x, y, z);
      nodeMesh.userData = { 
        id: pattern.id,
        type: 'node',
        patternData: pattern
      };
      
      scene.add(nodeMesh);
      
      // Add glow effect for active nodes
      if (isActive) {
        const glowGeometry = new THREE.SphereGeometry(nodeSize * 1.5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: nodeColor,
          transparent: true,
          opacity: 0.3
        });
        
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.position.set(x, y, z);
        scene.add(glowMesh);
      }
      
      // Create connections between nodes
      if (isActive) {
        patterns.forEach(otherPattern => {
          // Skip self or inactive patterns
          if (
            pattern.id === otherPattern.id || 
            !activePatterns.includes(otherPattern.id) ||
            otherPattern.locations.length === 0
          ) return;
          
          const otherLoc = otherPattern.locations[otherPattern.locations.length - 1];
          
          // Map other coordinates
          const ox = otherLoc.x / (window.innerWidth / 2) * 30;
          const oy = -otherLoc.y / (window.innerHeight / 2) * 20;
          const oz = otherPattern.type === pattern.type ? z : Math.random() * 10 - 5;
          
          // Calculate distance
          const dx = x - ox;
          const dy = y - oy;
          const dz = z - oz;
          const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
          
          // Only connect relatively close patterns
          if (distance < 20) {
            // Create connection line
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(x, y, z),
              new THREE.Vector3(ox, oy, oz)
            ]);
            
            // Line opacity based on distance
            const lineOpacity = 0.3 * (1 - distance / 20);
            
            const lineMaterial = new THREE.LineBasicMaterial({
              color: domainColor,
              linewidth: 1,
              transparent: true,
              opacity: lineOpacity
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
          }
        });
      }
    });
    
    // Add ambient particles
    const particleCount = 50;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesPositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlesPositions[i3] = (Math.random() - 0.5) * 60;
      particlesPositions[i3 + 1] = (Math.random() - 0.5) * 40;
      particlesPositions[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlesPositions, 3)
    );
    
    const particlesMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(domainConfig.color),
      size: 0.2,
      transparent: true,
      opacity: 0.3
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
  }, [patterns, activePatterns, domainConfig.color, domainConfig.accentColor]);
  
  // Handle mouse interaction for node selection
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !containerRef.current || !onNodeSelect) return;
    
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current || !sceneRef.current || !cameraRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Normalize coordinates to [-1, 1]
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Create raycaster
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(
        new THREE.Vector2(normalizedX, normalizedY),
        cameraRef.current
      );
      
      // Find intersections with nodes
      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      
      // Check if we hit a node
      for (const intersect of intersects) {
        const userData = intersect.object.userData;
        if (userData?.type === 'node' && userData?.id) {
          onNodeSelect(userData.id);
          break;
        }
      }
    };
    
    containerRef.current.addEventListener('click', handleClick);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick);
      }
    };
  }, [onNodeSelect]);

  return (
    <div 
      ref={containerRef} 
      className={`neural-field w-full h-full ${className}`}
      aria-label="Neural Field Visualization"
    >
      {/* WebGL canvas is injected here */}
    </div>
  );
}