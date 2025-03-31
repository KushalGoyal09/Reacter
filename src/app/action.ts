'use server';

import { taltToGemini } from '@/server/gemini';
import { Files, AIResponse } from '@/types';

export async function generateResponse(prompt: string, currentFiles: Files[]) {
    try {
        const response = await taltToGemini(prompt, currentFiles);
        const jsonResponse = JSON.parse(response);
        const parsedResponse = AIResponse.safeParse(jsonResponse);
        if (!parsedResponse.success) {
            console.error('Error parsing response:', parsedResponse.error);
            throw new Error('Invalid response format');
        }
        return parsedResponse.data;
    } catch (error) {
        console.log(error);
        throw new Error('Error generating response');
    }
}
