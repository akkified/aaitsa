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
  const fileName = formData.get("fileName") as string

  if (!title || !category || !description) {
    return { error: "Please fill in all required fields" }
  }

  // Insert submission
  const { data, error } = await supabase
    .from("submissions")
    .insert({
      user_id: user.id,
      title,
      category,
      description,
      submission_group: submissionGroup || null,
      check_in_date: checkInDate || null,
      file_url: fileUrl,
      file_name: fileName,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Submission error:", error)
    return { error: "Failed to create submission" }
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
