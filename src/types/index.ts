import { z } from 'zod';

export type ChatMessage = ChatMessageUser | ChatMessageAssistant;

interface ChatMessageUser {
    role: 'user';
    content: string;
}

interface ChatMessageAssistant {
    role: 'assistant';
    content: ChatMessageContent;
}

interface ChatMessageContent {
    projectName: string;
    text: string;
    steps: {
        step: number;
        description: string;
        command?: string;
    }[];
}

export interface Files {
    file_name: string;
    content: string;
}

export const AIResponse = z.object({
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
