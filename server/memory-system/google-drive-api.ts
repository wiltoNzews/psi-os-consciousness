import express from 'express';
import path from 'path';
import { 
  downloadAndExtractChatGPTExport, 
  getAuthUrl, 
  setToken, 
  loadSavedToken 
} from './google-drive-downloader';
import { processChatGPTExport, extractConcepts } from './chatgpt-processor';

export function registerGoogleDriveRoutes(app: express.Express): void {
  console.log('[WiltonOS] Registrando rotas da API do Google Drive...');
  
  // Route to initialize Google Drive authentication
  app.get('/api/google-drive/auth', (req, res) => {
    try {
      // Check if we already have a saved token
      if (loadSavedToken()) {
        return res.json({
          success: true,
          message: 'Já autenticado com o Google Drive',
          status: 'authenticated'
        });
      }
      
      // Generate auth URL for user to authenticate
      const authUrl = getAuthUrl();
      res.json({
        success: true,
        message: 'Autenticação necessária',
        authUrl,
        status: 'authentication_required'
      });
    } catch (error) {
      console.error('[WiltonOS] Erro ao iniciar autenticação do Google Drive:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao iniciar autenticação do Google Drive',
        error: error.message
      });
    }
  });
  
  // OAuth callback route
  app.get('/oauth2callback', async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Código de autorização não encontrado na resposta'
        });
      }
      
      // Set the token
      await setToken(code as string);
      
      // Redirect to a success page
      res.redirect('/google-drive-success.html');
    } catch (error) {
      console.error('[WiltonOS] Erro ao processar callback OAuth:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao processar callback OAuth',
        error: error.message
      });
    }
  });
  
  // Route to download and process ChatGPT export
  app.post('/api/google-drive/process-chatgpt-export', async (req, res) => {
    try {
      const { fileId } = req.body;
      
      if (!fileId) {
        return res.status(400).json({
          success: false,
          message: 'ID do arquivo não fornecido'
        });
      }
      
      // Check if we have a valid token
      if (!loadSavedToken()) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado com o Google Drive',
          status: 'authentication_required'
        });
      }
      
      // Start the download and processing in the background
      res.json({
        success: true,
        message: 'Processamento iniciado em segundo plano',
        status: 'processing'
      });
      
      // Download and extract the file
      console.log(`[WiltonOS] Iniciando download e extração do arquivo ${fileId}...`);
      const extractPath = await downloadAndExtractChatGPTExport(fileId);
      
      // Process the extracted files
      console.log(`[WiltonOS] Arquivo extraído, iniciando processamento...`);
      const processedIds = await processChatGPTExport(extractPath);
      
      // Extract concepts
      console.log(`[WiltonOS] Conversas processadas, extraindo conceitos...`);
      await extractConcepts(processedIds);
      
      console.log(`[WiltonOS] Processamento completo: ${processedIds.length} conversas processadas`);
      
    } catch (error) {
      console.error('[WiltonOS] Erro ao processar exportação do ChatGPT:', error);
      // We already sent a response, so we just log the error
    }
  });
  
  // Route to check processing status
  app.get('/api/google-drive/process-status', (req, res) => {
    // In a real implementation, we would track the processing status
    // For now, we'll just return a placeholder
    res.json({
      success: true,
      status: 'in_progress',
      progress: {
        total: 100,
        processed: 25,
        percentComplete: 25
      }
    });
  });
  
  // Create a simple success page
  app.get('/google-drive-success.html', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Autenticação Google Drive - Sucesso</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
          }
          h1 {
            color: #4285F4;
          }
          p {
            margin: 1rem 0;
            line-height: 1.5;
          }
          button {
            background-color: #4285F4;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
          }
          button:hover {
            background-color: #3367D6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Autenticação Concluída!</h1>
          <p>Você foi autenticado com sucesso no Google Drive. Agora você pode processar sua exportação do ChatGPT no sistema de memória perpétua do WiltonOS.</p>
          <p>Clique no botão abaixo para processar o arquivo de exportação do ChatGPT.</p>
          <button onclick="processExport()">Processar Exportação</button>
        </div>
        
        <script>
          function processExport() {
            fetch('/api/google-drive/process-chatgpt-export', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                fileId: '1ndQzZJCwcoLbmPQMr9rsYO5SR2ImluVT'
              })
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert('Processamento iniciado em segundo plano! Você pode acompanhar o progresso no console do servidor.');
                window.location.href = '/perpetual-memory.html';
              } else {
                alert('Erro ao iniciar processamento: ' + data.message);
              }
            })
            .catch(error => {
              alert('Erro ao iniciar processamento: ' + error.message);
            });
          }
        </script>
      </body>
      </html>
    `);
  });
  
  console.log('[WiltonOS] Rotas da API do Google Drive registradas com sucesso');
}