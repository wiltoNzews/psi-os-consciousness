# Integração WhatsApp/Telegram para WiltonOS

## Visão Geral

Este módulo implementa a integração entre serviços de mensagens (WhatsApp e Telegram) e o WiltonOS, permitindo a captura, processamento e armazenamento de mensagens para análise de coerência quântica e balanceamento do ratio 3:1.

## Componentes Principais

### 1. WhatsApp Bridge
Localizado em `wilton_core/integrations/messaging/whatsapp_bridge.py`, este componente:
- Captura mensagens do WhatsApp
- Calcula o impacto phi (equilíbrio quântico) das mensagens
- Identifica gatilhos quânticos no conteúdo
- Armazena mensagens na memória vetorial (Qdrant)
- Envia mensagens para processamento pelo Z-Suite

### 2. Quantum Trigger Map
Localizado em `wilton_core/signals/quantum_trigger_map.py`, este componente:
- Mapeia gatilhos físicos e textuais para respostas do sistema
- Calcula o impacto de gatilhos no equilíbrio quântico
- Gera respostas apropriadas para reestabelecer o balanço 3:1
- Mantém um histórico de gatilhos ativados

### 3. AI Chief of Staff
Localizado em `wilton_core/zsuite/roles/ai_chief_of_staff.py`, este componente:
- Gerencia threads de interação
- Prioriza ações com base no contexto e importância
- Fecha loops de feedback
- Realiza reflexões periódicas sobre o estado do sistema

## Arquitetura Z-Suite

A arquitetura Z-Suite estende o conceito original de C-Suite, organizando módulos de IA por função:
- **Chief of Staff:** Orquestração e coordenação geral
- **Outros módulos Z-Suite:** (a serem implementados) Marketing, Finanças, Operações, etc.

## Balanceamento Quântico 3:1

O sistema mantém um balanço entre coerência (75%) e exploração (25%), conhecido como ratio 3:1:
- Mensagens são avaliadas quanto ao seu impacto no equilíbrio
- Palavras-chave "quânticas" são detectadas e processadas como gatilhos
- O impacto phi (φ) é calculado para cada interação
- Ações corretivas são disparadas quando o balanço se desvia do ideal

## Modo de Fallback

O sistema é projetado para operar mesmo em casos de indisponibilidade do Qdrant:
- Detecta automaticamente falhas de conexão
- Mantém funcionamento básico sem armazenamento vetorial
- Prioriza processamento de mensagens críticas
- Registra operações para sincronização posterior

## Como Testar

Execute o script `test_whatsapp_integration.py` para simular mensagens e verificar o processamento:

```bash
python test_whatsapp_integration.py
```

O teste envia mensagens simuladas, verifica o processamento pelo Z-Suite e mostra o impacto phi.

## Próximos Passos

1. Implementar conectores reais para WhatsApp/Telegram usando suas APIs oficiais
2. Expandir os papéis do Z-Suite para cobrir mais funções
3. Refinar o cálculo de impacto phi com base em análise de sentimento
4. Criar visualizações em tempo real do balanço quântico
5. Integrar com o sistema existente de geração fractal