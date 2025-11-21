---
name: Add Docker and Docker Compose Setup
about: Containerize the application for easier development and deployment
title: 'Add Docker and Docker Compose configuration'
labels: ['infrastructure', 'devex']
assignees: ''
---

## Summary

Setting up the development environment requires manually installing Node.js, pnpm, and PostgreSQL. This creates inconsistencies between developers and makes onboarding harder. Docker Compose would provide a one-command setup for the entire stack.

## Proposed Solution

### 1. Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):

```dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm@9

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY backend ./backend
COPY package.json pnpm-workspace.yaml ./
RUN cd backend && pnpm prisma generate
RUN cd backend && pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/package.json ./backend/
EXPOSE 4000
CMD ["node", "backend/dist/server.js"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):

```dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm@9

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend ./frontend
COPY package.json pnpm-workspace.yaml ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd frontend && pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public
EXPOSE 3000
CMD ["node", "frontend/server.js"]
```

### 2. Create Docker Compose file

**Root `docker-compose.yml`**:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: eightblock-db
    environment:
      POSTGRES_DB: eightblock
      POSTGRES_USER: eightblock_user
      POSTGRES_PASSWORD: eightblock_pass
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U eightblock_user']
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: eightblock-backend
    environment:
      DATABASE_URL: postgresql://eightblock_user:eightblock_pass@postgres:5432/eightblock
      JWT_SECRET: your-development-jwt-secret-min-32-characters
      NODE_ENV: development
    ports:
      - '4000:4000'
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app/backend
      - /app/backend/node_modules
    command: sh -c "cd backend && pnpm prisma migrate deploy && pnpm dev"

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
      target: base
    container_name: eightblock-frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:4000
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: your-development-nextauth-secret
    ports:
      - '3000:3000'
    depends_on:
      - backend
    volumes:
      - ./frontend:/app/frontend
      - /app/frontend/node_modules
      - /app/frontend/.next
    command: sh -c "cd frontend && pnpm dev"

volumes:
  postgres_data:
```

### 3. Add Development Compose Override

**`docker-compose.dev.yml`**:

```yaml
version: '3.8'

services:
  backend:
    build:
      target: base
    command: sh -c "cd backend && pnpm install && pnpm prisma generate && pnpm dev"
    environment:
      NODE_ENV: development

  frontend:
    build:
      target: base
    command: sh -c "cd frontend && pnpm install && pnpm dev"
```

### 4. Add Scripts and Documentation

**Add to `package.json`**:

```json
{
  "scripts": {
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:build": "docker-compose build"
  }
}
```

**Add to README.md**:

````markdown
## Docker Setup (Recommended)

### Prerequisites

- Docker Desktop (Mac/Windows) or Docker Engine (Linux)
- Docker Compose

### Quick Start

1. Clone the repository
2. Start the stack:
   ```bash
   docker-compose up -d
   ```
````

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - API Docs: http://localhost:4000/api/docs

### Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose build

# Run migrations
docker-compose exec backend pnpm prisma migrate dev

# Access database
docker-compose exec postgres psql -U eightblock_user eightblock
```

```

## Alternatives

- Podman instead of Docker - less common
- Individual Dockerfiles only (no compose) - harder to orchestrate
- Dev containers in VS Code - requires VS Code, more complex
- Kubernetes manifests - overkill for development

## Additional Context

Benefits:
- Consistent environment across all developers
- No need to install PostgreSQL locally
- Easy to reset/clean environment
- Similar to production setup
- Works on all platforms (Mac/Windows/Linux)

Considerations:
- Larger initial download (Docker images)
- Slightly slower on macOS (file system performance)
- Need to learn basic Docker commands

## Acceptance Criteria

- [ ] Backend Dockerfile created with multi-stage build
- [ ] Frontend Dockerfile created with multi-stage build
- [ ] docker-compose.yml orchestrates all services
- [ ] PostgreSQL starts and is healthy before backend
- [ ] Hot reload works for development
- [ ] Migrations run automatically on startup
- [ ] README updated with Docker instructions
- [ ] .dockerignore files added to exclude unnecessary files
- [ ] Tested on Mac, Windows, and Linux

## Out of Scope (Future Enhancements)

- Production-optimized compose file
- Nginx reverse proxy
- Redis for caching
- Volume mounts for uploads
```
