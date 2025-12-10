import { GitHubContributor, GitHubRepository, GitHubApiError, GITHUB_CONFIG } from '@/types/github';

class GitHubService {
  private readonly baseUrl = GITHUB_CONFIG.API_BASE_URL;
  private readonly owner = GITHUB_CONFIG.REPO_OWNER;
  private readonly repo = GITHUB_CONFIG.REPO_NAME;

  private async fetchFromGitHub<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error: GitHubApiError = {
        message: `GitHub API error: ${response.status} ${response.statusText}`,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  }

  async getContributors(): Promise<GitHubContributor[]> {
    const contributors = await this.fetchFromGitHub<GitHubContributor[]>(
      `/repos/${this.owner}/${this.repo}/contributors?per_page=100`
    );

    // Filter out bots and sort by contributions
    return contributors
      .filter((contributor) => contributor.type === 'User')
      .sort((a, b) => b.contributions - a.contributions);
  }

  async getRepository(): Promise<GitHubRepository> {
    return this.fetchFromGitHub<GitHubRepository>(`/repos/${this.owner}/${this.repo}`);
  }

  getRepositoryUrl(): string {
    return `https://github.com/${this.owner}/${this.repo}`;
  }

  getContributorsUrl(): string {
    return `${this.getRepositoryUrl()}/graphs/contributors`;
  }

  getIssuesUrl(): string {
    return `${this.getRepositoryUrl()}/issues`;
  }

  getForkUrl(): string {
    return `${this.getRepositoryUrl()}/fork`;
  }

  getFileUrl(filePath: string): string {
    return `${this.getRepositoryUrl()}/blob/main/${filePath}`;
  }
}

export const githubService = new GitHubService();
