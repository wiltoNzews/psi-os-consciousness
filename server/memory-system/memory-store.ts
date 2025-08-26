/**
 * WiltonOS - Armazenamento de Memória
 * 
 * Módulo responsável pelo armazenamento primário da memória do WiltonOS.
 * Em produção, utiliza PostgreSQL com extensões de vetores.
 */

// Interface simples para armazenamento de memória
export const memoryStore = {
  // Funções simuladas para compatibilidade com o sistema resiliente
  async connect() {
    return true;
  },
  
  async disconnect() {
    return true;
  },
  
  async isConnected() {
    return true;
  }
};