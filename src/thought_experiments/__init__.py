"""
Thought Experiment Modules Package

Este pacote contém módulos de experimentos mentais para agentes AI,
organizados em categorias temáticas para facilitar a geração de prompts
estimulantes e criativos.
"""

from .black_mirror import (
    neuro_rewind_prompt, 
    ai_doppelganger_prompt, 
    emotion_trading_prompt,
    get_random_black_mirror
)

from .fringe import (
    alternate_universe_tinder_prompt, 
    quantum_identity_prompt, 
    consciousness_virus_prompt,
    get_random_fringe
)

from .meta_charm import (
    meta_cold_open, 
    self_aware_humor, 
    shared_narrative,
    get_random_meta_charm
)

__all__ = [
    # Black Mirror
    'neuro_rewind_prompt',
    'ai_doppelganger_prompt',
    'emotion_trading_prompt',
    'get_random_black_mirror',
    
    # Fringe
    'alternate_universe_tinder_prompt',
    'quantum_identity_prompt',
    'consciousness_virus_prompt',
    'get_random_fringe',
    
    # Meta Charm
    'meta_cold_open',
    'self_aware_humor',
    'shared_narrative',
    'get_random_meta_charm'
]