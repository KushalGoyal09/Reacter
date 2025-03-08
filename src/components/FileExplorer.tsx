import { Files } from '@/types';
import { FileIcon, FolderIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const FileExplorer = ({
    items,
    handleFileSelect,
    selectedFile,
}: {
    items: Files[];
    handleFileSelect: (file: Files) => void;
    selectedFile: string;
}) => {
    const getIcon = (fileName: string) => {
        // Simple logic to determine if it's a directory
        if (fileName.includes('/') && !fileName.split('/').pop()?.includes('.')) {
            return <FolderIcon size={16} className="mr-2 text-muted-foreground" />;
        }
        return <FileIcon size={16} className="mr-2 text-muted-foreground" />;
    };

    return (
        <div className="text-sm">
            <h3 className="font-semibold mb-2 px-2">Files</h3>
            <ul className="space-y-1">
                {items.map((file, index) => (
                    <li
                        key={index}
                        className={cn(
                            'cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 flex items-center',
                            selectedFile === file.file_name ? 'bg-accent text-accent-foreground' : '',
                        )}
                        onClick={() => handleFileSelect(file)}
                    >
                        {getIcon(file.file_name)}
                        <span className="truncate">{file.file_name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileExplorer;
