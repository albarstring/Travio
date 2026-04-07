# Quiz API - Complete Reference

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Quiz Management

#### Get All Quizzes for a Course
```bash
GET /quizzes?courseId={courseId}

Response (200):
[
  {
    "id": "quiz-123",
    "courseId": "course-456",
    "title": "Chapter 1 Quiz",
    "description": "Test your knowledge of Chapter 1",
    "passingScore": 70,
    "order": 0,
    "isPublished": false,
    "questions": [
      {
        "id": "q1",
        "title": "What is 2+2?",
        "type": "multiple-choice",
        "order": 0,
        "answers": [
          { "id": "a1", "text": "3", "isCorrect": false, "order": 0 },
          { "id": "a2", "text": "4", "isCorrect": true, "order": 1 }
        ]
      }
    ],
    "createdAt": "2026-01-09T...",
    "updatedAt": "2026-01-09T..."
  }
]
```

#### Create Quiz
```bash
POST /quizzes
Content-Type: application/json

Request:
{
  "courseId": "course-456",
  "title": "Chapter 1 Quiz",
  "description": "Test your knowledge of Chapter 1",
  "passingScore": 75,
  "order": 0
}

Response (201):
{
  "id": "quiz-123",
  "courseId": "course-456",
  "title": "Chapter 1 Quiz",
  "description": "Test your knowledge of Chapter 1",
  "passingScore": 75,
  "order": 0,
  "isPublished": false,
  "questions": [],
  "createdAt": "2026-01-09T...",
  "updatedAt": "2026-01-09T..."
}
```

#### Get Single Quiz
```bash
GET /quizzes/{quizId}

Response (200):
{
  "id": "quiz-123",
  "courseId": "course-456",
  "title": "Chapter 1 Quiz",
  "description": "Test your knowledge",
  "passingScore": 70,
  "questions": [
    {
      "id": "q1",
      "quizId": "quiz-123",
      "title": "What is the capital of France?",
      "description": "European geography question",
      "type": "multiple-choice",
      "order": 0,
      "answers": [
        { "id": "a1", "text": "London", "isCorrect": false, "order": 0 },
        { "id": "a2", "text": "Paris", "isCorrect": true, "order": 1 },
        { "id": "a3", "text": "Berlin", "isCorrect": false, "order": 2 }
      ]
    }
  ]
}
```

#### Update Quiz
```bash
PUT /quizzes/{quizId}
Content-Type: application/json

Request:
{
  "title": "Updated Quiz Title",
  "passingScore": 80,
  "isPublished": true
}

Response (200):
{
  "id": "quiz-123",
  "title": "Updated Quiz Title",
  "passingScore": 80,
  "isPublished": true,
  ...
}
```

#### Delete Quiz
```bash
DELETE /quizzes/{quizId}

Response (200):
{
  "success": true
}
```

---

### 2. Question Management

#### Add Question to Quiz
```bash
POST /quizzes/{quizId}/questions
Content-Type: application/json

Request:
{
  "title": "What is 2+2?",
  "description": "Basic arithmetic",
  "type": "multiple-choice",
  "order": 0,
  "answers": [
    { "text": "3", "isCorrect": false, "order": 0 },
    { "text": "4", "isCorrect": true, "order": 1 },
    { "text": "5", "isCorrect": false, "order": 2 },
    { "text": "6", "isCorrect": false, "order": 3 }
  ]
}

Response (201):
{
  "id": "q1",
  "quizId": "quiz-123",
  "title": "What is 2+2?",
  "description": "Basic arithmetic",
  "type": "multiple-choice",
  "order": 0,
  "answers": [
    { "id": "a1", "text": "3", "isCorrect": false, "order": 0 },
    { "id": "a2", "text": "4", "isCorrect": true, "order": 1 },
    { "id": "a3", "text": "5", "isCorrect": false, "order": 2 },
    { "id": "a4", "text": "6", "isCorrect": false, "order": 3 }
  ],
  "createdAt": "2026-01-09T...",
  "updatedAt": "2026-01-09T..."
}
```

#### Update Question
```bash
PUT /quiz-questions/{questionId}
Content-Type: application/json

Request:
{
  "title": "Updated question text",
  "type": "true-false",
  "order": 1
}

Response (200):
{
  "id": "q1",
  "title": "Updated question text",
  "type": "true-false",
  "order": 1,
  ...
}
```

#### Delete Question
```bash
DELETE /quiz-questions/{questionId}

Response (200):
{
  "success": true
}
```

---

### 3. Answer Management

#### Update Answer
```bash
PUT /quiz-answers/{answerId}
Content-Type: application/json

Request:
{
  "text": "Updated answer text",
  "isCorrect": true,
  "order": 0
}

Response (200):
{
  "id": "a1",
  "questionId": "q1",
  "text": "Updated answer text",
  "isCorrect": true,
  "order": 0,
  "updatedAt": "2026-01-09T..."
}
```

#### Delete Answer
```bash
DELETE /quiz-answers/{answerId}

Response (200):
{
  "success": true
}
```

---

### 4. Quiz Attempts (Student Responses)

#### Start/Submit Quiz
```bash
POST /quiz-attempts
Content-Type: application/json

Request (Start quiz - no responses yet):
{
  "userId": "user-123",
  "quizId": "quiz-456",
  "responses": {},
  "completed": false
}

Response (201):
{
  "id": "attempt-789",
  "userId": "user-123",
  "quizId": "quiz-456",
  "score": null,
  "totalPoints": 0,
  "earnedPoints": 0,
  "passed": null,
  "responses": {},
  "startedAt": "2026-01-09T...",
  "completedAt": null,
  "createdAt": "2026-01-09T...",
  "updatedAt": "2026-01-09T..."
}
```

```bash
POST /quiz-attempts
Content-Type: application/json

Request (Submit completed quiz):
{
  "userId": "user-123",
  "quizId": "quiz-456",
  "responses": {
    "q1": "a2",
    "q2": "a3",
    "q3": "a1"
  },
  "completed": true
}

Response (201 - Auto-graded):
{
  "id": "attempt-789",
  "userId": "user-123",
  "quizId": "quiz-456",
  "score": 66.67,
  "totalPoints": 3,
  "earnedPoints": 2,
  "passed": false,
  "responses": {
    "q1": "a2",
    "q2": "a3",
    "q3": "a1"
  },
  "startedAt": "2026-01-09T10:00:00Z",
  "completedAt": "2026-01-09T10:05:30Z",
  "createdAt": "2026-01-09T...",
  "updatedAt": "2026-01-09T..."
}
```

#### Get Student's Quiz Attempt
```bash
GET /quiz-attempts?userId={userId}&quizId={quizId}

Response (200):
{
  "id": "attempt-789",
  "userId": "user-123",
  "quizId": "quiz-456",
  "score": 85,
  "totalPoints": 20,
  "earnedPoints": 17,
  "passed": true,
  "responses": {
    "q1": "a2",
    "q2": "a3",
    ...
  },
  "completedAt": "2026-01-09T..."
}

// Returns null if no attempt found:
null
```

---

## Question Types

### Multiple Choice
```json
{
  "type": "multiple-choice",
  "answers": [
    { "text": "Option 1", "isCorrect": false },
    { "text": "Option 2", "isCorrect": true },
    { "text": "Option 3", "isCorrect": false }
  ]
}
```

### True/False
```json
{
  "type": "true-false",
  "answers": [
    { "text": "True", "isCorrect": true },
    { "text": "False", "isCorrect": false }
  ]
}
```

### Short Answer
```json
{
  "type": "short-answer",
  "answers": [
    { "text": "Paris", "isCorrect": true }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "courseId and title are required"
}
```

### 404 Not Found
```json
{
  "error": "Quiz not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Scoring Logic

Automatic scoring when quiz is submitted:

```javascript
// For each question in the quiz
for (let question of quiz.questions) {
  const userAnswer = responses[question.id]
  const selectedAnswer = question.answers.find(a => a.id === userAnswer)
  
  if (selectedAnswer?.isCorrect) {
    earnedPoints += 1
  }
}

totalPoints = quiz.questions.length
score = (earnedPoints / totalPoints) * 100
passed = score >= quiz.passingScore
```

---

## Rate Limiting

No rate limiting currently implemented. Add as needed in production.

---

## Authentication

All endpoints assume authenticated user. Pass `userId` in request body.

---

## Example: Complete Quiz Creation Flow

```bash
# 1. Create Quiz
POST /quizzes
{
  "courseId": "course-123",
  "title": "Physics Quiz",
  "passingScore": 70
}
# Response: { "id": "quiz-456", ... }

# 2. Add First Question
POST /quizzes/quiz-456/questions
{
  "title": "What is the speed of light?",
  "type": "multiple-choice",
  "order": 0,
  "answers": [
    { "text": "300,000 km/s", "isCorrect": true, "order": 0 },
    { "text": "150,000 km/s", "isCorrect": false, "order": 1 },
    { "text": "450,000 km/s", "isCorrect": false, "order": 2 }
  ]
}

# 3. Add Second Question
POST /quizzes/quiz-456/questions
{
  "title": "Gravity is a force",
  "type": "true-false",
  "order": 1,
  "answers": [
    { "text": "True", "isCorrect": true, "order": 0 },
    { "text": "False", "isCorrect": false, "order": 1 }
  ]
}

# 4. Get Complete Quiz
GET /quizzes/quiz-456
# Shows all questions and answers

# 5. Student Takes Quiz
POST /quiz-attempts
{
  "userId": "user-789",
  "quizId": "quiz-456",
  "responses": {
    "q1": "a1",  # Correct answer
    "q2": "a1"   # Correct answer
  },
  "completed": true
}
# Response: { "score": 100, "passed": true, ... }
```

---

## Troubleshooting

### Quiz has no questions
Add questions using the POST /quizzes/{id}/questions endpoint

### Answers not showing in quiz
Ensure answers array is not empty in the create question request

### Incorrect score calculation
Verify that only ONE answer per question has `isCorrect: true`

### Student can retake quiz
This is intentional - enforce one attempt per student in your UI

---

## Version History

- **v1.0** (Jan 9, 2026) - Initial implementation
  - Quiz CRUD operations
  - Multiple choice, true/false, short answer questions
  - Automatic scoring
  - Student attempt tracking
  - One attempt per user enforcement

