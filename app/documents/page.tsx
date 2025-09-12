"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DocumentSubmission() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Document submission started")

    if (!title || !file || !category) {
      setError("Please fill in all required fields and select a file.")
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.")
      return
    }

    setUploading(true)
    setError("")

    try {
      console.log("[v0] Processing file upload simulation")
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store submission data in localStorage for demo
      const submissions = JSON.parse(localStorage.getItem("submissions") || "[]")
      const newSubmission = {
        id: Date.now().toString(),
        title,
        description,
        category,
        fileName: file.name,
        fileSize: file.size,
        status: "pending",
        submittedAt: new Date().toISOString(),
      }
      submissions.push(newSubmission)
      localStorage.setItem("submissions", JSON.stringify(submissions))

      console.log("[v0] Document submission successful:", newSubmission)

      // Redirect to success page
      router.push("/documents/success")
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError("Failed to upload document. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Document</h1>
          <p className="text-gray-600">Upload your TSA competition entries, project proposals, and other documents</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Submission Form
            </CardTitle>
            <CardDescription>Fill out the form below to submit your document for review</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competition">Competition Entry</SelectItem>
                    <SelectItem value="project">Project Proposal</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a brief description of your document"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>File Upload *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Drag and drop your file here, or{" "}
                      <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                {file && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={uploading || !title || !file || !category}>
                {uploading ? "Uploading..." : "Submit Document"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
