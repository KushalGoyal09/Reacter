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
    try {
        const response = await taltToGemini(prompt, currentFiles);
        const jsonResponse = JSON.parse(response);
        const parsedResponse = generateResponseSchema.safeParse(jsonResponse);
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
