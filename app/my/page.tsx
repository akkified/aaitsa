"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  ArrowUpRight, 
  LayoutDashboard, 
  Activity 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function DashboardPage({ profile, submissions }: any) {
  const [mounted, setMounted] = useState(false)

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

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Dashboard Hero / Header */}
      <section className="relative pt-20 pb-10 border-b border-border/40">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LayoutDashboard className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-muted-foreground">
                  Student Terminal // 2025-2026
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Welcome, <br />
                <span className="text-primary italic">
                  {profile?.full_name?.split(' ')[0] || "Member"}.
                </span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild className="rounded-full bg-primary text-white uppercase text-[10px] font-black tracking-widest px-10 py-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <Link href="/my/submit">
                  <Plus className="mr-2 h-4 w-4" /> New Entry
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-6 py-12 mx-auto">
        
        {/* Status Monitor (Stats) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Entries", val: submissions?.length || 0, icon: <FileText className="w-4 h-4"/> },
            { label: "Pending", val: submissions?.filter((s:any) => s.status === "pending").length || 0, icon: <Clock className="w-4 h-4 text-yellow-500"/> },
            { label: "Approved", val: submissions?.filter((s:any) => s.status === "approved").length || 0, icon: <CheckCircle className="w-4 h-4 text-primary"/> },
            { label: "Level", val: profile?.school_year || "N/A", icon: <User className="w-4 h-4"/>, isCap: true },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-card border border-border rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  {stat.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                </div>
                <p className={cn("text-4xl font-black tracking-tighter", stat.isCap && "capitalize")}>
                  {stat.val}
                </p>
              </div>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Submissions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Active Submissions</h2>
              <p className="text-xs text-muted-foreground font-mono mt-1">// TRACKING REAL-TIME STATUS</p>
            </div>
          </div>

          <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0">
              {submissions && submissions.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {submissions.map((submission: any) => (
                    <div
                      key={submission.id}
                      className="group flex flex-col md:flex-row items-start md:items-center justify-between p-8 hover:bg-primary/5 transition-colors gap-6"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                            {submission.title}
                          </h3>
                          <Badge className={cn("px-3 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest", getStatusStyles(submission.status))}>
                            <span className="flex items-center gap-1.5">
                              {getStatusIcon(submission.status)}
                              {submission.status}
                            </span>
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
                          {submission.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Category:</span>
                            <span className="text-[10px] font-bold uppercase">{submission.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Logged:</span>
                            <span className="text-[10px] font-bold uppercase">
                                {new Date(submission.submitted_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {submission.feedback && (
                          <div className="mt-6 p-4 bg-secondary/50 rounded-2xl border border-border/50 text-sm italic text-muted-foreground">
                            <span className="font-bold text-primary not-italic uppercase text-[10px] block mb-1 tracking-widest">Officer Feedback:</span>
                            "{submission.feedback}"
                          </div>
                        )}
                      </div>
                      
                      <div className="shrink-0">
                        <Button variant="outline" size="sm" asChild className="rounded-full px-6 border-border group-hover:border-primary group-hover:text-primary transition-all">
                          <Link href={`/my/submissions/${submission.id}`} className="flex items-center gap-2">
                            VIEW DETAILS <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No active records</h3>
                  <p className="text-muted-foreground mb-8 max-w-xs mx-auto text-sm">
                    Ready to compete? Start your journey by creating your first technical submission.
                  </p>
                  <Button asChild className="rounded-full bg-primary px-10 py-6 font-black uppercase text-xs tracking-[0.2em]">
                    <Link href="/my/submit">
                      Create Submission
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="pb-24" />
    </div>
  )
}