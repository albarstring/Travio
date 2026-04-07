"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Search, Eye, Trash2 } from "lucide-react"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getAuthHeaders } from "@/lib/api-helpers"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Course {
  id: string
  title: string
  description: string
  instructor: {
    id: string
    name: string
    email: string
  }
  category: string
  level: string | null
  price: number
  thumbnail: string | null
  rating: number
  studentCount: number
  isPublished: boolean
  status: string
  createdAt: string
}

export default function AdminCoursesPage() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [courses, setCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; courseId: string | null }>({
    open: false,
    courseId: null,
  })

  useEffect(() => {
    if (!session || session.role !== "admin") {
      router.push("/login")
      return
    }

    const fetchCourses = async () => {
      try {
        const headers = getAuthHeaders()
        console.log('[ADMIN COURSES PAGE] Fetching courses...')
        const response = await fetch('/api/admin/courses?status=all', { headers })
        console.log('[ADMIN COURSES PAGE] Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('[ADMIN COURSES PAGE] Courses received:', data.length)
          setCourses(data)
        } else {
          const errorData = await response.text()
          console.error('[ADMIN COURSES PAGE] Error response:', response.status, errorData)
        }
      } catch (error) {
        console.error('[ADMIN COURSES PAGE] Error fetching courses:', error)
      } finally {
    setIsLoading(false)
      }
    }

    fetchCourses()
  }, [session, router])

  const handleDeleteCourse = async () => {
    if (!deleteDialog.courseId) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/courses/${deleteDialog.courseId}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        setCourses(courses.filter((c) => c.id !== deleteDialog.courseId))
        setDeleteDialog({ open: false, courseId: null })
      }
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

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

  const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      <main className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Manage Courses</h1>
            <p className="text-muted-foreground">View and manage all courses</p>
          </div>
        {/* Search */}
        <Card className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const instructor = course.instructor
            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all">
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
                    <p className="text-sm text-muted-foreground mt-1">{instructor?.name}</p>
                  </div>

                  <div className="space-y-2 border-t border-border pt-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-bold">{course.studentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-bold">⭐ {course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-bold">${course.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 bg-transparent"
                      onClick={() => window.open(`/courses/${course.id}`, '_blank')}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive bg-transparent hover:bg-destructive/10"
                      onClick={() => setDeleteDialog({ open: true, courseId: course.id })}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found</p>
          </div>
        )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, courseId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, courseId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
