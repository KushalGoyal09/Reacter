import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/constant/systemPrompt';
import { initialMessage } from '@/constant/initialMessage';
import { AIProvider } from './types';

const client = new Anthropic();

export const generate: AIProvider = async (prompt, currentFiles) => {
  const filesContext = `The initial set of files with their relative path name to the current working directory is provided below in JSON format which is array of Files. Each File contain two keys "file_name" for the relative path of the file and "content" for the actual content of the file
${JSON.stringify(currentFiles)}`;

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 64000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `${initialMessage}\n\n${filesContext}`,
      },
      {
        role: 'assistant',
        content: 'Understood. I will generate a JSON response with the project structure and steps.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const response = await stream.finalMessage();

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  let text = textBlock.text.trim();
  // Strip markdown code block wrapping if present
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```$/, '');
  }
  return text;
};
