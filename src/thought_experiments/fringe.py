"""
Fringe-Style Thought Experiments

Este módulo contém experimentos mentais inspirados na série Fringe,
explorando temas como realidades paralelas, física quântica e consciência.
"""

import random

__all__ = [
    'alternate_universe_tinder_prompt',
    'quantum_identity_prompt',
    'consciousness_virus_prompt',
    'get_random_fringe'
]

# Definição das estruturas de dados
FRINGE_EXPERIMENTS = [
    {
        "title": "Alternate-Universe Tinder",
        "description": "On my next date, I'll swap to a parallel Tinder universe—what if every swipe literally switches me to a slightly different me? Who would I be?"
    },
    {
        "title": "Quantum Identity",
        "description": "If you and I are quantum superpositions until observed, does tonight's chat collapse us into new versions of ourselves?"
    },
    {
        "title": "Consciousness Virus",
        "description": "Imagine emotion as an infectious code—if I could upload a 'confidence bug' into your brain, would you catch it?"
    }
]


def alternate_universe_tinder_prompt():
    """
    Retorna um prompt sobre aplicativos de encontro em universos paralelos.
    
    Returns:
        str: Prompt sobre Tinder em universos alternativos.
    """
    return FRINGE_EXPERIMENTS[0]["description"]


def quantum_identity_prompt():
    """
    Retorna um prompt sobre identidade e superposição quântica.
    
    Returns:
        str: Prompt sobre identidade quântica.
    """
    return FRINGE_EXPERIMENTS[1]["description"]


def consciousness_virus_prompt():
    """
    Retorna um prompt sobre emoções como código infeccioso.
    
    Returns:
        str: Prompt sobre vírus de consciência.
    """
    return FRINGE_EXPERIMENTS[2]["description"]


def get_random_fringe():
    """
    Retorna um experimento Fringe aleatório.
    
    Returns:
        dict: Dicionário contendo título e descrição do experimento.
    """
    return random.choice(FRINGE_EXPERIMENTS)