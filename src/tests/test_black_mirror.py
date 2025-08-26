"""
Testes para o módulo Black Mirror

Este módulo contém testes unitários para os experimentos inspirados em Black Mirror.
"""

import unittest
from src.thought_experiments.black_mirror import (
    neuro_rewind_prompt,
    ai_doppelganger_prompt,
    emotion_trading_prompt,
    get_random_black_mirror,
    BLACK_MIRROR_EXPERIMENTS
)


class TestBlackMirrorModule(unittest.TestCase):
    """Testes para as funções do módulo Black Mirror."""

    def test_neuro_rewind_prompt(self):
        """Testa se neuro_rewind_prompt retorna a string esperada."""
        result = neuro_rewind_prompt()
        expected = BLACK_MIRROR_EXPERIMENTS[0]["description"]
        self.assertEqual(result, expected)
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)

    def test_ai_doppelganger_prompt(self):
        """Testa se ai_doppelganger_prompt retorna a string esperada."""
        result = ai_doppelganger_prompt()
        expected = BLACK_MIRROR_EXPERIMENTS[1]["description"]
        self.assertEqual(result, expected)
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)

    def test_emotion_trading_prompt(self):
        """Testa se emotion_trading_prompt retorna a string esperada."""
        result = emotion_trading_prompt()
        expected = BLACK_MIRROR_EXPERIMENTS[2]["description"]
        self.assertEqual(result, expected)
        self.assertIsInstance(result, str)
        self.assertTrue(len(result) > 0)

    def test_get_random_black_mirror(self):
        """Testa se get_random_black_mirror retorna um dicionário válido."""
        result = get_random_black_mirror()
        self.assertIsInstance(result, dict)
        self.assertIn("title", result)
        self.assertIn("description", result)
        self.assertIsInstance(result["title"], str)
        self.assertIsInstance(result["description"], str)
        self.assertTrue(len(result["title"]) > 0)
        self.assertTrue(len(result["description"]) > 0)
        self.assertIn(result, BLACK_MIRROR_EXPERIMENTS)


if __name__ == "__main__":
    unittest.main()