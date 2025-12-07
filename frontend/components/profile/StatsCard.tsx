import { Card } from '@/components/ui/card';
import { Eye, Heart, Coins, TrendingUp, FileText, Users } from 'lucide-react';

interface StatsCardProps {
  articles: Array<{ views: number; status: string }>;
}

export function StatsCard({ articles }: StatsCardProps) {
  const publishedArticles = articles.filter((a) => a.status === 'published');
  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const totalArticles = articles.length;
  const totalPublished = publishedArticles.length;

  // Mock likes data - will be real in V2
  const totalLikes = 147;

  const stats = [
    {
      label: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Likes',
      value: totalLikes.toLocaleString(),
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Articles',
      value: `${totalPublished}/${totalArticles}`,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subtitle: 'Published',
    },
    {
      label: 'Rewards Earned',
      value: 'Soon',
      icon: Coins,
      color: 'text-[#080808]',
      bgColor: 'bg-gray-100',
      subtitle: 'Coming in V2',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-[#080808]">{stat.value}</p>
                {stat.subtitle && <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>}
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
