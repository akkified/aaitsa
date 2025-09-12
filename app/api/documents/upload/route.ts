import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string

    if (!file || !title || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not supported" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${timestamp}_${sanitizedTitle}.${fileExtension}`

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Save metadata to Supabase
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        title,
        description: description || null,
        file_name: file.name,
        file_url: blob.url,
        file_size: file.size,
        file_type: file.type,
        submitted_by: user.id,
        category,
        status: "pending",
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save document metadata" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        file_url: document.file_url,
        status: document.status,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
