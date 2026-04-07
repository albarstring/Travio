# Backend Architecture Refactoring Guide

Dokumentasi struktur backend yang telah di-refactor mengikuti best practices Next.js dan OOP principles.

## 📁 Struktur Folder

```
lib/
├── exceptions/
│   └── AppException.ts          # Custom exception classes
├── repositories/
│   ├── UserRepository.ts        # User data access
│   ├── CourseRepository.ts      # Course data access (template)
│   └── index.ts                 # Export semua repositories
├── services/
│   ├── AuthService.ts           # Auth business logic
│   ├── CourseService.ts         # Course business logic (template)
│   └── index.ts                 # Export semua services
├── api-response.ts              # API response helpers
├── types.ts                     # Global types
└── db.ts                        # Database connection
```

## 🏗️ Arsitektur Layers

### 1. **Request Handler (Route.ts)**
- ✅ Hanya menangani HTTP request/response
- ✅ Parsing & validasi input dasar
- ✅ Memanggil service untuk business logic
- ✅ Format response yang konsisten

```typescript
// app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    const loginResponse = await authService.login(email, password)
    
    return successResponse(loginResponse)
  } catch (error) {
    return handleException(error)
  }
}
```

### 2. **Service Layer (OOP)**
- ✅ Business logic dan rules
- ✅ Koordinasi antar repository
- ✅ Custom exception throwing
- ✅ Data transformation

```typescript
// lib/services/AuthService.ts
export class AuthService {
  private userRepo: typeof userRepository

  async login(email: string, password: string): Promise<LoginResponse> {
    this.validateLoginInput(email, password)
    const user = await this.userRepo.findByEmail(email)
    await this.verifyPassword(password, user.password)
    return this.buildLoginResponse(user)
  }

  private validateLoginInput(email: string, password: string) {
    if (!email?.trim()) throw new ValidationException(...)
    if (!password) throw new ValidationException(...)
  }
}
```

### 3. **Repository Layer**
- ✅ Semua query database
- ✅ Abstraksi dari Prisma Client
- ✅ Reusable methods
- ✅ Single Responsibility

```typescript
// lib/repositories/UserRepository.ts
export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } })
  }
}
```

## 📋 Exception Handling

Custom exceptions untuk error handling yang terstruktur:

```typescript
import {
  ValidationException,
  AuthenticationException,
  NotFoundException,
  ConflictException
} from "@/lib/exceptions/AppException"

// Throw dengan status code otomatis
throw new ValidationException("Email is invalid")          // 400
throw new AuthenticationException("Invalid password")      // 401
throw new NotFoundException("User not found")              // 404
throw new ConflictException("Email already registered")   // 409
```

## 🔄 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Invalid email or password",
  "code": "AUTHENTICATION_ERROR"
}
```

## 📝 Best Practices Diterapkan

### ✅ Separation of Concerns
- Handler hanya request/response
- Service fokus pada business logic
- Repository fokus pada data access

### ✅ OOP Principles
- Class-based architecture
- Encapsulation (private methods)
- Single Responsibility
- Dependency Injection ready

### ✅ Error Handling
- Custom exception classes
- Consistent error format
- Proper HTTP status codes

### ✅ Security
- Async password verification dengan bcrypt
- Environment-based secure cookie
- Input validation di service layer

### ✅ Type Safety
- TypeScript interfaces untuk data
- Prisma types untuk database models
- Response type definitions

## 🚀 Cara Implementasi di Endpoint Lain

### Step 1: Buat Repository (jika belum ada)
```typescript
// lib/repositories/CourseRepository.ts
export class CourseRepository {
  async findById(id: string) { ... }
  async findAll() { ... }
  async create(data) { ... }
  async update(id, data) { ... }
  async delete(id) { ... }
}
```

### Step 2: Buat Service
```typescript
// lib/services/CourseService.ts
export class CourseService {
  private courseRepo: typeof courseRepository

  async getCourse(id: string) {
    const course = await this.courseRepo.findById(id)
    if (!course) throw new NotFoundException("Course not found")
    return course
  }
}
```

### Step 3: Update Route Handler
```typescript
// app/api/courses/[id]/route.ts
export async function GET(request, { params }) {
  try {
    const course = await courseService.getCourse(params.id)
    return successResponse(course)
  } catch (error) {
    return handleException(error)
  }
}
```

## 📚 File Templates

### UserRepository Template
```typescript
import { prisma } from "@/lib/db"
import type { User } from "@prisma/client"

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    })
  }
  
  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    })
  }
}
```

### Service Template
```typescript
import type { User } from "@prisma/client"
import { userRepository } from "@/lib/repositories/UserRepository"
import { ValidationException } from "@/lib/exceptions/AppException"

export class UserService {
  private userRepo: typeof userRepository

  constructor() {
    this.userRepo = userRepository
  }

  async getUser(id: string) {
    const user = await this.userRepo.findById(id)
    if (!user) throw new ValidationException("User not found")
    return user
  }
}
```

### Route Handler Template
```typescript
import { NextRequest } from "next/server"
import { successResponse, handleException } from "@/lib/api-response"
import { userService } from "@/lib/services/UserService"

export async function GET(request: NextRequest, { params }) {
  try {
    const user = await userService.getUser(params.id)
    return successResponse(user)
  } catch (error) {
    return handleException(error)
  }
}
```

## 🔑 Key Benefits

1. **Maintainability** - Kode mudah dipahami dan dimodifikasi
2. **Scalability** - Mudah menambah fitur baru
3. **Testability** - Service layer mudah di-test
4. **Reusability** - Repository methods dapat digunakan di berbagai service
5. **Type Safety** - TypeScript types di setiap layer
6. **Consistency** - Response format yang konsisten
7. **Security** - Centralized security logic

## 📖 Referensi

- [Next.js App Router API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Repository Pattern](https://refactoring.guru/design-patterns/repository)
- [Service Locator Pattern](https://refactoring.guru/design-patterns/service-locator)
- [Exception Handling Best Practices](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
