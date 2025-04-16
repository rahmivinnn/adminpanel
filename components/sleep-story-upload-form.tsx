"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SleepStoryFile {
  id: string
  file: File
  title: string
  description: string
  duration: string
  category: string
  uploadProgress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
}

interface SleepStoryUploadFormProps {
  onClose: () => void
}

export function SleepStoryUploadForm({ onClose }: SleepStoryUploadFormProps) {
  const [files, setFiles] = useState<SleepStoryFile[]>([])
  const [error, setError] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      title: "",
      description: "",
      duration: "",
      category: "",
      uploadProgress: 0,
      status: 'pending' as const
    }))
    setFiles(prev => [...prev, ...newFiles])
    setError("")
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a']
    }
  })

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleUpdateFile = (id: string, updates: Partial<SleepStoryFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const incompleteFiles = files.filter(f => !f.title || !f.description || !f.duration || !f.category)
    if (incompleteFiles.length > 0) {
      setError("Please fill in all fields for each file")
      return
    }

    try {
      // Simulate uploading files one by one
      for (const file of files) {
        handleUpdateFile(file.id, { status: 'uploading' })
        
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          handleUpdateFile(file.id, { uploadProgress: progress })
        }
        
        handleUpdateFile(file.id, { status: 'completed' })
      }

      // Close form after all uploads are complete
      onClose()
    } catch (err) {
      setError("Failed to upload files. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the audio files here"
            : "Drag and drop audio files here, or click to select"}
        </p>
        <p className="text-xs text-gray-500 mt-1">Supports MP3, WAV, M4A</p>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {files.length > 0 && (
        <ScrollArea className="h-[400px] border rounded-md p-4">
          <div className="space-y-8">
            {files.map((file) => (
              <div key={file.id} className="relative border rounded-lg p-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => handleRemoveFile(file.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <p className="font-medium mb-4">File: {file.file.name}</p>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={file.title}
                      onChange={(e) => handleUpdateFile(file.id, { title: e.target.value })}
                      placeholder="Enter sleep story title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={file.description}
                      onChange={(e) => handleUpdateFile(file.id, { description: e.target.value })}
                      placeholder="Enter sleep story description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={file.duration}
                        onChange={(e) => handleUpdateFile(file.id, { duration: e.target.value })}
                        placeholder="Duration"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={file.category}
                        onValueChange={(value) => handleUpdateFile(file.id, { category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bedtime">Bedtime Stories</SelectItem>
                          <SelectItem value="relaxation">Relaxation</SelectItem>
                          <SelectItem value="nature">Nature Sounds</SelectItem>
                          <SelectItem value="fantasy">Fantasy</SelectItem>
                          <SelectItem value="meditation">Meditation Stories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {file.status === 'uploading' && (
                  <div className="mt-4 space-y-2">
                    <Progress value={file.uploadProgress} />
                    <p className="text-sm text-gray-500">Uploading... {file.uploadProgress}%</p>
                  </div>
                )}

                {file.status === 'completed' && (
                  <p className="mt-4 text-sm text-green-600">Upload complete!</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={files.length === 0}>
          Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
        </Button>
      </div>
    </form>
  )
} 