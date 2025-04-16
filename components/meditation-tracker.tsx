"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import { HeadphonesIcon, Clock, Calendar, User, BarChart2 } from "lucide-react"

interface MeditationSession {
  id: number
  userId: number
  userName: string
  userAvatar: string
  meditationId: number
  meditationTitle: string
  duration: number
  completionRate: number
  startTime: Date
  endTime: Date | null
  isActive: boolean
}

interface MeditationTrackerProps {
  onSessionComplete?: (session: MeditationSession) => void
}

export function MeditationTracker({ onSessionComplete }: MeditationTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeSessions, setActiveSessions] = useState<MeditationSession[]>([])
  const [completedSessions, setCompletedSessions] = useState<MeditationSession[]>([])
  
  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      
      // Update active sessions progress
      setActiveSessions(prev => 
        prev.map(session => {
          const elapsedTime = (currentTime.getTime() - session.startTime.getTime()) / 1000
          const progress = Math.min(100, (elapsedTime / (session.duration * 60)) * 100)
          
          // If session is complete, move it to completed sessions
          if (progress >= 100 && session.isActive) {
            const completedSession = {
              ...session,
              isActive: false,
              endTime: new Date(),
              completionRate: 100
            }
            
            // Call the onSessionComplete callback if provided
            if (onSessionComplete) {
              onSessionComplete(completedSession)
            }
            
            // Add to completed sessions
            setCompletedSessions(prev => [completedSession, ...prev])
            
            // Remove from active sessions
            return { ...session, isActive: false }
          }
          
          return {
            ...session,
            completionRate: progress
          }
        }).filter(session => session.isActive)
      )
    }, 1000)
    
    return () => clearInterval(interval)
  }, [currentTime, onSessionComplete])
  
  // Generate random active sessions every 30-60 seconds
  useEffect(() => {
    const generateSession = () => {
      const users = [
        { id: 1, name: "Sarah Johnson", avatar: "/placeholder.svg?height=40&width=40&text=SJ" },
        { id: 2, name: "Michael Brown", avatar: "/placeholder.svg?height=40&width=40&text=MB" },
        { id: 3, name: "Emily Davis", avatar: "/placeholder.svg?height=40&width=40&text=ED" },
        { id: 4, name: "David Wilson", avatar: "/placeholder.svg?height=40&width=40&text=DW" },
        { id: 5, name: "Jessica Taylor", avatar: "/placeholder.svg?height=40&width=40&text=JT" },
      ]
      
      const meditations = [
        { id: 1, title: "Deep Relaxation" },
        { id: 2, title: "Quick Stress Reset" },
        { id: 3, title: "Focus Booster" },
        { id: 4, title: "Morning Energy" },
        { id: 5, title: "Calm Before Bed" },
      ]
      
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomMeditation = meditations[Math.floor(Math.random() * meditations.length)]
      const randomDuration = Math.floor(Math.random() * 15) + 5 // 5-20 minutes
      
      const newSession: MeditationSession = {
        id: Date.now(),
        userId: randomUser.id,
        userName: randomUser.name,
        userAvatar: randomUser.avatar,
        meditationId: randomMeditation.id,
        meditationTitle: randomMeditation.title,
        duration: randomDuration,
        completionRate: 0,
        startTime: new Date(),
        endTime: null,
        isActive: true
      }
      
      setActiveSessions(prev => [...prev, newSession])
    }
    
    // Initial sessions
    generateSession()
    generateSession()
    
    const interval = setInterval(() => {
      // Only generate a new session if we have less than 5 active sessions
      if (activeSessions.length < 5 && Math.random() > 0.5) {
        generateSession()
      }
    }, Math.random() * 30000 + 30000) // Random interval between 30-60 seconds
    
    return () => clearInterval(interval)
  }, [activeSessions.length])
  
  // Format duration in minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <HeadphonesIcon className="mr-2 h-5 w-5 text-blue-500" />
              Meditation Tracker
            </CardTitle>
            <CardDescription>Real-time meditation session tracking</CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(currentTime)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Active Sessions ({activeSessions.length})</h3>
            {activeSessions.length > 0 ? (
              <div className="space-y-3">
                {activeSessions.map(session => {
                  const elapsedSeconds = (currentTime.getTime() - session.startTime.getTime()) / 1000
                  const remainingSeconds = Math.max(0, session.duration * 60 - elapsedSeconds)
                  
                  return (
                    <div key={session.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={session.userAvatar} alt={session.userName} />
                            <AvatarFallback>{session.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{session.userName}</div>
                            <div className="text-xs text-muted-foreground">{session.meditationTitle}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-blue-50">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(remainingSeconds)} left
                        </Badge>
                      </div>
                      <Progress value={session.completionRate} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatDuration(elapsedSeconds)} elapsed</span>
                        <span>{session.completionRate.toFixed(0)}% complete</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No active meditation sessions
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Recently Completed ({completedSessions.length})</h3>
            {completedSessions.length > 0 ? (
              <div className="space-y-2">
                {completedSessions.slice(0, 3).map(session => (
                  <div key={session.id} className="border rounded-md p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={session.userAvatar} alt={session.userName} />
                        <AvatarFallback>{session.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{session.userName}</div>
                        <div className="text-xs text-muted-foreground">{session.meditationTitle}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="success" className="mb-1">Completed</Badge>
                      <div className="text-xs text-muted-foreground">
                        {session.duration} min • {formatDate(session.startTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No completed meditation sessions
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between text-sm">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1 text-blue-500" />
            <span>{activeSessions.length + completedSessions.length} total users</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-green-500" />
            <span>{completedSessions.length} completed today</span>
          </div>
          <div className="flex items-center">
            <BarChart2 className="h-4 w-4 mr-1 text-purple-500" />
            <span>{Math.floor(completedSessions.reduce((sum, session) => sum + session.duration, 0))} minutes meditated</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
