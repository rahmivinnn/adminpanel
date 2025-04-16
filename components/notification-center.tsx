"use client"
import { format } from "date-fns"
import { Bell, Check, Trash2, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface Notification {
  id: number
  title: string
  message: string
  read: boolean
  time: Date
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onNotificationRead: (id: number) => void
  onClearAll: () => void
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onNotificationRead,
  onClearAll,
}: NotificationCenterProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null)
  const [notificationsState, setNotificationsState] = useState<Notification[]>([])

  // Initialize notifications state from props
  useEffect(() => {
    setNotificationsState(notifications)
  }, [notifications])

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Handle notification click
  const handleNotificationClick = (id: number) => {
    setSelectedNotification(id === selectedNotification ? null : id)

    // Mark as read when clicked
    if (!notificationsState.find((n) => n.id === id)?.read) {
      onNotificationRead(id)
    }
  }

  // Ensure we're handling the Sheet component correctly
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-[380px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="flex items-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -30, 30, -15, 15, 0] }}
              transition={{ duration: 1, delay: 0.5, repeat: 0, repeatType: "loop" }}
            >
              <Bell className="mr-2 h-5 w-5" />
            </motion.div>
            <span>Notifications</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex justify-between items-center px-6 py-2">
          <div className="text-sm text-muted-foreground">
            {notifications.length === 0
              ? "No notifications"
              : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 px-2 text-sm"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>

            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8 px-2 text-sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            )}
          </div>
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-8rem)] pb-6">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-40 text-center p-6"
            >
              <Bell className="h-10 w-10 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                When you receive notifications, they will appear here
              </p>
            </motion.div>
          ) : (
            <div className="divide-y">
              <AnimatePresence initial={false}>
                {notificationsState.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                      backgroundColor:
                        selectedNotification === notification.id ? "rgba(59, 130, 246, 0.05)" : "transparent",
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer ${!notification.read ? "bg-blue-50/50" : ""}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <motion.h4
                        className="font-medium text-sm"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        {notification.title}
                      </motion.h4>
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground">{format(notification.time, "h:mm a")}</span>
                        {!notification.read && (
                          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                onNotificationRead(notification.id)
                              }}
                            >
                              <Check className="h-3 w-3" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="text-xs text-muted-foreground mt-1">{format(notification.time, "MMM d, yyyy")}</div>

                    {/* Expanded content when selected */}
                    <AnimatePresence>
                      {selectedNotification === notification.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 pt-3 border-t border-gray-100"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium">Actions</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedNotification(null)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              View Details
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                setNotificationsState((prev) => prev.filter((n) => n.id !== notification.id))
                                setSelectedNotification(null)
                              }}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

