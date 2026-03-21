import { AIProvider } from './types';
import { generate as claude } from './claude';
import { generate as gemini } from './gemini';
import { generate as openai } from './openai';

const providers: Record<string, AIProvider> = {
  claude,
  gemini,
  openai,
};

export function getProvider(name?: string): AIProvider {
  const providerName = name || process.env.AI_PROVIDER || 'claude';
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Unknown AI provider: ${providerName}. Available: ${Object.keys(providers).join(', ')}`);
  }
  return provider;
}
