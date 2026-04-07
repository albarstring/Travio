# 🎯 Monorepo Setup Checklist & Verification

Panduan lengkap untuk verify dan finalize monorepo setup.

## ✅ Completion Status

### Phase 1: File Organization
- [x] Created `packages/backend/src/` structure
- [x] Created `packages/frontend/` structure
- [x] Copied `lib/` → `packages/backend/src/lib/`
- [x] Copied `prisma/` → `packages/backend/src/prisma/`
- [x] Copied `scripts/` → `packages/backend/src/scripts/`
- [x] Copied `app/` → `packages/frontend/app/`
- [x] Copied `components/` → `packages/frontend/components/`
- [x] Copied `hooks/` → `packages/frontend/hooks/`
- [x] Copied `public/` → `packages/frontend/public/`
- [x] Copied `styles/` → `packages/frontend/styles/`
- [x] Copied config files to `packages/frontend/`

### Phase 2: Configuration
- [x] Created `packages/backend/package.json`
- [x] Created `packages/frontend/package.json`
- [x] Updated root `package.json` with workspace scripts
- [x] Created `pnpm-workspace.yaml`
- [x] Created `.env.example` files

### Phase 3: Documentation
- [x] Created `MIGRATION_GUIDE_MONOREPO.md`
- [x] Created `MONOREPO_SETUP_CHECKLIST.md` (this file)

## 📋 Next Steps - Execute These Commands

### Step 1: Verify Directory Structure

```powershell
# Check backend structure
Get-ChildItem -Path ".\packages\backend\src\" -Directory
# Should show: lib, prisma, scripts

# Check frontend structure
Get-ChildItem -Path ".\packages\frontend\" -Directory
# Should show: app, components, hooks, public, styles
```

### Step 2: Clean Old Files (OPTIONAL - Only if new structure works)

```powershell
# Create backup first
Copy-Item -Path "." -Destination "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')" -Recurse

# Remove old backend folders from root (ONLY AFTER TESTING)
Remove-Item -Path ".\lib" -Recurse -Force
Remove-Item -Path ".\prisma" -Recurse -Force
Remove-Item -Path ".\scripts" -Recurse -Force

# Remove old frontend folders from root
Remove-Item -Path ".\app" -Recurse -Force
Remove-Item -Path ".\components" -Recurse -Force
Remove-Item -Path ".\hooks" -Recurse -Force
Remove-Item -Path ".\public" -Recurse -Force
Remove-Item -Path ".\styles" -Recurse -Force

# Keep these at root (or move to docs)
# - next.config.mjs, tsconfig.json, etc from root
```

### Step 3: Setup Environment Variables

```bash
# Backend environment
cd packages/backend
Copy-Item .env.example .env.local

# Edit .env.local with your database credentials
# DATABASE_URL=mysql://user:password@localhost:3306/e_learning
```

```bash
# Frontend environment
cd ../frontend
Copy-Item .env.example .env.local

# Edit .env.local with API configuration
# API_URL=http://localhost:3000/api
```

### Step 4: Install Dependencies

```bash
# Go to root directory
cd ../..

# Install all dependencies
pnpm install

# This will:
# - Install @e-learning/backend dependencies
# - Install @e-learning/frontend dependencies
# - Create unified pnpm-lock.yaml
```

### Step 5: Setup Database

```bash
# Push Prisma schema to database
pnpm db:push

# Run migrations (if any)
pnpm db:migrate

# Seed database with initial data
pnpm db:seed
```

### Step 6: Verify API Routes Can Access Backend

For each API route that was refactored, verify the imports work:

```typescript
// packages/frontend/app/api/auth/login/route.ts
import { authService } from "@e-learning/backend/src/lib/services"
import { successResponse, handleException } from "@e-learning/backend/src/lib/api-response"

// If imports fail, check:
// 1. packages/backend/src/lib/services/index.ts exists
// 2. packages/backend/package.json has exports set
// 3. pnpm install was successful
```

### Step 7: Start Development

```bash
# Run both frontend and backend
pnpm dev

# Should see:
# BACKEND: Prisma client ready
# FRONTEND: ▲ Next.js dev server on port 3000

# Or run individually:
pnpm --filter @e-learning/frontend dev     # Port 3000
pnpm --filter @e-learning/backend dev      # Backend only
```

### Step 8: Test API Routes

Visit in browser or Postman:
- `GET http://localhost:3000/api/courses` - Should return courses list
- `POST http://localhost:3000/api/auth/login` - Should accept credentials
- Other routes you refactored

## 🔍 Verification Checklist

### Directory Structure
```bash
# Run from root
cd packages/backend/src
ls -la
# Should show: lib/, prisma/, scripts/

cd ../../frontend
ls -la
# Should show: app/, components/, hooks/, public/, styles/
```

### Package Configuration
```bash
# Verify backend package.json exists and has correct name
cat packages/backend/package.json | grep '"name"'
# Should show: "@e-learning/backend"

# Verify frontend package.json exists and has correct name
cat packages/frontend/package.json | grep '"name"'
# Should show: "@e-learning/frontend"
```

### Workspace Configuration
```bash
# Verify pnpm-workspace.yaml exists
cat pnpm-workspace.yaml
# Should show:
# packages:
#   - 'packages/**'
```

### Root Package Scripts
```bash
# Verify root package.json has workspace scripts
cat package.json | grep '"dev"'
# Should show: "pnpm -r dev"
```

## 🚨 Common Issues & Solutions

### Issue 1: Import path errors in API routes

**Error**: `Cannot find module '@e-learning/backend/src/lib/services'`

**Solutions**:
1. Make sure `pnpm install` completed successfully
2. Check `packages/backend/src/lib/services/index.ts` exports exist
3. Verify package name in `packages/backend/package.json` is `@e-learning/backend`
4. Try: `pnpm install` again

### Issue 2: Prisma database errors

**Error**: `DATABASE_URL is not set` or connection failed

**Solutions**:
1. Create `.env.local` in `packages/backend/`
2. Set `DATABASE_URL=mysql://...`
3. Verify database server is running
4. Run `pnpm db:push` again

### Issue 3: Port already in use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solutions**:
1. Kill existing process: `npx kill-port 3000`
2. Or use different port: `PORT=3001 pnpm dev`

### Issue 4: Module resolution errors

**Error**: `Cannot find module relative path`

**Solutions**:
1. Check file path is correct
2. Verify tsconfig.json path aliases in `packages/frontend/`
3. Add path alias if needed:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@backend/*": ["../backend/src/*"]
       }
     }
   }
   ```

## 📊 Project Structure After Setup

```
e-learning-platform-design/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── exceptions/
│   │   │   │   ├── repositories/
│   │   │   │   ├── services/
│   │   │   │   ├── api-response.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   ├── seed.ts
│   │   │   │   └── migrations/
│   │   │   └── scripts/
│   │   ├── .env.local           ← DATABASE_URL
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── frontend/
│       ├── app/
│       │   ├── api/             ← API routes (import from backend)
│       │   ├── courses/
│       │   ├── dashboard/
│       │   ├── admin/
│       │   └── ...
│       ├── components/
│       ├── hooks/
│       ├── public/
│       ├── styles/
│       ├── .env.local           ← API_URL
│       ├── next.config.mjs
│       ├── tsconfig.json
│       ├── package.json
│       └── README.md
│
├── docs/                        ← Shared documentation
│   ├── ARCHITECTURE.md
│   ├── QUICK_START.md
│   └── ...
│
├── MIGRATION_GUIDE_MONOREPO.md
├── MONOREPO_SETUP_CHECKLIST.md
├── pnpm-workspace.yaml          ← Workspace config
├── package.json                 ← Root with workspace scripts
└── pnpm-lock.yaml              ← Unified lock file
```

## 🎯 Development Workflow

### Daily Development

```bash
# At project root
pnpm install        # Install dependencies
pnpm dev            # Start dev servers (frontend + backend)
pnpm db:studio      # View database in Prisma Studio

# Alternatively
cd packages/frontend
pnpm dev            # Frontend only
```

### Making Changes

**Backend Service/Repository**:
```bash
cd packages/backend/src/lib/services
# Edit AuthService.ts, etc.
# Changes auto-reload
```

**Frontend Component**:
```bash
cd packages/frontend
# Edit app/, components/, etc.
# Changes auto-reload
```

**API Route**:
```bash
cd packages/frontend/app/api
# Edit route.ts files
# Import from @e-learning/backend/src/lib/services
```

**Database Schema**:
```bash
cd packages/backend/src/prisma
# Edit schema.prisma
pnpm db:push        # Push changes
```

### Building for Production

```bash
pnpm build          # Build all packages

# Or individual:
pnpm --filter @e-learning/frontend build
pnpm --filter @e-learning/backend build
```

## 📈 Benefits of This Structure

✅ **Clear Separation** - Backend logic is isolated  
✅ **Scalability** - Easy to add more packages (mobile, admin, etc)  
✅ **Code Reuse** - Frontend uses backend services via imports  
✅ **Testing** - Backend can be tested independently  
✅ **Performance** - API routes are co-located with frontend  
✅ **Deployment** - Frontend can deploy to Vercel independently  

## 🚀 Next Phase: Deployment

After verifying everything works locally:

### Frontend Deployment (Vercel)
```bash
cd packages/frontend
vercel deploy
```

### Backend Deployment
- For serverless: Deploy `packages/backend/src` as Lambda/Functions
- For traditional: Deploy full app with database

## ✨ Summary

**What Was Done**:
- ✅ Reorganized monolith into monorepo structure
- ✅ Separated backend services and database logic
- ✅ Kept frontend with Next.js App Router
- ✅ Setup pnpm workspaces for dependency management
- ✅ Created documentation and guides

**What You Need To Do**:
1. Run `pnpm install`
2. Setup `.env.local` files
3. Run `pnpm db:push`
4. Run `pnpm dev`
5. Test API routes
6. Remove old files from root (optional)

**Status**: 🟢 Ready for Development

---

**Last Updated**: 2026-01-12  
**Version**: 1.0  
**Maintainer**: System Architecture Team
