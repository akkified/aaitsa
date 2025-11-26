"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { Trophy, Users, Lightbulb, BookOpen, Award, ArrowRight, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useMemo, useEffect } from "react"

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 9))
  const [heroOpacity, setHeroOpacity] = useState(1)

  const goPrevMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  const goNextMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = 500
      const opacity = Math.max(0, 1 - scrollY / heroHeight)
      setHeroOpacity(opacity)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const { monthName, year, weeks } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    const startWeekday = firstOfMonth.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: Array<Date | null> = []
    for (let i = 0; i < startWeekday; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))

    const weeks: Array<Array<Date | null>> = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    const monthName = new Intl.DateTimeFormat(undefined, { month: "long" }).format(firstOfMonth)
    return { monthName, year, weeks }
  }, [currentDate])

  const eventsByDate: Record<string, string> = {
    "2025-10-20": "TSA Workday",
  }

  const toIso = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${dd}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero Section with Fade - TSA Blue Background */}
      <section
        id="hero"
        className="relative h-[500px] bg-gradient-to-br from-[#2057a0] via-[#2563eb] to-[#1e3a8a] text-white overflow-hidden flex items-center transition-opacity duration-300"
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/tsa-ctso-day-technology-conference.jpg')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-balance">AAI TSA</h1>
            <p className="text-lg md:text-2xl text-white/90 mb-6 text-pretty">
              Alliance Academy International Technology Student Association
            </p>
            <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Blah blah the good info (why are we important?) CTSO stuff
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/resources">Explore Competitions</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section - AAI TSA Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-6">AAI TSA</h2>
            <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
              <p>Blah blah the good info (why are we important?) CTSO stuff. The why join TSA part is good.</p>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Why Join TSA?</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <Lightbulb className="w-6 h-6 text-[#2563eb] flex-shrink-0 mt-0.5" />
                    <span>Develop creative solutions through hands-on projects and real-world problem solving</span>
                  </li>
                  <li className="flex gap-3">
                    <Trophy className="w-6 h-6 text-[#2563eb] flex-shrink-0 mt-0.5" />
                    <span>Compete at regional, state, and national conferences in 39+ different events</span>
                  </li>
                  <li className="flex gap-3">
                    <Users className="w-6 h-6 text-[#2563eb] flex-shrink-0 mt-0.5" />
                    <span>Build teamwork and leadership skills that prepare you for future success</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Our Chapter - 3 Cards */}
      <section className="py-20 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Explore Our Chapter</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Competitions Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-neutral-200">
              <div className="p-8 flex flex-col h-full">
                <Trophy className="w-12 h-12 text-[#2563eb] mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Competitions</h3>
                <p className="text-neutral-600 mb-8 flex-1">
                  Explore 39+ TSA competition categories across engineering, technology, digital media, and leadership
                  events.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white py-3 text-base font-semibold"
                >
                  <Link href="/resources" className="flex items-center justify-center gap-2">
                    Learn More <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Gallery Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-neutral-200">
              <div className="p-8 flex flex-col h-full">
                <Award className="w-12 h-12 text-[#2563eb] mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Picture Gallery</h3>
                <p className="text-neutral-600 mb-8 flex-1">
                  View our achievements, events, and memorable moments from competitions and chapter activities
                  throughout the year.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white py-3 text-base font-semibold"
                >
                  <Link href="/gallery" className="flex items-center justify-center gap-2">
                    View Gallery <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Resources Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-neutral-200">
              <div className="p-8 flex flex-col h-full">
                <BookOpen className="w-12 h-12 text-[#2563eb] mb-4" />
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Resources</h3>
                <p className="text-neutral-600 mb-8 flex-1">
                  Access competition guidelines, learning materials, and helpful resources for all events and
                  categories.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white py-3 text-base font-semibold"
                >
                  <Link href="/resources" className="flex items-center justify-center gap-2">
                    View Resources <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* About Us Link */}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/team">About Us & Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-12">October Calendar</h2>

          <Card className="border-neutral-200">
            <CardContent className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={goPrevMonth}
                  className="p-2 hover:bg-neutral-100 rounded transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5 text-neutral-700" />
                </button>
                <h3 className="text-xl font-bold text-center flex-1">
                  {monthName} {year}
                </h3>
                <button
                  onClick={goNextMonth}
                  className="p-2 hover:bg-neutral-100 rounded transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5 text-neutral-700" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-3">
                {/* Weekday Header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                      key={day}
                      className="text-center font-bold text-sm text-neutral-600 py-2 border-b border-neutral-200"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="grid grid-cols-7 gap-2">
                    {week.map((date, dayIdx) => {
                      const iso = date ? toIso(date) : ""
                      const hasEvent = iso && eventsByDate[iso]
                      return (
                        <div
                          key={dayIdx}
                          className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 text-sm font-medium transition-all ${
                            !date
                              ? "bg-neutral-50 border-transparent"
                              : hasEvent
                                ? "bg-[#2563eb]/10 border-[#2563eb] text-neutral-900"
                                : "bg-white border-neutral-200 hover:border-[#2563eb]/50"
                          }`}
                        >
                          {date && (
                            <>
                              <div className="text-base font-bold">{date.getDate()}</div>
                              {hasEvent && (
                                <div className="text-xs font-bold text-[#b0272d] mt-1 text-center px-1 line-clamp-1">
                                  Event
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Event Legend */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm font-semibold text-neutral-900 mb-3">Upcoming Events:</p>
                <div className="space-y-2">
                  {Object.entries(eventsByDate).map(([date, event]) => (
                    <div key={date} className="text-sm text-neutral-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#b0272d] rounded-full flex-shrink-0"></span>
                      {event} - {date}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-neutral-100">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-8">Our Location</h2>
          <Card className="border-neutral-200 overflow-hidden">
            <div className="w-full h-96 bg-neutral-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#2563eb] mx-auto mb-4 opacity-50" />
                <p className="text-neutral-600">
                  <a
                    href="https://maps.google.com/?q=Alliance+Academy+International,+Cumming,+GA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563eb] hover:underline font-medium"
                  >
                    View on Google Maps
                  </a>
                </p>
                <p className="text-sm text-neutral-600 mt-2">Cumming, Georgia</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Newsletter Section - Prominent */}
      <section className="py-32 bg-[#2563eb] text-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Check Out Our Weekly Newsletter!</h2>
          <p className="text-lg text-white/90 mb-12">
            Stay updated with chapter news, competition deadlines, and event announcements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 max-w-xs px-6 py-4 rounded-lg bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#b0272d]"
            />
            <Button className="bg-[#b0272d] hover:bg-[#8b1e22] text-white px-8 py-4 text-lg font-semibold rounded-lg h-auto">
              Newsletter
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links & General Sources */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Links & General Sources</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-bold mb-6 text-[#2563eb]">General Sources</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://tsaweb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-[#2563eb] transition-colors font-medium"
                  >
                    • National TSA Official Website
                  </a>
                </li>
                <li>
                  <a
                    href="https://gatsa.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-[#2563eb] transition-colors font-medium"
                  >
                    • Georgia TSA Resources
                  </a>
                </li>
                <li>
                  <a href="/resources" className="text-neutral-600 hover:text-[#2563eb] transition-colors font-medium">
                    • Competition Rules & Guidelines
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6 text-[#2563eb]">Chapter Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/gallery" className="text-neutral-600 hover:text-[#2563eb] transition-colors font-medium">
                    • Gallery & Achievements
                  </a>
                </li>
                <li>
                  <a href="/team" className="text-neutral-600 hover:text-[#2563eb] transition-colors font-medium">
                    • Meet Our Team
                  </a>
                </li>
                <li>
                  <a href="/my" className="text-neutral-600 hover:text-[#2563eb] transition-colors font-medium">
                    • Student Portal
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
