"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, BookOpen, DollarSign, LogOut, Home, Plus, Trash2, Star } from "lucide-react"
import { getSession, logout } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import type { Course } from "@/lib/types"

export default function InstructorDashboard() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [courses, setCourses] = useState<Course[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"newest" | "students" | "revenue" | "rating">("newest")
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())

  useEffect(() => {
    const checkSession = () => {
      const currentSession = getSession()
      setSession(currentSession)

      if (!currentSession) {
        router.push("/login")
        return
      }

      if (currentSession.role !== "instructor" && currentSession.role !== "admin") {
        router.push("/dashboard")
        return
      }

      // Get instructor's courses - include draft courses
      const fetchCourses = async () => {
        try {
          const response = await fetch('/api/courses?includeDraft=true')
          const allCourses = await response.json()
          // Filter by instructorId or email (handle mock auth)
          const instructorCourses = allCourses.filter((course: Course) => {
            // Try to match by instructorId first
            if (course.instructorId === currentSession.userId) return true
            // If instructor has email, try to match by instructor email
            if (course.instructor?.email === currentSession.email) return true
            return false
          })
          setCourses(instructorCourses)

          // Fetch all reviews for instructor's courses
          const allReviews: any[] = []
          for (const course of instructorCourses) {
            try {
              const reviewsResponse = await fetch(`/api/reviews/${course.id}`)
              if (reviewsResponse.ok) {
                const courseReviews = await reviewsResponse.json()
                allReviews.push(...courseReviews)
              }
            } catch (error) {
              console.error(`Error fetching reviews for course ${course.id}:`, error)
            }
          }
          setReviews(allReviews)

          // Calculate stats
          let totalStudents = 0
          let totalRevenue = 0
          let totalRating = 0

          instructorCourses.forEach((course: Course) => {
            totalStudents += course.studentCount
            totalRevenue += course.price * course.studentCount
            totalRating += course.rating
          })

          setStats({
            totalStudents,
            totalRevenue,
            averageRating: instructorCourses.length > 0 ? parseFloat((totalRating / instructorCourses.length).toFixed(1)) : 0,
          })
        } catch (error) {
          console.error('Error fetching courses:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchCourses()
    }

    checkSession()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.role !== "instructor" && session.role !== "admin")) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Sort courses based on selected option
  const sortedCourses = [...courses].sort((a, b) => {
    if (sortBy === "students") {
      return b.studentCount - a.studentCount
    }
    if (sortBy === "revenue") {
      const revenueA = a.price * a.studentCount
      const revenueB = b.price * b.studentCount
      return revenueB - revenueA
    }
    if (sortBy === "rating") {
      return b.rating - a.rating
    }
    // Default: newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Toggle course selection
  const toggleCourseSelection = (courseId: string) => {
    const newSelected = new Set(selectedCourses)
    if (newSelected.has(courseId)) {
      newSelected.delete(courseId)
    } else {
      newSelected.add(courseId)
    }
    setSelectedCourses(newSelected)
  }

  // Select all courses
  const selectAllCourses = () => {
    if (selectedCourses.size === courses.length) {
      setSelectedCourses(new Set())
    } else {
      setSelectedCourses(new Set(courses.map(c => c.id)))
    }
  }

  // Handle course deletion (multiple)
  const handleDeleteSelectedCourses = async () => {
    if (selectedCourses.size === 0) {
      toast.error("Please select at least one course to delete.")
      return
    }

    const selectedCourseNames = courses
      .filter(c => selectedCourses.has(c.id))
      .map(c => c.title)
      .join(", ")

    if (!confirm(`Are you sure you want to delete ${selectedCourses.size} course(s)?\n\n${selectedCourseNames}\n\nThis action cannot be undone.`)) {
      return
    }

    // Delete all selected courses
    const deletePromises = Array.from(selectedCourses).map(async (courseId) => {
      try {
        const response = await fetch(`/api/courses/${courseId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          // Try to parse error response, but handle empty responses
          let errorMessage = `Failed to delete course ${courseId}`
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch (parseError) {
            // If response is not JSON, use status text
            errorMessage = `${errorMessage} (${response.status}: ${response.statusText})`
          }
          throw new Error(errorMessage)
        }
        
        // Try to parse response, but handle empty responses
        try {
          await response.json()
        } catch (parseError) {
          // Empty response is okay, deletion was successful
          console.log(`Course ${courseId} deleted successfully (empty response)`)
        }
        
        return { success: true, courseId }
      } catch (error) {
        console.error(`Error deleting course ${courseId}:`, error)
        return { success: false, courseId, error: error instanceof Error ? error.message : String(error) }
      }
    })

    const results = await Promise.all(deletePromises)
    const failed = results.filter(r => !r.success)

    if (failed.length > 0) {
      toast.error(`Failed to delete ${failed.length} course(s). Please try again.`)
    }

    // Remove deleted courses from state
    const deletedIds = results.filter(r => r.success).map(r => r.courseId)
    const updatedCourses = courses.filter((c) => !deletedIds.includes(c.id))
    setCourses(updatedCourses)

    // Recalculate stats
    let totalStudents = 0
    let totalRevenue = 0
    let totalRating = 0

    updatedCourses.forEach((course: Course) => {
      totalStudents += course.studentCount
      totalRevenue += course.price * course.studentCount
      totalRating += course.rating
    })

    setStats({
      totalStudents,
      totalRevenue,
      averageRating: updatedCourses.length > 0 ? parseFloat((totalRating / updatedCourses.length).toFixed(1)) : 0,
    })

    // Clear selection and exit delete mode if no courses left
    setSelectedCourses(new Set())
    if (updatedCourses.length === 0) {
      setDeleteMode(false)
    }
  }

  // Mock chart data
  const chartData = [
    { month: "Jan", students: 120, revenue: 2400 },
    { month: "Feb", students: 150, revenue: 2980 },
    { month: "Mar", students: 180, revenue: 3500 },
    { month: "Apr", students: 200, revenue: 4000 },
    { month: "May", students: 240, revenue: 4800 },
    { month: "Jun", students: 300, revenue: 6000 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and track your earnings</p>
          </div>
          <Link href="/instructor/courses/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
                <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Courses Published</p>
                <p className="text-3xl font-bold">{courses.length}</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Avg. Rating</p>
                <p className="text-3xl font-bold">{stats.averageRating}</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Revenue & Students Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#3b82f6" name="Students" />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Courses Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Courses</h2>
            
            {courses.length > 0 && (
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Urutkan:</label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Pilih urutan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="students">Student Terbanyak</SelectItem>
                      <SelectItem value="revenue">Pendapatan Terbanyak</SelectItem>
                      <SelectItem value="rating">Review Terbaik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Delete Mode Toggle */}
                <Button
                  variant={deleteMode ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => {
                    setDeleteMode(!deleteMode)
                    if (deleteMode) {
                      setSelectedCourses(new Set()) // Clear selection when exiting delete mode
                    }
                  }}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteMode ? "Cancel" : "Delete"}
                </Button>

                {/* Delete Selected Button (shown when delete mode is active and courses are selected) */}
                {deleteMode && selectedCourses.size > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSelectedCourses}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected ({selectedCourses.size})
                  </Button>
                )}
              </div>
            )}
          </div>

          {courses.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6">Create your first course to start teaching.</p>
              <Link href="/instructor/courses/new">
                <Button>Create Course</Button>
              </Link>
            </Card>
          ) : (
            <>
              {/* Select All Checkbox (shown in delete mode) */}
              {deleteMode && (
                <div className="mb-4 flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCourses.size === courses.length && courses.length > 0}
                      onChange={selectAllCourses}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm font-medium">
                      {selectedCourses.size === courses.length && courses.length > 0
                        ? "Deselect All"
                        : "Select All"}
                    </span>
                  </label>
                  {selectedCourses.size > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {selectedCourses.size} course(s) selected
                    </span>
                  )}
                </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.map((course) => {
                const courseReviews = reviews.filter(review => review.courseId === course.id)
                  const isSelected = selectedCourses.has(course.id)

                return (
                    <Card 
                      key={course.id} 
                      className={`overflow-hidden hover:shadow-lg transition-all relative cursor-pointer ${
                        deleteMode 
                          ? isSelected 
                            ? "ring-2 ring-destructive bg-destructive/5" 
                            : "ring-2 ring-border"
                          : ""
                      }`}
                      onClick={() => {
                        if (deleteMode) {
                          toggleCourseSelection(course.id)
                        }
                      }}
                    >
                      {/* Checkbox (shown in delete mode) */}
                      {deleteMode && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-destructive border-destructive"
                              : "bg-background border-border"
                          }`}>
                            {isSelected && (
                              <svg className="w-4 h-4 text-destructive-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      )}

                     <div className="aspect-video bg-muted overflow-hidden relative flex items-center justify-center">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10"><span class="text-4xl font-bold text-primary/30">${course.title.charAt(0).toUpperCase()}</span></div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                          <span className="text-4xl font-bold text-primary/30">{course.title.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                       {deleteMode && (
                         <div className={`absolute inset-0 flex items-center justify-center transition-colors ${
                           isSelected ? "bg-destructive/30" : "bg-black/10"
                         }`}>
                           <div className={`px-4 py-2 rounded-lg font-semibold ${
                             isSelected 
                               ? "bg-destructive text-destructive-foreground" 
                               : "bg-background/90 text-foreground"
                           }`}>
                             {isSelected ? "Selected" : "Click to select"}
                           </div>
                         </div>
                       )}
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-bold line-clamp-2">{course.title}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <span>⭐ {course.rating.toFixed(1)}</span>
                          <span>•</span>
                          <span>{courseReviews.length} reviews</span>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-border pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Students</span>
                          <span className="font-bold">{course.studentCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-bold">${(course.price * course.studentCount).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Lessons</span>
                          <span className="font-bold">
                            {course.sections ? course.sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0) : 0}
                          </span>
                        </div>
                      </div>

                      {!deleteMode && (
                      <div className="flex gap-2 pt-2">
                        <Link href={`/instructor/courses/${course.id}/edit`} className="flex-1">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/instructor/courses/${course.id}/analytics`} className="flex-1">
                          <Button variant="outline" size="sm">
                            Analytics
                          </Button>
                        </Link>
                      </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
