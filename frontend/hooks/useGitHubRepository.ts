import { useQuery } from '@tanstack/react-query';
import { githubService } from '@/lib/services/github-service';
import { GITHUB_CONFIG } from '@/types/github';

export const useGitHubRepository = () => {
  return useQuery({
    queryKey: ['github', 'repository'],
    queryFn: () => githubService.getRepository(),
    staleTime: GITHUB_CONFIG.CACHE_TIME.REPOSITORY,
    gcTime: GITHUB_CONFIG.CACHE_TIME.REPOSITORY * 2,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
