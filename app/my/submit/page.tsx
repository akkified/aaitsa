"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Upload } from "lucide-react"

const TSA_CATEGORIES = [
  "Architectural Design",
  "Biotechnology Design",
  "Board Game Design",
  "CAD Engineering",
  "Children's Stories",
  "Coding",
  "Computer Science",
  "Construction Challenge",
  "Cybersecurity",
  "Data Science & Analytics",
  "Debating Technological Issues",
  "Digital Photography",
  "Dragster Design",
  "Engineering Design",
  "Essays on Technology",
  "Fashion Design & Technology",
  "Flight Endurance",
  "Forensic Science",
  "Game Design",
  "Geospatial Technology",
  "Graphic Design",
  "Manufacturing Prototype",
  "Music Production",
  "On Demand Video",
  "Promotional Design",
  "Software Development",
  "Structural Design & Engineering",
  "System Control Technology",
  "Technology Bowl",
  "Technology Problem Solving",
  "Transportation Modeling",
  "Video Game Design",
  "Webmaster",
]

export default function SubmitPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router, supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      let fileUrl = null

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        // Note: In a real implementation, you would upload to Vercel Blob or similar
        // For now, we'll just store the filename
        fileUrl = fileName
      }

      // Insert submission
      const { error: insertError } = await supabase.from("submissions").insert({
        user_id: user.id,
        title,
        description,
        category,
        file_url: fileUrl,
        status: "pending",
      })

      if (insertError) throw insertError

      router.push("/my")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/my"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">New Submission</CardTitle>
              <CardDescription>
                Submit your TSA competition entry for review by chapter officers and advisors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter your project title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Competition Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a TSA competition category" />
                    </SelectTrigger>
                    <SelectContent>
                      {TSA_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project, methodology, and key features..."
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Project File (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <div className="space-y-2">
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="max-w-xs mx-auto"
                      />
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: PDF, DOC, DOCX, PPT, PPTX, ZIP, RAR (Max 10MB)
                      </p>
                    </div>
                  </div>
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit Project"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/my">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
