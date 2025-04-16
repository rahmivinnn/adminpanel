"use client"

import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col items-end gap-2 p-4 max-h-screen overflow-hidden pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-80 pointer-events-auto transform transition-all duration-300 ease-in-out",
            toast.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{toast.description}</p>
            </div>
            <button onClick={() => dismissToast(toast.id)} className="text-gray-400 hover:text-gray-500">
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

