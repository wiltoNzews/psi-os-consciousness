"""
Testes para o módulo Principal

Este módulo contém testes unitários para as funções do módulo main.py.
"""

import unittest
from src.main import (
    get_all_prompts,
    get_random_prompt,
    get_random_prompts,
    get_prompt_by_category
)


class TestMainModule(unittest.TestCase):
    """Testes para as funções do módulo principal."""

    def test_get_all_prompts(self):
        """Testa se get_all_prompts retorna um dicionário completo."""
        result = get_all_prompts()
        
        self.assertIsInstance(result, dict)
        
        # Verifica se todas as categorias esperadas estão presentes
        expected_categories = ["black_mirror", "fringe", "meta_charm"]
        for category in expected_categories:
            self.assertIn(category, result)
            self.assertIsInstance(result[category], list)
            self.assertTrue(len(result[category]) > 0)
        
        # Verifica estrutura dos itens
        for category, items in result.items():
            for item in items:
                self.assertIsInstance(item, dict)
                self.assertIn("title", item)
                self.assertIn("description", item)
                self.assertIsInstance(item["title"], str)
                self.assertIsInstance(item["description"], str)

    def test_get_random_prompt(self):
        """Testa se get_random_prompt retorna um prompt válido."""
        result = get_random_prompt()
        
        self.assertIsInstance(result, dict)
        self.assertIn("category", result)
        self.assertIn("prompt", result)
        
        categories = ["black_mirror", "fringe", "meta_charm"]
        self.assertIn(result["category"], categories)
        self.assertIsInstance(result["prompt"], str)
        self.assertTrue(len(result["prompt"]) > 0)

    def test_get_random_prompts(self):
        """Testa se get_random_prompts retorna o número correto de prompts."""
        # Teste com valor padrão
        result = get_random_prompts()
        self.assertIsInstance(result, list)
        self.assertEqual(len(result), 3)  # valor padrão
        
        # Teste com valor específico
        count = 2
        result = get_random_prompts(count)
        self.assertEqual(len(result), count)
        
        # Verifica estrutura dos prompts
        for prompt in result:
            self.assertIsInstance(prompt, dict)
            self.assertIn("category", prompt)
            self.assertIn("prompt", prompt)

    def test_get_prompt_by_category(self):
        """Testa se get_prompt_by_category retorna um prompt da categoria correta."""
        # Teste para cada categoria
        categories = ["black_mirror", "fringe", "meta_charm"]
        
        for category in categories:
            result = get_prompt_by_category(category)
            
            self.assertIsInstance(result, dict)
            self.assertIn("category", result)
            self.assertIn("prompt", result)
            self.assertEqual(result["category"], category)
        
        # Teste para categoria inválida
        with self.assertRaises(ValueError):
            get_prompt_by_category("categoria_inexistente")


if __name__ == "__main__":
    unittest.main()