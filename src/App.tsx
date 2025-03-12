import type React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import ProtectedRoute from "./components/routing/ProtectedRoute"
import RoleBasedRoute from "./components/routing/RoleBasedRoute"

// Layouts
import MainLayout from "./components/layouts/MainLayout"

// Pages
import AuthPage from "./pages/auth/AuthPage"
import ClientDashboard from "./pages/dashboard/ClientDashboard"
import LawyerDashboard from "./pages/dashboard/LawyerDashboard"
import AdminDashboard from "./pages/dashboard/AdminDashboard"
import Cases from "./pages/cases/Cases"
import CaseDetail from "./pages/cases/CaseDetail"
import Bids from "./pages/bids/Bids"
import Appointments from "./pages/appointments/Appointments"
import Chat from "./pages/chat/Chat"
import Notifications from "./pages/notifications/Notifications"
import NotFound from "./pages/NotFound"

// User roles
import { UserRole } from "./types/auth"

const App: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Dashboard routes based on role */}
          <Route
            path="/dashboard"
            element={
              userRole === UserRole.CLIENT ? (
                <ClientDashboard />
              ) : userRole === UserRole.LAWYER ? (
                <LawyerDashboard />
              ) : userRole === UserRole.ADMIN ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Cases routes */}
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:caseId" element={<CaseDetail />} />

          {/* Bids routes */}
          <Route path="/cases/:caseId/bids" element={<Bids />} />

          {/* Role-specific routes */}
          <Route element={<RoleBasedRoute allowedRoles={[UserRole.CLIENT, UserRole.LAWYER]} />}>
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:userId" element={<Chat />} />
          </Route>

          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Redirect root to dashboard or login */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

