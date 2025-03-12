import type React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import Spinner from "../ui/Spinner"

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute

