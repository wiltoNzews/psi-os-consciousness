/**
 * Type definitions for the verification-patterns.js module
 */

export interface Pattern {
  name: string;
  description: string;
  regex: RegExp;
  examples: string[];
}

export const boundaryPatterns: Pattern[];
export const responsibilityPatterns: Pattern[];
export const defaultVerificationThresholds: {
  boundaries: number;
  responsibilities: number;
};

/**
 * Count the number of boundary patterns in a piece of content
 * @param content - The content to analyze
 * @returns The number of boundary patterns found
 */
export function countBoundaryPatterns(content: string): number;

/**
 * Count the number of responsibility patterns in a piece of content
 * @param content - The content to analyze
 * @returns The number of responsibility patterns found
 */
export function countResponsibilityPatterns(content: string): number;

declare const verificationPatterns: {
  boundaryPatterns: Pattern[];
  responsibilityPatterns: Pattern[];
  defaultVerificationThresholds: {
    boundaries: number;
    responsibilities: number;
  };
  countBoundaryPatterns: (content: string) => number;
  countResponsibilityPatterns: (content: string) => number;
};

export default verificationPatterns;