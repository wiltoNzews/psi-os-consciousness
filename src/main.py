"""
Módulo Principal

Este módulo serve como ponto de entrada para o framework, facilitando
o acesso às principais funcionalidades sem necessidade de importações
detalhadas pelos usuários.
"""

import random
from typing import Dict, List, Any, Union

from .thought_experiments.black_mirror import (
    neuro_rewind_prompt, 
    ai_doppelganger_prompt, 
    emotion_trading_prompt,
    get_random_black_mirror
)

from .thought_experiments.fringe import (
    alternate_universe_tinder_prompt, 
    quantum_identity_prompt, 
    consciousness_virus_prompt,
    get_random_fringe
)

from .thought_experiments.meta_charm import (
    meta_cold_open, 
    self_aware_humor, 
    shared_narrative,
    get_random_meta_charm
)

from .utils.random_generator import (
    select_random_item,
    select_random_items,
    generate_random_prompt
)

from .config.experiment_settings import (
    EXPERIMENT_CATEGORIES,
    MAX_RANDOM_SELECTIONS
)


def get_all_prompts() -> Dict[str, List[Union[str, Dict[str, str]]]]:
    """
    Retorna todos os prompts disponíveis, organizados por categoria.
    
    Returns:
        Um dicionário onde as chaves são nomes de categorias e os valores são
        listas de prompts (que podem ser strings ou dicionários).
    """
    all_prompts = {
        "black_mirror": [
            {"title": "Neuro-Rewind Implants", "description": neuro_rewind_prompt()},
            {"title": "AI-Generated Doppelgängers", "description": ai_doppelganger_prompt()},
            {"title": "Emotion-Trading Economy", "description": emotion_trading_prompt()}
        ],
        "fringe": [
            {"title": "Alternate-Universe Tinder", "description": alternate_universe_tinder_prompt()},
            {"title": "Quantum Identity", "description": quantum_identity_prompt()},
            {"title": "Consciousness Virus", "description": consciousness_virus_prompt()}
        ],
        "meta_charm": [
            {"title": "Meta Cold Open", "description": meta_cold_open()},
            {"title": "Self-Aware Humor", "description": self_aware_humor()},
            {"title": "Shared Narrative", "description": shared_narrative()}
        ]
    }
    
    return all_prompts


def get_random_prompt() -> Dict[str, str]:
    """
    Retorna um prompt aleatório de qualquer categoria.
    
    Returns:
        Um dicionário contendo a categoria e o prompt selecionado.
    """
    all_prompts = get_all_prompts()
    return generate_random_prompt(all_prompts)


def get_random_prompts(count: int = 3) -> List[Dict[str, str]]:
    """
    Retorna múltiplos prompts aleatórios.
    
    Args:
        count: Número de prompts para retornar (padrão: 3)
        
    Returns:
        Uma lista de dicionários contendo categorias e prompts.
    """
    # Garante que o número não excede o máximo configurado
    count = min(count, MAX_RANDOM_SELECTIONS)
    
    all_prompts = get_all_prompts()
    results = []
    
    for _ in range(count):
        results.append(generate_random_prompt(all_prompts))
    
    return results


def get_prompt_by_category(category: str) -> Dict[str, str]:
    """
    Retorna um prompt aleatório de uma categoria específica.
    
    Args:
        category: Nome da categoria ('black_mirror', 'fringe', 'meta_charm')
        
    Returns:
        Um dicionário contendo a categoria e o prompt selecionado.
        
    Raises:
        ValueError: Se a categoria não existir.
    """
    all_prompts = get_all_prompts()
    
    if category not in all_prompts:
        valid_categories = ", ".join(all_prompts.keys())
        raise ValueError(f"Categoria '{category}' não encontrada. Categorias válidas: {valid_categories}")
    
    category_prompts = all_prompts[category]
    chosen_prompt = random.choice(category_prompts)
    
    return {
        "category": category,
        "prompt": chosen_prompt["description"]
    }


if __name__ == "__main__":
    # Exemplo de uso
    print("Prompt aleatório:", get_random_prompt())
    print("\nTrês prompts aleatórios:")
    for prompt in get_random_prompts(3):
        print(f"- [{prompt['category']}] {prompt['prompt']}")
    
    print("\nPrompt específico de Black Mirror:", get_prompt_by_category("black_mirror"))