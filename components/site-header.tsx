"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/resources", label: "Resources" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" },
    { href: "/my", label: "Student Portal" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - TSA Style */}
          <Link href="/" className="flex items-center gap-3 font-bold text-lg">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">TSA</span>
            </div>
            <span className="text-white hidden sm:inline">AAI TSA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors border-b-2 border-transparent hover:border-white/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-white/20 pt-4">
            {navItems.map((item, index) => (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
