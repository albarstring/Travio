import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendWelcomeEmail } from "@/lib/email-service"
import { sendWelcomeSMS } from "@/lib/sms-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user already verified
    if (user.isVerified) {
      return NextResponse.json(
        { error: "User already verified" },
        { status: 400 }
      )
    }

    // Check if verification code expired
    if (!user.verificationExpiry || new Date() > user.verificationExpiry) {
      return NextResponse.json(
        { error: "Verification code has expired. Please signup again." },
        { status: 400 }
      )
    }

    // Check if verification code matches
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      )
    }

    // Mark user as verified
    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpiry: null
      }
    })

    console.log(`[VERIFY] User verified: ${email}`)

    // Send welcome SMS
    const welcomeSMSSent = await sendWelcomeSMS(verifiedUser.phone || "", verifiedUser.name)
    console.log(`[VERIFY] Welcome SMS ${welcomeSMSSent ? "sent" : "failed to send"} to: ${verifiedUser.phone}`)

    // Also send welcome email
    const welcomeEmailSent = await sendWelcomeEmail(email, verifiedUser.name)
    console.log(`[VERIFY] Welcome email ${welcomeEmailSent ? "sent" : "failed to send"} to: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
      user: {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        role: verifiedUser.role
      }
    })
  } catch (error: any) {
    console.error("Error verifying email:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}

// Resend verification code endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "User already verified" },
        { status: 400 }
      )
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationExpiry
      }
    })

    console.log(`[RESEND VERIFY] Code resent to: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      email: email
    })
  } catch (error: any) {
    console.error("Error resending verification code:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}

