# Quiz System - Quick Start Guide

## For Instructors: Creating Quizzes

### Step 1: Navigate to Course Edit
1. Go to Instructor Dashboard
2. Click on a course to edit
3. Scroll down to the "**Quizzes**" section

### Step 2: Create a Quiz
1. Click "**Add Quiz**" button
2. Fill in:
   - **Quiz Title**: e.g., "Chapter 1 Assessment"
   - **Description**: Optional quiz description
   - **Passing Score**: Minimum percentage to pass (default: 70%)
3. Click "**Create Quiz**"

### Step 3: Add Questions (Via API for now)
To add questions programmatically:

```bash
POST /api/quizzes/{quizId}/questions
Content-Type: application/json

{
  "title": "What is 2 + 2?",
  "description": "Basic math question",
  "type": "multiple-choice",
  "order": 0,
  "answers": [
    { "text": "3", "isCorrect": false, "order": 0 },
    { "text": "4", "isCorrect": true, "order": 1 },
    { "text": "5", "isCorrect": false, "order": 2 }
  ]
}
```

### Step 4: Manage Quizzes
- **Edit**: Click edit icon to modify quiz details
- **Delete**: Click delete icon to remove quiz
- **View Questions**: Expand quiz card to see all questions and correct answers

---

## For Students: Taking Quizzes

### Step 1: Access Quiz
1. Open an enrolled course
2. Click the "**Quizzes**" tab at the top
3. See the list of available quizzes with question count

### Step 2: Start Quiz
1. Click on a quiz you haven't completed
2. The quiz player opens with the first question

### Step 3: Answer Questions
1. Read the question carefully
2. For **multiple choice/true-false**:
   - Click the radio button to select your answer
3. For **short answer**:
   - Type your answer in the text field
4. Click "**Next**" to go to the next question
5. Use "**Previous**" to review earlier questions

### Step 4: Submit Quiz
1. On the last question, click "**Submit Quiz**" instead of "Next"
2. Your answers are submitted and automatically graded

### Step 5: View Results
- See your **score percentage** (large display)
- See number of **correct answers** (X out of Y)
- See **passing score requirement**
- View **Pass/Fail status** with checkmark or X

### Notes on Quiz Attempts
- **One attempt per quiz**: You can only take each quiz once
- **Once completed**: You cannot retake the quiz
- **Automatic grading**: Score calculated immediately
- **Visible results**: Score shown on results screen

---

## Quiz Types Supported

### 1. Multiple Choice
- Student selects one correct answer from options
- Automatically graded

### 2. True/False
- Binary choice question
- Automatically graded

### 3. Short Answer
- Text input response
- Automatically graded by matching user response to stored correct answer
- (Currently basic implementation - can be enhanced)

---

## API Reference for Developers

### Create Quiz
```bash
POST /api/quizzes
{
  "courseId": "course-id",
  "title": "Quiz Title",
  "description": "Quiz description",
  "passingScore": 70,
  "order": 0
}
```

### Add Question
```bash
POST /api/quizzes/{quizId}/questions
{
  "title": "Question text",
  "type": "multiple-choice",
  "order": 0,
  "answers": [
    { "text": "Option 1", "isCorrect": false },
    { "text": "Option 2", "isCorrect": true }
  ]
}
```

### Submit Quiz Attempt
```bash
POST /api/quiz-attempts
{
  "userId": "user-id",
  "quizId": "quiz-id",
  "responses": {
    "question-id-1": "answer-id-1",
    "question-id-2": "answer-id-2"
  },
  "completed": true
}

Response:
{
  "id": "attempt-id",
  "score": 85,
  "earnedPoints": 17,
  "totalPoints": 20,
  "passed": true,
  "completedAt": "2026-01-09T..."
}
```

### Get Quiz with Questions
```bash
GET /api/quizzes/{quizId}

Response:
{
  "id": "quiz-id",
  "title": "Quiz Title",
  "questions": [
    {
      "id": "q1",
      "title": "Question 1",
      "type": "multiple-choice",
      "answers": [
        { "id": "a1", "text": "Option 1", "isCorrect": true }
      ]
    }
  ]
}
```

---

## Common Issues & Solutions

### Issue: "Quiz has no questions yet"
**Solution**: Add questions via API (UI coming soon)

### Issue: Cannot retake quiz
**Solution**: This is intentional - one attempt per quiz per student. Contact admin if you need to reset attempt.

### Issue: Score seems incorrect
**Solution**: Check that correct answers are properly marked with `isCorrect: true` in the database

### Issue: Questions not showing
**Solution**: Ensure questions are properly associated with the quiz and have answers defined

---

## Files Modified/Created

### New Files
- `components/quiz-management.tsx` - Instructor quiz management
- `components/quiz-player.tsx` - Student quiz interface
- `app/api/quizzes/route.ts` - Quiz CRUD API
- `app/api/quizzes/[id]/route.ts` - Quiz details API
- `app/api/quizzes/[id]/questions/route.ts` - Question creation
- `app/api/quiz-questions/[id]/route.ts` - Question updates
- `app/api/quiz-answers/[id]/route.ts` - Answer updates
- `app/api/quiz-attempts/route.ts` - Student attempts
- `QUIZ_SYSTEM.md` - This documentation

### Modified Files
- `prisma/schema.prisma` - Added Quiz models and relationships
- `lib/types.ts` - Added Quiz TypeScript interfaces
- `app/instructor/courses/[id]/edit/page.tsx` - Imported and added QuizManagement component
- `app/dashboard/courses/[id]/page.tsx` - Added quiz tab and QuizPlayer component

---

## Next Steps to Enhance

1. **Add Question Editor UI** in instructor course edit page
2. **Implement Quiz Analytics** dashboard for instructors
3. **Add Question Randomization** option
4. **Implement Timed Quizzes** with countdown timer
5. **Add Review Mode** - show correct answers after completion
6. **Create Question Bank** for reusing across courses
7. **Add Email Notifications** when quiz is completed
8. **Export Results** as PDF or CSV

