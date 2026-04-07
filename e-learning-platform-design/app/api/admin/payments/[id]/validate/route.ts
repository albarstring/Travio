import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getSessionServer } from "@/lib/auth-server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionServer()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const payment = await prisma.payment.findUnique({ where: { id } })
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status: "completed",
        validatedBy: session.userId,
        validatedAt: new Date(),
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "validate",
        entityType: "payment",
        entityId: id,
        adminId: session.userId,
        details: { amount: payment.amount },
      },
    })

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error("Error validating payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

