"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Users, MapPin, ShieldCheck, 
  ChevronRight, Sparkles, BookOpen, 
  GraduationCap, User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const advisors = [
    { 
      name: "Dr. Bryan Fagan", 
      role: "Advisor", 
      bio: "Room #1359", 
      image: "/dr-fagan.jpg" // Ensure these exist in /public/ folder
    },
    { 
      name: "Captain Gregory Salloum", 
      role: "Advisor", 
      bio: "Room #1523", 
      image: "/captain-salloum.jpg" 
    },
  ]

  const officers = [
    { name: "Sean Track", role: "President", committee: ["Shruthi Chava", "Asha Annae"] },
    { name: "Shreyas Yeldandi", role: "Vice President", committee: ["Om Chile", "Manasi Kishore"] },
    { name: "Akhil Akella", role: "2nd Vice President", committee: ["Akshara Chunduri", "Committee Member"] },
    { name: "Alessandra Reneau", role: "Secretary", committee: ["Harshitram Ganeshram", "Akshara Nataraj Prabu Deepa"] },
    { name: "Om Mahajan", role: "Treasurer", committee: ["Vedanth Nomula", "Rishi Bijoy"] },
    { name: "Hasi Durga Gopi", role: "Reporter", committee: ["Maurya Kopireddy", "Aarna Patel","Harish Manikandan","Akshara Amirineni"] },
    { name: "Jason Nguyen", role: "Sergeant-at-Arms", committee: ["Sri Tanvi Buddiga", "Akshaj Nandanavanam"] },
    { name: "Shreyansh Waghole", role: "VP of Mechatronics", committee: ["Julien Price-Gooden", "Ishaan Suneja"] },
    { name: "Aashrith Nalluri", role: "VP Game Design/CS", committee: ["Rithilya Senthilnathan", "Siddharth Sabarish"] },
  ]

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="container px-6 relative z-10 mx-auto">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground italic">Authorized Registry // Chapter 2432</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-[0.9]">
              About Our <br />
              <span className="text-primary italic">Chapter.</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground text-lg leading-relaxed border-l-2 border-primary pl-6 font-medium">
              The Alliance Academy International Technology Student Association (TSA) provides students with opportunities for leadership, teamwork, and STEM excellence through competitive events.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter Overview Stats */}
      <section className="py-12">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border p-10 rounded-none shadow-sm relative overflow-hidden group">
              <span className="text-6xl font-black text-primary italic relative z-10 tracking-tighter">40+</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 text-muted-foreground relative z-10 italic">High School Events Available</p>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <BookOpen className="w-32 h-32" />
              </div>
            </div>
            <div className="bg-card border border-border p-10 rounded-none shadow-sm relative overflow-hidden group">
              <span className="text-6xl font-black text-primary italic relative z-10 tracking-tighter">25/26</span>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 text-muted-foreground relative z-10 italic">Active Competitive Cycle</p>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Sparkles className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-mono italic">// Faculty Node</span>
                </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Chapter Advisors</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-6xl">
            {advisors.map((advisor, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-8 bg-card border border-border p-8 rounded-none group hover:border-primary transition-all">
                <div className="w-full md:w-40 h-48 bg-secondary/50 rounded-none overflow-hidden shrink-0 border border-border flex items-center justify-center">
                  {/* Fallback if image fails */}
                  <img 
                    src={advisor.image} 
                    alt={advisor.name} 
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex') }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                  />
                  <div className="hidden flex-col items-center gap-2 text-muted-foreground/30">
                    <User className="w-12 h-12" />
                    <span className="text-[10px] font-bold uppercase">No Photo</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-primary text-white rounded-none border-none text-[9px] font-black tracking-widest" variant="outline">
                    OFFICIAL ADVISOR
                  </Badge>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">{advisor.name}</h3>
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-secondary/50 p-2 border border-border w-fit italic">
                    Location: {advisor.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Officer & Committee Hierarchy */}
      <section className="py-24 bg-secondary/10 border-y border-border/50">
        <div className="container px-6 mx-auto">
          <div className="max-w-xl mb-16">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">Leadership <br /><span className="text-primary not-italic">Infrastructure.</span></h2>
            <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest font-bold">// Strategic command and committee operations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {officers.map((officer, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                {/* Officer Header */}
                <div className="p-8 bg-card border border-border rounded-none group hover:border-primary transition-all relative overflow-hidden">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-2 italic leading-none">{officer.role}</p>
                  <h4 className="font-black text-2xl uppercase tracking-tighter group-hover:text-primary transition-colors italic">{officer.name}</h4>
                  <div className="absolute right-[-20px] top-[-20px] opacity-[0.02]">
                    <ShieldCheck className="w-24 h-24" />
                  </div>
                </div>
                
                {/* Fixed: Map over actual member names from committee array */}
                <div className="flex flex-col gap-1 pl-4 border-l-2 border-border">
                  {officer.committee.map((memberName, mIdx) => (
                    <div key={mIdx} className="flex items-center justify-between p-3 bg-card/50 border border-border/50 text-[10px] font-bold uppercase tracking-widest group/member hover:bg-secondary transition-colors">
                      <span className="text-muted-foreground italic truncate mr-2">{memberName}</span>
                      <span className="text-[8px] opacity-30 font-mono italic shrink-0">// Ladder</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Info */}
      <section className="py-24">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="md:w-1/2">
              <h2 className="text-5xl font-black tracking-tighter mb-8 uppercase italic leading-none">Alliance <br /><span className="text-primary not-italic tracking-widest">Academy.</span></h2>
              <p className="text-muted-foreground leading-relaxed mb-10 font-medium text-sm border-l-2 border-border pl-6">
                Alliance Academy for Innovation is located in Cumming, Georgia. Our TSA chapter is an integral part of our STEM-focused curriculum, preparing students for technical careers and professional leadership.
              </p>
              <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-secondary/50 p-4 border border-border w-fit italic">
                <MapPin className="w-4 h-4" />
                <span>1100 Lanier 400 Pkwy, Cumming, GA</span>
              </div>
            </div>
            <div className="md:w-1/2 w-full aspect-video bg-secondary/30 rounded-none flex flex-col items-center justify-center border border-border p-12 text-center group">
              <div className="w-16 h-16 bg-card border border-border flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform">
                <User className="text-muted-foreground/40 w-8 h-8" />
              </div>
              <span className="text-muted-foreground/30 font-black italic text-xs uppercase tracking-widest">Visual Asset Missing // Campus Photo Pending</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-16">
        <div className="container px-6 mx-auto">
          <div className="bg-foreground text-background rounded-none p-16 text-center border-t-8 border-primary">
            <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter italic italic">Join the Chapter</h2>
            <p className="max-w-md mx-auto mb-10 opacity-70 font-mono text-xs uppercase tracking-[0.2em] leading-relaxed italic">Be ready! Membership dues and forms open at the beginning of every year!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-primary text-white hover:bg-primary/90 rounded-none px-12 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                <Link href="/auth/login">Login to Portal</Link>
              </Button>
              <Button asChild variant="outline" className="border-background text-background hover:bg-background/10 rounded-none px-12 h-14 bg-transparent font-black uppercase tracking-widest text-xs italic">
                <a href="https://tsaweb.org" target="_blank">National Website</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}