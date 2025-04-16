"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MessageSquare, CheckCircle, Clock, XCircle } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { NotificationCenter } from "@/components/notification-center"

export default function CustomerSupportPage() {
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
  const [replyText, setReplyText] = useState("")
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

  // Support tickets data
  const tickets = [
    {
      id: 1,
      user: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=JS",
      },
      subject: "Can't access meditation content",
      message:
        "I'm having trouble accessing the meditation content I purchased. The app keeps showing an error message.",
      status: "Open",
      priority: "High",
      createdAt: new Date("2025-03-21T14:30:00"),
      lastUpdated: new Date("2025-03-21T16:45:00"),
      assignedTo: "Support Team",
      replies: [
        {
          id: 101,
          from: "Support Team",
          message:
            "Hi Jane, I'm sorry you're experiencing issues. Could you please provide more details about the error message you're seeing?",
          timestamp: new Date("2025-03-21T15:30:00"),
        },
        {
          id: 102,
          from: "Jane Smith",
          message: "It says 'Content unavailable. Please check your internet connection and try again.'",
          timestamp: new Date("2025-03-21T16:45:00"),
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Michael Johnson",
        email: "michael.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=MJ",
      },
      subject: "Billing issue with yearly subscription",
      message: "I was charged twice for my yearly subscription. Please help me resolve this issue.",
      status: "In Progress",
      priority: "High",
      createdAt: new Date("2025-03-20T09:15:00"),
      lastUpdated: new Date("2025-03-21T11:20:00"),
      assignedTo: "Billing Team",
      replies: [
        {
          id: 201,
          from: "Billing Team",
          message:
            "Hi Michael, I'm looking into this issue for you. Could you please provide your transaction IDs for both charges?",
          timestamp: new Date("2025-03-20T10:30:00"),
        },
        {
          id: 202,
          from: "Michael Johnson",
          message: "The transaction IDs are TX-12345 and TX-12346. Both were charged on March 19.",
          timestamp: new Date("2025-03-20T11:45:00"),
        },
        {
          id: 203,
          from: "Billing Team",
          message:
            "Thank you for providing the transaction IDs. I can confirm there was a duplicate charge. We'll process a refund for the second charge within 3-5 business days.",
          timestamp: new Date("2025-03-21T11:20:00"),
        },
      ],
    },
    {
      id: 3,
      user: {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=ED",
      },
      subject: "Feature request: Customizable meditation timer",
      message:
        "I would love to see a customizable meditation timer in the app. It would be great to set specific intervals for different meditation techniques.",
      status: "Closed",
      priority: "Medium",
      createdAt: new Date("2025-03-18T13:45:00"),
      lastUpdated: new Date("2025-03-19T15:30:00"),
      assignedTo: "Product Team",
      replies: [
        {
          id: 301,
          from: "Product Team",
          message:
            "Hi Emily, thank you for your suggestion! We appreciate your feedback and will consider this feature for future updates.",
          timestamp: new Date("2025-03-19T10:15:00"),
        },
        {
          id: 302,
          from: "Emily Davis",
          message: "Thank you for considering my suggestion. Looking forward to future updates!",
          timestamp: new Date("2025-03-19T15:30:00"),
        },
      ],
    },
    {
      id: 4,
      user: {
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=RW",
      },
      subject: "App crashes during sleep story playback",
      message:
        "The app keeps crashing when I try to play the 'Ocean Waves' sleep story. I'm using an iPhone 14 Pro with the latest iOS version.",
      status: "Open",
      priority: "High",
      createdAt: new Date("2025-03-21T20:10:00"),
      lastUpdated: new Date("2025-03-21T20:10:00"),
      assignedTo: "Technical Support",
      replies: [],
    },
    {
      id: 5,
      user: {
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=SB",
      },
      subject: "How to cancel subscription",
      message: "I need to cancel my subscription. Could you please guide me through the process?",
      status: "Closed",
      priority: "Low",
      createdAt: new Date("2025-03-17T11:30:00"),
      lastUpdated: new Date("2025-03-18T09:45:00"),
      assignedTo: "Customer Support",
      replies: [
        {
          id: 501,
          from: "Customer Support",
          message:
            "Hi Sarah, to cancel your subscription, please go to Settings > Account > Subscription > Cancel Subscription. Let me know if you need further assistance.",
          timestamp: new Date("2025-03-17T14:20:00"),
        },
        {
          id: 502,
          from: "Sarah Brown",
          message: "Thank you! I was able to cancel my subscription.",
          timestamp: new Date("2025-03-18T09:45:00"),
        },
      ],
    },
  ]

  // Filter tickets based on search query and status
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Calculate support stats
  const openTickets = tickets.filter((t) => t.status === "Open").length
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length
  const closedTickets = tickets.filter((t) => t.status === "Closed").length
  const totalTickets = tickets.length

  const handleSendReply = (ticketId: number) => {
    if (!replyText.trim()) return

    addToast({
      title: "Reply Sent",
      description: "Your reply has been sent successfully",
      type: "success",
      duration: 3000,
    })

    setReplyText("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
      case "In Progress":
        return "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
      case "Closed":
        return "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
      case "Medium":
        return "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
      case "Low":
        return "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200"
    }
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Customer Support</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets..."
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
            <h2 className="text-2xl font-semibold mb-1">Support Tickets</h2>
            <p className="text-muted-foreground">Manage and respond to customer support tickets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-blue-500">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{totalTickets}</div>
                <div className="text-sm text-muted-foreground">Total Tickets</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-green-500">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{closedTickets}</div>
                <div className="text-sm text-muted-foreground">Resolved Tickets</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-amber-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-amber-500">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{inProgressTickets}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-red-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-red-500">
                    <XCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{openTickets}</div>
                <div className="text-sm text-muted-foreground">Open Tickets</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <TabsContent value="all" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Subject</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Priority</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Created</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Last Updated</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Assigned To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets.map((ticket) => (
                          <tr key={ticket.id} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={ticket.user.avatar} alt={ticket.user.name} />
                                  <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{ticket.user.name}</div>
                                  <div className="text-sm text-muted-foreground">{ticket.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">{ticket.createdAt.toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm">{ticket.lastUpdated.toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm">{ticket.assignedTo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="open" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Subject</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Priority</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Created</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Assigned To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets
                          .filter((t) => t.status === "Open")
                          .map((ticket) => (
                            <tr key={ticket.id} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={ticket.user.avatar} alt={ticket.user.name} />
                                    <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{ticket.user.name}</div>
                                    <div className="text-sm text-muted-foreground">{ticket.user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">{ticket.createdAt.toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{ticket.assignedTo}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="in-progress" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Subject</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Priority</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Created</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Last Updated</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Assigned To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets
                          .filter((t) => t.status === "In Progress")
                          .map((ticket) => (
                            <tr key={ticket.id} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={ticket.user.avatar} alt={ticket.user.name} />
                                    <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{ticket.user.name}</div>
                                    <div className="text-sm text-muted-foreground">{ticket.user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">{ticket.createdAt.toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{ticket.lastUpdated.toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{ticket.assignedTo}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="closed" className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Subject</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Priority</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Created</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Resolved</th>
                          <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Assigned To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets
                          .filter((t) => t.status === "Closed")
                          .map((ticket) => (
                            <tr key={ticket.id} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={ticket.user.avatar} alt={ticket.user.name} />
                                    <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{ticket.user.name}</div>
                                    <div className="text-sm text-muted-foreground">{ticket.user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium">{ticket.subject}</td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">{ticket.createdAt.toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{ticket.lastUpdated.toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{ticket.assignedTo}</td>
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
              <CardTitle className="text-lg font-medium">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {tickets.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={tickets[0].user.avatar} alt={tickets[0].user.name} />
                        <AvatarFallback>{tickets[0].user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">{tickets[0].subject}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{tickets[0].user.name}</span>
                          <span>•</span>
                          <span>{tickets[0].createdAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <Badge variant="outline" className={getStatusColor(tickets[0].status)}>
                            {tickets[0].status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4 bg-gray-50">
                      <p>{tickets[0].message}</p>
                    </div>
                  </div>

                  {tickets[0].replies.map((reply) => (
                    <div key={reply.id} className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{reply.from.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{reply.from}</h4>
                          <div className="text-sm text-muted-foreground">
                            {reply.timestamp.toLocaleDateString()} at {reply.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4 bg-gray-50 ml-14">
                        <p>{reply.message}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col gap-4 mt-4">
                    <h4 className="font-medium">Reply</h4>
                    <Textarea
                      placeholder="Type your reply here..."
                      className="min-h-[120px]"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button onClick={() => handleSendReply(tickets[0].id)}>Send Reply</Button>
                    </div>
                  </div>
                </div>
              )}
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

