"use client"

import type React from "react"
import { useState } from "react"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Icons
import { Mail, Lock, User, Shield, Eye, EyeOff } from 'lucide-react'

// Components
import { ThemeToggle } from "@/components/theme-toggle"

// Types
interface LoginFormProps {
  onLogin: (user: { email: string; name?: string }) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user")

  // Form states
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const endpoint = loginMode === "admin" ? "/api/admin/login" : "/api/auth/login"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        if (loginMode === "admin") {
          // Redirect to admin dashboard
          window.location.href = "/admin/dashboard"
        } else {
          onLogin({ email: loginData.email, name: data.name })
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onLogin({ email: signupData.email, name: signupData.name })
      } else {
        setError(data.error || "Signup failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4 transition-colors animate-in fade-in duration-700">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6 animate-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="text-center space-y-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Zoebot
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Your AI Mental Health Companion</p>
          </div>
        </div>

        {/* Login Mode Toggle */}
        <div className="flex justify-center">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setLoginMode("user")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                loginMode === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              User Login
            </button>
            <button
              onClick={() => setLoginMode("admin")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                loginMode === "admin"
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Admin Login
            </button>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors duration-300">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {loginMode === "admin" ? "Admin Access" : "Welcome Back"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {loginMode === "admin"
                ? "Access the admin dashboard"
                : "Sign in to continue your mental wellness journey"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loginMode === "admin" ? (
              /* Admin Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@zoebot.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="pl-10 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500 bg-white dark:bg-gray-700 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500 bg-white dark:bg-gray-700 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  {isLoading ? "Signing in..." : "Access Admin Dashboard"}
                </Button>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Demo credentials: admin@demo.com / admin123
                </div>
              </form>
            ) : (
              /* User Login/Signup Tabs */
              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                        <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={signupData.name}
                          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                          className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 transition-all duration-200"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-password"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                        <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 w-full">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Need help? Contact support@zoebot.com</p>
        </div>
      </div>
    </div>
  )
}
