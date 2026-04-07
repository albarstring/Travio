# Testing Guide - Backend Refactoring

Panduan lengkap untuk testing refactored backend architecture.

## 🧪 Testing Strategy

### Layer Testing

```
Route Handlers       ← Integration tests
     ↓
Services           ← Unit tests (most important)
     ↓
Repositories       ← Unit tests (with mocks)
     ↓
Database           ← E2E tests
```

## 🔧 Manual Testing (Postman/cURL)

### 1. Login Endpoint

```bash
# Success case
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"instructor@example.com","password":"password123"}'

# Expected: 200 OK
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "instructor@example.com",
    "role": "instructor",
    "needsProfileCompletion": true
  }
}

# Error case - missing email
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"password123"}'

# Expected: 400 Bad Request
{
  "success": false,
  "error": "Email is required",
  "code": "VALIDATION_ERROR"
}

# Error case - wrong password
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"instructor@example.com","password":"wrong"}'

# Expected: 401 Unauthorized
{
  "success": false,
  "error": "Invalid email or password",
  "code": "AUTHENTICATION_ERROR"
}
```

### 2. List Courses Endpoint

```bash
# Basic request
curl -X GET http://localhost:3000/api/courses

# Expected: 200 OK
{
  "success": true,
  "data": {
    "data": [...courses],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "pages": 5
    }
  }
}

# With pagination
curl -X GET "http://localhost:3000/api/courses?page=2&limit=20"

# With filters
curl -X GET "http://localhost:3000/api/courses?category=web&published=true"

# Error case - invalid page
curl -X GET "http://localhost:3000/api/courses?page=0"

# Expected: 400 Bad Request
{
  "success": false,
  "error": "Page must be at least 1",
  "code": "VALIDATION_ERROR"
}
```

### 3. Create Course Endpoint

```bash
# Success case
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Web Development 101",
    "description": "Learn web development from scratch",
    "instructorId": "instructor123",
    "category": "web",
    "price": 99.99
  }'

# Expected: 201 Created
{
  "success": true,
  "data": {
    "id": "course123",
    "title": "Web Development 101",
    "createdAt": "2026-01-12T..."
  }
}

# Error case - missing required fields
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Web Development 101"}'

# Expected: 400 Bad Request (ValidationException)

# Error case - invalid price
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Course",
    "description": "Description here",
    "instructorId": "123",
    "category": "web",
    "price": -50
  }'

# Expected: 400 Bad Request
{
  "success": false,
  "error": "Course price must be a positive number",
  "code": "VALIDATION_ERROR"
}
```

### 4. Get Course Detail

```bash
# Success
curl -X GET http://localhost:3000/api/courses/course123

# Expected: 200 OK

# Error case - not found
curl -X GET http://localhost:3000/api/courses/nonexistent

# Expected: 404 Not Found
{
  "success": false,
  "error": "Course not found",
  "code": "NOT_FOUND"
}
```

## 🎯 Unit Testing Services

### Test Setup

```typescript
// lib/services/__tests__/AuthService.test.ts
import { AuthService } from "@/lib/services/AuthService"
import { userRepository } from "@/lib/repositories/UserRepository"
import { AuthenticationException, ValidationException } from "@/lib/exceptions/AppException"

// Mock repository
jest.mock("@/lib/repositories/UserRepository")

describe("AuthService", () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
    jest.clearAllMocks()
  })

  // Test cases...
})
```

### Test Cases - AuthService

```typescript
describe("AuthService.login", () => {
  test("should successfully login with valid credentials", async () => {
    // Arrange
    const mockUser = {
      id: "user123",
      email: "test@example.com",
      password: "$2a$10$..." // hashed
    }
    ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

    // Act
    const result = await authService.login("test@example.com", "password123")

    // Assert
    expect(result.id).toBe("user123")
    expect(result.email).toBe("test@example.com")
    expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com")
  })

  test("should throw ValidationException if email is empty", async () => {
    // Act & Assert
    await expect(authService.login("", "password")).rejects.toThrow(ValidationException)
  })

  test("should throw AuthenticationException if user not found", async () => {
    // Arrange
    ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(null)

    // Act & Assert
    await expect(authService.login("test@example.com", "password")).rejects.toThrow(
      AuthenticationException
    )
  })

  test("should throw AuthenticationException if password is wrong", async () => {
    // Arrange
    const mockUser = { id: "user123", password: "$2a$10$..." }
    ;(userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser)
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

    // Act & Assert
    await expect(authService.login("test@example.com", "wrong")).rejects.toThrow(
      AuthenticationException
    )
  })
})
```

### Test Cases - CourseService

```typescript
describe("CourseService", () => {
  test("should list courses with pagination", async () => {
    // Arrange
    const mockCourses = [
      { id: "1", title: "Course 1" },
      { id: "2", title: "Course 2" }
    ]
    ;(courseRepository.findAll as jest.Mock).mockResolvedValue({
      data: mockCourses,
      pagination: { page: 1, limit: 10, total: 2, pages: 1 }
    })

    // Act
    const result = await courseService.listCourses(1, 10)

    // Assert
    expect(result.data).toHaveLength(2)
    expect(result.pagination.total).toBe(2)
  })

  test("should throw ValidationException for invalid page", async () => {
    await expect(courseService.listCourses(0, 10)).rejects.toThrow(ValidationException)
  })

  test("should create course with validation", async () => {
    // Arrange
    const courseData = {
      title: "New Course",
      description: "Description",
      instructorId: "inst123",
      category: "web",
      price: 99.99
    }

    // Act
    const result = await courseService.createCourse(
      courseData,
      "user123",
      "instructor"
    )

    // Assert
    expect(courseRepository.create).toHaveBeenCalledWith(courseData)
  })

  test("should throw AuthorizationException if user not instructor", async () => {
    const courseData = { /* ... */ }

    await expect(
      courseService.createCourse(courseData, "user123", "student")
    ).rejects.toThrow(AuthorizationException)
  })
})
```

## 🔄 Integration Testing

### Route Integration Test

```typescript
// app/api/courses/__tests__/route.test.ts
import { POST } from "@/app/api/courses/route"

describe("POST /api/courses", () => {
  test("should create course", async () => {
    // Arrange
    const request = new NextRequest("http://localhost/api/courses", {
      method: "POST",
      body: JSON.stringify({
        title: "Test Course",
        description: "Test Description",
        instructorId: "inst123",
        category: "web",
        price: 99.99
      })
    })

    // Act
    const response = await POST(request)
    const data = await response.json()

    // Assert
    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
  })

  test("should return 400 for missing fields", async () => {
    const request = new NextRequest("http://localhost/api/courses", {
      method: "POST",
      body: JSON.stringify({})
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
  })
})
```

## 🚀 Running Tests

### Setup Jest

```typescript
// jest.config.ts
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

export default createJestConfig({
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
})
```

### Run Commands

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- AuthService.test.ts

# Run in watch mode
npm test -- --watch

# Run integration tests only
npm test -- --testPathPattern=route.test.ts
```

## ✅ Checklist - Sebelum Deploy

- [ ] Semua unit tests pass
- [ ] Semua integration tests pass
- [ ] Manual testing dengan Postman/cURL berhasil
- [ ] Error handling tested
- [ ] Authorization checks tested
- [ ] Edge cases covered
- [ ] Database queries optimized
- [ ] No console.log statements in production
- [ ] Security headers set
- [ ] Rate limiting configured (optional)
- [ ] Logging configured
- [ ] Documentation updated

## 🐛 Debugging Tips

### 1. Add Debug Logging

```typescript
// lib/services/CourseService.ts
async createCourse(data, userId, userRole) {
  console.log("[CourseService] Creating course", { userId, title: data.title })
  
  try {
    const course = await this.courseRepo.create(data)
    console.log("[CourseService] Course created", { courseId: course.id })
    return course
  } catch (error) {
    console.error("[CourseService] Error creating course", error)
    throw error
  }
}
```

### 2. Check Exception Type

```typescript
// In route handler
catch (error) {
  console.error("Error type:", error.constructor.name)
  console.error("Error message:", error.message)
  console.error("Status code:", error.statusCode)
  
  return handleException(error)
}
```

### 3. Verify Database State

```typescript
// Quick check
import { prisma } from "@/lib/db"

const user = await prisma.user.findUnique({ where: { email: "test@example.com" } })
console.log("User found:", user)
```

## 📊 Test Coverage Goals

```
Statements: > 80%
Branches: > 75%
Functions: > 80%
Lines: > 80%
```

Focus areas:
- Service layer: 90%+
- Repository layer: 70%+
- Route handlers: 60%+ (integration tests)

---

**Next Phase**: Setup CI/CD dengan GitHub Actions untuk automated testing
