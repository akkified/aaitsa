"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Download, ExternalLink, Users, Target, Award, Calendar, Trophy, ChevronLeft, ChevronRight } from "lucide-react"

export default function ResourcesPage() {
  const competitionResources = [
    {
      category: "Engineering & Design",
      competitions: [
        "Animatronics",
        "Architectural Design",
        "Biotechnology Design",
        "CAD Architecture",
        "CAD Engineering",
        "Dragster Design",
        "Engineering Design",
        "Flight Endurance",
        "Manufacturing Prototype",
        "Structural Design and Engineering",
        "Transportation Modeling",
      ],
    },
    {
      category: "Technology & STEM",
      competitions: [
        "Coding",
        "Data Science & Analytics",
        "Forensic Science",
        "Geospatial Technology",
        "Software Development",
        "System Control Technology",
        "Technology Problem Solving",
      ],
    },
    {
      category: "Digital Media & Design",
      competitions: [
        "Audio Podcasting",
        "Board Game Design",
        "Digital Video Production",
        "Fashion Design and Technology",
        "Music Production",
        "On Demand Video",
        "Photographic Technology",
        "Promotional Design",
        "Video Game Design",
        "Virtual Reality Visualization (VR)",
        "Webmaster",
      ],
    },
    {
      category: "Communication & Leadership",
      competitions: [
        "Chapter Team",
        "Children's Stories",
        "Debating Technological Issues",
        "Essays on Technology",
        "Extemporaneous Speech",
        "Prepared Presentation",
        "Technology Bowl",
      ],
    },
    {
      category: "Special Events",
      competitions: ["Drone Challenge (UAV)", "Future Technology and Engineering Teacher", "Senior Solar Sprint"],
    },
  ]

  const generalResources = [
    {
      title: "TSA Competition Rules & Guidelines",
      description: "Official TSA competition rules and guidelines for all events",
      type: "PDF",
      url: "https://tsaweb.org/competitions",
      external: true,
    },
    {
      title: "Georgia TSA Resources",
      description: "State-specific resources and competition information",
      type: "External Link",
      url: "https://gatsa.org/",
      external: true,
    },
    {
      title: "Chapter Constitution",
      description: "Our chapter's constitution and bylaws",
      type: "PDF",
      url: "#",
      external: false,
    },
  ]

  const detailedCompetitions = [
    // Engineering & Design
    {
      name: "Animatronics",
      description: "Design and create an animatronic device that performs a specific task or tells a story.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      name: "Architectural Design",
      description: "Use architectural design principles to create detailed plans for a structure.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      name: "Biotechnology Design",
      description: "Design and develop innovative biotechnology solutions to real-world problems.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      name: "CAD Architecture",
      description: "Create architectural designs using computer-aided design software.",
      category: "Engineering & Design",
      participants: "Individual",
    },
    {
      name: "CAD Engineering",
      description: "Develop engineering designs and technical drawings using CAD software.",
      category: "Engineering & Design",
      participants: "Individual",
    },
    {
      name: "Dragster Design",
      description: "Design, construct, and race a CO2-powered dragster vehicle.",
      category: "Engineering & Design",
      participants: "Individual",
    },
    {
      name: "Engineering Design",
      description: "Apply systematic engineering methodology to solve complex challenges.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      name: "Flight Endurance",
      description: "Design and build aircraft for maximum flight duration and efficiency.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      name: "Manufacturing Prototype",
      description: "Design and manufacture a product prototype using modern manufacturing techniques.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      name: "Structural Design and Engineering",
      description: "Design and build structures to withstand specific loads and conditions.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      name: "Transportation Modeling",
      description: "Design and build a scale model of a transportation vehicle or system.",
      category: "Engineering & Design",
      participants: "Individual",
    },
    // Technology & STEM
    {
      name: "Coding",
      description: "Demonstrate programming skills by solving computational problems.",
      category: "Technology & STEM",
      participants: "Individual",
    },
    {
      name: "Data Science & Analytics",
      description: "Analyze data sets and present findings using data science techniques.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      name: "Forensic Science",
      description: "Apply scientific methods to solve a crime scene investigation.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      name: "Geospatial Technology",
      description: "Use GPS and GIS technology to solve real-world spatial problems.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      name: "Software Development",
      description: "Design and develop software applications to solve specific problems.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      name: "System Control Technology",
      description: "Design and program automated control systems.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      name: "Technology Problem Solving",
      description: "Work as a team to solve technology-related problems under time constraints.",
      category: "Technology & STEM",
      participants: "Team",
    },
    // Digital Media & Design
    {
      name: "Audio Podcasting",
      description: "Create an original podcast on a technology-related topic.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      name: "Board Game Design",
      description: "Design and create an original board game with educational value.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      name: "Digital Video Production",
      description: "Produce a digital video on a specified theme using professional techniques.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      name: "Fashion Design and Technology",
      description: "Design and create fashion items incorporating technology.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      name: "Music Production",
      description: "Compose and produce original music using digital audio workstations.",
      category: "Digital Media & Design",
      participants: "Individual",
    },
    {
      name: "On Demand Video",
      description: "Create a video on a given topic within a limited time frame at the conference.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      name: "Photographic Technology",
      description: "Demonstrate photography skills through a themed portfolio.",
      category: "Digital Media & Design",
      participants: "Individual",
    },
    {
      name: "Promotional Design",
      description: "Create promotional materials for a product, service, or event.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      name: "Video Game Design",
      description: "Create engaging and educational video games with original concepts.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      name: "Virtual Reality Visualization (VR)",
      description: "Design and develop immersive virtual reality experiences.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      name: "Webmaster",
      description: "Design and develop functional websites with modern web technologies.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    // Communication & Leadership
    {
      name: "Chapter Team",
      description: "Demonstrate chapter activities and achievements through a presentation.",
      category: "Communication & Leadership",
      participants: "Team",
    },
    {
      name: "Children's Stories",
      description: "Write and illustrate an original children's story about technology.",
      category: "Communication & Leadership",
      participants: "Individual",
    },
    {
      name: "Debating Technological Issues",
      description: "Debate current technological issues and their societal impacts.",
      category: "Communication & Leadership",
      participants: "Team",
    },
    {
      name: "Essays on Technology",
      description: "Write a comprehensive essay on a technology-related topic.",
      category: "Communication & Leadership",
      participants: "Individual",
    },
    {
      name: "Extemporaneous Speech",
      description: "Deliver an impromptu speech on a technology topic.",
      category: "Communication & Leadership",
      participants: "Individual",
    },
    {
      name: "Prepared Presentation",
      description: "Deliver a prepared presentation on a technology-related topic.",
      category: "Communication & Leadership",
      participants: "Individual",
    },
    {
      name: "Technology Bowl",
      description: "Compete in a quiz bowl format answering technology-related questions.",
      category: "Communication & Leadership",
      participants: "Team",
    },
    // Special Events
    {
      name: "Drone Challenge (UAV)",
      description: "Design, build, and fly unmanned aerial vehicles through obstacle courses.",
      category: "Special Events",
      participants: "Team",
    },
    {
      name: "Future Technology and Engineering Teacher",
      description: "Demonstrate teaching skills by creating and delivering a technology lesson.",
      category: "Special Events",
      participants: "Individual",
    },
    {
      name: "Senior Solar Sprint",
      description: "Design and build a solar-powered model vehicle.",
      category: "Special Events",
      participants: "Team",
    },
  ]

  const categories = [
    { name: "Engineering & Design", color: "bg-blue-100 text-blue-800", count: 11 },
    { name: "Technology & STEM", color: "bg-blue-50 text-blue-900", count: 7 },
    { name: "Digital Media & Design", color: "bg-red-50 text-red-900", count: 11 },
    { name: "Communication & Leadership", color: "bg-blue-100 text-blue-800", count: 7 },
    { name: "Special Events", color: "bg-red-100 text-red-800", count: 3 },
  ]

  const quickLinks = [
    {
      title: "Georgia TSA",
      description: "Official Georgia TSA website",
      url: "https://gatsa.org/",
      icon: ExternalLink,
    },
    {
      title: "National TSA",
      description: "National Technology Student Association",
      url: "https://tsaweb.org/",
      icon: ExternalLink,
    },
    {
      title: "Student Portal",
      description: "Access your submissions and progress",
      url: "/my",
      icon: Users,
    },
    {
      title: "Submit Entry",
      description: "Submit your competition entry",
      url: "/my/submit",
      icon: Award,
    },
  ]

  const eventsByDate: Record<string, Array<{ label: string; color: string }>> = {
    "2025-11-20": [{ label: "Chapter Meeting", color: "bg-primary" }],
  }

  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  const { monthName, year, weeks } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() // 0-based
    const firstOfMonth = new Date(year, month, 1)
    const startWeekday = firstOfMonth.getDay() // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: Array<Date | null> = []
    // Leading blanks
    for (let i = 0; i < startWeekday; i++) days.push(null)
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
    // Chunk into weeks of 7
    const weeks: Array<Array<Date | null>> = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    const monthName = new Intl.DateTimeFormat(undefined, { month: "long" }).format(firstOfMonth)
    return { monthName, year, weeks }
  }, [currentDate])

  const goPrevMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  const goNextMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  const toIso = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${dd}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 text-balance">Competition Resources</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
              Access guidelines, competition themes, and helpful materials for all TSA events
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Links</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-primary/10">
                <CardContent className="p-6 text-center">
                  <link.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{link.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <Link href={link.url} target={link.url.startsWith("http") ? "_blank" : "_self"}>
                      Visit
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* General Resources */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">General Resources</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {generalResources.map((resource, index) => (
              <Card key={index} className="border-primary/10 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <Badge variant="outline" className="text-xs w-fit mt-2">
                    {resource.type}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <Link href={resource.url} target={resource.external ? "_blank" : "_self"}>
                      {resource.external ? (
                        <>
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </>
                      )}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Competition Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All TSA Competitions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Browse all 39 official TSA high school competitions across five categories
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Badge key={category.name} className={`${category.color} border`}>
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold">{cat.name}</h3>
                  <Badge variant="outline">{cat.count}</Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {detailedCompetitions
                    .filter((comp) => comp.category === cat.name)
                    .map((competition, index) => (
                      <Card key={index} className="h-full hover:shadow-lg transition-shadow border-primary/10">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{competition.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {competition.participants}
                              </Badge>
                            </div>
                            <Trophy className="h-5 w-5 text-primary flex-shrink-0" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{competition.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="outline" size="icon" onClick={goPrevMonth} aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-3xl font-bold">
                {monthName} {year}
              </h2>
              <Button variant="outline" size="icon" onClick={goNextMonth} aria-label="Next month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-lg text-muted-foreground">Upcoming TSA events and workdays</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-7 gap-4 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="font-semibold text-foreground">
                      {day}
                    </div>
                  ))}

                  {weeks.flatMap((week, wi) =>
                    week.map((date, di) => {
                      if (!date) {
                        return <div key={`empty-${wi}-${di}`} className="p-2 rounded min-h-[80px]" />
                      }
                      const iso = toIso(date)
                      const events = eventsByDate[iso] || []
                      return (
                        <div
                          key={iso}
                          className="p-2 rounded border border-primary/10 min-h-[80px] bg-white hover:bg-blue-50 transition-colors"
                        >
                          <div className="font-semibold text-foreground mb-1">{date.getDate()}</div>
                          <div className="flex flex-col items-center gap-1">
                            {events.map((evt, idx) => (
                              <div key={idx} className="flex items-center gap-1 text-xs">
                                <span className={`inline-block h-2 w-2 rounded-full ${evt.color}`}></span>
                                <span className="truncate max-w-[60px]">{evt.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
