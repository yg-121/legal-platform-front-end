export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
    pagination?: PaginationInfo
  }
  
  export interface PaginationInfo {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
  
  export interface ApiError {
    status: number
    message: string
    errors?: Record<string, string[]>
  }
  
