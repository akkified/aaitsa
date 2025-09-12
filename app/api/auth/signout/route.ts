import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin

  // In a real app, this would clear server-side sessions
  console.log("[v0] API signout called")

  return NextResponse.redirect(new URL("/", origin))
}
