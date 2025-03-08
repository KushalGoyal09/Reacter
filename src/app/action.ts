'use server';

import { taltToGemini } from '@/server/gemini';
import { Files } from '@/types';
import { z } from 'zod';

const generateResponseSchema = z.object({
    projectName: z.string(),
    text: z.string(),
    steps: z.array(
        z.object({
            step: z.number(),
            description: z.string(),
            content: z.string().optional(),
            file_name: z.string().optional(),
            command: z.string().optional(),
        }),
    ),
});

export async function generateResponse(prompt: string, currentFiles: Files[]) {
    const response = await taltToGemini(prompt, currentFiles);
    try {
        const parsedResponse = generateResponseSchema.parse(JSON.parse(response));
        return parsedResponse;
    } catch (error) {
        console.log(response);
        console.error('Error parsing response:', error);
        throw new Error('Invalid response format');
    }
}
