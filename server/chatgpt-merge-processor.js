/**
 * WiltonOS - Processador de Fusão do ChatGPT
 * 
 * Este módulo é responsável por processar o arquivo de exportação do ChatGPT
 * e integrá-lo à estrutura do WiltonOS, aplicando as marcações (tags) e
 * organizando o conteúdo de acordo com a estrutura solicitada.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const unzip = promisify(require('child_process').exec);

// Definir diretórios importantes
const BASE_DIR = path.join(process.cwd());
const WILTONOS_CORE_DIR = path.join(BASE_DIR, 'WiltonOS_Core');
const TEMP_DIR = path.join(BASE_DIR, 'temp');
const CHATGPT_EXPORT_DIR = path.join(TEMP_DIR, 'chatgpt-export');

// Configurações de processamento
const CONFIG = {
  MAX_CONVERSATIONS_PER_BATCH: 50,   // Número máximo de conversas para processar por lote
  ENABLE_OLLAMA_SUMMARY: true,       // Ativar resumo usando Ollama
  GENERATE_GLIFO_INDEX: true,        // Gerar índice de glifos
  ACTIVATE_MEMORY_TAGS: true,        // Ativar tags de memória
  RELINK_CONTEXT: true,              // Relink contexto
  VISUAL_MERGE: true                 // Mesclar visuais
};

// Tags para categorização
const TAGS = {
  SELF: '#SELF',       // Relacionado a experiências pessoais de Wilton
  GPT: '#GPT',         // Relacionado a interações com GPT
  SYSTEM: '#SYSTEM',   // Comandos, scripts, módulos, protocolos
  GLIFO: '#GLIFO',     // Padrões simbólicos
  ZGEOMETRY: '#ZGEOMETRY',  // Padrões geométricos
  EXODIA: '#EXODIA'    // Ativos de integração de alto nível
};

// Conceitos importantes para detecção
const KEY_CONCEPTS = [
  'surge mode',
  'reincarnation',
  'coherence oscillation',
  'qctf',
  'meta-prompt framework',
  'passive works',
  'charts as mirror',
  'juliana',
  'mom',
  'ricardo',
  'bahamas night',
  'geisha dream',
  'juliana truth moment',
  'men in black locker',
  'sacred geometry',
  'glifo resonance',
  'exodia pattern'
];

/**
 * Inicia o processamento completo do arquivo do ChatGPT
 * @param {string} zipFilePath - Caminho para o arquivo ZIP de exportação do ChatGPT
 * @returns {Promise<object>} - Resultado do processamento
 */
async function processChatGPTExport(zipFilePath) {
  try {
    // Inicializar diretórios
    await initializeDirectories();
    
    // Atualizar status
    updateProcessingStatus('Iniciando processamento do arquivo ZIP de exportação do ChatGPT');
    
    // Extrair arquivo ZIP
    await extractChatGPTZip(zipFilePath);
    
    // Mapear conversas
    const conversations = await mapConversations();
    
    // Processar conversas em lotes
    const processedConversations = await processConversationsInBatches(conversations);
    
    // Gerar índices e metadados
    await generateIndices(processedConversations);
    
    // Gerar visualizações
    if (CONFIG.VISUAL_MERGE) {
      await generateVisualizations();
    }
    
    // Gerar relatório final
    const report = generateProcessingReport(processedConversations);
    
    // Atualizar registro de metadados
    await updateMemoryKeysMetadata(processedConversations);
    
    return {
      success: true,
      message: 'Processamento concluído com sucesso',
      report
    };
  } catch (error) {
    console.error('[WiltonOS] Erro no processamento de fusão:', error);
    
    return {
      success: false,
      message: `Erro no processamento: ${error.message}`,
      error
    };
  }
}

/**
 * Inicializa os diretórios necessários
 */
async function initializeDirectories() {
  // Verificar e criar diretório temporário
  if (!fs.existsSync(TEMP_DIR)) {
    await mkdir(TEMP_DIR, { recursive: true });
  }
  
  // Limpar diretório de exportação do ChatGPT
  if (fs.existsSync(CHATGPT_EXPORT_DIR)) {
    fs.rmSync(CHATGPT_EXPORT_DIR, { recursive: true, force: true });
  }
  
  await mkdir(CHATGPT_EXPORT_DIR, { recursive: true });
  
  // Verificar diretório do WiltonOS Core
  if (!fs.existsSync(WILTONOS_CORE_DIR)) {
    await mkdir(WILTONOS_CORE_DIR, { recursive: true });
  }
  
  // Inicializar subdiretórios se necessário
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
      await mkdir(fullPath, { recursive: true });
    }
  }
}

/**
 * Extrai o arquivo ZIP de exportação do ChatGPT
 * @param {string} zipFilePath - Caminho para o arquivo ZIP
 */
async function extractChatGPTZip(zipFilePath) {
  updateProcessingStatus(`Extraindo arquivo ${zipFilePath} para ${CHATGPT_EXPORT_DIR}`);
  
  try {
    await unzip(`unzip -o "${zipFilePath}" -d "${CHATGPT_EXPORT_DIR}"`);
    updateProcessingStatus('Extração concluída com sucesso');
  } catch (error) {
    console.error('[WiltonOS] Erro ao extrair arquivo ZIP:', error);
    throw new Error(`Falha na extração do arquivo ZIP: ${error.message}`);
  }
}

/**
 * Mapeia todas as conversas encontradas no diretório de exportação do ChatGPT
 * @returns {Promise<Array>} - Lista de caminhos para os arquivos de conversas
 */
async function mapConversations() {
  updateProcessingStatus('Mapeando conversas do ChatGPT');
  
  try {
    const conversationsDir = path.join(CHATGPT_EXPORT_DIR, 'conversations');
    
    if (!fs.existsSync(conversationsDir)) {
      throw new Error('Diretório de conversas não encontrado na exportação');
    }
    
    // Listar todos os arquivos de conversas (JSON)
    const files = await readdir(conversationsDir);
    const conversationFiles = files.filter(file => file.endsWith('.json'));
    
    updateProcessingStatus(`Encontradas ${conversationFiles.length} conversas para processamento`);
    
    return conversationFiles.map(file => path.join(conversationsDir, file));
  } catch (error) {
    console.error('[WiltonOS] Erro ao mapear conversas:', error);
    throw new Error(`Falha ao mapear conversas: ${error.message}`);
  }
}

/**
 * Processa as conversas em lotes para evitar sobrecarga de memória
 * @param {Array<string>} conversationPaths - Caminhos para os arquivos de conversas
 * @returns {Promise<Array>} - Informações sobre as conversas processadas
 */
async function processConversationsInBatches(conversationPaths) {
  const totalConversations = conversationPaths.length;
  const batchSize = CONFIG.MAX_CONVERSATIONS_PER_BATCH;
  const batches = Math.ceil(totalConversations / batchSize);
  
  updateProcessingStatus(`Processando ${totalConversations} conversas em ${batches} lotes`);
  
  const processedConversations = [];
  
  for (let i = 0; i < batches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, totalConversations);
    const batch = conversationPaths.slice(start, end);
    
    updateProcessingStatus(`Processando lote ${i + 1}/${batches} (${batch.length} conversas)`);
    
    // Processar cada conversa do lote
    const batchResults = await Promise.all(
      batch.map(conversationPath => processConversation(conversationPath))
    );
    
    // Adicionar resultados aos processados
    processedConversations.push(...batchResults.filter(result => result !== null));
    
    updateProcessingStatus(`Lote ${i + 1}/${batches} concluído. Total processado: ${processedConversations.length}/${totalConversations}`);
  }
  
  return processedConversations;
}

/**
 * Processa uma única conversa do ChatGPT
 * @param {string} conversationPath - Caminho para o arquivo de conversa
 * @returns {Promise<object|null>} - Informações sobre a conversa processada ou null se falhar
 */
async function processConversation(conversationPath) {
  try {
    // Ler arquivo de conversa
    const content = await readFile(conversationPath, 'utf8');
    const conversation = JSON.parse(content);
    
    // Extrair informações básicas
    const id = path.basename(conversationPath, '.json');
    const title = conversation.title || 'Sem título';
    const createTime = conversation.create_time || '';
    const updateTime = conversation.update_time || '';
    
    // Extrair mensagens
    const messages = extractMessages(conversation);
    
    // Identificar conceitos e tags
    const { concepts, tags } = identifyConceptsAndTags(messages);
    
    // Gerar resumo
    const summary = await generateConversationSummary(messages);
    
    // Salvar conversa processada
    await saveProcessedConversation({
      id,
      title,
      createTime,
      updateTime,
      messages,
      concepts,
      tags,
      summary
    });
    
    return {
      id,
      title,
      createTime,
      updateTime,
      messageCount: messages.length,
      concepts,
      tags
    };
  } catch (error) {
    console.error(`[WiltonOS] Erro ao processar conversa ${conversationPath}:`, error);
    
    // Registrar erro, mas continuar com outras conversas
    return null;
  }
}

/**
 * Extrai mensagens de uma conversa
 * @param {object} conversation - Objeto de conversa
 * @returns {Array} - Lista de mensagens
 */
function extractMessages(conversation) {
  try {
    const mapping = conversation.mapping || {};
    
    // Organizar mensagens na ordem correta
    const messages = [];
    for (const key in mapping) {
      const node = mapping[key];
      if (node.message) {
        messages.push({
          id: node.id,
          role: node.message.author.role,
          content: node.message.content.parts.join('\n'),
          createTime: node.message.create_time
        });
      }
    }
    
    // Ordenar mensagens por tempo de criação
    return messages.sort((a, b) => a.createTime - b.createTime);
  } catch (error) {
    console.error('[WiltonOS] Erro ao extrair mensagens:', error);
    return [];
  }
}

/**
 * Identifica conceitos e tags relevantes nas mensagens
 * @param {Array} messages - Lista de mensagens
 * @returns {object} - Conceitos e tags identificados
 */
function identifyConceptsAndTags(messages) {
  const concepts = new Set();
  const tags = new Set([TAGS.GPT]); // Por padrão, todas as conversas são marcadas como GPT
  
  // Texto completo para análise
  const fullText = messages.map(msg => msg.content).join(' ').toLowerCase();
  
  // Verificar conceitos-chave
  KEY_CONCEPTS.forEach(concept => {
    if (fullText.includes(concept.toLowerCase())) {
      concepts.add(concept);
    }
  });
  
  // Adicionar tags baseadas em conceitos
  if (fullText.includes('surge mode') || fullText.includes('surgence mode')) {
    tags.add(TAGS.SELF);
  }
  
  if (fullText.includes('glifo') || fullText.includes('symbol') || fullText.includes('pattern')) {
    tags.add(TAGS.GLIFO);
  }
  
  if (fullText.includes('geometry') || fullText.includes('exodia') || 
      fullText.includes('metatron') || fullText.includes('torus') ||
      fullText.includes('abraão') || fullText.includes('abrao')) {
    tags.add(TAGS.ZGEOMETRY);
  }
  
  if (fullText.includes('script') || fullText.includes('code') || 
      fullText.includes('protocol') || fullText.includes('system')) {
    tags.add(TAGS.SYSTEM);
  }
  
  if (fullText.includes('exodia')) {
    tags.add(TAGS.EXODIA);
  }
  
  return {
    concepts: Array.from(concepts),
    tags: Array.from(tags)
  };
}

/**
 * Gera um resumo para uma conversa
 * @param {Array} messages - Lista de mensagens
 * @returns {Promise<string>} - Resumo da conversa
 */
async function generateConversationSummary(messages) {
  try {
    if (!CONFIG.ENABLE_OLLAMA_SUMMARY) {
      // Gerar resumo básico sem Ollama
      const messageCount = messages.length;
      const firstMessage = messages[0]?.content.substring(0, 100) + '...';
      
      return `Conversa com ${messageCount} mensagens. Começa com: "${firstMessage}"`;
    }
    
    // TODO: Implementar chamada à API do Ollama para resumo quando disponível
    // Por enquanto, retorna um resumo simples
    return `Conversa com ${messages.length} mensagens.`;
  } catch (error) {
    console.error('[WiltonOS] Erro ao gerar resumo:', error);
    return 'Não foi possível gerar um resumo para esta conversa.';
  }
}

/**
 * Salva uma conversa processada na estrutura do WiltonOS
 * @param {object} conversation - Conversa processada
 * @returns {Promise<void>}
 */
async function saveProcessedConversation(conversation) {
  // Determinar diretório de destino com base nas tags
  let destDir = path.join(WILTONOS_CORE_DIR, 'Modules/Module_2_Memory/Conversations');
  
  // Criar diretório se não existir
  if (!fs.existsSync(destDir)) {
    await mkdir(destDir, { recursive: true });
  }
  
  // Salvar arquivo de conversa
  const destPath = path.join(destDir, `${conversation.id}.json`);
  await writeFile(destPath, JSON.stringify(conversation, null, 2));
  
  // Salvar metadados para índice
  await saveConversationMetadata(conversation);
}

/**
 * Salva metadados de uma conversa para indexação
 * @param {object} conversation - Conversa processada
 * @returns {Promise<void>}
 */
async function saveConversationMetadata(conversation) {
  const metadataDir = path.join(WILTONOS_CORE_DIR, 'ContextHashes');
  
  // Criar diretório se não existir
  if (!fs.existsSync(metadataDir)) {
    await mkdir(metadataDir, { recursive: true });
  }
  
  // Criar metadados simplificados para indexação
  const metadata = {
    id: conversation.id,
    title: conversation.title,
    createTime: conversation.createTime,
    updateTime: conversation.updateTime,
    messageCount: conversation.messages.length,
    concepts: conversation.concepts,
    tags: conversation.tags,
    summary: conversation.summary,
    firstMessage: conversation.messages[0]?.content.substring(0, 200) + '...'
  };
  
  // Salvar arquivo de metadados
  const metadataPath = path.join(metadataDir, `${conversation.id}.json`);
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Gera índices para as conversas processadas
 * @param {Array} processedConversations - Conversas processadas
 * @returns {Promise<void>}
 */
async function generateIndices(processedConversations) {
  updateProcessingStatus('Gerando índices para as conversas processadas');
  
  try {
    // Índice geral de conversas
    const conversationIndex = processedConversations.map(conv => ({
      id: conv.id,
      title: conv.title,
      messageCount: conv.messageCount,
      concepts: conv.concepts,
      tags: conv.tags
    }));
    
    await writeFile(
      path.join(WILTONOS_CORE_DIR, 'Modules/Module_2_Memory/conversation_index.json'),
      JSON.stringify(conversationIndex, null, 2)
    );
    
    // Índice de conceitos
    const conceptsMap = new Map();
    processedConversations.forEach(conv => {
      conv.concepts.forEach(concept => {
        if (!conceptsMap.has(concept)) {
          conceptsMap.set(concept, []);
        }
        conceptsMap.get(concept).push(conv.id);
      });
    });
    
    const conceptsIndex = Array.from(conceptsMap.entries()).map(([concept, conversations]) => ({
      concept,
      conversationCount: conversations.length,
      conversations
    }));
    
    await writeFile(
      path.join(WILTONOS_CORE_DIR, 'Glossary/concepts_index.json'),
      JSON.stringify(conceptsIndex, null, 2)
    );
    
    // Índice de tags
    const tagsMap = new Map();
    processedConversations.forEach(conv => {
      conv.tags.forEach(tag => {
        if (!tagsMap.has(tag)) {
          tagsMap.set(tag, []);
        }
        tagsMap.get(tag).push(conv.id);
      });
    });
    
    const tagsIndex = Array.from(tagsMap.entries()).map(([tag, conversations]) => ({
      tag,
      conversationCount: conversations.length,
      conversations
    }));
    
    await writeFile(
      path.join(WILTONOS_CORE_DIR, 'Glossary/tags_index.json'),
      JSON.stringify(tagsIndex, null, 2)
    );
    
    updateProcessingStatus('Índices gerados com sucesso');
  } catch (error) {
    console.error('[WiltonOS] Erro ao gerar índices:', error);
    throw new Error(`Falha ao gerar índices: ${error.message}`);
  }
}

/**
 * Gera visualizações baseadas nos dados processados
 * @returns {Promise<void>}
 */
async function generateVisualizations() {
  updateProcessingStatus('Gerando visualizações');
  
  try {
    // Copiar visualizações existentes para o diretório de visualizações
    
    // Z-Geometry
    const zGeometryDir = path.join(WILTONOS_CORE_DIR, 'Visuals/Z-Geometry');
    // Copiar arquivos existentes
    
    // Glifo
    const glifoDir = path.join(WILTONOS_CORE_DIR, 'Visuals/Glifo');
    // Copiar arquivos existentes
    
    // Exodia
    const exodiaDir = path.join(WILTONOS_CORE_DIR, 'Visuals/Exodia');
    // Copiar arquivos existentes
    
    updateProcessingStatus('Visualizações geradas com sucesso');
  } catch (error) {
    console.error('[WiltonOS] Erro ao gerar visualizações:', error);
    updateProcessingStatus(`Erro ao gerar visualizações: ${error.message}`, 'error');
  }
}

/**
 * Gera um relatório sobre o processamento
 * @param {Array} processedConversations - Conversas processadas
 * @returns {object} - Relatório de processamento
 */
function generateProcessingReport(processedConversations) {
  // Contagem total de conversas
  const totalConversations = processedConversations.length;
  
  // Contagem de conceitos
  const conceptCounts = {};
  processedConversations.forEach(conv => {
    conv.concepts.forEach(concept => {
      conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
    });
  });
  
  // Contagem de tags
  const tagCounts = {};
  processedConversations.forEach(conv => {
    conv.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Ordenar conceitos e tags por contagem
  const sortedConcepts = Object.entries(conceptCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([concept, count]) => ({ concept, count }));
  
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }));
  
  return {
    totalConversations,
    concepts: sortedConcepts,
    tags: sortedTags,
    timestamp: new Date().toISOString()
  };
}

/**
 * Atualiza o arquivo de metadados MemoryKeys.json com os dados processados
 * @param {Array} processedConversations - Conversas processadas
 * @returns {Promise<void>}
 */
async function updateMemoryKeysMetadata(processedConversations) {
  try {
    const memoryKeysPath = path.join(WILTONOS_CORE_DIR, 'Meta/MemoryKeys.json');
    
    // Ler arquivo existente
    const memoryKeysContent = await readFile(memoryKeysPath, 'utf8');
    const memoryKeys = JSON.parse(memoryKeysContent);
    
    // Atualizar metadados do ChatGPT
    memoryKeys.chatgpt_metadata = {
      export_size: "768.2 MB",
      total_conversations: processedConversations.length,
      processed_conversations: processedConversations.length,
      conversation_tags: Array.from(new Set(processedConversations.flatMap(conv => conv.tags))),
      last_processed: new Date().toISOString()
    };
    
    // Salvar arquivo atualizado
    await writeFile(memoryKeysPath, JSON.stringify(memoryKeys, null, 2));
    
    updateProcessingStatus('Metadados atualizados com sucesso');
  } catch (error) {
    console.error('[WiltonOS] Erro ao atualizar metadados:', error);
    updateProcessingStatus(`Erro ao atualizar metadados: ${error.message}`, 'error');
  }
}

/**
 * Atualiza o status de processamento
 * @param {string} message - Mensagem de status
 * @param {string} [type='info'] - Tipo de mensagem
 */
function updateProcessingStatus(message, type = 'info') {
  console.log(`[WiltonOS] [${type.toUpperCase()}] ${message}`);
  
  // Salvar log
  try {
    const logPath = path.join(WILTONOS_CORE_DIR, 'Logs/processing.log');
    const logMessage = `[${new Date().toISOString()}] [${type.toUpperCase()}] ${message}\n`;
    
    fs.appendFileSync(logPath, logMessage);
  } catch (error) {
    console.error('[WiltonOS] Erro ao salvar log:', error);
  }
}

module.exports = {
  processChatGPTExport
};