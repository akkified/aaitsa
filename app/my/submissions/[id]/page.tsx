import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, FileText, Download, Clock, CheckCircle, XCircle } from "lucide-react"

interface SubmissionPageProps {
  params: {
    id: string
  }
}

export default function SubmissionPage({ params }: SubmissionPageProps) {
  // Mock submission data based on ID
  const mockSubmissions: Record<string, any> = {
    "1": {
      id: "1",
      title: "Biotechnology Design Portfolio",
      description:
        "Complete portfolio showcasing biotechnology innovation project including research, design process, and final prototype documentation.",
      category: "Biotechnology Design",
      status: "pending",
      submitted_at: "2024-01-15T10:00:00Z",
      feedback: null,
      files: [
        { name: "biotech-portfolio.pdf", size: "2.4 MB", type: "application/pdf" },
        { name: "prototype-images.zip", size: "15.7 MB", type: "application/zip" },
      ],
    },
    "2": {
      id: "2",
      title: "Engineering Design Process Documentation",
      description:
        "Step-by-step documentation of engineering design methodology applied to sustainable energy solutions.",
      category: "Engineering Design",
      status: "approved",
      submitted_at: "2024-01-10T14:30:00Z",
      feedback:
        "Excellent work! Great attention to detail in the design process. The sustainable energy focus shows innovative thinking.",
      files: [
        { name: "engineering-design-doc.pdf", size: "3.1 MB", type: "application/pdf" },
        { name: "calculations.xlsx", size: "890 KB", type: "application/vnd.ms-excel" },
      ],
    },
  }

  const submission = mockSubmissions[params.id]

  if (!submission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Submission Not Found</h2>
            <p className="text-muted-foreground mb-4">The submission you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/my">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/my">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Submission Details</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Submission Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{submission.title}</CardTitle>
                  <CardDescription className="mt-2">{submission.description}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(submission.status)} border`}>
                  <span className="flex items-center space-x-1">
                    {getStatusIcon(submission.status)}
                    <span className="capitalize">{submission.status}</span>
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Category:</span>
                  <p>{submission.category}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Submitted:</span>
                  <p>{new Date(submission.submitted_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Files */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Files</CardTitle>
              <CardDescription>Documents and files included with this submission</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submission.files.map((file: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          {submission.feedback && (
            <Card>
              <CardHeader>
                <CardTitle>Feedback</CardTitle>
                <CardDescription>Comments from the review team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p>{submission.feedback}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
