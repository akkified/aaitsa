import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Calendar, Trophy } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function GalleryPage() {
  const galleryItems = [
    {
      id: 1,
      title: "Regional Competition 2024",
      description: "Our team showcasing their biotechnology design project at the regional TSA competition.",
      date: "March 2024",
      category: "Competitions",
      achievements: ["2nd Place Biotechnology Design", "3rd Place Engineering Design"],
    },
    {
      id: 2,
      title: "State Conference",
      description: "Representing Alliance Academy at the Georgia TSA State Conference.",
      date: "April 2024",
      category: "Competitions",
      achievements: ["1st Place Video Game Design", "2nd Place Webmaster"],
    },
    {
      id: 3,
      title: "Project Showcase",
      description: "Students presenting their engineering design projects to the school community.",
      date: "January 2024",
      category: "Presentations",
      achievements: ["Community Recognition Award"],
    },
    {
      id: 4,
      title: "Chapter Meeting",
      description: "Weekly chapter meeting where students collaborate on projects and prepare for competitions.",
      date: "February 2024",
      category: "Events",
      achievements: [],
    },
    {
      id: 5,
      title: "Leadership Retreat",
      description: "Chapter officers planning activities and setting goals for the academic year.",
      date: "August 2023",
      category: "Leadership",
      achievements: [],
    },
    {
      id: 6,
      title: "Workshop Session",
      description: "Learning advanced programming techniques for web development competitions.",
      date: "November 2023",
      category: "Education",
      achievements: [],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-balance">Chapter Gallery</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Explore our achievements, events, and memorable moments from competitions and chapter activities
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-primary/10 cursor-pointer group"
              >
                <div className="aspect-video bg-muted flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                  <ImageIcon className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
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

      {/* Recent Achievements Summary */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Recent Achievements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Regional Champions", year: "2024", category: "Biotechnology Design" },
                { title: "State Qualifiers", year: "2024", category: "Multiple Events" },
                { title: "Chapter Excellence Award", year: "2023", category: "Overall Performance" },
                { title: "Innovation Award", year: "2023", category: "Engineering Design" },
              ].map((achievement, index) => (
                <Card key={index} className="border-primary/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-primary" />
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

      <SiteFooter />
    </div>
  )
}
