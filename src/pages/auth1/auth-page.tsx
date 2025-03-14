/* eslint-disable @typescript-eslint/no-explicit-any */


import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Upload } from "lucide-react"
import axios from "axios"

// Component imports with corrected paths
import { Button } from "@/components/ui/Button.tsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import  Input  from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useNavigate } from "react-router"

// Define types for form data
interface LoginFormData {
  email: string
  password: string
}

interface RegisterFormData {
  username: string
  email: string
  password: string
  role: string
  phone: string
  specialization: string
  location: string
  license: File | null
}

interface ApiResponse {
  success: boolean
  message: string
  token?: string
  user?: any
}

const AuthPage: React.FC = () => {
  // State for form data
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    role: "Client",
    phone: "",
    specialization: "",
    location: "",
    license: null,
  })

  // UI states
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("login")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const navigate=useNavigate()
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
  try {
      const response = await axios.post<ApiResponse>("http://localhost:5000/api/auth/login", loginData)

      if (response.data.token) {
        setSuccess("Login successful!")
        navigate("/admin")
        // Store token in localStorage or sessionStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token)
        }

        // Redirect or update UI based on successful login
        console.log("Login successful:", response.data)

        // You can redirect here if needed
        // window.location.href = '/dashboard';
      } else {
        console.log(response.data)
        console.log(response.status)

        setError(response.data.message || "Login failed. Please try again.")
      }
    } catch (err) {
      console.error("Login error:", err)
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Login failed. Please check your credentials.")
      } else {
        setError("An error occurred during login. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle registration form submission
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("username", registerData.username)
      formData.append("email", registerData.email)
      formData.append("password", registerData.password)
      formData.append("role", registerData.role)
      formData.append("phone", registerData.phone)

      if (registerData.role === "Lawyer") {
        formData.append("specialization", registerData.specialization)
        formData.append("location", registerData.location)
        if (registerData.license) {
          formData.append("license_file", registerData.license)
        }
      }

      const response = await axios.post<ApiResponse>("http://localhost:5000/api/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.token) {
        setSuccess("Registration successful! You can now log in.")
        // Switch to login tab after successful registration
        setTimeout(() => {
          setActiveTab("login")
        }, 2000)
      } else {
        setError(response.data.message || "Registration failed. Please try again.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Registration failed. Please check your information.")
      } else {
        setError("An error occurred during registration. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle login form input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle registration form input changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle role selection
  const handleRoleChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, role: value }))
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRegisterData((prev) => ({ ...prev, license: e.target.files![0] }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-blue-800">Legal Platform</CardTitle>
          <CardDescription className="text-center text-blue-600">
            {activeTab === "login" ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>
          )}
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
              setError("")
              setSuccess("")
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    name="username"
                    placeholder="johndoe"
                    required
                    value={registerData.username}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={registerData.password}
                      onChange={handleRegisterChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-role">Role</Label>
                  <Select onValueChange={handleRoleChange} defaultValue={registerData.role}>
                    <SelectTrigger id="register-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Client">Client</SelectItem>
                      <SelectItem value="Lawyer">Lawyer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone</Label>
                  <Input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                  />
                </div>

                {/* Conditional fields for Lawyers */}
                {registerData.role === "Lawyer" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="register-specialization">Specialization</Label>
                      <Input
                        id="register-specialization"
                        name="specialization"
                        placeholder="e.g., Corporate Law"
                        value={registerData.specialization}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-location">Location</Label>
                      <Input
                        id="register-location"
                        name="location"
                        placeholder="e.g., New York, NY"
                        value={registerData.location}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-license">License (PDF)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="register-license"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                          onClick={() => document.getElementById("register-license")?.click()}
                        >
                          <Upload size={16} />
                          {registerData.license ? registerData.license.name : "Upload License"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            {activeTab === "login" ? (
              <span>
                Don't have an account?{" "}
                <button className="text-blue-600 hover:underline" onClick={() => setActiveTab("register")}>
                  Register
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button className="text-blue-600 hover:underline" onClick={() => setActiveTab("login")}>
                  Login
                </button>
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AuthPage

