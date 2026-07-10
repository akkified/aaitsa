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
    const eventDate = formData.get("eventDate") as string
    const isFeatured = formData.get("isFeatured") === "true"

    if (!file || !title || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(`gallery/${user.id}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    // Insert into Supabase
    const { data, error } = await supabase
      .from("gallery_images")
      .insert({
        title,
        description,
        category,
        image_url: blob.url,
        image_filename: file.name,
        image_size: file.size,
        image_type: file.type,
        uploaded_by: user.id,
        event_date: eventDate || null,
        is_featured: isFeatured,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Gallery insert error:", error)
      return NextResponse.json({ error: "Failed to save gallery image" }, { status: 500 })
    }

    return NextResponse.json({ success: true, image: data })
  } catch (error) {
    console.error("[v0] Gallery upload error:", error)
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
      return NextResponse.json({ error: "Missing image ID" }, { status: 400 })
    }

    // Get image info first (for blob deletion)
    const { data: image } = await supabase.from("gallery_images").select("image_url").eq("id", id).single()

    // Delete from Supabase
    const { error } = await supabase.from("gallery_images").delete().eq("id", id)

    if (error) {
      console.error("[v0] Gallery delete error:", error)
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }

    // Optionally delete from Vercel Blob (requires BLOB_READ_WRITE_TOKEN)
    // This would need the blob URL to be parsed

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Gallery delete error:", error)
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
    const { id, is_featured } = body

    if (!id || typeof is_featured !== "boolean") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { error } = await supabase.from("gallery_images").update({ is_featured }).eq("id", id)

    if (error) {
      console.error("[v0] Gallery update error:", error)
      return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Gallery update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}