"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useToast } from "@/components/ui/toast-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pause, Play, PieChart, Users, DollarSign, Activity } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RevenueChart } from "@/components/revenue-chart"

export default function UserAnalyticsPage() {
  // Update the animation initialization to ensure it starts properly

  // Add this useEffect right after the component definition to initialize animation
  useEffect(() => {
    // Start with some animation progress to show initial data
    setAnimationProgress(0.3)

    // Set a small timeout to ensure the canvas elements are properly rendered
    const timer = setTimeout(() => {
      setIsAnimationPaused(false)
      setShowRealTimeUpdates(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])
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
  const [selectedTimeframe, setSelectedTimeframe] = useState("thisYear")
  const [selectedWeek, setSelectedWeek] = useState("This Week")
  const [selectedTab, setSelectedTab] = useState("engagement")
  const [selectedMetric, setSelectedMetric] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all")
  const [selectedGender, setSelectedGender] = useState("all")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState("all")
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isDataRefreshing, setIsDataRefreshing] = useState(false)
  const [showRealTimeUpdates, setShowRealTimeUpdates] = useState(true)
  const [exportFormat, setExportFormat] = useState("csv")
  const [exportData, setExportData] = useState<string[]>([
    "user_engagement",
    "retention_rates",
    "session_duration",
    "conversion_rates",
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(0.5) // Slower default animation speed
  const [isAnimationPaused, setIsAnimationPaused] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{
    chart: string
    label: string
    value: number
    x: number
    y: number
  } | null>(null)
  const [selectedDataPoint, setSelectedDataPoint] = useState<{
    chart: string
    label: string
    value: number
  } | null>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [detailedViewData, setDetailedViewData] = useState<any>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [comparisonMode, setComparisonMode] = useState(false)
  const [comparisonPeriod, setComparisonPeriod] = useState("previous_period")
  const [dataUpdateInterval, setDataUpdateInterval] = useState(5000)
  const [showDataLabels, setShowDataLabels] = useState(true)
  const [chartType, setChartType] = useState("line")
  const [showLegend, setShowLegend] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showTooltips, setShowTooltips] = useState(true)
  const [colorScheme, setColorScheme] = useState("default")
  const [dateRange, setDateRange] = useState({ start: "2025-01-01", end: "2025-03-22" })
  const [showAnomalyDetection, setShowAnomalyDetection] = useState(false)
  const [anomalyThreshold, setAnomalyThreshold] = useState(15)
  const [showTrendlines, setShowTrendlines] = useState(false)
  const [showForecast, setShowForecast] = useState(false)
  const [forecastPeriods, setForecastPeriods] = useState(3)
  const [dataGranularity, setDataGranularity] = useState("daily")
  const [showPercentages, setShowPercentages] = useState(true)
  const [showRawNumbers, setShowRawNumbers] = useState(true)
  const [showAverage, setShowAverage] = useState(false)
  const [showMedian, setShowMedian] = useState(false)
  const [tablePageSize, setTablePageSize] = useState(10)
  const [currentTablePage, setCurrentTablePage] = useState(1)

  // Canvas refs for charts
  const userEngagementChartRef = useRef<HTMLCanvasElement>(null)
  const userRetentionChartRef = useRef<HTMLCanvasElement>(null)
  const deviceUsageChartRef = useRef<HTMLCanvasElement>(null)
  const sessionDurationChartRef = useRef<HTMLCanvasElement>(null)
  const userGrowthChartRef = useRef<HTMLCanvasElement>(null)
  const geoDistributionChartRef = useRef<HTMLCanvasElement>(null)
  const featureUsageChartRef = useRef<HTMLCanvasElement>(null)
  const conversionFunnelChartRef = useRef<HTMLCanvasElement>(null)
  const revenueChartRef = useRef<HTMLCanvasElement>(null)
  const userActivityChartRef = useRef<HTMLCanvasElement>(null)
  const retentionHeatmapRef = useRef<HTMLCanvasElement>(null)
  const churnRateChartRef = useRef<HTMLCanvasElement>(null)
  const userDemographicsChartRef = useRef<HTMLCanvasElement>(null)
  const subscriptionTrendsChartRef = useRef<HTMLCanvasElement>(null)
  const contentEngagementChartRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 12450,
    activeUsers: {
      daily: 3800,
      weekly: 7200,
      monthly: 9600,
    },
    newUsers: {
      today: 145,
      thisWeek: 876,
      thisMonth: 3240,
      growth: 12.4,
    },
    retentionRate: 68,
    churnRate: 4.2,
    sessionDuration: 9.8,
    sessionsPerUser: 5.2,
    screenViewsPerSession: 6.4,
    bounceRate: 24.8,
    conversionRate: 8.6,
    userSatisfaction: 4.7,
    dropoffRate: 11.27,
    revenue: {
      total: 1250000,
      growth: 15.3,
      monthly: [
        { month: "Jan", value: 78000 },
        { month: "Feb", value: 82000 },
        { month: "Mar", value: 85000 },
        { month: "Apr", value: 89000 },
        { month: "May", value: 94000 },
        { month: "Jun", value: 98000 },
        { month: "Jul", value: 103000 },
        { month: "Aug", value: 108000 },
        { month: "Sep", value: 112000 },
        { month: "Oct", value: 118000 },
        { month: "Nov", value: 125000 },
        { month: "Dec", value: 132000 },
      ],
      sources: [
        { source: "Subscriptions", value: 850000 },
        { source: "In-app Purchases", value: 250000 },
        { source: "Ads", value: 150000 },
      ],
    },
    topFeatures: [
      { name: "Sleep Stories", usage: 42 },
      { name: "Meditation", usage: 38 },
      { name: "Breathing Exercises", usage: 12 },
      { name: "Music", usage: 8 },
    ],
    deviceUsage: [
      { name: "iOS", percentage: 58 },
      { name: "Android", percentage: 36 },
      { name: "Web", percentage: 6 },
    ],
    userDemographics: {
      ageGroups: [
        { group: "18-24", percentage: 22 },
        { group: "25-34", percentage: 38 },
        { group: "35-44", percentage: 24 },
        { group: "45-54", percentage: 10 },
        { group: "55+", percentage: 6 },
      ],
      gender: [
        { type: "Female", percentage: 62 },
        { type: "Male", percentage: 36 },
        { type: "Other", percentage: 2 },
      ],
      topCountries: [
        { country: "United States", users: 5420 },
        { country: "United Kingdom", users: 1840 },
        { country: "Canada", users: 1240 },
        { country: "Australia", users: 980 },
        { country: "Germany", users: 720 },
      ],
    },
    churnAnalysis: {
      reasons: [
        { reason: "Price", percentage: 35 },
        { reason: "Content Quality", percentage: 25 },
        { reason: "Technical Issues", percentage: 18 },
        { reason: "Found Alternative", percentage: 15 },
        { reason: "Other", percentage: 7 },
      ],
      bySubscriptionLength: [
        { period: "0-30 days", rate: 12.5 },
        { period: "31-90 days", rate: 8.2 },
        { period: "91-180 days", rate: 5.7 },
        { period: "181-365 days", rate: 3.8 },
        { period: "365+ days", rate: 2.1 },
      ],
      byPlatform: [
        { platform: "iOS", rate: 3.8 },
        { platform: "Android", rate: 4.5 },
        { platform: "Web", rate: 5.2 },
      ],
    },
    contentEngagement: {
      categories: [
        { name: "Sleep", engagement: 85 },
        { name: "Stress Relief", engagement: 72 },
        { name: "Focus", engagement: 68 },
        { name: "Anxiety", engagement: 76 },
        { name: "Motivation", engagement: 64 },
      ],
      completionRates: [
        { duration: "5 min", rate: 82 },
        { duration: "10 min", rate: 68 },
        { duration: "15 min", rate: 54 },
        { duration: "20+ min", rate: 42 },
      ],
      timeOfDay: [
        { time: "Morning (6-10am)", percentage: 18 },
        { time: "Midday (10am-2pm)", percentage: 12 },
        { time: "Afternoon (2-6pm)", percentage: 15 },
        { time: "Evening (6-10pm)", percentage: 22 },
        { time: "Night (10pm-2am)", percentage: 28 },
        { time: "Late Night (2-6am)", percentage: 5 },
      ],
    },
    subscriptionTrends: {
      monthly: [
        { month: "Jan", new: 850, canceled: 320, net: 530 },
        { month: "Feb", new: 920, canceled: 340, net: 580 },
        { month: "Mar", new: 980, canceled: 360, net: 620 },
        { month: "Apr", new: 1050, canceled: 380, net: 670 },
        { month: "May", new: 1120, canceled: 390, net: 730 },
        { month: "Jun", new: 1180, canceled: 410, net: 770 },
        { month: "Jul", new: 1240, canceled: 430, net: 810 },
        { month: "Aug", new: 1320, canceled: 450, net: 870 },
        { month: "Sep", new: 1380, canceled: 460, net: 920 },
        { month: "Oct", new: 1450, canceled: 480, net: 970 },
        { month: "Nov", new: 1520, canceled: 490, net: 1030 },
        { month: "Dec", new: 1580, canceled: 510, net: 1070 },
      ],
      byPlan: [
        { plan: "Monthly", percentage: 65 },
        { plan: "Annual", percentage: 30 },
        { plan: "Lifetime", percentage: 5 },
      ],
      conversionFromTrial: [
        { month: "Jan", rate: 42 },
        { month: "Feb", rate: 44 },
        { month: "Mar", rate: 43 },
        { month: "Apr", rate: 45 },
        { month: "May", rate: 48 },
        { month: "Jun", rate: 47 },
        { month: "Jul", rate: 49 },
        { month: "Aug", rate: 51 },
        { month: "Sep", rate: 52 },
        { month: "Oct", rate: 53 },
        { month: "Nov", rate: 54 },
        { month: "Dec", rate: 56 },
      ],
    },
  })

  // Most popular meditations data
  const popularMeditations = [
    {
      id: 1,
      name: "Deep Relaxation For Parents",
      category: "Sleep",
      duration: "10 Min",
      plays: 4500,
      completionRate: 78,
      rating: 4.8,
      trend: "up",
    },
    {
      id: 2,
      name: "Quick Stress Reset",
      category: "Stress Relief",
      duration: "5 Min",
      plays: 3200,
      completionRate: 85,
      rating: 4.6,
      trend: "up",
    },
    {
      id: 3,
      name: "Focus Booster",
      category: "Focus",
      duration: "8 Min",
      plays: 2800,
      completionRate: 72,
      rating: 4.5,
      trend: "stable",
    },
    {
      id: 4,
      name: "Morning Energy Boost",
      category: "Motivation",
      duration: "7 Min",
      plays: 3900,
      completionRate: 80,
      rating: 4.7,
      trend: "up",
    },
    {
      id: 5,
      name: "Calm Before Bed",
      category: "Sleep",
      duration: "15 Min",
      plays: 5100,
      completionRate: 68,
      rating: 4.9,
      trend: "up",
    },
    {
      id: 6,
      name: "Anxiety Relief",
      category: "Anxiety",
      duration: "12 Min",
      plays: 3600,
      completionRate: 74,
      rating: 4.7,
      trend: "up",
    },
    {
      id: 7,
      name: "Mindful Breathing",
      category: "Stress Relief",
      duration: "5 Min",
      plays: 2900,
      completionRate: 88,
      rating: 4.5,
      trend: "stable",
    },
    {
      id: 8,
      name: "Deep Sleep Journey",
      category: "Sleep",
      duration: "20 Min",
      plays: 3800,
      completionRate: 62,
      rating: 4.8,
      trend: "up",
    },
    {
      id: 9,
      name: "Work Break Relaxation",
      category: "Focus",
      duration: "3 Min",
      plays: 2500,
      completionRate: 92,
      rating: 4.4,
      trend: "up",
    },
    {
      id: 10,
      name: "Evening Wind Down",
      category: "Sleep",
      duration: "10 Min",
      plays: 3400,
      completionRate: 76,
      rating: 4.6,
      trend: "stable",
    },
  ]

  // Subscription growth data
  const subscriptionData = [
    { month: "January", newSignUps: 1200, cancellations: 200, netGrowth: 1000, retentionRate: 92 },
    { month: "February", newSignUps: 1350, cancellations: 250, netGrowth: 1100, retentionRate: 91 },
    { month: "March", newSignUps: 1500, cancellations: 300, netGrowth: 1200, retentionRate: 90 },
    { month: "April", newSignUps: 1709, cancellations: 340, netGrowth: 1369, retentionRate: 89 },
    { month: "May", newSignUps: 2190, cancellations: 353, netGrowth: 1837, retentionRate: 91 },
    { month: "June", newSignUps: 2409, cancellations: 379, netGrowth: 2030, retentionRate: 92 },
    { month: "July", newSignUps: 2580, cancellations: 402, netGrowth: 2178, retentionRate: 91 },
    { month: "August", newSignUps: 2750, cancellations: 425, netGrowth: 2325, retentionRate: 90 },
    { month: "September", newSignUps: 2900, cancellations: 450, netGrowth: 2450, retentionRate: 89 },
    { month: "October", newSignUps: 3100, cancellations: 480, netGrowth: 2620, retentionRate: 90 },
    { month: "November", newSignUps: 3300, cancellations: 510, netGrowth: 2790, retentionRate: 91 },
    { month: "December", newSignUps: 3500, cancellations: 540, netGrowth: 2960, retentionRate: 92 },
  ]

  // User journey data
  const userJourneyData = [
    { stage: "App Install", users: 10000, percentage: 100, dropoff: 0 },
    { stage: "Registration", users: 7500, percentage: 75, dropoff: 25 },
    { stage: "First Meditation", users: 5200, percentage: 52, dropoff: 23 },
    { stage: "Return Visit", users: 3800, percentage: 38, dropoff: 14 },
    { stage: "Subscription", users: 1200, percentage: 12, dropoff: 26 },
    { stage: "Renewal", users: 980, percentage: 9.8, dropoff: 2.2 },
  ]

  // User activity by time of day
  const activityByTimeData = [
    { hour: "12am", users: 420, sessionsPerUser: 1.2, avgDuration: 8.5 },
    { hour: "2am", users: 280, sessionsPerUser: 1.1, avgDuration: 12.3 },
    { hour: "4am", users: 190, sessionsPerUser: 1.0, avgDuration: 15.7 },
    { hour: "6am", users: 350, sessionsPerUser: 1.3, avgDuration: 7.8 },
    { hour: "8am", users: 890, sessionsPerUser: 1.5, avgDuration: 6.2 },
    { hour: "10am", users: 1250, sessionsPerUser: 1.4, avgDuration: 5.8 },
    { hour: "12pm", users: 1420, sessionsPerUser: 1.3, avgDuration: 6.5 },
    { hour: "2pm", users: 1380, sessionsPerUser: 1.2, avgDuration: 7.2 },
    { hour: "4pm", users: 1520, sessionsPerUser: 1.4, avgDuration: 8.1 },
    { hour: "6pm", users: 1740, sessionsPerUser: 1.6, avgDuration: 9.3 },
    { hour: "8pm", users: 2100, sessionsPerUser: 1.8, avgDuration: 11.5 },
    { hour: "10pm", users: 1680, sessionsPerUser: 1.7, avgDuration: 13.2 },
  ]

  // Retention cohort data
  const retentionCohortData = useMemo(() => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"]
    return weeks.map((week, i) => {
      const baseRetention = Math.max(30, 100 - i * 10)
      return {
        cohort: week,
        retentionRates: weeks.map((_, j) => {
          if (j > i) return 0
          return Math.max(10, baseRetention - j * 8 + Math.random() * 5)
        }),
      }
    })
  }, [])

  // User demographics data
  const userDemographicsData = {
    ageGroups: [
      { group: "18-24", percentage: 22, growth: 2.5 },
      { group: "25-34", percentage: 38, growth: 1.8 },
      { group: "35-44", percentage: 24, growth: 0.9 },
      { group: "45-54", percentage: 10, growth: 0.3 },
      { group: "55+", percentage: 6, growth: 0.1 },
    ],
    gender: [
      { type: "Female", percentage: 62, growth: 1.2 },
      { type: "Male", percentage: 36, growth: 0.8 },
      { type: "Other", percentage: 2, growth: 0.3 },
    ],
    locations: [
      { country: "United States", users: 5420, percentage: 43.5 },
      { country: "United Kingdom", users: 1840, percentage: 14.8 },
      { country: "Canada", users: 1240, percentage: 10.0 },
      { country: "Australia", users: 980, percentage: 7.9 },
      { country: "Germany", users: 720, percentage: 5.8 },
      { country: "France", users: 580, percentage: 4.7 },
      { country: "Japan", users: 480, percentage: 3.9 },
      { country: "Other", users: 1190, percentage: 9.6 },
    ],
    languages: [
      { language: "English", percentage: 78 },
      { language: "Spanish", percentage: 8 },
      { language: "French", percentage: 5 },
      { language: "German", percentage: 4 },
      { language: "Japanese", percentage: 3 },
      { language: "Other", percentage: 2 },
    ],
  }

  // Feature usage data
  const featureUsageData = [
    { feature: "Sleep Stories", usage: 42, growth: 3.2, satisfaction: 4.8 },
    { feature: "Meditation", usage: 38, growth: 2.5, satisfaction: 4.7 },
    { feature: "Breathing Exercises", usage: 12, growth: 1.8, satisfaction: 4.5 },
    { feature: "Music", usage: 8, growth: 0.9, satisfaction: 4.6 },
    { feature: "Soundscapes", usage: 6, growth: 1.2, satisfaction: 4.4 },
    { feature: "Guided Imagery", usage: 5, growth: 2.1, satisfaction: 4.3 },
    { feature: "Body Scan", usage: 4, growth: 1.5, satisfaction: 4.2 },
    { feature: "Sleep Timer", usage: 3, growth: 0.8, satisfaction: 4.5 },
    { feature: "Progress Tracking", usage: 2, growth: 1.1, satisfaction: 4.1 },
  ]

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

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

  // Animation loop for all charts
  useEffect(() => {
    if (isAnimationPaused || !showRealTimeUpdates) return

    const animate = () => {
      setAnimationProgress((prev) => {
        const newProgress = prev + 0.003 * animationSpeed // Slower animation
        return newProgress > 1 ? 0 : newProgress
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isAnimationPaused, showRealTimeUpdates, animationSpeed, setAnimationProgress])

  // Draw user engagement chart with animation
  useEffect(() => {
    const canvas = userEngagementChartRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with proper scaling for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Chart data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const dailyActiveUsers = [2200, 2700, 3200, 2800, 2500, 2800, 3600, 2900, 2600, 2800, 2500, 3100]
    const weeklyActiveUsers = [3800, 4000, 5100, 4500, 3800, 4100, 5800, 5100, 4100, 4200, 4500, 4700]

    // Animation progress (0 to 1)
    const progress = animationProgress
    const visiblePoints = Math.ceil(months.length * progress)

    // Chart dimensions
    const width = rect.width
    const height = rect.height
    const padding = { top: 50, right: 40, bottom: 60, left: 60 } // Increased padding all around
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const barWidth = (chartWidth / months.length) * 0.3 // Reduced bar width
    const barSpacing = (chartWidth / months.length) * 0.2 // Increased spacing

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px Inter, sans-serif"

    const maxValue = Math.max(...weeklyActiveUsers) * 1.1
    const yLabels = ["0k", "1k", "2k", "3k", "4k", "5k", "6k", "7k"]

    yLabels.forEach((label, i) => {
      const y = padding.top + chartHeight - (i / (yLabels.length - 1)) * chartHeight
      ctx.fillText(label, padding.left - 15, y)

      // Draw horizontal grid lines
      ctx.beginPath()
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    })

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    months.forEach((month, i) => {
      const x = padding.left + (i + 0.5) * (chartWidth / months.length)
      ctx.fillText(month, x, height - padding.bottom + 25) // Increased distance from chart
    })

    // Draw bars with animation
    for (let i = 0; i < visiblePoints; i++) {
      const centerX = padding.left + (i + 0.5) * (chartWidth / months.length)
      const x1 = centerX - barWidth - barSpacing / 2
      const x2 = centerX + barSpacing / 2

      // Calculate animation for the current bar
      const barProgress = Math.min(1, progress * months.length - i)

      // Daily active users (dark blue)
      const dailyHeight = (dailyActiveUsers[i] / maxValue) * chartHeight * barProgress
      const y1 = height - padding.bottom - dailyHeight

      ctx.fillStyle = "#1e40af"
      ctx.fillRect(x1, height - padding.bottom, barWidth, -dailyHeight)

      // Weekly active users (light blue)
      const weeklyHeight = (weeklyActiveUsers[i] / maxValue) * chartHeight * barProgress
      const y2 = height - padding.bottom - weeklyHeight

      ctx.fillStyle = "#7dd3fc"
      ctx.fillRect(x2, height - padding.bottom, barWidth, -weeklyHeight)

      // Add glow effect to the most recent bar
      if (i === visiblePoints - 1 && barProgress < 1) {
        ctx.shadowColor = "rgba(14, 165, 233, 0.5)"
        ctx.shadowBlur = 15
        ctx.fillStyle = "#7dd3fc"
        ctx.fillRect(x2, height - padding.bottom, barWidth, -weeklyHeight)
        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0
      }
    }

    // Draw legend
    const legendX = width / 2 - 120
    const legendY = padding.top - 25 // Move legend higher up

    // Daily active users
    ctx.fillStyle = "#1e40af"
    ctx.fillRect(legendX, legendY, 12, 12)
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("Daily Active Users", legendX + 20, legendY + 6)

    // Weekly active users
    ctx.fillStyle = "#7dd3fc"
    ctx.fillRect(legendX + 180, legendY, 12, 12) // Increased spacing between legend items
    ctx.fillStyle = "#64748b"
    ctx.fillText("Weekly Active Users", legendX + 200, legendY + 6)

    // Draw hover tooltip if hovering
    if (hoveredDataPoint && hoveredDataPoint.chart === "engagement") {
      const { x, y, label, value } = hoveredDataPoint

      // Draw tooltip background
      const tooltipWidth = 150
      const tooltipHeight = 70
      const tooltipX = Math.min(width - tooltipWidth - 20, Math.max(20, x - tooltipWidth / 2))
      const tooltipY = Math.max(20, y - tooltipHeight - 20)

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
      ctx.fillText(label, tooltipX + tooltipWidth / 2, tooltipY + 20)
      ctx.font = "14px Inter, sans-serif"
      ctx.fillText(
        `DAU: ${dailyActiveUsers[months.indexOf(label)].toLocaleString()}`,
        tooltipX + tooltipWidth / 2,
        tooltipY + 40,
      )
      ctx.fillText(
        `WAU: ${weeklyActiveUsers[months.indexOf(label)].toLocaleString()}`,
        tooltipX + tooltipWidth / 2,
        tooltipY + 60,
      )
    }

    // Make chart interactive
    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if mouse is in chart area
      if (x >= padding.left && x <= width - padding.right && y >= padding.top && y <= height - padding.bottom) {
        // Find closest data point
        const monthIndex = Math.floor((x - padding.left) / (chartWidth / months.length))

        if (monthIndex >= 0 && monthIndex < months.length) {
          const dataX = padding.left + (monthIndex + 0.5) * (chartWidth / months.length)
          const dataY = padding.top + 10

          setHoveredDataPoint({
            chart: "engagement",
            label: months[monthIndex],
            value: weeklyActiveUsers[monthIndex],
            x: dataX,
            y: dataY,
          })
        }
      } else {
        if (hoveredDataPoint?.chart === "engagement") {
          setHoveredDataPoint(null)
        }
      }
    }

    canvas.onmouseleave = () => {
      if (hoveredDataPoint?.chart === "engagement") {
        setHoveredDataPoint(null)
      }
    }

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if click is in chart area
      if (x >= padding.left && x <= width - padding.right && y >= padding.top && y >= height - padding.bottom) {
        // Find closest data point
        const monthIndex = Math.floor((x - padding.left) / (chartWidth / months.length))

        if (monthIndex >= 0 && monthIndex < months.length) {
          setSelectedDataPoint({
            chart: "engagement",
            label: months[monthIndex],
            value: weeklyActiveUsers[monthIndex],
          })

          setDetailedViewData({
            title: `User Engagement - ${months[monthIndex]} 2025`,
            data: {
              daily: dailyActiveUsers[monthIndex],
              weekly: weeklyActiveUsers[monthIndex],
              metrics: [
                {
                  name: "DAU/WAU Ratio",
                  value: `${Math.round((dailyActiveUsers[monthIndex] / weeklyActiveUsers[monthIndex]) * 100)}%`,
                },
                { name: "Sessions per User", value: (4 + Math.random() * 2).toFixed(1) },
                { name: "Avg. Session Duration", value: `${(8 + Math.random() * 4).toFixed(1)} min` },
              ],
              topFeatures: [
                { name: "Sleep Stories", usage: 42 + Math.floor(Math.random() * 10 - 5) },
                { name: "Meditation", usage: 38 + Math.floor(Math.random() * 10 - 5) },
                { name: "Breathing Exercises", usage: 12 + Math.floor(Math.random() * 6 - 3) },
              ],
            },
          })

          setShowDetailedView(true)

          addToast({
            title: `${months[monthIndex]} User Engagement`,
            description: `DAU: ${dailyActiveUsers[monthIndex].toLocaleString()}, WAU: ${weeklyActiveUsers[monthIndex].toLocaleString()}`,
            type: "info",
            duration: 3000,
          })
        }
      }
    }
  }, [animationProgress, hoveredDataPoint, addToast, setDetailedViewData, setShowDetailedView, showGrid])

  // Draw retention heatmap with animation
  useEffect(() => {
    const canvas = retentionHeatmapRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with proper scaling for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Chart data
    const cohorts = retentionCohortData
    const weeks = cohorts.map((c) => c.cohort)

    // Chart dimensions
    const width = rect.width
    const height = rect.height
    const padding = { top: 50, right: 40, bottom: 70, left: 110 } // Increased padding all around
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    const cellSize = Math.min(chartWidth / weeks.length, chartHeight / weeks.length) * 0.9

    // Animation progress (0 to 1)
    const progress = animationProgress
    const visibleCells = Math.ceil(weeks.length * weeks.length * progress)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw y-axis labels (cohorts)
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px Inter, sans-serif"

    cohorts.forEach((cohort, i) => {
      const y = padding.top + (i + 0.5) * cellSize
      ctx.fillText(cohort.cohort, padding.left - 10, y)
    })

    // Draw x-axis labels (weeks)
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    weeks.forEach((week, i) => {
      const x = padding.left + (i + 0.5) * cellSize
      ctx.fillText(`W${i + 1}`, x, padding.top + chartHeight + 20) // Increased distance from chart
    })

    // Draw heatmap cells with animation
    let cellCount = 0
    for (let i = 0; i < cohorts.length; i++) {
      for (let j = 0; j <= i; j++) {
        if (cellCount >= visibleCells) break

        const x = padding.left + j * cellSize
        const y = padding.top + i * cellSize
        const retentionRate = cohorts[i].retentionRates[j]

        // Calculate color based on retention rate
        const hue = 200 // Blue
        const saturation = 90
        const lightness = 100 - retentionRate

        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`

        // Calculate cell animation
        const cellProgress = Math.min(1, progress * weeks.length * weeks.length - cellCount)
        const cellSize2 = cellSize * cellProgress
        const offsetX = (cellSize - cellSize2) / 2
        const offsetY = (cellSize - cellSize2) / 2

        // Draw cell with better padding for cleaner separation
        ctx.fillRect(x + offsetX + 2, y + offsetY + 2, cellSize2 - 4, cellSize2 - 4)

        // Add a subtle border to make cells more distinct
        ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${Math.max(20, lightness - 10)}%)`
        ctx.lineWidth = 1
        ctx.strokeRect(x + offsetX + 2, y + offsetY + 2, cellSize2 - 4, cellSize2 - 4)

        cellCount++
      }
    }

    // Draw legend
    const legendX = padding.left
    const legendY = height - 35 // Move legend lower
    const legendWidth = chartWidth
    const legendHeight = 10

    // Draw gradient
    const gradient = ctx.createLinearGradient(legendX, 0, legendX + legendWidth, 0)
    gradient.addColorStop(0, "hsl(200, 90%, 90%)")
    gradient.addColorStop(0.5, "hsl(200, 90%, 50%)")
    gradient.addColorStop(1, "hsl(200, 90%, 20%)")

    ctx.fillStyle = gradient
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight)

    // Draw legend labels
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.font = "10px Inter, sans-serif"

    ctx.fillText("0%", legendX, legendY + legendHeight + 5)
    ctx.fillText("50%", legendX + legendWidth / 2, legendY + legendHeight + 5)
    ctx.fillText("100%", legendX + legendWidth, legendY + legendHeight + 5)

    // Make chart interactive
    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if mouse is in chart area
      if (x >= padding.left && x <= padding.left + chartWidth && y >= padding.top && y <= padding.top + chartHeight) {
        const cohortIndex = Math.floor((y - padding.top) / cellSize)
        const weekIndex = Math.floor((x - padding.left) / cellSize)

        if (cohortIndex >= 0 && cohortIndex < cohorts.length && weekIndex >= 0 && weekIndex <= cohortIndex) {
          const retentionRate = cohorts[cohortIndex].retentionRates[weekIndex]

          // Draw tooltip
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)"
          ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
          ctx.shadowBlur = 10
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 4

          const tooltipWidth = 180
          const tooltipHeight = 80
          const tooltipX = Math.min(width - tooltipWidth - 20, Math.max(20, x - tooltipWidth / 2))
          const tooltipY = Math.max(20, y - tooltipHeight - 20)

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
          ctx.textBaseline = "top"
          ctx.font = "bold 12px Inter, sans-serif"
          ctx.fillText(`Cohort: ${cohorts[cohortIndex].cohort}`, tooltipX + tooltipWidth / 2, tooltipY + 15)
          ctx.fillText(`Week: ${weekIndex + 1}`, tooltipX + tooltipWidth / 2, tooltipY + 35)
          ctx.fillText(`Retention: ${Math.round(retentionRate)}%`, tooltipX + tooltipWidth / 2, tooltipY + 55)
        }
      }
    }

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if click is in chart area
      if (x >= padding.left && x <= padding.left + chartWidth && y >= padding.top && y <= padding.top + chartHeight) {
        const cohortIndex = Math.floor((y - padding.top) / cellSize)
        const weekIndex = Math.floor((x - padding.left) / cellSize)

        if (cohortIndex >= 0 && cohortIndex < cohorts.length && weekIndex >= 0 && weekIndex <= cohortIndex) {
          const retentionRate = cohorts[cohortIndex].retentionRates[weekIndex]

          addToast({
            title: `Retention Analysis`,
            description: `Cohort ${cohorts[cohortIndex].cohort}, Week ${weekIndex + 1}: ${Math.round(retentionRate)}% retention`,
            type: "info",
            duration: 3000,
          })

          setDetailedViewData({
            title: `Retention Analysis - ${cohorts[cohortIndex].cohort}`,
            data: {
              cohort: cohorts[cohortIndex].cohort,
              week: weekIndex + 1,
              retention: Math.round(retentionRate),
              metrics: [
                { name: "Users Retained", value: Math.round((10000 * retentionRate) / 100).toLocaleString() },
                { name: "Churn Rate", value: `${(100 - retentionRate).toFixed(1)}%` },
                { name: "Avg. Sessions", value: (3 + weekIndex * 0.5).toFixed(1) },
              ],
              recommendations: [
                "Send re-engagement notifications to inactive users",
                "Highlight new content to boost engagement",
                "Offer special incentives to churned users",
              ],
            },
          })

          setShowDetailedView(true)
        }
      }
    }
  }, [retentionCohortData, animationProgress, addToast, setDetailedViewData, setShowDetailedView, showGrid])

  // Add this useEffect for the user activity chart right after the retention heatmap useEffect

  // Draw user activity chart with animation
  useEffect(() => {
    const canvas = userActivityChartRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with proper scaling for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Chart data
    const activityData = activityByTimeData
    const hours = activityData.map((item) => item.hour)
    const users = activityData.map((item) => item.users)

    // Chart dimensions
    const width = rect.width
    const height = rect.height
    const padding = { top: 50, right: 30, bottom: 50, left: 70 } // Increased padding all around
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Animation progress (0 to 1)
    const progress = animationProgress
    const visiblePoints = Math.ceil(hours.length * progress)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw y-axis labels
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#64748b"
    ctx.font = "12px Inter, sans-serif"

    const maxValue = Math.max(...users) * 1.1
    const yLabels = ["0", "500", "1000", "1500", "2000", "2500"]

    yLabels.forEach((label, i) => {
      const y = padding.top + chartHeight - (i / (yLabels.length - 1)) * chartHeight
      ctx.fillText(label, padding.left - 10, y)

      // Draw horizontal grid lines
      if (showGrid) {
        ctx.beginPath()
        ctx.strokeStyle = "#e2e8f0"
        ctx.lineWidth = 1
        ctx.moveTo(padding.left, y)
        ctx.lineTo(padding.left + chartWidth, y)
        ctx.stroke()
      }
    })

    // Draw x-axis labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    hours.forEach((hour, i) => {
      const x = padding.left + (i / (hours.length - 1)) * chartWidth
      ctx.fillText(hour, x, height - padding.bottom + 20) // Increased distance from chart
    })

    // Draw area chart with animation
    if (visiblePoints > 0) {
      // Draw area
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top + chartHeight)

      for (let i = 0; i < visiblePoints; i++) {
        const x = padding.left + (i / (hours.length - 1)) * chartWidth
        const y = padding.top + chartHeight - (users[i] / maxValue) * chartHeight
        ctx.lineTo(x, y)
      }

      // If we're in the middle of animating, add a line to the current progress point
      if (visiblePoints < hours.length) {
        const lastIndex = visiblePoints - 1
        const nextIndex = visiblePoints
        const lastX = padding.left + (lastIndex / (hours.length - 1)) * chartWidth
        const lastY = padding.top + chartHeight - (users[lastIndex] / maxValue) * chartHeight
        const nextX = padding.left + (nextIndex / (hours.length - 1)) * chartWidth
        const nextY = padding.top + chartHeight - (users[nextIndex] / maxValue) * chartHeight

        // Calculate the position between the last visible point and the next point
        const subProgress = progress * hours.length - lastIndex
        const currentX = lastX + (nextX - lastX) * subProgress
        const currentY = lastY + (nextY - lastY) * subProgress

        ctx.lineTo(currentX, currentY)
      }

      ctx.lineTo(padding.left + ((visiblePoints - 1) / (hours.length - 1)) * chartWidth, padding.top + chartHeight)
      ctx.closePath()

      ctx.fillStyle = "rgba(14, 165, 233, 0.2)"
      ctx.fill()

      // Draw line
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top + chartHeight - (users[0] / maxValue) * chartHeight)

      for (let i = 1; i < visiblePoints; i++) {
        const x = padding.left + (i / (hours.length - 1)) * chartWidth
        const y = padding.top + chartHeight - (users[i] / maxValue) * chartHeight
        ctx.lineTo(x, y)
      }

      // If we're in the middle of animating, add a line to the current progress point
      if (visiblePoints < hours.length) {
        const lastIndex = visiblePoints - 1
        const nextIndex = visiblePoints
        const lastX = padding.left + (lastIndex / (hours.length - 1)) * chartWidth
        const lastY = padding.top + chartHeight - (users[lastIndex] / maxValue) * chartHeight
        const nextX = padding.left + (nextIndex / (hours.length - 1)) * chartWidth
        const nextY = padding.top + chartHeight - (users[nextIndex] / maxValue) * chartHeight

        // Calculate the position between the last visible point and the next point
        const subProgress = progress * hours.length - lastIndex
        const currentX = lastX + (nextX - lastX) * subProgress
        const currentY = lastY + (nextY - lastY) * subProgress

        ctx.lineTo(currentX, currentY)
      }

      ctx.strokeStyle = "#0ea5e9"
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw points
      for (let i = 0; i < visiblePoints; i++) {
        const x = padding.left + (i / (hours.length - 1)) * chartWidth
        const y = padding.top + chartHeight - (users[i] / maxValue) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = "#ffffff"
        ctx.fill()
        ctx.strokeStyle = "#0ea5e9"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Draw the animated point at the current progress position
      if (visiblePoints < hours.length) {
        const lastIndex = visiblePoints - 1
        const nextIndex = visiblePoints
        const lastX = padding.left + (lastIndex / (hours.length - 1)) * chartWidth
        const lastY = padding.top + chartHeight - (users[lastIndex] / maxValue) * chartHeight
        const nextX = padding.left + (nextIndex / (hours.length - 1)) * chartWidth
        const nextY = padding.top + chartHeight - (users[nextIndex] / maxValue) * chartHeight

        // Calculate the position between the last visible point and the next point
        const subProgress = progress * hours.length - lastIndex
        const currentX = lastX + (nextX - lastX) * subProgress
        const currentY = lastY + (nextY - lastY) * subProgress

        ctx.beginPath()
        ctx.arc(currentX, currentY, 5, 0, 2 * Math.PI)
        ctx.fillStyle = "#ffffff"
        ctx.fill()
        ctx.strokeStyle = "#0ea5e9"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw pulsating effect around the current point
        ctx.beginPath()
        const pulseSize = 8 + Math.sin(Date.now() / 200) * 4
        ctx.arc(currentX, currentY, pulseSize, 0, 2 * Math.PI)
        ctx.fillStyle = "rgba(14, 165, 233, 0.2)"
        ctx.fill()
      }
    }

    // Draw hover tooltip if hovering
    if (hoveredDataPoint && hoveredDataPoint.chart === "activity") {
      const { x, y, label, value } = hoveredDataPoint

      // Draw vertical line at hover point
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw tooltip background
      const tooltipWidth = 140
      const tooltipHeight = 80
      const tooltipX = Math.min(width - tooltipWidth - 20, Math.max(20, x - tooltipWidth / 2))
      const tooltipY = Math.max(20, y - tooltipHeight - 20)

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
      ctx.fillText(label, tooltipX + tooltipWidth / 2, tooltipY + 15)
      ctx.font = "12px Inter, sans-serif"
      ctx.fillText(`Users: ${value.toLocaleString()}`, tooltipX + tooltipWidth / 2, tooltipY + 35)
      ctx.fillText(
        `Sessions: ${activityData[hours.indexOf(label)].sessionsPerUser.toFixed(1)}`,
        tooltipX + tooltipWidth / 2,
        tooltipY + 55,
      )
      ctx.fillText(
        `Duration: ${activityData[hours.indexOf(label)].avgDuration.toFixed(1)} min`,
        tooltipX + tooltipWidth / 2,
        tooltipY + 70,
      )
    }

    // Make chart interactive
    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if mouse is in chart area
      if (x >= padding.left && x <= width - padding.right && y >= padding.top && y <= height - padding.bottom) {
        // Find closest data point
        const hourIndex = Math.round((x - padding.left) / (chartWidth / (hours.length - 1)))

        if (hourIndex >= 0 && hourIndex < hours.length) {
          const dataX = padding.left + (hourIndex / (hours.length - 1)) * chartWidth
          const dataY = padding.top + chartHeight - (users[hourIndex] / maxValue) * chartHeight

          setHoveredDataPoint({
            chart: "activity",
            label: hours[hourIndex],
            value: users[hourIndex],
            x: dataX,
            y: dataY,
          })
        }
      } else {
        setHoveredDataPoint(null)
      }
    }

    canvas.onmouseleave = () => {
      setHoveredDataPoint(null)
    }

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if click is in chart area
      if (x >= padding.left && x <= width - padding.right && y >= padding.top && y <= height - padding.bottom) {
        // Find closest data point
        const hourIndex = Math.round((x - padding.left) / (chartWidth / (hours.length - 1)))

        if (hourIndex >= 0 && hourIndex < hours.length) {
          setSelectedDataPoint({
            chart: "activity",
            label: hours[hourIndex],
            value: users[hourIndex],
          })

          setDetailedViewData({
            title: `User Activity - ${hours[hourIndex]}`,
            data: {
              users: users[hourIndex],
              sessions: activityData[hourIndex].sessionsPerUser.toFixed(1),
              duration: activityData[hourIndex].avgDuration.toFixed(1),
              metrics: [
                { name: "New Users", value: Math.floor(Math.random() * 50) },
                { name: "Returning Users", value: Math.floor(Math.random() * 100) },
                { name: "Conversion Rate", value: `${(5 + Math.random() * 5).toFixed(1)}%` },
              ],
              topContent: [
                { name: "Sleep Stories", views: Math.floor(Math.random() * 200) },
                { name: "Meditation", views: Math.floor(Math.random() * 150) },
                { name: "Breathing Exercises", views: Math.floor(Math.random() * 100) },
              ],
            },
          })

          setShowDetailedView(true)

          addToast({
            title: `User Activity - ${hours[hourIndex]}`,
            description: `Users: ${users[hourIndex].toLocaleString()}, Sessions: ${activityData[hourIndex].sessionsPerUser.toFixed(1)}`,
            type: "info",
            duration: 3000,
          })
        }
      }
    }
  }, [
    activityByTimeData,
    animationProgress,
    hoveredDataPoint,
    addToast,
    setDetailedViewData,
    setShowDetailedView,
    showGrid,
  ])

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value)
    addToast({
      title: `Timeframe Changed`,
      description: `Data now showing for ${value === "thisYear" ? "This Year" : value === "lastYear" ? "Last Year" : "Last 6 Months"}`,
      type: "info",
      duration: 2000,
    })
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    addToast({
      title: `Tab Changed`,
      description: `Now viewing ${value.charAt(0).toUpperCase() + value.slice(1)} data`,
      type: "info",
      duration: 2000,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">User Analytics</h1>
        <p className="text-muted-foreground">Track user engagement, retention, and revenue metrics</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant={showRealTimeUpdates ? "default" : "outline"}
            size="sm"
            onClick={() => setShowRealTimeUpdates(!showRealTimeUpdates)}
          >
            {showRealTimeUpdates ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {showRealTimeUpdates ? "Pause Updates" : "Resume Updates"}
          </Button>

          <Select value={selectedTimeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
              <SelectItem value="last6Months">Last 6 Months</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last updated: {currentTime.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="retention" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Retention
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Demographics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Trends</CardTitle>
                <CardDescription>Daily and weekly active users over time</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[350px] w-full">
                  <canvas ref={userEngagementChartRef} className="w-full h-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity by Time of Day</CardTitle>
                <CardDescription>When users are most active</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[350px] w-full">
                  <canvas ref={userActivityChartRef} className="w-full h-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
              <CardDescription>Most popular features and their growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureUsageData.slice(0, 5).map((feature) => (
                  <div key={feature.feature} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{feature.feature}</span>
                      <span className="text-sm text-muted-foreground">{feature.usage}% usage</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary" style={{ width: `${feature.usage}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Growth: {feature.growth > 0 ? "+" : ""}
                        {feature.growth}%
                      </span>
                      <span>Satisfaction: {feature.satisfaction}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Retention Cohort Analysis</CardTitle>
              <CardDescription>Weekly cohort retention rates</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[400px] w-full">
                <canvas ref={retentionHeatmapRef} className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn Analysis</CardTitle>
                <CardDescription>Reasons for user churn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.churnAnalysis.reasons.map((reason) => (
                    <div key={reason.reason} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{reason.reason}</span>
                        <span className="text-sm text-muted-foreground">{reason.percentage}%</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-destructive/70" style={{ width: `${reason.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn by Subscription Length</CardTitle>
                <CardDescription>How subscription length affects churn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.churnAnalysis.bySubscriptionLength.map((item) => (
                    <div key={item.period} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.period}</span>
                        <span className="text-sm text-muted-foreground">{item.rate}% churn</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-destructive/70" style={{ width: `${item.rate * 5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth</CardTitle>
              <CardDescription>Monthly revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <RevenueChart timeframe={selectedTimeframe} dataType="all" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsData.revenue.sources.map((source) => (
              <Card key={source.source}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{source.source}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">${source.value.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round((source.value / analyticsData.revenue.total) * 100)}% of total revenue
                  </div>
                  <div className="mt-4">
                    <Progress value={(source.value / analyticsData.revenue.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Trends</CardTitle>
              <CardDescription>New, canceled, and net subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">New Subscriptions</div>
                    <div className="text-2xl font-bold">
                      {analyticsData.subscriptionTrends.monthly[
                        analyticsData.subscriptionTrends.monthly.length - 1
                      ].new.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Canceled</div>
                    <div className="text-2xl font-bold text-destructive">
                      {analyticsData.subscriptionTrends.monthly[
                        analyticsData.subscriptionTrends.monthly.length - 1
                      ].canceled.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Net Growth</div>
                    <div className="text-2xl font-bold text-emerald-600">
                      {analyticsData.subscriptionTrends.monthly[
                        analyticsData.subscriptionTrends.monthly.length - 1
                      ].net.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Subscription Plans</div>
                  <div className="space-y-4">
                    {analyticsData.subscriptionTrends.byPlan.map((plan) => (
                      <div key={plan.plan} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{plan.plan}</span>
                          <span className="text-sm text-muted-foreground">{plan.percentage}%</span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                          <div className="h-full bg-primary" style={{ width: `${plan.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>User age groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userDemographicsData.ageGroups.map((age) => (
                    <div key={age.group} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{age.group}</span>
                        <span className="text-sm text-muted-foreground">{age.percentage}%</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${age.percentage}%` }} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Growth: {age.growth > 0 ? "+" : ""}
                        {age.growth}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>User gender breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userDemographicsData.gender.map((gender) => (
                    <div key={gender.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{gender.type}</span>
                        <span className="text-sm text-muted-foreground">{gender.percentage}%</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${gender.percentage}%` }} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Growth: {gender.growth > 0 ? "+" : ""}
                        {gender.growth}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Top countries by user count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userDemographicsData.locations.slice(0, 5).map((location) => (
                  <div key={location.country} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{location.country}</span>
                      <span className="text-sm text-muted-foreground">
                        {location.users.toLocaleString()} users ({location.percentage}%)
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary" style={{ width: `${location.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language Preferences</CardTitle>
              <CardDescription>User language distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userDemographicsData.languages.map((language) => (
                  <div key={language.language} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{language.language}</span>
                      <span className="text-sm text-muted-foreground">{language.percentage}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary" style={{ width: `${language.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showDetailedView && detailedViewData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{detailedViewData.title}</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDetailedView(false)}>
                Close
              </Button>
            </div>
            <div className="space-y-4">
              {detailedViewData.data.metrics && (
                <div className="grid grid-cols-3 gap-4">
                  {detailedViewData.data.metrics.map((metric: any, index: number) => (
                    <div key={index} className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground">{metric.name}</div>
                      <div className="text-xl font-bold mt-1">{metric.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {detailedViewData.data.breakdown && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Revenue Breakdown</h3>
                  <div className="space-y-3">
                    {detailedViewData.data.breakdown.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <span className="font-medium">${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailedViewData.data.topFeatures && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Top Features</h3>
                  <div className="space-y-3">
                    {detailedViewData.data.topFeatures.map((feature: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{feature.name}</span>
                        <span className="font-medium">{feature.usage}% usage</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detailedViewData.data.recommendations && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {detailedViewData.data.recommendations.map((rec: string, index: number) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

