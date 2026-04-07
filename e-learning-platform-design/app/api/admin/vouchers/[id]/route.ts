import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    if (!userId || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const updateData: any = {}
    if (body.code !== undefined) updateData.code = body.code.toUpperCase()
    if (body.description !== undefined) updateData.description = body.description
    if (body.discountType !== undefined) updateData.discountType = body.discountType
    if (body.discountValue !== undefined) updateData.discountValue = parseFloat(body.discountValue)
    if (body.minPurchase !== undefined) updateData.minPurchase = body.minPurchase ? parseFloat(body.minPurchase) : null
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount ? parseFloat(body.maxDiscount) : null
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit ? parseInt(body.usageLimit) : null
    if (body.validFrom !== undefined) updateData.validFrom = new Date(body.validFrom)
    if (body.validUntil !== undefined) updateData.validUntil = new Date(body.validUntil)
    if (body.isActive !== undefined) updateData.isActive = body.isActive

    const voucher = await prisma.voucher.update({
      where: { id },
      data: updateData,
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "update",
        entityType: "voucher",
        entityId: id,
        adminId: userId,
        details: updateData,
      },
    })

    return NextResponse.json(voucher)
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Voucher code already exists" }, { status: 400 })
    }
    console.error("Error updating voucher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    if (!userId || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.voucher.delete({
      where: { id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "delete",
        entityType: "voucher",
        entityId: id,
        adminId: userId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting voucher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
