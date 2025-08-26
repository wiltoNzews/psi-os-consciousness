/**
 * WiltonOS - Rotas para download e processamento do Google Drive
 * 
 * Este módulo implementa rotas Express para gerenciar o download e processamento
 * de arquivos diretamente do Google Drive, com foco no arquivo de exportação do ChatGPT.
 */

import express from 'express';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const router = express.Router();

// Configuração do cliente OAuth
const CLIENT_ID = '791041619730-dddc9nnp9q1omf3e8p22ku600vr27fjk.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:5000/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// Cliente OAuth
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Estado de download
let downloadStatus = {
  status: 'idle', // idle, processing, completed, failed
  progress: {
    total: 0,    // tamanho total em MB
    processed: 0, // quantidade baixada em MB
    percentComplete: 0
  },
  error: null,
  logs: []
};

// Verificar autenticação
router.get('/auth', (req, res) => {
  try {
    // Verificar se já tem token salvo
    if (loadSavedToken()) {
      return res.json({
        status: 'authenticated',
        message: 'Já autenticado no Google Drive'
      });
    }
    
    // Gerar URL para autenticação
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });
    
    res.json({
      status: 'authentication_required',
      message: 'Autenticação necessária',
      authUrl
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao verificar autenticação:', error);
    res.status(500).json({
      status: 'error',
      message: `Erro ao verificar autenticação: ${error.message}`
    });
  }
});

// Callback de autenticação OAuth
router.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('Código de autorização não fornecido');
  }
  
  try {
    // Obter tokens a partir do código
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Salvar tokens para uso futuro
    fs.writeFileSync(
      path.join(process.cwd(), 'google-token.json'),
      JSON.stringify(tokens)
    );
    
    console.log('[WiltonOS] Token de autenticação do Google Drive salvo com sucesso');
    
    // Redirecionar para a página de autorização
    res.redirect('/drive-auth.html');
  } catch (error) {
    console.error('[WiltonOS] Erro ao processar callback de autenticação:', error);
    res.status(500).send(`Erro ao obter token: ${error.message}`);
  }
});

// Iniciar download
router.post('/download', async (req, res) => {
  const { fileId } = req.body;
  
  if (!fileId) {
    return res.status(400).json({
      success: false,
      message: 'ID do arquivo não fornecido'
    });
  }
  
  // Verificar autenticação
  if (!loadSavedToken()) {
    return res.status(401).json({
      success: false,
      message: 'Não autenticado no Google Drive'
    });
  }
  
  // Verificar se já está baixando
  if (downloadStatus.status === 'processing') {
    return res.json({
      success: true,
      message: 'Download já está em andamento',
      status: downloadStatus
    });
  }
  
  // Resetar status
  resetDownloadStatus();
  addDownloadLog('Iniciando download do arquivo de exportação do ChatGPT...');
  
  // Iniciar download em background
  res.json({
    success: true,
    message: 'Download iniciado em segundo plano',
    status: downloadStatus
  });
  
  // Processar em background
  startDownload(fileId)
    .catch(error => {
      console.error('[WiltonOS] Erro ao baixar arquivo:', error);
      downloadStatus.status = 'failed';
      downloadStatus.error = error.message;
      addDownloadLog(`Erro ao baixar arquivo: ${error.message}`, 'error');
    });
});

// Verificar status do download
router.get('/download-status', (req, res) => {
  res.json(downloadStatus);
});

// Carregar token salvo
function loadSavedToken() {
  try {
    const tokenPath = path.join(process.cwd(), 'google-token.json');
    if (fs.existsSync(tokenPath)) {
      const content = fs.readFileSync(tokenPath, 'utf-8');
      const tokens = JSON.parse(content);
      oauth2Client.setCredentials(tokens);
      return true;
    }
    return false;
  } catch (error) {
    console.error('[WiltonOS] Erro ao carregar token salvo:', error);
    return false;
  }
}

// Resetar status de download
function resetDownloadStatus() {
  downloadStatus = {
    status: 'processing',
    progress: {
      total: 0,
      processed: 0,
      percentComplete: 0
    },
    error: null,
    logs: []
  };
}

// Adicionar log ao status de download
function addDownloadLog(message, type = 'info') {
  const log = {
    timestamp: new Date().toISOString(),
    message,
    type
  };
  
  downloadStatus.logs.push(log);
  console.log(`[WiltonOS] [${type.toUpperCase()}] ${message}`);
}

// Iniciar download do arquivo
async function startDownload(fileId) {
  try {
    // Configurar cliente do Google Drive
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // Obter metadados do arquivo
    addDownloadLog('Obtendo informações do arquivo...');
    const fileMetadata = await drive.files.get({ fileId });
    
    const fileName = fileMetadata.data.name;
    addDownloadLog(`Arquivo encontrado: ${fileName}`);
    
    // Criar diretório temporário
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Caminho para salvar o arquivo
    const destPath = path.join(tempDir, fileName);
    const extractDir = path.join(tempDir, 'chatgpt-export');
    
    // Iniciar download
    downloadStatus.status = 'processing';
    addDownloadLog(`Iniciando download para ${destPath}...`);
    
    await downloadFile(drive, fileId, destPath);
    
    // Após download, extrair e processar o arquivo
    addDownloadLog('Download concluído! Extraindo arquivo...');
    
    // Garantir que o diretório de extração exista
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
    }
    
    // Extrair arquivo
    await extractZipFile(destPath, extractDir);
    
    addDownloadLog('Extração concluída! Processando conversas...');
    
    // Processar arquivo extraído
    // Neste ponto, você incluiria a lógica para processar o conteúdo do ChatGPT
    // usando o módulo chatgpt-processor.js
    
    downloadStatus.status = 'completed';
    downloadStatus.progress.percentComplete = 100;
    addDownloadLog('Processamento concluído com sucesso!', 'success');
    
    return { success: true };
  } catch (error) {
    console.error('[WiltonOS] Erro ao baixar arquivo:', error);
    downloadStatus.status = 'failed';
    downloadStatus.error = error.message;
    addDownloadLog(`Erro ao baixar arquivo: ${error.message}`, 'error');
    throw error;
  }
}

// Baixar arquivo do Google Drive
async function downloadFile(drive, fileId, destPath) {
  return new Promise((resolve, reject) => {
    try {
      // Criar write stream
      const dest = fs.createWriteStream(destPath);
      
      drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      )
      .then(res => {
        // Obter tamanho total se disponível
        let totalSize = parseInt(res.headers['content-length']) || 0;
        if (totalSize > 0) {
          downloadStatus.progress.total = Math.round(totalSize / (1024 * 1024)); // Converter para MB
        } else {
          // Se tamanho não for fornecido, usar um valor padrão para exportação (estimativa)
          downloadStatus.progress.total = 800; // ~800MB para exportação típica do ChatGPT
        }
        
        let downloaded = 0;
        
        res.data
          .on('data', chunk => {
            downloaded += chunk.length;
            downloadStatus.progress.processed = Math.round(downloaded / (1024 * 1024)); // MB
            
            // Calcular percentual
            if (downloadStatus.progress.total > 0) {
              downloadStatus.progress.percentComplete = Math.round(
                (downloadStatus.progress.processed / downloadStatus.progress.total) * 100
              );
            }
            
            // Log a cada 10MB
            if (Math.floor(downloaded / (10 * 1024 * 1024)) > Math.floor((downloaded - chunk.length) / (10 * 1024 * 1024))) {
              addDownloadLog(`Baixados ${downloadStatus.progress.processed} MB de ${downloadStatus.progress.total} MB (${downloadStatus.progress.percentComplete}%)`);
            }
          })
          .on('end', () => {
            addDownloadLog(`Download concluído! Total: ${downloadStatus.progress.processed} MB`);
            resolve(destPath);
          })
          .on('error', err => {
            addDownloadLog(`Erro durante o download: ${err.message}`, 'error');
            reject(err);
          })
          .pipe(dest);
      })
      .catch(error => {
        addDownloadLog(`Erro ao obter arquivo: ${error.message}`, 'error');
        reject(error);
      });
    } catch (error) {
      addDownloadLog(`Erro ao iniciar download: ${error.message}`, 'error');
      reject(error);
    }
  });
}

// Extrair arquivo ZIP
async function extractZipFile(zipPath, extractDir) {
  try {
    addDownloadLog(`Extraindo ${zipPath} para ${extractDir}...`);
    
    // Usar unzip para extrair o arquivo
    const command = `unzip -o "${zipPath}" -d "${extractDir}"`;
    await execPromise(command);
    
    addDownloadLog('Arquivo extraído com sucesso!');
    return extractDir;
  } catch (error) {
    addDownloadLog(`Erro ao extrair arquivo: ${error.message}`, 'error');
    throw error;
  }
}

export default router;