"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, CheckCircle, XCircle, Eye, Download, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Submission {
  id: string
  title: string
  description: string
  category: string
  file_url: string | null
  status: "pending" | "approved" | "rejected"
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  feedback: string | null
  submission_group: string | null
  check_in_date: string | null
  user_id: string
}

export default function DocumentList() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadUserAndSubmissions()
  }, [])

  const loadUserAndSubmissions = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        setIsLoading(false)
        return
      }

      setUser({ id: user.id, email: user.email! })

      const loadSubmissions = async () => {
        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("user_id", user.id)
          .order("submitted_at", { ascending: false })

        if (error) {
          console.error("Error loading submissions:", error)
          return
        }

        setSubmissions(data || [])
      }

      await loadSubmissions()

      // Subscribe to real-time changes
      const channel = supabase
        .channel("submissions-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "submissions",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadSubmissions()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (error) {
      console.error("Error loading user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) return

    setDeleting(id)
    try {
      const { error } = await supabase.from("submissions").delete().eq("id", id)

      if (error) throw error

      setSubmissions((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Error deleting submission:", error)
      alert("Failed to delete submission. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

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

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes || bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading your submissions...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground mb-4">Please log in to view your submissions.</p>
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
          <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't submitted any competition entries yet. Get started by submitting your first TSA project.
          </p>
          <Button asChild>
            <Link href="/my/submit">Submit Your First Entry</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
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
                <p className="text-2xl font-bold text-yellow-600">
                  {submissions.filter((s) => s.status === "pending").length}
                </p>
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
                <p className="text-2xl font-bold text-green-600">
                  {submissions.filter((s) => s.status === "approved").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Needs Revision</p>
                <p className="text-2xl font-bold text-red-600">
                  {submissions.filter((s) => s.status === "rejected").length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Competition Entries</CardTitle>
          <CardDescription>Track the status of your TSA competition submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2 flex-wrap">
                    <h3 className="font-semibold truncate">{submission.title}</h3>
                    <Badge className={`${getStatusColor(submission.status)} border`}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(submission.status)}
                        <span className="capitalize">{submission.status}</span>
                      </span>
                    </Badge>
                    {submission.submission_group && (
                      <Badge variant="outline" className="text-xs">
                        {submission.submission_group}
                      </Badge>
                    )}
                    {submission.feedback && submission.status !== "pending" && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        Has Feedback
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{submission.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground flex-wrap">
                    <span>Category: {submission.category}</span>
                    <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                    {submission.check_in_date && (
                      <span>Check-in: {new Date(submission.check_in_date).toLocaleDateString()}</span>
                    )}
                    {submission.file_url && (
                      <span>File: {formatFileSize(0)}</span>
                    )}
                  </div>
                  {submission.feedback && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-sm border border-border/50">
                      <strong>Feedback:</strong> {submission.feedback}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  {submission.file_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      title="Download file"
                    >
                      <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-1" /> File
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    title="View details"
                  >
                    <Link href={`/my/submissions/${submission.id}`}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Link>
                  </Button>
                  {(submission.status === "pending" || submission.status === "rejected") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      title="Edit submission"
                    >
                      <Link href={`/my/submit?edit=${submission.id}`}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(submission.id)}
                    disabled={deleting === submission.id}
                    title="Delete submission"
                  >
                    {deleting === submission.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
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