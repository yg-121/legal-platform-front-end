"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Bell,
  Menu,
  X,
  User,
  MessageSquare,
  Calendar,
  Briefcase,
  Home,
  Search,
  FileText,
  DollarSign,
} from "lucide-react"

interface NavbarProps {
  userRole: "client" | "lawyer" | "admin"
  userName: string
  unreadNotifications?: number
}

export default function Navbar({ userRole, userName, unreadNotifications = 0 }: NavbarProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const clientNavItems = [
    { name: "Home", icon: Home, href: "/client/home" },
    { name: "Find Lawyers", icon: Search, href: "/client/lawyers" },
    { name: "My Cases", icon: Briefcase, href: "/client/cases" },
    { name: "Post a Case", icon: FileText, href: "/client/cases/post" },
    { name: "Appointments", icon: Calendar, href: "/client/appointments" },
    { name: "Messages", icon: MessageSquare, href: "/common/messages" },
  ]

  const lawyerNavItems = [
    { name: "Home", icon: Home, href: "/lawyer/home" },
    { name: "Cases", icon: Briefcase, href: "/lawyer/case/detail" },
    { name: "Available Cases", icon: FileText, href: "/lawyer/cases/available" },
    { name: "My Bids", icon: DollarSign, href: "/lawyer/bids" },
    { name: "Appointments", icon: Calendar, href: "/lawyer/appointments" },
    { name: "Messages", icon: MessageSquare, href: "/common/messages" },
  ]

  const navItems = userRole === "client" ? clientNavItems : lawyerNavItems

  return (
    <nav className="bg-blue-50 shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile menu button */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">LegalConnect</span>
                <span className="ml-1 text-sm text-blue-500">Ethiopia</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  location.pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                <item.icon className="mr-1.5 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="ml-4 relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1 rounded-full text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {unreadNotifications > 0 ? (
                      <div className="px-4 py-2 hover:bg-gray-100">
                        <p className="text-sm text-gray-700">You have {unreadNotifications} unread notifications</p>
                        <Link
                          to={`/${userRole}/notifications`}
                          className="block text-sm text-blue-600 hover:text-blue-800 mt-1"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    ) : (
                      <div className="px-4 py-2">
                        <p className="text-sm text-gray-700">No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="ml-4 relative">
              <div>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="bg-blue-50 rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                </button>
              </div>

              {profileDropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                  <Link
                    to={`/${userRole}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to={`/${userRole}/settings`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

