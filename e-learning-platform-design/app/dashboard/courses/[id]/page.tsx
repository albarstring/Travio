"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, ChevronLeft, Play, CheckCircle2, Lock, Download } from "lucide-react"
import { getSession } from "@/lib/auth"
import type { Course, Lesson, Section } from "@/lib/types"
import { YouTubeEmbed } from "@/components/youtube-embed"
import { QuizPlayer } from "@/components/quiz-player"
import { ChevronDown, ChevronRight } from "lucide-react"
import { downloadCertificateAsPDF } from "@/lib/certificate-utils"
import { toast } from "sonner"

export default function CoursePlayPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const [session, setSession] = useState(getSession())
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [enrollment, setEnrollment] = useState(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [certificateId, setCertificateId] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'lessons' | 'quizzes'>('lessons')

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        // Fetch course data
        const courseResponse = await fetch(`/api/courses/${courseId}`)
        if (!courseResponse.ok) {
          router.push('/dashboard')
          return
        }
        const courseData = await courseResponse.json()
        setCourse(courseData)

        // Fetch enrollment data
        const enrollmentResponse = await fetch(`/api/enrollments?userId=${session.userId}&courseId=${courseId}&email=${session.email || ''}`)
        if (enrollmentResponse.ok) {
          const enrollmentData = await enrollmentResponse.json()
          if (enrollmentData) {
            setEnrollment(enrollmentData)
          } else {
            // If not enrolled, redirect to course page
            router.push(`/courses/${courseId}`)
            return
          }
        }

        // Fetch quizzes for this course
        const quizzesResponse = await fetch(`/api/quizzes?courseId=${courseId}`)
        if (quizzesResponse.ok) {
          const quizzesData = await quizzesResponse.json()
          setQuizzes(quizzesData)
        }

        // Set first incomplete lesson or first lesson
        const allLessons = courseData.sections?.flatMap((s: Section) => s.lessons || []) || []
        if (allLessons.length > 0) {
          setCurrentLesson(allLessons[0])
        }
        
        // Expand all sections by default
        if (courseData.sections) {
          setExpandedSections(new Set(courseData.sections.map((s: Section) => s.id)))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/dashboard')
      }
    }

    fetchData()
  }, [session, courseId, router])

  if (!session || !course) {
    return null
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Not Enrolled</h1>
          <p className="text-muted-foreground mb-6">Please enroll in this course first.</p>
          <Button asChild>
            <Link href={`/courses/${courseId}`}>View Course</Link>
          </Button>
        </Card>
      </div>
    )
  }

  // Helper function to get all lessons from sections
  const getAllLessons = () => {
    if (!course?.sections) return []
    return course.sections.flatMap(section => section.lessons || [])
  }

  // Helper function to get parsed completed lessons
  const getCompletedLessons = (): string[] => {
    if (!enrollment) return []
    try {
      if (typeof enrollment.completedLessons === 'string') {
        const parsed = JSON.parse(enrollment.completedLessons)
        return Array.isArray(parsed) ? parsed : []
      } else if (Array.isArray(enrollment.completedLessons)) {
        return enrollment.completedLessons
      }
    } catch (e) {
      console.error('Error parsing completedLessons:', e)
    }
    return []
  }

  // Helper function to get next/previous lesson
  const getNextLesson = () => {
    const allLessons = getAllLessons()
    if (!currentLesson) return null
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id)
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  }

  const getPreviousLesson = () => {
    const allLessons = getAllLessons()
    if (!currentLesson) return null
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id)
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null
  }

  const handleLessonComplete = async () => {
    if (!currentLesson || !enrollment) return

    try {
      const response = await fetch(`/api/enrollments/${enrollment.id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completed: true,
        }),
      })

      if (response.ok) {
        const updatedEnrollment = await response.json()
        setEnrollment(updatedEnrollment)
        
        // Show certificate alert if course is completed
        if (updatedEnrollment.courseCompleted) {
          // Fetch certificate ID - wait a moment for certificate to be created
          setTimeout(async () => {
            try {
              const certQuery = new URLSearchParams({
                userId: session?.userId || '',
                courseId: courseId
              })
              const certResponse = await fetch(`/api/certificates/user?${certQuery}`)
              if (certResponse.ok) {
                const cert = await certResponse.json()
                console.log('[DOWNLOAD] Certificate fetched:', cert)
                if (cert && cert.id) {
                  setCertificateId(cert.id)
                  console.log('[DOWNLOAD] Certificate ID set:', cert.id)
                } else {
                  console.warn('[DOWNLOAD] No certificate found in response')
                }
              } else {
                const errorText = await certResponse.text()
                console.error('[DOWNLOAD] Failed to fetch certificate:', certResponse.status, errorText)
              }
            } catch (error) {
              console.error('[DOWNLOAD] Error fetching certificate:', error)
            }
          }, 1500)
          
          setTimeout(() => {
            alert('🎉 Congratulations! You have completed this course!\n\nYour certificate has been generated and is now available in your profile. You can download it below.')
          }, 500)
        }
      } else {
        let errorData = { error: 'Unknown error' }
        let errorText = ''
        try {
          errorText = await response.text()
          console.log('[DEBUG] Raw error response:', errorText)
          if (errorText && errorText.trim()) {
            errorData = JSON.parse(errorText)
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
        }
        
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          rawResponse: errorText
        }
        
        console.error('Failed to update lesson progress:', errorDetails)
        toast.error(errorData.error || `Failed to update lesson progress (${response.status}). Please try again.`)
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error)
      toast.error('An error occurred while updating lesson progress. Please try again.')
    }
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleDownloadCertificate = async () => {
    if (!certificateId) return
    
    try {
      setDownloading(true)
      await downloadCertificateAsPDF(
        certificateId,
        session?.name || 'User',
        course?.title || 'Course'
      )
    } catch (error) {
      console.error('Failed to download certificate:', error)
      alert('Failed to download certificate. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="text-right">
              <p className="font-bold text-sm">{course.title}</p>
              <p className="text-xs text-muted-foreground">
                {getCompletedLessons().length} of {getAllLessons().length} completed
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'lessons'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Lessons ({getAllLessons().length})
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              activeTab === 'quizzes'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Quizzes ({quizzes.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Section */}
          <div className="lg:col-span-2">
            {activeTab === 'lessons' && currentLesson && (
              <div className="space-y-6">
                {/* Video Player */}
                {currentLesson.videoUrl ? (
                  <YouTubeEmbed
                    url={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full"
                    onVideoComplete={handleLessonComplete}
                  />
                ) : (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No video available</p>
                    </div>
                  </div>
                )}

                {/* Lesson Info */}
                <Card className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                    <p className="text-muted-foreground">{currentLesson.description}</p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{currentLesson.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {getCompletedLessons().includes(currentLesson.id) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Completed</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Mark as complete</span>
                        </>
                      )}
                    </div>
                  </div>

                  {!getCompletedLessons().includes(currentLesson.id) && (
                    <Button onClick={handleLessonComplete} className="w-full">
                      Mark as Complete
                    </Button>
                  )}

                  {/* Certificate Download Button - Show when course is 100% complete */}
                  {enrollment && getCompletedLessons().length === getAllLessons().length && getAllLessons().length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                        <p className="text-green-700 font-medium text-sm">✓ Course Completed!</p>
                        <p className="text-green-600/80 text-xs mt-1">Congratulations! Download your certificate to showcase your achievement. You can download it anytime.</p>
                      </div>
                      <Button 
                        onClick={handleDownloadCertificate}
                        disabled={!certificateId || downloading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {!certificateId ? (
                          'Loading Certificate...'
                        ) : downloading ? (
                          'Generating PDF...'
                        ) : (
                          'Download Certificate (PDF)'
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        You can download this certificate anytime from your profile
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    {getPreviousLesson() && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentLesson(getPreviousLesson()!)}
                        className="flex-1"
                      >
                        Previous
                      </Button>
                    )}
                    {getNextLesson() && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentLesson(getNextLesson()!)}
                        className="flex-1"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Lesson Content */}
                {currentLesson.content && (
                  <Card className="p-6">
                    <h3 className="font-bold mb-4">Lesson Content</h3>
                    <div className="prose prose-sm max-w-none text-foreground">
                      <p>{currentLesson.content}</p>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === 'quizzes' && (
              <div className="space-y-6">
                {selectedQuizId && quizzes.find(q => q.id === selectedQuizId) ? (
                  <QuizPlayer
                    quiz={quizzes.find(q => q.id === selectedQuizId)}
                    userId={session?.userId || ''}
                    onComplete={() => {
                      // Optionally refresh quizzes or show completion message
                      toast.success('Quiz submitted successfully!')
                    }}
                  />
                ) : quizzes.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">Select a quiz to begin:</p>
                    {quizzes.map((quiz) => (
                      <Card
                        key={quiz.id}
                        className="p-4 cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setSelectedQuizId(quiz.id)}
                      >
                        <h3 className="font-bold mb-2">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="text-sm text-muted-foreground mb-2">{quiz.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {quiz.questions?.length || 0} questions • Passing score: {quiz.passingScore}%
                        </p>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">No quizzes available yet.</p>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 space-y-4">
              <div>
                <h3 className="font-bold mb-4">{activeTab === 'lessons' ? 'Lessons' : 'Quizzes'}</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {activeTab === 'lessons' && course.sections && course.sections.length > 0 ? (
                    course.sections.map((section: Section) => (
                      <div key={section.id} className="space-y-1">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg transition-colors"
                        >
                          {expandedSections.has(section.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <span className="font-medium text-sm flex-1 text-left">{section.title}</span>
                          {section.isPreview && (
                            <span className="text-xs bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded">FREE</span>
                          )}
                        </button>
                        {expandedSections.has(section.id) && section.lessons && (
                          <div className="pl-6 space-y-1">
                            {section.lessons.map((lesson: Lesson) => {
                              const completedLessons = Array.isArray(enrollment?.completedLessons) 
                                ? enrollment.completedLessons 
                                : []
                              const isCompleted = completedLessons.includes(lesson.id)
                    const isCurrent = currentLesson?.id === lesson.id

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                          isCurrent ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/50"
                        }`}
                      >
                                  <div className="flex items-start gap-2">
                                    <div className="mt-0.5">
                            {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            ) : (
                                        <Play className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                                    <div className="flex-1 text-xs">
                            <p className={`font-medium line-clamp-2 ${isCurrent ? "text-primary" : ""}`}>
                              {lesson.title}
                            </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{lesson.duration} min</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No lessons available</p>
                  )}

                  {activeTab === 'quizzes' && quizzes.length > 0 && (
                    <div className="space-y-2">
                      {quizzes.map((quiz) => (
                        <button
                          key={quiz.id}
                          onClick={() => setSelectedQuizId(quiz.id)}
                          className={`w-full text-left p-2 rounded-lg transition-colors text-sm ${
                            selectedQuizId === quiz.id
                              ? 'bg-primary/10 border-l-4 border-l-primary'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          <p className={`font-medium line-clamp-2 ${selectedQuizId === quiz.id ? 'text-primary' : ''}`}>
                            {quiz.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {quiz.questions?.length || 0} questions
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Summary */}
              {activeTab === 'lessons' && (
              <div className="border-t border-border pt-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold">{enrollment?.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${enrollment?.progress || 0}%` }} />
                  </div>
                </div>

                {enrollment?.progress === 100 && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-green-600">Course Completed!</p>
                  </div>
                )}
              </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}