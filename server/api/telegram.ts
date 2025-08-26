/**
 * API Telegram - Integração para notícias, criptomoedas e rede de segurança
 * 
 * Este módulo gerencia conexões com a API do Telegram para receber mensagens,
 * monitorar grupos de notícias e criptomoedas, e servir como rede de segurança.
 */

import express, { Request, Response } from 'express';
import axios from 'axios';

// Definição de tipos
interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  photo?: TelegramPhotoSize[];
  caption?: string;
  document?: TelegramDocument;
}

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramChat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

interface TelegramDocument {
  file_id: string;
  file_unique_id: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  edited_channel_post?: TelegramMessage;
}

interface StoredMessage {
  id: number;
  chatId: number;
  chatTitle: string;
  chatType: string;
  senderId: number;
  senderName: string;
  text: string;
  date: number;
  mediaType?: string;
  mediaUrl?: string;
  isNews?: boolean;
  isCrypto?: boolean;
}

// Router do Express
const router = express.Router();

// Configuração do Bot
const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Verificar se o token está definido
if (!TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN não está definido. A API do Telegram não funcionará corretamente.');
}

// Armazenamento em memória para mensagens recebidas (temporário até implementar banco de dados)
const messages: StoredMessage[] = [];

// Armazenamento de estado para webhooks
let webhookActive = false;
let latestUpdateId = 0;

// Tags para classificação de mensagens
const NEWS_KEYWORDS = ['notícia', 'noticia', 'news', 'headline', 'breaking', 'última hora', 'jornal', 'comunicado'];
const CRYPTO_KEYWORDS = ['bitcoin', 'ethereum', 'btc', 'eth', 'cripto', 'crypto', 'blockchain', 'token', 'nft', 'defi', 'web3'];

// Utilitários
function isNewsMessage(text: string): boolean {
  const lowerText = text.toLowerCase();
  return NEWS_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function isCryptoMessage(text: string): boolean {
  const lowerText = text.toLowerCase();
  return CRYPTO_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Função para enviar mensagens via API Telegram
async function sendTelegramMessage(chatId: number, text: string): Promise<any> {
  try {
    const response = await axios.post(`${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem para o Telegram:', error);
    throw error;
  }
}

// Função para obter atualizações do Telegram via polling
async function getUpdates(): Promise<TelegramUpdate[]> {
  try {
    const response = await axios.get(
      `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${latestUpdateId + 1}`
    );
    
    // Atualizar o últimoID para evitar receber as mesmas atualizações novamente
    const updates = response.data.result;
    if (updates.length > 0) {
      latestUpdateId = updates[updates.length - 1].update_id;
      
      // Processar atualizações
      processUpdates(updates);
    }
    
    return updates;
  } catch (error) {
    console.error('Erro ao obter atualizações do Telegram:', error);
    throw error;
  }
}

// Função para processar atualizações
function processUpdates(updates: TelegramUpdate[]): void {
  updates.forEach(update => {
    const message = update.message || update.channel_post;
    if (message && message.text) {
      // Armazenar a mensagem
      storeMessage(message);
    }
  });
}

// Função para armazenar mensagens
function storeMessage(telegramMessage: TelegramMessage): StoredMessage {
  const text = telegramMessage.text || telegramMessage.caption || '';
  const isNews = isNewsMessage(text);
  const isCrypto = isCryptoMessage(text);
  
  // Determinar tipo de mídia
  let mediaType, mediaUrl;
  if (telegramMessage.photo && telegramMessage.photo.length > 0) {
    mediaType = 'photo';
    const largestPhoto = telegramMessage.photo.reduce((prev, current) => 
      (prev.file_size || 0) > (current.file_size || 0) ? prev : current
    );
    mediaUrl = `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getFile?file_id=${largestPhoto.file_id}`;
  } else if (telegramMessage.document) {
    mediaType = telegramMessage.document.mime_type || 'document';
    mediaUrl = `${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getFile?file_id=${telegramMessage.document.file_id}`;
  }
  
  // Criar objeto de mensagem
  const message: StoredMessage = {
    id: telegramMessage.message_id,
    chatId: telegramMessage.chat.id,
    chatTitle: telegramMessage.chat.title || `${telegramMessage.chat.first_name || ''} ${telegramMessage.chat.last_name || ''}`.trim(),
    chatType: telegramMessage.chat.type,
    senderId: telegramMessage.from.id,
    senderName: telegramMessage.from.username || `${telegramMessage.from.first_name || ''} ${telegramMessage.from.last_name || ''}`.trim(),
    text,
    date: telegramMessage.date,
    mediaType,
    mediaUrl,
    isNews,
    isCrypto
  };
  
  // Adicionar ao armazenamento em memória
  messages.push(message);
  
  console.log(`[Telegram] Nova mensagem armazenada: ID ${message.id}, Chat: ${message.chatTitle}, Tipo: ${isNews ? 'Notícia' : isCrypto ? 'Cripto' : 'Normal'}`);
  
  return message;
}

// Rotas da API

// Status do bot
router.get('/status', async (req: Request, res: Response) => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return res.json({
        status: 'error',
        message: 'TELEGRAM_BOT_TOKEN não configurado'
      });
    }
    
    // Verificar status do bot
    const response = await axios.get(`${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getMe`);
    
    res.json({
      status: 'success',
      botInfo: response.data.result,
      webhookActive,
      messagesStored: messages.length
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro ao verificar status do bot:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao verificar status do bot',
      error: errorMessage
    });
  }
});

// Obter mensagens armazenadas
router.get('/messages', (req: Request, res: Response) => {
  const { type } = req.query;
  
  let filteredMessages = [...messages];
  
  // Filtrar por tipo
  if (type === 'news') {
    filteredMessages = filteredMessages.filter(msg => msg.isNews);
  } else if (type === 'crypto') {
    filteredMessages = filteredMessages.filter(msg => msg.isCrypto);
  }
  
  // Ordenar por data, mais recentes primeiro
  filteredMessages.sort((a, b) => b.date - a.date);
  
  res.json({
    status: 'success',
    messages: filteredMessages
  });
});

// Iniciar polling de atualizações
router.post('/start-polling', async (req: Request, res: Response) => {
  try {
    // Primeiro verifica se há um webhook ativo
    const webhookInfoResponse = await axios.get(`${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
    const webhookInfo = webhookInfoResponse.data.result;
    
    if (webhookInfo.url) {
      // Remover webhook existente
      await axios.post(`${TELEGRAM_API_BASE}${TELEGRAM_BOT_TOKEN}/deleteWebhook`);
    }
    
    // Iniciar polling
    const updates = await getUpdates();
    
    // Configurar polling contínuo (a cada 30 segundos)
    const intervalId = setInterval(async () => {
      try {
        await getUpdates();
      } catch (error: unknown) {
        console.error('Erro no polling automático:', error);
      }
    }, 30000);
    
    // Armazenar intervalId para parar o polling posteriormente
    global.telegramPollingInterval = intervalId;
    
    res.json({
      status: 'success',
      message: 'Polling iniciado com sucesso',
      initialUpdates: updates.length
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro ao iniciar polling:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao iniciar polling',
      error: errorMessage
    });
  }
});

// Parar polling de atualizações
router.post('/stop-polling', (req: Request, res: Response) => {
  if (global.telegramPollingInterval) {
    clearInterval(global.telegramPollingInterval);
    global.telegramPollingInterval = null;
    
    res.json({
      status: 'success',
      message: 'Polling parado com sucesso'
    });
  } else {
    res.status(400).json({
      status: 'error',
      message: 'Nenhum polling ativo para parar'
    });
  }
});

// Enviar mensagem
router.post('/send-message', async (req: Request, res: Response) => {
  const { chatId, text } = req.body;
  
  if (!chatId || !text) {
    return res.status(400).json({
      status: 'error',
      message: 'chatId e text são obrigatórios'
    });
  }
  
  try {
    const result = await sendTelegramMessage(chatId, text);
    
    res.json({
      status: 'success',
      message: 'Mensagem enviada com sucesso',
      result
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao enviar mensagem',
      error: errorMessage
    });
  }
});

// Webhook para receber atualizações do Telegram
router.post('/webhook', (req: Request, res: Response) => {
  try {
    const update: TelegramUpdate = req.body;
    
    // Processar a atualização
    if (update.message || update.channel_post) {
      const message = update.message || update.channel_post;
      if (message) {
        storeMessage(message);
      }
    }
    
    res.sendStatus(200);
  } catch (error: unknown) {
    console.error('Erro ao processar webhook:', error);
    res.sendStatus(500);
  }
});

// Interface para estatísticas do chat
interface ChatStats {
  chatId: number;
  chatTitle: string;
  chatType: string;
  totalMessages: number;
  newsMessages: number;
  cryptoMessages: number;
}

// Obter estatísticas
router.get('/stats', (req: Request, res: Response) => {
  try {
    const totalMessages = messages.length;
    const newsMessages = messages.filter(msg => msg.isNews).length;
    const cryptoMessages = messages.filter(msg => msg.isCrypto).length;
    const regularMessages = totalMessages - newsMessages - cryptoMessages;
    
    // Chats únicos
    const uniqueChats = new Set(messages.map(msg => msg.chatId)).size;
    
    // Estatísticas por chat
    const chatStats: Record<number, ChatStats> = {};
    messages.forEach(msg => {
      if (!chatStats[msg.chatId]) {
        chatStats[msg.chatId] = {
          chatId: msg.chatId,
          chatTitle: msg.chatTitle,
          chatType: msg.chatType,
          totalMessages: 0,
          newsMessages: 0,
          cryptoMessages: 0
        };
      }
      
      chatStats[msg.chatId].totalMessages++;
      if (msg.isNews) chatStats[msg.chatId].newsMessages++;
      if (msg.isCrypto) chatStats[msg.chatId].cryptoMessages++;
    });
    
    res.json({
      status: 'success',
      stats: {
        totalMessages,
        newsMessages,
        cryptoMessages,
        regularMessages,
        uniqueChats,
        chatStats: Object.values(chatStats)
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao obter estatísticas',
      error: errorMessage
    });
  }
});

// Exportar o router
export default router;