/**
 * WiltonOS - Processador de Arquivos ChatGPT
 * 
 * Este módulo é responsável por processar arquivos de exportação do ChatGPT
 * e extrair informações relevantes para o sistema de memória perpétua.
 */

import fs from 'fs/promises';
import path from 'path';
import { Memory } from './resilient-store';

// Processador de ChatGPT
class ChatGPTProcessor {
  /**
   * Processa um arquivo de exportação do ChatGPT
   * @param filePath Caminho do arquivo
   */
  async processChatGPTExport(filePath: string): Promise<Memory[]> {
    try {
      // Verificar se o arquivo existe
      await fs.access(filePath);
      
      // Ler o conteúdo do arquivo
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Processar o conteúdo
      const memories = this.parseContent(content, filePath);
      
      return memories;
    } catch (error) {
      console.error(`[WiltonOS] Erro ao processar arquivo ChatGPT (${filePath}):`, error);
      return [];
    }
  }
  
  /**
   * Parsear o conteúdo de um arquivo de exportação
   * @param content Conteúdo do arquivo
   * @param filePath Caminho do arquivo (para referência)
   */
  private parseContent(content: string, filePath: string): Memory[] {
    try {
      // Verificar formato do arquivo
      const format = this.detectFormat(content);
      
      // Processar de acordo com o formato
      switch (format) {
        case 'json':
          return this.parseJsonFormat(content, filePath);
        case 'markdown':
          return this.parseMarkdownFormat(content, filePath);
        case 'html':
          return this.parseHtmlFormat(content, filePath);
        default:
          return this.parseUnknownFormat(content, filePath);
      }
    } catch (error) {
      console.error(`[WiltonOS] Erro ao parsear conteúdo (${filePath}):`, error);
      return [];
    }
  }
  
  /**
   * Detectar formato do arquivo
   * @param content Conteúdo do arquivo
   */
  private detectFormat(content: string): 'json' | 'markdown' | 'html' | 'unknown' {
    // Verificações simples
    if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
      return 'json';
    }
    
    if (content.includes('<!DOCTYPE html>') || content.includes('<html')) {
      return 'html';
    }
    
    if (content.includes('# ') || content.includes('## ')) {
      return 'markdown';
    }
    
    return 'unknown';
  }
  
  /**
   * Parsear conteúdo em formato JSON
   * @param content Conteúdo do arquivo
   * @param filePath Caminho do arquivo
   */
  private parseJsonFormat(content: string, filePath: string): Memory[] {
    try {
      // Parsear o JSON
      const data = JSON.parse(content);
      const memories: Memory[] = [];
      
      // Extrair título do nome do arquivo
      const fileName = path.basename(filePath);
      const title = fileName.replace(/\.[^/.]+$/, ""); // Remover extensão
      
      // Criar memória principal
      const mainMemory: Memory = {
        id: this.generateId(),
        title: title,
        text: JSON.stringify(data),
        type: 'chatgpt_json',
        source: filePath,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['chatgpt', 'json', 'conversation']
      };
      
      memories.push(mainMemory);
      
      // Extrair conversas individuais (se existirem)
      if (data.conversations && Array.isArray(data.conversations)) {
        data.conversations.forEach((conversation: any, index: number) => {
          // Extrair título da conversa
          const conversationTitle = conversation.title || `Conversa ${index + 1}`;
          
          // Extrair texto da conversa
          let conversationText = '';
          
          if (conversation.messages && Array.isArray(conversation.messages)) {
            conversation.messages.forEach((message: any) => {
              const author = message.author?.role || 'unknown';
              const content = message.content?.parts?.join('\n') || '';
              
              conversationText += `${author}: ${content}\n\n`;
            });
          }
          
          // Criar memória para conversa individual
          const conversationMemory: Memory = {
            id: this.generateId(),
            title: conversationTitle,
            text: conversationText,
            type: 'chatgpt_conversation',
            source: `${filePath}#conversation-${index + 1}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tags: ['chatgpt', 'conversation']
          };
          
          memories.push(conversationMemory);
        });
      }
      
      return memories;
    } catch (error) {
      console.error(`[WiltonOS] Erro ao parsear JSON (${filePath}):`, error);
      return [];
    }
  }
  
  /**
   * Parsear conteúdo em formato Markdown
   * @param content Conteúdo do arquivo
   * @param filePath Caminho do arquivo
   */
  private parseMarkdownFormat(content: string, filePath: string): Memory[] {
    try {
      const memories: Memory[] = [];
      
      // Extrair título do nome do arquivo
      const fileName = path.basename(filePath);
      const title = fileName.replace(/\.[^/.]+$/, ""); // Remover extensão
      
      // Criar memória principal
      const mainMemory: Memory = {
        id: this.generateId(),
        title: title,
        text: content,
        type: 'chatgpt_markdown',
        source: filePath,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['chatgpt', 'markdown', 'conversation']
      };
      
      memories.push(mainMemory);
      
      // Dividir em seções baseadas em cabeçalhos h1 (# )
      const sections = content.split(/^# /m).filter(section => section.trim());
      
      sections.forEach((section, index) => {
        // Extrair título da seção
        const sectionTitle = section.split('\n')[0].trim() || `Seção ${index + 1}`;
        
        // Criar memória para seção individual
        const sectionMemory: Memory = {
          id: this.generateId(),
          title: sectionTitle,
          text: section,
          type: 'chatgpt_section',
          source: `${filePath}#section-${index + 1}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tags: ['chatgpt', 'section']
        };
        
        memories.push(sectionMemory);
      });
      
      return memories;
    } catch (error) {
      console.error(`[WiltonOS] Erro ao parsear Markdown (${filePath}):`, error);
      return [];
    }
  }
  
  /**
   * Parsear conteúdo em formato HTML
   * @param content Conteúdo do arquivo
   * @param filePath Caminho do arquivo
   */
  private parseHtmlFormat(content: string, filePath: string): Memory[] {
    try {
      const memories: Memory[] = [];
      
      // Extrair título do nome do arquivo
      const fileName = path.basename(filePath);
      const title = fileName.replace(/\.[^/.]+$/, ""); // Remover extensão
      
      // Extrair título do HTML (se existir)
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      const htmlTitle = titleMatch ? titleMatch[1].trim() : null;
      
      // Criar memória principal
      const mainMemory: Memory = {
        id: this.generateId(),
        title: htmlTitle || title,
        text: this.extractTextFromHtml(content),
        type: 'chatgpt_html',
        source: filePath,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['chatgpt', 'html', 'conversation']
      };
      
      memories.push(mainMemory);
      
      return memories;
    } catch (error) {
      console.error(`[WiltonOS] Erro ao parsear HTML (${filePath}):`, error);
      return [];
    }
  }
  
  /**
   * Parsear conteúdo em formato desconhecido
   * @param content Conteúdo do arquivo
   * @param filePath Caminho do arquivo
   */
  private parseUnknownFormat(content: string, filePath: string): Memory[] {
    try {
      // Extrair título do nome do arquivo
      const fileName = path.basename(filePath);
      const title = fileName.replace(/\.[^/.]+$/, ""); // Remover extensão
      
      // Criar memória principal
      const mainMemory: Memory = {
        id: this.generateId(),
        title: title,
        text: content,
        type: 'unknown',
        source: filePath,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['unknown']
      };
      
      return [mainMemory];
    } catch (error) {
      console.error(`[WiltonOS] Erro ao parsear formato desconhecido (${filePath}):`, error);
      return [];
    }
  }
  
  /**
   * Extrair texto de conteúdo HTML
   * @param html Conteúdo HTML
   */
  private extractTextFromHtml(html: string): string {
    // Remover tags HTML (implementação simples)
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Gerar ID único
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
  }
}

// Exportar instância única
export const chatgptProcessor = new ChatGPTProcessor();