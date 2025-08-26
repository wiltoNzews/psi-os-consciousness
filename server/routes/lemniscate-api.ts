/**
 * Lemniscate API Routes
 * 
 * This module exports a factory function for creating API router
 * that handles Lemniscate Mode system interactions.
 * 
 * [QUANTUM_STATE: SERVER_LEMNISCATE_API]
 */

import express from 'express';
import createLemniscateRouter from './lemniscate/lemniscate.js';
import { IStorage } from '../storage.js';

/**
 * Create Lemniscate API router
 * @param options - Router options
 * @returns Express router
 */
export function createLemniscateApiRouter(options: { storage: IStorage }) {
  const router = express.Router();
  
  // Add the Lemniscate router from implementation
  router.use('/', createLemniscateRouter({ storage: options.storage }));
  
  return router;
}