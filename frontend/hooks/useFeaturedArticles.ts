import { useQuery } from '@tanstack/react-query';
import { Article } from './useInfiniteArticles';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchFeaturedArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/articles?limit=100`);
  if (!response.ok) {
    throw new Error('Failed to fetch featured articles');
  }
  const data = await response.json();
  return data.articles.filter((article: Article) => article.featured);
}

export function useFeaturedArticles() {
  return useQuery({
    queryKey: ['featured-articles'],
    queryFn: fetchFeaturedArticles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
