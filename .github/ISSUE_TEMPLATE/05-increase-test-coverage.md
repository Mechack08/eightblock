---
name: Increase Test Coverage
about: Add comprehensive tests for API endpoints and React components
title: 'Increase test coverage to 80%'
labels: ['testing', 'good first issue']
assignees: ''
---

## Summary

Current test coverage is minimal (only health check and basic sanity tests). We need comprehensive test coverage to ensure code quality and catch bugs early.

**Current state:**

- Backend: 1 test (health endpoint only)
- Frontend: 1 test (sanity check only)
- Coverage: ~5%

**Goal:**

- Backend: 80% coverage
- Frontend: 80% coverage

## Proposed Solution

### Backend Tests to Add

#### 1. API Endpoint Tests (`src/tests/api/`)

**Articles:**

```typescript
// src/tests/api/articles.test.ts
describe('Article API', () => {
  it('should list all articles', async () => {
    const res = await request(app).get('/api/articles');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get article by slug', async () => {
    const res = await request(app).get('/api/articles/test-slug');
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('test-slug');
  });

  it('should create article when authenticated as admin', async () => {
    // Test with JWT token
  });

  it('should return 401 when creating without auth', async () => {
    // Test unauthorized access
  });
});
```

**Auth:**

```typescript
// src/tests/api/auth.test.ts
describe('Auth API', () => {
  it('should register new user');
  it('should reject duplicate email');
  it('should login with valid credentials');
  it('should return 401 with invalid password');
  it('should return JWT token on successful login');
});
```

**Comments, Likes, Tags, Subscriptions:**

- Similar patterns for each endpoint
- Test success and error cases
- Test authentication/authorization

#### 2. Middleware Tests (`src/tests/middleware/`)

```typescript
// src/tests/middleware/auth.test.ts
describe('requireAuth middleware', () => {
  it('should allow request with valid JWT');
  it('should reject request without token');
  it('should reject request with expired token');
});
```

#### 3. Controller Tests (`src/tests/controllers/`)

Test business logic in isolation with mocked Prisma client

### Frontend Tests to Add

#### 1. Component Tests (`app/**/__tests__/`)

```typescript
// app/__tests__/articles-page.test.tsx
describe('Articles Page', () => {
  it('should render article list');
  it('should filter articles by category');
  it('should show loading state');
  it('should handle API errors gracefully');
});

// components/__tests__/article-card.test.tsx
describe('ArticleCard', () => {
  it('should display article title and description');
  it('should show featured badge for featured articles');
  it('should format date correctly');
  it('should link to article detail page');
});
```

#### 2. Hook Tests (`lib/__tests__/`)

If custom hooks are added:

```typescript
describe('useArticles hook', () => {
  it('should fetch and return articles');
  it('should handle loading state');
  it('should handle errors');
});
```

#### 3. Utility Tests (`lib/__tests__/`)

```typescript
// lib/__tests__/utils.test.ts
describe('cn utility', () => {
  it('should merge classnames correctly');
});
```

### Setup Needed

1. **Add test utilities:**

   ```bash
   pnpm add -D @testing-library/react @testing-library/user-event
   pnpm add -D --filter ./backend @types/supertest
   ```

2. **Configure coverage reporting:**

   ```typescript
   // vitest.config.ts
   export default defineConfig({
     test: {
       coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
         thresholds: {
           lines: 80,
           functions: 80,
           branches: 80,
           statements: 80,
         },
       },
     },
   });
   ```

3. **Add coverage scripts:**
   ```json
   {
     "scripts": {
       "test:coverage": "vitest run --coverage",
       "test:watch": "vitest"
     }
   }
   ```

## Alternatives

- Use different testing framework (Jest instead of Vitest) - less modern
- Lower coverage target (60%) - reduces quality bar
- Only test critical paths - misses edge cases

## Additional Context

- Vitest already configured
- Testing library already installed for frontend
- Supertest already available for backend API tests
- Consider adding Playwright for E2E tests (separate issue)

## Acceptance Criteria

- [ ] All API endpoints have tests (success + error cases)
- [ ] All middleware functions tested
- [ ] Key React components have tests
- [ ] Coverage reports generated in CI
- [ ] Coverage thresholds met (80%)
- [ ] README updated with testing instructions
- [ ] CI fails if coverage drops below threshold

## Implementation Steps

1. Start with backend API tests (high value, easier)
2. Add middleware tests
3. Add frontend component tests
4. Configure coverage reporting
5. Update CI to enforce coverage thresholds
6. Document testing guidelines in CONTRIBUTING.md

## Good First Issue Tasks

These can be split into smaller issues:

- [ ] Add tests for `/api/tags` endpoints
- [ ] Add tests for `/api/subscriptions` endpoints
- [ ] Add tests for `ArticleCard` component
- [ ] Add tests for `Hero` component
- [ ] Set up coverage reporting
