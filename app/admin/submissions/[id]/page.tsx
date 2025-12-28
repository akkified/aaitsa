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
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, 
  User, Calendar, FileText, Shield, 
  Download, Terminal, MessageSquare, Activity 
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReviewSubmissionPage() {
  const [submission, setSubmission] = useState<any>(null)
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [submitterProfile, setSubmitterProfile] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      setUser(user)

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      if (!profile || !["admin", "officer", "teacher"].includes(profile.role)) {
        router.push("/my")
        return
      }
      setProfile(profile)

      const { data: sub } = await supabase.from("submissions").select("*").eq("id", params.id).single()
      if (sub) {
        setSubmission(sub)
        setFeedback(sub.feedback || "")
        const { data: subProfile } = await supabase.from("profiles").select("*").eq("id", sub.user_id).single()
        setSubmitterProfile(subProfile)
      }
    }
    loadData()
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
      router.refresh()
    } catch (error) {
      console.error("Error updating submission:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted || !submission || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return "border-primary/50 bg-primary/10 text-primary"
      case "rejected": return "border-destructive/50 bg-destructive/10 text-destructive"
      default: return "border-yellow-500/50 bg-yellow-500/10 text-yellow-500"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Admin Terminal Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/admin"
            className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Command Center
          </Link>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-secondary/30 border border-border rounded-full">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest leading-none">
              Officer Review Mode
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div className="space-y-2">
              <Badge className={cn("px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]", getStatusStyles(submission.status))}>
                {submission.status}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                Review <span className="text-primary italic">Entry.</span>
              </h1>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest border-l-2 border-primary pl-4">
                // Submitter: {submitterProfile?.full_name || "Unknown Identity"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Details Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border bg-card rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-4 border-b border-border/40 bg-secondary/10">
                  <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary">Metadata & Description</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border/40">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Competition</p>
                      <p className="text-sm font-bold uppercase">{submission.category}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Student Year</p>
                      <p className="text-sm font-bold uppercase">{submitterProfile?.school_year || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</p>
                    <p className="text-sm leading-relaxed text-foreground font-medium">
                      {submission.description}
                    </p>
                  </div>

                  {submission.file_url && (
                    <div className="pt-6">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Project Asset</p>
                      <div className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl group hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <span className="text-[10px] font-bold uppercase truncate max-w-[180px]">Technical_Docs.archive</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80 uppercase font-black text-[9px] tracking-widest"
                          onClick={() => window.open(submission.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" /> Open Node
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Officer Actions Sidebar */}
            <div className="space-y-6">
              <Card className="border-border bg-card rounded-[2rem] overflow-hidden sticky top-24 shadow-2xl shadow-primary/5">
                <CardHeader className="p-8 pb-4 border-b border-border/40 bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Verdict Protocol</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest ml-1">Officer Feedback</Label>
                    <Textarea
                      className="bg-secondary/20 border-border rounded-xl min-h-[120px] text-xs font-medium focus:ring-primary leading-relaxed"
                      placeholder="ENTER CONSTRUCTIVE FEEDBACK..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => handleReview("approved")}
                      disabled={isLoading}
                      className="w-full h-14 rounded-full bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-transform"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isLoading ? "PROCESSING..." : "Approve Project"}
                    </Button>
                    <Button
                      onClick={() => handleReview("rejected")}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full h-14 rounded-full border-destructive/30 text-destructive hover:bg-destructive hover:text-white font-black uppercase text-[10px] tracking-widest"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      {isLoading ? "PROCESSING..." : "Reject Project"}
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-border/40">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">
                        Logged: {new Date(submission.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}