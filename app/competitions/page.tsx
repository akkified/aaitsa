import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Users, Award, ArrowLeft, Target } from "lucide-react"

export default function CompetitionsPage() {
  const competitions = [
    {
      id: 1,
      name: "Biotechnology Design",
      description: "Design and develop innovative biotechnology solutions to real-world problems.",
      level: "High School",
      participants: "Individual or Team",
      duration: "Full Year",
      category: "Engineering & Design",
      requirements: ["Research portfolio", "Design documentation", "Prototype presentation"],
    },
    {
      id: 2,
      name: "Engineering Design Process",
      description: "Apply systematic engineering methodology to solve complex challenges.",
      level: "High School",
      participants: "Individual or Team",
      duration: "Semester",
      category: "Engineering & Design",
      requirements: ["Process documentation", "Technical drawings", "Testing results"],
    },
    {
      id: 3,
      name: "Video Game Design",
      description: "Create engaging and educational video games with original concepts.",
      level: "High School",
      participants: "Team",
      duration: "Full Year",
      category: "Digital Design",
      requirements: ["Game prototype", "Design document", "Presentation"],
    },
    {
      id: 4,
      name: "Webmaster",
      description: "Design and develop functional websites with modern web technologies.",
      level: "High School",
      participants: "Team",
      duration: "Semester",
      category: "Digital Design",
      requirements: ["Website development", "Code documentation", "Live demonstration"],
    },
    {
      id: 5,
      name: "Flight Endurance",
      description: "Design and build aircraft for maximum flight duration and efficiency.",
      level: "High School",
      participants: "Individual or Team",
      duration: "Semester",
      category: "Aerospace Engineering",
      requirements: ["Aircraft design", "Flight testing", "Performance analysis"],
    },
    {
      id: 6,
      name: "Structural Engineering",
      description: "Design and build structures to withstand specific loads and conditions.",
      level: "High School",
      participants: "Individual or Team",
      duration: "Semester",
      category: "Civil Engineering",
      requirements: ["Structural analysis", "Design plans", "Load testing"],
    },
  ]

  const categories = [
    { name: "Engineering & Design", color: "bg-blue-100 text-blue-800" },
    { name: "Digital Design", color: "bg-green-100 text-green-800" },
    { name: "Aerospace Engineering", color: "bg-purple-100 text-purple-800" },
    { name: "Civil Engineering", color: "bg-orange-100 text-orange-800" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
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
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">TSA Competitions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty mb-8">
              Explore the exciting world of technology competitions where innovation meets creativity
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Badge key={category.name} className={`${category.color} border`}>
                  {category.name}
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

      {/* Competitions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <Card key={competition.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">{competition.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {competition.category}
                      </Badge>
                    </div>
                    <Target className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{competition.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{competition.participants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{competition.duration}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {competition.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
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
