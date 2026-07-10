"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Search,
  Mail,
  Download,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"

interface Subscriber {
  id: string
  email: string
  name: string | null
  status: "active" | "unsubscribed" | "bounced"
  source: string
  subscribed_at: string | null
  unsubscribed_at: string | null
  confirmed_at: string | null
  created_at: string
  updated_at: string
}

const MailIcon = Mail

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const ITEMS_PER_PAGE = 25

  useEffect(() => {
    fetchSubscribers()
  }, [currentPage, statusFilter, sourceFilter])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      setError("")

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      })

      if (statusFilter !== "all") params.set("status", statusFilter)
      if (sourceFilter !== "all") params.set("source", sourceFilter)
      if (searchTerm) params.set("search", searchTerm)

      const response = await fetch(`/api/admin/newsletter?${params}`)
      if (!response.ok) throw new Error("Failed to fetch subscribers")

      const data = await response.json()
      setSubscribers(data.subscribers || [])
      setTotalCount(data.total || 0)
      setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE))
    } catch (err) {
      setError("Failed to load subscribers")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this subscriber?")) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/newsletter?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      setSubscribers((prev) => prev.filter((s) => s.id !== id))
      setTotalCount((prev) => prev - 1)
    } catch (err) {
      setError("Failed to delete subscriber")
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/admin/newsletter/export")
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError("Failed to export")
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  const handleStatusChange = async (subscriber: Subscriber, newStatus: Subscriber["status"]) => {
    try {
      const response = await fetch("/api/admin/newsletter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: subscriber.id, status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update")

      setSubscribers((prev) =>
        prev.map((s) => (s.id === subscriber.id ? { ...s, status: newStatus } : s))
      )
    } catch (err) {
      setError("Failed to update status")
      console.error(err)
    }
  }

  const getStatusBadge = (status: Subscriber["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-green-950">Active</Badge>
      case "unsubscribed":
        return <Badge variant="outline" className="text-destructive border-destructive">Unsubscribed</Badge>
      case "bounced":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Bounced</Badge>
    }
  }

  const formatSource = (source: string) =>
    source
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading subscribers...</p>
        </div>
      </div>
    )
  }

  const activeCount = subscribers.filter((s) => s.status === "active").length
  const unsubscribedCount = subscribers.filter((s) => s.status === "unsubscribed").length
  const bouncedCount = subscribers.filter((s) => s.status === "bounced").length

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              Newsletter <span className="text-primary not-italic">Subscribers</span>
            </h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">
              // Manage chapter email list
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
              className="rounded-full uppercase text-xs font-black tracking-widest px-6"
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button
              onClick={fetchSubscribers}
              disabled={loading}
              className="rounded-full uppercase text-xs font-black tracking-widest px-6 bg-primary text-white shadow-lg shadow-primary/20"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Subscribers</p>
                  <p className="text-3xl font-black">{totalCount}</p>
                </div>
                <MailIcon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-3xl font-black text-green-600">{activeCount}</p>
                </div>
                <MailIcon className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unsubscribed</p>
                  <p className="text-3xl font-black text-destructive">{unsubscribedCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bounced</p>
                  <p className="text-3xl font-black text-yellow-600">{bouncedCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-border bg-card">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sourceFilter}
                onValueChange={(v) => {
                  setSourceFilter(v)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded">
            {error}
          </div>
        )}

        {/* Subscribers Table */}
        <Card className="border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-muted-foreground">Subscribed</th>
                  <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                      <MailIcon className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="font-medium">No subscribers found</p>
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-sm">{subscriber.email}</p>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                            {subscriber.status === "active" && subscriber.confirmed_at
                              ? `Confirmed ${format(new Date(subscriber.confirmed_at), "MMM d, yyyy")}`
                              : subscriber.status === "unsubscribed" && subscriber.unsubscribed_at
                                ? `Unsubscribed ${format(new Date(subscriber.unsubscribed_at), "MMM d, yyyy")}`
                                : `Added ${format(new Date(subscriber.created_at), "MMM d, yyyy")}`}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{subscriber.name || <span className="text-muted-foreground italic">—</span>}</p>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(subscriber.status)}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-xs font-medium bg-background">
                          {formatSource(subscriber.source)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {format(new Date(subscriber.subscribed_at || subscriber.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {subscriber.status === "active" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleStatusChange(subscriber, "unsubscribed")}
                              title="Mark as unsubscribed"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {subscriber.status !== "active" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:bg-green-600/10"
                              onClick={() => handleStatusChange(subscriber, "active")}
                              title="Reactivate"
                            >
                              <MailIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(subscriber.id)}
                            disabled={deleting === subscriber.id}
                            title="Delete permanently"
                          >
                            {deleting === subscriber.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {totalCount} total
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}