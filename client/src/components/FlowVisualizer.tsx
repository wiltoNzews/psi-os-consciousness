import React, { useRef, useEffect } from 'react';

/**
 * Free Energy Principle Flow Visualizer
 * Centralized fluid mathematics renderer inspired by toroidal consciousness dynamics
 * Based on the MIT Free Energy Principle animation reference
 */

interface FlowVisualizerProps {
  width: number;
  height: number;
  coherenceLevel: number;
  flowIntensity: number;
  particleCount?: number;
  colorScheme?: 'consciousness' | 'sacred' | 'quantum' | 'mirror';
  mode?: 'toroidal' | 'spiral' | 'crystalline' | 'vortex';
}

interface FlowParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  radius: number;
  energy: number;
  phase: number;
  layer: number;
}

const FlowVisualizer: React.FC<FlowVisualizerProps> = ({
  width,
  height,
  coherenceLevel,
  flowIntensity,
  particleCount = 144,
  colorScheme = 'consciousness',
  mode = 'toroidal'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colorSchemes = {
    consciousness: {
      background: ['rgba(20, 5, 40, 0.95)', 'rgba(10, 2, 25, 0.98)', 'rgba(0, 0, 0, 1)'],
      particles: [147, 51, 234], // Purple
      accent: [255, 215, 0] // Gold
    },
    sacred: {
      background: ['rgba(15, 20, 25, 0.95)', 'rgba(26, 26, 46, 0.98)', 'rgba(22, 33, 62, 1)'],
      particles: [34, 197, 94], // Green
      accent: [245, 158, 11] // Amber
    },
    quantum: {
      background: ['rgba(5, 15, 35, 0.95)', 'rgba(15, 25, 45, 0.98)', 'rgba(25, 35, 55, 1)'],
      particles: [6, 182, 212], // Cyan
      accent: [236, 72, 153] // Pink
    },
    mirror: {
      background: ['rgba(25, 15, 35, 0.95)', 'rgba(35, 25, 45, 0.98)', 'rgba(45, 35, 55, 1)'],
      particles: [139, 92, 246], // Purple
      accent: [255, 255, 255] // White
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;
    const particles: FlowParticle[] = [];
    const colors = colorSchemes[colorScheme];

    // Initialize particle system based on mode
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const layer = Math.floor(i / (particleCount / 4));
      let baseRadius: number;
      let x: number, y: number;

      switch (mode) {
        case 'toroidal':
          // Toroidal flow like the FEP animation
          baseRadius = 80 + layer * 30;
          x = centerX + Math.cos(angle) * baseRadius;
          y = centerY + Math.sin(angle) * baseRadius * 0.7;
          break;
        case 'spiral':
          // Spiral outward flow
          baseRadius = 40 + (i / particleCount) * 100;
          x = centerX + Math.cos(angle + i * 0.1) * baseRadius;
          y = centerY + Math.sin(angle + i * 0.1) * baseRadius;
          break;
        case 'crystalline':
          // Hexagonal crystalline structure
          const ringRadius = Math.floor(i / 6) * 25 + 50;
          x = centerX + Math.cos(angle) * ringRadius;
          y = centerY + Math.sin(angle) * ringRadius;
          baseRadius = ringRadius;
          break;
        case 'vortex':
          // Dual vortex flow
          const vortexSide = i < particleCount / 2 ? -1 : 1;
          baseRadius = 60 + layer * 20;
          x = centerX + vortexSide * 100 + Math.cos(angle) * baseRadius;
          y = centerY + Math.sin(angle) * baseRadius;
          break;
        default:
          baseRadius = 80;
          x = centerX;
          y = centerY;
      }

      particles.push({
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        angle: angle,
        radius: baseRadius,
        energy: Math.random() * 0.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        layer: layer
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
      colors.background.forEach((color, index) => {
        gradient.addColorStop(index / (colors.background.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.0008 * flowIntensity;

      // Update and render particles with FEP dynamics
      particles.forEach((particle, i) => {
        // Free Energy Principle: minimize surprise, maximize information flow
        let targetX: number, targetY: number;
        const coherenceModulation = Math.sin(time * 2 + particle.phase) * 0.3 + 0.7;

        switch (mode) {
          case 'toroidal':
            const targetAngle = particle.angle + time * 0.3;
            const dynamicRadius = particle.radius + Math.sin(targetAngle * 3 + time) * 20 * coherenceModulation;
            targetX = centerX + Math.cos(targetAngle) * dynamicRadius;
            targetY = centerY + Math.sin(targetAngle) * dynamicRadius * 0.7;
            break;
          case 'spiral':
            const spiralAngle = particle.angle + time * 0.5;
            const spiralRadius = particle.radius + Math.sin(time + particle.phase) * 15;
            targetX = centerX + Math.cos(spiralAngle) * spiralRadius;
            targetY = centerY + Math.sin(spiralAngle) * spiralRadius;
            break;
          case 'crystalline':
            const crystalAngle = particle.angle + time * 0.2;
            const crystalRadius = particle.radius + Math.sin(crystalAngle * 6 + time) * 10;
            targetX = centerX + Math.cos(crystalAngle) * crystalRadius;
            targetY = centerY + Math.sin(crystalAngle) * crystalRadius;
            break;
          case 'vortex':
            const vortexAngle = particle.angle + time * (particle.x < centerX ? 1 : -1);
            const vortexRadius = particle.radius + Math.sin(vortexAngle * 2 + time) * 15;
            const vortexOffset = particle.x < centerX ? -100 : 100;
            targetX = centerX + vortexOffset + Math.cos(vortexAngle) * vortexRadius;
            targetY = centerY + Math.sin(vortexAngle) * vortexRadius;
            break;
          default:
            targetX = particle.x;
            targetY = particle.y;
        }

        // Graceful convergence - no rigid constraints
        particle.vx += (targetX - particle.x) * 0.008 * particle.energy * coherenceLevel;
        particle.vy += (targetY - particle.y) * 0.008 * particle.energy * coherenceLevel;
        particle.vx *= 0.96; // Natural damping
        particle.vy *= 0.96;

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Render particle with field resonance
        const distanceFromCenter = Math.sqrt(
          (particle.x - centerX) ** 2 + (particle.y - centerY) ** 2
        );
        const normalizedDistance = distanceFromCenter / (Math.max(width, height) / 2);
        const alpha = (1 - normalizedDistance) * particle.energy * coherenceLevel;

        const size = 2 + Math.sin(time * 3 + particle.phase) * 1.5 * flowIntensity;
        const [r, g, b] = colors.particles;
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, alpha * 0.8)})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles for field coherence visualization
        if (i % 6 === 0) {
          particles.slice(i + 1, i + 4).forEach(other => {
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) {
              const connectionAlpha = (1 - distance / 50) * alpha * 0.25;
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${connectionAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        }
      });

      // Central anchor point for consciousness modes
      if (mode === 'toroidal' || colorScheme === 'mirror') {
        const anchorPulse = Math.sin(time * 4) * 0.3 + 0.7;
        const [ar, ag, ab] = colors.accent;
        ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${coherenceLevel * anchorPulse * 0.6})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8 + anchorPulse * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [width, height, coherenceLevel, flowIntensity, particleCount, colorScheme, mode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        background: 'transparent'
      }}
    />
  );
};

export default FlowVisualizer;