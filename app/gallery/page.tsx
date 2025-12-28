"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Calendar, Users, Coffee, Lightbulb } from "lucide-react"

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const galleryItems = [
    {
      id: 1,
      title: "1",
      description: "desc",
      date: "DEC 2025",
      category: "Meetings",
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 2,
      title: "2",
      description: "desc",
      date: "NOV 2025",
      category: "Workshops",
      icon: <Lightbulb className="w-4 h-4" />
    },
    {
      id: 3,
      title: "3",
      description: "desc",
      date: "OCT 2025",
      category: "Social",
      icon: <Coffee className="w-4 h-4" />
    },
    {
      id: 4,
      title: "4",
      description: "desc",
      date: "SEPT 2025",
      category: "Chapter Life",
      icon: <ImageIcon className="w-4 h-4" />
    },
  ]

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
              A look behind the scenes at our meetings, hangouts, and the daily grind that makes our chapter a community.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
            {galleryItems.map((item) => (
              <Card
                key={item.id}
                className="bg-card border-none shadow-none overflow-hidden group rounded-[2.5rem]"
              >
                {/* Photo Placeholder */}
                <div className="aspect-[16/10] bg-muted relative overflow-hidden rounded-[2.5rem] border border-border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
                      <ImageIcon className="h-12 w-12" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Photo Archive</span>
                    </div>
                  </div>
                  
                  {/* Category Tag */}
                  <div className="absolute bottom-6 left-6">
                    <Badge className="bg-background/90 backdrop-blur-md text-foreground border-none font-bold text-[10px] uppercase tracking-widest px-4 py-1 flex items-center gap-2">
                      {item.icon}
                      {item.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="px-4 py-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-primary font-bold tracking-tighter uppercase">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </div>
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter transition-colors">
                      {item.title}
                    </CardTitle>
                    <p className="text-muted-foreground leading-relaxed max-w-lg">
                      {item.description}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer-lite spacer */}
      <div className="pb-24" />
    </div>
  )
}