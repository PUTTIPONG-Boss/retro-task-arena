import { useState } from 'react';
import { useGetRepoTree, GitTreeItem } from '../services/git.service';
import { ChevronRight, ChevronDown, Folder, FileCode } from 'lucide-react';
import PixelSearch from "@/components/icons/PixelSearch";
import { cn } from '@/lib/utils';

interface FileTreeProps {
  repoUrl: string;
  onFileSelect: (path: string) => void;
  selectedPath?: string;
  branch?: string;
}

const FileTreeItem = ({ 
  item, 
  repoUrl, 
  onFileSelect, 
  selectedPath,
  level = 0,
  branch
}: { 
  item: GitTreeItem; 
  repoUrl: string; 
  onFileSelect: (path: string) => void;
  selectedPath?: string;
  level?: number;
  branch?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = selectedPath === item.path;

  if (item.type === 'tree') {
    return (
      <div className="select-none">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 py-1 px-2 cursor-pointer hover:bg-muted/50 transition-colors group",
            isSelected && "bg-muted"
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isOpen ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
          <Folder size={14} className={cn("text-accent", isOpen ? "fill-accent/20" : "")} />
          <span className="font-pixel text-[8px] text-foreground/90 group-hover:text-accent">{item.name}</span>
        </div>
        
        {isOpen && (
          <FileTreeLevel 
            repoUrl={repoUrl} 
            path={item.path} 
            onFileSelect={onFileSelect} 
            selectedPath={selectedPath}
            level={level + 1}
            branch={branch}
          />
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={() => onFileSelect(item.path)}
      className={cn(
        "flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors group",
        isSelected ? "bg-accent/10 border-r-2 border-accent" : "hover:bg-muted/30"
      )}
      style={{ paddingLeft: `${level * 12 + 22}px` }}
    >
      <FileCode size={14} className={cn(isSelected ? "text-accent" : "text-muted-foreground")} />
      <span className={cn(
        "font-pixel text-[8px] transition-colors",
        isSelected ? "text-accent" : "text-foreground/80 group-hover:text-foreground"
      )}>
        {item.name}
      </span>
    </div>
  );
};

const FileTreeLevel = ({ 
  repoUrl, 
  path = '', 
  onFileSelect, 
  selectedPath,
  level = 0,
  branch
}: { 
  repoUrl: string; 
  path?: string; 
  onFileSelect: (path: string) => void;
  selectedPath?: string;
  level?: number;
  branch?: string;
}) => {
  const { data: items, isLoading, isError } = useGetRepoTree(repoUrl, path, branch);

  if (isLoading && level === 0) {
    return (
      <div className="p-4 flex flex-col items-center gap-2 opacity-50">
        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        <span className="font-pixel text-[6px]">Loading Tree...</span>
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 font-pixel text-[7px] text-destructive">Failed to load tree</div>;
  }

  if (!items || items.length === 0) {
    if (level === 0) return <div className="p-4 font-pixel text-[7px] text-muted-foreground">No files found</div>;
    return null;
  }

  // Sort: Folders first, then files
  const sortedItems = [...items].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'tree' ? -1 : 1;
  });

  return (
    <div>
      {sortedItems.map((item) => (
        <FileTreeItem 
          key={item.id} 
          item={item} 
          repoUrl={repoUrl} 
          onFileSelect={onFileSelect} 
          selectedPath={selectedPath}
          level={level}
          branch={branch}
        />
      ))}
    </div>
  );
};

export const FileTree = ({ repoUrl, onFileSelect, selectedPath, branch }: FileTreeProps) => {
  return (
    <div className="flex flex-col h-full bg-background/50 border-r border-pixel-shadow/20">
      <div className="p-3 border-b border-pixel-shadow/10 flex items-center justify-between">
        <span className="font-pixel text-[8px] text-accent uppercase tracking-tighter">Repository</span>
        <PixelSearch size={12} className="text-muted-foreground cursor-help" />
      </div>
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        <FileTreeLevel repoUrl={repoUrl} onFileSelect={onFileSelect} selectedPath={selectedPath} branch={branch} />
      </div>
    </div>
  );
};
