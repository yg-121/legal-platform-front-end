/* eslint-disable react-refresh/only-export-components */
"use client"

import type React from "react"
import { createContext, useReducer, useEffect, useContext } from "react"
import type { Notification } from "../types/notification"
import { notificationService } from "../services/notificationService"
import { AuthContext } from "./AuthContext"

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
}

interface NotificationContextType extends NotificationState {
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  addNotification: (notification: Notification) => void
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
}

export const NotificationContext = createContext<NotificationContextType>({
  ...initialState,
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
  addNotification: () => {},
})

type NotificationAction =
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "DELETE_NOTIFICATION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
        isLoading: false,
      }
    case "SET_UNREAD_COUNT":
      return {
        ...state,
        unreadCount: action.payload,
      }
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }
    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
        unreadCount: 0,
      }
    case "DELETE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload),
        unreadCount: state.notifications.find((n) => n.id === action.payload && !n.read)
          ? state.unreadCount - 1
          : state.unreadCount,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    default:
      return state
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)
  const { isAuthenticated } = useContext(AuthContext)

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [isAuthenticated])

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await notificationService.getNotifications()
      if (response.data) {
        dispatch({ type: "SET_NOTIFICATIONS", payload: response.data })
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to fetch notifications",
      })
    }
  }

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      if (response.data) {
        dispatch({ type: "SET_UNREAD_COUNT", payload: response.data.count })
      }
    } catch (error) {
      console.error("Failed to fetch unread count", error)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId)
      dispatch({ type: "MARK_AS_READ", payload: notificationId })
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to mark notification as read",
      })
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      dispatch({ type: "MARK_ALL_AS_READ" })
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to mark all notifications as read",
      })
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId)
      dispatch({ type: "DELETE_NOTIFICATION", payload: notificationId })
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to delete notification",
      })
    }
  }

  // Add a new notification (used for real-time notifications)
  const addNotification = (notification: Notification) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification })
  }

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

