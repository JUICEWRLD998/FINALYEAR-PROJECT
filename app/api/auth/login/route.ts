import { NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for demo purposes
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // For demo purposes, accept any email/password combination
    // In a real app, you'd validate against a database
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if user exists, if not create them
    let user = users.get(email)
    if (!user) {
      user = { email, name: email.split('@')[0] }
      users.set(email, user)
    }

    // Create a simple session (in production, use proper JWT or session management)
    const response = NextResponse.json({ 
      success: true, 
      user: { email: user.email, name: user.name }
    })
    
    // Set a simple session cookie
    response.cookies.set("session", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
