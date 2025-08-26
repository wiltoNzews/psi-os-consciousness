import React, { useRef, useEffect, useState } from 'react';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';
import { motion } from 'framer-motion';

interface NeuralResonanceProps {
  domain: DomainType;
  className?: string;
  temporalFactor?: number;
}

/**
 * NeuralResonance - Creates a subtle responsive connection between human focus and the interface
 * This component generates gentle pulse waves that emanate from points of focus, creating the
 * sensation that the system is responding to your thoughts and intentions.
 */
export function NeuralResonance({
  domain,
  className = '',
  temporalFactor = 1
}: NeuralResonanceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [clicks, setClicks] = useState<{x: number, y: number, time: number, strength: number}[]>([]);
  const [focusPoint, setFocusPoint] = useState<{x: number, y: number, strength: number}>({ x: 0, y: 0, strength: 0 });
  const [stillnessTime, setStillnessTime] = useState(0);
  const lastMoveRef = useRef<{x: number, y: number, time: number}>({ x: 0, y: 0, time: Date.now() });
  const rafRef = useRef<number>(0);
  
  // Get domain-specific colors
  const getDomainColor = () => {
    const config = domainConfigs[domain];
    return config.color;
  };
  
  const primaryColor = getDomainColor();
  
  // Parse color into RGB components
  const getRGBComponents = (hex: string) => {
    let r = 255, g = 255, b = 255;
    
    if (hex.startsWith('#')) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    
    return { r, g, b };
  };
  
  const rgb = getRGBComponents(primaryColor);
  
  // Handle mouse movement for focus detection with improved throttling
  useEffect(() => {
    // Use animation frame for smoother updates
    let animationFrameId: number | null = null;
    let pendingMove: {x: number, y: number, time: number} | null = null;
    
    const processPendingMove = () => {
      if (pendingMove) {
        const currentTime = pendingMove.time;
        const dx = pendingMove.x - lastMoveRef.current.x;
        const dy = pendingMove.y - lastMoveRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeDiff = currentTime - lastMoveRef.current.time;
        
        // Only update if significant movement or time has passed - increased threshold
        if (distance > 15 || timeDiff > 150) {
          // Reset stillness time when moving
          setStillnessTime(0);
          
          // Update focus point - reduced strength increase for smoother transition
          const newStrength = Math.min(focusPoint.strength + 0.05, 0.8);
          setFocusPoint({
            x: pendingMove.x,
            y: pendingMove.y,
            strength: newStrength
          });
          
          // Update last move
          lastMoveRef.current = {
            x: pendingMove.x,
            y: pendingMove.y,
            time: currentTime
          };
        }
        
        pendingMove = null;
      }
      animationFrameId = null;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Store the current move
      pendingMove = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
      };
      
      // Only schedule a new animation frame if one isn't already pending
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(processPendingMove);
      }
    };
    
    // Detect clicks for stronger pulses
    const handleClick = (e: MouseEvent) => {
      // Add a new click pulse
      setClicks(prev => [
        ...prev,
        { 
          x: e.clientX, 
          y: e.clientY, 
          time: Date.now(),
          strength: 0.9 // Initial strength
        }
      ]);
      
      // Boost focus strength
      setFocusPoint(prev => ({
        ...prev,
        strength: 1.0
      }));
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    // Start stillness detection interval
    const stillnessInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastMove = currentTime - lastMoveRef.current.time;
      
      // If no movement for a while, increase stillness time
      if (timeSinceLastMove > 300) {
        setStillnessTime(prev => prev + 0.1);
        
        // As stillness increases, decrease focus strength
        setFocusPoint(prev => ({
          ...prev,
          strength: Math.max(prev.strength - 0.02, 0.1)
        }));
      }
    }, 100);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      clearInterval(stillnessInterval);
      
      // Cancel any pending animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [domain]);
  
  // Draw the resonance effect
  useEffect(() => {
    if (!canvasRef.current) return;
    
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
    
    // Animation function
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw focus waves (constant gentle waves around focus point)
      const drawFocusWaves = () => {
        const { x, y, strength } = focusPoint;
        
        if (strength > 0.05) {
          // Create multiple waves with different phases
          for (let i = 0; i < 3; i++) {
            const phase = (Date.now() / (1000 + i * 300)) % 1; // Cycle every 1-2 seconds
            const maxRadius = 100 + i * 50;
            const radius = phase * maxRadius;
            const opacity = (1 - phase) * 0.2 * strength;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx.lineWidth = 0.7 * temporalFactor;
            ctx.stroke();
            
            // Add slight glow
            if (phase > 0.2 && phase < 0.5) {
              ctx.beginPath();
              ctx.arc(x, y, radius * 0.95, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
              ctx.lineWidth = 0.5 * temporalFactor;
              ctx.stroke();
            }
          }
          
          // Central glow
          const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
          centerGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 * strength})`);
          centerGradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
          ctx.fillStyle = centerGradient;
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      
      // Draw click pulses (stronger waves from clicks)
      const drawClickPulses = () => {
        const currentTime = Date.now();
        const updatedClicks = clicks.filter(click => {
          const age = currentTime - click.time;
          if (age > 2000) return false; // Remove old clicks
          
          // Calculate wave size based on age
          const phase = age / 2000; // 0 to 1 over 2 seconds
          const radius = phase * 150 * temporalFactor; // Max radius 150px
          const opacity = (1 - phase) * click.strength;
          
          // Draw expanding circle
          ctx.beginPath();
          ctx.arc(click.x, click.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
          ctx.lineWidth = 1.2 * temporalFactor;
          ctx.stroke();
          
          // Inner glow
          ctx.beginPath();
          ctx.arc(click.x, click.y, radius * 0.9, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
          ctx.lineWidth = 0.7 * temporalFactor;
          ctx.stroke();
          
          return true; // Keep this click
        });
        
        // Update clicks array with only current ones
        if (updatedClicks.length !== clicks.length) {
          setClicks(updatedClicks);
        }
      };
      
      // Draw stillness effects (when user is not moving)
      const drawStillnessEffects = () => {
        if (stillnessTime > 3) {
          // When still for a longer time, start creating ambient resonance patterns
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          
          // Subtle ambient waves
          for (let i = 0; i < 2; i++) {
            const timeOffset = i * 1000;
            const phase = ((Date.now() + timeOffset) / 5000) % 1;
            const radius = 200 + phase * 200;
            const opacity = (1 - phase) * 0.15;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx.lineWidth = 0.7 * temporalFactor;
            ctx.stroke();
          }
        }
      };
      
      // Execute drawing functions
      drawStillnessEffects();
      drawFocusWaves();
      drawClickPulses();
      
      // Continue animation
      rafRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    rafRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [focusPoint, clicks, stillnessTime, temporalFactor, rgb, domain]);
  
  return (
    <div className={`fixed inset-0 pointer-events-none z-40 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Awareness pulse indicator - only visible during focus */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          left: focusPoint.x,
          top: focusPoint.y,
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: primaryColor,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 10px ${primaryColor}`
        }}
        animate={{
          opacity: focusPoint.strength > 0.1 ? [0.6, 0.8, 0.6] : 0
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}