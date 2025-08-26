/**
 * Storage Operation Error
 * 
 * Thrown when a storage operation fails due to technical issues
 * like filesystem errors, permission problems, or network failures.
 * Helps distinguish between data-related failures and system failures.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

export class StorageOperationError extends Error {
  public operationType: 'read' | 'write' | 'delete' | 'update' | 'unknown';
  public cause?: any;
  
  constructor(
    message: string, 
    operationType: 'read' | 'write' | 'delete' | 'update' | 'unknown' = 'unknown',
    cause?: any
  ) {
    super(message);
    this.name = "StorageOperationError";
    this.operationType = operationType;
    this.cause = cause;
  }
}