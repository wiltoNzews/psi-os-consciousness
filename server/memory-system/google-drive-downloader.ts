import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { Readable } from 'stream';

const CLIENT_ID = '791041619730-dddc9nnp9q1omf3e8p22ku600vr27fjk.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://wiltonos.replit.app/oauth2callback';

// Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Create a Google Drive client
const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

// Function to download a file from Google Drive
export async function downloadFile(fileId: string, destinationPath: string): Promise<string> {
  console.log(`[WiltonOS] Iniciando download do arquivo ${fileId} do Google Drive...`);
  
  try {
    // Ensure the directory exists
    const dir = path.dirname(destinationPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Get file metadata to verify the file exists and get its name
    const fileMetadata = await drive.files.get({
      fileId,
      fields: 'name, mimeType, size',
    });
    
    console.log(`[WiltonOS] Metadata do arquivo: ${JSON.stringify(fileMetadata.data)}`);
    
    // Download the file
    const res = await drive.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );
    
    // Save the file to local filesystem
    const dest = fs.createWriteStream(destinationPath);
    return new Promise((resolve, reject) => {
      (res.data as Readable)
        .pipe(dest)
        .on('finish', () => {
          console.log(`[WiltonOS] Arquivo baixado com sucesso: ${destinationPath}`);
          resolve(destinationPath);
        })
        .on('error', (err) => {
          console.error('[WiltonOS] Erro ao baixar arquivo:', err);
          reject(err);
        });
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao baixar arquivo do Google Drive:', error);
    throw error;
  }
}

// Function to generate auth URL for user to authenticate
export function getAuthUrl(): string {
  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly'
  ];
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  });
}

// Function to set the auth token after user authenticates
export async function setToken(code: string): Promise<void> {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log('[WiltonOS] Token OAuth configurado com sucesso');
    
    // Save the token for future use
    fs.writeFileSync(
      path.join(__dirname, '../../.oauth-token.json'), 
      JSON.stringify(tokens)
    );
  } catch (error) {
    console.error('[WiltonOS] Erro ao obter token:', error);
    throw error;
  }
}

// Function to check if we have a saved token and set it
export function loadSavedToken(): boolean {
  try {
    const tokenPath = path.join(__dirname, '../../.oauth-token.json');
    if (fs.existsSync(tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      oauth2Client.setCredentials(tokens);
      console.log('[WiltonOS] Token OAuth carregado do arquivo salvo');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[WiltonOS] Erro ao carregar token salvo:', error);
    return false;
  }
}

// Function to download ChatGPT export and extract for processing
export async function downloadAndExtractChatGPTExport(fileId: string): Promise<string> {
  const downloadPath = path.join(__dirname, '../../temp/chatgpt-export.zip');
  const extractPath = path.join(__dirname, '../../temp/chatgpt-export');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, '../../temp'))) {
    fs.mkdirSync(path.join(__dirname, '../../temp'), { recursive: true });
  }
  
  // Create extract directory if it doesn't exist
  if (!fs.existsSync(extractPath)) {
    fs.mkdirSync(extractPath, { recursive: true });
  }
  
  try {
    // Download the file
    await downloadFile(fileId, downloadPath);
    
    console.log('[WiltonOS] Arquivo de exportação do ChatGPT baixado com sucesso');
    console.log('[WiltonOS] Iniciando extração do arquivo...');
    
    // Extract the zip file
    const extractCommand = `unzip -o ${downloadPath} -d ${extractPath}`;
    const { exec } = require('child_process');
    
    return new Promise((resolve, reject) => {
      exec(extractCommand, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`[WiltonOS] Erro ao extrair arquivo: ${error.message}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`[WiltonOS] Stderr: ${stderr}`);
        }
        console.log(`[WiltonOS] Arquivo extraído com sucesso: ${stdout}`);
        resolve(extractPath);
      });
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao processar arquivo de exportação do ChatGPT:', error);
    throw error;
  }
}