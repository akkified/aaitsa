"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Upload, X, CheckCircle2, AlertCircle, ShieldCheck, Save, FileText } from "lucide-react"
import { createSubmission } from "@/app/actions/submissions"
import { updateSubmission } from "@/app/actions/submissions"
import { cn } from "@/lib/utils"

const TSA_CATEGORIES = [
  "Animatronics", "Architectural Design", "Audio Podcasting", "Biotechnology Design",
  "Board Game Design", "Chapter Team", "Children's Stories", "Coding",
  "CAD, Architecture", "CAD, Engineering", "Cybersecurity", "Data Science and Analytics",
  "Debating Technical Issues", "Digital Video Production", "Dragster Design",
  "Drone Challenge", "Engineering Design", "Extemporaneous Speech",
  "Fashion Design and Technology", "Flight Endurance", "Forensic Science",
  "Future Technology and Engineering Teacher", "Geospatial Technology",
  "Manufacturing Prototype", "Music Production", "On Demand Video",
  "Photographic Technology", "Prepared Presentation", "Promotional Design",
  "Robotics", "Senior Solar Sprint", "Software Development", "STEM Mass Media",
  "Structural Design and Engineering", "System Control Technology",
  "Technology Bowl", "Technology Problem Solving", "Transportation Modeling",
  "Video Game Design", "Virtual Reality Simulation (VR)", "Webmaster"
].sort()

interface FormData {
  title: string
  category: string
  description: string
  submissionGroup: string
  checkInDate: string
}

interface DraftData extends FormData {
  fileName?: string
  fileSize?: number
  fileType?: string
  savedAt: string
}

export default function SubmitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")

  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
    submissionGroup: "",
    checkInDate: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  // Load draft from localStorage on mount
  useEffect(() => {
    const loadDraft = () => {
      const draftKey = editId ? `submission-draft-${editId}` : "submission-draft"
      const saved = localStorage.getItem(draftKey)
      if (saved) {
        try {
          const draft: DraftData = JSON.parse(saved)
          setFormData({
            title: draft.title,
            category: draft.category,
            description: draft.description,
            submissionGroup: draft.submissionGroup,
            checkInDate: draft.checkInDate,
          })
          setDraftSaved(true)
        } catch (e) {
          console.error("Failed to parse draft:", e)
        }
      }
    }
    loadDraft()
  }, [editId])

  // Auto-save draft
  useEffect(() => {
    const draftKey = editId ? `submission-draft-${editId}` : "submission-draft"
    const timer = setTimeout(() => {
      const draft: DraftData = {
        ...formData,
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(draftKey, JSON.stringify(draft))
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 2000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [formData, file, editId])

  // Load user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router, supabase.auth])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("FILE SIZE EXCEEDS 10MB LIMIT")
      return
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/zip",
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("INVALID FILE TYPE. ALLOWED: PDF, DOC, DOCX, PPT, PPTX, ZIP")
      return
    }

    setFile(selectedFile)
    setError(null)

    // Upload to Vercel Blob
    try {
      setUploadProgress(20)
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("UPLOAD FAILED")

      const data = await response.json()
      setFileUrl(data.url)
      setUploadProgress(100)
    } catch (err) {
      setError("FILE UPLOAD ERROR. ATTEMPT RECOVERY.")
      setFile(null)
      setUploadProgress(0)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFileUrl(null)
    setUploadProgress(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("description", formData.description)
      if (formData.submissionGroup) formDataToSend.append("submissionGroup", formData.submissionGroup)
      if (formData.checkInDate) formDataToSend.append("checkInDate", formData.checkInDate)
      if (fileUrl) formDataToSend.append("fileUrl", fileUrl)

      let result
      if (editId) {
        formDataToSend.append("submissionId", editId)
        result = await updateSubmission(formDataToSend)
      } else {
        result = await createSubmission(formDataToSend)
      }

      if (result.error) throw new Error(result.error)

      // Clear draft on successful submission
      const draftKey = editId ? `submission-draft-${editId}` : "submission-draft"
      localStorage.removeItem(draftKey)

      router.push("/my")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "SUBMISSION PROTOCOL FAILURE")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = () => {
    const draftKey = editId ? `submission-draft-${editId}` : "submission-draft"
    const draft: DraftData = {
      ...formData,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(draftKey, JSON.stringify(draft))
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2000)
  }

  const handleDiscardDraft = () => {
    const draftKey = editId ? `submission-draft-${editId}` : "submission-draft"
    localStorage.removeItem(draftKey)
    setFormData({
      title: "",
      category: "",
      description: "",
      submissionGroup: "",
      checkInDate: "",
    })
    setFile(null)
    setFileUrl(null)
    setDraftSaved(false)
  }

  if (!user) return <div className="min-h-screen bg-background" />

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center">
          <Link
            href="/my"
            className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to Terminal
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground italic">
                Project Transmission Module
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-4 italic">
              Entry <span className="text-primary not-italic">Protocol.</span>
            </h1>
            <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest font-bold border-l-2 border-primary pl-4">
              {editId ? "// EDITING SUBMISSION FOR RE-REVIEW" : "// LOGGING NEW SUBMISSION FOR OFFICIAL CHAPTER REVIEW"}
            </p>
          </div>

          {/* Draft notification */}
          {draftSaved && (
            <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded-none text-sm text-primary font-mono uppercase tracking-wider flex items-center justify-between">
              <span>Draft auto-saved locally</span>
              <Button variant="ghost" size="sm" onClick={handleSaveDraft}>
                <Save className="h-3 w-3 mr-1" /> Save Now
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-border bg-card rounded-none overflow-hidden shadow-2xl">
              <CardHeader className="p-8 pb-4 bg-secondary/20 border-b border-border">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
                  01 // Metadata Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-[9px] font-black uppercase tracking-widest ml-1">
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    className="bg-secondary/30 border-border rounded-none h-14 focus:ring-0 focus:border-primary uppercase font-bold text-xs"
                    placeholder="E.G. AUTONOMOUS ROVER V1"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="category" className="text-[9px] font-black uppercase tracking-widest ml-1">
                    Competition Category
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                    <SelectTrigger className="bg-secondary/30 border-border rounded-none h-14 font-bold text-xs uppercase">
                      <SelectValue placeholder="SELECT CATEGORY" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border uppercase font-bold text-[10px] rounded-none">
                      {TSA_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="focus:bg-primary focus:text-white rounded-none">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-[9px] font-black uppercase tracking-widest ml-1">
                    Engineering Description
                  </Label>
                  <Textarea
                    id="description"
                    className="bg-secondary/30 border-border rounded-none min-h-[150px] focus:ring-0 focus:border-primary font-medium text-sm leading-relaxed"
                    placeholder="Detail your methodology, software stack, or engineering principles..."
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card rounded-none overflow-hidden shadow-2xl">
              <CardHeader className="p-8 pb-4 bg-secondary/20 border-b border-border">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
                  02 // Assets & Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="submissionGroup" className="text-[9px] font-black uppercase tracking-widest ml-1">
                      Group Identifier
                    </Label>
                    <Input
                      id="submissionGroup"
                      className="bg-secondary/30 border-border rounded-none h-14 uppercase font-bold text-xs"
                      placeholder="SPRING 2026"
                      value={formData.submissionGroup}
                      onChange={(e) => setFormData({ ...formData, submissionGroup: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="checkInDate" className="text-[9px] font-black uppercase tracking-widest ml-1">
                      Check-in Date
                    </Label>
                    <Input
                      id="checkInDate"
                      type="date"
                      className="bg-secondary/30 border-border rounded-none h-14 font-bold text-xs uppercase"
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest ml-1">
                    Upload PDF/ZIP Documentation (MAX 10MB)
                  </Label>
                  <div className={cn(
                    "relative border-2 border-dashed rounded-none p-12 transition-all duration-300 flex flex-col items-center justify-center min-h-[180px]",
                    file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-secondary/10"
                  )}>
                    {!file ? (
                      <>
                        <input
                          id="file-upload"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                        />
                        <div className="flex flex-col items-center justify-center pointer-events-none z-10">
                          <FileText className="h-10 w-10 text-primary mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Click to initialize upload
                          </p>
                          <p className="text-[8px] text-muted-foreground/60 mt-2 uppercase font-mono tracking-tighter">
                            System accepts: .PDF .ZIP .DOCX .PPTX
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full space-y-4 relative z-30">
                        <div className="flex items-center justify-between p-5 bg-card border border-border">
                          <div className="flex items-center gap-4">
                            <div className="bg-primary p-2">
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[10px] font-black uppercase tracking-tight truncate max-w-[150px] md:max-w-[300px] italic">{file.name}</p>
                              <p className="text-[8px] font-mono text-muted-foreground uppercase">Payload: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} className="hover:bg-destructive/10 hover:text-destructive shrink-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="w-full bg-secondary h-1 rounded-none overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${uploadProgress}%` }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="flex items-center gap-3 p-5 bg-destructive text-white rounded-none text-[10px] font-black uppercase tracking-widest italic animate-pulse">
                <AlertCircle className="h-4 w-4" />
                Error: {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1 h-16 rounded-none bg-primary text-white font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all shadow-xl shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? "PROCESSSING TRANSMISSION..." : editId ? "UPDATE SUBMISSION" : "EXECUTE FINAL SUBMISSION"}
              </Button>
              <Button type="button" variant="outline" asChild className="h-16 px-12 rounded-none font-black uppercase tracking-widest text-[10px] italic border-border">
                <Link href="/my">Abort Mission</Link>
              </Button>
              {!editId && (
                <Button type="button" variant="outline" onClick={handleDiscardDraft} className="h-16 px-12 rounded-none font-black uppercase tracking-widest text-[10px] italic border-destructive/50 text-destructive hover:bg-destructive hover:text-white">
                  Discard Draft
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}