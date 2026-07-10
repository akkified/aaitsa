import { put } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin/officer/teacher
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || !["admin", "officer", "teacher"].includes(profile.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const eventName = formData.get("eventName") as string
    const eventDate = formData.get("eventDate") as string
    const isPublic = formData.get("isPublic") === "true"

    if (!file || !title || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file size (25MB limit for resources)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 25MB limit" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "application/zip",
      "application/x-zip-compressed",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, ZIP" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(`resources/${user.id}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Insert into Supabase
    const { data, error } = await supabase
      .from("resources")
      .insert({
        title,
        description,
        category,
        file_url: blob.url,
        file_filename: file.name,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: user.id,
        event_name: eventName || null,
        event_date: eventDate || null,
        is_public: isPublic,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Resource insert error:", error)
      return NextResponse.json({ error: "Failed to save resource" }, { status: 500 })
    }

    return NextResponse.json({ success: true, resource: data })
  } catch (error) {
    console.error("[v0] Resource upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin/officer/teacher
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || !["admin", "officer", "teacher"].includes(profile.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing resource ID" }, { status: 400 })
    }

    // Get resource info first (for blob deletion)
    const { data: resource } = await supabase.from("resources").select("file_url").eq("id", id).single()

    // Delete from Supabase
    const { error } = await supabase.from("resources").delete().eq("id", id)

    if (error) {
      console.error("[v0] Resource delete error:", error)
      return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 })
    }

    // Note: Vercel Blob deletion would require the blob URL parsing and BLOB_READ_WRITE_TOKEN
    // For now we just delete the database record

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Resource delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin/officer/teacher
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || !["admin", "officer", "teacher"].includes(profile.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Missing resource ID" }, { status: 400 })
    }

    const { error } = await supabase.from("resources").update(updates).eq("id", id)

    if (error) {
      console.error("[v0] Resource update error:", error)
      return NextResponse.json({ error: "Failed to update resource" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Resource update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}