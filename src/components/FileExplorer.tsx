import { FileStructure } from '@/types';

interface FileExplorerProps {
    files: FileStructure[];
    onFileSelect: (path: string) => void;
}

const FileExplorer = ({ files, onFileSelect }: FileExplorerProps) => {
    const renderTree = (items: FileStructure[], path: string = '') => {
        return items.map((item) => (
            <div key={item.name} className="ml-4">
                {item.type === 'folder' ? (
                    <div>
                        <div className="font-bold">{item.name}/</div>
                        {item.children && renderTree(item.children, `${path}/${item.name}`)}
                    </div>
                ) : (
                    <div
                        className="cursor-pointer hover:bg-gray-100 p-1"
                        onClick={() => onFileSelect(`${path}/${item.name}`)}
                    >
                        {item.name}
                    </div>
                )}
            </div>
        ));
    };

    return <div className="p-2">{renderTree(files)}</div>;
};

export default FileExplorer;
