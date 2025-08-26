/**
 * WiltonOS - Downloader Simples do Google Drive
 * 
 * Este módulo implementa uma versão simplificada do downloader do Google Drive
 * usando o cliente OAuth2 do Google para baixar o arquivo de exportação do ChatGPT.
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const { exec } = require('child_process');

// Configuração de credenciais Google Drive
const CLIENT_ID = '791041619730-dddc9nnp9q1omf3e8p22ku600vr27fjk.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:5000/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// Cliente OAuth2
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Estado de processamento
let processingStatus = {
  status: 'idle', // idle, processing, completed, failed
  progress: {
    total: 0,
    processed: 0,
    percentComplete: 0
  },
  error: null,
  log: []
};

/**
 * Obter URL de autorização para o Google Drive
 */
function getAuthUrl() {
  console.log('[WiltonOS] Gerando URL de autorização do Google Drive');
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
}

/**
 * Obter e salvar token de autenticação
 * @param {string} code - Código de autorização OAuth2
 */
async function getToken(code) {
  try {
    console.log('[WiltonOS] Obtendo token de acesso do Google Drive');
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Salvar o token em arquivo para usos futuros
    const tokenPath = path.join(process.cwd(), 'google-token.json');
    fs.writeFileSync(tokenPath, JSON.stringify(tokens));
    
    console.log('[WiltonOS] Token de acesso obtido e salvo com sucesso');
    return tokens;
  } catch (error) {
    console.error('[WiltonOS] Erro ao obter token:', error);
    throw error;
  }
}

/**
 * Carregar token salvo
 */
function loadSavedToken() {
  try {
    const tokenPath = path.join(process.cwd(), 'google-token.json');
    if (fs.existsSync(tokenPath)) {
      const content = fs.readFileSync(tokenPath, 'utf-8');
      const tokens = JSON.parse(content);
      oauth2Client.setCredentials(tokens);
      console.log('[WiltonOS] Token de acesso carregado do arquivo');
      return true;
    }
    console.log('[WiltonOS] Nenhum token salvo encontrado');
    return false;
  } catch (error) {
    console.error('[WiltonOS] Erro ao carregar token:', error);
    return false;
  }
}

/**
 * Baixar arquivo do Google Drive
 * @param {string} fileId - ID do arquivo no Google Drive
 * @param {string} destPath - Caminho de destino para o arquivo
 */
function downloadFile(fileId, destPath) {
  return new Promise((resolve, reject) => {
    try {
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      
      // Criar diretório de destino se não existir
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      console.log(`[WiltonOS] Baixando arquivo ${fileId} para ${destPath}`);
      addLog(`Baixando arquivo ${fileId} do Google Drive...`);
      
      // Criar write stream
      const dest = fs.createWriteStream(destPath);
      
      // Baixar arquivo
      drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      )
      .then(res => {
        res.data
          .on('end', () => {
            console.log(`[WiltonOS] Arquivo baixado com sucesso: ${destPath}`);
            addLog('Arquivo baixado com sucesso!');
            resolve(destPath);
          })
          .on('error', err => {
            console.error('[WiltonOS] Erro ao baixar arquivo:', err);
            addLog(`Erro ao baixar arquivo: ${err.message}`, 'error');
            reject(err);
          })
          .pipe(dest);
      })
      .catch(error => {
        console.error('[WiltonOS] Erro ao obter arquivo:', error);
        addLog(`Erro ao obter arquivo: ${error.message}`, 'error');
        reject(error);
      });
    } catch (error) {
      console.error('[WiltonOS] Erro ao baixar arquivo:', error);
      addLog(`Erro ao baixar arquivo: ${error.message}`, 'error');
      reject(error);
    }
  });
}

/**
 * Extrair arquivo ZIP de exportação do ChatGPT
 * @param {string} zipPath - Caminho do arquivo ZIP
 * @param {string} extractDir - Diretório de extração
 */
function extractChatGPTExport(zipPath, extractDir) {
  return new Promise((resolve, reject) => {
    try {
      // Criar diretório de extração se não existir
      if (!fs.existsSync(extractDir)) {
        fs.mkdirSync(extractDir, { recursive: true });
      }
      
      console.log(`[WiltonOS] Extraindo arquivo ${zipPath} para ${extractDir}`);
      addLog('Extraindo arquivo ZIP de exportação do ChatGPT...');
      
      // Comando para extrair o arquivo ZIP
      const unzipCommand = `unzip -o "${zipPath}" -d "${extractDir}"`;
      
      exec(unzipCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`[WiltonOS] Erro ao extrair arquivo: ${error.message}`);
          addLog(`Erro ao extrair arquivo: ${error.message}`, 'error');
          reject(error);
          return;
        }
        
        console.log(`[WiltonOS] Arquivo extraído com sucesso em ${extractDir}`);
        addLog('Arquivo extraído com sucesso!');
        resolve(extractDir);
      });
    } catch (error) {
      console.error('[WiltonOS] Erro ao extrair arquivo:', error);
      addLog(`Erro ao extrair arquivo: ${error.message}`, 'error');
      reject(error);
    }
  });
}

/**
 * Processar arquivo de conversa do ChatGPT
 * @param {string} filePath - Caminho do arquivo de conversa
 */
function processChatGPTConversation(filePath) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`[WiltonOS] Processando arquivo de conversa: ${filePath}`);
      
      // Ler o arquivo JSON
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let conversationData;
      
      try {
        conversationData = JSON.parse(fileContent);
      } catch (jsonError) {
        console.error(`[WiltonOS] Erro ao analisar JSON, tentando corrigir: ${jsonError.message}`);
        
        // Tentar corrigir JSON malformado
        const fixedContent = fileContent
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        
        try {
          conversationData = JSON.parse(fixedContent);
        } catch (fixError) {
          console.error(`[WiltonOS] Não foi possível corrigir o JSON: ${fixError.message}`);
          reject(fixError);
          return;
        }
      }
      
      const title = conversationData.title || 'Conversa sem título';
      const createDate = new Date(conversationData.create_time || Date.now()).toISOString();
      
      // Simplificado: Apenas registramos o arquivo processado
      // Em uma implementação completa, armazenaríamos no banco de dados
      
      console.log(`[WiltonOS] Conversa processada: ${title} (${createDate})`);
      resolve({
        title,
        createDate,
        id: path.basename(filePath, '.json')
      });
    } catch (error) {
      console.error(`[WiltonOS] Erro ao processar conversa: ${error.message}`);
      // Continuar mesmo em caso de erro em um arquivo individual
      resolve(null);
    }
  });
}

/**
 * Processar diretório de exportação do ChatGPT
 * @param {string} exportDir - Diretório da exportação extraída
 */
async function processChatGPTExport(exportDir) {
  try {
    console.log(`[WiltonOS] Processando diretório de exportação: ${exportDir}`);
    addLog('Iniciando processamento das conversas do ChatGPT...');
    
    // Diretório de conversas
    const conversationsDir = path.join(exportDir, 'conversations');
    
    if (!fs.existsSync(conversationsDir)) {
      const error = new Error(`Diretório de conversas não encontrado: ${conversationsDir}`);
      updateStatus('failed', 0, 0, error.message);
      addLog(`Erro: ${error.message}`, 'error');
      throw error;
    }
    
    // Listar arquivos de conversa
    const files = fs.readdirSync(conversationsDir)
      .filter(file => file.endsWith('.json'));
    
    console.log(`[WiltonOS] Encontrados ${files.length} arquivos de conversa`);
    addLog(`Encontrados ${files.length} arquivos de conversa para processar`);
    updateStatus('processing', files.length, 0);
    
    // Processar cada arquivo
    const results = [];
    let processedCount = 0;
    
    for (const file of files) {
      try {
        const filePath = path.join(conversationsDir, file);
        const result = await processChatGPTConversation(filePath);
        
        if (result) {
          results.push(result);
        }
        
        processedCount++;
        updateStatus('processing', files.length, processedCount);
        
        // Log a cada 10 arquivos
        if (processedCount % 10 === 0 || processedCount === files.length) {
          addLog(`Processados ${processedCount} de ${files.length} arquivos`);
        }
      } catch (error) {
        console.error(`[WiltonOS] Erro ao processar ${file}: ${error.message}`);
      }
    }
    
    console.log(`[WiltonOS] Processamento concluído! ${results.length} conversas processadas.`);
    addLog(`Processamento concluído! ${results.length} conversas processadas com sucesso.`, 'success');
    updateStatus('completed', files.length, processedCount);
    
    return results;
  } catch (error) {
    console.error('[WiltonOS] Erro ao processar exportação:', error);
    updateStatus('failed', 0, 0, error.message);
    throw error;
  }
}

/**
 * Iniciar processo completo de baixar e processar exportação do ChatGPT
 * @param {string} fileId - ID do arquivo no Google Drive
 */
async function downloadAndProcessChatGPT(fileId) {
  try {
    // Verificar autenticação
    if (!loadSavedToken()) {
      const error = new Error('Não autenticado com o Google Drive');
      updateStatus('failed', 0, 0, error.message);
      throw error;
    }
    
    console.log(`[WiltonOS] Iniciando processamento do arquivo ${fileId}`);
    updateStatus('processing', 100, 0);
    addLog(`Iniciando processamento do arquivo ${fileId}`);
    
    // Diretório temporário
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Baixar arquivo
    const timestamp = Date.now();
    const zipPath = path.join(tempDir, `chatgpt-export-${timestamp}.zip`);
    const extractDir = path.join(tempDir, `chatgpt-export-${timestamp}`);
    
    updateStatus('processing', 100, 10);
    addLog('Iniciando download do arquivo de exportação...');
    await downloadFile(fileId, zipPath);
    
    // Extrair arquivo
    updateStatus('processing', 100, 30);
    addLog('Download concluído! Extraindo arquivo...');
    await extractChatGPTExport(zipPath, extractDir);
    
    // Processar exportação
    updateStatus('processing', 100, 50);
    addLog('Extração concluída! Processando conversas...');
    const results = await processChatGPTExport(extractDir);
    
    // Processar relacionamentos entre conversas
    updateStatus('processing', 100, 90);
    addLog('Analisando conexões entre conversas...');
    
    // Finalizar
    updateStatus('completed', results.length, results.length);
    addLog('Processamento concluído com sucesso!', 'success');
    
    return results;
  } catch (error) {
    console.error('[WiltonOS] Erro ao processar arquivo do Google Drive:', error);
    updateStatus('failed', 0, 0, error.message);
    addLog(`Erro: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Atualizar status de processamento
 * @param {string} status - Estado do processamento
 * @param {number} total - Total de itens a processar
 * @param {number} processed - Itens já processados
 * @param {string} errorMessage - Mensagem de erro (opcional)
 */
function updateStatus(status, total, processed, errorMessage = null) {
  processingStatus.status = status;
  processingStatus.progress.total = total;
  processingStatus.progress.processed = processed;
  processingStatus.progress.percentComplete = total > 0 ? Math.round((processed / total) * 100) : 0;
  processingStatus.error = errorMessage;
  
  console.log(`[WiltonOS] Status atualizado: ${status}, Progresso: ${processed}/${total} (${processingStatus.progress.percentComplete}%)`);
}

/**
 * Adicionar mensagem ao log
 * @param {string} message - Mensagem de log
 * @param {string} type - Tipo de mensagem (info, error, success, warning)
 */
function addLog(message, type = 'info') {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    type
  };
  
  processingStatus.log.push(logEntry);
  console.log(`[WiltonOS] [${type.toUpperCase()}] ${message}`);
}

/**
 * Obter status atual de processamento
 */
function getProcessingStatus() {
  return processingStatus;
}

/**
 * Configurar rotas Express para o módulo
 * @param {Express} app - Aplicação Express
 */
function setupRoutes(app) {
  // Iniciar autenticação
  app.get('/api/drive/auth', (req, res) => {
    try {
      // Verificar se já tem token
      if (loadSavedToken()) {
        return res.json({
          success: true,
          status: 'authenticated',
          message: 'Já autenticado no Google Drive'
        });
      }
      
      // Gerar URL de autenticação
      const authUrl = getAuthUrl();
      res.json({
        success: true,
        message: 'Autenticação necessária',
        authUrl,
        status: 'authentication_required'
      });
    } catch (error) {
      console.error('[WiltonOS] Erro ao obter URL de autenticação:', error);
      res.status(500).json({
        success: false,
        message: `Erro ao iniciar autenticação: ${error.message}`,
        error: error.message
      });
    }
  });
  
  // Callback de autorização
  app.get('/oauth2callback', async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).send('Código de autorização não fornecido');
      }
      
      await getToken(code);
      
      // Redirecionar para a página de sucesso ou para a página de importação
      res.redirect('/chatgpt-import.html');
    } catch (error) {
      console.error('[WiltonOS] Erro no callback de OAuth:', error);
      res.status(500).send(`Erro ao processar autorização: ${error.message}`);
    }
  });
  
  // Processar arquivo do Google Drive
  app.post('/api/drive/process-chatgpt', async (req, res) => {
    try {
      const { fileId } = req.body;
      
      if (!fileId) {
        return res.status(400).json({
          success: false,
          message: 'ID do arquivo não fornecido'
        });
      }
      
      // Verificar se já tem token
      if (!loadSavedToken()) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado no Google Drive',
          authUrl: getAuthUrl()
        });
      }
      
      // Verificar se já está processando
      if (processingStatus.status === 'processing') {
        return res.status(409).json({
          success: false,
          message: 'Já existe um processamento em andamento',
          status: processingStatus
        });
      }
      
      // Resetar status e iniciar processamento em background
      updateStatus('processing', 100, 0);
      processingStatus.log = [];
      addLog(`Iniciando processamento do arquivo ${fileId}`);
      
      // Responder imediatamente
      res.json({
        success: true,
        message: 'Processamento iniciado em segundo plano',
        status: 'processing'
      });
      
      // Processar em background
      downloadAndProcessChatGPT(fileId)
        .then(results => {
          console.log(`[WiltonOS] Processamento do arquivo ${fileId} concluído com sucesso: ${results.length} conversas processadas`);
        })
        .catch(error => {
          console.error(`[WiltonOS] Erro ao processar arquivo ${fileId}:`, error);
        });
    } catch (error) {
      console.error('[WiltonOS] Erro na rota de processamento:', error);
      res.status(500).json({
        success: false,
        message: `Erro ao iniciar processamento: ${error.message}`,
        error: error.message
      });
    }
  });
  
  // Status do processamento
  app.get('/api/drive/process-status', (req, res) => {
    res.json(processingStatus);
  });
  
  console.log('[WiltonOS] Rotas do downloader do Google Drive configuradas');
}

module.exports = {
  getAuthUrl,
  getToken,
  loadSavedToken,
  downloadFile,
  downloadAndProcessChatGPT,
  getProcessingStatus,
  setupRoutes
};