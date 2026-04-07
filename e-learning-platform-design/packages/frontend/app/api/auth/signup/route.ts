import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/lib/email-service"

// Generate 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password" },
        { status: 400 }
      )
    }

    // Trim whitespace
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()

    // Validate email format
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Validate name length
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    })

    if (existingUser) {
      if (!existingUser.isVerified) {
        // User exists but not verified - allow resend
        return NextResponse.json(
          { 
            error: "This email is already registered but not verified",
            message: "Check your email for the verification code, or use the resend option on the verify page"
          },
          { status: 409 }
        )
      }
      // User exists and verified
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification code
    const verificationCode = generateVerificationCode()
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Determine if user needs approval (instructors need admin approval)
    const userRole = role || "student"
    const needsApproval = userRole === "instructor"

    // Create new user
    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        password: hashedPassword,
        role: userRole,
        verificationCode: verificationCode,
        verificationExpiry: verificationExpiry,
        isVerified: false,
        isActive: true, // Default to active on signup
        isApproved: !needsApproval // Auto-approve students, instructors need admin approval
      }
    })

    console.log(`[SIGNUP] User created: ${trimmedEmail}`)

    // Send verification email
    let emailSent = false
    try {
      emailSent = await sendVerificationEmail(trimmedEmail, trimmedName, verificationCode)
      console.log(`[SIGNUP] Verification email sent to: ${trimmedEmail}`)
    } catch (emailError) {
      console.error(`[SIGNUP] Failed to send verification email to ${trimmedEmail}:`, emailError)
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? needsApproval 
          ? "Instructor account created! Check your email for verification. Your account will be active after admin approval."
          : "Account created! Check your email for the verification code."
        : "Account created, but verification email failed. Check spam folder or use resend on verify page.",
      email: user.email,
      emailSent: emailSent,
      needsApproval: needsApproval
    }, { status: 201 })

  } catch (error: any) {
    console.error("[SIGNUP] Error:", error)
    
    // Handle specific Prisma errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}
