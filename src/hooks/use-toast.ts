import * as React from "react"

interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

let toastCount = 0
const listeners: Array<(toasts: any[]) => void> = []
let memoryToasts: any[] = []

function addToast(toast: ToastProps) {
  const id = ++toastCount
  const newToast = { ...toast, id, open: true }
  memoryToasts = [newToast, ...memoryToasts].slice(0, 5)
  listeners.forEach(listener => listener(memoryToasts))
  
  // Auto dismiss after 3 seconds
  setTimeout(() => {
    memoryToasts = memoryToasts.filter(t => t.id !== id)
    listeners.forEach(listener => listener(memoryToasts))
  }, 3000)
}

export const useToast = () => {
  const [toasts, setToasts] = React.useState(memoryToasts)

  React.useEffect(() => {
    listeners.push(setToasts)
    return () => {
      const index = listeners.indexOf(setToasts)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toasts,
    toast: addToast,
    dismiss: (id: number) => {
      memoryToasts = memoryToasts.filter(t => t.id !== id)
      listeners.forEach(listener => listener(memoryToasts))
    }
  }
}