import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/Card"
import {Button} from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import {Select} from "../../components/ui/Select"
import { useAuth } from "../../hooks/useAuth"
import { UserRole } from "../../types/auth"

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, register, error, clearError } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    role: UserRole.CLIENT,
    phone: "",
    specialization: "",
    location: "",
    license: null as File | null,
  })

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const toggleView = () => {
    setIsLogin(!isLogin)
    clearError()
    setFormErrors({})
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData({ ...loginData, [name]: value })

    // Clear field error
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }

    // Clear API error
    if (error) {
      clearError()
    }
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRegisterData({ ...registerData, [name]: value })

    // Clear field error
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }

    // Clear API error
    if (error) {
      clearError()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRegisterData({ ...registerData, license: e.target.files[0] })

      // Clear field error
      if (formErrors.license) {
        setFormErrors({ ...formErrors, license: "" })
      }
    }
  }

  const validateLoginForm = () => {
    const errors: Record<string, string> = {}

    if (!loginData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.email = "Email is invalid"
    }

    if (!loginData.password) {
      errors.password = "Password is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {}

    if (!registerData.username) {
      errors.username = "Username is required"
    }

    if (!registerData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = "Email is invalid"
    }

    if (!registerData.password) {
      errors.password = "Password is required"
    } else if (registerData.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    if (!registerData.phone) {
      errors.phone = "Phone number is required"
    }

    if (registerData.role === UserRole.LAWYER) {
      if (!registerData.specialization) {
        errors.specialization = "Specialization is required for lawyers"
      }

      if (!registerData.location) {
        errors.location = "Location is required for lawyers"
      }

      if (!registerData.license) {
        errors.license = "License document is required for lawyers"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateLoginForm()) {
      return
    }

    setIsLoading(true)

    try {
      await login({
        email: loginData.email,
        password: loginData.password,
      })
      // If login is successful, the auth context will redirect to dashboard
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateRegisterForm()) {
      return
    }

    setIsLoading(true)

    try {
      await register({
        firstName: registerData.username.split(" ")[0],
        lastName: registerData.username.split(" ").slice(1).join(" ") || "",
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
        specialization: registerData.specialization,
        // Additional fields would be handled in a real implementation
      })
      // If registration is successful, the auth context will redirect to dashboard
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            {isLogin ? "Sign in to your account" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Fill in the form below to create your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                id="login-email"
                placeholder="name@example.com"
                value={loginData.email}
                onChange={handleLoginChange}
                error={formErrors.email}
                fullWidth
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="login-password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  error={formErrors.password}
                  fullWidth
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="text-right text-sm">
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" isLoading={isLoading} fullWidth>
                Sign In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <Input
                label="Username"
                type="text"
                name="username"
                id="register-username"
                placeholder="John Doe"
                value={registerData.username}
                onChange={handleRegisterChange}
                error={formErrors.username}
                fullWidth
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                id="register-email"
                placeholder="name@example.com"
                value={registerData.email}
                onChange={handleRegisterChange}
                error={formErrors.email}
                fullWidth
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="register-password"
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  error={formErrors.password}
                  fullWidth
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Select
                label="Role"
                name="role"
                id="register-role"
                value={registerData.role}
                onChange={(value) => {
                  setRegisterData({ ...registerData, role: value as UserRole })
                  // Clear lawyer-specific errors if switching to client
                  if (value === UserRole.CLIENT) {
                    const { specialization, location, license, ...rest } = formErrors
                    setFormErrors(rest)
                  }
                }}
                options={[
                  { value: UserRole.CLIENT, label: "Client" },
                  { value: UserRole.LAWYER, label: "Lawyer" },
                ]}
                error={formErrors.role}
                fullWidth
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                id="register-phone"
                placeholder="+1 (555) 123-4567"
                value={registerData.phone}
                onChange={handleRegisterChange}
                error={formErrors.phone}
                fullWidth
                required
              />

              {registerData.role === UserRole.LAWYER && (
                <>
                  <Input
                    label="Specialization"
                    type="text"
                    name="specialization"
                    id="register-specialization"
                    placeholder="e.g., Family Law, Criminal Law"
                    value={registerData.specialization}
                    onChange={handleRegisterChange}
                    error={formErrors.specialization}
                    fullWidth
                    required
                  />

                  <Input
                    label="Location"
                    type="text"
                    name="location"
                    id="register-location"
                    placeholder="e.g., New York, NY"
                    value={registerData.location}
                    onChange={handleRegisterChange}
                    error={formErrors.location}
                    fullWidth
                    required
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">License Document</label>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="register-license"
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted"
                      >
                        <Upload size={16} />
                        <span>Upload License</span>
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {registerData.license ? registerData.license.name : "No file selected"}
                      </span>
                    </div>
                    <input
                      type="file"
                      id="register-license"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    {formErrors.license && <p className="mt-1 text-sm text-destructive">{formErrors.license}</p>}
                  </div>
                </>
              )}

              <Button type="submit" isLoading={isLoading} fullWidth>
                Create Account
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="relative flex w-full items-center justify-center">
            <div className="absolute inset-x-0 top-1/2 h-px bg-muted"></div>
            <span className="relative bg-card px-2 text-xs text-muted-foreground">OR</span>
          </div>

          <Button type="button" variant="outline" onClick={toggleView} className="w-full">
            {isLogin ? "Create an account" : "Sign in to existing account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AuthPage

