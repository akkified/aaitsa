"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Calendar,
  Search,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"

const CATEGORIES = [
  "all",
  "competition",
  "meeting",
  "workshop",
  "social",
  "chapter-life",
  "conference",
  "awards",
  "other",
] as const

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

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const params = new URLSearchParams({
        limit: "100",
      })
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      params.set("featured", "false")

      const response = await fetch(`/api/gallery?${params}`)
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

  useEffect(() => {
    fetchImages()
  }, [categoryFilter])

  const filteredImages = images.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const formatCategory = (cat: string) =>
    cat
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
        <div className="container px-6 relative z-10 mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase leading-none">
              Life at <br />
              <span className="text-primary italic">ALLIANCE TSA.</span>
            </h1>
            <p className="max-w-xl text-muted-foreground text-lg leading-relaxed border-l-4 border-primary pl-6 font-medium">
              A look behind the scenes at our meetings, competitions, workshops, and the daily grind that makes our chapter a community.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-6">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="SEARCH GALLERY..."
                className="pl-12 py-4 rounded-none bg-secondary/30 border-border focus:ring-primary uppercase font-bold text-xs tracking-[0.2em]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value as typeof categoryFilter)}
            >
              <SelectTrigger className="w-[200px] bg-secondary/30 border-border rounded-none uppercase font-bold text-[10px] tracking-[0.3em] py-4">
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

      {/* Masonry Grid */}
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
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border">
              <ImageIcon className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.2em]">
                {images.length === 0
                  ? "No images in gallery yet. Check back soon!"
                  : "No images match your search. Try a different filter."}
              </p>
            </div>
          ) : (
            <div
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4"
              style={{
                columnWidth: "300px",
              }}
            >
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="break-inside-avoid mb-4 relative group cursor-pointer"
                  onClick={() => {
                    setLightboxIndex(index)
                    setLightboxOpen(true)
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] border border-border bg-muted">
                    <Image
                      src={image.image_url}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <div className="absolute bottom-3 left-3">
                      <Badge
                        variant="outline"
                        className="bg-background/90 backdrop-blur text-xs font-medium uppercase tracking-wider"
                      >
                        {formatCategory(image.category)}
                      </Badge>
                    </div>

                    {/* Featured badge */}
                    {image.is_featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-yellow-500 text-yellow-950" variant="default">
                          <Heart className="mr-1 h-3 w-3 fill-current" /> Featured
                        </Badge>
                      </div>
                    )}

                    {/* View icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ExternalLink className="h-8 w-8 text-white/90 bg-black/30 backdrop-blur-sm rounded-full p-1" />
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-primary font-bold tracking-tighter uppercase">
                      <Calendar className="h-3 w-3" />
                      {image.event_date ? format(new Date(image.event_date), "MMM d, yyyy") : "Date TBD"}
                    </div>
                    <h3 className="font-black text-xl uppercase tracking-tight group-hover:text-primary transition-colors">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm">
                        {image.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-t border-border/50 pt-3">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {image.profiles?.full_name || "Unknown"}
                      </span>
                      <span>{format(new Date(image.created_at), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/10 border-t border-border">
        <div className="container px-6 mx-auto">
          <div className="bg-card border border-border p-12 md:p-24 text-center relative overflow-hidden">
            <h2 className="text-5xl md:text-7xl font-black text-foreground mb-8 relative z-10 tracking-tighter uppercase italic">
              Want to Share Photos?
            </h2>
            <p className="text-muted-foreground mb-12 max-w-lg mx-auto relative z-10 font-mono text-sm uppercase tracking-tight">
              Have great shots from a TSA event? Reach out to an officer to get them added to the gallery.
            </p>
            <Link href="/about">
              <Button className="rounded-none bg-primary text-white uppercase text-[11px] font-black tracking-[0.2em] px-12 h-16 shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all">
                Meet the Officers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && filteredImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(false)
            }}
            aria-label="Close"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            className="absolute left-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1))
            }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-10 w-10 rotate-180" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full mx-4">
            <Image
              src={filteredImages[lightboxIndex].image_url}
              alt={filteredImages[lightboxIndex].title}
              width={1200}
              height={900}
              className="object-contain rounded-lg"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                {filteredImages[lightboxIndex].title}
              </h3>
              <p className="text-white/80 text-sm mb-4">{filteredImages[lightboxIndex].description || ""}</p>
              <div className="flex items-center gap-4 text-white/60 text-xs font-mono uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {filteredImages[lightboxIndex].event_date
                    ? format(new Date(filteredImages[lightboxIndex].event_date!), "MMM d, yyyy")
                    : "Date TBD"}
                </span>
                <span className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {formatCategory(filteredImages[lightboxIndex].category)}
                </span>
              </div>
            </div>
          </div>

          <button
            className="absolute right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1))
            }}
            aria-label="Next"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {filteredImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(i)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === lightboxIndex ? "bg-white" : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}