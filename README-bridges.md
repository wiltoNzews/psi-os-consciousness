# WiltonOS Bridges

Os bridges são módulos que conectam o WiltonOS a fontes externas de dados, permitindo a integração com outros sistemas e disparando tarefas no sistema com base em eventos externos.

## Bridges Disponíveis

### 🔗 Bridge de Clipboard
Monitora a área de transferência (clipboard) e processa dados relevantes automaticamente.

**Funcionalidades:**
- Detecção de padrões em texto copiado (JSON, listas, URLs, etc.)
- Criação automática de tarefas baseadas no conteúdo
- Suporte a tags para controle de prioridade (#urgent, #analyze, etc.)

**Uso:**
```bash
./start_clipboard_bridge.sh
```

**Parâmetros:**
- `--interval`: Intervalo entre verificações em segundos (padrão: 1.0)
- `--min-length`: Tamanho mínimo do texto para ser processado (padrão: 10)
- `--cooldown`: Tempo mínimo entre agendamentos em segundos (padrão: 5.0)
- `--simulation`: Executa em modo de simulação (sem agendar tarefas reais)

### 📧 Bridge de Email
Monitora uma conta de email (Gmail) e processa emails com tags específicas.

**Funcionalidades:**
- Integração com a API do Gmail
- Processamento baseado em comandos (/process, /analyze, etc.)
- Marcação automática de emails processados

**Uso:**
```bash
./start_email_bridge.sh
```

**Parâmetros:**
- `--interval`: Intervalo entre verificações em segundos (padrão: 60.0)
- `--label`: Rótulo para marcar emails processados (padrão: WiltonOS/Processed)
- `--simulation`: Executa em modo de simulação (sem agendar tarefas reais)

**Requisito:**
- Arquivo de credenciais do Gmail (`credentials/gmail_credentials.json`)

## Instalação de Dependências

Para instalar todas as dependências necessárias:

```bash
./install_dependencies.sh
```

## Comandos e Tags Suportados

### Bridge de Clipboard
O Bridge de Clipboard detecta automaticamente padrões, mas você pode adicionar tags especiais para controlar o processamento:

- `#urgent` ou `#high`: Aumenta a prioridade da tarefa
- `#later` ou `#low`: Reduz a prioridade da tarefa
- `#analyze`: Solicita análise detalhada
- `#summarize`: Solicita resumo do conteúdo
- `#save`: Salva o conteúdo para referência
- `⚠️` ou `#process`: Força o processamento mesmo para pequenos textos

### Bridge de Email
No assunto ou corpo do email, utilize:

- `/process` ou `#process`: Processa o conteúdo do email
- `/urgent` ou `#urgent`: Marca como urgente (prioridade alta)
- `/analyze` ou `#analyze`: Realiza análise detalhada
- `/summarize` ou `#summarize`: Resume o conteúdo
- `/save` ou `#save`: Salva para referência
- `/later` ou `#later`: Processa com prioridade baixa
- `/ignore` ou `#ignore`: Marca como lido sem processar

## Arquitetura

```
wilton_core/
├── bridges/
│   ├── __init__.py           # Definição do pacote
│   ├── clipboard_bridge.py   # Bridge de área de transferência
│   └── email_bridge.py       # Bridge de email
├── ...
```

Os bridges utilizam o `wiltonctl` para agendar tarefas no HPCManager, que são então processadas pelo daemon de coerência, mantendo a estabilidade do sistema φ (phi).

## Manutenção e Monitoramento

Os bridges geram logs detalhados no diretório `logs/` para facilitar o diagnóstico de problemas.

Para verificar o status das tarefas agendadas pelos bridges:

```bash
wiltonctl hpc list-tasks --source clipboard
wiltonctl hpc list-tasks --source email_bridge
```

## Próximos Passos de Desenvolvimento

- [ ] Bridge para integração com mensageiros (WhatsApp, Telegram)
- [ ] Bridge para monitoramento de feeds RSS
- [ ] Dashboard web para visualização das integrações e fluxos de dados