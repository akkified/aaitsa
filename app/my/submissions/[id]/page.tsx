"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, FileText, Clock, ShieldCheck, Download, AlertCircle, CheckCircle, XCircle, Activity, Edit } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ id: string }>
}

interface Submission {
  id: string
  title: string
  description: string
  category: string
  file_url: string | null
  status: "pending" | "approved" | "rejected"
  submitted_at: string
  reviewed_at: string | null
  feedback: string | null
  submission_group: string | null
  check_in_date: string | null
  user_id: string
}

export default function SubmissionPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const submissionId = resolvedParams.id

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)

    async function getSubmission() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", submissionId)
        .eq("user_id", user.id)
        .single()

      if (error || !data) {
        router.push("/my")
        return
      }

      setSubmission(data)
      setLoading(false)
    }

    getSubmission()
  }, [submissionId, router, supabase])

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return <CheckCircle className="h-4 w-4 text-primary" />
      case "rejected": return <XCircle className="h-4 w-4 text-destructive" />
      default: return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return "bg-primary/10 border-primary/20 text-primary"
      case "rejected": return "bg-destructive/10 border-destructive/20 text-destructive"
      default: return "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
    }
  }

  if (!mounted || loading) return <div className="min-h-screen bg-background" />

  if (!submission) return <div className="min-h-screen bg-background" /> // Redirect handled by useEffect

  const canEdit = ["pending", "rejected"].includes(submission.status)

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Navigation */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <Link
            href="/my"
            className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground italic">
              Project Archive // ID_{submissionId.slice(0, 8)}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-8">
            Project <span className="text-primary not-italic">Details.</span>
          </h1>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-10 bg-card border border-border rounded-none shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
                    {submission.title}
                  </h2>
                  <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">
                    Category: {submission.category}
                  </p>
                </div>
                <div className={cn("px-4 py-2 bg-secondary border border-border text-[10px] font-black uppercase tracking-widest italic", getStatusStyles(submission.status))}>
                  Status: {submission.status}
                </div>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="font-medium">{submission.description}</p>
              </div>

              <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Submitted:</span>
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                      {format(new Date(submission.submitted_at), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>

                  {submission.submission_group && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Group:</span>
                      <span className="text-[10px] font-bold uppercase tracking-tight">{submission.submission_group}</span>
                    </div>
                  )}

                  {submission.check_in_date && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Check-in:</span>
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {format(new Date(submission.check_in_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}

                  {submission.reviewed_at && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Reviewed:</span>
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {format(new Date(submission.reviewed_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>

                {submission.file_url && (
                  <div className="flex items-center gap-4 p-4 bg-secondary/30 border border-border rounded-none">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Attached File</p>
                      <p className="text-xs text-muted-foreground font-mono">Click to download</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" /> Download
                      </a>
                    </Button>
                  </div>
                )}

                {submission.feedback && (
                  <div className="mt-12 p-8 bg-primary/5 border-l-4 border-primary">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-primary mb-4 italic">
                      Officer Evaluation Notes:
                    </span>
                    <p className="text-sm italic font-medium">"{submission.feedback}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {canEdit && (
                <Button variant="outline" asChild className="flex-1 h-12 rounded-none font-black uppercase tracking-widest text-[10px] italic border-border">
                  <Link href={`/my/submit?edit=${submission.id}`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit Submission
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild className="flex-1 h-12 px-12 rounded-none font-black uppercase tracking-widest text-[10px] italic border-border">
                <Link href="/my">Return to Terminal</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}