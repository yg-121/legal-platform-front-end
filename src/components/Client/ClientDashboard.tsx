"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "../layouts/DashboardLayouts"
import DashboardStats from "./DashboardStats"
import UpcomingAppointments from "./UpcomingAppointments"
import ActiveCases from "./ActiveCases"
import RecentMessages from "./RecentMessages"

interface ClientDashboardProps {
  userName: string
}

export default function ClientDashboard({ userName }: ClientDashboardProps) {
  const [stats, setStats] = useState({
    activeCases: 0,
    upcomingAppointments: 0,
    unreadMessages: 0,
    pendingBids: 0,
  })
  const [appointments, setAppointments] = useState([])
  const [cases, setCases] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // Example:
    // const fetchDashboardData = async () => {
    //   try {
    //     const [statsRes, appointmentsRes, casesRes, messagesRes] = await Promise.all([
    //       fetch('/api/client/stats'),
    //       fetch('/api/client/appointments'),
    //       fetch('/api/client/cases'),
    //       fetch('/api/client/messages')
    //     ]);
    //
    //     const [statsData, appointmentsData, casesData, messagesData] = await Promise.all([
    //       statsRes.json(),
    //       appointmentsRes.json(),
    //       casesRes.json(),
    //       messagesRes.json()
    //     ]);
    //
    //     setStats(statsData);
    //     setAppointments(appointmentsData);
    //     setCases(casesData);
    //     setMessages(messagesData);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    //
    // fetchDashboardData();

    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setStats({
        activeCases: 2,
        upcomingAppointments: 3,
        unreadMessages: 5,
        pendingBids: 1,
      })

      setAppointments([
        // { id: 1, lawyer: "Jane Smith", date: "2025-03-20T10:00:00", status: "confirmed" },
        // { id: 2, lawyer: "John Doe", date: "2025-03-22T14:30:00", status: "confirmed" },
        // { id: 3, lawyer: "Alice Johnson", date: "2025-03-25T11:00:00", status: "pending" },
      ])

      setCases([
        // { id: 101, title: "Property Dispute", lawyer: "Jane Smith", status: "active", lastUpdated: "2025-03-15" },
        // { id: 102, title: "Contract Review", lawyer: "John Doe", status: "active", lastUpdated: "2025-03-14" },
      ])

      setMessages([
        // {
        //   id: 201,
        //   from: "Jane Smith",
        //   message: "Documents received, thank you.",
        //   date: "2025-03-16T09:23:00",
        //   read: false,
        // },
        // {
        //   id: 202,
        //   from: "John Doe",
        //   message: "Please review the attached contract.",
        //   date: "2025-03-15T16:45:00",
        //   read: false,
        // },
        // {
        //   id: 203,
        //   from: "Alice Johnson",
        //   message: "Your appointment is confirmed.",
        //   date: "2025-03-15T11:30:00",
        //   read: false,
        // },
      ])

      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <DashboardLayout userRole="client" userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="client" userName={userName}>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Client Dashboard</h1>

      <DashboardStats stats={stats} />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingAppointments appointments={appointments} />
        <ActiveCases cases={cases} />
      </div>

      <div className="mt-8">
        <RecentMessages messages={messages} />
      </div>
    </DashboardLayout>
  )
}

