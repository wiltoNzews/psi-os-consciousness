/**
 * File Not Found Error
 * 
 * Thrown when a file cannot be found or accessed.
 * Used in file system storage operations to clearly indicate
 * when a requested file is missing.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

export class FileNotFoundError extends Error {
  filePath: string;
  
  /**
   * Constructor for FileNotFoundError
   * 
   * @param message Error message describing what file was not found
   * @param filePath Optional path to the file that was not found
   */
  constructor(message: string, filePath?: string) {
    super(message);
    this.name = "FileNotFoundError";
    this.filePath = filePath || "";
  }
}