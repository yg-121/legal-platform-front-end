import api, { uploadFile } from "./api"
import type { Message, ChatUser } from "../types/chat"
import type { ApiResponse } from "../types/api"

export const chatService = {
  getChatUsers: async (): Promise<ApiResponse<ChatUser[]>> => {
    const response = await api.get<ApiResponse<ChatUser[]>>("/chats/users")
    return response.data
  },

  getChatHistory: async (userId: string, page?: number, limit?: number): Promise<ApiResponse<Message[]>> => {
    const params = new URLSearchParams()

    if (page) params.append("page", page.toString())
    if (limit) params.append("limit", limit.toString())

    const response = await api.get<ApiResponse<Message[]>>(`/chats/history/${userId}`, { params })
    return response.data
  },

  sendMessage: async (receiverId: string, content: string, attachments?: File[]): Promise<ApiResponse<Message>> => {
    // First send the message without attachments
    const response = await api.post<ApiResponse<Message>>("/chats/send", {
      receiverId,
      content,
    })

    // If there are attachments, upload them
    if (attachments && attachments.length > 0 && response.data.data) {
      const messageId = response.data.data.id

      // Upload each attachment
      for (const file of attachments) {
        await uploadFile(`/chats/message/${messageId}/attachments`, file)
      }

      // Get the updated message with attachments
      const updatedResponse = await api.get<ApiResponse<Message>>(`/chats/message/${messageId}`)
      return updatedResponse.data
    }

    return response.data
  },

  markAsRead: async (messageIds: string[]): Promise<ApiResponse<null>> => {
    const response = await api.put<ApiResponse<null>>("/chats/mark-read", { messageIds })
    return response.data
  },

  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.get<ApiResponse<{ count: number }>>("/chats/unread")
    return response.data
  },
}

