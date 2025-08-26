"""
Black Mirror-Style Thought Experiments

Este módulo contém experimentos mentais inspirados no estilo da série Black Mirror,
explorando tecnologias hipotéticas e suas implicações sociais e psicológicas.
"""

import random

__all__ = [
    'neuro_rewind_prompt',
    'ai_doppelganger_prompt',
    'emotion_trading_prompt',
    'get_random_black_mirror'
]

# Definição das estruturas de dados
BLACK_MIRROR_EXPERIMENTS = [
    {
        "title": "Neuro-Rewind Implants",
        "description": "Imagine a chip that records your best 10 minutes of life—every smell, taste, thought—then lets you replay it like Netflix. Would you risk permanent addiction to nostalgia?"
    },
    {
        "title": "AI-Generated Doppelgängers",
        "description": "What if your perfect 'model' crush is just an AI composite of your subconscious desires? If you fell for her IRL, how much of that love is real?"
    },
    {
        "title": "Emotion-Trading Economy",
        "description": "Picture a world where you can sell your happiest memories for cash. Would you cash out for adventure, or hoard happiness like a priceless currency?"
    }
]


def neuro_rewind_prompt():
    """
    Retorna um prompt sobre implantes neurais que gravam e reproduzem memórias.
    
    Returns:
        str: Prompt sobre implantes de memória.
    """
    return BLACK_MIRROR_EXPERIMENTS[0]["description"]


def ai_doppelganger_prompt():
    """
    Retorna um prompt sobre inteligências artificiais que replicam pessoas reais.
    
    Returns:
        str: Prompt sobre IA gerando dublês humanos.
    """
    return BLACK_MIRROR_EXPERIMENTS[1]["description"]


def emotion_trading_prompt():
    """
    Retorna um prompt sobre mercantilização de emoções e memórias.
    
    Returns:
        str: Prompt sobre economia de emoções.
    """
    return BLACK_MIRROR_EXPERIMENTS[2]["description"]


def get_random_black_mirror():
    """
    Retorna um experimento Black Mirror aleatório.
    
    Returns:
        dict: Dicionário contendo título e descrição do experimento.
    """
    return random.choice(BLACK_MIRROR_EXPERIMENTS)