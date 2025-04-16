"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Activity, BookOpen, Headphones } from "lucide-react"

interface StatsCardProps {
  data: {
    title: string
    value: number
    change: string
    icon: string
    color: string
    chartData: number[]
  }
}

export function StatsCard({ data }: StatsCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previousValueRef = useRef(data.value)
  const animationRef = useRef<number | null>(null)
  const displayValueRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with proper scaling for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw sparkline
    const drawSparkline = () => {
      if (!ctx) return

      const width = rect.width
      const height = rect.height
      const chartData = [...data.chartData]
      const max = Math.max(...chartData) * 1.2
      const min = Math.min(...chartData) * 0.8
      const range = max - min

      // Draw the line
      ctx.beginPath()
      ctx.strokeStyle = getLineColor()
      ctx.lineWidth = 2

      chartData.forEach((value, i) => {
        const x = (i / (chartData.length - 1)) * width
        const y = height - ((value - min) / range) * height

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw the gradient area
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, `${getAreaColor()}40`) // 25% opacity
      gradient.addColorStop(1, `${getAreaColor()}05`) // 5% opacity

      ctx.fillStyle = gradient
      ctx.fill()

      // Draw dots at each data point
      chartData.forEach((value, i) => {
        const x = (i / (chartData.length - 1)) * width
        const y = height - ((value - min) / range) * height

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = getLineColor()
        ctx.fill()
      })
    }

    drawSparkline()
  }, [data])

  // Animate value changes
  useEffect(() => {
    if (previousValueRef.current === data.value) return

    const startValue = previousValueRef.current
    const endValue = data.value
    const duration = 1000 // ms
    const startTime = performance.now()

    const animateValue = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t)
      const easedProgress = easeOutQuad(progress)

      const currentValue = Math.floor(startValue + (endValue - startValue) * easedProgress)

      if (displayValueRef.current) {
        displayValueRef.current.textContent = currentValue.toLocaleString()
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateValue)
      } else {
        previousValueRef.current = endValue
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    animationRef.current = requestAnimationFrame(animateValue)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [data.value])

  const getIcon = () => {
    switch (data.icon) {
      case "users":
        return <Users className="h-5 w-5 text-white" />
      case "activity":
        return <Activity className="h-5 w-5 text-white" />
      case "meditation":
        return <Headphones className="h-5 w-5 text-white" />
      case "book":
        return <BookOpen className="h-5 w-5 text-white" />
      default:
        return null
    }
  }

  const getIconBgColor = () => {
    switch (data.color) {
      case "blue":
        return "bg-blue-500"
      case "green":
        return "bg-emerald-500"
      case "yellow":
        return "bg-amber-500"
      case "cyan":
        return "bg-cyan-500"
      default:
        return "bg-blue-500"
    }
  }

  const getLineColor = () => {
    switch (data.color) {
      case "blue":
        return "#3b82f6"
      case "green":
        return "#10b981"
      case "yellow":
        return "#f59e0b"
      case "cyan":
        return "#06b6d4"
      default:
        return "#3b82f6"
    }
  }

  const getAreaColor = () => {
    switch (data.color) {
      case "blue":
        return "#3b82f6"
      case "green":
        return "#10b981"
      case "yellow":
        return "#f59e0b"
      case "cyan":
        return "#06b6d4"
      default:
        return "#3b82f6"
    }
  }

  const getCardBgColor = () => {
    switch (data.color) {
      case "blue":
        return "bg-blue-50"
      case "green":
        return "bg-emerald-50"
      case "yellow":
        return "bg-amber-50"
      case "cyan":
        return "bg-cyan-50"
      default:
        return "bg-blue-50"
    }
  }

  const getChangeColor = () => {
    return data.change.startsWith("+") ? "text-emerald-500" : "text-red-500"
  }

  return (
    <Card className={`border-0 shadow-sm ${getCardBgColor()} stats-card`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className={`p-2 rounded-md ${getIconBgColor()}`}>{getIcon()}</div>
          <span className={`font-medium ${getChangeColor()}`}>{data.change}</span>
        </div>
        <div className="text-2xl font-semibold mb-1">
          <span ref={displayValueRef}>{data.value.toLocaleString()}</span>
        </div>
        <div className="text-sm text-muted-foreground">{data.title}</div>
        <div className="mt-4 h-10">
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  )
}

