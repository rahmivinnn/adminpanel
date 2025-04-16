"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/toast-provider"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && pathname !== "/login") {
      router.push("/login")
    }

    // If logged in and on login page, redirect to dashboard
    if (isLoggedIn && pathname === "/login") {
      router.push("/")
    }
  }, [pathname, router])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ToastProvider>
        {/* Always render children, but they might be redirected */}
        {children}
        <Toaster />
      </ToastProvider>
    </ThemeProvider>
  )
}

