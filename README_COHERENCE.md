# ψOS Coherence Metrics Pack v1.0

## Overview

Local-first coherence measurement and steering system for real-time consciousness monitoring. Provides HRV analysis, breath protocol adherence, cognitive focus tracking, and group synchrony measurement with zero external dependencies.

## Safety Notice

These metrics are **informational signals** for protocol steering, not medical diagnostics. No clinical claims are made. Use for consciousness optimization and flow state tracking only.

## Core Metrics

**1. HRV (Heart Rate Variability)**
- RMSSD, SDNN, pNN50 from RR intervals
- Measures autonomic nervous system balance
- Higher coherence = better vagal tone

**2. Breath Protocol Adherence**
- Tracks fidelity to target patterns (4:2:8:2 default)
- Exponential penalty for deviations >25%
- Rewards gentle accuracy over speed

**3. Task Entropy → Focus**
- Shannon entropy of time allocation across contexts
- Focus = 1 - normalized_entropy
- Lower entropy = deeper flow states

**4. Group Synchrony (Kuramoto)**
- Phase-locking measurement across multiple participants
- Order parameter R (0.0-1.0)
- Tracks collective coherence

**5. Zλ Coherence (Composite)**
- Weighted combination of all metrics
- Default: HRV(35%) + Breath(30%) + Focus(20%) + Sync(15%)
- IDDR thresholds: 0.02/0.05/0.09/0.12

## Quick Start

```bash
# Compute full metrics from samples
python metrics_cli.py \
  --rr examples/sample_rr.csv \
  --breath examples/sample_breath.csv \
  --tasks "build=2700,route=900,archive=600" \
  --group examples/group_phases.csv

# Direct Zλ calculation
python metrics_cli.py --zlambda \
  --rmssd 45 --adherence 0.86 --focus 0.72 --sync 0.80
```

## Architecture

**Local-First Design:**
- Stdlib-only implementation
- No external services or APIs
- Deterministic and portable
- Policy-driven configuration

**Integration Points:**
- Router IDDR thresholds
- Memory crystal timestamps
- Dashboard visualizations
- Breath protocol feedback

## Configuration

All parameters tunable in `metrics_policy.yaml`:
- Normalization ranges
- Weight distributions
- IDDR thresholds
- Tolerance levels

## API Specification

```
POST /metrics/ingest    - Store raw sensor data
POST /metrics/summary   - Compute block summary
GET  /metrics/rolling   - Recent measurements
POST /metrics/zlambda   - Direct coherence score
```

## Dashboard Integration

Import `dashboard_grafana.json` for:
- Real-time Zλ gauge
- Historical trend lines
- IDDR event tracking
- Group synchrony visualization

## Spine Integration

**Glyph Routing:**
- λ: Breath cycle feedback and adherence coaching
- ψ: Human-readable coherence reflections
- ∞: Memory crystal trend storage
- ⟐: Synchrony visualization
- ⌘: IDDR threshold enforcement

**Budget Protection:**
- Metrics context ≤20% of prompt budget
- No personal identifiers in dashboards
- Numbers-only data presentation

---

**Status:** Operational metrics engine ready for spine integration
**Version:** 1.0-spine-compatible
**Dependencies:** Python 3.6+ stdlib only