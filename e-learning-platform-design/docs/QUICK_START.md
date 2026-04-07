# 🚀 Quick Start - Backend Refactoring

Panduan singkat untuk mulai menggunakan architecture yang baru.

## ⚡ 5 Menit Setup

### 1. Understand the Pattern (2 min)

```
Handler (route.ts)
    ↓ Call service
Service (business logic)
    ↓ Call repository
Repository (database)
    ↓ Query via Prisma
Database
```

### 2. Look at Working Examples (2 min)

**Login Endpoint** (reference)
- Route: [app/api/auth/login/route.ts](../app/api/auth/login/route.ts)
- Service: [lib/services/AuthService.ts](../lib/services/AuthService.ts)
- Repository: [lib/repositories/UserRepository.ts](../lib/repositories/UserRepository.ts)

**Course Endpoints** (full examples)
- Routes: [app/api/courses/](../app/api/courses/)
- Service: [lib/services/CourseService.ts](../lib/services/CourseService.ts)
- Repository: [lib/repositories/CourseRepository.ts](../lib/repositories/CourseRepository.ts)

### 3. Copy Template (1 min)

Ambil pattern dari Course dan ubah sesuai kebutuhan.

## 📝 Step-by-Step: Refactor 1 Endpoint

### Step 1: Create Repository (3 min)

Copy dari `CourseRepository.ts`, ubah nama & queries:

```typescript
// lib/repositories/PaymentRepository.ts
import { prisma } from "@/lib/db"
import type { Payment } from "@prisma/client"

export class PaymentRepository {
  async findById(id: string): Promise<Payment | null> {
    return await prisma.payment.findUnique({
      where: { id },
      include: { user: true, course: true }
    })
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      prisma.payment.findMany({ skip, take: limit }),
      prisma.payment.count()
    ])
    return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
  }

  async create(data: any): Promise<Payment> {
    return await prisma.payment.create({ data })
  }
}

export const paymentRepository = new PaymentRepository()
```

### Step 2: Create Service (5 min)

Copy dari `CourseService.ts`, ubah logic:

```typescript
// lib/services/PaymentService.ts
import { paymentRepository } from "@/lib/repositories/PaymentRepository"
import { NotFoundException, ValidationException } from "@/lib/exceptions/AppException"

export class PaymentService {
  private paymentRepo: typeof paymentRepository

  constructor() {
    this.paymentRepo = paymentRepository
  }

  async getPayment(id: string) {
    if (!id?.trim()) throw new ValidationException("Payment ID required")

    const payment = await this.paymentRepo.findById(id)
    if (!payment) throw new NotFoundException("Payment not found")

    return payment
  }

  async listPayments(page: number = 1, limit: number = 10) {
    if (page < 1) throw new ValidationException("Page must be >= 1")

    return await this.paymentRepo.findAll(page, limit)
  }

  async processPayment(data: any) {
    this.validatePaymentData(data)
    return await this.paymentRepo.create(data)
  }

  private validatePaymentData(data: any) {
    if (!data.amount || data.amount <= 0) {
      throw new ValidationException("Invalid amount")
    }
  }
}

export const paymentService = new PaymentService()
```

### Step 3: Update Route (3 min)

Copy dari `app/api/courses/route.ts`, ubah service calls:

```typescript
// app/api/payments/route.ts
import { NextRequest } from "next/server"
import { successResponse, handleException } from "@/lib/api-response"
import { paymentService } from "@/lib/services/PaymentService"

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10)
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10", 10)

    const result = await paymentService.listPayments(page, limit)
    return successResponse(result)
  } catch (error) {
    return handleException(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const payment = await paymentService.processPayment(body)
    return successResponse(payment, 201)
  } catch (error) {
    return handleException(error)
  }
}
```

### Step 4: Export dari Index (1 min)

```typescript
// lib/repositories/index.ts - tambah
export { PaymentRepository, paymentRepository } from "./PaymentRepository"

// lib/services/index.ts - tambah
export { PaymentService, paymentService } from "./PaymentService"
```

### Step 5: Test (3 min)

```bash
# Test GET
curl http://localhost:3000/api/payments

# Test POST
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"amount": 99.99, "userId": "user123", "courseId": "course123"}'

# Test error
curl http://localhost:3000/api/payments/invalid-id
```

✅ Done! 15 minutes total.

## 🎯 Common Scenarios

### Scenario 1: Add Validation

```typescript
// In service
private validatePaymentData(data: any) {
  if (!data.amount) throw new ValidationException("Amount required")
  if (data.amount < 0) throw new ValidationException("Amount must be positive")
  if (data.amount > 10000) throw new ValidationException("Amount too high")
}
```

### Scenario 2: Add Authorization

```typescript
// In service
async updatePayment(id: string, data: any, userId: string, userRole: string) {
  const payment = await this.getPayment(id)

  // Check if user owns this payment
  if (payment.userId !== userId && userRole !== "admin") {
    throw new AuthorizationException("You can't update this payment")
  }

  return await this.paymentRepo.update(id, data)
}

// In route
export async function PUT(request, { params }) {
  const userId = "user123" // TODO: extract from auth
  const userRole = "user"   // TODO: extract from auth

  const payment = await paymentService.updatePayment(
    params.id,
    await request.json(),
    userId,
    userRole
  )

  return successResponse(payment)
}
```

### Scenario 3: Add Relationships

```typescript
// In repository
async findById(id: string) {
  return await prisma.payment.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      course: {
        select: { id: true, title: true }
      }
    }
  })
}

// Now payment.user & payment.course available in service
```

### Scenario 4: Add Filtering

```typescript
// In repository
async findAll(page: number = 1, limit: number = 10, filters?: {
  status?: string
  userId?: string
}) {
  const where: any = {}
  if (filters?.status) where.status = filters.status
  if (filters?.userId) where.userId = filters.userId

  const skip = (page - 1) * limit
  const [data, total] = await Promise.all([
    prisma.payment.findMany({ where, skip, take: limit }),
    prisma.payment.count({ where })
  ])
  
  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
}

// In service
async listPayments(page: number = 1, limit: number = 10, filters?: any) {
  return await this.paymentRepo.findAll(page, limit, filters)
}

// In route
export async function GET(request) {
  const status = request.nextUrl.searchParams.get("status")
  const userId = request.nextUrl.searchParams.get("userId")

  const result = await paymentService.listPayments(1, 10, { status, userId })
  return successResponse(result)
}
```

## 🔥 Pro Tips

### Tip 1: Use TypeScript Interfaces

```typescript
// lib/types/payment.ts
export interface CreatePaymentInput {
  amount: number
  userId: string
  courseId: string
  method: "credit_card" | "bank_transfer"
}

export interface PaymentResponse extends Payment {
  userDetails: { name: string; email: string }
  courseDetails: { title: string }
}

// In service
async processPayment(data: CreatePaymentInput) { ... }
```

### Tip 2: Reuse Validation Logic

```typescript
// lib/utils/validations.ts
export function validateAmount(amount: any): number {
  const num = parseFloat(amount)
  if (isNaN(num)) throw new ValidationException("Invalid amount")
  if (num <= 0) throw new ValidationException("Amount must be positive")
  return num
}

// In service
async processPayment(data: any) {
  const amount = validateAmount(data.amount)
  return await this.paymentRepo.create({ ...data, amount })
}
```

### Tip 3: Extract Common Patterns

```typescript
// lib/utils/repo-base.ts
export abstract class BaseRepository<T> {
  abstract findById(id: string): Promise<T | null>
  abstract findAll(page: number, limit: number): Promise<any>
  abstract create(data: any): Promise<T>
  abstract update(id: string, data: any): Promise<T>
  abstract delete(id: string): Promise<T>
}

// Then extend it
export class PaymentRepository extends BaseRepository<Payment> {
  async findById(id: string): Promise<Payment | null> { ... }
  // etc
}
```

### Tip 4: Add Logging

```typescript
// In service
async processPayment(data: any) {
  console.log("[Payment] Processing payment", { amount: data.amount })

  try {
    const payment = await this.paymentRepo.create(data)
    console.log("[Payment] Payment processed", { paymentId: payment.id })
    return payment
  } catch (error) {
    console.error("[Payment] Error processing payment", error)
    throw error
  }
}
```

## ⚠️ Common Mistakes

### ❌ Mistake 1: Repository with Business Logic

```typescript
// WRONG
async processPayment(data: any) {
  // This is business logic, not data access!
  const amount = parseFloat(data.amount) * 1.1 // Add tax
  return await prisma.payment.create({ amount })
}

// RIGHT - Put in Service
// Repository just does: return await prisma.payment.create(data)
```

### ❌ Mistake 2: Service with HTTP Logic

```typescript
// WRONG
async processPayment(data: any) {
  const response = NextResponse.json({ /* ... */ })
  return response
}

// RIGHT - Service returns plain data
// Handler formats response with successResponse/errorResponse
```

### ❌ Mistake 3: Handler with Business Logic

```typescript
// WRONG
export async function POST(request) {
  const data = await request.json()
  const amount = parseFloat(data.amount)
  if (amount < 0) return NextResponse.json({ error: "..." })
  const payment = await prisma.payment.create({ amount })
  return NextResponse.json(payment)
}

// RIGHT
export async function POST(request) {
  const data = await request.json()
  const payment = await paymentService.processPayment(data)
  return successResponse(payment, 201)
}
```

## 📚 Reference Files

Quick reference untuk copy-paste:

| Need | File |
|------|------|
| Basic repo | [UserRepository.ts](../lib/repositories/UserRepository.ts) |
| Complex repo | [CourseRepository.ts](../lib/repositories/CourseRepository.ts) |
| Basic service | [AuthService.ts](../lib/services/AuthService.ts) |
| Complex service | [CourseService.ts](../lib/services/CourseService.ts) |
| Route example | [app/api/courses/route.ts](../app/api/courses/route.ts) |
| Exceptions | [lib/exceptions/AppException.ts](../lib/exceptions/AppException.ts) |
| Response utils | [lib/api-response.ts](../lib/api-response.ts) |

## ✅ Checklist - Refactor 1 Endpoint

- [ ] Repository created dengan findById, findAll, create
- [ ] Service created dengan validation & business logic
- [ ] Route handler created dengan try-catch & successResponse
- [ ] Exports added to index.ts
- [ ] Manual testing berhasil
- [ ] Error cases tested
- [ ] Types defined

---

**Time Estimate**: 15 min per endpoint  
**Effort**: Easy  
**Impact**: High - code menjadi maintainable

👉 **Next**: Pick 1 endpoint dan refactor sekarang!
