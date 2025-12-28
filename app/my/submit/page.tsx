"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Upload, X, CheckCircle2, AlertCircle } from "lucide-react"
import { createSubmission } from "@/app/actions/submissions"
import { cn } from "@/lib/utils"

// Updated to match your specific Resources list
const TSA_CATEGORIES = [
  "Animatronics", "Architectural Design", "Audio Podcasting", "Biotechnology Design", 
  "Board Game Design", "Chapter Team", "Children’s Stories", "Coding", 
  "CAD, Architecture", "CAD, Engineering", "Cybersecurity", "Data Science and Analytics", 
  "Debating Technical Issues", "Digital Video Production", "Dragster Design", 
  "Drone Challenge", "Engineering Design", "Extemporaneous Speech", 
  "Fashion Design and Technology", "Flight Endurance", "Forensic Science", 
  "Future Technology and Engineering Teacher", "Geospatial Technology", 
  "Manufacturing Prototype", "Music Production", "On Demand Video", 
  "Photographic Technology", "Prepared Presentation", "Promotional Design", 
  "Robotics", "Senior Solar Sprint", "Software Development", "Stem Mass Media", 
  "Structural Design and Engineering", "System Control Technology", 
  "Technology Bowl", "Technology Problem Solving", "Transportation Modeling", 
  "Video Game Design", "Virtual Reality Simulation (VR)", "Webmaster"
].sort()

export default function SubmitPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [submissionGroup, setSubmissionGroup] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const router = useRouter()
  const supabase = createClient()

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

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("FILE SIZE EXCEEDS 10MB LIMIT")
      return
    }

    setFile(selectedFile)
    setError(null)

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
    } catch (error) {
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
      const formData = new FormData()
      formData.append("title", title)
      formData.append("category", category)
      formData.append("description", description)
      if (submissionGroup) formData.append("submissionGroup", submissionGroup)
      if (checkInDate) formData.append("checkInDate", checkInDate)
      if (fileUrl) formData.append("fileUrl", fileUrl)

      const result = await createSubmission(formData)
      if (result.error) throw new Error(result.error)

      router.push("/my")
    } catch (error: any) {
      setError(error.message || "SUBMISSION PROTOCOL FAILURE")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return <div className="min-h-screen bg-background" />

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* Navigation Header */}
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
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-4">
              Project <span className="text-primary italic">Entry.</span>
            </h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest border-l-2 border-primary pl-4">
              // LOGGING NEW SUBMISSION FOR OFFICIAL REVIEW
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary">Core Metadata</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest ml-1">Project Title</Label>
                  <Input
                    id="title"
                    className="bg-secondary/30 border-border rounded-xl h-12 focus:ring-primary uppercase font-bold text-xs"
                    placeholder="E.G. AUTONOMOUS ROVER V1"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest ml-1">Competition Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="bg-secondary/30 border-border rounded-xl h-12 font-bold text-xs uppercase">
                      <SelectValue placeholder="SELECT CATEGORY" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border uppercase font-bold text-[10px]">
                      {TSA_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="focus:bg-primary focus:text-white">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest ml-1">Documentation / Description</Label>
                  <Textarea
                    id="description"
                    className="bg-secondary/30 border-border rounded-2xl min-h-[150px] focus:ring-primary font-medium text-sm leading-relaxed"
                    placeholder="Detail your methodology, software stack, or engineering principles..."
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary">Assets & Scheduling</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="submissionGroup" className="text-[10px] font-black uppercase tracking-widest ml-1">Group (Optional)</Label>
                    <Input
                      id="submissionGroup"
                      className="bg-secondary/30 border-border rounded-xl h-12 uppercase font-bold text-xs"
                      placeholder="SPRING 2026"
                      value={submissionGroup}
                      onChange={(e) => setSubmissionGroup(e.target.value)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="checkInDate" className="text-[10px] font-black uppercase tracking-widest ml-1">Check-in Date</Label>
                    <Input
                      id="checkInDate"
                      type="date"
                      className="bg-secondary/30 border-border rounded-xl h-12 font-bold text-xs uppercase invert-calendar-icon"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Technical Documentation (MAX 10MB)</Label>
                  <div className={cn(
                    "relative border-2 border-dashed rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center",
                    file ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 bg-secondary/10"
                  )}>
                    {!file ? (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-4 group-hover:text-primary" />
                        <Input
                          id="file"
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                        />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Click to Upload Documentation</p>
                        <p className="text-[9px] text-muted-foreground mt-2 uppercase">PDF, ZIP, PPTX supported</p>
                      </>
                    ) : (
                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-between p-4 bg-background border border-border rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/20 p-2 rounded-lg">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-tight truncate max-w-[200px]">{file.name}</p>
                              <p className="text-[10px] font-mono text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} className="hover:bg-destructive/10 hover:text-destructive">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
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
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-xs font-bold uppercase tracking-widest">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 h-16 rounded-full bg-primary text-white font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-xl shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? "INITIALIZING SUBMISSION..." : "Finalize Project Submission"}
              </Button>
              <Button type="button" variant="outline" asChild className="h-16 px-10 rounded-full font-black uppercase tracking-widest text-[10px]">
                <Link href="/my">Abort</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}