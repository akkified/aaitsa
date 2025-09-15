"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, FileText, Clock, CheckCircle, XCircle, LogOut, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string; name: string; isAdmin: boolean } | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          router.push("/auth/login")
          return
        }

        const isAdmin = user.email === "akki.akella@gmail.com"
        const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User"

        setUser({
          email: user.email!,
          name: userName,
          isAdmin,
        })

        const loadSubmissions = () => {
          const savedSubmissions = localStorage.getItem("submissions")
          if (savedSubmissions) {
            const allSubmissions = JSON.parse(savedSubmissions)
            const userSubmissions = isAdmin
              ? allSubmissions
              : allSubmissions.filter((s: Submission) => s.user_email === user.email)
            setSubmissions(userSubmissions)
          } else {
            const demoSubmissions = [
              {
                id: "1",
                title: "Biotechnology Design Portfolio",
                description: "Complete portfolio showcasing biotechnology innovation project",
                category: "Biotechnology Design",
                status: "pending" as const,
                submitted_at: "2024-01-15T10:00:00Z",
                feedback: null,
                user_email: user.email!,
              },
              {
                id: "2",
                title: "Engineering Design Process Documentation",
                description: "Step-by-step documentation of engineering design methodology",
                category: "Engineering Design",
                status: "approved" as const,
                submitted_at: "2024-01-10T14:30:00Z",
                feedback: "Excellent work! Great attention to detail in the design process.",
                user_email: user.email!,
              },
            ]
            localStorage.setItem("submissions", JSON.stringify(demoSubmissions))
            setSubmissions(demoSubmissions)
          }
        }

        loadSubmissions()

        const handleStorageChange = (e: StorageEvent) => {
          if (e.key === "submissions") {
            loadSubmissions()
          }
        }

        window.addEventListener("storage", handleStorageChange)

        const interval = setInterval(loadSubmissions, 1000)

        return () => {
          window.removeEventListener("storage", handleStorageChange)
          clearInterval(interval)
        }
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">TSA</span>
                </div>
                <span className="font-semibold">TSA Portal</span>
              </Link>
              {user.isAdmin && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  Admin
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <LogOut className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.name}</span>
              </div>
              {user.isAdmin && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user.name}!{user.isAdmin && <span className="text-accent ml-2">(Administrator)</span>}
          </h1>
          <p className="text-muted-foreground">
            {user.isAdmin
              ? "Manage TSA submissions and review student entries."
              : "Manage your TSA competition submissions and track your progress."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {user.isAdmin ? "Total Submissions" : "Your Submissions"}
                  </p>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{submissions.filter((s) => s.status === "approved").length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {user.isAdmin ? "Rejected" : "Grade Level"}
                  </p>
                  <p className="text-2xl font-bold">
                    {user.isAdmin ? submissions.filter((s) => s.status === "rejected").length : "12th"}
                  </p>
                </div>
                {user.isAdmin ? (
                  <XCircle className="h-8 w-8 text-red-600" />
                ) : (
                  <Settings className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {!user.isAdmin && (
            <Button asChild>
              <Link href="/documents">
                <Plus className="mr-2 h-4 w-4" />
                Submit Document
              </Link>
            </Button>
          )}
          {user.isAdmin ? (
            <>
              <Button asChild>
                <Link href="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/documents">Review Submissions</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/documents">New Competition Entry</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/my/profile">Edit Profile</Link>
              </Button>
            </>
          )}
        </div>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>{user.isAdmin ? "All Submissions" : "Your Submissions"}</CardTitle>
            <CardDescription>
              {user.isAdmin
                ? "Review and manage all TSA competition entries"
                : "Track the status of your TSA competition entries"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
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
                            New Feedback
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{submission.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Category: {submission.category}</span>
                        <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                        {user.isAdmin && <span>Student: {submission.user_email}</span>}
                      </div>
                      {submission.feedback && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                          <strong>Feedback:</strong> {submission.feedback}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={
                            user.isAdmin ? `/admin/submissions/${submission.id}` : `/my/submissions/${submission.id}`
                          }
                        >
                          {user.isAdmin ? "Review" : "View"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                <p className="text-muted-foreground mb-4">
                  {user.isAdmin
                    ? "No student submissions have been made yet."
                    : "Get started by submitting your first TSA competition entry."}
                </p>
                {!user.isAdmin && (
                  <Button asChild>
                    <Link href="/documents">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Submission
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
