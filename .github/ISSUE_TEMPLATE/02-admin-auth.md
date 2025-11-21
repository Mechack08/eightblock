---
name: Implement Admin Authentication & Authorization
about: Add role-based access control for admin routes
title: 'Implement admin authentication and role-based access control'
labels: ['feature', 'security', 'backend', 'frontend']
assignees: ''
---

## Summary

The admin portal (`/admin`) and admin API endpoints are currently unprotected. Anyone can access these routes without authentication or authorization checks. We need to implement proper role-based access control (RBAC) to restrict admin functionality to users with the ADMIN role.

## Proposed Solution

### Backend Changes

1. **Protect admin-only routes** with role check middleware:

   ```typescript
   // src/middleware/require-admin.ts
   export const requireAdmin = (req, res, next) => {
     if (!req.user || req.user.role !== 'ADMIN') {
       return res.status(403).json({ error: 'Forbidden' });
     }
     next();
   };
   ```

2. **Apply to routes** that modify data:
   - POST/PUT/DELETE `/api/articles`
   - POST/DELETE `/api/tags`
   - PATCH `/api/comments/:id` (moderation)

### Frontend Changes

1. **Protect `/admin` route** with middleware:

   ```typescript
   // middleware.ts
   export function middleware(request: NextRequest) {
     const token = request.cookies.get('next-auth.session-token');
     // Verify user has ADMIN role
   }
   ```

2. **Hide admin UI** for non-admin users:
   - Remove "Admin" link from header for non-admins
   - Redirect to login if accessing `/admin` without auth
   - Show 403 error page if not authorized

3. **Add admin check hook**:
   ```typescript
   // hooks/use-is-admin.ts
   export function useIsAdmin() {
     const { data: session } = useSession();
     return session?.user?.role === 'ADMIN';
   }
   ```

## Alternatives

- Use third-party auth service (Auth0, Clerk) - more complex, overkill for now
- Implement permission system (more granular than roles) - can add later
- API key based auth for admin - less secure, harder to manage

## Additional Context

- User model already has `role` field (ADMIN, EDITOR, WRITER)
- JWT auth already implemented for basic authentication
- NextAuth already configured but needs role checks

## Acceptance Criteria

- [ ] Backend middleware created to check admin role
- [ ] Admin-only API routes protected with middleware
- [ ] Frontend admin routes redirect if not authenticated
- [ ] Frontend shows 403 error if user is not admin
- [ ] Admin navigation only visible to admin users
- [ ] Tests added for authorization checks
- [ ] Documentation updated with admin setup instructions

## Security Considerations

- Ensure JWTs include role information
- Add rate limiting to login endpoint
- Log admin actions for audit trail
