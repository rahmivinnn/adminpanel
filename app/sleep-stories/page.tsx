"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Plus, Edit, Trash, ExternalLink, Filter } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-provider"
import { NotificationCenter } from "@/components/notification-center"

// Generate random dates in March 2025
const generateMarchDate = () => {
  const day = Math.floor(Math.random() * 22) + 1 // 1-22 March
  return new Date(
    `2025-03-${day.toString().padStart(2, "0")}T${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00`,
  )
}

// Sleep story data
const initialSleepStories = [
  {
    id: 1,
    title: "The Gentle Night",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🌙",
    uploadDate: generateMarchDate(),
    duration: "10 Min",
    plays: 4500,
  },
  {
    id: 2,
    title: "Drift Off With Deep Ocean Waves",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🌊",
    uploadDate: generateMarchDate(),
    duration: "5 Min",
    plays: 3200,
  },
  {
    id: 3,
    title: "The Whispering Forest",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🌲",
    uploadDate: generateMarchDate(),
    duration: "8 Min",
    plays: 2800,
  },
  {
    id: 4,
    title: "Starlit Dreams",
    thumbnail: "/placeholder.svg?height=50&width=50&text=✨",
    uploadDate: generateMarchDate(),
    duration: "7 Min",
    plays: 3900,
  },
  {
    id: 5,
    title: "The Cozy Cabin",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🏡",
    uploadDate: generateMarchDate(),
    duration: "15 Min",
    plays: 5100,
  },
  {
    id: 6,
    title: "Lullaby Of The Moon",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🌕",
    uploadDate: generateMarchDate(),
    duration: "6 Min",
    plays: 2600,
  },
  {
    id: 7,
    title: "The Sleepy Train Ride",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🚂",
    uploadDate: generateMarchDate(),
    duration: "10 Min",
    plays: 4700,
  },
  {
    id: 8,
    title: "Hush, Little River",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🏞️",
    uploadDate: generateMarchDate(),
    duration: "5 Min",
    plays: 3500,
  },
  {
    id: 9,
    title: "The Floating Cloud",
    thumbnail: "/placeholder.svg?height=50&width=50&text=☁️",
    uploadDate: generateMarchDate(),
    duration: "12 Min",
    plays: 2400,
  },
  {
    id: 10,
    title: "The Starry Campfire",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🔥",
    uploadDate: generateMarchDate(),
    duration: "15 Min",
    plays: 1900,
  },
  {
    id: 11,
    title: "The Magic Lantern",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🪄",
    uploadDate: generateMarchDate(),
    duration: "8 Min",
    plays: 3300,
  },
  {
    id: 12,
    title: "The Secret Garden Of Dreams",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🌷",
    uploadDate: generateMarchDate(),
    duration: "7 Min",
    plays: 2700,
  },
  {
    id: 13,
    title: "The Softest Pillow",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🛌",
    uploadDate: generateMarchDate(),
    duration: "9 Min",
    plays: 4100,
  },
  {
    id: 14,
    title: "Waves Of Serenity",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🌊",
    uploadDate: generateMarchDate(),
    duration: "20 Min",
    plays: 5600,
  },
  {
    id: 15,
    title: "The Snowy Owl's Lullaby",
    thumbnail: "/placeholder.svg?height=50&width=50&text=🦉",
    uploadDate: generateMarchDate(),
    duration: "10 Min",
    plays: 3800,
  },
]

export default function SleepStoriesPage() {
  const { addToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date("2025-03-22T09:04:47"))
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<
    { id: number; title: string; message: string; read: boolean; time: Date }[]
  >([
    {
      id: 1,
      title: "New Sleep Story Added",
      message: "A new sleep story 'Ocean Waves' has been added",
      read: false,
      time: new Date("2025-03-22T08:30:00"),
    },
    {
      id: 2,
      title: "Story Update",
      message: "The 'Gentle Night' story has been updated",
      read: false,
      time: new Date("2025-03-22T07:45:00"),
    },
    {
      id: 3,
      title: "Popular Story",
      message: "'The Cozy Cabin' has reached 5000+ plays",
      read: false,
      time: new Date("2025-03-21T22:15:00"),
    },
  ])
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [sleepStories, setSleepStories] = useState(initialSleepStories)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStory, setNewStory] = useState({
    title: "",
    duration: "",
  })
  const [editingStory, setEditingStory] = useState<null | {
    id: number
    title: string
    duration: string
  }>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

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

  // Format date for display
  const formatUploadDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  // Handle delete story
  const handleDeleteStory = useCallback(() => {
    if (storyToDelete !== null) {
      setSleepStories((prev) => prev.filter((story) => story.id !== storyToDelete))
      addToast({
        title: "Story deleted",
        description: "The sleep story has been successfully deleted.",
        type: "success",
        duration: 3000,
      })
      setIsDeleteDialogOpen(false)
      setStoryToDelete(null)
    }
  }, [storyToDelete, addToast])

  // Handle add new story
  const handleAddStory = useCallback(() => {
    if (newStory.title && newStory.duration) {
      const newId = Math.max(...sleepStories.map((story) => story.id)) + 1
      const storyToAdd = {
        id: newId,
        title: newStory.title,
        thumbnail: `/placeholder.svg?height=50&width=50&text=${newStory.title.charAt(0)}`,
        uploadDate: new Date(),
        duration: `${newStory.duration} Min`,
        plays: 0,
      }

      setSleepStories((prev) => [storyToAdd, ...prev])
      setNewStory({ title: "", duration: "" })
      setIsAddDialogOpen(false)

      addToast({
        title: "Story added",
        description: "The new sleep story has been successfully added.",
        type: "success",
        duration: 3000,
      })
    }
  }, [newStory, sleepStories, addToast])

  // Handle edit story
  const handleEditStory = useCallback(() => {
    if (editingStory && editingStory.title && editingStory.duration) {
      setSleepStories((prev) =>
        prev.map((story) =>
          story.id === editingStory.id
            ? {
                ...story,
                title: editingStory.title,
                duration: `${editingStory.duration} Min`,
              }
            : story,
        ),
      )

      setIsEditDialogOpen(false)
      setEditingStory(null)

      addToast({
        title: "Story updated",
        description: "The sleep story has been successfully updated.",
        type: "success",
        duration: 3000,
      })
    }
  }, [editingStory, addToast])

  // Handle notification read
  const handleNotificationRead = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  // Handle clear all notifications
  const handleClearAllNotifications = useCallback(() => {
    setNotifications([])
    addToast({
      title: "Notifications Cleared",
      description: "All notifications have been cleared",
      type: "info",
      duration: 3000,
    })
  }, [addToast])

  // Filter stories based on search query
  const filteredStories = sleepStories.filter((story) => story.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Display limited stories unless "View More" is clicked
  const displayedStories = showAll ? filteredStories : filteredStories.slice(0, 10)

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Sleep stories management</h1>
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
          <div className="flex justify-between items-center mb-6">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Plus className="mr-2 h-4 w-4" /> Add New Sleep Story
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Sleep Story</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="title" className="text-right">
                      Title
                    </label>
                    <Input
                      id="title"
                      value={newStory.title}
                      onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="duration" className="text-right">
                      Duration (min)
                    </label>
                    <Input
                      id="duration"
                      type="number"
                      value={newStory.duration}
                      onChange={(e) => setNewStory({ ...newStory, duration: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStory}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="gap-2" onClick={() => setIsFilterDialogOpen(true)}>
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>

          <Card className="shadow-sm border-0">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 p-4 border-b">
                <h2 className="text-lg font-medium flex items-center">Manage Sleep Stories</h2>
                <div className="text-sm text-muted-foreground ml-auto">{formatDate(currentTime)}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Story Title</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Upload Date</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Duration</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Plays</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedStories.map((story) => (
                      <tr key={story.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded overflow-hidden">
                              <Image
                                src={story.thumbnail || "/placeholder.svg"}
                                alt={story.title}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <div className="font-medium">{story.title}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatUploadDate(story.uploadDate)}</td>
                        <td className="px-4 py-3">{story.duration}</td>
                        <td className="px-4 py-3">{story.plays.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => {
                                setEditingStory({
                                  id: story.id,
                                  title: story.title,
                                  duration: story.duration.split(" ")[0],
                                })
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setStoryToDelete(story.id)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
                              onClick={() => {
                                addToast({
                                  title: "Story details",
                                  description: `Viewing details for "${story.title}"`,
                                  type: "info",
                                  duration: 3000,
                                })
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStories.length > 10 && (
                <div className="flex justify-center p-4">
                  <Button variant="outline" className="gap-2" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "Show Less" : "View More"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this sleep story? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Story Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sleep Story</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-title" className="text-right">
                Title
              </label>
              <Input
                id="edit-title"
                value={editingStory?.title || ""}
                onChange={(e) => setEditingStory(editingStory ? { ...editingStory, title: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-duration" className="text-right">
                Duration (min)
              </label>
              <Input
                id="edit-duration"
                type="number"
                value={editingStory?.duration || ""}
                onChange={(e) => setEditingStory(editingStory ? { ...editingStory, duration: e.target.value } : null)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditStory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Sleep Stories</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="duration-filter" className="text-right">
                Duration
              </label>
              <select
                id="duration-filter"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Durations</option>
                <option value="short">Short (5 min or less)</option>
                <option value="medium">Medium (6-10 min)</option>
                <option value="long">Long (more than 10 min)</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date-filter" className="text-right">
                Upload Date
              </label>
              <select
                id="date-filter"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="popularity-filter" className="text-right">
                Popularity
              </label>
              <select
                id="popularity-filter"
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All</option>
                <option value="high">High (4000+ plays)</option>
                <option value="medium">Medium (2000-4000 plays)</option>
                <option value="low">Low (less than 2000 plays)</option>
              </select>
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
                  description: "Sleep stories have been filtered",
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

      {/* Notification Center */}
      {isNotificationOpen && (
        <NotificationCenter
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
          onNotificationRead={handleNotificationRead}
          onClearAll={handleClearAllNotifications}
        />
      )}
    </div>
  )
}

