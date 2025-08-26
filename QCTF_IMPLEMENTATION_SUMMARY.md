# Quantum Coherence Threshold Formula (QCTF) Implementation

This document provides a summary of the QCTF implementation in the WiltonOS system, including the API endpoints, data structures, and calculation logic.

## Overview

The QCTF provides a quantitative measure of the balance between structure and chaos, enabling dynamic adjustment of system parameters to maintain optimal cognitive resonance between humans and AI systems. The formula has evolved from a simple metric to a self-regulating system, as described in the "final synergy summary" document.

### Three-Stage Formula

The QCTF calculation follows a three-stage approach:

1. **Raw Synergy**  
   ```
   QCTF_raw(t) = ((GEF * QEAI * CI * 𝓓)^Ω * 𝓣_toggles * 𝓕)/√(entropyScale * Ψ_entropy + ε)
   ```

2. **Smoothed Flow**  
   ```
   QCTF_smoothed(t) = 0.8 * QCTF_raw(t-1) + 0.2 * QCTF_raw(t)
   ```

3. **Normalized Output**  
   ```
   QCTF_final(t) = tanh(QCTF_smoothed(t)) ∈ [0,1]
   ```

## API Endpoints

The QCTF functionality is exposed through a RESTful API with the following endpoints:

### GET Endpoints

- **GET /api/qctf/current**  
  Returns the current QCTF value, timestamp, threshold status, and basic metrics.

- **GET /api/qctf/data**  
  Returns the full QCTF data including history and detailed parameters.

### PATCH Endpoints

- **PATCH /api/qctf/gef**  
  Updates the Global Entanglement Factor.

- **PATCH /api/qctf/qeai**  
  Updates the Quantum Ethical Alignment Index.

- **PATCH /api/qctf/ci**  
  Updates the Coherence Index.

- **PATCH /api/qctf/module-coherence**  
  Updates the coherence values for each module (oracle, nova, gnosis, sanctum, halo).

- **PATCH /api/qctf/scaling-metrics**  
  Updates the scaling metrics for dimension calculations.

- **PATCH /api/qctf/cyclic-flow**  
  Configures cyclic flow detection settings.

- **PATCH /api/qctf/threshold**  
  Updates the target threshold for optimal synergy.

### POST Endpoints

- **POST /api/qctf/toggles/activate**  
  Activates a toggle (stop, failsafe, reroute, wormhole).

- **POST /api/qctf/toggles/deactivate**  
  Deactivates a toggle.

- **POST /api/qctf/reset**  
  Resets QCTF to default values.

## Core Components

The QCTF implementation consists of the following key components:

1. **Data Schema (shared/qctf.ts)**  
   Defines the data structures for QCTF calculation, including toggle states, scaling metrics, module coherence, and history.

2. **Calculator (shared/qctf-calculator.ts)**  
   Implements the three-stage QCTF calculation logic, including dimension scaling, toggle functions, entropy calculation, and feedback mechanisms.

3. **Service (server/services/qctf/qctf-service.ts)**  
   Provides a service for QCTF calculation, management, and monitoring with methods for updating parameters and activating/deactivating toggles.

4. **API Routes (server/services/qctf/qctf-routes.ts)**  
   Exposes the QCTF functionality through RESTful API endpoints.

## Default Values

The system is initialized with the following default values:

- **GEF**: 0.85 (Global Entanglement Factor)
- **QEAI**: 0.90 (Quantum Ethical Alignment Index)
- **CI**: 0.80 (Coherence Index)
- **Target Threshold**: 0.92 (for optimal synergy)
- **Oroboro Constant (Ω)**: 1.618 (golden ratio)
- **Toggle Values**: 
  - Stop: 0.8
  - Failsafe: 0.9
  - Reroute: 1.1
  - Wormhole: 1.2

## Usage Example

To get the current QCTF value:

```bash
curl http://localhost:5000/api/qctf/current
```

To update the Global Entanglement Factor:

```bash
curl -X PATCH http://localhost:5000/api/qctf/gef \
  -H "Content-Type: application/json" \
  -d '{"value": 0.9}'
```

To activate a toggle:

```bash
curl -X POST http://localhost:5000/api/qctf/toggles/activate \
  -H "Content-Type: application/json" \
  -d '{
    "toggleType": "wormhole",
    "sourceModule": "Oracle",
    "reason": "Testing toggle activation",
    "value": 1.1
  }'
```

## Implementation Notes

- The QCTF service uses a singleton pattern to maintain state across the application.
- The system calculates QCTF values at regular intervals (default: every second).
- Toggle activations and deactivations are logged with timestamps and impact assessments.
- The threshold status is categorized as "optimal", "suboptimal", or "critical" based on the QCTF value relative to the target threshold.
- Cyclic flow detection can be enabled to add cyclic patterns to the QCTF values.

## Future Enhancements

Based on the "final synergy summary" document, potential future enhancements include:

1. **Scaling**: Deploy to more users, scale HPC fractals
2. **Evolution**: Auto-generate toggles or feedback rules from QCTF trends
3. **Global Synergy Events**: Test large-scale synergy events, targeting QCTF ≥ 0.95