"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Edit2, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import type { Quiz, QuizQuestion, QuizAnswer } from "@/lib/types"

interface QuizManagementProps {
  courseId: string
}

export function QuizManagement({ courseId }: QuizManagementProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [showAddQuiz, setShowAddQuiz] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [expandedQuizzes, setExpandedQuizzes] = useState<Set<string>>(new Set())
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    passingScore: 70,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchQuizzes()
  }, [courseId])

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`/api/quizzes?courseId=${courseId}`)
      if (res.ok) {
        const data = await res.json()
        setQuizzes(data)
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      toast.error('Failed to load quizzes')
    }
  }

  const handleAddQuiz = async () => {
    if (!quizForm.title.trim()) {
      toast.error('Quiz title is required')
      return
    }

    setIsLoading(true)
    try {
      const method = editingQuiz ? 'PUT' : 'POST'
      const url = editingQuiz ? `/api/quizzes/${editingQuiz.id}` : '/api/quizzes'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          ...quizForm
        })
      })

      if (!res.ok) throw new Error('Failed to save quiz')

      toast.success(editingQuiz ? 'Quiz updated successfully' : 'Quiz created successfully')
      setQuizForm({ title: "", description: "", passingScore: 70 })
      setEditingQuiz(null)
      setShowAddQuiz(false)
      await fetchQuizzes()
    } catch (error) {
      console.error('Error saving quiz:', error)
      toast.error('Failed to save quiz')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return

    try {
      const res = await fetch(`/api/quizzes/${quizId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete quiz')

      toast.success('Quiz deleted successfully')
      await fetchQuizzes()
    } catch (error) {
      console.error('Error deleting quiz:', error)
      toast.error('Failed to delete quiz')
    }
  }

  const toggleQuiz = (quizId: string) => {
    const newExpanded = new Set(expandedQuizzes)
    if (newExpanded.has(quizId)) {
      newExpanded.delete(quizId)
    } else {
      newExpanded.add(quizId)
    }
    setExpandedQuizzes(newExpanded)
  }

  return (
    <Card className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quizzes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage quizzes for your course
          </p>
        </div>
        <Dialog open={showAddQuiz} onOpenChange={(open) => {
          setShowAddQuiz(open)
          if (!open) {
            setEditingQuiz(null)
            setQuizForm({ title: "", description: "", passingScore: 70 })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Quiz Title *</Label>
                <Input
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g., Chapter 1 Quiz"
                />
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  placeholder="Quiz description"
                  rows={3}
                />
              </div>
              <div>
                <Label>Passing Score (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={quizForm.passingScore}
                  onChange={(e) => setQuizForm({ ...quizForm, passingScore: parseInt(e.target.value) || 70 })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddQuiz} disabled={isLoading} className="flex-1">
                  {isLoading ? "Saving..." : editingQuiz ? "Update Quiz" : "Create Quiz"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddQuiz(false)
                    setEditingQuiz(null)
                    setQuizForm({ title: "", description: "", passingScore: 70 })
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No quizzes yet. Create your first quiz!</p>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="border-2">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleQuiz(quiz.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {expandedQuizzes.has(quiz.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {quiz.questions?.length || 0} questions • {quiz.passingScore}% passing score
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingQuiz(quiz)
                        setQuizForm({
                          title: quiz.title,
                          description: quiz.description || "",
                          passingScore: quiz.passingScore,
                        })
                        setShowAddQuiz(true)
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {expandedQuizzes.has(quiz.id) && (
                  <div className="mt-4 pl-8 space-y-3">
                    {quiz.questions && quiz.questions.length > 0 ? (
                      quiz.questions.map((question, idx) => (
                        <div key={question.id} className="text-sm border-l-2 border-muted pl-3">
                          <p className="font-medium">{idx + 1}. {question.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Type: {question.type}
                          </p>
                          {question.answers && question.answers.length > 0 && (
                            <ul className="text-xs mt-2 space-y-1">
                              {question.answers.map((answer) => (
                                <li key={answer.id} className={answer.isCorrect ? "text-green-600" : ""}>
                                  {answer.isCorrect && "✓ "}{answer.text}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No questions yet</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
}
