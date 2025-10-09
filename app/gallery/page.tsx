import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Image, Calendar, Users, Award, ArrowLeft, Camera, Trophy } from "lucide-react"

export default function GalleryPage() {
  const galleryItems = [
    {
      id: 1,
      title: "Regional Competition 2024",
      description: "Our team showcasing their biotechnology design project at the regional TSA competition.",
      date: "March 2024",
      category: "Competitions",
      image: "/api/placeholder/400/300", // Placeholder for now
      achievements: ["2nd Place Biotechnology Design", "3rd Place Engineering Design"],
    },
    {
      id: 2,
      title: "Chapter Meeting",
      description: "Weekly chapter meeting where students collaborate on projects and prepare for competitions.",
      date: "February 2024",
      category: "Chapter Activities",
      image: "/api/placeholder/400/300",
      achievements: [],
    },
    {
      id: 3,
      title: "State Conference",
      description: "Representing Alliance Academy at the Georgia TSA State Conference.",
      date: "April 2024",
      category: "Competitions",
      image: "/api/placeholder/400/300",
      achievements: ["1st Place Video Game Design", "2nd Place Webmaster"],
    },
    {
      id: 4,
      title: "Project Showcase",
      description: "Students presenting their engineering design projects to the school community.",
      date: "January 2024",
      category: "Presentations",
      image: "/api/placeholder/400/300",
      achievements: ["Community Recognition Award"],
    },
    {
      id: 5,
      title: "Leadership Retreat",
      description: "Chapter officers planning activities and setting goals for the academic year.",
      date: "August 2023",
      category: "Leadership",
      image: "/api/placeholder/400/300",
      achievements: [],
    },
    {
      id: 6,
      title: "Workshop Session",
      description: "Learning advanced programming techniques for web development competitions.",
      date: "November 2023",
      category: "Education",
      image: "/api/placeholder/400/300",
      achievements: [],
    },
  ]

  const achievements = [
    { title: "Regional Champions", year: "2024", category: "Biotechnology Design" },
    { title: "State Qualifiers", year: "2024", category: "Multiple Events" },
    { title: "Chapter Excellence Award", year: "2023", category: "Overall Performance" },
    { title: "Innovation Award", year: "2023", category: "Engineering Design" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Camera className="w-7 h-7 text-primary-foreground" />
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
              Chapter Gallery
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty mb-8">
              Explore our journey through photos, achievements, and memorable moments
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

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Image className="h-16 w-16 text-muted-foreground" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  
                  {item.achievements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        Achievements:
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {item.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Recent Achievements</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.category}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {achievement.year}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4">Be Part of Our Story</h3>
            <p className="text-muted-foreground mb-6">
              Join our chapter and create your own memorable moments. Participate in competitions, 
              collaborate on projects, and build lasting friendships.
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
