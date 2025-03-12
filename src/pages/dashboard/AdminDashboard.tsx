"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Spinner from "../../components/ui/Spinner"
import { caseService } from "../../services/caseService"
import { type Case, CaseStatus } from "../../types/case"
import { type User, UserRole } from "../../types/auth"

// This would be in a userService.ts file in a real application
const mockUserService = {
  getUsers: async (): Promise<{ data?: User[] }> => {
    // Mock data for demonstration
    return {
      data: [
        {
          id: "1",
          email: "client@example.com",
          firstName: "John",
          lastName: "Doe",
          role: UserRole.CLIENT,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          email: "lawyer@example.com",
          firstName: "Jane",
          lastName: "Smith",
          role: UserRole.LAWYER,
          specialization: "Family Law",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          email: "client2@example.com",
          firstName: "Bob",
          lastName: "Johnson",
          role: UserRole.CLIENT,
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          email: "lawyer2@example.com",
          firstName: "Alice",
          lastName: "Williams",
          role: UserRole.LAWYER,
          specialization: "Criminal Law",
          createdAt: new Date().toISOString(),
        },
      ],
    }
  },
}

const AdminDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [cases, setCases] = useState<Case[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    totalClients: 0,
    totalLawyers: 0,
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch all cases
        const casesResponse = await caseService.getCases()
        if (casesResponse.data) {
          setCases(casesResponse.data)

          // Calculate case stats
          const activeCases = casesResponse.data.filter((c) => c.status !== CaseStatus.CLOSED).length

          setStats((prev) => ({
            ...prev,
            totalCases: casesResponse.data.length,
            activeCases,
          }))
        }

        // Fetch users (mock data for demonstration)
        const usersResponse = await mockUserService.getUsers()
        if (usersResponse.data) {
          setUsers(usersResponse.data)

          // Calculate user stats
          const totalClients = usersResponse.data.filter((u) => u.role === UserRole.CLIENT).length

          const totalLawyers = usersResponse.data.filter((u) => u.role === UserRole.LAWYER).length

          setStats((prev) => ({
            ...prev,
            totalClients,
            totalLawyers,
          }))
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
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCases}</div>
            <p className="text-xs text-muted-foreground">{stats.activeCases} active cases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Lawyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLawyers}</div>
            <p className="text-xs text-muted-foreground">Registered professionals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Case Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalCases > 0 ? Math.round(((stats.totalCases - stats.activeCases) / stats.totalCases) * 100) : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">{stats.totalCases - stats.activeCases} completed cases</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {cases.length > 0 ? (
            <div className="space-y-4">
              {cases.slice(0, 5).map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <h3 className="font-medium">{caseItem.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Client: {caseItem.clientName} • Status:{" "}
                      {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
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
            <p className="text-muted-foreground">No cases found.</p>
          )}

          <div className="mt-4">
            <Link to="/cases">
              <Button>View All Cases</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <h3 className="font-medium">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email} • Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      {user.specialization && ` • ${user.specialization}`}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No users found.</p>
          )}

          <div className="mt-4">
            <Button>Manage Users</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard

