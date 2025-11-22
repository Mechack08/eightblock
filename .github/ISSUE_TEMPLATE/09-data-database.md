---
name: 🗄️ Data & Database
about: Database schema changes, migrations, data management, and data integrity improvements
title: '[DATA] '
labels: ['database', 'data', 'prisma']
assignees: ''
---

## Data & Database Issue

### Issue Type

<!-- Check one that best describes this issue -->

- [ ] Schema Migration
- [ ] Data Seeding
- [ ] Data Integrity
- [ ] Database Performance
- [ ] Data Model Enhancement
- [ ] Data Migration/Import
- [ ] Other (please specify)

### Problem Statement

<!-- Describe the current data/database issue or requirement -->

### Proposed Solution

<!-- Describe your proposed database or data change -->

### Schema Changes

**Affected Models:**

<!-- List the Prisma models that will be modified -->

- [ ] User
- [ ] Article
- [ ] Comment
- [ ] Like
- [ ] Subscription
- [ ] Tag
- [ ] Other:

**Type of Change:**

<!-- Check all that apply -->

- [ ] Add new model
- [ ] Add new field(s)
- [ ] Modify existing field(s)
- [ ] Remove field(s)
- [ ] Add relation
- [ ] Modify relation
- [ ] Add index
- [ ] Add constraint
- [ ] Other:

### Prisma Schema Changes

<!-- Provide the proposed schema changes in Prisma syntax -->

```prisma
// Add your schema changes here

```

### Migration Strategy

**Data Migration Required?**

- [ ] Yes - existing data needs transformation
- [ ] No - safe schema-only change

**Migration Steps:**

1.
2.
3.

**Rollback Plan:**

<!-- How can this migration be safely reverted? -->

### Data Seeding

<!-- If this involves seeding data, describe the seed data -->

**Seed Data Required:**

- [ ] Yes
- [ ] No

**Seed Script:**

```typescript
// Add seed script changes here
```

### Data Integrity Checks

<!-- What validations ensure data integrity? -->

- [ ] Foreign key constraints validated
- [ ] Unique constraints verified
- [ ] Required fields have defaults or migrations
- [ ] Existing data compatibility verified
- [ ] Cascade delete/update behavior documented

### Testing Plan

**Database Testing:**

- [ ] Migration tested on dev database
- [ ] Rollback tested successfully
- [ ] Seed data verified
- [ ] Queries tested with new schema
- [ ] Performance impact assessed

**Affected API Endpoints:**

<!-- List API endpoints that will be impacted -->

-

### Additional Context

<!-- Add ER diagrams, data samples, or references -->

### Estimated Effort

<!-- Select one -->

- [ ] Small (< 4 hours)
- [ ] Medium (1-3 days)
- [ ] Large (> 3 days)

---

**Breaking Change:** yes | no
**Priority:** high | medium | low
