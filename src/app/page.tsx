'use client';

import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { WebContainer } from '@webcontainer/api';
import reactMountFiles from '@/constant/reactMountFiles';
import initialFiles from '@/constant/initialFiles';
import '@xterm/xterm/css/xterm.css';
import { useWebContainer } from '@/hooks/useWebcontainer';
import { Terminal } from '@xterm/xterm';

export default function Home() {
    const { webcontainer, isLoading, error } = useWebContainer();
    const [src, setSrc] = useState("");
    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminal, setTerminal] = useState<Terminal | null>(null);

    useEffect(() => {
        if (terminalRef.current) {
            const terminal = new Terminal({
                convertEol: true,
            });
            terminal.open(terminalRef.current);
            setTerminal(terminal);
        }
    }, []);

    useEffect(() => {
        const handleStart = async () => {
            console.log(webcontainer);
            console.log(terminal);
            if (webcontainer && terminal) {
              console.log("Starting");
                await webcontainer.mount(reactMountFiles);
                const installExit = await installPackages(webcontainer, terminal);
                if (installExit !== 0) {
                    console.log('install failed');
                    return;
                }
                console.log('install success');
                const serverExit = await startDevServer(webcontainer, terminal, setSrc);
                if (serverExit !== 0) {
                    console.log('server start failed');
                    return;
                }
                console.log('server started');
            }
        };
        handleStart();
    }, [webcontainer, terminal]);

    return (
        <>
            <h1>kushal</h1>
            <iframe src={src} />
            <div ref={terminalRef}></div>
            {error && <div>{error.message}</div>}
            {isLoading && <div>Loading...</div>}
        </>
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
