'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { deleteArticle } from '@/lib/api';

interface ArticleCardProps {
  article: any;
  onDelete?: () => void;
}

export function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${article.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteArticle(article.id);
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant={article.status === 'PUBLISHED' ? 'default' : 'outline'}
              className={
                article.status === 'PUBLISHED'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'border-[#080808] text-[#080808]'
              }
            >
              {article.status}
            </Badge>
            <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
            {article.status === 'PUBLISHED' && article._count?.likes > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="h-3 w-3" />
                {article._count.likes} likes
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
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
