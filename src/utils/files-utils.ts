export function getFilePathAndName(relativePath: string) {
    const parts = relativePath.split('/');
    const fileName = parts.pop();
    if (!fileName) {
        throw new Error('No file name found');
    }
    const folderPath = parts.join('/') || '.';
    return [folderPath, fileName];
}
