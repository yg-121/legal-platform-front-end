"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {Briefcase,Calendar,MessageSquare,FileText,DollarSign,ArrowRight,Clock,Users,Award,TrendingUp,
BookOpen,} from "lucide-react"
import type { Case, Appointment, Article } from "../../types"
import PageLayout from "../../components/layouts/PageLayout"

interface LawyerHomeProps {
  userName: string
}

export default function LawyerHome({ userName }: LawyerHomeProps) {
  const [stats, setStats] = useState({
    activeCases: 0,
    upcomingAppointments: 0,
    unreadMessages: 0,
    pendingBids: 0,
    totalEarnings: 0,
    clientsHelped: 0,
  })
  const [availableCases, setAvailableCases] = useState<Case[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [legalUpdates, setLegalUpdates] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setStats({
        activeCases: 5,
        upcomingAppointments: 3,
        unreadMessages: 7,
        pendingBids: 2,
        totalEarnings: 45000,
        clientsHelped: 24,
      })

      const mockAvailableCases: Case[] = [
        {
          id: 201,
          title: "Business Registration and Licensing Assistance",
          client: "Addis Trading PLC",
          status: "open",
          lastUpdated: "2025-03-16",
          category: "Business Law",
          description:
            "Need assistance with registering a new import/export business in Addis Ababa and obtaining necessary licenses.",
        },
        {
          id: 202,
          title: "Employment Contract Review",
          client: "Ethiopian Tech Startup",
          status: "open",
          lastUpdated: "2025-03-15",
          category: "Labor Law",
          description:
            "Need a lawyer to review employment contracts for our growing tech company to ensure compliance with Ethiopian labor laws.",
        },
        {
          id: 203,
          title: "Property Dispute Resolution",
          client: "Bekele Family",
          status: "open",
          lastUpdated: "2025-03-14",
          category: "Property Law",
          description:
            "Family dispute over inherited property in Bahir Dar. Need legal representation to resolve ownership claims.",
        },
        {
          id: 204,
          title: "Trademark Registration",
          client: "Habesha Designs",
          status: "open",
          lastUpdated: "2025-03-13",
          category: "Intellectual Property",
          description:
            "Local clothing brand seeking trademark registration and protection for their unique Ethiopian-inspired designs.",
        },
      ]

      const mockAppointments: Appointment[] = [
        {
          id: 1,
          client: "Abebe Bekele",
          date: "2025-03-20T10:00:00",
          status: "confirmed",
        },
        {
          id: 2,
          client: "Tigist Mengistu",
          date: "2025-03-22T14:30:00",
          status: "confirmed",
        },
        {
          id: 3,
          client: "Dawit Haile",
          date: "2025-03-25T11:00:00",
          status: "pending",
        },
      ]

      const mockLegalUpdates: Article[] = [
        {
          id: 1,
          title: "New Business Registration Regulations in Ethiopia",
          excerpt:
            "Recent changes to business registration procedures and requirements that all lawyers should be aware of.",
          author: "Ethiopian Legal Review",
          date: "2025-03-15",
          category: "Business Law",
          imageUrl: "/placeholder.svg?height=200&width=300",
          readTime: "8 min read",
        },
        {
          id: 2,
          title: "Updates to Ethiopian Labor Law: What Lawyers Need to Know",
          excerpt:
            "Recent amendments to labor regulations affecting employment contracts, working hours, and employee benefits.",
          author: "Ethiopian Bar Association",
          date: "2025-03-10",
          category: "Labor Law",
          imageUrl: "/placeholder.svg?height=200&width=300",
          readTime: "10 min read",
        },
        {
          id: 3,
          title: "Ethiopian Intellectual Property Office: New Filing Procedures",
          excerpt:
            "Changes to trademark and patent filing procedures that will affect how IP lawyers submit applications.",
          author: "IP Law Journal",
          date: "2025-03-05",
          category: "Intellectual Property",
          imageUrl: "/placeholder.svg?height=200&width=300",
          readTime: "6 min read",
        },
      ]

      setAvailableCases(mockAvailableCases)
      setUpcomingAppointments(mockAppointments)
      setLegalUpdates(mockLegalUpdates)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const formatSimpleDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <PageLayout userRole="lawyer" userName={userName}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout userRole="lawyer" userName={userName} unreadNotifications={5}>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {userName}!</h1>
              <p className="mt-2 text-blue-100">
                Here's an overview of your cases, appointments, and available opportunities.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                to="/lawyer/profile"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
              >
                View Profile
              </Link>
              <Link
                to="/lawyer/cases/available"
                className="inline-flex items-center px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
              >
                Browse Cases
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-3 mb-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Active Cases</p>
              <h3 className="text-xl font-semibold text-gray-900">{stats.activeCases}</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Appointments</p>
              <h3 className="text-xl font-semibold text-gray-900">{stats.upcomingAppointments}</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-yellow-100 p-3 mb-4">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-500">Messages</p>
              <h3 className="text-xl font-semibold text-gray-900">{stats.unreadMessages}</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-purple-100 p-3 mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-500">Pending Bids</p>
              <h3 className="text-xl font-semibold text-gray-900">{stats.pendingBids}</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-emerald-100 p-3 mb-4">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm text-gray-500">Earnings</p>
              <h3 className="text-xl font-semibold text-gray-900">{stats.totalEarnings.toLocaleString()} ETB</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-indigo-100 p-3 mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-sm text-gray-500">Clients Helped</p>
              <h3 className="text-xl font-semibold text-gray-900">{stats.clientsHelped}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Cases */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Available Cases in Ethiopia</h2>
                <Link
                  to="/lawyer/cases/available"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="divide-y divide-gray-200">
                {availableCases.map((caseItem) => (
                  <div key={caseItem.id} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <h3 className="text-lg font-medium text-gray-900">{caseItem.title}</h3>
                          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {caseItem.category}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Client: {caseItem.client}
                        </div>

                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{caseItem.description}</p>

                        <div className="mt-2 text-xs text-gray-500">
                          Posted: {formatSimpleDate(caseItem.lastUpdated)}
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6">
                        <Link
                          to={`/lawyer/cases/available/${caseItem.id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Updates */}
            <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Ethiopian Legal Updates</h2>
                <Link
                  to="/lawyer/resources"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="divide-y divide-gray-200">
                {legalUpdates.map((article) => (
                  <div key={article.id} className="p-6 hover:bg-gray-50">
                    <div className="sm:flex sm:items-start sm:justify-between">
                      <div className="sm:flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <BookOpen className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {article.category} • {article.readTime}
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          {formatSimpleDate(article.date)} • {article.author}
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6">
                        <Link
                          to={`/lawyer/resources/${article.id}`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
                <Link
                  to="/lawyer/appointments"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="divide-y divide-gray-200">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.client}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {formatDate(appointment.date)}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>No upcoming appointments</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4">
                <Link
                  to="/lawyer/appointments/availability"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Availability
                </Link>
              </div>
            </div>

            {/* Professional Development */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Professional Development</h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Ethiopian Bar Association</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Stay current with Ethiopian legal requirements and earn continuing education credits.
                  </p>
                  <Link
                    to="/lawyer/professional-development"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Opportunities
                  </Link>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-gray-900">Improve Your Profile</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Complete your profile to attract more clients and increase your visibility.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Profile Completion: 75%</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/lawyer/messages"
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-900">Messages</span>
                  </Link>

                  <Link
                    to="/lawyer/cases"
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Briefcase className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-900">My Cases</span>
                  </Link>

                  <Link
                    to="/lawyer/appointments"
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-900">Calendar</span>
                  </Link>

                  <Link
                    to="/lawyer/earnings"
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-900">Earnings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

