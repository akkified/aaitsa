import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, ExternalLink, ArrowLeft, FileText, Users, Target, Award, Upload, Trophy } from "lucide-react"

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
    { name: "Animatronics", description: "Design and create an animatronic device that performs a specific task or tells a story.", category: "Engineering & Design", participants: "Team" },
    { name: "Architectural Design", description: "Use architectural design principles to create detailed plans for a structure.", category: "Engineering & Design", participants: "Team" },
    { name: "Biotechnology Design", description: "Design and develop innovative biotechnology solutions to real-world problems.", category: "Engineering & Design", participants: "Team" },
    { name: "CAD Architecture", description: "Create architectural designs using computer-aided design software.", category: "Engineering & Design", participants: "Individual" },
    { name: "CAD Engineering", description: "Develop engineering designs and technical drawings using CAD software.", category: "Engineering & Design", participants: "Individual" },
    { name: "Dragster Design", description: "Design, construct, and race a CO2-powered dragster vehicle.", category: "Engineering & Design", participants: "Individual" },
    { name: "Engineering Design", description: "Apply systematic engineering methodology to solve complex challenges.", category: "Engineering & Design", participants: "Team" },
    { name: "Flight Endurance", description: "Design and build aircraft for maximum flight duration and efficiency.", category: "Engineering & Design", participants: "Team" },
    { name: "Manufacturing Prototype", description: "Design and manufacture a product prototype using modern manufacturing techniques.", category: "Engineering & Design", participants: "Team" },
    { name: "Structural Design and Engineering", description: "Design and build structures to withstand specific loads and conditions.", category: "Engineering & Design", participants: "Team" },
    { name: "Transportation Modeling", description: "Design and build a scale model of a transportation vehicle or system.", category: "Engineering & Design", participants: "Individual" },
    // Technology & STEM
    { name: "Coding", description: "Demonstrate programming skills by solving computational problems.", category: "Technology & STEM", participants: "Individual" },
    { name: "Data Science & Analytics", description: "Analyze data sets and present findings using data science techniques.", category: "Technology & STEM", participants: "Team" },
    { name: "Forensic Science", description: "Apply scientific methods to solve a crime scene investigation.", category: "Technology & STEM", participants: "Team" },
    { name: "Geospatial Technology", description: "Use GPS and GIS technology to solve real-world spatial problems.", category: "Technology & STEM", participants: "Team" },
    { name: "Software Development", description: "Design and develop software applications to solve specific problems.", category: "Technology & STEM", participants: "Team" },
    { name: "System Control Technology", description: "Design and program automated control systems.", category: "Technology & STEM", participants: "Team" },
    { name: "Technology Problem Solving", description: "Work as a team to solve technology-related problems under time constraints.", category: "Technology & STEM", participants: "Team" },
    // Digital Media & Design
    { name: "Audio Podcasting", description: "Create an original podcast on a technology-related topic.", category: "Digital Media & Design", participants: "Team" },
    { name: "Board Game Design", description: "Design and create an original board game with educational value.", category: "Digital Media & Design", participants: "Team" },
    { name: "Digital Video Production", description: "Produce a digital video on a specified theme using professional techniques.", category: "Digital Media & Design", participants: "Team" },
    { name: "Fashion Design and Technology", description: "Design and create fashion items incorporating technology.", category: "Digital Media & Design", participants: "Team" },
    { name: "Music Production", description: "Compose and produce original music using digital audio workstations.", category: "Digital Media & Design", participants: "Individual" },
    { name: "On Demand Video", description: "Create a video on a given topic within a limited time frame at the conference.", category: "Digital Media & Design", participants: "Team" },
    { name: "Photographic Technology", description: "Demonstrate photography skills through a themed portfolio.", category: "Digital Media & Design", participants: "Individual" },
    { name: "Promotional Design", description: "Create promotional materials for a product, service, or event.", category: "Digital Media & Design", participants: "Team" },
    { name: "Video Game Design", description: "Create engaging and educational video games with original concepts.", category: "Digital Media & Design", participants: "Team" },
    { name: "Virtual Reality Visualization (VR)", description: "Design and develop immersive virtual reality experiences.", category: "Digital Media & Design", participants: "Team" },
    { name: "Webmaster", description: "Design and develop functional websites with modern web technologies.", category: "Digital Media & Design", participants: "Team" },
    // Communication & Leadership
    { name: "Chapter Team", description: "Demonstrate chapter activities and achievements through a presentation.", category: "Communication & Leadership", participants: "Team" },
    { name: "Children's Stories", description: "Write and illustrate an original children's story about technology.", category: "Communication & Leadership", participants: "Individual" },
    { name: "Debating Technological Issues", description: "Debate current technological issues and their societal impacts.", category: "Communication & Leadership", participants: "Team" },
    { name: "Essays on Technology", description: "Write a comprehensive essay on a technology-related topic.", category: "Communication & Leadership", participants: "Individual" },
    { name: "Extemporaneous Speech", description: "Deliver an impromptu speech on a technology topic.", category: "Communication & Leadership", participants: "Individual" },
    { name: "Prepared Presentation", description: "Deliver a prepared presentation on a technology-related topic.", category: "Communication & Leadership", participants: "Individual" },
    { name: "Technology Bowl", description: "Compete in a quiz bowl format answering technology-related questions.", category: "Communication & Leadership", participants: "Team" },
    // Special Events
    { name: "Drone Challenge (UAV)", description: "Design, build, and fly unmanned aerial vehicles through obstacle courses.", category: "Special Events", participants: "Team" },
    { name: "Future Technology and Engineering Teacher", description: "Demonstrate teaching skills by creating and delivering a technology lesson.", category: "Special Events", participants: "Individual" },
    { name: "Senior Solar Sprint", description: "Design and build a solar-powered model vehicle.", category: "Special Events", participants: "Team" },
  ]

  const categories = [
    { name: "Engineering & Design", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", count: 11 },
    { name: "Technology & STEM", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", count: 7 },
    { name: "Digital Media & Design", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", count: 11 },
    { name: "Communication & Leadership", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", count: 7 },
    { name: "Special Events", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", count: 3 },
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

      {/* Detailed Competition Information */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">All TSA Competitions</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse all 39 official TSA high school competitions across five categories
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
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
                  <h4 className="text-2xl font-bold text-foreground">{cat.name}</h4>
                  <Badge variant="outline">{cat.count} Competitions</Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {detailedCompetitions
                    .filter((comp) => comp.category === cat.name)
                    .map((competition, index) => (
                      <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{competition.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {competition.participants}
                              </Badge>
                            </div>
                            <Trophy className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
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

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Compete?</h3>
            <p className="text-muted-foreground mb-6">
              Join our chapter and participate in these exciting competitions. Develop your skills, work with talented peers, and compete at regional, state, and national levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/signup">Join Our Chapter</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/my/submit">Submit Your Entry</Link>
              </Button>
            </div>
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
