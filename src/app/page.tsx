'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import Editor from '@monaco-editor/react';
import { useWebContainer } from '@/hooks/useWebcontainer';
import reactMountFiles from '@/constant/reactMountFiles';
import initialFiles from '@/constant/initialFiles';
import { ChatMessage, Files } from '@/types';
import { executeCommand, installPackages, startDevServer } from '@/utils/webcontainer-utils';
import '@xterm/xterm/css/xterm.css';
import { generateResponse } from './action';
import { getFilePathAndName } from '@/utils/files-utils';
import ChatBox from '@/components/ChatBox';
import FileExplorer from '@/components/FileExplorer';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Code, Eye, X, Terminal as TerminalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { startShell } from '@/utils/terminal-utils';

export default function Home() {
    const { webcontainer, isLoading, error } = useWebContainer();
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(error?.message || '');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [files, setFiles] = useState<Files[]>(initialFiles);
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [fileContent, setFileContent] = useState<string>('');
    const [src, setSrc] = useState('');
    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminal, setTerminal] = useState<Terminal | null>(null);
    const [showTerminal, setShowTerminal] = useState(true);
    const terminalInitialized = useRef(false);

    useEffect(() => {
        if (!terminalInitialized.current && terminalRef.current && webcontainer) {
            console.log('terminal initialized');
            const term = new Terminal({
                convertEol: true,
            });
            term.open(terminalRef.current);
            setTerminal(term);
            terminalInitialized.current = true;
            startShell(term, webcontainer);
        }
    }, [webcontainer, terminalRef]);

    useEffect(() => {
        const handleStart = async () => {
            if (webcontainer && terminal) {
                setLoading(true);
                setLoadingMessage('Installing the base project...');
                try {
                    await webcontainer.mount(reactMountFiles);
                    const installExit = await installPackages(webcontainer, terminal);
                    if (installExit !== 0) {
                        console.log('install failed');
                        setErrorMessage('Failed to install the base project.');
                        setLoading(false);
                        setLoadingMessage('');
                        return;
                    }
                    setLoading(false);
                    setLoadingMessage('');
                    await startDevServer(webcontainer, terminal, setSrc);
                    setLoading(false);
                    setLoadingMessage('');
                } catch (error) {
                    console.error('Initialization error:', error);
                    setErrorMessage(
                        `Error during initialization: ${error instanceof Error ? error.message : String(error)}`,
                    );
                    setLoading(false);
                    setLoadingMessage('');
                }
            }
        };
        handleStart();
    }, [webcontainer, terminal]);

    useEffect(() => {
        if (initialFiles.length > 0) {
            setSelectedFile(initialFiles[0].file_name);
            setFileContent(initialFiles[0].content);
        }
    }, []);

    const handleFileSelect = (file: Files) => {
        setSelectedFile(file.file_name);
        setFileContent(file.content);
    };

    const handleFileChange = async (value: string | undefined) => {
        if (!selectedFile || !value || !webcontainer) return;

        setFileContent(value);

        try {
            await webcontainer.fs.writeFile(selectedFile, value);
            setFiles((prev) => prev.map((f) => (f.file_name === selectedFile ? { ...f, content: value } : f)));
        } catch (error) {
            console.error('Error writing file:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!webcontainer || !terminal) return;
        setChatLoading(true);
        setErrorMessage('');
        const prompt = input;
        setMessages([...messages, { role: 'user', content: prompt }]);
        setInput('');

        try {
            const response = await generateResponse(prompt, files);
            const chatResponse = {
                role: 'assistant' as const,
                content: response,
            };
            setMessages((prev) => [...prev, chatResponse]);
            setChatLoading(false);
            setLoading(true);
            setLoadingMessage('Loading...');

            for (const step of response.steps) {
                if (step.command) {
                    if (step.command !== 'npm run dev') {
                        try {
                            setLoadingMessage(`Running ${step.command}`);
                            await executeCommand(webcontainer, terminal, step.command);
                        } catch (error) {
                            console.error(`Error running ${step.command}:`, error);
                            setErrorMessage(
                                `Failed to run "${step.command}": ${
                                    error instanceof Error ? error.message : String(error)
                                }`,
                            );
                            break;
                        }
                    }
                }
                if (step.file_name && step.content) {
                    try {
                        const [folderPath] = getFilePathAndName(step.file_name);
                        setLoadingMessage(`Updating or Creating ${step.file_name}`);
                        await webcontainer.fs.mkdir(folderPath, { recursive: true });
                        await webcontainer.fs.writeFile(step.file_name, step.content);
                        const fileExists = files.some((f) => f.file_name === step.file_name);
                        if (fileExists) {
                            setFiles((prev) =>
                                prev.map((f) =>
                                    f.file_name === step.file_name ? { ...f, content: step.content! } : f,
                                ),
                            );
                        } else {
                            setFiles((prev) => [
                                ...prev,
                                {
                                    file_name: step.file_name!,
                                    content: step.content!,
                                },
                            ]);
                        }
                        if (selectedFile === step.file_name) {
                            setFileContent(step.content);
                        }
                    } catch (error) {
                        console.error(`Error creating file ${step.file_name}:`, error);
                        setErrorMessage(`Error creating file ${step.file_name}: ${error}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error generating response:', error);
            setErrorMessage(
                `Failed to generate AI response: ${error instanceof Error ? error.message : String(error)}`,
            );
            setChatLoading(false);
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={30} minSize={20}>
                    <ChatBox
                        messages={messages}
                        handleSendMessage={handleSendMessage}
                        input={input}
                        setInput={setInput}
                        chatLoading={chatLoading}
                        loading={loading}
                        loadingMessage={loadingMessage}
                        errorMessage={errorMessage}
                    />
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={70}>
                    <Tabs
                        defaultValue="code"
                        className="w-full h-full flex flex-col"
                    >
                        <TabsList className="border-b rounded-none justify-start">
                            <TabsTrigger value="code" className="flex items-center gap-2">
                                <Code size={16} />
                                Code
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="flex items-center gap-2">
                                <Eye size={16} />
                                Preview
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="code" className="flex-1 flex flex-col">
                            <ResizablePanelGroup direction="vertical" className="h-full">
                                <ResizablePanel defaultSize={showTerminal ? 70 : 100}>
                                    <ResizablePanelGroup direction="horizontal">
                                        <ResizablePanel defaultSize={20} minSize={15}>
                                            <div className="h-full overflow-auto p-2">
                                                <FileExplorer
                                                    items={files}
                                                    selectedFile={selectedFile}
                                                    handleFileSelect={handleFileSelect}
                                                />
                                            </div>
                                        </ResizablePanel>

                                        <ResizableHandle withHandle />

                                        <ResizablePanel defaultSize={80}>
                                            <Editor
                                                height="100%"
                                                path={selectedFile}
                                                value={fileContent}
                                                theme="vs-dark"
                                                onChange={handleFileChange}
                                                options={{
                                                    minimap: { enabled: false },
                                                    fontSize: 18,
                                                }}
                                            />
                                        </ResizablePanel>
                                    </ResizablePanelGroup>
                                </ResizablePanel>

                                {showTerminal && (
                                    <>
                                        <ResizableHandle withHandle />

                                        <ResizablePanel defaultSize={30} minSize={10}>
                                            <div className="h-full relative bg-black">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setShowTerminal(false)}
                                                    className="absolute right-2 top-2 z-10 bg-white"
                                                >
                                                    <X size={16} />
                                                </Button>
                                                <div ref={terminalRef} className="h-full w-full" />
                                            </div>
                                        </ResizablePanel>
                                    </>
                                )}
                            </ResizablePanelGroup>

                            {!showTerminal && (
                                <Button
                                    onClick={() => setShowTerminal(true)}
                                    className="fixed bottom-4 right-4"
                                    variant="default"
                                >
                                    <TerminalIcon size={16} className="mr-2" />
                                    Show Terminal
                                </Button>
                            )}
                        </TabsContent>

                        <TabsContent value="preview" className="flex-1">
                            {src ? (
                                <iframe src={src} className="w-full h-full" />
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-muted-foreground">No preview available</div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>

            {isLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="text-xl">Loading...</div>
                </div>
            )}
        </div>
    );
}
