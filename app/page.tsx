"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, Search, LogOut, RefreshCw, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/sidebar"
import { StatsCard } from "@/components/stats-card"
import { RevenueChart } from "@/components/revenue-chart"
import { RecentActivityTable } from "@/components/recent-activity-table"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NotificationCenter } from "@/components/notification-center"

export default function Dashboard() {
  const router = useRouter()
  const { addToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<
    { id: number; title: string; message: string; read: boolean; time: Date }[]
  >([
    {
      id: 1,
      title: "New User Registration",
      message: "John Smith just registered as a new user",
      read: false,
      time: new Date(new Date().getTime() - 30 * 60000), // 30 minutes ago
    },
    {
      id: 2,
      title: "Payment Received",
      message: "You received a payment of $19.99 from Sarah Johnson",
      read: false,
      time: new Date(new Date().getTime() - 120 * 60000), // 2 hours ago
    },
    {
      id: 3,
      title: "System Update",
      message: "System maintenance scheduled for March 25, 2025",
      read: false,
      time: new Date("2025-03-21T22:15:00"),
    },
  ])
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("last6Months")
  const [selectedDataType, setSelectedDataType] = useState("all")
  const [username, setUsername] = useState("")

  // Update time every second for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Get username from localStorage and detect user
  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Detect user's device and location
    const detectUserInfo = () => {
      const userAgent = navigator.userAgent
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const browser = userAgent.includes('Chrome') ? 'Chrome' :
                     userAgent.includes('Firefox') ? 'Firefox' :
                     userAgent.includes('Safari') ? 'Safari' :
                     userAgent.includes('Edge') ? 'Edge' : 'Unknown'

      // Add user detection notification
      const newNotification = {
        id: notifications.length + 1,
        title: "User Session Detected",
        message: `New login from ${isMobile ? 'mobile' : 'desktop'} device using ${browser} browser`,
        read: false,
        time: new Date(),
      }

      setNotifications(prev => [newNotification, ...prev])
    }

    detectUserInfo()
  }, [])

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  // Stats data with real-time updates
  const [statsData, setStatsData] = useState([
    {
      title: "Total Users",
      value: 512,
      change: "+4%",
      icon: "users",
      color: "blue",
      chartData: [10, 15, 8, 12, 9, 13, 16],
    },
    {
      title: "Active users",
      value: 3800,
      change: "+4%",
      icon: "activity",
      color: "green",
      chartData: [8, 10, 12, 14, 12, 10, 16],
    },
    {
      title: "Meditation sessions",
      value: 200,
      change: "+6%",
      icon: "meditation",
      color: "yellow",
      chartData: [12, 15, 18, 16, 14, 12, 10],
    },
    {
      title: "Total Sleep Stories",
      value: 50,
      change: "+4%",
      icon: "book",
      color: "cyan",
      chartData: [5, 8, 10, 8, 12, 10, 14],
    },
  ])

  // Real-time data updates based on current time
  useEffect(() => {
    const interval = setInterval(() => {
      // Get current hour to simulate different activity levels throughout the day
      const currentHour = currentTime.getHours()
      const activityMultiplier = currentHour >= 8 && currentHour <= 22 ? 1.02 : 0.99 // More active during day

      setStatsData((prev) =>
        prev.map((stat) => {
          // Different growth rates for different stats
          const growthRate =
            stat.title === "Total Users" ? 1.005 :
            stat.title === "Active users" ? activityMultiplier :
            stat.title === "Meditation sessions" ? 1.01 :
            1.003

          return {
            ...stat,
            value: Math.floor(stat.value * growthRate),
            chartData: [
              ...stat.chartData.slice(1),
              stat.chartData[stat.chartData.length - 1] * (1 + (Math.random() * 0.1 - 0.05)),
            ],
          }
        }),
      )

      // Randomly add a notification every ~30 seconds
      if (Math.random() > 0.9) {
        const notificationTypes = [
          { title: "New User Registration", message: "A new user just registered" },
          { title: "Payment Received", message: "New subscription payment received" },
          { title: "Session Milestone", message: "Users have completed 1000+ meditation sessions today" },
          { title: "System Alert", message: "Server load is higher than normal" },
        ]

        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]

        const newNotification = {
          id: Date.now(),
          title: randomType.title,
          message: randomType.message,
          read: false,
          time: new Date(currentTime),
        }

        setNotifications((prev) => [newNotification, ...prev])

        addToast({
          title: "New Notification",
          description: randomType.title,
          type: "info",
          duration: 5000,
        })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [addToast, currentTime])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("loginTime")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const handleResetData = () => {
    // Reset stats to initial values
    setStatsData([
      {
        title: "Total Users",
        value: 512,
        change: "+4%",
        icon: "users",
        color: "blue",
        chartData: [10, 15, 8, 12, 9, 13, 16],
      },
      {
        title: "Active users",
        value: 3800,
        change: "+4%",
        icon: "activity",
        color: "green",
        chartData: [8, 10, 12, 14, 12, 10, 16],
      },
      {
        title: "Meditation sessions",
        value: 200,
        change: "+6%",
        icon: "meditation",
        color: "yellow",
        chartData: [12, 15, 18, 16, 14, 12, 10],
      },
      {
        title: "Total Sleep Stories",
        value: 50,
        change: "+4%",
        icon: "book",
        color: "cyan",
        chartData: [5, 8, 10, 8, 12, 10, 14],
      },
    ])

    // Clear notifications
    setNotifications([])

    setIsResetDialogOpen(false)

    addToast({
      title: "Data Reset",
      description: "All dashboard data has been reset to initial values",
      type: "success",
      duration: 5000,
    })
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search here"
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsNotificationOpen(true)}>
                <Bell className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span>{username || "Admin"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsResetDialogOpen(true)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span>Reset Data</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">Welcome Back {username || "Admin"},</h2>
            <p className="text-muted-foreground">
              Track platform performance, manage users, & monitor earnings in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat, index) => (
              <StatsCard key={index} data={stat} />
            ))}
          </div>

          <Card className="mb-6 shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Revenue over time</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => setIsFilterDialogOpen(true)}>
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </Button>
                <div
                  className="flex items-center text-sm text-muted-foreground bg-gray-100 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => setIsFilterDialogOpen(true)}
                >
                  {selectedTimeframe === "last6Months"
                    ? "Last 6 months"
                    : selectedTimeframe === "lastYear"
                      ? "Last year"
                      : selectedTimeframe === "lastMonth"
                        ? "Last month"
                        : "Custom"}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RevenueChart timeframe={selectedTimeframe} dataType={selectedDataType} />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Recent Activity
              </CardTitle>
              <div className="text-sm text-muted-foreground">{formatDate(currentTime)}</div>
            </CardHeader>
            <RecentActivityTable currentTime={currentTime} />
          </Card>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onNotificationRead={(id) => {
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
        }}
        onClearAll={() => {
          setNotifications([])
          addToast({
            title: "Notifications Cleared",
            description: "All notifications have been cleared",
            type: "info",
            duration: 3000,
          })
        }}
      />

      {/* Reset Data Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Dashboard Data</DialogTitle>
            <DialogDescription>
              This will reset all dashboard data to initial values. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetData}>
              Reset Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Revenue Chart</DialogTitle>
            <DialogDescription>Customize the data displayed in the revenue chart</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="timeframe" className="text-right">
                Time Period
              </label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="last6Months">Last 6 Months</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="dataType" className="text-right">
                Data Type
              </label>
              <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Revenue</SelectItem>
                  <SelectItem value="ads">Ads Only</SelectItem>
                  <SelectItem value="premium">Premium Users Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsFilterDialogOpen(false)
                addToast({
                  title: "Filters Applied",
                  description: "Chart filters have been updated",
                  type: "success",
                  duration: 3000,
                })
              }}
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

