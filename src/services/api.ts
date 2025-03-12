import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import type { ApiError, ApiResponse } from "../types/api"

// Create a base axios instance
const api: AxiosInstance = axios.create({
  // baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem("token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiResponse<any>>) => {
    const apiError: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.error || "An unexpected error occurred",
      errors: error.response?.data?.errors,
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }

    return Promise.reject(apiError)
  },
)

// Helper function for file uploads
export const uploadFile = async (
  url: string,
  file: File,
  onProgress?: (percentage: number) => void,
): Promise<AxiosResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentage)
      }
    },
  })
}

export default api

