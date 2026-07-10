import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function checkAdminAuth(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { authorized: false, error: "Unauthorized", status: 401 }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "officer", "teacher"].includes(profile.role)) {
    return { authorized: false, error: "Insufficient permissions", status: 403 }
  }

  return { authorized: true, user }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const auth = await checkAdminAuth(supabase)

    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const source = searchParams.get("source")
    const limit = parseInt(searchParams.get("limit") || "50")
    const page = parseInt(searchParams.get("page") || "1")
    const offset = (page - 1) * limit

    let query = supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (source && source !== "all") {
      query = query.eq("source", source)
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("[v0] Newsletter fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
    }

    // Get stats
    const { data: statsData } = await supabase.from("newsletter_subscribers").select("status")

    const stats = {
      total: statsData?.length || 0,
      active: statsData?.filter((s: any) => s.status === "active").length || 0,
      unsubscribed: statsData?.filter((s: any) => s.status === "unsubscribed").length || 0,
      bounced: statsData?.filter((s: any) => s.status === "bounced").length || 0,
    }

    return NextResponse.json({ subscribers: data || [], total: count, stats })
  } catch (error) {
    console.error("[v0] Newsletter admin GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const auth = await checkAdminAuth(supabase)

    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const { email, name, status = "active", source = "admin" } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
              {
                email: email.toLowerCase().trim(),
                name: name?.trim() || null,
                status,
                source,
                confirmed_at: status === "active" ? new Date().toISOString() : null,
              },
              { onConflict: "email" }
            )
      .select()
      .single()

    if (error) {
      console.error("[v0] Newsletter insert error:", error)
      return NextResponse.json({ error: "Failed to add subscriber" }, { status: 500 })
    }

    return NextResponse.json({ success: true, subscriber: data })
  } catch (error) {
    console.error("[v0] Newsletter admin POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const auth = await checkAdminAuth(supabase)

    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID required" }, { status: 400 })
    }

    // If status is being changed to active, set confirmed_at
    if (updates.status === "active") {
      updates.confirmed_at = new Date().toISOString()
      updates.unsubscribed_at = null
    }

    // If status is being changed to unsubscribed, set unsubscribed_at
    if (updates.status === "unsubscribed") {
      updates.unsubscribed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Newsletter update error:", error)
      return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 })
    }

    return NextResponse.json({ success: true, subscriber: data })
  } catch (error) {
    console.error("[v0] Newsletter admin PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const auth = await checkAdminAuth(supabase)

    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id)

    if (error) {
      console.error("[v0] Newsletter delete error:", error)
      return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Newsletter admin DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}