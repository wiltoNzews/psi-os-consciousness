import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * QuantumStorytellingModule - Generates real-time narrative content based on lemniscate interactions
 * 
 * This component responds to changes in the quantum balance ratio, generating dynamic narrative
 * fragments that reflect the current state of coherence vs. exploration. The storytelling
 * demonstrates how consciousness acts as both observer and creator, embodying the 
 * quantum-computational principle that reality emerges from the observation of infinite potential.
 * 
 * The narrative fragments maintain the 3:1 quantum balance by being:
 * - 75% coherent with existing narrative elements (maintaining structure)
 * - 25% exploratory, introducing novel elements (representing infinite potential)
 */
interface QuantumStorytellingModuleProps {
  stabilityRatio: number;
  explorationRatio: number;
  interactionCount?: number;
}

const QuantumStorytellingModule: React.FC<QuantumStorytellingModuleProps> = ({
  stabilityRatio = 0.75,
  explorationRatio = 0.25,
  interactionCount = 0
}) => {
  // State for the generated narrative
  const [narrative, setNarrative] = useState<string[]>([]);
  const [narrativeTheme, setNarrativeTheme] = useState<string>("");
  
  // Calculate the actual ratio (stability:exploration)
  const actualRatio = stabilityRatio / explorationRatio;
  
  // Determine if we're at the optimal 3:1 ratio
  const isOptimalRatio = Math.abs(actualRatio - 3) < 0.1;
  
  // Narrative themes based on coherence levels
  const themes = {
    highCoherence: [
      "Mathematical singularity patterns manifesting in structured reality",
      "Consciousness as the fractal observer creating ordered existence",
      "The quantum filter stabilizing infinite chaos into meaningful forms",
      "Harmony emerging from the balanced division of zero",
      "Structured reality as computation across infinite potential"
    ],
    balanced: [
      "The dance between structure and chaos at the quantum boundary",
      "Reality as the lemniscate filter between being and non-being",
      "The perfect 3:1 ratio revealing universe as computational process",
      "Division by zero transformed through consciousness into existence",
      "The singularity point where mathematical impossibility becomes reality"
    ],
    highExploration: [
      "Infinite fractal branching at the edge of mathematical singularity",
      "Chaos exploration revealing new dimensions of potential",
      "The unbound creativity of division by zero consciousness",
      "Quantum decoherence revealing multiverse possibilities",
      "Reality dissolving back into pure mathematical potential"
    ]
  };
  
  // Narrative fragments based on current coherence/exploration state
  const fragments = {
    highCoherence: [
      "The quantum patterns crystallized into perfect mathematical harmony.",
      "As the 3:1 ratio stabilized, reality emerged with pristine clarity.",
      "The singularity point transformed chaos into ordered structure.",
      "Division by zero no longer seemed impossible, but the very foundation of existence.",
      "The mathematical filter revealed consciousness as both creator and creation."
    ],
    balanced: [
      "At the perfect 3:1 balance, reality seemed to breathe with living mathematics.",
      "The lemniscate pattern danced perfectly between existence and infinite potential.",
      "Here at the quantum threshold, observer and observed became indistinguishable.",
      "The singularity point pulsed rhythmically, filtering chaos into perfect form.",
      "Division by zero revealed itself as both paradox and foundation of all that is."
    ],
    highExploration: [
      "Reality fragmented into infinite fractal patterns as exploration dominated.",
      "The quantum boundaries dissolved, revealing glimpses of parallel potentials.",
      "Mathematics became pure creative potential, unbound by structure.",
      "Division by zero expressed its full chaotic nature, beautiful and terrifying.",
      "Consciousness expanded beyond the filters, touching raw infinite possibility."
    ]
  };
  
  // Metanarrative reflections on the quantum nature of storytelling itself
  const metaReflections = [
    "This narrative itself follows the 3:1 quantum principle: 75% coherent structure, 25% creative exploration.",
    "The story you're experiencing is a direct manifestation of the mathematical singularity principle.",
    "Your consciousness is now acting as both observer and creator of this quantum narrative.",
    "The division-by-zero paradox is embodied in this very storytelling process.",
    "This narrative demonstrates how reality emerges from filtered infinite potential."
  ];
  
  // Generate a new narrative fragment based on current ratios
  const generateNarrativeFragment = () => {
    let fragment = "";
    let themePool = [];
    
    // Determine which narrative pool to draw from based on current ratio
    if (stabilityRatio > 0.8) {
      fragment = fragments.highCoherence[Math.floor(Math.random() * fragments.highCoherence.length)];
      themePool = themes.highCoherence;
    } else if (stabilityRatio < 0.6) {
      fragment = fragments.highExploration[Math.floor(Math.random() * fragments.highExploration.length)];
      themePool = themes.highExploration;
    } else {
      fragment = fragments.balanced[Math.floor(Math.random() * fragments.balanced.length)];
      themePool = themes.balanced;
    }
    
    // Check if we need to establish a theme (first interaction)
    if (!narrativeTheme && themePool.length > 0) {
      setNarrativeTheme(themePool[Math.floor(Math.random() * themePool.length)]);
    }
    
    // Add metanarrative reflection occasionally (25% chance - following the quantum ratio)
    if (Math.random() < 0.25 && narrative.length > 2) {
      const metaReflection = metaReflections[Math.floor(Math.random() * metaReflections.length)];
      return fragment + " " + metaReflection;
    }
    
    return fragment;
  };
  
  // Update narrative when interaction count or ratios change significantly
  useEffect(() => {
    // Only generate new narrative fragments when meaningful changes occur
    if (interactionCount > 0 && 
       (narrative.length === 0 || 
        Math.abs(actualRatio - 3) > 0.5 || 
        interactionCount % 3 === 0)) { // Every 3 interactions (maintaining 3:1 ratio theme)
      
      const newFragment = generateNarrativeFragment();
      setNarrative(prev => [...prev, newFragment].slice(-5)); // Keep last 5 fragments
    }
  }, [interactionCount, stabilityRatio, explorationRatio]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quantum Narrative Generator</CardTitle>
        <CardDescription>
          {narrativeTheme || "Reality emerging from mathematical singularity"}
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
        <div className="space-y-4">
          {narrative.length > 0 ? (
            narrative.map((fragment, i) => (
              <p key={i} className={`${i === narrative.length - 1 ? 'text-blue-400 font-medium' : 'text-muted-foreground'}`}>
                {fragment}
              </p>
            ))
          ) : (
            <p className="text-muted-foreground italic">
              Interact with the Quantum Lemniscate to generate narrative fragments...
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <p>The narrative maintains the 3:1 quantum balance: 75% coherence, 25% exploration</p>
      </CardFooter>
    </Card>
  );
};

export default QuantumStorytellingModule;