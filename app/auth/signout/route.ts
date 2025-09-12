import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin

  if (error) {
    return NextResponse.redirect(new URL("/auth/error", origin))
  }

  return NextResponse.redirect(new URL("/", origin))
}
