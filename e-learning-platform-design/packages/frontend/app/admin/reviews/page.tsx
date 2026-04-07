"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, CheckCircle2, XCircle, Eye, AlertTriangle } from "lucide-react"
import { getSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getAuthHeaders } from "@/lib/api-helpers"

interface Review {
  id: string
  rating: number
  comment: string
  isModerated: boolean
  isApproved: boolean
  moderatedBy: string | null
  moderatedAt: string | null
  user: {
    id: string
    name: string
    avatar: string | null
  }
  course: {
    id: string
    title: string
  }
  createdAt: string
}

export default function ReviewsModerationPage() {
  const router = useRouter()
  const [session, setSession] = useState(getSession())
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // all, pending, approved, rejected
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [moderationDialog, setModerationDialog] = useState(false)
  const [moderationAction, setModerationAction] = useState<"approve" | "reject" | null>(null)
  const [moderationNote, setModerationNote] = useState("")

  useEffect(() => {
    if (!session || session.role !== "admin") {
      router.push("/login")
      return
    }

    fetchReviews()
  }, [session, router, filterStatus])

  const fetchReviews = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/reviews?status=${filterStatus}`, { headers })
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerate = async () => {
    if (!selectedReview || !moderationAction) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/reviews/${selectedReview.id}/moderate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          action: moderationAction,
          note: moderationNote,
        }),
      })

      if (response.ok) {
        fetchReviews()
        setModerationDialog(false)
        setSelectedReview(null)
        setModerationNote("")
      }
    } catch (error) {
      console.error("Error moderating review:", error)
    }
  }

  const filteredReviews = reviews.filter((review) =>
    review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.user.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-3xl font-bold mb-2">Review Moderation</h1>
            <p className="text-muted-foreground">Moderate and approve course reviews</p>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search reviews, courses, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
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

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {review.user.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="w-full h-full object-cover object-center scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold">{review.user.name}</p>
                        <p className="text-sm text-muted-foreground">{review.course.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-500" : "text-muted-foreground"}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <Badge variant={review.isApproved ? "default" : review.isModerated ? "destructive" : "secondary"}>
                          {review.isApproved ? "Approved" : review.isModerated ? "Rejected" : "Pending"}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm mb-4">{review.comment}</p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {review.moderatedAt && (
                        <>
                          <span>•</span>
                          <span>Moderated {new Date(review.moderatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>

                    {!review.isModerated && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedReview(review)
                            setModerationAction("approve")
                            setModerationDialog(true)
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedReview(review)
                            setModerationAction("reject")
                            setModerationDialog(true)
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {filteredReviews.length === 0 && (
              <Card className="p-12">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reviews found</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Moderation Dialog */}
      <Dialog open={moderationDialog} onOpenChange={setModerationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {moderationAction === "approve" ? "Approve Review" : "Reject Review"}
            </DialogTitle>
            <DialogDescription>
              {moderationAction === "approve"
                ? "Are you sure you want to approve this review?"
                : "Are you sure you want to reject this review? Please provide a reason."}
            </DialogDescription>
          </DialogHeader>
          {moderationAction === "reject" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Rejection reason (required)"
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                required
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModerationDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleModerate}
              variant={moderationAction === "reject" ? "destructive" : "default"}
              disabled={moderationAction === "reject" && !moderationNote.trim()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
