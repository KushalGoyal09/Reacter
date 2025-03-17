import { SetStateAction } from 'react';
import { Terminal } from '@xterm/xterm';
import { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { Dispatch } from 'react';

export const installPackages = async (webcontainer: WebContainer, terminal: Terminal | null) => {
    const installProcess = await webcontainer.spawn('jsh', ['-c', 'npm install --force']);
    if (terminal) {
        installProcess.output.pipeTo(
            new WritableStream({
                write(data) {
                    terminal.write(data);
                },
            }),
        );
    }
    return installProcess.exit;
};

export const startDevServer = async (
    webcontainer: WebContainer,
    terminal: Terminal | null,
    setSrc: Dispatch<SetStateAction<string>>,
    setDevserverProcess: Dispatch<SetStateAction<WebContainerProcess | null>>,
) => {
    const serverProcess = await webcontainer.spawn('jsh', ['-c', 'npm run dev']);
    setDevserverProcess(serverProcess);
    if (terminal) {
        serverProcess.output.pipeTo(
            new WritableStream({
                write(data) {
                    terminal.write(data);
                },
            }),
        );
    }

    webcontainer.on('server-ready', (port, url) => {
        console.log(url);
        setSrc(url);
    });
    return serverProcess.exit;
};

export const stopDevServer = async (serverProcess: WebContainerProcess, setSrc: Dispatch<SetStateAction<string>>) => {
    serverProcess.kill();
    setSrc('');
};

export const executeCommand = async (webcontainer: WebContainer, terminal: Terminal | null, command: string) => {
    if (command === 'npm install') {
        return installPackages(webcontainer, terminal);
    }
    const commandProcess = await webcontainer.spawn('jsh', ['-c', command]);
    if (terminal) {
        commandProcess.output.pipeTo(
            new WritableStream({
                write(data) {
                    terminal.write(data);
                },
            }),
        );
    }
    return commandProcess.exit;
};
