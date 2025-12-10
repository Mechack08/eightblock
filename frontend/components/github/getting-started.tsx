import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { GitHubRepository } from '@/types/github';

interface GettingStartedProps {
  repo: GitHubRepository;
}

export const GettingStarted = ({ repo }: GettingStartedProps) => {
  return (
    <Card className="p-8 bg-gradient-to-br from-[#080808]/5 to-[#080808]/10 dark:from-primary/5 dark:to-primary/10 border-[#080808]/20 dark:border-primary/20">
      <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
      <p className="text-muted-foreground mb-6">
        Clone the repository and start contributing in minutes:
      </p>
      <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 font-mono text-sm mb-6 border border-border">
        <div className="mb-2 text-muted-foreground"># Clone the repository</div>
        <div className="mb-4">git clone {repo.html_url}.git</div>
        <div className="mb-2 text-muted-foreground"># Install dependencies</div>
        <div className="mb-4">pnpm install</div>
        <div className="mb-2 text-muted-foreground"># Start development server</div>
        <div>pnpm dev</div>
      </div>
      <p className="text-sm text-muted-foreground">
        For detailed setup instructions, see the{' '}
        <Link
          href={`${repo.html_url}#getting-started`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          README.md
        </Link>
      </p>
    </Card>
  );
};
