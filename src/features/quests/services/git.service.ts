import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export type GitPlatform = 'gitlab' | 'github' | 'unknown';

export interface RepoInfo {
  platform: GitPlatform;
  owner: string;
  repo: string;
  projectId?: string; // For GitLab encoded path
}

export interface GitTreeItem {
  id: string;
  name: string;
  type: 'tree' | 'blob';
  path: string;
  mode?: string;
}

export const parseRepoUrl = (url: string): RepoInfo => {
  try {
    const uri = new URL(url);
    const parts = uri.pathname.split('/').filter(Boolean);

    if (uri.hostname.includes('gitlab.com')) {
      // GitLab can have nested groups: /group/subgroup/repo
      const cleanPath = uri.pathname.replace(/\.git$/, '').replace(/^\//, '');
      const parts = cleanPath.split('/');
      return {
        platform: 'gitlab',
        owner: parts[0],
        repo: parts[parts.length - 1],
        projectId: encodeURIComponent(cleanPath),
      };
    }
    
    if (uri.hostname.includes('github.com')) {
      const cleanPath = uri.pathname.replace(/\.git$/, '').replace(/^\//, '');
      const parts = cleanPath.split('/');
      return {
        platform: 'github',
        owner: parts[0],
        repo: parts[parts.length - 1],
      };
    }

    return { platform: 'unknown', owner: '', repo: '' };
  } catch (e) {
    return { platform: 'unknown', owner: '', repo: '' };
  }
};

const GITLAB_BASE = 'https://gitlab.com/api/v4';
const GITHUB_BASE = 'https://api.github.com';

export const useGetRepoTree = (url: string | undefined, path = '', ref = 'main') => {
  const info = url ? parseRepoUrl(url) : null;

  return useQuery({
    queryKey: ['git-tree', url, path, ref],
    enabled: !!info && info.platform !== 'unknown',
    queryFn: async (): Promise<GitTreeItem[]> => {
      if (!info) return [];

      if (info.platform === 'gitlab') {
        const res = await axios.get(`${GITLAB_BASE}/projects/${info.projectId}/repository/tree`, {
          params: { path, ref, per_page: 100 }
        });
        return res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          type: item.type === 'tree' ? 'tree' : 'blob',
          path: item.path,
        }));
      }

      if (info.platform === 'github') {
        const res = await axios.get(`${GITHUB_BASE}/repos/${info.owner}/${info.repo}/contents/${path}`, {
          params: { ref }
        });
        // GitHub returns an array or an object if a single file
        const data = Array.isArray(res.data) ? res.data : [res.data];
        return data.map((item: any) => ({
          id: item.sha,
          name: item.name,
          type: item.type === 'dir' ? 'tree' : 'blob',
          path: item.path,
        }));
      }

      return [];
    },
    retry: false,
  });
};

export const useGetFileContent = (url: string | undefined, path: string, ref = 'main') => {
  const info = url ? parseRepoUrl(url) : null;

  return useQuery({
    queryKey: ['git-content', url, path, ref],
    enabled: !!info && !!path && info.platform !== 'unknown',
    queryFn: async (): Promise<string> => {
      if (!info) return '';

      if (info.platform === 'gitlab') {
        const encodedPath = encodeURIComponent(path);
        const res = await axios.get(`${GITLAB_BASE}/projects/${info.projectId}/repository/files/${encodedPath}/raw`, {
          params: { ref }
        });
        return typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2);
      }

      if (info.platform === 'github') {
        const res = await axios.get(`${GITHUB_BASE}/repos/${info.owner}/${info.repo}/contents/${path}`, {
          params: { ref },
          headers: { Accept: 'application/vnd.github.v3.raw' }
        });
        return typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2);
      }

      return '';
    },
    retry: false,
  });
};

export const useGetRepoMetadata = (url: string | undefined) => {
  const info = url ? parseRepoUrl(url) : null;

  return useQuery({
    queryKey: ['git-meta', url],
    enabled: !!info && info.platform !== 'unknown',
    queryFn: async () => {
      if (!info) return null;

      if (info.platform === 'gitlab') {
        const res = await axios.get(`${GITLAB_BASE}/projects/${info.projectId}`);
        return res.data;
      }

      if (info.platform === 'github') {
        const res = await axios.get(`${GITHUB_BASE}/repos/${info.owner}/${info.repo}`);
        return res.data;
      }

      return null;
    },
    retry: false,
  });
};
