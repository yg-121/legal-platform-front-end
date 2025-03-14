import React from "react";
import { Menu, X, ChevronDown } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  profileDropdownOpen: boolean;
  setProfileDropdownOpen: (open: boolean) => void;
  adminProfile: { name: string; profileImage: string };
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  profileDropdownOpen,
  setProfileDropdownOpen,
  adminProfile,
  setActiveTab,
  handleLogout,
}) => {
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
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
  );
};

export default Header;