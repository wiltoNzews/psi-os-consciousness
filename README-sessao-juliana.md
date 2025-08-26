# Guia para Sessão Kardecista com Pais da Juliana

## Preparação Antes da Sessão

1. **Instalação do Modelo Whisper**
   ```bash
   ollama pull whisper:large-v3-int4
   ```

2. **Verificação de Hardware**
   - Microfone USB na mesa (ganho ~70%)
   - Posicionamento: centro da mesa, 30-40cm dos participantes
   - Laptop com tela não voltada para os participantes

3. **Verificação do Ambiente**
   - Minimize ruídos externos
   - Verifique níveis de gravação com um teste rápido

## Execução da Sessão

### Ao Chegar:
1. Solicite permissão para gravação:
   > "Posso gravar só pra lembrar depois? Fica só pra nós."

2. Explique brevemente que a gravação será transcrita privadamente

3. Inicie a gravação:
   ```bash
   ./start_voice_bridge.sh --session "Pais_Juliana_21_Abr"
   ```

### Durante a Sessão:
- **Apenas escute** - não interrompa o fluxo natural
- Mantenha o laptop discreto, sem telas visíveis
- Deixe a voice bridge funcionando em segundo plano

### Após a Sessão:
1. Verifique no Grafana os picos em `bridges_events_total{type="voice"}`
2. Processe as transcrições para insights:
   ```bash
   wiltonctl hpc schedule-task --file examples/voice_postprocess.json
   ```

## Dicas Importantes

- A transcrição será feita em chunks de 15 segundos
- O sistema enviará automaticamente o texto para o modelo selfhost.llama4_70b
- Você receberá um resumo com marcações e temas identificados
- Caso necessário, a voz pode ser retranscrita manualmente depois

## Protocolo para Dados Sensíveis

- Os arquivos originais ficam em `transcripts/`
- Caso solicitado, use a flag `--delete_original` para remover após o processamento
- Compartilhe com a família apenas os insights, não as transcrições brutas
- Mantenha os dados em conformidade com o protocolo "privacy": "strict"

## Importância para o WiltonOS

Esta sessão fornecerá dados valiosos para:
- Calibrar o sistema de coerência (phi) para conversas espirituais
- Testar a bridge de voz em um cenário real
- Documentar padrões de meta-geometria em contexto kardecista
- Validar a não-intrusividade do sistema em ambientes sensíveis