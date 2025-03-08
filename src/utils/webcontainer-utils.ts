import { SetStateAction } from 'react';
import { Terminal } from '@xterm/xterm';
import { WebContainer } from '@webcontainer/api';
import { Dispatch } from 'react';

export const installPackages = async (webcontainer: WebContainer, terminal: Terminal) => {
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

export const startDevServer = async (
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

export const executeCommand = async (webcontainer: WebContainer, terminal: Terminal, command: string) => {
    console.log('Executing command:', command);
    const commands = command.split(' ');
    const mainCommand = commands[0];
    const args = commands.slice(1);
    const commandProcess = await webcontainer.spawn(mainCommand, args);
    commandProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                terminal.write(data);
            },
        }),
    );
    return commandProcess.exit;
};
