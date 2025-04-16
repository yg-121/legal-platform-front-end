"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, Clock, User, Video, Phone, MapPin, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import PageLayout from "../../components/layouts/PageLayout"

interface AppointmentsPageProps {
  userName: string
  userRole: "client" | "lawyer" | "admin"
}

export default function AppointmentsPage({ userName, userRole }: AppointmentsPageProps) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("upcoming")
  const [view, setView] = useState("list") // 'list' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const mockClientAppointments = [
        {
          id: 1,
          lawyer: "Jane Smith",
          date: "2025-03-20T10:00:00",
          endDate: "2025-03-20T11:00:00",
          status: "confirmed",
          type: "video",
          notes: "Initial consultation regarding property dispute case.",
        },
        {
          id: 2,
          lawyer: "John Doe",
          date: "2025-03-22T14:30:00",
          endDate: "2025-03-22T15:30:00",
          status: "confirmed",
          type: "in-person",
          location: "123 Law St, New York, NY 10001",
          notes: "Review contract documents and discuss next steps.",
        },
        {
          id: 3,
          lawyer: "Alice Johnson",
          date: "2025-03-25T11:00:00",
          endDate: "2025-03-25T12:00:00",
          status: "pending",
          type: "phone",
          notes: "Discuss potential new case regarding employment contract.",
        },
        {
          id: 4,
          lawyer: "Robert Williams",
          date: "2025-02-15T09:30:00",
          endDate: "2025-02-15T10:30:00",
          status: "completed",
          type: "video",
          notes: "Initial consultation for divorce proceedings.",
        },
        {
          id: 5,
          lawyer: "Emily Davis",
          date: "2025-02-10T13:00:00",
          endDate: "2025-02-10T14:00:00",
          status: "cancelled",
          type: "in-person",
          location: "456 Legal Ave, New York, NY 10002",
          notes: "Discuss real estate transaction details.",
        },
      ]

      const mockLawyerAppointments = [
        {
          id: 1,
          client: "John Smith",
          date: "2025-03-20T10:00:00",
          endDate: "2025-03-20T11:00:00",
          status: "confirmed",
          type: "video",
          notes: "Initial consultation regarding property dispute case.",
        },
        {
          id: 2,
          client: "Sarah Johnson",
          date: "2025-03-22T14:30:00",
          endDate: "2025-03-22T15:30:00",
          status: "confirmed",
          type: "in-person",
          location: "123 Law St, New York, NY 10001",
          notes: "Review contract documents and discuss next steps.",
        },
        {
          id: 3,
          client: "Michael Brown",
          date: "2025-03-25T11:00:00",
          endDate: "2025-03-25T12:00:00",
          status: "pending",
          type: "phone",
          notes: "Discuss potential new case regarding employment contract.",
        },
        {
          id: 4,
          client: "Emily Davis",
          date: "2025-02-15T09:30:00",
          endDate: "2025-02-15T10:30:00",
          status: "completed",
          type: "video",
          notes: "Initial consultation for divorce proceedings.",
        },
        {
          id: 5,
          client: "David Wilson",
          date: "2025-02-10T13:00:00",
          endDate: "2025-02-10T14:00:00",
          status: "cancelled",
          type: "in-person",
          location: "456 Legal Ave, New York, NY 10002",
          notes: "Discuss real estate transaction details.",
        },
      ]

      if (userRole === "client") {
        setAppointments(mockClientAppointments)
      } else {
        setAppointments(mockLawyerAppointments)
      }

      setLoading(false)
    }, 1000)
  }, [userRole])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />
      case "phone":
        return <Phone className="h-5 w-5 text-green-500" />
      case "in-person":
        return <MapPin className="h-5 w-5 text-purple-500" />
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredAppointments = appointments.filter((appointment: any) => {
    const appointmentDate = new Date(appointment.date)
    const now = new Date()

    if (filter === "upcoming") {
      return appointmentDate >= now && appointment.status !== "cancelled"
    } else if (filter === "past") {
      return appointmentDate < now || appointment.status === "completed"
    } else if (filter === "pending") {
      return appointment.status === "pending"
    } else if (filter === "cancelled") {
      return appointment.status === "cancelled"
    }

    return true
  })

  const prevMonth = () => {
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() - 1)
    setCurrentDate(date)
  }

  const nextMonth = () => {
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() + 1)
    setCurrentDate(date)
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayAppointments = appointments.filter((appointment: any) => {
        const appointmentDate = new Date(appointment.date)
        return (
          appointmentDate.getFullYear() === year &&
          appointmentDate.getMonth() === month &&
          appointmentDate.getDate() === day
        )
      })

      days.push(
        <div key={day} className="h-24 border border-gray-200 p-1 overflow-hidden">
          <div className="font-medium text-sm mb-1">{day}</div>
          {dayAppointments.length > 0 ? (
            <div className="space-y-1">
              {dayAppointments.map((appointment: any) => (
                <Link
                  key={appointment.id}
                  to={`/${userRole}/appointments/${appointment.id}`}
                  className={`block text-xs truncate rounded px-1 py-0.5 ${getStatusColor(appointment.status)}`}
                >
                  {formatTime(appointment.date)} - {userRole === "client" ? appointment.lawyer : appointment.client}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400">No appointments</div>
          )}
        </div>,
      )
    }

    return days
  }

  if (loading) {
    return (
      <PageLayout userRole={userRole} userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout userRole={userRole} userName={userName}>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Appointments</h1>
          </div>
          <div className="flex space-x-3">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === "list" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === "calendar" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Calendar
              </button>
            </div>
            <Link
              to={`/${userRole}/appointments/schedule`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              {userRole === "client" ? "Schedule Appointment" : "Add Availability"}
            </Link>
          </div>
        </div>

        {view === "list" && (
          <>
            <div className="border-b border-gray-200">
              <div className="px-4 sm:px-6 flex space-x-4 overflow-x-auto py-3">
                <button
                  onClick={() => setFilter("upcoming")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === "upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter("past")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === "past"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Past
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === "pending"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("cancelled")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    filter === "cancelled"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            {filteredAppointments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment: any) => (
                  <li key={appointment.id} className="hover:bg-gray-50">
                    <Link to={`/${userRole}/appointments/${appointment.id}`} className="block px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {userRole === "client" ? appointment.lawyer : appointment.client}
                            </p>
                            <div className="flex items-center mt-1">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <p className="text-sm text-gray-500">{formatDate(appointment.date)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4 flex items-center">
                            {getTypeIcon(appointment.type)}
                            <span className="ml-1 text-sm text-gray-500 capitalize">{appointment.type}</span>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="mt-2 ml-14">
                          <p className="text-sm text-gray-500 line-clamp-1">{appointment.notes}</p>
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === "upcoming" ? "You have no upcoming appointments." : `No ${filter} appointments found.`}
                </p>
                <div className="mt-6">
                  <Link
                    to={`/${userRole}/appointments/schedule`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {userRole === "client" ? "Schedule Appointment" : "Add Availability"}
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {view === "calendar" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentDate)}
              </h2>
              <div className="flex space-x-2">
                <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium text-gray-500 text-sm py-2">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

