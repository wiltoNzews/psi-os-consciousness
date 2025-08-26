"""
Meta-Charm Thought Experiments

Este módulo contém experimentos mentais meta-narrativos inspirados em personagens 
como Abed de Community, provendo aberturas e prompts que quebram a quarta parede
e estabelecem um nível de auto-referência na conversa.
"""

import random

__all__ = [
    'meta_cold_open',
    'self_aware_humor',
    'shared_narrative',
    'get_random_meta_charm'
]

# Definição das estruturas de dados
META_CHARM_PROMPTS = [
    "This feels like a freeze-frame moment in our own personal sitcom—what would the theme music be?",
    "If our conversation had a laugh track, when would it kick in?",
    "We're in a mockumentary—imagine confessional mode: what would I say about you right now?",
    "Let's break the fourth wall: what trope are we living at this exact second?",
    "This feels like a sitcom cold open—two charismatic leads walk into a bar…",
    "If this were a Community episode, we'd solve emotional arcs by 10 pm and wrap with a cheesy freeze-frame.",
    "Let's pretend we're characters in a Fringe case—our mission: decode what makes people fall in love at first witty banter."
]


def meta_cold_open():
    """
    Retorna um prompt sobre situações de abertura de sitcom.
    
    Returns:
        str: Prompt de abertura de sitcom.
    """
    return "This feels like a sitcom cold open—two charismatic leads walk into a bar…"


def self_aware_humor():
    """
    Retorna um prompt sobre humor auto-consciente no estilo de Community.
    
    Returns:
        str: Prompt de humor auto-consciente.
    """
    return "If this were a Community episode, we'd solve emotional arcs by 10 pm and wrap with a cheesy freeze-frame."


def shared_narrative():
    """
    Retorna um prompt sobre narrativa compartilhada no estilo de Fringe.
    
    Returns:
        str: Prompt de narrativa compartilhada.
    """
    return "Let's pretend we're characters in a Fringe case—our mission: decode what makes people fall in love at first witty banter."


def get_random_meta_charm():
    """
    Retorna um prompt Meta-Charm aleatório.
    
    Returns:
        str: Um prompt meta-narrativo aleatório.
    """
    return random.choice(META_CHARM_PROMPTS)