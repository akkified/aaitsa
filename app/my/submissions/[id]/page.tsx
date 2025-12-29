"use client"

import * as React from "react" // Ensure React is imported
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, FileText, Clock, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// 1. Define the type for the props
interface PageProps {
  params: Promise<{ id: string }>
}

export default function SubmissionPage({ params }: PageProps) {
  // 2. Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params)
  const submissionId = resolvedParams.id

  const [submission, setSubmission] = useState<any>(null)
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
        .eq("id", submissionId) // Use the unwrapped ID
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

  if (!mounted || loading) return <div className="min-h-screen bg-background" />

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
                <div className="px-4 py-2 bg-secondary border border-border text-[10px] font-black uppercase tracking-widest italic">
                  Status: {submission.status}
                </div>
              </div>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="font-medium">{submission.description}</p>
              </div>

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
        </div>
      </main>
    </div>
  )
}