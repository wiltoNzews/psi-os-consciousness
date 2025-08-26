FROM python:3.11-slim

WORKDIR /app

# Copiar apenas os arquivos de requisitos primeiro para aproveitar o cache em camadas
COPY server/requirements.txt .
COPY wilton_core/requirements.txt ./wilton_core_requirements.txt

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir -r wilton_core_requirements.txt

# Instalar dependências para GPU (se necessário)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cuda-cudart-dev-11-8 \
    libcudnn8 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copiar o código-fonte da API
COPY server/ ./server/
COPY wilton_core/ ./wilton_core/
COPY shared/ ./shared/

# Definir variáveis de ambiente
ENV PYTHONPATH=/app
ENV PORT=5000
ENV TZ=America/Sao_Paulo

# Expor a porta
EXPOSE 5000

# Comando para iniciar a API
CMD ["uvicorn", "wilton_core.main:app", "--host", "0.0.0.0", "--port", "5000"]