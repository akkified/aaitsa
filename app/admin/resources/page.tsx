"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, FileText, Download, Trash2, Search, Filter, Eye, Calendar, User } from "lucide-react"
import { format } from "date-fns"

const CATEGORIES = [
  "competition-rules",
  "competition-rubrics",
  "project-templates",
  "guides",
  "forms",
  "presentations",
  "other",
] as const

type Category = (typeof CATEGORIES)[number]

interface Resource {
  id: string
  title: string
  description: string | null
  category: string
  file_url: string
  file_filename: string
  file_size: number
  file_type: string
  uploaded_by: string
  event_name: string | null
  event_date: string | null
  is_public: boolean
  download_count: number
  created_at: string
  updated_at: string
  profiles: { full_name: string | null; email: string } | null
}

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [deleting, setDeleting] = useState<string | null>(null)

  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploadCategory, setUploadCategory] = useState<Category>("guides")
  const [uploadEventName, setUploadEventName] = useState("")
  const [uploadEventDate, setUploadEventDate] = useState("")
  const [uploadPublic, setUploadPublic] = useState(true)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources?limit=100")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setResources(data.resources || [])
    } catch (err) {
      setError("Failed to load resources")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit")
        return
      }
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
      ]
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, TXT")
        return
      }
      setUploadFile(file)
      setUploadPreview(URL.createObjectURL(file))
      setError("")
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile || !uploadTitle || !uploadCategory) {
      setError("Please fill all required fields and select a file")
      return
    }

    setUploading(true)
    setUploadProgress(10)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", uploadFile)
      formData.append("title", uploadTitle)
      formData.append("description", uploadDescription)
      formData.append("category", uploadCategory)
      if (uploadEventName) formData.append("eventName", uploadEventName)
      if (uploadEventDate) formData.append("eventDate", uploadEventDate)
      formData.append("isPublic", uploadPublic.toString())

      setUploadProgress(30)

      const response = await fetch("/api/resources/upload", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(80)

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Upload failed")
      }

      const data = await response.json()
      setResources((prev) => [data.resource, ...prev])
      setUploadProgress(100)

      // Reset form
      setUploadOpen(false)
      setUploadTitle("")
      setUploadDescription("")
      setUploadCategory("guides")
      setUploadEventName("")
      setUploadEventDate("")
      setUploadPublic(true)
      setUploadFile(null)
      setUploadPreview(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      console.error(err)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 500)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource permanently?")) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/resources/upload?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Delete failed")
      }

      setResources((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const handleTogglePublic = async (resource: Resource) => {
    try {
      const response = await fetch("/api/resources/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resource.id, is_public: !resource.is_public }),
      })

      if (!response.ok) throw new Error("Failed to update")

      setResources((prev) =>
        prev.map((r) => (r.id === resource.id ? { ...r, is_public: !r.is_public } : r))
      )
    } catch (err) {
      setError("Failed to update visibility")
      console.error(err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatCategory = (cat: string) =>
    cat
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.event_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading resources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              Resources <span className="text-primary not-italic">Management</span>
            </h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">
              // Upload, organize, and manage chapter resources
            </p>
          </div>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white rounded-none px-8 h-12 font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20">
                <Upload className="mr-2 h-4 w-4" /> Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Upload Resource</DialogTitle>
                <DialogDescription>Add a new resource for chapter members</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g., Robotics Competition Rules 2025"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Optional description..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={uploadCategory} onValueChange={(v) => setUploadCategory(v as Category)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {formatCategory(cat)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      value={uploadEventName}
                      onChange={(e) => setUploadEventName(e.target.value)}
                      placeholder="e.g., State Leadership Conference"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={uploadEventDate}
                      onChange={(e) => setUploadEventDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">File * (Max 10MB)</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      onChange={handleFileChange}
                      required
                      className="bg-secondary/30 border-border"
                    />
                    {uploadPreview && (
                      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{uploadFile?.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(uploadFile?.size || 0)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="public"
                      checked={uploadPublic}
                      onCheckedChange={(checked) => setUploadPublic(checked === true)}
                    />
                    <Label htmlFor="public" className="text-sm font-medium">
                      Public (visible to all members)
                    </Label>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="w-full bg-secondary h-2 rounded overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded">
                      {error}
                    </div>
                  )}
                </div>
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading} className="bg-primary text-white">
                    {uploading ? "Uploading..." : "Upload Resource"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-border bg-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as string)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {formatCategory(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resources List */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded">
            {error}
          </div>
        )}

        {filteredResources.length === 0 ? (
          <Card className="border-dashed border-border">
            <CardContent className="py-20 text-center">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">No Resources Found</h3>
              <p className="text-muted-foreground">
                {resources.length === 0
                  ? "Upload your first resource to get started"
                  : "Try adjusting your search or filter"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-lg uppercase tracking-tight truncate">
                            {resource.title}
                          </h3>
                          {resource.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{resource.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs font-medium">
                              {formatCategory(resource.category)}
                            </Badge>
                            {resource.event_name && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {resource.event_name}
                                {resource.event_date && (
                                  <>
                                    <span>•</span>
                                    {format(new Date(resource.event_date), "MMM d, yyyy")}
                                  </>
                                )}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {resource.profiles?.full_name || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-xs">
                              {formatFileSize(resource.file_size)}
                            </span>
                            <span className="font-mono text-xs">{format(new Date(resource.created_at), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={resource.is_public ? "default" : "outline"}
                          className={resource.is_public ? "bg-green-500 text-green-950" : ""}
                          onClick={() => handleTogglePublic(resource)}
                          style={{ cursor: "pointer" }}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          {resource.is_public ? "Public" : "Private"}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium">
                          {resource.download_count} downloads
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Download"
                        >
                          <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(resource.id)}
                          disabled={deleting === resource.id}
                          className="text-destructive hover:bg-destructive/10"
                          title="Delete"
                        >
                          {deleting === resource.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>Total: {resources.length} resources</span>
          <span>Filtered: {filteredResources.length} resources</span>
          <span className="font-mono">Public: {resources.filter((r) => r.is_public).length}</span>
        </div>
      </div>
    </div>
  )
}