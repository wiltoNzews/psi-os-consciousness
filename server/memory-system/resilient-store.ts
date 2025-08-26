/**
 * WiltonOS - Sistema de Armazenamento Resiliente
 * 
 * Este módulo implementa um sistema resiliente para armazenamento e recuperação
 * de dados da memória perpétua, com fallback para armazenamento em arquivo
 * quando o banco de dados não está disponível.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { memoryStore } from './memory-store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.join(__dirname, '..', '..', 'memory');

// Tipo para representar uma memória
export interface Memory {
  id: string;
  title: string;
  text: string;
  type: string;
  source: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  coherenceScore?: number;
  vector?: number[];
  [key: string]: any;
}

// Classe para armazenamento resiliente
class ResilientStore {
  private initialized: boolean = false;
  
  constructor() {
    this.init();
  }
  
  async init() {
    try {
      // Garantir que o diretório de armazenamento existe
      await this.ensureStorageDir();
      
      // Inicializar o armazenamento primário
      await this.initializeStorage();
      
      console.log('[WiltonOS] Sistema de armazenamento resiliente inicializado');
      this.initialized = true;
    } catch (error) {
      console.error('[WiltonOS] Erro ao inicializar armazenamento resiliente:', error);
      console.log('[WiltonOS] Funcionando em modo de fallback (arquivo)');
    }
  }
  
  private async ensureStorageDir() {
    try {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
    } catch (error) {
      console.error('[WiltonOS] Erro ao criar diretório de armazenamento:', error);
      throw error;
    }
  }
  
  private async initializeStorage() {
    try {
      // Em uma implementação real, inicializaríamos conexão com banco de dados aqui
      // Por enquanto, apenas verificamos se é possível escrever/ler do sistema de arquivos
      const testFile = path.join(STORAGE_DIR, '.test');
      await fs.writeFile(testFile, 'test');
      await fs.unlink(testFile);
    } catch (error) {
      console.warn('[WiltonOS] Sistema em modo resiliente:', error.message);
      // Não lançar erro - continuar operação
    }
  }
  
  // Salvar memória
  async saveMemory(memory: Memory): Promise<Memory> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      
      try {
        // Tentar salvar no armazenamento primário
        // Em uma implementação real, utilizaríamos memoryStore.saveMemory aqui
        const savedMemory = memory;
        
        // Em caso de sucesso, retornar a memória salva
        return savedMemory;
      } catch (error) {
        console.warn('[WiltonOS] Falha ao salvar no armazenamento primário, utilizando fallback:', error);
        
        // Fallback: salvar em arquivo
        return await this.saveMemoryToFile(memory);
      }
    } catch (error) {
      console.error('[WiltonOS] Erro ao salvar memória:', error);
      throw error;
    }
  }
  
  // Buscar memória por ID
  async getMemoryById(id: string): Promise<Memory | null> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      
      try {
        // Tentar buscar do armazenamento primário
        // Em uma implementação real, utilizaríamos memoryStore.getMemoryById aqui
        const memory = null; // memoryStore.getMemoryById(id);
        
        if (memory) {
          return memory;
        }
        
        // Se não encontrar, tentar do armazenamento secundário
        return await this.getMemoryFromFile(id);
      } catch (error) {
        console.warn('[WiltonOS] Falha ao buscar do armazenamento primário, utilizando fallback:', error);
        
        // Fallback: buscar de arquivo
        return await this.getMemoryFromFile(id);
      }
    } catch (error) {
      console.error('[WiltonOS] Erro ao buscar memória:', error);
      return null;
    }
  }
  
  // Atualizar memória
  async updateMemory(memory: Memory): Promise<Memory> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      
      try {
        // Tentar atualizar no armazenamento primário
        // Em uma implementação real, utilizaríamos memoryStore.updateMemory aqui
        const updatedMemory = memory;
        
        // Em caso de sucesso, retornar a memória atualizada
        return updatedMemory;
      } catch (error) {
        console.warn('[WiltonOS] Falha ao atualizar no armazenamento primário, utilizando fallback:', error);
        
        // Fallback: atualizar em arquivo
        return await this.updateMemoryInFile(memory);
      }
    } catch (error) {
      console.error('[WiltonOS] Erro ao atualizar memória:', error);
      throw error;
    }
  }
  
  // Excluir memória
  async deleteMemory(id: string): Promise<boolean> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      
      try {
        // Tentar excluir do armazenamento primário
        // Em uma implementação real, utilizaríamos memoryStore.deleteMemory aqui
        const deleted = true; // memoryStore.deleteMemory(id);
        
        // Se excluído com sucesso, também excluir do armazenamento secundário
        if (deleted) {
          await this.deleteMemoryFromFile(id);
          return true;
        }
        
        // Se não conseguir excluir do primário, tentar do secundário
        return await this.deleteMemoryFromFile(id);
      } catch (error) {
        console.warn('[WiltonOS] Falha ao excluir do armazenamento primário, utilizando fallback:', error);
        
        // Fallback: excluir de arquivo
        return await this.deleteMemoryFromFile(id);
      }
    } catch (error) {
      console.error('[WiltonOS] Erro ao excluir memória:', error);
      return false;
    }
  }
  
  // Buscar todas as memórias
  async getAllMemories(): Promise<Memory[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      
      try {
        // Tentar buscar do armazenamento primário
        // Em uma implementação real, utilizaríamos memoryStore.getAllMemories aqui
        const memories: Memory[] = []; // memoryStore.getAllMemories();
        
        if (memories && memories.length > 0) {
          return memories;
        }
        
        // Se não encontrar, tentar do armazenamento secundário
        return await this.getAllMemoriesFromFiles();
      } catch (error) {
        console.warn('[WiltonOS] Falha ao buscar do armazenamento primário, utilizando fallback:', error);
        
        // Fallback: buscar de arquivos
        return await this.getAllMemoriesFromFiles();
      }
    } catch (error) {
      console.error('[WiltonOS] Erro ao buscar todas as memórias:', error);
      return [];
    }
  }
  
  // Busca semântica
  async searchMemories(query: string): Promise<Memory[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      
      try {
        // Tentar buscar do armazenamento primário
        // Em uma implementação real, utilizaríamos memoryStore.searchMemories aqui
        const memories: Memory[] = []; // memoryStore.searchMemories(query);
        
        if (memories && memories.length > 0) {
          return memories;
        }
        
        // Se não encontrar, tentar busca simples no armazenamento secundário
        return await this.searchMemoriesInFiles(query);
      } catch (error) {
        console.warn('[WiltonOS] Falha na busca semântica no armazenamento primário, utilizando fallback:', error);
        
        // Fallback: busca simples em arquivos
        return await this.searchMemoriesInFiles(query);
      }
    } catch (error) {
      console.error('[WiltonOS] Erro na busca semântica:', error);
      return [];
    }
  }
  
  // Busca por tags
  async searchMemoriesByTags(tags: string[]): Promise<Memory[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      
      try {
        // Tentar buscar do armazenamento primário
        // Em uma implementação real, utilizaríamos memoryStore.searchMemoriesByTags aqui
        const memories: Memory[] = []; // memoryStore.searchMemoriesByTags(tags);
        
        if (memories && memories.length > 0) {
          return memories;
        }
        
        // Se não encontrar, tentar busca por tags no armazenamento secundário
        return await this.searchMemoriesByTagsInFiles(tags);
      } catch (error) {
        console.warn('[WiltonOS] Falha na busca por tags no armazenamento primário, utilizando fallback:', error);
        
        // Fallback: busca por tags em arquivos
        return await this.searchMemoriesByTagsInFiles(tags);
      }
    } catch (error) {
      console.error('[WiltonOS] Erro na busca por tags:', error);
      return [];
    }
  }
  
  // Obter últimas N memórias
  async getLastNMemories(count: number): Promise<Memory[]> {
    try {
      if (!this.initialized) {
        await this.init();
      }
      
      try {
        // Tentar buscar do armazenamento primário
        // Em uma implementação real, utilizaríamos memoryStore.getRecentMemories aqui
        const memories: Memory[] = []; // memoryStore.getRecentMemories(count);
        
        if (memories && memories.length > 0) {
          return memories;
        }
        
        // Se não encontrar, tentar do armazenamento secundário
        const allMemories = await this.getAllMemoriesFromFiles();
        
        // Ordenar por data de criação (mais recentes primeiro)
        allMemories.sort((a, b) => {
          const dateA = new Date(a.created_at || '');
          const dateB = new Date(b.created_at || '');
          return dateB.getTime() - dateA.getTime();
        });
        
        // Retornar apenas os N mais recentes
        return allMemories.slice(0, count);
      } catch (error) {
        console.warn('[WiltonOS] Falha ao buscar memórias recentes do armazenamento primário, utilizando fallback:', error);
        
        // Fallback: buscar de arquivos
        const allMemories = await this.getAllMemoriesFromFiles();
        
        // Ordenar por data de criação (mais recentes primeiro)
        allMemories.sort((a, b) => {
          const dateA = new Date(a.created_at || '');
          const dateB = new Date(b.created_at || '');
          return dateB.getTime() - dateA.getTime();
        });
        
        // Retornar apenas os N mais recentes
        return allMemories.slice(0, count);
      }
    } catch (error) {
      console.error('[WiltonOS] Erro ao buscar memórias recentes:', error);
      return [];
    }
  }
  
  // Métodos privados para manipulação de arquivos
  
  private async saveMemoryToFile(memory: Memory): Promise<Memory> {
    try {
      // Garantir que o ID existe
      if (!memory.id) {
        memory.id = this.generateId();
      }
      
      // Garantir que as datas existem
      if (!memory.created_at) {
        memory.created_at = new Date().toISOString();
      }
      memory.updated_at = new Date().toISOString();
      
      // Caminho do arquivo
      const filePath = path.join(STORAGE_DIR, `${memory.id}.json`);
      
      // Salvar o arquivo
      await fs.writeFile(filePath, JSON.stringify(memory, null, 2));
      
      return memory;
    } catch (error) {
      console.error('[WiltonOS] Erro ao salvar memória em arquivo:', error);
      throw error;
    }
  }
  
  private async getMemoryFromFile(id: string): Promise<Memory | null> {
    try {
      // Caminho do arquivo
      const filePath = path.join(STORAGE_DIR, `${id}.json`);
      
      // Verificar se o arquivo existe
      try {
        await fs.access(filePath);
      } catch {
        return null;
      }
      
      // Ler o arquivo
      const data = await fs.readFile(filePath, 'utf-8');
      
      // Parsear o conteúdo
      return JSON.parse(data) as Memory;
    } catch (error) {
      console.error(`[WiltonOS] Erro ao ler memória de arquivo (${id}):`, error);
      return null;
    }
  }
  
  private async updateMemoryInFile(memory: Memory): Promise<Memory> {
    try {
      // Verificar se a memória existe
      const existingMemory = await this.getMemoryFromFile(memory.id);
      
      if (!existingMemory) {
        throw new Error(`Memória não encontrada: ${memory.id}`);
      }
      
      // Atualizar data de modificação
      memory.updated_at = new Date().toISOString();
      
      // Caminho do arquivo
      const filePath = path.join(STORAGE_DIR, `${memory.id}.json`);
      
      // Salvar o arquivo
      await fs.writeFile(filePath, JSON.stringify(memory, null, 2));
      
      return memory;
    } catch (error) {
      console.error(`[WiltonOS] Erro ao atualizar memória em arquivo (${memory.id}):`, error);
      throw error;
    }
  }
  
  private async deleteMemoryFromFile(id: string): Promise<boolean> {
    try {
      // Caminho do arquivo
      const filePath = path.join(STORAGE_DIR, `${id}.json`);
      
      // Verificar se o arquivo existe
      try {
        await fs.access(filePath);
      } catch {
        return false;
      }
      
      // Excluir o arquivo
      await fs.unlink(filePath);
      
      return true;
    } catch (error) {
      console.error(`[WiltonOS] Erro ao excluir memória de arquivo (${id}):`, error);
      return false;
    }
  }
  
  private async getAllMemoriesFromFiles(): Promise<Memory[]> {
    try {
      // Listar arquivos no diretório
      const files = await fs.readdir(STORAGE_DIR);
      
      // Filtrar apenas arquivos JSON
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      // Array para armazenar as memórias
      const memories: Memory[] = [];
      
      // Ler cada arquivo
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(STORAGE_DIR, file);
          const data = await fs.readFile(filePath, 'utf-8');
          const memory = JSON.parse(data) as Memory;
          memories.push(memory);
        } catch (error) {
          console.warn(`[WiltonOS] Erro ao ler arquivo de memória (${file}):`, error);
          // Continuar com o próximo arquivo
        }
      }
      
      return memories;
    } catch (error) {
      console.error('[WiltonOS] Erro ao ler memórias de arquivos:', error);
      return [];
    }
  }
  
  private async searchMemoriesInFiles(query: string): Promise<Memory[]> {
    try {
      // Obter todas as memórias
      const allMemories = await this.getAllMemoriesFromFiles();
      
      // Normalizar a consulta
      const normalizedQuery = query.toLowerCase();
      
      // Filtrar memórias que contêm a consulta
      return allMemories.filter(memory => {
        const title = memory.title?.toLowerCase() || '';
        const text = memory.text?.toLowerCase() || '';
        const tags = memory.tags?.map(tag => tag.toLowerCase()) || [];
        
        return (
          title.includes(normalizedQuery) ||
          text.includes(normalizedQuery) ||
          tags.some(tag => tag.includes(normalizedQuery))
        );
      });
    } catch (error) {
      console.error('[WiltonOS] Erro ao buscar memórias em arquivos:', error);
      return [];
    }
  }
  
  private async searchMemoriesByTagsInFiles(tags: string[]): Promise<Memory[]> {
    try {
      // Obter todas as memórias
      const allMemories = await this.getAllMemoriesFromFiles();
      
      // Normalizar as tags
      const normalizedTags = tags.map(tag => tag.toLowerCase());
      
      // Filtrar memórias que contêm pelo menos uma das tags
      return allMemories.filter(memory => {
        const memoryTags = memory.tags?.map(tag => tag.toLowerCase()) || [];
        
        return normalizedTags.some(tag => memoryTags.includes(tag));
      });
    } catch (error) {
      console.error('[WiltonOS] Erro ao buscar memórias por tags em arquivos:', error);
      return [];
    }
  }
  
  // Gerar ID único
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
  }
}

// Exportar instância única
export const resilientStore = new ResilientStore();