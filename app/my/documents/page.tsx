import DocumentList from "@/components/document-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"

export default function MyDocuments() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
            <p className="text-gray-600">View and manage your submitted documents</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/my">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>

            <Button asChild>
              <Link href="/documents">
                <Plus className="h-4 w-4 mr-2" />
                Submit New Document
              </Link>
            </Button>
          </div>
        </div>

        <DocumentList />
      </div>
    </div>
  )
}
