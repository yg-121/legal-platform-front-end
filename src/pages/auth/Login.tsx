"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { useAuth } from "../../hooks/useAuth"
import type { LoginCredentials } from "../../types/auth"

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, error, clearError } = useAuth()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))

    // Clear field error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    // Clear API error when user types
    if (error) {
      clearError()
    }
  }

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}
    let isValid = true

    if (!credentials.email) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = "Email is invalid"
      isValid = false
    }

    if (!credentials.password) {
      errors.password = "Password is required"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await login(credentials)
      // If login is successful, the auth context will redirect to dashboard
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Legal Services Platform</CardTitle>
          <CardDescription>Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              id="email"
              placeholder="name@example.com"
              value={credentials.email}
              onChange={handleChange}
              error={formErrors.email}
              fullWidth
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              error={formErrors.password}
              fullWidth
              required
            />
            <Button type="submit" isLoading={isLoading} fullWidth>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login

