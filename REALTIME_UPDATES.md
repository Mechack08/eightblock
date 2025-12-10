# Real-Time Article Updates Implementation

## Overview

Implemented real-time article updates on the homepage that immediately reflect changes when users interact with articles (likes, comments) on article detail pages. This creates a dynamic, engaging experience and enables truly real-time trending calculations.

## Branch

- **Branch Name**: `feat/realtime-article-updates`
- **Created From**: `feat/skeleton-loading`

## How It Works

### React Query Cache Invalidation Strategy

When a user performs an action on an article (like, comment, delete comment), we invalidate the relevant React Query caches. This triggers automatic refetching of the data, ensuring the homepage always shows the latest engagement metrics.

### Modified Files

#### 1. `/frontend/hooks/useArticleInteractions.ts`

**Changes:**

- Added cache invalidation for all article list queries when mutations succeed
- Invalidates: `['articles']` - catches all article queries including infinite scroll
- Invalidates: `['trending-articles']` - updates trending section immediately

**Affected Mutations:**

- `likeMutation` - When user likes/unlikes an article
- `commentMutation` - When user posts a comment
- `deleteCommentMutation` - When user deletes a comment

**Code Pattern:**

```typescript
onSuccess: () => {
  // Invalidate specific article
  queryClient.invalidateQueries({ queryKey: ['article', articleSlug] });

  // Invalidate homepage article lists for real-time updates
  queryClient.invalidateQueries({ queryKey: ['articles'] });
  queryClient.invalidateQueries({ queryKey: ['trending-articles'] });

  // Toast notification
};
```

#### 2. `/frontend/hooks/useTrendingArticles.ts`

**Changes:**

- Reduced `staleTime` from 5 minutes to 30 seconds
- Reduced `refetchInterval` from 5 minutes to 2 minutes
- More aggressive refetching for real-time trending updates

**Before:**

```typescript
staleTime: 5 * 60 * 1000, // 5 minutes
refetchInterval: 5 * 60 * 1000, // 5 minutes
```

**After:**

```typescript
staleTime: 30 * 1000, // 30 seconds - aggressive for real-time trending
refetchInterval: 2 * 60 * 1000, // 2 minutes
```

#### 3. `/frontend/hooks/useInfiniteArticles.ts`

**Changes:**

- Reduced `staleTime` from 1 minute to 30 seconds
- More aggressive refetching for real-time article updates

**Before:**

```typescript
staleTime: 60 * 1000, // 1 minute
```

**After:**

```typescript
staleTime: 30 * 1000, // 30 seconds - aggressive for real-time updates
```

## User Experience Flow

### Scenario: User Likes an Article

1. **User on Article Detail Page**
   - User clicks "Like" button on article detail page
   - `likeMutation` executes and sends request to backend
   - Optimistic update shows immediate feedback

2. **Homepage Updates Automatically**
   - On success, `queryClient.invalidateQueries({ queryKey: ['articles'] })` is called
   - React Query marks all article queries as stale
   - Homepage automatically refetches article data
   - Like count updates within seconds without page refresh

3. **Trending Section Updates**
   - `queryClient.invalidateQueries({ queryKey: ['trending-articles'] })` triggers
   - Trending algorithm recalculates with new engagement metrics
   - Articles may move up/down in trending section
   - Creates dynamic, real-time trending experience

### Scenario: User Posts a Comment

1. **Comment Posted**
   - User submits comment on article detail page
   - `commentMutation` executes
   - Comment appears immediately in comments section

2. **Engagement Metrics Update**
   - Comment count increments in article detail page
   - Homepage refetches and shows updated comment count
   - Trending score increases (comments have 2x weight)
   - Article may rise in trending section

3. **Real-Time Trending**
   - Articles with active discussion move up
   - Older articles with no engagement move down
   - Creates incentive for quality content and engagement

## Performance Considerations

### Cache Invalidation Strategy

- **Targeted Invalidation**: Uses query key patterns to invalidate only necessary queries
- **Automatic Batching**: React Query batches multiple invalidations
- **Smart Refetching**: Only refetches queries that are currently mounted/in use

### Stale Time Optimization

- **30 Seconds**: Balances freshness with server load
- **Not Real-Time Polling**: Only refetches when queries are invalidated or stale
- **Background Refetching**: React Query refetches in background without blocking UI

### Network Efficiency

- **Cache First**: React Query serves cached data while revalidating
- **Deduplication**: Multiple components using same query share cache
- **Conditional Fetching**: Queries only run when enabled and mounted

## Benefits

### 1. Real-Time Trending Algorithm

- Trending section reflects current engagement immediately
- Users see fresh, actively discussed content
- Encourages community participation

### 2. Accurate Engagement Metrics

- Like and comment counts always up-to-date
- No stale data misleading users
- Better user trust in platform

### 3. Dynamic User Experience

- Homepage feels alive and responsive
- Creates sense of active community
- Reduces perceived staleness of content

### 4. SEO and Engagement

- Hot content rises quickly
- Quality content gets more visibility
- Better content discovery

## Testing Recommendations

### Manual Testing Flow

1. Open homepage in one tab
2. Open article detail page in another tab
3. Like the article in detail tab
4. Switch to homepage tab
5. Observe like count update within 30 seconds

### Comment Testing

1. Open homepage
2. Navigate to article and post comment
3. Return to homepage
4. Verify comment count incremented
5. Check if article moved in trending (if applicable)

### Trending Algorithm Testing

1. Identify article in trending section (note position)
2. Open article and add likes/comments
3. Return to trending section
4. Verify article position adjusted based on new engagement

## Future Enhancements

### WebSocket Integration (Optional)

For even more real-time updates without polling:

- Add WebSocket connection for instant updates
- Emit events when articles receive likes/comments
- Push updates to all connected clients immediately
- Reduces server load from polling

### Optimistic Updates on Homepage

- Show engagement updates immediately on homepage
- Rollback if server request fails
- Even faster perceived performance

### Notification System

- Notify authors when their articles trend
- Alert when articles receive engagement
- Encourage content creation

## Configuration

### Adjusting Update Frequency

To make updates more/less frequent, modify stale times:

**More Aggressive (faster updates, more server load):**

```typescript
staleTime: 10 * 1000, // 10 seconds
refetchInterval: 1 * 60 * 1000, // 1 minute
```

**Less Aggressive (slower updates, less server load):**

```typescript
staleTime: 2 * 60 * 1000, // 2 minutes
refetchInterval: 5 * 60 * 1000, // 5 minutes
```

**Current Settings (balanced):**

```typescript
staleTime: 30 * 1000, // 30 seconds
refetchInterval: 2 * 60 * 1000, // 2 minutes
```

## Conclusion

This implementation provides a robust, performant real-time update system that:

- ✅ Updates homepage immediately when articles receive engagement
- ✅ Enables truly real-time trending calculations
- ✅ Improves user experience with fresh data
- ✅ Maintains good performance through smart caching
- ✅ Scalable and maintainable architecture

The system is production-ready and can be further enhanced with WebSocket integration if needed for even more immediate updates.
