import { NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for demo purposes
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (users.has(email)) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Create new user
    const user = { name, email }
    users.set(email, user)

    // Create a simple session
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
