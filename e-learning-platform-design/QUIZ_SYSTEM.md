# Quiz System Implementation Guide

## Overview
A complete quiz system has been added to the e-learning platform, allowing instructors to create quizzes and students to take them with automatic scoring.

## Features Implemented

### 1. **Database Schema (Prisma)**
Added four new models to `prisma/schema.prisma`:

- **Quiz**: Main quiz model with course reference
  - `id`: Unique identifier
  - `courseId`: Foreign key to Course
  - `title`: Quiz title
  - `description`: Optional description
  - `order`: Sequence order in course
  - `passingScore`: Required score to pass (default 70%)
  - `isPublished`: Publish status
  - Relations: course, questions, attempts

- **QuizQuestion**: Individual quiz questions
  - `id`: Unique identifier
  - `quizId`: Foreign key to Quiz
  - `title`: Question text
  - `description`: Optional additional info
  - `type`: "multiple-choice" | "true-false" | "short-answer"
  - `order`: Question sequence
  - Relations: quiz, answers

- **QuizAnswer**: Answer options for questions
  - `id`: Unique identifier
  - `questionId`: Foreign key to QuizQuestion
  - `text`: Answer text
  - `isCorrect`: Boolean flag for correct answer
  - `order`: Option sequence
  - Relations: question

- **QuizAttempt**: Student quiz attempt tracking
  - `id`: Unique identifier
  - `userId`: Student user ID
  - `quizId`: Quiz ID
  - `score`: Calculated percentage score
  - `totalPoints`: Total number of questions
  - `earnedPoints`: Number of correct answers
  - `passed`: Boolean based on passing score
  - `responses`: JSON object storing user's selected answers
  - `startedAt`, `completedAt`: Timestamps
  - Relations: user, quiz

### 2. **API Endpoints**

#### Quiz Management
- `GET /api/quizzes?courseId={id}` - Get all quizzes for a course
- `POST /api/quizzes` - Create new quiz
- `GET /api/quizzes/{id}` - Get single quiz with questions
- `PUT /api/quizzes/{id}` - Update quiz
- `DELETE /api/quizzes/{id}` - Delete quiz

#### Quiz Questions
- `POST /api/quizzes/{id}/questions` - Add question to quiz

#### Quiz Question Details
- `PUT /api/quiz-questions/{id}` - Update question
- `DELETE /api/quiz-questions/{id}` - Delete question

#### Quiz Answers
- `PUT /api/quiz-answers/{id}` - Update answer
- `DELETE /api/quiz-answers/{id}` - Delete answer

#### Quiz Attempts (Student Responses)
- `POST /api/quiz-attempts` - Submit quiz attempt
  - Calculates score based on correct answers
  - Checks if passed based on quiz passing score
  - Returns attempt with score details
- `GET /api/quiz-attempts?userId={id}&quizId={id}` - Get student's attempt

### 3. **Instructor Components**

#### Quiz Management Component (`components/quiz-management.tsx`)
- Create, edit, delete quizzes
- View questions and answers within each quiz
- Set passing score for each quiz
- Expandable quiz cards showing question count
- Toast notifications for user feedback

Integration in: `app/instructor/courses/[id]/edit/page.tsx`
- Added after course structure/lessons section
- Allows instructors to manage quizzes alongside course content

### 4. **Student Components**

#### Quiz Player Component (`components/quiz-player.tsx`)
Features:
- Question-by-question navigation with progress bar
- Automatic score calculation
- Pass/fail status based on instructor-set passing score
- Support for multiple choice, true/false, and short answer questions
- Prevents retaking completed quizzes
- Shows results with score breakdown
- Previous/Next question navigation
- Disabled Next button if current question not answered

Integration in: `app/dashboard/courses/[id]/page.tsx`
- New "Quizzes" tab alongside "Lessons" tab
- Quiz selection list view
- Quiz player interface when quiz selected
- Shows quiz results on submission

### 5. **UI/UX Features**

#### Instructor Side
- **Quiz Management Card** in course edit page
  - Add Quiz button opens dialog
  - List all quizzes with expand/collapse
  - Show number of questions per quiz
  - Quick actions: Edit, Delete
  - Expandable view shows all questions and correct answers

#### Student Side
- **Tab Navigation** to switch between Lessons and Quizzes
- **Quiz Selection** - Browse available quizzes before starting
- **Question-by-Question Interface**
  - Progress bar showing question number and percentage
  - Radio buttons for multiple choice
  - Text input for short answer questions
  - Previous/Next navigation
  - Submit Quiz button on last question
- **Results Screen**
  - Large score display (green for pass, red for fail)
  - Points earned vs. total points
  - Passing score requirement shown
  - Cannot retake quiz after completion

### 6. **Type Definitions**

Added to `lib/types.ts`:
```typescript
export interface Quiz { ... }
export interface QuizQuestion { ... }
export interface QuizAnswer { ... }
export interface QuizAttempt { ... }
```

## User Flow

### For Instructors
1. Go to course edit page
2. Scroll to "Quizzes" section
3. Click "Add Quiz"
4. Enter quiz title, description, passing score
5. Create quiz
6. Quiz appears in list (questions can be added via API/future UI)
7. Edit or delete quiz as needed

### For Students
1. Open enrolled course
2. Click "Quizzes" tab (shows number of available quizzes)
3. Select a quiz from the list
4. Answer each question (navigate with Previous/Next)
5. Submit quiz
6. View score and results
7. Cannot retake the same quiz

## Database Schema Relationships

```
User
├── quizAttempts ──→ QuizAttempt

Course
└── quizzes ──→ Quiz
    ├── questions ──→ QuizQuestion
    │   └── answers ──→ QuizAnswer
    └── attempts ──→ QuizAttempt ──→ User
```

## Scoring Logic

Automatic calculation when quiz is submitted:
```
For each question:
  - If user's selected answer matches correct answer = +1 point

totalPoints = number of questions
earnedPoints = number of correct answers
score = (earnedPoints / totalPoints) * 100
passed = score >= quiz.passingScore
```

## Storage of User Responses

Responses stored as JSON in `QuizAttempt.responses`:
```json
{
  "question-id-1": "selected-answer-id-1",
  "question-id-2": "selected-answer-id-2",
  ...
}
```

## Future Enhancements

1. Add admin question creation UI in instructor course edit
2. Question editor with dynamic answer options
3. Quiz statistics dashboard (average scores, most missed questions)
4. Question bank for reusing questions across quizzes
5. Timed quizzes with countdown
6. Question randomization option
7. Show review of responses after submission
8. Export quiz results as PDF
9. Email notification when quiz is taken
10. Analytics on quiz performance by student

## Notes

- Quizzes are course-specific
- One attempt per user per quiz (unique constraint on userId + quizId)
- Automatic scoring based on correct answers
- Supports multiple question types (expandable)
- All quiz management handled via API endpoints
- Toast notifications for all user actions
- Fully responsive design for mobile students

