import type React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import type { UserRole } from "../../types/auth"
import Spinner from "../ui/Spinner"

interface RoleBasedRouteProps {
  allowedRoles: UserRole[]
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, userRole } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return userRole && allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/dashboard" replace />
}

export default RoleBasedRoute

