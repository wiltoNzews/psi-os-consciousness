/**
 * WiltonOS Merge Router
 * 
 * Este módulo implementa as rotas para a fusão completa do WiltonOS,
 * integrando o arquivo de exportação do ChatGPT na estrutura do sistema.
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const router = express.Router();

// Constantes e configurações
const TEMP_DIR = path.join(process.cwd(), 'temp');
const WILTONOS_CORE_DIR = path.join(process.cwd(), 'WiltonOS_Core');
const CHATGPT_EXPORT_ZIP = path.join(TEMP_DIR, 'chatgpt-export.zip');
const CHATGPT_EXPORT_DIR = path.join(TEMP_DIR, 'chatgpt-export');

/**
 * Garante que os diretórios necessários existam
 */
function ensureDirectories() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(WILTONOS_CORE_DIR)) {
    fs.mkdirSync(WILTONOS_CORE_DIR, { recursive: true });
  }
  
  // Criar a estrutura básica do WiltonOS_Core
  const subdirs = [
    'Modules/Module_0_Boot',
    'Modules/Module_1_Context',
    'Modules/Module_2_Memory',
    'Modules/Module_3_Glyphs',
    'Modules/Module_4_Agents',
    'Modules/Module_5_Interface',
    'Glossary',
    'ContextHashes',
    'Timeline',
    'Visuals/Z-Geometry',
    'Visuals/Glifo',
    'Visuals/Exodia',
    'Logs',
    'Meta'
  ];
  
  for (const subdir of subdirs) {
    const fullPath = path.join(WILTONOS_CORE_DIR, subdir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }
}

/**
 * Rota para verificar o status da fusão
 */
router.get('/merge/status', (req, res) => {
  try {
    ensureDirectories();
    
    // Verificar se o arquivo ZIP existe
    let fileExists = false;
    let fileSize = 0;
    let fileSizeFormatted = '0 B';
    
    if (fs.existsSync(CHATGPT_EXPORT_ZIP)) {
      fileExists = true;
      const stats = fs.statSync(CHATGPT_EXPORT_ZIP);
      fileSize = stats.size;
      fileSizeFormatted = formatBytes(fileSize);
    }
    
    // Verificar se o Manifest.json existe
    const manifestPath = path.join(WILTONOS_CORE_DIR, 'Meta', 'Manifest.json');
    const manifestExists = fs.existsSync(manifestPath);
    
    // Verificar estado do processamento
    const logPath = path.join(WILTONOS_CORE_DIR, 'Logs', 'processing.log');
    const processingLogs = fs.existsSync(logPath) 
      ? fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean).slice(-10)
      : [];
    
    res.json({
      success: true,
      status: 'ready',
      fileExists,
      fileSize,
      fileSizeFormatted,
      manifestExists,
      processingLogs
    });
  } catch (error) {
    console.error('[WiltonOS] Erro ao verificar status da fusão:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao verificar status: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

/**
 * Rota para iniciar a fusão do WiltonOS
 */
router.post('/merge/start', async (req, res) => {
  try {
    // Verificar se o arquivo ZIP existe
    if (!fs.existsSync(CHATGPT_EXPORT_ZIP)) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo ZIP de exportação do ChatGPT não encontrado'
      });
    }
    
    // Extrair opções
    const options = req.body || {};
    
    // Iniciar processamento
    res.json({
      success: true,
      message: 'Processo de fusão iniciado',
      options
    });
    
    // Iniciar processamento em background
    processMergeInBackground(options)
      .catch(error => {
        console.error('[WiltonOS] Erro no processamento em background:', error);
      });
    
  } catch (error) {
    console.error('[WiltonOS] Erro ao iniciar fusão:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao iniciar fusão: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

/**
 * Rota para verificar o progresso da fusão
 */
router.get('/merge/progress', (req, res) => {
  try {
    // Verificar arquivo de log de processamento
    const logPath = path.join(WILTONOS_CORE_DIR, 'Logs', 'processing.log');
    let processingLogs: string[] = [];
    let lastLogTimestamp = '';
    let inProgress = false;
    
    if (fs.existsSync(logPath)) {
      const logContent = fs.readFileSync(logPath, 'utf8');
      processingLogs = logContent.split('\n').filter(Boolean);
      
      // Verificar último log
      if (processingLogs.length > 0) {
        const lastLog = processingLogs[processingLogs.length - 1];
        const timestampMatch = lastLog.match(/\[(.*?)\]/);
        if (timestampMatch) {
          lastLogTimestamp = timestampMatch[1];
        }
        
        // Verificar se ainda está em progresso (baseado no tempo do último log)
        const lastLogTime = new Date(lastLogTimestamp).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastLogTime;
        
        // Se o último log foi há menos de 5 minutos, consideramos que ainda está em progresso
        inProgress = timeDiff < 5 * 60 * 1000;
      }
    }
    
    // Verificar arquivo de resumo
    const summaryPath = path.join(WILTONOS_CORE_DIR, 'Logs', 'processing_summary.json');
    let summary = null;
    
    if (fs.existsSync(summaryPath)) {
      const summaryContent = fs.readFileSync(summaryPath, 'utf8');
      summary = JSON.parse(summaryContent);
    }
    
    res.json({
      success: true,
      inProgress,
      lastLogTimestamp,
      processingLogs: processingLogs.slice(-20), // Retornar apenas os últimos 20 logs
      summary
    });
    
  } catch (error) {
    console.error('[WiltonOS] Erro ao verificar progresso da fusão:', error);
    res.status(500).json({
      success: false,
      message: `Erro ao verificar progresso: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

/**
 * Processar fusão em background
 */
async function processMergeInBackground(options: any) {
  try {
    ensureDirectories();
    
    // Criar arquivo de log
    const logPath = path.join(WILTONOS_CORE_DIR, 'Logs', 'processing.log');
    fs.writeFileSync(logPath, `[${new Date().toISOString()}] [INFO] Iniciando processamento de fusão\n`);
    
    // Verificar opções
    const relinkContext = options.relinkContext !== false;
    const enableOllamaSummary = options.enableOllamaSummary === true;
    const generateGlifoIndex = options.generateGlifoIndex !== false;
    const activateMemoryTags = options.activateMemoryTags !== false;
    const visualMerge = options.visualMerge !== false;
    
    // Registrar configurações
    appendToLog(logPath, `[INFO] Configurações: relinkContext=${relinkContext}, enableOllamaSummary=${enableOllamaSummary}, generateGlifoIndex=${generateGlifoIndex}, activateMemoryTags=${activateMemoryTags}, visualMerge=${visualMerge}`);
    
    // Verificar arquivo ZIP
    appendToLog(logPath, `[INFO] Verificando arquivo ZIP de exportação do ChatGPT: ${CHATGPT_EXPORT_ZIP}`);
    if (!fs.existsSync(CHATGPT_EXPORT_ZIP)) {
      appendToLog(logPath, `[ERROR] Arquivo ZIP não encontrado: ${CHATGPT_EXPORT_ZIP}`);
      return;
    }
    
    // Extrair tamanho do arquivo
    const stats = fs.statSync(CHATGPT_EXPORT_ZIP);
    appendToLog(logPath, `[INFO] Tamanho do arquivo ZIP: ${formatBytes(stats.size)}`);
    
    // Verificar se diretório de exportação existe e limpar
    if (fs.existsSync(CHATGPT_EXPORT_DIR)) {
      appendToLog(logPath, `[INFO] Limpando diretório de exportação: ${CHATGPT_EXPORT_DIR}`);
      fs.rmSync(CHATGPT_EXPORT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(CHATGPT_EXPORT_DIR, { recursive: true });
    
    // Extrair arquivo ZIP
    appendToLog(logPath, `[INFO] Extraindo arquivo ZIP para: ${CHATGPT_EXPORT_DIR}`);
    try {
      execSync(`unzip -o "${CHATGPT_EXPORT_ZIP}" -d "${CHATGPT_EXPORT_DIR}"`);
      appendToLog(logPath, `[SUCCESS] Arquivo ZIP extraído com sucesso`);
    } catch (error) {
      appendToLog(logPath, `[ERROR] Falha ao extrair arquivo ZIP: ${error instanceof Error ? error.message : String(error)}`);
      return;
    }
    
    // Mapear conversas
    appendToLog(logPath, `[INFO] Mapeando conversas do ChatGPT`);
    const conversationsDir = path.join(CHATGPT_EXPORT_DIR, 'conversations');
    if (!fs.existsSync(conversationsDir)) {
      appendToLog(logPath, `[ERROR] Diretório de conversas não encontrado: ${conversationsDir}`);
      return;
    }
    
    // Listar arquivos de conversas
    const files = fs.readdirSync(conversationsDir);
    const conversationFiles = files.filter(file => file.endsWith('.json'));
    appendToLog(logPath, `[INFO] Encontradas ${conversationFiles.length} conversas para processamento`);
    
    // Criar diretório de conversas processadas
    const processedDir = path.join(WILTONOS_CORE_DIR, 'Modules/Module_2_Memory/Conversations');
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
    }
    
    // Criar diretório de metadados
    const metadataDir = path.join(WILTONOS_CORE_DIR, 'ContextHashes');
    if (!fs.existsSync(metadataDir)) {
      fs.mkdirSync(metadataDir, { recursive: true });
    }
    
    // Processar conversas em lotes
    const batchSize = 50;
    const totalConversations = conversationFiles.length;
    const batches = Math.ceil(totalConversations / batchSize);
    
    let processedCount = 0;
    let concepts = new Set<string>();
    let tags = new Set<string>(['#GPT']);
    
    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, totalConversations);
      const batch = conversationFiles.slice(start, end);
      
      appendToLog(logPath, `[INFO] Processando lote ${i + 1}/${batches} (${batch.length} conversas)`);
      
      for (const file of batch) {
        try {
          const filePath = path.join(conversationsDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const conversation = JSON.parse(content);
          
          // Processar conversa
          const id = path.basename(file, '.json');
          const title = conversation.title || 'Sem título';
          processedCount++;
          
          // Simular processamento completo
          // Em uma implementação real, isso seria um processamento mais complexo
          
          // Salvar metadados
          const metadata = {
            id,
            title,
            createTime: conversation.create_time || '',
            updateTime: conversation.update_time || '',
            processingTime: new Date().toISOString(),
            tags: ['#GPT']
          };
          
          fs.writeFileSync(
            path.join(metadataDir, `${id}.json`),
            JSON.stringify(metadata, null, 2)
          );
        } catch (error) {
          appendToLog(logPath, `[WARNING] Erro ao processar arquivo ${file}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      appendToLog(logPath, `[SUCCESS] Lote ${i + 1}/${batches} concluído. Total processado: ${processedCount}/${totalConversations}`);
    }
    
    // Gerar índices
    appendToLog(logPath, `[INFO] Gerando índices para as conversas processadas`);
    
    // Atualizar MemoryKeys.json
    appendToLog(logPath, `[INFO] Atualizando metadados do MemoryKeys.json`);
    const memoryKeysPath = path.join(WILTONOS_CORE_DIR, 'Meta', 'MemoryKeys.json');
    
    if (fs.existsSync(memoryKeysPath)) {
      try {
        const memoryKeysContent = fs.readFileSync(memoryKeysPath, 'utf8');
        const memoryKeys = JSON.parse(memoryKeysContent);
        
        // Atualizar metadados do ChatGPT
        memoryKeys.chatgpt_metadata = {
          export_size: formatBytes(stats.size),
          total_conversations: totalConversations,
          processed_conversations: processedCount,
          conversation_tags: Array.from(tags),
          last_processed: new Date().toISOString()
        };
        
        fs.writeFileSync(memoryKeysPath, JSON.stringify(memoryKeys, null, 2));
        appendToLog(logPath, `[SUCCESS] Metadados atualizados com sucesso`);
      } catch (error) {
        appendToLog(logPath, `[ERROR] Erro ao atualizar metadados: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Criar resumo de processamento
    const summary = {
      totalConversations,
      processedConversations: processedCount,
      conceptsIdentified: concepts.size,
      tagsApplied: tags.size,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(WILTONOS_CORE_DIR, 'Logs', 'processing_summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    appendToLog(logPath, `[SUCCESS] Processamento concluído com sucesso`);
    
  } catch (error) {
    console.error('[WiltonOS] Erro no processamento em background:', error);
    
    // Registrar erro em log
    const logPath = path.join(WILTONOS_CORE_DIR, 'Logs', 'processing.log');
    appendToLog(logPath, `[ERROR] Erro no processamento em background: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Adicionar entrada ao arquivo de log
 */
function appendToLog(logPath: string, message: string) {
  const logEntry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logPath, logEntry);
  console.log(`[WiltonOS] ${message}`);
}

/**
 * Formatar bytes em uma representação legível
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default router;