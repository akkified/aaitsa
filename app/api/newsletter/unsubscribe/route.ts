import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Use the database function to unsubscribe
    const { data, error } = await supabase.rpc("unsubscribe_newsletter", {
      p_email: email.toLowerCase().trim(),
    })

    if (error) {
      console.error("[v0] Newsletter unsubscribe error:", error)
      return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
    }

    const result = data as { success: boolean; message?: string; error?: string }

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Unsubscribe failed" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message || "Successfully unsubscribed",
    })
  } catch (error) {
    console.error("[v0] Newsletter unsubscribe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}