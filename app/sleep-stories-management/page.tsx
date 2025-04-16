"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, Plus, Search, X, Upload } from "lucide-react"
import { SleepStoryUploadForm } from "@/components/sleep-story-upload-form"

interface SleepStory {
  id: string
  title: string
  description: string
  duration: string
  category: string
  plays: number
}

export default function SleepStoriesManagementPage() {
  const router = useRouter()
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Sample data
  const [sleepStories, setSleepStories] = useState<SleepStory[]>([
    {
      id: "1",
      title: "Peaceful Forest Journey",
      description: "A calming journey through a magical forest",
      duration: "20",
      category: "Nature",
      plays: 3200
    },
    {
      id: "2",
      title: "Ocean Waves Lullaby",
      description: "Gentle ocean waves to help you sleep",
      duration: "30",
      category: "Nature",
      plays: 2800
    }
  ])

  const filteredStories = sleepStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || story.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sleep Stories Management</h1>
          <p className="text-gray-600 mt-2">Manage your sleep story content</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Sleep Story
          </Button>
          <Button 
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowUploadForm(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Sleep Story
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search sleep stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="bedtime">Bedtime Stories</SelectItem>
            <SelectItem value="relaxation">Relaxation</SelectItem>
            <SelectItem value="nature">Nature Sounds</SelectItem>
            <SelectItem value="fantasy">Fantasy</SelectItem>
            <SelectItem value="meditation">Meditation Stories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add New Sleep Story Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Sleep Story</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* Add form content here */}
          </div>
        </div>
      )}

      {/* Upload Sleep Story Form */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upload Sleep Stories</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowUploadForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                You can upload up to 1000 audio files (MP3, WAV, M4A). Fill in the details for each file.
              </p>
            </div>
            <div className="mt-4">
              <SleepStoryUploadForm onClose={() => setShowUploadForm(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{story.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Duration: {story.duration} min</span>
                <span>Category: {story.category}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Plays: {story.plays}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No sleep stories found. Add your first sleep story!</p>
        </div>
      )}
    </div>
  )
} 