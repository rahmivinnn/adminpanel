"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, Search, LogOut, RefreshCw, Copy, Key, Shield, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sidebar } from "@/components/sidebar"
import { useToast } from "@/components/ui/toast-provider"
import { NotificationCenter } from "@/components/notification-center"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

// Generate a random token
const generateToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// Calculate expiration date (1 year from now)
const getExpirationDate = () => {
  const now = new Date()
  const expirationDate = new Date(now)
  expirationDate.setFullYear(now.getFullYear() + 1)
  return expirationDate
}

interface ApiToken {
  id: number
  name: string
  token: string
  createdAt: Date
  expiresAt: Date
  lastUsed: Date | null
  permissions: string[]
  status: 'active' | 'revoked'
}

export default function ApiTokensPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [username, setUsername] = useState<string | null>(null)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isCreateTokenDialogOpen, setIsCreateTokenDialogOpen] = useState(false)
  const [newTokenName, setNewTokenName] = useState("")
  const [newTokenPermissions, setNewTokenPermissions] = useState<string[]>([
    "read:meditations",
    "read:users"
  ])
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [isTokenCopied, setIsTokenCopied] = useState(false)
  const [notifications, setNotifications] = useState<
    { id: number; title: string; message: string; read: boolean; time: Date }[]
  >([
    {
      id: 1,
      title: "New Token Created",
      message: "A new API token 'Mobile App' has been created",
      read: false,
      time: new Date(currentTime.getTime() - 30 * 60000),
    },
    {
      id: 2,
      title: "Token Expired",
      message: "The API token 'Test Token' has expired",
      read: false,
      time: new Date(currentTime.getTime() - 120 * 60000),
    },
  ])
  
  const [tokens, setTokens] = useState<ApiToken[]>([
    {
      id: 1,
      name: "Mobile App",
      token: generateToken(),
      createdAt: new Date(currentTime.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      expiresAt: getExpirationDate(),
      lastUsed: new Date(currentTime.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      permissions: ["read:meditations", "read:users", "upload:media"],
      status: 'active'
    }
  ])

  useEffect(() => {
    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Get username from localStorage
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    return () => clearInterval(interval)
  }, [])

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("loginTime")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const handleCreateToken = () => {
    if (!newTokenName.trim()) {
      addToast({
        title: "Error",
        description: "Token name is required",
        type: "error",
        duration: 3000,
      })
      return
    }

    const token = generateToken()
    setGeneratedToken(token)
    
    // Add the new token to the list
    const newToken: ApiToken = {
      id: tokens.length + 1,
      name: newTokenName,
      token: token,
      createdAt: currentTime,
      expiresAt: getExpirationDate(),
      lastUsed: null,
      permissions: newTokenPermissions,
      status: 'active'
    }
    
    setTokens([...tokens, newToken])
    
    // Add notification
    const newNotification = {
      id: notifications.length + 1,
      title: "New Token Created",
      message: `A new API token '${newTokenName}' has been created`,
      read: false,
      time: currentTime,
    }
    
    setNotifications([newNotification, ...notifications])
    
    addToast({
      title: "Success",
      description: "API token created successfully",
      type: "success",
      duration: 3000,
    })
  }

  const handleCopyToken = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken)
      setIsTokenCopied(true)
      
      addToast({
        title: "Copied",
        description: "Token copied to clipboard",
        type: "success",
        duration: 2000,
      })
      
      setTimeout(() => {
        setIsTokenCopied(false)
      }, 2000)
    }
  }

  const handleRevokeToken = (tokenId: number) => {
    setTokens(tokens.map(token => 
      token.id === tokenId 
        ? { ...token, status: 'revoked' as const } 
        : token
    ))
    
    addToast({
      title: "Token Revoked",
      description: "The API token has been revoked",
      type: "success",
      duration: 3000,
    })
  }

  const handlePermissionChange = (permission: string) => {
    if (newTokenPermissions.includes(permission)) {
      setNewTokenPermissions(newTokenPermissions.filter(p => p !== permission))
    } else {
      setNewTokenPermissions([...newTokenPermissions, permission])
    }
  }

  const closeCreateDialog = () => {
    setIsCreateTokenDialogOpen(false)
    setNewTokenName("")
    setNewTokenPermissions(["read:meditations", "read:users"])
    setGeneratedToken(null)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">API Tokens</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tokens..."
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {isNotificationOpen && (
          <NotificationCenter
            notifications={notifications}
            onClose={() => setIsNotificationOpen(false)}
            onMarkAsRead={(id) => {
              setNotifications(
                notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
              )
            }}
            onMarkAllAsRead={() => {
              setNotifications(notifications.map((n) => ({ ...n, read: true })))
            }}
          />
        )}
        
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">API Token Management</h2>
            <p className="text-muted-foreground">
              Create and manage API tokens for secure access to the Hushhly API.
            </p>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Current time: {formatDate(currentTime)}
            </div>
            <Button onClick={() => setIsCreateTokenDialogOpen(true)}>
              <Key className="mr-2 h-4 w-4" />
              Create New Token
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Active API Tokens</CardTitle>
              <CardDescription>
                Manage your API tokens for integration with mobile apps and other services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Expires</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Last Used</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens
                      .filter(token => token.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((token) => (
                        <tr key={token.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="font-medium">{token.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {token.permissions.join(", ")}
                            </div>
                          </td>
                          <td className="p-4 align-middle">{formatDate(token.createdAt)}</td>
                          <td className="p-4 align-middle">{formatDate(token.expiresAt)}</td>
                          <td className="p-4 align-middle">
                            {token.lastUsed ? formatDate(token.lastUsed) : "Never"}
                          </td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant={token.status === 'active' ? 'success' : 'destructive'}
                              className="capitalize"
                            >
                              {token.status}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              {token.status === 'active' && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRevokeToken(token.id)}
                                >
                                  Revoke
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <Dialog open={isCreateTokenDialogOpen} onOpenChange={closeCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{generatedToken ? "Token Created" : "Create API Token"}</DialogTitle>
            <DialogDescription>
              {generatedToken 
                ? "Your token has been created. Please copy it now as you won't be able to see it again."
                : "Create a new API token for secure access to the Hushhly API."}
            </DialogDescription>
          </DialogHeader>
          
          {!generatedToken ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="token-name">Token Name</Label>
                <Input
                  id="token-name"
                  placeholder="e.g., Mobile App, Development, Testing"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Give your token a descriptive name to remember what it's for.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Token Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="read-meditations"
                      checked={newTokenPermissions.includes("read:meditations")}
                      onCheckedChange={() => handlePermissionChange("read:meditations")}
                    />
                    <Label htmlFor="read-meditations">Read Meditations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="write-meditations"
                      checked={newTokenPermissions.includes("write:meditations")}
                      onCheckedChange={() => handlePermissionChange("write:meditations")}
                    />
                    <Label htmlFor="write-meditations">Write Meditations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="read-users"
                      checked={newTokenPermissions.includes("read:users")}
                      onCheckedChange={() => handlePermissionChange("read:users")}
                    />
                    <Label htmlFor="read-users">Read Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="write-users"
                      checked={newTokenPermissions.includes("write:users")}
                      onCheckedChange={() => handlePermissionChange("write:users")}
                    />
                    <Label htmlFor="write-users">Write Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="upload-media"
                      checked={newTokenPermissions.includes("upload:media")}
                      onCheckedChange={() => handlePermissionChange("upload:media")}
                    />
                    <Label htmlFor="upload-media">Upload Media</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="payment-processing"
                      checked={newTokenPermissions.includes("payment:processing")}
                      onCheckedChange={() => handlePermissionChange("payment:processing")}
                    />
                    <Label htmlFor="payment-processing">Process Payments</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Token Expiration</Label>
                <div className="text-sm">
                  This token will expire on {formatDate(getExpirationDate())}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="token">Your API Token</Label>
                <div className="flex">
                  <Input
                    id="token"
                    value={generatedToken}
                    readOnly
                    className="font-mono text-xs pr-20"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={handleCopyToken}
                  >
                    {isTokenCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-xs text-red-500 font-medium mt-2">
                  Make sure to copy this token now. You won't be able to see it again!
                </p>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <div className="flex">
                  <Shield className="h-5 w-5 text-muted-foreground mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">Security Notice</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep your API tokens secure. They have access to your account according to the permissions you've granted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {!generatedToken ? (
              <>
                <Button variant="outline" onClick={closeCreateDialog}>
                  Cancel
                </Button>
                <Button onClick={handleCreateToken}>
                  Create Token
                </Button>
              </>
            ) : (
              <Button onClick={closeCreateDialog}>
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
