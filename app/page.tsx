import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Trophy, Users, Lightbulb, Calendar, BookOpen, Award, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
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
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link href="/my">
              <Button variant="default">Student Portal</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-foreground font-bold text-3xl">AA</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Welcome to Alliance Academy TSA
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty mb-8">
              Empowering students through technology, innovation, and leadership. Join us in exploring STEM, competing
              at state and national levels, and building the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/auth/login">
                  Login to Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              New member?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Join TSA?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover opportunities to grow, compete, and connect with fellow technology enthusiasts
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Lightbulb className="w-12 h-12 text-primary mb-3" />
                <CardTitle className="text-xl">Innovation & Creativity</CardTitle>
                <CardDescription className="text-base">
                  Explore cutting-edge technology and develop creative solutions to real-world problems through hands-on
                  projects
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Trophy className="w-12 h-12 text-primary mb-3" />
                <CardTitle className="text-xl">Competitive Excellence</CardTitle>
                <CardDescription className="text-base">
                  Compete at regional, state, and national TSA conferences in coding, engineering, design, and
                  leadership events
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-3" />
                <CardTitle className="text-xl">Team Collaboration</CardTitle>
                <CardDescription className="text-base">
                  Work with talented peers, build lasting friendships, and develop teamwork skills essential for future
                  success
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore Our Chapter</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Everything you need to know about our chapter and how to get involved
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Competitions</CardTitle>
                <CardDescription className="text-base mb-4">
                  Browse all TSA competition categories and find events that match your interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link href="/competitions">
                    View Competitions <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Resources</CardTitle>
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
                <Award className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Gallery</CardTitle>
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
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>About Us</CardTitle>
                <CardDescription className="text-base mb-4">
                  Learn about our chapter, leadership team, and upcoming events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link href="/about">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get Involved</h3>
              <p className="text-lg text-muted-foreground text-pretty">
                Join us for weekly meetings, competitions, and special events throughout the year
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Weekly Meetings
                  </CardTitle>
                  <CardDescription className="text-base">
                    Collaborate on projects, prepare for competitions, and learn new skills every week during the school
                    year
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Competitions
                  </CardTitle>
                  <CardDescription className="text-base">
                    Compete at regional and state conferences with opportunities to advance to nationals
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Join Alliance Academy TSA today and start your journey in technology, innovation, and leadership
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/auth/signup">Join Our Chapter</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg bg-transparent">
                <Link href="/about">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Alliance Academy TSA Chapter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
