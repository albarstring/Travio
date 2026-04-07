# Advanced Architecture Patterns

Dokumentasi advanced patterns untuk implementasi yang lebih robust.

## 🔐 Authentication & Authorization Pattern

### 1. Extract User dari Request

Option A: Dari Cookie
```typescript
// lib/auth-utils.ts
import { cookies } from "next/headers"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("auth-session")
  
  if (!sessionCookie?.value) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

// Usage dalam route.ts
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    throw new AuthenticationException("Please login first")
  }

  const result = await service.create(body, user.userId, user.role)
  return successResponse(result, 201)
}
```

Option B: Dari Authorization Header
```typescript
// lib/auth-utils.ts
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function getUserFromHeader(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "")
  
  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as any
  } catch {
    throw new AuthenticationException("Invalid token")
  }
}

// Usage dalam route.ts
export async function POST(request: NextRequest) {
  const user = await getUserFromHeader(request)
  if (!user) {
    throw new AuthenticationException("Please login first")
  }

  const result = await service.create(body, user.userId, user.role)
  return successResponse(result, 201)
}
```

### 2. Authorization Middleware

```typescript
// lib/middleware/requireRole.ts
import { AuthorizationException } from "@/lib/exceptions/AppException"

export function requireRole(allowedRoles: string[]) {
  return (userRole: string | undefined) => {
    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AuthorizationException(
        `This action requires one of roles: ${allowedRoles.join(", ")}`
      )
    }
  }
}

// Usage dalam service
async createCourse(data, userId, userRole) {
  requireRole(["instructor", "admin"])(userRole)
  // ... rest of logic
}
```

### 3. Owner Check Pattern

```typescript
// lib/middleware/checkOwnership.ts
import { AuthorizationException } from "@/lib/exceptions/AppException"

export function checkOwnership(resourceOwnerId: string, userId: string, userRole: string) {
  if (userRole === "admin") {
    return // Admin dapat akses semua
  }

  if (resourceOwnerId !== userId) {
    throw new AuthorizationException("You don't have permission to access this resource")
  }
}

// Usage dalam service
async updateCourse(courseId, data, userId, userRole) {
  const course = await this.courseRepo.findById(courseId)
  checkOwnership(course.instructorId, userId, userRole)
  // ... rest of logic
}
```

## 🔄 Complex Transaction Pattern

```typescript
// lib/services/EnrollmentService.ts
import { prisma } from "@/lib/db"

export class EnrollmentService {
  async enrollStudent(courseId: string, userId: string) {
    // Using Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if already enrolled
      const existing = await tx.enrollment.findFirst({
        where: { courseId, userId }
      })

      if (existing) {
        throw new ConflictException("Already enrolled in this course")
      }

      // 2. Create enrollment
      const enrollment = await tx.enrollment.create({
        data: { courseId, userId }
      })

      // 3. Update student count
      await tx.course.update({
        where: { id: courseId },
        data: { studentCount: { increment: 1 } }
      })

      return enrollment
    })

    return result
  }
}
```

## 📊 Pagination Helper

```typescript
// lib/utils/pagination.ts
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function createPaginationQuery(params: PaginationParams) {
  const page = Math.max(1, params.page)
  const limit = Math.min(100, Math.max(1, params.limit))
  const skip = (page - 1) * limit

  return { skip, take: limit, page, limit }
}

export function createPaginationResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResult<T> {
  const pages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1
    }
  }
}

// Usage dalam service
async listCourses(page: number, limit: number) {
  const { skip, take } = createPaginationQuery({ page, limit })

  const [courses, total] = await Promise.all([
    prisma.course.findMany({ skip, take }),
    prisma.course.count()
  ])

  return createPaginationResult(courses, total, page, limit)
}
```

## 🎯 Filter Builder Pattern

```typescript
// lib/utils/filter-builder.ts
export class FilterBuilder {
  private filters: Record<string, any> = {}

  addStringFilter(key: string, value: string | undefined) {
    if (value?.trim()) {
      this.filters[key] = value.trim()
    }
    return this
  }

  addNumberFilter(key: string, value: number | undefined) {
    if (typeof value === "number" && !isNaN(value)) {
      this.filters[key] = value
    }
    return this
  }

  addBooleanFilter(key: string, value: string | undefined) {
    if (value === "true") {
      this.filters[key] = true
    } else if (value === "false") {
      this.filters[key] = false
    }
    return this
  }

  addIn(key: string, values: string[] | undefined) {
    if (Array.isArray(values) && values.length > 0) {
      this.filters[key] = { in: values }
    }
    return this
  }

  build() {
    return this.filters
  }
}

// Usage dalam route
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const filters = new FilterBuilder()
    .addStringFilter("category", searchParams.get("category") || undefined)
    .addStringFilter("level", searchParams.get("level") || undefined)
    .addBooleanFilter("isPublished", searchParams.get("published"))
    .build()

  const result = await courseService.listCourses(page, limit, filters)
  return successResponse(result)
}
```

## 🧮 Validation Schema Pattern

```typescript
// lib/validators/course-validator.ts
export const createCourseSchema = {
  title: (val: any) => {
    if (!val?.trim()) return "Title is required"
    if (val.length < 5) return "Title must be at least 5 characters"
    if (val.length > 200) return "Title must be less than 200 characters"
    return null
  },

  description: (val: any) => {
    if (!val?.trim()) return "Description is required"
    if (val.length < 20) return "Description must be at least 20 characters"
    return null
  },

  price: (val: any) => {
    const num = parseFloat(val)
    if (isNaN(num)) return "Price must be a number"
    if (num < 0) return "Price must be positive"
    if (num > 10000) return "Price is too high"
    return null
  }
}

export function validateCreateCourse(data: any) {
  const errors: Record<string, string> = {}

  Object.entries(createCourseSchema).forEach(([key, validator]) => {
    const error = (validator as any)(data[key])
    if (error) errors[key] = error
  })

  if (Object.keys(errors).length > 0) {
    throw new ValidationException(JSON.stringify(errors))
  }
}

// Usage dalam service
async createCourse(data, userId, userRole) {
  validateCreateCourse(data)
  // ... rest of logic
}
```

## 🔔 Event Pattern (Observer)

```typescript
// lib/events/EventBus.ts
type EventListener<T = any> = (data: T) => Promise<void> | void

export class EventBus {
  private listeners: Map<string, EventListener[]> = new Map()

  on<T = any>(event: string, listener: EventListener<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(listener)
  }

  async emit<T = any>(event: string, data: T) {
    const listeners = this.listeners.get(event) || []
    await Promise.all(listeners.map(listener => listener(data)))
  }
}

export const eventBus = new EventBus()

// Events
eventBus.on("course.created", async (course) => {
  console.log("New course created:", course.title)
  // Send email ke instructor, etc
})

eventBus.on("enrollment.created", async (enrollment) => {
  console.log("New enrollment:", enrollment)
  // Update analytics, send notification, etc
})

// Usage dalam service
async createCourse(data, userId, userRole) {
  const course = await this.courseRepo.create(data)
  await eventBus.emit("course.created", course)
  return course
}
```

## 📝 Logging Pattern

```typescript
// lib/logger.ts
export class Logger {
  static info(action: string, data?: any) {
    console.log(`[INFO] ${new Date().toISOString()} - ${action}`, data)
  }

  static error(action: string, error: any) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${action}`, error)
  }

  static warn(action: string, data?: any) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${action}`, data)
  }

  static debug(action: string, data?: any) {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${action}`, data)
    }
  }
}

// Usage
async createCourse(data, userId, userRole) {
  Logger.info("Creating course", { userId, title: data.title })
  
  try {
    const course = await this.courseRepo.create(data)
    Logger.info("Course created", { courseId: course.id })
    return course
  } catch (error) {
    Logger.error("Failed to create course", error)
    throw error
  }
}
```

## 🔐 Rate Limiting Pattern

```typescript
// lib/middleware/rateLimit.ts
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(key: string): boolean {
    const now = Date.now()
    const timestamps = this.requests.get(key) || []

    // Remove old requests
    const validTimestamps = timestamps.filter(
      ts => now - ts < this.windowMs
    )

    if (validTimestamps.length >= this.maxRequests) {
      return false
    }

    validTimestamps.push(now)
    this.requests.set(key, validTimestamps)
    return true
  }
}

// Usage dalam route
const limiter = new RateLimiter(10, 60000) // 10 requests per minute

export async function POST(request: NextRequest) {
  const userId = await getCurrentUser()
  
  if (!limiter.isAllowed(`user-${userId}`)) {
    throw new AppException("Too many requests", 429)
  }

  // ... proceed with request
}
```

## 🎨 Response Wrapper Pattern

```typescript
// lib/api-response.ts (extended)
export class ApiResponseBuilder<T> {
  private data?: T
  private error?: string
  private code?: string
  private status: number = 200

  withData(data: T) {
    this.data = data
    return this
  }

  withError(error: string, code?: string) {
    this.error = error
    this.code = code
    return this
  }

  withStatus(status: number) {
    this.status = status
    return this
  }

  build() {
    return {
      success: !this.error,
      ...(this.data && { data: this.data }),
      ...(this.error && { error: this.error }),
      ...(this.code && { code: this.code })
    }
  }

  toResponse() {
    return NextResponse.json(this.build(), { status: this.status })
  }
}

// Usage
const response = new ApiResponseBuilder<Course>()
  .withData(course)
  .withStatus(201)
  .toResponse()
```

---

**Next**: Implementasikan patterns ini secara bertahap sesuai kebutuhan project Anda.
