"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function TeamPage() {
  const advisors = [
    {
      name: "Dr. Bryan Fagan",
      role: "Lead Advisor",
      bio: "Chapter advisor with expertise in STEM education and competition preparation",
      image: "/male-educator.jpg",
    },
    {
      name: "Ms. Sarah Johnson",
      role: "Co-Advisor",
      bio: "Supports student development and competitive event training",
      image: "/female-educator.jpg",
    },
  ]

  const officers = [
    { name: "Sean Track", role: "President", image: "/student-leader.jpg" },
    { name: "Shreyas Yeldandi", role: "Vice President", image: "/student-leader.jpg" },
    { name: "Emma Williams", role: "Secretary", image: "/student-leader.jpg" },
    { name: "Marcus Chen", role: "Treasurer", image: "/student-leader.jpg" },
    { name: "Jessica Martinez", role: "Competition Lead", image: "/student-leader.jpg" },
    { name: "David Park", role: "Event Coordinator", image: "/student-leader.jpg" },
  ]

  const ladderCommittee = [
    { name: "Michael Torres", role: "Webmaster Chair", category: "Digital Media" },
    { name: "Priya Patel", role: "Engineering Lead", category: "Design & Engineering" },
    { name: "James Wilson", role: "Media Director", category: "Digital Media" },
    { name: "Sofia Rodriguez", role: "Technology Chair", category: "Technology & STEM" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-balance">Meet Our Team</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Dedicated advisors and passionate student leaders working together to build an exceptional TSA chapter
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">About AAI TSA</h2>
            <p className="text-lg text-muted-foreground text-pretty mb-8">
              Alliance Academy International TSA is dedicated to fostering innovation, creativity, and technical
              excellence among our students. We compete at regional, state, and national levels in 39+ different
              technology competitions, from engineering design to digital media production.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">39</div>
                <p className="text-sm text-muted-foreground">Competition Events</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">8</div>
                <p className="text-sm text-muted-foreground">Officer Roles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">The Advisors</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our experienced advisors guide and support our chapter through competition preparation and leadership
            development
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {advisors.map((advisor, idx) => (
              <Card key={idx} className="border-primary/20 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <img
                    src={advisor.image || "/placeholder.svg"}
                    alt={advisor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <Badge className="w-fit bg-primary text-white">{advisor.role}</Badge>
                  <CardTitle className="text-2xl mt-2">{advisor.name}</CardTitle>
                  <CardDescription className="text-base">{advisor.bio}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Officer Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Officer Team</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Student leaders driving our chapter's success and organizing events and competitions
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {officers.map((officer, idx) => (
              <Card
                key={idx}
                className="border-primary/10 overflow-hidden hover:shadow-lg transition-all hover:border-primary/30"
              >
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <img
                    src={officer.image || "/placeholder.svg"}
                    alt={officer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{officer.name}</CardTitle>
                  <Badge variant="outline" className="w-fit mt-2">
                    {officer.role}
                  </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ladder Committee Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Ladder Committee</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Specialized leadership roles coordinating specific competition categories and events
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {ladderCommittee.map((member, idx) => (
              <Card key={idx} className="border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Badge className="w-fit bg-accent/10 text-accent border-accent/20">{member.category}</Badge>
                  <CardTitle className="text-lg mt-2">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* School Information Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our School</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Alliance Academy International is committed to nurturing innovation and academic excellence. Our TSA
              chapter represents the school's dedication to STEM education and student development.
            </p>
            <div className="bg-secondary/30 rounded-lg p-8 border border-primary/20">
              <p className="text-muted-foreground mb-4">📍 Located in Cumming, Georgia</p>
              <p className="text-sm text-muted-foreground font-semibold">
                Website designed and built by AAI TSA members
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in Joining?</h2>
            <p className="text-lg text-white/90 mb-8">
              We're always looking for passionate students ready to compete and innovate. Learn more about joining our
              chapter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/my">Go to Student Portal</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
