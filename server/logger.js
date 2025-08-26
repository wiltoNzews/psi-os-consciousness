/**
 * Logger para WiltonOS
 * 
 * Sistema de log simplificado para o WiltonOS com níveis de log
 * e formatação consistente.
 */

// Definir níveis de log
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// Configuração do ambiente
const currentLevel = process.env.LOG_LEVEL 
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] 
  : LOG_LEVELS.INFO;

// Função principal de log
function log(level, message, ...args) {
  if (level >= currentLevel) {
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level);
    
    if (args && args.length > 0) {
      console.log(`[${timestamp}] [${levelName}] ${message}`, ...args);
    } else {
      console.log(`[${timestamp}] [${levelName}] ${message}`);
    }
  }
}

// Exportar funções específicas para cada nível
export const logger = {
  debug: (message, ...args) => log(LOG_LEVELS.DEBUG, message, ...args),
  info: (message, ...args) => log(LOG_LEVELS.INFO, message, ...args),
  warn: (message, ...args) => log(LOG_LEVELS.WARN, message, ...args),
  error: (message, ...args) => log(LOG_LEVELS.ERROR, message, ...args)
};

export default logger;