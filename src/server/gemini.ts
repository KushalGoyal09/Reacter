import { GoogleGenerativeAI, Content } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
import { SYSTEM_PROMPT } from '@/constant/systemPrompt';
import {initialMessage} from "@/constant/initialMessage"
import { Files } from '@/types';

const generationConfig = {
    responseMimeType: 'application/json',
};

export const taltToGemini = async (prompt: string, currentFiles: Files[]) => {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: SYSTEM_PROMPT,
    });
    const history: Content = {
        role: 'user',
        parts: [
            {
                text: initialMessage,
            },
            {
                text: `The initial set of files with there relative path name to he current working directory is provided below in JSON format which is array of Files. Each File contain two keys "file_name" for the relative path of the file and "content" for the actual content of the file
            ${JSON.stringify(currentFiles)}
            `,
            },
        ],
    };

    const chatSession = model.startChat({
        generationConfig,
        history: [history],
    });
    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
};
