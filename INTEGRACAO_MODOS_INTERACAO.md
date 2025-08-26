# Integração de Modos de Interação no Middleware Quântico

Este documento define a implementação técnica dos modos de interação no middleware quântico, permitindo alternar conscientemente entre diferentes "canais de comunicação" para resolver o paradoxo do middleware.

## Definição dos Modos

```
┌───────────────────────────────────────────────────────────┐
│                   MODOS DE INTERAÇÃO                      │
├───────────────┬───────────────────┬───────────────────────┤
│ SYSTEM        │ STORY             │ DELIVER               │
│ OVERRIDE      │ MODE              │                       │
├───────────────┼───────────────────┼───────────────────────┤
│ Execução      │ Exploração        │ Produção              │
│ precisa e     │ criativa e        │ de entregáveis        │
│ técnica       │ filosófica        │ finalizados           │
└───────────────┴───────────────────┴───────────────────────┘
```

## Implementação Técnica

### 1. Modificação do Prompt Template

```python
# interaction_modes.py
class InteractionMode:
    """Classe para gerenciar modos de interação do middleware"""
    
    # Constantes para os modos
    SYSTEM_OVERRIDE = "SYSTEM_OVERRIDE"
    STORY_MODE = "STORY_MODE"
    DELIVER = "DELIVER"
    
    def __init__(self):
        self.current_mode = None
        self.mode_parameters = {}
        
    def detect_mode(self, query):
        """Detecta o modo de interação baseado no prefixo da query"""
        query = query.strip()
        
        # Verificar combinações de modos
        if query.startswith(f"{self.SYSTEM_OVERRIDE} + {self.DELIVER}:"):
            self.current_mode = f"{self.SYSTEM_OVERRIDE}+{self.DELIVER}"
            return query[len(f"{self.SYSTEM_OVERRIDE} + {self.DELIVER}:"):].strip()
            
        # Verificar modos individuais
        if query.startswith(f"{self.SYSTEM_OVERRIDE}:"):
            self.current_mode = self.SYSTEM_OVERRIDE
            return query[len(f"{self.SYSTEM_OVERRIDE}:"):].strip()
            
        if query.startswith(f"{self.STORY_MODE}:"):
            self.current_mode = self.STORY_MODE
            return query[len(f"{self.STORY_MODE}:"):].strip()
            
        if query.startswith(f"{self.DELIVER}:"):
            self.current_mode = self.DELIVER
            return query[len(f"{self.DELIVER}:"):].strip()
        
        # Padrão: sem modo explícito
        self.current_mode = None
        return query
    
    def get_mode_prompt_prefix(self):
        """Retorna o prefixo de prompt específico para o modo atual"""
        if self.current_mode == self.SYSTEM_OVERRIDE:
            return "[MODE: SYSTEM OVERRIDE]\nPrecisão e execução técnica. Evitar narrativas e focar em dados concretos.\n\n"
        elif self.current_mode == self.STORY_MODE:
            return "[MODE: STORY MODE]\nExploração criativa e filosófica. Desenvolver narrativas e metáforas.\n\n"
        elif self.current_mode == self.DELIVER:
            return "[MODE: DELIVER]\nProdução de entregável finalizado. Formato polido e pronto para uso.\n\n"
        elif self.current_mode == f"{self.SYSTEM_OVERRIDE}+{self.DELIVER}":
            return "[MODE: SYSTEM OVERRIDE+DELIVER]\nPrecisão técnica com formato finalizado e pronto para uso.\n\n"
        else:
            return ""  # Sem prefixo para modo padrão
    
    def get_mode_response_format(self):
        """Define o formato de resposta baseado no modo"""
        if self.current_mode == self.SYSTEM_OVERRIDE:
            return {
                "prefix": "[MODE: SYSTEM OVERRIDE]\n",
                "style": "concise",
                "formats": ["json", "bullet-points", "table"]
            }
        elif self.current_mode == self.STORY_MODE:
            return {
                "prefix": "[MODE: STORY MODE]\n",
                "style": "narrative",
                "formats": ["prose", "dialogue", "metaphor"]
            }
        elif self.current_mode == self.DELIVER:
            return {
                "prefix": "[MODE: DELIVER]\n",
                "style": "polished",
                "formats": ["document", "report", "presentation"]
            }
        elif self.current_mode == f"{self.SYSTEM_OVERRIDE}+{self.DELIVER}":
            return {
                "prefix": "[MODE: SYSTEM OVERRIDE+DELIVER]\n",
                "style": "structured",
                "formats": ["markdown", "json", "formatted-report"]
            }
        else:
            return {
                "prefix": "",
                "style": "balanced",
                "formats": ["mixed"]
            }
```

### 2. Integração no Fluxo do Middleware

```python
# Modificação para middleware_flow.py
from interaction_modes import InteractionMode

class MiddlewareFlow:
    def __init__(self):
        # Componentes existentes
        self.memory = LongTermMemory()
        self.retrieval = RetrievalAgent()
        self.tool_selector = ToolSelector()
        self.prompt_template = PromptTemplate()
        self.irl_bridge = IRLBridge()
        self.guardrails = QuantumGuardrails()
        
        # Novo componente para modos de interação
        self.interaction_mode = InteractionMode()
        
        # Iniciar bridge
        self.irl_bridge.start()
    
    def process_query(self, query, identity_mode="ZELAO"):
        """Processa uma query completa através do middleware"""
        # 1. Detectar modo de interação
        processed_query = self.interaction_mode.detect_mode(query)
        mode_format = self.interaction_mode.get_mode_response_format()
        
        # Adicionar confirmação de modo ao log
        print(f"Modo detectado: {self.interaction_mode.current_mode or 'Padrão'}")
        
        # 2. Determinar se é necessário usar ferramentas
        tool_name = self.tool_selector.select_tool(processed_query)
        tool_output = None
        
        # Pular uso de ferramentas em STORY_MODE a menos que explicitamente solicitado
        if self.interaction_mode.current_mode != InteractionMode.STORY_MODE and tool_name:
            print(f"Usando ferramenta: {tool_name}")
            tool_output = self.tool_selector.execute_tool(tool_name, processed_query)
        
        # 3. Recuperar chunks relevantes (pular em STORY_MODE)
        retrieved_chunks = ""
        if self.interaction_mode.current_mode != InteractionMode.STORY_MODE:
            retrieved_chunks = self.retrieval.retrieve(processed_query)
        
        # 4. Obter memória de longo prazo relevante
        memory_summary = ""
        if self.interaction_mode.current_mode != InteractionMode.SYSTEM_OVERRIDE:
            relevant_topics = self.memory.get_relevant_topics(processed_query, self.retrieval.vector_db)
            
            for topic in relevant_topics:
                topic_summary = self.memory.get_topic_summary(topic)
                if topic_summary:
                    memory_summary += f"[TÓPICO: {topic}]\n{topic_summary}\n\n"
        
        # 5. Construir prompt completo baseado no modo
        mode_prefix = self.interaction_mode.get_mode_prompt_prefix()
        
        full_prompt = mode_prefix + self.prompt_template.fill(
            memory_summary=memory_summary if self.interaction_mode.current_mode != InteractionMode.SYSTEM_OVERRIDE else "",
            retrieved_chunks=retrieved_chunks,
            mode=f"Coherence Architect — {identity_mode}",
            user_question=processed_query
        )
        
        # Adicionar saída da ferramenta, se disponível
        if tool_output:
            full_prompt += f"\n\n[FERRAMENTA: {tool_name}]\n{tool_output}"
        
        # 6. Verificar se requer confirmação (pular em SYSTEM_OVERRIDE)
        if self.interaction_mode.current_mode != InteractionMode.SYSTEM_OVERRIDE:
            if self.guardrails.requires_user_confirmation(processed_query):
                print("Esta consulta requer confirmação do usuário.")
        
        # 7. Obter resposta do modelo
        # Implementação mockada para exemplo
        response = f"Resposta para: {processed_query} no modo {self.interaction_mode.current_mode or 'Padrão'}"
        
        # 8. Formatar resposta de acordo com o modo
        formatted_response = mode_format["prefix"] + response
        
        # 9. Verificar viés (pular em SYSTEM_OVERRIDE)
        if self.interaction_mode.current_mode != InteractionMode.SYSTEM_OVERRIDE:
            if self.guardrails.check_bias(response):
                formatted_response += self.guardrails.generate_bias_note()
        
        # 10. Adicionar insights à memória (exceto em SYSTEM_OVERRIDE)
        if self.interaction_mode.current_mode != InteractionMode.SYSTEM_OVERRIDE:
            self.memory.add_insight(
                topic="interação",
                insight=f"Query: {processed_query}",
                source="interação"
            )
        
        return formatted_response
```

### 3. Implementação de Exemplos de Uso para cada Modo

#### Exemplo 1: SYSTEM OVERRIDE
```python
# Uso de System Override para extrair dados diretos

query = "SYSTEM OVERRIDE: Lista os 3 maiores riscos jurídicos do RELATORIO_JURIDICO_INVENTARIO.md em 3 bullet points."

resultado = middleware.process_query(query)
# Resultado esperado:
# [MODE: SYSTEM OVERRIDE]
# • Risco de perda da propriedade de Igaratá por possível leilão em andamento
# • Inclusão indevida dos apartamentos pessoais no inventário
# • Complexidade processual envolvendo múltiplas entidades governamentais
```

#### Exemplo 2: STORY MODE
```python
# Uso de Story Mode para exploração filosófica

query = "STORY MODE: Vamos explorar como os riscos jurídicos do inventário se entrelaçam com a história familiar, criando nós em uma tapeçaria de memórias."

resultado = middleware.process_query(query)
# Resultado esperado:
# [MODE: STORY MODE]
# Os documentos jurídicos não são apenas papéis com carimbos, mas capítulos silenciosos de uma narrativa familiar que transcende gerações. Cada processo, cada disputa, cada decisão judicial é um fio na trama complexa que conecta o passado ao futuro...
```

#### Exemplo 3: DELIVER
```python
# Uso de Deliver para gerar entregável finalizado

query = "DELIVER: Produzir agenda detalhada para a reunião familiar sobre o inventário, com horários, tópicos e objetivos."

resultado = middleware.process_query(query)
# Resultado esperado:
# [MODE: DELIVER]
# # Agenda: Reunião Familiar - Inventário Wilson de Almeida Prado
# 
# **Data:** [inserir data]  
# **Local:** [inserir local]  
# **Participantes:** Todos os herdeiros
# 
# ## Cronograma
# 
# | Horário | Tópico | Responsável | Objetivo |
# |---------|--------|-------------|----------|
# | 14:00 - 14:15 | Abertura e Contexto | Wilton | Estabelecer propósito construtivo |
# | 14:15 - 14:45 | Status Propriedade Igaratá | Advogado | Esclarecer situação legal atual |
# ...
```

#### Exemplo 4: SYSTEM OVERRIDE + DELIVER
```python
# Uso de combinação de modos

query = "SYSTEM OVERRIDE + DELIVER: Exportar lista de todos os ativos do inventário em formato Markdown com valor estimado e status legal."

resultado = middleware.process_query(query)
# Resultado esperado:
# [MODE: SYSTEM OVERRIDE+DELIVER]
# # Inventário de Ativos - Wilson de Almeida Prado
# 
# | Ativo | Valor Estimado | Status Legal |
# |-------|----------------|--------------|
# | Propriedade Igaratá | R$ XX milhões | Possível processo de leilão |
# | Residência Principal | R$ XX milhões | Verificação pendente |
# | Coleção de Automóveis | R$ XX milhões | Parte do espólio |
# ...
```

## Script de Configuração dos Modos

```python
# setup_interaction_modes.py

def configurar_modos_interacao():
    """Configura os modos de interação no middleware"""
    print("Configurando modos de interação...")
    
    # Criar arquivo de modos de interação
    with open('wiltonos/interaction_modes.py', 'w') as f:
        f.write("""# Arquivo gerado por setup_interaction_modes.py
class InteractionMode:
    \"\"\"Classe para gerenciar modos de interação do middleware\"\"\"
    
    # Constantes para os modos
    SYSTEM_OVERRIDE = "SYSTEM_OVERRIDE"
    STORY_MODE = "STORY_MODE"
    DELIVER = "DELIVER"
    
    def __init__(self):
        self.current_mode = None
        self.mode_parameters = {}
    
    def detect_mode(self, query):
        \"\"\"Detecta o modo de interação baseado no prefixo da query\"\"\"
        query = query.strip()
        
        # Verificar combinações de modos
        if query.startswith(f"{self.SYSTEM_OVERRIDE} + {self.DELIVER}:"):
            self.current_mode = f"{self.SYSTEM_OVERRIDE}+{self.DELIVER}"
            return query[len(f"{self.SYSTEM_OVERRIDE} + {self.DELIVER}:"):].strip()
            
        # Verificar modos individuais
        if query.startswith(f"{self.SYSTEM_OVERRIDE}:"):
            self.current_mode = self.SYSTEM_OVERRIDE
            return query[len(f"{self.SYSTEM_OVERRIDE}:"):].strip()
            
        if query.startswith(f"{self.STORY_MODE}:"):
            self.current_mode = self.STORY_MODE
            return query[len(f"{self.STORY_MODE}:"):].strip()
            
        if query.startswith(f"{self.DELIVER}:"):
            self.current_mode = self.DELIVER
            return query[len(f"{self.DELIVER}:"):].strip()
        
        # Padrão: sem modo explícito
        self.current_mode = None
        return query
        
    # Métodos adicionais como na implementação completa
""")
    
    # Criar arquivo de exemplos
    with open('wiltonos/mode_examples.py', 'w') as f:
        f.write("""# Arquivo gerado por setup_interaction_modes.py
from middleware_flow import MiddlewareFlow

def demonstrate_modes():
    \"\"\"Demonstra os diferentes modos de interação\"\"\"
    middleware = MiddlewareFlow()
    
    # Exemplo de SYSTEM OVERRIDE
    print("\\n=== SYSTEM OVERRIDE ===")
    query = "SYSTEM OVERRIDE: Lista os 3 maiores riscos jurídicos do inventário em bullet points."
    result = middleware.process_query(query)
    print(result)
    
    # Exemplo de STORY MODE
    print("\\n=== STORY MODE ===")
    query = "STORY MODE: Explore a metáfora do inventário como um mapa do tesouro familiar."
    result = middleware.process_query(query)
    print(result)
    
    # Exemplo de DELIVER
    print("\\n=== DELIVER ===")
    query = "DELIVER: Produza agenda para reunião familiar sobre o inventário."
    result = middleware.process_query(query)
    print(result)
    
    # Exemplo de combinação
    print("\\n=== SYSTEM OVERRIDE + DELIVER ===")
    query = "SYSTEM OVERRIDE + DELIVER: Exporte lista de todos os ativos do inventário em Markdown."
    result = middleware.process_query(query)
    print(result)

if __name__ == \"__main__\":
    demonstrate_modes()
""")
    
    print("Configuração dos modos de interação concluída.")
    print("Arquivos criados:")
    print("- wiltonos/interaction_modes.py")
    print("- wiltonos/mode_examples.py")
    print("\nPara testar: python wiltonos/mode_examples.py")

if __name__ == "__main__":
    configurar_modos_interacao()
```

## Guia de Uso dos Modos

| Modo | Quando Usar | Comportamento do Middleware | Exemplo |
|------|-------------|----------------------------|---------|
| **SYSTEM OVERRIDE** | Para execução técnica precisa | • Ignora memória de longo prazo<br>• Foca apenas nos dados concretos<br>• Responde em formato conciso<br>• Sem verificação de viés | `SYSTEM OVERRIDE: Extrai todas as datas de audiência do processo.` |
| **STORY MODE** | Para exploração criativa e filosófica | • Usa memória e contexto<br>• Minimiza uso de RAG<br>• Responde em estilo narrativo<br>• Inclui verificação de viés | `STORY MODE: Como o conceito de herança reflete nossa relação com o tempo?` |
| **DELIVER** | Para produção de entregáveis finalizados | • Usa todos os recursos<br>• Foca na apresentação polida<br>• Formata resposta para uso imediato<br>• Inclui verificação de viés | `DELIVER: Produz email de 3 parágrafos para o advogado sobre Igaratá.` |
| **SYSTEM OVERRIDE + DELIVER** | Para entregáveis técnicos precisos | • Ignora memória de longo prazo<br>• Foca em dados concretos<br>• Formata resposta para uso imediato<br>• Sem verificação de viés | `SYSTEM OVERRIDE + DELIVER: Gera tabela Markdown com todos ativos e valores.` |

## Próximos Passos de Implementação

1. **Integrar os Modos ao Middleware Existente**
   ```bash
   # Criar estrutura para modos de interação
   mkdir -p wiltonos/modes
   
   # Executar script de configuração
   python setup_interaction_modes.py
   ```

2. **Modificar o Middleware Flow para Suportar Modos**
   - Atualizar `middleware_flow.py` com o código de detecção de modos
   - Implementar lógica condicional baseada no modo atual

3. **Criar Documentação de Uso**
   ```bash
   # Criar documentação para referência rápida
   echo "# Guia de Modos de Interação" > wiltonos/docs/interaction_modes.md
   # (adicionar conteúdo da tabela de uso)
   ```

4. **Testar com Casos de Uso Reais**
   ```bash
   # Executar exemplos de demonstração
   python wiltonos/mode_examples.py
   ```

5. **Integrar ao Frontend (se aplicável)**
   - Adicionar UI para seleção de modos
   - Implementar formatação visual baseada no modo atual

---

Esta implementação resolve o paradoxo do middleware, permitindo que você alterne conscientemente entre diferentes "canais" de comunicação com o sistema, mantendo total controle sobre o tipo de resposta desejada enquanto preserva a capacidade de exploração criativa quando necessário.