# Migration Guide - Backend & Frontend Separation

Dokumentasi lengkap untuk menggunakan struktur monorepo yang baru.

## ✅ Apa yang Sudah Dilakukan

### Folder Structure
```
e-learning-platform/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── lib/              ✅ Copied (Services, Repositories, Exceptions)
│   │   │   ├── prisma/           ✅ Copied (Database schema)
│   │   │   └── scripts/          ✅ Copied (Seed scripts)
│   │   ├── package.json          ✅ Created
│   │   └── README.md             ✅ Created
│   │
│   └── frontend/
│       ├── app/                  ✅ Copied (Next.js pages & API routes)
│       ├── components/           ✅ Copied (React components)
│       ├── hooks/                ✅ Copied (Custom hooks)
│       ├── public/               ✅ Copied (Static assets)
│       ├── styles/               ✅ Copied (CSS & Tailwind)
│       ├── next.config.mjs       ✅ Copied
│       ├── postcss.config.mjs    ✅ Copied
│       ├── components.json       ✅ Copied
│       ├── tsconfig.json         ✅ Copied
│       ├── package.json          ✅ Created
│       └── README.md             ✅ Created
│
├── docs/                         (Existing documentation)
├── pnpm-workspace.yaml           ✅ Created (Monorepo config)
├── package.json                  ✅ Updated (Root package with scripts)
└── .env.example                  (Root - shared example)
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# Remove old node_modules & lock files
rm -r node_modules package-lock.json

# Install dependencies for all packages
pnpm install
```

Ini akan:
- Install dependencies untuk `@e-learning/frontend` dari `packages/frontend/package.json`
- Install dependencies untuk `@e-learning/backend` dari `packages/backend/package.json`
- Create unified `pnpm-lock.yaml` di root

### 2. Setup Environment Variables

```bash
# Backend
cd packages/backend
cp .env.example .env.local
# Update .env.local dengan database credentials

# Frontend
cd ../frontend
cp .env.example .env.local
# Update .env.local dengan API URLs
```

### 3. Setup Database

```bash
# Push schema to database
pnpm db:push

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

### 4. Run Development Server

```bash
# Run both frontend dan backend di development
pnpm dev

# Atau run individual:
pnpm --filter @e-learning/frontend dev    # Frontend only (port 3000)
pnpm --filter @e-learning/backend dev     # Backend only (if needed)
```

## 📊 Folder Organization

### Backend (`packages/backend/`)

```
backend/
├── src/
│   ├── lib/
│   │   ├── exceptions/
│   │   │   └── AppException.ts
│   │   ├── repositories/
│   │   │   ├── index.ts
│   │   │   ├── UserRepository.ts
│   │   │   ├── CourseRepository.ts
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── index.ts
│   │   │   ├── AuthService.ts
│   │   │   ├── CourseService.ts
│   │   │   └── ...
│   │   ├── api-response.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── db.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   └── scripts/
│       ├── seed-instructor-profile.ts
│       ├── fix-usernames.ts
│       └── ...
├── .env.example
├── package.json
└── README.md
```

### Frontend (`packages/frontend/`)

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── api/                     ← API routes (still part of Next.js)
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── enrollments/
│   │   └── ...
│   ├── courses/
│   ├── dashboard/
│   ├── admin/
│   └── ...
├── components/
│   ├── ui/
│   ├── navbar.tsx
│   ├── admin-sidebar.tsx
│   └── ...
├── hooks/
│   ├── use-mobile.ts
│   ├── use-toast.ts
│   └── ...
├── public/
│   └── (static files)
├── styles/
│   └── globals.css
├── next.config.mjs
├── postcss.config.mjs
├── components.json
├── tsconfig.json
├── package.json
└── README.md
```

## 🔗 Import Paths

### From Frontend to Backend

Next.js API routes di `packages/frontend/app/api/` dapat import dari backend:

```typescript
// packages/frontend/app/api/courses/route.ts
import { courseService } from "@e-learning/backend/src/lib/services"
import { successResponse, handleException } from "@e-learning/backend/src/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const result = await courseService.listCourses(1, 10)
    return successResponse(result)
  } catch (error) {
    return handleException(error)
  }
}
```

Atau setup tsconfig paths untuk cleaner imports:

```json
// packages/frontend/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/lib/*": ["../backend/src/lib/*"],
      "@/prisma/*": ["../backend/src/prisma/*"],
      "@/*": ["./*"]
    }
  }
}
```

Maka bisa:
```typescript
import { courseService } from "@/lib/services"
```

## 📝 Scripts Available

### Root Level
```bash
pnpm dev              # Run both frontend & backend
pnpm build            # Build both packages
pnpm start            # Start frontend
pnpm lint             # Lint all packages
pnpm type-check       # Type check all packages

# Database
pnpm db:push          # Push Prisma schema to database
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
```

### Frontend Only
```bash
cd packages/frontend
pnpm dev              # Run Next.js dev server
pnpm build            # Build Next.js
pnpm start            # Start production server
pnpm lint             # Lint frontend
pnpm type-check       # Type check frontend
```

### Backend Only
```bash
cd packages/backend
pnpm db:*             # Database scripts
pnpm seed:*           # Seed scripts
```

## 🔄 Next.js API Routes Location

**Important**: API routes remain in `packages/frontend/app/api/`

They are still Next.js API routes but import services/repositories from backend:

```
packages/frontend/app/api/
├── auth/
│   ├── login/route.ts      ← Handler imports from backend
│   ├── signup/route.ts
│   └── logout/route.ts
├── courses/
│   ├── route.ts            ← GET/POST handlers
│   └── [id]/route.ts       ← GET/PUT/DELETE handlers
├── enrollments/
├── payments/
└── ...
```

## 💡 Why This Structure?

### Monorepo Benefits

✅ **Clearer Separation** - Backend logic vs Frontend UI  
✅ **Code Reuse** - Frontend can import from backend  
✅ **Scalability** - Easy to add more packages (mobile app, admin, etc)  
✅ **Dependency Management** - Unified pnpm-lock.yaml  
✅ **Workspace Scripts** - Run commands across packages  

### Backend Benefits

✅ **Business Logic Isolated** - Services, Repositories separate  
✅ **Database Layer Separate** - Prisma in backend  
✅ **Independent Testing** - Test business logic separately  
✅ **Reusable Services** - Can be used by other frontends (mobile, etc)  

### Frontend Benefits

✅ **Next.js Only** - Keep Next.js in frontend folder  
✅ **API Routes Close** - API routes still in Next.js structure  
✅ **Cleaner Imports** - No confusion with backend files  
✅ **Easy to Deploy** - Frontend can be deployed to Vercel as-is  

## ⚠️ Important Notes

### Environment Variables

Each package has its own `.env.local`:

```
packages/backend/.env.local     ← Database, server config
packages/frontend/.env.local    ← API URLs, public config
```

### API Routes

API routes stay in `packages/frontend/app/api/` because:
- They are part of Next.js App Router
- They can import from backend services
- They use Next.js request/response objects

### Imports in API Routes

```typescript
// ✅ Good - Import from backend
import { courseService } from "@e-learning/backend/src/lib/services"

// ❌ Bad - Don't re-implement logic
const courses = await prisma.course.findMany(...)
```

## 🔧 TypeScript Path Aliases (Optional)

Setup for cleaner imports:

```json
// packages/frontend/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@backend/*": ["../backend/src/*"],
      "@backend/lib/*": ["../backend/src/lib/*"]
    }
  }
}
```

Then use:
```typescript
import { courseService } from "@backend/lib/services"
```

## 📚 File References

- Root: [package.json](../package.json)
- Backend: [packages/backend/package.json](../packages/backend/package.json)
- Frontend: [packages/frontend/package.json](../packages/frontend/package.json)
- Workspace: [pnpm-workspace.yaml](../pnpm-workspace.yaml)

## 🚨 Troubleshooting

### Issue: Import not found in frontend

**Solution**: Add path alias to frontend tsconfig.json:
```json
{
  "paths": {
    "@backend/lib/*": ["../backend/src/lib/*"]
  }
}
```

### Issue: Database connection error

**Solution**: Check `packages/backend/.env.local` has correct DATABASE_URL

### Issue: Prisma schema not found

**Solution**: Prisma is at `packages/backend/src/prisma/schema.prisma`

### Issue: Node modules missing

**Solution**: Run `pnpm install` from root directory

## 🎯 Next Steps

1. ✅ Files are organized
2. ✅ Workspace configured
3. 📋 Run `pnpm install`
4. 📋 Setup `.env.local` files
5. 📋 Run `pnpm db:push`
6. 📋 Run `pnpm dev`
7. ✨ Development ready!

---

**Status**: ✅ Ready for use  
**Date**: 2026-01-12  
**Version**: 1.0
