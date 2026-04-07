import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || "all"
  const minPrice = Number.parseFloat(searchParams.get("minPrice") || "0")
  const maxPrice = Number.parseFloat(searchParams.get("maxPrice") || "10000")
  const minRating = Number.parseFloat(searchParams.get("minRating") || "0")

  let results = db.courses.search(query)

  if (category !== "all") {
    results = results.filter((c) => c.category.toLowerCase() === category.toLowerCase())
  }

  results = results.filter((c) => c.price >= minPrice && c.price <= maxPrice && c.rating >= minRating)

  return NextResponse.json({
    results,
    count: results.length,
  })
}
