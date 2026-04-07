"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Users, Clock, Play, ArrowLeft, Heart } from "lucide-react"
import { YouTubeEmbed } from "@/components/youtube-embed"
import { getSession } from "@/lib/auth"
import { ReviewsSection } from "./reviews-section"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState(null)
  const [reviews, setReviews] = useState([])
  const [session] = useState(getSession())
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`)
        if (response.ok) {
          const data = await response.json()
          // Check if course is published (students can only view published courses)
          if (!data.isPublished && (!session || (session.role !== 'instructor' && session.role !== 'admin'))) {
            setCourse(null)
            setIsLoading(false)
            return
          }
          setCourse(data)
        } else {
          setCourse(null)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching course:', error)
        setCourse(null)
        setIsLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${courseId}`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    const checkEnrollment = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/enrollments?userId=${session.userId}&courseId=${courseId}&email=${session.email || ''}`)
          if (response.ok) {
            const enrollment = await response.json()
            setIsEnrolled(!!enrollment)
          }
        } catch (error) {
          console.error('Error checking enrollment:', error)
        }
      }
    }

    if (courseId) {
      fetchCourse()
      fetchReviews()
      checkEnrollment()
    }
  }, [courseId, session])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  const instructor = course.instructor

  // Helper function to get all lessons from sections
  const getAllLessons = () => {
    if (!course.sections) return []
    return course.sections.flatMap(section => section.lessons || [])
  }

  // Helper function to calculate total duration
  const getTotalDuration = () => {
    const allLessons = getAllLessons()
    return allLessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0)
  }

  // Helper function to check if lesson/section is accessible
  const isAccessible = (section: any, lesson: any) => {
    if (isEnrolled) return true
    if (section.isPreview) return true
    if (lesson.isPreview) return true
    return false
  }

  const handleEnroll = () => {
    if (!session) {
      window.location.href = "/login"
      return
    }
    window.location.href = `/checkout/${courseId}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                E
              </div>
              <span className="font-bold">EduLearn</span>
            </Link>
            <Link href="/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Course Hero */}
      <section className="py-12 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <h1 className="text-4xl font-bold mt-4 text-balance">{course.title}</h1>
                <p className="text-lg text-muted-foreground mt-4">{course.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={instructor?.avatar || "/placeholder.svg?height=40&width=40"}
                    alt={instructor?.name || "Instructor"}
                      className="w-full h-full object-cover object-center scale-110"
                  />
                  </div>
                  <div>
                    <p className="font-medium">{instructor?.name || "Unknown Instructor"}</p>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{course.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({course.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{course.studentCount.toLocaleString()} students</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 space-y-4 sticky top-24">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={course.thumbnail || "/placeholder.svg?height=200&width=300"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                     style={{ 
                       objectPosition: 'center',
                       maxWidth: '100%',
                       maxHeight: '100%',
                       width: '100%',
                       height: '100%'
                     }}
                  />
                </div>

                <div className="text-4xl font-bold">${course.price}</div>

                <Button size="lg" className="w-full" onClick={handleEnroll}>
                  Enroll Now
                </Button>

                <Button variant="outline" size="lg" className="w-full gap-2 bg-transparent">
                  <Heart className="w-5 h-5" />
                  Add to Wishlist
                </Button>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium">{getAllLessons().length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{getTotalDuration()} mins</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">All Levels</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Course Preview Video - Only for enrolled users */}
              {isEnrolled && course.videoUrl && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Course Preview Video</h2>
                  <Card className="p-6">
                    <YouTubeEmbed
                      url={course.videoUrl}
                      title={course.title}
                      className="w-full"
                    />
                  </Card>
                </div>
              )}

              {/* Course Curriculum */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                {course.sections && course.sections.length > 0 ? (
                  <div className="space-y-6">
                    {course.sections.map((section: any) => (
                      <Card key={section.id} className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold">{section.title}</h3>
                            {section.isPreview && (
                              <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">FREE PREVIEW</span>
                            )}
                          </div>
                          {section.description && (
                            <p className="text-muted-foreground">{section.description}</p>
                          )}
                          {section.lessons && section.lessons.length > 0 && (
                            <div className="space-y-3 mt-4">
                              {section.lessons.map((lesson: any) => {
                                const accessible = isAccessible(section, lesson)
                                return (
                                  <Card key={lesson.id} className={`p-4 ${accessible ? '' : 'opacity-60'}`}>
                                    {isEnrolled || accessible ? (
                                      <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-bold">{lesson.title}</h4>
                                          {lesson.isPreview && (
                                            <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">FREE</span>
                                          )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                                        {isEnrolled && lesson.videoUrl && (
                            <YouTubeEmbed
                              url={lesson.videoUrl}
                              title={lesson.title}
                              className="w-full"
                            />
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {lesson.duration} minutes
                            </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-start gap-4">
                                        <div className="mt-1 rounded-full bg-primary/10 p-2">
                                          <Play className="w-4 h-4 text-primary opacity-50" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-bold">{lesson.title}</h4>
                                            <span className="text-xs text-muted-foreground">🔒</span>
                                          </div>
                                          <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                                            <span className="flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {lesson.duration} min
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Card>
                                )
                              })}
                          </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-muted-foreground mb-4">
                      {isEnrolled 
                        ? "No content available yet."
                        : "Enroll in this course to access all video lessons and materials."}
                    </p>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <ReviewsSection courseId={courseId} reviews={reviews} />
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Course Info</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Instructor</p>
                    <p className="font-medium">{instructor?.name || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{course.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Duration</p>
                    <p className="font-medium">{getTotalDuration()} minutes</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
