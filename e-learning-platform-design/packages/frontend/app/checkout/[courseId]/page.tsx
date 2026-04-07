"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getSession } from "@/lib/auth"
import type { Course } from "@/lib/types"

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
 const [session, setSession] = useState<any>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")

  useEffect(() => {
  const s = getSession()

  if (!s || !s.userId) {
    router.push("/login")
    return
  }

  setSession(s)

    // Fetch course data from API instead of direct database access
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`)
        if (response.ok) {
          const courseData = await response.json()
          setCourse(courseData)
        } else {
          console.error('Failed to fetch course')
          router.push('/courses')
        }
      } catch (error) {
        console.error('Error fetching course:', error)
        router.push('/courses')
      }
    }

    fetchCourse()
  }, [courseId, router])

  const handleCheckout = async () => {
    if (!course) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.userId,
          email: session?.email, // Include email to help find user if ID doesn't match
          courseId,
          paymentMethod,
          amount: course.price, // Ensure amount is sent
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.alreadyEnrolled) {
          // User sudah enrolled, langsung redirect tanpa alert
          router.push(data.redirectUrl || `/dashboard/courses/${courseId}`)
        } else {
          // Checkout berhasil
          router.push(data.redirectUrl || `/dashboard/courses/${courseId}`)
        }
      } else {
        let errorMessage = "Failed to complete checkout. Please try again."
        try {
          const errorData = await response.json()
          console.error("=== Checkout Error Response ===")
          console.error("Status:", response.status)
          console.error("StatusText:", response.statusText)
          console.error("Error data:", errorData)
          
          // Extract error message from various possible formats
          if (errorData?.error) {
            errorMessage = String(errorData.error)
          } else if (errorData?.message) {
            errorMessage = String(errorData.message)
          } else if (errorData?.details?.message) {
            errorMessage = String(errorData.details.message)
          } else if (typeof errorData === 'string') {
            errorMessage = errorData
          }
          
          console.error("Final error message:", errorMessage)
          console.error("================================")
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
          errorMessage = `Server error (status ${response.status}): ${response.statusText}`
        }
        toast.error(errorMessage)
      }
    } catch (error: any) {
      console.error("=== Network/Checkout Error ===")
      console.error("Error:", error)
      console.error("Error type:", typeof error)
      console.error("Error message:", error?.message)
      console.error("==============================")
      toast.error(`Checkout failed: ${error?.message || error?.toString() || "Network error. Please check your connection."}`)
    }

    setIsLoading(false)
  }

  if (!session || !course) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href={`/courses/${courseId}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-8">
              <h1 className="text-3xl font-bold mb-8">Checkout</h1>

              {/* Billing Info */}
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-bold mb-4">Student Information</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-muted-foreground">{session.email}</p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="font-bold mb-4">Payment Method</h3>
                  <div className="space-y-2">
                    {[
                      { id: "card", label: "Credit Card", icon: "💳" },
                      { id: "midtrans", label: "GCash / Midtrans", icon: "📱" },
                      { id: "bank", label: "Bank Transfer", icon: "🏦" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${
                          paymentMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                        }`}
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-600">
                    This is a demo platform. Payment processing is simulated. In production, this would integrate with
                    real payment processors like Stripe or Midtrans.
                  </p>
                </div>
              </div>

              <Button onClick={handleCheckout} disabled={isLoading} size="lg" className="w-full gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? "Processing..." : `Pay $${course.price}`}
              </Button>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-24 space-y-6">
              <div>
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={course.thumbnail || "/placeholder.svg?height=200&width=300"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold line-clamp-2">{course.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.sections ? course.sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0) : 0} lessons
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${course.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold">${course.price}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/courses/${courseId}`}>Continue Shopping</Link>
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
