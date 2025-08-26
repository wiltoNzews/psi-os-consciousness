const fs = require('fs');
const { google } = require('googleapis');

// Configurar cliente OAuth2 com as credenciais fornecidas
const oauth2Client = new google.auth.OAuth2(
  '791041619730-dddc9nnp9q1omf3e8p22ku600vr27fjk.apps.googleusercontent.com',
  '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',
  'http://localhost:5000/oauth2callback'
);

// Configurar credenciais - usar o token do arquivo JSON
const clientSecret = JSON.parse(fs.readFileSync('./attached_assets/client_secret_791041619730-dddc9nnp9q1omf3e8p22ku600vr27fjk.apps.googleusercontent.com.json', 'utf8'));

// ID do arquivo no Google Drive
const fileId = '1ndQzZJCwcoLbmPQMr9rsYO5SR2ImluVT';
const destPath = './chatgpt-export.zip';

// Criar um cliente do Google Drive
const drive = google.drive({ version: 'v3', auth: oauth2Client });

console.log('Iniciando download do arquivo de exportação do ChatGPT...');

// Baixar o arquivo
const destStream = fs.createWriteStream(destPath);

drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })
  .then(res => {
    return new Promise((resolve, reject) => {
      console.log('Download em andamento...');
      
      let progress = 0;
      
      res.data
        .on('data', chunk => {
          progress += chunk.length;
          if (progress % 10000000 === 0) { // Log a cada ~10MB
            console.log(`Baixados ${Math.round(progress / 1000000)} MB`);
          }
        })
        .on('end', () => {
          console.log('Download concluído!');
          resolve();
        })
        .on('error', err => {
          console.error('Erro durante o download:', err);
          reject(err);
        })
        .pipe(destStream);
    });
  })
  .then(() => {
    console.log(`Arquivo salvo em ${destPath}`);
    console.log('Extraindo arquivo...');
    
    // Aqui adicionaríamos o código para extrair o arquivo ZIP
    // e processar o conteúdo, mas faremos isso manualmente para maior visibilidade
  })
  .catch(err => {
    console.error('Erro:', err);
  });