// app/my/page.tsx
import { createClient } from "@/lib/supabase/server" 
import DashboardPage from "./DashboardClient"
import { redirect } from "next/navigation"

export default async function Page() {
  // CORRECT: You must await the creation of the client
  const supabase = await createClient() 
  
  // Now supabase.auth will exist
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch the student's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Fetch ONLY submissions belonging to this specific student
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id) 
    .order("submitted_at", { ascending: false })

  return (
    <DashboardPage 
      profile={profile} 
      submissions={submissions || []} 
    />
  )
}