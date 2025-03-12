"use client"

import type React from "react"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar.tsx"
import Header from "./Header"
import { useAuth } from "../../hooks/useAuth"

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { userRole } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} userRole={userRole} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

