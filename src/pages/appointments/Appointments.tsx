"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import Spinner from "../../components/ui/Spinner"
import Modal from "../../components/ui/Modal"
import { useAuth } from "../../hooks/useAuth"
import { appointmentService } from "../../services/appointmentService"
import { type Appointment, AppointmentStatus, AppointmentType } from "../../types/appointment"
import { UserRole } from "../../types/auth"
import CreateAppointmentForm from "./CreateAppointmentForm.tsx"

const Appointments: React.FC = () => {
  const { userRole } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCalendarView, setIsCalendarView] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const startDate = new Date()
      startDate.setDate(1)

      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 2)

      const response = await appointmentService.getAppointments(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
      )

      if (response.data) {
        setAppointments(response.data)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAppointment = async (appointmentData: any) => {
    try {
      const response = await appointmentService.createAppointment(appointmentData)
      if (response.data) {
        setIsCreateModalOpen(false)
        fetchAppointments()
      }
    } catch (error) {
      console.error("Error creating appointment:", error)
    }
  }

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      const response = await appointmentService.confirmAppointment(appointmentId)
      if (response.data) {
        fetchAppointments()
      }
    } catch (error) {
      console.error("Error confirming appointment:", error)
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const response = await appointmentService.cancelAppointment(appointmentId)
      if (response.data) {
        fetchAppointments()
      }
    } catch (error) {
      console.error("Error canceling appointment:", error)
    }
  }

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      const response = await appointmentService.completeAppointment(appointmentId)
      if (response.data) {
        fetchAppointments()
      }
    } catch (error) {
      console.error("Error completing appointment:", error)
    }
  }

  const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return "warning"
      case AppointmentStatus.CONFIRMED:
        return "primary"
      case AppointmentStatus.CANCELLED:
        return "danger"
      case AppointmentStatus.COMPLETED:
        return "success"
      default:
        return "default"
    }
  }

  const getAppointmentTypeLabel = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.VIRTUAL:
        return "Virtual Meeting"
      case AppointmentType.IN_PERSON:
        return "In-Person Meeting"
      case AppointmentType.PHONE_CALL:
        return "Phone Call"
      default:
        return type
    }
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek

    // Calculate total days to show (previous month days + current month days)
    const totalDays = daysFromPrevMonth + lastDay.getDate()

    // Calculate rows needed (7 days per row)
    const rows = Math.ceil(totalDays / 7)

    // Generate calendar days
    const days = []
    let dayCounter = 1 - daysFromPrevMonth

    for (let i = 0; i < rows * 7; i++) {
      const date = new Date(year, month, dayCounter)
      const isCurrentMonth = date.getMonth() === month
      const isToday = new Date().toDateString() === date.toDateString()
      const isSelected = selectedDate.toDateString() === date.toDateString()

      // Get appointments for this day
      const dayAppointments = appointments.filter(
        (appointment) => new Date(appointment.date).toDateString() === date.toDateString(),
      )

      days.push({
        date,
        dayOfMonth: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        appointments: dayAppointments,
      })

      dayCounter++
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex gap-2">
          <Button variant={isCalendarView ? "primary" : "outline"} onClick={() => setIsCalendarView(true)}>
            Calendar View
          </Button>
          <Button variant={!isCalendarView ? "primary" : "outline"} onClick={() => setIsCalendarView(false)}>
            List View
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Appointment</Button>
        </div>
      </div>

      {isCalendarView ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const prevMonth = new Date(currentMonth)
                  prevMonth.setMonth(prevMonth.getMonth() - 1)
                  setCurrentMonth(prevMonth)
                }}
              >
                Previous
              </Button>
              <CardTitle>{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</CardTitle>
              <Button
                variant="outline"
                onClick={() => {
                  const nextMonth = new Date(currentMonth)
                  nextMonth.setMonth(nextMonth.getMonth() + 1)
                  setCurrentMonth(nextMonth)
                }}
              >
                Next
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center font-medium">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-24 rounded-md border p-1 ${
                    day.isCurrentMonth ? "bg-card" : "bg-muted/50"
                  } ${day.isToday ? "border-primary" : ""} ${day.isSelected ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className="flex justify-between">
                    <span className={`text-sm font-medium ${day.isCurrentMonth ? "" : "text-muted-foreground"}`}>
                      {day.dayOfMonth}
                    </span>
                    {day.appointments.length > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {day.appointments.length}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {day.appointments.slice(0, 2).map((appointment) => (
                      <div key={appointment.id} className="truncate rounded-sm bg-primary/10 px-1 py-0.5 text-xs">
                        {appointment.startTime} - {appointment.title}
                      </div>
                    ))}
                    {day.appointments.length > 2 && (
                      <div className="text-xs text-muted-foreground">+{day.appointments.length - 2} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{appointment.title}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.startTime} -{" "}
                            {appointment.endTime}
                          </p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">{getAppointmentTypeLabel(appointment.type)}</p>
                        </div>
                      </div>
                      {/* <Badge variant={getStatusBadgeVariant(appointment.status)}> */}
                      <Badge>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                    {appointment.description && (
                      <div className="mt-2">
                        <p className="text-sm">{appointment.description}</p>
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">{userRole === UserRole.CLIENT ? "Lawyer" : "Client"}:</span>{" "}
                        {userRole === UserRole.CLIENT ? appointment.lawyerName : appointment.clientName}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      {appointment.status === AppointmentStatus.PENDING && (
                        <Button size="sm" onClick={() => handleConfirmAppointment(appointment.id)}>
                          Confirm
                        </Button>
                      )}
                      {(appointment.status === AppointmentStatus.PENDING ||
                        appointment.status === AppointmentStatus.CONFIRMED) && (
                        <Button size="sm" variant="outline" onClick={() => handleCancelAppointment(appointment.id)}>
                          Cancel
                        </Button>
                      )}
                      {appointment.status === AppointmentStatus.CONFIRMED && (
                        <Button size="sm" onClick={() => handleCompleteAppointment(appointment.id)}>
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No appointments found.</p>
            )}
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Appointment"
        size="lg"
      >
        <CreateAppointmentForm
          onSubmit={handleCreateAppointment}
          onCancel={() => setIsCreateModalOpen(false)}
          selectedDate={selectedDate}
        />
      </Modal>
    </div>
  )
}

export default Appointments

