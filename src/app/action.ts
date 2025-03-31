'use server';

import { tryCatch } from '@/lib/tryCatch';
import { taltToGemini } from '@/server/gemini';
import { ratelimitMiddleware } from '@/server/ratelimit';
import { Files, AIResponse } from '@/types';

export async function generateResponse(prompt: string, currentFiles: Files[]) {
    try {
        const isValid = await ratelimitMiddleware();
    if (!isValid) {
        throw new Error('You are rate limited. Please try again after 1 hour');
    }
    const { data: response, error: geminiError } = await tryCatch(taltToGemini(prompt, currentFiles));
    if (geminiError) {
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
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Somthing went wrong',
        }
    }
    
}
