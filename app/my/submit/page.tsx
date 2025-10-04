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
import { ArrowLeft, Upload, X } from "lucide-react"
import { createSubmission } from "@/app/actions/submissions"

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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setFile(selectedFile)
    setError(null)

    try {
      setUploadProgress(10)
      const formData = new FormData()
      formData.append("file", selectedFile)

      setUploadProgress(50)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(80)
      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setFileUrl(data.url)
      setUploadProgress(100)
    } catch (error) {
      setError("Failed to upload file. Please try again.")
      setFile(null)
      setUploadProgress(0)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFileUrl(null)
    setUploadProgress(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("category", category)
      formData.append("description", description)
      if (fileUrl) {
        formData.append("fileUrl", fileUrl)
        formData.append("fileName", file?.name || "")
      }

      const result = await createSubmission(formData)

      if (result.error) {
        throw new Error(result.error)
      }

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
                    {!file ? (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <div className="space-y-2">
                          <Input
                            id="file"
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
                            onChange={handleFileChange}
                            className="max-w-xs mx-auto"
                          />
                          <p className="text-xs text-muted-foreground">
                            Accepted formats: PDF, DOC, DOCX, PPT, PPTX, ZIP, RAR (Max 10MB)
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile} className="ml-2">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                        {uploadProgress === 100 && <p className="text-xs text-green-600">✓ Upload complete</p>}
                      </div>
                    )}
                  </div>
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
