"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createSubmission(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to submit" }
  }

  // Extract form data
  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const submissionGroup = formData.get("submissionGroup") as string
  const checkInDate = formData.get("checkInDate") as string
  const fileUrl = formData.get("fileUrl") as string

  if (!title || !category || !description) {
    return { error: "Please fill in all required fields" }
  }

  // Prepare submission data - start with required fields only
  const submissionData: any = {
    user_id: user.id,
    title,
    category,
    description,
    status: "pending",
  }

  // Add optional file URL if provided
  if (fileUrl) {
    submissionData.file_url = fileUrl
  }

  // Insert submission
  const { data, error } = await supabase
    .from("submissions")
    .insert(submissionData)
    .select()
    .single()

  if (error) {
    console.error("[v0] Submission error:", error)
    return { error: `Failed to create submission: ${error.message}` }
  }

  revalidatePath("/my")
  revalidatePath("/admin")

  return { success: true, data }
}

export async function updateSubmissionStatus(submissionId: string, status: string) {
  const supabase = await createClient()

  // Verify user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "teacher", "officer"].includes(profile.role)) {
    return { error: "You do not have permission to update submissions" }
  }

  // Update submission status
  const { error } = await supabase.from("submissions").update({ status }).eq("id", submissionId)

  if (error) {
    console.error("[v0] Update error:", error)
    return { error: "Failed to update submission" }
  }

  revalidatePath("/admin")
  revalidatePath(`/admin/submissions/${submissionId}`)

  return { success: true }
}

export async function updateSubmission(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to update a submission" }
  }

  const submissionId = formData.get("submissionId") as string

  if (!submissionId) {
    return { error: "Submission ID is required" }
  }

  // Verify ownership
  const { data: existingSubmission, error: fetchError } = await supabase
    .from("submissions")
    .select("user_id, status")
    .eq("id", submissionId)
    .single()

  if (fetchError || !existingSubmission) {
    return { error: "Submission not found" }
  }

  if (existingSubmission.user_id !== user.id) {
    return { error: "You can only edit your own submissions" }
  }

  // Only allow editing if status is pending or rejected
  if (!["pending", "rejected"].includes(existingSubmission.status)) {
    return { error: "Cannot edit approved submissions" }
  }

  // Extract form data
  const title = formData.get("title") as string
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const submissionGroup = formData.get("submissionGroup") as string
  const checkInDate = formData.get("checkInDate") as string
  const fileUrl = formData.get("fileUrl") as string

  if (!title || !category || !description) {
    return { error: "Please fill in all required fields" }
  }

  const updateData: any = {
    title,
    category,
    description,
    updated_at: new Date().toISOString(),
  }

  if (submissionGroup) updateData.submission_group = submissionGroup
  if (checkInDate) updateData.check_in_date = checkInDate
  if (fileUrl) updateData.file_url = fileUrl

  const { data, error } = await supabase
    .from("submissions")
    .update(updateData)
    .eq("id", submissionId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Update error:", error)
    return { error: `Failed to update submission: ${error.message}` }
  }

  revalidatePath("/my")
  revalidatePath("/my/documents")
  revalidatePath("/admin")

  return { success: true, data }
}
