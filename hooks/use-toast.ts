"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

type ToastProps = {
  title: string
  description: string
  duration?: number
}

type Toast = ToastProps & {
  id: number
  visible: boolean
}

type ToastContextType = {
  toasts: Toast[]
  toast: (props: ToastProps) => void
  dismissToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, duration = 3000 }: ToastProps) => {
    const id = Date.now()
    const newToast = { id, title, description, duration, visible: true }

    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300) // Animation duration
    }, duration)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  return <ToastContext.Provider value={{ toasts, toast, dismissToast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

