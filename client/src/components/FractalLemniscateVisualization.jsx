/**
 * Fractal Lemniscate Visualization
 * 
 * Provides an interactive visualization of a fractal lemniscate pattern
 * based on the 3:1 ↔ 1:3 coherence ratio. The visualization shows:
 * 
 * 1. A primary lemniscate curve (infinity symbol ∞)
 * 2. Nested secondary lemniscates at key points
 * 3. Current system position along the curve
 * 4. Color mapping indicating stability/exploration phase
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Import constants
const STABILITY_COHERENCE = 0.7500;  // 3:1 ratio (75% coherent)
const EXPLORATION_COHERENCE = 0.2494; // 1:3 ratio (25% coherent)

// Import UI components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
// Remove tooltip for now as it might be causing errors
// import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

// Format number helper function
const formatNumber = (value) => {
  return parseFloat(value.toFixed(4));
};

const FractalLemniscateVisualization = ({ 
  coherenceValue = 0.5, 
  width = 800, 
  height = 400, 
  animate = true,
  showLabels = true,
  showSecondaryLemniscates = true,
  depth = 2
}) => {
  // SVG refs
  const svgRef = useRef(null);
  const mainLemniscateRef = useRef(null);
  const positionMarkerRef = useRef(null);
  const secondaryLemniscatesRef = useRef(null);
  
  // Animation state
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(animate);
  const [t, setT] = useState(0);
  
  // Calculate point on lemniscate curve for parameter t - Optimized
  const lemniscatePoint = (t, a = 1) => {
    // Lemniscate of Bernoulli formula - with optimizations
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    const cos2T = Math.cos(2 * t);
    // Replace Math.pow with direct multiplication
    const denominator = 1 + sinT * sinT;
    const x = (a * cosT * cos2T) / denominator;
    const y = (a * sinT * cos2T) / denominator;
    return [x, y];
  };
  
  // Create points for lemniscate curve - Optimized
  const generateLemniscatePoints = (a = 1, numPoints = 500) => {
    const points = [];
    // Pre-compute the scale factor to avoid division in each iteration
    const tScale = 2 * Math.PI / numPoints;
    
    for (let i = 0; i < numPoints; i++) {
      const t = i * tScale; // Faster calculation
      points.push(lemniscatePoint(t, a));
    }
    return points;
  };
  
  // Map coherence value to position on lemniscate
  const coherenceToLemniscatePosition = (coherence) => {
    // Map [0, 1] to [0, 2π]
    let t = coherence * 2 * Math.PI;
    
    // Special case: if near thresholds, snap to key positions
    if (Math.abs(coherence - STABILITY_COHERENCE) < 0.03) {
      t = Math.PI / 4; // 45 degrees - stability point
    } else if (Math.abs(coherence - EXPLORATION_COHERENCE) < 0.03) {
      t = 5 * Math.PI / 4; // 225 degrees - exploration point
    }
    
    return t;
  };
  
  // Get color based on coherence value with enhanced gradient visualization
  const getCoherenceColor = (coherence) => {
    // Define core phase colors
    const stabilityColor = "#0a84ff"; // Blue for stability
    const explorationColor = "#ff375f"; // Red for exploration
    const transitionColor = "#30d158"; // Green for transition
    const extremeColor = "#af52de"; // Purple for extreme values
    
    // Enhanced precision with wider windows that match the backend calculations
    // Near stability (blue)
    if (Math.abs(coherence - STABILITY_COHERENCE) < 0.08) {
      // Calculate distance from exact stability threshold
      const distance = Math.abs(coherence - STABILITY_COHERENCE);
      const normalizedDistance = distance / 0.08;
      
      // For very close values to stability, use pure stability color
      if (distance < 0.015) {
        return stabilityColor;
      }
      
      // For values in the stability zone but not exact, blend with transition color
      const blendFactor = Math.pow(normalizedDistance, 0.7); // Non-linear blending for better visualization
      return blendColors(stabilityColor, transitionColor, blendFactor);
    }
    // Near exploration (red)
    else if (Math.abs(coherence - EXPLORATION_COHERENCE) < 0.06) {
      // Calculate distance from exact exploration threshold
      const distance = Math.abs(coherence - EXPLORATION_COHERENCE);
      const normalizedDistance = distance / 0.06;
      
      // For very close values to exploration, use pure exploration color
      if (distance < 0.015) {
        return explorationColor;
      }
      
      // For values in the exploration zone but not exact, blend with transition color
      const blendFactor = Math.pow(normalizedDistance, 0.7); // Non-linear blending
      return blendColors(explorationColor, transitionColor, blendFactor);
    }
    // Between thresholds - transition zone (green)
    else if (coherence > EXPLORATION_COHERENCE && coherence < STABILITY_COHERENCE) {
      // Calculate position in transition zone for gradient effect
      const range = STABILITY_COHERENCE - EXPLORATION_COHERENCE;
      const position = (coherence - EXPLORATION_COHERENCE) / range;
      
      // Create a gradient effect across the transition zone
      // Position closer to stability gets more blue influence, closer to exploration gets more red
      if (position > 0.7) {
        return blendColors(transitionColor, stabilityColor, (position - 0.7) / 0.3);
      } else if (position < 0.3) {
        return blendColors(transitionColor, explorationColor, (0.3 - position) / 0.3);
      } else {
        // Middle of transition zone gets pure transition color
        return transitionColor;
      }
    }
    // Outside normal bounds - extreme values (purple with gradient)
    else {
      // Determine if we're above stability or below exploration
      if (coherence > STABILITY_COHERENCE) {
        // Above stability - blend from stability to extreme based on distance
        const distance = Math.min(0.25, coherence - STABILITY_COHERENCE); // Cap at 0.25 for visualization
        return blendColors(stabilityColor, extremeColor, distance * 4); // 4 = 1/0.25 for normalization
      } else {
        // Below exploration - blend from exploration to extreme based on distance
        const distance = Math.min(0.25, EXPLORATION_COHERENCE - coherence); // Cap at 0.25
        return blendColors(explorationColor, extremeColor, distance * 4); // 4 = 1/0.25 for normalization
      }
    }
  };
  
  // Cache for parsed colors to avoid repeated parsing of the same hex values
  const colorCache = {};
  
  // Helper function to blend two hex colors - Optimized
  const blendColors = (color1, color2, ratio) => {
    // Create a cache key for this specific blend
    const cacheKey = `${color1}-${color2}-${ratio.toFixed(3)}`;
    
    // Return cached result if available
    if (colorCache[cacheKey]) {
      return colorCache[cacheKey];
    }
    
    // Convert hex to RGB with caching
    const parseColor = (hexColor) => {
      if (!colorCache[hexColor]) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        colorCache[hexColor] = [r, g, b];
      }
      return colorCache[hexColor];
    };
    
    // Parse colors
    const [r1, g1, b1] = parseColor(color1);
    const [r2, g2, b2] = parseColor(color2);
    
    // Blend RGB values
    const invRatio = 1 - ratio; // Calculate once and reuse
    const r = Math.round(r1 * invRatio + r2 * ratio);
    const g = Math.round(g1 * invRatio + g2 * ratio);
    const b = Math.round(b1 * invRatio + b2 * ratio);
    
    // Convert back to hex
    const toHex = (value) => {
      const hex = value.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    // Store result in cache
    const result = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    colorCache[cacheKey] = result;
    
    return result;
  };
  
  // Initialize SVG and path
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`); // Center
    
    // Scaling factor
    const scale = Math.min(width, height) * 0.35;
    
    // Create gradient for path
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "lemniscateGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", -scale)
      .attr("y1", 0)
      .attr("x2", scale)
      .attr("y2", 0);
      
    // Add gradient stops
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", getCoherenceColor(EXPLORATION_COHERENCE));
      
    gradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#30d158");
      
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", getCoherenceColor(STABILITY_COHERENCE));
    
    // Create main lemniscate path
    const points = generateLemniscatePoints(1, 500);
    const lineGenerator = d3.line();
    
    const path = svg.append("path")
      .datum(points.map(p => [p[0] * scale, p[1] * scale]))
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "url(#lemniscateGradient)")
      .attr("stroke-width", 6)
      .attr("opacity", 0.8);
    
    mainLemniscateRef.current = path;
    
    // Create secondary lemniscates group
    const secondaryGroup = svg.append("g");
    secondaryLemniscatesRef.current = secondaryGroup;
    
    // Threshold markers
    if (showLabels) {
      // Stability threshold marker (75%)
      const stabilityT = coherenceToLemniscatePosition(STABILITY_COHERENCE);
      const stabilityPoint = lemniscatePoint(stabilityT, 1);
      
      svg.append("circle")
        .attr("cx", stabilityPoint[0] * scale)
        .attr("cy", stabilityPoint[1] * scale)
        .attr("r", 6)
        .attr("fill", getCoherenceColor(STABILITY_COHERENCE));
        
      svg.append("text")
        .attr("x", stabilityPoint[0] * scale + 15)
        .attr("y", stabilityPoint[1] * scale - 10)
        .attr("text-anchor", "middle")
        .attr("class", "text-sm text-blue-500 font-semibold")
        .text(`Stability (${STABILITY_COHERENCE})`);
      
      // Exploration threshold marker (25%)
      const explorationT = coherenceToLemniscatePosition(EXPLORATION_COHERENCE);
      const explorationPoint = lemniscatePoint(explorationT, 1);
      
      svg.append("circle")
        .attr("cx", explorationPoint[0] * scale)
        .attr("cy", explorationPoint[1] * scale)
        .attr("r", 6)
        .attr("fill", getCoherenceColor(EXPLORATION_COHERENCE));
        
      svg.append("text")
        .attr("x", explorationPoint[0] * scale - 15)
        .attr("y", explorationPoint[1] * scale + 20)
        .attr("text-anchor", "middle")
        .attr("class", "text-sm text-red-500 font-semibold")
        .text(`Exploration (${EXPLORATION_COHERENCE})`);
    }
    
    // Position marker
    const marker = svg.append("circle")
      .attr("r", 10)
      .attr("fill", getCoherenceColor(coherenceValue))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);
    
    positionMarkerRef.current = marker;
    
    // Initial update
    updatePositionMarker(coherenceValue);
    if (showSecondaryLemniscates) {
      updateSecondaryLemniscates(coherenceValue, depth);
    }
  }, [width, height, showLabels, showSecondaryLemniscates, depth]);
  
  // Update position marker based on coherence value
  const updatePositionMarker = (coherence) => {
    if (!positionMarkerRef.current) return;
    
    const t = coherenceToLemniscatePosition(coherence);
    const point = lemniscatePoint(t, 1);
    const scale = Math.min(width, height) * 0.35;
    
    positionMarkerRef.current
      .attr("cx", point[0] * scale)
      .attr("cy", point[1] * scale)
      .attr("fill", getCoherenceColor(coherence));
  };
  
  // Cache for secondary lemniscate points
  const secondaryPointsCache = {};
  
  // Create secondary lemniscates at key positions - Optimized
  const updateSecondaryLemniscates = (coherence, depth) => {
    if (!secondaryLemniscatesRef.current || depth <= 0) return;
    
    const secondaryGroup = secondaryLemniscatesRef.current;
    secondaryGroup.selectAll("*").remove();
    
    const scale = Math.min(width, height) * 0.35;
    const secondaryScale = scale * 0.15; // Smaller secondary lemniscates
    
    // Pre-compute the line generator - use once for all paths
    const lineGenerator = d3.line();
    
    // Key positions for secondary lemniscates (use fixed positions to improve performance)
    // Using an array with minimal properties to reduce object creation overhead
    const keyPositions = [
      [STABILITY_COHERENCE, 1.0],    // [coherence, size]
      [EXPLORATION_COHERENCE, 1.0]
    ];
    
    // Add more positions for depth
    if (depth > 1) {
      keyPositions.push(
        [0.5, 0.8],
        [0.1, 0.6],
        [0.9, 0.6]
      );
    }
    
    // Get or create secondary points with caching
    const getSecondaryPoints = () => {
      const cacheKey = 'secondary-100'; // Cache key based on number of points
      if (!secondaryPointsCache[cacheKey]) {
        secondaryPointsCache[cacheKey] = generateLemniscatePoints(1, 100);
      }
      return secondaryPointsCache[cacheKey];
    };
    
    // Get points once and reuse
    const secondaryPoints = getSecondaryPoints();
    
    // Add secondary lemniscates at each key position
    for (let i = 0; i < keyPositions.length; i++) {
      const coherenceValue = keyPositions[i][0];
      const size = keyPositions[i][1];
      
      const t = coherenceToLemniscatePosition(coherenceValue);
      const point = lemniscatePoint(t, 1);
      const x = point[0] * scale;
      const y = point[1] * scale;
      
      // Transform points once in memory instead of using map in the datum call
      const transformedPoints = [];
      for (let j = 0; j < secondaryPoints.length; j++) {
        const p = secondaryPoints[j];
        transformedPoints.push([
          p[0] * secondaryScale * size + x,
          p[1] * secondaryScale * size + y
        ]);
      }
      
      // Add secondary lemniscate
      secondaryGroup.append("path")
        .datum(transformedPoints)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", getCoherenceColor(coherenceValue))
        .attr("stroke-width", 2)
        .attr("opacity", 0.6);
    }
  };
  
  // Animation effect
  useEffect(() => {
    let animationId;
    
    if (isAnimating) {
      const animate = () => {
        setT(prevT => (prevT + 0.01) % (2 * Math.PI));
        setAnimationFrame(prev => prev + 1);
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isAnimating]);
  
  // Update position based on current t value during animation
  useEffect(() => {
    if (isAnimating) {
      // Map t to coherence value for animation
      const animatedCoherence = (Math.sin(t) + 1) / 2; // [0, 1]
      updatePositionMarker(animatedCoherence);
    } else {
      // Use provided coherence value when not animating
      updatePositionMarker(coherenceValue);
      if (showSecondaryLemniscates) {
        updateSecondaryLemniscates(coherenceValue, depth);
      }
    }
  }, [animationFrame, coherenceValue, isAnimating, t, showSecondaryLemniscates, depth]);
  
  // Toggle animation
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };
  
  // Get current phase label with enhanced precision
  const getPhaseLabel = () => {
    // Use the same thresholds as our getCoherenceColor function for consistency
    if (Math.abs(coherenceValue - STABILITY_COHERENCE) < 0.08) {
      // Determine exact vs near-stability
      const distance = Math.abs(coherenceValue - STABILITY_COHERENCE);
      if (distance < 0.015) {
        return "Exact Stability Phase";
      } else {
        return "Near Stability Phase";
      }
    } else if (Math.abs(coherenceValue - EXPLORATION_COHERENCE) < 0.06) {
      // Determine exact vs near-exploration
      const distance = Math.abs(coherenceValue - EXPLORATION_COHERENCE);
      if (distance < 0.015) {
        return "Exact Exploration Phase";
      } else {
        return "Near Exploration Phase";
      }
    } else if (coherenceValue > EXPLORATION_COHERENCE && coherenceValue < STABILITY_COHERENCE) {
      // Provide more detailed transition phase description
      const range = STABILITY_COHERENCE - EXPLORATION_COHERENCE;
      const position = (coherenceValue - EXPLORATION_COHERENCE) / range;
      
      if (position > 0.7) {
        return "Stability-biased Transition";
      } else if (position < 0.3) {
        return "Exploration-biased Transition";
      } else {
        return "Balanced Transition Phase";
      }
    } else {
      // More specific extreme phase descriptions
      if (coherenceValue > STABILITY_COHERENCE) {
        return "Ultra-Stability Phase";
      } else {
        return "Ultra-Exploration Phase";
      }
    }
  };
  
  // Get color for phase badge with enhanced precision
  const getPhaseBadgeColor = () => {
    // Match thresholds with getCoherenceColor function
    if (Math.abs(coherenceValue - STABILITY_COHERENCE) < 0.08) {
      return "blue";
    } else if (Math.abs(coherenceValue - EXPLORATION_COHERENCE) < 0.06) {
      return "red";
    } else if (coherenceValue > EXPLORATION_COHERENCE && coherenceValue < STABILITY_COHERENCE) {
      // Additional color differentiation for transition phases
      const range = STABILITY_COHERENCE - EXPLORATION_COHERENCE;
      const position = (coherenceValue - EXPLORATION_COHERENCE) / range;
      
      if (position > 0.7) {
        return "blue"; // With a slight green tint
      } else if (position < 0.3) {
        return "red"; // With a slight green tint
      } else {
        return "green";
      }
    } else {
      return "purple";
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Fractal Lemniscate Visualization</CardTitle>
          <Badge variant={getPhaseBadgeColor()}>
            {getPhaseLabel()} - Coherence: {formatNumber(coherenceValue)}
          </Badge>
        </div>
        <CardDescription>
          Visualizing the perfect oscillation cycle between stability (0.7500) and exploration (0.2494)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          <svg 
            ref={svgRef} 
            width={width} 
            height={height} 
            className="bg-slate-50 dark:bg-slate-900 rounded-lg"
          ></svg>
          
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAnimation} 
              className="h-8 px-2 text-xs"
              title={isAnimating ? "Pause animation" : "Start animation"}
            >
              {isAnimating ? "Pause Animation" : "Start Animation"}
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start pt-0">
        <div className="text-sm text-muted-foreground mb-2">
          The lemniscate curve (∞) represents the oscillation between stability and exploration phases, 
          maintaining the precise 3:1 ↔ 1:3 coherence ratio at key points.
        </div>
        
        {!isAnimating && (
          <div className="w-full">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>0.0</span>
              <span>{EXPLORATION_COHERENCE}</span>
              <span>0.5</span>
              <span>{STABILITY_COHERENCE}</span>
              <span>1.0</span>
            </div>
            <Slider 
              value={[coherenceValue * 100]} 
              min={0} 
              max={100} 
              step={1}
              className="w-full"
              disabled
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default FractalLemniscateVisualization;