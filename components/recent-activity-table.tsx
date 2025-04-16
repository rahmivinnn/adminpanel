"use client"

import { useState } from "react"
import { MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RecentActivityTableProps {
  currentTime: Date
}

export function RecentActivityTable({ currentTime }: RecentActivityTableProps) {
  const [filter, setFilter] = useState("all")

  // Sample data
  const allActivities = [
    {
      id: 1,
      user: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=JS",
      },
      activity: "5 Min Meditation",
      status: "Free",
      joinDate: new Date("2025-02-11"),
    },
    {
      id: 2,
      user: {
        name: "Michael Johnson",
        email: "michael.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=MJ",
      },
      activity: "2 Min Meditation",
      status: "Premium",
      joinDate: new Date("2025-03-23"),
    },
    {
      id: 3,
      user: {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=ED",
      },
      activity: "15 Min Meditation",
      status: "Free",
      joinDate: new Date("2024-05-20"),
    },
    {
      id: 4,
      user: {
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=RW",
      },
      activity: "Listen Sleep Story",
      status: "Premium",
      joinDate: new Date("2024-10-31"),
    },
    {
      id: 5,
      user: {
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=SB",
      },
      activity: "10 Min Meditation",
      status: "Premium",
      joinDate: new Date("2025-01-15"),
    },
    {
      id: 6,
      user: {
        name: "David Lee",
        email: "david.lee@example.com",
        avatar: "/placeholder.svg?height=40&width=40&text=DL",
      },
      activity: "Sleep Story",
      status: "Free",
      joinDate: new Date("2025-02-28"),
    },
  ]

  // Filter activities based on selected filter
  const activities =
    filter === "all"
      ? allActivities
      : filter === "premium"
        ? allActivities.filter((a) => a.status === "Premium")
        : allActivities.filter((a) => a.status === "Free")

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  return (
    <div className="overflow-x-auto">
      <div className="p-4 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {activities.length} of {allActivities.length} activities
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] h-8 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="premium">Premium Users</SelectItem>
              <SelectItem value="free">Free Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User</th>
            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Recent activity</th>
            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">User status</th>
            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Join Date</th>
            <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="border-t hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{activity.user.name}</div>
                    <div className="text-sm text-muted-foreground">{activity.user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">{activity.activity}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={activity.status === "Premium" ? "outline" : "secondary"}
                  className={
                    activity.status === "Premium"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                  }
                >
                  {activity.status}
                </Badge>
              </td>
              <td className="px-4 py-3">{formatDate(activity.joinDate)}</td>
              <td className="px-4 py-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

