"use client"

import { useState, useEffect } from "react"
import { Search, Download, CreditCard, Calendar, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { useToast } from "@/components/ui/toast-provider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NotificationCenter } from "@/components/notification-center"

export default function SubscriptionManagementPage() {
  const { addToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date("2025-03-22T09:04:47"))
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<
    { id: number; title: string; message: string; read: boolean; time: Date }[]
  >([
    {
      id: 1,
      title: "New User Registration",
      message: "John Smith just registered as a new user",
      read: false,
      time: new Date("2025-03-22T08:30:00"),
    },
    {
      id: 2,
      title: "Payment Received",
      message: "You received a payment of $19.99 from Sarah Johnson",
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
  const [selectedPlan, setSelectedPlan] = useState("all")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

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

  // Subscription data
  const subscriptions = [
    {
      id: 1,
      user: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=JS",
      },
      plan: "Monthly",
      status: "Active",
      startDate: new Date("2025-01-15"),
      nextBillingDate: new Date("2025-04-15"),
      amount: 9.99,
      paymentMethod: "Credit Card",
      cardInfo: "**** **** **** 4242",
    },
    {
      id: 2,
      user: {
        name: "Michael Johnson",
        email: "michael.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=MJ",
      },
      plan: "Yearly",
      status: "Active",
      startDate: new Date("2024-08-10"),
      nextBillingDate: new Date("2025-08-10"),
      amount: 99.99,
      paymentMethod: "PayPal",
      cardInfo: "michael.johnson@example.com",
    },
    {
      id: 3,
      user: {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=ED",
      },
      plan: "Monthly",
      status: "Cancelled",
      startDate: new Date("2024-11-05"),
      nextBillingDate: new Date("2025-03-05"),
      amount: 9.99,
      paymentMethod: "Credit Card",
      cardInfo: "**** **** **** 1234",
    },
    {
      id: 4,
      user: {
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=RW",
      },
      plan: "Yearly",
      status: "Active",
      startDate: new Date("2024-06-20"),
      nextBillingDate: new Date("2025-06-20"),
      amount: 99.99,
      paymentMethod: "Apple Pay",
      cardInfo: "Apple Pay",
    },
    {
      id: 5,
      user: {
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=SB",
      },
      plan: "Monthly",
      status: "Active",
      startDate: new Date("2025-02-15"),
      nextBillingDate: new Date("2025-04-15"),
      amount: 9.99,
      paymentMethod: "Google Pay",
      cardInfo: "Google Pay",
    },
    {
      id: 6,
      user: {
        name: "David Lee",
        email: "david.lee@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=DL",
      },
      plan: "Yearly",
      status: "Expired",
      startDate: new Date("2023-12-01"),
      nextBillingDate: new Date("2024-12-01"),
      amount: 99.99,
      paymentMethod: "Credit Card",
      cardInfo: "**** **** **** 5678",
    },
    {
      id: 7,
      user: {
        name: "Jennifer Martinez",
        email: "jennifer.martinez@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=JM",
      },
      plan: "Monthly",
      status: "Active",
      startDate: new Date("2025-01-10"),
      nextBillingDate: new Date("2025-04-10"),
      amount: 9.99,
      paymentMethod: "PayPal",
      cardInfo: "jennifer.martinez@example.com",
    },
    {
      id: 8,
      user: {
        name: "Thomas Anderson",
        email: "thomas.anderson@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=TA",
      },
      plan: "Yearly",
      status: "Active",
      startDate: new Date("2024-09-15"),
      nextBillingDate: new Date("2025-09-15"),
      amount: 99.99,
      paymentMethod: "Credit Card",
      cardInfo: "**** **** **** 9012",
    },
  ]

  // Filter subscriptions based on search query and filters
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPlan = selectedPlan === "all" || subscription.plan === selectedPlan
    const matchesPaymentMethod = selectedPaymentMethod === "all" || subscription.paymentMethod === selectedPaymentMethod
    const matchesStatus = selectedStatus === "all" || subscription.status === selectedStatus

    return matchesSearch && matchesPlan && matchesPaymentMethod && matchesStatus
  })

  // Calculate subscription stats
  const activeSubscriptions = subscriptions.filter((s) => s.status === "Active").length
  const monthlySubscriptions = subscriptions.filter((s) => s.plan === "Monthly" && s.status === "Active").length
  const yearlySubscriptions = subscriptions.filter((s) => s.plan === "Yearly" && s.status === "Active").length
  const totalRevenue = subscriptions
    .filter((s) => s.status === "Active")
    .reduce((total, s) => total + (s.plan === "Monthly" ? s.amount : s.amount / 12), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Subscription Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search subscribers..."
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
            <h2 className="text-2xl font-semibold mb-1">Subscription Overview</h2>
            <p className="text-muted-foreground">Manage and monitor all subscription plans and payments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-blue-500">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{activeSubscriptions}</div>
                <div className="text-sm text-muted-foreground">Active Subscriptions</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-green-500">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{monthlySubscriptions}</div>
                <div className="text-sm text-muted-foreground">Monthly Plans</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-amber-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-amber-500">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{yearlySubscriptions}</div>
                <div className="text-sm text-muted-foreground">Yearly Plans</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-cyan-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-cyan-500">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{formatCurrency(totalRevenue)}</div>
                <div className="text-sm text-muted-foreground">Monthly Revenue</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Subscriptions</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <TabsContent value="all" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Subscription Details</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                      <SelectTrigger className="w-[150px] h-8 text-sm">
                        <SelectValue placeholder="Filter by plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <SelectTrigger className="w-[180px] h-8 text-sm">
                        <SelectValue placeholder="Filter by payment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Payment Methods</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="PayPal">PayPal</SelectItem>
                        <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                        <SelectItem value="Google Pay">Google Pay</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[150px] h-8 text-sm">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Plan</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Start Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Next Billing</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Payment Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubscriptions.map((subscription) => (
                          <tr key={subscription.id} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={subscription.user.avatar} alt={subscription.user.name} />
                                  <AvatarFallback>{subscription.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{subscription.user.name}</div>
                                  <div className="text-sm text-muted-foreground">{subscription.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={
                                  subscription.plan === "Monthly"
                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                                    : "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                                }
                              >
                                {subscription.plan}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={
                                  subscription.status === "Active"
                                    ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                                    : subscription.status === "Cancelled"
                                      ? "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
                                      : "bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200"
                                }
                              >
                                {subscription.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">{subscription.startDate.toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm">{subscription.nextBillingDate.toLocaleDateString()}</td>
                            <td className="px-4 py-3 font-medium">
                              {formatCurrency(subscription.amount)}/{subscription.plan === "Monthly" ? "mo" : "yr"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {subscription.paymentMethod === "Credit Card" ? (
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                ) : subscription.paymentMethod === "PayPal" ? (
                                  <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M19.5 8.5H4.5C3.4 8.5 2.5 9.4 2.5 10.5V17.5C2.5 18.6 3.4 19.5 4.5 19.5H19.5C20.6 19.5 21.5 18.6 21.5 17.5V10.5C21.5 9.4 20.6 8.5 19.5 8.5Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M17.5 19.5V6.5C17.5 5.4 16.6 4.5 15.5 4.5H8.5C7.4 4.5 6.5 5.4 6.5 6.5V8.5"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M12 16V12"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M12 8H12.01"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                                <span className="text-sm">{subscription.cardInfo}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Plan</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Start Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Next Billing</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Payment Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions
                          .filter((s) => s.status === "Active")
                          .map((subscription) => (
                            <tr key={subscription.id} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={subscription.user.avatar} alt={subscription.user.name} />
                                    <AvatarFallback>{subscription.user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{subscription.user.name}</div>
                                    <div className="text-sm text-muted-foreground">{subscription.user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    subscription.plan === "Monthly"
                                      ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                                      : "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                                  }
                                >
                                  {subscription.plan}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">{subscription.startDate.toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{subscription.nextBillingDate.toLocaleDateString()}</td>
                              <td className="px-4 py-3 font-medium">
                                {formatCurrency(subscription.amount)}/{subscription.plan === "Monthly" ? "mo" : "yr"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {subscription.paymentMethod === "Credit Card" ? (
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  ) : subscription.paymentMethod === "PayPal" ? (
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M19.5 8.5H4.5C3.4 8.5 2.5 9.4 2.5 10.5V17.5C2.5 18.6 3.4 19.5 4.5 19.5H19.5C20.6 19.5 21.5 18.6 21.5 17.5V10.5C21.5 9.4 20.6 8.5 19.5 8.5Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M17.5 19.5V6.5C17.5 5.4 16.6 4.5 15.5 4.5H8.5C7.4 4.5 6.5 5.4 6.5 6.5V8.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12 16V12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12 8H12.01"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                  <span className="text-sm">{subscription.cardInfo}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cancelled" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Plan</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Start Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">End Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Payment Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions
                          .filter((s) => s.status === "Cancelled")
                          .map((subscription) => (
                            <tr key={subscription.id} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={subscription.user.avatar} alt={subscription.user.name} />
                                    <AvatarFallback>{subscription.user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{subscription.user.name}</div>
                                    <div className="text-sm text-muted-foreground">{subscription.user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    subscription.plan === "Monthly"
                                      ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                                      : "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                                  }
                                >
                                  {subscription.plan}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">{subscription.startDate.toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{subscription.nextBillingDate.toLocaleDateString()}</td>
                              <td className="px-4 py-3 font-medium">
                                {formatCurrency(subscription.amount)}/{subscription.plan === "Monthly" ? "mo" : "yr"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {subscription.paymentMethod === "Credit Card" ? (
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  ) : subscription.paymentMethod === "PayPal" ? (
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M19.5 8.5H4.5C3.4 8.5 2.5 9.4 2.5 10.5V17.5C2.5 18.6 3.4 19.5 4.5 19.5H19.5C20.6 19.5 21.5 18.6 21.5 17.5V10.5C21.5 9.4 20.6 8.5 19.5 8.5Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M17.5 19.5V6.5C17.5 5.4 16.6 4.5 15.5 4.5H8.5C7.4 4.5 6.5 5.4 6.5 6.5V8.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12 16V12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12 8H12.01"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                  <span className="text-sm">{subscription.cardInfo}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expired" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Plan</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Start Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Expired Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Payment Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions
                          .filter((s) => s.status === "Expired")
                          .map((subscription) => (
                            <tr key={subscription.id} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={subscription.user.avatar} alt={subscription.user.name} />
                                    <AvatarFallback>{subscription.user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{subscription.user.name}</div>
                                    <div className="text-sm text-muted-foreground">{subscription.user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    subscription.plan === "Monthly"
                                      ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                                      : "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                                  }
                                >
                                  {subscription.plan}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">{subscription.startDate.toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{subscription.nextBillingDate.toLocaleDateString()}</td>
                              <td className="px-4 py-3 font-medium">
                                {formatCurrency(subscription.amount)}/{subscription.plan === "Monthly" ? "mo" : "yr"}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {subscription.paymentMethod === "Credit Card" ? (
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  ) : subscription.paymentMethod === "PayPal" ? (
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M19.5 8.5H4.5C3.4 8.5 2.5 9.4 2.5 10.5V17.5C2.5 18.6 3.4 19.5 4.5 19.5H19.5C20.6 19.5 21.5 18.6 21.5 17.5V10.5C21.5 9.4 20.6 8.5 19.5 8.5Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M17.5 19.5V6.5C17.5 5.4 16.6 4.5 15.5 4.5H8.5C7.4 4.5 6.5 5.4 6.5 6.5V8.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12 16V12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M12 8H12.01"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                  <span className="text-sm">{subscription.cardInfo}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Customer Support</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-10 w-10 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Contact Support</h3>
                    <p className="text-muted-foreground">
                      Need help with subscription management? Contact our support team at{" "}
                      <a href="mailto:husslys@support.zendesk.com" className="text-blue-600 hover:underline">
                        husslys@support.zendesk.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-10 w-10 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.09 9.00002C9.3251 8.33169 9.78915 7.76813 10.4 7.40915C11.0108 7.05018 11.7289 6.91896 12.4272 7.03873C13.1255 7.15851 13.7588 7.52154 14.2151 8.06355C14.6713 8.60555 14.9211 9.29154 14.92 10C14.92 12 11.92 13 11.92 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17H12.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">FAQs</h3>
                    <p className="text-muted-foreground">
                      Check our frequently asked questions about subscription management and billing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
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
    </div>
  )
}

