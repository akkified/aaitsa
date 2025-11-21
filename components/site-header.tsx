import Link from "next/link"
import { Trophy } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="bg-[#1c4587] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Trophy className="w-7 h-7 text-[#1c4587]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AAI TSA</h1>
              <p className="text-sm text-blue-100">Alliance Academy</p>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-blue-100 transition-colors">
                Home
              </Link>
              <Link href="/resources" className="text-sm font-medium hover:text-blue-100 transition-colors">
                Resources
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-blue-100 transition-colors">
                About
              </Link>
            </div>
            <Link href="/my" className="text-sm font-medium hover:text-blue-100 transition-colors">
              Student Portal
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
