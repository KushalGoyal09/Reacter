'use client';

import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { WebContainer } from '@webcontainer/api';
import { Terminal } from '@xterm/xterm';
import Editor from '@monaco-editor/react';
import { useWebContainer } from '@/hooks/useWebcontainer';
import reactMountFiles from '@/constant/reactMountFiles';
import initialFiles from '@/constant/initialFiles';
import '@xterm/xterm/css/xterm.css';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface Files {
    file_name: string;
    content: string;
}

export default function Home() {
    const { webcontainer, isLoading, error } = useWebContainer();
    const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [files, setFiles] = useState<Files[]>([]);
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [fileContent, setFileContent] = useState<string>('');
    const [src, setSrc] = useState('');
    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminal, setTerminal] = useState<Terminal | null>(null);
    const [showTerminal, setShowTerminal] = useState(true);

    // Terminal initialization
    useEffect(() => {
        if (terminalRef.current) {
            const terminal = new Terminal({
                convertEol: true,
            });
            terminal.open(terminalRef.current);
            setTerminal(terminal);
        }
    }, []);

    // WebContainer setup
    useEffect(() => {
        const handleStart = async () => {
            if (webcontainer && terminal) {
                await webcontainer.mount(reactMountFiles);
                const installExit = await installPackages(webcontainer, terminal);
                if (installExit !== 0) {
                    console.log('install failed');
                    return;
                }

                await startDevServer(webcontainer, terminal, setSrc);
                console.log('webcontainer');
                const file = await webcontainer.fs.readdir('/');
                console.log('files');
                console.log(file);
            }
        };
        handleStart();
    }, [webcontainer, terminal]);

    // Initialize files from initialFiles
    useEffect(() => {
        setFiles(initialFiles);
        if (initialFiles.length > 0) {
            // Set the first file as selected by default
            setSelectedFile(initialFiles[0].file_name);
            setFileContent(initialFiles[0].content);
        }
    }, []);

    // Handle file selection
    const handleFileSelect = (file: Files) => {
        setSelectedFile(file.file_name);
        setFileContent(file.content);
    };

    // Update file content in both state and WebContainer
    const handleFileChange = async (value: string | undefined) => {
        if (!selectedFile || !value || !webcontainer) return;

        setFileContent(value);

        // Update the file in WebContainer and local state
        try {
            await webcontainer.fs.writeFile(selectedFile, value);
            setFiles(files.map((file) => (file.file_name === selectedFile ? { ...file, content: value } : file)));
        } catch (error) {
            console.error('Error writing file:', error);
        }
    };

    // Component for rendering flat file list
    const FileList = ({ items }: { items: Files[] }) => (
        <ul className="pl-4">
            {items.map((file, index) => (
                <li
                    key={index}
                    className={`cursor-pointer hover:bg-gray-100 p-1 ${
                        selectedFile === file.file_name ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleFileSelect(file)}
                >
                    {file.file_name}
                </li>
            ))}
        </ul>
    );

    const handleSendMessage = async () => {
        // TODO: Implement AI response logic here
    };

    return (
        <div className="flex h-screen">
            {/* Chat Interface - Left Side */}
            <div className="w-1/3 flex flex-col border-r">
                <div className="flex-1 overflow-auto p-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <div
                                className={`inline-block p-2 rounded-lg ${
                                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 p-2 border rounded"
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Code and Preview - Right Side */}
            <div className="flex-1">
                <div className="flex border-b">
                    <button
                        className={`px-4 py-2 ${activeTab === 'code' ? 'bg-gray-200' : ''}`}
                        onClick={() => setActiveTab('code')}
                    >
                        Code
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'preview' ? 'bg-gray-200' : ''}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </button>
                </div>

                <div className="h-[calc(100vh-40px)]">
                    {activeTab === 'code' ? (
                        <div className="flex h-full">
                            {/* File Explorer */}
                            <div className="w-64 border-r overflow-auto p-2">
                                <FileList items={files} />
                            </div>
                            {/* Monaco Editor */}
                            <div className="flex-1">
                                <Editor
                                    height="100%"
                                    path={selectedFile}
                                    defaultLanguage="typescript"
                                    value={fileContent}
                                    theme="vs-dark"
                                    onChange={handleFileChange}
                                    options={{
                                        minimap: { enabled: false },
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full">
                            <iframe src={src} className="w-full h-full" />
                        </div>
                    )}
                </div>
            </div>

            {/* Terminal with Toggle */}
            {activeTab === 'code' && (
                <>
                    {showTerminal ? (
                        <div className="h-32 border-t relative">
                            <button
                                onClick={() => setShowTerminal(false)}
                                className="absolute right-2 top-1 text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                            <div ref={terminalRef} className="h-full" />
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowTerminal(true)}
                            className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-700"
                        >
                            Show Terminal
                        </button>
                    )}
                </>
            )}

            {/* Error and Loading States */}
            {error && <div className="absolute top-0 right-0 p-4 bg-red-500 text-white">{error.message}</div>}
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <div className="text-xl">Loading...</div>
                </div>
            )}
        </div>
    );
}

const installPackages = async (webcontainer: WebContainer, terminal: Terminal) => {
    const installProcess = await webcontainer.spawn('npm', ['install']);
    installProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                terminal.write(data);
            },
        }),
    );
    return installProcess.exit;
};

const startDevServer = async (
    webcontainer: WebContainer,
    terminal: Terminal,
    setSrc: Dispatch<SetStateAction<string>>,
) => {
    const serverProcess = await webcontainer.spawn('npm', ['run', 'dev']);
    serverProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                terminal.write(data);
            },
        }),
    );

    webcontainer.on('server-ready', (port, url) => {
        setSrc(url);
    });
    return serverProcess.exit;
};
