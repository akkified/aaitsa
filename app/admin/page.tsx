"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileText, Clock, CheckCircle, XCircle, LogOut, Shield, ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function AdminDashboardPage() {
  const [user, setUser] = useState<{ email: string; name: string; isAdmin: boolean } | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("user")

      if (!isAuthenticated || !userData) {
        router.push("/auth/login")
        return
      }

      const parsedUser = JSON.parse(userData)
      const isAdmin = parsedUser.email === "akki.akella@gmail.com"

      if (!isAdmin) {
        router.push("/my")
        return
      }

      setUser({
        email: parsedUser.email,
        name: parsedUser.name || parsedUser.email.split("@")[0],
        isAdmin,
      })

      const savedSubmissions = localStorage.getItem("submissions")
      if (savedSubmissions) {
        setSubmissions(JSON.parse(savedSubmissions))
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
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
                  <span className="text-primary-foreground font-bold">AA</span>
                </div>
                <span className="font-semibold">TSA Admin</span>
              </Link>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                Administrator
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{user.name}</span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Student View
                </Link>
              </Button>
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage TSA submissions and chapter members.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{submissions.filter((s) => s.status === "rejected").length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button asChild>
            <Link href="/admin/documents">Review All Submissions</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/my">Switch to Student View</Link>
          </Button>
        </div>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest project submissions requiring review</CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.slice(0, 10).map((submission) => (
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
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{submission.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Student: {submission.user_email}</span>
                        <span>Category: {submission.category}</span>
                        <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/submissions/${submission.id}`}>Review</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                <p className="text-muted-foreground">
                  Submissions will appear here when students start submitting projects.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
