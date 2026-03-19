import { useState } from 'react';
import { FileTree } from './FileTree';
import { FileViewer } from './FileViewer';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RepoExplorerProps {
  repoUrl: string;
  branch?: string;
}

export const RepoExplorer = ({ repoUrl, branch = 'main' }: RepoExplorerProps) => {
  const [selectedPath, setSelectedPath] = useState<string>('README.md');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-[600px] border-[3px] border-pixel-shadow bg-background/80 pixel-border relative overflow-hidden group">
      {/* Sidebar */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out border-r border-pixel-shadow/20 overflow-hidden",
          isSidebarOpen ? "w-[240px]" : "w-0"
        )}
      >
        <FileTree 
          repoUrl={repoUrl} 
          onFileSelect={setSelectedPath} 
          selectedPath={selectedPath} 
          branch={branch}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-3 left-3 z-10 p-1 bg-background/50 border border-pixel-shadow/10 hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
          title={isSidebarOpen ? "Hide Explorer" : "Show Explorer"}
        >
          {isSidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
        </button>
        
        <FileViewer 
          repoUrl={repoUrl} 
          path={selectedPath} 
          branch={branch} 
        />
      </div>
    </div>
  );
};
