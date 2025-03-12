"use client"

import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Spinner from "../../components/ui/Spinner"
import { useNotifications } from "../../hooks/useNotifications"
import { type Notification, NotificationType } from "../../types/notification"

const Notifications: React.FC = () => {
  const navigate = useNavigate()
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } =
    useNotifications()

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId)
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id)
    }

    // Navigate based on notification type
    if (notification.entityId) {
      switch (notification.type) {
        case NotificationType.CASE_UPDATE:
          navigate(`/cases/${notification.entityId}`)
          break
        case NotificationType.BID_RECEIVED:
        case NotificationType.BID_ACCEPTED:
          navigate(`/cases/${notification.entityId}/bids`)
          break
        case NotificationType.APPOINTMENT_CREATED:
        case NotificationType.APPOINTMENT_UPDATED:
          navigate("/appointments")
          break
        case NotificationType.MESSAGE_RECEIVED:
          navigate(`/chat/${notification.entityId}`)
          break
        default:
          break
      }
    }
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.CASE_UPDATE:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-blue-500"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        )
      case NotificationType.BID_RECEIVED:
      case NotificationType.BID_ACCEPTED:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-green-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        )
      case NotificationType.APPOINTMENT_CREATED:
      case NotificationType.APPOINTMENT_UPDATED:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-purple-500"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        )
      case NotificationType.MESSAGE_RECEIVED:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-yellow-500"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-gray-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "Just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "day" : "days"} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && <Button onClick={handleMarkAllAsRead}>Mark All as Read</Button>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                    !notification.read ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm">{notification.message}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!notification.read && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                        Mark as Read
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleDeleteNotification(notification.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center">
              <p className="text-muted-foreground">No notifications</p>
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Notifications

