"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, Home } from "lucide-react"

export default function SubmissionSuccess() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Document Submitted Successfully!</CardTitle>
            <CardDescription>Your document has been uploaded and is now under review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                You will receive an email notification once your document has been reviewed. You can also check the
                status in your dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Another Document
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/my">View My Documents</Link>
              </Button>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
