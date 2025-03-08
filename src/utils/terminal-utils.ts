import { WebContainer } from '@webcontainer/api';
import { Terminal } from '@xterm/xterm';

export async function startShell(terminal: Terminal, webcontainer: WebContainer) {
    const shellProcess = await webcontainer.spawn('jsh', {
        terminal: {
            cols: terminal.cols,
            rows: terminal.rows,
        },
    });
    shellProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                terminal.write(data);
            },
        }),
    );
    const input = shellProcess.input.getWriter();
    terminal.onData((data) => {
        input.write(data);
    });
    return shellProcess;
}
