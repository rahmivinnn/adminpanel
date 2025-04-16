"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, Search, LogOut, RefreshCw, CreditCard, DollarSign, Calendar, Filter, Download, BankIcon, AlertCircle } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Withdrawal {
  id: number
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  date: Date
  bankName: string
  accountNumber: string
  accountName: string
  reference: string
  processingTime?: number // in minutes
}

export default function WithdrawalsPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [username, setUsername] = useState<string | null>(null)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [balance, setBalance] = useState(0) // Starting with 0 balance
  const [pendingAmount, setPendingAmount] = useState(0)
  const [newWithdrawal, setNewWithdrawal] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: ""
  })
  
  const [notifications, setNotifications] = useState<
    { id: number; title: string; message: string; read: boolean; time: Date }[]
  >([
    {
      id: 1,
      title: "Withdrawal Processed",
      message: "Your withdrawal of $250.00 has been processed",
      read: false,
      time: new Date(currentTime.getTime() - 30 * 60000),
    },
    {
      id: 2,
      title: "Withdrawal Failed",
      message: "Withdrawal of $100.00 failed due to invalid bank details",
      read: false,
      time: new Date(currentTime.getTime() - 120 * 60000),
    },
  ])
  
  // Generate withdrawals with current date
  const generateWithdrawals = () => {
    const banks = [
      "Bank Central Asia (BCA)",
      "Bank Mandiri",
      "Bank Rakyat Indonesia (BRI)",
      "Bank Negara Indonesia (BNI)",
      "CIMB Niaga"
    ]
    
    const statuses: ('pending' | 'processing' | 'completed' | 'failed')[] = ['pending', 'processing', 'completed', 'failed']
    
    const withdrawals: Withdrawal[] = []
    
    // Create withdrawals for the past 30 days
    for (let i = 0; i < 10; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const hoursAgo = Math.floor(Math.random() * 24)
      const minutesAgo = Math.floor(Math.random() * 60)
      
      const date = new Date(currentTime)
      date.setDate(date.getDate() - daysAgo)
      date.setHours(date.getHours() - hoursAgo)
      date.setMinutes(date.getMinutes() - minutesAgo)
      
      const bankName = banks[Math.floor(Math.random() * banks.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      // Generate amount between $50 and $500
      const amount = Math.floor(Math.random() * 45000) + 5000
      
      // Generate processing time between 10 minutes and 2 hours
      const processingTime = status === 'completed' ? Math.floor(Math.random() * 110) + 10 : undefined
      
      withdrawals.push({
        id: i + 1,
        amount,
        status,
        date,
        bankName,
        accountNumber: `xxxx-xxxx-${Math.floor(1000 + Math.random() * 9000)}`,
        accountName: "John Doe",
        reference: `WD${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`,
        processingTime
      })
    }
    
    // Sort by date (newest first)
    return withdrawals.sort((a, b) => b.date.getTime() - a.date.getTime())
  }
  
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(generateWithdrawals())

  useEffect(() => {
    // Update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      
      // Update processing withdrawals
      setWithdrawals(prev => 
        prev.map(withdrawal => {
          if (withdrawal.status === 'processing') {
            // 10% chance to complete a processing withdrawal every second
            if (Math.random() < 0.01) {
              // Add notification
              const newNotification = {
                id: notifications.length + 1,
                title: "Withdrawal Completed",
                message: `Your withdrawal of ${formatCurrency(withdrawal.amount)} has been completed`,
                read: false,
                time: new Date(),
              }
              
              setNotifications(prev => [newNotification, ...prev])
              
              addToast({
                title: "Withdrawal Completed",
                description: `Your withdrawal of ${formatCurrency(withdrawal.amount)} has been completed`,
                type: "success",
                duration: 3000,
              })
              
              return {
                ...withdrawal,
                status: 'completed',
                processingTime: Math.floor(Math.random() * 110) + 10
              }
            }
          }
          return withdrawal
        })
      )
    }, 1000)

    // Get username from localStorage
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }
    
    // Calculate pending amount
    const pending = withdrawals
      .filter(w => w.status === 'pending' || w.status === 'processing')
      .reduce((sum, w) => sum + w.amount, 0)
    
    setPendingAmount(pending)

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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    // Apply search filter
    const searchMatch = 
      withdrawal.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.bankName.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Apply status filter
    const statusMatch = statusFilter === "all" || withdrawal.status === statusFilter
    
    // Apply date filter
    let dateMatch = true
    const today = new Date(currentTime)
    today.setHours(0, 0, 0, 0)
    
    const withdrawalDate = new Date(withdrawal.date)
    
    if (dateFilter === "today") {
      const withdrawalDay = new Date(withdrawalDate)
      withdrawalDay.setHours(0, 0, 0, 0)
      dateMatch = withdrawalDay.getTime() === today.getTime()
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const withdrawalDay = new Date(withdrawalDate)
      withdrawalDay.setHours(0, 0, 0, 0)
      dateMatch = withdrawalDay.getTime() === yesterday.getTime()
    } else if (dateFilter === "this-week") {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      dateMatch = withdrawalDate >= weekStart
    } else if (dateFilter === "this-month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      dateMatch = withdrawalDate >= monthStart
    }
    
    return searchMatch && statusMatch && dateMatch
  })
  
  // Calculate stats
  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.amount, 0)
    
  const todayWithdrawn = withdrawals
    .filter(w => {
      const today = new Date(currentTime)
      today.setHours(0, 0, 0, 0)
      
      const withdrawalDay = new Date(w.date)
      withdrawalDay.setHours(0, 0, 0, 0)
      
      return w.status === 'completed' && withdrawalDay.getTime() === today.getTime()
    })
    .reduce((sum, w) => sum + w.amount, 0)
  
  const handleWithdraw = () => {
    if (!newWithdrawal.amount || !newWithdrawal.bankName || !newWithdrawal.accountNumber || !newWithdrawal.accountName) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields",
        type: "error",
        duration: 3000,
      })
      return
    }
    
    // Validate amount
    const amount = parseFloat(newWithdrawal.amount)
    if (isNaN(amount) || amount <= 0) {
      addToast({
        title: "Error",
        description: "Please enter a valid amount",
        type: "error",
        duration: 3000,
      })
      return
    }
    
    // Check if amount is greater than balance
    if (amount > balance) {
      addToast({
        title: "Error",
        description: "Withdrawal amount exceeds available balance",
        type: "error",
        duration: 3000,
      })
      return
    }
    
    // Create new withdrawal
    const newWithdrawalObj: Withdrawal = {
      id: withdrawals.length + 1,
      amount,
      status: 'pending',
      date: currentTime,
      bankName: newWithdrawal.bankName,
      accountNumber: newWithdrawal.accountNumber,
      accountName: newWithdrawal.accountName,
      reference: `WD${currentTime.getFullYear()}${(currentTime.getMonth() + 1).toString().padStart(2, '0')}${currentTime.getDate().toString().padStart(2, '0')}${Math.floor(1000 + Math.random() * 9000)}`,
    }
    
    // Add to withdrawals
    setWithdrawals([newWithdrawalObj, ...withdrawals])
    
    // Update balance
    setBalance(prev => prev - amount)
    
    // Update pending amount
    setPendingAmount(prev => prev + amount)
    
    // Add notification
    const newNotification = {
      id: notifications.length + 1,
      title: "Withdrawal Requested",
      message: `Your withdrawal of ${formatCurrency(amount)} has been requested`,
      read: false,
      time: currentTime,
    }
    
    setNotifications([newNotification, ...notifications])
    
    // Show success toast
    addToast({
      title: "Success",
      description: "Withdrawal request submitted successfully",
      type: "success",
      duration: 3000,
    })
    
    // Reset form and close dialog
    setNewWithdrawal({
      amount: "",
      bankName: "",
      accountNumber: "",
      accountName: ""
    })
    
    setIsWithdrawDialogOpen(false)
    
    // Simulate processing after 30 seconds
    setTimeout(() => {
      setWithdrawals(prev => 
        prev.map(w => {
          if (w.id === newWithdrawalObj.id) {
            // Add notification
            const newNotification = {
              id: notifications.length + 1,
              title: "Withdrawal Processing",
              message: `Your withdrawal of ${formatCurrency(amount)} is now being processed`,
              read: false,
              time: new Date(),
            }
            
            setNotifications(prev => [newNotification, ...prev])
            
            addToast({
              title: "Withdrawal Update",
              description: `Your withdrawal of ${formatCurrency(amount)} is now being processed`,
              type: "info",
              duration: 3000,
            })
            
            return {
              ...w,
              status: 'processing'
            }
          }
          return w
        })
      )
    }, 30000)
  }
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'outline'
      case 'processing':
        return 'secondary'
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Payment Withdrawals</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search withdrawals..."
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
            <h2 className="text-2xl font-semibold mb-1">Withdrawal Management</h2>
            <p className="text-muted-foreground">
              Withdraw your earnings to your bank account in real-time.
            </p>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Current time: {formatDate(currentTime)}
            </div>
            <Button 
              onClick={() => setIsWithdrawDialogOpen(true)}
              disabled={balance <= 0}
            >
              <BankIcon className="mr-2 h-4 w-4" />
              Withdraw Funds
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
                <p className="text-xs text-muted-foreground mt-1">Available for withdrawal</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(pendingAmount)}</div>
                <p className="text-xs text-muted-foreground mt-1">Being processed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalWithdrawn)}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
          </div>
          
          {balance <= 0 && (
            <Alert className="mb-6" variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No funds available</AlertTitle>
              <AlertDescription>
                You currently have no funds available for withdrawal. Funds will appear here once you receive payments.
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>
                View and track all your withdrawal requests.
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
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
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
                      <th className="h-12 px-4 text-left align-middle font-medium">Reference</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Bank</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Processing Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWithdrawals.length > 0 ? (
                      filteredWithdrawals.map((withdrawal) => (
                        <tr key={withdrawal.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">{withdrawal.reference}</td>
                          <td className="p-4 align-middle font-medium">{formatCurrency(withdrawal.amount)}</td>
                          <td className="p-4 align-middle">
                            <div>
                              <div className="font-medium">{withdrawal.bankName}</div>
                              <div className="text-xs text-muted-foreground">{withdrawal.accountNumber}</div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{formatDate(withdrawal.date)}</td>
                          <td className="p-4 align-middle">
                            <Badge
                              variant={getStatusBadgeVariant(withdrawal.status)}
                              className="capitalize"
                            >
                              {withdrawal.status}
                            </Badge>
                            {withdrawal.status === 'processing' && (
                              <div className="mt-1">
                                <Progress value={Math.random() * 100} className="h-1" />
                              </div>
                            )}
                          </td>
                          <td className="p-4 align-middle">
                            {withdrawal.processingTime ? `${withdrawal.processingTime} minutes` : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No withdrawals found matching your filters.
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
      
      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Enter your bank details to withdraw funds from your account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (IDR)</Label>
              <Input
                id="amount"
                placeholder="0"
                type="number"
                min="10000"
                step="1000"
                value={newWithdrawal.amount}
                onChange={(e) => setNewWithdrawal({ ...newWithdrawal, amount: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Available balance: {formatCurrency(balance)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Select 
                value={newWithdrawal.bankName} 
                onValueChange={(value) => setNewWithdrawal({ ...newWithdrawal, bankName: value })}
              >
                <SelectTrigger id="bank-name">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</SelectItem>
                  <SelectItem value="Bank Mandiri">Bank Mandiri</SelectItem>
                  <SelectItem value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</SelectItem>
                  <SelectItem value="Bank Negara Indonesia (BNI)">Bank Negara Indonesia (BNI)</SelectItem>
                  <SelectItem value="CIMB Niaga">CIMB Niaga</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                placeholder="Enter your account number"
                value={newWithdrawal.accountNumber}
                onChange={(e) => setNewWithdrawal({ ...newWithdrawal, accountNumber: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Holder Name</Label>
              <Input
                id="account-name"
                placeholder="Enter account holder name"
                value={newWithdrawal.accountName}
                onChange={(e) => setNewWithdrawal({ ...newWithdrawal, accountName: e.target.value })}
              />
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Processing Time</AlertTitle>
              <AlertDescription>
                Withdrawals are typically processed within 24 hours. You will receive a notification once your withdrawal is complete.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleWithdraw}
              disabled={balance <= 0}
            >
              Withdraw Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
