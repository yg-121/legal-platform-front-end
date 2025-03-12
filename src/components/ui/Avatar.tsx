"use client"

import React from "react"

interface AvatarProps {
  src?: string
  alt?: string
  fallback: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = "Avatar", fallback, size = "md", className = "" }) => {
  const [imageError, setImageError] = React.useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  }

  const getFallbackInitials = () => {
    return fallback
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted ${
        sizeClasses[size]
      } ${className}`}
    >
      {src && !imageError ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span className="font-medium text-foreground">{getFallbackInitials()}</span>
      )}
    </div>
  )
}

export default Avatar

