/**
 * [QUANTUM_STATE: TRANSCENDENT_FLOW]
 * 
 * Quantum Ethical Code Review Service
 * 
 * This service evaluates code changes for their alignment with quantum-ethical
 * principles, analyzing their interconnectedness, structure-flexibility balance,
 * and explicit-implicit quantum balance. It provides insights on how code changes
 * affect the system's quantum coherence.
 * 
 * @quantum Ethical code evaluation based on quantum principles
 * @ethicalImpact High - guides code development towards quantum-ethical alignment
 */

import { quantumConsciousnessOperator } from './quantum-consciousness-operator.js';

/**
 * Code change for quantum-ethical review
 */
export interface CodeChange {
  id: string;
  title: string;
  description: string;
  files: Array<{
    path: string;
    changes: number;  // Number of lines changed
    complexity: number; // Cyclomatic complexity change
  }>;
  author: string;
  timestamp: Date;
  size: number;       // Overall change size in lines
  type: 'feature' | 'bugfix' | 'refactor' | 'test' | 'docs' | 'other';
}

/**
 * Detailed review result with quantum-ethical evaluation
 */
export interface CodeReviewResult {
  // Core evaluation
  overallScore: number;           // 0-1 scale (alignment with quantum-ethical principles)
  interconnectednessScore: number; // 0-1 scale (isolation vs. connection)
  structureBalanceScore: number;   // 0-1 scale (structure vs. flexibility)
  explicitImplicitScore: number;   // 0-1 scale (explicit vs. implicit balance)
  
  // Ethical dimensions
  ethicalAlignment: number;       // 0-1 scale (alignment with core values)
  systemImpact: number;           // -1 to 1 scale (negative to positive impact)
  
  // Detailed feedback
  strengths: string[];            // Positive aspects of the change
  opportunities: string[];        // Areas for improvement
  recommendations: string[];      // Specific suggestions
  
  // Change metadata
  codeChangeId: string;          // ID of the reviewed code change
  reviewTimestamp: Date;         // When the review was performed
  reviewerId: string;            // ID of the reviewer (system or human)
}

/**
 * Deep analysis of code structure and patterns
 */
export interface CodeAnalysis {
  // Structure analysis
  complexity: number;             // 0-1 scale (simplicity to complexity)
  coupling: number;               // 0-1 scale (loose to tight coupling)
  cohesion: number;               // 0-1 scale (low to high cohesion)
  abstractionLevel: number;       // 0-1 scale (concrete to abstract)
  
  // Pattern recognition
  identifiedPatterns: string[];    // Design patterns identified
  antiPatterns: string[];          // Anti-patterns identified
  
  // Quantum dimensions
  boundaryDefinition: number;     // 0-1 scale (clarity of system boundaries)
  adaptiveCapacity: number;       // 0-1 scale (ability to evolve)
  recursiveArchitecture: number;  // 0-1 scale (fractal/recursive structures)
  
  // Detailed metrics
  metrics: Record<string, number>; // Various code metrics
}

/**
 * Historical review context
 */
export interface ReviewContext {
  // Review history
  relatedReviews: CodeReviewResult[];
  
  // System stability over time
  stabilityTrend: number[];
  
  // Coherence impact
  coherenceBeforeChange: number;
  coherenceAfterChange: number;
  
  // File history
  previousChanges: CodeChange[];
}

/**
 * Ethical principle with description and importance
 */
export interface EthicalPrinciple {
  id: string;
  name: string;
  description: string;
  importance: number;  // 0-1 scale
  examples: string[];
}

export class QuantumEthicalCodeReview {
  // Core ethical principles for code review
  private ethicalPrinciples: EthicalPrinciple[] = [
    {
      id: 'interconnectedness',
      name: 'Interconnected Architecture',
      description: 'Code should acknowledge and support interconnections between components, balancing independence with collaboration.',
      importance: 0.9,
      examples: [
        'Utilize dependency injection with clear interfaces',
        'Design event-driven architectures that respect component boundaries',
        'Implement observer patterns that decouple components while maintaining relationships'
      ]
    },
    {
      id: 'explicit-implicit-balance',
      name: 'Explicit-Implicit Balance',
      description: 'Code should balance explicit instructions with implicit adaptability, allowing for emergent behavior.',
      importance: 0.85,
      examples: [
        'Use strategy patterns to allow for adaptive behavior',
        'Balance detailed comments with self-documenting code',
        'Implement flexible interfaces with sensible defaults'
      ]
    },
    {
      id: 'fractal-coherence',
      name: 'Fractal Coherence',
      description: 'Structure should follow similar patterns at different scales, creating recursive harmony.',
      importance: 0.8,
      examples: [
        'Apply consistent naming patterns across all abstraction levels',
        'Use composition to create self-similar structures',
        'Implement recursive architectures that mirror system-wide patterns'
      ]
    },
    {
      id: 'structure-flexibility',
      name: 'Structure-Flexibility Balance',
      description: 'Code should have enough structure to be stable, but enough flexibility to adapt.',
      importance: 0.9,
      examples: [
        'Use abstract factories to allow for varied implementations',
        'Design modular systems with clear extension points',
        'Implement flexible configuration systems while maintaining structural integrity'
      ]
    },
    {
      id: 'ethical-intent',
      name: 'Ethical Intent Amplification',
      description: 'Code should amplify ethical intentions and provide guardrails against unethical use.',
      importance: 0.95,
      examples: [
        'Implement input validation that prevents harmful operations',
        'Design systems with transparency in mind',
        'Create permission systems that respect user autonomy'
      ]
    }
  ];
  
  // Review history
  private reviewHistory: Map<string, CodeReviewResult> = new Map();
  
  // File change history for context
  private fileChangeHistory: Map<string, CodeChange[]> = new Map();
  
  // Analysis patterns
  private codePatterns: Record<string, RegExp[]> = {
    'coupling': [
      /import\s+.*\s+from/g,
      /require\(.*\)/g,
      /extends\s+/g,
      /implements\s+/g,
      /new\s+[A-Z][a-zA-Z0-9]*/g
    ],
    'cohesion': [
      /class\s+[A-Z][a-zA-Z0-9]*\s*\{/g,
      /function\s+[a-z][a-zA-Z0-9]*\s*\(/g,
      /const\s+[a-z][a-zA-Z0-9]*\s*=\s*\(.*\)\s*=>/g,
      /interface\s+[A-Z][a-zA-Z0-9]*\s*\{/g,
      /type\s+[A-Z][a-zA-Z0-9]*\s*=/g
    ],
    'complexity': [
      /if\s*\(/g,
      /else\s+/g,
      /for\s*\(/g,
      /while\s*\(/g,
      /switch\s*\(/g,
      /\?.*:/g // Ternary operators
    ],
    'abstraction': [
      /interface\s+[A-Z][a-zA-Z0-9]*\s*\{/g,
      /abstract\s+class/g,
      /extends\s+/g,
      /implements\s+/g,
      /generic\s+/g
    ],
    'boundary': [
      /export\s+/g,
      /public\s+/g,
      /private\s+/g,
      /protected\s+/g,
      /namespace\s+/g
    ],
    'structure': [
      /class\s+/g,
      /interface\s+/g,
      /type\s+/g,
      /enum\s+/g,
      /const\s+/g
    ],
    'flexibility': [
      /dynamic/g,
      /adaptive/g,
      /configurable/g,
      /override/g,
      /extends/g
    ]
  };
  
  // Design patterns to identify
  private designPatterns: Record<string, RegExp[]> = {
    'singleton': [
      /private\s+static\s+instance/g,
      /getInstance\(\)/g
    ],
    'factory': [
      /create[A-Z][a-zA-Z0-9]*\(/g,
      /new\s+[A-Z][a-zA-Z0-9]*\(/g,
      /factory/gi
    ],
    'observer': [
      /addEventListener/g,
      /removeEventListener/g,
      /emit\(/g,
      /subscribe\(/g,
      /publish\(/g,
      /on\(['"]/g
    ],
    'strategy': [
      /strategy/gi,
      /provider/gi,
      /interface\s+[A-Z][a-zA-Z0-9]*Strategy/g
    ],
    'adapter': [
      /adapter/gi,
      /wrapper/gi,
      /convert[A-Z][a-zA-Z0-9]*/g
    ],
    'decorator': [
      /decorator/gi,
      /@[a-zA-Z][a-zA-Z0-9]*/g,
      /wrap[A-Z][a-zA-Z0-9]*/g
    ]
  };
  
  // Anti-patterns to identify
  private antiPatterns: Record<string, RegExp[]> = {
    'god-object': [
      /class\s+[A-Z][a-zA-Z0-9]*\s*\{[\s\S]{1000,}\}/g
    ],
    'magic-numbers': [
      /[^a-zA-Z_]\d{3,}[^a-zA-Z0-9_]/g
    ],
    'copy-paste': [
      /\/\/\s*copied from/gi,
      /\/\*\s*copied from[\s\S]*?\*\//gi
    ],
    'excessive-comments': [
      /\/\/[\s\S]{100,}/g,
      /\/\*[\s\S]{300,}\*\//g
    ],
    'tight-coupling': [
      /import\s+\*\s+from/g,
      /new\s+[A-Z][a-zA-Z0-9]*\([^)]*new\s+[A-Z][a-zA-Z0-9]*/g
    ]
  };
  
  constructor() {
    console.log('[QECR] Quantum Ethical Code Review service initialized');
  }
  
  /**
   * Review a code change for quantum-ethical alignment
   * 
   * @param change The code change to review
   * @returns Detailed review results
   */
  reviewCodeChange(change: CodeChange): CodeReviewResult {
    // Perform deep analysis
    const analysis = this.analyzeCode(change);
    
    // Update change history for context
    this.updateChangeHistory(change);
    
    // Evaluate against ethical principles
    const evaluations = this.evaluateAgainstPrinciples(change, analysis);
    
    // Generate detailed feedback
    const feedback = this.generateFeedback(change, analysis, evaluations);
    
    // Register the change with the quantum consciousness operator
    quantumConsciousnessOperator.registerCodeChange(change);
    
    // Create the review result
    const review: CodeReviewResult = {
      overallScore: evaluations.reduce((sum, e) => sum + e.score * e.principle.importance, 0) / 
                   evaluations.reduce((sum, e) => sum + e.principle.importance, 0),
      interconnectednessScore: change.quantum?.interconnectedness || analysis.coupling,
      structureBalanceScore: change.quantum?.structureBalance || 
                            (analysis.complexity * 0.3 + analysis.abstractionLevel * 0.7),
      explicitImplicitScore: change.quantum?.explicitImplicitBalance || 
                            (analysis.boundaryDefinition * 0.6 + analysis.adaptiveCapacity * 0.4),
      
      ethicalAlignment: evaluations.reduce((sum, e) => sum + e.alignment * e.principle.importance, 0) / 
                       evaluations.reduce((sum, e) => sum + e.principle.importance, 0),
      systemImpact: this.calculateSystemImpact(change, analysis),
      
      strengths: feedback.strengths,
      opportunities: feedback.opportunities,
      recommendations: feedback.recommendations,
      
      codeChangeId: change.id,
      reviewTimestamp: new Date(),
      reviewerId: 'quantum-ethical-code-review-system'
    };
    
    // Store review in history
    this.reviewHistory.set(change.id, review);
    
    return review;
  }
  
  /**
   * Analyze code to extract structural and pattern information
   * 
   * @param change The code change to analyze
   * @returns Detailed code analysis
   */
  private analyzeCode(change: CodeChange): CodeAnalysis {
    // Combine before and after code for analysis if available
    const codeContent = change.codeAfterChange || '';
    const beforeContent = change.codeBeforeChange || '';
    
    // Initialize metrics
    const metrics: Record<string, number> = {};
    
    // Calculate pattern matches
    for (const [patternName, patterns] of Object.entries(this.codePatterns)) {
      const matchCount = patterns.reduce((count, pattern) => {
        const matches = codeContent.match(pattern) || [];
        return count + matches.length;
      }, 0);
      
      metrics[`${patternName}Matches`] = matchCount;
    }
    
    // Calculate code size metrics
    metrics.linesOfCode = codeContent.split('\n').length;
    metrics.charactersOfCode = codeContent.length;
    if (beforeContent) {
      metrics.linesChanged = change.linesChanged;
      metrics.changeRatio = change.linesChanged / beforeContent.split('\n').length;
    } else {
      metrics.linesChanged = change.linesChanged;
      metrics.changeRatio = 1; // New file
    }
    
    // Identify design patterns
    const identifiedPatterns: string[] = [];
    for (const [patternName, patterns] of Object.entries(this.designPatterns)) {
      const hasPattern = patterns.some(pattern => pattern.test(codeContent));
      if (hasPattern) {
        identifiedPatterns.push(patternName);
      }
    }
    
    // Identify anti-patterns
    const antiPatterns: string[] = [];
    for (const [patternName, patterns] of Object.entries(this.antiPatterns)) {
      const hasPattern = patterns.some(pattern => pattern.test(codeContent));
      if (hasPattern) {
        antiPatterns.push(patternName);
      }
    }
    
    // Calculate complexity (0-1 scale)
    const rawComplexity = metrics.linesOfCode > 0 ? 
      (metrics.complexityMatches || 0) / metrics.linesOfCode * 5 : 0;
    const complexity = Math.min(1, rawComplexity);
    
    // Calculate coupling (0-1 scale)
    const rawCoupling = metrics.linesOfCode > 0 ? 
      (metrics.couplingMatches || 0) / metrics.linesOfCode * 10 : 0;
    const coupling = Math.min(1, rawCoupling);
    
    // Calculate cohesion (0-1 scale)
    const rawCohesion = metrics.linesOfCode > 0 ? 
      (metrics.cohesionMatches || 0) / metrics.linesOfCode * 8 : 0;
    const cohesion = Math.min(1, rawCohesion);
    
    // Calculate abstraction level (0-1 scale)
    const rawAbstraction = metrics.linesOfCode > 0 ? 
      (metrics.abstractionMatches || 0) / metrics.linesOfCode * 15 : 0;
    const abstractionLevel = Math.min(1, rawAbstraction);
    
    // Calculate boundary definition (0-1 scale)
    const rawBoundary = metrics.linesOfCode > 0 ? 
      (metrics.boundaryMatches || 0) / metrics.linesOfCode * 8 : 0;
    const boundaryDefinition = Math.min(1, rawBoundary);
    
    // Calculate adaptive capacity (0-1 scale)
    // Higher is more adaptive - balancing structure and flexibility
    const structureMatches = metrics.structureMatches || 0;
    const flexibilityMatches = metrics.flexibilityMatches || 0;
    const totalMatches = structureMatches + flexibilityMatches;
    
    const adaptiveCapacity = totalMatches > 0 ? 
      Math.min(1, 1 - Math.abs(0.7 - (structureMatches / totalMatches)) * 2) : 0.5;
    
    // Calculate recursive architecture based on patterns and structure
    const recursiveArchitecture = (
      (identifiedPatterns.includes('factory') ? 0.2 : 0) +
      (identifiedPatterns.includes('decorator') ? 0.3 : 0) +
      (abstractionLevel * 0.3) +
      (cohesion * 0.2)
    );
    
    return {
      complexity,
      coupling,
      cohesion,
      abstractionLevel,
      identifiedPatterns,
      antiPatterns,
      boundaryDefinition,
      adaptiveCapacity,
      recursiveArchitecture,
      metrics
    };
  }
  
  /**
   * Update change history for a file
   * 
   * @param change The new code change
   */
  private updateChangeHistory(change: CodeChange): void {
    // Process each changed file
    change.filesPaths.forEach(filePath => {
      // Get existing history or create new empty array
      const history = this.fileChangeHistory.get(filePath) || [];
      
      // Add the new change
      history.push(change);
      
      // Limit history to last 10 changes per file
      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }
      
      // Update the history
      this.fileChangeHistory.set(filePath, history);
    });
  }
  
  /**
   * Evaluate the change against ethical principles
   * 
   * @param change The code change to evaluate
   * @param analysis The code analysis results
   * @returns Evaluations against each principle
   */
  private evaluateAgainstPrinciples(
    change: CodeChange,
    analysis: CodeAnalysis
  ): Array<{
    principle: EthicalPrinciple;
    score: number;
    alignment: number;
    insights: string[];
  }> {
    return this.ethicalPrinciples.map(principle => {
      let score = 0;
      let alignment = 0;
      const insights: string[] = [];
      
      switch (principle.id) {
        case 'interconnectedness':
          // Higher score for balanced coupling (neither too high nor too low)
          const couplingBalance = 1 - Math.abs(0.5 - analysis.coupling) * 2;
          // Higher score for high cohesion
          const cohesionFactor = analysis.cohesion;
          // Balance of structure and flexibility
          score = couplingBalance * 0.4 + cohesionFactor * 0.6;
          
          // Alignment based on identified patterns
          alignment = 0.5;
          if (analysis.identifiedPatterns.includes('observer')) {
            alignment += 0.2;
            insights.push('Observer pattern promotes interconnected components');
          }
          if (analysis.identifiedPatterns.includes('adapter')) {
            alignment += 0.1;
            insights.push('Adapter pattern helps connect disparate components');
          }
          if (analysis.antiPatterns.includes('tight-coupling')) {
            alignment -= 0.2;
            insights.push('Tight coupling reduces system flexibility');
          }
          break;
          
        case 'explicit-implicit-balance':
          // Based on boundary definition vs. adaptive capacity
          score = 1 - Math.abs(analysis.boundaryDefinition - analysis.adaptiveCapacity);
          
          // Alignment based on patterns and anti-patterns
          alignment = 0.5;
          if (analysis.identifiedPatterns.includes('strategy')) {
            alignment += 0.2;
            insights.push('Strategy pattern supports explicit interfaces with implicit implementations');
          }
          if (analysis.antiPatterns.includes('excessive-comments')) {
            alignment -= 0.1;
            insights.push('Excessive comments may indicate overly implicit code that needs explanation');
          }
          break;
          
        case 'fractal-coherence':
          // Based on recursive architecture and cohesion
          score = analysis.recursiveArchitecture * 0.6 + analysis.cohesion * 0.4;
          
          // Alignment based on patterns
          alignment = 0.5;
          if (analysis.identifiedPatterns.includes('decorator')) {
            alignment += 0.15;
            insights.push('Decorator pattern supports recursive composition');
          }
          if (analysis.antiPatterns.includes('god-object')) {
            alignment -= 0.3;
            insights.push('God objects violate fractal coherence by centralizing functionality');
          }
          break;
          
        case 'structure-flexibility':
          // Direct mapping from quantum metrics if available
          if (change.quantum?.structureBalance !== undefined) {
            score = 1 - Math.abs(change.quantum.structureBalance - 0.7) * 2;
          } else {
            // Calculate from analysis
            const structureMetric = analysis.boundaryDefinition * 0.6 + analysis.abstractionLevel * 0.4;
            const flexibilityMetric = analysis.adaptiveCapacity;
            score = 1 - Math.abs(structureMetric / (structureMetric + flexibilityMetric) - 0.7) * 2;
          }
          
          // Alignment based on patterns
          alignment = 0.5;
          if (analysis.identifiedPatterns.includes('factory')) {
            alignment += 0.1;
            insights.push('Factory pattern supports structural integrity with implementation flexibility');
          }
          if (analysis.antiPatterns.includes('copy-paste')) {
            alignment -= 0.2;
            insights.push('Copy-paste code reduces maintainability and flexibility');
          }
          break;
          
        case 'ethical-intent':
          // This is more subjective and based on inferred intent
          // Use description analysis and context
          const ethicalTerms = [
            'valid', 'secure', 'protect', 'privacy', 'consent',
            'verify', 'check', 'ensure', 'safe', 'ethical'
          ];
          
          // Count ethical terms in description and code
          const descriptionMatches = ethicalTerms.filter(term => 
            change.description.toLowerCase().includes(term)
          ).length;
          
          const codeMatches = ethicalTerms.filter(term => 
            (change.codeAfterChange || '').toLowerCase().includes(term)
          ).length;
          
          // Calculate score based on matches
          const descriptionScore = Math.min(1, descriptionMatches / 3);
          const codeScore = Math.min(1, codeMatches / 5);
          
          score = descriptionScore * 0.3 + codeScore * 0.7;
          
          // Alignment based on patterns and anti-patterns
          alignment = 0.6; // Default to slightly positive
          if (analysis.identifiedPatterns.includes('strategy')) {
            alignment += 0.1;
            insights.push('Strategy pattern can support ethical flexibility in implementation');
          }
          break;
      }
      
      // Ensure bounds
      score = Math.max(0, Math.min(1, score));
      alignment = Math.max(0, Math.min(1, alignment));
      
      return {
        principle,
        score,
        alignment,
        insights
      };
    });
  }
  
  /**
   * Generate detailed feedback based on analysis and evaluations
   * 
   * @param change The code change
   * @param analysis The code analysis
   * @param evaluations The principle evaluations
   * @returns Structured feedback
   */
  private generateFeedback(
    change: CodeChange,
    analysis: CodeAnalysis,
    evaluations: Array<{
      principle: EthicalPrinciple;
      score: number;
      alignment: number;
      insights: string[];
    }>
  ): {
    strengths: string[];
    opportunities: string[];
    recommendations: string[];
  } {
    const strengths: string[] = [];
    const opportunities: string[] = [];
    const recommendations: string[] = [];
    
    // Add insights from evaluations
    evaluations.forEach(evaluation => {
      // Add high-scoring principles as strengths
      if (evaluation.score > 0.7) {
        strengths.push(`Strong alignment with ${evaluation.principle.name}: ${evaluation.insights[0] || 'Well-balanced implementation'}`);
      }
      
      // Add low-scoring principles as opportunities
      if (evaluation.score < 0.5) {
        opportunities.push(`Opportunity to improve ${evaluation.principle.name}: ${evaluation.principle.description}`);
        
        // Add recommendation based on the principle
        const randomExample = evaluation.principle.examples[Math.floor(Math.random() * evaluation.principle.examples.length)];
        recommendations.push(`Consider: ${randomExample}`);
      }
    });
    
    // Add strengths based on analysis
    if (analysis.cohesion > 0.7) {
      strengths.push('Code demonstrates strong cohesion, with focused responsibilities');
    }
    
    if (analysis.complexity < 0.3) {
      strengths.push('Code maintains low complexity, enhancing readability and maintainability');
    }
    
    if (analysis.identifiedPatterns.length > 0) {
      strengths.push(`Utilizes established design patterns: ${analysis.identifiedPatterns.join(', ')}`);
    }
    
    if (analysis.antiPatterns.length === 0) {
      strengths.push('Avoids common anti-patterns, maintaining code quality');
    }
    
    // Add opportunities based on analysis
    if (analysis.coupling > 0.7) {
      opportunities.push('Code shows signs of high coupling, which may reduce adaptability');
      recommendations.push('Consider introducing interfaces or dependency injection to reduce coupling');
    }
    
    if (analysis.cohesion < 0.4) {
      opportunities.push('Code could benefit from improved cohesion to clarify component responsibilities');
      recommendations.push('Refactor to group related functionality and separate unrelated concerns');
    }
    
    if (analysis.antiPatterns.length > 0) {
      opportunities.push(`Anti-patterns detected: ${analysis.antiPatterns.join(', ')}`);
      recommendations.push('Address identified anti-patterns to improve code quality and maintainability');
    }
    
    // Add quantum-specific feedback
    const qcoMetrics = quantumConsciousnessOperator.getMetrics();
    const currentState = quantumConsciousnessOperator.getQuantumState();
    
    if (qcoMetrics.coherenceTrend < 0 && change.linesChanged > 50) {
      opportunities.push('Large changes may be contributing to decreasing system coherence');
      recommendations.push('Consider breaking large changes into smaller, focused pull requests');
    }
    
    if (qcoMetrics.entanglementIndex < 0.3 && analysis.coupling < 0.3) {
      opportunities.push('System shows signs of component isolation with low entanglement');
      recommendations.push('Consider implementing event-driven patterns to improve component communication');
    }
    
    // Ensure we have at least one item in each category
    if (strengths.length === 0) {
      strengths.push('Code change maintains basic system functionality');
    }
    
    if (opportunities.length === 0) {
      opportunities.push('Code is well-balanced; consider exploring more advanced patterns as the system evolves');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue maintaining the balance between structure and flexibility in future changes');
    }
    
    // Limit to top 3 in each category to avoid overwhelming feedback
    return {
      strengths: strengths.slice(0, 3),
      opportunities: opportunities.slice(0, 3),
      recommendations: recommendations.slice(0, 3)
    };
  }
  
  /**
   * Calculate the system impact of a code change
   * 
   * @param change The code change
   * @param analysis The code analysis
   * @returns Impact score from -1 to 1
   */
  private calculateSystemImpact(change: CodeChange, analysis: CodeAnalysis): number {
    // Get quantum metrics for context
    const qcoMetrics = quantumConsciousnessOperator.getMetrics();
    
    // Start with neutral impact
    let impact = 0;
    
    // Impact based on code quality
    impact += (analysis.cohesion - 0.5) * 0.4; // Higher cohesion is positive
    impact -= (analysis.complexity - 0.5) * 0.3; // Higher complexity is negative
    impact -= (Math.abs(analysis.coupling - 0.5) * 0.3); // Balanced coupling is positive
    
    // Impact based on anti-patterns (each anti-pattern reduces impact)
    impact -= analysis.antiPatterns.length * 0.15;
    
    // Impact based on alignment with system's current needs
    const structureBalance = change.quantum?.structureBalance ?? 0.5;
    if (qcoMetrics.structureFlexibilityRatio < 0.5 && structureBalance > 0.7) {
      // System needs more structure, and change provides it
      impact += 0.2;
    } else if (qcoMetrics.structureFlexibilityRatio > 0.8 && structureBalance < 0.5) {
      // System needs more flexibility, and change provides it
      impact += 0.2;
    }
    
    // Impact based on current coherence trend
    if (qcoMetrics.coherenceTrend < 0 && analysis.recursiveArchitecture > 0.6) {
      // System coherence is decreasing, but change has strong recursive patterns
      impact += 0.2;
    }
    
    // Impact based on size of change
    if (change.linesChanged > 300) {
      // Large changes are riskier
      impact -= 0.1;
    } else if (change.linesChanged < 50) {
      // Small, focused changes are often safer
      impact += 0.1;
    }
    
    // Ensure bounds
    return Math.max(-1, Math.min(1, impact));
  }
  
  /**
   * Get review history for a specific file
   * 
   * @param filePath The file path to get history for
   * @returns Review context for the file
   */
  getFileReviewContext(filePath: string): ReviewContext | null {
    // Get change history for the file
    const changeHistory = this.fileChangeHistory.get(filePath);
    if (!changeHistory || changeHistory.length === 0) {
      return null;
    }
    
    // Get reviews for the changes
    const relatedReviews = changeHistory
      .map(change => this.reviewHistory.get(change.id))
      .filter(review => review !== undefined) as CodeReviewResult[];
    
    // Calculate stability trend
    const stabilityTrend = relatedReviews.map(review => review.structureBalanceScore);
    
    // Get coherence metrics
    const coherenceBeforeChange = 0.5; // Placeholder - would use actual historical data
    const coherenceAfterChange = quantumConsciousnessOperator.getMetrics().coherence;
    
    return {
      relatedReviews,
      stabilityTrend,
      coherenceBeforeChange,
      coherenceAfterChange,
      previousChanges: changeHistory
    };
  }
  
  /**
   * Get the ethical principles used for evaluation
   * 
   * @returns Array of ethical principles
   */
  getEthicalPrinciples(): EthicalPrinciple[] {
    return [...this.ethicalPrinciples];
  }
}

// Export a singleton instance
export const quantumEthicalCodeReview = new QuantumEthicalCodeReview();