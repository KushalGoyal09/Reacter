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
