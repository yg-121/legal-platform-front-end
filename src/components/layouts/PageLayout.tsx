import type { ReactNode } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"

interface PageLayoutProps {
  children: ReactNode
  userRole: "client" | "lawyer" | "admin"
  userName: string
  unreadNotifications?: number
  showFooter?: boolean
}

export default function PageLayout({
  children,
  userRole,
  userName,
  unreadNotifications = 0,
  showFooter = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userRole={userRole} userName={userName} unreadNotifications={unreadNotifications} />

      <main className="flex-grow">{children}</main>

      {showFooter && <Footer />}
    </div>
  )
}

