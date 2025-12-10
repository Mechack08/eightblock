'use client';

import { Github } from 'lucide-react';
import { PageHeader } from '@/components/github/page-header';
import { PageFooter } from '@/components/github/page-footer';
import { LoadingState } from '@/components/github/loading-state';
import { ErrorState } from '@/components/github/error-state';
import { RepositoryHeader } from '@/components/github/repository-header';
import { RepositoryStats } from '@/components/github/repository-stats';
import { RepositoryActions } from '@/components/github/repository-actions';
import { QuickLinks } from '@/components/github/quick-links';
import { GettingStarted } from '@/components/github/getting-started';
import { useGitHubRepository } from '@/hooks/useGitHubRepository';
import { githubService } from '@/lib/services/github-service';

export default function GitHubRepositoryPage() {
  const { data: repo, isLoading, error } = useGitHubRepository();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          icon={Github}
          title="GitHub Repository"
          description="EightBlock is fully open-source. Explore the code, report issues, submit pull requests, or fork the project to create your own version."
        />

        {isLoading && <LoadingState message="Loading repository information..." />}

        {error && (
          <ErrorState
            message="Unable to load repository information from GitHub. Please try again later."
            linkUrl={githubService.getRepositoryUrl()}
            linkText="View repository on GitHub"
          />
        )}

        {!isLoading && !error && repo && (
          <>
            <RepositoryHeader repo={repo} />

            <RepositoryStats
              stars={repo.stargazers_count}
              forks={repo.forks_count}
              watchers={repo.watchers_count}
              issues={repo.open_issues_count}
            />

            <RepositoryActions />

            <div className="mt-8">
              <QuickLinks />
            </div>

            <GettingStarted repo={repo} />
          </>
        )}

        <PageFooter
          links={[
            { href: '/privacy', label: 'Privacy Policy' },
            { href: '/terms', label: 'Terms of Service' },
            { href: '/contributors', label: 'Contributors' },
          ]}
        />
      </div>
    </div>
  );
}
