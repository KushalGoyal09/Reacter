'use server';

import { tryCatch } from '@/lib/tryCatch';
import { getProvider } from '@/server/ai';
import { ratelimitMiddleware } from '@/server/ratelimit';
import { Files, AIResponse } from '@/types';

export async function generateResponse(prompt: string, currentFiles: Files[]) {
    try {
        const { allowed, error: rateLimitError } = await ratelimitMiddleware();
        if (!allowed) {
            throw new Error(rateLimitError);
        }

        const provider = getProvider();
        const { data: response, error: providerError } = await tryCatch(provider(prompt, currentFiles));
        if (providerError) {
            console.log(providerError);
            throw new Error('Error generating response');
        }

        const { data: jsonResponse, error: parseError } = await tryCatch(JSON.parse(response));
        if (parseError) {
            throw new Error('Error parsing response');
        }

        const parsedResponse = AIResponse.safeParse(jsonResponse);
        if (!parsedResponse.success) {
            console.error('Error parsing response:', parsedResponse.error);
            throw new Error('Invalid response format');
        }

        return {
            success: true,
            data: parsedResponse.data,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Something went wrong',
        };
    }
}
