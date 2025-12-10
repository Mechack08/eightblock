import { Star, GitFork, Eye, AlertCircle } from 'lucide-react';

interface RepositoryStatsProps {
  stars: number;
  forks: number;
  watchers: number;
  issues: number;
}

export const RepositoryStats = ({ stars, forks, watchers, issues }: RepositoryStatsProps) => {
  const stats = [
    { icon: Star, label: 'Stars', value: stars, colorClass: 'text-[#080808] dark:text-yellow-500' },
    { icon: GitFork, label: 'Forks', value: forks, colorClass: 'text-[#080808] dark:text-primary' },
    {
      icon: Eye,
      label: 'Watchers',
      value: watchers,
      colorClass: 'text-[#080808] dark:text-primary',
    },
    {
      icon: AlertCircle,
      label: 'Open Issues',
      value: issues,
      colorClass: 'text-[#080808] dark:text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, colorClass }) => (
        <div key={label} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <Icon className={`h-5 w-5 ${colorClass}`} />
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
