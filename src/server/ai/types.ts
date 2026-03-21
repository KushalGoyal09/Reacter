import { Files } from '@/types';

/**
 * All AI providers implement this signature.
 * Returns raw JSON string — parsing and validation happen in the server action.
 */
export type AIProvider = (prompt: string, currentFiles: Files[]) => Promise<string>;
