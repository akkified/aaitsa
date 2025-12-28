"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { 
  Trophy, Users, Lightbulb, BookOpen, Award, 
  ArrowRight, ChevronLeft, ChevronRight, Shield, Activity, Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  
  useEffect(() => {
    setMounted(true)
    setCurrentDate(new Date())
  }, [])

  const goPrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const goNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startWeekday = firstOfMonth.getDay()

    const days: (Date | null)[] = Array(startWeekday).fill(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
    
    return {
      monthName: firstOfMonth.toLocaleString('default', { month: 'long' }),
      year,
      days
    }
  }, [currentDate])

  const events = { 
    "2025-10-20": "Technical Workshop", 
    "2025-12-28": "State Project Review" 
  }

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-40 pb-20 overflow-hidden">
        {/* Subtle Gradient Overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container px-6 relative z-10 mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-full max-w-5xl">
              <div className="inline-flex items-center gap-3 mb-8 group cursor-default">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black tracking-[0.4em] text-muted-foreground uppercase">
                  Technology Student Association
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10 uppercase">
                Engineering the <br />
                <span className="text-primary italic font-light italic">Next Standard.</span>
              </h1>

              <div className="flex flex-col md:flex-row gap-10 items-start md:items-center border-t border-border pt-10">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-12 h-16 text-xs font-black tracking-widest uppercase transition-all shadow-xl shadow-primary/20">
                  <Link href="/resources">Access Registry</Link>
                </Button>
                
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Global Status</p>
                    <p className="text-sm font-bold font-mono">2025 COMPETITIVE CYCLE</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Regional Node</p>
                    <p className="text-sm font-bold font-mono">GA-ALLIANCE ACADEMY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Bento Grid */}
      <section className="py-20 border-t border-border/50 bg-secondary/10">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6">
            <div className="md:col-span-4 md:row-span-2 bg-card border border-border p-12 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <Globe className="w-8 h-8 text-primary" />
                  <div className="h-px w-12 bg-border" />
                </div>
                <h3 className="text-4xl font-black mb-6 tracking-tighter uppercase">National Event Directory</h3>
                <p className="text-muted-foreground max-w-md mb-10 leading-relaxed text-sm font-medium">
                  Review the technical specifications for all 40 competitive events. From Aerospace to Web Technologies, find your domain of expertise.
                </p>
                <Link href="/resources" className="inline-flex items-center text-[11px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1 hover:text-foreground hover:border-foreground transition-all">
                  Review Rubrics & Guidelines <ArrowRight className="ml-2 w-3 h-3" />
                </Link>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
            </div>

            <div className="md:col-span-2 bg-primary p-8 flex flex-col justify-between group cursor-pointer overflow-hidden relative">
              <Users className="w-8 h-8 text-white/50 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Executive Board</h3>
                <p className="text-white/70 text-xs mt-2 font-mono tracking-tighter italic">// View Chapter Officers</p>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10">
                 <Shield className="w-32 h-32" />
              </div>
            </div>

            <div className="md:col-span-1 bg-card border border-border p-6 flex flex-col justify-center items-center group hover:bg-primary transition-colors">
              <Activity className="w-5 h-5 text-primary group-hover:text-white mb-2" />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white text-center">Workshops</span>
            </div>

            <div className="md:col-span-1 bg-card border border-border p-6 flex flex-col justify-center items-center group hover:bg-primary transition-colors">
              <Award className="w-5 h-5 text-primary group-hover:text-white mb-2" />
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white text-center">Honors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule / Benchmarks Section */}
      <section className="py-24 relative border-t border-border/50">
        <div className="container px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 text-primary">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Active Milestones</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter mb-8 uppercase leading-tight">Chapter <br /> <span className="text-primary italic font-light">Benchmarks.</span></h2>
              <div className="space-y-3">
                {Object.entries(events).map(([date, title]) => (
                  <div key={date} className="flex justify-between items-center p-6 border border-border hover:border-primary transition-all group">
                    <span className="font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{title}</span>
                    <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-3 py-1">{date}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-card border-border shadow-2xl rounded-none overflow-hidden">
              <div className="p-8 border-b border-border flex justify-between items-center bg-secondary/20">
                <h3 className="font-black uppercase tracking-[0.2em] text-xs">{calendarData.monthName} // {calendarData.year}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={goPrevMonth} className="h-8 w-8 rounded-none border border-border"><ChevronLeft className="w-4 h-4"/></Button>
                  <Button variant="ghost" size="icon" onClick={goNextMonth} className="h-8 w-8 rounded-none border border-border"><ChevronRight className="w-4 h-4"/></Button>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-7 gap-1">
                  {['S','M','T','W','T','F','S'].map((day, idx) => (
                    <div key={`weekday-${idx}`} className="text-center text-[9px] font-black text-muted-foreground pb-6 uppercase tracking-widest">{day}</div>
                  ))}
                  {calendarData.days.map((date, i) => {
                    const today = date && date.toDateString() === new Date().toDateString();
                    return (
                      <div 
                        key={`date-${i}`} 
                        className={`aspect-square flex items-center justify-center text-xs transition-all border border-transparent ${
                          today 
                          ? 'bg-primary text-white font-black' 
                          : 'text-foreground hover:border-primary hover:text-primary'
                        }`}
                      >
                        {date?.getDate()}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-32 border-t border-border">
        <div className="container px-6 mx-auto">
          <div className="bg-card border border-border p-12 md:p-24 text-center relative overflow-hidden">
            <h2 className="text-5xl md:text-7xl font-black text-foreground mb-8 relative z-10 tracking-tighter uppercase italic">Stay Integrated.</h2>
            <p className="text-muted-foreground mb-12 max-w-lg mx-auto relative z-10 font-mono text-sm uppercase tracking-tight">Technical updates and competition advisories transmitted via chapter registry.</p>
            <form className="flex flex-col md:flex-row gap-0 max-w-2xl mx-auto relative z-10" onSubmit={e => e.preventDefault()}>
              <input 
                className="flex-1 bg-secondary/50 border border-border px-8 py-5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary" 
                placeholder="STUDENT_ID@FORSYTH.K12.GA.US" 
              />
              <Button className="bg-primary text-white rounded-none px-12 h-auto text-xs font-black tracking-[0.2em] uppercase transition-all hover:bg-blue-700">SUBMIT_APPLICATION</Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}