import { Badge } from '@/components/ui/badge';
import type { Post } from 'contentlayer/generated';

export function ArticleMeta({ post }: { post: Post }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <span>By {post.author}</span>
      <span>•</span>
      <span>{formattedDate}</span>
      <span>•</span>
      <span>{post.readingTime} min read</span>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
