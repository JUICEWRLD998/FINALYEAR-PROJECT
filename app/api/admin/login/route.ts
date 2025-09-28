import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Simple admin authentication - In production, use proper authentication
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Basic validation
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 },
      )
    }

    // Hardcoded admin credentials - In production, use proper authentication
    const validCredentials = [
      { username: "admin", password: "admin123" },
      { username: "superadmin", password: "super123" },
    ]

    const isValidAdmin = validCredentials.some((cred) => cred.username === username && cred.password === password)

    if (isValidAdmin) {
      // Create admin session token
      const adminToken = Buffer.from(`admin:${username}:${Date.now()}`).toString("base64")

      // Set admin cookie
      const cookieStore = await cookies()
      cookieStore.set("admin_session", adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
        path: "/",
      })

      return NextResponse.json({
        success: true,
        message: "Admin login successful",
        admin: { username },
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid admin credentials",
      },
      { status: 401 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 },
    )
  }
}
