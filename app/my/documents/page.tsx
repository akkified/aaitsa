"use client"

import DocumentList from "@/components/document-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"

export default function MyDocuments() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/my"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Submissions</h1>
            <p className="text-muted-foreground">View and manage your TSA competition entries</p>
          </div>

          <Button asChild className="bg-primary text-white">
            <Link href="/my/submit">
              <Plus className="h-4 w-4 mr-2" /> New Submission
            </Link>
          </Button>
        </div>

        <DocumentList />
      </div>
    </div>
  )
}