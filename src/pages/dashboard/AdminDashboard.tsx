

import type React from "react"
import { useState } from "react"
import { Users, Briefcase, Bell, Clock, LogOut, ChevronDown, Menu, X, Check, XIcon, Trash2 } from "lucide-react"

// Placeholder data
const usersData = [
  { id: 1, username: "john_doe", email: "john@example.com", role: "Client", status: "Active" },
  { id: 2, username: "jane_smith", email: "jane@example.com", role: "Lawyer", status: "Active" },
  { id: 3, username: "bob_lawyer", email: "bob@example.com", role: "Lawyer", status: "Pending" },
  { id: 4, username: "alice_admin", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 5, username: "charlie_client", email: "charlie@example.com", role: "Client", status: "Active" },
  { id: 6, username: "dave_lawyer", email: "dave@example.com", role: "Lawyer", status: "Rejected" },
  { id: 7, username: "eve_lawyer", email: "eve@example.com", role: "Lawyer", status: "Pending" },
]

const casesData = [
  { id: 101, client: "John Doe", description: "Contract Dispute", status: "Open", lawyer: "Jane Smith" },
  { id: 102, client: "Charlie Client", description: "Property Settlement", status: "Closed", lawyer: "Jane Smith" },
  { id: 103, client: "Alice Johnson", description: "Divorce Proceedings", status: "In Progress", lawyer: "Bob Lawyer" },
  { id: 104, client: "David Wilson", description: "Corporate Merger", status: "Open", lawyer: "Eve Lawyer" },
  {
    id: 105,
    client: "Sarah Brown",
    description: "Intellectual Property",
    status: "In Progress",
    lawyer: "Dave Lawyer",
  },
]

const notificationsData = [
  { id: 201, message: "New lawyer registration: Bob Lawyer", timestamp: "2023-06-15 09:30:45", read: false },
  { id: 202, message: "Case #103 status updated to In Progress", timestamp: "2023-06-14 14:22:10", read: true },
  { id: 203, message: "New lawyer registration: Eve Lawyer", timestamp: "2023-06-14 11:15:32", read: false },
  { id: 204, message: "User John Doe updated their profile", timestamp: "2023-06-13 16:40:27", read: true },
  { id: 205, message: "Case #101 has a new document uploaded", timestamp: "2023-06-12 10:05:18", read: false },
]

const auditLogsData = [
  {
    id: 301,
    admin: "Alice Admin",
    action: "Approved Lawyer",
    target: "Jane Smith",
    details: "Lawyer account approved",
    timestamp: "2023-06-15 10:30:45",
  },
  {
    id: 302,
    admin: "Alice Admin",
    action: "Rejected Lawyer",
    target: "Dave Lawyer",
    details: "Invalid credentials",
    timestamp: "2023-06-14 15:22:10",
  },
  {
    id: 303,
    admin: "Alice Admin",
    action: "Deleted User",
    target: "Former User",
    details: "User requested account deletion",
    timestamp: "2023-06-13 11:15:32",
  },
  {
    id: 304,
    admin: "Alice Admin",
    action: "System Update",
    target: "Platform",
    details: "Updated terms of service",
    timestamp: "2023-06-12 09:40:27",
  },
  {
    id: 305,
    admin: "Alice Admin",
    action: "Created Case",
    target: "Case #105",
    details: "Manually created case",
    timestamp: "2023-06-11 14:05:18",
  },
]

// Stats calculations
const stats = {
  totalUsers: usersData.length,
  lawyers: usersData.filter((user) => user.role === "Lawyer").length,
  pendingLawyers: usersData.filter((user) => user.role === "Lawyer" && user.status === "Pending").length,
  totalCases: casesData.length,
}

const AdminDashboard: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<string>("users")
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [roleFilter, setRoleFilter] = useState<string>("All")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false)
  const [notificationState, setNotificationState] = useState(notificationsData)

  // Filter users based on selected filters
  const filteredUsers = usersData.filter((user) => {
    const matchesRole = roleFilter === "All" || user.role === roleFilter
    const matchesStatus = statusFilter === "All" || user.status === statusFilter
    return matchesRole && matchesStatus
  })

  // Handle user actions
  const handleApproveUser = (userId: number) => {
    console.log(`Approving user with ID: ${userId}`)
    // In a real app, you would make an API call here
  }

  const handleRejectUser = (userId: number) => {
    console.log(`Rejecting user with ID: ${userId}`)
    // In a real app, you would make an API call here
  }

  const handleDeleteUser = (userId: number) => {
    console.log(`Deleting user with ID: ${userId}`)
    // In a real app, you would make an API call here
  }

  const handleMarkAsRead = (notificationId: number) => {
    setNotificationState((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
    console.log(`Marked notification ${notificationId} as read`)
  }

  const handleLogout = () => {
    console.log("Logging out...")
    // In a real app, you would handle logout logic here
  }

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold">Legal Admin</h2>
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
              <Users className="w-5 h-5 mr-3" />
              <span className="font-medium">Users</span>
            </button>

            <button
              onClick={() => setActiveTab("cases")}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                activeTab === "cases"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Briefcase className="w-5 h-5 mr-3" />
              <span className="font-medium">Cases</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                activeTab === "notifications"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Bell className="w-5 h-5 mr-3" />
              <span className="font-medium">Notifications</span>
              {notificationState.filter((n) => !n.read).length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {notificationState.filter((n) => !n.read).length}
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
              <Clock className="w-5 h-5 mr-3" />
              <span className="font-medium">Audit Logs</span>
            </button>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
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
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium">A</span>
                </div>
                <span className="hidden md:inline-block">Admin Name</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Users Management</h2>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Role:</label>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm"
                    >
                      <option value="All">All Roles</option>
                      <option value="Client">Client</option>
                      <option value="Lawyer">Lawyer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

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

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Username
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{user.id}</td>
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
                                    onClick={() => handleApproveUser(user.id)}
                                    className="text-green-500 hover:text-green-700 dark:hover:text-green-400"
                                    title="Approve"
                                  >
                                    <Check className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectUser(user.id)}
                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                    title="Reject"
                                  >
                                    <XIcon className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                              {user.role !== "Admin" && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
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
            </div>
          )}

          {/* Cases Tab */}
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
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Client
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Assigned Lawyer
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {casesData.map((caseItem) => (
                        <tr key={caseItem.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{caseItem.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{caseItem.client}</td>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{caseItem.lawyer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Notifications</h2>

                {/* Stats Cards */}
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
                  {notificationState.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm">{notification.message}</p>
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-xs"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
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
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Admin
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Action
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Target
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Details
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {auditLogsData.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.admin}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                log.action.includes("Approved")
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : log.action.includes("Rejected") || log.action.includes("Deleted")
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.details}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard

