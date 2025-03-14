/* eslint-disable @typescript-eslint/no-explicit-any */

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Briefcase,
  Bell,
  Clock,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Check,
  XIcon,
  Trash2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";

// Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<string>("users");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: "/placeholder.svg?height=200&width=200",
  });
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [activeUserType, setActiveUserType] = useState<string>("all");
  const [users, setUsers] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    lawyers: 0,
    pendingLawyers: 0,
    totalCases: 0,
  });
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  // Axios config with token
  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      navigate("/login");
      return {};
    }
    console.log("Token sent in request:", token); // Debug log
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAxiosConfig();
        if (!config.headers) return; // Prevent fetch if token is missing

        const usersRes = await axios.get("http://localhost:5000/api/users", config);
        setUsers(usersRes.data.users);

        const casesRes = await axios.get("http://localhost:5000/api/cases", config);
        setCases(casesRes.data.cases);

        const notifRes = await axios.get("http://localhost:5000/api/notifications/admin/notifications", config);
        setNotifications(notifRes.data.notifications);
        setStats(notifRes.data.counts);

        const auditRes = await axios.get("http://localhost:5000/api/audit", config);
        setAuditLogs(auditRes.data.logs);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setAdminProfile((prev) => ({
              ...prev,
              name: payload.username || "Admin",
              email: payload.email || "",
              phone: payload.phone || "",
              profileImage: payload.profile_photo || "/placeholder.svg?height=200&width=200",
            }));
          } catch (err) {
            console.error("Failed to decode token:", err);
          }
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Filter users based on selected status
  const filteredUsers = users.filter((user) => {
    return statusFilter === "All" || user.status === statusFilter;
  });

  // Fetch users function for refetching after adding admin
  const fetchUsers = async () => {
    try {
      const config = getAxiosConfig();
      if (!config.headers) return;
      const usersRes = await axios.get("http://localhost:5000/api/users", config);
      setUsers(usersRes.data.users);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  // Handle user actions
  const handleApproveUser = async (userId: string) => {
    try {
      const config = getAxiosConfig();
      if (!config.headers) return;
      await axios.put(
        "http://localhost:5000/api/users/approve-lawyer",
        { lawyerId: userId },
        config
      );
      setUsers(users.map((u) => (u._id === userId ? { ...u, status: "Active" } : u)));
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const config = getAxiosConfig();
      if (!config.headers) return;
      await axios.put(
        "http://localhost:5000/api/users/reject-lawyer",
        { lawyerId: userId },
        config
      );
      setUsers(users.map((u) => (u._id === userId ? { ...u, status: "Rejected" } : u)));
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const config = getAxiosConfig();
      if (!config.headers) return;
      await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const config = getAxiosConfig();
      if (!config.headers) return;
      await axios.patch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        config
      );
      setNotifications(notifications.map((n) => (n._id === notificationId ? { ...n, status: "Read" } : n)));
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminProfile.newPassword && adminProfile.newPassword !== adminProfile.confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }

    try {
      const config = getAxiosConfig();
      if (!config.headers) return;

      // Profile update
      let profileData;
      if (adminProfile.profileImage.startsWith("data:")) {
        // New image selected, use FormData
        const formData = new FormData();
        formData.append("username", adminProfile.name);
        formData.append("email", adminProfile.email);
        formData.append("phone", adminProfile.phone);
        const blob = await (await fetch(adminProfile.profileImage)).blob();
        formData.append("profile_photo", blob, "profile.jpg");
        profileData = formData;
      } else {
        // No new image, use JSON
        profileData = {
          username: adminProfile.name,
          email: adminProfile.email,
          phone: adminProfile.phone,
        };
      }

      console.log("Profile data:", profileData instanceof FormData ? [...profileData.entries()] : profileData);

      if (profileData instanceof FormData) {
        await axios.put("http://localhost:5000/api/users/admin/profile", profileData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.put("http://localhost:5000/api/users/admin/profile", profileData, config);
      }

      // Password update
      if (adminProfile.newPassword && adminProfile.password) {
        const passwordData = {
          currentPassword: adminProfile.password,
          newPassword: adminProfile.newPassword,
        };
        console.log("Password data:", passwordData);
        await axios.put("http://localhost:5000/api/users/admin/password", passwordData, config);
      }

      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err.response?.data || err);
      alert("Failed to update profile: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
      alert("Username, email, and password are required.");
      return;
    }

    try {
      const config = getAxiosConfig();
      if (!config.headers) return;
      await axios.post("http://localhost:5000/api/users/add-admin", newAdmin, config);
      alert("Admin added successfully!");
      setIsAddingAdmin(false);
      setNewAdmin({ username: "", email: "", password: "", phone: "" });
      await fetchUsers(); // Refetch users to update the list
    } catch (err: any) {
      console.error("Add admin error:", err);
      alert("Failed to add admin: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setAdminProfile((prev) => ({
            ...prev,
            profileImage: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out 
          ${sidebarOpen ? "w-64" : "w-16"} 
          hover:w-64 group md:relative`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <h2
              className={`text-xl font-bold transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"} whitespace-nowrap`}
            >
              A
            </h2>
            {!sidebarOpen && <span className="text-xl font-bold md:group-hover:hidden">LA</span>}
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                activeTab === "users"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Users className="w-5 h-5 min-w-5" />
              <span
                className={`font-medium ml-3 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"} whitespace-nowrap`}
              >
                Users
              </span>
            </button>

            <button
              onClick={() => setActiveTab("cases")}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                activeTab === "cases"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Briefcase className="w-5 h-5 min-w-5" />
              <span
                className={`font-medium ml-3 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"} whitespace-nowrap`}
              >
                Cases
              </span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                activeTab === "notifications"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Bell className="w-5 h-5 min-w-5" />
              <span
                className={`font-medium ml-3 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"} whitespace-nowrap`}
              >
                Notifications
              </span>
              {notifications.filter((n) => n.status === "Unread").length > 0 && (
                <span
                  className={`${sidebarOpen ? "ml-auto" : "ml-0"} bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full absolute right-2`}
                >
                  {notifications.filter((n) => n.status === "Unread").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                activeTab === "audit"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Clock className="w-5 h-5 min-w-5" />
              <span
                className={`font-medium ml-3 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"} whitespace-nowrap`}
              >
                Audit Logs
              </span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <User className="w-5 h-5 min-w-5" />
              <span
                className={`font-medium ml-3 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"} whitespace-nowrap`}
              >
                My Profile
              </span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5 min-w-5" />
              <span
                className={`font-medium ml-3 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"} whitespace-nowrap`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="p-2 rounded-md md:hidden">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold ml-2">Admin Dashboard</h1>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  <img
                    src={adminProfile.profileImage}
                    alt="Admin"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("placeholder.svg")) {
                        target.src = "/placeholder.svg?height=200&width=200";
                        target.onerror = null;
                      }
                    }}
                  />
                </div>
                <span className="hidden md:inline-block">{adminProfile.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("profile");
                      setProfileDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                    Settings
                  </a>
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === "users" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Users Management</h2>

                <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveUserType("all")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeUserType === "all"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setActiveUserType("client")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeUserType === "client"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    Clients
                  </button>
                  <button
                    onClick={() => setActiveUserType("lawyer")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeUserType === "lawyer"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    Lawyers
                  </button>
                  <button
                    onClick={() => setActiveUserType("admin")}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeUserType === "admin"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    Admins
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Status:</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* All Users Table */}
              {activeUserType === "all" && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{user._id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === "Admin"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                    : user.role === "Lawyer"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.status === "Active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : user.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                {user.role === "Lawyer" && user.status === "Pending" && (
                                  <>
                                    <button
                                      onClick={() => handleApproveUser(user._id)}
                                      className="text-green-500 hover:text-green-700 dark:hover:text-green-400"
                                      title="Approve"
                                    >
                                      <Check className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => handleRejectUser(user._id)}
                                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                      title="Reject"
                                    >
                                      <XIcon className="w-5 h-5" />
                                    </button>
                                  </>
                                )}
                                {user.role !== "Admin" && (
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Clients Table */}
              {activeUserType === "client" && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers
                          .filter((user) => user.role === "Client")
                          .map((user) => (
                            <tr key={user._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{user._id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{user.username}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.status === "Active"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : user.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  }`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Lawyers Table */}
              {activeUserType === "lawyer" && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Specialization
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            License
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers
                          .filter((user) => user.role === "Lawyer")
                          .map((user) => (
                            <tr key={user._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{user._id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{user.username}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {user.specialization || "Not specified"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {user.license_file ? (
                                  <a
                                    href={`http://localhost:5000${user.license_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                    View License
                                  </a>
                                ) : (
                                  "No license"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.status === "Active"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : user.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  }`}
                                >
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex space-x-2">
                                  {user.status === "Pending" && (
                                    <>
                                      <button
                                        onClick={() => handleApproveUser(user._id)}
                                        className="text-green-500 hover:text-green-700 dark:hover:text-green-400"
                                        title="Approve"
                                      >
                                        <Check className="w-5 h-5" />
                                      </button>
                                      <button
                                        onClick={() => handleRejectUser(user._id)}
                                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                        title="Reject"
                                      >
                                        <XIcon className="w-5 h-5" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Admins Section */}
              {activeUserType === "admin" && (
                <div>
                  <div className="mb-4">
                    <button
                      onClick={() => setIsAddingAdmin(!isAddingAdmin)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      {isAddingAdmin ? "Cancel" : "Add New Admin"}
                    </button>
                  </div>

                  {isAddingAdmin && (
                    <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Add New Admin</h3>
                      <form onSubmit={handleAddAdmin} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="new-username" className="block text-sm font-medium">
                            Username
                          </label>
                          <input
                            type="text"
                            id="new-username"
                            value={newAdmin.username}
                            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="new-email" className="block text-sm font-medium">
                            Email
                          </label>
                          <input
                            type="email"
                            id="new-email"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="new-password" className="block text-sm font-medium">
                            Password
                          </label>
                          <input
                            type="password"
                            id="new-password"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="new-phone" className="block text-sm font-medium">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="new-phone"
                            value={newAdmin.phone}
                            onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          >
                            Add Admin
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Username
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Last Login
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredUsers
                            .filter((user) => user.role === "Admin")
                            .map((user) => (
                              <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{user._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      user.status === "Active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : user.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    }`}
                                  >
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "cases" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Cases Management</h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Assigned Lawyer
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {cases.map((caseItem) => (
                        <tr key={caseItem._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{caseItem._id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {caseItem.client?.username || "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-sm">{caseItem.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                caseItem.status === "Open"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : caseItem.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {caseItem.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {caseItem.assigned_lawyer?.username || "Unassigned"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Notifications</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
                    <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Lawyers</h3>
                    <p className="text-2xl font-bold mt-1">{stats.lawyers}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Lawyers</h3>
                    <p className="text-2xl font-bold mt-1 text-yellow-500">{stats.pendingLawyers}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cases</h3>
                    <p className="text-2xl font-bold mt-1">{stats.totalCases}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium">Recent Notifications</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 ${notification.status === "Unread" ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm">{notification.message}</p>
                        {notification.status === "Unread" && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-xs"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Audit Logs</h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Admin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Target
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {auditLogs.map((log) => (
                        <tr key={log._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.admin?.username || "Unknown"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                log.action.includes("approve")
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : log.action.includes("reject") || log.action.includes("delete")
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              }`}
                            >
                              {log.action.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.target?.username || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.details || "N/A"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">My Profile</h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-400">
                        <img
                          src={adminProfile.profileImage}
                          alt="Admin Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("placeholder.svg")) {
                              target.src = "/placeholder.svg?height=200&width=200";
                              target.onerror = null;
                            }
                          }}
                        />
                      </div>
                      <div>
                        <input
                          type="file"
                          id="profile-image"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                        />
                        <button
                          onClick={() => document.getElementById("profile-image")?.click()}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="block text-sm font-medium">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={adminProfile.name}
                            onChange={handleProfileInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={adminProfile.email}
                            onChange={handleProfileInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="phone" className="block text-sm font-medium">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={adminProfile.phone}
                            onChange={handleProfileInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                          />
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-medium mb-4">Change Password</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label htmlFor="current-password" className="block text-sm font-medium">
                                Current Password
                              </label>
                              <input
                                type="password"
                                id="current-password"
                                name="password"
                                value={adminProfile.password}
                                onChange={handleProfileInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="new-password" className="block text-sm font-medium">
                                New Password
                              </label>
                              <input
                                type="password"
                                id="new-password"
                                name="newPassword"
                                value={adminProfile.newPassword}
                                onChange={handleProfileInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="confirm-password" className="block text-sm font-medium">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                value={adminProfile.confirmPassword}
                                onChange={handleProfileInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;