import type React from "react"

type BadgeVariant = "default" | "secondary" | "outline" | "success" | "warning" | "danger"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
        variantClasses[variant]
      } ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge

