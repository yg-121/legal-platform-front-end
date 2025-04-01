import { Calendar } from "lucide-react"

interface Appointment {
  id: number
  lawyer: string
  date: string
  status: string
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
}

export default function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Appointments</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your scheduled meetings with lawyers.</p>
        </div>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li key={appointment.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {appointment.lawyer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{appointment.lawyer}</div>
                      <div className="text-sm text-gray-500">{formatDate(appointment.date)}</div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">No upcoming appointments</li>
          )}
        </ul>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <a href="/client/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all appointments
          </a>
        </div>
      </div>
    </div>
  )
}

