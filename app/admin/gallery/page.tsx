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
import { Upload, Image, Trash2, Edit, Search, Filter, Eye, Star } from "lucide-react"
import { format } from "date-fns"

const CATEGORIES = [
  "competition",
  "meeting",
  "workshop",
  "social",
  "chapter-life",
  "conference",
  "awards",
  "other",
] as const

type Category = (typeof CATEGORIES)[number]

interface GalleryImage {
  id: string
  title: string
  description: string | null
  category: string
  image_url: string
  image_filename: string
  image_size: number
  image_type: string
  uploaded_by: string
  event_date: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
  profiles: { full_name: string | null; email: string } | null
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [deleting, setDeleting] = useState<string | null>(null)

  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploadCategory, setUploadCategory] = useState<string>("chapter-life")
  const [uploadEventDate, setUploadEventDate] = useState("")
  const [uploadFeatured, setUploadFeatured] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/gallery?limit=100")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setImages(data.images || [])
    } catch (err) {
      setError("Failed to load gallery images")
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
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Allowed: JPEG, PNG, WebP, GIF")
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
      setError("Please fill all required fields and select an image")
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
      if (uploadEventDate) formData.append("eventDate", uploadEventDate)
      formData.append("isFeatured", uploadFeatured.toString())

      setUploadProgress(30)

      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(80)

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Upload failed")
      }

      const data = await response.json()
      setImages((prev) => [data.image, ...prev])
      setUploadProgress(100)

      // Reset form
      setUploadOpen(false)
      setUploadTitle("")
      setUploadDescription("")
      setUploadCategory("chapter-life")
      setUploadEventDate("")
      setUploadFeatured(false)
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
    if (!confirm("Delete this image permanently?")) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/gallery/upload?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Delete failed")
      }

      setImages((prev) => prev.filter((img) => img.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleFeatured = async (image: GalleryImage) => {
    try {
      const response = await fetch("/api/gallery/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: image.id, is_featured: !image.is_featured }),
      })

      if (!response.ok) throw new Error("Failed to update")

      setImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...img, is_featured: !img.is_featured } : img))
      )
    } catch (err) {
      setError("Failed to update featured status")
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

  const filteredImages = images.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || img.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading gallery...</p>
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
              Gallery <span className="text-primary not-italic">Management</span>
            </h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">
              // Upload, organize, and feature chapter photos
            </p>
          </div>
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white rounded-none px-8 h-12 font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20">
                <Upload className="mr-2 h-4 w-4" /> Add Images
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Upload Gallery Image</DialogTitle>
                <DialogDescription>Add a new photo to the chapter gallery</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g., State Competition 2025"
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
                    <Select
                      value={uploadCategory}
                      onValueChange={(value) => setUploadCategory(value as typeof uploadCategory)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="file">Image File * (Max 10MB)</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleFileChange}
                      required
                      className="bg-secondary/30 border-border"
                    />
                    {uploadPreview && (
                      <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-border">
                        <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="featured"
                      checked={uploadFeatured}
                      onCheckedChange={(checked) => setUploadFeatured(checked === true)}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium">
                      Feature on homepage
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
                    {uploading ? "Uploading..." : "Upload Image"}
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
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as string)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded">
            {error}
          </div>
        )}

        {filteredImages.length === 0 ? (
          <Card className="border-dashed border-border">
            <CardContent className="py-20 text-center">
              <Image className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">No Images Found</h3>
              <p className="text-muted-foreground">
                {images.length === 0
                  ? "Upload your first gallery image to get started"
                  : "Try adjusting your search or filter"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden border-border hover:shadow-xl transition-shadow group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {image.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-yellow-950" variant="default">
                        <Star className="mr-1 h-3 w-3" /> Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <Badge
                      variant="outline"
                      className="bg-background/90 backdrop-blur text-xs font-medium"
                    >
                      {image.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-lg uppercase tracking-tight flex-1 min-w-0">
                      {image.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFeatured(image)}
                        className={image.is_featured ? "text-yellow-500" : "text-muted-foreground"}
                        title={image.is_featured ? "Remove from featured" : "Mark as featured"}
                      >
                        <Star className={`h-4 w-4 ${image.is_featured ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(image.id)}
                        disabled={deleting === image.id}
                        className="text-destructive hover:bg-destructive/10"
                        title="Delete image"
                      >
                        {deleting === image.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {image.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{image.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-t border-border/50 pt-3">
                    <span className="flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      {formatFileSize(image.image_size)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                      {image.event_date ? format(new Date(image.event_date), "MMM d, yyyy") : "No date"}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full bg-muted-foreground" />
                      {image.profiles?.full_name || "Unknown"}
                    </span>
                    <span>{format(new Date(image.created_at), "MMM d, yyyy")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>Total: {images.length} images</span>
          <span>Filtered: {filteredImages.length} images</span>
          <span className="font-mono">
            Featured: {images.filter((i) => i.is_featured).length}
          </span>
        </div>
      </div>
    </div>
  )
}