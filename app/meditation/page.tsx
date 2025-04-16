"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash, ExternalLink, Filter, HeadphonesIcon, PlayCircle, ListFilter, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/toast-provider"
import { NotificationCenter } from "@/components/notification-center"

// Generate random dates within the last 30 days
const generateRecentDate = () => {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))
  return date
}

// Meditation categories
const categories = [
  "Sleep",
  "Stress Relief",
  "Focus",
  "Motivation",
  "Mindfulness",
  "Anxiety Relief",
  "Relaxation",
  "Spirituality",
  "Bonding",
  "Sleep Aid",
]

// Initial meditation data
const initialMeditations = [
  {
    id: 1,
    name: "Deep Relaxation For Parents",
    category: "Sleep",
    uploadDate: generateRecentDate(),
    duration: "10 Min",
    plays: 4500,
    icon: "🧘‍♀️",
  },
  {
    id: 2,
    name: "Quick Stress Reset",
    category: "Stress Relief",
    uploadDate: generateRecentDate(),
    duration: "5 Min",
    plays: 3200,
    icon: "🌿",
  },
  {
    id: 3,
    name: "Focus Booster",
    category: "Focus",
    uploadDate: generateRecentDate(),
    duration: "8 Min",
    plays: 2800,
    icon: "🔍",
  },
  {
    id: 4,
    name: "Morning Energy Boost",
    category: "Motivation",
    uploadDate: generateRecentDate(),
    duration: "7 Min",
    plays: 3900,
    icon: "⚡",
  },
  {
    id: 5,
    name: "Calm Before Bed",
    category: "Sleep",
    uploadDate: generateRecentDate(),
    duration: "15 Min",
    plays: 5100,
    icon: "🌙",
  },
  {
    id: 6,
    name: "Patience Practice For Parents",
    category: "Mindfulness",
    uploadDate: generateRecentDate(),
    duration: "6 Min",
    plays: 2600,
    icon: "🧠",
  },
  {
    id: 7,
    name: "Let Go Of Stress",
    category: "Anxiety Relief",
    uploadDate: generateRecentDate(),
    duration: "10 Min",
    plays: 4700,
    icon: "🌊",
  },
  {
    id: 8,
    name: "Guided Deep Breathing",
    category: "Relaxation",
    uploadDate: generateRecentDate(),
    duration: "5 Min",
    plays: 3500,
    icon: "💨",
  },
  {
    id: 9,
    name: "Clarity And Focus",
    category: "Focus",
    uploadDate: generateRecentDate(),
    duration: "12 Min",
    plays: 2400,
    icon: "✨",
  },
  {
    id: 10,
    name: "Inner Peace Meditation",
    category: "Spirituality",
    uploadDate: generateRecentDate(),
    duration: "15 Min",
    plays: 1900,
    icon: "☮️",
  },
  {
    id: 11,
    name: "Parent & Child Connection",
    category: "Bonding",
    uploadDate: generateRecentDate(),
    duration: "8 Min",
    plays: 3300,
    icon: "👨‍👧",
  },
  {
    id: 12,
    name: "Midday Reset",
    category: "Stress Relief",
    uploadDate: generateRecentDate(),
    duration: "7 Min",
    plays: 2700,
    icon: "🔄",
  },
  {
    id: 13,
    name: "Overcoming Overwhelm",
    category: "Anxiety Relief",
    uploadDate: generateRecentDate(),
    duration: "9 Min",
    plays: 4100,
    icon: "🛡️",
  },
  {
    id: 14,
    name: "Nature Sounds Relaxation",
    category: "Sleep Aid",
    uploadDate: generateRecentDate(),
    duration: "20 Min",
    plays: 5600,
    icon: "🌳",
  },
  {
    id: 15,
    name: "Self-Compassion Meditation",
    category: "Mindfulness",
    uploadDate: generateRecentDate(),
    duration: "10 Min",
    plays: 3800,
    icon: "❤️",
  },
]

// Import the meditation tracker
import { MeditationTracker } from "@/components/meditation-tracker"

export default function MeditationManagementPage() {
  const { addToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<
    { id: number; title: string; message: string; read: boolean; time: Date }[]
  >([
    {
      id: 1,
      title: "New Meditation Added",
      message: "A new meditation 'Mindful Walking' has been added",
      read: false,
      time: new Date(new Date().getTime() - 30 * 60000), // 30 minutes ago
    },
    {
      id: 2,
      title: "Meditation Update",
      message: "The 'Deep Relaxation' meditation has been updated",
      read: false,
      time: new Date(new Date().getTime() - 120 * 60000), // 2 hours ago
    },
    {
      id: 3,
      title: "Popular Meditation",
      message: "'Calm Before Bed' has reached 5000+ plays",
      read: false,
      time: new Date(new Date().getTime() - 24 * 60 * 60000), // 1 day ago
    },
  ])
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [meditations, setMeditations] = useState(initialMeditations)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [meditationToDelete, setMeditationToDelete] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newMeditation, setNewMeditation] = useState({
    name: "",
    category: "",
    duration: "",
  })
  const [editingMeditation, setEditingMeditation] = useState<null | {
    id: number
    name: string
    category: string
    duration: string
  }>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

  // Update time every second for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate real-time meditation plays
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly increase plays for some meditations
      setMeditations(prev =>
        prev.map(meditation => {
          // 20% chance to increase plays for any meditation
          if (Math.random() < 0.2) {
            const increase = Math.floor(Math.random() * 5) + 1 // 1-5 new plays
            return {
              ...meditation,
              plays: meditation.plays + increase
            }
          }
          return meditation
        })
      )
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Handle delete meditation
  const handleDeleteMeditation = () => {
    if (meditationToDelete !== null) {
      setMeditations((prev) => prev.filter((meditation) => meditation.id !== meditationToDelete))
      addToast({
        title: "Meditation deleted",
        description: "The meditation has been successfully deleted.",
        type: "success",
        duration: 3000,
      })
      setIsDeleteDialogOpen(false)
      setMeditationToDelete(null)
    }
  }

  // Handle add new meditation
  const handleAddMeditation = () => {
    if (newMeditation.name && newMeditation.category && newMeditation.duration) {
      const newId = Math.max(...meditations.map((meditation) => meditation.id)) + 1
      const icons = ["🧘‍♀️", "🌿", "🔍", "⚡", "🌙", "🧠", "🌊", "💨", "✨", "☮️"]
      const randomIcon = icons[Math.floor(Math.random() * icons.length)]

      const meditationToAdd = {
        id: newId,
        name: newMeditation.name,
        category: newMeditation.category,
        uploadDate: new Date(),
        duration: `${newMeditation.duration} Min`,
        plays: 0,
        icon: randomIcon,
      }

      setMeditations((prev) => [meditationToAdd, ...prev])
      setNewMeditation({ name: "", category: "", duration: "" })
      setIsAddDialogOpen(false)

      addToast({
        title: "Meditation added",
        description: "The new meditation has been successfully added.",
        type: "success",
        duration: 3000,
      })
    }
  }

  // Handle edit meditation
  const handleEditMeditation = () => {
    if (editingMeditation && editingMeditation.name && editingMeditation.category && editingMeditation.duration) {
      setMeditations((prev) =>
        prev.map((meditation) =>
          meditation.id === editingMeditation.id
            ? {
                ...meditation,
                name: editingMeditation.name,
                category: editingMeditation.category,
                duration: `${editingMeditation.duration} Min`,
              }
            : meditation,
        ),
      )

      setIsEditDialogOpen(false)
      setEditingMeditation(null)

      addToast({
        title: "Meditation updated",
        description: "The meditation has been successfully updated.",
        type: "success",
        duration: 3000,
      })
    }
  }

  // Filter meditations based on search query and category
  const filteredMeditations = meditations.filter((meditation) => {
    const matchesSearch = meditation.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? meditation.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  // Display limited meditations unless "View More" is clicked
  const displayedMeditations = showAll ? filteredMeditations : filteredMeditations.slice(0, 10)

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Meditation Management</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-blue-500">
                    <HeadphonesIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{meditations.length}</div>
                <div className="text-sm text-muted-foreground">Total Meditations</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-green-500">
                    <PlayCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">
                  {meditations.reduce((total, meditation) => total + meditation.plays, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Plays</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-purple-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 rounded-md bg-purple-500">
                    <ListFilter className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-1">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <MeditationTracker
              onSessionComplete={(session) => {
                // Add notification when a session completes
                const newNotification = {
                  id: notifications.length + 1,
                  title: "Meditation Session Completed",
                  message: `${session.userName} completed ${session.meditationTitle} meditation`,
                  read: false,
                  time: new Date(),
                }

                setNotifications(prev => [newNotification, ...prev])

                // Increase plays for the completed meditation
                setMeditations(prev =>
                  prev.map(meditation => {
                    if (meditation.name.includes(session.meditationTitle)) {
                      return {
                        ...meditation,
                        plays: meditation.plays + 1
                      }
                    }
                    return meditation
                  })
                )

                addToast({
                  title: "Meditation Completed",
                  description: `${session.userName} completed ${session.meditationTitle}`,
                  type: "success",
                  duration: 3000,
                })
              }}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Plus className="mr-2 h-4 w-4" /> Add New Meditation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Meditation</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={newMeditation.name}
                      onChange={(e) => setNewMeditation({ ...newMeditation, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="category" className="text-right">
                      Category
                    </label>
                    <Select
                      value={newMeditation.category}
                      onValueChange={(value) => setNewMeditation({ ...newMeditation, category: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="duration" className="text-right">
                      Duration (min)
                    </label>
                    <Input
                      id="duration"
                      type="number"
                      value={newMeditation.duration}
                      onChange={(e) => setNewMeditation({ ...newMeditation, duration: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMeditation}>Save</Button>
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
                <h2 className="text-lg font-medium flex items-center">Manage Meditations</h2>
                <div className="text-sm text-muted-foreground ml-auto">{formatDate(currentTime)}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Meditation Name</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Duration</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Plays</th>
                      <th className="px-4 py-3 text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedMeditations.map((meditation) => (
                      <tr key={meditation.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                              <span className="text-lg">{meditation.icon}</span>
                            </div>
                            <div className="font-medium">{meditation.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{meditation.category}</td>
                        <td className="px-4 py-3">{meditation.duration}</td>
                        <td className="px-4 py-3">{meditation.plays.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => {
                                setEditingMeditation({
                                  id: meditation.id,
                                  name: meditation.name,
                                  category: meditation.category,
                                  duration: meditation.duration.split(" ")[0],
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
                                setMeditationToDelete(meditation.id)
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
                                  title: "Meditation details",
                                  description: `Viewing details for "${meditation.name}"`,
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

              {filteredMeditations.length > 10 && (
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
          <p>Are you sure you want to delete this meditation? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMeditation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Meditation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Meditation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Name
              </label>
              <Input
                id="edit-name"
                value={editingMeditation?.name || ""}
                onChange={(e) =>
                  setEditingMeditation(editingMeditation ? { ...editingMeditation, name: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-category" className="text-right">
                Category
              </label>
              {editingMeditation && (
                <Select
                  value={editingMeditation.category}
                  onValueChange={(value) => setEditingMeditation({ ...editingMeditation, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-duration" className="text-right">
                Duration (min)
              </label>
              <Input
                id="edit-duration"
                type="number"
                value={editingMeditation?.duration || ""}
                onChange={(e) =>
                  setEditingMeditation(editingMeditation ? { ...editingMeditation, duration: e.target.value } : null)
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMeditation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Meditations</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category-filter" className="text-right">
                Category
              </label>
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                  description: "Meditations have been filtered",
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

