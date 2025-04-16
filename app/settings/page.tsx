"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Save, Bell, Globe, Shield, Palette, RefreshCw, Undo, Download, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/toast-provider"
import { NotificationCenter } from "@/components/notification-center"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function SettingsPage() {
  const { addToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date("2025-03-22T09:04:47"))
  const [notifications, setNotifications] = useState<
    { id: number; title: string; message: string; read: boolean; time: Date }[]
  >([
    {
      id: 1,
      title: "Settings Updated",
      message: "App settings have been updated successfully",
      read: false,
      time: new Date("2025-03-22T08:30:00"),
    },
    {
      id: 2,
      title: "Security Alert",
      message: "New login detected from unknown device",
      read: false,
      time: new Date("2025-03-22T07:45:00"),
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
  const [activeTab, setActiveTab] = useState("general")
  const [isSaving, setIsSaving] = useState(false)
  const [saveProgress, setSaveProgress] = useState(0)
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [restoreProgress, setRestoreProgress] = useState(0)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [showRealTimeUpdates, setShowRealTimeUpdates] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [highlightedSetting, setHighlightedSetting] = useState<string | null>(null)

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    appName: "Hushhly",
    supportEmail: "support@hushhly.com",
    timezone: "UTC",
    language: "en",
    maintenanceMode: false,
    analyticsEnabled: true,
    feedbackEnabled: true,
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: "90",
    sessionTimeout: "30",
    ipRestriction: false,
    dataEncryption: true,
    auditLogging: true,
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    reminderFrequency: "daily",
    notifyNewContent: true,
    notifySystemUpdates: true,
  })

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    primaryColor: "#00B4D8",
    fontFamily: "Inter",
    compactMode: false,
    animationsEnabled: true,
    highContrastMode: false,
  })

  // Refs for animation
  const generalFormRef = useRef<HTMLDivElement>(null)
  const securityFormRef = useRef<HTMLDivElement>(null)
  const notificationFormRef = useRef<HTMLDivElement>(null)
  const appearanceFormRef = useRef<HTMLDivElement>(null)

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

  // Simulate real-time updates
  useEffect(() => {
    if (!showRealTimeUpdates) return

    const interval = setInterval(() => {
      // 10% chance of adding a new notification
      if (Math.random() < 0.1) {
        const notificationTypes = [
          { title: "Security Update", message: "Security settings have been automatically updated" },
          { title: "System Maintenance", message: "Scheduled maintenance completed successfully" },
          { title: "User Activity", message: "Unusual login activity detected" },
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

      // 5% chance of updating a setting
      if (Math.random() < 0.05) {
        const settingTypes = ["general", "security", "notification", "appearance"]
        const randomSettingType = settingTypes[Math.floor(Math.random() * settingTypes.length)]

        switch (randomSettingType) {
          case "general":
            const generalKeys = Object.keys(generalSettings) as Array<keyof typeof generalSettings>
            const randomGeneralKey = generalKeys[Math.floor(Math.random() * generalKeys.length)]

            if (typeof generalSettings[randomGeneralKey] === "boolean") {
              setGeneralSettings((prev) => ({
                ...prev,
                [randomGeneralKey]: !prev[randomGeneralKey],
              }))

              setHighlightedSetting(`general-${randomGeneralKey}`)
              setTimeout(() => setHighlightedSetting(null), 3000)

              addToast({
                title: "Setting Updated",
                description: `${randomGeneralKey} has been updated automatically`,
                type: "info",
                duration: 3000,
              })

              setHasUnsavedChanges(true)
            }
            break

          case "security":
            const securityKeys = Object.keys(securitySettings) as Array<keyof typeof securitySettings>
            const randomSecurityKey = securityKeys[Math.floor(Math.random() * securityKeys.length)]

            if (typeof securitySettings[randomSecurityKey] === "boolean") {
              setSecuritySettings((prev) => ({
                ...prev,
                [randomSecurityKey]: !prev[randomSecurityKey],
              }))

              setHighlightedSetting(`security-${randomSecurityKey}`)
              setTimeout(() => setHighlightedSetting(null), 3000)

              addToast({
                title: "Security Setting Updated",
                description: `${randomSecurityKey} has been updated automatically`,
                type: "warning",
                duration: 3000,
              })

              setHasUnsavedChanges(true)
            }
            break

          case "notification":
            const notificationKeys = Object.keys(notificationSettings) as Array<keyof typeof notificationSettings>
            const randomNotificationKey = notificationKeys[Math.floor(Math.random() * notificationKeys.length)]

            if (typeof notificationSettings[randomNotificationKey] === "boolean") {
              setNotificationSettings((prev) => ({
                ...prev,
                [randomNotificationKey]: !prev[randomNotificationKey],
              }))

              setHighlightedSetting(`notification-${randomNotificationKey}`)
              setTimeout(() => setHighlightedSetting(null), 3000)

              addToast({
                title: "Notification Setting Updated",
                description: `${randomNotificationKey} has been updated automatically`,
                type: "info",
                duration: 3000,
              })

              setHasUnsavedChanges(true)
            }
            break

          case "appearance":
            const appearanceKeys = Object.keys(appearanceSettings) as Array<keyof typeof appearanceSettings>
            const randomAppearanceKey = appearanceKeys[Math.floor(Math.random() * appearanceKeys.length)]

            if (typeof appearanceSettings[randomAppearanceKey] === "boolean") {
              setAppearanceSettings((prev) => ({
                ...prev,
                [randomAppearanceKey]: !prev[randomAppearanceKey],
              }))

              setHighlightedSetting(`appearance-${randomAppearanceKey}`)
              setTimeout(() => setHighlightedSetting(null), 3000)

              addToast({
                title: "Appearance Setting Updated",
                description: `${randomAppearanceKey} has been updated automatically`,
                type: "info",
                duration: 3000,
              })

              setHasUnsavedChanges(true)
            }
            break
        }
      }
    }, 20000) // Check every 20 seconds

    return () => clearInterval(interval)
  }, [
    addToast,
    currentTime,
    generalSettings,
    securitySettings,
    notificationSettings,
    appearanceSettings,
    showRealTimeUpdates,
  ])

  // Handle save general settings
  const handleSaveGeneralSettings = useCallback(() => {
    setIsSaving(true)
    setSaveProgress(0)

    // Simulate API call with progress
    const interval = setInterval(() => {
      setSaveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSaving(false)
          setLastSaved(new Date())
          setHasUnsavedChanges(false)

          addToast({
            title: "Settings Saved",
            description: "General settings have been updated successfully.",
            type: "success",
            duration: 3000,
          })

          return 0
        }
        return prev + 10
      })
    }, 100)
  }, [addToast])

  // Handle save security settings
  const handleSaveSecuritySettings = useCallback(() => {
    setIsSaving(true)
    setSaveProgress(0)

    // Simulate API call with progress
    const interval = setInterval(() => {
      setSaveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSaving(false)
          setLastSaved(new Date())
          setHasUnsavedChanges(false)

          addToast({
            title: "Settings Saved",
            description: "Security settings have been updated successfully.",
            type: "success",
            duration: 3000,
          })

          return 0
        }
        return prev + 10
      })
    }, 100)
  }, [addToast])

  // Handle save notification settings
  const handleSaveNotificationSettings = useCallback(() => {
    setIsSaving(true)
    setSaveProgress(0)

    // Simulate API call with progress
    const interval = setInterval(() => {
      setSaveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSaving(false)
          setLastSaved(new Date())
          setHasUnsavedChanges(false)

          addToast({
            title: "Settings Saved",
            description: "Notification settings have been updated successfully.",
            type: "success",
            duration: 3000,
          })

          return 0
        }
        return prev + 10
      })
    }, 100)
  }, [addToast])

  // Handle save appearance settings
  const handleSaveAppearanceSettings = useCallback(() => {
    setIsSaving(true)
    setSaveProgress(0)

    // Simulate API call with progress
    const interval = setInterval(() => {
      setSaveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSaving(false)
          setLastSaved(new Date())
          setHasUnsavedChanges(false)

          addToast({
            title: "Settings Saved",
            description: "Appearance settings have been updated successfully.",
            type: "success",
            duration: 3000,
          })

          return 0
        }
        return prev + 10
      })
    }, 100)
  }, [addToast])

  // Handle backup settings
  const handleBackupSettings = useCallback(() => {
    setIsBackingUp(true)
    setBackupProgress(0)

    // Simulate backup process with progress
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)

          addToast({
            title: "Backup Complete",
            description: "All settings have been backed up successfully.",
            type: "success",
            duration: 3000,
          })

          setIsBackupDialogOpen(false)
          return 0
        }
        return prev + 5
      })
    }, 100)
  }, [addToast])

  // Handle restore settings
  const handleRestoreSettings = useCallback(() => {
    setIsRestoring(true)
    setRestoreProgress(0)

    // Simulate restore process with progress
    const interval = setInterval(() => {
      setRestoreProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRestoring(false)

          // Reset all settings to default
          setGeneralSettings({
            appName: "Hushhly",
            supportEmail: "support@hushhly.com",
            timezone: "UTC",
            language: "en",
            maintenanceMode: false,
            analyticsEnabled: true,
            feedbackEnabled: true,
          })

          setSecuritySettings({
            twoFactorAuth: true,
            passwordExpiry: "90",
            sessionTimeout: "30",
            ipRestriction: false,
            dataEncryption: true,
            auditLogging: true,
          })

          setNotificationSettings({
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false,
            reminderFrequency: "daily",
            notifyNewContent: true,
            notifySystemUpdates: true,
          })

          setAppearanceSettings({
            theme: "light",
            primaryColor: "#00B4D8",
            fontFamily: "Inter",
            compactMode: false,
            animationsEnabled: true,
            highContrastMode: false,
          })

          addToast({
            title: "Restore Complete",
            description: "All settings have been restored to defaults.",
            type: "success",
            duration: 3000,
          })

          setIsRestoreDialogOpen(false)
          return 0
        }
        return prev + 5
      })
    }, 100)
  }, [addToast])

  // Handle setting change
  const handleSettingChange = useCallback(() => {
    setHasUnsavedChanges(true)
  }, [])

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  // Format date for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Custom tab component to avoid using shadcn Tabs
  const TabButton = ({
    value,
    active,
    onClick,
    children,
  }: {
    value: string
    active: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <button
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md ${
        active ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure basic application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" ref={generalFormRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "general-appName" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "general-appName"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "general-appName" ? 2 : 0 }}
                  >
                    <Label htmlFor="app-name">Application Name</Label>
                    <Input
                      id="app-name"
                      value={generalSettings.appName}
                      onChange={(e) => {
                        setGeneralSettings({
                          ...generalSettings,
                          appName: e.target.value,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "general-supportEmail" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "general-supportEmail"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "general-supportEmail" ? 2 : 0 }}
                  >
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => {
                        setGeneralSettings({
                          ...generalSettings,
                          supportEmail: e.target.value,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "general-timezone" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "general-timezone"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "general-timezone" ? 2 : 0 }}
                  >
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select
                      value={generalSettings.timezone}
                      onValueChange={(value) => {
                        setGeneralSettings({
                          ...generalSettings,
                          timezone: value,
                        })
                        handleSettingChange()
                      }}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "general-language" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "general-language"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "general-language" ? 2 : 0 }}
                  >
                    <Label htmlFor="language">Default Language</Label>
                    <Select
                      value={generalSettings.language}
                      onValueChange={(value) => {
                        setGeneralSettings({
                          ...generalSettings,
                          language: value,
                        })
                        handleSettingChange()
                      }}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "general-maintenanceMode" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "general-maintenanceMode"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "general-maintenanceMode" ? 2 : 0 }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable maintenance mode to temporarily disable the application
                      </p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => {
                        setGeneralSettings({
                          ...generalSettings,
                          maintenanceMode: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "general-analyticsEnabled" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "general-analyticsEnabled"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "general-analyticsEnabled" ? 2 : 0 }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable analytics to track user behavior and app usage
                      </p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={generalSettings.analyticsEnabled}
                      onCheckedChange={(checked) => {
                        setGeneralSettings({
                          ...generalSettings,
                          analyticsEnabled: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "general-feedbackEnabled" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "general-feedbackEnabled"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "general-feedbackEnabled" ? 2 : 0 }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="feedback">User Feedback</Label>
                      <p className="text-sm text-muted-foreground">Allow users to submit feedback and suggestions</p>
                    </div>
                    <Switch
                      id="feedback"
                      checked={generalSettings.feedbackEnabled}
                      onCheckedChange={(checked) => {
                        setGeneralSettings({
                          ...generalSettings,
                          feedbackEnabled: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                {isSaving && activeTab === "general" ? (
                  <div className="w-full">
                    <Progress value={saveProgress} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground text-right">Saving changes...</div>
                  </div>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveGeneralSettings}
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        )
      case "security":
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" ref={securityFormRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "security-passwordExpiry" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "security-passwordExpiry"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "security-passwordExpiry" ? 2 : 0 }}
                  >
                    <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                    <Input
                      id="password-expiry"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => {
                        setSecuritySettings({
                          ...securitySettings,
                          passwordExpiry: e.target.value,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "security-sessionTimeout" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "security-sessionTimeout"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "security-sessionTimeout" ? 2 : 0 }}
                  >
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => {
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: e.target.value,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "security-twoFactorAuth" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "security-twoFactorAuth"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "security-twoFactorAuth" ? 2 : 0 }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication for all admin users
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({
                          ...securitySettings,
                          twoFactorAuth: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "security-ipRestriction" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "security-ipRestriction"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "security-ipRestriction" ? 2 : 0 }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="ip-restriction">IP Restriction</Label>
                      <p className="text-sm text-muted-foreground">Restrict admin access to specific IP addresses</p>
                    </div>
                    <Switch
                      id="ip-restriction"
                      checked={securitySettings.ipRestriction}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({
                          ...securitySettings,
                          ipRestriction: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "security-dataEncryption" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "security-dataEncryption"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "security-dataEncryption" ? 2 : 0 }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="data-encryption">Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">Enable end-to-end encryption for sensitive data</p>
                    </div>
                    <Switch
                      id="data-encryption"
                      checked={securitySettings.dataEncryption}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({
                          ...securitySettings,
                          dataEncryption: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "security-auditLogging" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "security-auditLogging"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "security-auditLogging" ? 2 : 0 }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="audit-logging">Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">Log all admin actions for security auditing</p>
                    </div>
                    <Switch
                      id="audit-logging"
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => {
                        setSecuritySettings({
                          ...securitySettings,
                          auditLogging: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                {isSaving && activeTab === "security" ? (
                  <div className="w-full">
                    <Progress value={saveProgress} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground text-right">Saving changes...</div>
                  </div>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveSecuritySettings}
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        )
      case "notifications":
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure notification preferences and delivery methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" ref={notificationFormRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "notification-reminderFrequency" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "notification-reminderFrequency"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: highlightedSetting === "notification-reminderFrequency" ? 2 : 0,
                    }}
                  >
                    <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                    <Select
                      value={notificationSettings.reminderFrequency}
                      onValueChange={(value) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          reminderFrequency: value,
                        })
                        handleSettingChange()
                      }}
                    >
                      <SelectTrigger id="reminder-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "notification-emailNotifications" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "notification-emailNotifications"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: highlightedSetting === "notification-emailNotifications" ? 2 : 0,
                    }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "notification-pushNotifications" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "notification-pushNotifications"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: highlightedSetting === "notification-pushNotifications" ? 2 : 0,
                    }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "notification-marketingEmails" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "notification-marketingEmails"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: highlightedSetting === "notification-marketingEmails" ? 2 : 0,
                    }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Send marketing and promotional emails</p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          marketingEmails: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "notification-notifyNewContent" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "notification-notifyNewContent"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: highlightedSetting === "notification-notifyNewContent" ? 2 : 0,
                    }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="new-content">New Content Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify users when new content is available</p>
                    </div>
                    <Switch
                      id="new-content"
                      checked={notificationSettings.notifyNewContent}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          notifyNewContent: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "notification-notifySystemUpdates" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "notification-notifySystemUpdates"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: highlightedSetting === "notification-notifySystemUpdates" ? 2 : 0,
                    }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="system-updates">System Update Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify users about system updates and maintenance</p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={notificationSettings.notifySystemUpdates}
                      onCheckedChange={(checked) => {
                        setNotificationSettings({
                          ...notificationSettings,
                          notifySystemUpdates: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                {isSaving && activeTab === "notifications" ? (
                  <div className="w-full">
                    <Progress value={saveProgress} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground text-right">Saving changes...</div>
                  </div>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveNotificationSettings}
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        )
      case "appearance":
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-500" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize the look and feel of your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" ref={appearanceFormRef}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "appearance-theme" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "appearance-theme"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "appearance-theme" ? 2 : 0 }}
                  >
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={appearanceSettings.theme}
                      onValueChange={(value) => {
                        setAppearanceSettings({
                          ...appearanceSettings,
                          theme: value,
                        })
                        handleSettingChange()
                      }}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "appearance-primaryColor" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "appearance-primaryColor"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "appearance-primaryColor" ? 2 : 0 }}
                  >
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => {
                          setAppearanceSettings({
                            ...appearanceSettings,
                            primaryColor: e.target.value,
                          })
                          handleSettingChange()
                        }}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => {
                          setAppearanceSettings({
                            ...appearanceSettings,
                            primaryColor: e.target.value,
                          })
                          handleSettingChange()
                        }}
                        className="flex-1"
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    className={`space-y-2 ${highlightedSetting === "appearance-fontFamily" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "appearance-fontFamily"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "appearance-fontFamily" ? 2 : 0 }}
                  >
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select
                      value={appearanceSettings.fontFamily}
                      onValueChange={(value) => {
                        setAppearanceSettings({
                          ...appearanceSettings,
                          fontFamily: value,
                        })
                        handleSettingChange()
                      }}
                    >
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "appearance-compactMode" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "appearance-compactMode"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{ duration: 1.5, repeat: highlightedSetting === "appearance-compactMode" ? 2 : 0 }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact layout with less whitespace</p>
                    </div>
                    <Switch
                      id="compact-mode"
                      checked={appearanceSettings.compactMode}
                      onCheckedChange={(checked) => {
                        setAppearanceSettings({
                          ...appearanceSettings,
                          compactMode: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "appearance-animationsEnabled" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "appearance-animationsEnabled"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: highlightedSetting === "appearance-animationsEnabled" ? 2 : 0,
                    }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="animations">Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable animations and transitions</p>
                    </div>
                    <Switch
                      id="animations"
                      checked={appearanceSettings.animationsEnabled}
                      onCheckedChange={(checked) => {
                        setAppearanceSettings({
                          ...appearanceSettings,
                          animationsEnabled: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className={`flex items-center justify-between ${highlightedSetting === "appearance-highContrastMode" ? "bg-blue-50 p-2 rounded-md" : ""}`}
                    animate={{
                      backgroundColor:
                        highlightedSetting === "appearance-highContrastMode"
                          ? ["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)"]
                          : "transparent",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: highlightedSetting === "appearance-highContrastMode" ? 2 : 0,
                    }}
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better accessibility</p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={appearanceSettings.highContrastMode}
                      onCheckedChange={(checked) => {
                        setAppearanceSettings({
                          ...appearanceSettings,
                          highContrastMode: checked,
                        })
                        handleSettingChange()
                      }}
                    />
                  </motion.div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                {isSaving && activeTab === "appearance" ? (
                  <div className="w-full">
                    <Progress value={saveProgress} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground text-right">Saving changes...</div>
                  </div>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveAppearanceSettings}
                    disabled={isSaving}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Admin Settings</h1>
          <div className="flex items-center gap-4">
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
              System Settings
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Configure and manage your application settings.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-between items-center mb-4"
          >
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
              <TabButton value="general" active={activeTab === "general"} onClick={() => setActiveTab("general")}>
                <Globe className="h-4 w-4" />
                <span>General</span>
              </TabButton>
              <TabButton value="security" active={activeTab === "security"} onClick={() => setActiveTab("security")}>
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabButton>
              <TabButton
                value="notifications"
                active={activeTab === "notifications"}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabButton>
              <TabButton
                value="appearance"
                active={activeTab === "appearance"}
                onClick={() => setActiveTab("appearance")}
              >
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </TabButton>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setIsBackupDialogOpen(true)}>
                      <Download className="mr-2 h-4 w-4" />
                      Backup
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Backup all settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setIsRestoreDialogOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Restore
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Restore settings from backup</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="real-time-updates"
                        checked={showRealTimeUpdates}
                        onCheckedChange={setShowRealTimeUpdates}
                      />
                      <Label htmlFor="real-time-updates" className="text-sm">
                        Real-time
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enable real-time updates</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {hasUnsavedChanges && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <span className="text-amber-700">You have unsaved changes</span>
                  {lastSaved && (
                    <span className="text-amber-600 text-sm ml-2">Last saved: {formatTime(lastSaved)}</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={() => setHasUnsavedChanges(false)}
                >
                  <Undo className="mr-2 h-3 w-3" />
                  Discard Changes
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Backup Dialog */}
      <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Backup Settings</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            <p className="mb-4">
              This will create a backup of all your current settings. You can restore these settings later if needed.
            </p>

            {isBackingUp && (
              <div className="space-y-2">
                <Progress value={backupProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Backing up settings...</span>
                  <span>{backupProgress}%</span>
                </div>
              </div>
            )}
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)} disabled={isBackingUp}>
              Cancel
            </Button>
            <Button onClick={handleBackupSettings} disabled={isBackingUp}>
              {isBackingUp ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Backing Up...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Backup Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restore Settings</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="py-4"
          >
            <p className="mb-4 text-amber-600">
              Warning: This will reset all settings to their default values. This action cannot be undone.
            </p>

            {isRestoring && (
              <div className="space-y-2">
                <Progress value={restoreProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Restoring settings...</span>
                  <span>{restoreProgress}%</span>
                </div>
              </div>
            )}
          </motion.div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)} disabled={isRestoring}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRestoreSettings} disabled={isRestoring}>
              {isRestoring ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Restore Defaults
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Center */}
      {isNotificationOpen && (
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
      )}
    </div>
  )
}

