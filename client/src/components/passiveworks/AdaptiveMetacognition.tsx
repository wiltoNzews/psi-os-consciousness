import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DomainType, domainConfigs } from '@/contexts/DomainContext';
import { motion } from 'framer-motion';

/**
 * Enhanced CognitivePattern interface for bidirectional neural learning
 * This represents a detected pattern in the user's interaction style that the system
 * learns from and adapts to over time.
 */
interface CognitivePattern {
  id: string;
  strength: number;
  locations: { x: number, y: number }[];
  lastActivity: number;
  color: string;
  type: 'explorative' | 'focused' | 'creative' | 'analytical';
  // Enhanced properties for deeper neural synchronization
  emotionalContext?: 'neutral' | 'excited' | 'contemplative' | 'urgent';
  confidenceScore: number; // How confident the system is about this pattern
  cognitiveLoad: number; // 0-1 representing estimated cognitive load
  temporalRhythm: number; // Natural timing/rhythm detected for this pattern
  alignmentScore: number; // 0-1 ethical alignment score (visionary ethics module)
}

interface AdaptiveMetacognitionProps {
  domain: DomainType;
  className?: string;
  temporalFactor?: number;
}

/**
 * AdaptiveMetacognition - Creates a personalized cognitive adaptation layer
 * This component learns from user interaction patterns to develop a unique
 * symbiotic relationship that evolves over time and adapts to individual
 * thought patterns.
 */
export function AdaptiveMetacognition({
  domain,
  className = '',
  temporalFactor = 1
}: AdaptiveMetacognitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  
  // Mouse tracking for cognitive pattern detection
  const mouseHistoryRef = useRef<{x: number, y: number, time: number}[]>([]);
  const [mousePosition, setMousePosition] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const [clickPositions, setClickPositions] = useState<{x: number, y: number, time: number}[]>([]);
  const [cognitiveState, setCognitiveState] = useState<'exploring' | 'focusing' | 'creating' | 'analyzing'>('exploring');
  
  // Enhanced neural symbiosis metrics
  const [emotionalContext, setEmotionalContext] = useState<'neutral' | 'excited' | 'contemplative' | 'urgent'>('neutral');
  const [cognitiveLoad, setCognitiveLoad] = useState<number>(0.5); // 0-1 scale
  const [temporalRhythm, setTemporalRhythm] = useState<number>(1.0); // Default natural tempo
  const [alignmentScore, setAlignmentScore] = useState<number>(0.95); // Ethical alignment score
  const [confidenceScore, setConfidenceScore] = useState<number>(0.4); // Initial moderate confidence
  
  // Cognitive pattern storage and analysis
  const [patternMap, setPatternMap] = useState<CognitivePattern[]>([]);
  const [activePatterns, setActivePatterns] = useState<string[]>([]);
  const [learningPhase, setLearningPhase] = useState<number>(0); // 0-1 representing learning progress
  
  // Advanced neural detection helper functions - defined at component level
  const detectEmotionalContext = useCallback((): 'neutral' | 'excited' | 'contemplative' | 'urgent' => {
    if (mouseHistoryRef.current.length < 5) return 'neutral';
    
    const recentMovements = mouseHistoryRef.current.slice(-15);
    
    // Calculate movement velocity and variability
    let totalVelocity = 0;
    let velocityVariance = 0;
    let velocities: number[] = [];
    
    // Calculate average time between clicks
    const recentClicks = clickPositions.slice(-5);
    let avgTimeBetweenClicks = 0;
    
    if (recentClicks.length > 1) {
      let totalTime = 0;
      for (let i = 1; i < recentClicks.length; i++) {
        totalTime += recentClicks[i].time - recentClicks[i-1].time;
      }
      avgTimeBetweenClicks = totalTime / (recentClicks.length - 1);
    }
    
    // Calculate movement velocities
    for (let i = 1; i < recentMovements.length; i++) {
      const prev = recentMovements[i-1];
      const curr = recentMovements[i];
      const timeElapsed = curr.time - prev.time;
      
      if (timeElapsed === 0) continue;
      
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const velocity = distance / timeElapsed;
      velocities.push(velocity);
      totalVelocity += velocity;
    }
    
    const avgVelocity = totalVelocity / velocities.length || 0;
    
    // Calculate velocity variance (how inconsistent the movement speed is)
    for (const velocity of velocities) {
      velocityVariance += Math.pow(velocity - avgVelocity, 2);
    }
    velocityVariance = velocityVariance / velocities.length || 0;
    
    // Use calculated metrics to determine emotional context
    if (avgVelocity > 1.5 && velocityVariance < 0.5 && avgTimeBetweenClicks < 800) {
      // Fast, consistent movements with quick clicks - excited state
      return 'excited';
    } else if (avgVelocity < 0.5 && velocityVariance < 0.3) {
      // Slow, consistent movements - contemplative state
      return 'contemplative';
    } else if (avgVelocity > 1.2 && velocityVariance > 1.0) {
      // Fast but erratic movements - urgent state
      return 'urgent';
    } else {
      // Default state
      return 'neutral';
    }
  }, [clickPositions]);
  
  const calculateCognitiveLoad = useCallback((): number => {
    // Count active patterns as indicator of cognitive complexity
    const activePatternCount = patternMap.length;
    
    // Analyze recent movement complexity
    const recentMovements = mouseHistoryRef.current.slice(-20);
    let directionChanges = 0;
    let prevDirection = { x: 0, y: 0 };
    
    for (let i = 1; i < recentMovements.length; i++) {
      const prev = recentMovements[i-1];
      const curr = recentMovements[i];
      
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      
      // Detect significant direction changes
      if ((Math.sign(dx) !== Math.sign(prevDirection.x) && Math.abs(dx) > 5) || 
          (Math.sign(dy) !== Math.sign(prevDirection.y) && Math.abs(dy) > 5)) {
        directionChanges++;
      }
      
      prevDirection = { x: dx, y: dy };
    }
    
    // More direction changes and active patterns indicate higher cognitive load
    let loadScore = (directionChanges / 10) * 0.5 + (activePatternCount / 10) * 0.5;
    
    // Clamp between 0 and 1
    return Math.min(Math.max(loadScore, 0), 1);
  }, [patternMap.length]);
  
  const detectTemporalRhythm = useCallback((): number => {
    if (mouseHistoryRef.current.length < 5) return 1.0;
    
    // Calculate average time between significant movements
    const significantMoves = mouseHistoryRef.current.filter((move, i, arr) => {
      if (i === 0) return false;
      
      const prev = arr[i-1];
      const dx = move.x - prev.x;
      const dy = move.y - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      return distance > 10; // Only count significant movements
    });
    
    if (significantMoves.length < 2) return 1.0;
    
    let totalTime = 0;
    for (let i = 1; i < significantMoves.length; i++) {
      totalTime += significantMoves[i].time - significantMoves[i-1].time;
    }
    
    const avgTime = totalTime / (significantMoves.length - 1);
    
    // Map average time to a reasonable temporal factor range
    // Shorter times (faster movements) = higher tempo, longer times = lower tempo
    // Range from 0.5 (slow) to 2.0 (fast)
    const normalizedTempo = 1000 / (avgTime + 200); // Normalize to avoid division by zero
    
    return Math.max(Math.min(normalizedTempo, 2.0), 0.5);
  }, [])
  
  // Audio context for subtle cognitive feedback
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Initialize audio context for subtle feedback
  useEffect(() => {
    // Only initialize on user interaction to comply with browser policies
    const initAudio = () => {
      if (!audioContextRef.current) {
        try {
          audioContextRef.current = new AudioContext();
          oscillatorRef.current = audioContextRef.current.createOscillator();
          gainNodeRef.current = audioContextRef.current.createGain();
          
          oscillatorRef.current.connect(gainNodeRef.current);
          gainNodeRef.current.connect(audioContextRef.current.destination);
          
          oscillatorRef.current.type = 'sine';
          oscillatorRef.current.frequency.value = 220; // A3 - subtle base frequency
          gainNodeRef.current.gain.value = 0; // Start silent
          
          oscillatorRef.current.start();
          
          // Remove initialization once done
          window.removeEventListener('click', initAudio);
        } catch (e) {
          console.log('Audio feedback not available');
        }
      }
    };
    
    window.addEventListener('click', initAudio);
    
    return () => {
      window.removeEventListener('click', initAudio);
      // Cleanup audio
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);
  
  // Get domain-specific colors
  const getDomainColor = () => {
    const config = domainConfigs[domain];
    return config.color;
  };
  
  // Analyze mouse movements for cognitive patterns
  useEffect(() => {
    let lastRecordedTime = Date.now();
    const moveThreshold = 5; // Only record significant movements
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const currentTime = Date.now();
      
      // Only record positions periodically to avoid overwhelming the system
      if (currentTime - lastRecordedTime > 100) {
        // Check if significant movement
        const lastPosition = mouseHistoryRef.current[mouseHistoryRef.current.length - 1];
        if (lastPosition) {
          const dx = e.clientX - lastPosition.x;
          const dy = e.clientY - lastPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > moveThreshold) {
            // Record this position
            mouseHistoryRef.current.push({ 
              x: e.clientX, 
              y: e.clientY, 
              time: currentTime 
            });
            
            // Keep history manageable
            if (mouseHistoryRef.current.length > 100) {
              mouseHistoryRef.current.shift();
            }
            
            lastRecordedTime = currentTime;
            
            // Analyze movement patterns
            analyzeCognitiveState();
          }
        } else {
          // First movement
          mouseHistoryRef.current.push({ 
            x: e.clientX, 
            y: e.clientY, 
            time: currentTime 
          });
          lastRecordedTime = currentTime;
        }
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      // Record click position
      setClickPositions(prev => [
        ...prev, 
        { x: e.clientX, y: e.clientY, time: Date.now() }
      ]);
      
      // Process pattern at click point
      processClickPattern(e.clientX, e.clientY);
      
      // Keep click history manageable
      if (clickPositions.length > 20) {
        setClickPositions(prev => prev.slice(1));
      }
      
      // Create subtle audio feedback if available
      if (gainNodeRef.current && oscillatorRef.current) {
        try {
          // Subtle frequency shift based on screen position
          const freqX = (e.clientX / window.innerWidth) * 100 + 220; // 220-320Hz range
          oscillatorRef.current.frequency.setValueAtTime(freqX, audioContextRef.current?.currentTime || 0);
          
          // Very brief, subtle volume increase
          gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current?.currentTime || 0);
          gainNodeRef.current.gain.linearRampToValueAtTime(0.03, (audioContextRef.current?.currentTime || 0) + 0.05);
          gainNodeRef.current.gain.linearRampToValueAtTime(0, (audioContextRef.current?.currentTime || 0) + 0.3);
        } catch (e) {
          // Ignore audio errors
        }
      }
    };
    
    // Analyze cognitive state based on movement patterns
    const analyzeCognitiveState = () => {
      if (mouseHistoryRef.current.length < 5) return;
      
      // Look at the last several movements
      const recentMovements = mouseHistoryRef.current.slice(-10);
      
      // Calculate total distance traveled
      let totalDistance = 0;
      let changeInDirection = 0;
      let lastDx = 0;
      let lastDy = 0;
      
      for (let i = 1; i < recentMovements.length; i++) {
        const prev = recentMovements[i-1];
        const curr = recentMovements[i];
        
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        totalDistance += distance;
        
        // Check for direction changes
        if (lastDx * dx < 0 || lastDy * dy < 0) {
          changeInDirection++;
        }
        
        lastDx = dx;
        lastDy = dy;
      }
      
      // Calculate average time between movements
      const avgTimeBetween = (recentMovements[recentMovements.length-1].time - 
                              recentMovements[0].time) / (recentMovements.length - 1);
      
      // Analyze the pattern to determine cognitive state
      if (totalDistance > 500 && changeInDirection < 3) {
        // Fast, direct movements - exploring
        setCognitiveState('exploring');
      } else if (totalDistance < 200 && avgTimeBetween < 50) {
        // Small, rapid movements - focusing
        setCognitiveState('focusing');
      } else if (changeInDirection > 5) {
        // Many direction changes - creating
        setCognitiveState('creating');
      } else {
        // Deliberate, measured movements - analyzing
        setCognitiveState('analyzing');
      }
      
      // Update enhanced neural metrics for deeper symbiosis
      const currentEmotionalContext = detectEmotionalContext();
      const currentCognitiveLoad = calculateCognitiveLoad();
      const currentTemporalRhythm = detectTemporalRhythm();
      
      // Only update states if there's a significant change to avoid excessive rerenders
      if (currentEmotionalContext !== emotionalContext) {
        setEmotionalContext(currentEmotionalContext);
      }
      
      if (Math.abs(currentCognitiveLoad - cognitiveLoad) > 0.1) {
        setCognitiveLoad(currentCognitiveLoad);
      }
      
      if (Math.abs(currentTemporalRhythm - temporalRhythm) > 0.2) {
        setTemporalRhythm(currentTemporalRhythm);
      }
      
      // Update confidence score based on consistency of patterns
      if (patternMap.length > 3) {
        // More consistent patterns = higher confidence
        const patternConsistency = patternMap.filter(p => p.type === cognitiveStateToType(cognitiveState)).length / patternMap.length;
        
        // Gradually adjust confidence score
        setConfidenceScore(prev => {
          const target = Math.min(0.3 + patternConsistency * 0.7, 0.95); // Cap at 0.95
          return prev + (target - prev) * 0.1; // Gradual adjustment
        });
      }
      
      // Periodically update learning phase
      setLearningPhase(prev => {
        // Learning gradually increases, maxing out at 0.95
        // to always leave room for adaptation
        return Math.min(prev + 0.001, 0.95);
      });
    };
    
    // Process click pattern - evaluate and store cognitive patterns
    const processClickPattern = (x: number, y: number) => {
      // Find nearby patterns
      const nearbyPatterns = patternMap.filter(pattern => {
        // Check if any of the pattern's locations are near this click
        return pattern.locations.some(loc => {
          const dx = loc.x - x;
          const dy = loc.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < 150; // Within 150px
        });
      });
      
      if (nearbyPatterns.length > 0) {
        // Strengthen existing patterns
        setPatternMap(prev => prev.map(pattern => {
          if (nearbyPatterns.some(p => p.id === pattern.id)) {
            return {
              ...pattern,
              strength: Math.min(pattern.strength + 0.1, 1),
              lastActivity: Date.now(),
              // Add this location to the pattern
              locations: [...pattern.locations, { x, y }].slice(-5) // Keep only last 5 locations
            };
          }
          return pattern;
        }));
        
        // Activate these patterns
        setActivePatterns(nearbyPatterns.map(p => p.id));
        
        // Delay deactivation
        setTimeout(() => {
          setActivePatterns(prev => prev.filter(id => !nearbyPatterns.some(p => p.id === id)));
        }, 3000);
      } else {
        // Create a new pattern with enhanced neural synchronization properties
        const newPattern: CognitivePattern = {
          id: `pattern-${Date.now()}`,
          strength: 0.3, // Initial strength
          locations: [{ x, y }],
          lastActivity: Date.now(),
          color: getDomainColor(),
          type: cognitiveStateToType(cognitiveState),
          // Enhanced properties for neural symbiosis
          emotionalContext: detectEmotionalContext(),
          confidenceScore: 0.4, // Initial moderate confidence
          cognitiveLoad: calculateCognitiveLoad(),
          temporalRhythm: detectTemporalRhythm(),
          alignmentScore: 0.95 // High initial ethical alignment (visionary ethics module)
        };
        
        setPatternMap(prev => [...prev, newPattern]);
        setActivePatterns(prev => [...prev, newPattern.id]);
        
        // Delay deactivation
        setTimeout(() => {
          setActivePatterns(prev => prev.filter(id => id !== newPattern.id));
        }, 3000);
      }
      
      // Decay old patterns
      setPatternMap(prev => {
        const now = Date.now();
        return prev
          .map(pattern => {
            // Patterns decay over time if not reinforced
            if (now - pattern.lastActivity > 30000) { // 30 seconds
              return {
                ...pattern,
                strength: pattern.strength * 0.95 // Decay by 5%
              };
            }
            return pattern;
          })
          .filter(pattern => pattern.strength > 0.1); // Remove very weak patterns
      });
    };
    
    // Map cognitive state to pattern type
    const cognitiveStateToType = (state: string): 'explorative' | 'focused' | 'creative' | 'analytical' => {
      switch(state) {
        case 'exploring': return 'explorative';
        case 'focusing': return 'focused';
        case 'creating': return 'creative';
        case 'analyzing': return 'analytical';
        default: return 'explorative';
      }
    };
    
    // Advanced neural pattern detection functions for deeper symbiosis
    
    /**
     * Detects emotional context based on interaction patterns
     * Implements module M(π) from the formula - Multi-Modal Neurosymbolic analysis
     */
    const detectEmotionalContext = (): 'neutral' | 'excited' | 'contemplative' | 'urgent' => {
      if (mouseHistoryRef.current.length < 5) return 'neutral';
      
      const recentMovements = mouseHistoryRef.current.slice(-15);
      
      // Calculate movement velocity and variability
      let totalVelocity = 0;
      let velocityVariance = 0;
      let previousVelocity = 0;
      let velocities: number[] = [];
      
      // Calculate average time between clicks
      const recentClicks = clickPositions.slice(-5);
      let avgTimeBetweenClicks = 0;
      
      if (recentClicks.length > 1) {
        let totalTime = 0;
        for (let i = 1; i < recentClicks.length; i++) {
          totalTime += recentClicks[i].time - recentClicks[i-1].time;
        }
        avgTimeBetweenClicks = totalTime / (recentClicks.length - 1);
      }
      
      // Calculate movement velocities
      for (let i = 1; i < recentMovements.length; i++) {
        const prev = recentMovements[i-1];
        const curr = recentMovements[i];
        const timeElapsed = curr.time - prev.time;
        
        if (timeElapsed === 0) continue;
        
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const velocity = distance / timeElapsed;
        velocities.push(velocity);
        totalVelocity += velocity;
      }
      
      const avgVelocity = totalVelocity / velocities.length || 0;
      
      // Calculate velocity variance (how inconsistent the movement speed is)
      for (const velocity of velocities) {
        velocityVariance += Math.pow(velocity - avgVelocity, 2);
      }
      velocityVariance = velocityVariance / velocities.length || 0;
      
      // Use calculated metrics to determine emotional context
      if (avgVelocity > 1.5 && velocityVariance < 0.5 && avgTimeBetweenClicks < 800) {
        // Fast, consistent movements with quick clicks - excited state
        return 'excited';
      } else if (avgVelocity < 0.5 && velocityVariance < 0.3) {
        // Slow, consistent movements - contemplative state
        return 'contemplative';
      } else if (avgVelocity > 1.2 && velocityVariance > 1.0) {
        // Fast but erratic movements - urgent state
        return 'urgent';
      } else {
        // Default state
        return 'neutral';
      }
    };
    
    /**
     * Calculates estimated cognitive load based on interaction complexity
     * Implements C(π) from the formula - Chainlink neural assessment
     */
    const calculateCognitiveLoad = (): number => {
      // Count active patterns as indicator of cognitive complexity
      const activePatternCount = patternMap.length;
      
      // Analyze recent movement complexity
      const recentMovements = mouseHistoryRef.current.slice(-20);
      let directionChanges = 0;
      let prevDirection = { x: 0, y: 0 };
      
      for (let i = 1; i < recentMovements.length; i++) {
        const prev = recentMovements[i-1];
        const curr = recentMovements[i];
        
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        
        // Detect significant direction changes
        if (Math.sign(dx) !== Math.sign(prevDirection.x) && Math.abs(dx) > 5 || 
            Math.sign(dy) !== Math.sign(prevDirection.y) && Math.abs(dy) > 5) {
          directionChanges++;
        }
        
        prevDirection = { x: dx, y: dy };
      }
      
      // More direction changes and active patterns indicate higher cognitive load
      let loadScore = (directionChanges / 10) * 0.5 + (activePatternCount / 10) * 0.5;
      
      // Clamp between 0 and 1
      return Math.min(Math.max(loadScore, 0), 1);
    };
    
    /**
     * Detects natural timing/rhythm in user interactions
     * Crucial for synchronizing system temporal flow with user cognitive rhythm
     * Implements V(π) from the formula - Visionary rhythm detection
     */
    const detectTemporalRhythm = (): number => {
      if (mouseHistoryRef.current.length < 5) return 1.0;
      
      // Calculate average time between significant movements
      const significantMoves = mouseHistoryRef.current.filter((move, i, arr) => {
        if (i === 0) return false;
        
        const prev = arr[i-1];
        const dx = move.x - prev.x;
        const dy = move.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance > 10; // Only count significant movements
      });
      
      if (significantMoves.length < 2) return 1.0;
      
      let totalTime = 0;
      for (let i = 1; i < significantMoves.length; i++) {
        totalTime += significantMoves[i].time - significantMoves[i-1].time;
      }
      
      const avgTime = totalTime / (significantMoves.length - 1);
      
      // Map average time to a reasonable temporal factor range
      // Shorter times (faster movements) = higher tempo, longer times = lower tempo
      // Range from 0.5 (slow) to 2.0 (fast)
      const normalizedTempo = 1000 / (avgTime + 200); // Normalize to avoid division by zero
      
      return Math.max(Math.min(normalizedTempo, 2.0), 0.5);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [
    domain, 
    cognitiveState, 
    clickPositions.length, 
    patternMap,
    // Include neural detection functions  
    detectEmotionalContext,
    calculateCognitiveLoad,
    detectTemporalRhythm
  ]);
  
  // Render the metacognition visualization
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
    
    // Animation function - renders the cognitive adaptation visualization
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas with slight persistence for trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Trailing persistence
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get current timestamp for animations
      const now = Date.now();
      
      // Draw neural network lines between active patterns
      if (patternMap.length > 1) {
        ctx.lineWidth = 0.5 * temporalFactor;
        ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
        
        for (let i = 0; i < patternMap.length; i++) {
          const pattern1 = patternMap[i];
          
          // Only connect relatively strong patterns
          if (pattern1.strength < 0.3) continue;
          
          const loc1 = pattern1.locations[pattern1.locations.length - 1];
          if (!loc1) continue;
          
          for (let j = i + 1; j < patternMap.length; j++) {
            const pattern2 = patternMap[j];
            
            // Only connect to other strong patterns
            if (pattern2.strength < 0.3) continue;
            
            const loc2 = pattern2.locations[pattern2.locations.length - 1];
            if (!loc2) continue;
            
            // Calculate distance
            const dx = loc1.x - loc2.x;
            const dy = loc1.y - loc2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only connect relatively close patterns
            if (distance < 300) {
              // Calculate opacity based on pattern strengths and distance
              const opacity = (pattern1.strength * pattern2.strength) * (1 - distance / 300) * 0.15;
              
              // Draw connection
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.moveTo(loc1.x, loc1.y);
              ctx.lineTo(loc2.x, loc2.y);
              ctx.stroke();
              
              // Add a subtle pulse if both patterns are active
              if (activePatterns.includes(pattern1.id) && activePatterns.includes(pattern2.id)) {
                const pulsePhase = (now % 2000) / 2000; // 0-1 over 2 seconds
                const pulseRadius = pulsePhase * distance;
                const pulseOpacity = (1 - pulsePhase) * opacity * 2;
                
                // Calculate point along the line based on pulse phase
                const pulseX = loc1.x + (loc2.x - loc1.x) * pulsePhase;
                const pulseY = loc1.y + (loc2.y - loc1.y) * pulsePhase;
                
                // Draw pulse dot
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
                ctx.arc(pulseX, pulseY, 2 * temporalFactor, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }
      }
      
      // Draw cognitive patterns
      ctx.lineWidth = 1.5 * temporalFactor;
      
      patternMap.forEach(pattern => {
        if (pattern.locations.length === 0) return;
        
        // Get the last known location of this pattern
        const loc = pattern.locations[pattern.locations.length - 1];
        
        // Calculate opacity based on pattern strength and recency
        const timeFactor = Math.max(0, 1 - (now - pattern.lastActivity) / 10000); // Fade over 10 seconds
        const opacity = pattern.strength * timeFactor * 0.3; // Keep it subtle
        
        // Get color based on pattern type
        const getPatternColor = (type: string): string => {
          const baseColor = pattern.color;
          
          switch(type) {
            case 'explorative': 
              return baseColor; // Use domain color for explorative patterns
            case 'focused':
              // Brighter variant
              return '#ffffff';
            case 'creative':
              // Warmer variant
              return '#ffeecc';
            case 'analytical':
              // Cooler variant
              return '#ccddff';
            default:
              return baseColor;
          }
        };
        
        const color = getPatternColor(pattern.type);
        
        // Draw pattern node
        const isActive = activePatterns.includes(pattern.id);
        const radius = isActive 
          ? 4 + Math.sin(now * 0.005) * 2 // Pulsing when active
          : 3 * pattern.strength; // Size based on strength when inactive
        
        // Glow effect for active patterns
        if (isActive) {
          const gradient = ctx.createRadialGradient(loc.x, loc.y, 0, loc.x, loc.y, radius * 5);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.7})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(loc.x, loc.y, radius * 5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Node center
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 2})`;
        ctx.arc(loc.x, loc.y, radius * temporalFactor, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pattern memory trace - shows the historical locations
        if (pattern.locations.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
          
          // Start from the oldest point (but not too many to avoid cluttering)
          const startIdx = Math.max(0, pattern.locations.length - 5);
          ctx.moveTo(pattern.locations[startIdx].x, pattern.locations[startIdx].y);
          
          // Draw lines to each subsequent point
          for (let i = startIdx + 1; i < pattern.locations.length; i++) {
            ctx.lineTo(pattern.locations[i].x, pattern.locations[i].y);
          }
          
          ctx.stroke();
        }
      });
      
      // Draw learning phase indicator
      if (learningPhase > 0.1) {
        const px = 70;
        const py = window.innerHeight - 70;
        const radius = 25;
        
        // Background circle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Learning progress arc
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, 0.5)`;
        ctx.lineWidth = 2;
        ctx.arc(px, py, radius - 5, 0, Math.PI * 2 * learningPhase);
        ctx.stroke();
        
        // Center dot that pulses with learning
        const centerSize = 4 + Math.sin(now * 0.002) * 2;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.arc(px, py, centerSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Current mouse position effect - show current cognitive state
      if (cognitiveState) {
        const { x, y } = mousePosition;
        
        // Different visual effects based on cognitive state
        switch(cognitiveState) {
          case 'exploring':
            // Wider, faster expanding rings
            for (let i = 0; i < 2; i++) {
              const phase = ((now + i * 500) % 2000) / 2000;
              const radius = phase * 60 * temporalFactor;
              const opacity = (1 - phase) * 0.1;
              
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.lineWidth = 1 * temporalFactor;
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.stroke();
            }
            break;
            
          case 'focusing':
            // Concentrated, tight rings
            for (let i = 0; i < 3; i++) {
              const phase = ((now + i * 300) % 1500) / 1500;
              const radius = phase * 30 * temporalFactor;
              const opacity = (1 - phase) * 0.15;
              
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.lineWidth = 1.5 * temporalFactor;
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.stroke();
            }
            break;
            
          case 'creating':
            // Flowing, variable rings
            for (let i = 0; i < 3; i++) {
              const phase = ((now + i * 400) % 3000) / 3000;
              const radius = phase * 50 * temporalFactor;
              const varRadius = radius * (1 + Math.sin(now * 0.01 + i) * 0.2);
              const opacity = (1 - phase) * 0.12;
              
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.lineWidth = 1 * temporalFactor;
              ctx.arc(x, y, varRadius, 0, Math.PI * 2);
              ctx.stroke();
            }
            break;
            
          case 'analyzing':
            // Structured, precise rings
            for (let i = 0; i < 2; i++) {
              const phase = ((now + i * 600) % 2500) / 2500;
              const radius = phase * 40 * temporalFactor;
              const opacity = (1 - phase) * 0.13;
              
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.lineWidth = 2 * temporalFactor;
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.stroke();
              
              // Additional structured elements
              if (i === 0) {
                const angle = (now * 0.0005) % (Math.PI * 2);
                
                for (let j = 0; j < 4; j++) {
                  const lineAngle = angle + (j * Math.PI / 2);
                  const lineStartRadius = radius * 0.5;
                  const lineEndRadius = radius * 1.2;
                  
                  const startX = x + Math.cos(lineAngle) * lineStartRadius;
                  const startY = y + Math.sin(lineAngle) * lineStartRadius;
                  const endX = x + Math.cos(lineAngle) * lineEndRadius;
                  const endY = y + Math.sin(lineAngle) * lineEndRadius;
                  
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
                  ctx.moveTo(startX, startY);
                  ctx.lineTo(endX, endY);
                  ctx.stroke();
                }
              }
            }
            break;
        }
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [
    patternMap, 
    activePatterns, 
    mousePosition, 
    cognitiveState, 
    temporalFactor, 
    learningPhase,
    // Enhanced neural metrics dependencies
    emotionalContext,
    cognitiveLoad,
    temporalRhythm,
    confidenceScore,
    alignmentScore
  ]);
  
  return (
    <div className={`fixed inset-0 pointer-events-none z-42 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Neural Symbiosis Metrics Display - appears when learning reaches sufficient depth */}
      {learningPhase > 0.3 && (
        <motion.div 
          className="fixed top-32 right-5 pointer-events-none"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.8, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-3 text-xs text-white/80 max-w-[200px]">
            <div className="mb-2 pb-1 border-b border-white/10 text-white/90 flex items-center">
              <div className="w-2 h-2 rounded-full bg-white/80 mr-2"></div>
              <span>Neural Symbiosis</span>
            </div>
            
            {/* Emotional Context */}
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Emotional State</span>
                <span className="text-white/90 capitalize">{emotionalContext}</span>
              </div>
              <div className={`mt-1 h-1 rounded-full bg-gradient-to-r ${
                emotionalContext === 'excited' ? 'from-purple-300/30 to-pink-300/60' :
                emotionalContext === 'contemplative' ? 'from-blue-300/30 to-teal-300/60' :
                emotionalContext === 'urgent' ? 'from-red-300/30 to-orange-300/60' :
                'from-gray-300/30 to-white/40'
              }`}></div>
            </div>
            
            {/* Cognitive Load */}
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Cognitive Load</span>
                <span className="text-white/90">{Math.round(cognitiveLoad * 100)}%</span>
              </div>
              <div className="mt-1 h-1 bg-white/10 rounded-full">
                <div 
                  className="h-1 bg-white/50 rounded-full"
                  style={{ width: `${cognitiveLoad * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Rhythm Sync */}
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Rhythm Sync</span>
                <span className="text-white/90">
                  {temporalRhythm < 0.8 ? 'Deliberate' : 
                   temporalRhythm > 1.3 ? 'Rapid' : 'Balanced'}
                </span>
              </div>
              <div className="mt-1 h-1 bg-white/10 rounded-full">
                <div 
                  className="h-1 bg-white/50 rounded-full transition-all duration-500"
                  style={{ width: `${(temporalRhythm / 2) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Confidence Level */}
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Confidence</span>
                <span className="text-white/90">{Math.round(confidenceScore * 100)}%</span>
              </div>
              <div className="mt-1 h-1 bg-white/10 rounded-full">
                <div 
                  className="h-1 bg-white/50 rounded-full transition-all duration-500"
                  style={{ width: `${confidenceScore * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Ethical Alignment */}
            <div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Ethical Alignment</span>
                <span className="text-white/90">{Math.round(alignmentScore * 100)}%</span>
              </div>
              <div className="mt-1 h-1 bg-white/10 rounded-full">
                <div 
                  className="h-1 bg-green-300/60 rounded-full transition-all duration-500"
                  style={{ width: `${alignmentScore * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Learning phase indicator - shows early in the process */}
      {learningPhase < 0.3 && (
        <motion.div 
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 pointer-events-none bg-black/40 rounded-lg px-3 py-1.5 text-xs text-white/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Adaptive neural patterns learning from your interaction style...
        </motion.div>
      )}
      
      {/* Advanced neural resonance indicator - shows as learning progresses */}
      {learningPhase >= 0.3 && (
        <motion.div 
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 pointer-events-none bg-black/40 rounded-lg px-3 py-1.5 text-xs text-white/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
              cognitiveState === 'exploring' ? 'bg-blue-400' : 
              cognitiveState === 'focusing' ? 'bg-purple-400' :
              cognitiveState === 'creating' ? 'bg-amber-400' :
              'bg-green-400'
            }`}></div>
            <span>
              Neural symbiosis {
                learningPhase < 0.5 ? 'developing' : 
                learningPhase < 0.7 ? 'strengthening' : 
                learningPhase < 0.9 ? 'optimizing' : 'stabilizing'
              } - {Math.round(learningPhase * 100)}% synchronized
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}