"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, LogIn, LogOut, User as UserIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  React.useEffect(() => {
    setMounted(true)
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  // Handle body scroll lock and close menu on route change
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isMobileMenuOpen])

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Resources", href: "/resources" },
  ]

  if (user) {
    navLinks.push({ name: "Portal", href: "/my" })
  }

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Logo Section */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-8 h-8 transition-all group-hover:scale-110">
              <Image 
                src="/logo.png" 
                alt="AAI TSA Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-black tracking-tighter text-xl italic uppercase">
              AAI <span className="text-primary">TSA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-primary relative py-1",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 hover:bg-secondary transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && (
              theme === "dark" ? (
                <Sun className="h-[1.1rem] w-[1.1rem] text-yellow-500" />
              ) : (
                <Moon className="h-[1.1rem] w-[1.1rem] text-slate-900" />
              )
            )}
          </Button>

          <div className="h-4 w-px bg-border mx-2 hidden sm:block" />

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" className="rounded-full font-black uppercase text-[10px] tracking-widest px-4">
                  <Link href="/my/profile"><UserIcon className="h-3.5 w-3.5 mr-2" />Profile</Link>
                </Button>
                <Button onClick={handleLogout} variant="outline" className="rounded-full font-black uppercase text-[10px] tracking-widest px-6 border-destructive/50 text-destructive hover:bg-destructive hover:text-white">
                  <LogOut className="h-3.5 w-3.5 mr-2" />Sign Out
                </Button>
              </>
            ) : (
              <Button asChild variant="default" className="rounded-full bg-primary text-white font-black uppercase text-[10px] tracking-widest px-6">
                <Link href="/auth/login"><LogIn className="h-3.5 w-3.5 mr-2" />Portal Access</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full z-[110]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Darker backdrop to focus on menu */}
          <div className="fixed inset-0 top-16 bg-background/80 backdrop-blur-sm z-[90] md:hidden animate-in fade-in duration-200" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* Menu Content */}
          <div className="fixed top-16 left-0 right-0 z-[100] bg-card border-b border-border md:hidden animate-in slide-in-from-top-full duration-300 shadow-2xl">
            <nav className="flex flex-col p-8 gap-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-3xl font-black uppercase tracking-tighter italic border-b border-border/50 pb-4 flex items-center justify-between group",
                    pathname === link.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.name}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">→</span>
                </Link>
              ))}
              
              <div className="pt-6 flex flex-col gap-4">
                {user ? (
                  <>
                    <Button asChild variant="secondary" className="w-full h-16 rounded-none font-black uppercase tracking-widest italic justify-start px-8">
                      <Link href="/my/profile"><UserIcon className="mr-4 h-6 w-6" /> My Profile</Link>
                    </Button>
                    <Button onClick={handleLogout} variant="destructive" className="w-full h-16 rounded-none font-black uppercase tracking-widest italic justify-start px-8">
                      <LogOut className="mr-4 h-6 w-6" /> Log Out Terminal
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full h-16 rounded-none font-black uppercase tracking-widest italic bg-primary text-white text-lg">
                    <Link href="/auth/login"><LogIn className="mr-4 h-6 w-6" /> Portal Access</Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}