"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function DocumentSubmission() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("user")

      if (!isAuthenticated || !userData) {
        router.push("/auth/login")
        return
      }

      setUser(JSON.parse(userData))
    }

    checkAuth()
  }, [router])

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
      const droppedFile = e.dataTransfer.files[0]
      if (validateFileType(droppedFile)) {
        setFile(droppedFile)
        setError("")
      } else {
        setError("Please select a supported file type (PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG)")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFileType(selectedFile)) {
        setFile(selectedFile)
        setError("")
      } else {
        setError("Please select a supported file type (PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG)")
      }
    }
  }

  const validateFileType = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ]
    return allowedTypes.includes(file.type)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !file || !category) {
      setError("Please fill in all required fields and select a file.")
      return
    }

    if (!user) {
      setError("You must be logged in to submit documents.")
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
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const submissions = JSON.parse(localStorage.getItem("submissions") || "[]")
      const newSubmission = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        category,
        fileName: file.name,
        fileSize: file.size,
        status: "pending",
        submitted_at: new Date().toISOString(),
        user_email: user.email,
        feedback: null,
      }
      submissions.push(newSubmission)
      localStorage.setItem("submissions", JSON.stringify(submissions))

      setShowSuccess(true)

      // Reset form
      setTitle("")
      setDescription("")
      setCategory("")
      setFile(null)

      // Redirect to success page after a brief delay
      setTimeout(() => {
        router.push("/documents/success")
      }, 1500)
    } catch (err) {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 flex items-center justify-center">
        <Card className="shadow-lg text-center max-w-md">
          <CardContent className="pt-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Success!</h2>
            <p className="text-green-700">Your document has been submitted successfully.</p>
            <p className="text-sm text-green-600 mt-2">Redirecting to confirmation page...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/my"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

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
                    <SelectItem value="Biotechnology Design">Biotechnology Design</SelectItem>
                    <SelectItem value="Engineering Design">Engineering Design</SelectItem>
                    <SelectItem value="Architectural Design">Architectural Design</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Digital Photography">Digital Photography</SelectItem>
                    <SelectItem value="Fashion Design">Fashion Design</SelectItem>
                    <SelectItem value="Forensic Science">Forensic Science</SelectItem>
                    <SelectItem value="Game Design">Game Design</SelectItem>
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

              <Button type="submit" className="w-full" disabled={uploading || !title.trim() || !file || !category}>
                {uploading ? "Uploading..." : "Submit Document"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
