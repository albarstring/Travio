"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { Quiz, QuizAttempt } from "@/lib/types"

interface QuizPlayerProps {
  quiz: Quiz
  userId: string
  onComplete?: (attempt: QuizAttempt) => void
}

export function QuizPlayer({ quiz, userId, onComplete }: QuizPlayerProps) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)

  useEffect(() => {
    // Check if user already attempted this quiz
    checkAttempt()
  }, [quiz.id, userId])

  const checkAttempt = async () => {
    try {
      const res = await fetch(
        `/api/quiz-attempts?userId=${userId}&quizId=${quiz.id}`
      )
      if (res.ok) {
        const data = await res.json()
        if (data?.completedAt) {
          setAttempt(data)
          setSubmitted(true)
        }
      }
    } catch (error) {
      console.error('Error checking attempt:', error)
    }
  }

  const handleSubmit = async () => {
    if (!quiz.questions || quiz.questions.length === 0) {
      toast.error('Quiz has no questions')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          quizId: quiz.id,
          responses,
          completed: true
        })
      })

      if (!res.ok) throw new Error('Failed to submit quiz')

      const data = await res.json()
      setAttempt(data)
      setSubmitted(true)
      toast.success(`Quiz completed! Score: ${data.score}%`)
      onComplete?.(data)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted && attempt) {
    const passed = attempt.passed ? 'text-green-600' : 'text-red-600'
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">Quiz Completed!</h3>
          <div className={`text-4xl font-bold ${passed}`}>
            {attempt.score}%
          </div>
          <p className={passed}>
            {attempt.passed ? '✓ Passed' : '✗ Not Passed'}
          </p>
          <p className="text-muted-foreground">
            You answered {attempt.earnedPoints} out of {attempt.totalPoints} questions correctly.
          </p>
          <p className="text-muted-foreground text-sm">
            Passing score: {quiz.passingScore}%
          </p>
        </div>
      </Card>
    )
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">This quiz has no questions yet.</p>
      </Card>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div>
          <h3 className="text-lg font-bold mb-4">{question.title}</h3>
          {question.description && (
            <p className="text-sm text-muted-foreground mb-4">{question.description}</p>
          )}

          {/* Answers */}
          {question.type === 'multiple-choice' || question.type === 'true-false' ? (
            <RadioGroup
              value={responses[question.id] || ''}
              onValueChange={(value) =>
                setResponses({ ...responses, [question.id]: value })
              }
            >
              <div className="space-y-3">
                {question.answers?.map((answer) => (
                  <div key={answer.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={answer.id} id={answer.id} />
                    <Label htmlFor={answer.id} className="cursor-pointer flex-1">
                      {answer.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          ) : (
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Your answer"
              value={responses[question.id] || ''}
              onChange={(e) =>
                setResponses({ ...responses, [question.id]: e.target.value })
              }
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-2 justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={!responses[question.id]}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !responses[question.id]}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
