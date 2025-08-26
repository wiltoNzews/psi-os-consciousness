# WiltonOS - File Bridge

## Visão Geral

A File Bridge é um componente do WiltonOS que monitora diretórios específicos para novos arquivos, processa automaticamente diferentes tipos de documentos (incluindo OCR de imagens e PDFs), e envia o conteúdo extraído como tarefas para o sistema HPC.

Funciona como uma ponte que captura documentos, extrai o texto, analisa o conteúdo para detectar padrões específicos, e então encaminha para o sistema HPC do WiltonOS para processamento com modelos de linguagem.

## Recursos Principais

- **Monitoramento em Tempo Real**: Utiliza Watchdog para detectar instantaneamente novos arquivos
- **OCR Avançado**: Processa imagens e PDFs usando pytesseract para extrair texto com alta precisão
- **Análise de Conteúdo**: Detecta automaticamente documentos kardecistas e ajusta prompts adequadamente
- **Integração com WiltonOS**: Envio automático de tarefas para o sistema HPC
- **Configuração Flexível**: Arquivo YAML para personalização completa de comportamento
- **Gerenciamento de Arquivos**: Move documentos processados e com falha para diretórios específicos

## Estrutura de Diretórios

A File Bridge monitora por padrão o diretório `WiltonInbox` na raiz do projeto, que contém as seguintes subpastas:

- `WiltonInbox/documents`: Para arquivos de texto, documentos, etc.
- `WiltonInbox/images`: Para arquivos de imagem que precisam de OCR
- `WiltonInbox/pdf`: Para arquivos PDF
- `WiltonInbox/misc`: Para outros tipos de arquivo

Os arquivos processados são movidos para `WiltonInbox_processed` e os com falha para `WiltonInbox_failed`.

## Requisitos

- Python 3.8+
- Tesseract OCR instalado no sistema (para OCR de imagens)
- Poppler-utils (para processamento de PDFs)
- Bibliotecas Python: watchdog, pillow, numpy, pdf2image, pytesseract

## Instalação de Dependências

Para funcionalidade completa, é necessário instalar o Tesseract OCR e Poppler:

### Ubuntu/Debian
```bash
sudo apt install tesseract-ocr tesseract-ocr-por tesseract-ocr-eng poppler-utils
```

### macOS
```bash
brew install tesseract tesseract-lang poppler
```

### Python
```bash
pip install watchdog pillow numpy pdf2image pytesseract
```

## Uso

### Iniciar Monitoramento

Para iniciar o monitoramento padrão de arquivos:
```bash
./start_files_bridge.sh
```

Para monitoramento verboso (mais logs):
```bash
./start_files_bridge.sh --verbose
```

### Processar Um Arquivo Específico

Para processar um único arquivo:
```bash
./start_files_bridge.sh --file /caminho/para/arquivo.pdf
```

### Configuração

A configuração completa está em `bridges/files_bridge/config.yaml` e inclui:

- Diretórios monitorados
- Configurações de OCR
- Tipos de arquivo suportados
- Prompts específicos para diferentes tipos de documento
- Configurações de prioridade e modelo

## Fluxo de Processamento

1. Um novo arquivo é detectado no diretório monitorado
2. O arquivo é processado de acordo com seu tipo:
   - Texto: lido diretamente
   - Imagem: processado com OCR
   - PDF: convertido para imagens e processado com OCR
3. O texto extraído é analisado para detecção de tipo de documento (ex: kardecista)
4. Uma tarefa é criada com o prompt apropriado e enviada ao HPC
5. O arquivo é movido para o diretório de processados ou falhas

## Integração com Dashboard

Os eventos da File Bridge são registrados no Prometheus e podem ser visualizados no dashboard Grafana do WiltonOS, incluindo:

- `file_ingest_events_total`: Total de arquivos processados
- `file_ingest_processing_seconds`: Histograma do tempo de processamento
- `file_ingest_ocr_errors_total`: Erros de OCR por tipo de arquivo

## Resolução de Problemas

Se a File Bridge não estiver processando arquivos corretamente:

1. Verifique se o Tesseract OCR está instalado: `tesseract --version`
2. Verifique se o Poppler está instalado: `pdftoppm -v`
3. Inicie com modo verboso: `./start_files_bridge.sh --verbose`
4. Verifique logs em `file_bridge.log`
5. Teste processando um arquivo específico: `./start_files_bridge.sh --file test.pdf`

## Uso para Sessões Kardecistas

A File Bridge é especialmente útil para processamento de documentos das sessões kardecistas:

1. Escaneie ou fotografe anotações manuscritas e coloque em `WiltonInbox/images`
2. PDFs de materiais de referência podem ser colocados em `WiltonInbox/pdf`
3. A bridge detectará palavras-chave como "kardec", "espírita" e "metageometria" e aplicará prompts especializados
4. O modelo selfhost.llama4_70b será priorizado para estes documentos