import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDomain } from '@/contexts/DomainContext';

interface DataFlowProps {
  domain: 'finance' | 'crypto' | 'sports' | 'general';
}

/**
 * HumanAIBridge - A visual component that displays the symbiotic relationship
 * between human intelligence and AI processing in real-time
 */
export function HumanAIBridge({ domain = 'general' }: DataFlowProps) {
  const { domainConfig } = useDomain();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  // Particles for the data flow visualization
  interface Particle {
    x: number;
    y: number;
    directionX: number;
    directionY: number;
    size: number;
    color: string;
    speed: number;
    type: 'human' | 'ai';
    lifespan: number;
    opacity: number;
    active: boolean;
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    
    // Set canvas size based on container
    const updateCanvasSize = () => {
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    // Initialize particles
    const particles: Particle[] = [];
    const particleCount = 150;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Color based on domain
    const humanColor = '#ffffff';
    const aiColor = domainConfig.accentColor;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 1;
      const type = Math.random() > 0.5 ? 'human' : 'ai';
      const x = type === 'human' 
        ? Math.random() * (canvas.width * 0.4) 
        : Math.random() * (canvas.width * 0.4) + (canvas.width * 0.6);
      const y = Math.random() * canvas.height;
      const directionX = type === 'human' ? Math.random() * 2 : -Math.random() * 2;
      const directionY = Math.random() * 1 - 0.5;
      const color = type === 'human' ? humanColor : aiColor;
      const speed = Math.random() * 0.5 + 0.2;
      const lifespan = Math.random() * 100 + 100;
      const opacity = Math.random() * 0.5 + 0.3;
      const active = Math.random() > 0.3;
      
      particles.push({
        x,
        y,
        directionX,
        directionY,
        size,
        color,
        speed,
        type,
        lifespan,
        opacity,
        active
      });
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the central bridge/connection
      const centerY = canvas.height / 2;
      const leftX = canvas.width * 0.4;
      const rightX = canvas.width * 0.6;
      
      // Draw gradient bridge
      const gradient = ctx.createLinearGradient(leftX, centerY, rightX, centerY);
      gradient.addColorStop(0, humanColor);
      gradient.addColorStop(1, aiColor);
      
      ctx.beginPath();
      ctx.moveTo(leftX, centerY - 30);
      ctx.lineTo(rightX, centerY - 20);
      ctx.lineTo(rightX, centerY + 20);
      ctx.lineTo(leftX, centerY + 30);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.15;
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Draw bridge borders
      ctx.beginPath();
      ctx.moveTo(leftX, centerY - 30);
      ctx.lineTo(rightX, centerY - 20);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(leftX, centerY + 30);
      ctx.lineTo(rightX, centerY + 20);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw human side label
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText('Human Intelligence', leftX - 70, centerY);
      
      // Draw AI side label
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText('AI Processing', rightX + 70, centerY);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        if (!p.active) {
          // Skip inactive particles
          continue;
        }
        
        // Move particles
        p.x += p.directionX * p.speed;
        p.y += p.directionY * p.speed;
        p.lifespan -= 1;
        
        // Fade out particles near the end of their lifespan
        if (p.lifespan < 20) {
          p.opacity = p.lifespan / 20 * 0.5;
        }
        
        // Human particles going to AI side
        if (p.type === 'human' && p.x > canvas.width * 0.6) {
          p.lifespan = 0;
        }
        
        // AI particles going to human side
        if (p.type === 'ai' && p.x < canvas.width * 0.4) {
          p.lifespan = 0;
        }
        
        // Reset particles when they're out of bounds or lifespan ends
        if (
          p.lifespan <= 0 || 
          p.x < 0 || 
          p.x > canvas.width || 
          p.y < 0 || 
          p.y > canvas.height
        ) {
          // Reset based on type
          p.type = Math.random() > 0.5 ? 'human' : 'ai';
          p.x = p.type === 'human' 
            ? Math.random() * (canvas.width * 0.35) 
            : Math.random() * (canvas.width * 0.35) + (canvas.width * 0.65);
          p.y = Math.random() * canvas.height;
          p.directionX = p.type === 'human' ? Math.random() * 2 : -Math.random() * 2;
          p.directionY = Math.random() * 1 - 0.5;
          p.color = p.type === 'human' ? humanColor : aiColor;
          p.lifespan = Math.random() * 100 + 100;
          p.opacity = Math.random() * 0.5 + 0.3;
          p.active = Math.random() > 0.3;
        }
        
        // Draw particles
        ctx.beginPath();
        ctx.globalAlpha = p.opacity;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Draw connector lines for particles near the bridge
        if (
          p.x > leftX - 20 && 
          p.x < rightX + 20 && 
          p.y > centerY - 40 && 
          p.y < centerY + 40
        ) {
          // Find nearest point on the bridge
          let targetX = p.x;
          let targetY = centerY;
          
          if (p.x < leftX) targetX = leftX;
          if (p.x > rightX) targetX = rightX;
          
          // Draw connector line with opacity based on distance
          const distance = Math.sqrt(
            Math.pow(p.x - targetX, 2) + Math.pow(p.y - targetY, 2)
          );
          
          if (distance < 40) {
            const lineOpacity = 0.5 - (distance / 40) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(targetX, targetY);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineOpacity;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      
      // Draw pulse effect in the middle of the bridge
      const pulseX = canvas.width / 2;
      const pulseY = centerY;
      const pulseRadius = 15 + Math.sin(Date.now() / 500) * 5;
      
      const pulseGradient = ctx.createRadialGradient(
        pulseX, pulseY, 0, 
        pulseX, pulseY, pulseRadius * 2
      );
      
      pulseGradient.addColorStop(0, `rgba(255, 255, 255, 0.6)`);
      pulseGradient.addColorStop(0.5, `rgba(255, 255, 255, 0.2)`);
      pulseGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = pulseGradient;
      ctx.fill();
      
      // Draw symbiosis text
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText('SYMBIOSIS', pulseX, pulseY + pulseRadius + 20);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [domainConfig]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-[300px] md:h-[400px] bg-black bg-opacity-20 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10",
      )}
      style={{ 
        backgroundImage: `linear-gradient(to bottom right, ${domainConfig.gradientFrom}, ${domainConfig.gradientTo})`,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
        />
      </motion.div>
      
      {/* Domain indicator */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/30 text-white/90 text-xs flex items-center">
        <span>Domain: </span>
        <span className="ml-1 font-medium">{domainConfig.name}</span>
      </div>
      
      {/* Performance indicators */}
      <div className="absolute bottom-4 left-4 flex gap-3">
        <div className="px-3 py-1 rounded-full bg-black/30 text-white/90 text-xs flex items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
          <span>Data Flow: Active</span>
        </div>
        <div className="px-3 py-1 rounded-full bg-black/30 text-white/90 text-xs flex items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
          <span>Latency: 32ms</span>
        </div>
      </div>
      
      {/* Symbiosis status indicator */}
      <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/30 text-xs">
        <span className="text-white/90">Symbiosis Status: </span>
        <span className="text-green-400 font-medium">Optimal</span>
      </div>
    </div>
  );
}