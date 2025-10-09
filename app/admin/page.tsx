"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Users, FileText, Clock, CheckCircle, XCircle, User, Shield, ArrowUpDown } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function AdminDashboardPage() {
  const [submissionsWithProfiles, setSubmissionsWithProfiles] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("submitted_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push("/auth/login")
          return
        }

        // Get user profile and check admin access
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (!profile) {
          router.push("/my")
          return
        }

        if (!["admin", "officer", "teacher"].includes(profile.role)) {
          router.push("/my")
          return
        }

        setProfile(profile)

        // Fetch submissions
        const { data: submissions } = await supabase
          .from("submissions")
          .select("*")
          .order("submitted_at", { ascending: false })

        const submissionsWithProfiles = await Promise.all(
          (submissions || []).map(async (submission) => {
            const { data: userProfile } = await supabase
              .from("profiles")
              .select("full_name, email, school_year")
              .eq("id", submission.user_id)
              .single()

            return {
              ...submission,
              profiles: userProfile,
            }
          }),
        )

        setSubmissionsWithProfiles(submissionsWithProfiles)

        // Get user statistics
        const { data: userStats } = await supabase.from("profiles").select("role").neq("role", "admin")
        setUserStats(userStats || [])
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router, supabase])

  const totalUsers = userStats.length
  const students = userStats.filter((u) => u.role === "student").length
  const teachers = userStats.filter((u) => u.role === "teacher").length
  const officers = userStats.filter((u) => u.role === "officer").length

  // Sort submissions based on selected criteria
  const sortedSubmissions = [...submissionsWithProfiles].sort((a, b) => {
    let comparison = 0

    if (sortBy === "category") {
      comparison = a.category.localeCompare(b.category)
    } else if (sortBy === "submitted_at") {
      comparison = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
    } else if (sortBy === "status") {
      comparison = a.status.localeCompare(b.status)
    } else if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title)
    }

    return sortOrder === "desc" ? -comparison : comparison
  })

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
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h2 className="text-lg font-semibold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Fetching admin dashboard data</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
            <Button asChild>
              <Link href="/my">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
              <Button variant="ghost" size="sm" asChild>
                <Link href="/about">About</Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground capitalize">{profile?.role}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{profile?.full_name || "Admin"}</span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my">Student View</Link>
              </Button>
              <LogoutButton />
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
                  <p className="text-2xl font-bold">{submissions?.length || 0}</p>
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
                  <p className="text-2xl font-bold">{submissions?.filter((s) => s.status === "pending").length || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold">{students}</p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button asChild>
            <Link href="/admin/users">
              <Shield className="mr-2 h-4 w-4" />
              Manage User Roles
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/about">
              <Shield className="mr-2 h-4 w-4" />
              Edit About Page
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/my/submit">View Submissions</Link>
          </Button>
        </div>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest project submissions requiring review</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted_at">Submission Date</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sortedSubmissions && sortedSubmissions.length > 0 ? (
              <div className="space-y-6">
                {/* Group submissions by submission_group */}
                {Object.entries(
                  sortedSubmissions.slice(0, 20).reduce((groups: Record<string, any[]>, submission) => {
                    const groupKey = submission.submission_group || 'Ungrouped'
                    if (!groups[groupKey]) {
                      groups[groupKey] = []
                    }
                    groups[groupKey].push(submission)
                    return groups
                  }, {})
                ).map(([groupName, groupSubmissions]) => (
                  <div key={groupName}>
                    <h4 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                      {groupName}
                      <Badge variant="outline" className="text-xs">
                        {groupSubmissions.length} submission{groupSubmissions.length !== 1 ? 's' : ''}
                      </Badge>
                    </h4>
                    <div className="space-y-3 ml-4">
                      {groupSubmissions.map((submission) => (
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
                              <span>Student: {submission.profiles?.full_name || "Unknown"}</span>
                              <span>
                                Grade:{" "}
                                {submission.profiles?.school_year
                                  ? submission.profiles.school_year.charAt(0).toUpperCase() +
                                    submission.profiles.school_year.slice(1)
                                  : "Unknown"}
                              </span>
                              <span>Category: {submission.category}</span>
                              <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                              {submission.check_in_date && (
                                <span>Check-in: {new Date(submission.check_in_date).toLocaleDateString()}</span>
                              )}
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
