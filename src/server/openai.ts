import OpenAI from "openai";
import { SYSTEM_PROMPT } from '@/constant/systemPrompt';
import { Files, AIResponse } from '@/types';
import { zodResponseFormat } from "openai/helpers/zod";
import { initialMessage } from "@/constant/initialMessage";
const client = new OpenAI();

export const chatWithOpenAI = async (prompt: string, currentFiles: Files[]) => {
    const completion = await client.beta.chat.completions.parse({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT,
            },
            {
                role: "developer",
                content: initialMessage
            },
            {
                role: "developer",
                content: `The initial set of files with there relative path name to he current working directory is provided below in JSON format which is array of Files. Each File contain two keys "file_name" for the relative path of the file and "content" for the actual content of the file
                ${JSON.stringify(currentFiles)}
                `
            }
        ],
        response_format: zodResponseFormat(AIResponse,"json_object")
    });
    return completion.choices[0].message.parsed;
}
