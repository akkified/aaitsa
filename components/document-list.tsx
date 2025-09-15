"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Submission {
  id: string
  title: string
  description: string
  category: string
  status: "pending" | "approved" | "rejected"
  submitted_at: string
  feedback: string | null
  user_email: string
  fileName: string
  fileSize: number
}

export default function DocumentList() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserAndSubmissions = async () => {
      const supabase = createClient()

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          setIsLoading(false)
          return
        }

        setUser({ email: user.email! })

        const loadSubmissions = () => {
          const savedSubmissions = localStorage.getItem("submissions")
          if (savedSubmissions) {
            const allSubmissions = JSON.parse(savedSubmissions)
            const userSubmissions = allSubmissions.filter((s: Submission) => s.user_email === user.email)
            setSubmissions(userSubmissions)
          }
        }

        loadSubmissions()

        // Listen for localStorage changes
        const handleStorageChange = (e: StorageEvent) => {
          if (e.key === "submissions") {
            loadSubmissions()
          }
        }

        window.addEventListener("storage", handleStorageChange)

        // Poll for changes every second
        const interval = setInterval(loadSubmissions, 1000)

        return () => {
          window.removeEventListener("storage", handleStorageChange)
          clearInterval(interval)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndSubmissions()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading your documents...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground mb-4">Please log in to view your documents.</p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't submitted any documents yet. Get started by submitting your first TSA competition entry.
          </p>
          <Button asChild>
            <Link href="/documents">Submit Your First Document</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{submissions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{submissions.filter((s) => s.status === "pending").length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{submissions.filter((s) => s.status === "approved").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Submitted Documents</CardTitle>
          <CardDescription>Track the status of your TSA competition entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{submission.title}</h3>
                    <Badge className={`${getStatusColor(submission.status)} border`}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(submission.status)}
                        <span className="capitalize">{submission.status}</span>
                      </span>
                    </Badge>
                    {submission.feedback && submission.status !== "pending" && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        Has Feedback
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{submission.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Category: {submission.category}</span>
                    <span>File: {submission.fileName}</span>
                    <span>Size: {formatFileSize(submission.fileSize)}</span>
                    <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                  </div>
                  {submission.feedback && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                      <strong>Feedback:</strong> {submission.feedback}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/my/submissions/${submission.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
