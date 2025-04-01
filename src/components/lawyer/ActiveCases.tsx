"use client"

import { type ReactNode, useState } from "react"
import { Bell, Menu, X, User, LogOut, MessageSquare, Calendar, Briefcase, Home } from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
  userRole: "client" | "lawyer" | "admin"
  userName: string
}

export default function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = {
    client: [
      { name: "Home", icon: Home, href: "/client/dashboard" },
      { name: "My Cases", icon: Briefcase, href: "/client/cases" },
      { name: "Appointments", icon: Calendar, href: "/client/appointments" },
      { name: "Messages", icon: MessageSquare, href: "/client/messages" },
      { name: "Find Lawyers", icon: User, href: "/client/lawyers" },
    ],
    lawyer: [
      { name: "Home", icon: Home, href: "/lawyer/dashboard" },
      { name: "Active Cases", icon: Briefcase, href: "/lawyer/cases" },
      { name: "Appointments", icon: Calendar, href: "/lawyer/appointments" },
      { name: "Messages", icon: MessageSquare, href: "/lawyer/messages" },
      { name: "Bids", icon: Briefcase, href: "/lawyer/bids" },
    ],
    admin: [
      { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
      { name: "Users", icon: User, href: "/admin/users" },
      { name: "Cases", icon: Briefcase, href: "/admin/cases" },
    ],
  }

  const currentNavItems = navItems[userRole]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
          <div className="flex items-center justify-between px-4 py-5">
            <div className="text-xl font-semibold text-gray-800">Legal Platform</div>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <nav className="flex flex-col space-y-1">
              {currentNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
            <a
              href="/logout"
              className="mt-4 flex w-full items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Sign out
            </a>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex items-center justify-center border-b border-gray-200 px-4 py-6">
              <div className="text-xl font-semibold text-gray-800">Legal Platform</div>
            </div>
            <nav className="flex-1 px-4 py-4">
              <div className="space-y-1">
                {currentNavItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                    {item.name}
                  </a>
                ))}
              </div>
            </nav>
          </div>
          <div className="border-t border-gray-200 px-4 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
            <a
              href="/logout"
              className="mt-4 flex w-full items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Sign out
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1"></div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

