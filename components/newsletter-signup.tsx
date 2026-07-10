"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }

      setStatus("success")
      setMessage(data.message || "Successfully subscribed!")
      setEmail("")
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-0 max-w-2xl mx-auto relative z-10">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="STUDENT_ID@FORSYTH.K12.GA.US"
        className="flex-1 bg-secondary/50 border border-border px-8 py-5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        disabled={status === "loading" || status === "success"}
        required
      />
      <Button
        type="submit"
        className="bg-primary text-white rounded-none px-12 h-auto text-xs font-black tracking-[0.2em] uppercase transition-all hover:bg-blue-700 disabled:opacity-50"
        disabled={status === "loading" || status === "success"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            SUBSCRIBING...
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            SUBSCRIBED
          </>
        ) : (
          "SUBMIT_APPLICATION"
        )}
      </Button>
      {message && (
        <div
          className={`absolute -bottom-10 left-0 right-0 text-center text-sm font-mono uppercase tracking-wider ${
            status === "error" ? "text-destructive" : "text-primary"
          }`}
        >
          {status === "error" ? (
            <>
              <AlertCircle className="inline mr-1 h-3 w-3" />
              {message}
            </>
          ) : (
            <>
              <CheckCircle className="inline mr-1 h-3 w-3" />
              {message}
            </>
          )}
        </div>
      )}
    </form>
  )
}