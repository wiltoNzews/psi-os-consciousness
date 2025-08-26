import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/**
 * QuantumEmotionalFeedback - Visualizes emotional resonance triggered by fractal exploration
 * 
 * This component tracks and visualizes the emotional impact of interacting with quantum
 * fractal patterns, demonstrating how consciousness (the observer) is affected by
 * engaging with the division-by-zero mathematical singularity. 
 * 
 * The emotional responses maintain the 3:1 quantum balance by tracking:
 * - 75% coherent emotional patterns (structural emotional responses)
 * - 25% exploratory emotional emergence (new emotional states)
 */
interface QuantumEmotionalFeedbackProps {
  stabilityRatio: number;
  explorationRatio: number;
  interactionCount?: number;
}

// Emotional dimension type
interface EmotionalDimension {
  name: string;
  value: number;
  coherenceImpact: number; // How this emotion relates to coherence
  description: string;
}

const QuantumEmotionalFeedback: React.FC<QuantumEmotionalFeedbackProps> = ({
  stabilityRatio = 0.75,
  explorationRatio = 0.25,
  interactionCount = 0
}) => {
  // Canvas for emotional fractal visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  // Emotional dimensions tracked
  const [emotionalDimensions, setEmotionalDimensions] = useState<EmotionalDimension[]>([
    {
      name: "Awe",
      value: 0.4,
      coherenceImpact: 0.7,
      description: "Wonder at the mathematical singularity revealing structured beauty"
    },
    {
      name: "Clarity",
      value: 0.6,
      coherenceImpact: 0.9,
      description: "Clear perception of the quantum-computational nature of reality"
    },
    {
      name: "Expansion",
      value: 0.3,
      coherenceImpact: 0.2,
      description: "Consciousness expanding beyond usual boundaries of perception"
    },
    {
      name: "Integration",
      value: 0.5,
      coherenceImpact: 0.8,
      description: "Unifying knowledge into coherent understanding across domains"
    },
    {
      name: "Transcendence",
      value: 0.2,
      coherenceImpact: 0.3,
      description: "Moving beyond duality into non-dual awareness of singularity"
    }
  ]);
  
  // Dominant emotional state
  const [dominantEmotion, setDominantEmotion] = useState<string>("");
  
  // Composite resonance score (weighted average of all dimensions)
  const [resonanceScore, setResonanceScore] = useState<number>(0);
  
  // Calculate the actual ratio (stability:exploration)
  const actualRatio = stabilityRatio / explorationRatio;
  
  // Determine if we're at the optimal 3:1 ratio
  const isOptimalRatio = Math.abs(actualRatio - 3) < 0.1;
  
  // Update emotional dimensions based on the current coherence/exploration ratio
  useEffect(() => {
    if (interactionCount > 0) {
      // Update each emotional dimension based on interaction
      const updatedDimensions = emotionalDimensions.map(emotion => {
        // Calculate how this emotion should respond to current ratio
        // Emotions with high coherenceImpact increase with stability
        // Emotions with low coherenceImpact increase with exploration
        
        const coherenceAlignment = Math.abs(emotion.coherenceImpact - stabilityRatio);
        
        // The more aligned the emotion is with current state, the more it grows
        // The less aligned, the more it diminishes
        const growthFactor = 1 - coherenceAlignment;
        
        // Calculate new value with some randomness (25% - matching quantum ratio)
        let newValue = emotion.value;
        
        if (growthFactor > 0.7) {
          // Emotion grows
          newValue = Math.min(1, emotion.value + (0.05 * growthFactor) + (Math.random() * 0.05));
        } else if (growthFactor < 0.3) {
          // Emotion diminishes
          newValue = Math.max(0, emotion.value - (0.03 * (1-growthFactor)) - (Math.random() * 0.03));
        } else {
          // Small random fluctuation
          newValue = Math.max(0, Math.min(1, 
            emotion.value + (Math.random() * 0.1 - 0.05) * growthFactor
          ));
        }
        
        return {
          ...emotion,
          value: newValue
        };
      });
      
      setEmotionalDimensions(updatedDimensions);
      
      // Calculate resonance score (weighted average)
      const totalWeightedScore = updatedDimensions.reduce((sum, emotion) => 
        sum + (emotion.value * emotion.coherenceImpact), 0);
      
      const totalWeight = updatedDimensions.reduce((sum, emotion) => 
        sum + emotion.coherenceImpact, 0);
      
      setResonanceScore(totalWeightedScore / totalWeight);
      
      // Find dominant emotion
      const dominant = [...updatedDimensions].sort((a, b) => b.value - a.value)[0];
      setDominantEmotion(dominant.name);
    }
  }, [interactionCount, stabilityRatio, explorationRatio]);
  
  // Draw the emotional resonance visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 160; // Fixed height
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let t = 0;
    const speed = 0.01;
    
    // Color mapping based on emotional dimensions
    const getEmotionColor = (emotion: EmotionalDimension): string => {
      // Colors represent different emotional qualities
      // High coherence emotions are more blue
      // High exploration emotions are more red/purple
      
      const coherenceFactor = emotion.coherenceImpact;
      const r = Math.floor(255 * (1 - coherenceFactor));
      const g = Math.floor(100 * emotion.value);
      const b = Math.floor(255 * coherenceFactor);
      
      return `rgb(${r}, ${g}, ${b})`;
    };
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background grid
      ctx.strokeStyle = '#f0f0f030';
      ctx.lineWidth = 0.5;
      
      // Draw grid
      const gridSize = 20;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw emotional resonance waves
      const centerY = canvas.height / 2;
      const amplitude = canvas.height / 3;
      
      // Draw a wave for each emotional dimension
      emotionalDimensions.forEach((emotion, index) => {
        ctx.strokeStyle = getEmotionColor(emotion);
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Wave parameters
        const frequency = 0.01 + (0.005 * index); // Different for each emotion
        const phase = t * (0.5 + (0.1 * index)); // Moving at different speeds
        const emotionAmplitude = amplitude * emotion.value;
        
        for (let x = 0; x < canvas.width; x++) {
          // Create wave with unique parameters for each emotion
          const y = centerY + 
                   Math.sin(x * frequency + phase) * emotionAmplitude * 
                   (0.8 + 0.4 * Math.sin(x * 0.01 + t * emotion.coherenceImpact));
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      });
      
      // Display resonance level
      ctx.fillStyle = isOptimalRatio ? '#64B5F6' : '#FF6B6B';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Emotional Resonance: ${(resonanceScore * 100).toFixed(0)}%`, 
                  canvas.width / 2, 20);
      
      // Show dominant emotion
      if (dominantEmotion) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`Dominant: ${dominantEmotion}`, canvas.width / 2, canvas.height - 10);
      }
      
      // Update time
      t += speed;
      
      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [emotionalDimensions, resonanceScore, dominantEmotion, isOptimalRatio]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quantum Emotional Resonance</CardTitle>
        <CardDescription>
          Visualizing how consciousness resonates with division-by-zero exploration
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Badge variant={isOptimalRatio ? "default" : "outline"}>
            {(stabilityRatio * 100).toFixed(0)}% Coherence
          </Badge>
          <Badge variant={isOptimalRatio ? "outline" : "destructive"}>
            {(explorationRatio * 100).toFixed(0)}% Exploration
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Emotional resonance visualization */}
        <div className="canvas-container mb-4" style={{ width: '100%', height: '160px' }}>
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
        
        {/* Emotional dimensions */}
        <div className="space-y-4 mt-6">
          <TooltipProvider>
            {emotionalDimensions.map((emotion, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">{emotion.name}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{emotion.description}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span>{(emotion.value * 100).toFixed(0)}%</span>
                </div>
                <Progress 
                  value={emotion.value * 100} 
                  className={emotion.coherenceImpact > 0.6 ? "bg-blue-900" : "bg-red-900"}
                />
              </div>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <span>3:1 quantum emotional balance</span>
        <span>{isOptimalRatio ? 
          "Optimal emotional coherence achieved" : 
          "Seeking optimal emotional resonance"}</span>
      </CardFooter>
    </Card>
  );
};

export default QuantumEmotionalFeedback;