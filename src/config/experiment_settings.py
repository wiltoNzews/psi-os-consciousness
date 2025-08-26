"""
Experiment Settings Module

Este módulo define configurações e constantes relacionadas aos
experimentos mentais, incluindo categorias, identificadores e configurações
de exibição.
"""

from typing import Dict, List, Any

__all__ = [
    'EXPERIMENT_CATEGORIES',
    'MAX_RANDOM_SELECTIONS',
    'DISPLAY_SETTINGS'
]

# Categorias de experimentos mentais
EXPERIMENT_CATEGORIES = {
    'black_mirror': 'Black Mirror-Style Thought Experiments',
    'fringe': 'Fringe-Style Thought Experiments',
    'meta_charm': 'Meta-Charm Prompts'
}

# Número máximo de itens aleatórios por vez
MAX_RANDOM_SELECTIONS = 3

# Configurações de exibição
DISPLAY_SETTINGS = {
    'default_format': 'text',  # Opções: 'text', 'card', 'dialog'
    'show_category': True,     # Mostrar categoria junto com o prompt
    'show_title': True,        # Mostrar título quando disponível
    'wrap_text': True          # Quebrar texto automaticamente
}