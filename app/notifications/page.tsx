"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, Plus, Edit, Trash, Bell, Calendar, Clock, Send, RefreshCw, Download, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast-provider"
import { NotificationCenter } from "@/components/notification-center"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

// Initial notifications data
const initialNotifications = [
  {
    id: 1,
    title: "Morning Meditation",
    message: "Start your day with a 5-minute meditation",
    type: "Daily",
    time: "07:00 AM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    active: true,
    createdAt: new Date("2025-03-15"),
  },
  {
    id: 2,
    title: "Evening Relaxation",
    message: "Wind down with a sleep story before bed",
    type: "Daily",
    time: "09:30 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    active: true,
    createdAt: new Date("2025-03-16"),
  },
  {
    id: 3,
    title: "Weekend Mindfulness",
    message: "Take 10 minutes for mindfulness practice",
    type: "Weekly",
    time: "10:00 AM",
    days: ["Saturday", "Sunday"],
    active: true,
    createdAt: new Date("2025-03-17"),
  },
  {
    id: 4,
    title: "Breathing Exercise",
    message: "Take a moment for deep breathing",
    type: "Daily",
    time: "12:00 PM",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    active: false,
    createdAt: new Date("2025-03-18"),
  },
  {
    id: 5,
    title: "New Content Alert",
    message: "Check out our new sleep stories",
    type: "One-time",
    time: "03:00 PM",
    date: new Date("2025-04-01"),
    active: true,
    createdAt: new Date("2025-03-19"),
  },
  {
    id: 6,
    title: "Subscription Renewal",
    message: "Your subscription will renew in 3 days",
    type: "One-time",
    time: "09:00 AM",
    date: new Date("2025-03-28"),
    active: true,
    createdAt: new Date("2025-03-20"),
  },
]

// Initial reminders data
const initialReminders = [
  {
    id: 1,
    title: "App Usage Reminder",
    message: "You haven't used the app in 2 days. Take a moment for yourself today!",
    triggerType: "Inactivity",
    triggerValue: "2 days",
    active: true,
    createdAt: new Date("2025-03-15"),
  },
  {
    id: 2,
    title: "Meditation Streak",
    message: "Keep up your meditation streak! Don't miss today's session.",
    triggerType: "Streak",
    triggerValue: "3 days",
    active: true,
    createdAt: new Date("2025-03-16"),
  },
  {
    id: 3,
    title: "Bedtime Reminder",
    message: "It's almost your bedtime. Start winding down with a sleep story.",
    triggerType: "Time-based",
    triggerValue: "30 minutes before bedtime",
    active: true,
    createdAt: new Date("2025-03-17"),
  },
  {
    id: 4,
    title: "Weekly Progress",
    message: "Check your weekly meditation progress in the app!",
    triggerType: "Weekly",
    triggerValue: "Sunday, 8:00 PM",
    active: false,
    createdAt: new Date("2025-03-18"),
  },
  {
    id: 5,
    title: "Stress Relief",
    message: "Feeling stressed? Take a quick break with our stress relief meditation.",
    triggerType: "Contextual",
    triggerValue: "High stress detected",
    active: true,
    createdAt: new Date("2025-03-19"),
  },
]

export default function NotificationsPage() {
  const { addToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date("2025-03-22T09:04:47"))
  const [searchQuery, setSearchQuery] = useState("")
  const [systemNotifications, setSystemNotifications] = useState<
    { id: number; title: string; message: string; read: boolean; time: Date }[]
  >([
    {
      id: 1,
      title: "New Notification Created",
      message: "A new notification 'Morning Meditation' has been created",
      read: false,
      time: new Date("2025-03-22T08:30:00"),
    },
    {
      id: 2,
      title: "Reminder Updated",
      message: "The 'Bedtime Reminder' has been updated",
      read: false,
      time: new Date("2025-03-22T07:45:00"),
    },
    {
      id: 3,
      title: "System Update",
      message: "Notification system updated to version 2.1",
      read: false,
      time: new Date("2025-03-21T22:15:00"),
    },
  ])
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [reminders, setReminders] = useState(initialReminders)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: "notification" | "reminder" } | null>(null)
  const [isAddNotificationDialogOpen, setIsAddNotificationDialogOpen] = useState(false)
  const [isAddReminderDialogOpen, setIsAddReminderDialogOpen] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "Daily",
    time: "",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    date: new Date(),
  })
  const [newReminder, setNewReminder] = useState({
    title: "",
    message: "",
    triggerType: "Inactivity",
    triggerValue: "",
  })
  const [isEditNotificationDialogOpen, setIsEditNotificationDialogOpen] = useState(false)
  const [isEditReminderDialogOpen, setIsEditReminderDialogOpen] = useState(false)
  const [editingNotification, setEditingNotification] = useState<any>(null)
  const [editingReminder, setEditingReminder] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("notifications")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("csv")
  const [showRealTimeUpdates, setShowRealTimeUpdates] = useState(true)
  const [previewNotification, setPreviewNotification] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null)

  // Refs for animation
  const notificationListRef = useRef<HTMLDivElement>(null)
  const reminderListRef = useRef<HTMLDivElement>(null)

  // Update time every second to simulate real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = new Date(prev)
        newTime.setSeconds(newTime.getSeconds() + 1)
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate real-time notifications
  useEffect(() => {
    if (!showRealTimeUpdates) return

    const interval = setInterval(() => {
      // 15% chance of adding a new notification
      if (Math.random() < 0.15) {
        const notificationTypes = [
          { title: "User Engagement", message: "User engagement increased by 5% today" },
          { title: "New User", message: "10 new users registered in the last hour" },
          { title: "System Alert", message: "Notification delivery rate at 99.8%" },
        ]

        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]

        const newNotification = {
          id: Date.now(),
          title: randomType.title,
          message: randomType.message,
          read: false,
          time: new Date(currentTime),
        }

        setSystemNotifications((prev) => [newNotification, ...prev])

        addToast({
          title: "New System Notification",
          description: randomType.title,
          type: "info",
          duration: 5000,
        })

        // Highlight the new notification in the system tray
        setHighlightedItem(newNotification.id)
        setTimeout(() => setHighlightedItem(null), 3000)
      }

      // 10% chance of updating a notification status
      if (Math.random() < 0.1 && notifications.length > 0) {
        const randomIndex = Math.floor(Math.random() * notifications.length)
        const updatedNotifications = [...notifications]
        updatedNotifications[randomIndex] = {
          ...updatedNotifications[randomIndex],
          active: !updatedNotifications[randomIndex].active,
        }

        setNotifications(updatedNotifications)

        addToast({
          title: "Notification Status Changed",
          description: `"${updatedNotifications[randomIndex].title}" is now ${updatedNotifications[randomIndex].active ? "active" : "inactive"}`,
          type: "info",
          duration: 3000,
        })

        // Highlight the updated notification
        setHighlightedItem(updatedNotifications[randomIndex].id)
        setTimeout(() => setHighlightedItem(null), 3000)
      }
    }, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [addToast, currentTime, notifications, showRealTimeUpdates])

  // Handle delete item
  const handleDeleteItem = useCallback(() => {
    if (itemToDelete) {
      if (itemToDelete.type === "notification") {
        setNotifications((prev) => prev.filter((item) => item.id !== itemToDelete.id))
        addToast({
          title: "Notification deleted",
          description: "The notification has been successfully deleted.",
          type: "success",
          duration: 3000,
        })
      } else {
        setReminders((prev) => prev.filter((item) => item.id !== itemToDelete.id))
        addToast({
          title: "Reminder deleted",
          description: "The reminder has been successfully deleted.",
          type: "success",
          duration: 3000,
        })
      }
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }, [itemToDelete, addToast])

  // Handle add notification
  const handleAddNotification = useCallback(() => {
    if (newNotification.title && newNotification.message && newNotification.time) {
      const newId = Math.max(...notifications.map((item) => item.id), 0) + 1
      const notificationToAdd = {
        id: newId,
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        time: newNotification.time,
        days: newNotification.type === "Daily" || newNotification.type === "Weekly" ? newNotification.days : [],
        date: newNotification.type === "One-time" ? newNotification.date : undefined,
        active: true,
        createdAt: new Date(),
      }

      setNotifications((prev) => [notificationToAdd, ...prev])
      setNewNotification({
        title: "",
        message: "",
        type: "Daily",
        time: "",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        date: new Date(),
      })
      setIsAddNotificationDialogOpen(false)

      addToast({
        title: "Notification added",
        description: "The new notification has been successfully added.",
        type: "success",
        duration: 3000,
      })

      // Highlight the new notification
      setHighlightedItem(newId)
      setTimeout(() => setHighlightedItem(null), 3000)
    }
  }, [newNotification, notifications, addToast])

  // Handle add reminder
  const handleAddReminder = useCallback(() => {
    if (newReminder.title && newReminder.message && newReminder.triggerValue) {
      const newId = Math.max(...reminders.map((item) => item.id), 0) + 1
      const reminderToAdd = {
        id: newId,
        title: newReminder.title,
        message: newReminder.message,
        triggerType: newReminder.triggerType,
        triggerValue: newReminder.triggerValue,
        active: true,
        createdAt: new Date(),
      }

      setReminders((prev) => [reminderToAdd, ...prev])
      setNewReminder({
        title: "",
        message: "",
        triggerType: "Inactivity",
        triggerValue: "",
      })
      setIsAddReminderDialogOpen(false)

      addToast({
        title: "Reminder added",
        description: "The new reminder has been successfully added.",
        type: "success",
        duration: 3000,
      })

      // Highlight the new reminder
      setHighlightedItem(newId)
      setTimeout(() => setHighlightedItem(null), 3000)
    }
  }, [newReminder, reminders, addToast])

  // Handle edit notification
  const handleEditNotification = useCallback(() => {
    if (editingNotification && editingNotification.title && editingNotification.message) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === editingNotification.id ? { ...editingNotification } : item)),
      )

      setIsEditNotificationDialogOpen(false)
      setEditingNotification(null)

      addToast({
        title: "Notification updated",
        description: "The notification has been successfully updated.",
        type: "success",
        duration: 3000,
      })

      // Highlight the edited notification
      setHighlightedItem(editingNotification.id)
      setTimeout(() => setHighlightedItem(null), 3000)
    }
  }, [editingNotification, addToast])

  // Handle edit reminder
  const handleEditReminder = useCallback(() => {
    if (editingReminder && editingReminder.title && editingReminder.message) {
      setReminders((prev) => prev.map((item) => (item.id === editingReminder.id ? { ...editingReminder } : item)))

      setIsEditReminderDialogOpen(false)
      setEditingReminder(null)

      addToast({
        title: "Reminder updated",
        description: "The reminder has been successfully updated.",
        type: "success",
        duration: 3000,
      })

      // Highlight the edited reminder
      setHighlightedItem(editingReminder.id)
      setTimeout(() => setHighlightedItem(null), 3000)
    }
  }, [editingReminder, addToast])

  // Toggle notification active state
  const toggleNotificationActive = useCallback(
    (id: number) => {
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)))

      addToast({
        title: "Notification updated",
        description: "The notification status has been updated.",
        type: "success",
        duration: 3000,
      })

      // Highlight the toggled notification
      setHighlightedItem(id)
      setTimeout(() => setHighlightedItem(null), 3000)
    },
    [addToast],
  )

  // Toggle reminder active state
  const toggleReminderActive = useCallback(
    (id: number) => {
      setReminders((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)))

      addToast({
        title: "Reminder updated",
        description: "The reminder status has been updated.",
        type: "success",
        duration: 3000,
      })

      // Highlight the toggled reminder
      setHighlightedItem(id)
      setTimeout(() => setHighlightedItem(null), 3000)
    },
    [addToast],
  )

  // Handle refresh data
  const handleRefreshData = useCallback(() => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      // Add a new notification
      const newNotificationId = Math.max(...notifications.map((item) => item.id), 0) + 1
      const newNotificationItem = {
        id: newNotificationId,
        title: "New Feature Announcement",
        message: "Check out our latest meditation features!",
        type: "One-time",
        time: "10:00 AM",
        date: new Date(currentTime.getTime() + 86400000), // Tomorrow
        active: true,
        createdAt: new Date(),
      }

      // Add a new reminder
      const newReminderId = Math.max(...reminders.map((item) => item.id), 0) + 1
      const newReminderItem = {
        id: newReminderId,
        title: "Mindfulness Check-in",
        message: "Take a moment to check in with yourself",
        triggerType: "Daily",
        triggerValue: "3:00 PM",
        active: true,
        createdAt: new Date(),
      }

      setNotifications((prev) => [newNotificationItem, ...prev])
      setReminders((prev) => [newReminderItem, ...prev])

      setIsRefreshing(false)

      addToast({
        title: "Data Refreshed",
        description: "New notifications and reminders have been added",
        type: "success",
        duration: 3000,
      })

      // Highlight the new items
      setTimeout(() => {
        setHighlightedItem(newNotificationId)
        setTimeout(() => {
          setHighlightedItem(newReminderId)
          setTimeout(() => setHighlightedItem(null), 3000)
        }, 3000)
      }, 500)
    }, 1500)
  }, [notifications, reminders, currentTime, addToast])

  // Handle export data
  const handleExportData = useCallback(() => {
    setIsExportDialogOpen(false)

    // Simulate export process
    setTimeout(() => {
      addToast({
        title: "Export Complete",
        description: `Data has been exported as ${exportFormat.toUpperCase()}`,
        type: "success",
        duration: 3000,
      })
    }, 1000)
  }, [exportFormat, addToast])

  // Preview notification
  const handlePreviewNotification = useCallback((notification: any) => {
    setPreviewNotification(notification)
    setIsPreviewOpen(true)
  }, [])

  // Filter notifications based on search query and filter
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && notification.active) ||
      (selectedFilter === "inactive" && !notification.active) ||
      selectedFilter === notification.type.toLowerCase()

    return matchesSearch && matchesFilter
  })

  // Filter reminders based on search query and filter
  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch =
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.message.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && reminder.active) ||
      (selectedFilter === "inactive" && !reminder.active) ||
      selectedFilter === reminder.triggerType.toLowerCase()

    return matchesSearch && matchesFilter
  })

  const unreadNotificationsCount = systemNotifications.filter((n) => !n.read).length

  // Format date for display
  const formatCreatedDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Notifications & Reminders</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search notifications..."
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsNotificationOpen(true)}>
                <Bell className="h-5 w-5" />
                <AnimatePresence>
                  {unreadNotificationsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center"
                    >
                      {unreadNotificationsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="mb-6">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold mb-1"
            >
              Manage Notifications & Reminders
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Create and manage notifications and reminders for your users.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          >
            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="border-0 shadow-sm bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2 rounded-md bg-blue-500">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold mb-1">{notifications.length}</div>
                  <div className="text-sm text-muted-foreground">Total Notifications</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="border-0 shadow-sm bg-green-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2 rounded-md bg-green-500">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold mb-1">{notifications.filter((n) => n.active).length}</div>
                  <div className="text-sm text-muted-foreground">Active Notifications</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="border-0 shadow-sm bg-amber-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2 rounded-md bg-amber-500">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold mb-1">{reminders.length}</div>
                  <div className="text-sm text-muted-foreground">Total Reminders</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="border-0 shadow-sm bg-cyan-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2 rounded-md bg-cyan-500">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold mb-1">{reminders.filter((r) => r.active).length}</div>
                  <div className="text-sm text-muted-foreground">Active Reminders</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Tabs defaultValue="notifications" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="reminders">Reminders</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-1"
                          onClick={handleRefreshData}
                          disabled={isRefreshing}
                        >
                          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                          {isRefreshing ? "Refreshing..." : "Refresh Data"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh notifications and reminders data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-1"
                          onClick={() => setIsExportDialogOpen(true)}
                        >
                          <Download className="h-4 w-4" />
                          Export
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export notifications and reminders data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-[180px] h-8 text-sm">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      {activeTab === "notifications" ? (
                        <>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="one-time">One-time</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="inactivity">Inactivity</SelectItem>
                          <SelectItem value="streak">Streak</SelectItem>
                          <SelectItem value="time-based">Time-based</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="contextual">Contextual</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    onClick={() =>
                      activeTab === "notifications"
                        ? setIsAddNotificationDialogOpen(true)
                        : setIsAddReminderDialogOpen(true)
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add {activeTab === "notifications" ? "Notification" : "Reminder"}
                  </Button>
                </div>
              </div>

              <TabsContent value="notifications" className="mt-0">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr className="text-left">
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Title</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Message</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Type</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Schedule</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Created</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody ref={notificationListRef}>
                          <AnimatePresence>
                            {filteredNotifications.map((notification) => (
                              <motion.tr
                                key={notification.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  backgroundColor:
                                    highlightedItem === notification.id ? "rgba(59, 130, 246, 0.1)" : "transparent",
                                }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.3,
                                  backgroundColor: {
                                    duration: 1.5,
                                    repeat: highlightedItem === notification.id ? 3 : 0,
                                    repeatType: "reverse",
                                  },
                                }}
                                className="border-t hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-4 py-3 font-medium">{notification.title}</td>
                                <td className="px-4 py-3 text-sm max-w-[200px] truncate">{notification.message}</td>
                                <td className="px-4 py-3">
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                                  >
                                    {notification.type}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {notification.time}
                                  {notification.type === "One-time" &&
                                    notification.date &&
                                    ` on ${notification.date.toLocaleDateString()}`}
                                  {(notification.type === "Daily" || notification.type === "Weekly") &&
                                    notification.days &&
                                    notification.days.length > 0 &&
                                    ` (${notification.days.length === 7 ? "Every day" : notification.days.join(", ")})`}
                                </td>
                                <td className="px-4 py-3 text-sm">{formatCreatedDate(notification.createdAt)}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={notification.active}
                                      onCheckedChange={() => toggleNotificationActive(notification.id)}
                                    />
                                    <span className={notification.active ? "text-green-600" : "text-gray-500"}>
                                      {notification.active ? "Active" : "Inactive"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                            onClick={() => {
                                              setEditingNotification(notification)
                                              setIsEditNotificationDialogOpen(true)
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Edit notification</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                              setItemToDelete({ id: notification.id, type: "notification" })
                                              setIsDeleteDialogOpen(true)
                                            }}
                                          >
                                            <Trash className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Delete notification</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                                            onClick={() => handlePreviewNotification(notification)}
                                          >
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">Preview</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Preview notification</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reminders" className="mt-0">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr className="text-left">
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Title</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Message</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Trigger Type</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Trigger Value</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Created</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody ref={reminderListRef}>
                          <AnimatePresence>
                            {filteredReminders.map((reminder) => (
                              <motion.tr
                                key={reminder.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  backgroundColor:
                                    highlightedItem === reminder.id ? "rgba(245, 158, 11, 0.1)" : "transparent",
                                }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.3,
                                  backgroundColor: {
                                    duration: 1.5,
                                    repeat: highlightedItem === reminder.id ? 3 : 0,
                                    repeatType: "reverse",
                                  },
                                }}
                                className="border-t hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-4 py-3 font-medium">{reminder.title}</td>
                                <td className="px-4 py-3 text-sm max-w-[200px] truncate">{reminder.message}</td>
                                <td className="px-4 py-3">
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                                  >
                                    {reminder.triggerType}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm">{reminder.triggerValue}</td>
                                <td className="px-4 py-3 text-sm">{formatCreatedDate(reminder.createdAt)}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={reminder.active}
                                      onCheckedChange={() => toggleReminderActive(reminder.id)}
                                    />
                                    <span className={reminder.active ? "text-green-600" : "text-gray-500"}>
                                      {reminder.active ? "Active" : "Inactive"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                            onClick={() => {
                                              setEditingReminder(reminder)
                                              setIsEditReminderDialogOpen(true)
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Edit reminder</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                              setItemToDelete({ id: reminder.id, type: "reminder" })
                                              setIsDeleteDialogOpen(true)
                                            }}
                                          >
                                            <Trash className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Delete reminder</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                                            onClick={() => handlePreviewNotification(reminder)}
                                          >
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">Preview</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Preview reminder</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p>Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.</p>
          </motion.div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Notification Dialog */}
      <Dialog open={isAddNotificationDialogOpen} onOpenChange={setIsAddNotificationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Notification</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newNotification.title}
                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                value={newNotification.message}
                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={newNotification.type}
                onValueChange={(value) => setNewNotification({ ...newNotification, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="One-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={newNotification.time}
                onChange={(e) => setNewNotification({ ...newNotification, time: e.target.value })}
              />
            </div>
            {newNotification.type === "One-time" && (
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newNotification.date.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      date: new Date(e.target.value),
                    })
                  }
                />
              </div>
            )}
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNotificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNotification}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Reminder Dialog */}
      <Dialog open={isAddReminderDialogOpen} onOpenChange={setIsAddReminderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="reminder-title">Title</Label>
              <Input
                id="reminder-title"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reminder-message">Message</Label>
              <Input
                id="reminder-message"
                value={newReminder.message}
                onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select
                value={newReminder.triggerType}
                onValueChange={(value) => setNewReminder({ ...newReminder, triggerType: value })}
              >
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inactivity">Inactivity</SelectItem>
                  <SelectItem value="Streak">Streak</SelectItem>
                  <SelectItem value="Time-based">Time-based</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Contextual">Contextual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trigger-value">Trigger Value</Label>
              <Input
                id="trigger-value"
                value={newReminder.triggerValue}
                onChange={(e) => setNewReminder({ ...newReminder, triggerValue: e.target.value })}
                placeholder={
                  newReminder.triggerType === "Inactivity"
                    ? "e.g., 2 days"
                    : newReminder.triggerType === "Streak"
                      ? "e.g., 3 days"
                      : newReminder.triggerType === "Time-based"
                        ? "e.g., 30 minutes before bedtime"
                        : newReminder.triggerType === "Weekly"
                          ? "e.g., Sunday, 8:00 PM"
                          : "e.g., High stress detected"
                }
              />
            </div>
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddReminderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReminder}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notification Dialog */}
      {editingNotification && (
        <Dialog open={isEditNotificationDialogOpen} onOpenChange={setIsEditNotificationDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Notification</DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 py-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingNotification.title}
                  onChange={(e) =>
                    setEditingNotification({
                      ...editingNotification,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-message">Message</Label>
                <Input
                  id="edit-message"
                  value={editingNotification.message}
                  onChange={(e) =>
                    setEditingNotification({
                      ...editingNotification,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editingNotification.time}
                  onChange={(e) =>
                    setEditingNotification({
                      ...editingNotification,
                      time: e.target.value,
                    })
                  }
                />
              </div>
            </motion.div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditNotificationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditNotification}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Reminder Dialog */}
      {editingReminder && (
        <Dialog open={isEditReminderDialogOpen} onOpenChange={setIsEditReminderDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Reminder</DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 py-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="edit-reminder-title">Title</Label>
                <Input
                  id="edit-reminder-title"
                  value={editingReminder.title}
                  onChange={(e) =>
                    setEditingReminder({
                      ...editingReminder,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reminder-message">Message</Label>
                <Input
                  id="edit-reminder-message"
                  value={editingReminder.message}
                  onChange={(e) =>
                    setEditingReminder({
                      ...editingReminder,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-trigger-value">Trigger Value</Label>
                <Input
                  id="edit-trigger-value"
                  value={editingReminder.triggerValue}
                  onChange={(e) =>
                    setEditingReminder({
                      ...editingReminder,
                      triggerValue: e.target.value,
                    })
                  }
                />
              </div>
            </motion.div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditReminderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditReminder}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="export-format">Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="real-time-updates">Real-time Updates</Label>
              <div className="flex items-center space-x-2">
                <Switch id="real-time-updates" checked={showRealTimeUpdates} onCheckedChange={setShowRealTimeUpdates} />
                <Label htmlFor="real-time-updates">Enable real-time data updates</Label>
              </div>
            </div>
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportData}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          {previewNotification && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{previewNotification.title}</h3>
                    <p className="text-sm text-gray-500">Just now</p>
                  </div>
                </div>
                <p className="text-sm">{previewNotification.message}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {"type" in previewNotification ? (
                    <>
                      <div className="text-muted-foreground">Type:</div>
                      <div>{previewNotification.type}</div>
                      <div className="text-muted-foreground">Time:</div>
                      <div>{previewNotification.time}</div>
                      {previewNotification.days && (
                        <>
                          <div className="text-muted-foreground">Days:</div>
                          <div>{previewNotification.days.join(", ")}</div>
                        </>
                      )}
                      {previewNotification.date && (
                        <>
                          <div className="text-muted-foreground">Date:</div>
                          <div>{previewNotification.date.toLocaleDateString()}</div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-muted-foreground">Trigger Type:</div>
                      <div>{previewNotification.triggerType}</div>
                      <div className="text-muted-foreground">Trigger Value:</div>
                      <div>{previewNotification.triggerValue}</div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Center */}
      {isNotificationOpen && (
        <NotificationCenter
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={systemNotifications}
          onNotificationRead={(id) => {
            setSystemNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
          }}
          onClearAll={() => {
            setSystemNotifications([])
            addToast({
              title: "Notifications Cleared",
              description: "All notifications have been cleared",
              type: "info",
              duration: 3000,
            })
          }}
        />
      )}
    </div>
  )
}

