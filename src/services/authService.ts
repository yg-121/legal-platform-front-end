import api from "./api"
import type { LoginCredentials, RegisterData, User } from "../types/auth"
import type { ApiResponse } from "../types/api"

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/login", credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/register", data)
    return response.data
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>("/auth/me")
    return response.data
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${userId}`, data)
    return response.data
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response = await api.put<ApiResponse<null>>("/auth/password", {
      currentPassword,
      newPassword,
    })
    return response.data
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>("/auth/forgot-password", { email })
    return response.data
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>("/auth/reset-password", {
      token,
      newPassword,
    })
    return response.data
  },
}

