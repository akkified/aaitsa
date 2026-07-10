"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  Calendar,
  User,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"

const CATEGORIES = [
  "all",
  "competition-rules",
  "competition-rubrics",
  "project-templates",
  "guides",
  "forms",
  "presentations",
  "other",
] as const

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

const FILE_ICONS: Record<string, React.ReactNode> = {
  "application/pdf": <FileText className="h-5 w-5 text-red-500" />,
  "application/msword": <FileText className="h-5 w-5 text-blue-500" />,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": <FileText className="h-5 w-5 text-blue-500" />,
  "application/vnd.ms-powerpoint": <FileText className="h-5 w-5 text-orange-500" />,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": <FileText className="h-5 w-5 text-orange-500" />,
  "application/vnd.ms-excel": <FileText className="h-5 w-5 text-green-500" />,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": <FileText className="h-5 w-5 text-green-500" />,
  "text/plain": <FileText className="h-5 w-5 text-gray-500" />,
  "application/zip": <FileText className="h-5 w-5 text-purple-500" />,
  "application/x-zip-compressed": <FileText className="h-5 w-5 text-purple-500" />,
}

const getFileIcon = (type: string) => FILE_ICONS[type] || <FileText className="h-5 w-5 text-muted-foreground" />

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

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    setMounted(true)
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams({
        public: "true",
        limit: "100",
      })
      if (categoryFilter !== "all") params.set("category", categoryFilter)

      const response = await fetch(`/api/resources?${params}`)
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

  useEffect(() => {
    if (mounted) fetchResources()
  }, [categoryFilter, mounted])

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.event_name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleDownload = async (resource: Resource) => {
    // Increment download count
    try {
      await fetch("/api/resources/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resource.id, download_count: resource.download_count + 1 }),
      })
    } catch (err) {
      console.error("Failed to increment download count:", err)
    }

    // Trigger download
    const link = document.createElement("a")
    link.href = resource.file_url
    link.download = resource.file_filename
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="container px-6 relative z-10 mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6 text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase">Verified Registry // HS Division</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase leading-none">
              Technical <br />
              <span className="text-primary italic">Protocols.</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground text-sm md:text-base leading-relaxed border-l-2 border-primary pl-6 font-mono uppercase tracking-tight">
              Select a resource card to download official TSA competition rubrics, rules, templates, and guides.
              All files are distributed in standard formats for chapter-wide standardization.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-6">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="FILTER RESOURCES..."
                className="pl-12 py-4 rounded-none bg-secondary/30 border-border focus:ring-primary uppercase font-bold text-xs tracking-[0.2em]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value as string)}
            >
              <SelectTrigger className="w-[240px] bg-secondary/30 border-border rounded-none uppercase font-bold text-[10px] tracking-[0.3em] py-4">
                <SelectValue placeholder="ALL CATEGORIES" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border uppercase font-bold text-[10px] rounded-none">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "ALL CATEGORIES" : formatCategory(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="container px-6 mx-auto">
          {error && (
            <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border">
              <FileText className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.2em]">
                {resources.length === 0
                  ? "No resources available yet. Check back soon!"
                  : "No resources match your search. Try a different filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredResources.map((resource, i) => (
                <Card
                  key={resource.id}
                  className="group text-left p-6 bg-card border border-border rounded-none hover:border-primary transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 group-hover:text-primary transition-all">
                    <Download className="h-4 w-4" />
                  </div>

                  <div>
                    <div className="text-[9px] font-mono text-primary mb-2 opacity-50 uppercase tracking-widest">
                      Resource_{i.toString().padStart(2, "0")}
                    </div>
                    <h4 className="font-black text-xl uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors mb-4">
                      {resource.title}
                    </h4>
                  </div>

                  <div className="pt-6 border-t border-border/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getFileIcon(resource.file_type)}
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight leading-tight">
                          {formatCategory(resource.category)}
                        </span>
                      </div>
                      <Badge variant="outline" className="rounded-none border-primary/20 bg-primary/5 text-[8px] font-black text-primary px-2">
                        {formatFileSize(resource.file_size)}
                      </Badge>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Downloads:</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">{resource.download_count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest font-mono">Date:</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                          {format(new Date(resource.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    {resource.event_name && (
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-primary uppercase tracking-widest">
                        <Calendar className="h-3 w-3" />
                        {resource.event_name}
                        {resource.event_date && ` • ${format(new Date(resource.event_date), "MMM d, yyyy")}`}
                      </div>
                    )}
                  </div>

                  <Button
                    className="mt-6 w-full rounded-none bg-primary text-white uppercase text-[11px] font-black tracking-[0.2em] px-12 h-14 shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all"
                    onClick={() => handleDownload(resource)}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Resource
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Resource Links Footer */}
      <section className="py-20 bg-secondary/10 border-t border-border/40">
        <div className="container px-6 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <a href="https://tsaweb.org" target="_blank" className="p-10 bg-card border border-border rounded-none hover:border-primary transition-colors group">
            <FileText className="h-6 w-6 text-primary mb-6" />
            <h3 className="font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
              National Website <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed uppercase font-medium">
              Access the master repository for national high school standards.
            </p>
          </a>

          <a href="https://gatsa.org" target="_blank" className="p-10 bg-card border border-border rounded-none hover:border-primary transition-colors group">
            <FileText className="h-6 w-6 text-primary mb-6" />
            <h3 className="font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
              Georgia Website <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed uppercase font-medium">
              Georgia State Chapter logistics and competitive schedules.
            </p>
          </a>

          <Link href="/my" className="p-10 bg-primary text-primary-foreground rounded-none hover:bg-primary/90 transition-all flex flex-col justify-between">
            <div>
              <FileText className="h-6 w-6 mb-6" />
              <h3 className="font-black uppercase text-xs tracking-widest mb-3">Member Portal</h3>
              <p className="text-xs opacity-80 leading-relaxed uppercase font-medium">
                Authorized login for chapter competition management.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}