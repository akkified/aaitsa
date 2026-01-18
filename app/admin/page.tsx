"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
  Users, FileText, Clock, CheckCircle, XCircle,
  User, Shield, LayoutDashboard, Activity, Settings,
  ArrowUpRight, History
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const [submissionsWithProfiles, setSubmissionsWithProfiles] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [sortBy, setSortBy] = useState("submitted_at")
  const [sortOrder, setSortOrder] = useState("desc")

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { router.push("/auth/login"); return }

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (!profile || !["admin", "officer", "teacher"].includes(profile.role)) {
          router.push("/my")
          return
        }
        setProfile(profile)

        const { data: submissions } = await supabase.from("submissions").select("*").order("submitted_at", { ascending: false })

        const withProfiles = await Promise.all(
          (submissions || []).map(async (submission) => {
            const { data: userProfile } = await supabase.from("profiles").select("full_name, email, school_year").eq("id", submission.user_id).single()
            return { ...submission, profiles: userProfile }
          }),
        )
        setSubmissionsWithProfiles(withProfiles)

        const { data: users } = await supabase.from("profiles").select("*")
        setUserStats(users || [])
      } catch (error) {
        console.error("Error loading admin data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router, supabase])

  if (!mounted) return null

  const stats = [
    { label: "Total Entries", val: submissionsWithProfiles.length, icon: <FileText className="w-4 h-4" /> },
    { label: "Needs Review", val: submissionsWithProfiles.filter(s => s.status === "pending").length, icon: <Clock className="w-4 h-4 text-yellow-500" /> },
    { label: "Chapter Members", val: userStats.length, icon: <Users className="w-4 h-4 text-primary" /> },
    { label: "Total Students", val: userStats.filter(u => u.role === "student").length, icon: <User className="w-4 h-4" /> },
  ]

  const sortedSubmissions = [...submissionsWithProfiles].sort((a, b) => {
    let comp = 0
    if (sortBy === "category") comp = a.category.localeCompare(b.category)
    else if (sortBy === "submitted_at") comp = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
    else if (sortBy === "status") comp = a.status.localeCompare(b.status)
    else if (sortBy === "title") comp = a.title.localeCompare(b.title)
    return sortOrder === "desc" ? -comp : comp
  })

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return "border-primary/50 bg-primary/10 text-primary"
      case "rejected": return "border-destructive/50 bg-destructive/10 text-destructive"
      default: return "border-yellow-500/50 bg-yellow-500/10 text-yellow-500"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Authenticating Admin...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">

      {/* Admin Hero Section */}
      <section className="relative pt-20 pb-10 border-b border-border/40">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-muted-foreground">
                  Command Center // {profile?.role} Access
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Admin <br />
                <span className="text-primary italic">Dashboard.</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="rounded-full border-border uppercase text-[10px] font-black tracking-widest px-8">
                <Link href="/my">Student View</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-border uppercase text-[10px] font-black tracking-widest px-8">
                <Link href="/admin/whitelist">
                  <Shield className="mr-2 h-3 w-4" /> Whitelist
                </Link>
              </Button>
              <Button asChild className="rounded-full bg-primary text-white uppercase text-[10px] font-black tracking-widest px-8 shadow-lg shadow-primary/20">
                <Link href="/admin/users">
                  <Settings className="mr-2 h-3 w-3" /> Manage Users
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-6 py-12 mx-auto">

        {/* Admin Stats Monitor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 bg-card border border-border rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  {stat.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                </div>
                <p className="text-4xl font-black tracking-tighter">{stat.val}</p>
              </div>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 px-2">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Incoming Logs</h2>
            <p className="text-xs text-muted-foreground font-mono mt-1">// SUBMISSION QUEUE</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-secondary/30 border-border rounded-xl text-[10px] font-black uppercase tracking-widest">
                <SelectValue placeholder="SORT BY" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border uppercase font-bold text-[10px]">
                <SelectItem value="submitted_at">DATE</SelectItem>
                <SelectItem value="category">CATEGORY</SelectItem>
                <SelectItem value="status">STATUS</SelectItem>
                <SelectItem value="title">TITLE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submissions Management Card */}
        <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden mb-12">
          <CardContent className="p-0">
            {sortedSubmissions.length > 0 ? (
              <div className="divide-y divide-border/50">
                {sortedSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="group p-8 hover:bg-primary/5 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                          {submission.title}
                        </h3>
                        <Badge className={cn("px-3 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest", getStatusStyles(submission.status))}>
                          {submission.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-6">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{submission.profiles?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <History className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] font-bold uppercase tracking-tight opacity-70">{new Date(submission.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button asChild variant="outline" className="rounded-full px-8 border-border group-hover:border-primary group-hover:text-primary transition-all uppercase text-[10px] font-black tracking-widest">
                      <Link href={`/admin/submissions/${submission.id}`}>Review <ArrowUpRight className="ml-2 w-3 h-3" /></Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Records Detected</h3>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Member Registry Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Member Registry</h2>
              <p className="text-xs text-muted-foreground font-mono mt-1">// ACTIVE PERSONNEL</p>
            </div>
            <Button asChild variant="outline" className="rounded-full border-border uppercase text-[10px] font-black tracking-widest px-8">
              <Link href="/admin/users">Manage All Users</Link>
            </Button>
          </div>

          <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-border/50">
                {userStats.length > 0 ? (
                  userStats.slice(0, 9).map((user, i) => (
                    <div key={i} className="p-6 hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{user.full_name || "Unknown User"}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[8px] font-bold uppercase opacity-50 px-2 min-h-0 h-4 items-center">{user.role}</Badge>
                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-50">{user.school_year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center opacity-50 italic uppercase text-[10px] font-black tracking-widest">
                    No members detected in system
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}