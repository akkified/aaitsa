import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock documents data for demo purposes
    const mockDocuments = [
      {
        id: "1",
        title: "Sample Document 1",
        description: "This is a sample document",
        file_name: "sample1.pdf",
        file_url: "/document-stack.png",
        file_size: 1024000,
        file_type: "application/pdf",
        submitted_at: new Date().toISOString(),
        status: "approved",
        category: "competition",
        submitted_by: "user1",
      },
      {
        id: "2",
        title: "Sample Document 2",
        description: "Another sample document",
        file_name: "sample2.docx",
        file_url: "/document-stack.png",
        file_size: 2048000,
        file_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        submitted_at: new Date().toISOString(),
        status: "pending",
        category: "project",
        submitted_by: "user1",
      },
    ]

    return NextResponse.json({ documents: mockDocuments })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const mockDocument = {
      id,
      status,
      title: "Updated Document",
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, document: mockDocument })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
