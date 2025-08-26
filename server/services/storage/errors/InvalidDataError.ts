/**
 * Invalid Data Error
 * 
 * Thrown when data fails validation or has an incorrect format.
 * Used in storage operations to clearly indicate when data cannot
 * be processed due to format or content issues.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

export class InvalidDataError extends Error {
  public invalidFields?: string[];
  
  constructor(message: string, invalidFields?: string[]) {
    super(message);
    this.name = "InvalidDataError";
    this.invalidFields = invalidFields;
  }
}