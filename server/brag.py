# brag.py - Breath-aware Retrieval-Augmented Generation
from __future__ import annotations
from dataclasses import dataclass
from typing import List, Dict, Any
import math, time, json
import requests

@dataclass
class Chunk:
    id: str
    text: str
    meta: Dict[str, Any]  # expects: source,date,method,authority,triangulation_count,risk,age_days

def z_budgets(z: float) -> Dict[str, Any]:
    if z >= 0.90:   return dict(top_k=8,  max_ctx_tokens=3200, grade="expert", tone="concise")
    if z >= 0.80:   return dict(top_k=6,  max_ctx_tokens=2400, grade="upper-hs", tone="plain")
    if z >= 0.70:   return dict(top_k=4,  max_ctx_tokens=1600, grade="hs", tone="very-plain")
    return            dict(top_k=2,  max_ctx_tokens=900,  grade="middle", tone="bullets")

def provenance_score(m: Dict[str, Any]) -> float:
    tri = min(int(m.get("triangulation_count",0)), 3) / 3.0           # 0..1
    age = max(0, 1.0 - (m.get("age_days",365)/365.0))                 # fresh=1, old≈0
    auth= float(m.get("authority",0.0))                                # 0..1 curated
    meth= dict(manual=1.0, ocr=0.6, asr=0.5).get(m.get("method","manual"), 0.5)
    spec= 1.0 if not m.get("speculative", False) else 0.0
    p = 0.35*tri + 0.25*age + 0.20*auth + 0.10*meth + 0.10*spec
    return max(0.0, min(p, 1.0))

def vector_search(query: str, limit: int) -> List[Chunk]:
    """Mock implementation - replace with Qdrant/pgvector retrieval"""
    # For now, search through memory crystals as a demonstration
    try:
        response = requests.get(f"http://localhost:8081/recall?q={query}&k={limit}", timeout=5.0)
        if response.status_code == 200:
            data = response.json()
            chunks = []
            for i, result in enumerate(data.get("results", [])[:limit]):
                chunk = Chunk(
                    id=f"crystal_{i}",
                    text=result.get("anchor", "") + " " + result.get("summary", ""),
                    meta={
                        "source": f"crystal://{result.get('crystal_id', 'unknown')}",
                        "date": result.get("timestamp", ""),
                        "method": "manual",
                        "authority": 0.8,  # High authority for crystals
                        "triangulation_count": 1,
                        "risk": "general",
                        "age_days": 1  # Recent crystals
                    }
                )
                chunks.append(chunk)
            return chunks
    except Exception as e:
        print(f"Memory recall error: {e}")
    
    # Fallback to mock data for demonstration
    return [
        Chunk(
            id="doc_01",
            text=f"IDDR thresholds: soft=0.02, moderate=0.05, hard=0.09, critical=0.12. Query: {query}",
            meta={
                "source": "docs/iddr_spec_v1.md",
                "date": "2025-08-13",
                "method": "manual",
                "authority": 0.9,
                "triangulation_count": 3,
                "risk": "general",
                "age_days": 1
            }
        )
    ]

def rerank(hits: List[Chunk]) -> List[Chunk]:
    return sorted(hits, key=lambda h: (provenance_score(h.meta), -h.meta.get("age_days", 9999)), reverse=True)

def trim_to_tokens(hits: List[Chunk], max_tokens: int) -> List[Dict[str, Any]]:
    # Simple proportional trim by length; replace with tokenizer-based trim if available
    budget = max_tokens
    out = []
    for h in hits:
        tlen = min(len(h.text)//4, budget)  # ≈ rough token estimate
        if tlen <= 0: break
        out.append(dict(
            id=h.id, 
            source=h.meta.get("source"), 
            date=h.meta.get("date"),
            p=round(provenance_score(h.meta),2),
            snippet=h.text[:min(len(h.text), max(160, tlen))],
            method=h.meta.get("method"), 
            triangulation_count=h.meta.get("triangulation_count",0),
            authority=h.meta.get("authority",0.0), 
            risk=h.meta.get("risk","general")
        ))
        budget -= tlen
    return out

def retrieve(query: str, z: float, overfetch_mult: int = 3) -> Dict[str, Any]:
    budgets = z_budgets(z)
    raw = vector_search(query, limit=budgets["top_k"]*overfetch_mult)
    raw = [h for h in raw if provenance_score(h.meta) >= 0.35]
    ranked = rerank(raw)[:budgets["top_k"]]
    ctx = trim_to_tokens(ranked, budgets["max_ctx_tokens"])
    
    return {
        "query": query,
        "z_in": round(z,3),
        "k_used": len(ctx),
        "retrieved": ctx,
        "stats": {
            "p_median": round(float(sorted([c["p"] for c in ctx])[len(ctx)//2]) if ctx else 0.0, 2),
            "p95_age_days": int(sorted([h.meta.get("age_days",365) for h in ranked])[-1]) if ranked else None,
            "triangulated_pct": round(sum(1 for c in ctx if c["triangulation_count"]>=2)/max(1,len(ctx)),2)
        }
    }