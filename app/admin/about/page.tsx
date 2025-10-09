"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Save, Edit, Eye, Shield } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"

interface AboutContent {
  id: string
  section_key: string
  title: string
  content: string
  order_index: number
  is_active: boolean
}

export default function AdminAboutPage() {
  const [content, setContent] = useState<AboutContent[]>([])
  const [editingContent, setEditingContent] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUserAndContent = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push("/auth/login")
          return
        }

        setUser(user)

        // Check admin access
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        if (!profile || !["admin", "officer"].includes(profile.role)) {
          router.push("/my")
          return
        }
        setProfile(profile)

        // Get about page content
        const { data, error } = await supabase
          .from("about_page_content")
          .select("*")
          .order("order_index", { ascending: true })

        if (error) {
          console.error("Error fetching content:", error)
        } else {
          setContent(data || [])
          // Initialize editing state
          const editingState: Record<string, string> = {}
          data?.forEach((item) => {
            editingState[`title_${item.id}`] = item.title
            editingState[`content_${item.id}`] = item.content
          })
          setEditingContent(editingState)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUserAndContent()
  }, [router, supabase])

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      const updates = content.map((item) => ({
        id: item.id,
        title: editingContent[`title_${item.id}`] || item.title,
        content: editingContent[`content_${item.id}`] || item.content,
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from("about_page_content")
          .update({
            title: update.title,
            content: update.content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", update.id)

        if (error) {
          console.error("Error updating content:", error)
          throw error
        }
      }

      // Refresh content
      const { data, error } = await supabase
        .from("about_page_content")
        .select("*")
        .order("order_index", { ascending: true })

      if (!error && data) {
        setContent(data)
      }
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h2 className="text-lg font-semibold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Fetching about page content</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">You don't have permission to edit the about page.</p>
            <Button asChild>
              <Link href="/my">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <h1 className="text-xl font-semibold">Edit About Page</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/about" target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {content.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {item.title}
                        <Badge variant="outline" className="text-xs">
                          {item.section_key}
                        </Badge>
                      </CardTitle>
                      <CardDescription>Section: {item.section_key}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title_${item.id}`}>Title</Label>
                    <Input
                      id={`title_${item.id}`}
                      value={editingContent[`title_${item.id}`] || ""}
                      onChange={(e) =>
                        setEditingContent((prev) => ({
                          ...prev,
                          [`title_${item.id}`]: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`content_${item.id}`}>Content</Label>
                    <Textarea
                      id={`content_${item.id}`}
                      rows={4}
                      value={editingContent[`content_${item.id}`] || ""}
                      onChange={(e) =>
                        setEditingContent((prev) => ({
                          ...prev,
                          [`content_${item.id}`]: e.target.value,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Editing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Edit the title and content for each section of the about page</p>
              <p>• Changes are saved to the database and will appear on the public about page</p>
              <p>• Use the Preview button to see how changes will look</p>
              <p>• Section keys are used internally and should not be changed</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
