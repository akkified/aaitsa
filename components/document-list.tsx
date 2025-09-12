"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, Eye } from "lucide-react"
import Link from "next/link"

interface Document {
  id: string
  title: string
  description: string
  fileName: string
  fileSize: number
  submittedAt: string
  status: string
  category: string
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDocuments = () => {
      try {
        const storedDocs = localStorage.getItem("submissions")
        let docs: Document[] = []

        if (storedDocs) {
          docs = JSON.parse(storedDocs)
        } else {
          docs = [
            {
              id: "demo-1",
              title: "Robotics Competition Entry - Autonomous Navigation",
              description:
                "Our team's entry for the autonomous navigation challenge, featuring advanced sensor integration and machine learning algorithms.",
              fileName: "robotics-navigation-project.pdf",
              fileSize: 2456789,
              submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
              status: "approved",
              category: "competition",
            },
            {
              id: "demo-2",
              title: "Software Development Project Proposal",
              description:
                "Proposal for developing a mobile app to help students track their TSA competition progress and deadlines.",
              fileName: "mobile-app-proposal.docx",
              fileSize: 1234567,
              submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
              status: "under_review",
              category: "project",
            },
          ]
          localStorage.setItem("submissions", JSON.stringify(docs))
        }

        setDocuments(docs)
      } catch (err) {
        console.error("Error loading documents:", err)
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your documents...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Your Documents
        </CardTitle>
        <CardDescription>Documents you've submitted for review</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-4">Submit your first document to get started.</p>
            <Button asChild>
              <Link href="/documents">Submit Document</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <h3 className="font-semibold truncate">{document.title}</h3>
                    <Badge className={getStatusColor(document.status)}>{document.status.replace("_", " ")}</Badge>
                  </div>

                  {document.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{document.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(document.submittedAt)}
                    </span>
                    <span>Category: {document.category}</span>
                    <span>Size: {formatFileSize(document.fileSize)}</span>
                    <span>File: {document.fileName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" disabled>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>

                  <Button variant="outline" size="sm" disabled>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
