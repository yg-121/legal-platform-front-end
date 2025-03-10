// import type React from "react";
// import { useState } from "react";
// import axios from "axios"; // Add this
// import { Eye, EyeOff, Upload } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // Define types for form data
// interface LoginFormData {
//   email: string;
//   password: string;
// }

// interface RegisterFormData {
//   username: string;
//   email: string;
//   password: string;
//   role: string;
//   phone: string;
//   specialization: string;
//   location: string;
//   license: File | null;
// }

// const AuthPage: React.FC = () => {
//   const [loginData, setLoginData] = useState<LoginFormData>({
//     email: "",
//     password: "",
//   });

//   const [registerData, setRegisterData] = useState<RegisterFormData>({
//     username: "",
//     email: "",
//     password: "",
//     role: "Client",
//     phone: "",
//     specialization: "",
//     location: "",
//     license: null,
//   });

//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [activeTab, setActiveTab] = useState<string>("login");
//   const [error, setError] = useState<string | null>(null); // Add error state

//   // Handle login form submission
//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
//       localStorage.setItem('token', res.data.token);
//       console.log('Logged in!', res.data);
//       // Optionally redirect or update UI after login
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle registration form submission
//   const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('username', registerData.username);
//     formData.append('email', registerData.email);
//     formData.append('password', registerData.password);
//     formData.append('role', registerData.role);
//     formData.append('phone', registerData.phone);
//     if (registerData.role === 'Lawyer') {
//       formData.append('specialization', registerData.specialization);
//       formData.append('location', registerData.location);
//       if (registerData.license) {
//         formData.append('license_file', registerData.license); // Match backend field name
//       }
//     }

//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/register', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       localStorage.setItem('token', res.data.token);
//       console.log('Registered!', res.data);
//       // Optionally switch to login or redirect
//       setActiveTab('login');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Registration failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle login form input changes
//   const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLoginData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle registration form input changes
//   const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setRegisterData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle role selection
//   const handleRoleChange = (value: string) => {
//     setRegisterData((prev) => ({ ...prev, role: value }));
//   };

//   // Handle file upload
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setRegisterData((prev) => ({ ...prev, license: e.target.files![0] }));
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center text-blue-800">Legal Platform</CardTitle>
//           <CardDescription className="text-center text-blue-600">
//             {activeTab === "login" ? "Sign in to your account" : "Create a new account"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-2 mb-6">
//               <TabsTrigger value="login" disabled={isLoading}>Login</TabsTrigger>
//               <TabsTrigger value="register" disabled={isLoading}>Register</TabsTrigger>
//             </TabsList>

//             {/* Login Form */}
//             <TabsContent value="login">
//               <form onSubmit={handleLogin} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="login-email">Email</Label>
//                   <Input
//                     id="login-email"
//                     name="email"
//                     type="email"
//                     placeholder="your@email.com"
//                     required
//                     value={loginData.email}
//                     onChange={handleLoginChange}
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="login-password">Password</Label>
//                     <a href="#" className="text-sm text-blue-600 hover:underline">
//                       Forgot password?
//                     </a>
//                   </div>
//                   <div className="relative">
//                     <Input
//                       id="login-password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       required
//                       value={loginData.password}
//                       onChange={handleLoginChange}
//                       disabled={isLoading}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
//                       onClick={() => setShowPassword(!showPassword)}
//                       disabled={isLoading}
//                     >
//                       {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                     </Button>
//                   </div>
//                 </div>
//                 {error && <p className="text-red-500 text-sm">{error}</p>}
//                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
//                   {isLoading ? "Logging in..." : "Login"}
//                 </Button>
//               </form>
//             </TabsContent>

//             {/* Register Form */}
//             <TabsContent value="register">
//               <form onSubmit={handleRegister} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="register-username">Username</Label>
//                   <Input
//                     id="register-username"
//                     name="username"
//                     placeholder="johndoe"
//                     required
//                     value={registerData.username}
//                     onChange={handleRegisterChange}
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="register-email">Email</Label>
//                   <Input
//                     id="register-email"
//                     name="email"
//                     type="email"
//                     placeholder="your@email.com"
//                     required
//                     value={registerData.email}
//                     onChange={handleRegisterChange}
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="register-password">Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="register-password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       required
//                       value={registerData.password}
//                       onChange={handleRegisterChange}
//                       disabled={isLoading}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
//                       onClick={() => setShowPassword(!showPassword)}
//                       disabled={isLoading}
//                     >
//                       {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="register-role">Role</Label>
//                   <Select onValueChange={handleRoleChange} value={registerData.role} disabled={isLoading}>
//                     <SelectTrigger id="register-role">
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Client">Client</SelectItem>
//                       <SelectItem value="Lawyer">Lawyer</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="register-phone">Phone</Label>
//                   <Input
//                     id="register-phone"
//                     name="phone"
//                     type="tel"
//                     placeholder="+1 (555) 000-0000"
//                     value={registerData.phone}
//                     onChange={handleRegisterChange}
//                     disabled={isLoading}
//                   />
//                 </div>

//                 {/* Conditional fields for Lawyers */}
//                 {registerData.role === "Lawyer" && (
//                   <>
//                     <div className="space-y-2">
//                       <Label htmlFor="register-specialization">Specialization</Label>
//                       <Input
//                         id="register-specialization"
//                         name="specialization"
//                         placeholder="e.g., Corporate Law"
//                         value={registerData.specialization}
//                         onChange={handleRegisterChange}
//                         disabled={isLoading}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="register-location">Location</Label>
//                       <Input
//                         id="register-location"
//                         name="location"
//                         placeholder="e.g., New York, NY"
//                         value={registerData.location}
//                         onChange={handleRegisterChange}
//                         disabled={isLoading}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label htmlFor="register-license">License (PDF)</Label>
//                       <div className="flex items-center gap-2">
//                         <Input
//                           id="register-license"
//                           type="file"
//                           accept=".pdf"
//                           className="hidden"
//                           onChange={handleFileChange}
//                           disabled={isLoading}
//                         />
//                         <Button
//                           type="button"
//                           variant="outline"
//                           className="w-full flex items-center justify-center gap-2"
//                           onClick={() => document.getElementById("register-license")?.click()}
//                           disabled={isLoading}
//                         >
//                           <Upload size={16} />
//                           {registerData.license ? registerData.license.name : "Upload License"}
//                         </Button>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {error && <p className="text-red-500 text-sm">{error}</p>}
//                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
//                   {isLoading ? "Registering..." : "Register"}
//                 </Button>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-2">
//           <div className="text-sm text-center text-gray-500">
//             {activeTab === "login" ? (
//               <span>
//                 Don't have an account?{" "}
//                 <button className="text-blue-600 hover:underline" onClick={() => setActiveTab("register")} disabled={isLoading}>
//                   Register
//                 </button>
//               </span>
//             ) : (
//               <span>
//                 Already have an account?{" "}
//                 <button className="text-blue-600 hover:underline" onClick={() => setActiveTab("login")} disabled={isLoading}>
//                   Login
//                 </button>
//               </span>
//             )}
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default AuthPage;