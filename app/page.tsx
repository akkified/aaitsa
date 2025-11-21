// Completely redesigned homepage based on PDF mockup
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { Trophy, Users, Lightbulb, BookOpen, Award, ArrowRight, Mail } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero Section with Fading Image Effect */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?key=36gm9')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">AAI TSA</h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty mb-8">
              Alliance Academy International Technology Student Association - Empowering students through technology,
              innovation, and leadership in STEM competitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/my" className="text-lg font-medium text-primary hover:underline">
                Student Portal
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
              <Link href="/team" className="text-lg font-medium text-primary hover:underline">
                Meet Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join TSA Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-foreground mb-4">Why Join TSA?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              TSA is a Career and Technical Student Organization (CTSO) that prepares students for success in STEM
              fields through competitive events, leadership opportunities, and hands-on projects.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Lightbulb className="w-12 h-12 text-primary mb-3" />
                <CardTitle className="text-xl">Innovation & Creativity</CardTitle>
                <CardDescription className="text-base">
                  Explore cutting-edge technology and develop creative solutions to real-world problems through hands-on
                  projects and competitions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Trophy className="w-12 h-12 text-primary mb-3" />
                <CardTitle className="text-xl">Competitive Excellence</CardTitle>
                <CardDescription className="text-base">
                  Compete at regional, state, and national TSA conferences in coding, engineering, design, and
                  leadership events.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-3" />
                <CardTitle className="text-xl">Team Collaboration</CardTitle>
                <CardDescription className="text-base">
                  Work with talented peers, build lasting friendships, and develop teamwork skills essential for future
                  success.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Explore Our Chapter Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-foreground mb-4">Explore Our Chapter</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover what makes AAI TSA special
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="w-12 h-12 text-primary mb-2" />
                <CardTitle className="text-lg">Competitions</CardTitle>
                <CardDescription className="text-base mb-4">
                  Browse all TSA competition categories and find events that match your interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link href="/resources">
                    View Competitions <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="w-12 h-12 text-primary mb-2" />
                <CardTitle className="text-lg">Picture Gallery</CardTitle>
                <CardDescription className="text-base mb-4">
                  See our achievements, events, and memorable moments from competitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link href="/gallery">
                    View Gallery <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mb-2" />
                <CardTitle className="text-lg">Resources</CardTitle>
                <CardDescription className="text-base mb-4">
                  Access competition guidelines, learning materials, and helpful documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link href="/resources">
                    View Resources <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-2" />
                <CardTitle className="text-lg">About Us</CardTitle>
                <CardDescription className="text-base mb-4">
                  Learn about our chapter, leadership team, and upcoming events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link href="/team">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Quick Links Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Quick Links</h3>
            <p className="text-lg text-muted-foreground">General sources and helpful resources</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Georgia TSA</CardTitle>
                <CardDescription>Official Georgia TSA website with state-specific information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <a href="https://gatsa.org/" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>National TSA</CardTitle>
                <CardDescription>National Technology Student Association resources</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <a href="https://tsaweb.org/" target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competition Rules</CardTitle>
                <CardDescription>Official TSA competition rules and guidelines</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/resources">View Resources</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
