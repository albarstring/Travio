"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, Clock, Mail } from "lucide-react"
import { setSession } from "@/lib/auth"
import { Navbar } from "@/components/navbar"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling
      const pastedCode = value.slice(0, 6).split("")
      const newCode = [...code]
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char
        }
      })
      setCode(newCode)
      
      // Focus last filled input or next empty
      const lastIndex = Math.min(index + pastedCode.length, 5)
      inputRefs.current[lastIndex]?.focus()
      return
    }

    // Single character input
    if (/^\d*$/.test(value)) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const fullCode = code.join("")
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    if (!email) {
      setError("Email not found. Please signup again.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Email verified successfully!")
        
        // Set session automatically so user doesn't need to login again
        setSession({
          userId: data.user.id,
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
          avatar: null
        })

        setTimeout(() => {
          router.push(`/complete-profile`)
        }, 1500)
      } else {
        setError(data.error || "Verification failed")
        // Clear code on error
        setCode(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.")
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Verification code sent to your email!")
        setTimeLeft(600)
      } else {
        setError(data.error || "Failed to resend code")
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <Card className="w-full max-w-md p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-sm font-semibold text-foreground">
              {email}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Please check your inbox and spam folder
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Boxes */}
            <div className="space-y-2">
              <label className="text-sm font-medium block text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className={timeLeft < 60 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                Expires in {formatTime(timeLeft)}
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || code.join("").length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

            {/* Resend Code */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendCode}
              disabled={isLoading || timeLeft > 540}
            >
              {timeLeft > 540 ? `Resend in ${formatTime(timeLeft - 540)}` : "Resend Code"}
            </Button>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link href="/signup" className="text-sm text-primary hover:underline">
              Back to Signup
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

