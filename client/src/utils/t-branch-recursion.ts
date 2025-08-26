/**
 * T-Branch Recursion
 * 
 * A utility for generating fractal patterns based on the 3:1 quantum balance ratio.
 * This system creates self-similar branches that maintain the coherence-to-exploration ratio.
 */

import quantumCoherenceLogger from './quantum-coherence-logger';

export enum BranchStyle {
  GEOMETRIC = 'GEOMETRIC',
  ORGANIC = 'ORGANIC',
  QUANTUM = 'QUANTUM',
  NEURAL = 'NEURAL'
}

export interface Branch {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  angle: number;
  depth: number;
  isCoherent: boolean;
  length: number;
  width: number;
  color: string;
}

interface BranchConfig {
  style: BranchStyle;
  baseLength: number;
  lengthReduction: number;
  angleVariance: number;
  colorScheme: string[];
}

export interface TBranchSystemProps {
  style?: BranchStyle;
  maxDepth?: number;
  coherentBranchCount?: number;
  chaosBranchCount?: number;
  startX?: number;
  startY?: number;
  initialAngle?: number;
  initialLength?: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

/**
 * Generate a complete T-Branch fractal system
 */
export function generateTBranchSystem({
  style = BranchStyle.QUANTUM,
  maxDepth = 5,
  coherentBranchCount = 3,
  chaosBranchCount = 1,
  startX = 400,
  startY = 500,
  initialAngle = -90,
  initialLength = 120,
  canvasWidth = 800,
  canvasHeight = 600
}: TBranchSystemProps): Branch[] {
  // Get configuration for the selected style
  const styleConfig: BranchConfig = getBranchStyleConfig(style);
  
  // Create root branch
  const rootBranch: Branch = {
    startX,
    startY,
    endX: startX + initialLength * Math.cos(toRadians(initialAngle)),
    endY: startY + initialLength * Math.sin(toRadians(initialAngle)),
    angle: initialAngle,
    depth: 0,
    isCoherent: true,
    length: initialLength,
    width: 8,
    color: styleConfig.colorScheme[0]
  };
  
  // Generate all branches recursively
  const branches: Branch[] = [rootBranch];
  generateBranches(
    rootBranch,
    branches,
    maxDepth,
    coherentBranchCount,
    chaosBranchCount,
    styleConfig
  );
  
  // Log the coherence metrics
  quantumCoherenceLogger.logCoherenceEvent(
    'TBranchRecursion',
    coherentBranchCount / (coherentBranchCount + chaosBranchCount),
    chaosBranchCount / (coherentBranchCount + chaosBranchCount),
    'fractal_generation',
    `Generated T-Branch system with ${coherentBranchCount}:${chaosBranchCount} ratio (${style} style)`
  );
  
  return branches;
}

/**
 * Recursively generate branches for the T-Branch system
 */
function generateBranches(
  parentBranch: Branch,
  branches: Branch[],
  maxDepth: number,
  coherentBranchCount: number,
  chaosBranchCount: number,
  styleConfig: BranchConfig
): void {
  // Stop recursion if we've reached max depth
  if (parentBranch.depth >= maxDepth) {
    return;
  }
  
  const parentEndX = parentBranch.endX;
  const parentEndY = parentBranch.endY;
  const parentAngle = parentBranch.angle;
  const newDepth = parentBranch.depth + 1;
  const newLength = parentBranch.length * (1 - styleConfig.lengthReduction);
  const newWidth = parentBranch.width * 0.7;
  
  // First add the coherent branches (typically 3)
  for (let i = 0; i < coherentBranchCount; i++) {
    // Calculate spread angle based on number of branches
    // Spread angle distributes branches evenly across a 60° arc
    const spreadAngle = 60 / (coherentBranchCount + 1);
    const angleOffset = -30 + (i + 1) * spreadAngle;
    
    // Add some variance based on style
    const angleVariance = (Math.random() * 2 - 1) * styleConfig.angleVariance * 0.5;
    const newAngle = parentAngle + angleOffset + angleVariance;
    
    // Calculate new endpoint
    const branch: Branch = {
      startX: parentEndX,
      startY: parentEndY,
      endX: parentEndX + newLength * Math.cos(toRadians(newAngle)),
      endY: parentEndY + newLength * Math.sin(toRadians(newAngle)),
      angle: newAngle,
      depth: newDepth,
      isCoherent: true,
      length: newLength,
      width: newWidth,
      color: styleConfig.colorScheme[Math.min(newDepth, styleConfig.colorScheme.length - 1)]
    };
    
    branches.push(branch);
    
    // Recursively generate branches from this branch
    generateBranches(branch, branches, maxDepth, coherentBranchCount, chaosBranchCount, styleConfig);
  }
  
  // Then add the chaos branches (typically 1)
  for (let i = 0; i < chaosBranchCount; i++) {
    // Chaos branches have more random angles
    const angleVariance = (Math.random() * 2 - 1) * styleConfig.angleVariance * 2;
    const randomBaseAngle = (Math.random() * 360); // Completely random base angle
    const newAngle = parentAngle + randomBaseAngle + angleVariance;
    
    // Chaos branches have more variance in length
    const lengthVariance = 0.5 + Math.random() * 0.5;
    
    // Calculate new endpoint
    const branch: Branch = {
      startX: parentEndX,
      startY: parentEndY,
      endX: parentEndX + newLength * lengthVariance * Math.cos(toRadians(newAngle)),
      endY: parentEndY + newLength * lengthVariance * Math.sin(toRadians(newAngle)),
      angle: newAngle,
      depth: newDepth,
      isCoherent: false,
      length: newLength * lengthVariance,
      width: newWidth * 0.8,
      color: styleConfig.colorScheme[0] // Use the first color for chaos branches
    };
    
    branches.push(branch);
    
    // Chaos branches only extend 1 level further to prevent overwhelming the visualization
    if (Math.random() < 0.3) { // Only 30% of chaos branches spawn more branches
      generateBranches(branch, branches, maxDepth - 1, 1, 1, styleConfig);
    }
  }
}

/**
 * Get branch style configuration based on selected style
 */
function getBranchStyleConfig(style: BranchStyle): BranchConfig {
  switch (style) {
    case BranchStyle.GEOMETRIC:
      return {
        style,
        baseLength: 100,
        lengthReduction: 0.2,
        angleVariance: 5,
        colorScheme: ['#3498db', '#2980b9', '#1f6da9', '#185d91', '#124e79']
      };
      
    case BranchStyle.ORGANIC:
      return {
        style,
        baseLength: 90,
        lengthReduction: 0.25,
        angleVariance: 15,
        colorScheme: ['#2ecc71', '#27ae60', '#1e8449', '#196f3d', '#145a32']
      };
      
    case BranchStyle.NEURAL:
      return {
        style,
        baseLength: 80,
        lengthReduction: 0.15,
        angleVariance: 10,
        colorScheme: ['#9b59b6', '#8e44ad', '#6c3483', '#5b2c6f', '#4a235a']
      };
      
    case BranchStyle.QUANTUM:
    default:
      return {
        style,
        baseLength: 110,
        lengthReduction: 0.22,
        angleVariance: 8,
        colorScheme: ['#e74c3c', '#c0392b', '#a93226', '#922b21', '#7b241c']
      };
  }
}

/**
 * Create a SVG path string from branches
 */
export function branchesToSvgPath(branches: Branch[]): string {
  let pathString = '';
  
  branches.forEach(branch => {
    pathString += `M${branch.startX},${branch.startY} L${branch.endX},${branch.endY} `;
  });
  
  return pathString;
}

/**
 * Calculate the SVG viewBox for the branch system
 */
export function calculateViewBox(branches: Branch[]): string {
  // Find min and max coordinates
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;
  
  branches.forEach(branch => {
    minX = Math.min(minX, branch.startX, branch.endX);
    minY = Math.min(minY, branch.startY, branch.endY);
    maxX = Math.max(maxX, branch.startX, branch.endX);
    maxY = Math.max(maxY, branch.startY, branch.endY);
  });
  
  // Add some padding
  const padding = 20;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;
  
  const width = maxX - minX;
  const height = maxY - minY;
  
  return `${minX} ${minY} ${width} ${height}`;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}