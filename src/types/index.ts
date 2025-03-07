export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface FileStructure {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileStructure[];
}
