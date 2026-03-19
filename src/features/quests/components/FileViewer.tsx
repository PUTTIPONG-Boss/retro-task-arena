import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { useGetFileContent } from '../services/git.service';
import { FileText, Cpu, Code2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileViewerProps {
  repoUrl: string;
  path: string;
  branch?: string;
}

const getLanguage = (path: string) => {
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx': return 'javascript';
    case 'ts':
    case 'tsx': return 'typescript';
    case 'go': return 'go';
    case 'py': return 'python';
    case 'json': return 'json';
    case 'md': return 'markdown';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'yml':
    case 'yaml': return 'yaml';
    case 'dockerfile': return 'dockerfile';
    default: return 'text';
  }
};

export const FileViewer = ({ repoUrl, path, branch = 'main' }: FileViewerProps) => {
  const { data: content, isLoading, isError, error } = useGetFileContent(repoUrl, path, branch);
  const language = getLanguage(path);
  const isMarkdown = language === 'markdown';

  if (!path) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-10 opacity-30">
        <Cpu size={48} className="mb-4" />
        <p className="font-pixel text-[10px]">Select a file to view its content</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 gap-4">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="font-pixel text-[8px] text-accent">ACCESSING DATA FROM {repoUrl.split('/')[2]}...</p>
      </div>
    );
  }

  if (isError) {
    const isPrivate = (error as any)?.response?.status === 401 || (error as any)?.response?.status === 404;
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center max-w-md mx-auto">
        {isPrivate ? (
          <>
            <div className="pixel-border bg-destructive/10 border-destructive p-6 mb-6">
              <AlertTriangle size={32} className="text-destructive mx-auto mb-4" />
              <h3 className="font-pixel text-[10px] text-destructive mb-3 uppercase">Access Denied</h3>
              <p className="font-pixel text-[8px] text-foreground leading-relaxed mb-4">
                This repository is PRIVATE. Our system cannot read its contents without a secret key.
              </p>
              <div className="pixel-inset bg-background p-3 text-left">
                <p className="font-pixel text-[7px] text-muted-foreground mb-1">RECOMMENDED ACTION:</p>
                <p className="text-lg text-foreground">Follow the instructions in the 🛡️ Workflow tab to clone and work on this quest locally.</p>
              </div>
            </div>
          </>
        ) : (
          <p className="font-pixel text-[8px] text-destructive">Error: Failed to fetch file content.</p>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background/30 overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b border-pixel-shadow/10 bg-background/50">
        <FileText size={16} className="text-accent" />
        <span className="font-pixel text-[8px] text-foreground/90 truncate">{path}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-pixel text-[7px] text-muted-foreground uppercase">{language}</span>
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" title="Connected"></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar p-6">
        {isMarkdown ? (
          <article className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-pixel prose-headings:text-accent prose-headings:pixel-text-shadow">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || ''}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="rounded-lg overflow-hidden border border-pixel-shadow/10 text-xl w-full max-w-full bg-background/50">
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                backgroundColor: 'transparent',
                fontSize: '1.2rem',
                lineHeight: '1.6',
                width: '100%',
                maxWidth: '100%',
                overflowX: 'auto',
              }}
              showLineNumbers
              wrapLines={true}
              lineProps={{ style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }}
            >
              {content || ''}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
};
