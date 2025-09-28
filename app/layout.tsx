import type React from "react"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

export const metadata: Metadata = {
  title: "Zoebot - Mental Health Support",
  description: "Professional mental health sessions: breathing exercises, sleep stories, music, mindfulness and more. Your compassionate mental health companion.",
  generator: "v0.dev",
  keywords: ["mental health", "breathing exercises", "mindfulness", "meditation", "wellness", "therapy", "anxiety", "stress relief"],
  robots: "index, follow",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
