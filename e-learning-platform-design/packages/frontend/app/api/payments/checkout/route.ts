export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[CHECKOUT] Request body:", body);
    const { userId, courseId, paymentMethod, amount, email } = body;
    
    if (!userId || !courseId || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields: userId, courseId, paymentMethod" }, { status: 400 });
    }

    // Cari user - prioritaskan email jika ada (untuk handle mock auth IDs)
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
      console.log('[CHECKOUT] Found user by email:', email, user ? '✓' : '✗');
    }
    
    if (!user && userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
      console.log('[CHECKOUT] Found user by ID:', userId, user ? '✓' : '✗');
    }

    if (!user) {
      console.error('[CHECKOUT] User not found. ID:', userId, 'Email:', email);
      return NextResponse.json({ 
        error: "User not found. Please make sure you are logged in with a valid account." 
      }, { status: 404 });
    }

    // Gunakan actual database user ID
    const actualUserId = user.id;

    // Pastikan course ada dan published
    const course = await prisma.course.findUnique({ 
      where: { id: courseId }
    });
    
    if (!course) {
      return NextResponse.json({ error: `Course not found for courseId: ${courseId}` }, { status: 404 });
    }

    // Check if course is published (using type assertion since Prisma client may not be updated)
    const courseData = course as any;
    if (!courseData.isPublished) {
      return NextResponse.json({ 
        error: "This course is not yet published and cannot be purchased." 
      }, { status: 400 });
    }

    // Check jika sudah terdaftar
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: actualUserId, courseId } }
    })
    if (existingEnrollment) {
      // Jika sudah enrolled, langsung return success dan redirect ke course page
      console.log('[CHECKOUT] User already enrolled, redirecting to course page');
      return NextResponse.json({
        success: true,
        alreadyEnrolled: true,
        enrollment: existingEnrollment,
        redirectUrl: `/dashboard/courses/${courseId}`,
      }, { status: 200 });
    }

    // Validasi amount
    const paymentAmount = amount ? Number(amount) : Number(course.price);
    if (isNaN(paymentAmount) || paymentAmount < 0) {
      return NextResponse.json({ 
        error: "Invalid payment amount" 
      }, { status: 400 });
    }

    console.log('[CHECKOUT] Creating payment for user:', actualUserId, 'course:', courseId, 'amount:', paymentAmount);

    // Buat pembayaran
    const payment = await prisma.payment.create({
      data: {
        userId: actualUserId,
        courseId,
        amount: paymentAmount,
        status: "completed",
        paymentMethod,
        transactionId: `txn-${Date.now()}`,
      },
    });

    console.log('[CHECKOUT] Payment created:', payment.id);

    // Buat enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: actualUserId,
        courseId,
        completedLessons: JSON.stringify([]),  // Convert array to JSON string for Prisma Json field
        progress: 0,
      },
    });

    console.log('[CHECKOUT] Enrollment created:', enrollment.id);

    // Update studentCount di course
    await prisma.course.update({
      where: { id: courseId },
      data: {
        studentCount: {
          increment: 1
        }
      }
    });

    console.log('[CHECKOUT] Course studentCount updated');

    return NextResponse.json(
      {
        success: true,
        payment,
        enrollment,
        redirectUrl: `/dashboard/courses/${courseId}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[CHECKOUT] Internal Server Error:', error);
    console.error('[CHECKOUT] Error message:', error?.message);
    console.error('[CHECKOUT] Error code:', error?.code);
    console.error('[CHECKOUT] Error stack:', error?.stack);
    
    // Handle Prisma errors
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: "A payment with this information already exists" }, { status: 409 });
    }
    
    if (error?.code === 'P2003') {
      return NextResponse.json({ error: "Invalid foreign key. User or course not found." }, { status: 400 });
    }

    // Extract error message safely
    let errorMessage = "Internal server error";
    if (error?.message) {
      errorMessage = String(error.message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.toString && typeof error.toString === 'function') {
      errorMessage = error.toString();
    }

    // Build error details object with only serializable data
    const errorDetails: Record<string, any> = {
      message: errorMessage,
      code: error?.code || "UNKNOWN_ERROR",
      name: error?.name || "Error",
    };

    // Try to get Prisma meta if available
    if (error?.meta) {
      try {
        const metaStr = JSON.stringify(error.meta);
        errorDetails.meta = JSON.parse(metaStr);
      } catch (e) {
        errorDetails.meta = "Error metadata could not be serialized";
      }
    }

    console.error('[CHECKOUT] Returning error response with message:', errorMessage);

    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails
    }, { status: 500 });
  }
}
