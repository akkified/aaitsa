import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, BookOpen, Users, Mail, Trophy, Lightbulb, User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

interface AboutContent {
  id: string
  section_key: string
  title: string
  content: string
  order_index: number
  is_active: boolean
}

export default async function AboutPage() {
  const supabase = await createClient()

  // Get about page content from database
  const { data: content } = await supabase
    .from("about_page_content")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true })

  // Helper function to get content by section key
  const getContent = (sectionKey: string) => {
    return content?.find((item) => item.section_key === sectionKey)
  }

  const heroContent = getContent("hero")
  const aboutContent = getContent("about")
  const leadershipContent = getContent("leadership")
  const advisorContent = getContent("advisor")
  const presidentContent = getContent("president")
  const vicePresidentContent = getContent("vice_president")
  const contactContent = getContent("contact")
  const contactEmailContent = getContent("contact_email")
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {heroContent?.title || "Welcome to Alliance Academy TSA"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            {heroContent?.content ||
              "Empowering students through technology, innovation, and leadership in the Technology Student Association"}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-foreground mb-6 text-center">
              {aboutContent?.title || "About Our Chapter"}
            </h3>
            <div className="text-lg text-muted-foreground text-pretty whitespace-pre-line">
              {aboutContent?.content ||
                `The Alliance Academy TSA chapter is dedicated to fostering innovation, creativity, and technical excellence among our students. We participate in competitive events, collaborate on projects, and develop skills that prepare us for future careers in STEM fields.

Our chapter competes at regional, state, and national levels in various technology competitions, from coding and engineering to digital design and leadership challenges.`}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            {leadershipContent?.title || "Leadership Team"}
          </h3>
          <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <User className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle>{advisorContent?.title || "Dr. Bryan Fagan"}</CardTitle>
                <CardDescription className="text-base">{advisorContent?.content || "Chapter Advisor"}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <User className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle>{presidentContent?.title || "Sean Track"}</CardTitle>
                <CardDescription className="text-base">{presidentContent?.content || "President"}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <User className="w-12 h-12 text-primary mx-auto mb-3" />
                <CardTitle>{vicePresidentContent?.title || "Shreyas Yeldandi"}</CardTitle>
                <CardDescription className="text-base">
                  {vicePresidentContent?.content || "Vice President"}
                </CardDescription>
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

      

      {/* Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Explore More</h3>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Resources</CardTitle>
                <CardDescription>
                  Access competition guidelines, learning materials, and chapter information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/resources" className="text-primary hover:underline">
                  View Resources →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <Trophy className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Competitions</CardTitle>
                <CardDescription>Explore all TSA competition categories and requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/resources" className="text-primary hover:underline">
                  View Competitions →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Gallery</CardTitle>
                <CardDescription>See our achievements, events, and memorable moments</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/gallery" className="text-primary hover:underline">
                  View Gallery →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-foreground mb-4">{contactContent?.title || "Get in Touch"}</h3>
            <p className="text-lg text-muted-foreground mb-6 text-pretty">
              {contactContent?.content ||
                "Have questions about joining TSA or participating in competitions? Contact our chapter advisors."}
            </p>
            <a
              href={`mailto:${contactEmailContent?.content || "tsa@alliance.forsyth.k12.ga.us"}`}
              className="text-primary hover:underline text-lg"
            >
              {contactEmailContent?.content || "tsa@alliance.forsyth.k12.ga.us"}
            </a>
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
