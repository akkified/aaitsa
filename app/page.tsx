"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, Users, BookOpen, ArrowRight, Star, Target, Lightbulb } from "lucide-react"
import CountUp from '@/components/CountUp'
import RotatingText from '@/components/RotatingText'
import TextType from '@/components/TextType';



export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="logo.png" alt="" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-foreground">Alliance Academy</h1>
                <p className="text-sm text-muted-foreground">Technology Student Association</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="#events" className="text-foreground hover:text-primary transition-colors">
                Events
              </Link>
              <Link href="#resources" className="text-foreground hover:text-primary transition-colors">
                Resources
              </Link>
              <Link href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Button asChild>
                <Link href="/my">Student Portal</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Technology Student Association
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Innovating the Future With 
            <RotatingText
              texts={['Collaboration', 'Education', 'Coding', 'Engineering', 'Design']}
              mainClassName="text-primary px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={3000}
            />
          </h1>
          <TextType
            className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto" 
            text={["Join Alliance Academy's TSA chapter where students explore STEM careers, compete in technology competitions,and develop leadership skills for tomorrows challenges"]}
            typingSpeed={50}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/my">
                Join Our Chapter <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CountUp
                  from={0}
                  to={150}
                  separator=","
                  direction="up"
                  duration={0.75}
                  className="count-up-text"
                />
              +</div>
              <div className="text-muted-foreground">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CountUp
                  from={0}
                  to={25}
                  separator=","
                  direction="up"
                  duration={0.75}
                  className="count-up-text"
                />
              +</div>
              <div className="text-muted-foreground">Competitions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CountUp
                  from={0}
                  to={20}
                  separator=","
                  direction="up"
                  duration={0.75}
                  className="count-up-text"
                />
              +</div>
              <div className="text-muted-foreground">State Awards</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                <CountUp
                  from={0}
                  to={5}
                  separator=","
                  direction="up"
                  duration={0.75}
                  className="count-up-text"
                />
              +</div>
              <div className="text-muted-foreground">National Qualifiers</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Our Chapter</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              The Technology Student Association (TSA) is a national organization devoted to students engaged in
              science, technology, engineering, and mathematics (STEM).
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To promote technological literacy, leadership, and problem-solving skills through engaging STEM
                  activities and competitions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lightbulb className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Innovation Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Students explore cutting-edge technologies including robotics, programming, engineering design, and
                  digital media production.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our chapter consistently ranks among the top performers in state and national TSA competitions across
                  multiple categories.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-xl text-muted-foreground">
              Stay updated with our latest competitions, meetings, and activities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Competition</Badge>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle>State TSA Conference</CardTitle>
                <CardDescription>March 15-17, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Annual state-level competition featuring 40+ events across all STEM disciplines.
                </p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Workshop</Badge>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle>Robotics Workshop</CardTitle>
                <CardDescription>February 28, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Hands-on workshop covering robot design, programming, and competition strategies.
                </p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Register
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Meeting</Badge>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle>Chapter Meeting</CardTitle>
                <CardDescription>Every Friday, 3:30 PM</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Weekly meetings to discuss projects, plan events, and prepare for competitions.
                </p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Join Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Resources</h2>
            <p className="text-xl text-muted-foreground">
              Access helpful materials, guidelines, and tools for TSA success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Competition Guidelines</CardTitle>
                <CardDescription>Official rules and requirements for all TSA events</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Event descriptions and rules</li>
                  <li>• Submission requirements</li>
                  <li>• Judging criteria</li>
                  <li>• Timeline and deadlines</li>
                </ul>
                <Button className="mt-4 bg-transparent" variant="outline">
                  View Guidelines
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member Resources</CardTitle>
                <CardDescription>Tools and materials for chapter members</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Project templates</li>
                  <li>• Software tutorials</li>
                  <li>• Meeting schedules</li>
                  <li>• Contact information</li>
                </ul>
                <Button className="mt-4 bg-transparent" variant="outline" asChild>
                  <Link href="/my">Access Portal</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Involved</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ready to join our innovative community? Contact us to learn more about membership opportunities and upcoming
            events.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="font-semibold mb-2">Faculty Advisor</h3>
              <p className="text-muted-foreground">Dr. Fagan</p>
              <p className="text-sm text-muted-foreground">f39844@forsythk12.org</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Chapter President</h3>
              <p className="text-muted-foreground">Sean Track</p>
              <p className="text-sm text-muted-foreground">115787@forsythk12.org
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Chapter Vice President</h3>
              <p className="text-muted-foreground">Shreyas Yeldandi</p>
              <p className="text-sm text-muted-foreground">154566@forsythk12.org
              </p>
            </div>
          </div>

          <Button size="lg" asChild>
            <Link href="/my">Join Our Chapter Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="logo.png" alt="" />
              </div>
                <span className="font-semibold">Alliance Academy TSA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering students through technology education and innovation.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-primary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#events" className="hover:text-primary">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="#resources" className="hover:text-primary">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/my" className="hover:text-primary">
                    Student Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://tsaweb.org/" className="hover:text-primary">
                    TSA National
                  </a>
                </li>
                <li>
                  <a href="https://tsaweb.org/competitions#highschool" className="hover:text-primary">
                    Competition Rules
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Member Handbook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Calendar
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Alliance Academy</li>
                <li>11100 Lanier 400 Parkway</li>
                <li>Cumming, Georgia 30040</li>
                <li>470-695-7823</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Alliance Academy TSA Chapter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
