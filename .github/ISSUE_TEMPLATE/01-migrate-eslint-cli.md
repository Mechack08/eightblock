---
name: Migrate frontend to ESLint CLI
about: Replace deprecated `next lint` with direct ESLint CLI
title: 'Migrate frontend to ESLint CLI from deprecated next lint'
labels: ['maintenance', 'frontend']
assignees: ''
---

## Summary

Next.js 16 will remove the `next lint` command. The frontend currently uses this deprecated command and shows warnings in CI/local development. We need to migrate to using ESLint CLI directly.

**Current warning:**

```
`next lint` is deprecated and will be removed in Next.js 16.
For new projects, use create-next-app to choose your preferred linter.
For existing projects, migrate to the ESLint CLI:
npx @next/codemod@canary next-lint-to-eslint-cli .
```

## Proposed Solution

1. Run the official Next.js codemod:
   ```bash
   cd frontend
   npx @next/codemod@canary next-lint-to-eslint-cli .
   ```
2. Update `frontend/package.json` lint script to use `eslint` directly
3. Update any related documentation in README
4. Test that linting still works correctly with existing rules

## Alternatives

- Manually create `eslint.config.js` following Next.js ESLint flat config
- Wait until Next.js 16 forces the migration (not recommended)

## Additional Context

- Related: Backend already migrated to ESLint v9 flat config
- Next.js migration guide: https://nextjs.org/docs/app/building-your-application/configuring/eslint
- This is a breaking change coming in Next.js 16

## Acceptance Criteria

- [ ] `next lint` command replaced with `eslint` in package.json
- [ ] ESLint flat config created (eslint.config.js)
- [ ] All existing lint rules preserved
- [ ] CI passes without deprecation warnings
- [ ] Documentation updated
