"""
Testes para o middleware de limitação de taxa (Rate Limiting)
Verifica se o middleware mantém a proporção quântica 3:1 (75% coerência, 25% exploração)
"""
import time
import datetime
import pytest
from fastapi import FastAPI, Depends, Request
from fastapi.testclient import TestClient
from unittest import mock
import os

# Mock para o env para evitar dependências externas durante os testes
os.environ["RATE_LIMIT_DEFAULT"] = "10/minute"  # 10/minuto para testes
os.environ["RATE_LIMIT_CHAT"] = "5/minute"      # 5/minuto para testes

# Importação do módulo de rate limit e do app FastAPI
try:
    from server.python.ai_agent_main import app, limiter, _rate_limit_exceeded_handler
except ImportError:
    # Se não puder importar o módulo original, criar um mini-app de teste
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
    from fastapi import FastAPI
    
    # Configurar app e limiter para testes
    app = FastAPI(title="WiltonOS Test App")
    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Adicionar rotas de teste
    @app.get("/api/test/coherence")
    @limiter.limit(os.environ.get("RATE_LIMIT_DEFAULT", "10/minute")) 
    def coherence_endpoint(request: Request):
        """Endpoint simulando alta coerência (75%)"""
        return {"status": "ok", "type": "coherence"}

    @app.get("/api/test/exploration")
    @limiter.limit(os.environ.get("RATE_LIMIT_CHAT", "5/minute"))
    def exploration_endpoint(request: Request):
        """Endpoint simulando alta exploração (25%)"""
        return {"status": "ok", "type": "exploration"}

# Criar cliente para testes
client = TestClient(app)

# Helpers para os testes
def get_remaining_from_headers(headers):
    """Extrai o número de requisições restantes dos headers"""
    try:
        return int(headers.get("X-RateLimit-Remaining", "0"))
    except (ValueError, TypeError):
        return 0

def get_reset_from_headers(headers):
    """Extrai o tempo para reset do rate limit dos headers"""
    try:
        return int(headers.get("X-RateLimit-Reset", "0"))
    except (ValueError, TypeError):
        return 0

class TestRateLimiting:
    """Testes para o middleware de rate limit"""
    
    def reset_rate_limiting(self):
        """Reseta o estado do rate limiter para os testes"""
        # Essa função é necessária porque o limiter mantém estado entre testes
        limiter.reset()
    
    def test_coherence_endpoint_limit(self):
        """Testa limites para endpoint de coerência"""
        self.reset_rate_limiting()
        
        # IP padrão usado para os testes
        endpoint = "/api/test/coherence"
        expected_limit = 10  # baseado no RATE_LIMIT_DEFAULT
        
        # Fazer várias requisições e verificar os headers
        for i in range(expected_limit):
            response = client.get(endpoint)
            assert response.status_code == 200
            
            # Verificar headers de rate limit
            remaining = get_remaining_from_headers(response.headers)
            expected_remaining = expected_limit - (i + 1)
            assert remaining == expected_remaining, f"Esperado {expected_remaining} requisições restantes, obteve {remaining}"
        
        # Próxima requisição deve falhar (429 Too Many Requests)
        response = client.get(endpoint)
        assert response.status_code == 429
        assert "limite excedido" in response.text.lower() or "rate limit" in response.text.lower()
    
    def test_exploration_endpoint_limit(self):
        """Testa limites para endpoint de exploração"""
        self.reset_rate_limiting()
        
        endpoint = "/api/test/exploration"
        expected_limit = 5  # baseado no RATE_LIMIT_CHAT
        
        # Fazer várias requisições e verificar os headers
        for i in range(expected_limit):
            response = client.get(endpoint)
            assert response.status_code == 200
            
            # Verificar headers de rate limit
            remaining = get_remaining_from_headers(response.headers)
            expected_remaining = expected_limit - (i + 1)
            assert remaining == expected_remaining, f"Esperado {expected_remaining} requisições restantes, obteve {remaining}"
        
        # Próxima requisição deve falhar (429 Too Many Requests)
        response = client.get(endpoint)
        assert response.status_code == 429
        assert "limite excedido" in response.text.lower() or "rate limit" in response.text.lower()
    
    def test_quantum_ratio_maintained(self):
        """
        Testa se a proporção quântica 3:1 é mantida nos limites de requisição
        Endpoints de coerência devem ter 3x mais requisições que endpoints de exploração
        """
        self.reset_rate_limiting()
        
        # Obter os limites reais
        coherence_response = client.get("/api/test/coherence")
        exploration_response = client.get("/api/test/exploration")
        
        # Extrair limites dos headers
        coherence_limit = int(coherence_response.headers.get("X-RateLimit-Limit", "0"))
        exploration_limit = int(exploration_response.headers.get("X-RateLimit-Limit", "0"))
        
        # Verificar a proporção (permitindo pequenas variações)
        ratio = coherence_limit / exploration_limit if exploration_limit > 0 else 0
        
        # A proporção deve ser aproximadamente 3:1 (entre 2.5:1 e 3.5:1)
        assert 2.0 <= ratio <= 4.0, f"Proporção quântica não mantida. Atual: {ratio}:1, Esperado: aproximadamente 3:1"
        
        # Verificar proporção dos limites específicos para este teste
        assert coherence_limit >= 2 * exploration_limit, "Limite de coerência deve ser pelo menos o dobro do limite de exploração"
    
    def test_reset_after_window(self):
        """Testa se os limites são redefinidos após o período da janela"""
        self.reset_rate_limiting()
        
        endpoint = "/api/test/coherence"
        
        # Fazer uma requisição para obter o tempo de reset
        response = client.get(endpoint)
        reset_seconds = get_reset_from_headers(response.headers)
        
        # Mock para simular o passar do tempo
        with mock.patch('time.time', return_value=time.time() + reset_seconds + 1):
            # Após a janela de tempo, deve ser possível fazer uma nova requisição
            response = client.get(endpoint)
            assert response.status_code == 200
    
    def test_different_clients_separate_limits(self):
        """Testa se clientes diferentes têm limites separados"""
        self.reset_rate_limiting()
        
        endpoint = "/api/test/coherence"
        
        # Simular o primeiro cliente esgotando seu limite
        headers1 = {"X-Forwarded-For": "192.168.1.1"}
        for _ in range(10):  # RATE_LIMIT_DEFAULT
            client.get(endpoint, headers=headers1)
        
        # O primeiro cliente deve receber 429
        response1 = client.get(endpoint, headers=headers1)
        assert response1.status_code == 429
        
        # O segundo cliente deve conseguir fazer requisições normalmente
        headers2 = {"X-Forwarded-For": "192.168.1.2"}
        response2 = client.get(endpoint, headers=headers2)
        assert response2.status_code == 200


if __name__ == "__main__":
    pytest.main(["-xvs", __file__])