import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get("admin") === "true"

    let query = supabase
      .from("documents")
      .select(`
        id,
        title,
        description,
        file_name,
        file_url,
        file_size,
        file_type,
        submitted_at,
        status,
        category,
        submitted_by
      `)
      .order("submitted_at", { ascending: false })

    // If not admin request, only show user's own documents
    if (!isAdmin) {
      query = query.eq("submitted_by", user.id)
    }

    const { data: documents, error: dbError } = await query

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update document status
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
    }

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
