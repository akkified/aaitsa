import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const isPublic = searchParams.get("public")

    let query = supabase
      .from("resources")
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

    if (isPublic === "true") {
      query = query.eq("is_public", true)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,event_name.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("[v0] Resources fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
    }

    return NextResponse.json({ resources: data || [], total: count })
  } catch (error) {
    console.error("[v0] Resources API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}