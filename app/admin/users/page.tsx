"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Shield, User } from "lucide-react"
import { redirect } from "next/navigation"

type Profile = {
  id: string
  email: string
  full_name: string
  school_year: string
  role: string
  created_at: string
}

export default function ManageUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Check if current user is admin
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        redirect("/auth/login")
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (!profile || !["admin", "officer", "teacher"].includes(profile.role)) {
        redirect("/my")
      }

      setCurrentUserRole(profile.role)

      // Fetch all users
      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (allProfiles) {
        setProfiles(allProfiles)
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  const updateUserRole = async (userId: string, newRole: string) => {
    const supabase = createClient()
    setMessage(null)

    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

    if (error) {
      setMessage({ type: "error", text: `Failed to update role: ${error.message}` })
    } else {
      setMessage({ type: "success", text: "User role updated successfully!" })
      // Update local state
      setProfiles(profiles.map((p) => (p.id === userId ? { ...p, role: newRole } : p)))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Manage User Roles
            </CardTitle>
            <CardDescription>Update user roles to grant admin, officer, teacher, or student access</CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{profile.full_name || "No name"}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      {profile.school_year && (
                        <p className="text-xs text-muted-foreground capitalize">{profile.school_year}</p>
                      )}
                    </div>
                    <Badge variant={profile.role === "admin" ? "default" : "secondary"} className="capitalize">
                      {profile.role}
                    </Badge>
                  </div>
                  <div className="ml-4">
                    <Select value={profile.role} onValueChange={(value) => updateUserRole(profile.id, value)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="officer">Officer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
