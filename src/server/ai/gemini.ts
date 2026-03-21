import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { SYSTEM_PROMPT } from '@/constant/systemPrompt';
import { initialMessage } from '@/constant/initialMessage';
import { AIProvider } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const generationConfig = {
  responseMimeType: 'application/json',
  maxOutputTokens: 65536,
};

export const generate: AIProvider = async (prompt, currentFiles) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const history: Content = {
    role: 'user',
    parts: [
      { text: initialMessage },
      {
        text: `The initial set of files with their relative path name to the current working directory is provided below in JSON format which is array of Files. Each File contain two keys "file_name" for the relative path of the file and "content" for the actual content of the file
${JSON.stringify(currentFiles)}`,
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
