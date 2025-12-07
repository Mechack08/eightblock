import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { Article } from '@/lib/mock-data';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant={article.status === 'published' ? 'default' : 'outline'}
              className={
                article.status === 'published'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'border-[#080808] text-[#080808]'
              }
            >
              {article.status}
            </Badge>
            <span className="text-xs text-gray-500">{article.date}</span>
            {article.status === 'published' && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="h-3 w-3" />
                {article.views.toLocaleString()} views
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-[#080808] mb-2">{article.title}</h3>
          <p className="text-gray-600 mb-3">{article.description}</p>
          <Badge variant="outline" className="text-xs">
            {article.category}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-red-200 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
