# Architecture Diagrams & Visualization

Visual representation dari refactored backend architecture.

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP Request/Response
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS ROUTE HANDLER                      │
│              (/app/api/*/route.ts)                           │
│  • Parse request                                             │
│  • Extract params/body                                       │
│  • Call service                                              │
│  • Format response                                           │
└────────────────┬────────────────────────────┬────────────────┘
                 │                            │
                 │ successResponse()          │ handleException()
                 │                            │
                 ↓                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER (OOP)                        │
│         (/lib/services/*.ts)                                 │
│  ├─ AuthService                                              │
│  ├─ CourseService                                            │
│  ├─ PaymentService                                           │
│  └─ ...                                                      │
│                                                              │
│  • Input validation                                          │
│  • Business logic                                            │
│  • Authorization checks                                      │
│  • Coordination                                              │
│  • Exception throwing                                        │
└─────────┬──────────────────────────────────┬────────────────┘
          │                                  │
          │ Throws exceptions                │
          │                                  │
          ↓                                  ↓
┌─────────────────────────────────────┐   ┌────────────────────┐
│    REPOSITORY LAYER (Data Access)   │   │ EXCEPTION LAYER    │
│  (/lib/repositories/*.ts)           │   │ (Error Handling)   │
│  ├─ UserRepository                  │   │                    │
│  ├─ CourseRepository                │   │ • ValidationEx.    │
│  ├─ PaymentRepository               │   │ • AuthenticationEx │
│  └─ ...                             │   │ • AuthorizationEx  │
│                                     │   │ • NotFoundEx       │
│  • findById()                       │   │ • ConflictEx       │
│  • findAll()                        │   │                    │
│  • create()                         │   │ Status codes:      │
│  • update()                         │   │ • 400, 401, 403,   │
│  • delete()                         │   │   404, 409, 500    │
└──────────┬──────────────────────────┘   └────────────────────┘
           │ Prisma Queries
           ↓
┌────────────────────────────────────────────────────────────┐
│                    PRISMA CLIENT                             │
└────────────┬─────────────────────────────────────────────────┘
             │ SQL
             ↓
┌────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                          │
│  • users, courses, payments, etc.                            │
└────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Example: Create Course

```
1. CLIENT REQUEST
   ┌─────────────────────────────────┐
   │ POST /api/courses               │
   │ {title, description, price, ... │
   └─────────┬───────────────────────┘

2. ROUTE HANDLER
   ┌──────────────────────────────────────┐
   │ app/api/courses/route.ts - POST()    │
   ├──────────────────────────────────────┤
   │ 1. Parse body                        │
   │ 2. Extract params from body          │
   │ 3. Call: courseService.createCourse( │
   │      data, userId, userRole)         │
   │ 4. Return: successResponse(result)   │
   └─────────┬────────────────────────────┘

3. SERVICE LAYER
   ┌──────────────────────────────────────┐
   │ CourseService.createCourse()         │
   ├──────────────────────────────────────┤
   │ 1. validateCreateCourse(data)        │
   │    ↓                                 │
   │    if (!title) throw ValidationEx.  │
   │                                      │
   │ 2. checkAuthorization(userRole)     │
   │    ↓                                 │
   │    if (role !== instructor & admin)  │
   │    throw AuthorizationEx.           │
   │                                      │
   │ 3. Call repository:                  │
   │    courseRepository.create(data)    │
   │                                      │
   │ 4. Return course object             │
   └─────────┬────────────────────────────┘

4. REPOSITORY LAYER
   ┌──────────────────────────────────────┐
   │ CourseRepository.create()            │
   ├──────────────────────────────────────┤
   │ return await prisma.course.create({  │
   │   title, description, price, ...     │
   │ })                                   │
   └─────────┬────────────────────────────┘

5. DATABASE
   ┌──────────────────────────────────────┐
   │ INSERT INTO courses (...)            │
   │ VALUES (...)                         │
   │ ↓                                    │
   │ New course record created            │
   └─────────┬────────────────────────────┘

6. RETURN CHAIN
   Repository ← course object
     ↓
   Service ← course object
     ↓
   Handler ← course object
     ↓
   successResponse(course) ← HTTP Response 201
     ↓
   CLIENT ← JSON response with course data
```

## 🎯 Request Flow Example: Error Handling

```
1. CLIENT REQUEST (Invalid Data)
   ┌─────────────────────────────────┐
   │ POST /api/courses               │
   │ {title: "", description: "...   │
   └─────────┬───────────────────────┘

2. ROUTE HANDLER - TRY BLOCK
   ┌──────────────────────────────────┐
   │ try {                             │
   │   courseService.createCourse()   │
   │ } catch (error) {               │
   │   ↓                              │
   └─────────┬──────────────────────────┘

3. SERVICE - VALIDATION
   ┌──────────────────────────────────┐
   │ validateCreateCourse(data)       │
   │ if (!data.title?.trim()) {       │
   │   throw new ValidationException( │
   │     "Title is required"          │
   │   )  ← status: 400               │
   └─────────┬──────────────────────────┘

4. EXCEPTION PROPAGATES
   Exception (status 400)
     ↑
   Caught in route.ts catch block
     ↓
   handleException(error)
     ↓
   Returns: NextResponse.json(
     {
       success: false,
       error: "Title is required",
       code: "VALIDATION_ERROR"
     },
     { status: 400 }
   )
     ↓
   CLIENT ← HTTP 400 with error message
```

## 🔐 Authorization Flow

```
REQUEST
  │ userId, userRole from auth
  ↓
SERVICE
  ├─ Is user authenticated?
  │  └─ No? → AuthenticationException (401)
  │
  ├─ Does user have required role?
  │  └─ No? → AuthorizationException (403)
  │
  ├─ Is user the owner/instructor?
  │  └─ No? → AuthorizationException (403)
  │
  └─ Proceed with business logic
       ↓
     SUCCESS
```

## 📊 Data Flow - CourseService

```
Input
  │
  ├─ courseId (string)
  ├─ userId (string)
  └─ userRole (string)
       ↓
    VALIDATION
      │
      ├─ courseId?.trim() ? ✓ : ValidationException
      ├─ userId?.trim() ? ✓ : ValidationException
      └─ userRole is valid ? ✓ : ValidationException
           ↓
    AUTHORIZATION
      │
      ├─ userRole in ["admin", "instructor"] ? ✓ : AuthorizationException
      └─ course.instructorId === userId OR userRole === "admin" ? ✓ : AuthorizationException
           ↓
    BUSINESS LOGIC
      │
      ├─ Fetch course via repository
      ├─ Process data
      └─ Return transformed response
           ↓
    Output: Course object OR Exception
```

## 🎨 Service Architecture

```
┌────────────────────────────────────┐
│       CourseService (Class)        │
├────────────────────────────────────┤
│ Properties:                        │
│  - courseRepository                │
│                                    │
│ Public Methods:                    │
│  - getCourse(id)                   │
│  - listCourses(page, limit)        │
│  - createCourse(data, userId, role)│
│  - updateCourse(id, data, ...)     │
│  - deleteCourse(id, ...)           │
│                                    │
│ Private Methods:                   │
│  - validateCourseInput(data)       │
│  - checkOwnership(...)             │
│  - transformResponse(...)          │
└─────────┬────────────────────────┘
          │
    Calls Repository
          │
          ↓
┌────────────────────────────────────┐
│      CourseRepository (Class)      │
├────────────────────────────────────┤
│ Public Methods:                    │
│  - findById(id)                    │
│  - findAll(page, limit, filters)   │
│  - create(data)                    │
│  - update(id, data)                │
│  - delete(id)                      │
│                                    │
│ Private Methods:                   │
│  - buildQuery(filters)             │
│  - calculatePagination(...)        │
└─────────┬────────────────────────┘
          │
    Uses Prisma Client
          │
          ↓
       Database
```

## 🔀 Exception Hierarchy

```
Error (JavaScript built-in)
  │
  └─ AppException (Custom)
       │
       ├─ ValidationException (400)
       │  └─ Input validation failed
       │
       ├─ AuthenticationException (401)
       │  └─ User not authenticated
       │
       ├─ AuthorizationException (403)
       │  └─ User not authorized
       │
       ├─ NotFoundException (404)
       │  └─ Resource not found
       │
       └─ ConflictException (409)
          └─ Resource already exists
```

## 📦 Response Format Tree

```
Response
  │
  ├─ Success (status 2xx)
  │  └─ {
  │      success: true,
  │      data: { ... }
  │     }
  │
  └─ Error (status 4xx, 5xx)
     └─ {
        success: false,
        error: "Message",
        code: "ERROR_CODE"
       }
```

## 🔗 Dependency Injection Ready

```
Current (No DI):
┌─────────────────────────────────┐
│ CourseService                   │
│  constructor() {                │
│    this.repo = courseRepository │
│  }                              │
└─────────────────────────────────┘

Future (With DI):
┌─────────────────────────────────┐
│ CourseService                   │
│  constructor(repo: Repo) {      │
│    this.repo = repo             │
│  }                              │
└─────────────────────────────────┘

Testing (Mock):
new CourseService(mockRepository)
```

## 📈 Scalability Path

```
Phase 1: Basic Separation ✅
├─ Handler
├─ Service
└─ Repository

Phase 2: Add Features 📋
├─ Middleware (Auth, Logging)
├─ Validators
├─ Utils
└─ Constants

Phase 3: Advanced Patterns 🚀
├─ Dependency Injection
├─ Event System
├─ Caching Layer
└─ Queue System

Phase 4: Infrastructure
├─ Docker
├─ CI/CD
├─ Monitoring
└─ Load Balancing
```

## 🧩 File Organization

```
lib/
├── exceptions/
│   └── AppException.ts ............ Error definitions
│
├── repositories/ .................. Data access layer
│   ├── index.ts
│   ├── UserRepository.ts
│   ├── CourseRepository.ts
│   ├── SectionRepository.ts
│   └── PaymentRepository.ts
│
├── services/ ....................... Business logic layer
│   ├── index.ts
│   ├── AuthService.ts
│   ├── CourseService.ts
│   ├── SectionService.ts
│   └── PaymentService.ts
│
├── api-response.ts ................ Response helpers
├── middleware/ .................... (Future) Auth, logging
├── validators/ .................... (Future) Validation schemas
├── utils/ ......................... Utility functions
└── types.ts ....................... TypeScript types
```

---

These diagrams help visualize:
- ✅ Overall architecture flow
- ✅ Request processing chain
- ✅ Error handling mechanism
- ✅ Authorization checks
- ✅ Data transformations
- ✅ Service structure
- ✅ Dependency relationships
- ✅ Scalability roadmap

Use these as reference when onboarding new team members or planning expansions.
