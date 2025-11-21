---
name: Create Article CRUD UI in Admin Portal
about: Build admin interface for managing articles
title: 'Build article management UI in admin portal'
labels: ['feature', 'frontend', 'admin']
assignees: ''
---

## Summary

The admin portal (`/admin`) is currently a placeholder. We need to build a full CRUD interface for managing articles, allowing admins to create, edit, publish, and delete blog posts.

## Proposed Solution

### Pages to Create

1. **Article List (`/admin/articles`)**
   - Table showing all articles with status, author, date
   - Filters: status (draft/published), author, tags
   - Search by title
   - Bulk actions: delete, change status
   - "New Article" button

2. **Create Article (`/admin/articles/new`)**
   - Form fields:
     - Title (required)
     - Slug (auto-generate from title, editable)
     - Description (required)
     - Content (MDX editor)
     - Category (dropdown)
     - Tags (multi-select)
     - Featured checkbox
     - Status (draft/review/published)
     - Publish date picker
   - Preview panel (live MDX rendering)
   - Save as draft / Publish buttons

3. **Edit Article (`/admin/articles/[id]/edit`)**
   - Same form as create
   - Pre-populated with existing data
   - Show edit history/metadata
   - Delete button with confirmation

### Components Needed

- `ArticleForm` - Main form component
- `MDXEditor` - Rich text editor for MDX (consider TipTap or Toast UI)
- `TagSelector` - Multi-select for tags
- `ArticleTable` - Data table with sorting/filtering
- `StatusBadge` - Visual indicator for article status
- `ConfirmDialog` - Reusable delete confirmation

### API Integration

Use existing backend endpoints:

- `GET /api/articles` - List articles
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

## Alternatives

- Use headless CMS (Sanity, Contentful) - overkill, loses control
- File-based workflow (only MDX files) - harder to manage, no DB
- Use existing admin panel library (React-Admin) - more dependencies

## Additional Context

- Should work seamlessly with existing MDX content in `/content`
- Consider adding image upload for hero images (future enhancement)
- Autosave drafts to prevent data loss
- Validate slug uniqueness before saving

## Acceptance Criteria

- [ ] Article list page shows all articles with filtering/search
- [ ] Create article form works and saves to database
- [ ] Edit article form pre-populates and updates correctly
- [ ] Delete article with confirmation works
- [ ] MDX preview renders correctly
- [ ] Form validation prevents invalid submissions
- [ ] Loading states show during API calls
- [ ] Error messages display for failed operations
- [ ] Mobile responsive design
- [ ] Tests added for key user flows

## Design Notes

- Follow existing design system (ShadCN UI components)
- Use React Hook Form for form management
- Add Zod validation matching backend schemas
- Consider adding keyboard shortcuts for power users
