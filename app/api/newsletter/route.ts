import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { email, name, source = "website" } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Use the database function to handle upsert
    const { data, error } = await supabase.rpc("subscribe_newsletter", {
      p_email: email.toLowerCase().trim(),
      p_name: name?.trim() || null,
      p_source: source,
    })

    if (error) {
      console.error("[v0] Newsletter subscribe error:", error)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    const result = data as { success: boolean; subscriber?: any; message?: string; error?: string }

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Subscription failed" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message || "Successfully subscribed!",
      subscriber: result.subscriber,
    })
  } catch (error) {
    console.error("[v0] Newsletter subscribe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}