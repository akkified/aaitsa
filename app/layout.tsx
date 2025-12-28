import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Link from "next/link"
import { Command, Github, Instagram, Mail, ExternalLink } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "AAI TSA | Alliance Academy",
  description: "Official Chapter of Alliance Academy International Technology Student Association",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            
            <main className="flex-1">
              <Suspense fallback={null}>{children}</Suspense>
            </main>

            {/* --- INTEGRATED FOOTER --- */}
            <footer className="border-t border-border bg-card/30">
              <div className="container px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  
                  {/* Brand Column */}
                  <div className="md:col-span-2 space-y-6">
                    <Link href="/" className="flex items-center space-x-2 group">
                      <div className="bg-primary p-1 rounded">
                        <Command className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-black tracking-tighter text-xl italic uppercase">
                        AAI <span className="text-primary">TSA</span>
                      </span>
                    </Link>
                    <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                      Alliance Academy International Technology Student Association. 
                      Developing technical leaders through rigorous competition and collaborative innovation.
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <Link href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
                      <Link href="#" className="hover:text-primary transition-colors"><Github className="h-5 w-5" /></Link>
                      <Link href="mailto:contact@aaitsa.org" className="hover:text-primary transition-colors"><Mail className="h-5 w-5" /></Link>
                    </div>
                  </div>

                  {/* Links Column 1 */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-foreground">Navigation</h4>
                    <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                      <li><Link href="/resources" className="hover:text-primary transition-colors">Competitions</Link></li>
                      <li><Link href="/gallery" className="hover:text-primary transition-colors">Chapter Gallery</Link></li>
                      <li><Link href="/about" className="hover:text-primary transition-colors">Officer Team</Link></li>
                      <li><Link href="/my" className="hover:text-primary transition-colors">Member Portal</Link></li>
                    </ul>
                  </div>

                  {/* Links Column 2 */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-foreground">External</h4>
                    <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                      <li>
                        <a href="https://tsaweb.org" target="_blank" className="hover:text-primary transition-colors flex items-center gap-1">
                          National TSA <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                      <li>
                        <a href="https://gatsa.org" target="_blank" className="hover:text-primary transition-colors flex items-center gap-1">
                          Georgia TSA <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    </ul>
                  </div>

                </div>

                <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-tighter">
                    © 2025 ALLIANCE ACADEMY TSA.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Built by <span className="text-foreground font-bold italic">goons</span>
                  </p>
                </div>
              </div>
            </footer>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}