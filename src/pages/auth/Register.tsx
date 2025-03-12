"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"
import { useAuth } from "../../hooks/useAuth"
import { type RegisterData, UserRole } from "../../types/auth"

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register, error, clearError } = useAuth()
  const [formData, setFormData] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: UserRole.CLIENT,
    specialization: "",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    confirmPassword?: string
    role?: string
    specialization?: string
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "confirmPassword") {
      setConfirmPassword(value)

      // Clear confirm password error when user types
      if (formErrors.confirmPassword) {
        setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Clear field error when user types
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    }

    // Clear API error when user types
    if (error) {
      clearError()
    }
  }

  const validateForm = (): boolean => {
    const errors: {
      firstName?: string
      lastName?: string
      email?: string
      password?: string
      confirmPassword?: string
      role?: string
      specialization?: string
    } = {}
    let isValid = true

    if (!formData.firstName) {
      errors.firstName = "First name is required"
      isValid = false
    }

    if (!formData.lastName) {
      errors.lastName = "Last name is required"
      isValid = false
    }

    if (!formData.email) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      errors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
      isValid = false
    }

    if (formData.password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    if (formData.role === UserRole.LAWYER && !formData.specialization) {
      errors.specialization = "Specialization is required for lawyers"
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
      await register(formData)
      // If registration is successful, the auth context will redirect to dashboard
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                error={formErrors.firstName}
                fullWidth
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                error={formErrors.lastName}
                fullWidth
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              name="email"
              id="email"
              placeholder="name@example.com"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              fullWidth
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
              fullWidth
              required
            />
            <Select
              label="Role"
              name="role"
              id="role"
              value={formData.role}
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, role: value as UserRole }))
              }}
              options={[
                { value: UserRole.CLIENT, label: "Client" },
                { value: UserRole.LAWYER, label: "Lawyer" },
              ]}
              error={formErrors.role}
              fullWidth
              required
            />
            {formData.role === UserRole.LAWYER && (
              <Input
                label="Specialization"
                type="text"
                name="specialization"
                id="specialization"
                placeholder="e.g., Family Law, Criminal Law"
                value={formData.specialization || ""}
                onChange={handleChange}
                error={formErrors.specialization}
                fullWidth
                required
              />
            )}
            <Button type="submit" isLoading={isLoading} fullWidth>
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <div className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register

