import { Files } from '@/types';
import {
    ChevronRight,
    FileIcon,
    FolderIcon,
    FileJsonIcon,
    FileTextIcon,
    ImageIcon,
    FileTypeIcon,
    FileCogIcon,
    FileInputIcon,
    BracesIcon,
    FileTerminalIcon,
    FileWarningIcon,
    Hash,
    FileCode2Icon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FileTreeNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children: FileTreeNode[];
}

const FileExplorer = ({
    items,
    handleFileSelect,
    selectedFile,
}: {
    items: Files[];
    handleFileSelect: (file: Files) => void;
    selectedFile: string;
}) => {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

    const buildFileTree = (files: Files[]): FileTreeNode[] => {
        const root: FileTreeNode[] = [];

        files.forEach((file) => {
            const parts = file.file_name.split('/');
            let currentLevel = root;

            parts.forEach((part, index) => {
                const isLastPart = index === parts.length - 1;
                const currentPath = parts.slice(0, index + 1).join('/');
                const existing = currentLevel.find((node) => node.name === part);

                if (!existing) {
                    const newNode: FileTreeNode = {
                        name: part,
                        path: currentPath,
                        type: isLastPart ? 'file' : 'folder',
                        children: [],
                    };
                    currentLevel.push(newNode);
                    currentLevel = newNode.children;
                } else {
                    currentLevel = existing.children;
                }
            });
        });

        return root;
    };

    const toggleFolder = (path: string) => {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'js':
            case 'jsx':
                return <FileTypeIcon size={16} className="mr-2 text-yellow-400" />;
            case 'ts':
            case 'tsx':
                return <FileCogIcon size={16} className="mr-2 text-blue-400" />;
            case 'html':
                return <FileCode2Icon size={16} className="mr-2 text-orange-500" />;
            case 'css':
            case 'scss':
            case 'sass':
                return <BracesIcon size={16} className="mr-2 text-pink-500" />;
            case 'py':
                return <FileTerminalIcon size={16} className="mr-2 text-green-500" />;
            case 'java':
                return <FileInputIcon size={16} className="mr-2 text-red-500" />;
            case 'cpp':
            case 'c':
                return <Hash size={16} className="mr-2 text-blue-500" />;
            case 'json':
                return <FileJsonIcon size={16} className="mr-2 text-yellow-500" />;
            case 'md':
            case 'txt':
                return <FileTextIcon size={16} className="mr-2 text-muted-foreground" />;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'svg':
                return <ImageIcon size={16} className="mr-2 text-purple-400" />;
            case 'yml':
            case 'yaml':
            case 'toml':
            case 'ini':
                return <FileWarningIcon size={16} className="mr-2 text-gray-400" />;
            default:
                return <FileIcon size={16} className="mr-2 text-muted-foreground" />;
        }
    };

    const FileTreeItem = ({ node, depth = 0 }: { node: FileTreeNode; depth?: number }) => {
        const isFolder = node.type === 'folder';
        const isExpanded = expandedFolders.has(node.path);
        const originalFile = items.find((item) => item.file_name === node.path);

        return (
            <>
                <li
                    className={cn(
                        'cursor-pointer hover:bg-accent hover:text-accent-foreground rounded py-1 flex items-center',
                        selectedFile === node.path ? 'bg-accent text-accent-foreground' : '',
                    )}
                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isFolder) {
                            toggleFolder(node.path);
                        } else if (originalFile) {
                            handleFileSelect(originalFile);
                        }
                    }}
                >
                    {isFolder && (
                        <ChevronRight
                            size={16}
                            className={cn('mr-1 transition-transform', isExpanded ? 'rotate-90' : '')}
                        />
                    )}
                    {isFolder ? (
                        <FolderIcon size={16} className="mr-2 text-muted-foreground" />
                    ) : (
                        getFileIcon(node.name)
                    )}
                    <span className="truncate">{node.name}</span>
                </li>
                {isFolder && isExpanded && (
                    <ul>
                        {node.children
                            .sort((a, b) => {
                                // Folders first, then files
                                if (a.type !== b.type) {
                                    return a.type === 'folder' ? -1 : 1;
                                }
                                return a.name.localeCompare(b.name);
                            })
                            .map((child, index) => (
                                <FileTreeItem key={child.path} node={child} depth={depth + 1} />
                            ))}
                    </ul>
                )}
            </>
        );
    };

    const fileTree = buildFileTree(items);

    return (
        <div className="text-sm">
            <h3 className="font-semibold mb-2 px-2">Files</h3>
            <ul className="space-y-0">
                {fileTree
                    .sort((a, b) => {
                        if (a.type !== b.type) {
                            return a.type === 'folder' ? -1 : 1;
                        }
                        return a.name.localeCompare(b.name);
                    })
                    .map((node, index) => (
                        <FileTreeItem key={node.path} node={node} />
                    ))}
            </ul>
        </div>
    );
};

export default FileExplorer;
