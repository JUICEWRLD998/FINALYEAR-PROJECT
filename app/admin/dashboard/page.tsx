"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Shield,
  Users,
  MessageSquare,
  AlertTriangle,
  Bell,
  LogOut,
  BarChart3,
  Calendar,
  Clock,
  Flag,
} from "lucide-react"

interface AdminData {
  totalUsers: number
  totalConversations: number
  flaggedMessages: Array<{
    id: string
    user: string
    message: string
    timestamp: string
    flaggedWords: string[]
  }>
  recentMessages: Array<{
    id: string
    user: string
    message: string
    timestamp: string
  }>
  notifications: Array<{
    id: string
    type: "warning" | "info" | "error"
    message: string
    timestamp: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await fetch("/api/admin/data")
      if (response.status === 401) {
        router.push("/admin")
        return
      }

      const data = await response.json()
      if (data.success) {
        setAdminData(data.data)
      } else {
        setError("Failed to load admin data")
      }
    } catch (error) {
      setError("Network error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin")
    } catch (error) {
      router.push("/admin")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">MindfulBot Administration</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="flagged" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Flagged
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminData?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminData?.totalConversations || 0}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Flagged Messages</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminData?.flaggedMessages?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminData?.notifications?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Pending review</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events and user interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-muted-foreground">user@example.com joined 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">High engagement session</p>
                      <p className="text-xs text-muted-foreground">45-minute conversation completed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Message flagged for review</p>
                      <p className="text-xs text-muted-foreground">Contains concerning language</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent User Messages</CardTitle>
                <CardDescription>Latest conversations from users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData?.recentMessages?.map((msg) => (
                    <div key={msg.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{msg.user}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flagged Messages Tab */}
          <TabsContent value="flagged" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Flagged Messages
                </CardTitle>
                <CardDescription>Messages that require immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData?.flaggedMessages?.map((msg) => (
                    <div
                      key={msg.id}
                      className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">{msg.user}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {msg.timestamp}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {msg.flaggedWords.map((word) => (
                            <Badge key={word} variant="outline" className="text-xs bg-red-100 dark:bg-red-900/40">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{msg.message}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact User
                        </Button>
                        <Button size="sm" variant="outline">
                          Mark Safe
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Recent alerts and system messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData?.notifications?.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border rounded-lg p-4 ${
                        notification.type === "error"
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                          : notification.type === "warning"
                            ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
                            : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            notification.type === "error"
                              ? "destructive"
                              : notification.type === "warning"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {notification.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                      </div>
                      <p className="text-sm">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
