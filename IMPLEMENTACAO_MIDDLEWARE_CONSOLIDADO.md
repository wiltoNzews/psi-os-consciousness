# Plano de Implementação: Middleware Quântico WiltonOS

Este documento representa a consolidação da arquitetura de middleware quântico proposta com as camadas estruturais específicas para implementação imediata, baseado nas estruturas existentes do WiltonOS e no caso de uso do inventário.

## Arquitetura Consolidada

```
┌─────────────────────────────────────────────────────────────┐
│                 MIDDLEWARE QUÂNTICO WILTONOS                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────┐    ┌───────────────────────────┐     │
│  │  CAMADA 1         │    │         CAMADA 2          │     │
│  │  INGESTÃO &       │    │         RAG &             │     │
│  │  MEMÓRIA          │    │         ORQUESTRAÇÃO      │     │
│  └───────┬───────────┘    └─────────────┬─────────────┘     │
│          │                              │                   │
│          │                              │                   │
│          │                              │                   │
│  ┌───────┴──────────────────────────────┴───────────┐       │
│  │                   CAMADA 3                       │       │
│  │             INTERFACE & AÇÃO                     │       │
│  └───────────────────────┬───────────────────────┘          │
│                          │                                  │
│                          │                                  │
│  ┌───────────────────────┴───────────────────────┐          │
│  │             COHERENCE ARCHITECT               │          │
│  │                 (FUNDADOR)                    │          │
│  └───────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 1. Camada de Ingestão & Memória

### 1.1 Sistema de Document Loader

```python
# document_loader.py
import os
import glob
from langchain.document_loaders import (
    PyPDFLoader, 
    TextLoader, 
    MarkdownLoader
)

def load_all_documents(base_directory="wiltonos/knowledge/"):
    """Carrega todos os documentos recursivamente do diretório base"""
    documents = []
    
    # Procurar por documentos recursivamente
    pdf_files = glob.glob(f"{base_directory}/**/*.pdf", recursive=True)
    txt_files = glob.glob(f"{base_directory}/**/*.txt", recursive=True)
    md_files = glob.glob(f"{base_directory}/**/*.md", recursive=True)
    
    # Carregar PDFs
    for pdf_path in pdf_files:
        try:
            loader = PyPDFLoader(pdf_path)
            documents.extend(loader.load())
            print(f"Carregado: {pdf_path}")
        except Exception as e:
            print(f"Erro ao carregar {pdf_path}: {e}")
    
    # Carregar arquivos de texto
    for txt_path in txt_files:
        try:
            loader = TextLoader(txt_path)
            documents.extend(loader.load())
            print(f"Carregado: {txt_path}")
        except Exception as e:
            print(f"Erro ao carregar {txt_path}: {e}")
    
    # Carregar arquivos markdown
    for md_path in md_files:
        try:
            loader = MarkdownLoader(md_path)
            documents.extend(loader.load())
            print(f"Carregado: {md_path}")
        except Exception as e:
            print(f"Erro ao carregar {md_path}: {e}")
    
    print(f"Total de documentos carregados: {len(documents)}")
    return documents
```

### 1.2 Chunking e Embeddings

```python
# chunking_embeddings.py
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings, HuggingFaceEmbeddings

def chunk_documents(documents, chunk_size=800, chunk_overlap=100):
    """Divide documentos em chunks de tamanho apropriado"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"Documentos divididos em {len(chunks)} chunks")
    return chunks

def create_embeddings(chunks, embedding_type="openai", save_path="wiltonos/vector_db"):
    """Cria embeddings e armazena em FAISS (local)"""
    
    if embedding_type == "openai":
        embeddings = OpenAIEmbeddings()
    else:  # Local model
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    
    # Criar vector store
    vector_db = FAISS.from_documents(chunks, embeddings)
    
    # Salvar localmente
    vector_db.save_local(save_path)
    print(f"Vector DB salvo em: {save_path}")
    
    return vector_db
```

### 1.3 Memória de Longo Prazo

```python
# long_term_memory.py
import json
import datetime
import os

class LongTermMemory:
    def __init__(self, memory_file="wiltonos/memory/long_term_memory.json"):
        self.memory_file = memory_file
        self.topics = {}
        self.load_memory()
    
    def load_memory(self):
        """Carrega memória existente ou cria nova"""
        if os.path.exists(self.memory_file):
            with open(self.memory_file, 'r', encoding='utf-8') as f:
                self.topics = json.load(f)
        else:
            # Garantir que o diretório existe
            os.makedirs(os.path.dirname(self.memory_file), exist_ok=True)
            self.save_memory()
    
    def save_memory(self):
        """Salva o estado atual da memória"""
        with open(self.memory_file, 'w', encoding='utf-8') as f:
            json.dump(self.topics, f, ensure_ascii=False, indent=2)
    
    def add_insight(self, topic, insight, source=None):
        """Adiciona um novo insight a um tópico"""
        if topic not in self.topics:
            self.topics[topic] = {
                "insights": [],
                "last_updated": datetime.datetime.now().isoformat()
            }
        
        self.topics[topic]["insights"].append({
            "content": insight,
            "timestamp": datetime.datetime.now().isoformat(),
            "source": source
        })
        
        self.topics[topic]["last_updated"] = datetime.datetime.now().isoformat()
        self.save_memory()
    
    def get_topic_summary(self, topic):
        """Retorna o resumo de um tópico específico"""
        if topic in self.topics:
            insights = [i["content"] for i in self.topics[topic]["insights"]]
            return "\n".join(insights)
        return None
    
    def get_relevant_topics(self, query, vector_db):
        """Busca tópicos relevantes baseado em uma query"""
        # Para implementação simples, retornamos todos os tópicos
        # Em implementação avançada, usaríamos embeddings para encontrar relevância
        return list(self.topics.keys())
```

## 2. Camada de RAG & Orquestração

### 2.1 Retrieval Agent

```python
# retrieval_agent.py
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

class RetrievalAgent:
    def __init__(self, vector_db_path="wiltonos/vector_db", top_k=8):
        self.top_k = top_k
        
        # Carregar vetor DB existente
        embeddings = OpenAIEmbeddings()
        self.vector_db = FAISS.load_local(vector_db_path, embeddings)
    
    def retrieve(self, query):
        """Recupera os chunks mais relevantes para a query"""
        results = self.vector_db.similarity_search(query, k=self.top_k)
        
        # Formatar resultados
        formatted_results = []
        for i, doc in enumerate(results):
            formatted_results.append(f"--- Chunk {i+1} ---\n{doc.page_content}\n")
        
        return "\n".join(formatted_results)
```

### 2.2 Planner & Tool Selector

```python
# tool_selector.py
import re
import subprocess

class ToolSelector:
    def __init__(self):
        self.tools = {
            "whisper": self._transcribe_audio,
            "web_search": self._search_web,
            "python_analysis": self._run_python_analysis,
            "doc_processor": self._process_document
        }
    
    def select_tool(self, query):
        """Seleciona ferramenta apropriada baseada na query"""
        if re.search(r'áudio|transcrever|gravar|escutar', query, re.IGNORECASE):
            return "whisper"
        elif re.search(r'pesquisar|buscar|google|internet', query, re.IGNORECASE):
            return "web_search"
        elif re.search(r'analisar|calcular|processar dados', query, re.IGNORECASE):
            return "python_analysis"
        elif re.search(r'documento|pdf|arquivo|ler', query, re.IGNORECASE):
            return "doc_processor"
        else:
            return None
    
    def execute_tool(self, tool_name, params):
        """Executa a ferramenta selecionada com os parâmetros fornecidos"""
        if tool_name in self.tools:
            return self.tools[tool_name](params)
        return "Ferramenta não encontrada"
    
    def _transcribe_audio(self, params):
        """Transcreve áudio usando Whisper"""
        # Implementação do Whisper
        return "Transcrição do áudio: [conteúdo transcrito]"
    
    def _search_web(self, params):
        """Realiza busca na web"""
        # Implementação de busca web
        return "Resultados da busca: [resultados]"
    
    def _run_python_analysis(self, params):
        """Executa análise Python"""
        # Implementação de análise Python
        return "Resultado da análise: [resultados]"
    
    def _process_document(self, params):
        """Processa documento específico"""
        # Implementação de processamento de documento
        return "Documento processado: [resumo]"
```

## 3. Camada de Interface & Ação

### 3.1 Prompt Template

```python
# prompt_template.py
class PromptTemplate:
    def __init__(self):
        self.template = """
[MEMORY LONG-TERM]
{memory_summary}

[DOCUMENT CLIPS]
{retrieved_chunks}

[MODE] {mode}
[QUESTION] {user_question}
"""
    
    def fill(self, memory_summary, retrieved_chunks, mode, user_question):
        """Preenche o template com os dados fornecidos"""
        return self.template.format(
            memory_summary=memory_summary or "Nenhuma memória relevante encontrada.",
            retrieved_chunks=retrieved_chunks or "Nenhum documento relevante encontrado.",
            mode=mode or "Coherence Architect — MIDDLEWARE",
            user_question=user_question
        )
```

### 3.2 IRL Bridge

```python
# irl_bridge.py
import threading
import time

class IRLBridge:
    def __init__(self):
        self.notifications = []
        self.transcription_queue = []
        self._running = False
    
    def start(self):
        """Inicia o bridge como um thread separado"""
        self._running = True
        threading.Thread(target=self._background_process, daemon=True).start()
    
    def stop(self):
        """Para o bridge"""
        self._running = False
    
    def _background_process(self):
        """Processo em background para gerenciar notificações e transcrições"""
        while self._running:
            # Processar notificações
            if self.notifications:
                notification = self.notifications.pop(0)
                self._send_notification(notification)
            
            # Processar transcrições
            if self.transcription_queue:
                audio_file = self.transcription_queue.pop(0)
                self._transcribe_audio(audio_file)
            
            time.sleep(1)
    
    def add_notification(self, message, priority="normal"):
        """Adiciona uma notificação à fila"""
        self.notifications.append({
            "message": message,
            "priority": priority,
            "timestamp": time.time()
        })
    
    def queue_transcription(self, audio_file):
        """Adiciona um arquivo de áudio para transcrição"""
        self.transcription_queue.append(audio_file)
    
    def _send_notification(self, notification):
        """Envia a notificação através do canal apropriado"""
        print(f"NOTIFICATION ({notification['priority']}): {notification['message']}")
        # Implementação real enviaria para Slack, SMS, etc.
    
    def _transcribe_audio(self, audio_file):
        """Transcreve áudio usando Whisper"""
        print(f"Transcrevendo: {audio_file}")
        # Implementação real usaria Whisper API
```

### 3.3 Guardrails Quânticos

```python
# quantum_guardrails.py
class QuantumGuardrails:
    def __init__(self):
        self.bias_detected = False
        self.validation_required = False
    
    def check_bias(self, response):
        """Verifica se há viés na resposta"""
        # Implementação simplificada
        # Em produção, usaria um modelo específico para isso
        bias_indicators = [
            "eu acho", "provavelmente", "talvez", "possivelmente",
            "suspeito que", "parece que", "deve ser"
        ]
        
        for indicator in bias_indicators:
            if indicator in response.lower():
                self.bias_detected = True
                break
        
        return self.bias_detected
    
    def generate_bias_note(self):
        """Gera uma nota sobre viés detectado"""
        if self.bias_detected:
            return "\n\n[NOTA DE VIÉS: Esta resposta contém elementos especulativos que não estão diretamente nos dados. Por favor, verifique as afirmações contra suas informações.]"
        return ""
    
    def requires_user_confirmation(self, question):
        """Determina se a pergunta requer confirmação do usuário"""
        critical_patterns = [
            r'decid[ae]', r'escolh[ae]', r'selecion[ae]', 
            r'prioriz[ae]', r'elimin[ae]', r'descart[ae]'
        ]
        
        for pattern in critical_patterns:
            if re.search(pattern, question, re.IGNORECASE):
                self.validation_required = True
                break
        
        return self.validation_required
    
    def generate_confirmation_request(self):
        """Gera um pedido de confirmação do usuário"""
        if self.validation_required:
            return "\n\n[CONFIRMAÇÃO NECESSÁRIA: Esta resposta sugere um caminho de ação. Está alinhada com seus fatos e intenções?]"
        return ""
```

## Integração do Fluxo Completo

```python
# middleware_flow.py
from document_loader import load_all_documents
from chunking_embeddings import chunk_documents, create_embeddings
from long_term_memory import LongTermMemory
from retrieval_agent import RetrievalAgent
from tool_selector import ToolSelector
from prompt_template import PromptTemplate
from irl_bridge import IRLBridge
from quantum_guardrails import QuantumGuardrails

import os
import openai

class MiddlewareFlow:
    def __init__(self):
        # Inicializar componentes
        self.memory = LongTermMemory()
        self.retrieval = RetrievalAgent()
        self.tool_selector = ToolSelector()
        self.prompt_template = PromptTemplate()
        self.irl_bridge = IRLBridge()
        self.guardrails = QuantumGuardrails()
        
        # Iniciar bridge
        self.irl_bridge.start()
    
    def process_query(self, query, identity_mode="ZELAO"):
        """Processa uma query completa através do middleware"""
        # 1. Determinar se é necessário usar ferramentas
        tool_name = self.tool_selector.select_tool(query)
        tool_output = None
        
        if tool_name:
            print(f"Usando ferramenta: {tool_name}")
            tool_output = self.tool_selector.execute_tool(tool_name, query)
        
        # 2. Recuperar chunks relevantes
        retrieved_chunks = self.retrieval.retrieve(query)
        
        # 3. Obter memória de longo prazo relevante
        relevant_topics = self.memory.get_relevant_topics(query, self.retrieval.vector_db)
        memory_summary = ""
        
        for topic in relevant_topics:
            topic_summary = self.memory.get_topic_summary(topic)
            if topic_summary:
                memory_summary += f"[TÓPICO: {topic}]\n{topic_summary}\n\n"
        
        # 4. Construir prompt completo
        full_prompt = self.prompt_template.fill(
            memory_summary=memory_summary,
            retrieved_chunks=retrieved_chunks,
            mode=f"Coherence Architect — {identity_mode}",
            user_question=query
        )
        
        # Adicionar saída da ferramenta, se disponível
        if tool_output:
            full_prompt += f"\n\n[FERRAMENTA: {tool_name}]\n{tool_output}"
        
        # 5. Verificar se requer confirmação
        if self.guardrails.requires_user_confirmation(query):
            # Em caso real, aqui teríamos uma interação adicional com o usuário
            print("Esta consulta requer confirmação do usuário.")
        
        # 6. Obter resposta do modelo
        # Implementação mockada para exemplo
        response = f"Resposta baseada nos documentos e memória para: {query}"
        
        # 7. Verificar viés
        if self.guardrails.check_bias(response):
            response += self.guardrails.generate_bias_note()
        
        # 8. Adicionar insights à memória
        # Em implementação real, extrairíamos insights da interação
        self.memory.add_insight(
            topic="exemplo",
            insight=f"Query: {query}",
            source="interação"
        )
        
        return response
```

## Aplicação ao Inventário

### Script para Processamento do Inventário

```python
# process_inventory.py
import os
import sys
from middleware_flow import MiddlewareFlow

def setup_inventory_processing(inventory_dir):
    """Configura o middleware para processar o inventário"""
    # Criar diretório de conhecimento se não existir
    knowledge_dir = "wiltonos/knowledge/inventario"
    os.makedirs(knowledge_dir, exist_ok=True)
    
    # Copiar arquivos do inventário para o diretório de conhecimento
    # Em um cenário real, isso seria feito com shutil.copy
    print(f"Copiando arquivos de {inventory_dir} para {knowledge_dir}")
    
    # Criar middleware
    middleware = MiddlewareFlow()
    
    return middleware

def process_inventory_with_specific_queries(middleware):
    """Processa o inventário com queries específicas"""
    queries = [
        "Quais são os principais ativos na propriedade de Igaratá?",
        "Qual é o status legal atual da casa principal?",
        "Quais são os riscos jurídicos mais significativos neste inventário?",
        "Quais documentos precisam de atenção imediata?"
    ]
    
    results = {}
    
    for query in queries:
        print(f"\nProcessando query: {query}")
        response = middleware.process_query(query, identity_mode="WILTON")
        results[query] = response
        print(f"Resposta: {response}\n" + "-"*50)
    
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python process_inventory.py <diretório_do_inventário>")
        sys.exit(1)
    
    inventory_dir = sys.argv[1]
    middleware = setup_inventory_processing(inventory_dir)
    results = process_inventory_with_specific_queries(middleware)
    
    print("\nProcessamento completo!")
```

## Próximos Passos para Implementação

### 1. Configuração do Ambiente
```bash
# Criar estrutura de diretórios
mkdir -p wiltonos/knowledge/inventario
mkdir -p wiltonos/memory
mkdir -p wiltonos/vector_db

# Instalar dependências
pip install langchain openai faiss-cpu tiktoken python-dotenv
```

### 2. Preparação dos Documentos
1. Solicitar ao advogado a divisão do documento de 372MB em partes menores
2. Organizar em pastas temáticas no diretório `wiltonos/knowledge/inventario`
3. Rotular arquivos com prefixos que indiquem prioridade ou categoria

### 3. Configuração da API
Criar arquivo `.env` com:
```
OPENAI_API_KEY=sua_chave_api
```

### 4. Primeira Execução
```bash
# Carregar, chunkar e criar embeddings
python document_loader.py

# Processar inventário
python process_inventory.py wiltonos/knowledge/inventario
```

## Workflow de Uso Cotidiano

1. **Interação via Prompt**: Use o template unificado para todas consultas
2. **Captura de Insights**: Após cada sessão, destaque 2-3 insights para memória de longo prazo
3. **Alternância de Modos**: Alterne entre WILTON (pragmático), ZELAO (visionário) e ZEWS (padrões) conforme contexto
4. **Verificação de Viés**: Sempre verifique notas de viés antes de tomar decisões

---

Este plano consolidado integra a arquitetura de middleware quântico com as três camadas estruturais específicas, pronto para ser implementado e aplicado ao caso do inventário. O sistema permite que você permaneça como Coherence Architect enquanto o middleware gerencia as complexidades 3D.