import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { email, name, source } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json({ error: "This email is already subscribed" }, { status: 400 })
      }

      // Reactivate if previously unsubscribed
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "active",
          name: name || null,
          source: source || "website",
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)

      if (error) {
        console.error("[v0] Newsletter reactivate error:", error)
        return NextResponse.json({ error: "Failed to resubscribe" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Welcome back! You've been resubscribed.",
      })
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: email.toLowerCase().trim(),
        name: name || null,
        status: "active",
        source: source || "website",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Newsletter subscribe error:", error)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the newsletter!",
      subscriber: data,
    })
  } catch (error) {
    console.error("[v0] Newsletter subscribe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}