"use client"

import { X } from "lucide-react"
import { useToast, type ToastProps } from "./toast-provider"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end gap-2 p-4 max-h-screen overflow-hidden pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onClose }: { toast: ToastProps; onClose: () => void }) {
  const { title, description, type = "default" } = toast

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-white border-gray-200 text-gray-800"
    }
  }

  return (
    <div
      className={cn(
        "pointer-events-auto w-80 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full duration-300",
        getTypeStyles(),
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm mt-1 opacity-90">{description}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

