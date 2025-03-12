// "use client"

// import * as React from "react"
// import * as TabsPrimitive from "@radix-ui/react-tabs"

// import { cn } from "@/lib/utils"

// function Tabs({
//   className,
//   ...props
// }: React.ComponentProps<typeof TabsPrimitive.Root>) {
//   return (
//     <TabsPrimitive.Root
//       data-slot="tabs"
//       className={cn("flex flex-col gap-2", className)}
//       {...props}
//     />
//   )
// }

// function TabsList({
//   className,
//   ...props
// }: React.ComponentProps<typeof TabsPrimitive.List>) {
//   return (
//     <TabsPrimitive.List
//       data-slot="tabs-list"
//       className={cn(
//         "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// function TabsTrigger({
//   className,
//   ...props
// }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
//   return (
//     <TabsPrimitive.Trigger
//       data-slot="tabs-trigger"
//       className={cn(
//         "data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// function TabsContent({
//   className,
//   ...props
// }: React.ComponentProps<typeof TabsPrimitive.Content>) {
//   return (
//     <TabsPrimitive.Content
//       data-slot="tabs-content"
//       className={cn("flex-1 outline-none", className)}
//       {...props}
//     />
//   )
// }

// export { Tabs, TabsList, TabsTrigger, TabsContent }
"use client"

import type React from "react"
import { useState, useEffect } from "react"

export type ToastVariant = "default" | "success" | "error" | "warning" | "info"

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ id, title, description, variant = "default", duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Allow time for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, id, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose(id), 300) // Allow time for exit animation
  }

  const variantClasses = {
    default: "bg-background border",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  const iconByVariant = {
    default: null,
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-green-500"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-red-500"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    ),
    warning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-yellow-500"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-blue-500"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    ),
  }

  return (
    <div
      className={`
        pointer-events-auto w-full max-w-sm rounded-lg border shadow-lg
        transition-all duration-300 ease-in-out
        ${variantClasses[variant]}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      <div className="flex p-4">
        {iconByVariant[variant] && <div className="flex-shrink-0 mr-3">{iconByVariant[variant]}</div>}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="text-sm font-medium">{title}</div>
            <button
              type="button"
              className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {description && <div className="mt-1 text-sm">{description}</div>}
        </div>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  children: React.ReactNode
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 max-h-screen overflow-hidden pointer-events-none flex flex-col items-end gap-2">
      {children}
    </div>
  )
}

export default Toast

