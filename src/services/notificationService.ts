import api from "./api"
import type { Notification } from "../types/notification"
import type { ApiResponse } from "../types/api"

export const notificationService = {
  getNotifications: async (page?: number, limit?: number): Promise<ApiResponse<Notification[]>> => {
    const params = new URLSearchParams()

    if (page) params.append("page", page.toString())
    if (limit) params.append("limit", limit.toString())

    const response = await api.get<ApiResponse<Notification[]>>("/notifications", { params })
    return response.data
  },

  markAsRead: async (notificationId: string): Promise<ApiResponse<Notification>> => {
    const response = await api.put<ApiResponse<Notification>>(`/notifications/${notificationId}/read`)
    return response.data
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const response = await api.put<ApiResponse<null>>("/notifications/read-all")
    return response.data
  },

  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.get<ApiResponse<{ count: number }>>("/notifications/unread-count")
    return response.data
  },

  deleteNotification: async (notificationId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/notifications/${notificationId}`)
    return response.data
  },
}

