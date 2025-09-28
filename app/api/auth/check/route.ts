import { NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for demo purposes
const users = new Map()

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value

    if (!session) {
      return NextResponse.json({ isAuthenticated: false })
    }

    // Check if user exists
    const user = users.get(session)
    if (!user) {
      return NextResponse.json({ isAuthenticated: false })
    }

    return NextResponse.json({ 
      isAuthenticated: true, 
      user: { email: user.email, name: user.name }
    })
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false })
  }
}
