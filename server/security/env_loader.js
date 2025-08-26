/**
 * WiltonOS Environment Loader - Secure API Key Manager for Node.js
 * -------------------------------------------------------------
 * Integração do gerenciador de segredos do WiltonOS para aplicativos Node.js.
 * Mantém a proporção quântica 3:1 (75% coerência, 25% exploração).
 * 
 * Este módulo carrega segredos de forma segura do vault para o ambiente
 * e fornece métodos para acessar esses segredos de forma programática.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Cache de segredos para evitar chamadas repetidas ao vault
const secretsCache = new Map();
const secretsLastLoaded = {
  timestamp: 0,
  ttl: 5 * 60 * 1000, // 5 minutos em milissegundos
};

/**
 * Executa o script de gerenciamento de segredos do Python
 * @param {string} command - Comando a ser executado
 * @param {Array} args - Argumentos para o comando
 * @returns {string} - Saída do comando
 */
function runSecretManager(command, args = []) {
  const scriptPath = path.resolve(__dirname, '../../wilton_core/security/manage_secrets.py');
  
  if (!fs.existsSync(scriptPath)) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Script de gerenciamento de segredos não encontrado: ${scriptPath}`);
    throw new Error('Script de gerenciamento de segredos não encontrado');
  }
  
  const fullCommand = `python ${scriptPath} ${command} ${args.join(' ')}`;
  
  try {
    return execSync(fullCommand, { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'] 
    });
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Erro ao executar comando de segredos: ${error.message}`);
    throw error;
  }
}

/**
 * Carrega todos os segredos do vault para o ambiente
 * @returns {Promise<Object>} - Status do carregamento
 */
async function loadSecrets() {
  console.log('[QUANTUM_STATE: SECURITY_FLOW] Carregando segredos do vault para o ambiente...');
  
  try {
    // Executar o comando para carregar segredos diretamente no ambiente Python
    const pythonScript = path.resolve(__dirname, '../../wilton_core/security/load_secrets_to_env.py');
    
    // Se o script específico não existir, usar o manage_secrets.py
    let output;
    if (fs.existsSync(pythonScript)) {
      output = execSync(`python ${pythonScript}`, { encoding: 'utf8' });
    } else {
      output = runSecretManager('import-env');
    }
    
    // Limpar o cache
    secretsCache.clear();
    secretsLastLoaded.timestamp = Date.now();
    
    console.log('[QUANTUM_STATE: SECURITY_FLOW] Segredos carregados com sucesso');
    
    return { success: true, message: output };
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Erro ao carregar segredos: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Obtém um segredo específico
 * @param {string} key - Nome/chave do segredo
 * @param {string} defaultValue - Valor padrão se o segredo não existir
 * @returns {Promise<string>} - Valor do segredo
 */
async function getSecret(key, defaultValue = null) {
  // Normalizar a chave
  const normalizedKey = key.trim().toUpperCase();
  
  // Verificar primeiro no cache
  if (secretsCache.has(normalizedKey)) {
    return secretsCache.get(normalizedKey);
  }
  
  // Verificar se é hora de recarregar o cache
  const now = Date.now();
  if (now - secretsLastLoaded.timestamp > secretsLastLoaded.ttl) {
    await loadSecrets();
  }
  
  // Verificar o valor no ambiente do processo
  const envValue = process.env[normalizedKey];
  if (envValue !== undefined) {
    // Armazenar no cache
    secretsCache.set(normalizedKey, envValue);
    return envValue;
  }
  
  // Tentar obter o valor diretamente do vault
  try {
    const output = runSecretManager('get', [normalizedKey]);
    
    // Processar a saída
    const lines = output.split(os.EOL).filter(line => line.trim());
    if (lines.length >= 2) {
      const secretValue = lines[1].trim();
      
      // Armazenar no cache e atualizar o ambiente
      secretsCache.set(normalizedKey, secretValue);
      process.env[normalizedKey] = secretValue;
      
      return secretValue;
    }
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Erro ao obter segredo ${normalizedKey}: ${error.message}`);
  }
  
  return defaultValue;
}

/**
 * Define um segredo no vault
 * @param {string} key - Nome/chave do segredo
 * @param {string} value - Valor do segredo
 * @returns {Promise<boolean>} - True se o segredo foi definido com sucesso
 */
async function setSecret(key, value) {
  // Normalizar a chave
  const normalizedKey = key.trim().toUpperCase();
  
  try {
    // Criar um arquivo temporário com o valor para evitar problemas com caracteres especiais
    const tempFile = path.join(os.tmpdir(), `secret_${Date.now()}.tmp`);
    fs.writeFileSync(tempFile, value, { mode: 0o600 });
    
    // Usar o arquivo para definir o segredo
    const command = `set ${normalizedKey} $(cat "${tempFile}")`;
    runSecretManager(command);
    
    // Remover o arquivo temporário
    fs.unlinkSync(tempFile);
    
    // Atualizar o cache e o ambiente
    secretsCache.set(normalizedKey, value);
    process.env[normalizedKey] = value;
    
    return true;
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Erro ao definir segredo ${normalizedKey}: ${error.message}`);
    return false;
  }
}

/**
 * Verifica o status dos serviços dependentes de segredos
 * @returns {Promise<Object>} - Status dos serviços
 */
async function getServiceStatus() {
  try {
    const output = runSecretManager('status', ['--json']);
    return JSON.parse(output);
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Erro ao obter status dos serviços: ${error.message}`);
    return { error: error.message };
  }
}

/**
 * Valida se todos os segredos obrigatórios estão presentes
 * @returns {Promise<Object>} - Resultado da validação
 */
async function validateRequiredSecrets() {
  try {
    // Executar o comando de validação
    const output = runSecretManager('validate');
    
    // Processar a saída para determinar se todos os segredos estão válidos
    const allValid = output.includes('✅ Todos os segredos obrigatórios estão configurados corretamente');
    
    if (allValid) {
      return { 
        valid: true, 
        message: 'Todos os segredos obrigatórios estão configurados corretamente' 
      };
    } else {
      // Extrair quais segredos estão faltando
      const missingMatch = output.match(/❌ (\d+) segredo\(s\) obrigatório\(s\) estão faltando ou inválidos:/);
      const missingCount = missingMatch ? parseInt(missingMatch[1]) : 0;
      
      // Extrair os nomes dos segredos faltando
      const lines = output.split(os.EOL);
      const missingSecrets = [];
      
      let capturing = false;
      for (const line of lines) {
        if (line.includes('segredo(s) obrigatório(s) estão faltando')) {
          capturing = true;
          continue;
        }
        
        if (capturing && line.trim().startsWith('-')) {
          const keyMatch = line.match(/- ([A-Z_]+):/);
          if (keyMatch) {
            missingSecrets.push(keyMatch[1]);
          }
        }
        
        if (capturing && line.trim() === '') {
          capturing = false;
        }
      }
      
      return {
        valid: false,
        message: `${missingCount} segredo(s) obrigatório(s) estão faltando ou inválidos`,
        missingSecrets
      };
    }
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Erro ao validar segredos: ${error.message}`);
    return { valid: false, error: error.message };
  }
}

/**
 * Obtém um wrapper para process.env que usa o vault para segredos
 * @returns {Object} - Proxy para process.env que busca segredos do vault
 */
function getSecureEnv() {
  return new Proxy(process.env, {
    get(target, prop) {
      // Primeiro verifica no objeto original (process.env)
      if (prop in target) {
        return target[prop];
      }
      
      // Se não encontrar, tenta buscar do vault (de forma síncrona para compatibilidade)
      try {
        const output = runSecretManager('get', [prop]);
        const lines = output.split(os.EOL).filter(line => line.trim());
        
        if (lines.length >= 2) {
          const secretValue = lines[1].trim();
          // Armazena no cache e no ambiente
          secretsCache.set(prop, secretValue);
          target[prop] = secretValue;
          return secretValue;
        }
      } catch (error) {
        // Se falhar, retorna undefined como process.env normal faria
        return undefined;
      }
      
      return undefined;
    },
    
    set(target, prop, value) {
      // Ao definir uma variável de ambiente, também tenta salvá-la no vault
      target[prop] = value;
      
      // Apenas tenta salvar no vault se for uma string e não começar com _
      // (variáveis internas geralmente começam com _)
      if (typeof value === 'string' && !prop.startsWith('_')) {
        try {
          setSecret(prop, value).catch(err => {
            console.error(`[QUANTUM_STATE: ERROR_FLOW] Erro ao salvar segredo ${prop} no vault: ${err.message}`);
          });
        } catch (error) {
          console.error(`[QUANTUM_STATE: ERROR_FLOW] Erro ao salvar segredo ${prop} no vault: ${error.message}`);
        }
      }
      
      return true;
    }
  });
}

// Carregar segredos ao inicializar o módulo
loadSecrets().catch(error => {
  console.error(`[QUANTUM_STATE: ERROR_FLOW] Erro ao carregar segredos: ${error.message}`);
});

module.exports = {
  loadSecrets,
  getSecret,
  setSecret,
  getServiceStatus,
  validateRequiredSecrets,
  getSecureEnv
};