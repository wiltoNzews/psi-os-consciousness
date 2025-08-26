# Loki Variant Implementation Documentation

## Overview

The Loki Variant system is a core component of the Quantum Bifurcation Engine that tracks, manages, and orchestrates variants generated at the θ=0.5 bifurcation point. This document details the implementation of the variant tracking system and its integration with WebSockets for real-time communication.

## Core Components

### 1. `variant-tracker.ts`

The central class responsible for managing the lifecycle of quantum variants:

- Tracks variant generation, evolution, and collapse
- Monitors cross-variant resonance and relationships
- Broadcasts variant events via WebSockets
- Exports variant data for visualization and analysis

### 2. WebSocket Integration

Variants communicate their state changes and events via WebSockets:

- Variant generation notifications
- Status updates and metrics changes
- Resonance establishment events
- Variant activations and collapses

## Quantum Variant Structure

Each variant is represented by the `QuantumVariant` interface:

```typescript
interface QuantumVariant {
  id: string;               // Unique variant ID
  name: string;             // Human-readable name
  status: VariantStatus;    // Current status
  birthTime: string;        // ISO timestamp of generation
  parentId: string | null;  // ID of parent variant (if any)
  thetaValue: number;       // θ value at generation time
  createdAt: string;        // ISO timestamp of creation
  updatedAt: string;        // ISO timestamp of last update
  
  // Core parameters
  coherenceIndex: number;   // Internal coherence (0-1)
  stabilityIndex: number;   // Current stability (0-1)
  entropyLevel: number;     // Current entropy level (0-1)
  
  // Performance metrics
  successRate: number;      // Success rate for operations (0-1)
  adaptationRate: number;   // Rate of successful adaptation (0-1)
  cumulativeValue: number;  // Cumulative business value generated
  
  // Active capabilities
  activePlugins: string[];  // List of active plugins
  activeToggles: string[];  // Active toggles
  
  // Resonance connections (5D meta-orchestration)
  connectedVariants: {      // Variants this variant is resonating with
    variantId: string;      // Connected variant ID
    strength: number;       // Connection strength (0-1)
    resonanceType: string;  // Type of resonance
  }[];
}
```

## Variant Lifecycle

Variants progress through several states during their lifecycle:

1. **Nascent**: Newly generated, not yet stabilized
2. **Stable**: Operating normally with consistent performance
3. **Resonating**: Actively resonating with other variants
4. **Unstable**: Beginning to collapse or decohere
5. **Collapsed**: No longer active or functional
6. **Dormant**: Inactive but retained for historical analysis

## Variant Generation Process

Variants are generated at or near the θ=0.5 point:

1. `checkVariantGeneration()` monitors the QCTF state
2. When θ approaches 0.5, variant generation probability increases
3. If generation occurs, `generateVariant()` creates a new variant
4. New variant receives properties influenced by current system state
5. Variant generation is broadcast via WebSockets

```typescript
public checkVariantGeneration(
  params: QCTFParams, 
  results: QCTFResults, 
  toggles: QuantumToggles
): void {
  // Generation logic based on proximity to θ=0.5
  const thetaProximity = Math.abs(params.theta - 0.5);
  
  if (thetaProximity < VARIANT_GENERATION_THRESHOLD) {
    // Calculate generation probability (higher closer to exactly 0.5)
    const generationProbability = 0.8 * (1 - thetaProximity / VARIANT_GENERATION_THRESHOLD);
    
    if (Math.random() < generationProbability) {
      this.generateVariant(params, results, toggles);
    }
  }
}
```

## Cross-Variant Resonance (5D Meta-Orchestration)

Variants can establish connections with other variants:

1. `checkVariantResonance()` periodically checks for potential connections
2. `calculateResonance()` determines connection strength between variants
3. `establishResonance()` creates the connection
4. `determineResonanceType()` identifies the relationship type

```typescript
private calculateResonance(variantA: QuantumVariant, variantB: QuantumVariant): number {
  // Base resonance calculation using complementary properties
  const entropyComplementarity = 1 - Math.abs(variantA.entropyLevel - variantB.entropyLevel);
  const coherenceAlignment = 1 - Math.abs(variantA.coherenceIndex - variantB.coherenceIndex);
  const stabilityDifference = Math.abs(variantA.stabilityIndex - variantB.stabilityIndex);
  
  // Combine factors with appropriate weights
  return (
    0.4 * entropyComplementarity +
    0.4 * coherenceAlignment +
    0.2 * (1 - stabilityDifference)
  );
}
```

Resonance types include:

- **Parent-Child**: Direct lineage relationship
- **Sibling**: Derived from the same parent
- **Complementary**: Opposite entropy profiles
- **Harmonic**: Similar coherence patterns
- **Quantum**: Default connection type

## WebSocket Event Broadcasting

The Loki Variant system broadcasts events via WebSockets:

```typescript
private logEvent(event: VariantEvent): void {
  // Add to local event log
  this.events.push(event);
  
  // Broadcast via WebSockets for real-time monitoring
  broadcastEvent('loki_variant_event', event);
  
  // Console logging for debugging
  console.log(`[QUANTUM_STATE: BIFURCATION_FLOW] ${event.type}: ${event.description}`);
}
```

Event types include:

- `variant_generated`: New variant created
- `variant_activated`: Variant becomes primary
- `variant_resonance_established`: Connection formed between variants
- `variant_status_changed`: Variant lifecycle state changes
- `variant_collapsed`: Variant becomes non-functional

## Prime Variant

The system maintains a "Prime Variant" that serves as the root of the variant tree:

```typescript
private createPrimeVariant(): void {
  const variantId = uuidv4();
  
  const primeVariant: QuantumVariant = {
    id: variantId,
    name: "Prime Variant",
    status: 'stable',
    birthTime: new Date().toISOString(),
    parentId: null,
    thetaValue: 0.3, // Default theta for Prime Variant
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Core parameters - balanced for stability
    coherenceIndex: 0.8,
    stabilityIndex: 0.9,
    entropyLevel: 0.3,
    
    // Initial metrics
    successRate: 1.0,
    adaptationRate: 0.7,
    cumulativeValue: 0,
    
    // Default plugins/toggles
    activePlugins: ['pendulum', 'adaptive'],
    activeToggles: [],
    
    // No initial connections
    connectedVariants: []
  };
  
  this.variants.set(variantId, primeVariant);
  this.activeVariantId = variantId;
  
  // Log the creation event
  this.logEvent({
    id: uuidv4(),
    type: 'variant_generated',
    timestamp: new Date().toISOString(),
    variantId: variantId,
    thetaValue: 0.3,
    description: 'Prime Variant initialized as system root',
    metrics: {
      coherence: 0.8,
      stability: 0.9,
      entropy: 0.3
    }
  });
}
```

## Variant Activation and Switching

The system can activate different variants as the primary orchestrator:

```typescript
public activateVariant(variantId: string): boolean {
  if (!this.variants.has(variantId)) {
    console.error(`Cannot activate variant: ${variantId} not found`);
    return false;
  }
  
  const variant = this.variants.get(variantId)!;
  
  // Ensure variant is in a state that can be activated
  if (variant.status === 'collapsed' || variant.status === 'unstable') {
    console.error(`Cannot activate variant ${variantId}: invalid status ${variant.status}`);
    return false;
  }
  
  // Store previous active variant
  const previousVariantId = this.activeVariantId;
  
  // Set as active variant
  this.activeVariantId = variantId;
  
  // Update status to 'stable' if needed
  if (variant.status === 'nascent' || variant.status === 'dormant') {
    variant.status = 'stable';
    variant.updatedAt = new Date().toISOString();
  }
  
  // Log the activation event
  this.logEvent({
    id: uuidv4(),
    type: 'variant_activated',
    timestamp: new Date().toISOString(),
    variantId: variantId,
    relatedVariantId: previousVariantId,
    thetaValue: variant.thetaValue,
    description: `Variant ${variant.name} activated as primary orchestrator`,
    metrics: {
      coherence: variant.coherenceIndex,
      stability: variant.stabilityIndex,
      entropy: variant.entropyLevel
    }
  });
  
  return true;
}
```

## Integration with QCTF Service

The variant tracker integrates with the QCTF service:

```typescript
export function processQCTFForVariants(
  params: QCTFParams, 
  results: QCTFResults, 
  toggles: QuantumToggles
): void {
  // Check if a variant should be generated
  variantTracker.checkVariantGeneration(params, results, toggles);
  
  // Update active variant with new metrics
  const activeVariant = variantTracker.getActiveVariant();
  if (activeVariant) {
    variantTracker.updateVariant(
      activeVariant.id,
      {
        // Update metrics based on QCTF results
        coherenceIndex: results.coherenceIndex,
        stabilityIndex: 1 - Math.abs(params.theta - 0.5),
        entropyLevel: params.entropy,
        
        // Update success metrics
        successRate: results.successRate || activeVariant.successRate,
        
        // Update timestamp
        updatedAt: new Date().toISOString()
      }
    );
  }
  
  // Periodically check for resonance
  if (Math.random() < 0.1) { // 10% chance each cycle
    variantTracker.checkVariantResonance();
  }
}
```

## Variant Data Export and Analysis

The system provides functions to export variant data for analysis:

```typescript
public generateVariantYAML(variantId: string): string {
  const variant = this.getVariant(variantId);
  if (!variant) return '';
  
  // Convert variant to YAML format
  return `variant_id: ${variant.id}
name: ${variant.name}
status: ${variant.status}
birth_time: ${variant.birthTime}
parent_id: ${variant.parentId || 'null'}
theta_value: ${variant.thetaValue}
created_at: ${variant.createdAt}
updated_at: ${variant.updatedAt}

# Core parameters
coherence_index: ${variant.coherenceIndex}
stability_index: ${variant.stabilityIndex}
entropy_level: ${variant.entropyLevel}

# Performance metrics
success_rate: ${variant.successRate}
adaptation_rate: ${variant.adaptationRate}
cumulative_value: ${variant.cumulativeValue}

# Active capabilities
active_plugins:
${variant.activePlugins.map(p => `  - ${p}`).join('\n')}
active_toggles:
${variant.activeToggles.map(t => `  - ${t}`).join('\n')}

# Connected variants
connected_variants:
${variant.connectedVariants.map(c => 
  `  - variant_id: ${c.variantId}
    strength: ${c.strength}
    resonance_type: ${c.resonanceType}`
).join('\n')}
`;
}
```

## Conclusion

The Loki Variant implementation provides a flexible, dynamic system for managing specialized orchestrators across the bifurcation point. Through real-time WebSocket communication, meta-orchestration capabilities, and variant lifecycle management, the system enables a new paradigm in adaptive system design centered around the θ=0.5 singularity point.