import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "officer", "teacher"].includes(profile.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { data: subscribers, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Newsletter export error:", error)
      return NextResponse.json({ error: "Failed to export" }, { status: 500 })
    }

    // Build CSV
    const headers = ["Email", "Name", "Status", "Source", "Subscribed At", "Confirmed At", "Unsubscribed At", "Created At"]
    const rows = (subscribers || []).map((s) => [
      s.email,
      s.name || "",
      s.status,
      s.source,
      s.subscribed_at || "",
      s.confirmed_at || "",
      s.unsubscribed_at || "",
      s.created_at,
    ])

    const csvRows = rows.map((row: string[]) =>
      row.map((cell: string) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )

    const csvContent = [headers.join(","), ...csvRows].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Newsletter export error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}