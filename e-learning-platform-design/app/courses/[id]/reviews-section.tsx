"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Send } from "lucide-react"
import { getSession } from "@/lib/auth"

interface ReviewsSectionProps {
  courseId: string
  reviews: any[]
}

export function ReviewsSection({ courseId, reviews: initialReviews }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [session, setSession] = useState(getSession())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      window.location.href = "/login"
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.userId,
          courseId,
          rating,
          comment,
        }),
      })

      if (response.ok) {
        const { review } = await response.json()
        setReviews([review, ...reviews])
        setComment("")
        setRating(5)
      }
    } catch (error) {
      console.error("Failed to submit review:", error)
    }

    setIsSubmitting(false)
  }

  const hasReviewedBefore = reviews.some((r) => r.userId === session?.userId)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Course Reviews</h2>

      {/* Review Stats */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4 col-span-2">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
            </div>
          </Card>

          <div className="col-span-3 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{rating}⭐</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-muted-foreground text-xs">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Write Review */}
      {!hasReviewedBefore && (
        <Card className="p-6">
          <h3 className="font-bold mb-4">Share Your Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        value <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this course..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={review.user?.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={review.user?.name || "Reviewer"}
                    className="w-full h-full object-cover object-center scale-110"
                />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{review.user?.name || "Anonymous"}</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
