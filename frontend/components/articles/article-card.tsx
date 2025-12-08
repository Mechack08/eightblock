import Link from 'next/link';
import { Post } from 'contentlayer/generated';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

export function ArticleCard({ post }: { post: Post }) {
  return (
    <Link href={`/articles/${post.slug}`} className="group">
      <Card className="overflow-hidden border-none shadow-none transition-transform hover:scale-[1.02]">
        {/* Image Placeholder */}
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-400 to-purple-500">
          <div className="flex h-full items-center justify-center">
            {/* Placeholder - in production, use actual article images */}
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {post.category}
          </p>
          <h3 className="text-xl font-bold text-[#080808] group-hover:underline">{post.title}</h3>
          <p className="line-clamp-2 text-sm text-gray-600">{post.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Avatar
              src={typeof post.author === 'object' ? post.author?.avatarUrl : null}
              name={typeof post.author === 'object' ? post.author?.name : post.author}
              size="xs"
            />
            <span>
              {typeof post.author === 'object' && post.author?.name
                ? post.author.name
                : post.author}{' '}
              ·{' '}
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              · {post.readingTime} min read
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
