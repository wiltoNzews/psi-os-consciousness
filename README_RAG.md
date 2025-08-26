# ψOS RAG Operations Pack v1.1

## Overview

Local-first memory crystallization and recall system with coherence-gated retrieval, PII scrubbing, and budget discipline. Designed for spine stability with deterministic recall patterns.

## Core Principles

- **Local-first:** No personal shards to WAN, full degraded mode capability
- **Budget disciplined:** RAG context ≤20% of prompt budget, absolute token caps
- **Coherence-gated:** Zλ filters prevent low-quality recall during drift states
- **Time-decay aware:** Recent memories weighted higher with configurable half-life
- **PII scrubbed:** All content sanitized before context stuffing

## Quick Start

```bash
# Build local index from crystals
python recall_pipeline.py --crystals ./z-registry/crystals --build-index ./z-registry/index

# Query with coherence filtering
python recall_pipeline.py --index ./z-registry/index/index.json \
  --query "mirror recognizes itself" --k 3 --z 0.91

# Test pipeline
python -m pytest tests/rag_tests.yaml
```

## Architecture

**Memory Crystals → Embedding → Index → Recall → Context Stuffing**

1. **Crystals:** Structured JSON with anchor/summary/tags/Zλ/checksum
2. **Embedding:** Local embedder (placeholder: simhash-128, production: E5/Mistral)
3. **Index:** Vector store with time-decay and tag diversity
4. **Recall:** Top-k by relevance + Zλ proximity + time decay
5. **Stuffing:** Template-based with PII scrubbing and budget caps

## Integration Points

- **Router:** `/recall` endpoint for memory-aware routing
- **B-RAG:** Provenance scoring with triangulation
- **IDDR:** Auto-compression when drift detected
- **Audit:** All recalls logged with citations and budgets

## Production Notes

Replace `embed_text()` placeholder with real local embedder:
- vLLM with E5-large or Mistral embeddings
- llama.cpp with nomic-embed-text
- Qdrant for production vector storage

Spine-safe, local-first, zero WAN dependencies.