import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, FileText, Download, User, CheckCircle, XCircle, MessageSquare } from "lucide-react"

interface AdminSubmissionPageProps {
  params: {
    id: string
  }
}

export default function AdminSubmissionPage({ params }: AdminSubmissionPageProps) {
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
      student: {
        name: "John Doe",
        email: "john.doe@student.edu",
        school: "Lincoln High School",
        grade: "12th",
      },
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
      student: {
        name: "Jane Smith",
        email: "jane.smith@student.edu",
        school: "Roosevelt High School",
        grade: "11th",
      },
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
              <Link href="/admin">Return to Admin Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <h1 className="text-xl font-semibold">Review Submission</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{submission.title}</CardTitle>
                    <CardDescription className="mt-2">{submission.description}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(submission.status)} border`}>
                    <span className="capitalize">{submission.status}</span>
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
                <CardDescription>Documents and files to review</CardDescription>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Student Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-muted-foreground">Name:</span>
                  <p>{submission.student.name}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <p className="text-sm">{submission.student.email}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">School:</span>
                  <p>{submission.student.school}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Grade:</span>
                  <p>{submission.student.grade}</p>
                </div>
              </CardContent>
            </Card>

            {/* Review Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Review & Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue={submission.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback</label>
                  <Textarea
                    placeholder="Provide feedback for the student..."
                    defaultValue={submission.feedback || ""}
                    rows={4}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
