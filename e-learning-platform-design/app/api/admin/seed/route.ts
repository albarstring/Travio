import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

/**
 * API endpoint untuk seed test data
 * Gunakan untuk development/testing saja
 * POST /api/admin/seed
 */
export async function POST() {
  try {
    console.log('[SEED] Starting database seeding...')

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.upsert({
      where: { email: "admin@edulearn.com" },
      update: {},
      create: {
        email: "admin@edulearn.com",
        password: adminPassword,
        name: "Admin User",
        role: "admin",
        bio: "Platform administrator",
        isActive: true,
        isVerified: true,
      }
    })
    console.log('[SEED] Created admin:', admin.email)

    // Create test instructors
    const instructorPassword = await bcrypt.hash("instructor123", 10)
    const instructors = []
    for (let i = 1; i <= 3; i++) {
      const instructor = await prisma.user.upsert({
        where: { email: `instructor${i}@edulearn.com` },
        update: {},
        create: {
          email: `instructor${i}@edulearn.com`,
          password: instructorPassword,
          name: `Instructor ${i}`,
          role: "instructor",
          bio: `Professional instructor with expertise in web development`,
          location: `City ${i}`,
          isActive: true,
          isVerified: i === 1 ? true : false, // First instructor verified, others not
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=instructor${i}`,
        }
      })
      instructors.push(instructor)
      console.log('[SEED] Created instructor:', instructor.email)
    }

    // Create test students
    const studentPassword = await bcrypt.hash("student123", 10)
    const students = []
    for (let i = 1; i <= 5; i++) {
      const student = await prisma.user.upsert({
        where: { email: `student${i}@edulearn.com` },
        update: {},
        create: {
          email: `student${i}@edulearn.com`,
          password: studentPassword,
          name: `Student ${i}`,
          role: "student",
          bio: `Learning enthusiast`,
          location: `City ${i}`,
          isActive: true,
          isVerified: true,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`,
        }
      })
      students.push(student)
      console.log('[SEED] Created student:', student.email)
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        admin: admin.email,
        instructors: instructors.map(i => i.email),
        students: students.map(s => s.email),
      }
    })
  } catch (error) {
    console.error('[SEED] Error seeding database:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

