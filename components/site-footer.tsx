import Link from "next/link"
import { Mail, MapPin } from "lucide-react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#0b2b58] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="font-bold mb-4 text-lg">AAI TSA</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Alliance Academy International Technology Student Association chapter dedicated to innovation and
              excellence in STEM education.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/resources", label: "Resources" },
                { href: "/team", label: "Team" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/70 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">General Sources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://tsaweb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  National TSA
                </a>
              </li>
              <li>
                <a
                  href="https://gatsa.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Georgia TSA
                </a>
              </li>
              <li>
                <Link href="/my" className="text-white/70 hover:text-white text-sm transition-colors">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>tsa@alliance.edu</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Cumming, Georgia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>&copy; {currentYear} Alliance Academy TSA. All rights reserved.</p>
            <p>Designed by Alliance Academy TSA Members</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
