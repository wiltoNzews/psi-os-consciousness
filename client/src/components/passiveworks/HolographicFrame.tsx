import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';

interface HolographicFrameProps {
  domain: DomainType;
  className?: string;
  active?: boolean;
}

/**
 * HolographicFrame - Creates a beautiful aesthetic glass-like lens effect
 * This is the final layer that creates a visual field through which all other layers
 * are seen, bringing harmony and beauty to the experience.
 */
export function HolographicFrame({
  domain,
  className = '',
  active = true,
}: HolographicFrameProps) {
  const [irisPosition, setIrisPosition] = useState({ x: 50, y: 50 });
  const [lightIntensity, setLightIntensity] = useState(0.05);
  const [breathePhase, setBreathePhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  
  // Get domain-specific color with fallbacks
  const getDomainColor = () => {
    const config = domainConfigs[domain];
    // Get a softer version of the domain color
    if (config.gradientFrom) return config.gradientFrom;
    const color = config.color;
    if (color === 'purple') return '#d4c0ed';
    if (color.startsWith('#')) return color;
    return '#f5eeff'; // Soft white-purple fallback
  };
  
  // Create "breathing" effect
  useEffect(() => {
    if (!active) return;
    
    // Subtle breathing animation
    const interval = setInterval(() => {
      setBreathePhase(prev => (prev + 0.01) % 1);
    }, 50);
    
    return () => clearInterval(interval);
  }, [active]);
  
  // Subtle light effect follows mouse with inertia
  useEffect(() => {
    if (!active) return;
    
    let lastX = irisPosition.x;
    let lastY = irisPosition.y;
    let velocityX = 0;
    let velocityY = 0;
    const inertiaFactor = 0.92; // How quickly movement slows (0-1)
    const responsiveness = 0.12; // How responsive to mouse (0-1)

    const handleMouseMove = (e: MouseEvent) => {
      const targetX = (e.clientX / window.innerWidth) * 100;
      const targetY = (e.clientY / window.innerHeight) * 100;
      
      // Apply inertia
      velocityX = velocityX * inertiaFactor + (targetX - lastX) * responsiveness;
      velocityY = velocityY * inertiaFactor + (targetY - lastY) * responsiveness;
      
      // Increase light intensity with movement
      const movementAmount = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      if (movementAmount > 0.5) {
        setLightIntensity(prev => Math.min(0.15, prev + 0.01));
      }
    };
    
    // Animation loop for smooth movement
    const animate = () => {
      if (!active) return;
      
      // Apply velocity
      lastX += velocityX;
      lastY += velocityY;
      
      // Update position
      setIrisPosition({ x: lastX, y: lastY });
      
      // Gradually reduce intensity
      setLightIntensity(prev => {
        if (prev > 0.05) return prev * 0.99;
        return 0.05;
      });
      
      // Decay velocity
      velocityX *= inertiaFactor;
      velocityY *= inertiaFactor;
      
      requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [active]);
  
  // Lens flare effect on canvas
  useEffect(() => {
    if (!canvasRef.current || !active) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match window
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Animation function to create subtle lens effect
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get dimensions
      const width = canvas.width;
      const height = canvas.height;
      
      // Positions for lens flares
      const x = (irisPosition.x / 100) * width;
      const y = (irisPosition.y / 100) * height;
      
      // Create subtle lens flare
      // Main glow
      const sinBreathing = Math.sin(breathePhase * Math.PI * 2) * 0.4 + 0.6;
      
      // Draw extremely subtle lens flares
      const drawLensFlare = (centerX: number, centerY: number, size: number, opacity: number) => {
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.fill();
      };
      
      // Main subtle flare that follows mouse
      drawLensFlare(x, y, width * 0.15, 0.02 * lightIntensity * sinBreathing);
      
      // Opposite flare (optical effect)
      const oppositeX = width - x;
      const oppositeY = height - y;
      drawLensFlare(oppositeX, oppositeY, width * 0.05, 0.01 * lightIntensity * sinBreathing);
      
      // Draw a few random small flares
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * width * 0.3;
        const flareX = x + Math.cos(angle) * distance;
        const flareY = y + Math.sin(angle) * distance;
        
        drawLensFlare(
          flareX, 
          flareY, 
          width * 0.02 * Math.random(), 
          0.005 * lightIntensity * Math.random() * sinBreathing
        );
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [active, irisPosition.x, irisPosition.y, lightIntensity, breathePhase, domain]);
  
  const primaryColor = getDomainColor();
  const primaryOpacity = "03";
  
  return (
    <motion.div
      ref={frameRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      {/* Lens flare canvas effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Ethereal lens effect overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 20%, ${primaryColor}${primaryOpacity} 150%)`,
          opacity: 0.3 + Math.sin(breathePhase * Math.PI * 2) * 0.05
        }}
      />
      
      {/* Extremely subtle aberration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)`,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Vignette with breathing animation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 150px rgba(0,0,0,${0.1 + Math.sin(breathePhase * Math.PI * 2) * 0.05})`,
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Floating particle layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="h-full w-full relative">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full opacity-10"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                backgroundColor: 'white',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-${i} ${Math.random() * 15 + 20}s infinite linear`,
                transform: `translateY(${Math.sin((breathePhase + i * 0.2) * Math.PI * 2) * 10}px)`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Global styling for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-0 {
          0% { transform: translate(0, 0); }
          33% { transform: translate(20px, 15px); }
          66% { transform: translate(-10px, 30px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-1 {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-15px, 10px); }
          65% { transform: translate(15px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0); }
          20% { transform: translate(10px, -15px); }
          70% { transform: translate(-20px, 10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-3 {
          0% { transform: translate(0, 0); }
          30% { transform: translate(-10px, -20px); }
          60% { transform: translate(20px, 15px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-4 {
          0% { transform: translate(0, 0); }
          20% { transform: translate(20px, 10px); }
          55% { transform: translate(-15px, -10px); }
          100% { transform: translate(0, 0); }
        }
      `}} />
    </motion.div>
  );
}