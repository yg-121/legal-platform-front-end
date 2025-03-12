"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Spinner from "../../components/ui/Spinner"
import { caseService } from "../../services/caseService"
import { chatService } from "../../services/chatService"
import { appointmentService } from "../../services/appointmentService"
import { bidService } from "../../services/bidService"
import type { Case } from "../../types/case"
import type { Appointment } from "../../types/appointment"
import type { Bid } from "../../types/bid"

const LawyerDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [cases, setCases] = useState<Case[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [bids, setBids] = useState<Bid[]>([])
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch assigned cases
        const casesResponse = await caseService.getMyCases({ limit: 5 })
        if (casesResponse.data) {
          setCases(casesResponse.data)
        }

        // Fetch upcoming appointments
        const today = new Date().toISOString().split("T")[0]
        const thirtyDaysLater = new Date()
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)
        const endDate = thirtyDaysLater.toISOString().split("T")[0]

        const appointmentsResponse = await appointmentService.getAppointments(today, endDate, 1, 5)
        if (appointmentsResponse.data) {
          setAppointments(appointmentsResponse.data)
        }

        // Fetch my bids
        const bidsResponse = await bidService.getMyBids()
        if (bidsResponse.data) {
          setBids(bidsResponse.data)
        }

        // Fetch unread messages count
        const unreadResponse = await chatService.getUnreadCount()
        if (unreadResponse.data) {
          setUnreadMessages(unreadResponse.data.count)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lawyer Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases.filter((c) => c.status !== "closed").length}</div>
            <p className="text-xs text-muted-foreground">{cases.length} total cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bids.filter((b) => b.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">{bids.length} total bids</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Next:{" "}
              {appointments.length > 0
                ? new Date(appointments[0].date).toLocaleDateString()
                : "No upcoming appointments"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/chat" className="text-primary hover:underline">
                View messages
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Active Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {cases.length > 0 ? (
            <div className="space-y-4">
              {cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-medium">{caseItem.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                    </p>
                  </div>
                  <Link to={`/cases/${caseItem.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No active cases found.</p>
          )}

          <div className="mt-4">
            <Link to="/cases">
              <Button>View All Cases</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bids */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bids</CardTitle>
        </CardHeader>
        <CardContent>
          {bids.length > 0 ? (
            <div className="space-y-4">
              {bids.slice(0, 5).map((bid) => (
                <div key={bid.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium">Bid for Case #{bid.caseId}</h3>
                    <p className="text-sm text-muted-foreground">
                      Amount: ${bid.amount} • Status: {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </p>
                  </div>
                  <Link to={`/cases/${bid.caseId}`}>
                    <Button variant="outline" size="sm">
                      View Case
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No bids found.</p>
          )}

          <div className="mt-4">
            <Link to="/cases">
              <Button>Browse Available Cases</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-medium">{appointment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.startTime} with{" "}
                      {appointment.clientName}
                    </p>
                  </div>
                  <Link to={`/appointments`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming appointments.</p>
          )}

          <div className="mt-4">
            <Link to="/appointments">
              <Button>Manage Appointments</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LawyerDashboard

