"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Shield, Trash2, Plus, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WhitelistPage() {
    const [emails, setEmails] = useState<any[]>([])
    const [newEmail, setNewEmail] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push("/auth/login"); return }

            const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
            if (!profile || !["admin", "officer"].includes(profile.role)) {
                router.push("/my")
                return
            }
            loadWhitelist()
        }
        checkAdmin()
    }, [router, supabase])

    const loadWhitelist = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from("whitelist_emails")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error loading whitelist:", error)
        } else {
            setEmails(data || [])
        }
        setIsLoading(false)
    }

    const handleAddEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newEmail) return

        setIsAdding(true)
        setMessage(null)

        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await supabase
            .from("whitelist_emails")
            .insert([{ email: newEmail.toLowerCase().trim(), added_by: user?.id }])

        if (error) {
            setMessage({ type: "error", text: error.code === "23505" ? "Email already in whitelist" : error.message })
        } else {
            setMessage({ type: "success", text: "Email added to whitelist" })
            setNewEmail("")
            loadWhitelist()
        }
        setIsAdding(false)
    }

    const handleDeleteEmail = async (id: string) => {
        const { error } = await supabase
            .from("whitelist_emails")
            .delete()
            .eq("id", id)

        if (error) {
            setMessage({ type: "error", text: error.message })
        } else {
            setMessage({ type: "success", text: "Email removed from whitelist" })
            loadWhitelist()
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Shield className="h-10 w-10 text-primary mx-auto mb-4 animate-pulse" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Loading Whitelist...</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <section className="relative pt-20 pb-10 border-b border-border/40">
                <div className="container px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase">Back to Dashboard</span>
                                </Link>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                                Email <br />
                                <span className="text-primary italic">Whitelist.</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container px-6 py-12 mx-auto max-w-4xl">
                <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl font-black uppercase tracking-tight">Add Authorized Email</CardTitle>
                        <CardDescription className="text-xs font-mono uppercase tracking-widest opacity-50">// Only emails on this list will be allowed to sign up</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddEmail} className="flex gap-4">
                            <div className="relative flex-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="student.name@forsyth.k12.ga.us"
                                    className="pl-12 h-14 bg-secondary/30 border-border rounded-2xl text-sm font-bold"
                                    type="email"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isAdding}
                                className="h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                            >
                                {isAdding ? "Adding..." : <><Plus className="mr-2 h-4 w-4" /> Add Email</>}
                            </Button>
                        </form>
                        {message && (
                            <div className={`mt-4 p-4 rounded-xl text-xs font-bold uppercase tracking-widest ${message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                                {message.text}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-0">
                        {emails.length > 0 ? (
                            <div className="divide-y divide-border/50">
                                {emails.map((item) => (
                                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{item.email}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-50">Added {new Date(item.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteEmail(item.id)}
                                            className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Mail className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 opacity-50">Whitelist is Empty</h3>
                                <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold opacity-30 italic">Add emails to restrict unauthorized signups</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
