import type React from "react"
import { NavLink } from "react-router-dom"
import { UserRole } from "../../types/auth"

interface SidebarProps {
  isOpen: boolean
  userRole: UserRole | null
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, userRole }) => {
  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
      { to: "/cases", label: "Cases", icon: "description" },
      { to: "/notifications", label: "Notifications", icon: "notifications" },
    ]

    const clientItems = [
      ...commonItems,
      { to: "/appointments", label: "Appointments", icon: "event" },
      { to: "/chat", label: "Chat", icon: "chat" },
    ]

    const lawyerItems = [
      ...commonItems,
      { to: "/appointments", label: "Appointments", icon: "event" },
      { to: "/chat", label: "Chat", icon: "chat" },
    ]

    const adminItems = [
      ...commonItems,
      { to: "/users", label: "Users", icon: "people" },
      { to: "/settings", label: "Settings", icon: "settings" },
    ]

    switch (userRole) {
      case UserRole.CLIENT:
        return clientItems
      case UserRole.LAWYER:
        return lawyerItems
      case UserRole.ADMIN:
        return adminItems
      default:
        return commonItems
    }
  }

  const navItems = getNavItems()

  return (
    <aside className={`bg-card text-card-foreground transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
      <div className="flex h-16 items-center justify-center border-b">
        {isOpen ? <h1 className="text-xl font-bold">Legal Platform</h1> : <span className="text-xl font-bold">LP</span>}
      </div>
      <nav className="mt-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center rounded-md px-3 py-2 transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`
                }
              >
                <span className="material-icons mr-3">{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar

