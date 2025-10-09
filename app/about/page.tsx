import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, BookOpen, Users, Mail, Trophy, Lightbulb, User } from "lucide-react"

export default function AboutPage() {
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
            <Link href="/my">
              <Button variant="default">Student Portal</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Welcome to Alliance Academy TSA
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Empowering students through technology, innovation, and leadership in the Technology Student Association
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground mb-6 text-center">About Our Chapter</h3>
            <p className="text-lg text-muted-foreground mb-4 text-pretty">
              The Alliance Academy TSA chapter is dedicated to fostering innovation, creativity, and technical
              excellence among our students. We participate in competitive events, collaborate on projects, and develop
              skills that prepare us for future careers in STEM fields.
            </p>
            <p className="text-lg text-muted-foreground text-pretty">
              Our chapter competes at regional, state, and national levels in various technology competitions, from
              coding and engineering to digital design and leadership challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Leadership Team</h3>
          <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <User className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle>Dr. Bryan Fagan</CardTitle>
                <CardDescription className="text-base">Chapter Advisor</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <User className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle>Sean Track</CardTitle>
                <CardDescription className="text-base">President</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <User className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle>Shreyas Yeldandi</CardTitle>
                <CardDescription className="text-base">Vice President</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Lightbulb className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Innovation</CardTitle>
                <CardDescription>
                  Explore cutting-edge technology and develop creative solutions to real-world problems
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Collaboration</CardTitle>
                <CardDescription>Work with talented peers on team projects and competitive events</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Competition</CardTitle>
                <CardDescription>Compete at regional, state, and national TSA conferences</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Upcoming Events</h3>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <CardTitle>Regional Competition</CardTitle>
                    <CardDescription className="mt-2">
                      Join us for the regional TSA competition featuring coding, engineering, and design challenges.
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">Date: TBA</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <CardTitle>State Conference</CardTitle>
                    <CardDescription className="mt-2">
                      Compete at the state level and qualify for nationals. Multiple competition categories available.
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">Date: TBA</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Calendar className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <CardTitle>Chapter Meetings</CardTitle>
                    <CardDescription className="mt-2">
                      Weekly meetings to work on projects, prepare for competitions, and learn new skills.
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">Every week during school year</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Resources</h3>
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Competition Guidelines</CardTitle>
                <CardDescription>Access official TSA competition rules and guidelines for all events</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="https://gatsa.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit Georgia TSA →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Student Portal</CardTitle>
                <CardDescription>
                  Submit projects, track your progress, and manage your TSA participation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/my" className="text-primary hover:underline">
                  Go to Portal →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h3>
            <p className="text-lg text-muted-foreground mb-6 text-pretty">
              Have questions about joining TSA or participating in competitions? Contact our chapter advisors.
            </p>
            <a href="mailto:tsa@alliance.forsyth.k12.ga.us" className="text-primary hover:underline text-lg">
              tsa@alliance.forsyth.k12.ga.us
            </a>
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
