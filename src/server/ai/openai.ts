import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '@/constant/systemPrompt';
import { initialMessage } from '@/constant/initialMessage';
import { AIProvider } from './types';

const client = new OpenAI();

export const generate: AIProvider = async (prompt, currentFiles) => {
  const filesContext = `The initial set of files with their relative path name to the current working directory is provided below in JSON format which is array of Files. Each File contain two keys "file_name" for the relative path of the file and "content" for the actual content of the file
${JSON.stringify(currentFiles)}`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 16384,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: initialMessage },
      { role: 'user', content: filesContext },
      { role: 'user', content: prompt },
    ],
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }
  return content;
};
