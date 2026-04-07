# Backend Refactoring Implementation Checklist

Panduan step-by-step untuk refactor semua endpoint backend Anda ke arsitektur baru.

## ✅ Sudah Direfactor

- [x] **Login Endpoint** - `/app/api/auth/login/route.ts`
  - Repository: `UserRepository`
  - Service: `AuthService`
  - Status: ✅ Selesai

- [x] **Courses Endpoints** - `/app/api/courses/`
  - Repository: `CourseRepository`
  - Service: `CourseService`
  - GET `/api/courses` (list) - ✅
  - POST `/api/courses` (create) - ✅
  - GET `/api/courses/[id]` (detail) - ✅
  - DELETE `/api/courses/[id]` (delete) - ✅

## 📋 TODO: Refactor Endpoints Lainnya

### Authentication & User
- [ ] `/api/auth/signup` → SignupService
- [ ] `/api/auth/logout` → AuthService
- [ ] `/api/profile/[userId]` → ProfileService
- [ ] `/api/auth/verify-email` → EmailService

### Course Management
- [ ] `/api/sections` → SectionService
- [ ] `/api/lessons` → LessonService
- [ ] `/api/courses/[id]/publish` → CourseService

### Enrollment & Payments
- [ ] `/api/enrollments` → EnrollmentService
- [ ] `/api/payments` → PaymentService
- [ ] `/api/certificates` → CertificateService

### Quiz System
- [ ] `/api/quizzes` → QuizService
- [ ] `/api/quiz-questions` → QuizQuestionService
- [ ] `/api/quiz-attempts` → QuizAttemptService
- [ ] `/api/quiz-answers` → QuizAnswerService

### Reviews & Ratings
- [ ] `/api/reviews` → ReviewService

### Admin
- [ ] `/api/admin/*` → AdminService

## 🚀 Quick Implementation Guide

### 1️⃣ Buat Repository Class

```typescript
// lib/repositories/EntityRepository.ts
import { prisma } from "@/lib/db"
import type { Entity } from "@prisma/client"

export class EntityRepository {
  async findById(id: string): Promise<Entity | null> {
    return await prisma.entity.findUnique({
      where: { id }
    })
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      prisma.entity.findMany({ skip, take: limit }),
      prisma.entity.count()
    ])
    return { data, pagination: { page, limit, total } }
  }

  async create(data: any): Promise<Entity> {
    return await prisma.entity.create({ data })
  }

  async update(id: string, data: any): Promise<Entity> {
    return await prisma.entity.update({ where: { id }, data })
  }

  async delete(id: string): Promise<Entity> {
    return await prisma.entity.delete({ where: { id } })
  }
}

export const entityRepository = new EntityRepository()
```

### 2️⃣ Buat Service Class

```typescript
// lib/services/EntityService.ts
import type { Entity } from "@prisma/client"
import { entityRepository } from "@/lib/repositories/EntityRepository"
import { NotFoundException, ValidationException } from "@/lib/exceptions/AppException"

export class EntityService {
  private repo: typeof entityRepository

  constructor() {
    this.repo = entityRepository
  }

  async getEntity(id: string): Promise<Entity> {
    if (!id?.trim()) {
      throw new ValidationException("ID is required")
    }

    const entity = await this.repo.findById(id)
    if (!entity) {
      throw new NotFoundException("Entity not found")
    }

    return entity
  }

  async listEntities(page: number = 1, limit: number = 10) {
    return await this.repo.findAll(page, limit)
  }

  async createEntity(data: any): Promise<Entity> {
    // Validasi data
    this.validateInput(data)

    // Panggil repository
    return await this.repo.create(data)
  }

  private validateInput(data: any): void {
    // Implement validation logic
  }
}

export const entityService = new EntityService()
```

### 3️⃣ Update Route Handler

```typescript
// app/api/entities/route.ts
import { NextRequest } from "next/server"
import { successResponse, handleException } from "@/lib/api-response"
import { entityService } from "@/lib/services/EntityService"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)

    const result = await entityService.listEntities(page, limit)
    return successResponse(result)
  } catch (error) {
    return handleException(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const entity = await entityService.createEntity(body)
    return successResponse(entity, 201)
  } catch (error) {
    return handleException(error)
  }
}
```

## 📐 Architecture Pattern

```
Request Handler (route.ts)
    ↓
Service Layer (business logic)
    ↓
Repository Layer (data access)
    ↓
Database (Prisma)
```

## 🛡️ Exception Handling

```typescript
import {
  ValidationException,      // 400
  AuthenticationException,  // 401
  AuthorizationException,   // 403
  NotFoundException,        // 404
  ConflictException        // 409
} from "@/lib/exceptions/AppException"

// Usage dalam Service:
if (!data.email) throw new ValidationException("Email is required")
if (!user) throw new AuthenticationException("Invalid credentials")
if (user.role !== 'admin') throw new AuthorizationException("Access denied")
if (!entity) throw new NotFoundException("Not found")
if (duplicate) throw new ConflictException("Already exists")
```

## 📦 Response Format

Semua endpoint harus return format yang konsisten:

### Success (200, 201, etc)
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example"
  }
}
```

### Error (400, 401, 403, 404, 409, 500)
```json
{
  "success": false,
  "error": "User not found",
  "code": "NOT_FOUND"
}
```

## 🔑 Best Practices Checklist

Saat refactoring, pastikan:

- [x] Repository: Pure data access, no business logic
- [x] Service: Business logic, validations, authorization
- [x] Handler: Only HTTP concerns, call service, format response
- [x] Exceptions: Custom exceptions dengan appropriate status codes
- [x] Types: TypeScript interfaces untuk semua data flows
- [x] Error Handling: Try-catch dengan handleException utility
- [x] Validation: Input validation di service layer
- [x] Authorization: Check user role/permissions di service
- [x] Logging: Console.error untuk debugging
- [x] Comments: JSDoc comments di methods

## 🧪 Testing

Setelah refactor, pastikan:

```bash
# Test endpoint dengan curl atau Postman
curl -X GET http://localhost:3000/api/entities

# Check error handling
curl -X POST http://localhost:3000/api/entities \
  -H "Content-Type: application/json" \
  -d '{}' # Missing required fields
```

## 📚 File Structure Final

```
lib/
├── exceptions/
│   └── AppException.ts
├── repositories/
│   ├── index.ts
│   ├── UserRepository.ts
│   ├── CourseRepository.ts
│   ├── SectionRepository.ts
│   ├── LessonRepository.ts
│   ├── EnrollmentRepository.ts
│   └── ... (other repositories)
├── services/
│   ├── index.ts
│   ├── AuthService.ts
│   ├── CourseService.ts
│   ├── SectionService.ts
│   ├── LessonService.ts
│   ├── EnrollmentService.ts
│   └── ... (other services)
├── api-response.ts
└── ... (existing files)
```

## 💡 Tips & Tricks

1. **Singleton Pattern**: Gunakan singleton untuk services & repositories
   ```typescript
   export const entityService = new EntityService()
   ```

2. **Dependency Injection Ready**: Struktur memudahkan untuk add DI nanti
   ```typescript
   export class EntityService {
     constructor(private repo: EntityRepository) {}
   }
   ```

3. **Reusable Validation**: Extract common validations ke utils
   ```typescript
   // lib/utils/validations.ts
   export function validateEmail(email: string): void {
     if (!email?.includes("@")) throw new ValidationException(...)
   }
   ```

4. **Middleware Ready**: Responses siap untuk middleware di masa depan
   ```typescript
   // middleware.ts untuk auth, logging, etc
   ```

5. **Mock Friendly**: Repository pattern memudahkan mocking untuk tests
   ```typescript
   const mockRepo = { findById: jest.fn() }
   ```

## 🎯 Next Steps

1. ✅ Copy struktur dari endpoint yang sudah refactor
2. ✅ Implement untuk semua endpoint lainnya
3. ✅ Test setiap endpoint setelah refactor
4. ✅ Update API documentation
5. ✅ Add unit tests untuk services
6. ✅ Setup middleware untuk auth/logging

---

**Estimated Time**: ~2-3 jam untuk refactor semua endpoint  
**Complexity**: Low-Medium (pattern adalah sama, tinggal copy-paste + adapt)
