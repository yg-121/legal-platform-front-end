"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Bell, Briefcase, Calendar, MessageSquare, User, CheckCircle } from "lucide-react"
import PageLayout from "../../components/layouts/PageLayout"

interface NotificationsPageProps {
  userName: string
  userRole: "client" | "lawyer" | "admin"
}

export default function NotificationsPage({ userName, userRole }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockClientNotifications = [
        {
          id: 1,
          type: "case",
          title: "New bid on your case",
          message: 'Jane Doe has submitted a bid on your case "Property Dispute".',
          date: "2025-03-16T10:30:00",
          read: false,
          link: "/client/cases/101",
          icon: "briefcase",
        },
        {
          id: 2,
          type: "appointment",
          title: "Appointment confirmed",
          message: "Your appointment with John Doe on March 20, 2025 at 10:00 AM has been confirmed.",
          date: "2025-03-15T14:45:00",
          read: false,
          link: "/client/appointments/1",
          icon: "calendar",
        },
        {
          id: 3,
          type: "message",
          title: "New message from Jane Doe",
          message: 'You have a new message from Jane Doe regarding your case "Property Dispute".',
          date: "2025-03-15T09:20:00",
          read: true,
          link: "/client/messages",
          icon: "message",
        },
        {
          id: 4,
          type: "case",
          title: "Case status updated",
          message: 'Your case "Contract Review" has been updated to "In Progress".',
          date: "2025-03-14T16:10:00",
          read: true,
          link: "/client/cases/102",
          icon: "briefcase",
        },
        {
          id: 5,
          type: "system",
          title: "Welcome to LegalConnect",
          message: "Thank you for joining LegalConnect. Complete your profile to get started.",
          date: "2025-03-10T08:00:00",
          read: true,
          link: "/client/profile",
          icon: "user",
        },
      ]

      const mockLawyerNotifications = [
        {
          id: 1,
          type: "case",
          title: "New case available",
          message: 'A new case "Corporate Merger Review" matching your expertise is available.',
          date: "2025-03-16T10:30:00",
          read: false,
          link: "/lawyer/cases/available/201",
          icon: "briefcase",
        },
        {
          id: 2,
          type: "appointment",
          title: "New appointment request",
          message: "John Smith has requested an appointment on March 22, 2025 at 2:30 PM.",
          date: "2025-03-15T14:45:00",
          read: false,
          link: "/lawyer/appointments",
          icon: "calendar",
        },
        {
          id: 3,
          type: "message",
          title: "New message from John Smith",
          message: 'You have a new message from John Smith regarding the case "Property Dispute".',
          date: "2025-03-15T09:20:00",
          read: true,
          link: "/lawyer/messages",
          icon: "message",
        },
        {
          id: 4,
          type: "case",
          title: "Bid accepted",
          message: 'Your bid on the case "Contract Review" has been accepted.',
          date: "2025-03-14T16:10:00",
          read: true,
          link: "/lawyer/cases/102",
          icon: "briefcase",
        },
        {
          id: 5,
          type: "system",
          title: "Profile verification",
          message: "Your profile has been verified. You can now receive case requests.",
          date: "2025-03-10T08:00:00",
          read: true,
          link: "/lawyer/profile",
          icon: "user",
        },
      ]

      if (userRole === "client") {
        setNotifications(mockClientNotifications)
      } else {
        setNotifications(mockLawyerNotifications)
      }

      setLoading(false)
    }, 1000)
  }, [userRole])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date)
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date)
    }
  }

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "briefcase":
        return <Briefcase className="h-6 w-6" />
      case "calendar":
        return <Calendar className="h-6 w-6" />
      case "message":
        return <MessageSquare className="h-6 w-6" />
      case "user":
        return <User className="h-6 w-6" />
      default:
        return <Bell className="h-6 w-6" />
    }
  }

  const getIconColor = (iconType: string, read: boolean) => {
    if (read) return "text-gray-400"

    switch (iconType) {
      case "briefcase":
        return "text-blue-500"
      case "calendar":
        return "text-green-500"
      case "message":
        return "text-yellow-500"
      case "user":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  const filteredNotifications = notifications.filter((notification: any) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification: any) => ({
        ...notification,
        read: true,
      })),
    )
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification: any) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  if (loading) {
    return (
      <PageLayout userRole={userRole} userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    )
  }

  const unreadCount = notifications.filter((notification: any) => !notification.read).length

  return (
    <PageLayout userRole={userRole} userName={userName}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-500">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "No new notifications"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark all as read
            </button>
          )}
        </div>

        <div className="border-b border-gray-200">
          <div className="px-4 sm:px-6 flex space-x-4 overflow-x-auto py-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "all" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "unread"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter("case")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "case" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cases
            </button>
            <button
              onClick={() => setFilter("appointment")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "appointment"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setFilter("message")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "message"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setFilter("system")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === "system"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              System
            </button>
          </div>
        </div>

        {filteredNotifications.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map((notification: any) => (
              <li key={notification.id} className={`${!notification.read ? "bg-blue-50" : ""} hover:bg-gray-50`}>
                <Link
                  to={notification.link}
                  className="block px-4 py-4 sm:px-6"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 rounded-md p-2 ${!notification.read ? "bg-blue-100" : "bg-gray-100"}`}
                    >
                      <div className={getIconColor(notification.icon, notification.read)}>
                        {getIcon(notification.icon)}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <p className={`text-sm font-medium ${!notification.read ? "text-blue-900" : "text-gray-900"}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(notification.date)}</p>
                      </div>
                      <p className={`mt-1 text-sm ${!notification.read ? "text-blue-700" : "text-gray-600"}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter !== "all" ? "Try changing your filter to see more notifications." : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

