"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, ChevronDown, Search, LogOut, RefreshCw, CreditCard, DollarSign, Calendar, Filter, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: number
  user: {
    name: string
    email: string
    avatar: string
  }
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: Date
  paymentMethod: string
  type: 'subscription' | 'one-time'
  description: string
}

export default function PaymentsPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [username, setUsername] = useState<string | null>(null)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [isProcessPaymentDialogOpen, setIsProcessPaymentDialogOpen] = useState(false)
  const [newPayment, setNewPayment] = useState({
    userEmail: "",
    amount: "",
    description: "",
    paymentMethod: "credit-card"
  })

  const [notifications, setNotifications] = useState<
    { id: number; title: string; message: string; read: boolean; time: Date }[]
  >([
    {
      id: 1,
      title: "New Payment Received",
      message: "You received a payment of $19.99 from Sarah Johnson",
      read: false,
      time: new Date(currentTime.getTime() - 30 * 60000),
    },
    {
      id: 2,
      title: "Payment Failed",
      message: "Payment from Michael Brown failed due to insufficient funds",
      read: false,
      time: new Date(currentTime.getTime() - 120 * 60000),
    },
  ])

  // Generate transactions with current date
  const generateTransactions = () => {
    const users = [
      { name: "Sarah Johnson", email: "sarah.j@example.com", avatar: "/placeholder.svg?height=40&width=40&text=SJ" },
      { name: "Michael Brown", email: "michael.b@example.com", avatar: "/placeholder.svg?height=40&width=40&text=MB" },
      { name: "Emily Davis", email: "emily.d@example.com", avatar: "/placeholder.svg?height=40&width=40&text=ED" },
      { name: "David Wilson", email: "david.w@example.com", avatar: "/placeholder.svg?height=40&width=40&text=DW" },
      { name: "Jessica Taylor", email: "jessica.t@example.com", avatar: "/placeholder.svg?height=40&width=40&text=JT" },
    ]

    const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'pending', 'failed']
    const types: ('subscription' | 'one-time')[] = ['subscription', 'one-time']
    const paymentMethods = ["Credit Card", "PayPal", "Apple Pay", "Google Pay"]
    const descriptions = [
      "Monthly Subscription",
      "Annual Subscription",
      "Premium Content Purchase",
      "Meditation Pack",
      "Sleep Stories Bundle"
    ]

    const transactions: Transaction[] = []

    // Create transactions for the past 30 days
    for (let i = 0; i < 20; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const hoursAgo = Math.floor(Math.random() * 24)
      const minutesAgo = Math.floor(Math.random() * 60)

      const date = new Date(currentTime)
      date.setDate(date.getDate() - daysAgo)
      date.setHours(date.getHours() - hoursAgo)
      date.setMinutes(date.getMinutes() - minutesAgo)

      const user = users[Math.floor(Math.random() * users.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const type = types[Math.floor(Math.random() * types.length)]
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      const description = descriptions[Math.floor(Math.random() * descriptions.length)]

      // Generate amount based on type
      let amount = 0
      if (type === 'subscription') {
        amount = description.includes("Annual") ? 99.99 : 9.99
      } else {
        amount = Math.floor(Math.random() * 50) + 5
      }

      transactions.push({
        id: i + 1,
        user,
        amount,
        status,
        date,
        paymentMethod,
        type,
        description
      })
    }

    // Sort by date (newest first)
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  const [transactions, setTransactions] = useState<Transaction[]>(generateTransactions())

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const filteredTransactions = transactions.filter(transaction => {
    // Apply search filter
    const searchMatch =
      transaction.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply status filter
    const statusMatch = statusFilter === "all" || transaction.status === statusFilter

    // Apply type filter
    const typeMatch = typeFilter === "all" || transaction.type === typeFilter

    // Apply date filter
    let dateMatch = true
    const today = new Date(currentTime)
    today.setHours(0, 0, 0, 0)

    const transactionDate = new Date(transaction.date)

    if (dateFilter === "today") {
      const transactionDay = new Date(transactionDate)
      transactionDay.setHours(0, 0, 0, 0)
      dateMatch = transactionDay.getTime() === today.getTime()
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const transactionDay = new Date(transactionDate)
      transactionDay.setHours(0, 0, 0, 0)
      dateMatch = transactionDay.getTime() === yesterday.getTime()
    } else if (dateFilter === "this-week") {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      dateMatch = transactionDate >= weekStart
    } else if (dateFilter === "this-month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      dateMatch = transactionDate >= monthStart
    }

    return searchMatch && statusMatch && typeMatch && dateMatch
  })

  // Calculate stats
  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingRevenue = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const todayRevenue = transactions
    .filter(t => {
      const today = new Date(currentTime)
      today.setHours(0, 0, 0, 0)

      const transactionDay = new Date(t.date)
      transactionDay.setHours(0, 0, 0, 0)

      return t.status === 'completed' && transactionDay.getTime() === today.getTime()
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const handleProcessPayment = () => {
    if (!newPayment.userEmail || !newPayment.amount || !newPayment.description) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields",
        type: "error",
        duration: 3000,
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newPayment.userEmail)) {
      addToast({
        title: "Error",
        description: "Please enter a valid email address",
        type: "error",
        duration: 3000,
      })
      return
    }

    // Validate amount
    const amount = parseFloat(newPayment.amount)
    if (isNaN(amount) || amount <= 0) {
      addToast({
        title: "Error",
        description: "Please enter a valid amount",
        type: "error",
        duration: 3000,
      })
      return
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      user: {
        name: newPayment.userEmail.split('@')[0],
        email: newPayment.userEmail,
        avatar: `/placeholder.svg?height=40&width=40&text=${newPayment.userEmail.charAt(0).toUpperCase()}`,
      },
      amount,
      status: 'completed',
      date: currentTime,
      paymentMethod: newPayment.paymentMethod === 'credit-card' ? 'Credit Card' :
                     newPayment.paymentMethod === 'paypal' ? 'PayPal' :
                     newPayment.paymentMethod === 'apple-pay' ? 'Apple Pay' : 'Google Pay',
      type: 'one-time',
      description: newPayment.description
    }

    // Add to transactions
    setTransactions([newTransaction, ...transactions])

    // Add notification
    const newNotification = {
      id: notifications.length + 1,
      title: "New Payment Processed",
      message: `Payment of ${formatCurrency(amount)} from ${newPayment.userEmail} was processed successfully`,
      read: false,
      time: currentTime,
    }

    setNotifications([newNotification, ...notifications])

    // Show success toast
    addToast({
      title: "Success",
      description: "Payment processed successfully",
      type: "success",
      duration: 3000,
    })

    // Reset form and close dialog
    setNewPayment({
      userEmail: "",
      amount: "",
      description: "",
      paymentMethod: "credit-card"
    })

    setIsProcessPaymentDialogOpen(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Payment Processing</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
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
            <h2 className="text-2xl font-semibold mb-1">Payment Management</h2>
            <p className="text-muted-foreground">
              Process and track payments from users in real-time.
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Current time: {formatDate(currentTime)}
            </div>
            <Button onClick={() => setIsProcessPaymentDialogOpen(true)}>
              <DollarSign className="mr-2 h-4 w-4" />
              Process Payment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">From all completed transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(todayRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">From today's completed transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(pendingRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">From pending transactions</p>
              </CardContent>
              <CardFooter className="pt-0 pb-3">
                <Link href="/withdrawals" className="text-xs text-blue-500 hover:underline">
                  Withdraw funds →
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and manage all payment transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="status-filter" className="text-xs mb-1 block">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="type-filter" className="text-xs mb-1 block">Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger id="type-filter">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="date-filter" className="text-xs mb-1 block">Date</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger id="date-filter">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={transaction.user.avatar} alt={transaction.user.name} />
                                <AvatarFallback>{transaction.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{transaction.user.name}</div>
                                <div className="text-xs text-muted-foreground">{transaction.user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-xs text-muted-foreground capitalize">{transaction.type}</div>
                          </td>
                          <td className="p-4 align-middle font-medium">{formatCurrency(transaction.amount)}</td>
                          <td className="p-4 align-middle">{formatDate(transaction.date)}</td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant={
                                transaction.status === 'completed' ? 'success' :
                                transaction.status === 'pending' ? 'outline' : 'destructive'
                              }
                              className="capitalize"
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              {transaction.paymentMethod === "Credit Card" ? (
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                              ) : transaction.paymentMethod === "PayPal" ? (
                                <svg
                                  className="h-4 w-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M19.5 8.25H4.5C3.67157 8.25 3 8.92157 3 9.75V18.75C3 19.5784 3.67157 20.25 4.5 20.25H19.5C20.3284 20.25 21 19.5784 21 18.75V9.75C21 8.92157 20.3284 8.25 19.5 8.25Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M16.5 20.25V6C16.5 5.40326 16.2629 4.83097 15.841 4.40901C15.419 3.98705 14.8467 3.75 14.25 3.75H9.75C9.15326 3.75 8.58097 3.98705 8.15901 4.40901C7.73705 4.83097 7.5 5.40326 7.5 6V20.25"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{transaction.paymentMethod}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No transactions found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={isProcessPaymentDialogOpen} onOpenChange={setIsProcessPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Enter the payment details to process a new payment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-email">User Email</Label>
              <Input
                id="user-email"
                placeholder="user@example.com"
                value={newPayment.userEmail}
                onChange={(e) => setNewPayment({ ...newPayment, userEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                placeholder="0.00"
                type="number"
                min="0.01"
                step="0.01"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Monthly Subscription"
                value={newPayment.description}
                onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select
                value={newPayment.paymentMethod}
                onValueChange={(value) => setNewPayment({ ...newPayment, paymentMethod: value })}
              >
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="apple-pay">Apple Pay</SelectItem>
                  <SelectItem value="google-pay">Google Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProcessPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayment}>
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
