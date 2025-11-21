---
name: Add Database Setup Instructions
about: Improve documentation for new contributors setting up the database
title: 'Add comprehensive database setup instructions to README'
labels: ['documentation', 'good first issue']
assignees: ''
---

## Summary

New contributors struggle to set up the database because the README lacks detailed instructions. We need clearer guidance on PostgreSQL setup, environment variables, and running migrations.

## Proposed Solution

Expand the "Database setup" section in README.md with:

### 1. PostgreSQL Installation

Add platform-specific instructions:

````markdown
### Install PostgreSQL

**macOS (Homebrew):**

```bash
brew install postgresql@15
brew services start postgresql@15
```
````

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

````

### 2. Database Creation

```markdown
### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE eightblock;
CREATE USER eightblock_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE eightblock TO eightblock_user;
\q
````

````

### 3. Environment Variables

Create `.env.example` in root with:
```env
# Database
DATABASE_URL="postgresql://eightblock_user:your_password@localhost:5432/eightblock?schema=public"

# Backend Auth
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
````

Add instructions:

````markdown
Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
# Edit .env with your actual values
```
````

````

### 4. Migration Steps

Clarify the migration process:
```markdown
### Run Migrations

```bash
cd backend
pnpm prisma migrate dev --name init
pnpm prisma db seed  # Optional: adds sample data
````

This will:

- Create all tables in your database
- Generate Prisma Client
- Seed initial data (tags, sample user)

````

## Alternatives

- Create a setup script (`setup.sh`) that automates everything
- Use Docker Compose to avoid manual PostgreSQL setup
- Create video tutorial instead of text docs

## Additional Context

Common issues new contributors face:
- Don't know how to create PostgreSQL database
- Forget to set environment variables
- Don't understand Prisma migration workflow
- Connection errors due to wrong DATABASE_URL format

Related: Consider adding `.env.example` to root (not just mentioned in README)

## Acceptance Criteria

- [ ] README has detailed PostgreSQL installation instructions
- [ ] Database creation steps included
- [ ] `.env.example` file created in repository root
- [ ] Environment variable documentation complete
- [ ] Migration commands explained clearly
- [ ] Troubleshooting section added for common issues
- [ ] Screenshots/examples where helpful
- [ ] Tested by having someone new follow the instructions

## Troubleshooting Section to Add

```markdown
### Troubleshooting

**Connection refused:**
- Ensure PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format

**Migration fails:**
- Drop and recreate database: `dropdb eightblock && createdb eightblock`
- Check PostgreSQL version (requires 12+)

**Prisma Client errors:**
- Regenerate client: `pnpm prisma generate`
````
