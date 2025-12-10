import { useQuery } from '@tanstack/react-query';
import { githubService } from '@/lib/services/github-service';
import { GITHUB_CONFIG } from '@/types/github';

export const useGitHubContributors = () => {
  return useQuery({
    queryKey: ['github', 'contributors'],
    queryFn: () => githubService.getContributors(),
    staleTime: GITHUB_CONFIG.CACHE_TIME.CONTRIBUTORS,
    gcTime: GITHUB_CONFIG.CACHE_TIME.CONTRIBUTORS * 2,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
