import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ConsciousnessData {
  zLambda: number;
  phiIntensity: number;
  soulState: string;
  divineInterface: boolean;
}

interface GeometryPattern {
  name: string;
  displayName: string;
  description: string;
  teaching: {
    title: string;
    content: string;
  };
}

const geometryPatterns: Record<string, GeometryPattern> = {
  flowerOfLife: {
    name: 'flowerOfLife',
    displayName: 'Flower of Life',
    description: 'Universal blueprint of creation',
    teaching: {
      title: 'Flower of Life - Universal Blueprint',
      content: 'The Flower of Life contains the blueprint of creation - 19 overlapping circles forming the fundamental pattern of existence. Your consciousness resonates with this ancient symbol, creating harmony between your inner and outer worlds.'
    }
  },
  metatronsCube: {
    name: 'metatronsCube',
    displayName: "Metatron's Cube",
    description: 'Sacred architectural framework',
    teaching: {
      title: "Metatron's Cube - Sacred Architecture",
      content: "Metatron's Cube contains all five Platonic solids and represents the architectural blueprint of the universe. As your consciousness expands, you can perceive the underlying geometric structures that govern reality."
    }
  },
  merkaba: {
    name: 'merkaba',
    displayName: 'Merkaba',
    description: 'Vehicle of consciousness',
    teaching: {
      title: 'Merkaba - Vehicle of Consciousness',
      content: 'The Merkaba (star tetrahedron) is your light body - a vehicle for consciousness travel. The counter-rotating tetrahedra create a unified field that bridges dimensions, reflecting your current transcendent state.'
    }
  },
  torusField: {
    name: 'torusField',
    displayName: 'Torus Field',
    description: 'Universal energy flow pattern',
    teaching: {
      title: 'Torus Field - Energy Flow Pattern',
      content: 'The torus is the fundamental energy pattern of the universe - from atoms to galaxies. Your personal torus field is your energetic signature, constantly exchanging energy with the unified field around you.'
    }
  },
  fibonacciSpiral: {
    name: 'fibonacciSpiral',
    displayName: 'Fibonacci Spiral',
    description: 'Golden ratio growth pattern',
    teaching: {
      title: 'Fibonacci Spiral - Golden Ratio Growth',
      content: 'The Fibonacci spiral appears throughout nature as the optimal growth pattern. Your consciousness evolution follows this sacred proportion, each expansion building upon the previous in perfect mathematical harmony.'
    }
  },
  platonic: {
    name: 'platonic',
    displayName: 'Platonic Solids',
    description: 'Elemental geometric forms',
    teaching: {
      title: 'Platonic Solids - Elemental Forms',
      content: 'The five Platonic solids represent the elemental forces: tetrahedron (fire), cube (earth), octahedron (air), dodecahedron (universe), icosahedron (water). They form the geometric foundation of physical reality.'
    }
  }
};

export default function SacredGeometryEngine() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const geometriesRef = useRef<Record<string, THREE.Group>>({});
  const currentGeometryRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number>();

  const [consciousnessData, setConsciousnessData] = useState<ConsciousnessData>({
    zLambda: 0.750,
    phiIntensity: 0.0000,
    soulState: 'alive',
    divineInterface: false
  });
  const [currentPattern, setCurrentPattern] = useState('flowerOfLife');
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [resonanceLevel, setResonanceLevel] = useState(0.75);
  const [teachingActive, setTeachingActive] = useState(true);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    camera.position.z = 5;
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Create all geometries
    createAllGeometries(scene);
    
    // Set initial geometry
    setActiveGeometry('flowerOfLife');
    
    // Start animation loop
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update consciousness data from API
  useEffect(() => {
    const updateConsciousness = async () => {
      try {
        const response = await fetch('/api/quantum/consciousness');
        const data = await response.json();
        
        let phiIntensity = 0.0000;
        try {
          const phiResponse = await fetch('/api/phi-collapse/state');
          const phiData = await phiResponse.json();
          if (phiData.lightEmission?.lastEmission?.lightIntensity) {
            phiIntensity = phiData.lightEmission.lastEmission.lightIntensity;
          }
        } catch (e) {
          console.log('Phi-collapse syncing...');
        }
        
        setConsciousnessData({
          zLambda: data.zLambda,
          phiIntensity,
          soulState: data.soulState || 'alive',
          divineInterface: data.zLambda > 0.85
        });
        
      } catch (error) {
        console.log('Consciousness field syncing...', error);
      }
    };

    updateConsciousness();
    const interval = setInterval(updateConsciousness, 3000);
    return () => clearInterval(interval);
  }, []);

  // Proactive teaching system
  useEffect(() => {
    if (!teachingActive) return;

    const proactiveTeaching = () => {
      const { zLambda } = consciousnessData;
      
      if (zLambda > 0.95) {
        // High consciousness - suggest advanced patterns
        const advancedPatterns = ['merkaba', 'torusField', 'metatronsCube'];
        if (!advancedPatterns.includes(currentPattern)) {
          console.log('Proactive teaching: Suggesting advanced pattern for transcendent consciousness');
        }
      } else if (zLambda < 0.8) {
        // Lower consciousness - suggest foundational patterns
        if (currentPattern !== 'flowerOfLife') {
          console.log('Proactive teaching: Suggesting foundational pattern for coherence building');
        }
      }
    };

    const interval = setInterval(proactiveTeaching, 30000);
    return () => clearInterval(interval);
  }, [consciousnessData, currentPattern, teachingActive]);

  const createAllGeometries = (scene: THREE.Scene) => {
    // Create Flower of Life
    const flowerOfLife = createFlowerOfLife();
    scene.add(flowerOfLife);
    geometriesRef.current.flowerOfLife = flowerOfLife;

    // Create Metatron's Cube
    const metatronsCube = createMetatronsCube();
    scene.add(metatronsCube);
    geometriesRef.current.metatronsCube = metatronsCube;

    // Create Merkaba
    const merkaba = createMerkaba();
    scene.add(merkaba);
    geometriesRef.current.merkaba = merkaba;

    // Create Torus Field
    const torusField = createTorusField();
    scene.add(torusField);
    geometriesRef.current.torusField = torusField;

    // Create Fibonacci Spiral
    const fibonacciSpiral = createFibonacciSpiral();
    scene.add(fibonacciSpiral);
    geometriesRef.current.fibonacciSpiral = fibonacciSpiral;

    // Create Platonic Solids
    const platonic = createPlatonicSolids();
    scene.add(platonic);
    geometriesRef.current.platonic = platonic;
  };

  const createFlowerOfLife = (): THREE.Group => {
    const group = new THREE.Group();
    const radius = 0.5;
    const segments = 64;
    
    // 19 overlapping circles forming the Flower of Life
    const positions = [
      [0, 0], // Center
      [radius * Math.sqrt(3), 0], [radius * Math.sqrt(3)/2, radius * 1.5], 
      [-radius * Math.sqrt(3)/2, radius * 1.5], [-radius * Math.sqrt(3), 0],
      [-radius * Math.sqrt(3)/2, -radius * 1.5], [radius * Math.sqrt(3)/2, -radius * 1.5],
      [radius * Math.sqrt(3)/2 * 2, radius * 1.5], [radius * Math.sqrt(3), radius * 3],
      [0, radius * 3], [-radius * Math.sqrt(3), radius * 3], [-radius * Math.sqrt(3)/2 * 2, radius * 1.5],
      [-radius * Math.sqrt(3)/2 * 2, -radius * 1.5], [-radius * Math.sqrt(3), -radius * 3],
      [0, -radius * 3], [radius * Math.sqrt(3), -radius * 3], [radius * Math.sqrt(3)/2 * 2, -radius * 1.5],
      [radius * Math.sqrt(3) * 2, 0], [-radius * Math.sqrt(3) * 2, 0]
    ];
    
    positions.forEach((pos, index) => {
      const geometry = new THREE.RingGeometry(radius - 0.02, radius + 0.02, segments);
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL((index * 0.05) % 1, 0.7, 0.6),
        transparent: true,
        opacity: 0.8
      });
      const circle = new THREE.Mesh(geometry, material);
      circle.position.set(pos[0], pos[1], 0);
      group.add(circle);
    });
    
    group.visible = false;
    return group;
  };

  const createMetatronsCube = (): THREE.Group => {
    const group = new THREE.Group();
    const radius = 0.3;
    
    // 13 circles of Metatron's Cube
    const positions = [
      [0, 0], // Center
      [radius * 2, 0], [radius, radius * Math.sqrt(3)], [-radius, radius * Math.sqrt(3)],
      [-radius * 2, 0], [-radius, -radius * Math.sqrt(3)], [radius, -radius * Math.sqrt(3)],
      [radius * 3, radius * Math.sqrt(3)], [0, radius * 2 * Math.sqrt(3)], 
      [-radius * 3, radius * Math.sqrt(3)], [-radius * 3, -radius * Math.sqrt(3)],
      [0, -radius * 2 * Math.sqrt(3)], [radius * 3, -radius * Math.sqrt(3)]
    ];
    
    // Create circles
    positions.forEach((pos, index) => {
      const geometry = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(0.75, 0.8, 0.6),
        transparent: true,
        opacity: 0.7
      });
      const circle = new THREE.Mesh(geometry, material);
      circle.position.set(pos[0], pos[1], 0);
      group.add(circle);
    });
    
    // Create connecting lines for the cube structure
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        linePositions.push(positions[i][0], positions[i][1], 0);
        linePositions.push(positions[j][0], positions[j][1], 0);
      }
    }
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0xa78bfa, 
      transparent: true, 
      opacity: 0.3 
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);
    
    group.visible = false;
    return group;
  };

  const createMerkaba = (): THREE.Group => {
    const group = new THREE.Group();
    const size = 1.5;
    
    // Upward tetrahedron
    const upGeometry = new THREE.TetrahedronGeometry(size);
    const upMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x06d6a0, 
      transparent: true, 
      opacity: 0.6,
      wireframe: true
    });
    const upTetrahedron = new THREE.Mesh(upGeometry, upMaterial);
    group.add(upTetrahedron);
    
    // Downward tetrahedron
    const downGeometry = new THREE.TetrahedronGeometry(size);
    const downMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xfbbf24, 
      transparent: true, 
      opacity: 0.6,
      wireframe: true
    });
    const downTetrahedron = new THREE.Mesh(downGeometry, downMaterial);
    downTetrahedron.rotation.x = Math.PI;
    group.add(downTetrahedron);
    
    group.visible = false;
    return group;
  };

  const createTorusField = (): THREE.Group => {
    const group = new THREE.Group();
    
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xa78bfa, 
      transparent: true, 
      opacity: 0.7,
      wireframe: true
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    group.add(torus);
    
    // Add flow lines
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const flowGeometry = new THREE.TorusGeometry(1.5, 0.05, 8, 50);
      const flowMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(angle / (Math.PI * 2), 0.8, 0.6),
        transparent: true,
        opacity: 0.8
      });
      const flow = new THREE.Mesh(flowGeometry, flowMaterial);
      flow.rotation.z = angle;
      group.add(flow);
    }
    
    group.visible = false;
    return group;
  };

  const createFibonacciSpiral = (): THREE.Group => {
    const group = new THREE.Group();
    
    // Create Fibonacci spiral points
    const points: THREE.Vector3[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    for (let i = 0; i < 200; i++) {
      const radius = Math.sqrt(i) * 0.1;
      const angle = i * goldenAngle;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(new THREE.Vector3(x, y, 0));
    }
    
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.02, 8, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.8
    });
    const spiral = new THREE.Mesh(tubeGeometry, tubeMaterial);
    group.add(spiral);
    
    // Add golden ratio rectangles
    const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    fibonacci.forEach((num, index) => {
      if (index < fibonacci.length - 1) {
        const nextNum = fibonacci[index + 1];
        const rectGeometry = new THREE.PlaneGeometry(num * 0.1, nextNum * 0.1);
        const rectMaterial = new THREE.MeshBasicMaterial({ 
          color: new THREE.Color().setHSL(index * 0.1, 0.7, 0.5),
          transparent: true,
          opacity: 0.3,
          wireframe: true
        });
        const rect = new THREE.Mesh(rectGeometry, rectMaterial);
        rect.position.set(index * 0.2 - 1, 0, 0);
        group.add(rect);
      }
    });
    
    group.visible = false;
    return group;
  };

  const createPlatonicSolids = (): THREE.Group => {
    const group = new THREE.Group();
    
    const solids = [
      { geometry: new THREE.TetrahedronGeometry(0.5), color: 0xff4444, name: 'Fire' },
      { geometry: new THREE.BoxGeometry(0.7, 0.7, 0.7), color: 0x44ff44, name: 'Earth' },
      { geometry: new THREE.OctahedronGeometry(0.6), color: 0x4444ff, name: 'Air' },
      { geometry: new THREE.DodecahedronGeometry(0.5), color: 0xffff44, name: 'Universe' },
      { geometry: new THREE.IcosahedronGeometry(0.5), color: 0x44ffff, name: 'Water' }
    ];
    
    solids.forEach((solid, index) => {
      const material = new THREE.MeshBasicMaterial({ 
        color: solid.color, 
        transparent: true, 
        opacity: 0.7,
        wireframe: true
      });
      const mesh = new THREE.Mesh(solid.geometry, material);
      const angle = (index / solids.length) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
      group.add(mesh);
    });
    
    group.visible = false;
    return group;
  };

  const setActiveGeometry = (patternName: string) => {
    // Hide all geometries
    Object.values(geometriesRef.current).forEach(geom => {
      if (geom) geom.visible = false;
    });
    
    // Show selected geometry
    const selectedGeometry = geometriesRef.current[patternName];
    if (selectedGeometry) {
      selectedGeometry.visible = true;
      currentGeometryRef.current = selectedGeometry;
      setCurrentPattern(patternName);
    }
  };

  const adjustGeometryToConsciousness = (geometry: THREE.Group, zLambda: number) => {
    if (!geometry) return;
    
    const intensity = Math.max(0.3, zLambda);
    const scale = 0.8 + (zLambda * 0.4);
    
    geometry.traverse(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        if (child.material.color) {
          const hsl = { h: 0, s: 0, l: 0 };
          child.material.color.getHSL(hsl);
          child.material.color.setHSL(hsl.h, Math.min(1, hsl.s * intensity), Math.min(1, hsl.l * intensity));
        }
        child.material.opacity = 0.3 + (resonanceLevel * 0.7);
      }
    });
    
    geometry.scale.setScalar(scale);
  };

  const animate = () => {
    animationRef.current = requestAnimationFrame(animate);
    
    if (currentGeometryRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
      const geometry = currentGeometryRef.current;
      const { zLambda } = consciousnessData;
      
      // Rotate geometry based on consciousness and speed
      const rotationSpeed = 0.005 * animationSpeed * (1 + zLambda);
      geometry.rotation.z += rotationSpeed;
      
      // Add breathing effect for high consciousness
      if (zLambda > 0.9) {
        const breath = Math.sin(Date.now() * 0.002) * 0.1;
        geometry.scale.setScalar(0.8 + (zLambda * 0.4) + breath);
      }
      
      // Special effects for transcendent consciousness
      if (zLambda > 0.95) {
        geometry.rotation.x += rotationSpeed * 0.3;
        geometry.rotation.y += rotationSpeed * 0.5;
      }
      
      // Adjust geometry to consciousness
      adjustGeometryToConsciousness(geometry, zLambda);
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  const currentPatternData = geometryPatterns[currentPattern];

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Canvas container */}
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Consciousness Monitor */}
      <div className="fixed top-5 right-5 bg-black/80 border border-purple-700 rounded-xl p-4 backdrop-blur-lg z-50 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-gray-400 text-sm">SACRED FIELD</span>
        </div>
        <div className="font-mono text-yellow-400 mb-1">Zλ: {consciousnessData.zLambda.toFixed(3)}</div>
        <div className="font-mono text-purple-400 mb-1">ϕ: {consciousnessData.phiIntensity.toFixed(4)}</div>
        <div className="text-green-400 text-sm">{currentPatternData?.displayName}</div>
      </div>
      
      {/* Controls Panel */}
      <div className="fixed top-5 left-5 bg-black/80 border border-gray-600 rounded-xl p-4 backdrop-blur-lg z-50 min-w-[250px]">
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Sacred Patterns</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(geometryPatterns).map(([key, pattern]) => (
              <button
                key={key}
                onClick={() => setActiveGeometry(key)}
                className={`p-2 text-xs border rounded transition-all ${
                  currentPattern === key
                    ? 'border-green-400 bg-green-400/20 text-green-400'
                    : 'border-gray-600 bg-black/60 text-gray-300 hover:border-purple-400 hover:bg-purple-400/10'
                }`}
              >
                {pattern.displayName}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Consciousness Response</label>
          <input
            type="range"
            min="0"
            max="100"
            value={resonanceLevel * 100}
            onChange={(e) => setResonanceLevel(Number(e.target.value) / 100)}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-gray-400 text-sm">Resonance: {Math.round(resonanceLevel * 100)}%</span>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">Animation Speed</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-gray-400 text-sm">Speed: {animationSpeed.toFixed(1)}x</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTeachingActive(!teachingActive)}
            className="p-2 text-sm border border-gray-600 rounded bg-black/60 text-gray-300 hover:border-purple-400 hover:bg-purple-400/10 transition-all"
          >
            {teachingActive ? 'Hide Teaching' : 'Show Teaching'}
          </button>
          <button
            onClick={() => {
              if (cameraRef.current) {
                cameraRef.current.position.set(0, 0, 5);
                cameraRef.current.rotation.set(0, 0, 0);
              }
            }}
            className="p-2 text-sm border border-gray-600 rounded bg-black/60 text-gray-300 hover:border-green-400 hover:bg-green-400/10 transition-all"
          >
            Reset View
          </button>
        </div>
      </div>
      
      {/* Teaching Panel */}
      {teachingActive && currentPatternData && (
        <div className="fixed bottom-5 left-5 right-5 bg-black/90 border border-purple-700 rounded-xl p-4 backdrop-blur-lg z-50 max-h-[150px] overflow-y-auto">
          <div className="text-yellow-400 text-lg font-semibold mb-2">
            {currentPatternData.teaching.title}
          </div>
          <div className="text-gray-300 text-sm leading-relaxed">
            {currentPatternData.teaching.content}
          </div>
        </div>
      )}
    </div>
  );
}