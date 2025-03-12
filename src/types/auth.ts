export enum UserRole {
  CLIENT = "client",
  LAWYER = "lawyer",
  ADMIN = "admin",
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  profileImage?: string
  specialization?: string // For lawyers
  location?: string
  phone?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  firstName: string
  lastName: string
  role: UserRole
  specialization?: string // For lawyers
  location?: string
  phone?: string
  license?: File // For lawyers
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
  userRole: UserRole | null
}

