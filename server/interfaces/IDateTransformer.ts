/**
 * Interface for the DateTransformer
 * 
 * This interface defines the contract for date transformation utilities
 * used throughout the OROBORO NEXUS system to ensure consistent handling
 * of dates across persistence layers and service boundaries.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

export interface IDateTransformer {
  /**
   * Create a new Date object using the Explicit-Implicit Quantum Balance principle
   * @returns A new Date object representing the current time
   */
  createDate(): Date;
  
  /**
   * Transform dates in an object when crossing system boundaries
   * @param obj The object containing dates to transform
   * @param direction 'serialize' to convert Dates to strings, 'deserialize' for the reverse
   * @returns The transformed object with dates properly handled
   */
  transformDates(obj: any, direction: 'serialize' | 'deserialize'): any;
  
  /**
   * Serialize a Date object to a string representation
   * @param date The Date to serialize
   * @returns The serialized date string
   */
  serializeDate(date: Date): string;
  
  /**
   * Deserialize a string to a Date object
   * @param dateStr The date string to deserialize
   * @returns The deserialized Date object
   */
  deserializeDate(dateStr: string): Date;
}