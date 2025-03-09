import reactInitialFiles from './initialFiles';
import { Files } from '@/types';
import { FileSystemTree, DirectoryNode } from '@webcontainer/api';

const getMountFiles = (initialFiles: Files[]): FileSystemTree => {
    const fileSystem: FileSystemTree = {};

    for (const file of initialFiles) {
        const pathParts = file.file_name.split('/');
        let currentLevel = fileSystem;

        for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            if (!currentLevel[part]) {
                currentLevel[part] = { directory: {} };
            }
            currentLevel = (currentLevel[part] as DirectoryNode).directory;
        }

        const fileName = pathParts[pathParts.length - 1];
        currentLevel[fileName] = {
            file: {
                contents: file.content,
            },
        };
    }

    return fileSystem;
};

const reactMountFiles: FileSystemTree = getMountFiles(reactInitialFiles);

export default reactMountFiles;
