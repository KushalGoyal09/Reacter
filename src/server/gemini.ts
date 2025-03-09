import { GoogleGenerativeAI, Content } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
import { SYSTEM_PROMPT } from '@/constant/systemPrompt';
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
                text: `You are building a react app with typescript, tailwind CSS, Shadcn-ui. The project has been initialized with vite, tailwind and shadcn-ui is already configured. The current working directory is root of the project. For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production. Use shadcn, Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them. Use icons from lucide-react for logos. Use stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags. If using any shadcn components, make sure to create the component first in the src/components/ui folder. Do not use commands to install shadcn components, just create the component in the src/components/ui folder.`,
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
