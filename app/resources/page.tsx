import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, ExternalLink, ArrowLeft, FileText, Users, Calendar, Lightbulb, Target } from "lucide-react"

export default function ResourcesPage() {
  const resources = [
    {
      category: "Competition Guidelines",
      items: [
        {
          title: "TSA Competition Rules & Guidelines",
          description: "Official TSA competition rules and guidelines for all events",
          type: "PDF",
          size: "2.4 MB",
          url: "https://gatsa.org/",
          external: true,
        },
        {
          title: "Biotechnology Design Guidelines",
          description: "Specific requirements and judging criteria for biotechnology design competitions",
          type: "PDF",
          size: "1.8 MB",
          url: "#",
          external: false,
        },
        {
          title: "Engineering Design Process Handbook",
          description: "Step-by-step guide to the engineering design methodology",
          type: "PDF",
          size: "3.2 MB",
          url: "#",
          external: false,
        },
      ],
    },
    {
      category: "Learning Materials",
      items: [
        {
          title: "Programming Fundamentals",
          description: "Introduction to programming concepts for web development competitions",
          type: "Video Series",
          size: "12 videos",
          url: "#",
          external: false,
        },
        {
          title: "3D Modeling Tutorial",
          description: "Learn 3D modeling techniques for engineering design projects",
          type: "Tutorial",
          size: "45 min",
          url: "#",
          external: false,
        },
        {
          title: "Project Management Guide",
          description: "Best practices for managing team projects and deadlines",
          type: "Guide",
          size: "1.2 MB",
          url: "#",
          external: false,
        },
      ],
    },
    {
      category: "Chapter Information",
      items: [
        {
          title: "Chapter Constitution",
          description: "Our chapter's constitution and bylaws",
          type: "PDF",
          size: "890 KB",
          url: "#",
          external: false,
        },
        {
          title: "Meeting Schedule",
          description: "Weekly meeting times and locations",
          type: "Calendar",
          size: "View",
          url: "#",
          external: false,
        },
        {
          title: "Membership Application",
          description: "Application form for joining our chapter",
          type: "Form",
          size: "Fill Online",
          url: "/auth/signup",
          external: false,
        },
      ],
    },
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
      title: "About Our Chapter",
      description: "Learn more about Alliance Academy TSA",
      url: "/about",
      icon: BookOpen,
    },
  ]

  const upcomingEvents = [
    {
      title: "Regional Competition",
      date: "March 15-17, 2024",
      location: "Atlanta, GA",
      description: "Annual regional TSA competition featuring multiple events",
    },
    {
      title: "State Conference",
      date: "April 20-22, 2024",
      location: "Macon, GA",
      description: "Georgia TSA State Conference with national qualifiers",
    },
    {
      title: "Chapter Meeting",
      date: "Every Tuesday",
      location: "Room 204",
      description: "Weekly chapter meetings for project work and preparation",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Alliance Academy TSA</h1>
              <p className="text-sm text-muted-foreground">Technology Student Association</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/my">
              <Button variant="default">Student Portal</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Resources & Materials</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty mb-8">
              Everything you need to succeed in TSA competitions and chapter activities
            </p>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/about"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to About Page
        </Link>
      </div>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Quick Links</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <link.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">{link.title}</h4>
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

      {/* Resources by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Resources by Category</h3>
          <div className="space-y-12">
            {resources.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {category.category}
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{item.size}</span>
                          <Button asChild variant="outline" size="sm">
                            <Link href={item.url} target={item.external ? "_blank" : "_self"}>
                              {item.external ? (
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Upcoming Events</h3>
          <div className="max-w-4xl mx-auto space-y-4">
            {upcomingEvents.map((event, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{event.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{event.date}</span>
                        <span>{event.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join our chapter and access all these resources. Start your TSA journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/signup">Join Our Chapter</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Alliance Academy TSA Chapter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
