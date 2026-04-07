# API Endpoints Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### POST /auth/register
Register new user
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```
**Response:**
```json
{
  "message": "Registration successful",
  "user": { ... },
  "token": "jwt_token"
}
```

### POST /auth/login
Login user
**Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "jwt_token"
}
```

### GET /auth/me
Get current user (requires auth)
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "user": { ... }
}
```

### POST /auth/forgot-password
Request password reset
**Body:**
```json
{
  "email": "john@example.com"
}
```

### POST /auth/reset-password
Reset password with token
**Body:**
```json
{
  "token": "reset_token",
  "password": "NewPassword123"
}
```

## Courses

### GET /courses
Get courses with filters
**Query Params:**
- `page` (number)
- `limit` (number, default: 12)
- `search` (string)
- `category` (string, categoryId)
- `level` (string: BEGINNER, INTERMEDIATE, ADVANCED)
- `minPrice` (number)
- `maxPrice` (number)
- `sortBy` (string: createdAt, rating, totalStudents, price)
- `sortOrder` (string: asc, desc)

**Response:**
```json
{
  "courses": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

### GET /courses/featured
Get featured courses
**Response:**
```json
{
  "courses": [ ... ]
}
```

### GET /courses/:slug
Get course detail (optional auth)
**Response:**
```json
{
  "course": {
    "id": "...",
    "title": "...",
    "description": "...",
    "lessons": [ ... ],
    "quizzes": [ ... ],
    "isEnrolled": false,
    "enrollment": null
  }
}
```

## Categories

### GET /categories
Get all categories
**Response:**
```json
{
  "categories": [ ... ]
}
```

## Enrollments

### POST /enrollments
Enroll in course (requires auth)
**Body:**
```json
{
  "courseId": "course_id"
}
```

### GET /enrollments
Get user enrollments (requires auth)
**Query Params:**
- `status` (string: NOT_STARTED, IN_PROGRESS, COMPLETED)

**Response:**
```json
{
  "enrollments": [ ... ]
}
```

### GET /enrollments/:courseId
Get enrollment detail (requires auth)
**Response:**
```json
{
  "enrollment": {
    "id": "...",
    "course": { ... },
    "progress": 50,
    "lessonProgress": [ ... ]
  }
}
```

## Progress

### POST /progress
Update lesson progress (requires auth)
**Body:**
```json
{
  "lessonId": "lesson_id",
  "courseId": "course_id",
  "watchedDuration": 300,
  "status": "COMPLETED"
}
```

### GET /progress/:courseId
Get progress for course (requires auth)
**Response:**
```json
{
  "progress": [ ... ]
}
```

## Lessons

### GET /lessons/:lessonId
Get lesson detail (requires auth)
**Response:**
```json
{
  "lesson": {
    "id": "...",
    "title": "...",
    "videoUrl": "...",
    "progress": { ... },
    "notes": [ ... ]
  }
}
```

## Quizzes

### GET /quizzes/:quizId
Get quiz with questions (requires auth)
**Response:**
```json
{
  "quiz": {
    "id": "...",
    "title": "...",
    "questions": [ ... ] // without correctAnswer
  }
}
```

### POST /quizzes/:quizId/submit
Submit quiz answers (requires auth)
**Body:**
```json
{
  "answers": {
    "questionId1": "answer1",
    "questionId2": "answer2"
  }
}
```

### GET /quizzes/:quizId/attempts
Get quiz attempts history (requires auth)
**Response:**
```json
{
  "attempts": [ ... ]
}
```

## Transactions

### POST /transactions
Create transaction (requires auth)
**Body:**
```json
{
  "courseId": "course_id",
  "amount": 100000,
  "paymentMethod": "MANUAL"
}
```

### GET /transactions
Get user transactions (requires auth)
**Query Params:**
- `status` (string: PENDING, PAID, FAILED, CANCELLED)

**Response:**
```json
{
  "transactions": [ ... ]
}
```

### PATCH /transactions/:id
Update transaction status (requires auth)
**Body:**
```json
{
  "status": "PAID",
  "paymentProof": "url"
}
```

## Certificates

### GET /certificates
Get user certificates (requires auth)
**Response:**
```json
{
  "certificates": [ ... ]
}
```

### GET /certificates/course/:courseId
Get certificate for course (requires auth)
**Response:**
```json
{
  "certificate": { ... }
}
```

## Users

### GET /users/profile
Get user profile (requires auth)
**Response:**
```json
{
  "user": { ... }
}
```

### PUT /users/profile
Update profile (requires auth)
**Body:**
```json
{
  "name": "New Name",
  "phone": "081234567890",
  "bio": "..."
}
```

### PUT /users/password
Change password (requires auth)
**Body:**
```json
{
  "currentPassword": "...",
  "newPassword": "..."
}
```

### GET /users/activity
Get learning activity (requires auth)
**Query Params:**
- `limit` (number, default: 50)

**Response:**
```json
{
  "activities": [ ... ]
}
```

### GET /users/dashboard
Get dashboard stats (requires auth)
**Response:**
```json
{
  "stats": {
    "totalCourses": 10,
    "activeCourses": 5,
    "completedCourses": 3,
    "overallProgress": 65,
    "totalStudyHours": 120
  },
  "recentEnrollments": [ ... ],
  "recentActivities": [ ... ]
}
```

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard stats (requires admin)
**Response:**
```json
{
  "stats": {
    "totalUsers": 1000,
    "totalCourses": 50,
    "totalTransactions": 500,
    "totalRevenue": 50000000
  },
  "recentCourses": [ ... ],
  "recentTransactions": [ ... ]
}
```

### GET /admin/courses
Get all courses (requires admin)
**Response:**
```json
{
  "courses": [ ... ]
}
```

### POST /admin/courses
Create course (requires admin)
**Body (multipart/form-data):**
- `title` (string)
- `slug` (string)
- `description` (string)
- `shortDescription` (string)
- `price` (number)
- `level` (string)
- `categoryId` (string)
- `isPublished` (boolean)
- `thumbnail` (file)

### PUT /admin/courses/:id
Update course (requires admin)
**Body:** Same as POST

### DELETE /admin/courses/:id
Delete course (requires admin)

### POST /admin/courses/:courseId/lessons
Create lesson (requires admin)
**Body (multipart/form-data):**
- `title` (string)
- `description` (string)
- `duration` (number, minutes)
- `order` (number)
- `isPreview` (boolean)
- `video` (file)

### PUT /admin/lessons/:id
Update lesson (requires admin)

### DELETE /admin/lessons/:id
Delete lesson (requires admin)

### GET /admin/categories
Get all categories (requires admin)

### POST /admin/categories
Create category (requires admin)
**Body:**
```json
{
  "name": "Category Name",
  "slug": "category-slug",
  "description": "...",
  "icon": "..."
}
```

### PUT /admin/categories/:id
Update category (requires admin)

### DELETE /admin/categories/:id
Delete category (requires admin)

### GET /admin/users
Get all users (requires admin)
**Response:**
```json
{
  "users": [ ... ]
}
```

### PATCH /admin/users/:id/status
Update user status (requires admin)
**Body:**
```json
{
  "isActive": true
}
```

### GET /admin/transactions
Get all transactions (requires admin)
**Query Params:**
- `status` (string)

**Response:**
```json
{
  "transactions": [ ... ]
}
```

### PATCH /admin/transactions/:id/status
Update transaction status (requires admin)
**Body:**
```json
{
  "status": "PAID"
}
```

## Error Responses

All endpoints may return errors in this format:

```json
{
  "message": "Error message",
  "errors": [ ... ] // for validation errors
}
```

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

