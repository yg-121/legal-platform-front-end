/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";
import UsersManagement from "./UsersManagement";
import CasesManagement from "./CasesManagement";
import Notifications from "./Notifications";
import AuditLogs from "./AuditLogs";
import Profile from "./Profile";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

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

  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      navigate("/login");
      return {};
    }
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAxiosConfig();
        if (!config.headers) return;

        const usersRes = await axios.get("http://localhost:5000/api/users", config);
        setUsers(usersRes.data.users);

        const casesRes = await axios.get("http://localhost:5000/api/cases", config);
        setCases(casesRes.data.cases);

        const notifRes = await axios.get("http://localhost:5000/api/notifications/admin/notifications", config);
        setNotifications(notifRes.data.notifications);
        setStats(notifRes.data.counts);

        const auditRes = await axios.get("http://localhost:5000/api/audit", config);
        setAuditLogs(auditRes.data.logs);

        // Fetch the latest admin profile from the server
        const profileRes = await axios.get("http://localhost:5000/api/users/admin/profile", config);
        setAdminProfile((prev) => ({
          ...prev,
          name: profileRes.data.username || "Admin",
          email: profileRes.data.email || "",
          phone: profileRes.data.phone || "",
          profileImage: profileRes.data.profile_photo || "/placeholder.svg?height=200&width=200",
        }));
      } catch (err: any) {
        console.error("Fetch error:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
        notifications={notifications}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          profileDropdownOpen={profileDropdownOpen}
          setProfileDropdownOpen={setProfileDropdownOpen}
          adminProfile={adminProfile}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-4">
          {activeTab === "users" && (
            <UsersManagement
              users={users}
              setUsers={setUsers}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              activeUserType={activeUserType}
              setActiveUserType={setActiveUserType}
              isAddingAdmin={isAddingAdmin}
              setIsAddingAdmin={setIsAddingAdmin}
              newAdmin={newAdmin}
              setNewAdmin={setNewAdmin}
              getAxiosConfig={getAxiosConfig}
            />
          )}
          {activeTab === "cases" && <CasesManagement cases={cases} />}
          {activeTab === "notifications" && (
            <Notifications notifications={notifications} setNotifications={setNotifications} stats={stats} getAxiosConfig={getAxiosConfig} />
          )}
          {activeTab === "audit" && <AuditLogs auditLogs={auditLogs} />}
          {activeTab === "profile" && (
            <Profile
              adminProfile={adminProfile}
              setAdminProfile={setAdminProfile}
              getAxiosConfig={getAxiosConfig}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;