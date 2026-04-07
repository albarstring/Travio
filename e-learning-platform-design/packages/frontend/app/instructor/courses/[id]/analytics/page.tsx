"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChevronLeft, Users, Award, TrendingUp, MessageSquare } from "lucide-react"
import { getSession } from "@/lib/auth"
import type { Course } from "@/lib/types"

export default function CourseAnalyticsPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string
  const [session, setSession] = useState(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollments, setEnrollments] = useState([])
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = () => {
      const currentSession = getSession()
      setSession(currentSession)

      if (!currentSession || (currentSession.role !== "instructor" && currentSession.role !== "admin")) {
        router.push("/login")
        return
      }

      // Get course data using API instead of direct db access
      const fetchCourse = async () => {
        try {
          const response = await fetch(`/api/courses/${courseId}`)
          if (response.ok) {
            const courseData = await response.json()
            if (courseData.instructorId === currentSession.userId || currentSession.role === "admin") {
              setCourse(courseData)

              // Fetch enrollments and reviews
              const [enrollmentsRes, reviewsRes] = await Promise.all([
                fetch(`/api/enrollments?courseId=${courseId}`),
                fetch(`/api/reviews/${courseId}`)
              ])

              if (enrollmentsRes.ok) {
                const enrollmentsData = await enrollmentsRes.json()
                setEnrollments(enrollmentsData)
              }

              if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json()
                setReviews(reviewsData)
              }
            } else {
              router.push("/instructor")
            }
          } else {
            router.push("/instructor")
          }
        } catch (error) {
          console.error('Error fetching course:', error)
          router.push("/instructor")
        } finally {
          setIsLoading(false)
        }
      }

      fetchCourse()
    }

    checkSession()
  }, [courseId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return null
  }

  const completedCount = enrollments.filter((e) => e.completedAt).length
  const avgProgress =
    enrollments.length > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) : 0

  // Mock chart data
  const enrollmentData = [
    { week: "Week 1", enrollments: 5 },
    { week: "Week 2", enrollments: 12 },
    { week: "Week 3", enrollments: 8 },
    { week: "Week 4", enrollments: 15 },
    { week: "Week 5", enrollments: 10 },
    { week: "Week 6", enrollments: 18 },
  ]

  const allLessons = course.sections?.flatMap((s: any) => s.lessons || []) || []
  const lessonPopularity = allLessons.map((lesson: any) => ({
    name: lesson.title.substring(0, 15),
    views: Math.floor(Math.random() * 100) + 20,
    completions: Math.floor(Math.random() * 80) + 10,
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/instructor" className="flex items-center gap-2 hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <div className="text-right">
              <p className="font-bold text-sm">{course.title}</p>
              <p className="text-xs text-muted-foreground">Analytics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Enrollments</p>
                <p className="text-3xl font-bold">{enrollments.length}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Completed</p>
                <p className="text-3xl font-bold">{completedCount}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <Award className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Avg. Progress</p>
                <p className="text-3xl font-bold">{avgProgress}%</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Reviews</p>
                <p className="text-3xl font-bold">{reviews.length}</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6">Enrollment Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6">Lesson Popularity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lessonPopularity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#3b82f6" name="Views" />
                <Bar dataKey="completions" fill="#10b981" name="Completions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Reviews Section */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Student Reviews</h3>

          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={review.user?.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={review.user?.name || "Reviewer"}
                        className="w-full h-full object-cover object-center scale-110"
                    />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold">{review.user?.name || "Anonymous"}</h4>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-400" : "text-muted-foreground"}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
