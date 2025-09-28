import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock data for admin dashboard
const mockAdminData = {
  totalUsers: 1247,
  totalConversations: 3891,
  flaggedMessages: [
    {
      id: "1",
      user: "user123@email.com",
      message:
        "I've been feeling really depressed lately and sometimes think about ending it all. Nothing seems to matter anymore.",
      timestamp: "2024-01-15 14:30",
      flaggedWords: ["depressed", "ending it all"],
    },
    {
      id: "2",
      user: "anonymous_user_456",
      message: "I can't take this anymore. I feel suicidal and don't know what to do. Everything is falling apart.",
      timestamp: "2024-01-15 12:15",
      flaggedWords: ["suicidal", "can't take this"],
    },
    {
      id: "3",
      user: "helpme789@gmail.com",
      message: "I've been having thoughts of self-harm again. The depression is getting worse and I feel hopeless.",
      timestamp: "2024-01-15 09:45",
      flaggedWords: ["self-harm", "depression", "hopeless"],
    },
  ],
  recentMessages: [
    {
      id: "1",
      user: "user1@email.com",
      message:
        "Thank you for listening. I'm feeling much better after our conversation about anxiety management techniques.",
      timestamp: "2024-01-15 16:20",
    },
    {
      id: "2",
      user: "student_user",
      message:
        "The breathing exercises you suggested really helped during my panic attack. I'm grateful for this support.",
      timestamp: "2024-01-15 15:45",
    },
    {
      id: "3",
      user: "working_parent",
      message: "I'm struggling to balance work and family life. The stress is overwhelming sometimes.",
      timestamp: "2024-01-15 14:10",
    },
    {
      id: "4",
      user: "college_student",
      message:
        "Finals week is approaching and I'm feeling really anxious about my performance. Any tips for managing study stress?",
      timestamp: "2024-01-15 13:30",
    },
    {
      id: "5",
      user: "new_user_2024",
      message:
        "This is my first time using a mental health chatbot. I'm not sure where to start but I need someone to talk to.",
      timestamp: "2024-01-15 12:50",
    },
  ],
  notifications: [
    {
      id: "1",
      type: "warning" as const,
      message: "High-risk message detected requiring immediate review",
      timestamp: "2024-01-15 14:30",
    },
    {
      id: "2",
      type: "error" as const,
      message: "System alert: Multiple flagged messages from same user",
      timestamp: "2024-01-15 12:15",
    },
    {
      id: "3",
      type: "info" as const,
      message: "Daily user engagement report is ready for review",
      timestamp: "2024-01-15 09:00",
    },
    {
      id: "4",
      type: "warning" as const,
      message: "Unusual spike in crisis-related conversations detected",
      timestamp: "2024-01-15 08:30",
    },
  ],
}

export async function GET() {
  try {
    // Check if admin is authenticated
    const cookieStore = await cookies()
    const adminSession = cookieStore.get("admin_session")

    if (!adminSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Admin login required",
        },
        { status: 401 },
      )
    }

    // In production, you would fetch real data from database
    return NextResponse.json({
      success: true,
      data: mockAdminData,
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
