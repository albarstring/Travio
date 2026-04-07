import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    if (!userId || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(vouchers)
  } catch (error) {
    console.error("Error fetching vouchers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const userRole = request.headers.get("x-user-role")
    
    if (!userId || userRole !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      code,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
    } = body

    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const voucher = await prisma.voucher.create({
      data: {
        code: code.toUpperCase(),
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue),
        minPurchase: minPurchase ? parseFloat(minPurchase) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        isActive: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "create",
        entityType: "voucher",
        entityId: voucher.id,
        adminId: userId,
        details: { code, discountType, discountValue },
      },
    })

    return NextResponse.json(voucher)
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Voucher code already exists" }, { status: 400 })
    }
    console.error("Error creating voucher:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
