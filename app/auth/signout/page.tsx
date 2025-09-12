"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SignOutPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const signOut = async () => {
      try {
        console.log("[v0] Starting signout process")
        const supabase = createClient()
        console.log("[v0] Supabase client created successfully")

        const { error } = await supabase.auth.signOut()
        console.log("[v0] Signout completed", { error })

        if (error) {
          console.error("[v0] Error signing out:", error)
          setError(error.message)
          router.push("/auth/error")
        } else {
          console.log("[v0] Signout successful, redirecting to home")
          router.push("/")
        }
      } catch (err) {
        console.error("[v0] Unexpected error during signout:", err)
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        setTimeout(() => router.push("/"), 2000)
      }
    }

    signOut()
  }, [router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-red-600">Error signing out</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Signing out...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  )
}
