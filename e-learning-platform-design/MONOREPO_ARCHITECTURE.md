# 📊 Monorepo Architecture Overview

## Complete Project Structure

```
e-learning-platform-design/
│
├── 📦 packages/                          ← All work happens here
│   │
│   ├── 🔧 backend/                       ← Backend Services & Database
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── 🚫 exceptions/        Custom error classes with HTTP status
│   │   │   │   │   ├── AppException.ts   Base exception class
│   │   │   │   │   ├── ValidationException.ts    400 Bad Request
│   │   │   │   │   ├── AuthenticationException.ts 401 Unauthorized
│   │   │   │   │   ├── AuthorizationException.ts  403 Forbidden
│   │   │   │   │   ├── NotFoundException.ts       404 Not Found
│   │   │   │   │   ├── ConflictException.ts       409 Conflict
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── 📚 repositories/      Data Access Layer (Prisma abstractions)
│   │   │   │   │   ├── BaseRepository.ts Abstract base with common methods
│   │   │   │   │   ├── UserRepository.ts User CRUD operations
│   │   │   │   │   ├── CourseRepository.ts Course CRUD operations
│   │   │   │   │   ├── SectionRepository.ts Section CRUD operations
│   │   │   │   │   ├── LessonRepository.ts Lesson CRUD operations
│   │   │   │   │   ├── QuizRepository.ts   Quiz CRUD operations
│   │   │   │   │   └── index.ts           Exports all repositories
│   │   │   │   │
│   │   │   │   ├── 🧠 services/          Business Logic Layer
│   │   │   │   │   ├── AuthService.ts    Login, signup, authentication
│   │   │   │   │   ├── CourseService.ts  Course management & listing
│   │   │   │   │   ├── SectionService.ts Section management
│   │   │   │   │   ├── LessonService.ts  Lesson management
│   │   │   │   │   ├── QuizService.ts    Quiz management
│   │   │   │   │   ├── PaymentService.ts Payment processing
│   │   │   │   │   ├── EnrollmentService.ts Enrollment logic
│   │   │   │   │   └── index.ts          Exports all services
│   │   │   │   │
│   │   │   │   ├── 📧 email-service.ts   Email sending (Gmail integration)
│   │   │   │   ├── 💬 sms-service.ts     SMS notifications
│   │   │   │   ├── 📜 certificate-utils.ts Certificate generation
│   │   │   │   ├── 🎥 youtube.ts         YouTube API integration
│   │   │   │   ├── 🔐 auth.ts            Authentication helpers
│   │   │   │   ├── 🔌 db.ts              Database connection
│   │   │   │   ├── 📦 api-response.ts    Response helpers & error handling
│   │   │   │   ├── 📄 types.ts           TypeScript type definitions
│   │   │   │   ├── 🔧 utils.ts           Utility functions
│   │   │   │   └── 📚 mock-data.ts       Mock data for testing
│   │   │   │
│   │   │   ├── prisma/                   Database Layer
│   │   │   │   ├── schema.prisma         Database schema definition
│   │   │   │   ├── seed.ts               Initial data seeding
│   │   │   │   └── migrations/           Database migration files
│   │   │   │
│   │   │   └── scripts/                  Utility Scripts
│   │   │       ├── seed-instructor-profile.ts
│   │   │       ├── fix-usernames.ts
│   │   │       └── clean-trailing-zeros.ts
│   │   │
│   │   ├── .env.example                  Environment template
│   │   ├── .env.local                    Actual env (git ignored)
│   │   ├── package.json                  Backend dependencies
│   │   ├── tsconfig.json                 TypeScript config
│   │   └── README.md                     Backend documentation
│   │
│   └── 🎨 frontend/                      ← Frontend UI (Next.js App Router)
│       ├── app/                          Next.js App Router structure
│       │   ├── layout.tsx                Root layout (theme, navbar)
│       │   ├── page.tsx                  Home page
│       │   ├── globals.css               Global styles
│       │   │
│       │   ├── api/                      ← API Routes (delegating to backend services)
│       │   │   ├── auth/
│       │   │   │   ├── login/route.ts    POST /api/auth/login
│       │   │   │   ├── signup/route.ts   POST /api/auth/signup
│       │   │   │   └── logout/route.ts   POST /api/auth/logout
│       │   │   │
│       │   │   ├── courses/
│       │   │   │   ├── route.ts          GET/POST /api/courses
│       │   │   │   └── [id]/route.ts     GET/PUT/DELETE /api/courses/:id
│       │   │   │
│       │   │   ├── enrollments/
│       │   │   ├── payments/
│       │   │   ├── quizzes/
│       │   │   ├── quiz-attempts/
│       │   │   └── (other API routes)
│       │   │
│       │   ├── courses/                  Course listing & browsing
│       │   │   ├── page.tsx              All courses page
│       │   │   └── [id]/                 Single course detail
│       │   │       ├── page.tsx
│       │   │       └── layout.tsx
│       │   │
│       │   ├── dashboard/                Student dashboard
│       │   │   ├── page.tsx              Dashboard overview
│       │   │   └── courses/              Enrolled courses
│       │   │
│       │   ├── instructor/               Instructor pages
│       │   │   ├── page.tsx              Instructor dashboard
│       │   │   └── courses/              Manage courses
│       │   │
│       │   ├── admin/                    Admin pages
│       │   │   ├── page.tsx              Admin dashboard
│       │   │   ├── users/
│       │   │   ├── courses/
│       │   │   ├── payments/
│       │   │   ├── reports/
│       │   │   ├── reviews/
│       │   │   └── audit-log/
│       │   │
│       │   ├── profile/
│       │   ├── login/
│       │   ├── signup/
│       │   ├── logout/
│       │   ├── verify-email/
│       │   ├── complete-profile/
│       │   └── checkout/
│       │
│       ├── components/                   React UI Components
│       │   ├── admin-sidebar.tsx         Admin navigation
│       │   ├── navbar.tsx                Top navigation
│       │   ├── theme-provider.tsx        Dark/light mode
│       │   ├── youtube-embed.tsx         YouTube player
│       │   ├── quiz-player.tsx           Quiz interface
│       │   ├── quiz-management.tsx       Quiz builder/editor
│       │   ├── phone-input.tsx           Phone number input
│       │   │
│       │   └── ui/                       Radix UI components
│       │       ├── button.tsx
│       │       ├── input.tsx
│       │       ├── dialog.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── tabs.tsx
│       │       ├── form.tsx
│       │       ├── card.tsx
│       │       ├── badge.tsx
│       │       ├── accordion.tsx
│       │       ├── alert-dialog.tsx
│       │       └── (30+ more UI components)
│       │
│       ├── hooks/                       Custom React Hooks
│       │   ├── use-mobile.ts             Mobile detection
│       │   └── use-toast.ts              Toast notifications
│       │
│       ├── public/                      Static assets
│       │   └── (images, icons, fonts)
│       │
│       ├── styles/                      Global styles
│       │   └── globals.css
│       │
│       ├── next.config.mjs              Next.js configuration
│       ├── postcss.config.mjs           PostCSS/Tailwind config
│       ├── components.json              shadcn config
│       ├── tsconfig.json                TypeScript config (with path aliases)
│       ├── package.json                 Frontend dependencies
│       ├── .env.example                 Environment template
│       ├── .env.local                   Actual env (git ignored)
│       └── README.md                    Frontend documentation
│
├── 📚 docs/                             Shared Documentation
│   ├── README.md                        Main documentation index
│   ├── ARCHITECTURE.md                  System architecture overview
│   ├── QUICK_START.md                   Getting started guide
│   ├── ADVANCED_PATTERNS.md             Advanced design patterns
│   ├── TESTING.md                       Testing strategies
│   ├── API_REFERENCE.md                 API endpoint documentation
│   ├── QUIZ_SYSTEM.md                   Quiz system documentation
│   ├── FLOW_DIAGRAMS.md                 Flow diagrams and sequences
│   └── APPLICATION_STRUCTURE.md         Detailed structure documentation
│
├── 🔑 Root Configuration Files
│   ├── pnpm-workspace.yaml              Monorepo workspace config
│   ├── package.json                     Root scripts & workspace
│   ├── tsconfig.json                    Base TypeScript config
│   ├── next-env.d.ts                    Next.js type definitions
│   └── pnpm-lock.yaml                   Unified dependency lock file
│
└── 📖 Documentation Files
    ├── MONOREPO_README.md               Monorepo quick start
    ├── MIGRATION_GUIDE_MONOREPO.md      Complete migration guide
    ├── MONOREPO_SETUP_CHECKLIST.md      Setup verification checklist
    ├── MONOREPO_STRUCTURE.md            Structure overview
    ├── MIGRATION_GUIDE.md               (Original migration guide)
    ├── QUIZ_IMPLEMENTATION_SUMMARY.md   Quiz feature summary
    ├── QUIZ_QUICK_START.md              Quiz setup guide
    ├── QUIZ_API_REFERENCE.md            Quiz API endpoints
    ├── QUIZ_SYSTEM.md                   Quiz system details
    ├── INSTRUCTOR_APPROVAL.md           Instructor workflow
    ├── GMAIL_SETUP.md                   Email configuration
    ├── EMAIL_SETUP.md                   Email setup guide
    └── seed.ps1                         PowerShell seed script
```

## 🔄 Data Flow

### Example: Get List of Courses

```
Browser Request
    ↓
GET /api/courses
    ↓
┌──────────────────────────────────────────┐
│ Frontend (app/api/courses/route.ts)      │ ← HTTP Handler
│ - Parse query params                     │
│ - Call courseService.listCourses()       │
│ - Return JSON response                   │
└───────┬────────────────────────────────┬─┘
        ↓                                ↓
    Success                          Exception
        ↓                                ↓
┌──────────────────────────────┐   ┌──────────────────────┐
│ Backend Service              │   │ Exception Handler    │
│ lib/services/CourseService   │   │ - Catch exception    │
│ - Validate input             │   │ - Get HTTP status    │
│ - Check permissions          │   │ - Return error JSON  │
│ - Fetch from repository      │   └──────────────────────┘
└───────┬──────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Repository Layer                 │
│ lib/repositories/CourseRepository│
│ - Build Prisma query             │
│ - Execute database query         │
└───────┬──────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Prisma Client                    │
│ - Connect to MySQL               │
│ - Execute SQL                    │
│ - Return data                    │
└───────┬──────────────────────────┘
        ↓
    MySQL Database
        ↓
┌──────────────────────────────────────────┐
│ Response                                 │
│ {                                        │
│   "success": true,                       │
│   "data": [                              │
│     { "id": 1, "title": "React 101" },   │
│     { "id": 2, "title": "Node.js 101" }  │
│   ],                                     │
│   "total": 2                             │
│ }                                        │
└──────────────────────────────────────────┘
        ↓
    Browser Renders
```

## 📦 Package Dependencies

### Backend (`packages/backend/package.json`)
```json
{
  "name": "@e-learning/backend",
  "dependencies": {
    "@prisma/client": "^5.22.0",    Database ORM
    "bcryptjs": "^2.4.3",           Password hashing
    "dotenv": "^16.3.1"             Environment variables
  },
  "devDependencies": {
    "typescript": "^5.0.0",         TypeScript support
    "tsx": "^4.0.0",                Execute TypeScript
    "prisma": "^5.22.0"             Database CLI
  }
}
```

### Frontend (`packages/frontend/package.json`)
```json
{
  "name": "@e-learning/frontend",
  "dependencies": {
    "next": "^14.0.0",              Next.js 14
    "react": "^18.2.0",             React 18
    "@radix-ui/react-*": "^*",      UI primitives
    "tailwindcss": "^3.3.0",        CSS framework
    "clsx": "^2.0.0",               Class merging
    "zod": "^3.22.0"                Schema validation
  }
}
```

## 🚀 Development Workflow

### File Changes Auto-Reload

```
Edit File          → Save → Auto-rebuild/reload
─────────────────────────────────────────────
Backend Service    → lib/services/X.ts → 🔄 Changes available in API routes
Frontend Component → components/X.tsx → 🔄 Changes visible in browser
Database Schema    → prisma/schema.prisma → 🔄 Run pnpm db:push
```

## 🏗️ Import Paths

### Frontend importing from Backend
```typescript
// packages/frontend/app/api/courses/route.ts

// Option 1: Full path
import { courseService } from "@e-learning/backend/src/lib/services"

// Option 2: With path alias (if configured)
import { courseService } from "@backend/lib/services"

// Both work the same way
```

## 📈 Scaling the Monorepo

Future packages can be added:

```
packages/
├── backend/           Current backend
├── frontend/          Current frontend
├── mobile/            React Native app (in future)
├── admin/             Separate admin dashboard (in future)
├── shared/            Shared types & utilities (in future)
└── api-client/        API client library (in future)
```

Each uses the same pnpm-workspace.yaml

## ✅ Status

- **Backend**: ✅ 3-layer architecture complete with services, repositories, exceptions
- **Frontend**: ✅ Next.js App Router with components and pages
- **Database**: ✅ Prisma schema with 15+ models
- **Monorepo**: ✅ pnpm workspaces configured
- **Documentation**: ✅ Comprehensive guides and examples

---

**Last Updated**: 2026-01-12  
**Version**: 1.0  
**Architecture Style**: Monorepo with 3-layer backend architecture
