# Monorepo Structure - Backend & Frontend Separated

## 📁 New Project Structure

```
e-learning-platform-design/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── lib/              ← Business logic, services, repositories
│   │   │   ├── prisma/           ← Database schema & migrations
│   │   │   └── scripts/          ← Seed scripts, utilities
│   │   ├── .env.local
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── frontend/
│       ├── app/                  ← Next.js App Router & API routes
│       ├── components/           ← React components
│       ├── hooks/                ← Custom hooks
│       ├── public/               ← Static assets
│       ├── styles/               ← CSS files
│       ├── .env.local
│       ├── next.config.mjs
│       ├── postcss.config.mjs
│       ├── tsconfig.json
│       ├── package.json
│       ├── components.json
│       └── README.md
│
├── docs/                         ← Shared documentation
├── pnpm-workspace.yaml           ← Monorepo config
├── package.json                  ← Root package.json
└── README.md
```

## 🎯 Separation Logic

### Backend (`packages/backend/`)
- ✅ `lib/` - Services, Repositories, Exceptions, API helpers, Types
- ✅ `prisma/` - Database schema, migrations, seed.ts
- ✅ `scripts/` - Database seed scripts
- ✅ `.env.local` - Backend environment variables
- ✅ Business logic, database access

### Frontend (`packages/frontend/`)
- ✅ `app/` - Next.js App Router, pages, API routes
- ✅ `components/` - React components, UI components
- ✅ `hooks/` - Custom React hooks
- ✅ `public/` - Static assets, images
- ✅ `styles/` - Global CSS, tailwind
- ✅ `.env.local` - Frontend environment variables
- ✅ UI, pages, client-side logic

## 🔄 How They Work Together

```
Frontend (Next.js)
    ↓
API Routes (Next.js - in frontend/app/api/)
    ↓
Backend Services (packages/backend/src/lib/)
    ↓
Prisma/Database
```

## 📝 Next Steps

1. Copy files to respective folders
2. Update import paths
3. Configure path aliases in tsconfig
4. Setup pnpm workspaces
5. Update environment variables
6. Test all endpoints

---

See MIGRATION_GUIDE.md for detailed steps.
