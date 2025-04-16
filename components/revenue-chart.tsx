"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/components/ui/toast-provider"

interface RevenueChartProps {
  timeframe: string
  dataType: string
}

export function RevenueChart({ timeframe, dataType }: RevenueChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isAnimating, setIsAnimating] = useState(true)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number; value: number; month: string } | null>(null)
  const { addToast } = useToast()

  // Generate data based on timeframe and dataType
  const getChartData = () => {
    // Base data
    let months: string[] = []
    let adsData: number[] = []
    let premiumData: number[] = []

    // Set months based on timeframe
    if (timeframe === "lastMonth") {
      months = ["Week 1", "Week 2", "Week 3", "Week 4"]
      adsData = [300, 450, 380, 520]
      premiumData = [800, 750, 900, 1050]
    } else if (timeframe === "last6Months") {
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      adsData = [300, 1200, 1500, 800, 1000, 1300]
      premiumData = [800, 1800, 2500, 1200, 800, 1800]
    } else if (timeframe === "lastYear") {
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      adsData = [300, 1200, 1500, 800, 1000, 1300, 1100, 900, 1400, 1600, 1200, 1800]
      premiumData = [800, 1800, 2500, 1200, 800, 1800, 2000, 2200, 1900, 2100, 2300, 2700]
    } else if (timeframe === "thisYear") {
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      adsData = [450, 1350, 1650, 1200, 1400, 1700]
      premiumData = [950, 1950, 2650, 1600, 1200, 2200]
    }

    // Filter data based on dataType
    if (dataType === "ads") {
      return { months, adsData, premiumData: [] }
    } else if (dataType === "premium") {
      return { months, adsData: [], premiumData }
    } else {
      return { months, adsData, premiumData }
    }
  }

  useEffect(() => {
    // Reset animation when timeframe or dataType changes
    setAnimationProgress(0)
    setIsAnimating(true)

    // Add a toast notification when timeframe changes
    if (timeframe === "thisYear") {
      addToast({
        title: "This Year Data",
        description: "Showing revenue data for the current year",
        type: "info",
        duration: 2000,
      })
    } else if (timeframe === "lastYear") {
      addToast({
        title: "Last Year Data",
        description: "Showing revenue data for the previous year",
        type: "info",
        duration: 2000,
      })
    } else if (timeframe === "last6Months") {
      addToast({
        title: "Last 6 Months Data",
        description: "Showing revenue data for the last 6 months",
        type: "info",
        duration: 2000,
      })
    }
  }, [timeframe, dataType, addToast])

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

    // Get data based on filters
    const { months, adsData, premiumData } = getChartData()

    // Chart dimensions
    const width = rect.width
    const height = rect.height
    const padding = { top: 20, right: 20, bottom: 30, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Animation
    let progress = animationProgress
    if (isAnimating) {
      progress = Math.min(progress + 0.02, 1)
      setAnimationProgress(progress)
      if (progress >= 1) {
        setIsAnimating(false)
      }
    }

    // Y-axis scale
    const maxValue = Math.max(...[...adsData, ...premiumData]) * 1.2
    const yLabels = ["$0", "$500", "$1000", "$1500", "$2000", "$2500", "$3000"]

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px Inter, sans-serif"

    yLabels.forEach((label, i) => {
      const y = padding.top + chartHeight - (i / (yLabels.length - 1)) * chartHeight
      ctx.fillText(label, padding.left - 10, y)
    })

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    months.forEach((month, i) => {
      const x = padding.left + (i / (months.length - 1)) * chartWidth
      ctx.fillText(month, x, height - padding.bottom + 10)
    })

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1

    // Horizontal grid lines
    yLabels.forEach((_, i) => {
      const y = padding.top + chartHeight - (i / (yLabels.length - 1)) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    })

    // Vertical grid lines
    months.forEach((_, i) => {
      const x = padding.left + (i / (months.length - 1)) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
    })

    // Draw premium users line (dashed yellow) if included in dataType
    if (premiumData.length > 0) {
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = "#eab308"
      ctx.lineWidth = 3

      premiumData.forEach((value, i, arr) => {
        if (i >= arr.length * progress) return

        const x = padding.left + (i / (arr.length - 1)) * chartWidth
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }

    // Draw ads area if included in dataType
    if (adsData.length > 0) {
      ctx.beginPath()
      ctx.setLineDash([])

      // Start at the bottom left
      ctx.moveTo(padding.left, padding.top + chartHeight)

      // Draw the bottom line
      adsData.forEach((value, i, arr) => {
        if (i >= arr.length * progress) return

        const x = padding.left + (i / (arr.length - 1)) * chartWidth
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight

        ctx.lineTo(x, y)
      })

      // Complete the path back to the bottom
      if (progress > 0) {
        const lastIndex = Math.min(Math.floor(adsData.length * progress), adsData.length - 1)
        const lastX = padding.left + (lastIndex / (adsData.length - 1)) * chartWidth
        ctx.lineTo(lastX, padding.top + chartHeight)
      }
      ctx.lineTo(padding.left, padding.top + chartHeight)

      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
      gradient.addColorStop(0, "rgba(6, 182, 212, 0.7)")
      gradient.addColorStop(1, "rgba(6, 182, 212, 0.0)")
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw the top line of the area
      ctx.beginPath()
      ctx.strokeStyle = "#06b6d4"
      ctx.lineWidth = 3

      adsData.forEach((value, i, arr) => {
        if (i >= arr.length * progress) return

        const x = padding.left + (i / (arr.length - 1)) * chartWidth
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }

    // Draw hover tooltip if hovering
    if (isHovering && hoverPoint) {
      const { x, y, value, month } = hoverPoint

      // Draw vertical line at hover point
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()

      // Draw tooltip background
      const tooltipWidth = 100
      const tooltipHeight = 50
      const tooltipX = x - tooltipWidth / 2
      const tooltipY = y - tooltipHeight - 10

      ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 4
      ctx.beginPath()
      ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 4)
      ctx.fill()

      // Reset shadow
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Draw tooltip text
      ctx.fillStyle = "#334155"
      ctx.textAlign = "center"
      ctx.font = "bold 12px Inter, sans-serif"
      ctx.fillText(month, tooltipX + tooltipWidth / 2, tooltipY + 15)
      ctx.font = "14px Inter, sans-serif"
      ctx.fillText(`$${value.toLocaleString()}`, tooltipX + tooltipWidth / 2, tooltipY + 35)
    }

    // Request next animation frame if still animating
    if (isAnimating) {
      requestAnimationFrame(() => setAnimationProgress(progress))
    }
  }, [animationProgress, isAnimating, timeframe, dataType, isHovering, hoverPoint])

  // Handle mouse move for interactive tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const { months, adsData, premiumData } = getChartData()
    const combinedData = adsData.map((ads, i) => ads + (premiumData[i] || 0))

    const padding = { top: 20, right: 20, bottom: 30, left: 60 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Check if mouse is in chart area
    if (x >= padding.left && x <= rect.width - padding.right && y >= padding.top && y <= rect.height - padding.bottom) {
      setIsHovering(true)

      // Find closest data point
      const pointIndex = Math.round(((x - padding.left) / chartWidth) * (months.length - 1))

      if (pointIndex >= 0 && pointIndex < months.length) {
        const maxValue = Math.max(...[...adsData, ...premiumData]) * 1.2
        const dataValue = combinedData[pointIndex]
        const dataY = padding.top + chartHeight - (dataValue / maxValue) * chartHeight
        const dataX = padding.left + (pointIndex / (months.length - 1)) * chartWidth

        setHoverPoint({
          x: dataX,
          y: dataY,
          value: dataValue,
          month: months[pointIndex],
        })
      }
    } else {
      setIsHovering(false)
      setHoverPoint(null)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setHoverPoint(null)
  }

  // Reset animation on click
  const handleClick = () => {
    setAnimationProgress(0)
    setIsAnimating(true)

    addToast({
      title: "Chart Refreshed",
      description: "Revenue chart data has been refreshed",
      type: "info",
      duration: 3000,
    })
  }

  return (
    <div className="w-full">
      <div className="relative h-[300px] w-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-pointer"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        ></canvas>
      </div>
      <div className="mt-4 flex justify-center gap-6">
        {dataType === "all" || dataType === "ads" ? (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-cyan-500"></div>
            <span className="text-sm text-muted-foreground">Ads</span>
          </div>
        ) : null}
        {dataType === "all" || dataType === "premium" ? (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-muted-foreground">Premium users</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

