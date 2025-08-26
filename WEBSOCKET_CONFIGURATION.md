# Configuração de WebSocket para WiltonOS em Docker

Este documento explica como configurar corretamente as conexões WebSocket para funcionar com a configuração Docker do WiltonOS.

## O Problema

O aplicativo React do WiltonOS tenta se conectar a um WebSocket usando o endereço do navegador (`window.location`), o que funciona bem no ambiente Replit, mas pode falhar quando implantado em containers Docker.

## Solução

Para garantir o funcionamento correto do WebSocket no ambiente Docker, siga estas etapas:

### 1. Configure o arquivo `.env` no cliente

Crie ou atualize o arquivo `client/.env` com as informações corretas do servidor WebSocket:

```bash
# Para desenvolvimento local
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000/ws

# Para produção (substitua pelo IP ou hostname do Node-A)
# VITE_API_URL=http://192.168.1.100:5000
# VITE_WS_URL=ws://192.168.1.100:5000/ws
```

### 2. Modificação para produção

Quando implantar em produção no Node-A, atualize o arquivo `.env` do cliente com o endereço IP ou hostname correto:

```bash
# Substitua 192.168.1.100 pelo IP real do seu Node-A
VITE_API_URL=http://192.168.1.100:5000
VITE_WS_URL=ws://192.168.1.100:5000/ws
```

### 3. Bibliotecas de exemplo

A biblioteca de exemplo `client/src/lib/websocket.ts` foi criada para ilustrar o método correto de conexão WebSocket. Esta biblioteca:

- Usa as variáveis de ambiente do Vite para obter a URL do WebSocket
- Implementa reconexão automática com número máximo de tentativas configurável
- Oferece uma interface limpa para enviar e receber mensagens
- Gerencia os estados da conexão adequadamente

## Implantação usando o Docker Compose

O `docker-compose.yml` inclui as seguintes configurações importantes para o WebSocket:

1. **Configuração do Nginx** como proxy reverso:
   ```nginx
   # Dentro de nginx/nginx.conf
   location /ws {
       proxy_pass http://api:5000/ws;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "Upgrade";
       proxy_set_header Host $host;
       # ...
   }
   ```

2. **API exposta na porta 5000**:
   ```yaml
   # No docker-compose.yml
   api:
     # ...
     ports:
       - "5000:5000"
   ```

## Verificação da Conexão

Após iniciar os contêineres, você pode verificar se o WebSocket está funcionando corretamente com:

```bash
# Verificar se a porta está aberta
netstat -tulpn | grep 5000

# Testar a conexão WebSocket com uma ferramenta como wscat
wscat -c ws://localhost:5000/ws
```

## Resolução de Problemas

Se o WebSocket ainda não estiver conectando:

1. Verifique os logs do contêiner da API:
   ```bash
   docker logs [id_do_container_api]
   ```

2. Confirme se o CORS está configurado corretamente no servidor para permitir conexões WebSocket.

3. Verifique se o Nginx está encaminhando corretamente as solicitações de upgrade do WebSocket.

4. Certifique-se de que não há firewalls bloqueando a porta 5000.

## Exemplo de Uso no React

```tsx
import { useState, useEffect } from 'react';
import { getWebSocketManager } from './lib/websocket';

function QuantumComponent() {
  const [status, setStatus] = useState('desconectado');
  const [phiValue, setPhiValue] = useState(0.75);
  
  useEffect(() => {
    const ws = getWebSocketManager({
      onOpen: () => setStatus('conectado'),
      onClose: () => setStatus('desconectado'),
      onMessage: (data) => {
        if (data.type === 'phi_update') {
          setPhiValue(data.payload.phi);
        }
      }
    });
    
    ws.connect();
    
    return () => ws.disconnect();
  }, []);
  
  return (
    <div>
      <p>Status: {status}</p>
      <p>Valor Φ atual: {phiValue}</p>
    </div>
  );
}
```