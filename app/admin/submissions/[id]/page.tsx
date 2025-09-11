"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, XCircle, Clock, User, Calendar, FileText } from "lucide-react"

export default function ReviewSubmissionPage() {
  const [submission, setSubmission] = useState<any>(null)
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      // Check admin access
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      if (!profile || !["admin", "officer", "teacher"].includes(profile.role)) {
        router.push("/my")
        return
      }
      setProfile(profile)
    }

    const getSubmission = async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          *,
          profiles!submissions_user_id_fkey(full_name, email, school_year)
        `)
        .eq("id", params.id)
        .single()

      if (error) {
        console.error("Error fetching submission:", error)
        return
      }

      setSubmission(data)
      setFeedback(data.feedback || "")
    }

    getUser()
    getSubmission()
  }, [params.id, router, supabase])

  const handleReview = async (status: "approved" | "rejected") => {
    if (!user || !submission) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("submissions")
        .update({
          status,
          feedback: feedback.trim() || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq("id", submission.id)

      if (error) throw error

      router.push("/admin")
    } catch (error) {
      console.error("Error updating submission:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!submission || !profile) {
    return <div>Loading...</div>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Submission Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{submission.title}</CardTitle>
                  <CardDescription>Submitted by {submission.profiles?.full_name || "Unknown Student"}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(submission.status)} border`}>
                  <span className="flex items-center space-x-1">
                    {getStatusIcon(submission.status)}
                    <span className="capitalize">{submission.status}</span>
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Student: {submission.profiles?.full_name || "Unknown"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Email: {submission.profiles?.email || "Unknown"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Grade: {submission.profiles?.school_year || "Unknown"}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <p className="text-muted-foreground">{submission.category}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{submission.description}</p>
              </div>

              {submission.file_url && (
                <div>
                  <h3 className="font-semibold mb-2">Attached File</h3>
                  <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{submission.file_url}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Section */}
          <Card>
            <CardHeader>
              <CardTitle>Review Submission</CardTitle>
              <CardDescription>Provide feedback and approve or reject this submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide constructive feedback for the student..."
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleReview("approved")}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isLoading ? "Processing..." : "Approve Submission"}
                </Button>
                <Button
                  onClick={() => handleReview("rejected")}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {isLoading ? "Processing..." : "Reject Submission"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
