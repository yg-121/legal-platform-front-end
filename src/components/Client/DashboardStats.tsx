import { Briefcase, Calendar, MessageSquare, FileText } from "lucide-react"

interface StatsProps {
  stats: {
    activeCases: number
    upcomingAppointments: number
    unreadMessages: number
    pendingBids: number
  }
}

export default function DashboardStats({ stats }: StatsProps) {
  const statItems = [
    { name: "Active Cases", value: stats.activeCases, icon: Briefcase, color: "bg-blue-100 text-blue-600" },
    {
      name: "Upcoming Appointments",
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "bg-yellow-100 text-yellow-600",
    },
    { name: "Pending Bids", value: stats.pendingBids, icon: FileText, color: "bg-purple-100 text-purple-600" },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div key={item.name} className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{item.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

