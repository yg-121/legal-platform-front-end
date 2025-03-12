// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Card({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card"
//       className={cn(
//         "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-header"
//       className={cn("flex flex-col gap-1.5 px-6", className)}
//       {...props}
//     />
//   )
// }

// function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-title"
//       className={cn("leading-none font-semibold", className)}
//       {...props}
//     />
//   )
// }

// function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-description"
//       className={cn("text-muted-foreground text-sm", className)}
//       {...props}
//     />
//   )
// }

// function CardContent({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-content"
//       className={cn("px-6", className)}
//       {...props}
//     />
//   )
// }

// function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="card-footer"
//       className={cn("flex items-center px-6", className)}
//       {...props}
//     />
//   )
// }

// export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`bg-card text-card-foreground rounded-lg border shadow-sm ${className}`}>{children}</div>
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "" }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
}

interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = "" }) => {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = "" }) => {
  return <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
}

