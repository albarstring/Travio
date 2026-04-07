"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  ChevronLeft, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Clock,
  AlertCircle
} from "lucide-react"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"

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
  level: string
  price: number
  thumbnail: string | null
  status: string
  adminNotes: string | null
  createdAt: string
}

export default function CourseReviewPage() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("pending")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    if (!session || session.role !== "admin") {
      router.push("/login")
      return
    }

    fetchCourses()
  }, [session, router, filterStatus])

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/api/admin/courses?status=${filterStatus}`)
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (action: "approve" | "reject") => {
    if (!selectedCourse) return

    try {
      const response = await fetch(`/api/admin/courses/${selectedCourse.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          notes: adminNotes,
        }),
      })

      if (response.ok) {
        fetchCourses()
        setReviewDialog(false)
        setSelectedCourse(null)
        setAdminNotes("")
      }
    } catch (error) {
      console.error("Error reviewing course:", error)
    }
  }

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      <main className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Course Review & Approval</h1>
            <p className="text-muted-foreground">Review and approve courses before publication</p>
          </div>
        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {["pending", "approved", "rejected", "all"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                  size="sm"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Courses List */}
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="p-6">
              <div className="flex gap-6">
                <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No thumbnail
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {course.instructor.name} ({course.instructor.email})
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.status === "approved" ? "bg-green-500/10 text-green-600" :
                      course.status === "rejected" ? "bg-red-500/10 text-red-600" :
                      "bg-yellow-500/10 text-yellow-600"
                    }`}>
                      {course.status}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm mb-4">
                    <span className="text-muted-foreground">Category: <span className="font-medium">{course.category}</span></span>
                    <span className="text-muted-foreground">Level: <span className="font-medium">{course.level}</span></span>
                    <span className="text-muted-foreground">Price: <span className="font-medium">${course.price}</span></span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {course.adminNotes && (
                    <div className="mb-4 p-3 bg-muted rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Admin Notes:</p>
                      <p className="text-sm">{course.adminNotes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/courses/${course.id}`, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    {course.status === "pending" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course)
                            setReviewAction("approve")
                            setReviewDialog(true)
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course)
                            setReviewAction("reject")
                            setReviewDialog(true)
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredCourses.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No courses found</p>
              </div>
            </Card>
          )}
        </div>
        </div>
      </main>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? "Approve Course" : "Reject Course"}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? `Are you sure you want to approve "${selectedCourse?.title}"?`
                : `Are you sure you want to reject "${selectedCourse?.title}"? Please provide a reason.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={reviewAction === "approve" ? "Optional notes..." : "Rejection reason (required)"}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              required={reviewAction === "reject"}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleReview(reviewAction!)}
              variant={reviewAction === "reject" ? "destructive" : "default"}
              disabled={reviewAction === "reject" && !adminNotes.trim()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

