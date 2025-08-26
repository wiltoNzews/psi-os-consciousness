/**
 * Rotas para a fusão completa do WiltonOS com os dados do ChatGPT
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { processChatGPTExport } = require('../chatgpt-merge-processor');

// Diretório para arquivos temporários
const TEMP_DIR = path.join(process.cwd(), 'temp');
const CHATGPT_ZIP_PATH = path.join(TEMP_DIR, 'chatgpt-export.zip');

// Endpoint para verificar o status do arquivo do ChatGPT
router.get('/merge/status', (req, res) => {
  try {
    let fileExists = false;
    let fileSize = 0;
    
    if (fs.existsSync(CHATGPT_ZIP_PATH)) {
      fileExists = true;
      const stats = fs.statSync(CHATGPT_ZIP_PATH);
      fileSize = stats.size;
    }
    
    // Verificar se a estrutura de diretórios do WiltonOS_Core existe
    const wiltonOSCoreExists = fs.existsSync(path.join(process.cwd(), 'WiltonOS_Core'));
    
    res.json({
      success: true,
      fileExists,
      fileSize,
      fileSizeFormatted: formatBytes(fileSize),
      wiltonOSCoreExists
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao verificar status: ${error.message}`
    });
  }
});

// Endpoint para iniciar o processo de fusão
router.post('/merge/start', async (req, res) => {
  try {
    // Verificar se o arquivo do ChatGPT existe
    if (!fs.existsSync(CHATGPT_ZIP_PATH)) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo ZIP de exportação do ChatGPT não encontrado'
      });
    }
    
    // Opções de processamento
    const options = req.body.options || {};
    
    // Iniciar processamento
    const result = await processChatGPTExport(CHATGPT_ZIP_PATH);
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao iniciar fusão:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao iniciar fusão: ${error.message}`
    });
  }
});

// Endpoint para obter o status do processamento
router.get('/merge/progress', (req, res) => {
  try {
    // Na implementação atual, este endpoint é apenas um placeholder
    // pois o processamento é simulado no frontend.
    // Em uma implementação real, seria necessário manter um registro
    // do progresso do processamento.
    
    res.json({
      success: true,
      inProgress: false,
      progress: 0,
      message: 'Aguardando início do processamento'
    });
  } catch (error) {
    console.error('Erro ao verificar progresso:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao verificar progresso: ${error.message}`
    });
  }
});

// Endpoint para obter o resumo do processamento
router.get('/merge/summary', (req, res) => {
  try {
    // Verificar se existe um arquivo de resumo
    const summaryPath = path.join(process.cwd(), 'WiltonOS_Core/Logs/processing_summary.json');
    
    if (!fs.existsSync(summaryPath)) {
      return res.status(404).json({
        success: false,
        message: 'Resumo não encontrado'
      });
    }
    
    // Ler arquivo de resumo
    const summaryContent = fs.readFileSync(summaryPath, 'utf8');
    const summary = JSON.parse(summaryContent);
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Erro ao obter resumo:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao obter resumo: ${error.message}`
    });
  }
});

// Função auxiliar para formatar tamanho de arquivo
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = router;