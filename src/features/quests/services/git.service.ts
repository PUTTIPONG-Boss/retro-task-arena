import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export type GitPlatform = 'gitlab' | 'github' | 'unknown';

export interface GitTreeItem {
  id: string;     // maps from path (used as key)
  name: string;
  type: 'tree' | 'blob';
  path: string;
  mode?: string;
}

// Response shapes from backend
interface BackendGitFile {
  name: string;
  path: string;
  type: string;      // "file" | "dir"
  size: number;
  htmlUrl: string;
  downloadUrl: string;
}

interface BackendGitTree {
  repoInfo: {
    provider: string;
    owner: string;
    repo: string;
    branch: string;
    url: string;
  };
  files: BackendGitFile[];
  total: number;
}

interface BackendGitFileContent {
  path: string;
  content: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetches the full recursive file tree for a repo via the backend.
 * Backend: GET /v1/gitapi/repo?git_repo_url=...&branch=...
 *
 * Note: The old frontend version fetched per-directory (non-recursive),
 * using path as a filter. The backend returns ALL files recursively.
 * We filter by path prefix on the client so the FileTree component still works.
 */
export const useGetRepoTree = (url: string | undefined, path = '', ref = 'main') => {
  return useQuery({
    queryKey: ['git-tree', url, path, ref],
    enabled: !!url,
    queryFn: async (): Promise<GitTreeItem[]> => {
      if (!url) return [];

      const res = await apiClient.get<BackendGitTree>('/gitapi/repo', {
        params: {
          git_repo_url: url,
          branch: ref,
        },
      });

      const allFiles = res.data.files;

      // Filter to only show items at the current directory level (path prefix match)
      const items = allFiles.filter((file) => {
        if (path === '') {
          // Root level: no slash in path
          return !file.path.includes('/');
        }
        // Subdirectory: starts with path/ but has no further slashes
        if (!file.path.startsWith(path + '/')) return false;
        const remainder = file.path.slice(path.length + 1);
        return !remainder.includes('/');
      });

      return items.map((file) => ({
        id: file.path,
        name: file.name,
        type: file.type === 'dir' ? 'tree' : 'blob',
        path: file.path,
      }));
    },
    staleTime: 1000 * 60 * 5, // cache 5 minutes
    retry: false,
  });
};

/**
 * Fetches the raw content of a file via the backend.
 * Backend: GET /v1/gitapi/file?git_repo_url=...&branch=...&path=...
 */
export const useGetFileContent = (url: string | undefined, path: string, ref = 'main') => {
  return useQuery({
    queryKey: ['git-content', url, path, ref],
    enabled: !!url && !!path,
    queryFn: async (): Promise<string> => {
      if (!url || !path) return '';

      const res = await apiClient.get<BackendGitFileContent>('/gitapi/file', {
        params: {
          git_repo_url: url,
          branch: ref,
          path: path,
        },
      });

      return res.data.content;
    },
    retry: false,
  });
};

/**
 * Fetches repo metadata. Currently not used in any component.
 * Kept for future use – still calls external API directly (no sensitive data).
 */
export const useGetRepoMetadata = (url: string | undefined) => {
  return useQuery({
    queryKey: ['git-meta', url],
    enabled: !!url,
    queryFn: async () => {
      // TODO: Move to backend when needed
      return null;
    },
    retry: false,
  });
};
