/**
 * WiltonOS - Reparador de Arquivos JSON
 * 
 * Este módulo implementa funções para verificar e consertar arquivos JSON corrompidos
 * ou mal formatados, especialmente os exportados do ChatGPT.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Corrige strings JSON corrompidas
 * @param jsonString String JSON possivelmente corrompida
 * @returns String JSON corrigida
 */
export function repairJsonString(jsonString: string): string {
  // Substituir caracteres de controle inválidos
  let repaired = jsonString
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    // Corrigir aspas não escapadas dentro de strings
    .replace(/([^\\])"([^"])/g, '$1\\"$2')
    // Corrigir barras invertidas não escapadas
    .replace(/([^\\])\\([^"\\/bfnrtu])/g, '$1\\\\$2');
  
  // Tenta corrigir strings não terminadas
  let braceCount = 0;
  let inString = false;
  let lastStringStart = 0;
  
  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];
    const prevChar = i > 0 ? repaired[i-1] : '';
    
    // Verificar strings
    if (char === '"' && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        lastStringStart = i;
      } else {
        inString = false;
      }
    }
    
    // Verificar chaves
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
  }
  
  // Se ainda estiver em uma string ao final, fechá-la
  if (inString) {
    console.log('[WiltonOS] Corrigindo string não terminada');
    repaired += '"';
  }
  
  // Verificar e corrigir chaves desbalanceadas
  while (braceCount > 0) {
    console.log('[WiltonOS] Adicionando } para balancear JSON');
    repaired += '}';
    braceCount--;
  }
  
  while (braceCount < 0) {
    console.log('[WiltonOS] Adicionando { para balancear JSON');
    repaired = '{' + repaired;
    braceCount++;
  }
  
  return repaired;
}

/**
 * Verifica e corrige um arquivo JSON
 * @param filePath Caminho para o arquivo JSON
 * @returns Caminho para o arquivo corrigido (ou o original se não precisar de correção)
 */
export async function repairJsonFile(filePath: string): Promise<string> {
  try {
    console.log(`[WiltonOS] Verificando arquivo JSON: ${filePath}`);
    
    // Tentar ler o arquivo
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Tentar fazer parse para verificar se já está válido
    try {
      JSON.parse(fileContent);
      console.log(`[WiltonOS] Arquivo JSON já está válido: ${filePath}`);
      return filePath;
    } catch (error) {
      console.log(`[WiltonOS] Arquivo JSON inválido, tentando reparar: ${filePath}`);
      // Reparar o conteúdo
      const repairedContent = repairJsonString(fileContent);
      
      // Verificar se o conteúdo reparado é válido
      try {
        JSON.parse(repairedContent);
        
        // Salvar o arquivo reparado
        const repairDir = path.join(path.dirname(filePath), 'repaired');
        await fs.mkdir(repairDir, { recursive: true });
        
        const repairedFilePath = path.join(repairDir, path.basename(filePath));
        await fs.writeFile(repairedFilePath, repairedContent, 'utf-8');
        
        console.log(`[WiltonOS] Arquivo JSON reparado com sucesso: ${repairedFilePath}`);
        return repairedFilePath;
      } catch (repairError) {
        console.error(`[WiltonOS] Não foi possível reparar o arquivo JSON: ${repairError.message}`);
        throw new Error(`Não foi possível reparar o arquivo JSON: ${repairError.message}`);
      }
    }
  } catch (error) {
    console.error(`[WiltonOS] Erro ao processar arquivo: ${error.message}`);
    throw error;
  }
}

/**
 * Repara um arquivo JSON específico para os arquivos do ChatGPT
 * @param filePath Caminho para o arquivo JSON
 * @returns Promise com o caminho para o arquivo corrigido
 */
export async function repairChatGPTJsonFile(filePath: string): Promise<string> {
  try {
    if (!filePath.endsWith('.json')) {
      throw new Error('O arquivo fornecido não é um JSON');
    }
    
    const repairedPath = await repairJsonFile(filePath);
    return repairedPath;
  } catch (error) {
    console.error(`[WiltonOS] Erro ao reparar arquivo ChatGPT: ${error.message}`);
    throw error;
  }
}

export default {
  repairJsonString,
  repairJsonFile,
  repairChatGPTJsonFile
};