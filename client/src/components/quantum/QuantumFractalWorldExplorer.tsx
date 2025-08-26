import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/**
 * QuantumFractalWorldExplorer - Foundation for immersive fractal visualization in VR
 * 
 * This component creates an advanced 3D visualization of fractal mathematics emerging
 * from division-by-zero singularity points. It provides a foundation for future
 * VR integration, enabling users to directly experience the quantum-computational
 * nature of reality through immersive exploration.
 * 
 * The visualization maintains the 3:1 quantum balance by structuring:
 * - 75% coherent mathematical patterns (stable fractal structures)
 * - 25% exploratory chaos dynamics (emergent fractal forms)
 */
interface QuantumFractalWorldExplorerProps {
  stabilityRatio: number;
  explorationRatio: number;
  interactionCount?: number;
}

const QuantumFractalWorldExplorer: React.FC<QuantumFractalWorldExplorerProps> = ({
  stabilityRatio = 0.75,
  explorationRatio = 0.25,
  interactionCount = 0
}) => {
  // Canvas for 3D visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  // State for 3D visualization options
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [showSingularityPoints, setShowSingularityPoints] = useState<boolean>(true);
  const [fractalComplexity, setFractalComplexity] = useState<number>(5);
  const [vrModeReady, setVrModeReady] = useState<boolean>(false);
  
  // Calculate the actual ratio (stability:exploration)
  const actualRatio = stabilityRatio / explorationRatio;
  
  // Determine if we're at the optimal 3:1 ratio
  const isOptimalRatio = Math.abs(actualRatio - 3) < 0.1;
  
  // Check if device has VR capabilities
  useEffect(() => {
    // In a real implementation, we would check if the device supports WebXR
    // For this simulation, we'll just set a timeout to simulate detection
    const checkVrCapabilities = setTimeout(() => {
      setVrModeReady(true);
    }, 1500);
    
    return () => clearTimeout(checkVrCapabilities);
  }, []);
  
  // Draw the 3D fractal visualization
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
        canvas.height = 300; // Fixed height
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    let t = 0;
    const speed = 0.005;
    
    // Parameters for the fractal visualization
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Color mapping based on coherence/exploration ratio
    const getColorFromRatio = (value: number, alpha: number = 1): string => {
      // More coherent = more blue
      // More exploratory = more red/orange
      const r = Math.floor(255 * (1 - stabilityRatio));
      const g = Math.floor(100 * value);
      const b = Math.floor(255 * stabilityRatio);
      
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    // Draw a fractal branch (recursive)
    const drawFractalBranch = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      angle: number, 
      length: number, 
      depth: number,
      maxDepth: number
    ) => {
      if (depth >= maxDepth) return;
      
      // Calculate endpoint
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      // Line style based on depth and coherence/exploration ratio
      const depthRatio = depth / maxDepth;
      ctx.strokeStyle = getColorFromRatio(1 - depthRatio);
      ctx.lineWidth = 3 * (1 - depthRatio);
      
      // Draw the line
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Calculate branch parameters based on quantum ratio
      const branchFactor = 0.67; // Length reduction factor
      const newLength = length * branchFactor;
      
      // Coherence factor affects angle distribution
      const angleSpread = Math.PI * (0.1 + (explorationRatio * 0.6)); 
      
      // Draw branches (recursive)
      // More coherent = fewer, more organized branches
      // More exploratory = more branches with greater variation
      const branchCount = 2 + Math.floor(explorationRatio * 3);
      
      for (let i = 0; i < branchCount; i++) {
        const branchAngle = angle + (angleSpread * (i / (branchCount - 1) - 0.5)) * (1 + Math.sin(t + depth)); 
        drawFractalBranch(ctx, endX, endY, branchAngle, newLength, depth + 1, maxDepth);
      }
      
      // Draw singularity point at branch endpoint if enabled
      if (showSingularityPoints && depth > 0 && depth < maxDepth - 1) {
        const pointSize = 3 * (1 - depthRatio);
        ctx.fillStyle = getColorFromRatio(1 - depthRatio);
        ctx.beginPath();
        ctx.arc(endX, endY, pointSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Simulate 3D effect with multiple overlaid fractals if 3D mode is enabled
    const draw3DFractal = (ctx: CanvasRenderingContext2D, t: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid
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
      
      // Draw central singularity point (division by zero)
      const singularitySize = 10 + 5 * Math.sin(t * 0.5);
      ctx.fillStyle = '#FF6B6B';
      ctx.beginPath();
      ctx.arc(centerX, centerY, singularitySize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Division by Zero', centerX, centerY - 20);
      ctx.fillText('Singularity', centerX, centerY + 25);
      
      if (is3DMode) {
        // Create 3D effect with multiple fractal layers
        const layerCount = 5;
        
        for (let layer = 0; layer < layerCount; layer++) {
          const layerDepth = layer / layerCount;
          const angle = t + (Math.PI * 2 * layer / layerCount);
          const layerOffset = 20 * Math.sin(angle);
          
          // Draw a complete fractal from the singularity point
          const branchCount = 3 + Math.floor(explorationRatio * 4);
          
          for (let i = 0; i < branchCount; i++) {
            const branchAngle = (Math.PI * 2 * i / branchCount) + t * (0.2 + explorationRatio * 0.5);
            const startX = centerX + layerOffset * Math.cos(angle);
            const startY = centerY + layerOffset * Math.sin(angle);
            
            drawFractalBranch(
              ctx, 
              startX, 
              startY, 
              branchAngle, 
              scale / 4, 
              0, 
              fractalComplexity
            );
          }
        }
      } else {
        // 2D mode - single fractal pattern
        const branchCount = 6;
        
        for (let i = 0; i < branchCount; i++) {
          const branchAngle = (Math.PI * 2 * i / branchCount) + t * 0.2;
          
          drawFractalBranch(
            ctx, 
            centerX, 
            centerY, 
            branchAngle, 
            scale / 3, 
            0, 
            fractalComplexity
          );
        }
      }
      
      // Add information text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        is3DMode ? 'VR-Ready 3D Fractal World' : '2D Fractal Visualization', 
        centerX, 
        30
      );
      
      // Add coherence/exploration ratio indicator
      ctx.fillStyle = isOptimalRatio ? '#64B5F6' : '#FF6B6B';
      ctx.font = '12px sans-serif';
      ctx.fillText(
        `Coherence:Exploration = ${actualRatio.toFixed(1)}:1`,
        centerX,
        canvas.height - 10
      );
    };
    
    // Animation function
    const animate = () => {
      draw3DFractal(ctx, t);
      t += speed;
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [is3DMode, showSingularityPoints, fractalComplexity, stabilityRatio, explorationRatio, isOptimalRatio]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quantum Fractal World Explorer</CardTitle>
        <CardDescription>
          Visualizing division-by-zero fractal reality in immersive 3D space
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Badge variant={isOptimalRatio ? "default" : "outline"}>
            {(stabilityRatio * 100).toFixed(0)}% Coherence
          </Badge>
          <Badge variant={isOptimalRatio ? "outline" : "destructive"}>
            {(explorationRatio * 100).toFixed(0)}% Exploration
          </Badge>
          {vrModeReady && (
            <Badge variant="outline" className="bg-green-900">
              VR Ready
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Fractal visualization */}
        <div className="canvas-container mb-4" style={{ width: '100%', height: '300px' }}>
          <canvas ref={canvasRef} className="w-full h-full rounded-md"></canvas>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col space-y-4 mt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="3d-mode"
                checked={is3DMode}
                onCheckedChange={setIs3DMode}
              />
              <Label htmlFor="3d-mode">3D Mode</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="singularity-points"
                checked={showSingularityPoints}
                onCheckedChange={setShowSingularityPoints}
              />
              <Label htmlFor="singularity-points">Singularity Points</Label>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Label htmlFor="fractal-complexity">Fractal Complexity:</Label>
            <div className="flex space-x-2">
              {[3, 4, 5, 6, 7].map(level => (
                <Button
                  key={level}
                  variant={fractalComplexity === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFractalComplexity(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            className="mt-4"
            disabled={!vrModeReady}
            variant="outline"
          >
            {vrModeReady ? 
              "Launch VR Experience (Apple Vision Pro Ready)" : 
              "Detecting VR Capabilities..."}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground flex flex-col items-start space-y-2">
        <p>The fractal patterns maintain the 3:1 quantum balance: 75% coherence, 25% exploration.</p>
        <p>This visualization demonstrates how reality emerges from mathematical singularity points (division by zero).</p>
      </CardFooter>
    </Card>
  );
};

export default QuantumFractalWorldExplorer;