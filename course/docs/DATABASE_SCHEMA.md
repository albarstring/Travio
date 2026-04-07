# Database Schema

## Entity Relationship Diagram

```
User (1) ────< (N) Enrollment (N) >─── (1) Course
  │                                              │
  │                                              │
  │ (1) ────< (N) Progress (N) >─── (1) Lesson ──┘
  │
  │ (1) ────< (N) QuizAttempt (N) >─── (1) Quiz ──┘
  │
  │ (1) ────< (N) Transaction
  │
  │ (1) ────< (N) Certificate
  │
  │ (1) ────< (N) Note
  │
  └── (1) ────< (N) Activity

Course (1) ────< (N) Lesson
Course (1) ────< (N) Quiz
Course (1) ────< (N) Certificate
Course (1) >─── (1) Category
Course (1) >─── (1) User (instructor)

Quiz (1) ────< (N) QuizQuestion
```

## Tables

### User
- `id` (UUID, PK)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: STUDENT, ADMIN)
- `avatar` (String, Optional)
- `phone` (String, Optional)
- `bio` (String, Optional)
- `isActive` (Boolean, Default: true)
- `emailVerified` (Boolean, Default: false)
- `resetToken` (String, Optional)
- `resetExpires` (DateTime, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Indexes:**
- email
- role

### Category
- `id` (UUID, PK)
- `name` (String, Unique)
- `slug` (String, Unique)
- `description` (String, Optional)
- `icon` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Indexes:**
- slug

### Course
- `id` (UUID, PK)
- `title` (String)
- `slug` (String, Unique)
- `description` (Text)
- `shortDescription` (String, Optional)
- `thumbnail` (String, Optional)
- `price` (Decimal, Default: 0)
- `level` (Enum: BEGINNER, INTERMEDIATE, ADVANCED)
- `categoryId` (UUID, FK → Category)
- `instructorId` (UUID, FK → User, Optional)
- `duration` (Int, Minutes)
- `totalLessons` (Int, Default: 0)
- `rating` (Decimal, Default: 0)
- `totalRatings` (Int, Default: 0)
- `totalStudents` (Int, Default: 0)
- `isPublished` (Boolean, Default: false)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Indexes:**
- categoryId
- slug
- isPublished

### Lesson
- `id` (UUID, PK)
- `courseId` (UUID, FK → Course)
- `title` (String)
- `description` (Text, Optional)
- `videoUrl` (String, Optional)
- `duration` (Int, Minutes)
- `order` (Int, Default: 0)
- `isPreview` (Boolean, Default: false)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Indexes:**
- courseId
- (courseId, order)

### Enrollment
- `id` (UUID, PK)
- `userId` (UUID, FK → User)
- `courseId` (UUID, FK → Course)
- `progress` (Decimal, Percentage, Default: 0)
- `status` (Enum: NOT_STARTED, IN_PROGRESS, COMPLETED)
- `enrolledAt` (DateTime)
- `completedAt` (DateTime, Optional)

**Unique Constraint:**
- (userId, courseId)

**Indexes:**
- userId
- courseId

### Progress
- `id` (UUID, PK)
- `userId` (UUID, FK → User)
- `lessonId` (UUID, FK → Lesson)
- `courseId` (UUID, Denormalized for query performance)
- `status` (Enum: NOT_STARTED, IN_PROGRESS, COMPLETED)
- `watchedDuration` (Int, Seconds, Default: 0)
- `completedAt` (DateTime, Optional)
- `updatedAt` (DateTime)

**Unique Constraint:**
- (userId, lessonId)

**Indexes:**
- (userId, courseId)

### Quiz
- `id` (UUID, PK)
- `courseId` (UUID, FK → Course)
- `title` (String)
- `description` (Text, Optional)
- `duration` (Int, Minutes)
- `passingScore` (Int, Percentage, Default: 70)
- `order` (Int, Default: 0)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Indexes:**
- courseId

### QuizQuestion
- `id` (UUID, PK)
- `quizId` (UUID, FK → Quiz)
- `question` (Text)
- `type` (String: multiple_choice, true_false, short_answer)
- `options` (JSON, Optional - untuk multiple choice)
- `correctAnswer` (String)
- `points` (Int, Default: 1)
- `order` (Int, Default: 0)
- `createdAt` (DateTime)

**Indexes:**
- quizId

### QuizAttempt
- `id` (UUID, PK)
- `userId` (UUID, FK → User)
- `quizId` (UUID, FK → Quiz)
- `score` (Decimal)
- `totalScore` (Decimal)
- `percentage` (Decimal)
- `passed` (Boolean)
- `answers` (JSON - Store user answers)
- `startedAt` (DateTime)
- `completedAt` (DateTime, Optional)

**Indexes:**
- userId
- quizId

### Transaction
- `id` (UUID, PK)
- `userId` (UUID, FK → User)
- `courseId` (UUID, FK → Course, Optional)
- `amount` (Decimal)
- `status` (Enum: PENDING, PAID, FAILED, CANCELLED)
- `paymentMethod` (String, Optional)
- `paymentProof` (String, Optional)
- `notes` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Indexes:**
- userId
- status
- createdAt

### Certificate
- `id` (UUID, PK)
- `userId` (UUID, FK → User)
- `courseId` (UUID, FK → Course)
- `certificateUrl` (String)
- `issuedAt` (DateTime)

**Unique Constraint:**
- (userId, courseId)

**Indexes:**
- userId
- courseId

### Note
- `id` (UUID, PK)
- `userId` (UUID, FK → User)
- `lessonId` (UUID, FK → Lesson)
- `content` (Text)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Indexes:**
- (userId, lessonId)

### Activity
- `id` (UUID, PK)
- `userId` (UUID, FK → User)
- `type` (String: lesson_completed, quiz_completed, course_enrolled, etc.)
- `description` (String)
- `metadata` (JSON, Optional)
- `createdAt` (DateTime)

**Indexes:**
- userId
- createdAt

## Relationships Summary

1. **User → Enrollment**: One-to-Many
2. **Course → Enrollment**: One-to-Many
3. **User → Progress**: One-to-Many
4. **Lesson → Progress**: One-to-Many
5. **User → QuizAttempt**: One-to-Many
6. **Quiz → QuizAttempt**: One-to-Many
7. **Quiz → QuizQuestion**: One-to-Many
8. **Course → Lesson**: One-to-Many
9. **Course → Quiz**: One-to-Many
10. **Course → Category**: Many-to-One
11. **Course → User (instructor)**: Many-to-One
12. **User → Transaction**: One-to-Many
13. **Course → Transaction**: Many-to-One
14. **User → Certificate**: One-to-Many
15. **Course → Certificate**: One-to-Many
16. **User → Note**: One-to-Many
17. **Lesson → Note**: One-to-Many
18. **User → Activity**: One-to-Many

## Data Types

- **UUID**: Unique identifier (Prisma UUID)
- **String**: Text field
- **Text**: Long text field
- **Decimal**: Decimal number (for prices, percentages)
- **Int**: Integer
- **Boolean**: True/False
- **DateTime**: Date and time
- **Enum**: Predefined values
- **JSON**: JSON data structure

## Indexes Strategy

Indexes are added for:
1. Foreign keys (for join performance)
2. Frequently queried fields (email, slug, status)
3. Composite indexes for common query patterns (userId + courseId)
4. Search fields (if implementing full-text search)

## Constraints

1. **Unique Constraints**:
   - User.email
   - Category.name, Category.slug
   - Course.slug
   - Enrollment(userId, courseId)
   - Progress(userId, lessonId)
   - Certificate(userId, courseId)

2. **Foreign Key Constraints**:
   - All FK relationships have CASCADE or SET NULL on delete
   - Enrollment, Progress, Certificate use CASCADE
   - Transaction.courseId uses SET NULL (transaction history preserved)

3. **Check Constraints** (via application):
   - Progress: 0-100
   - Rating: 0-5
   - Price: >= 0
   - Duration: >= 0

