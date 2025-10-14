import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, ArrowLeft, Target } from "lucide-react"

export default function CompetitionsPage() {
  const competitions = [
    // Engineering & Design
    {
      id: 1,
      name: "Animatronics",
      description: "Design and create an animatronic device that performs a specific task or tells a story.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      id: 2,
      name: "Architectural Design",
      description: "Use architectural design principles to create detailed plans for a structure.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      id: 3,
      name: "Biotechnology Design",
      description: "Design and develop innovative biotechnology solutions to real-world problems.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      id: 4,
      name: "CAD Architecture",
      description: "Create architectural designs using computer-aided design software.",
      category: "Engineering & Design",
      participants: "Individual",
    },
    {
      id: 5,
      name: "CAD Engineering",
      description: "Develop engineering designs and technical drawings using CAD software.",
      category: "Engineering & Design",
      participants: "Individual",
    },
    {
      id: 6,
      name: "Dragster Design",
      description: "Design, construct, and race a CO2-powered dragster vehicle.",
      category: "Engineering & Design",
      participants: "Individual",
    },
    {
      id: 7,
      name: "Engineering Design",
      description: "Apply systematic engineering methodology to solve complex challenges.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      id: 8,
      name: "Flight Endurance",
      description: "Design and build aircraft for maximum flight duration and efficiency.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      id: 9,
      name: "Manufacturing Prototype",
      description: "Design and manufacture a product prototype using modern manufacturing techniques.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      id: 10,
      name: "Structural Design and Engineering",
      description: "Design and build structures to withstand specific loads and conditions.",
      category: "Engineering & Design",
      participants: "Team",
    },
    {
      id: 11,
      name: "Transportation Modeling",
      description: "Design and build a scale model of a transportation vehicle or system.",
      category: "Engineering & Design",
      participants: "Individual",
    },
    // Technology & STEM
    {
      id: 12,
      name: "Coding",
      description: "Demonstrate programming skills by solving computational problems.",
      category: "Technology & STEM",
      participants: "Individual",
    },
    {
      id: 13,
      name: "Data Science & Analytics",
      description: "Analyze data sets and present findings using data science techniques.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      id: 14,
      name: "Forensic Science",
      description: "Apply scientific methods to solve a crime scene investigation.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      id: 15,
      name: "Geospatial Technology",
      description: "Use GPS and GIS technology to solve real-world spatial problems.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      id: 16,
      name: "Software Development",
      description: "Design and develop software applications to solve specific problems.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      id: 17,
      name: "System Control Technology",
      description: "Design and program automated control systems.",
      category: "Technology & STEM",
      participants: "Team",
    },
    {
      id: 18,
      name: "Technology Problem Solving",
      description: "Work as a team to solve technology-related problems under time constraints.",
      category: "Technology & STEM",
      participants: "Team",
    },
    // Digital Media & Design
    {
      id: 19,
      name: "Audio Podcasting",
      description: "Create an original podcast on a technology-related topic.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      id: 20,
      name: "Board Game Design",
      description: "Design and create an original board game with educational value.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      id: 21,
      name: "Digital Video Production",
      description: "Produce a digital video on a specified theme using professional techniques.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      id: 22,
      name: "Fashion Design and Technology",
      description: "Design and create fashion items incorporating technology.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      id: 23,
      name: "Music Production",
      description: "Compose and produce original music using digital audio workstations.",
      category: "Digital Media & Design",
      participants: "Individual",
    },
    {
      id: 24,
      name: "On Demand Video",
      description: "Create a video on a given topic within a limited time frame at the conference.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      id: 25,
      name: "Photographic Technology",
      description: "Demonstrate photography skills through a themed portfolio.",
      category: "Digital Media & Design",
      participants: "Individual",
    },
    {
      id: 26,
      name: "Promotional Design",
      description: "Create promotional materials for a product, service, or event.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      id: 27,
      name: "Video Game Design",
      description: "Create engaging and educational video games with original concepts.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      id: 28,
      name: "Virtual Reality Visualization (VR)",
      description: "Design and develop immersive virtual reality experiences.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    {
      id: 29,
      name: "Webmaster",
      description: "Design and develop functional websites with modern web technologies.",
      category: "Digital Media & Design",
      participants: "Team",
    },
    // Communication & Leadership
    {
      id: 30,
      name: "Chapter Team",
      description: "Demonstrate chapter activities and achievements through a presentation.",
      category: "Communication & Leadership",
      participants: "Team",
    },
    {
      id: 31,
      name: "Children's Stories",
      description: "Write and illustrate an original children's story about technology.",
      category: "Communication & Leadership",
      participants: "Individual",
    },
    {
      id: 32,
      name: "Debating Technological Issues",
      description: "Debate current technological issues and their societal impacts.",
      category: "Communication & Leadership",
      participants: "Team",
    },
    {
      id: 33,
      name: "Essays on Technology",
      description: "Write a comprehensive essay on a technology-related topic.",
      category: "Communication & Leadership",
      participants: "Individual",
    },
    {
      id: 34,
      name: "Extemporaneous Speech",
      description: "Deliver an impromptu speech on a technology topic.",
      category: "Communication & Leadership",
      participants: "Individual",
    },
    {
      id: 35,
      name: "Prepared Presentation",
      description: "Deliver a prepared presentation on a technology-related topic.",
      category: "Communication & Leadership",
      participants: "Individual",
    },
    {
      id: 36,
      name: "Technology Bowl",
      description: "Compete in a quiz bowl format answering technology-related questions.",
      category: "Communication & Leadership",
      participants: "Team",
    },
    // Special Events
    {
      id: 37,
      name: "Drone Challenge (UAV)",
      description: "Design, build, and fly unmanned aerial vehicles through obstacle courses.",
      category: "Special Events",
      participants: "Team",
    },
    {
      id: 38,
      name: "Future Technology and Engineering Teacher",
      description: "Demonstrate teaching skills by creating and delivering a technology lesson.",
      category: "Special Events",
      participants: "Individual",
    },
    {
      id: 39,
      name: "Senior Solar Sprint",
      description: "Design and build a solar-powered model vehicle.",
      category: "Special Events",
      participants: "Team",
    },
  ]

  const categories = [
    { name: "Engineering & Design", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", count: 11 },
    { name: "Technology & STEM", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", count: 7 },
    {
      name: "Digital Media & Design",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      count: 11,
    },
    {
      name: "Communication & Leadership",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      count: 7,
    },
    { name: "Special Events", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", count: 3 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Trophy className="w-7 h-7 text-primary-foreground" />
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
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              TSA High School Competitions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty mb-8">
              Explore all 39 official TSA high school competitions across five categories
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Badge key={category.name} className={`${category.color} border`}>
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
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

      {/* Competitions by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {categories.map((category) => (
            <div key={category.name} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">{category.name}</h3>
                <Badge variant="outline">{category.count} Events</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions
                  .filter((comp) => comp.category === category.name)
                  .map((competition) => (
                    <Card key={competition.id} className="h-full hover:shadow-lg transition-shadow">
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
                        <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                          <Link href="/resources">View Resources</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Compete?</h3>
            <p className="text-muted-foreground mb-6">
              Join our chapter and participate in these exciting competitions. Develop your skills, work with talented
              peers, and compete at regional, state, and national levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/signup">Join Our Chapter</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/resources">Browse Resources</Link>
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
