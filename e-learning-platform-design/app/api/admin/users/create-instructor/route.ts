import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    // Get admin verification from headers
    const adminId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    console.log('[CREATE INSTRUCTOR] Admin:', adminId, 'Role:', userRole)
    
    if (!adminId || userRole !== "admin") {
      console.log('[CREATE INSTRUCTOR] Unauthorized - missing admin role')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create instructor user
    const instructor = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: "instructor",
        isVerified: true, // Auto-verified since created by admin
        isActive: true,
        isApproved: true // Auto-approved since created by admin
      }
    })

    console.log(`[CREATE INSTRUCTOR] Instructor created: ${instructor.email} by admin: ${adminId}`)

    // Return user data (without password)
    return NextResponse.json({
      id: instructor.id,
      name: instructor.name,
      email: instructor.email,
      role: instructor.role,
      isVerified: instructor.isVerified,
      isActive: instructor.isActive,
      isApproved: instructor.isApproved
    }, { status: 201 })

  } catch (error: any) {
    console.error("[CREATE INSTRUCTOR] Error:", error)
    
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
