import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("gallery_images")
      .select(
        `
        *,
        profiles:uploaded_by(full_name, email)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("[v0] Gallery fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 })
    }

    return NextResponse.json({ images: data || [], total: count })
  } catch (error) {
    console.error("[v0] Gallery API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}