"""
Testes para o módulo Random Generator

Este módulo contém testes unitários para as funções de geração aleatória.
"""

import unittest
from src.utils.random_generator import (
    select_random_item,
    select_random_items,
    generate_random_prompt
)


class TestRandomGeneratorModule(unittest.TestCase):
    """Testes para as funções do módulo Random Generator."""

    def test_select_random_item(self):
        """Testa se select_random_item retorna um item válido da lista."""
        items = ["a", "b", "c", "d"]
        result = select_random_item(items)
        self.assertIn(result, items)

        # Testa lista com apenas um item
        single_item = ["único"]
        result = select_random_item(single_item)
        self.assertEqual(result, "único")

        # Testa erro para lista vazia
        with self.assertRaises(ValueError):
            select_random_item([])

    def test_select_random_items(self):
        """Testa se select_random_items retorna o número correto de itens."""
        items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        
        # Testa com count padrão (1)
        result = select_random_items(items)
        self.assertEqual(len(result), 1)
        self.assertIn(result[0], items)
        
        # Testa com count específico
        count = 3
        result = select_random_items(items, count)
        self.assertEqual(len(result), count)
        for item in result:
            self.assertIn(item, items)
        
        # Testa itens únicos (sem repetição)
        self.assertEqual(len(set(result)), count)
        
        # Testa erros
        with self.assertRaises(ValueError):
            select_random_items([], 1)
        
        with self.assertRaises(ValueError):
            select_random_items(items, 11)  # count > len(items)

    def test_generate_random_prompt(self):
        """Testa se generate_random_prompt retorna um prompt válido."""
        categories = {
            "category1": [
                {"title": "Title 1", "description": "Description 1"},
                {"title": "Title 2", "description": "Description 2"}
            ],
            "category2": [
                {"title": "Title 3", "description": "Description 3"}
            ]
        }
        
        result = generate_random_prompt(categories)
        
        self.assertIsInstance(result, dict)
        self.assertIn("category", result)
        self.assertIn("prompt", result)
        self.assertIn(result["category"], categories.keys())

        # Verifica se o prompt pertence à categoria retornada
        category = result["category"]
        prompt = result["prompt"]
        possible_descriptions = [item["description"] for item in categories[category]]
        self.assertIn(prompt, possible_descriptions)
        
        # Testa erro para categorias vazias
        with self.assertRaises(ValueError):
            generate_random_prompt({})


if __name__ == "__main__":
    unittest.main()