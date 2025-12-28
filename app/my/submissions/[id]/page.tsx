"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, FileText, Download, Clock, CheckCircle, XCircle, Terminal, Activity, History } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SubmissionPageProps {
  params: {
    id: string
  }
}

export default function SubmissionPage({ params }: SubmissionPageProps) {
  const [submission, setSubmission] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const getUserAndSubmission = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push("/auth/login")
          return
        }

        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (!error) setSubmission(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getUserAndSubmission()
  }, [params.id, router, supabase])

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Decrypting Data...</h2>
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="w-full max-w-md border-border bg-card rounded-[2rem] p-8 text-center">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Access Denied</h2>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-8">Submission ID not found in current sector.</p>
          <Button asChild className="rounded-full bg-primary text-white font-black uppercase text-[10px] tracking-widest px-8">
            <Link href="/my">Return to Dashboard</Link>
          </Button>
        </Card>
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
      {/* Terminal Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/my"
            className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Terminal Output
          </Link>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-50">Entry ID: {submission.id.slice(0, 8)}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          
          {/* Main Info Block */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-2">
              <Badge className={cn("px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]", getStatusStyles(submission.status))}>
                {submission.status}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                {submission.title}
              </h1>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                // Category: {submission.category}
              </p>
            </div>
            
            <div className="p-4 bg-secondary/30 border border-border rounded-2xl flex items-center gap-4">
               <History className="h-5 w-5 text-primary" />
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Logged On</p>
                  <p className="text-xs font-bold font-mono">{new Date(submission.submitted_at).toLocaleDateString()}</p>
               </div>
            </div>
          </div>

          <Card className="border-border bg-card rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-border/50 bg-secondary/10">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">Technical Brief</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                {submission.description}
              </p>
            </CardContent>
          </Card>

          {/* Files Sector */}
          <div className="space-y-4">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] ml-2 italic">Attached Assets</h3>
             <Card className="border-border bg-card rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-4">
                  {submission.file_url ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 border border-border rounded-3xl hover:border-primary/50 transition-colors group">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                           <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-tight">Documentation_Archive.zip</p>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase">External Source Node</p>
                        </div>
                      </div>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="rounded-full bg-primary text-white font-black uppercase text-[10px] tracking-widest px-8 group-hover:scale-105 transition-transform"
                        onClick={() => window.open(submission.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No Binary Assets Attached</p>
                    </div>
                  )}
                </CardContent>
             </Card>
          </div>

          {/* Feedback Sector */}
          {submission.feedback && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] ml-2 italic text-primary">Officer Feedback</h3>
              <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2.5rem] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-sm md:text-base font-bold leading-relaxed italic">
                    "{submission.feedback}"
                  </p>
                </div>
                <Terminal className="absolute right-[-20px] bottom-[-20px] h-32 w-32 text-primary opacity-[0.03]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}