"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { 
  Users, Search, BookOpen, Trophy, ExternalLink, Download, ShieldCheck, FileText 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function ResourcesPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => setMounted(true), [])

  const allCompetitions = [
    { name: "Animatronics", participants: "1 Team of 2-6" },
    { name: "Architectural Design", participants: "Individual OR 1 Team of 1-6" },
    { name: "Audio Podcasting", participants: "Individual OR 1 Team of 1-6" },
    { name: "Biotechnology Design", participants: "1 Team of 2-6" },
    { name: "Board Game Design", participants: "1 Team of 2-6" },
    { name: "Children’s Stories", participants: "1 Team of 1-6 OR 1 Individual" },
    { name: "Coding", participants: "1 Team of 2" },
    { name: "Computer-Aided Design (CAD), Architecture", participants: "1 Individual" },
    { name: "Computer-Aided Design (CAD), Engineering", participants: "1 Individual" },
    { name: "Cybersecurity", participants: "1 Team of 10" },
    { name: "Data Science and Analytics", participants: "1 Team of 1-2 OR 1 Individual" },
    { name: "Debating Technical Issues", participants: "1 Team of 2" },
    { name: "Digital Video Production", participants: "1 Team of 1-3 OR 1 Individual" },
    { name: "Dragster Design", participants: "2 Individuals" },
    { name: "Drone Challenge", participants: "1 Team of 2-6" },
    { name: "Engineering Design", participants: "1 Team of 3-6" },
    { name: "Extemporaneous Speech", participants: "1 Individual" },
    { name: "Fashion Design and Technology", participants: "1 Team of 2-4" },
    { name: "Flight Endurance", participants: "2 Individuals" },
    { name: "Forensic Science", participants: "1 Team of 2" },
    { name: "Future Technology and Engineering Teacher", participants: "2 Individuals" },
    { name: "Geospatial Technology", participants: "1 Team of 2-3" },
    { name: "Manufacturing Prototype", participants: "1 Team of 2-6" },
    { name: "Music Production", participants: "1 Team 1-6" },
    { name: "On Demand Video", participants: "1 Team 2-6" },
    { name: "Photographic Technology", participants: "1 Individual" },
    { name: "Prepared Presentation", participants: "1 Individual" },
    { name: "Promotional Design", participants: "1 Individual" },
    { name: "Robotics", participants: "1 Team of 2-6" },
    { name: "Senior Solar Sprint", participants: "2 Teams of 2-4" },
    { name: "Software Development", participants: "1 Team 2-6" },
    { name: "Stem Mass Media", participants: "1 Team of 2-3" },
    { name: "Structural Design and Engineering", participants: "1 Team of 2" },
    { name: "System Control Technology", participants: "1 Teams of 3" },
    { name: "Technology Bowl", participants: "1 Team of 3" },
    { name: "Technology Problem Solving", participants: "1 Team of 2" },
    { name: "Transportation Modeling", participants: "2 Individuals" },
    { name: "Video Game Design", participants: "1 Team of 2-6" },
    { name: "Virtual Reality Simulation (VR)", participants: "1 Team of 1-6" },
    { name: "Webmaster", participants: "1 Team 2-6" },
  ]

  const filteredCompetitions = allCompetitions.filter(comp => 
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 overflow-hidden border-b border-border/40 bg-secondary/5">
        <div className="container px-6 relative z-10 mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase">Verified Registry // HS Division</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase leading-none">
            Technical <br />
            <span className="text-primary italic">Protocols.</span>
          </h1>
          <p className="max-w-2xl text-muted-foreground text-sm md:text-base leading-relaxed border-l-2 border-primary pl-6 font-mono uppercase tracking-tight">
            Select an event card to initialize the download of official TSA competitive rubrics and guidelines. All files are distributed in PDF format for chapter-wide standardization.
          </p>
        </div>
      </section>

      {/* Search Bar / Instruction */}
      <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-8">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
             <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="FILTER BY COMPETITION..." 
                  className="pl-12 py-6 rounded-none bg-secondary/30 border-border focus:ring-primary uppercase font-bold text-xs tracking-[0.2em]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-3 text-primary animate-pulse">
                <Download className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Click Entry to Download Rubric</span>
             </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCompetitions.map((comp, i) => (
              <button 
                key={i} 
                onClick={() => {
                  // Logic for actual download would go here
                  console.log(`Downloading rubric for: ${comp.name}`)
                }}
                className="group text-left p-8 bg-card border border-border rounded-none hover:border-primary transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 group-hover:text-primary transition-all">
                    <Download className="w-4 h-4" />
                </div>
                
                <div>
                  <div className="text-[9px] font-mono text-primary mb-2 opacity-50 uppercase tracking-widest">Event_Ref_{i.toString().padStart(2, '0')}</div>
                  <h4 className="font-black text-xl uppercase tracking-tighter leading-tight group-hover:text-primary transition-colors mb-6">
                    {comp.name}
                  </h4>
                </div>

                <div className="pt-6 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight leading-tight">
                            {comp.participants}
                        </span>
                    </div>
                    <Badge variant="outline" className="rounded-none border-primary/20 bg-primary/5 text-[8px] font-black text-primary px-2">
                        PDF PROTOCOL
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredCompetitions.length === 0 && (
            <div className="text-center py-24 border border-dashed border-border">
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.2em]">Query returned zero results in the national registry.</p>
            </div>
          )}
        </div>
      </section>

      {/* Resource Footer */}
      <section className="py-20 bg-secondary/10 border-t border-border/40">
        <div className="container px-6 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <a href="https://tsaweb.org" target="_blank" className="p-10 bg-card border border-border rounded-none hover:border-primary transition-colors group">
            <BookOpen className="w-6 h-6 text-primary mb-6" />
            <h3 className="font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
              National Website <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed uppercase font-medium">Access the master repository for national high school standards.</p>
          </a>

          <a href="https://gatsa.org" target="_blank" className="p-10 bg-card border border-border rounded-none hover:border-primary transition-colors group">
            <Trophy className="w-6 h-6 text-primary mb-6" />
            <h3 className="font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
              Georgia Website <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed uppercase font-medium">Georgia State Chapter logistics and competitive schedules.</p>
          </a>

          <Link href="/my" className="p-10 bg-primary text-primary-foreground rounded-none hover:bg-primary/90 transition-all flex flex-col justify-between">
            <div>
                <Users className="w-6 h-6 mb-6" />
                <h3 className="font-black uppercase text-xs tracking-widest mb-3">Member Portal</h3>
                <p className="text-xs opacity-80 leading-relaxed uppercase font-medium">Authorized login for chapter competition management.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}