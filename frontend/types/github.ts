export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string;
  license: {
    name: string;
    spdx_id: string;
  } | null;
  topics: string[];
  updated_at: string;
  created_at: string;
}

export interface GitHubApiError {
  message: string;
  status: number;
}

export const GITHUB_CONFIG = {
  REPO_OWNER: 'Eightblockchain',
  REPO_NAME: 'eightblock',
  API_BASE_URL: 'https://api.github.com',
  CACHE_TIME: {
    CONTRIBUTORS: 5 * 60 * 1000, // 5 minutes
    REPOSITORY: 10 * 60 * 1000, // 10 minutes
  },
} as const;
