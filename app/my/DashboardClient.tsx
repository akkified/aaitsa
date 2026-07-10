"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import {
  Plus, FileText, Clock, CheckCircle,
  XCircle, User, ArrowUpRight, LayoutDashboard,
  Activity, ShieldCheck, Search, Filter, ChevronDown, ChevronUp
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function DashboardPage({ profile, submissions }: any) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("submitted_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return <CheckCircle className="h-4 w-4 text-primary" />
      case "rejected": return <XCircle className="h-4 w-4 text-destructive" />
      default: return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return "border-primary/50 bg-primary/10 text-primary"
      case "rejected": return "border-destructive/50 bg-destructive/10 text-destructive"
      default: return "border-yellow-500/50 bg-yellow-500/10 text-yellow-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const categories = useMemo((): string[] => {
    const cats = new Set(
      (submissions as Array<{ category: string }> | undefined)?.map(s => s.category).filter(Boolean)
    )
    return Array.from(cats).sort()
  }, [submissions])

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return []

    let filtered = submissions

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((s: any) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((s: any) => s.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((s: any) => s.category === categoryFilter)
    }

    // Sort
    filtered.sort((a: any, b: any) => {
      let comp = 0
      if (sortBy === "category") comp = a.category.localeCompare(b.category)
      else if (sortBy === "submitted_at") comp = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      else if (sortBy === "status") comp = a.status.localeCompare(b.status)
      else if (sortBy === "title") comp = a.title.localeCompare(b.title)
      return sortOrder === "desc" ? -comp : comp
    })

    return filtered
  }, [submissions, searchQuery, statusFilter, categoryFilter, sortBy, sortOrder])

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Dashboard Hero */}
      <section className="relative pt-20 pb-10 border-b border-border/40 bg-secondary/5">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground italic">
                  Student Portal
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-2 italic">
                Welcome, <br />
                <span className="text-primary not-italic">
                  {profile?.full_name?.split(" ")[0] || "Member"}.
                </span>
              </h1>
            </div>

            <Button asChild className="rounded-none bg-primary text-white uppercase text-[11px] font-black tracking-widest px-10 h-16 shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all">
              <Link href="/my/submit">
                <Plus className="mr-2 h-4 w-4" /> New Project Entry
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container px-6 py-12 mx-auto">
        {/* Status Monitor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Total Records", val: submissions?.length || 0, icon: <FileText className="w-4 h-4" /> },
            { label: "Pending Review", val: submissions?.filter((s: any) => s.status === "pending").length || 0, icon: <Clock className="w-4 h-4 text-yellow-500" /> },
            { label: "Validated", val: submissions?.filter((s: any) => s.status === "approved").length || 0, icon: <CheckCircle className="w-4 h-4 text-primary" /> },
            { label: "Class Year", val: profile?.school_year || "N/A", icon: <User className="w-4 h-4" /> },
          ].map((stat, i) => (
            <div key={i} className="p-8 bg-card border border-border rounded-none relative overflow-hidden group hover:border-primary transition-colors">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                  {stat.icon}
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
                <p className="text-5xl font-black tracking-tighter italic">
                  {stat.val}
                </p>
              </div>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Submissions Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-l-4 border-primary pl-6">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Active Submissions</h2>
              <p className="text-[10px] text-muted-foreground font-mono mt-2 font-bold uppercase tracking-widest">// ARCHIVE DATA STREAM</p>
            </div>
          </div>

          {/* Filter Bar */}
          <Card className="bg-card border-border rounded-none overflow-hidden shadow-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="SEARCH SUBMISSIONS..."
                    className="pl-12 py-3 rounded-none bg-secondary/30 border-border focus:ring-primary uppercase font-bold text-xs tracking-[0.2em]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px] bg-secondary/30 border-border rounded-none text-[10px] font-black uppercase tracking-widest">
                      <SelectValue placeholder="ALL STATUS" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border uppercase font-bold text-[10px] rounded-none">
                      <SelectItem value="all">ALL STATUS</SelectItem>
                      <SelectItem value="pending">PENDING</SelectItem>
                      <SelectItem value="approved">APPROVED</SelectItem>
                      <SelectItem value="rejected">REJECTED</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px] bg-secondary/30 border-border rounded-none text-[10px] font-black uppercase tracking-widest">
                      <SelectValue placeholder="ALL CATEGORIES" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border uppercase font-bold text-[10px] rounded-none">
                      <SelectItem value="all">ALL CATEGORIES</SelectItem>
                      {categories.map((cat: string) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px] bg-secondary/30 border-border rounded-none text-[10px] font-black uppercase tracking-widest">
                      <SelectValue placeholder="SORT BY" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border uppercase font-bold text-[10px] rounded-none">
                      <SelectItem value="submitted_at">DATE</SelectItem>
                      <SelectItem value="category">CATEGORY</SelectItem>
                      <SelectItem value="status">STATUS</SelectItem>
                      <SelectItem value="title">TITLE</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="h-10 w-10 rounded-none border-border"
                    title={sortOrder === "asc" ? "Sort ascending" : "Sort descending"}
                  >
                    {sortOrder === "asc" ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Table */}
          <Card className="bg-card border-border rounded-none overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              {filteredSubmissions.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {filteredSubmissions.map((submission: any) => (
                    <div
                      key={submission.id}
                      className="group flex flex-col md:flex-row items-start md:items-center justify-between p-10 hover:bg-secondary/30 transition-all gap-8"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors italic">
                            {submission.title}
                          </h3>
                          <Badge className={cn("px-4 py-1 rounded-none border text-[9px] font-black uppercase tracking-widest", getStatusStyles(submission.status))}>
                            <span className="flex items-center gap-2">
                              {getStatusIcon(submission.status)}
                              {submission.status}
                            </span>
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-6 font-medium">
                          {submission.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-8 border-t border-border/40 pt-6">
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Category:</span>
                            <span className="text-[10px] font-bold uppercase tracking-tight">{submission.category}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Timestamp:</span>
                            <span className="text-[10px] font-bold uppercase tracking-tight">
                              {formatDate(submission.submitted_at)}
                            </span>
                          </div>
                          {submission.submissionGroup && (
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Group:</span>
                              <span className="text-[10px] font-bold uppercase tracking-tight">{submission.submissionGroup}</span>
                            </div>
                          )}
                          {submission.checkInDate && (
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Check-in:</span>
                              <span className="text-[10px] font-bold uppercase tracking-tight">{formatDate(submission.checkInDate)}</span>
                            </div>
                          )}
                        </div>

                        {submission.feedback && (
                          <div className="mt-8 p-6 bg-primary/5 border-l-2 border-primary text-sm italic text-muted-foreground">
                            <span className="font-black text-primary not-italic uppercase text-[9px] block mb-2 tracking-[0.2em]">Evaluation Notes:</span>
                            "{submission.feedback}"
                          </div>
                        )}
                      </div>

                      <Button variant="outline" asChild className="rounded-none px-8 h-12 border-border font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all group/btn">
                        <Link href={`/my/submissions/${submission.id}`} className="flex items-center gap-2">
                          Project Details <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-secondary/10">
                  <div className="w-20 h-20 bg-card border border-border flex items-center justify-center mx-auto mb-8 transform rotate-12">
                    <FileText className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">No Records Found</h3>
                  <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-xs font-bold uppercase tracking-widest leading-loose">
                    Your transmission log is currently empty. Initiate a new project entry to begin the competitive cycle.
                  </p>
                  <Button asChild className="rounded-none bg-primary px-12 h-14 font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary/20">
                    <Link href="/my/submit">Initialize Entry</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}