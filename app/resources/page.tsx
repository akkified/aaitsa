import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, ExternalLink, ArrowLeft, FileText, Users, Target, Award, Upload } from "lucide-react"

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
      title: "Competitions",
      description: "View all TSA competitions",
      url: "/competitions",
      icon: Award,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
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
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Competition Resources</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty mb-8">
              Access themes, guidelines, and materials for all TSA competitions
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

      {/* General Resources */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">General Resources</h3>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
            {generalResources.map((resource, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{resource.title}</CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">
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

      {/* Competition Resources by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">Competition Themes & Resources</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download theme PDFs and resources for each competition. Upload your own materials through the admin
              portal.
            </p>
          </div>

          <div className="space-y-12">
            {competitionResources.map((categoryGroup, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-6 w-6 text-primary" />
                  <h4 className="text-xl font-semibold text-foreground">{categoryGroup.category}</h4>
                  <Badge variant="outline">{categoryGroup.competitions.length} Competitions</Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryGroup.competitions.map((competition, compIndex) => (
                    <Card key={compIndex} className="h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm leading-tight">{competition}</CardTitle>
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Upload className="h-3 w-3" />
                          <span>Theme PDF placeholder</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent" disabled>
                          <Download className="h-3 w-3 mr-1" />
                          Not Available
                        </Button>
                        <p className="text-xs text-muted-foreground italic">Upload PDF through admin portal</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Upload Notice */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Upload Competition Resources</h3>
            <p className="text-muted-foreground mb-6">
              Chapter administrators can upload theme PDFs and other resources for each competition through the admin
              portal. Students will be able to access these materials here.
            </p>
            <Button asChild size="lg">
              <Link href="/admin">Go to Admin Portal</Link>
            </Button>
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
