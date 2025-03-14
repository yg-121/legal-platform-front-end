/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Users, Briefcase, Bell, Clock, LogOut, User } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
  notifications: any[];
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
  notifications,
}) => {
  return (
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
              <span B
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
  );
};

export default Sidebar;