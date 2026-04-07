"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, BookOpen, Award, Play, LogOut, Home, Settings } from "lucide-react"
import { getSession, logout } from "@/lib/auth"
import { db } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import type { Enrollment, Course } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [enrollments, setEnrollments] = useState<(Enrollment & { course?: Course })[]>([])
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    // Redirect instructor to their dashboard
    if (session.role === "instructor") {
      router.push("/instructor")
      return
    }

    // Redirect admin to admin panel
    if (session.role === "admin") {
      router.push("/admin")
      return
    }

    const fetchData = async () => {
      try {
        // Get enrolled courses - include email untuk handle mock auth
        const enrollmentsResponse = await fetch(`/api/enrollments?userId=${session.userId}&email=${session.email || ''}`)
        const userEnrollments = await enrollmentsResponse.json()

        const enrollmentsWithCourses = userEnrollments.map((enrollment: any) => ({
          ...enrollment,
          course: enrollment.course,
        }))
        setEnrollments(enrollmentsWithCourses)

        // Get recommended courses (not enrolled)
        const coursesResponse = await fetch('/api/courses')
        const allCourses = await coursesResponse.json()
        const enrolledCourseIds = enrollmentsWithCourses.map((e: any) => e.courseId)
        const recommended = allCourses.filter((c: any) => !enrolledCourseIds.includes(c.id)).slice(0, 3)
        setRecommendedCourses(recommended)

        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session, router])

  if (!session || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const completedCourses = enrollments.filter((e) => e.completedAt).length
  const totalProgress =
    enrollments.length > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) : 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {session.name}!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Courses Enrolled</p>
                <p className="text-3xl font-bold">{enrollments.length}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Completed Courses</p>
                <p className="text-3xl font-bold">{completedCourses}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <Award className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Average Progress</p>
                <p className="text-3xl font-bold">{totalProgress}%</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Hours Learned</p>
                <p className="text-3xl font-bold">
                  {Math.round(
                    enrollments.reduce((sum, e) => {
                      const lessons = e.course?.lessons || []
                      return sum + lessons.reduce((acc, l) => acc + l.duration, 0)
                    }, 0) / 60,
                  )}
                </p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <Play className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* My Courses Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>

          {enrollments.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6">Start your learning journey by enrolling in a course.</p>
              <Button asChild>
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => {
                const course = enrollment.course
                if (!course) return null

                return (
                  <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={course.thumbnail || "/placeholder.svg?height=200&width=400"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {Array.isArray(enrollment.completedLessons) ? enrollment.completedLessons.length : 0} of {course.sections ? course.sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0) : 0} lessons
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>

                      <Link href={`/dashboard/courses/${course.id}`}>
                        <Button className="w-full gap-2">
                          <Play className="w-4 h-4" />
                          {enrollment.progress === 100 ? "Review" : "Continue Learning"}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <Link href="/courses">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="group">
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-all">
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={course.thumbnail || "/placeholder.svg?height=200&width=400"}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="p-6 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          {course.category}
                        </span>
                        <h3 className="font-bold line-clamp-2 mt-2">{course.title}</h3>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">${course.price}</span>
                        <span className="flex items-center gap-1">
                          <span>⭐</span>
                          <span className="font-medium">{course.rating.toFixed(1)}</span>
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
