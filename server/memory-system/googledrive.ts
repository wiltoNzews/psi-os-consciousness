import express from 'express';
import path from 'path';
import fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { processChatGPTExport } from './chatgpt-processor';

// Configuração de credenciais Google Drive
const CLIENT_ID = '791041619730-dddc9nnp9q1omf3e8p22ku600vr27fjk.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:5000/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

// Cliente OAuth2
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Funções de autenticação
export function getAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
}

export async function getToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  
  // Salvar o token em arquivo para usos futuros
  fs.writeFileSync(
    path.join(process.cwd(), 'google-token.json'),
    JSON.stringify(tokens)
  );
  
  return tokens;
}

export function loadSavedToken(): boolean {
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
    console.error('[WiltonOS] Erro ao carregar token:', error);
    return false;
  }
}

// Funções de download e processamento
export async function downloadFile(fileId: string, destPath: string): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  console.log(`[WiltonOS] Baixando arquivo ${fileId}...`);
  
  return new Promise((resolve, reject) => {
    // Criar diretório de destino se não existir
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Criar write stream
    const dest = fs.createWriteStream(destPath);
    
    drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    )
    .then(res => {
      res.data
        .on('end', () => {
          console.log(`[WiltonOS] Arquivo baixado com sucesso: ${destPath}`);
          resolve(destPath);
        })
        .on('error', (err: any) => {
          console.error('[WiltonOS] Erro ao baixar arquivo:', err);
          reject(err);
        })
        .pipe(dest);
    })
    .catch(error => {
      console.error('[WiltonOS] Erro ao obter arquivo:', error);
      reject(error);
    });
  });
}

export async function processChatGPTFileFromDrive(fileId: string): Promise<string[]> {
  try {
    // Verificar se temos um token válido
    if (!loadSavedToken()) {
      throw new Error('Não autenticado no Google Drive');
    }
    
    console.log(`[WiltonOS] Iniciando processamento do arquivo ChatGPT ${fileId} do Google Drive...`);
    
    // Diretório temporário para downloads
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Download do arquivo
    const tempPath = path.join(tempDir, `chatgpt-export-${Date.now()}.zip`);
    await downloadFile(fileId, tempPath);
    
    // Extrair o arquivo ZIP
    const extractDir = path.join(tempDir, `chatgpt-export-${Date.now()}`);
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
    }
    
    // Usar child_process para extrair o arquivo ZIP
    const { exec } = require('child_process');
    const unzipCommand = `unzip -o "${tempPath}" -d "${extractDir}"`;
    
    return new Promise((resolve, reject) => {
      exec(unzipCommand, async (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`[WiltonOS] Erro ao extrair arquivo: ${error.message}`);
          reject(error);
          return;
        }
        
        console.log(`[WiltonOS] Arquivo extraído com sucesso em ${extractDir}`);
        
        try {
          // Processar o conteúdo extraído
          const processedIds = await processChatGPTExport(extractDir);
          console.log(`[WiltonOS] Processamento concluído! ${processedIds.length} conversas processadas.`);
          resolve(processedIds);
        } catch (err) {
          console.error('[WiltonOS] Erro ao processar conteúdo:', err);
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao processar arquivo do Google Drive:', error);
    throw error;
  }
}

// Configurar rotas Express
export function registerGoogleDriveRoutes(app: express.Express): void {
  console.log('[WiltonOS] Configurando rotas do Google Drive...');
  
  // Iniciar autenticação
  app.get('/api/drive/auth', (req, res) => {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  });
  
  // Callback de autenticação
  app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).send('Código de autorização não fornecido');
    }
    
    try {
      await getToken(code as string);
      res.redirect('/chatgpt-processor.html');
    } catch (error) {
      console.error('[WiltonOS] Erro ao obter token:', error);
      res.status(500).send('Erro ao obter token de acesso');
    }
  });
  
  // Processar arquivo ChatGPT do Google Drive
  app.post('/api/drive/process-chatgpt', async (req, res) => {
    const { fileId } = req.body;
    
    if (!fileId) {
      return res.status(400).json({ error: 'ID do arquivo é obrigatório' });
    }
    
    try {
      // Verificar autenticação
      if (!loadSavedToken()) {
        return res.status(401).json({
          error: 'Não autenticado no Google Drive',
          authUrl: getAuthUrl()
        });
      }
      
      // Retornar imediatamente para não bloquear
      res.json({
        success: true,
        message: 'Processamento iniciado em segundo plano',
        status: 'processing'
      });
      
      // Iniciar processamento em background
      processChatGPTFileFromDrive(fileId)
        .then(results => {
          console.log(`[WiltonOS] Processamento do arquivo ${fileId} concluído com sucesso! ${results.length} conversas processadas.`);
        })
        .catch(error => {
          console.error(`[WiltonOS] Erro ao processar arquivo ${fileId}:`, error);
        });
        
    } catch (error) {
      console.error('[WiltonOS] Erro ao processar arquivo:', error);
      // Já enviamos a resposta, apenas log do erro
    }
  });
  
  console.log('[WiltonOS] Rotas do Google Drive configuradas com sucesso!');
}