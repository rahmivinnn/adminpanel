"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart,
  CreditCard,
  HeadphonesIcon,
  Bell,
  Settings,
  Menu,
  Key,
  DollarSign,
  BankIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  href: string
  onClick?: () => void
}

function NavItem({ icon, label, isActive, href, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive ? "bg-blue-100 text-blue-700" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { label: "OVERVIEW", type: "header" },
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/" },
    { label: "Meditation Management", icon: <HeadphonesIcon size={18} />, href: "/meditation" },
    { label: "Sleep Stories", icon: <BookOpen size={18} />, href: "/sleep-stories" },
    { label: "User Analytics", icon: <BarChart size={18} />, href: "/analytics" },
    { label: "Subscription Management", icon: <CreditCard size={18} />, href: "/subscriptions" },
    { label: "Payment Processing", icon: <DollarSign size={18} />, href: "/payments" },
    { label: "Withdrawals", icon: <BankIcon size={18} />, href: "/withdrawals" },
    { label: "Customer Support", icon: <Users size={18} />, href: "/support" },
    { label: "Notifications & Reminders", icon: <Bell size={18} />, href: "/notifications" },
    { label: "API Tokens", icon: <Key size={18} />, href: "/api-tokens" },
    { label: "Admin Settings", icon: <Settings size={18} />, href: "/settings" },
  ]

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false)
    router.push(href)
  }

  const getIsActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const sidebarContent = (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/hushhly-logo.png" alt="Hushhly" width={120} height={40} className="h-auto" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) =>
            item.type === "header" ? (
              <div key={index} className="px-3 py-2 text-xs font-medium text-muted-foreground">
                {item.label}
              </div>
            ) : (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={getIsActive(item.href)}
                onClick={() => handleNavClick(item.href)}
              />
            ),
          )}
        </nav>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden w-64 border-r bg-white md:block">{sidebarContent}</aside>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-3 left-3 z-10">
            <Menu />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  )
}

