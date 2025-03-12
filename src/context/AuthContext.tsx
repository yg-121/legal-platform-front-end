/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useEffect, ReactNode } from "react"
import type { AuthContextType, AuthState, LoginCredentials, RegisterData, User } from "../types/auth"
import { authService } from "../services/authService"

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: true,
  error: null,
}

// Create context
export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
  userRole: null,
})

// Action types
type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "REGISTER_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "USER_LOADED"; payload: User }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("user", JSON.stringify(action.payload.user))
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case "USER_LOADED":
      localStorage.setItem("user", JSON.stringify(action.payload))
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case "AUTH_ERROR":
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case "LOGOUT":
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

// Provider component
export const AuthProvider = ({ children }: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem("token")) {
        try {
          const response = await authService.getCurrentUser()
          if (response.data) {
            dispatch({ type: "USER_LOADED", payload: response.data })
          }
        } catch {
          dispatch({ type: "AUTH_ERROR", payload: "Session expired. Please login again." })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadUser()
  }, [])

  // Login user
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authService.login(credentials)
      if (response.data) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        })
      }
    } catch (error: any) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.message || "Invalid credentials",
      })
    }
  }

  // Register user
  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authService.register(data)
      if (response.data) {
        dispatch({
          type: "REGISTER_SUCCESS",
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        })
      }
    } catch (error: any) {
      dispatch({
        type: "AUTH_ERROR",
        payload: error.message || "Registration failed",
      })
    }
  }

  // Logout user
  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  // Clear errors
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  // Get user role
  const userRole = state.user ? state.user.role : null;
  
  return <AuthContext.Provider value={{
    ...state,
    login,
    register,
    logout,
    clearError,
    userRole,
  }}>{children}</AuthContext.Provider>
}
