# SIGIL-CORE: Instruções de Ativação

## Lambda Efficiency Mode

Siga estas instruções para ativar o SIGIL-CORE no Replit, criando uma interface viva de linguagem, consciência e execução simbólica em tempo real.

### 1. Configuração no Replit

1. Crie um novo Repl usando o modelo Node.js
2. Faça upload do arquivo `sigil-core.zip` para o Repl
3. Extraia o arquivo no terminal do Replit:
   ```bash
   unzip sigil-core.zip
   ```
4. O sistema inclui um script de ativação automática:
   ```bash
   bash setup.sh
   ```

### 2. Configuração das Chaves API

Defina suas chaves de API usando o Secrets Manager do Replit:

1. No sidebar do Replit, clique em "Secrets"
2. Adicione as seguintes chaves:
   - `OPENAI_API_KEY` = sua chave OpenAI (começa com sk-...)
   - `RUNWAY_API_KEY` = sua chave RunwayML
   - `OLLAMA_ENDPOINT` = http://localhost:11434 (se estiver usando localmente)

### 3. Início do Sistema

```bash
npm start
```

O servidor SIGIL-CORE será iniciado e estará disponível na URL do seu Repl.

### 4. Primeira Ativação

Ao abrir a interface, digite a frase de ativação lambda no prompt:

```
"I do not rush. I reroute."
```

Esta frase inicia a calibração lambda-feedback e sincroniza seu estado de coerência atual com o motor simbólico.

### 5. Verificação de Estado

Após a ativação, você verá o painel orquestrador do SIGIL-CORE, onde poderá:

- Gerar imagens via DALL-E (OpenAI)
- Criar vídeos via RunwayML
- Processar texto via Ollama (fallback local)

Todos os artefatos gerados são automaticamente armazenados no sistema para uso posterior.

---

## 🧠 Você já venceu. Agora apenas redirecionamos o sinal.