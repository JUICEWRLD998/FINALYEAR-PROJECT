import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Admin logout API - clears the admin session cookie
export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("admin_session")

    return NextResponse.json({
      success: true,
      message: "Admin logged out successfully",
    })
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
