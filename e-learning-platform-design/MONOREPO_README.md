# 🚀 E-Learning Platform - Monorepo Guide

## Overview

Proyek ini telah diorganisir menjadi **monorepo** dengan struktur yang jelas:

- **Backend**: Business logic, database, services
- **Frontend**: Next.js UI, API routes, components

```
project/
├── packages/
│   ├── backend/          Backend services & database
│   └── frontend/         Next.js app & UI components
├── docs/                 Shared documentation
└── (config files)        Workspace & root config
```

## 🎯 Quick Start

### 1️⃣ Install Dependencies

```bash
pnpm install
```

### 2️⃣ Setup Environment

```bash
# Backend
cd packages/backend
cp .env.example .env.local
# Edit .env.local - add DATABASE_URL

# Frontend  
cd ../frontend
cp .env.example .env.local
# Edit .env.local - add API_URL (usually http://localhost:3000)
```

### 3️⃣ Setup Database

```bash
cd ..  # back to root
pnpm db:push      # Create tables
pnpm db:seed      # Seed with test data
```

### 4️⃣ Start Development

```bash
pnpm dev
```

Visit `http://localhost:3000`

## 📁 What's Where

### Backend (`packages/backend/src/`)

**Business Logic Layers**:
- `lib/repositories/` - Data access (Prisma queries)
- `lib/services/` - Business logic & validation  
- `lib/exceptions/` - Custom error handling
- `prisma/` - Database schema & migrations

**Example**: User login flow
```
API Route (handler) 
  → AuthService.login() (validation + business logic)
    → UserRepository.findByEmail() (database access)
      → Prisma (query execution)
```

### Frontend (`packages/frontend/`)

**User Interface**:
- `app/` - Next.js pages & API routes
- `components/` - React UI components
- `hooks/` - Custom React hooks
- `public/` - Static files
- `styles/` - CSS & Tailwind

**API Routes**: `app/api/` 
- Import services from backend
- Handle HTTP requests
- Return JSON responses

```typescript
// packages/frontend/app/api/courses/route.ts
import { courseService } from "@e-learning/backend/src/lib/services"

export async function GET(request: Request) {
  const courses = await courseService.listCourses(1, 10)
  return Response.json(courses)
}
```

## 🔧 Available Commands

### Root Level
```bash
pnpm dev              # Start frontend + backend
pnpm build            # Build all packages
pnpm lint             # Lint everything
pnpm db:push          # Push database schema
pnpm db:seed          # Seed database
pnpm db:studio        # Open database UI
```

### Frontend Only
```bash
cd packages/frontend
pnpm dev              # Frontend dev server
pnpm build            # Build Next.js
pnpm lint             # Lint frontend code
```

### Backend Only
```bash
cd packages/backend
pnpm db:*             # Database commands
pnpm seed:*           # Seed scripts
```

## 📖 Documentation

- [MIGRATION_GUIDE_MONOREPO.md](./MIGRATION_GUIDE_MONOREPO.md) - Complete migration details
- [MONOREPO_SETUP_CHECKLIST.md](./MONOREPO_SETUP_CHECKLIST.md) - Setup verification steps
- [docs/](./docs/) - Additional documentation

## 🏗️ Architecture

### 3-Layer Backend Architecture

```
┌─────────────────────────────────────┐
│        API Route Handler            │ (HTTP request/response)
│  app/api/courses/route.ts           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Service Layer                │ (Business logic)
│  lib/services/CourseService.ts      │ 
│  - Validation                       │
│  - Business rules                   │
│  - Authorization checks             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Repository Layer               │ (Data access)
│  lib/repositories/CourseRepository  │
│  - Database queries                 │
│  - CRUD operations                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Prisma + MySQL Database         │
│  prisma/schema.prisma               │
└─────────────────────────────────────┘
```

### Exception Handling

Custom exceptions with automatic HTTP status codes:

```typescript
// lib/exceptions/AppException.ts

- ValidationException    → 400 Bad Request
- AuthenticationException → 401 Unauthorized
- AuthorizationException  → 403 Forbidden
- NotFoundException       → 404 Not Found
- ConflictException       → 409 Conflict
- AppException           → 500 Internal Server Error
```

## 🔌 How API Routes Work

### Before (Mixed concerns)
```typescript
// Old way - all logic in handler
export async function GET() {
  const user = await prisma.user.findById(123)
  // Database query in handler ❌
  // Business logic mixed in ❌
}
```

### After (Clean separation)
```typescript
// New way - handler only handles HTTP
import { courseService } from "@e-learning/backend/src/lib/services"

export async function GET() {
  try {
    // Handler delegates to service
    const courses = await courseService.listCourses(page, limit)
    return successResponse(courses)
  } catch (error) {
    return handleException(error)
  }
}
```

## 💾 Environment Variables

### Backend (`packages/backend/.env.local`)
```env
DATABASE_URL=mysql://user:password@localhost:3306/e_learning
NODE_ENV=development
```

### Frontend (`packages/frontend/.env.local`)
```env
API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=E-Learning
```

## 🧪 Development Workflow

### Making Backend Changes

```bash
cd packages/backend/src

# 1. Modify service logic
vim lib/services/CourseService.ts

# 2. Update database schema if needed
vim prisma/schema.prisma
pnpm db:push

# 3. Changes reload automatically
```

### Making Frontend Changes

```bash
cd packages/frontend

# 1. Create/edit component
vim components/CourseCard.tsx

# 2. Update page
vim app/courses/page.tsx

# 3. Changes reload automatically
```

### Creating New API Route

```bash
cd packages/frontend/app/api

# 1. Create route file
mkdir myfeature && touch myfeature/route.ts

# 2. Import backend service
cat > myfeature/route.ts << 'EOF'
import { someService } from "@e-learning/backend/src/lib/services"
import { successResponse, handleException } from "@e-learning/backend/src/lib/api-response"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const result = await someService.doSomething()
    return successResponse(result)
  } catch (error) {
    return handleException(error)
  }
}
EOF

# 3. Test the route
# curl http://localhost:3000/api/myfeature
```

## 📊 Refactored Endpoints

These endpoints have been refactored with clean 3-layer architecture:

- `POST /api/auth/login` - AuthService
- `GET /api/courses` - CourseService  
- `GET /api/courses/:id` - CourseService
- `POST /api/courses` - CourseService
- `GET /api/sections/:courseId` - SectionService

Check the docs/ folder for detailed examples.

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd packages/frontend
vercel deploy
```

### Backend Services
- Database: MySQL hosted on managed service
- API Routes: Deploy with frontend as serverless functions
- Or: Self-host entire Next.js app

## ⚠️ Important Notes

1. **API Routes Stay in Frontend** - They're part of Next.js, not a separate backend
2. **Database Access Only in Backend** - Import services, never use Prisma directly in components
3. **Monorepo Lock File** - `pnpm-lock.yaml` is at root, not per-package
4. **Path Aliases** - Frontend can import from backend using `@e-learning/backend`

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find module @e-learning/backend` | Run `pnpm install` |
| `DATABASE_URL not set` | Create `.env.local` in packages/backend |
| `Port 3000 already in use` | `npx kill-port 3000` or use PORT=3001 |
| `Prisma schema not found` | Check `packages/backend/src/prisma/schema.prisma` exists |
| `Import errors in API routes` | Verify backend package.json exports are set |

## 📞 Support

- Check [MIGRATION_GUIDE_MONOREPO.md](./MIGRATION_GUIDE_MONOREPO.md) for detailed guides
- Check [MONOREPO_SETUP_CHECKLIST.md](./MONOREPO_SETUP_CHECKLIST.md) for setup steps
- Check [docs/](./docs/) for architecture documentation

## 🎓 Learning Path

1. Start with `docs/QUICK_START.md` - Basic setup
2. Read `docs/ARCHITECTURE.md` - System overview
3. Check `docs/ADVANCED_PATTERNS.md` - Best practices
4. Review refactored endpoints - See examples
5. Build new endpoints - Apply the pattern

---

**Status**: ✅ Ready for Development  
**Last Updated**: 2026-01-12  
**Version**: 1.0
