"""
Random Generator Utilities

Este módulo fornece funções para selecionar aleatoriamente itens 
de diferentes fontes e categorias de experimentos mentais.
"""

import random
from typing import Any, List, Dict, TypeVar, Generic, Union

T = TypeVar('T')

__all__ = [
    'select_random_item',
    'select_random_items',
    'generate_random_prompt'
]


def select_random_item(items: List[T]) -> T:
    """
    Seleciona um item aleatório de uma lista.
    
    Args:
        items: Lista de itens para escolher.
        
    Returns:
        Um item aleatório da lista.
        
    Raises:
        ValueError: Se a lista estiver vazia.
    """
    if not items:
        raise ValueError("A lista de itens não pode estar vazia")
    
    return random.choice(items)


def select_random_items(items: List[T], count: int = 1) -> List[T]:
    """
    Seleciona múltiplos itens aleatórios de uma lista.
    
    Args:
        items: Lista de itens para escolher.
        count: Número de itens para selecionar.
        
    Returns:
        Uma lista de itens aleatórios.
        
    Raises:
        ValueError: Se a lista estiver vazia ou se count for maior que o tamanho da lista.
    """
    if not items:
        raise ValueError("A lista de itens não pode estar vazia")
    
    if count > len(items):
        raise ValueError(f"Não é possível selecionar {count} itens de uma lista com {len(items)} itens")
    
    return random.sample(items, count)


def generate_random_prompt(categories: Dict[str, List[Union[str, Dict[str, str]]]]) -> Dict[str, str]:
    """
    Gera um prompt aleatório selecionando de várias categorias.
    
    Args:
        categories: Dicionário de categorias, onde cada chave é o nome da categoria
                   e o valor é uma lista de prompts (strings ou dicionários).
                   
    Returns:
        Um dicionário contendo a categoria e o prompt selecionado.
        
    Example:
        >>> categories = {
        ...     "black_mirror": [{"description": "Prompt 1"}, {"description": "Prompt 2"}],
        ...     "fringe": [{"description": "Prompt 3"}, {"description": "Prompt 4"}]
        ... }
        >>> result = generate_random_prompt(categories)
        >>> print(result)
        {'category': 'black_mirror', 'prompt': 'Prompt 1'}
    """
    if not categories:
        raise ValueError("As categorias não podem estar vazias")
    
    # Seleciona uma categoria aleatória
    category_name = random.choice(list(categories.keys()))
    category_items = categories[category_name]
    
    if not category_items:
        raise ValueError(f"A categoria '{category_name}' não contém itens")
    
    # Seleciona um item aleatório da categoria
    item = random.choice(category_items)
    
    # Extrai o texto do prompt (pode ser uma string ou um dicionário com uma chave "description")
    prompt_text = item["description"] if isinstance(item, dict) and "description" in item else item
    
    return {
        "category": category_name,
        "prompt": prompt_text
    }