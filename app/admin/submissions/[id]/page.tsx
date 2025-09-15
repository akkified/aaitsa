"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, FileText, Download, User, CheckCircle, XCircle, MessageSquare } from "lucide-react"

interface AdminSubmissionPageProps {
  params: {
    id: string
  }
}

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

export default function AdminSubmissionPage({ params }: AdminSubmissionPageProps) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [feedback, setFeedback] = useState("")
  const [status, setStatus] = useState("")
  const [updating, setUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadSubmission = () => {
      const savedSubmissions = localStorage.getItem("submissions")
      if (savedSubmissions) {
        const submissions = JSON.parse(savedSubmissions)
        const foundSubmission = submissions.find((s: Submission) => s.id === params.id)
        if (foundSubmission) {
          setSubmission(foundSubmission)
          setFeedback(foundSubmission.feedback || "")
          setStatus(foundSubmission.status)
        }
      }
    }

    loadSubmission()
  }, [params.id])

  const handleStatusUpdate = async () => {
    if (!submission) return

    setUpdating(true)
    try {
      const savedSubmissions = localStorage.getItem("submissions")
      if (savedSubmissions) {
        const submissions = JSON.parse(savedSubmissions)
        const updatedSubmissions = submissions.map((s: Submission) =>
          s.id === submission.id ? { ...s, status, feedback } : s,
        )
        localStorage.setItem("submissions", JSON.stringify(updatedSubmissions))

        // Update local state
        setSubmission({ ...submission, status: status as any, feedback })

        // Redirect back to admin dashboard
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error updating submission:", error)
    } finally {
      setUpdating(false)
    }
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Submission Not Found</h2>
            <p className="text-muted-foreground mb-4">The submission you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/admin">Return to Admin Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Review Submission</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{submission.title}</CardTitle>
                    <CardDescription className="mt-2">{submission.description}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(submission.status)} border`}>
                    <span className="capitalize">{submission.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Category:</span>
                    <p>{submission.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Submitted:</span>
                    <p>{new Date(submission.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Files */}
            <Card>
              <CardHeader>
                <CardTitle>Submitted Files</CardTitle>
                <CardDescription>Documents and files to review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{submission.fileName}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(submission.fileSize)}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Student Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <p className="text-sm">{submission.user_email}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Student Name:</span>
                  <p>{submission.user_email.split("@")[0]}</p>
                </div>
              </CardContent>
            </Card>

            {/* Review Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Review & Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback</label>
                  <Textarea
                    placeholder="Provide feedback for the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={handleStatusUpdate} disabled={updating}>
                    {updating ? "Updating..." : "Update Review"}
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-green-600 hover:text-green-700 bg-transparent"
                    onClick={() => {
                      setStatus("approved")
                      setFeedback("Document approved - excellent work!")
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Quick Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => {
                      setStatus("rejected")
                      setFeedback("Please revise and resubmit with improvements.")
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Quick Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
