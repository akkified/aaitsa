"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image" // Added Image component for optimization
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, LogIn, LogOut, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
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

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Logo Section */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Logo Container */}
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
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="h-4 w-px bg-border mx-2 hidden sm:block" />

          {/* Conditional Auth Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Button 
                asChild 
                variant="ghost" 
                className="hidden sm:flex items-center gap-2 font-black uppercase text-[10px] tracking-widest px-4 rounded-full text-muted-foreground hover:text-primary transition-all"
              >
                <Link href="/my/profile">
                  <UserIcon className="h-3.5 w-3.5" />
                  Profile
                </Link>
              </Button>

              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="hidden sm:flex items-center gap-2 font-black uppercase text-[10px] tracking-widest px-6 rounded-full border-destructive/50 text-destructive hover:bg-destructive hover:text-white transition-all active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              asChild 
              variant="default" 
              className="hidden sm:flex items-center gap-2 font-black uppercase text-[10px] tracking-widest px-6 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <Link href="/auth/login">
                <LogIn className="h-3.5 w-3.5" />
                Portal Access
              </Link>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden rounded-full">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}